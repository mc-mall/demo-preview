const isReferenceTheme = new URLSearchParams(window.location.search).get("theme") === "reference";
document.body.classList.toggle("reference-theme", isReferenceTheme);

function makeThumb(bg, fg, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="280" viewBox="0 0 360 280"><rect width="360" height="280" rx="22" fill="${bg}"/><path d="M62 104h236v118H62z" fill="white" opacity="0.32"/><path d="M104 62h152l36 70H68z" fill="white" opacity="0.48"/><path d="M114 132h132v20H114zm0 38h88v18h-88z" fill="${fg}" opacity="0.28"/><text x="180" y="183" font-family="Arial, sans-serif" font-size="48" font-weight="800" text-anchor="middle" fill="${fg}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const units = [
  { id: "unit-sjs", type: "学校", code: "SJS", name: "圣若瑟教区中学", contact: "校务处", logo: makeThumb("#e6f4ff", "#1769A8", "SJS") },
  { id: "unit-pui-ching", type: "学校", code: "PUICHING", name: "培正中学", contact: "采购负责人", logo: makeThumb("#fff7e6", "#d46b08", "培正") },
  { id: "unit-ho-kong", type: "学校", code: "HOKONG", name: "濠江中学", contact: "校服组", logo: makeThumb("#f1f7ec", "#1769A8", "濠江") },
  { id: "unit-keang-peng", type: "学校", code: "KEANGPENG", name: "镜平学校", contact: "总务处", logo: makeThumb("#eef7ff", "#1b66a1", "镜平") },
  { id: "unit-yuet-wah", type: "学校", code: "YUETWAH", name: "粤华中学", contact: "校务处", logo: makeThumb("#f5f0ff", "#4b3ca7", "粤华") },
  { id: "unit-luso", type: "学校", code: "LUSO", name: "中葡职业技术学校", contact: "采购组", logo: makeThumb("#fff1f0", "#c93535", "中葡") },
  { id: "unit-labour", type: "学校", code: "LABOUR", name: "劳校中学", contact: "校务处", logo: makeThumb("#ecfdf5", "#16805b", "劳校") },
  { id: "unit-salesian", type: "学校", code: "SALESIAN", name: "慈幼中学", contact: "总务组", logo: makeThumb("#f8f0ff", "#7a3db8", "慈幼") },
  { id: "unit-macau-youth", type: "球队", code: "TEAM-MY", name: "澳门青少年球队", contact: "球队领队", logo: makeThumb("#f0f5ff", "#1d39c4", "球队") },
  { id: "unit-mc-retail", type: "企业", code: "MC-RETAIL", name: "MC 自营零售", contact: "运营组", logo: makeThumb("#e6f4ff", "#1769A8", "MC") },
];

const homeBanners = [
  {
    kicker: "MC · SCHOOL ESSENTIALS",
    title: "按学校，\n找到正确校服",
    description: "学校授权商品、清晰尺码与现货状态，一站完成选购。",
    cta: "选择学校 / 单位",
    target: "schoolView",
    image: "./assets/mc-campaign-hero.jpg",
  },
];

const categories = [
  { id: "all", name: "全部商品" },
  { id: "instock", name: "现货商品" },
  { id: "cat-school-short", name: "夏季校服" },
  { id: "cat-winter-coat", name: "冬季外套" },
  { id: "cat-original-tshirt", name: "运动服" },
  { id: "cat-sports-jersey", name: "球队服装" },
  { id: "presale", name: "预售专区" },
];

const categoryBanners = {
  all: {
    eyebrow: "MC · BACK TO SCHOOL",
    title: "开学季装备总览",
    description: "从校服、运动服到球队装备，一站找到合适款式。",
    tone: "blue",
  },
  instock: {
    eyebrow: "READY TO SHIP",
    title: "现货专区",
    description: "优先查看当前可售款式与库存，缩短选购时间。",
    tone: "cyan",
  },
  "cat-school-short": {
    eyebrow: "SUMMER UNIFORM",
    title: "夏季校服",
    description: "轻薄、透气，按学校快速匹配正确校服。",
    tone: "sky",
  },
  "cat-original-tshirt": {
    eyebrow: "SPORTS UNIFORM",
    title: "校园运动服",
    description: "体育课、训练和校园活动的舒适装备。",
    tone: "orange",
  },
  "cat-sports-jersey": {
    eyebrow: "TEAM COLLECTION",
    title: "球队服装",
    description: "训练服、比赛服与团体配色集中选购。",
    tone: "indigo",
  },
  presale: {
    eyebrow: "PRE-ORDER",
    title: "预售专区",
    description: "清晰展示预计到货时间，提前安排新学期装备。",
    tone: "amber",
  },
};

const products = [
  {
    id: "spu-sjs-shirt",
    spuCode: "SPU-SJS-SHIRT-001",
    name: "圣若瑟校服短袖衬衫",
    categoryId: "cat-school-short",
    unitIds: ["unit-sjs"],
    thumb: makeThumb("#e6f4ff", "#1769A8", "校服"),
    gallery: [makeThumb("#e6f4ff", "#1769A8", "主图"), makeThumb("#f0f5ff", "#1769A8", "细节")],
    status: "在售",
    description: "圣若瑟夏季短袖校服衬衫，男女同款标准版型。",
    details: [
      ["面料", "轻薄透气校服面料"],
      ["版型", "男女同款标准版型"],
      ["适用场景", "夏季校园日常穿着"],
      ["配送方式", "澳门本地配送 / 门店自提"],
    ],
    skus: [
      { id: "sku-sjs-white", code: "SKU-SJS-SHIRT-WH-UN-SU", spec: "白色 / 男女款 / 夏季 / M", originalPrice: 228, price: 188, stock: 42, saleable: true },
      { id: "sku-sjs-black", code: "SKU-SJS-SHIRT-BK-UN-SU", spec: "黑色 / 男女款 / 夏季 / S", originalPrice: 228, price: 188, stock: 18, saleable: true },
    ],
  },
  {
    id: "spu-pc-pants",
    spuCode: "SPU-PC-PANTS-021",
    name: "培正中学运动长裤",
    categoryId: "cat-original-tshirt",
    unitIds: ["unit-pui-ching"],
    thumb: makeThumb("#fff7e6", "#d46b08", "运动"),
    gallery: [makeThumb("#fff7e6", "#d46b08", "主图")],
    status: "在售",
    description: "四季可穿运动长裤，适合体育课、训练和日常校服搭配。",
    notice: "库存较低尺码建议尽快下单，门店自提会生成待自提状态。",
    details: [
      ["面料", "耐磨弹力运动面料"],
      ["版型", "中性直筒运动版型"],
      ["适用场景", "体育课 / 训练 / 日常校服搭配"],
      ["配送方式", "澳门本地配送 / 门店自提"],
    ],
    skus: [
      { id: "sku-pc-pants-navy-s", code: "SKU-PC-PANTS-NV-S", spec: "藏青 / S-M / 四季 / M", originalPrice: 278, price: 238, stock: 42, saleable: true },
      { id: "sku-pc-pants-navy-l", code: "SKU-PC-PANTS-NV-L", spec: "藏青 / L-3XL / 四季 / L", originalPrice: 278, price: 238, stock: 7, saleable: true },
    ],
  },
  {
    id: "spu-team-jersey",
    spuCode: "SPU-TEAM-JERSEY-107",
    name: "澳门青少年球队训练服",
    categoryId: "cat-sports-jersey",
    unitIds: ["unit-macau-youth"],
    thumb: makeThumb("#f0f5ff", "#1d39c4", "球衣"),
    gallery: [makeThumb("#f0f5ff", "#1d39c4", "主图")],
    status: "售罄",
    description: "球队训练场景使用，可按队伍需求扩展印号和配色。",
    notice: "当前 SKU 不可售，可通过定制咨询提交补单需求。",
    details: [
      ["面料", "吸湿速干运动面料"],
      ["工艺", "支持印号与队徽扩展"],
      ["适用场景", "球队训练 / 团队活动"],
      ["购买提示", "当前售罄，可提交定制咨询"],
    ],
    skus: [
      { id: "sku-team-red", code: "SKU-TEAM-JERSEY-RD-01", spec: "红白 / 可印号 / 训练款 / 16", originalPrice: 198, price: 168, stock: 0, saleable: false },
      { id: "sku-team-blue", code: "SKU-TEAM-JERSEY-BL-01", spec: "蓝白 / 可印号 / 训练款 / 16", originalPrice: 198, price: 168, stock: 0, saleable: false },
    ],
  },
  {
    id: "spu-winter-coat",
    spuCode: "SPU-SCHOOL-COAT-035",
    name: "校服冬季外套预售款",
    categoryId: "cat-winter-coat",
    unitIds: ["unit-ho-kong", "unit-pui-ching", "unit-sjs"],
    thumb: makeThumb("#f1f7ec", "#1769A8", "外套"),
    gallery: [makeThumb("#f1f7ec", "#1769A8", "主图")],
    status: "预售",
    description: "冬季保暖外套预售商品，预计到货后按付款顺序发货。",
    notice: "预计 2026-08-15 起分批到货，支付成功后进入待备货 / 备货中流程。",
    eta: "2026-08-15",
    details: [
      ["面料", "冬季保暖复合面料"],
      ["版型", "男女同款标准版型"],
      ["适用场景", "冬季校园通勤"],
      ["预售说明", "预计 2026-08-15 起分批到货"],
    ],
    skus: [
      { id: "sku-coat-navy", code: "SKU-COAT-NV-2026", spec: "藏青 / 男女款 / 冬季 / S", originalPrice: 458, price: 388, stock: 260, saleable: true },
      { id: "sku-coat-navy-m", code: "SKU-COAT-NV-2026-M", spec: "藏青 / 男女款 / 冬季 / M", originalPrice: 458, price: 388, stock: 260, saleable: true },
    ],
  },
];

