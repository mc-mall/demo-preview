'use strict';

const STORAGE_KEY = 'mc-mall.android-kiosk.v1';
const PICKUP_RETURN_SECONDS = 30;
const doors = Array.from({ length: 12 }, (_, index) => `A${String(index + 1).padStart(2, '0')}`);

const orders = [
  { id: 'MC26000001', barcode: '26000001', pickupCode: '481625' },
  { id: 'MC26000002', barcode: '26000002', pickupCode: '682104', initialDoor: 'A03' },
  { id: 'MC26000003', barcode: '26000003', pickupCode: '519703' },
  { id: 'MC26000004', barcode: '26000004', pickupCode: '761308', initialDoor: 'A08' },
  { id: 'MC26000005', barcode: '26000005', pickupCode: '905216', initialDoor: 'A11' },
];

const screen = document.querySelector('#screen');
const announcement = document.querySelector('#announcement');
const modeButtons = document.querySelectorAll('[data-mode]');
const resetButton = document.querySelector('#reset-demo');
const demoStatus = document.querySelector('#demo-status');
let terminalStorageUnavailable = false;
let terminal = loadTerminal();
let mode = 'locker';
let page = 'home';
let order = null;
let selectedDoor = '';
let countdownTimer;
const checkout = createCheckout(screen, render, {
  storageKey: STORAGE_KEY,
  reservedCodes: new Set(orders.map((entry) => entry.pickupCode)),
  placement: (orderId) => loadTerminal(terminal).placements[orderId],
  store: storeCheckoutOrder,
});

function initialTerminal() {
  return {
    placements: Object.fromEntries(orders.map((entry) => [entry.id, entry.initialDoor || ''])),
    activeDoor: null,
    returnAt: 0,
  };
}

function loadTerminal(fallback = initialTerminal()) {
  if (terminalStorageUnavailable) return fallback;
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || initialTerminal();
  } catch {
    return fallback;
  }
}

function saveTerminal() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(terminal));
  } catch {
    terminalStorageUnavailable = true;
  }
}

function goHome(message = '') {
  clearInterval(countdownTimer);
  if (page === 'pickup-done' && terminal.returnAt) {
    terminal.returnAt = 0;
    saveTerminal();
  }
  page = 'home';
  order = null;
  selectedDoor = '';
  render(message);
}

function freeDoors() {
  const inUse = new Set(Object.values(terminal.placements));
  if (terminal.activeDoor) inUse.add(terminal.activeDoor.door);
  return doors.filter((door) => !inUse.has(door));
}

function withLatestTerminal(operation) {
  const run = () => {
    terminal = loadTerminal(terminal);
    return operation();
  };
  return navigator.locks ? navigator.locks.request(STORAGE_KEY, run) : run();
}

function storeCheckoutOrder(orderId) {
  return withLatestTerminal(() => {
    const placement = terminal.placements[orderId];
    if (placement) return placement;
    const [door] = freeDoors();
    if (!door) return '';
    terminal.placements[orderId] = door;
    saveTerminal();
    return door;
  });
}

function pageHeading(label, title, description = '', canGoBack = true) {
  return `<header class="flow-heading">
    ${canGoBack ? '<button class="back text-button" type="button" data-action="back"><span aria-hidden="true">←</span> 返回</button>' : ''}
    <p class="flow-label">${label}</p>
    <h1 id="page-title" tabindex="-1">${title}</h1>
    ${description ? `<p class="description">${description}</p>` : ''}
  </header>`;
}

function renderHome(message) {
  return `<section class="home" aria-labelledby="page-title">
    <div class="home-heading">
      <h1 id="page-title" tabindex="-1">门店自提柜</h1>
      <p class="description">请选择要办理的业务</p>
    </div>
    ${message ? `<p class="home-notice"><span aria-hidden="true">✓</span> ${message}</p>` : ''}
    <div class="home-actions">
      <button class="action-card deposit-card" type="button" data-action="deposit">
        <span class="card-icon" aria-hidden="true"><i class="locker-icon"></i></span>
        <span class="card-copy"><strong>存货</strong><small>店员扫码存放衣物</small></span><span class="card-arrow" aria-hidden="true">→</span>
      </button>
      <button class="action-card pickup-card" type="button" data-action="pickup">
        <span class="card-icon" aria-hidden="true"><i class="barcode-icon"></i></span>
        <span class="card-copy"><strong>取货</strong><small>输入自提码或扫码取货</small></span><span class="card-arrow" aria-hidden="true">→</span>
      </button>
    </div>
  </section>`;
}

