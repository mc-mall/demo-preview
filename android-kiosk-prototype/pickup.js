'use strict';

const checkoutPickupMethods = {
  store: {
    label: '店内自提',
    description: '付款后在店内等候领取校服。',
    customerNote: '请留在店内等候，校服配齐后凭取货号到取货台领取。',
    warehouseNote: '校服配齐后扫描本联条码，通知顾客到店内取货台领取。',
  },
  locker: {
    label: '暂存智能柜',
    description: '店员存柜后，可自行安排时间回店取货。',
    customerNote: '请保留客户联。收到存柜通知后，可回店到自提柜的「取货」入口，扫描客户联条码开柜。',
    warehouseNote: '将商品存入门店自提柜后，再扫描本联条码确认存柜。',
  },
  partner: {
    label: '窝蜂配送',
    description: '配送到所选自提站点，到站后自行领取。',
    customerNote: '请保留小票，等待到站通知。到站后可自行安排时间前往所选窝蜂站点取货。',
    warehouseNote: '按小票站点交接给窝蜂配送，交接后扫描本联条码确认。',
  },
};

const checkoutPickupStations = {
  'station-a': '窝蜂示例站点 A',
  'station-b': '窝蜂示例站点 B',
  'station-c': '窝蜂示例站点 C',
};

function normalizeCheckoutPickup(choice) {
  if (choice?.method === 'locker') return { method: 'locker' };
  if (choice?.method === 'partner' && Object.hasOwn(checkoutPickupStations, choice.station)) {
    return { method: 'partner', station: choice.station };
  }
  return { method: 'store' };
}

function checkoutPickupLabel(choice) {
  const name = checkoutPickupMethods[choice.method].label;
  return choice.station ? `${name} · ${checkoutPickupStations[choice.station]}` : name;
}

function needsCheckoutPicking(item, choice) {
  return choice.method !== 'store' || item.kind === 'uniform';
}

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