let orders = [
  {
    id: "ORD20260630018",
    createdAt: "2026-06-30 10:24",
    customer: "陈小姐",
    phone: "6688 1024",
    unitId: "unit-sjs",
    items: [{ productId: "spu-sjs-shirt", name: "圣若瑟校服短袖衬衫", sku: "白色 / 男女款 / 夏季 / M", qty: 2, price: 188 }],
    amount: 376,
    paymentMethod: "Mpay",
    paymentStatus: "已支付",
    fulfillmentStatus: "待发货",
    deliveryType: "澳门本地配送",
    afterSaleStatus: "无",
    salesType: "现售",
    nextAction: "等待商家填写物流并发货",
  },
  {
    id: "ORD20260629072",
    createdAt: "2026-06-29 16:08",
    customer: "李同学家长",
    phone: "6281 3390",
    unitId: "unit-pui-ching",
    items: [{ productId: "spu-pc-pants", name: "培正中学运动长裤", sku: "藏青 / L-3XL / 四季 / L", qty: 1, price: 238 }],
    amount: 238,
    paymentMethod: "微信支付",
    paymentStatus: "已支付",
    fulfillmentStatus: "待自提",
    deliveryType: "门店自提",
    pickupStore: "MC 澳门门市",
    afterSaleStatus: "无",
    salesType: "现售",
    nextAction: "到店出示自提码核销",
  },
  {
    id: "ORD20260701026",
    createdAt: "2026-07-01 13:35",
    customer: "何太",
    phone: "6682 4511",
    unitId: "unit-ho-kong",
    items: [{ productId: "spu-winter-coat", name: "校服冬季外套预售款", sku: "藏青 / 男女款 / 冬季 / M", qty: 2, price: 388 }],
    amount: 776,
    paymentMethod: "Mpay",
    paymentStatus: "已支付",
    fulfillmentStatus: "待备货",
    deliveryType: "澳门本地配送",
    afterSaleStatus: "无",
    salesType: "预售",
    nextAction: "等待预售商品到货",
    eta: "2026-08-15",
  },
];

let afterSales = [
  {
    id: "AS20260626001",
    orderId: "ORD20260629072",
    type: "换码",
    status: "处理中",
    product: "培正中学运动长裤",
    reason: "尺码偏小，申请更换大一码。",
  },
];

let leads = [];
let cart = [];
let addresses = [
  {
    id: "ADDR001",
    name: "陈小姐",
    phone: "6688 1024",
    region: "澳门半岛",
    detail: "南湾大马路 88 号 8 楼 A 室",
    tag: "家",
    isDefault: true,
  },
];
let activeView = "homeView";
let previousView = "";
let selectedCategory = "all";
let selectedUnitType = "全部";
let selectedProductId = products[0].id;
let selectedSkuId = products[0].skus[0].id;
let selectedQty = 1;
let selectedOrderId = orders[0].id;
let selectedOrderTab = "全部";
let selectedDelivery = "澳门本地配送";
let pendingOrderId = "";
let selectedPayment = "Mpay";
let loggedIn = false;
let editingAddressId = "";
let pendingDeleteAddressId = "";
let selectedCheckoutAddressId = "";
let addressEditorContext = "addressView";
let selectedProductListUnitId = "";
let directoryMode = "school";
let categoryGroup = "all";
let productListSourceView = "homeView";
let unitProductSort = "综合";
let unitProductPriceAsc = true;

const viewIds = [
  "homeView",
  "schoolView",
  "productListView",
  "categoryView",
  "detailView",
  "cartView",
  "checkoutView",
  "payView",
  "ordersView",
  "orderDetailView",
  "afterSaleView",
  "customView",
  "profileView",
  "addressView",
];

