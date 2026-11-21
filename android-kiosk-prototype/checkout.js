'use strict';

function createCheckout(screen, refresh) {
  const demoMember = { phone: '00000001', maskedPhone: '0000••01', name: '陈女士', tier: '普通会员' };
  const demoPaymentCode = '000000000000000001';
  const products = [
    { barcode: '200000001001', name: 'MC 校园运动 POLO 套装', spec: '蓝色 / M', original: 23900, price: 18900, image: 'p001.svg', shortName: 'POLO 套装' },
    { barcode: '200000001002', name: '夏季短袖校服衬衫', spec: '白色 / M', original: 10900, price: 9900, image: 'p003.svg', shortName: '短袖衬衫' },
    { barcode: '200000001003', name: '运动袜（3 双装）', spec: '白色 / 均码', original: 2900, price: 2900, image: 'a002-socks.svg', shortName: '运动袜' },
  ];
  const payments = ['Mpay', '中银智慧付', 'Alipay HK'];
  const imageDirectory = '../mc-mall-ui-demo-spec/demo/assets/products/';
  const cart = new Map();
  let view = 'home';
  let member = null;
  let order = null;
  let orderSequence = 0;

  function money(cents) {
    return `MOP ${(cents / 100).toFixed(2)}`;
  }

  function moveTo(nextView) {
    view = nextView;
    refresh();
  }

  function reset() {
    cart.clear();
    member = null;
    order = null;
    view = 'home';
  }

  function leave() {
    if (view === 'pending') return false;
    if (cart.size && view !== 'paid' && !window.confirm('确定结束本次购物并清空购物车？')) return false;
    reset();
    return true;
  }

  function totals() {
    const summary = { count: 0, original: 0, total: 0 };
    for (const [product, quantity] of cart) {
      summary.count += quantity;
      summary.original += product.original * quantity;
      summary.total += product.price * quantity;
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

  function homeView() {
    return `<section class="home" aria-labelledby="page-title">
      <div class="home-heading">
        <h1 id="page-title" tabindex="-1">自助收银</h1>
        <p class="description">选择登录方式，开始扫码购物</p>
      </div>
      <div class="home-actions">
        <button class="action-card pickup-card" type="button" data-checkout-action="member">
          <span class="card-icon" aria-hidden="true"><i class="member-icon"></i></span>
          <span class="card-copy"><strong>会员登录</strong><small>输入会员手机号</small></span><span class="card-arrow" aria-hidden="true">→</span>
        </button>
        <button class="action-card deposit-card" type="button" data-checkout-action="guest">
          <span class="card-icon" aria-hidden="true"><i class="barcode-icon"></i></span>
          <span class="card-copy"><strong>非会员登录</strong><small>直接扫码结账</small></span><span class="card-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </section>`;
  }

  function phoneView() {
    return `<section class="flow" aria-labelledby="page-title">
      ${heading('会员登录', '请输入已登记的会员手机号。', 'home')}
      <div class="panel order-panel">
        <form data-checkout-form="phone" novalidate>
          <label for="checkout-phone">会员手机号</label>
          <input id="checkout-phone" type="tel" inputmode="tel" maxlength="20" autocomplete="off" placeholder="请输入手机号" aria-describedby="checkout-error" data-checkout-focus>
          <p id="checkout-error" class="form-error" role="alert"></p>
          <button class="primary full" type="submit">确认</button>
          <button class="text-button sample" type="button" data-checkout-action="demo-phone">填入演示手机号 <span>${demoMember.phone}</span></button>
        </form>
      </div>
    </section>`;
  }

  function memberView() {
    return `<section class="flow" aria-labelledby="page-title">
      ${heading('会员信息', '', 'change-phone', '重新输入手机号')}
      <div class="panel member-panel">
        <div class="member-card">
          <span class="card-icon" aria-hidden="true"><i class="member-icon"></i></span>
          <div><strong>${member.name}</strong><span>${member.tier} · ${member.maskedPhone}</span></div>
        </div>
        <button class="primary full" type="button" data-checkout-action="cart">进入结账</button>
      </div>
    </section>`;
  }

  function cartView() {
    const { count, original, total } = totals();
    return `<section class="checkout-flow" aria-labelledby="page-title">
      ${heading('扫码结账', '将商品条形码对准扫码器。', 'home', '返回收银首页')}
      <div class="checkout-layout">
        <div class="checkout-main">
          <div class="panel order-panel scanner-panel">
            <form data-checkout-form="product" novalidate>
              <label for="checkout-barcode">商品条形码</label>
              <div class="scan-entry">
                <input id="checkout-barcode" type="text" inputmode="none" maxlength="32" autocomplete="off" spellcheck="false" aria-describedby="checkout-error" placeholder="等待扫码" data-checkout-focus>
                <button class="primary" type="submit">加入购物车</button>
              </div>
              <p id="checkout-error" class="form-error" role="alert"></p>
            </form>
            <div class="demo-products" aria-label="模拟商品扫码">
              <span>模拟扫码</span>
              ${products.map((product) => `<button class="text-button" type="button" data-checkout-action="demo-product" data-barcode="${product.barcode}" title="条形码 ${product.barcode}">${product.shortName}</button>`).join('')}
            </div>
          </div>
          <div class="panel cart-panel">
            <header class="cart-heading"><h2>购物车</h2><span>${count} 件商品</span></header>
            ${count ? `<ul class="cart-items">${Array.from(cart, ([product, quantity]) => cartRow(product, quantity)).join('')}</ul>` : '<p class="cart-empty">扫码后，商品将在这里显示。</p>'}
          </div>
        </div>
        <aside class="panel checkout-summary" aria-label="金额明细">
          <h2>结账明细</h2>
          <p class="customer-label">${member ? `${member.name} · ${member.tier}` : '非会员'}</p>
          <dl class="receipt-details">
            <div><dt>商品原价</dt><dd>${money(original)}</dd></div>
            <div><dt>商品优惠</dt><dd>${total < original ? '−' : ''}${money(original - total)}</dd></div>
          </dl>
          <div class="payable"><span>应付金额</span><strong>${money(total)}</strong></div>
          <button class="primary full" type="button" data-checkout-action="create-order" ${count ? '' : 'disabled'}>确认结账</button>
        </aside>
      </div>
    </section>`;
  }

  function cartRow(product, quantity) {
    const discount = product.original - product.price;
    return `<li class="cart-row">
      <img src="${imageDirectory}${product.image}" width="76" height="76" alt="">
      <div class="cart-product"><strong>${product.name}</strong><span>${product.spec}</span>
        <p class="cart-price">${money(product.price)} ${discount ? `<del>${money(product.original)}</del>` : ''}</p>
        ${discount ? `<span class="product-discount">每件省 ${money(discount)}</span>` : '<span>无折扣</span>'}
      </div>
      <div class="quantity" aria-label="${product.name}数量">
        <button type="button" data-checkout-action="subtract" data-barcode="${product.barcode}" aria-label="${product.name}减一件">−</button>
        <strong aria-label="${quantity} 件">${quantity}</strong>
        <button type="button" data-checkout-action="add" data-barcode="${product.barcode}" aria-label="${product.name}加一件">+</button>
      </div>
    </li>`;
  }

  function paymentHeader() {
    return `<div class="payment-amount"><span>订单总金额</span><strong>${money(order.total)}</strong></div>
      <p class="payment-order">订单 ${order.id} · ${order.count} 件商品</p>`;
  }

  function methodsView() {
    return `<section class="flow" aria-labelledby="page-title">
      ${heading('选择支付方式', '', 'edit-cart', '返回购物车')}
      <div class="panel payment-panel">
        ${paymentHeader()}
        <div class="payment-methods">
          ${payments.map((payment, index) => `<button type="button" data-checkout-action="payment-method" data-index="${index}"><span>${payment}</span><span aria-hidden="true">→</span></button>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function scanView() {
    return `<section class="flow" aria-labelledby="page-title">
      ${heading('等待扫描付款码', `请打开 ${order.payment} 的付款码并对准扫码器。`, 'methods', '更换支付方式')}
      <div class="panel payment-panel order-panel">
        ${paymentHeader()}
        <div class="scan-graphic payment-graphic" aria-hidden="true"><i class="barcode-icon"></i><span></span></div>
        <form data-checkout-form="payment" novalidate>
          <label for="checkout-payment-code">付款码</label>
          <input id="checkout-payment-code" type="password" inputmode="none" maxlength="32" autocomplete="off" aria-describedby="checkout-error" placeholder="等待扫码" data-checkout-focus>
          <p id="checkout-error" class="form-error" role="alert"></p>
          <button class="secondary full" type="button" data-checkout-action="demo-payment">模拟扫描付款码</button>
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

  function paidView() {
    return `<section class="flow" aria-labelledby="page-title">
      ${heading('支付完成')}
      <div class="panel payment-panel payment-state">
        <span class="success-mark" aria-hidden="true">✓</span>
        <div class="payment-amount"><span>实付金额</span><strong>${money(order.total)}</strong></div>
        <dl class="receipt-details">
          <div><dt>订单号</dt><dd>${order.id}</dd></div>
          <div><dt>支付方式</dt><dd>${order.payment}</dd></div>
          <div><dt>商品数量</dt><dd>${order.count} 件</dd></div>
        </dl>
        <button class="primary full" type="button" data-checkout-action="home">返回收银首页</button>
      </div>
    </section>`;
  }

  function formError(form, message) {
    const input = form.querySelector('input');
    form.querySelector('#checkout-error').textContent = message;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      input.select();
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  function changeQuantity(product, change) {
    const quantity = (cart.get(product) || 0) + change;
    if (quantity > 0) cart.set(product, quantity);
    else cart.delete(product);
    refresh();
  }

  function createOrder() {
    if (!cart.size) return;
    order = {
      ...totals(),
      id: `POS-${Date.now().toString(36).toUpperCase()}-${++orderSequence}`,
      items: Array.from(cart, ([product, quantity]) => ({ ...product, quantity })),
      member,
      payment: null,
      status: 'unpaid',
    };
    moveTo('methods');
  }

  function receivePaymentScan(value, form) {
    if (view !== 'scan' || order.status !== 'unpaid') return;
    if (value !== demoPaymentCode) {
      formError(form, '请使用演示付款码完成模拟支付。');
      return;
    }

    const pendingOrder = order;
    pendingOrder.status = 'pending';
    moveTo('pending');
    window.setTimeout(() => {
      if (order !== pendingOrder || pendingOrder.status !== 'pending') return;
      pendingOrder.status = 'paid';
      moveTo('paid');
    }, 1800);
  }

  screen.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.matches('[data-checkout-form]')) return;
    event.preventDefault();
    const value = form.querySelector('input').value.trim();
    switch (form.dataset.checkoutForm) {
      case 'phone':
        if (value === demoMember.phone) {
          member = demoMember;
          moveTo('member');
        } else {
          formError(form, value ? '未找到会员，请核对手机号后重试。' : '请输入会员手机号。');
        }
        break;
      case 'product': {
        const product = products.find((candidate) => candidate.barcode === value);
        if (product) changeQuantity(product, 1);
        else formError(form, value ? '未识别到商品，请核对条形码后重试。' : '请扫描商品条形码。');
        break;
      }
      case 'payment':
        receivePaymentScan(value, form);
        break;
    }
  });

  screen.addEventListener('input', (event) => {
    const form = event.target.closest('form[data-checkout-form]');
    if (form) formError(form, '');
  });

  screen.addEventListener('click', (event) => {
    const button = event.target.closest('[data-checkout-action]');
    if (!button || button.disabled) return;
    switch (button.dataset.checkoutAction) {
      case 'member':
      case 'change-phone':
        member = null;
        moveTo('phone');
        break;
      case 'guest':
      case 'cart':
        moveTo('cart');
        break;
      case 'home':
        if (leave()) refresh();
        break;
      case 'demo-phone': {
        const input = screen.querySelector('#checkout-phone');
        input.value = demoMember.phone;
        formError(input.form, '');
        input.focus();
        break;
      }
      case 'demo-product':
      case 'subtract':
      case 'add': {
        const product = products.find((candidate) => candidate.barcode === button.dataset.barcode);
        changeQuantity(product, button.dataset.checkoutAction === 'subtract' ? -1 : 1);
        break;
      }
      case 'create-order':
        createOrder();
        break;
      case 'edit-cart':
        order = null;
        moveTo('cart');
        break;
      case 'payment-method':
        order.payment = payments[Number(button.dataset.index)];
        moveTo('scan');
        break;
      case 'methods':
        order.payment = null;
        moveTo('methods');
        break;
      case 'demo-payment':
        receivePaymentScan(demoPaymentCode, screen.querySelector('[data-checkout-form="payment"]'));
        break;
    }
  });

  const views = { home: homeView, phone: phoneView, member: memberView, cart: cartView, methods: methodsView, scan: scanView, pending: pendingView, paid: paidView };
  return {
    render() {
      screen.innerHTML = views[view]();
    },
    leave,
    isPaymentPending: () => view === 'pending',
  };
}