function renderOrderForm() {
  const depositing = page === 'deposit-scan';
  const sample = depositing
    ? orders.find((entry) => terminal.placements[entry.id] === '')
    : orders.find((entry) => doors.includes(terminal.placements[entry.id]));
  return `<section class="flow" aria-labelledby="page-title">
    ${depositing
      ? pageHeading('存货 · 1 / 3', '扫描订单小票', '将小票条形码对准扫码器，也可手动录入条形码。')
      : pageHeading('取货', '验证订单', '扫描客户联取货条码或订单条形码，也可输入 6 位取货号。')}
    <div class="panel order-panel">
      ${depositing ? '<div class="scan-graphic" aria-hidden="true"><i class="barcode-icon"></i></div>' : ''}
      <form id="order-form" novalidate>
        <label for="order-value">${depositing ? '订单条形码' : '小票或订单条形码'}</label>
        <div class="${depositing ? '' : 'pickup-scan-input'}">
          ${depositing ? '' : '<i class="barcode-icon" aria-hidden="true"></i>'}
          <input id="order-value" type="text" inputmode="${depositing ? 'numeric' : 'none'}" maxlength="32" autocomplete="off" spellcheck="false" aria-describedby="form-error" placeholder="${depositing ? '扫描或输入条形码' : '等待扫码'}">
        </div>
        <p id="form-error" class="form-error" role="alert"></p>
        ${depositing ? '' : `<div class="pickup-code-entry">
          <label for="pickup-code">或输入 6 位取货号 / 自提码</label>
          <input id="pickup-code" type="text" readonly tabindex="-1" placeholder="使用下方数字键盘" aria-describedby="form-error">
        </div>
        <div class="keypad" role="group" aria-label="数字键盘">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => `<button type="button" data-action="digit" data-digit="${digit}">${digit}</button>`).join('')}
          <button type="button" data-action="clear">清空</button><button type="button" data-action="digit" data-digit="0">0</button><button type="button" data-action="delete" aria-label="删除一位">⌫</button>
        </div>`}
        <button class="primary full" type="submit">${depositing ? '验证订单' : '确认取货'}</button>
        ${sample ? `<div class="order-samples">
          ${depositing ? '' : `<button class="text-button" type="button" data-action="sample-code" data-value="${sample.pickupCode}">填入演示码 ${sample.pickupCode}</button>`}
          <button class="text-button" type="button" data-action="sample" data-value="${sample.barcode}">模拟扫码 ${sample.barcode}</button>
        </div>` : ''}
      </form>
    </div>
  </section>`;
}

function renderDoorSelection() {
  const available = freeDoors();
  return `<section class="flow wide" aria-labelledby="page-title">
    ${pageHeading('存货 · 2 / 3', '选择空置柜门', `订单 ${order.id} · ${available.length} 个空置柜门`)}
    <div class="panel">
      ${available.length ? '' : '<p class="form-error">暂时没有空置柜门，请稍后重试。</p>'}
      <div class="door-grid" role="group" aria-label="柜门编号">
        ${doors.map((door) => `<button class="door" type="button" data-action="select-door" data-door="${door}" aria-pressed="${door === selectedDoor}" ${available.includes(door) ? '' : 'disabled'}>
          <strong>${door}</strong><small>${available.includes(door) ? '空置' : '已占用'}</small></button>`).join('')}
      </div>
      <button class="primary full" type="button" data-action="open-door" ${selectedDoor ? '' : 'disabled'}>${selectedDoor ? `打开 ${selectedDoor} 柜门` : '打开柜门'}</button>
    </div>
  </section>`;
}

function renderOpenDoor() {
  const { operation, door } = terminal.activeDoor;
  const depositing = operation === 'deposit';
  return `<section class="flow" aria-labelledby="page-title">
    ${pageHeading(depositing ? '存货 · 3 / 3' : '取货', '柜门已开启', '请到对应柜门办理。', false)}
    <div class="panel door-panel">
      <p class="flow-label">柜门编号</p>
      <strong class="door-number">${door}</strong>
      <p>${depositing ? '放入衣物并关闭柜门，然后确认完成。' : '取出衣物并关闭柜门，然后确认完成。'}</p>
      <button class="primary full" type="button" data-action="complete">${depositing ? '已关门，完成存货' : '完成取货'}</button>
    </div>
  </section>`;
}