function $(selector) {
  return document.querySelector(selector);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function money(value) {
  return `MOP ${Number(value || 0).toLocaleString("zh-Hans")}`;
}

function getUnit(id) {
  return units.find((unit) => unit.id === id) || units[0];
}

function getProduct(id) {
  return products.find((product) => product.id === id) || products[0];
}

function getSku(product, skuId) {
  return product.skus.find((sku) => sku.id === skuId) || product.skus[0];
}

function getProductUnits(product) {
  return product.unitIds.map((id) => getUnit(id).name).join(" / ");
}

function minPrice(product) {
  return Math.min(...product.skus.map((sku) => sku.price));
}

function statusBadge(status) {
  const type = status === "售罄" || status === "已退款" ? "danger" : status === "预售" || status === "待支付" || status === "待备货" ? "warn" : "";
  return `<span class="badge ${type}">${escapeHtml(status)}</span>`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function navigate(viewId, options = {}) {
  if (!viewIds.includes(viewId)) return;
  if (viewId === "checkoutView" && activeView !== "checkoutView") selectedCheckoutAddressId = "";
  previousView = options.backTo || activeView;
  activeView = viewId;
  viewIds.forEach((id) => $(`#${id}`).classList.toggle("active", id === viewId));
  $(".phone-shell").classList.toggle("has-header", viewId !== "homeView");
  const view = $(`#${viewId}`);
  $("#headerTitle").textContent = view.dataset.title;
  $("#headerKicker").textContent = view.dataset.kicker;
  $("#backBtn").classList.toggle("hidden", ["homeView", "categoryView", "cartView", "ordersView", "profileView"].includes(viewId));
  document.querySelectorAll(".tabbar button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === viewId);
  });
  renderCurrentView();
  if (!options.fromRoute) syncBrowseRoute();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCurrentView() {
  renderCartBadge();
  if (activeView === "homeView") renderHome();
  if (activeView === "schoolView") renderSchools();
  if (activeView === "productListView") renderUnitProductList();
  if (activeView === "categoryView") renderCategory();
  if (activeView === "detailView") renderDetail();
  if (activeView === "cartView") renderCart();
  if (activeView === "checkoutView") renderCheckout();
  if (activeView === "payView") renderPayment();
  if (activeView === "ordersView") renderOrders();
  if (activeView === "orderDetailView") renderOrderDetail();
  if (activeView === "profileView") renderProfile();
  if (activeView === "addressView") renderAddressManager();
}

function renderHome() {
  const banner = isReferenceTheme ? {
    ...homeBanners[0],
    kicker: "MC · BACK TO SCHOOL 2026",
    title: "新学期\n校服报到指南",
    description: "第 1 天，换上合适的新装备。",
    cta: "进入开学季",
  } : homeBanners[0];
  const bannerOverlay = isReferenceTheme
    ? "linear-gradient(180deg, rgba(56, 148, 222, 0.42) 0%, rgba(55, 151, 226, 0.12) 48%, rgba(15, 79, 130, 0.58) 100%)"
    : "linear-gradient(90deg, rgba(15, 79, 130, 0.96) 0%, rgba(23, 105, 168, 0.9) 44%, rgba(23, 105, 168, 0.22) 100%)";
  $("#homeBanner").style.backgroundImage = `${bannerOverlay}, url("${banner.image}")`;
  $("#homeBanner").innerHTML = `
    <div>
      <span>${escapeHtml(banner.kicker)}</span>
      <h2>${escapeHtml(banner.title).replace(/\n/g, "<br>")}</h2>
      <p>${escapeHtml(banner.description)}</p>
      <button class="primary-action" type="button" data-go="${banner.target}">${escapeHtml(banner.cta)}</button>
    </div>
  `;
  $("#unitStrip").innerHTML = units.slice(0, 8).map((unit) => `
    <button class="unit-card" type="button" data-unit="${unit.id}" aria-label="${escapeHtml(unit.name)}">
      <img src="${unit.logo}" alt="" />
      <strong>${escapeHtml(unit.name)}</strong>
      <span>${escapeHtml(unit.type)} · ${products.filter((product) => product.unitIds.includes(unit.id)).length} 件商品</span>
    </button>
  `).join("");
  $("#featuredProducts").innerHTML = products.map(renderProductCard).join("");
  $("#homeBanner [data-go]")?.addEventListener("click", (event) => navigate(event.currentTarget.dataset.go));
  bindProductClicks();
  document.querySelectorAll("[data-unit]").forEach((button) => {
    button.addEventListener("click", () => openUnitProductList(button.dataset.unit));
  });
}

function renderProductCard(product) {
  return `
    <button class="product-card" type="button" data-product="${product.id}">
      <img src="${product.thumb}" alt="" />
      <div>
        <strong>${escapeHtml(product.name)}</strong>
        <small>${escapeHtml(getProductUnits(product))}</small>
        <span class="price-row"><b class="price">${money(minPrice(product))}</b>${statusBadge(product.status)}</span>
      </div>
    </button>
  `;
}

function renderSchools() {
  $("#headerTitle").textContent = directoryMode === "school" ? "学校专区" : "团体单位";
  $("#unitSearch").placeholder = directoryMode === "school" ? "搜索学校名称" : "搜索单位名称";
  document.querySelectorAll("[data-directory]").forEach(button => button.classList.toggle("active", button.dataset.directory === directoryMode));
  const types = directoryMode === "school" ? [] : ["全部", ...new Set(units.filter(unit => unit.type !== "学校").map(unit => unit.type))];
  $("#unitTypeTabs").innerHTML = types.map(type => `<button class="${selectedUnitType === type ? "active" : ""}" type="button" data-unit-type="${type}">${type}</button>`).join("");
  const keyword = $("#unitSearch").value.trim().toLowerCase();
  const rows = units.filter(unit => (directoryMode === "school" ? unit.type === "学校" : unit.type !== "学校") && (selectedUnitType === "全部" || unit.type === selectedUnitType) && `${unit.name} ${unit.code}`.toLowerCase().includes(keyword));
  $("#schoolList").innerHTML = rows.map(unit => `<button class="school-card directory-card" type="button" data-school-products="${unit.id}"><img src="${unit.logo}" alt="" /><span><strong>${escapeHtml(unit.name)}</strong><small>${escapeHtml(unit.type)} · ${products.filter(product => product.unitIds.includes(unit.id)).length} 件商品</small></span><b aria-hidden="true">›</b></button>`).join("") || '<div class="empty-state">没有匹配的学校或单位，请更换关键词。</div>';
  document.querySelectorAll("[data-unit-type]").forEach(button => button.addEventListener("click", () => { selectedUnitType = button.dataset.unitType; renderSchools(); }));
  document.querySelectorAll("[data-school-products]").forEach(button => button.addEventListener("click", () => openUnitProductList(button.dataset.schoolProducts)));
}

function openProductList({ unitId = "", categoryId = "all", keyword = "" } = {}) {
  selectedProductListUnitId = unitId;
  selectedCategory = categoryId;
  if (["homeView", "schoolView", "categoryView"].includes(activeView)) productListSourceView = activeView;
  unitProductSort = "综合";
  unitProductPriceAsc = true;
  $("#unitProductSearch").value = keyword;
  navigate("productListView");
}

function openUnitProductList(unitId) {
  if (units.some(unit => unit.id === unitId)) openProductList({ unitId });
}

function syncBrowseRoute() {
  const params = new URLSearchParams({ view: activeView });
  if (["productListView", "detailView"].includes(activeView)) {
    if (selectedProductListUnitId) params.set("unitId", selectedProductListUnitId);
    params.set("category", selectedCategory);
    params.set("q", $("#unitProductSearch").value);
    params.set("sort", unitProductSort);
    params.set("order", unitProductPriceAsc ? "asc" : "desc");
    params.set("source", productListSourceView);
  }
  if (activeView === "detailView") params.set("product", selectedProductId);
  params.set("directory", directoryMode);
  const hash = `#${params}`;
  if (location.hash !== hash) history.pushState(null, "", hash);
}

function restoreBrowseRoute() {
  const params = new URLSearchParams(location.hash.slice(1));
  const view = params.get("view") || "homeView";
  directoryMode = params.get("directory") === "group" ? "group" : "school";
  selectedUnitType = "全部";
  selectedProductListUnitId = params.get("unitId") || "";
  selectedCategory = categories.some(category => category.id === params.get("category")) ? params.get("category") : "all";
  $("#unitProductSearch").value = params.get("q") || "";
  unitProductSort = ["综合", "价格", "上新"].includes(params.get("sort")) ? params.get("sort") : "综合";
  unitProductPriceAsc = params.get("order") !== "desc";
  productListSourceView = ["homeView", "schoolView", "categoryView"].includes(params.get("source")) ? params.get("source") : "schoolView";
  if (view === "detailView") {
    selectedProductId = getProduct(params.get("product")).id;
    selectedSkuId = getProduct(selectedProductId).skus[0].id;
  }
  navigate(viewIds.includes(view) ? view : "homeView", { fromRoute: true, backTo: view === "detailView" ? "productListView" : "homeView" });
}

function getUnitProductRows() {
  const keyword = $("#unitProductSearch").value.trim().toLowerCase();
  const rows = products.filter((product) => {
    if (selectedProductListUnitId && !product.unitIds.includes(selectedProductListUnitId)) return false;
    if (!matchesProductCategory(product)) return false;
    const searchText = `${product.name} ${product.spuCode} ${product.description} ${getProductUnits(product)} ${product.skus.map((sku) => `${sku.spec} ${sku.code}`).join(" ")}`.toLowerCase();
    return !keyword || searchText.includes(keyword);
  });
  if (unitProductSort === "价格") {
    return rows.sort((a, b) => (minPrice(a) - minPrice(b)) * (unitProductPriceAsc ? 1 : -1));
  }
  if (unitProductSort === "上新") return rows.reverse();
  return rows;
}

function renderUnitProductList() {
  const unit = units.find(item => item.id === selectedProductListUnitId);
  const rows = getUnitProductRows();
  const title = unit?.name || (selectedProductListUnitId ? "归属单位不存在" : categories.find(category => category.id === selectedCategory)?.name || "全部商品");
  $("#productListTitle").textContent = title;
  $("#productListView").dataset.unitId = selectedProductListUnitId;
  $("#productListSummary").textContent = `${title} · ${rows.length} 件商品`;
  $("#clearProductFilters").hidden = !selectedProductListUnitId && selectedCategory === "all" && !$("#unitProductSearch").value;
  document.querySelectorAll("[data-unit-product-sort]").forEach((button) => {
    button.classList.toggle("active", button.dataset.unitProductSort === unitProductSort);
    if (button.dataset.unitProductSort === "价格") {
      button.innerHTML = `价格 <span>${unitProductSort === "价格" ? (unitProductPriceAsc ? "↑" : "↓") : "↕"}</span>`;
    }
  });
  $("#unitProductGrid").innerHTML = rows.length ? rows.map((product) => `
    <article class="unit-product-card">
      <button class="unit-product-main" type="button" data-product="${product.id}">
        <span class="unit-product-image"><img src="${product.thumb}" alt="" /></span>
        <span class="unit-product-name">${escapeHtml(product.name)}</span>
        <small>${escapeHtml(product.description)}</small>
      </button>
      <span class="unit-product-offer" data-status="${product.status}">${product.status === "预售" ? "预售商品" : product.status === "售罄" ? "暂时售罄" : "现货"}</span>
      <span class="unit-product-footer">
        <span class="list-prices"><b>${money(minPrice(product))}</b><del>${money(Math.min(...product.skus.map(sku => sku.originalPrice)))}</del></span>
        <button type="button" ${product.status === "售罄" ? "disabled" : ""} data-unit-list-add-cart="${product.id}" aria-label="将${escapeHtml(product.name)}加入购物车">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l1.8 10.1a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 1.9-1.4L21 7H6.1M9 20h.01M17 20h.01"/></svg>
        </button>
      </span>
    </article>
  `).join("") : `
    <div class="unit-product-empty">
      <strong>暂无匹配商品</strong>
      <span>${escapeHtml(title)}当前没有符合条件的商品。</span>
    </div>
  `;
  observeProductWaterfall();
  bindProductClicks();
  document.querySelectorAll("[data-unit-list-add-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = getProduct(button.dataset.unitListAddCart);
      const sku = product.skus.find((item) => item.saleable && item.stock > 0);
      if (!sku || product.status === "售罄") {
        showToast("当前商品暂不可购买");
        return;
      }
      selectedProductId = product.id;
      selectedSkuId = sku.id;
      selectedQty = 1;
      navigate("detailView");
      showToast("请选择规格后加入购物车");
    });
  });
}

