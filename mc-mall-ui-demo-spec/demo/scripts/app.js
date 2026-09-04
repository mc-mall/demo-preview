(function () {
  "use strict";

  const data = window.MC_MALL_DATA;
  const page = document.body.dataset.page;
  let toastTimer;

  const iconPaths = {
    home: '<path d="M4 10.8 12 4l8 6.8V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.2Z"/>',
    category: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    cart: '<path d="M4 5h2l1.3 9.1a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 1.9-1.4L21 8H7.2M10 20h.01M18 20h.01"/>',
    camera: '<path d="M5 7h3l1.5-2h5L16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/>',
    user: '<path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
    message: '<path d="M5 6.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-8l-4 3v-3H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    share: '<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
    heart: '<path d="M20.8 5.7a5.3 5.3 0 0 0-7.5 0L12 7l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5L12 22l8.8-8.8a5.3 5.3 0 0 0 0-7.5Z"/>',
    service: '<path d="M4 13v-2a8 8 0 0 1 16 0v2M5 13H3v5h4v-5H5Zm14 0h2v5h-4v-5h2Zm0 5c0 2-2 3-5 3"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    school: '<path d="M3 10 12 4l9 6-9 6-9-6Zm3 3v5c3 2.5 9 2.5 12 0v-5M21 10v6"/>',
    formal: '<path d="m8 4 4 3 4-3 4 4-3 3v10H7V11L4 8l4-4Zm4 3v14M9 12h2"/>',
    shirt: '<path d="m8 4 4 2 4-2 5 3-2 5-3-1v10H8V11l-3 1-2-5 5-3Z"/>',
    sports: '<path d="M5 5h5l2 3 2-3h5l2 6-4 2v8H7v-8l-4-2 2-6Z"/>',
    bag: '<path d="M5 8h14l1 13H4L5 8Zm4 0V6a3 3 0 0 1 6 0v2"/>',
    badge: '<path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    spark: '<path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Zm7 13 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
    shield: '<path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    delivery: '<path d="M3 6h11v10H3V6Zm11 4h4l3 3v3h-7v-6Z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    measure: '<path d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm4 1h10V7H7v2Zm0 4h6v-2H7v2Zm0 4h10v-2H7v2Z"/>',
    support: '<path d="M12 3a9 9 0 0 0-9 9v5a3 3 0 0 0 3 3h3v-8H5a7 7 0 0 1 14 0h-4v8h3c0 1-1 2-3 2h-2v2h2c4 0 6-2 6-6v-6a9 9 0 0 0-9-9Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    fabric: '<path d="M7 3h10l3 5-8 13L4 8l3-5Zm0 0 5 5 5-5M4 8h16"/>',
    care: '<path d="M5 5h14l-1 15H6L5 5Zm3 4c1 2 2 3 4 3s3-1 4-3"/>'
  };

  const filledIcons = new Set(["home", "school", "formal", "shirt", "sports", "bag", "badge", "spark", "shield", "delivery", "measure", "support", "fabric", "care", "check"]);

  function icon(name) {
    const filled = filledIcons.has(name);
    const attributes = filled
      ? 'fill="currentColor"'
      : 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" ${attributes}>${iconPaths[name] || iconPaths.category}</svg>`;
  }

  function hydrateIcons(root) {
    root.querySelectorAll("[data-icon]").forEach((element) => {
      element.innerHTML = icon(element.dataset.icon);
    });
  }

  function showToast(message) {
    const toast = document.querySelector("[data-toast-root]");
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  function tagTheme(tag, fallback) {
    if (/新品|热门|秋冬/.test(tag)) return "orange";
    if (/校徽|保障|定制/.test(tag)) return "green";
    if (/夏季|轻薄|运动/.test(tag)) return "cyan";
    return fallback || "blue";
  }

  function renderTags(tags, fallback) {
    return `<div class="tag-list">${tags.slice(0, 2).map((tag) => `<span class="tag tag--${tagTheme(tag, fallback)}">${tag}</span>`).join("")}</div>`;
  }

  function renderProductCard(product) {
    return `
      <article class="card product-card">
        <a class="product-card__link" href="product.html?id=${product.id}" aria-label="查看${product.name}">
          <div class="product-card__image-wrap">
            <img class="product-card__image" src="${product.image}" alt="${product.name}商品示意图" width="800" height="800">
          </div>
          <div class="product-card__body">
            <h3 class="product-card__title">${product.name}</h3>
            ${renderTags(product.tags, product.theme)}
            <div class="product-card__price">
              <span class="price"><span class="price__currency">MOP</span>${product.price}</span>
              <del class="price__original">MOP ${product.originalPrice}</del>
            </div>
          </div>
        </a>
        <div class="product-card__footer">
          <span>${product.sales}</span>
          <button class="icon-btn product-card__cart" type="button" aria-label="将${product.name}加入购物车" data-quick-cart data-icon="cart"></button>
        </div>
      </article>`;
  }

  function renderSectionHeading(title, href, linkText, id) {
    return `
      <div class="section-heading">
        <h2 class="section-heading__title"${id ? ` id="${id}"` : ""}>${title}</h2>
        ${href ? `<a class="section-heading__link" href="${href}">${linkText || "查看更多"}${icon("chevronRight")}</a>` : ""}
      </div>`;
  }

  function renderServices(services) {
    return `<div class="service-row">${services.map((service) => `
      <div class="service-item">
        <span class="service-item__icon icon-surface--${service.theme}">${icon(service.icon)}</span>
        <span>${service.label}</span>
      </div>`).join("")}</div>`;
  }

  function renderHome() {
    const root = document.getElementById("main-content");
    root.innerHTML = `
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero__content">
          <p class="hero__eyebrow">${data.hero.eyebrow}</p>
          <h1 class="hero__title" id="hero-title">${data.hero.titleLines.map((line) => `<span>${line}</span>`).join("")}</h1>
          <p class="hero__subtitle">${data.hero.subtitle}</p>
        </div>
        <span class="hero__counter" aria-label="第1张，共4张">1 / 4</span>
      </section>

      <section class="card home-feature-strip" aria-label="快捷服务">
        ${data.homeFeatures.map((feature) => `
          <a class="home-feature" href="${feature.href}">
            <span class="home-feature__icon icon-surface--${feature.theme}">${icon(feature.icon)}</span>
            <span class="home-feature__text"><strong>${feature.label}</strong><small>${feature.copy}</small></span>
          </a>`).join("")}
      </section>

      ${data.schoolZones.map((zone) => `
        <section class="section school-zone" aria-labelledby="school-${zone.id}">
          <div class="section-heading school-zone__heading">
            <div class="school-zone__title-wrap">
              <span class="school-zone__heading-icon">${icon("school")}</span>
              <h2 class="section-heading__title" id="school-${zone.id}">${zone.title}</h2>
              <span class="tag tag--blue">按学校选购</span>
            </div>
            <a class="section-heading__link" href="category.html?category=uniform-set">查看更多${icon("chevronRight")}</a>
          </div>
          <div class="school-zone__grid">${zone.schools.map((school) => `
            <a class="card school-product-card theme-${school.theme}" href="category.html?category=uniform-set" aria-label="选购${school.name}校服">
              <div class="school-product-card__identity">
                <span class="school-product-card__mark" aria-hidden="true">${school.shortName.slice(0, 1)}</span>
                <span><strong>${school.name}</strong><small>指定校服</small></span>
              </div>
              <img class="school-product-card__image" src="${school.image}" alt="${school.name}${school.tag}" width="800" height="800">
              <span class="tag tag--${school.theme}">${school.tag}</span>
            </a>`).join("")}
          </div>
        </section>`).join("")}

      <section class="section" aria-labelledby="hot-title">
        ${renderSectionHeading("热门分类", "category.html", "", "hot-title")}
        <div class="hot-categories">${data.hotCategories.map((category) => `
          <a class="hot-category" href="category.html?category=${category.category}">
            <img class="hot-category__image" src="${category.image}" alt="${category.name}分类" width="800" height="800">
            <p class="hot-category__label">${category.name}</p>
          </a>`).join("")}
        </div>
      </section>

      <section class="section" aria-labelledby="accessory-title">
        ${renderSectionHeading("热销配件", "category.html?category=accessories", "", "accessory-title")}
        <div class="accessory-grid">${data.accessoryProducts.map((product) => `
          <a class="card accessory-card" href="product.html" aria-label="查看${product.name}">
            <img class="accessory-card__image" src="${product.image}" alt="${product.name}" width="800" height="800">
            <h3 class="accessory-card__name">${product.name}</h3>
            <p class="price"><span class="price__currency">MOP</span>${product.price}</p>
          </a>`).join("")}</div>
      </section>

      <section class="section" aria-labelledby="products-title">
        ${renderSectionHeading("热门推荐", "category.html", "", "products-title")}
        <div class="product-grid">${data.products.map(renderProductCard).join("")}</div>
      </section>

      <section class="section" id="service" aria-labelledby="service-title">
        ${renderSectionHeading("服务保障", "", "", "service-title")}
        <div class="card service-panel">${renderServices(data.serviceGuarantees)}</div>
      </section>`;
    hydrateIcons(root);
  }

  function categoryGroupsFor(categoryId) {
    if (categoryId === "all") return data.categoryGroups;
    return data.categoryGroups.filter((group) => group.id === categoryId);
  }

  function renderCategoryContent(categoryId) {
    const content = document.querySelector("[data-category-content]");
    const current = data.categories.find((category) => category.id === categoryId) || data.categories[0];
    const groups = categoryGroupsFor(current.id);
    content.innerHTML = `
      <div class="card category-content__intro">
        <p class="category-content__eyebrow">MC 校园精选</p>
        <h1 class="category-content__title">${current.name}</h1>
      </div>
      ${groups.map((group) => `
        <section class="category-group" aria-labelledby="group-${group.id}">
          <h2 class="category-group__title" id="group-${group.id}">${group.title}</h2>
          <div class="category-grid">${group.items.map((item) => `
            <a class="category-tile" href="product.html" aria-label="查看${item.name}">
              <img class="category-tile__image" src="${item.image}" alt="${item.name}" width="800" height="800">
              <p class="category-tile__label">${item.name}</p>
            </a>`).join("")}</div>
        </section>`).join("")}`;
  }

  function renderCategory() {
    const root = document.getElementById("main-content");
    const requested = new URLSearchParams(window.location.search).get("category");
    const activeId = data.categories.some((category) => category.id === requested) ? requested : "all";
    root.innerHTML = `
      <aside class="category-sidebar" aria-label="一级分类">
        ${data.categories.map((category) => `
          <button class="category-sidebar__item${category.id === activeId ? " is-active" : ""}" type="button" data-category-id="${category.id}" aria-pressed="${category.id === activeId}">${category.name}</button>`).join("")}
      </aside>
      <div class="category-content" data-category-content></div>`;
    renderCategoryContent(activeId);

    root.querySelectorAll("[data-category-id]").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelectorAll("[data-category-id]").forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        renderCategoryContent(button.dataset.categoryId);
        document.querySelector("[data-category-content]").scrollTop = 0;
      });
    });
  }

  function renderProduct() {
    const product = data.productDetail;
    const root = document.getElementById("main-content");
    root.innerHTML = `
      <section class="product-gallery" aria-label="商品图片">
        <img class="product-gallery__image" src="${product.images[0]}" alt="${product.name}正面展示" width="800" height="800" data-gallery-image>
        <button class="icon-btn product-gallery__arrow product-gallery__arrow--prev" type="button" aria-label="上一张商品图片" data-gallery-prev>${icon("chevronLeft")}</button>
        <button class="icon-btn product-gallery__arrow product-gallery__arrow--next" type="button" aria-label="下一张商品图片" data-gallery-next>${icon("chevronRight")}</button>
        <div class="product-gallery__dots" aria-label="商品图片选择">${product.images.map((image, index) => `
          <button class="product-gallery__dot${index === 0 ? " is-active" : ""}" type="button" aria-label="查看第${index + 1}张商品图片" data-gallery-index="${index}"></button>`).join("")}</div>
      </section>

      <section class="product-info" aria-labelledby="product-name">
        <h1 class="product-info__title" id="product-name">${product.name}</h1>
        <p class="product-info__subtitle">${product.subtitle}</p>
        ${renderTags(product.tags, "blue")}
        <div class="price-row">
          <p class="price price--detail"><span class="price__currency">MOP</span>${product.price}<del class="price__original">MOP ${product.originalPrice}</del></p>
          <span class="sales-copy">${product.sales}</span>
        </div>
      </section>

      <section class="product-options" aria-label="商品规格">
        <div class="option-group">
          <div class="option-heading">
            <h2 class="option-heading__title">颜色</h2>
            <span class="option-heading__value" data-color-label>白色</span>
          </div>
          <div class="sku-options" aria-label="选择颜色">${product.colors.map((color, index) => `
            <button class="sku-option sku-option--color sku-option--${color.id}${index === 0 ? " is-selected" : ""}" type="button" data-color="${color.id}" data-label="${color.name}" aria-label="${color.name}" aria-pressed="${index === 0}"${color.disabled ? " disabled" : ""}></button>`).join("")}</div>
        </div>
        <div class="option-group">
          <div class="option-heading">
            <h2 class="option-heading__title">尺码</h2>
            <span class="option-heading__value" data-size-label>请选择尺码</span>
          </div>
          <div class="sku-options" aria-label="选择尺码">${product.sizes.map((size) => `
            <button class="sku-option" type="button" data-size="${size.name}" aria-pressed="false"${size.disabled ? " disabled aria-label=\"3XL 已售罄\"" : ""}>${size.name}</button>`).join("")}</div>
        </div>
        <div class="option-group">
          <div class="option-heading">
            <h2 class="option-heading__title">数量</h2>
            <span class="option-heading__value">单次最多 99 件</span>
          </div>
          <div class="quantity-stepper" aria-label="选择数量">
            <button class="quantity-stepper__button" type="button" aria-label="减少数量" data-quantity-minus disabled>−</button>
            <output class="quantity-stepper__value" aria-live="polite" data-quantity>1</output>
            <button class="quantity-stepper__button" type="button" aria-label="增加数量" data-quantity-plus>＋</button>
          </div>
        </div>
      </section>

      <section class="product-service" aria-label="服务保障">
        ${renderServices([
          { label: "7天无理由", icon: "check", theme: "green" },
          { label: "品质保障", icon: "shield", theme: "green" },
          { label: "配送 / 自提", icon: "delivery", theme: "cyan" }
        ])}
      </section>

      <section class="product-detail" aria-label="商品详细信息">
        <div class="tab-list" role="tablist">${product.tabs.map((tab, index) => `
          <button class="tab${index === 0 ? " is-active" : ""}" type="button" role="tab" id="tab-${index}" aria-selected="${index === 0}" aria-controls="panel-${index}" data-tab="${index}">${tab}</button>`).join("")}</div>
        <div class="tab-panel" id="panel-0" role="tabpanel" aria-labelledby="tab-0" data-panel="0">
          <article class="detail-feature">
            <span class="detail-feature__icon icon-surface--cyan">${icon("fabric")}</span>
            <div><h3 class="detail-feature__title">舒适亲肤面料</h3><p class="detail-feature__copy">清爽透气，满足课堂与日常运动穿着。</p></div>
          </article>
          <article class="detail-feature">
            <span class="detail-feature__icon icon-surface--green">${icon("badge")}</span>
            <div><h3 class="detail-feature__title">支持校徽定制</h3><p class="detail-feature__copy">团体订单可按学校规范制作校徽。</p></div>
          </article>
          <img class="detail-poster" src="assets/banners/product-detail.svg" alt="MC 校园 POLO 套装面料与版型说明" width="750" height="960">
        </div>
        <div class="tab-panel" id="panel-1" role="tabpanel" aria-labelledby="tab-1" data-panel="1" hidden>
          <p class="tab-note">平铺测量存在约 1–2 cm 误差，建议结合日常尺码选择。</p>
          <table class="size-table">
            <thead><tr><th scope="col">尺码</th><th scope="col">衣长</th><th scope="col">胸围</th><th scope="col">肩宽</th></tr></thead>
            <tbody><tr><th scope="row">S</th><td>64</td><td>96</td><td>41</td></tr><tr><th scope="row">M</th><td>66</td><td>100</td><td>43</td></tr><tr><th scope="row">L</th><td>68</td><td>104</td><td>45</td></tr><tr><th scope="row">XL</th><td>70</td><td>108</td><td>47</td></tr></tbody>
          </table>
        </div>
        <div class="tab-panel" id="panel-2" role="tabpanel" aria-labelledby="tab-2" data-panel="2" hidden>
          <div class="care-list">
            <article class="detail-feature"><span class="detail-feature__icon icon-surface--blue">${icon("care")}</span><div><h3 class="detail-feature__title">轻柔机洗</h3><p class="detail-feature__copy">建议使用洗衣袋，水温不高于 30°C。</p></div></article>
            <article class="detail-feature"><span class="detail-feature__icon icon-surface--cyan">${icon("care")}</span><div><h3 class="detail-feature__title">自然晾干</h3><p class="detail-feature__copy">深浅色分开洗涤，避免长时间暴晒。</p></div></article>
          </div>
        </div>
      </section>`;

    renderProductActions();
    bindProductInteractions(product);
  }

  function renderProductActions() {
    const actions = document.querySelector("[data-product-actions]");
    actions.innerHTML = `
      <div class="product-actions__shortcuts">
        <button class="action-shortcut" type="button" data-toast="客服功能暂不在本次 Demo 范围" aria-label="联系客服">${icon("service")}<span>客服</span></button>
        <button class="action-shortcut" type="button" data-favorite aria-label="收藏商品" aria-pressed="false">${icon("heart")}<span>收藏</span></button>
        <button class="action-shortcut" type="button" data-share aria-label="分享商品">${icon("share")}<span>分享</span></button>
      </div>
      <div class="product-actions__buttons">
        <button class="btn btn--secondary" type="button" data-add-cart>加入购物车</button>
        <button class="btn btn--primary" type="button" data-buy-now>立即购买</button>
      </div>`;
  }

  function bindProductInteractions(product) {
    let galleryIndex = 0;
    let quantity = 1;

    function updateGallery(nextIndex) {
      galleryIndex = (nextIndex + product.images.length) % product.images.length;
      const image = document.querySelector("[data-gallery-image]");
      image.src = product.images[galleryIndex];
      image.alt = `${product.name}第${galleryIndex + 1}张展示图`;
      document.querySelectorAll("[data-gallery-index]").forEach((dot, index) => dot.classList.toggle("is-active", index === galleryIndex));
    }

    document.querySelector("[data-gallery-prev]").addEventListener("click", () => updateGallery(galleryIndex - 1));
    document.querySelector("[data-gallery-next]").addEventListener("click", () => updateGallery(galleryIndex + 1));
    document.querySelectorAll("[data-gallery-index]").forEach((dot) => dot.addEventListener("click", () => updateGallery(Number(dot.dataset.galleryIndex))));

    document.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => {
      document.querySelectorAll("[data-color]").forEach((option) => {
        const selected = option === button;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
      document.querySelector("[data-color-label]").textContent = button.dataset.label;
    }));

    document.querySelectorAll("[data-size]").forEach((button) => button.addEventListener("click", () => {
      document.querySelectorAll("[data-size]").forEach((option) => {
        const selected = option === button;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
      document.querySelector("[data-size-label]").textContent = button.dataset.size;
    }));

    function updateQuantity(nextQuantity) {
      quantity = Math.max(1, Math.min(99, nextQuantity));
      document.querySelector("[data-quantity]").textContent = quantity;
      document.querySelector("[data-quantity-minus]").disabled = quantity === 1;
      document.querySelector("[data-quantity-plus]").disabled = quantity === 99;
    }

    document.querySelector("[data-quantity-minus]").addEventListener("click", () => updateQuantity(quantity - 1));
    document.querySelector("[data-quantity-plus]").addEventListener("click", () => updateQuantity(quantity + 1));

    document.querySelectorAll("[data-tab]").forEach((tab) => tab.addEventListener("click", () => {
      document.querySelectorAll("[data-tab]").forEach((item) => {
        const selected = item === tab;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-selected", String(selected));
      });
      document.querySelectorAll("[data-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.panel !== tab.dataset.tab;
      });
    }));

    document.querySelector("[data-favorite]").addEventListener("click", (event) => {
      const button = event.currentTarget;
      const active = !button.classList.contains("is-active");
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.querySelector("span").textContent = active ? "已收藏" : "收藏";
      showToast(active ? "已收藏商品" : "已取消收藏");
    });

    document.querySelectorAll("[data-share]").forEach((button) => button.addEventListener("click", () => showToast("分享功能为 Demo 展示")));
    document.querySelector("[data-add-cart]").addEventListener("click", () => showToast("已加入购物车（Demo）"));
    document.querySelector("[data-buy-now]").addEventListener("click", () => showToast("Demo 暂未接支付"));
  }

  function renderBottomNav() {
    const nav = document.querySelector("[data-bottom-nav]");
    if (!nav) return;
    const items = [
      { id: "home", label: "首页", icon: "home", href: "index.html" },
      { id: "category", label: "分类", icon: "category", href: "category.html" },
      { id: "cart", label: "购物车", icon: "cart", toast: "购物车暂不在本次 Demo 范围" },
      { id: "user", label: "我的", icon: "user", toast: "我的页面暂不在本次 Demo 范围" }
    ];
    nav.innerHTML = items.map((item) => {
      const active = item.id === page;
      const content = `${icon(item.icon)}<span>${item.label}</span>`;
      return item.href
        ? `<a class="bottom-nav__item${active ? " is-active" : ""}" href="${item.href}"${active ? ' aria-current="page"' : ""}>${content}</a>`
        : `<button class="bottom-nav__item" type="button" data-toast="${item.toast}">${content}</button>`;
    }).join("");
  }

  function bindGlobalInteractions() {
    document.addEventListener("click", (event) => {
      const toastTrigger = event.target.closest("[data-toast]");
      if (toastTrigger) showToast(toastTrigger.dataset.toast);

      const quickCart = event.target.closest("[data-quick-cart]");
      if (quickCart) {
        event.preventDefault();
        event.stopPropagation();
        showToast("已加入购物车（Demo）");
      }
    });

    document.querySelectorAll("[data-search-form]").forEach((form) => form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      const keyword = input.value.trim();
      if (!keyword) {
        input.focus();
        showToast("请输入搜索关键词");
        return;
      }
      showToast(`正在搜索“${keyword}”（Demo）`);
    }));
  }

  if (page === "home") renderHome();
  if (page === "category") renderCategory();
  if (page === "product") renderProduct();
  renderBottomNav();
  hydrateIcons(document);
  bindGlobalInteractions();
}());