function createPickupDesk(screen, locker) {
  const prefix = 'mc-mall.android-kiosk.pickup.v1.';
  const volatile = new Map();

  function readRecord(number) {
    if (!isPickupNumber(number)) return null;
    if (volatile.has(number)) return volatile.get(number);
    try {
      const record = JSON.parse(localStorage.getItem(prefix + number));
      if (record?.number === number && typeof record.orderId === 'string'
        && Number.isSafeInteger(record.count) && record.count >= 0 && Number.isFinite(record.readyAt)) {
        return { ...record, choice: normalizeCheckoutPickup(record.choice) };
      }
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

  function register(orderId, count, choice, previousNumber) {
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
    while (existing.has(number) || locker.reservedCodes.has(number)) {
      next = (next + 1) % 1000000;
      number = String(next).padStart(6, '0');
    }
    saveRecord({ number, orderId, count, choice, readyAt: 0 });
    return number;
  }

  function pickupStatus(record) {
    if (!record) return ['missing', '未找到取货号', '请核对客户联上的六位数字。'];
    if (!record.count) return ['no-pick', '无需等待拣货', '本单商品可随身带走。'];

    const { method, station } = record.choice;
    if (method === 'partner') {
      const destination = checkoutPickupStations[station];
      if (record.readyAt) return ['ready', '已到站，可以取货', `可自行安排时间到${destination}领取。`];
      if (record.handedOffAt) return ['in-transit', '已交窝蜂配送', `正在配送到${destination}，请等待到站通知。`];
      return ['waiting', '待拣货及配送交接', `店员配齐后会交给窝蜂，配送到${destination}。`];
    }
    if (method === 'locker') {
      const placement = locker.placement(record.orderId);
      if (placement === 'collected') return ['collected', '已在智能柜取货', '本单智能柜取货已完成。'];
      if (placement) return ['ready', '已存入智能柜，可以取货', '请到门店自提柜选择「取货」，扫描客户联条码。'];
      if (record.readyAt) return ['waiting', '待确认智能柜柜位', '请等店员确认柜位后再扫码取货。'];
      return ['waiting', '待拣货及存柜', '店员配齐并存入门店智能柜后，此处会显示存柜通知。'];
    }
    return record.readyAt
      ? ['ready', '拣货完成，可以取货', '请到门店取货台，出示客户联或取货号。']
      : ['waiting', '校服待拣货', '请在店内等候，拣货完成后此处会显示取货通知。'];
  }

  function renderStatus(target) {
    const record = readRecord(target.dataset.pickupStatus);
    const [state, title, detail] = pickupStatus(record);
    const label = record ? checkoutPickupLabel(record.choice) : '';
    const content = `<strong>${title}</strong>${label ? `<span>${label}</span>` : ''}<span>${detail}</span>`;
    if (target.innerHTML === content) return;
    target.dataset.state = state;
    target.innerHTML = content;
  }

  function refreshStatus() {
    screen.querySelectorAll('[data-pickup-status]').forEach((target) => {
      if (target.dataset.pickupStatus) renderStatus(target);
    });
  }

  function queue() {
    const unready = Array.from(records().values()).filter((record) => record.count && (record.choice.method === 'locker'
      ? !locker.placement(record.orderId) : !record.readyAt));
    const waiting = unready.filter((record) => !record.handedOffAt);
    const inTransit = unready.filter((record) => record.choice.method === 'partner' && record.handedOffAt);
    const buttons = { store: '模拟扫码', locker: '模拟存柜', partner: '模拟交窝蜂' };
    return `${waiting.length ? `<ul class="pickup-queue">${waiting.map((record) => `<li>
      <span><strong>${record.number}</strong><small>${checkoutPickupLabel(record.choice)} · ${record.readyAt ? '待确认柜位' : `待拣 ${record.count} 件`}</small></span>
      <button type="button" class="secondary" data-simulate-pickup="${record.number}">${buttons[record.choice.method]} <span class="sr-only">${record.number}</span></button>
    </li>`).join('')}</ul>` : '<p class="description">暂无待拣订单。</p>'}
    ${inTransit.length ? `<section class="warehouse-queue" aria-label="窝蜂配送中">
      <h2>窝蜂配送中</h2>
      <ul class="pickup-queue">${inTransit.map((record) => `<li>
        <span><strong>${record.number}</strong><small>${checkoutPickupStations[record.choice.station]}</small></span>
        <button type="button" class="secondary" data-simulate-arrival="${record.number}">模拟站点到货 <span class="sr-only">${record.number}</span></button>
      </li>`).join('')}</ul>
    </section>` : ''}`;
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
        <button class="primary" type="submit">${warehouse ? '确认拣货交接' : '查询进度'}</button>
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

  async function scanWarehouse(number, form) {
    const result = screen.querySelector('[data-pickup-update]');
    const record = readRecord(number);
    if (!record || !record.count) {
      result.textContent = record ? `取货号 ${number} 无需仓库拣货。` : `未找到取货号 ${number}，请核对仓库联。`;
      return;
    }
    const { method } = record.choice;
    if (method === 'locker') {
      const placement = await locker.store(record.orderId);
      if (!form.isConnected) return;
      if (!placement) {
        result.textContent = '暂无空置柜门，请释放柜位后再确认存柜。';
        return;
      }
      result.textContent = placement === 'collected'
        ? `取货号 ${number} 已在智能柜取货。`
        : `取货号 ${number} 已存入智能柜 ${placement}，可凭客户联扫码取货（演示）。`;
      form.reset();
      refreshQueue();
      return;
    }
    if (record.readyAt) {
      result.textContent = `取货号 ${number} 已通知取货。`;
      return;
    }
    if (record.handedOffAt) {
      result.textContent = `取货号 ${number} 已交给窝蜂，请等待站点到货。`;
      return;
    }

    if (method === 'partner') {
      saveRecord({ ...record, handedOffAt: Date.now() });
      result.textContent = `取货号 ${number} 已交窝蜂配送（演示）。`;
    } else {
      saveRecord({ ...record, readyAt: Date.now() });
      result.textContent = `取货号 ${number} 拣货完成，已更新客户取货通知（演示）。`;
    }
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
    const arrival = event.target.closest('[data-simulate-arrival]');
    if (arrival) {
      const record = readRecord(arrival.dataset.simulateArrival);
      if (record?.choice.method !== 'partner' || !record.handedOffAt || record.readyAt) return;
      saveRecord({ ...record, readyAt: Date.now() });
      screen.querySelector('[data-pickup-update]').textContent = `取货号 ${record.number} 已到站，已更新客户取货通知（演示）。`;
      refreshQueue();
      screen.querySelector('#pickup-number').focus({ preventScroll: true });
      return;
    }
    const button = event.target.closest('[data-simulate-pickup]');
    if (!button) return;
    const form = screen.querySelector('[data-pickup-form="warehouse"]');
    form.querySelector('input').value = button.dataset.simulatePickup;
    form.requestSubmit();
  });

  window.addEventListener('storage', (event) => {
    if (event.key && !event.key.startsWith(prefix) && event.key !== locker.storageKey) return;
    refreshStatus();
    refreshQueue();
  });

  return { register, readRecord, refreshStatus, warehouseView, statusView };
}