let productWaterfallObserver;
function observeProductWaterfall() {
  productWaterfallObserver?.disconnect();
  const layout = () => document.querySelectorAll("#unitProductGrid .unit-product-card").forEach(card => {
    const span = Math.ceil((card.getBoundingClientRect().height + 12) / 16);
    card.style.gridRowEnd = `span ${span}`;
  });
  productWaterfallObserver = new ResizeObserver(layout);
  document.querySelectorAll("#unitProductGrid .unit-product-card").forEach(card => productWaterfallObserver.observe(card));
}

function matchesProductCategory(product, categoryId = selectedCategory) {
  return categoryId === "all"
    || (categoryId === "instock" && product.status === "在售")
    || product.categoryId === categoryId
    || (categoryId === "presale" && product.status === "预售");
}

function renderCategory() {
  const groups = [{ id: "all", name: "全部分类" }, { id: "uniform", name: "校服" }, { id: "sports", name: "运动服装" }];
  const leaves = categories.filter(category => category.id.startsWith("cat-"));
  const rows = leaves.filter(category => categoryGroup === "all" || (categoryGroup === "uniform" ? ["cat-school-short", "cat-winter-coat"].includes(category.id) : ["cat-original-tshirt", "cat-sports-jersey"].includes(category.id)));
  $("#categoryTabs").innerHTML = groups.map(group => `<button type="button" data-category-group="${group.id}" class="${categoryGroup === group.id ? "active" : ""}" aria-pressed="${categoryGroup === group.id}">${group.name}</button>`).join("");
  $("#categoryResultTitle").textContent = groups.find(group => group.id === categoryGroup).name;
  $("#categoryGrid").innerHTML = rows.map(category => `<button type="button" class="category-entry" data-category="${category.id}"><span><svg viewBox="0 0 48 48" aria-hidden="true"><path d="m16 8-12 8 6 10 6-4v19h16V22l6 4 6-10-12-8c-2 7-14 7-16 0Z" fill="currentColor"/></svg></span><strong>${escapeHtml(category.name)}</strong></button>`).join("");
  document.querySelectorAll("[data-category-group]").forEach(button => button.addEventListener("click", () => { categoryGroup = button.dataset.categoryGroup; renderCategory(); }));
  document.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => openProductList({ categoryId: button.dataset.category })));
}

function bindProductClicks() {
  $(`#${activeView}`).querySelectorAll("[data-product]").forEach((button) => button.addEventListener("click", () => {
    selectedProductId = button.dataset.product;
    selectedSkuId = getProduct(selectedProductId).skus[0].id;
    selectedQty = 1;
    navigate("detailView");
  }));
}

function renderDetail() {
  const product = getProduct(selectedProductId);
  const sku = getSku(product, selectedSkuId);
  $("#productDetail").innerHTML = `
    <div class="detail-gallery"><img src="${product.gallery[0] || product.thumb}" alt="" /></div>
    <article class="detail-card">
      <div class="price-row">${statusBadge(product.status)}<span>${escapeHtml(product.spuCode)}</span></div>
      <h2>${escapeHtml(product.name)}</h2>
      <div class="detail-price-panel">
        <span class="original-price">原价 ${money(sku.originalPrice || sku.price)}</span>
        <strong class="sale-price"><small>折后价</small>${money(sku.price)}</strong>
      </div>
      <div class="service-tags" aria-label="商品服务">
        <span>支持自提</span>
        <span>顺丰上门</span>
        <span>驿站代收</span>
      </div>
      <h3 class="option-title">选择规格</h3>
      <div class="sku-list">
        ${product.skus.map((item) => `
          <button class="sku-option ${item.id === selectedSkuId ? "active" : ""}" type="button" data-sku="${item.id}" ${item.saleable ? "" : "disabled"}>
            <strong>${escapeHtml(item.spec)}</strong>
          </button>
        `).join("")}
      </div>
      <div class="quantity-row">
        <span>购买数量</span>
        <div class="stepper">
          <button type="button" data-qty="-1">−</button><span>${selectedQty}</span><button type="button" data-qty="1">+</button>
        </div>
      </div>
      <div class="summary-line"><span>库存状态</span><strong>${sku.stock > 0 ? `现货 ${sku.stock} 件` : "暂时缺货"}</strong></div>
      ${product.status === "预售" ? `<div class="summary-line"><span>预计到货</span><strong>${escapeHtml(product.eta)}</strong></div>` : ""}
    </article>
    <article class="detail-card product-info-card">
      <h3>商品详情</h3>
      <div class="product-detail-grid">
        ${(product.details || []).map(([label, value]) => `
          <div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>
        `).join("")}
      </div>
    </article>
    <div class="detail-actions">
      <button class="detail-icon-action" type="button" data-detail-service aria-label="联系客服">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 15v-3a7 7 0 0 1 14 0v3M5 15H3v-4h2M19 15h2v-4h-2M19 15v1a4 4 0 0 1-4 4h-2"/></svg>
        <span>客服</span>
      </button>
      <button class="detail-icon-action" type="button" data-detail-cart aria-label="查看购物车">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l1.8 10.1a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 1.9-1.4L21 7H6.1M9 20h.01M17 20h.01"/></svg>
        <span>购物车</span>
        ${cart.reduce((sum, item) => sum + item.qty, 0) ? `<i>${cart.reduce((sum, item) => sum + item.qty, 0)}</i>` : ""}
      </button>
      <button class="primary-action" type="button" data-add-cart>加入购物车</button>
      <button class="primary-action" type="button" data-buy-now>立即购买</button>
    </div>
  `;
  document.querySelectorAll("[data-sku]").forEach((button) => button.addEventListener("click", () => {
    selectedSkuId = button.dataset.sku;
    renderDetail();
  }));
  document.querySelectorAll("[data-qty]").forEach((button) => button.addEventListener("click", () => {
    selectedQty = Math.max(1, selectedQty + Number(button.dataset.qty));
    renderDetail();
  }));
  $("[data-detail-service]").addEventListener("click", () => showToast("客服已收到您的咨询意向"));
  $("[data-detail-cart]").addEventListener("click", () => navigate("cartView"));
  $("[data-add-cart]").addEventListener("click", () => addToCart(product.id, sku.id, selectedQty));
  $("[data-buy-now]").addEventListener("click", () => {
    addToCart(product.id, sku.id, selectedQty, false);
    navigate("checkoutView");
  });
}

