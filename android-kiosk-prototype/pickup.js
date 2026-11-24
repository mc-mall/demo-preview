'use strict';

function isPickupNumber(value) {
  return typeof value === 'string' && /^\d{6}$/.test(value);
}

// Code 128 symbol widths, from 0 through the stop symbol. Each pattern starts with a bar.
const code128Widths = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112',
];

function pickupBarcode(number) {
  if (!isPickupNumber(number)) return '';
  const startC = 105;
  const stop = 106;
  const digits = number.match(/\d{2}/g).map(Number);
  const checksum = digits.reduce((sum, value, index) => sum + value * (index + 1), startC) % 103;
  const quietZone = 10;
  let x = quietZone;
  const bars = [];
  for (const symbol of [startC, ...digits, checksum, stop]) {
    Array.from(code128Widths[symbol], Number).forEach((width, index) => {
      if (index % 2 === 0) bars.push(`<rect x="${x}" width="${width}" height="24"/>`);
      x += width;
    });
  }
  return `<svg class="pickup-barcode" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x + quietZone} 24" role="img" aria-label="取货号 ${number} 条码" shape-rendering="crispEdges">
    <rect width="100%" height="100%" fill="white"/><g fill="black">${bars.join('')}</g>
  </svg>`;
}

function createPickupDesk(screen) {
  const prefix = 'mc-mall.android-kiosk.pickup.v1.';
  const volatile = new Map();

  function readRecord(number) {
    if (!isPickupNumber(number)) return null;
    if (volatile.has(number)) return volatile.get(number);
    try {
      const record = JSON.parse(localStorage.getItem(prefix + number));
      if (record?.number === number && typeof record.orderId === 'string'
        && Number.isSafeInteger(record.count) && record.count >= 0 && Number.isFinite(record.readyAt)) return record;
    } catch {
      // The current tab can still demonstrate fulfillment without storage.
    }
    return null;
  }

  function records() {
    const entries = new Map(volatile);
    try {
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (!key?.startsWith(prefix)) continue;
        const record = readRecord(key.slice(prefix.length));
        if (record) entries.set(record.number, record);
      }
    } catch {
      // In-memory orders remain available.
    }
    return entries;
  }

  function saveRecord(record) {
    try {
      localStorage.setItem(prefix + record.number, JSON.stringify(record));
      volatile.delete(record.number);
    } catch {
      volatile.set(record.number, record);
    }
  }

  function register(orderId, count, previousNumber) {
    const previous = readRecord(previousNumber);
    if (previous?.orderId === orderId) return previous.number;
    const existing = records();
    for (const record of existing.values()) {
      if (record.orderId === orderId) return record.number;
    }
    let next = isPickupNumber(previousNumber)
      ? Number(previousNumber)
      : crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
    let number = String(next).padStart(6, '0');
    while (existing.has(number)) {
      next = (next + 1) % 1000000;
      number = String(next).padStart(6, '0');
    }
    saveRecord({ number, orderId, count, readyAt: 0 });
    return number;
  }

  function renderStatus(target) {
    const record = readRecord(target.dataset.pickupStatus);
    const state = !record ? 'missing' : record.readyAt ? 'ready' : record.count ? 'waiting' : 'no-pick';
    const messages = {
      missing: ['未找到取货号', '请核对客户联上的六位数字。'],
      ready: ['拣货完成，可以取货', '请到门店取货台，出示客户联或取货号。'],
      waiting: ['校服待拣货', '拣货完成后，此处会显示取货通知。'],
      'no-pick': ['无需等待拣货', '本单商品可随身带走。'],
    };
    if (target.dataset.state === state) return;
    target.dataset.state = state;
    const [title, detail] = messages[state];
    target.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
  }

  function refreshStatus() {
    screen.querySelectorAll('[data-pickup-status]').forEach((target) => {
      if (target.dataset.pickupStatus) renderStatus(target);
    });
  }

  function queue() {
    const waiting = Array.from(records().values()).filter((record) => record.count && !record.readyAt);
    return waiting.length ? `<ul class="pickup-queue">${waiting.map((record) => `<li>
      <span><strong>${record.number}</strong><small>待拣校服 ${record.count} 件</small></span>
      <button type="button" class="secondary" data-simulate-pickup="${record.number}" aria-label="模拟扫码 ${record.number}">模拟扫码</button>
    </li>`).join('')}</ul>` : '<p class="description">暂无待拣订单。</p>';
  }

  function refreshQueue() {
    const target = screen.querySelector('[data-pickup-queue]');
    if (target) target.innerHTML = queue();
  }

  function inputForm(kind) {
    const warehouse = kind === 'warehouse';
    return `<form data-pickup-form="${kind}" novalidate>
      <label for="pickup-number">${warehouse ? '扫描仓库联条码或输入取货号' : '客户联取货号'}</label>
      <div class="scan-entry">
        <input id="pickup-number" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" placeholder="六位数字" aria-describedby="pickup-error" data-checkout-focus>
        <button class="primary" type="submit">${warehouse ? '确认拣货并通知' : '查询进度'}</button>
      </div>
      <p id="pickup-error" class="form-error" role="alert"></p>
    </form>`;
  }

  function warehouseView(heading) {
    return `<section class="flow wide" aria-labelledby="page-title">
      ${heading}
      <div class="panel order-panel">
        ${inputForm('warehouse')}
        <p class="pickup-update" role="status" data-pickup-update></p>
        <section class="warehouse-queue" aria-labelledby="pending-picking-title">
          <h2 id="pending-picking-title">待拣货</h2>
          <div data-pickup-queue>${queue()}</div>
        </section>
      </div>
    </section>`;
  }

  function statusView(heading) {
    return `<section class="flow" aria-labelledby="page-title">
      ${heading}
      <div class="panel order-panel">
        ${inputForm('customer')}
        <div class="pickup-status" role="status" data-pickup-status=""></div>
      </div>
    </section>`;
  }

  function scanWarehouse(number, form) {
    const result = screen.querySelector('[data-pickup-update]');
    const record = readRecord(number);
    if (!record || !record.count) {
      result.textContent = record ? `取货号 ${number} 无需仓库拣货。` : `未找到取货号 ${number}，请核对仓库联。`;
      return;
    }
    if (record.readyAt) {
      result.textContent = `取货号 ${number} 已通知取货。`;
      return;
    }
    saveRecord({ ...record, readyAt: Date.now() });
    result.textContent = `取货号 ${number} 拣货完成，已更新客户取货通知（演示）。`;
    form.reset();
    refreshQueue();
  }

  screen.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.matches('[data-pickup-form]')) return;
    event.preventDefault();
    const input = form.querySelector('input');
    const error = form.querySelector('#pickup-error');
    const number = input.value.trim();
    if (!isPickupNumber(number)) {
      const status = screen.querySelector('[data-pickup-status], [data-pickup-update]');
      status.replaceChildren();
      delete status.dataset.pickupStatus;
      delete status.dataset.state;
      error.textContent = '请输入或扫描六位数字取货号。';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      input.select();
      return;
    }
    error.textContent = '';
    input.removeAttribute('aria-invalid');
    if (form.dataset.pickupForm === 'warehouse') {
      scanWarehouse(number, form);
      input.focus({ preventScroll: true });
    } else {
      const status = screen.querySelector('[data-pickup-status]');
      status.dataset.pickupStatus = number;
      renderStatus(status);
    }
  });

  screen.addEventListener('click', (event) => {
    const button = event.target.closest('[data-simulate-pickup]');
    if (!button) return;
    const form = screen.querySelector('[data-pickup-form="warehouse"]');
    form.querySelector('input').value = button.dataset.simulatePickup;
    form.requestSubmit();
  });

  window.addEventListener('storage', (event) => {
    if (event.key && !event.key.startsWith(prefix)) return;
    refreshStatus();
    refreshQueue();
  });

  return { register, refreshStatus, warehouseView, statusView };
}