function renderPickupDone() {
  return `<section class="flow" aria-labelledby="page-title">
    ${pageHeading('取货', '取货完成', '', false)}
    <div class="panel done-panel">
      <span class="success-mark" aria-hidden="true">✓</span>
      <p><strong id="remaining">${remainingSeconds()}</strong> 秒后自动返回首页</p>
      <button class="primary full" type="button" data-action="home">立即返回首页</button>
    </div>
  </section>`;
}

function render(message = '', { preserveScroll = false } = {}) {
  const transactionInProgress = mode === 'locker' ? ['door-open', 'pickup-done'].includes(page) : checkout.isPaymentPending();
  modeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
    button.disabled = transactionInProgress;
  });
  resetButton.disabled = transactionInProgress;
  demoStatus.textContent = mode === 'checkout' ? '演示模式 · 扫码与支付模拟' : '演示模式 · 扫码与柜门模拟';

  if (mode === 'checkout') {
    checkout.render();
  } else {
    switch (page) {
      case 'deposit-scan':
      case 'pickup':
        screen.innerHTML = renderOrderForm();
        break;
      case 'door-selection':
        screen.innerHTML = renderDoorSelection();
        break;
      case 'door-open':
        screen.innerHTML = renderOpenDoor();
        break;
      case 'pickup-done':
        screen.innerHTML = renderPickupDone();
        break;
      default:
        screen.innerHTML = renderHome(message);
    }
  }

  announcement.textContent = message;
  (screen.querySelector('#order-value, [data-checkout-focus]') || screen.querySelector('#page-title')).focus({ preventScroll: preserveScroll });
}

function showError(message, field) {
  const scanner = document.querySelector('#order-value');
  document.querySelector('#form-error').textContent = message;
  field.setAttribute('aria-invalid', 'true');
  scanner.focus();
  scanner.select();
}

function clearError() {
  document.querySelector('#form-error').textContent = '';
  document.querySelector('#order-value').removeAttribute('aria-invalid');
  document.querySelector('#pickup-code')?.removeAttribute('aria-invalid');
}

function validateOrder() {
  const depositing = page === 'deposit-scan';
  const scanner = document.querySelector('#order-value');
  const keypad = document.querySelector('#pickup-code');
  const scanned = scanner.value.trim();
  const field = !scanned && keypad ? keypad : scanner;
  const credential = field.value.trim();
  const usingCode = field === keypad || (!depositing && /^\d{6}$/.test(credential));

  if (usingCode && !/^\d{6}$/.test(credential)) {
    showError('请输入完整的 6 位自提码。', field);
    return;
  }
  if (!credential) {
    showError('请扫描或输入订单条形码。', field);
    return;
  }

  const sampleOrder = orders.find((entry) => field === scanner && entry.barcode === credential)
    || (usingCode && orders.find((entry) => entry.pickupCode === credential));
  const receipt = usingCode ? checkout.findPickup(credential) : null;
  const useReceipt = receipt && (!sampleOrder || (field === scanner && receipt.choice.method === 'locker'));
  if (useReceipt && receipt.choice.method !== 'locker') {
    showError(`该订单选择了${checkoutPickupMethods[receipt.choice.method].label}，请按小票说明取货。`, field);
    return;
  }
  const orderId = useReceipt ? receipt.orderId : sampleOrder?.id;
  if (!orderId) {
    showError(usingCode ? '自提码无效，请核对后重试。' : '未识别到订单，请核对条形码后重试。', field);
    return;
  }

  const placement = terminal.placements[orderId];
  if (placement === 'collected') {
    showError('该订单已取货。', field);
    return;
  }
  if (terminal.activeDoor) {
    showError('有柜门正在操作，请稍后重试。', field);
    return;
  }
  if (depositing) {
    if (placement) {
      showError(`该订单已存入 ${placement} 柜门。`, field);
      return;
    }
    order = sampleOrder;
    selectedDoor = '';
    page = 'door-selection';
    render();
  } else if (!doors.includes(placement)) {
    showError('该订单尚未存入自提柜，请联系店员。', field);
  } else {
    openDoor('pickup', orderId, placement);
  }
}

function openDoor(operation, orderId, door) {
  terminal.activeDoor = { operation, orderId, door };
  saveTerminal();
  page = 'door-open';
  render();
}