function addToCart(productId, skuId, qty, notify = true) {
  const product = getProduct(productId);
  const sku = getSku(product, skuId);
  if (!sku.saleable || product.status === "售罄") {
    showToast("当前规格不可售，可提交定制咨询");
    return;
  }
  const existing = cart.find((item) => item.productId === productId && item.skuId === skuId);
  if (existing) existing.qty += qty;
  else cart.push({ productId, skuId, qty, selected: true });
  renderCartBadge();
  if (notify) showToast("已加入购物车");
}

function renderCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $("#cartBadge").textContent = count;
  $("#cartBadge").classList.toggle("hidden", count === 0);
  const detailCartButton = $("[data-detail-cart]");
  if (detailCartButton) {
    detailCartButton.querySelector("i")?.remove();
    if (count) detailCartButton.insertAdjacentHTML("beforeend", `<i>${count}</i>`);
  }
}

function cartRows() {
  return cart.map((item) => {
    const product = getProduct(item.productId);
    const sku = getSku(product, item.skuId);
    return { ...item, product, sku, amount: sku.price * item.qty };
  });
}

function cartAmount() {
  return cartRows().reduce((sum, item) => sum + item.amount, 0);
}

function renderCart() {
  const rows = cartRows();
  $("#cartList").innerHTML = rows.length ? rows.map((item, index) => `
    <article class="cart-row">
      <img src="${item.product.thumb}" alt="" />
      <div>
        <strong>${escapeHtml(item.product.name)}</strong>
        <small>${escapeHtml(item.sku.spec)}</small>
        <span class="price-row"><b class="price">${money(item.sku.price)}</b><button class="small-action" type="button" data-remove-cart="${index}">删除</button></span>
        <div class="quantity-row">
          <small>${escapeHtml(getProductUnits(item.product))}</small>
          <div class="stepper">
            <button type="button" data-cart-qty="${index}|-1">−</button><span>${item.qty}</span><button type="button" data-cart-qty="${index}|1">+</button>
          </div>
        </div>
      </div>
    </article>
  `).join("") : `<div class="empty-state">购物车是空的，先去选择学校或商品。</div>`;
  $("#cartTotal").textContent = money(cartAmount());
  document.querySelectorAll("[data-remove-cart]").forEach((button) => button.addEventListener("click", () => {
    cart.splice(Number(button.dataset.removeCart), 1);
    renderCart();
  }));
  document.querySelectorAll("[data-cart-qty]").forEach((button) => button.addEventListener("click", () => {
    const [index, delta] = button.dataset.cartQty.split("|").map(Number);
    cart[index].qty = Math.max(1, cart[index].qty + delta);
    renderCart();
  }));
}

function renderCheckout() {
  if (!cart.length) {
    navigate("cartView");
    showToast("请先选择商品");
    return;
  }
  const rows = cartRows();
  $("#checkoutItems").innerHTML = rows.map((item) => `
    <div class="summary-item">
      <span>${escapeHtml(item.product.name)}<br><small>${escapeHtml(item.sku.spec)} × ${item.qty}</small></span>
      <strong>${money(item.amount)}</strong>
    </div>
  `).join("");
  const subtotal = cartAmount();
  const shipping = selectedDelivery === "澳门本地配送" && subtotal < 200 ? 15 : 0;
  $("#checkoutSubtotal").textContent = money(subtotal);
  $("#shippingFee").textContent = money(shipping);
  $("#payableAmount").textContent = money(subtotal + shipping);
  $("#addressField").classList.toggle("hidden", selectedDelivery !== "澳门本地配送");
  $("#pickupField").classList.toggle("hidden", selectedDelivery !== "门店自提");
  if (selectedDelivery === "澳门本地配送") renderCheckoutAddress();
  document.querySelectorAll("[data-delivery]").forEach((button) => {
    button.classList.toggle("active", button.dataset.delivery === selectedDelivery);
  });
}

function getCheckoutAddress() {
  const selected = getAddress(selectedCheckoutAddressId);
  if (selected) return selected;
  const fallback = addresses.find((address) => address.isDefault) || addresses[0];
  selectedCheckoutAddressId = fallback?.id || "";
  return fallback;
}

function renderCheckoutAddress() {
  const address = getCheckoutAddress();
  $("#checkoutAddressPanel").innerHTML = address ? `
    <article class="checkout-address-card">
      <div class="address-card-head">
        <div><strong>${escapeHtml(address.name)}</strong><span>${escapeHtml(address.phone)}</span></div>
        ${address.isDefault ? `<span class="default-badge">默认地址</span>` : ""}
      </div>
      <p>${escapeHtml(address.region)} · ${escapeHtml(address.detail)}</p>
      <button class="small-action" type="button" data-change-checkout-address>修改收货地址</button>
    </article>
  ` : `
    <div class="checkout-address-empty">
      <p>暂无收货地址，请先添加后再提交订单。</p>
      <button class="primary-action" type="button" data-add-checkout-address>添加收货地址</button>
    </div>
  `;
  $("[data-change-checkout-address]")?.addEventListener("click", openCheckoutAddressChooser);
  $("[data-add-checkout-address]")?.addEventListener("click", () => openAddressEditor("", "checkout"));
}

function openCheckoutAddressChooser() {
  $("#checkoutAddressOptions").innerHTML = addresses.map((address) => `
    <button class="checkout-address-option ${address.id === selectedCheckoutAddressId ? "active" : ""}" type="button" data-select-checkout-address="${address.id}">
      <span><strong>${escapeHtml(address.name)} · ${escapeHtml(address.phone)}</strong><small>${escapeHtml(address.region)} · ${escapeHtml(address.detail)}</small></span>
      <b>${address.id === selectedCheckoutAddressId ? "已选择" : "选择"}</b>
    </button>
  `).join("");
  document.querySelectorAll("[data-select-checkout-address]").forEach((button) => button.addEventListener("click", () => {
    selectedCheckoutAddressId = button.dataset.selectCheckoutAddress;
    $("#checkoutAddressDialog").close();
    renderCheckoutAddress();
  }));
  $("#checkoutAddressDialog").showModal();
}

function submitOrder() {
  if (!loggedIn) {
    $("#loginDialog").showModal();
    showToast("请先登录后下单");
    return;
  }
  const checkoutAddress = selectedDelivery === "澳门本地配送" ? getCheckoutAddress() : null;
  if (selectedDelivery === "澳门本地配送" && !checkoutAddress) {
    showToast("请先添加收货地址");
    return;
  }
  const contactAddress = checkoutAddress || addresses.find((address) => address.isDefault) || addresses[0];
  const rows = cartRows();
  const subtotal = cartAmount();
  const shipping = selectedDelivery === "澳门本地配送" && subtotal < 200 ? 15 : 0;
  const hasPresale = rows.some((item) => item.product.status === "预售");
  const id = `ORD${Date.now().toString().slice(-10)}`;
  const order = {
    id,
    createdAt: "2026-07-07 15:30",
    customer: contactAddress?.name || "H5 客户",
    phone: contactAddress?.phone || "",
    unitId: rows[0].product.unitIds[0],
    items: rows.map((item) => ({ productId: item.product.id, name: item.product.name, sku: item.sku.spec, qty: item.qty, price: item.sku.price })),
    amount: subtotal + shipping,
    paymentMethod: selectedPayment,
    paymentStatus: "待支付",
    fulfillmentStatus: hasPresale ? "待备货" : selectedDelivery === "门店自提" ? "待自提" : "待发货",
    deliveryType: selectedDelivery,
    shippingAddress: checkoutAddress ? `${checkoutAddress.region} ${checkoutAddress.detail}` : "",
    pickupStore: selectedDelivery === "门店自提" ? "澳設黑沙環門市" : "",
    afterSaleStatus: "无",
    salesType: hasPresale ? "预售" : "现售",
    nextAction: "选择支付方式并完成支付",
    eta: hasPresale ? "2026-08-15" : "",
  };
  orders.unshift(order);
  pendingOrderId = id;
  selectedOrderId = id;
  cart = [];
  renderCartBadge();
  navigate("payView");
}

