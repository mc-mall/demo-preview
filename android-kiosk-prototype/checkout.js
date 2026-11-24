'use strict';

function createCheckout(screen, refresh) {
  const demoPaymentCode = '000000000000000001';
  const payments = ['Mpay', '中银智慧付', 'Alipay HK'];
  const paymentStorageKey = 'mc-mall.android-kiosk.payment.v1';
  const callbackWait = 1800;
  const queryWait = 650;
  const delayedResultWait = 8000;
  const cart = new Map();
  const pickup = createPickupDesk(screen);
  const memberDirectory = createCheckoutMemberDirectory();
  let order = loadPayment();
  let view = order?.status || 'home';
  let school = checkoutSchools[0];
  let stage = school.stages[0];
  let selectedPayment = '';
  let lastScan = null;
  let querying = false;
  let queryNote = '';

  function money(cents) {
    return `MOP ${(cents / 100).toFixed(2)}`;
  }

  function safeText(value) {
    return String(value).replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
  }

  function moveTo(nextView) {
    view = nextView;
    refresh();
  }

  function reset() {
    cart.clear();
    order = null;
    school = checkoutSchools[0];
    stage = school.stages[0];
    selectedPayment = '';
    lastScan = null;
    queryNote = '';
    savePayment();
    view = 'home';
  }

  function leave() {
    if (isPaymentPending()) return false;
    if ((cart.size || order) && view !== 'paid' && !window.confirm('确定结束本次购物并清空购物车？')) return false;
    reset();
    return true;
  }

  function totals() {
    const summary = { count: 0, total: 0 };
    for (const item of cart.values()) {
      summary.count += item.quantity;
      summary.total += item.price * item.quantity;
    }
    return summary;
  }

  function heading(title, description = '', backAction = '', backText = '返回') {
    return `<header class="flow-heading">
      ${backAction ? `<button class="back text-button" type="button" data-checkout-action="${backAction}"><span aria-hidden="true">←</span> ${backText}</button>` : ''}
      <h1 id="page-title" tabindex="-1">${title}</h1>
      ${description ? `<p class="description">${description}</p>` : ''}
    </header>`;
  }

  function shoppingSteps(current) {
    return `<ol class="shopping-steps" aria-label="购物流程">
      ${['选校服', '扫实物', '结账付款'].map((label, index) => {
        const step = index + 1;
        return `<li ${step === current ? 'aria-current="step"' : ''} class="${step < current ? 'completed' : ''}"><span aria-hidden="true">${step < current ? '✓' : step}</span>${label}</li>`;
      }).join('')}
    </ol>`;
  }

  function homeView() {
    const { count, total } = totals();
    const uniforms = checkoutUniforms.filter((product) => product.school === school && product.stage === stage);
    return `<section class="shopping-page" aria-labelledby="page-title">
      <div class="shopping-heading">
        <h1 id="page-title" tabindex="-1">自助购物</h1>
        ${shoppingSteps(1)}
      </div>
      <div class="catalog-layout">
        <nav class="school-nav" aria-label="学校分类">
          <h2>选择学校</h2>
          ${checkoutSchools.map((entry) => `<button type="button" data-checkout-action="school" data-school="${entry.id}" aria-pressed="${entry === school}">
            <img src="catalog/${entry.logo}" width="42" height="42" alt="">
            <span>${entry.name}</span><span class="school-arrow" aria-hidden="true">›</span>
          </button>`).join('')}
        </nav>
        <div class="catalog-main">
          <div class="school-banner">
            <div><h2>${school.name}</h2><p>按学段选购校服，付款后由店员配货</p></div>
            <img src="catalog/${school.logo}" width="96" height="96" alt="">
          </div>
          <div class="stage-nav" role="group" aria-label="学段分类">
            ${school.stages.map((entry) => `<button type="button" data-checkout-action="stage" data-stage="${entry}" aria-pressed="${entry === stage}">${entry}</button>`).join('')}
          </div>
          <div class="catalog-list" tabindex="0" role="region" aria-label="校服商品列表">
            <div class="uniform-grid">${uniforms.map(uniformCard).join('')}</div>
          </div>
        </div>
      </div>
      <div class="catalog-cart">
        <div class="catalog-cart-copy"><span>购物车 · ${count} 件</span><strong>${money(total)}</strong></div>
        <button class="primary" type="button" data-checkout-action="cart">下一步 · 扫实物 <span aria-hidden="true">→</span></button>
      </div>
      <nav class="pickup-tools" aria-label="取货服务">
        <button class="text-button" type="button" data-checkout-action="pickup-status">查询取货进度</button>
        <button class="text-button" type="button" data-checkout-action="warehouse">仓库拣货</button>
      </nav>
      <dialog class="size-dialog" aria-labelledby="size-title"></dialog>
    </section>`;
  }

  function uniformCard(product) {
    const count = Array.from(cart.values()).reduce((sum, item) => sum + (item.productId === product.id ? item.quantity : 0), 0);
    return `<button class="uniform-card" type="button" data-checkout-action="choose-size" data-product="${product.id}">
      <span class="uniform-image"><img src="${product.image}" width="560" height="560" alt=""></span>
      <span class="uniform-copy">
        <strong>${product.name}</strong>
        <span class="uniform-color">${product.color}${count ? ` · 已选 ${count} 件` : ''}</span>
        <span class="uniform-price"><b>${money(product.price)}</b><span>选尺码 <span aria-hidden="true">＋</span></span></span>
      </span>
    </button>`;
  }

  function sizeGuide(product) {
    const { columns, values } = product.sizeGuide;
    return `<details class="size-guide">
      <summary>查看尺码表</summary>
      <table>
        <caption>成衣尺寸（cm）· 演示数据</caption>
        <thead><tr><th scope="col">尺码</th>${columns.map((column) => `<th scope="col">${column}</th>`).join('')}</tr></thead>
        <tbody>${product.sizes.map((size) => `<tr><th scope="row">${size}</th>${values[size].map((value) => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </details>`;
  }

  function chooseSize(product) {
    const dialog = screen.querySelector('.size-dialog');
    dialog.innerHTML = `<form data-checkout-form="uniform" data-product="${product.id}">
      <header class="size-header">
        <div><h2 id="size-title">商品详情</h2><p>${product.school.name} · ${product.stage}</p></div>
        <button class="text-button close-dialog" type="button" aria-label="关闭" data-checkout-action="close-size">×</button>
      </header>
      <div class="size-content">
        <div class="size-product">
          <img src="${product.image}" width="92" height="92" alt="">
          <div><strong>${product.name}</strong><span>${product.color}</span><b>${money(product.price)} / 件</b></div>
        </div>
        <p class="size-description">${product.description}</p>
        <fieldset class="size-options">
          <legend>尺码（cm）</legend>
          <div>${product.sizes.map((size, index) => `<label><input type="radio" name="size" value="${size}" required ${index === 0 ? 'autofocus' : ''}><span>${size}</span></label>`).join('')}</div>
        </fieldset>
        ${sizeGuide(product)}
      </div>
      <footer class="size-footer">
        <div class="size-order">
          <div class="size-order-quantity">
            <span>数量</span>
            <div class="quantity" role="group" aria-label="购买数量">
              <button type="button" data-checkout-action="uniform-quantity" data-step="-1" aria-label="减少数量" disabled>−</button>
              <output data-uniform-quantity aria-label="所选数量">1</output>
              <button type="button" data-checkout-action="uniform-quantity" data-step="1" aria-label="增加数量">+</button>
            </div>
          </div>
          <div class="size-subtotal"><span>小计</span><strong data-uniform-subtotal>${money(product.price)}</strong></div>
        </div>
        <button class="primary full" type="submit">加入购物车</button>
      </footer>
    </form>`;
    dialog.showModal();
  }

  function scannerPanel() {
    return `<div class="panel order-panel scanner-panel">
      <form data-checkout-form="product" novalidate>
        <label for="checkout-barcode">非校服商品条形码</label>
        <div class="scan-entry">
          <input id="checkout-barcode" type="text" inputmode="none" maxlength="32" autocomplete="off" spellcheck="false" aria-describedby="checkout-error" placeholder="等待扫码" data-checkout-focus>
          <button class="primary" type="submit">加入购物车</button>
        </div>
        <p id="checkout-error" class="form-error" role="alert"></p>
      </form>
      <div class="demo-products" aria-label="模拟商品扫码">
        <span>模拟扫码</span>
        ${checkoutRetail.map((product) => `<button class="text-button" type="button" data-checkout-action="demo-product" data-sku="${product.sku}" title="条形码 ${product.sku}">${product.shortName}</button>`).join('')}
      </div>
      ${lastScan ? `<p class="scan-feedback"><span aria-hidden="true">✓</span> 已扫入 ${lastScan.name}，当前 ${lastScan.quantity} 件</p>` : ''}
    </div>`;
  }

  function cartView() {
    const { count, total } = totals();
    const items = Array.from(cart.values());
    const uniforms = items.filter((item) => item.kind === 'uniform');
    const retail = items.filter((item) => item.kind === 'retail');
    return `<section class="shopping-page" aria-labelledby="page-title">
      <div class="shopping-heading">
        ${heading('扫描实物商品', '将实物条形码对准扫码器。只买校服可直接结账。', 'browse', '返回选校服')}
        ${shoppingSteps(2)}
      </div>
      <div class="checkout-layout">
        <div class="checkout-main">
          ${scannerPanel()}
          <div class="panel cart-panel">
            <header class="cart-heading"><h2>购物车</h2><span>${count} 件商品</span></header>
            ${count ? `${cartGroup('校服 · 店员配货', uniforms)}${cartGroup('实物商品 · 随身带走', retail)}` : '<p class="cart-empty">已选校服和扫入的实物商品将在这里合并结算。</p>'}
          </div>
        </div>
        <aside class="panel checkout-summary" aria-label="结账明细">
          <h2>结账明细</h2>
          <dl class="receipt-details">
            <div><dt>校服</dt><dd>${money(uniforms.reduce((sum, item) => sum + item.price * item.quantity, 0))}</dd></div>
            <div><dt>实物商品</dt><dd>${money(retail.reduce((sum, item) => sum + item.price * item.quantity, 0))}</dd></div>
          </dl>
          <div class="checkout-actions">
            <div class="payable"><span>应付金额</span><strong>${money(total)}</strong></div>
            <div class="checkout-buttons">
              <button class="primary full" type="button" data-checkout-action="member-checkout" ${count ? '' : 'disabled'}>会员结账</button>
              <button class="secondary full" type="button" data-checkout-action="create-order" ${count ? '' : 'disabled'}>非会员结账</button>
            </div>
          </div>
        </aside>
      </div>
      <dialog class="member-dialog" aria-labelledby="member-title"></dialog>
    </section>`;
  }

  function renderMemberDialog(dialog, content) {
    dialog.innerHTML = `<header class="member-dialog-heading">
      <h2 id="member-title">会员结账</h2>
      <button class="text-button close-dialog" type="button" data-checkout-action="close-member" aria-label="关闭">×</button>
    </header>${content}`;
  }

  function showMemberForm(dialog) {
    renderMemberDialog(dialog, `<form data-checkout-form="member" class="order-panel" novalidate>
      <label for="member-phone">手机号码</label>
      <input id="member-phone" type="tel" inputmode="tel" maxlength="26" autocomplete="off" placeholder="输入手机号" aria-describedby="member-hint member-error" autofocus>
      <p id="member-hint" class="member-hint">如果该号码尚未注册，将自动注册为普通会员。</p>
      <p id="member-error" class="form-error" role="alert"></p>
      <button class="primary full" type="submit">查询会员</button>
      <button class="text-button" type="button" data-checkout-action="demo-member">填入演示手机号 ${checkoutDemoPhone}</button>
    </form>`);
    if (dialog.open) {
      dialog.querySelector('#member-phone').focus();
    } else {
      dialog.onclose = () => {
        if (!dialog.open) dialog.replaceChildren();
      };
      dialog.showModal();
    }
  }

  function showMatchedMember(dialog, member) {
    renderMemberDialog(dialog, `<div class="member-profile">
      <strong>${member.name}</strong>
      <span>${member.tier}</span>
      <span>${member.maskedPhone}</span>
    </div>
    <button class="primary full" type="button" data-confirm-member>确认并选择支付方式</button>
    <button class="text-button" type="button" data-checkout-action="change-member">重新输入手机号</button>`);
    const confirm = dialog.querySelector('[data-confirm-member]');
    confirm.addEventListener('click', () => createOrder(member), { once: true });
    confirm.focus();
  }

  async function matchMember(form) {
    const input = form.querySelector('input');
    const submit = form.querySelector('button[type="submit"]');
    if (submit.disabled) return;
    const phone = normalizeCheckoutPhone(input.value);
    if (!phone) {
      formError(form, '请输入澳门或香港 8 位手机号（香港请加 +852），或内地 11 位手机号。');
      return;
    }
    input.readOnly = true;
    submit.disabled = true;
    const dialog = form.closest('dialog');
    const match = await memberDirectory.match(phone);
    if (!dialog.open || !dialog.contains(form) || view !== 'cart') return;

    const member = memberDirectory.findOrRegister(match);
    if (member.newMember) createOrder(member);
    else showMatchedMember(dialog, member);
  }

  function cartGroup(label, items) {
    if (!items.length) return '';
    return `<section class="cart-group"><h3>${label}</h3><ul class="cart-items">${items.map(cartRow).join('')}</ul></section>`;
  }

  function cartRow(item) {
    return `<li class="cart-row${lastScan?.sku === item.sku ? ' just-scanned' : ''}" data-cart-sku="${item.sku}">
      <img src="${item.image}" width="76" height="76" alt="">
      <div class="cart-product"><strong>${item.name}</strong><span>${item.spec}</span>
        <p class="cart-price">${money(item.price)} / 件</p>
      </div>
      <div class="quantity" aria-label="${item.name}数量">
        <button type="button" data-checkout-action="subtract" data-sku="${item.sku}" aria-label="${item.name}减一件">−</button>
        <strong aria-label="${item.quantity} 件">${item.quantity}</strong>
        <button type="button" data-checkout-action="add" data-sku="${item.sku}" aria-label="${item.name}加一件">+</button>
      </div>
    </li>`;
  }

  function paymentHeader() {
    return `<div class="payment-amount"><span>订单总金额</span><strong>${money(order.total)}</strong></div>
      <p class="payment-order">订单 ${order.id} · ${order.count} 件商品</p>`;
  }

  function methodsView() {
    const failed = order.status === 'failed';
    return `<section class="flow" aria-labelledby="page-title">
      ${shoppingSteps(3)}
      ${heading('选择支付方式', '', failed ? 'back-to-failure' : 'edit-cart', failed ? '返回支付结果' : '返回购物车')}
      <div class="panel payment-panel">
        ${paymentHeader()}
        <p class="payment-member">${order.member
          ? `会员结账 · ${safeText(order.member.name)} · ${safeText(order.member.maskedPhone)}`
          : '非会员结账'}</p>
        ${order.member?.newMember ? '<p class="scan-feedback" role="status">已自动注册为普通会员，可以继续支付。</p>' : ''}
        <div class="payment-methods">
          ${payments.map((payment, index) => `<button type="button" data-checkout-action="payment-method" data-index="${index}"><span>${payment}</span><span aria-hidden="true">→</span></button>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function scanView() {
    return `<section class="flow" aria-labelledby="page-title">
      ${heading('等待扫描付款码', `请打开 ${selectedPayment} 的付款码并对准扫码器。`, 'methods', '更换支付方式')}
      <div class="panel payment-panel order-panel">
        ${paymentHeader()}
        <div class="scan-graphic payment-graphic" aria-hidden="true"><i class="barcode-icon"></i><span></span></div>
        <form data-checkout-form="payment" novalidate>
          <label for="checkout-payment-code">付款码</label>
          <input id="checkout-payment-code" type="password" inputmode="none" maxlength="32" autocomplete="off" aria-describedby="checkout-error" placeholder="等待扫码" data-checkout-focus>
          <p id="checkout-error" class="form-error" role="alert"></p>
          <button class="secondary full" type="button" data-checkout-action="demo-payment">模拟扫描付款码</button>
          <div class="payment-demo-options" role="group" aria-label="模拟支付异常">
            <button class="text-button" type="button" data-checkout-action="demo-payment" data-result="failed">模拟支付失败</button>
            <button class="text-button" type="button" data-checkout-action="demo-payment" data-result="delayed">模拟回调延迟</button>
          </div>
        </form>
      </div>
    </section>`;
  }

  function pendingView() {
    return `<section class="flow" aria-labelledby="page-title">
      ${heading('等待支付结果', '付款码已识别，正在等待支付回调。')}
      <div class="panel payment-panel payment-state">
        <span class="pay-spinner" aria-hidden="true"></span>
        ${paymentHeader()}
        <p class="payment-status" role="status">${order.payment} 支付处理中…</p>
      </div>
    </section>`;
  }

  function unknownView() {
    return `<section class="flow" aria-labelledby="page-title">
      ${heading('支付结果待确认', '暂未收到支付结果，请查询当前订单。')}
      <div class="panel payment-panel payment-state">
        <span class="payment-state-mark pending-mark" aria-hidden="true">…</span>
        ${paymentHeader()}
        <p class="payment-notice" role="status">${querying ? '正在查询支付结果…' : queryNote || '请先查询结果，避免重复付款。'}</p>
        <button class="primary full" type="button" data-checkout-action="query-payment" ${querying ? 'disabled' : ''}>${querying ? '正在查询…' : '查询支付结果'}</button>
      </div>
    </section>`;
  }

  function failedView() {
    return `<section class="flow" aria-labelledby="page-title">
      ${heading('支付失败', '请重新出示付款码，或更换支付方式。')}
      <div class="panel payment-panel payment-state">
        <span class="payment-state-mark failure-mark" aria-hidden="true">×</span>
        ${paymentHeader()}
        <p class="payment-notice">${order.payment} 本次付款未成功。</p>
        <div class="payment-retry-actions">
          <button class="primary full" type="button" data-checkout-action="retry-payment">重新付款</button>
          <button class="secondary full" type="button" data-checkout-action="methods">更换支付方式</button>
        </div>
      </div>
    </section>`;
  }

  function receiptHeader(title) {
    const paidAt = new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Macau', dateStyle: 'medium', timeStyle: 'short', hourCycle: 'h23',
    }).format(order.paidAt);
    return `<header class="receipt-heading">
      <p>澳设商城 · 门店自助终端</p>
      <h2>${title}</h2>
      <p class="receipt-pickup-number"><span>取货号</span> <strong>${order.pickupNumber}</strong></p>
      <p>${paidAt} · 支付已确认（演示）</p>
    </header>`;
  }

  function customerReceipt(pickingCount) {
    return `<article class="order-receipt" aria-label="客户联">
      ${receiptHeader('客户联')}
      <ul class="receipt-items">${order.items.map((item) => `<li>
        <div><strong>${safeText(item.name)}</strong><small>${safeText(item.spec)}</small><small>${money(item.price)} × ${item.quantity}</small></div>
        <b>${money(item.price * item.quantity)}</b>
      </li>`).join('')}</ul>
      <dl class="receipt-details">
        <div><dt>商品数量</dt><dd>${order.count} 件</dd></div>
        <div><dt>支付方式</dt><dd>${order.payment}</dd></div>
        <div><dt>实付金额</dt><dd>${money(order.total)}</dd></div>
      </dl>
      ${pickingCount ? '<p class="receipt-note">可在终端查询取货进度。收到拣货完成通知后，请凭取货号到取货台领取校服。</p>' : ''}
    </article>`;
  }

  function warehouseReceipt(pickingItems, pickingCount) {
    return `<article class="order-receipt" aria-label="仓库联">
      ${receiptHeader('仓库联 · 拣货单')}
      ${pickingCount ? `${pickupBarcode(order.pickupNumber)}<ul class="receipt-items">${pickingItems.map((item) => `<li>
        <div><strong>${safeText(item.name)}</strong><small>${safeText(item.spec)}</small>
          <small>SKU ${safeText(item.sku)}</small><small>货位 ${safeText(item.location)}</small>
        </div><b>× ${item.quantity}</b>
      </li>`).join('')}</ul>
      <dl class="receipt-details"><div><dt>应拣校服</dt><dd>${pickingCount} 件</dd></div></dl>
      <p class="receipt-note">按货位、尺码及数量拣货。完成后，扫描本联取货号条码通知客户。</p>`
        : '<p class="receipt-note">本单商品由客户随身带走，无需拣货。</p>'}
    </article>`;
  }

  function paidView() {
    const pickingItems = (order.items || []).filter((item) => item.kind === 'uniform')
      .sort((first, second) => first.location.localeCompare(second.location));
    const pickingCount = pickingItems.reduce((sum, item) => sum + item.quantity, 0);
    return `<section class="paid-page" aria-labelledby="page-title">
      <div class="panel paid-summary">
        <span class="success-mark" aria-hidden="true">✓</span>
        ${heading('支付完成', pickingCount ? '请保留客户联，凭取货号领取校服。' : '')}
        <div class="payment-amount"><span>实付金额</span><strong>${money(order.total)}</strong></div>
        <p class="payment-order">${order.payment} · ${order.count} 件</p>
        ${order.pickupNumber ? `<p class="paid-pickup-number">取货号 <strong>${order.pickupNumber}</strong></p>
          <div class="pickup-status" role="status" data-pickup-status="${order.pickupNumber}"></div>` : ''}
        <div class="paid-actions">
          ${order.items ? '<button class="secondary" type="button" data-checkout-action="print">打印两联小票</button>' : ''}
          <button class="primary" type="button" data-checkout-action="home">开始下一单</button>
        </div>
      </div>
      ${order.items ? `<div class="print-receipts">${customerReceipt(pickingCount)}${warehouseReceipt(pickingItems, pickingCount)}</div>`
        : '<p class="receipt-note">旧版演示订单只保留支付信息。</p>'}
    </section>`;
  }

  function printReceipts() {
    if (view !== 'paid' || !order?.items || !screen.querySelector('.print-receipts')) return;
    order.printRequested = true;
    savePayment();
    window.print();
  }

  function scheduleReceiptPrint() {
    const paidOrder = order;
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        if (order === paidOrder && !paidOrder.printRequested) printReceipts();
      }, 0);
    });
  }

  function formError(form, message) {
    const input = form.querySelector('input');
    form.querySelector('.form-error').textContent = message;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      input.select();
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  function changeQuantity(product, change, { scanned = false, message = '' } = {}) {
    const quantity = (cart.get(product.sku)?.quantity || 0) + change;
    const item = { ...product, quantity };
    if (quantity > 0) cart.set(product.sku, item);
    else cart.delete(product.sku);
    lastScan = scanned ? item : null;
    refresh(scanned ? `已扫入 ${item.name}，当前 ${quantity} 件` : message, { preserveScroll: true });
  }

  function updateUniformQuantity(button) {
    const form = button.form;
    const product = checkoutUniforms.find((entry) => entry.id === form.dataset.product);
    const output = form.querySelector('[data-uniform-quantity]');
    const quantity = Number(output.value) + Number(button.dataset.step);
    if (quantity < 1 || !Number.isSafeInteger(quantity * product.price)) return;

    output.value = quantity;
    form.querySelector('[data-uniform-subtotal]').textContent = money(product.price * quantity);
    form.querySelector('[data-step="-1"]').disabled = quantity === 1;
  }

  function addUniform(form) {
    const product = checkoutUniforms.find((entry) => entry.id === form.dataset.product);
    const size = new FormData(form).get('size');
    const quantity = Number(form.querySelector('[data-uniform-quantity]').value);
    if (view !== 'home' || !product?.sizes.includes(size) || !Number.isSafeInteger(quantity) || quantity < 1) return;

    const scrollTop = screen.querySelector('.catalog-list').scrollTop;
    form.closest('dialog').close();
    changeQuantity({
      kind: 'uniform', productId: product.id, sku: `${product.id}-${size}`,
      name: product.name, spec: `${product.school.name} · ${product.stage} · ${product.color} · ${size} cm`,
      price: product.price, image: product.image, location: product.location,
    }, quantity, { message: `已加入 ${product.name} · ${size} cm · ${quantity} 件` });
    screen.querySelector('.catalog-list').scrollTop = scrollTop;
    screen.querySelector(`[data-product="${product.id}"]`).focus({ preventScroll: true });
  }

  function scanProduct(value, form) {
    if (view !== 'cart') return;
    const product = checkoutRetail.find((candidate) => candidate.sku === value);
    if (product) {
      changeQuantity({ ...product, kind: 'retail' }, 1, { scanned: true });
    } else if (['200000001001', '200000001002'].includes(value) || checkoutUniforms.some(({ id }) => value.toUpperCase().startsWith(id))) {
      formError(form, '请返回学校分类，选择校服和尺码。');
    } else {
      formError(form, value ? '未识别到实物商品，请核对条形码后重试。' : '请扫描商品条形码。');
    }
  }

  function createOrder(member = null) {
    if (view !== 'cart' || !cart.size) return;
    order = {
      ...totals(),
      id: `POS-${Date.now().toString(36).toUpperCase()}-${crypto.getRandomValues(new Uint32Array(1))[0]}`,
      items: Array.from(cart.values()),
      member,
      payment: null,
      status: 'unpaid',
    };
    moveTo('methods');
  }

  function isPaymentPending() {
    return view === 'pending' || view === 'unknown';
  }

  function loadPayment() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(paymentStorageKey));
      if (saved && /^POS-[A-Z0-9]+-\d+$/.test(saved.id) && payments.includes(saved.payment)
        && Number.isSafeInteger(saved.total) && saved.total >= 0 && Number.isSafeInteger(saved.count) && saved.count > 0
        && ['pending', 'unknown', 'failed', 'paid'].includes(saved.status)
        && ['paid', 'failed', 'delayed'].includes(saved.attempt?.result)
        && Number.isFinite(saved.attempt.callbackAt) && Number.isFinite(saved.attempt.availableAt)) {
        if (!Array.isArray(saved.items) || !saved.items.length) delete saved.items;
        return saved;
      }
    } catch {
      // A payment can still be simulated in memory if browser storage is unavailable.
    }
    return null;
  }

  function savePayment() {
    try {
      if (order) {
        sessionStorage.setItem(paymentStorageKey, JSON.stringify(order));
      } else {
        sessionStorage.removeItem(paymentStorageKey);
      }
    } catch {
      // Keep the current page usable when browser storage is unavailable.
    }
  }

  function registerPickup() {
    if (!order.items) return;
    const count = order.items.reduce((sum, item) => sum + (item.kind === 'uniform' ? item.quantity : 0), 0);
    order.pickupNumber = pickup.register(order.id, count, order.pickupNumber);
  }

  function changePaymentStatus(status) {
    order.status = status;
    if (status === 'paid') {
      order.paidAt = Date.now();
      registerPickup();
    }
    savePayment();
    moveTo(status);
    if (status === 'paid' && order.items) scheduleReceiptPrint();
  }

  function schedulePaymentCallback() {
    const attempt = order.attempt;
    window.setTimeout(() => {
      if (order?.attempt !== attempt || order.status !== 'pending') return;
      changePaymentStatus(attempt.result === 'delayed' ? 'unknown' : attempt.result);
    }, Math.max(0, attempt.callbackAt - Date.now()));
  }

  function receivePaymentScan(value, form, result = 'paid') {
    if (view !== 'scan' || !['unpaid', 'failed'].includes(order.status)) return;
    if (value !== demoPaymentCode) {
      formError(form, '请使用演示付款码完成模拟支付。');
      return;
    }

    const now = Date.now();
    order.payment = selectedPayment;
    order.attempt = {
      result,
      callbackAt: now + callbackWait,
      availableAt: now + (result === 'delayed' ? delayedResultWait : callbackWait),
    };
    queryNote = '';
    changePaymentStatus('pending');
    schedulePaymentCallback();
  }

  function queryPayment() {
    if (view !== 'unknown' || querying) return;

    querying = true;
    refresh();
    window.setTimeout(() => {
      querying = false;
      if (Date.now() >= order.attempt.availableAt) {
        changePaymentStatus('paid');
      } else {
        queryNote = '付款结果尚未确认，请稍后再查询。';
        refresh();
      }
    }, queryWait);
  }

  screen.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.matches('[data-checkout-form]')) return;
    event.preventDefault();
    switch (form.dataset.checkoutForm) {
      case 'uniform':
        addUniform(form);
        break;
      case 'member':
        matchMember(form);
        break;
      case 'product':
        scanProduct(form.querySelector('input').value.trim(), form);
        break;
      case 'payment':
        receivePaymentScan(form.querySelector('input').value.trim(), form);
        break;
    }
  });

  screen.addEventListener('input', (event) => {
    const form = event.target.closest('[data-checkout-form="product"], [data-checkout-form="payment"], [data-checkout-form="member"]');
    if (form) formError(form, '');
  });

  screen.addEventListener('click', (event) => {
    const button = event.target.closest('[data-checkout-action]');
    if (!button || button.disabled) return;
    switch (button.dataset.checkoutAction) {
      case 'school':
        school = checkoutSchools.find((entry) => entry.id === button.dataset.school);
        stage = school.stages[0];
        refresh('', { preserveScroll: true });
        screen.querySelector(`[data-school="${school.id}"]`).focus({ preventScroll: true });
        break;
      case 'stage':
        stage = button.dataset.stage;
        refresh('', { preserveScroll: true });
        screen.querySelector(`[data-stage="${stage}"]`).focus({ preventScroll: true });
        break;
      case 'choose-size':
        chooseSize(checkoutUniforms.find((entry) => entry.id === button.dataset.product));
        break;
      case 'uniform-quantity':
        updateUniformQuantity(button);
        break;
      case 'close-size':
        button.closest('dialog').close();
        break;
      case 'pickup-status':
      case 'warehouse':
        moveTo(button.dataset.checkoutAction);
        break;
      case 'cart':
        moveTo('cart');
        break;
      case 'browse':
        lastScan = null;
        moveTo('home');
        break;
      case 'home':
        if (leave()) refresh();
        break;
      case 'demo-product':
        scanProduct(button.dataset.sku, screen.querySelector('[data-checkout-form="product"]'));
        break;
      case 'subtract':
      case 'add':
        changeQuantity(cart.get(button.dataset.sku), button.dataset.checkoutAction === 'subtract' ? -1 : 1);
        break;
      case 'member-checkout':
      case 'change-member':
        showMemberForm(screen.querySelector('.member-dialog'));
        break;
      case 'close-member':
        button.closest('dialog').close();
        break;
      case 'demo-member': {
        const input = button.form.querySelector('input');
        if (input.readOnly) break;
        input.value = checkoutDemoPhone;
        formError(button.form, '');
        input.focus();
        break;
      }
      case 'create-order':
        createOrder();
        break;
      case 'edit-cart':
        order = null;
        savePayment();
        moveTo('cart');
        break;
      case 'payment-method':
        selectedPayment = payments[Number(button.dataset.index)];
        moveTo('scan');
        break;
      case 'methods':
        moveTo('methods');
        break;
      case 'retry-payment':
        selectedPayment = order.payment;
        moveTo('scan');
        break;
      case 'back-to-failure':
        moveTo('failed');
        break;
      case 'query-payment':
        queryPayment();
        break;
      case 'demo-payment':
        receivePaymentScan(demoPaymentCode, screen.querySelector('[data-checkout-form="payment"]'), button.dataset.result);
        break;
      case 'print':
        printReceipts();
        break;
    }
  });

  const views = {
    home: homeView, cart: cartView, methods: methodsView,
    scan: scanView, pending: pendingView, unknown: unknownView, failed: failedView, paid: paidView,
    warehouse: () => pickup.warehouseView(heading('仓库拣货', '完成拣货后，扫描仓库联条码通知客户取货。', 'browse', '返回自助购物')),
    'pickup-status': () => pickup.statusView(heading('查询取货进度', '请输入客户联上的六位取货号。', 'browse', '返回自助购物')),
  };
  if (view === 'pending') schedulePaymentCallback();
  if (view === 'paid' && order.items) {
    registerPickup();
    savePayment();
    if (!order.printRequested) scheduleReceiptPrint();
  }
  return {
    render() {
      screen.innerHTML = views[view]();
      if (view === 'paid') pickup.refreshStatus();
    },
    leave,
    isPaymentPending,
    hasRestoredPayment: () => Boolean(order),
  };
}