function completeOrder() {
  const { operation, orderId, door } = terminal.activeDoor;
  terminal.activeDoor = null;
  if (operation === 'deposit') {
    terminal.placements[orderId] = door;
    saveTerminal();
    goHome(`存货完成 · ${orderId} 已存入 ${door}`);
  } else {
    terminal.placements[orderId] = 'collected';
    terminal.returnAt = Date.now() + PICKUP_RETURN_SECONDS * 1000;
    saveTerminal();
    showPickupCountdown();
  }
}

function remainingSeconds() {
  return Math.max(0, Math.ceil((terminal.returnAt - Date.now()) / 1000));
}

function showPickupCountdown() {
  page = 'pickup-done';
  render();
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    const remaining = remainingSeconds();
    if (remaining === 0) {
      clearInterval(countdownTimer);
      withLatestTerminal(() => goHome());
    } else {
      document.querySelector('#remaining').textContent = remaining;
    }
  }, 250);
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (mode === 'checkout' && !checkout.leave()) return;
    mode = button.dataset.mode;
    goHome();
  });
});

resetButton.addEventListener('click', () => {
  if (mode === 'checkout') {
    if (checkout.leave()) goHome();
    return;
  }
  if (window.confirm('确定重置演示订单和柜门状态？')) {
    withLatestTerminal(() => {
      if (terminal.activeDoor) {
        goHome('有柜门正在操作，请完成后再重置。');
        return;
      }
      terminal = initialTerminal();
      saveTerminal();
      goHome('已重置演示数据。');
    });
  }
});

screen.addEventListener('submit', (event) => {
  if (event.target.id !== 'order-form') return;
  event.preventDefault();
  const form = event.target;
  withLatestTerminal(() => {
    if (form.isConnected) validateOrder();
  });
});

screen.addEventListener('input', (event) => {
  if (event.target.id !== 'order-value') return;
  clearError();
});

screen.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button || button.disabled) return;

  switch (button.dataset.action) {
    case 'deposit':
      terminal = loadTerminal(terminal);
      page = 'deposit-scan';
      render();
      break;
    case 'pickup':
      terminal = loadTerminal(terminal);
      page = 'pickup';
      render();
      break;
    case 'home':
      withLatestTerminal(() => goHome());
      break;
    case 'back':
      if (page === 'door-selection') {
        page = 'deposit-scan';
        render();
      } else {
        goHome();
      }
      break;
    case 'digit':
    case 'delete':
    case 'clear':
    case 'sample-code': {
      const scanner = document.querySelector('#order-value');
      const input = document.querySelector('#pickup-code');
      if (button.dataset.action === 'clear') input.value = '';
      else if (button.dataset.action === 'delete') input.value = input.value.slice(0, -1);
      else if (button.dataset.action === 'sample-code') input.value = button.dataset.value;
      else if (input.value.length < 6) input.value += button.dataset.digit;
      scanner.value = '';
      if (event.detail > 0 || button.dataset.action === 'sample-code') scanner.focus({ preventScroll: true });
      clearError();
      break;
    }
    case 'sample': {
      const input = document.querySelector('#order-value');
      input.value = button.dataset.value;
      clearError();
      input.form.requestSubmit();
      break;
    }
    case 'select-door':
      selectedDoor = button.dataset.door;
      screen.querySelectorAll('[data-door]').forEach((option) => {
        option.setAttribute('aria-pressed', String(option === button));
      });
      screen.querySelector('[data-action="open-door"]').disabled = false;
      screen.querySelector('[data-action="open-door"]').textContent = `打开 ${selectedDoor} 柜门`;
      break;
    case 'open-door':
      withLatestTerminal(() => {
        if (!button.isConnected) return;
        if (!terminal.activeDoor && !terminal.placements[order.id] && freeDoors().includes(selectedDoor)) {
          openDoor('deposit', order.id, selectedDoor);
        } else {
          selectedDoor = '';
          render('柜门或订单状态已变化，请重新选择。');
        }
      });
      break;
    case 'complete': {
      const active = terminal.activeDoor;
      withLatestTerminal(() => {
        if (!button.isConnected) return;
        const latest = terminal.activeDoor;
        if (!active || !latest || latest.orderId !== active.orderId || latest.operation !== active.operation || latest.door !== active.door) {
          goHome('本次柜门操作已结束。');
          return;
        }
        completeOrder();
      });
      break;
    }
  }
});

if (terminal.activeDoor) {
  page = 'door-open';
  render();
} else if (remainingSeconds() > 0) {
  showPickupCountdown();
} else {
  if (checkout.hasRestoredPayment()) mode = 'checkout';
  goHome();
}