function renderPayment() {
  const order = orders.find((item) => item.id === pendingOrderId) || orders[0];
  $("#paymentPanel").innerHTML = `
    <h3>${escapeHtml(order.id)}</h3>
    <p>${escapeHtml(order.salesType)} · ${escapeHtml(order.deliveryType)} · ${escapeHtml(order.paymentStatus)}</p>
    <div class="summary-line total"><span>应付金额</span><strong>${money(order.amount)}</strong></div>
    <div class="payment-choice">
      <button class="${selectedPayment === "Mpay" ? "active" : ""}" type="button" data-pay-method="Mpay">
        <span><strong>Mpay 渠道收银台</strong><small>H5 主推，跳转或拉起 Mpay 完成支付</small></span><b>推荐</b>
      </button>
      <button class="${selectedPayment === "微信支付" ? "active" : ""}" type="button" data-pay-method="微信支付">
        <span><strong>微信支付</strong><small>小程序内原生支付路径演示</small></span><b>小程序</b>
      </button>
    </div>
    <button id="confirmPayBtn" class="primary-action block" type="button">模拟支付成功</button>
    <button id="payFailBtn" class="ghost-action" type="button">模拟支付失败 / 稍后重试</button>
  `;
  document.querySelectorAll("[data-pay-method]").forEach((button) => button.addEventListener("click", () => {
    selectedPayment = button.dataset.payMethod;
    renderPayment();
  }));
  $("#confirmPayBtn").addEventListener("click", () => {
    order.paymentMethod = selectedPayment;
    order.paymentStatus = "已支付";
    order.nextAction = order.salesType === "预售" ? "等待预售商品到货" : order.deliveryType === "门店自提" ? "等待门店通知自提" : "等待商家发货";
    showToast("支付成功，订单状态已同步");
    navigate("orderDetailView");
  });
  $("#payFailBtn").addEventListener("click", () => {
    showToast("支付未完成，可在订单详情继续支付");
    navigate("orderDetailView");
  });
}

function renderOrders() {
  const tabs = ["全部", "待支付", "待发货", "待自提", "预售", "售后"];
  $("#orderTabs").innerHTML = tabs.map((tab) => `<button class="${selectedOrderTab === tab ? "active" : ""}" type="button" data-order-tab="${tab}">${tab}</button>`).join("");
  const rows = orders.filter((order) => {
    if (selectedOrderTab === "全部") return true;
    if (selectedOrderTab === "预售") return order.salesType === "预售";
    if (selectedOrderTab === "售后") return order.afterSaleStatus !== "无";
    return order.paymentStatus === selectedOrderTab || order.fulfillmentStatus === selectedOrderTab;
  });
  $("#orderList").innerHTML = rows.length ? rows.map((order) => `
    <article class="order-card">
      <div class="order-meta"><strong>${escapeHtml(order.id)}</strong>${statusBadge(order.paymentStatus)}</div>
      <small>${escapeHtml(order.createdAt)} · ${escapeHtml(order.salesType)} · ${escapeHtml(order.deliveryType)}</small>
      <div>${order.items.map((item) => `<small>${escapeHtml(item.name)} / ${escapeHtml(item.sku)} × ${item.qty}</small>`).join("")}</div>
      <div class="summary-line"><span>${escapeHtml(order.fulfillmentStatus)}</span><strong>${money(order.amount)}</strong></div>
      <div class="order-actions"><button type="button" data-order-detail="${order.id}">查看详情</button></div>
    </article>
  `).join("") : `<div class="empty-state">当前状态没有订单。</div>`;
  document.querySelectorAll("[data-order-tab]").forEach((button) => button.addEventListener("click", () => {
    selectedOrderTab = button.dataset.orderTab;
    renderOrders();
  }));
  document.querySelectorAll("[data-order-detail]").forEach((button) => button.addEventListener("click", () => {
    selectedOrderId = button.dataset.orderDetail;
    navigate("orderDetailView");
  }));
}

function renderOrderDetail() {
  const order = orders.find((item) => item.id === selectedOrderId) || orders[0];
  $("#orderDetail").innerHTML = `
    <article class="detail-card">
      <div class="order-meta"><strong>${escapeHtml(order.id)}</strong>${statusBadge(order.paymentStatus)}</div>
      <small>${escapeHtml(order.createdAt)} · ${escapeHtml(order.salesType)} · ${escapeHtml(order.deliveryType)}</small>
      <div class="summary-line"><span>履约状态</span><strong>${escapeHtml(order.fulfillmentStatus)}</strong></div>
      ${order.eta ? `<div class="summary-line"><span>预计到货</span><strong>${escapeHtml(order.eta)}</strong></div>` : ""}
      ${order.pickupStore ? `<div class="summary-line"><span>自提门店</span><strong>${escapeHtml(order.pickupStore)}</strong></div>` : ""}
      <h3>商品明细</h3>
      ${order.items.map((item) => `<div class="summary-item"><span>${escapeHtml(item.name)}<br><small>${escapeHtml(item.sku)} × ${item.qty}</small></span><strong>${money(item.price * item.qty)}</strong></div>`).join("")}
      <div class="summary-line total"><span>实付金额</span><strong>${money(order.amount)}</strong></div>
      <h3>进度</h3>
      <ul class="timeline">
        <li>订单已创建，库存已锁定</li>
        <li>${order.paymentStatus === "已支付" ? "支付成功，后台已收到状态" : "等待支付或支付结果查询"}</li>
        <li>${escapeHtml(order.nextAction)}</li>
      </ul>
      <div class="detail-actions">
        ${order.paymentStatus === "待支付" ? `<button class="primary-action" type="button" data-continue-pay>继续支付</button>` : `<button class="primary-action" type="button" data-contact>联系客服</button>`}
        <button class="primary-action" type="button" data-open-aftersale>申请售后</button>
      </div>
    </article>
  `;
  $("[data-continue-pay]")?.addEventListener("click", () => {
    pendingOrderId = order.id;
    navigate("payView");
  });
  $("[data-contact]")?.addEventListener("click", () => showToast("已记录客服点击，可形成行为线索"));
  $("[data-open-aftersale]").addEventListener("click", () => navigate("afterSaleView"));
}

function renderProfile() {
  const paidOrders = orders.filter((order) => order.paymentStatus === "已支付");
  const memberPoints = loggedIn ? Math.floor(paidOrders.reduce((sum, order) => sum + order.amount, 0)) : 0;
  const pendingPaymentCount = orders.filter((order) => order.paymentStatus === "待支付").length;
  const pendingShipmentCount = orders.filter((order) => ["待发货", "待拣货"].includes(order.fulfillmentStatus)).length;
  const pendingPickupCount = orders.filter((order) => order.fulfillmentStatus === "待自提").length;
  $("#profilePanel").innerHTML = `
    <section class="member-center">
      <div class="member-hero">
        <div class="member-hero-top">
          <button class="member-menu-button" type="button" data-member-action="security" aria-label="会员设置">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg>
          </button>
          <span>MC MEMBER</span>
        </div>
        <div class="member-identity">
          <div class="member-avatar">${loggedIn ? "陈" : "MC"}</div>
          <div>
            ${isReferenceTheme ? `<span class="member-tier">${loggedIn ? "MC BLUE MEMBER" : "WELCOME TO MC"}</span>` : ""}
            <strong>${loggedIn ? "陈小姐" : "欢迎来到 MC"}</strong>
            <small>${loggedIn ? "6688 1024 · 小程序 / H5 共用账号" : "登录后同步订单、积分与售后"}</small>
          </div>
          <button type="button" data-profile-login>${loggedIn ? "会员码" : "登录 / 注册"}</button>
        </div>
        <div class="member-stats">
          <button type="button" data-member-action="points"><b>${memberPoints}</b><span>积分</span></button>
          <button type="button" data-go="addressView"><b>${addresses.length}</b><span>地址</span></button>
        </div>
      </div>

      <section class="member-panel member-order-panel">
        <div class="member-panel-head">
          <h3>我的订单</h3>
          <button type="button" data-profile-order-tab="全部">全部订单 ›</button>
        </div>
        <div class="member-order-grid">
          <button type="button" data-profile-order-tab="待支付">
            <span class="member-order-icon"><svg viewBox="0 0 24 24"><path d="M4 7h16v12H4zM7 7V5h10v2M7 12h5"/></svg>${pendingPaymentCount ? `<i>${pendingPaymentCount}</i>` : ""}</span><b>待付款</b>
          </button>
          <button type="button" data-profile-order-tab="待发货">
            <span class="member-order-icon"><svg viewBox="0 0 24 24"><path d="m4 8 8-4 8 4-8 4zM4 8v8l8 4 8-4V8M12 12v8"/></svg>${pendingShipmentCount ? `<i>${pendingShipmentCount}</i>` : ""}</span><b>待发货</b>
          </button>
          <button type="button" data-profile-order-tab="待自提">
            <span class="member-order-icon"><svg viewBox="0 0 24 24"><path d="M3 7h12v10H3zM15 10h3l3 3v4h-6zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>${pendingPickupCount ? `<i>${pendingPickupCount}</i>` : ""}</span><b>待自提</b>
          </button>
          <button type="button" data-profile-order-tab="售后">
            <span class="member-order-icon"><svg viewBox="0 0 24 24"><path d="M5 5h14v11H8l-3 3zM9 10h6"/></svg>${afterSales.length ? `<i>${afterSales.length}</i>` : ""}</span><b>退款/售后</b>
          </button>
        </div>
      </section>

      ${isReferenceTheme ? `
        <div class="member-section-heading">
          <div><span>MC SERVICES</span><h3>常用服务</h3></div>
          <small>校服购买与会员服务</small>
        </div>
      ` : ""}

      <section class="member-service-grid">
        <button type="button" data-member-action="points"><span>积分权益</span><small>${memberPoints} 积分可用</small><b>◎</b></button>
        <button type="button" data-go="customView"><span>定制咨询</span><small>团体与学校合作</small><b>◇</b></button>
        <button type="button" data-member-action="store"><span>门店服务</span><small>澳门门店与自提</small><b>⌂</b></button>
        <button type="button" data-contact-service><span>联系客服</span><small>WhatsApp / 电话</small><b>◌</b></button>
      </section>

      <section class="member-menu-list">
        <button type="button" data-go="cartView"><span>购物车</span><b>›</b></button>
        <button type="button" data-go="addressView"><span>收货地址</span><b>${addresses.length} 个 ›</b></button>
        <button type="button" data-go="customView"><span>定制 / 团购咨询</span><b>›</b></button>
        <button type="button" data-member-action="security"><span>账号与安全</span><b>›</b></button>
      </section>
    </section>
  `;
  $("[data-profile-login]").addEventListener("click", () => {
    if (loggedIn) $("#memberCodeDialog").showModal();
    else $("#loginDialog").showModal();
  });
  document.querySelectorAll("[data-profile-order-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedOrderTab = button.dataset.profileOrderTab;
      navigate("ordersView");
    });
  });
  document.querySelectorAll("[data-member-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const messages = {
        points: `当前可用积分 ${memberPoints}`,
        store: "澳設黑沙環门市支持到店自提",
        security: "账号与安全功能已预留",
      };
      showToast(messages[button.dataset.memberAction] || "功能已预留");
    });
  });
  $("[data-contact-service]").addEventListener("click", () => showToast("已记录客服联系行为线索"));
  bindGoButtons();
}

function addressRowsMarkup() {
  return addresses.length ? addresses.map((address) => `
    <article class="address-card">
      <div class="address-card-head">
        <div><strong>${escapeHtml(address.name)}</strong><span>${escapeHtml(address.phone)}</span></div>
        <div class="address-badges">
          ${address.tag ? `<span>${escapeHtml(address.tag)}</span>` : ""}
          ${address.isDefault ? `<span class="default-badge">默认</span>` : ""}
        </div>
      </div>
      <p>${escapeHtml(address.region)} · ${escapeHtml(address.detail)}</p>
      <div class="address-actions">
        ${address.isDefault ? `<span class="default-hint">当前默认地址</span>` : `<button class="text-btn" type="button" data-address-default="${address.id}">设为默认</button>`}
        <div>
          <button class="small-action" type="button" data-address-view="${address.id}">查看</button>
          <button class="small-action" type="button" data-address-edit="${address.id}">编辑</button>
          <button class="small-action danger-text" type="button" data-address-delete="${address.id}">删除</button>
        </div>
      </div>
    </article>
  `).join("") : `<div class="empty-state">暂无收货地址，点击“新增地址”开始添加。</div>`;
}

function renderAddressManager() {
  $("#addressManagerPanel").innerHTML = `
    <section class="address-manager-card standalone">
      <div class="section-head">
        <div><h3>收货地址</h3><small>共 ${addresses.length} 个地址</small></div>
        <button class="small-action" type="button" data-address-add>新增地址</button>
      </div>
      <div class="address-list">${addressRowsMarkup()}</div>
    </section>
  `;
  $("[data-address-add]").addEventListener("click", () => openAddressEditor("", "addressView"));
  document.querySelectorAll("[data-address-view]").forEach((button) => button.addEventListener("click", () => openAddressDetail(button.dataset.addressView)));
  document.querySelectorAll("[data-address-edit]").forEach((button) => button.addEventListener("click", () => openAddressEditor(button.dataset.addressEdit, "addressView")));
  document.querySelectorAll("[data-address-delete]").forEach((button) => button.addEventListener("click", () => openAddressDelete(button.dataset.addressDelete)));
  document.querySelectorAll("[data-address-default]").forEach((button) => button.addEventListener("click", () => setDefaultAddress(button.dataset.addressDefault)));
}

function getAddress(addressId) {
  return addresses.find((address) => address.id === addressId);
}

function openAddressEditor(addressId = "", context = "addressView") {
  const address = getAddress(addressId);
  editingAddressId = address?.id || "";
  addressEditorContext = context;
  $("#addressDialogTitle").textContent = address ? "编辑收货地址" : "新增收货地址";
  $("#addressName").value = address?.name || "";
  $("#addressPhone").value = address?.phone || "";
  $("#addressRegion").value = address?.region || "";
  $("#addressDetail").value = address?.detail || "";
  $("#addressTag").value = address?.tag || "";
  $("#addressIsDefault").checked = address?.isDefault || addresses.length === 0;
  $("#addressDialog").showModal();
}

function saveAddress() {
  const name = $("#addressName").value.trim();
  const phone = $("#addressPhone").value.trim();
  const region = $("#addressRegion").value;
  const detail = $("#addressDetail").value.trim();
  if (!name || !phone || !region || !detail) {
    showToast("请完整填写收货人、电话和地址");
    return;
  }
  const current = getAddress(editingAddressId);
  const isDefault = $("#addressIsDefault").checked || addresses.length === 0;
  if (isDefault) addresses.forEach((address) => { address.isDefault = false; });
  const nextAddress = {
    id: current?.id || `ADDR${Date.now().toString().slice(-8)}`,
    name,
    phone,
    region,
    detail,
    tag: $("#addressTag").value.trim(),
    isDefault,
  };
  if (current) Object.assign(current, nextAddress);
  else addresses.unshift(nextAddress);
  if (!addresses.some((address) => address.isDefault)) addresses[0].isDefault = true;
  if (addressEditorContext === "checkout") selectedCheckoutAddressId = nextAddress.id;
  $("#addressDialog").close();
  refreshAddressSurface();
  showToast(current ? "收货地址已更新" : "收货地址已新增");
}

function refreshAddressSurface() {
  if (activeView === "checkoutView") renderCheckout();
  else if (activeView === "addressView") renderAddressManager();
  else if (activeView === "profileView") renderProfile();
}

function openAddressDetail(addressId) {
  const address = getAddress(addressId);
  if (!address) return;
  $("#addressDetailPanel").innerHTML = `
    <div><span>收货人</span><strong>${escapeHtml(address.name)}</strong></div>
    <div><span>联系电话</span><strong>${escapeHtml(address.phone)}</strong></div>
    <div><span>所在区域</span><strong>${escapeHtml(address.region)}</strong></div>
    <div><span>详细地址</span><strong>${escapeHtml(address.detail)}</strong></div>
    <div><span>地址标签</span><strong>${escapeHtml(address.tag || "未设置")}</strong></div>
    <div><span>默认地址</span><strong>${address.isDefault ? "是" : "否"}</strong></div>
  `;
  $("#addressDetailDialog").showModal();
}

function openAddressDelete(addressId) {
  const address = getAddress(addressId);
  if (!address) return;
  pendingDeleteAddressId = address.id;
  $("#addressDeleteMessage").textContent = `确认删除 ${address.name} 的收货地址吗？删除后无法恢复。`;
  $("#addressDeleteDialog").showModal();
}

function deleteAddress() {
  const index = addresses.findIndex((address) => address.id === pendingDeleteAddressId);
  if (index < 0) return;
  const wasDefault = addresses[index].isDefault;
  const deletedId = addresses[index].id;
  addresses.splice(index, 1);
  if (wasDefault && addresses.length) addresses[0].isDefault = true;
  if (selectedCheckoutAddressId === deletedId) selectedCheckoutAddressId = "";
  pendingDeleteAddressId = "";
  $("#addressDeleteDialog").close();
  refreshAddressSurface();
  showToast("收货地址已删除");
}

function setDefaultAddress(addressId) {
  if (!getAddress(addressId)) return;
  addresses.forEach((address) => { address.isDefault = address.id === addressId; });
  refreshAddressSurface();
  showToast("默认收货地址已更新");
}

function submitAfterSale() {
  const order = orders.find((item) => item.id === selectedOrderId) || orders[0];
  order.afterSaleStatus = "售后中";
  afterSales.unshift({
    id: `AS${Date.now().toString().slice(-8)}`,
    orderId: order.id,
    type: $("#afterSaleType").value,
    status: "售后发起",
    product: order.items[0].name,
    reason: $("#afterSaleReason").value.trim(),
  });
  showToast("售后已提交，后台售后订单可审核");
  navigate("orderDetailView");
}

function submitLead() {
  leads.unshift({
    id: `OPP${Date.now().toString().slice(-8)}`,
    title: $("#leadNeed").value.trim().slice(0, 18) || "H5 定制咨询",
    customer: $("#leadName").value.trim(),
    phone: $("#leadPhone").value.trim(),
    type: $("#leadType").value,
    status: "新线索",
  });
  loggedIn = true;
  updateLoginState();
  showToast("咨询已提交，后台 CRM 将生成新线索");
  navigate("profileView");
}

function updateLoginState() {
  $("#loginShortcut").textContent = loggedIn ? "陈" : "未";
}

function bindGoButtons() {
  document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => { if (button.dataset.go === "schoolView") { directoryMode = "school"; selectedUnitType = "全部"; $("#unitSearch").value = ""; } navigate(button.dataset.go); }));
}

function bindEvents() {
  bindGoButtons();
  document.querySelectorAll(".tabbar button").forEach((button) => button.addEventListener("click", () => {
    const lockedTabs = ["cartView", "ordersView", "profileView"];
    if (!loggedIn && lockedTabs.includes(button.dataset.tab)) {
      $("#loginDialog").showModal();
      showToast("请先登录后查看");
      return;
    }
    navigate(button.dataset.tab);
  }));
  $("#backBtn").addEventListener("click", () => navigate(previousView || "homeView"));
  $("#loginShortcut").addEventListener("click", () => $("#loginDialog").showModal());
  $("#quickWechatLogin").addEventListener("click", () => {
    loggedIn = true;
    updateLoginState();
    $("#loginDialog").close();
    showToast("微信一键登录成功");
    if (activeView === "profileView") renderProfile();
  });
  $("#phoneLoginBtn").addEventListener("click", () => {
    if ($("#loginCode").value.trim() !== "123456") {
      showToast("验证码应为 123456");
      return;
    }
    loggedIn = true;
    updateLoginState();
    $("#loginDialog").close();
    showToast("手机号登录成功");
    if (activeView === "profileView") renderProfile();
  });
  $("[data-search-trigger]").addEventListener("click", () => {
    openProductList({ keyword: $("#homeSearch").value });
  });
  $("#homeSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      openProductList({ keyword: $("#homeSearch").value });
    }
  });
  document.querySelectorAll("[data-home-category]").forEach((button) => {
    button.addEventListener("click", () => {
      openProductList({ categoryId: button.dataset.homeCategory });
    });
  });
  $("#unitSearch").addEventListener("input", renderSchools);
  const openDirectory = mode => { directoryMode = mode; selectedUnitType = "全部"; $("#unitSearch").value = ""; navigate("schoolView"); };
  document.querySelectorAll("[data-directory]").forEach(button => button.addEventListener("click", () => openDirectory(button.dataset.directory)));
  document.querySelectorAll("[data-directory-entry]").forEach(button => button.addEventListener("click", () => openDirectory(button.dataset.directoryEntry)));
  $("#clearProductFilters").addEventListener("click", () => openProductList());
  $("#unitProductSearch").addEventListener("input", () => { renderUnitProductList(); syncBrowseRoute(); });
  $("#productListBackBtn").addEventListener("click", () => navigate(productListSourceView || "schoolView"));
  document.querySelectorAll("[data-unit-product-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextSort = button.dataset.unitProductSort;
      if (nextSort === "价格" && unitProductSort === "价格") unitProductPriceAsc = !unitProductPriceAsc;
      else {
        unitProductSort = nextSort;
        if (nextSort === "价格") unitProductPriceAsc = true;
      }
      renderUnitProductList();
      syncBrowseRoute();
    });
  });
  document.querySelectorAll("[data-scroll-top]").forEach((button) => {
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  });
  $("#checkoutBtn").addEventListener("click", () => {
    selectedCheckoutAddressId = "";
    navigate("checkoutView");
  });
  document.querySelectorAll("[data-delivery]").forEach((button) => button.addEventListener("click", () => {
    selectedDelivery = button.dataset.delivery;
    renderCheckout();
  }));
  $("#submitOrderBtn").addEventListener("click", submitOrder);
  $("#submitAfterSaleBtn").addEventListener("click", submitAfterSale);
  $("#submitLeadBtn").addEventListener("click", submitLead);
  $("#saveAddressBtn").addEventListener("click", saveAddress);
  $("#confirmDeleteAddressBtn").addEventListener("click", deleteAddress);
  $("#addCheckoutAddressBtn").addEventListener("click", () => {
    $("#checkoutAddressDialog").close();
    openAddressEditor("", "checkout");
  });
}

bindEvents();
renderHome();
renderCartBadge();
updateLoginState();

window.addEventListener("popstate", restoreBrowseRoute);
restoreBrowseRoute();
