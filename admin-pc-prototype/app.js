function makeThumb(bg, fg, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="10" fill="${bg}"/><path d="M18 30h60v42H18z" fill="white" opacity="0.28"/><path d="M30 22h36l8 18H22z" fill="white" opacity="0.44"/><text x="48" y="58" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" fill="${fg}">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const sales = [
  9200, 10450, 9800, 11200, 12800, 11850, 13400, 14750, 13900, 15100,
  16650, 15800, 17200, 18100, 17450, 19300, 20550, 19800, 21200, 22600,
  21950, 23600, 24100, 23200, 25500, 26850, 24900, 27600, 28950, 30400,
];

const categories = [
  { id: "cat-original", parentId: null, name: "原创产品" },
  { id: "cat-original-top", parentId: "cat-original", name: "上衣" },
  { id: "cat-original-tshirt", parentId: "cat-original-top", name: "T恤" },
  { id: "cat-original-shirt", parentId: "cat-original-top", name: "衬衫" },
  { id: "cat-school", parentId: null, name: "校服产品" },
  { id: "cat-school-summer", parentId: "cat-school", name: "夏季校服" },
  { id: "cat-school-short", parentId: "cat-school-summer", name: "短袖衬衫" },
  { id: "cat-sports", parentId: null, name: "运动产品" },
  { id: "cat-sports-team", parentId: "cat-sports", name: "球队服装" },
  { id: "cat-sports-jersey", parentId: "cat-sports-team", name: "比赛球衣" },
];

const units = [
  { id: "unit-sjs", type: "学校", code: "SJS", name: "圣若瑟教区中学", contact: "校务处", logo: makeThumb("#e6f4ff", "#1769A8", "SJS") },
  { id: "unit-pui-ching", type: "学校", code: "PUICHING", name: "培正中学", contact: "采购负责人", logo: makeThumb("#fff7e6", "#d46b08", "培正") },
  { id: "unit-ho-kong", type: "学校", code: "HOKONG", name: "濠江中学", contact: "校服组", logo: makeThumb("#f6ffed", "#1769A8", "濠江") },
  { id: "unit-macau-youth", type: "球队", code: "TEAM-MY", name: "澳门青少年球队", contact: "球队领队", logo: makeThumb("#f0f5ff", "#1d39c4", "球队") },
  { id: "unit-mc-retail", type: "企业", code: "MC-RETAIL", name: "MC 自营零售", contact: "运营组", logo: makeThumb("#e6f4ff", "#1769A8", "MC") },
];

let products = [
  {
    id: "spu-sjs-shirt",
    spuCode: "SPU-SJS-SHIRT-001",
    name: "圣若瑟校服短袖衬衫",
    categoryId: "cat-school-short",
    unitIds: ["unit-sjs"],
    thumb: makeThumb("#e6f4ff", "#1769A8", "校服") ,
    gallery: [makeThumb("#e6f4ff", "#1769A8", "主图"), makeThumb("#f0f5ff", "#1769A8", "细节")],
    detailHtml: "<h3>圣若瑟校服短袖衬衫</h3><p>透气面料，适合澳门夏季校园日常穿着。支持门店自提与本地配送。</p>",
    status: "上架",
    description: "校服短袖衬衫 SPU，按颜色、季节和版型拆分 SKU。",
    skus: [
      { id: "sku-sjs-white", code: "SKU-SJS-SHIRT-WH-UN-SU", barcode: "6901001001012", spec: "白色 / 男女款 / 夏季", price: 188, stock: 42, warning: 10, saleable: true },
      { id: "sku-sjs-black", code: "SKU-SJS-SHIRT-BK-UN-SU", barcode: "6901001001029", spec: "黑色 / 男女款 / 夏季", price: 188, stock: 18, warning: 10, saleable: true },
    ],
  },
  {
    id: "spu-pc-pants",
    spuCode: "SPU-PC-PANTS-021",
    name: "培正中学运动长裤",
    categoryId: "cat-original-tshirt",
    unitIds: ["unit-pui-ching"],
    thumb: makeThumb("#fff7e6", "#d46b08", "运动") ,
    gallery: [makeThumb("#fff7e6", "#d46b08", "主图")],
    detailHtml: "<h3>培正中学运动长裤</h3><p>四季可穿运动长裤，适合体育课、训练和日常校服搭配。</p>",
    status: "上架",
    description: "运动服 SPU，按颜色和尺码段拆分 SKU。",
    skus: [
      { id: "sku-pc-pants-navy-s", code: "SKU-PC-PANTS-NV-S", barcode: "6901002001011", spec: "藏青 / S-M / 四季", price: 238, stock: 42, warning: 8, saleable: true },
      { id: "sku-pc-pants-navy-l", code: "SKU-PC-PANTS-NV-L", barcode: "6901002001028", spec: "藏青 / L-3XL / 四季", price: 238, stock: 7, warning: 8, saleable: true },
    ],
  },
  {
    id: "spu-team-jersey",
    spuCode: "SPU-TEAM-JERSEY-107",
    name: "澳门青少年球队训练服",
    categoryId: "cat-sports-jersey",
    unitIds: ["unit-macau-youth"],
    thumb: makeThumb("#f0f5ff", "#1d39c4", "球衣") ,
    gallery: [makeThumb("#f0f5ff", "#1d39c4", "主图")],
    detailHtml: "<h3>澳门青少年球队训练服</h3><p>球队训练场景使用，可按队伍需求扩展印号和配色。</p>",
    status: "售罄",
    description: "球队训练服 SPU，SKU 货号是库存扣减基础。",
    skus: [
      { id: "sku-team-red", code: "SKU-TEAM-JERSEY-RD-01", barcode: "6901003001010", spec: "红白 / 可印号 / 训练款", price: 168, stock: 0, warning: 5, saleable: false },
      { id: "sku-team-blue", code: "SKU-TEAM-JERSEY-BL-01", barcode: "6901003001027", spec: "蓝白 / 可印号 / 训练款", price: 168, stock: 0, warning: 5, saleable: false },
    ],
  },
  {
    id: "spu-winter-coat",
    spuCode: "SPU-SCHOOL-COAT-035",
    name: "校服冬季外套预售款",
    categoryId: "cat-school-short",
    unitIds: ["unit-ho-kong", "unit-pui-ching"],
    thumb: makeThumb("#f6ffed", "#1769A8", "外套") ,
    gallery: [makeThumb("#f6ffed", "#1769A8", "主图")],
    detailHtml: "<h3>校服冬季外套预售款</h3><p>冬季保暖外套预售商品，预计到货后按付款顺序发货。</p>",
    status: "预售",
    description: "冬季外套预售 SPU，按学校入口共用库存池。",
    skus: [
      { id: "sku-coat-navy", code: "SKU-COAT-NV-2026", barcode: "6901004001019", spec: "藏青 / 男女款 / 冬季", price: 388, stock: 260, warning: 30, saleable: true },
    ],
  },
];

const orders = [
  {
    id: "ORD20260718036",
    createdAt: "2026-07-18 15:46",
    customer: "梁太",
    phone: "6688 1226",
    unitId: "unit-sjs",
    items: [
      { name: "圣若瑟校服短袖衬衫", sku: "白色 / 男女款 / 夏季 / M", qty: 1, productId: "spu-sjs-shirt", skuId: "sku-sjs-white", barcode: "6901001001012" },
      { name: "培正中学运动长裤", sku: "藏青 / L-3XL / L", qty: 1, productId: "spu-pc-pants", skuId: "sku-pc-pants-navy-l", barcode: "6901002001028" },
    ],
    amount: 426,
    paymentMethod: "Mpay",
    paymentStatus: "已支付",
    fulfillmentStatus: "已完成",
    deliveryType: "门店自提",
    deliveryCompany: "",
    trackingNo: "",
    pickupStore: "MC 澳门门市",
    remark: "客户已到店取货。",
    warehouseRemark: "2026-07-18 已核销自提。",
    afterSaleStatus: "无",
    salesType: "现售",
    nextAction: "查看订单 / 发起售后",
  },
  {
    id: "ORD20260630018",
    createdAt: "2026-06-30 10:24",
    customerId: "CUS20260701001",
    customer: "陈小姐",
    phone: "6688 1024",
    unitId: "unit-sjs",
    items: [{ name: "圣若瑟校服短袖衬衫", sku: "白色 / 男女款 / 夏季 / M", qty: 2, productId: "spu-sjs-shirt", skuId: "sku-sjs-white", barcode: "6901001001012" }],
    amount: 376,
    paymentMethod: "Mpay",
    paymentStatus: "已支付",
    fulfillmentStatus: "待发货",
    deliveryType: "澳门本地配送",
    deliveryCompany: "本地配送车队",
    trackingNo: "",
    pickupStore: "",
    remark: "客户备注：下午 6 点后派送。",
    warehouseRemark: "校服衬衫需核对尺码。",
    afterSaleStatus: "无",
    salesType: "现售",
    nextAction: "填写物流并发货",
  },
  {
    id: "ORD20260629072",
    createdAt: "2026-06-29 16:08",
    customerId: "CUS20260626008",
    customer: "李同学家长",
    phone: "6281 3390",
    unitId: "unit-pui-ching",
    items: [{ name: "培正中学运动长裤", sku: "藏青 / L-3XL / L", qty: 1, productId: "spu-pc-pants", skuId: "sku-pc-pants-navy-l", barcode: "6901002001028" }],
    amount: 238,
    paymentMethod: "微信支付",
    paymentStatus: "已支付",
    fulfillmentStatus: "待自提",
    deliveryType: "门店自提",
    deliveryCompany: "",
    trackingNo: "",
    pickupStore: "MC 澳门门市",
    remark: "放学后自提。",
    warehouseRemark: "已分配到门市备货架 A2。",
    afterSaleStatus: "无",
    salesType: "现售",
    nextAction: "通知自提",
  },
  {
    id: "ORD20260628035",
    createdAt: "2026-06-28 09:41",
    customerId: "CUS20260703002",
    customer: "黄先生",
    phone: "6630 8812",
    unitId: "unit-ho-kong",
    items: [{ name: "校服冬季外套预售款", sku: "藏青 / 男女款 / 冬季 / S", qty: 1 }],
    amount: 388,
    paymentMethod: "Mpay",
    paymentStatus: "待支付",
    fulfillmentStatus: "待备货",
    deliveryType: "澳门本地配送",
    deliveryCompany: "",
    trackingNo: "",
    pickupStore: "",
    remark: "预售商品，到货后发出。",
    warehouseRemark: "待支付，库存仅锁定。",
    afterSaleStatus: "无",
    salesType: "预售",
    nextAction: "等待支付",
    eta: "2026-08-15",
  },
  {
    id: "ORD20260626091",
    createdAt: "2026-06-26 14:20",
    customer: "澳门青训队",
    phone: "6222 9100",
    unitId: "unit-macau-youth",
    items: [{ name: "澳门青少年球队训练服", sku: "蓝白 / 可印号 / 训练款 / 16", qty: 12 }],
    amount: 2016,
    paymentMethod: "线下登记",
    paymentStatus: "已支付",
    fulfillmentStatus: "已发货",
    deliveryType: "澳门本地配送",
    deliveryCompany: "顺丰澳门",
    trackingNo: "SFMO2300626091",
    pickupStore: "",
    remark: "团体订单，需统一送到训练场。",
    warehouseRemark: "已发顺丰澳门，留意签收。",
    afterSaleStatus: "售后中",
    salesType: "现售",
    nextAction: "查看售后详情",
  },
  {
    id: "ORD20260624012",
    createdAt: "2026-06-24 11:52",
    customer: "林小姐",
    phone: "6665 7781",
    unitId: "unit-mc-retail",
    items: [{ name: "圣若瑟校服短袖衬衫", sku: "黑色 / 男女款 / 夏季 / S", qty: 1 }],
    amount: 188,
    paymentMethod: "Mpay",
    paymentStatus: "已退款",
    fulfillmentStatus: "已完成",
    deliveryType: "门店自提",
    deliveryCompany: "",
    trackingNo: "",
    pickupStore: "MC 澳门门市",
    remark: "已取货。",
    warehouseRemark: "退款售后已登记。",
    afterSaleStatus: "已完成",
    salesType: "现售",
    nextAction: "发起售后",
  },
  {
    id: "ORD20260701026",
    createdAt: "2026-07-01 13:35",
    customer: "何太",
    phone: "6682 4511",
    unitId: "unit-ho-kong",
    items: [{ name: "校服冬季外套预售款", sku: "藏青 / 男女款 / 冬季 / M", qty: 2 }],
    amount: 776,
    paymentMethod: "Mpay",
    paymentStatus: "已支付",
    fulfillmentStatus: "待备货",
    deliveryType: "澳门本地配送",
    deliveryCompany: "",
    trackingNo: "",
    pickupStore: "",
    remark: "预售到货后速递。",
    warehouseRemark: "等待到货，预计 8 月中旬。",
    afterSaleStatus: "无",
    salesType: "预售",
    nextAction: "开始备货",
    eta: "2026-08-15",
  },
  {
    id: "ORD20260701031",
    createdAt: "2026-07-01 15:12",
    customer: "梁同学家长",
    phone: "6299 0045",
    unitId: "unit-pui-ching",
    items: [{ name: "校服冬季外套预售款", sku: "藏青 / 男女款 / 冬季 / L", qty: 1 }],
    amount: 388,
    paymentMethod: "微信支付",
    paymentStatus: "已支付",
    fulfillmentStatus: "备货中",
    deliveryType: "门店自提",
    deliveryCompany: "",
    trackingNo: "",
    pickupStore: "MC 澳门门市",
    remark: "到货后门店自提。",
    warehouseRemark: "门店自提，需到店后通知。",
    afterSaleStatus: "无",
    salesType: "预售",
    nextAction: "标记可履约",
    eta: "2026-08-20",
  },
  {
    id: "ORD20260702008",
    createdAt: "2026-07-02 09:18",
    customer: "郑先生",
    phone: "6620 7788",
    unitId: "unit-sjs",
    items: [{ name: "校服冬季外套预售款", sku: "藏青 / 男女款 / 冬季 / XL", qty: 1 }],
    amount: 388,
    paymentMethod: "Mpay",
    paymentStatus: "已支付",
    fulfillmentStatus: "可履约",
    deliveryType: "澳门本地配送",
    deliveryCompany: "",
    trackingNo: "",
    pickupStore: "",
    remark: "预售现已到货，可发货。",
    warehouseRemark: "已到货，等待拣货。",
    afterSaleStatus: "无",
    salesType: "预售",
    nextAction: "去拣货",
    eta: "已到货",
  },
];

const afterSales = [
  {
    id: "AS20260630006",
    orderId: "ORD20260626091",
    type: "换码",
    status: "售后发起",
    customer: "澳门青训队",
    productId: "spu-team-jersey",
    product: "澳门青少年球队训练服",
    sku: "蓝白 / 16 号",
    reason: "队员尺码偏小，申请更换 18 号 2 件。",
    proofs: 3,
    result: "待审核",
    inventoryImpact: "换出与换入库存需人工确认",
    records: ["客户 2026-06-30 09:28 提交换码申请"],
  },
  {
    id: "AS20260629003",
    orderId: "ORD20260624012",
    type: "退款",
    status: "处理中",
    customer: "林小姐",
    productId: "spu-sjs-shirt",
    product: "圣若瑟校服短袖衬衫",
    sku: "黑色 / S",
    reason: "门店自提后发现重复购买，申请退款。",
    proofs: 1,
    result: "已受理，待财务登记退款",
    inventoryImpact: "商品未退回，不回补库存",
    records: ["客服 2026-06-29 15:12 受理", "财务待登记退款流水"],
  },
  {
    id: "AS20260628011",
    orderId: "ORD20260628035",
    type: "退货",
    status: "已拒绝",
    customer: "黄先生",
    productId: "spu-winter-coat",
    product: "校服冬季外套预售款",
    sku: "藏青 / S",
    reason: "预售订单未支付，申请退货。",
    proofs: 0,
    result: "订单未支付，已引导关闭订单",
    inventoryImpact: "释放锁定库存",
    records: ["客服 2026-06-28 18:22 拒绝，原因：未形成有效履约"],
  },
  {
    id: "AS20260625008",
    orderId: "ORD20260629072",
    type: "其他问题",
    status: "已完成",
    customer: "李同学家长",
    productId: "spu-pc-pants",
    product: "培正中学运动长裤",
    sku: "藏青 / L",
    reason: "咨询自提时间变更。",
    proofs: 0,
    result: "已改为周六门店自提",
    inventoryImpact: "无库存影响",
    records: ["客服已备注门店周六保留", "门店已确认"],
  },
];

const permissionCatalog = [
  {
    group: "工作台",
    pages: [
      { id: "dashboard", name: "工作台", apis: [{ id: "dashboard_view", name: "查看数据" }, { id: "dashboard_exchange_create", name: "录入门店换货" }, { id: "dashboard_export", name: "导出" }] },
    ],
  },
  {
    group: "商品中心",
    pages: [
      { id: "products", name: "商品列表", apis: [{ id: "product_query", name: "查询" }, { id: "product_detail", name: "查看详情" }, { id: "product_create", name: "新建" }, { id: "product_update", name: "修改" }, { id: "product_export", name: "导出" }] },
      { id: "inventoryAlerts", name: "库存预警", apis: [{ id: "inventory_query", name: "查询" }, { id: "inventory_restock", name: "补库存" }, { id: "inventory_offsale", name: "下架" }] },
    ],
  },
  {
    group: "订单中心",
    pages: [
      { id: "orders", name: "现货订单", apis: [{ id: "order_query", name: "查询" }, { id: "order_detail", name: "查看详情" }, { id: "order_ship", name: "发货" }, { id: "order_export", name: "导出" }] },
      { id: "presaleOrders", name: "预售订单", apis: [{ id: "presale_query", name: "查询" }, { id: "presale_detail", name: "查看详情" }, { id: "presale_fulfill", name: "标记可履约" }, { id: "presale_export", name: "导出" }] },
      { id: "afterSales", name: "售后订单", apis: [{ id: "aftersale_query", name: "查询" }, { id: "aftersale_audit", name: "审核" }, { id: "aftersale_record", name: "追加记录" }, { id: "aftersale_export", name: "导出" }] },
    ],
  },
  {
    group: "CRM 中心",
    pages: [
      { id: "customers", name: "客户列表", apis: [{ id: "customer_query", name: "查询" }, { id: "customer_detail", name: "查看详情" }, { id: "customer_points", name: "查看积分流水" }, { id: "customer_update", name: "修改信息" }, { id: "customer_export", name: "导出" }] },
      { id: "opportunities", name: "商机列表", apis: [{ id: "opportunity_query", name: "查询" }, { id: "opportunity_detail", name: "查看详情" }, { id: "opportunity_create", name: "新建" }, { id: "opportunity_follow", name: "追加跟进" }, { id: "opportunity_export", name: "导出" }] },
    ],
  },
  {
    group: "系统设置",
    pages: [
      { id: "employeeAccounts", name: "员工账号", apis: [{ id: "employee_query", name: "查询" }, { id: "employee_create", name: "新建" }, { id: "employee_update", name: "修改" }, { id: "employee_reset_password", name: "重置密码" }, { id: "employee_toggle", name: "启停账号" }] },
      { id: "rolePermissions", name: "角色权限", apis: [{ id: "role_query", name: "查询" }, { id: "role_create", name: "新建" }, { id: "role_update", name: "修改" }, { id: "role_assign", name: "分配权限" }] },
      { id: "deliveryConfiguration", name: "配送配置", apis: [{ id: "delivery_query", name: "查询" }, { id: "delivery_fee_update", name: "修改配送费" }, { id: "hive_pickup_create", name: "新增窝蜂点" }, { id: "hive_pickup_update", name: "修改窝蜂点" }, { id: "hive_pickup_image", name: "上传门头图片" }, { id: "hive_pickup_toggle", name: "启停窝蜂点" }] },
    ],
  },
];

const allPermissionPageIds = permissionCatalog.flatMap((group) => group.pages.map((page) => page.id));
const allPermissionApiIds = permissionCatalog.flatMap((group) => group.pages.flatMap((page) => page.apis.map((api) => api.id)));
const permissionPresets = {
  all: { pages: allPermissionPageIds, apis: allPermissionApiIds },
  product: { pages: ["dashboard", "products", "inventoryAlerts"], apis: ["dashboard_view", "product_query", "product_detail", "product_create", "product_update", "product_export", "inventory_query", "inventory_restock", "inventory_offsale"] },
  order: { pages: ["dashboard", "orders", "presaleOrders", "afterSales", "customers", "deliveryConfiguration"], apis: ["dashboard_view", "dashboard_exchange_create", "order_query", "order_detail", "order_ship", "order_export", "presale_query", "presale_detail", "presale_fulfill", "presale_export", "aftersale_query", "aftersale_audit", "aftersale_record", "customer_query", "customer_detail", "customer_points", "customer_update", "delivery_query"] },
  warehouse: { pages: ["dashboard", "orders", "presaleOrders", "afterSales", "inventoryAlerts", "deliveryConfiguration"], apis: ["dashboard_view", "dashboard_exchange_create", "order_query", "order_detail", "order_ship", "presale_query", "presale_detail", "presale_fulfill", "aftersale_query", "inventory_query", "inventory_restock", "delivery_query"] },
  sales: { pages: ["dashboard", "customers", "opportunities"], apis: ["dashboard_view", "customer_query", "customer_detail", "customer_points", "customer_update", "customer_export", "opportunity_query", "opportunity_detail", "opportunity_create", "opportunity_follow", "opportunity_export"] },
  viewer: { pages: ["dashboard", "products", "orders", "presaleOrders", "customers", "opportunities"], apis: ["dashboard_view", "product_query", "product_detail", "order_query", "order_detail", "presale_query", "presale_detail", "customer_query", "customer_detail", "customer_points", "opportunity_query", "opportunity_detail"] },
};

let roles = [
  {
    id: "role-admin",
    name: "管理员",
    status: "启用",
    description: "拥有商品、订单、CRM、系统设置全部管理权限。",
    permissions: permissionPresets.all,
  },
  {
    id: "role-product",
    name: "商品运营",
    status: "启用",
    description: "负责门店商品和库存预警维护；商品类目及学校／团体单位由集团统一配置。",
    permissions: permissionPresets.product,
  },
  {
    id: "role-order",
    name: "订单客服",
    status: "启用",
    description: "负责现货 / 预售订单处理、线上售后审核和门店换货录入。",
    permissions: permissionPresets.order,
  },
  {
    id: "role-warehouse",
    name: "仓库 / 门店",
    status: "启用",
    description: "负责拣货、发货、自提核销、门店换货和库存处理。",
    permissions: permissionPresets.warehouse,
  },
  {
    id: "role-sales",
    name: "业务销售",
    status: "启用",
    description: "负责 CRM 客户负责人、商机跟进和报价转化。",
    permissions: permissionPresets.sales,
  },
  {
    id: "role-viewer",
    name: "管理层只读",
    status: "禁用",
    description: "用于管理层查看经营数据和业务进度，不参与操作。",
    permissions: permissionPresets.viewer,
  },
];

const employees = [
  { id: "emp-admin", usernameHash: "a0ccc593e9fa5e37825f67c5d95b87ce4635c2e457e00fbb689b9b34c995df6e", usernameMasked: "m******n", name: "管理员", roleId: "role-admin", storeIds: ["store-nam-van", "store-taipa", "store-fai-chi-kei"], passwordHash: "d120174be4f79c15f66c6828c0b3ccd876f497463fbbb33b37f5838106fc6662", status: "启用", lastLogin: "2026-07-06 09:12" },
  { id: "emp-sales-he", usernameHash: "21711679adf09bf8d1f5aacf392e15da52c63ef249865ba0f974a82693f13739", usernameMasked: "h******s", name: "何销售", roleId: "role-sales", storeIds: ["store-nam-van", "store-taipa"], passwordHash: "", status: "启用", lastLogin: "2026-07-06 08:56" },
  { id: "emp-service-liang", usernameHash: "90555f44815af5867f755608406dbeda5d26f5503fcb8a9648dc98b2d26d6e35", usernameMasked: "l******s", name: "梁客服", roleId: "role-order", storeIds: ["store-nam-van", "store-fai-chi-kei"], passwordHash: "", status: "启用", lastLogin: "2026-07-05 18:34" },
  { id: "emp-manager-chan", usernameHash: "e65dcd0d2e2d8ad97f4f59331566f9a83b900beb199a2a0ecbe1d607c80482fc", usernameMasked: "c**********r", name: "陈经理", roleId: "role-sales", storeIds: ["store-nam-van", "store-taipa", "store-fai-chi-kei"], passwordHash: "", status: "启用", lastLogin: "2026-07-06 10:02" },
  { id: "emp-warehouse-tam", usernameHash: "5dbc3e04a7e5877e3806d70f483ea9a823937063011814cb41d8e2735bcb45ba", usernameMasked: "t****h", name: "谭仓管", roleId: "role-warehouse", storeIds: ["store-nam-van", "store-taipa", "store-fai-chi-kei"], passwordHash: "", status: "启用", lastLogin: "2026-07-05 16:20" },
  { id: "emp-product-wong", usernameHash: "8185ca8f929ea911a3106fa7027b8f78f32ee4b694eb91bf87d87bc033549a24", usernameMasked: "w******s", name: "黄运营", roleId: "role-product", storeIds: ["store-taipa"], passwordHash: "", status: "停用", lastLogin: "未登录" },
];

const stores = [
  { id: "store-nam-van", name: "MC 南湾门店", address: "澳门南湾大马路 599 号地下 A 铺", phone: "2833 6688", businessHours: "周一至周日 10:00-20:00" },
  { id: "store-taipa", name: "MC 氹仔门店", address: "澳门氹仔成都街 125 号地下", phone: "2882 1024", businessHours: "周一至周日 10:30-20:30" },
  { id: "store-fai-chi-kei", name: "MC 筷子基门店", address: "澳门筷子基北街 88 号地下 B 铺", phone: "2826 9018", businessHours: "周一至周六 09:30-19:30；周日 10:00-18:00" },
];

const hivePickupPoints = [
  { id: "hive-central", name: "窝蜂新马路自提点", address: "澳门新马路 168 号地下", phone: "6208 1138", businessHours: "周一至周日 10:00-21:00", status: "启用", imageUrl: "", imageName: "" },
  { id: "hive-taipa", name: "窝蜂氹仔花城自提点", address: "澳门氹仔南京街 128 号花城地下", phone: "6235 8821", businessHours: "周一至周日 11:00-21:00", status: "启用", imageUrl: "", imageName: "" },
  { id: "hive-areia-preta", name: "窝蜂黑沙环自提点", address: "澳门黑沙环中街 420 号地下", phone: "6251 9077", businessHours: "周一至周六 10:00-20:00", status: "停用", imageUrl: "", imageName: "" },
];

const deliveryFeeConfig = {
  hivePickup: { baseFee: 15, freeThreshold: 200 },
  courier: { baseFee: 15, freeThreshold: 200 },
};

const customers = [
  {
    id: "CUS20260701001",
    name: "陈小姐",
    type: "成交客户",
    phone: "6688 1024",
    whatsapp: "6688 1024",
    email: "chan@example.mo",
    source: "小程序",
    tags: ["商城客户", "校服复购"],
    unitId: "unit-sjs",
    ownerId: "emp-service-liang",
    orderCount: 3,
    afterSaleCount: 0,
    lastFollow: "2026-07-02 发货地址已确认",
    remark: "常购圣若瑟校服，偏好澳门本地配送。",
  },
  {
    id: "CUS20260628012",
    name: "澳门青训队",
    type: "咨询客户",
    phone: "6222 9100",
    whatsapp: "6222 9100",
    email: "team@example.mo",
    source: "定制咨询",
    tags: ["球队", "团体订单"],
    unitId: "unit-macau-youth",
    ownerId: "emp-sales-he",
    orderCount: 1,
    afterSaleCount: 1,
    lastFollow: "2026-07-01 已询问下一批训练服数量",
    remark: "关注可印号球衣和训练服补单。",
  },
  {
    id: "CUS20260626008",
    name: "李同学家长",
    type: "商城客户",
    phone: "6281 3390",
    whatsapp: "6281 3390",
    email: "parent.li@example.mo",
    source: "学校入口",
    tags: ["培正中学", "门店自提"],
    unitId: "unit-pui-ching",
    ownerId: "emp-service-liang",
    orderCount: 2,
    afterSaleCount: 0,
    lastFollow: "2026-06-30 已改周六自提",
    remark: "常使用门店自提。",
  },
  {
    id: "CUS20260702006",
    name: "濠江校务处",
    type: "咨询客户",
    phone: "6630 8812",
    whatsapp: "6630 8812",
    email: "school@example.mo",
    source: "客服转入",
    tags: ["学校合作", "冬季外套"],
    unitId: "unit-ho-kong",
    ownerId: "emp-manager-chan",
    orderCount: 0,
    afterSaleCount: 0,
    lastFollow: "2026-07-02 等待尺码表",
    remark: "需要确认冬季外套批量采购方案。",
  },
  {
    id: "CUS20260703002",
    name: "黄先生",
    type: "商城客户",
    phone: "6630 8812",
    whatsapp: "6630 8812",
    email: "wong@example.mo",
    source: "H5",
    tags: ["预售关注"],
    unitId: "unit-ho-kong",
    ownerId: "unassigned",
    orderCount: 1,
    afterSaleCount: 0,
    lastFollow: "2026-07-03 预售订单待支付提醒",
    remark: "需跟进支付状态。",
  },
];

const pointTransactions = [];

function syncPointTransactionsFromPaidOrders() {
  orders.forEach((order) => {
    if (!order.customerId || order.paymentStatus !== "已支付") return;
    const transactionId = `PTS-${order.id}`;
    if (pointTransactions.some((item) => item.id === transactionId)) return;
    pointTransactions.push({
      id: transactionId,
      customerId: order.customerId,
      orderId: order.id,
      createdAt: order.createdAt,
      type: "商城消费",
      description: `订单 ${order.id} 支付成功`,
      amount: Number(order.amount || 0),
      change: Math.floor(Number(order.amount || 0)),
    });
  });
}

function getCustomerPointTransactions(customerId) {
  syncPointTransactionsFromPaidOrders();
  let balance = 0;
  return pointTransactions
    .filter((item) => item.customerId === customerId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((item) => {
      balance += item.change;
      return { ...item, balanceAfter: balance };
    })
    .reverse();
}

function getCustomerPoints(customerId) {
  return getCustomerPointTransactions(customerId).reduce((total, item) => total + item.change, 0);
}

const opportunities = [
  {
    id: "OPP20260703001",
    title: "澳门青训队秋季训练服补单",
    customerId: "CUS20260628012",
    type: "团购咨询",
    source: "定制咨询",
    need: "训练服补单，需印号与队徽",
    quantity: "80-120 件",
    budget: "MOP 18,000",
    dueDate: "2026-08-20",
    status: "新线索",
    ownerId: "emp-sales-he",
    lastFollow: "2026-07-03 客户提交初步数量",
  },
  {
    id: "OPP20260702004",
    title: "濠江中学冬季外套合作",
    customerId: "CUS20260702006",
    type: "学校合作咨询",
    source: "客服转入",
    need: "冬季外套批量采购与尺码统计",
    quantity: "500 件以上",
    budget: "待确认",
    dueDate: "2026-09-15",
    status: "资料待补充",
    ownerId: "emp-manager-chan",
    lastFollow: "2026-07-02 等待学校提供 Logo 与尺码比例",
  },
  {
    id: "OPP20260630003",
    title: "企业团体 Polo 衫定制",
    customerId: "CUS20260701001",
    type: "定制咨询",
    source: "H5",
    need: "企业活动 Polo 衫，胸前刺绣 Logo",
    quantity: "60 件",
    budget: "MOP 9,000",
    dueDate: "2026-07-28",
    status: "已报价",
    ownerId: "emp-sales-he",
    lastFollow: "2026-07-01 已发报价单，等待确认颜色",
  },
  {
    id: "OPP20260627002",
    title: "培正中学运动裤复购咨询",
    customerId: "CUS20260626008",
    type: "学校合作咨询",
    source: "学校入口",
    need: "运动长裤复购，需确认库存和交期",
    quantity: "200 件",
    budget: "MOP 45,000",
    dueDate: "2026-08-10",
    status: "待联系",
    ownerId: "emp-service-liang",
    lastFollow: "2026-06-29 系统生成待办",
  },
  {
    id: "OPP20260621007",
    title: "MC 自营夏季 T 恤团购",
    customerId: "CUS20260703002",
    type: "团购咨询",
    source: "小程序",
    need: "夏季活动 T 恤现货采购",
    quantity: "30 件",
    budget: "MOP 4,500",
    dueDate: "2026-07-12",
    status: "已成交",
    ownerId: "emp-service-liang",
    lastFollow: "2026-06-25 已转商城订单",
  },
];

const loginView = document.querySelector("#loginView");
const adminView = document.querySelector("#adminView");
const loginForm = document.querySelector("#loginForm");
const loginStore = document.querySelector("#loginStore");
const loginError = document.querySelector("#loginError");
const activeStoreSelect = document.querySelector("#activeStoreSelect");
const storeSwitchHint = document.querySelector("#storeSwitchHint");
const productRows = document.querySelector("#productRows");
const inventoryAlertRows = document.querySelector("#inventoryAlertRows");
const productSearch = document.querySelector("#productSearch");
const categoryFilter = document.querySelector("#categoryFilter");
const unitFilter = document.querySelector("#unitFilter");
const statusFilter = document.querySelector("#statusFilter");
const statusTabs = document.querySelectorAll("#productsPage .status-tabs button");
const navGroups = document.querySelectorAll("[data-nav-group]");
const pageTitle = document.querySelector("#pageTitle");
const dashboardPage = document.querySelector("#dashboardPage");
const productsPage = document.querySelector("#productsPage");
const inventoryAlertsPage = document.querySelector("#inventoryAlertsPage");
const ordersPage = document.querySelector("#ordersPage");
const presaleOrdersPage = document.querySelector("#presaleOrdersPage");
const afterSalesPage = document.querySelector("#afterSalesPage");
const orderRows = document.querySelector("#orderRows");
const presaleOrderRows = document.querySelector("#presaleOrderRows");
const orderDetail = document.querySelector("#orderDetail");
const orderDialog = document.querySelector("#orderDialog");
const orderDialogTitle = document.querySelector("#orderDialogTitle");
const afterSaleRows = document.querySelector("#afterSaleRows");
const afterSaleDetail = document.querySelector("#afterSaleDetail");
const afterSaleDialog = document.querySelector("#afterSaleDialog");
const afterSaleDialogTitle = document.querySelector("#afterSaleDialogTitle");
const exchangeDialog = document.querySelector("#exchangeDialog");
const exchangeOrderResults = document.querySelector("#exchangeOrderResults");
const exchangeSearchStep = document.querySelector("#exchangeSearchStep");
const exchangeBarcodeStep = document.querySelector("#exchangeBarcodeStep");
const exchangeConfirmStep = document.querySelector("#exchangeConfirmStep");
const exchangeSuccessStep = document.querySelector("#exchangeSuccessStep");
const customersPage = document.querySelector("#customersPage");
const opportunitiesPage = document.querySelector("#opportunitiesPage");
const customerRows = document.querySelector("#customerRows");
const opportunityRows = document.querySelector("#opportunityRows");
const crmDialog = document.querySelector("#crmDialog");
const crmDialogTitle = document.querySelector("#crmDialogTitle");
const crmDialogEyebrow = document.querySelector("#crmDialogEyebrow");
const crmDetail = document.querySelector("#crmDetail");
const opportunityCreateDialog = document.querySelector("#opportunityCreateDialog");
const opportunityCreateForm = document.querySelector("#opportunityCreateForm");
const employeeAccountsPage = document.querySelector("#employeeAccountsPage");
const rolePermissionsPage = document.querySelector("#rolePermissionsPage");
const deliveryConfigurationPage = document.querySelector("#deliveryConfigurationPage");
const employeeRows = document.querySelector("#employeeRows");
const roleRows = document.querySelector("#roleRows");
const hivePickupRows = document.querySelector("#hivePickupRows");
const systemDialog = document.querySelector("#systemDialog");
const systemDialogTitle = document.querySelector("#systemDialogTitle");
const systemDialogEyebrow = document.querySelector("#systemDialogEyebrow");
const systemDetail = document.querySelector("#systemDetail");
const employeeEditDialog = document.querySelector("#employeeEditDialog");
const roleEditDialog = document.querySelector("#roleEditDialog");
const hivePickupEditDialog = document.querySelector("#hivePickupEditDialog");
const productDialog = document.querySelector("#productDialog");
const drawerTitle = document.querySelector("#drawerTitle");
const chartTooltip = document.querySelector("#chartTooltip");
const restockDialog = document.querySelector("#restockDialog");
const shelveOffDialog = document.querySelector("#shelveOffDialog");
const spuTabButtons = document.querySelectorAll("[data-spu-tab]");

let selectedTabStatus = "all";
let latestChartPoints = [];
let editingProductId = null;
let selectedOrderTab = "all";
let selectedPresaleOrderTab = "all";
let selectedOrderId = orders[0]?.id || null;
let selectedAfterSaleId = afterSales[0]?.id || null;
let selectedExchangeOrderId = null;
let exchangeMatches = [];
let pendingExchange = null;
let createdExchangeAfterSaleId = null;
let selectedOpportunityTab = "all";
let editingRoleId = null;
let editingHivePickupId = null;
let currentEmployeeId = null;
let currentStoreId = null;
const pagination = {
  products: { page: 1, pageSize: 15 },
  orders: { page: 1, pageSize: 15 },
  presaleOrders: { page: 1, pageSize: 15 },
  afterSales: { page: 1, pageSize: 15 },
  customers: { page: 1, pageSize: 15 },
  opportunities: { page: 1, pageSize: 15 },
  employees: { page: 1, pageSize: 15 },
  roles: { page: 1, pageSize: 15 },
  hivePickupPoints: { page: 1, pageSize: 15 },
  inventoryAlerts: { page: 1, pageSize: 15 },
};

function getStoreById(id) {
  return stores.find((store) => store.id === id);
}

function getEmployeeStores(employee) {
  const storeIds = new Set(employee?.storeIds || []);
  return stores.filter((store) => storeIds.has(store.id));
}

function renderLoginStoreOptions(selectedStoreId = "") {
  loginStore.innerHTML = `<option value="">请选择登录门店</option>${stores.map((store) => `<option value="${store.id}">${escapeHtml(store.name)}</option>`).join("")}`;
  loginStore.value = selectedStoreId;
}

function renderActiveStoreOptions(employee, selectedStoreId) {
  const availableStores = getEmployeeStores(employee);
  activeStoreSelect.innerHTML = availableStores.map((store) => `<option value="${store.id}">${escapeHtml(store.name)}</option>`).join("");
  activeStoreSelect.value = selectedStoreId;
  activeStoreSelect.disabled = availableStores.length <= 1;
  storeSwitchHint.textContent = availableStores.length > 1 ? `可切换 ${availableStores.length} 家门店` : "当前账号仅授权此门店";
}

function refreshStoreScopedViews() {
  Object.keys(pagination).forEach(resetPagination);
  renderProducts();
  renderInventoryAlerts();
  renderOrders();
  renderPresaleOrders();
  renderAfterSales();
  renderCustomers();
  renderOpportunities();
  renderHivePickupPoints();
  renderDeliveryFeeConfig();
  requestAnimationFrame(drawSalesChart);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value.trim();
  const selectedStoreId = loginStore.value;
  const usernameHash = await hashEmployeeUsername(username);
  const employee = employees.find((item) => item.usernameHash === usernameHash);
  const passwordHash = employee ? await hashEmployeePassword(employee.id, password) : "";

  if (employee && employee.passwordHash === passwordHash && employee.status === "启用") {
    if (!selectedStoreId || !employee.storeIds?.includes(selectedStoreId)) {
      loginError.textContent = "该账号无权登录所选门店，请重新选择或联系管理员。";
      return;
    }
    loginError.textContent = "";
    employee.lastLogin = "刚刚";
    currentEmployeeId = employee.id;
    currentStoreId = selectedStoreId;
    loginView.classList.add("hidden");
    adminView.classList.remove("hidden");
    adminView.dataset.storeId = currentStoreId;
    document.querySelector(".admin-profile strong").textContent = employee.name;
    document.querySelector(".admin-profile small").textContent = username;
    renderActiveStoreOptions(employee, currentStoreId);
    requestAnimationFrame(drawSalesChart);
    return;
  }

  if (employee?.passwordHash === passwordHash && employee.status === "停用") {
    loginError.textContent = "该员工账号已停用，请联系管理员。";
    return;
  }

  loginError.textContent = "账号名或密码不正确，请使用有效员工账号登录。";
});

document.querySelector("#logoutBtn").addEventListener("click", () => {
  adminView.classList.add("hidden");
  loginView.classList.remove("hidden");
  delete adminView.dataset.storeId;
  currentEmployeeId = null;
  currentStoreId = null;
  activeStoreSelect.innerHTML = "";
  storeSwitchHint.textContent = "";
  loginForm.reset();
  renderLoginStoreOptions();
  loginError.textContent = "";
});

activeStoreSelect.addEventListener("change", () => {
  const employee = getEmployeeById(currentEmployeeId);
  const nextStoreId = activeStoreSelect.value;
  if (!employee?.storeIds?.includes(nextStoreId)) {
    activeStoreSelect.value = currentStoreId || "";
    storeSwitchHint.textContent = "当前账号无权切换到该门店";
    return;
  }
  currentStoreId = nextStoreId;
  adminView.dataset.storeId = currentStoreId;
  refreshStoreScopedViews();
  storeSwitchHint.textContent = `已切换至 ${getStoreById(currentStoreId)?.name || "所选门店"}`;
});

navGroups.forEach((group) => {
  const label = group.querySelector(".nav-label");
  label.addEventListener("click", () => {
    const collapsed = group.classList.toggle("collapsed");
    label.setAttribute("aria-expanded", String(!collapsed));
  });
});

function expandNavForPage(page) {
  const current = document.querySelector(`[data-page="${page}"]`);
  const group = current?.closest("[data-nav-group]");
  if (!group) return;
  group.classList.remove("collapsed");
  group.querySelector(".nav-label")?.setAttribute("aria-expanded", "true");
}

document.querySelectorAll(".nav-item[data-page]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const page = button.dataset.page;
    expandNavForPage(page);
    const titles = {
      dashboard: "工作台",
      products: "商品中心 / 商品列表",
      inventoryAlerts: "商品中心 / 库存预警",
      orders: "订单中心 / 现货订单",
      presaleOrders: "订单中心 / 预售订单",
      afterSales: "订单中心 / 售后订单",
      customers: "CRM 中心 / 客户列表",
      opportunities: "CRM 中心 / 商机列表",
      employeeAccounts: "系统设置 / 员工账号",
      rolePermissions: "系统设置 / 角色权限",
      deliveryConfiguration: "系统设置 / 配送配置",
    };
    pageTitle.textContent = titles[page] || "工作台";
    dashboardPage.classList.toggle("hidden", page !== "dashboard");
    productsPage.classList.toggle("hidden", page !== "products");
    inventoryAlertsPage.classList.toggle("hidden", page !== "inventoryAlerts");
    ordersPage.classList.toggle("hidden", page !== "orders");
    presaleOrdersPage.classList.toggle("hidden", page !== "presaleOrders");
    afterSalesPage.classList.toggle("hidden", page !== "afterSales");
    customersPage.classList.toggle("hidden", page !== "customers");
    opportunitiesPage.classList.toggle("hidden", page !== "opportunities");
    employeeAccountsPage.classList.toggle("hidden", page !== "employeeAccounts");
    rolePermissionsPage.classList.toggle("hidden", page !== "rolePermissions");
    deliveryConfigurationPage.classList.toggle("hidden", page !== "deliveryConfiguration");

    if (page === "dashboard") requestAnimationFrame(drawSalesChart);
    if (page === "inventoryAlerts") renderInventoryAlerts();
    if (page === "orders") renderOrders();
    if (page === "presaleOrders") renderPresaleOrders();
    if (page === "afterSales") renderAfterSales();
    if (page === "customers") renderCustomers();
    if (page === "opportunities") renderOpportunities();
    if (page === "employeeAccounts") renderEmployees();
    if (page === "rolePermissions") renderRoles();
    if (page === "deliveryConfiguration") renderHivePickupPoints();
  });
});

document.querySelectorAll("[data-jump-page]").forEach((button) => {
  button.addEventListener("click", () => navigateToPage(button.dataset.jumpPage));
});

function navigateToPage(page) {
  const target = document.querySelector(`[data-page="${page}"]`);
  target?.click();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[char]));
}

async function hashEmployeePassword(employeeId, password) {
  return hashText(`${employeeId}:${password}`);
}

async function hashEmployeeUsername(username) {
  return hashText(username.trim().toLowerCase());
}

async function hashText(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getEmployeeUsername(employee) {
  return employee?.username || employee?.usernameMasked || "已配置账号";
}

function getCategoryPath(id) {
  const path = [];
  let current = categories.find((category) => category.id === id);
  while (current) {
    path.unshift(current.name);
    current = categories.find((category) => category.id === current.parentId);
  }
  return path.join(" / ");
}

function getLeafCategories() {
  return categories.filter((category) => !categories.some((item) => item.parentId === category.id));
}

function getUnitName(id) {
  const unit = units.find((item) => item.id === id);
  return unit ? `${unit.name}（${unit.type}）` : "未知单位";
}

function getProductStock(product) {
  return product.skus.reduce((sum, sku) => sum + Number(sku.stock || 0), 0);
}

function getProductMinPrice(product) {
  return Math.min(...product.skus.map((sku) => Number(sku.price || 0)));
}

function refreshReferenceOptions() {
  const leafOptions = getLeafCategories().map((category) => `<option value="${category.id}">${escapeHtml(getCategoryPath(category.id))}</option>`).join("");
  categoryFilter.innerHTML = `<option value="all">全部类目</option>${leafOptions}`;
  document.querySelector("#formCategory").innerHTML = leafOptions || `<option value="">暂无集团下发类目</option>`;

  const unitOptions = units.map((unit) => `<option value="${unit.id}">${escapeHtml(unit.name)}（${unit.type}）</option>`).join("");
  unitFilter.innerHTML = `<option value="all">全部学校／团体单位</option>${unitOptions}`;
  document.querySelector("#orderUnitFilter").innerHTML = `<option value="all">全部学校 / 单位</option>${unitOptions}`;
  document.querySelector("#presaleOrderUnitFilter").innerHTML = `<option value="all">全部学校 / 单位</option>${unitOptions}`;
  document.querySelector("#customerOwnerFilter").innerHTML = renderOwnerOptions("全部负责人");
  document.querySelector("#opportunityOwnerFilter").innerHTML = renderOwnerOptions("全部负责人");
  const opportunityCustomer = document.querySelector("#opportunityCustomer");
  if (opportunityCustomer) {
    opportunityCustomer.innerHTML = `<option value="">请选择关联客户</option>${customers.map((customer) => `<option value="${customer.id}">${escapeHtml(customer.name)}（${escapeHtml(customer.phone)}）</option>`).join("")}`;
  }
  const opportunityOwner = document.querySelector("#opportunityOwner");
  if (opportunityOwner) {
    opportunityOwner.innerHTML = `<option value="unassigned">待分配</option>${getAssignableEmployees().map((employee) => `<option value="${employee.id}">${escapeHtml(employee.name)}（${escapeHtml(getEmployeeUsername(employee))}）</option>`).join("")}`;
  }
  document.querySelector("#employeeRoleFilter").innerHTML = renderRoleOptions("全部角色");
  document.querySelector("#employeeRole").innerHTML = roles.map((role) => `<option value="${role.id}">${escapeHtml(role.name)}</option>`).join("");
}

function renderProductUnitChoices(selectedIds = []) {
  const container = document.querySelector("#formUnits");
  if (!container) return;
  const selected = new Set(selectedIds);
  container.innerHTML = units.map((unit) => `
    <label class="unit-choice">
      <input type="checkbox" value="${unit.id}" ${selected.has(unit.id) ? "checked" : ""} />
      ${renderUnitLogo(unit)}
      <span>
        <strong>${escapeHtml(unit.name)}</strong>
        <small>${escapeHtml(unit.type)} · ${escapeHtml(unit.code)}</small>
      </span>
    </label>
  `).join("") || `<div class="unit-choice-empty">暂无可选单位，请联系集团管理员维护学校／团体单位。</div>`;
  container.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", updateProductUnitCount);
  });
  updateProductUnitCount();
}

function updateProductUnitCount() {
  const count = document.querySelectorAll('#formUnits input[type="checkbox"]:checked').length;
  const countLabel = document.querySelector("#formUnitsCount");
  if (countLabel) countLabel.textContent = `已选 ${count} 个`;
}

function renderOwnerOptions(label) {
  const ownerOptions = getAssignableEmployees()
    .map((employee) => `<option value="${employee.id}">${escapeHtml(employee.name)}（${escapeHtml(getEmployeeUsername(employee))}）</option>`)
    .join("");
  return `<option value="all">${label}</option><option value="unassigned">待分配</option>${ownerOptions}`;
}

function renderRoleOptions(label) {
  return `<option value="all">${label}</option>${roles.map((role) => `<option value="${role.id}">${escapeHtml(role.name)}</option>`).join("")}`;
}

function getAssignableEmployees() {
  return employees.filter((employee) => employee.status === "启用");
}

function getEmployeeById(id) {
  return employees.find((employee) => employee.id === id);
}

function getEmployeeName(id) {
  if (id === "unassigned") return "待分配";
  const employee = getEmployeeById(id);
  return employee ? employee.name : "未知员工";
}

function getEmployeeAccountText(id) {
  if (id === "unassigned") return "待分配";
  const employee = getEmployeeById(id);
  return employee ? `${employee.name}（${getEmployeeUsername(employee)}）` : "未知员工";
}

function getRoleById(id) {
  return roles.find((role) => role.id === id);
}

function getRoleName(id) {
  return getRoleById(id)?.name || "未配置角色";
}

function resetPagination(key) {
  if (pagination[key]) pagination[key].page = 1;
}

function getPageSlice(rows, key) {
  const state = pagination[key];
  const totalPages = Math.max(1, Math.ceil(rows.length / state.pageSize));
  state.page = Math.min(Math.max(1, state.page), totalPages);
  const start = (state.page - 1) * state.pageSize;
  return { rows: rows.slice(start, start + state.pageSize), total: rows.length, totalPages, start };
}

function renderPagination(key, total, totalPages) {
  const paginationTargets = {
    products: "productPagination",
    orders: "orderPagination",
    presaleOrders: "presaleOrderPagination",
    afterSales: "afterSalePagination",
    customers: "customerPagination",
    opportunities: "opportunityPagination",
    employees: "employeePagination",
    roles: "rolePagination",
    hivePickupPoints: "hivePickupPagination",
    inventoryAlerts: "inventoryAlertPagination",
  };
  const target = document.querySelector(`#${paginationTargets[key]}`);
  if (!target) return;
  const state = pagination[key];
  target.innerHTML = `
    <div class="pagination-info">共 ${total} 条</div>
    <div class="pagination-controls">
      <span>每页</span>
      <select data-page-size="${key}">
        ${[15, 30, 50, 100].map((size) => `<option value="${size}" ${state.pageSize === size ? "selected" : ""}>${size} 条</option>`).join("")}
      </select>
      <button class="ghost-btn tiny" type="button" data-page-prev="${key}" ${state.page <= 1 ? "disabled" : ""}>上一页</button>
      <span>${state.page} / ${totalPages}</span>
      <button class="ghost-btn tiny" type="button" data-page-next="${key}" ${state.page >= totalPages ? "disabled" : ""}>下一页</button>
    </div>
  `;
  target.querySelector(`[data-page-size="${key}"]`).addEventListener("change", (event) => {
    state.pageSize = Number(event.target.value);
    state.page = 1;
    renderPagedList(key);
  });
  target.querySelector(`[data-page-prev="${key}"]`)?.addEventListener("click", () => {
    state.page -= 1;
    renderPagedList(key);
  });
  target.querySelector(`[data-page-next="${key}"]`)?.addEventListener("click", () => {
    state.page += 1;
    renderPagedList(key);
  });
}

function renderPagedList(key) {
  const renderers = {
    products: renderProducts,
    orders: renderOrders,
    presaleOrders: renderPresaleOrders,
    afterSales: renderAfterSales,
    customers: renderCustomers,
    opportunities: renderOpportunities,
    employees: renderEmployees,
    roles: renderRoles,
    hivePickupPoints: renderHivePickupPoints,
    inventoryAlerts: renderInventoryAlerts,
  };
  renderers[key]?.();
}

function getFilteredProducts() {
  const keyword = productSearch.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const unit = unitFilter.value;
  const status = statusFilter.value !== "all" ? statusFilter.value : selectedTabStatus;

  return products.filter((product) => {
    const unitNames = product.unitIds.map(getUnitName).join(" ");
    const skuText = product.skus.map((sku) => `${sku.code} ${sku.spec}`).join(" ");
    const text = `${product.name} ${product.spuCode} ${unitNames} ${skuText}`.toLowerCase();
    const matchKeyword = !keyword || text.includes(keyword);
    const matchCategory = category === "all" || product.categoryId === category;
    const matchUnit = unit === "all" || product.unitIds.includes(unit);
    const matchStatus = status === "all" || product.status === status;
    return matchKeyword && matchCategory && matchUnit && matchStatus;
  });
}

function renderProducts() {
  const rows = getFilteredProducts();
  const page = getPageSlice(rows, "products");
  productRows.innerHTML = page.rows.map((product) => `
    <tr>
      <td>
        <div class="product-cell">
          ${renderProductThumb(product)}
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <small>${escapeHtml(product.spuCode)} · ${product.skus.length} 个 SKU</small>
          </div>
        </div>
      </td>
      <td><small>${escapeHtml(getCategoryPath(product.categoryId))}</small></td>
      <td><small>${product.unitIds.map((id) => escapeHtml(getUnitName(id))).join("<br>")}</small></td>
      <td>${renderSkuChips(product)}</td>
      <td>MOP ${getProductMinPrice(product)} 起<br><small>总库存 ${getProductStock(product)}</small></td>
      <td>${getStatusBadge(product.status)}</td>
      <td>
        <div class="row-actions">
          <button class="text-btn" type="button" data-edit="${product.id}">编辑</button>
        </div>
      </td>
    </tr>
  `).join("");

  if (!rows.length) {
    productRows.innerHTML = `<tr><td colspan="7"><small>未找到匹配 SPU。</small></td></tr>`;
  }
  renderPagination("products", page.total, page.totalPages);

  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => openDrawer(button.dataset.edit));
  });
}


function renderProductThumb(product) {
  if (product.thumb) {
    return `<img class="product-thumb" src="${escapeHtml(product.thumb)}" alt="${escapeHtml(product.name)}缩略图" />`;
  }
  const label = product.name.slice(0, 2);
  return `<span class="product-thumb generated-thumb">${escapeHtml(label)}</span>`;
}

function getOrderItemProduct(item) {
  return products.find((product) => product.id === item.productId)
    || products.find((product) => product.name === item.name)
    || null;
}

function renderOrderProductItems(items = []) {
  return `<div class="order-product-list">${items.map((item) => {
    const product = getOrderItemProduct(item);
    const previewProduct = product || { name: item.name || "商品", thumb: "" };
    return `
      <div class="order-product-item">
        ${renderProductThumb(previewProduct)}
        <div class="order-product-copy">
          <strong>${escapeHtml(item.name || previewProduct.name)}</strong>
          <small>${escapeHtml(item.sku || "默认规格")} × ${Number(item.qty || 1)}</small>
        </div>
      </div>`;
  }).join("")}</div>`;
}

function getOrderItemSku(item, product = getOrderItemProduct(item)) {
  if (!product) return null;
  return product.skus.find((sku) => sku.id === item.skuId)
    || product.skus.find((sku) => (item.sku || "").includes(sku.spec))
    || null;
}

function formatOrderMoney(value) {
  return `MOP ${Number(value || 0).toLocaleString()}`;
}

function offsetOrderTime(value, minutes) {
  const matched = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  if (!matched) return value || "--";
  const [, year, month, day, hour, minute] = matched;
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute) + minutes);
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getOrderPaymentTransactionNo(order) {
  if (order.paymentStatus === "待支付") return "未生成";
  if (order.paymentMethod === "线下登记") return "线下登记，无线上交易号";
  const channel = order.paymentMethod === "微信支付" ? "WX" : "MPAY";
  return order.paymentTransactionNo || `${channel}${order.id.replace(/\D/g, "")}01`;
}

function getOrderPaidAt(order) {
  if (order.paymentStatus === "待支付") return "未付款";
  return order.paidAt || offsetOrderTime(order.createdAt, 3);
}

function getOrderShippedAt(order) {
  if (order.deliveryType === "门店自提") return "不适用（门店自提）";
  if (order.shippedAt) return order.shippedAt;
  if (["已发货", "待签收", "已完成"].includes(order.fulfillmentStatus)) return offsetOrderTime(order.createdAt, 180);
  return "未发货";
}

function getOrderFinancials(order) {
  const calculatedGoodsAmount = order.items.reduce((total, item) => {
    const sku = getOrderItemSku(item);
    return total + Number(sku?.price || 0) * Number(item.qty || 1);
  }, 0);
  const goodsAmount = Number(order.goodsAmount ?? (calculatedGoodsAmount || order.amount));
  const deliveryFee = Number(order.deliveryFee ?? 0);
  const shopDiscount = Number(order.shopDiscount ?? Math.max(0, goodsAmount + deliveryFee - Number(order.amount || 0)));
  const paidAmount = order.paymentStatus === "待支付" ? 0 : Number(order.amount || 0);
  return { goodsAmount, deliveryFee, shopDiscount, paidAmount };
}

function getOrderProgress(order) {
  const isPresale = order.salesType === "预售";
  const isPickup = order.deliveryType === "门店自提";
  const steps = isPresale
    ? ["提交订单", "支付完成", "预售备货", "可履约", "拣货备货", isPickup ? "到达自提点" : "已发货", isPickup ? "待自提" : "待签收", "已完成"]
    : ["提交订单", "支付完成", "拣货备货", isPickup ? "到达自提点" : "已发货", isPickup ? "待自提" : "待签收", "已完成"];
  const status = order.fulfillmentStatus;
  let currentIndex = order.paymentStatus === "待支付" ? 0 : 1;
  if (["待备货", "备货中"].includes(status)) currentIndex = steps.indexOf("预售备货");
  if (status === "可履约") currentIndex = steps.indexOf("可履约");
  if (["待拣货", "已拣货", "待发货"].includes(status)) currentIndex = steps.indexOf("拣货备货");
  if (status === "已到自提点") currentIndex = steps.indexOf("到达自提点");
  if (status === "待自提") currentIndex = steps.indexOf("待自提");
  if (["已发货", "待签收"].includes(status)) currentIndex = steps.indexOf("待签收");
  if (status === "已完成") currentIndex = steps.length - 1;
  return { steps, currentIndex: Math.max(0, currentIndex) };
}

function renderOrderProgress(order) {
  const { steps, currentIndex } = getOrderProgress(order);
  return `
    <section class="order-progress-section" aria-label="订单进度">
      <div class="order-progress-head">
        <div><span>订单进度</span><strong>${escapeHtml(order.fulfillmentStatus)}</strong></div>
        ${getOrderBadge(order.paymentStatus)}
      </div>
      <div class="order-progress-track" style="--order-step-count: ${steps.length}">
        ${steps.map((step, index) => `
          <div class="order-progress-step ${index < currentIndex ? "done" : ""} ${index === currentIndex ? "current" : ""}" ${index === currentIndex ? 'aria-current="step"' : ""}>
            <span>${index < currentIndex ? "✓" : index + 1}</span>
            <small>${escapeHtml(step)}</small>
          </div>
        `).join("")}
      </div>
    </section>`;
}

function renderOrderDetailProducts(order) {
  return `<div class="order-detail-products">${order.items.map((item) => {
    const product = getOrderItemProduct(item);
    const sku = getOrderItemSku(item, product);
    return `
      <article class="order-detail-product">
        ${renderProductThumb(product || { name: item.name || "商品", thumb: "" })}
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <small>SKU：${escapeHtml(item.sku || "默认规格")}</small>
          <small>唯一货号：${escapeHtml(item.skuCode || sku?.code || "未关联货号")}</small>
        </div>
        <b>× ${Number(item.qty || 1)}</b>
      </article>`;
  }).join("")}</div>`;
}

function renderSkuChips(product) {
  return product.skus.map((sku) => `
    <div class="sku-chip">
      <strong>${escapeHtml(sku.spec)}</strong>
      <span>${escapeHtml(sku.code)}</span>
      <small>库存 ${sku.stock} / 预警 ${sku.warning}</small>
    </div>
  `).join("");
}

function getStatusBadge(status) {
  const className = {
    "上架": "up",
    "预售": "presale",
    "售罄": "soldout",
    "下架": "down",
  }[status] || "";
  return `<span class="badge ${className}">${status}</span>`;
}

function getInventoryAlerts() {
  return products.flatMap((product) => product.skus
    .map((sku) => ({ product, sku }))
    .filter(({ product, sku }) => Number(sku.stock) <= Number(sku.warning) || !sku.saleable || product.status === "售罄"));
}

function getInventoryAlertType(product, sku) {
  if (!sku.saleable || product.status === "售罄") return "不可售";
  if (Number(sku.stock) <= 0) return "售罄";
  return "低库存";
}

function renderInventoryAlerts() {
  const alerts = getInventoryAlerts();
  updateInventoryTodoCount(alerts.length);
  const page = getPageSlice(alerts, "inventoryAlerts");
  inventoryAlertRows.innerHTML = page.rows.map(({ product, sku }) => `
    <tr>
      <td>
        <div class="product-cell">
          ${renderProductThumb(product)}
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <small>${escapeHtml(sku.spec)}</small>
          </div>
        </div>
      </td>
      <td><small>${escapeHtml(sku.code)}</small></td>
      <td><small>${product.unitIds.map((id) => escapeHtml(getUnitName(id))).join("<br>")}</small></td>
      <td>${getInventoryBadge(getInventoryAlertType(product, sku))}</td>
      <td><strong>${sku.stock}</strong></td>
      <td>${sku.warning}</td>
      <td>
        <div class="row-actions">
          <button class="text-btn" type="button" data-restock="${product.id}|${sku.id}">补库存</button>
          <button class="text-btn danger-text" type="button" data-shelve-off="${product.id}">下架</button>
        </div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="7"><small>暂无库存异常 SKU。</small></td></tr>`;
  renderPagination("inventoryAlerts", page.total, page.totalPages);
  document.querySelectorAll("[data-restock]").forEach((button) => button.addEventListener("click", () => openRestockDialog(button.dataset.restock)));
  document.querySelectorAll("[data-shelve-off]").forEach((button) => button.addEventListener("click", () => openShelveOffDialog(button.dataset.shelveOff)));
}


function updateInventoryTodoCount(count = getInventoryAlerts().length) {
  const target = document.querySelector("#inventoryTodoCount");
  if (target) target.textContent = String(count);
}

function getInventoryBadge(type) {
  const map = { "低库存": "presale", "售罄": "soldout", "不可售": "down" };
  return `<span class="badge ${map[type] || ""}">${type}</span>`;
}

function findProductAndSku(productId, skuId) {
  const product = products.find((item) => item.id === productId);
  const sku = product?.skus.find((item) => item.id === skuId);
  return { product, sku };
}

function openRestockDialog(value) {
  const [productId, skuId] = value.split("|");
  const { product, sku } = findProductAndSku(productId, skuId);
  if (!product || !sku) return;
  document.querySelector("#restockProductId").value = productId;
  document.querySelector("#restockSkuId").value = skuId;
  document.querySelector("#restockAmount").value = 1;
  document.querySelector("#restockSummary").innerHTML = `
    <strong>${escapeHtml(product.name)}</strong>
    <span>${escapeHtml(sku.spec)} · ${escapeHtml(sku.code)}</span>
    <small>当前库存 ${sku.stock}，预警库存 ${sku.warning}</small>
  `;
  restockDialog.showModal();
}

function closeRestockDialog() {
  restockDialog.close();
}

function confirmRestock() {
  const productId = document.querySelector("#restockProductId").value;
  const skuId = document.querySelector("#restockSkuId").value;
  const amount = Math.max(0, Number(document.querySelector("#restockAmount").value || 0));
  if (!amount) return;
  products = products.map((product) => product.id !== productId ? product : {
    ...product,
    status: product.status === "售罄" ? "上架" : product.status,
    skus: product.skus.map((sku) => sku.id !== skuId ? sku : {
      ...sku,
      stock: Number(sku.stock) + amount,
      saleable: true,
    }),
  });
  closeRestockDialog();
  renderProducts();
  renderInventoryAlerts();
}

function openShelveOffDialog(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  document.querySelector("#shelveOffProductId").value = productId;
  document.querySelector("#shelveOffSummary").innerHTML = `
    <strong>${escapeHtml(product.name)}</strong>
    <span>${escapeHtml(product.spuCode)}</span>
    <small>当前有 ${product.skus.length} 个 SKU。确认下架后不再显示在库存预警列表。</small>
  `;
  shelveOffDialog.showModal();
}

function closeShelveOffDialog() {
  shelveOffDialog.close();
}

function confirmShelveOff() {
  const productId = document.querySelector("#shelveOffProductId").value;
  products = products.map((product) => product.id !== productId ? product : {
    ...product,
    status: "下架",
    skus: product.skus.map((sku) => ({
      ...sku,
      stock: Math.max(Number(sku.stock), Number(sku.warning) + 1),
      saleable: true,
    })),
  });
  closeShelveOffDialog();
  renderProducts();
  renderInventoryAlerts();
}

[productSearch, categoryFilter, unitFilter, statusFilter].forEach((control) => {
  control.addEventListener("input", () => { resetPagination("products"); renderProducts(); });
});

statusTabs.forEach((button) => {
  button.addEventListener("click", () => {
    statusTabs.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedTabStatus = button.dataset.status;
    statusFilter.value = "all";
    resetPagination("products");
    renderProducts();
  });
});

document.querySelector("#openProductBtn").addEventListener("click", () => openDrawer());
document.querySelector("#closeDrawerBtn").addEventListener("click", closeDrawer);
document.querySelector("#saveProductBtn").addEventListener("click", saveProductFromDrawer);
document.querySelector("#addSkuBtn").addEventListener("click", () => addSkuEditorRow());
spuTabButtons.forEach((button) => button.addEventListener("click", () => switchSpuTab(button.dataset.spuTab)));
document.querySelector("#mainImageRows").addEventListener("change", handleMainImageUpload);
document.querySelector("#closeRestockDialogBtn").addEventListener("click", closeRestockDialog);
document.querySelector("#cancelRestockBtn").addEventListener("click", closeRestockDialog);
document.querySelector("#confirmRestockBtn").addEventListener("click", confirmRestock);
document.querySelector("#closeShelveOffDialogBtn").addEventListener("click", closeShelveOffDialog);
document.querySelector("#cancelShelveOffBtn").addEventListener("click", closeShelveOffDialog);
document.querySelector("#confirmShelveOffBtn").addEventListener("click", confirmShelveOff);


function switchSpuTab(tab) {
  spuTabButtons.forEach((button) => button.classList.toggle("active", button.dataset.spuTab === tab));
  document.querySelector("#baseTabPanel").classList.toggle("active", tab === "base");
  document.querySelector("#mediaTabPanel").classList.toggle("active", tab === "media");
}

function renderMainImageInputs(images = []) {
  const list = Array.from({ length: 5 }, (_, index) => images[index] || "");
  document.querySelector("#mainImageRows").innerHTML = list.map((src, index) => `
    <div class="image-slot ${index === 0 ? "main-slot" : ""}">
      <div class="image-preview">${src ? `<img src="${escapeHtml(src)}" alt="商品主图 ${index + 1}" />` : `<span>上传图片</span>`}</div>
      <label>
        <span>${index === 0 ? "主图地址" : `图片 ${index + 1} 地址`}</span>
        <input class="main-image-input" value="${escapeHtml(src)}" placeholder="粘贴图片 URL 或上传后生成的地址" />
      </label>
      <label class="upload-line">
        <input class="main-image-file" type="file" accept="image/*" data-image-index="${index}" />
        <span>上传图片</span>
      </label>
      ${index === 0 ? `<small>客户端默认主图</small>` : `<small>客户端轮播图</small>`}
    </div>
  `).join("");
}

function getGalleryFromForm() {
  return Array.from(document.querySelectorAll(".main-image-input"))
    .map((input) => input.value.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function handleMainImageUpload(event) {
  if (!event.target.classList.contains("main-image-file") || !event.target.files?.[0]) return;
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const slot = event.target.closest(".image-slot");
    const input = slot.querySelector(".main-image-input");
    const preview = slot.querySelector(".image-preview");
    input.value = reader.result;
    preview.innerHTML = `<img src="${reader.result}" alt="商品主图预览" />`;
  });
  reader.readAsDataURL(file);
}

function openDrawer(productId) {
  editingProductId = productId || null;
  const product = products.find((item) => item.id === productId);
  drawerTitle.textContent = product ? "编辑 SPU" : "新增 SPU";

  document.querySelector("#formName").value = product?.name || "圣若瑟校服短袖衬衫";
  document.querySelector("#formSpuCode").value = product?.spuCode || `SPU-${Date.now().toString().slice(-6)}`;
  document.querySelector("#formCategory").value = product?.categoryId || getLeafCategories()[0]?.id || "";
  document.querySelector("#formStatus").value = product?.status || "上架";
  document.querySelector("#formPresale").checked = product?.status === "预售";
  renderMainImageInputs(product?.gallery || [product?.thumb].filter(Boolean));
  document.querySelector("#detailEditor").innerHTML = product?.detailHtml || "<h3>商品详情标题</h3><p>在这里维护客户端展示的商品详细介绍，可包含段落、卖点说明、尺码提示和配送说明。</p>";
  switchSpuTab("base");

  renderProductUnitChoices(product?.unitIds || [units[0]?.id].filter(Boolean));

  document.querySelector("#skuEditorRows").innerHTML = "";
  (product?.skus || [{ spec: "白色 / 男女款 / 夏季", code: "SKU-NEW-001", price: 188, stock: 0, warning: 10, saleable: true }])
    .forEach((sku) => addSkuEditorRow(sku));

  productDialog.showModal();
}

function addSkuEditorRow(sku = {}) {
  const row = document.createElement("div");
  row.className = "sku-row sku-form-row";
  row.innerHTML = `
    <input value="${escapeHtml(sku.spec || "")}" aria-label="SKU 规格" />
    <input value="${escapeHtml(sku.code || "")}" aria-label="SKU 唯一货号" />
    <input value="${escapeHtml(sku.price ?? 0)}" type="number" aria-label="SKU 价格" />
    <input value="${escapeHtml(sku.stock ?? 0)}" type="number" aria-label="SKU 库存" />
    <input value="${escapeHtml(sku.warning ?? 0)}" type="number" aria-label="SKU 预警库存" />
    <label class="switch"><input type="checkbox" ${sku.saleable === false ? "" : "checked"} /><span></span></label>
  `;
  document.querySelector("#skuEditorRows").appendChild(row);
}

function saveProductFromDrawer() {
  const skuRows = Array.from(document.querySelectorAll("#skuEditorRows .sku-form-row"));
  const skus = skuRows.map((row, index) => {
    const inputs = row.querySelectorAll("input");
    return {
      id: editingProductId ? `${editingProductId}-sku-${index}` : `sku-${Date.now()}-${index}`,
      spec: inputs[0].value.trim(),
      code: inputs[1].value.trim(),
      price: Number(inputs[2].value || 0),
      stock: Number(inputs[3].value || 0),
      warning: Number(inputs[4].value || 0),
      saleable: inputs[5].checked,
    };
  }).filter((sku) => sku.spec && sku.code);

  const unitIds = Array.from(document.querySelectorAll('#formUnits input[type="checkbox"]:checked'))
    .map((checkbox) => checkbox.value);
  if (!unitIds.length) {
    document.querySelector("#formUnits").classList.add("has-error");
    document.querySelector("#formUnits").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  document.querySelector("#formUnits").classList.remove("has-error");
  const product = {
    id: editingProductId || `spu-${Date.now()}`,
    spuCode: document.querySelector("#formSpuCode").value.trim(),
    name: document.querySelector("#formName").value.trim(),
    categoryId: document.querySelector("#formCategory").value,
    unitIds,
    thumb: getGalleryFromForm()[0] || "",
    gallery: getGalleryFromForm(),
    detailHtml: document.querySelector("#detailEditor").innerHTML.trim(),
    status: document.querySelector("#formPresale").checked ? "预售" : document.querySelector("#formStatus").value,
    description: document.querySelector("#detailEditor").innerText.trim(),
    skus: skus.length ? skus : [{ id: `sku-${Date.now()}`, spec: "默认规格", code: `SKU-${Date.now()}`, price: 0, stock: 0, warning: 0, saleable: true }],
  };

  if (editingProductId) {
    products = products.map((item) => item.id === editingProductId ? product : item);
  } else {
    products.unshift(product);
  }

  renderProducts();
  renderInventoryAlerts();
  renderOrders();
  renderAfterSales();
  closeDrawer();
}

function closeDrawer() {
  productDialog.close();
}

function renderUnitLogo(unit) {
  if (unit.logo) return `<img class="unit-logo" src="${escapeHtml(unit.logo)}" alt="${escapeHtml(unit.name)} Logo" />`;
  return `<span class="unit-logo generated-thumb">${escapeHtml(unit.name.slice(0, 2))}</span>`;
}


function getOrderFilteredRows(salesType = "现售") {
  const prefix = salesType === "预售" ? "presale" : "";
  const keyword = document.querySelector(prefix ? "#presaleOrderSearch" : "#orderSearch").value.trim().toLowerCase();
  const status = document.querySelector(prefix ? "#presaleOrderStatusFilter" : "#orderStatusFilter").value;
  const unit = document.querySelector(prefix ? "#presaleOrderUnitFilter" : "#orderUnitFilter").value;
  const delivery = document.querySelector(prefix ? "#presaleDeliveryFilter" : "#deliveryFilter").value;
  const payment = document.querySelector(prefix ? "#presalePaymentFilter" : "#paymentFilter").value;
  const paymentStatus = document.querySelector(prefix ? "#presalePaymentStatusFilter" : "#paymentStatusFilter").value;
  const afterSale = document.querySelector(prefix ? "#presaleAfterSaleFilter" : "#afterSaleFilter").value;
  const orderDate = document.querySelector(prefix ? "#presaleOrderDateFilter" : "#orderDateFilter").value;

  return orders.filter((order) => {
    const matchSalesType = (order.salesType || "现售") === salesType;
    const itemText = order.items.map((item) => `${item.name} ${item.sku}`).join(" ");
    const text = `${order.id} ${order.customer} ${order.phone} ${getUnitName(order.unitId)} ${itemText} ${order.trackingNo}`.toLowerCase();
    const activeTab = salesType === "预售" ? selectedPresaleOrderTab : selectedOrderTab;
    const tabMatch = activeTab === "all" || order.paymentStatus === activeTab || order.fulfillmentStatus === activeTab || order.afterSaleStatus === activeTab;
    const hasAfterSale = order.afterSaleStatus !== "无";
    return matchSalesType && (!keyword || text.includes(keyword))
      && tabMatch
      && (status === "all" || order.fulfillmentStatus === status)
      && (unit === "all" || order.unitId === unit)
      && (delivery === "all" || order.deliveryType === delivery)
      && (payment === "all" || order.paymentMethod === payment)
      && (paymentStatus === "all" || order.paymentStatus === paymentStatus)
      && (afterSale === "all" || (afterSale === "yes" && hasAfterSale) || (afterSale === "no" && !hasAfterSale))
      && (!orderDate || order.createdAt.slice(0, 10) === orderDate);
  });
}

function renderOrders() {
  const rows = getOrderFilteredRows();
  const page = getPageSlice(rows, "orders");
  orderRows.innerHTML = page.rows.map((order) => `
    <tr>
      <td><strong>${escapeHtml(order.id)}</strong><small>${escapeHtml(order.createdAt)}</small></td>
      <td><strong>${escapeHtml(order.customer)}</strong><small>${escapeHtml(order.phone)}<br>${escapeHtml(getUnitName(order.unitId))}</small></td>
      <td>${getOrderBadge(order.salesType || "现售")}<br><small>${escapeHtml(order.deliveryType)}</small></td>
      <td>${renderOrderProductItems(order.items)}</td>
      <td><strong>MOP ${order.amount.toLocaleString()}</strong><small>${escapeHtml(order.paymentMethod)}</small><br>${getOrderBadge(order.paymentStatus)}</td>
      <td><strong>${escapeHtml(order.deliveryType)}</strong><small>${escapeHtml(order.deliveryCompany || order.pickupStore || "待设置")}${order.trackingNo ? `<br>${escapeHtml(order.trackingNo)}` : ""}</small><br>${getOrderBadge(order.fulfillmentStatus)}</td>
      <td>${getOrderBadge(order.afterSaleStatus === "无" ? "无售后" : order.afterSaleStatus)}</td>
      <td><button class="text-btn" type="button" data-order-detail="${order.id}">查看</button></td>
    </tr>
  `).join("") || `<tr><td colspan="8"><small>未找到匹配订单。</small></td></tr>`;
  renderPagination("orders", page.total, page.totalPages);

  document.querySelectorAll("[data-order-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedOrderId = button.dataset.orderDetail;
      renderOrderDetail();
      orderDialog.showModal();
    });
  });
}

function renderPresaleOrders() {
  const rows = getOrderFilteredRows("预售");
  const page = getPageSlice(rows, "presaleOrders");
  presaleOrderRows.innerHTML = page.rows.map((order) => `
    <tr>
      <td><strong>${escapeHtml(order.id)}</strong><small>${escapeHtml(order.createdAt)}<br>预计到货：${escapeHtml(order.eta || "待定")}</small></td>
      <td><strong>${escapeHtml(order.customer)}</strong><small>${escapeHtml(order.phone)}<br>${escapeHtml(getUnitName(order.unitId))}</small></td>
      <td>${getOrderBadge(order.salesType || "预售")}<br><small>${escapeHtml(order.deliveryType)}</small></td>
      <td>${renderOrderProductItems(order.items)}</td>
      <td><strong>MOP ${order.amount.toLocaleString()}</strong><small>${escapeHtml(order.paymentMethod)}</small><br>${getOrderBadge(order.paymentStatus)}</td>
      <td><strong>${escapeHtml(order.deliveryType)}</strong><small>${escapeHtml(order.deliveryCompany || order.pickupStore || "待设置")}${order.trackingNo ? `<br>${escapeHtml(order.trackingNo)}` : ""}</small><br>${getOrderBadge(order.fulfillmentStatus)}</td>
      <td>${getOrderBadge(order.afterSaleStatus === "无" ? "无售后" : order.afterSaleStatus)}</td>
      <td><button class="text-btn" type="button" data-order-detail="${order.id}">查看</button></td>
    </tr>
  `).join("") || `<tr><td colspan="8"><small>未找到匹配预售订单。</small></td></tr>`;
  renderPagination("presaleOrders", page.total, page.totalPages);

  document.querySelectorAll("#presaleOrdersPage [data-order-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedOrderId = button.dataset.orderDetail;
      renderOrderDetail();
      orderDialog.showModal();
    });
  });
}

function renderOrderDetail() {
  const order = orders.find((item) => item.id === selectedOrderId) || orders[0];
  if (!order || !orderDetail) return;
  orderDialogTitle.textContent = `${order.id} 订单详情`;
  const financials = getOrderFinancials(order);
  const isPickup = order.deliveryType === "门店自提";
  const shipmentCompleted = ["已发货", "待签收", "已完成"].includes(order.fulfillmentStatus);
  const canShip = order.paymentStatus === "已支付" && ["已拣货", "待发货"].includes(order.fulfillmentStatus);
  const pickupPrepared = ["已到自提点", "待自提", "已完成"].includes(order.fulfillmentStatus);

  orderDetail.innerHTML = `
    ${renderOrderProgress(order)}
    <div class="order-detail-grid">
      <section class="detail-block order-info-block">
        <h4>订单信息</h4>
        <dl class="order-info-list">
          <div><dt>订单编号</dt><dd>${escapeHtml(order.id)}</dd></div>
          <div><dt>支付方式</dt><dd>${escapeHtml(order.paymentMethod)}</dd></div>
          <div class="wide"><dt>支付交易号</dt><dd>${escapeHtml(getOrderPaymentTransactionNo(order))}</dd></div>
          <div><dt>创建时间</dt><dd>${escapeHtml(order.createdAt)}</dd></div>
          <div><dt>付款时间</dt><dd>${escapeHtml(getOrderPaidAt(order))}</dd></div>
          <div><dt>发货时间</dt><dd>${escapeHtml(getOrderShippedAt(order))}</dd></div>
          <div><dt>客户</dt><dd>${escapeHtml(order.customer)} · ${escapeHtml(order.phone)}</dd></div>
          <div><dt>销售 / 履约</dt><dd>${escapeHtml(order.salesType || "现售")} · ${escapeHtml(order.deliveryType)}</dd></div>
          <div class="wide"><dt>客户留言</dt><dd>${escapeHtml(order.remark || "无")}</dd></div>
        </dl>
      </section>
      <section class="detail-block order-payment-block">
        <h4>付款详情</h4>
        <dl class="payment-summary-list">
          <div><dt>商品总价</dt><dd>${formatOrderMoney(financials.goodsAmount)}</dd></div>
          <div><dt>配送费</dt><dd>${formatOrderMoney(financials.deliveryFee)}</dd></div>
          <div><dt>店铺优惠</dt><dd>- ${formatOrderMoney(financials.shopDiscount)}</dd></div>
          <div class="paid"><dt>实付款</dt><dd>${formatOrderMoney(financials.paidAmount)}</dd></div>
        </dl>
      </section>
    </div>
    <section class="detail-block">
      <h4>商品信息</h4>
      ${renderOrderDetailProducts(order)}
    </section>
    ${isPickup ? `
      <section class="detail-block fulfillment-operation">
        <div class="operation-title"><div><h4>自提备货</h4><small>自提订单无需填写物流信息。</small></div>${getOrderBadge(order.fulfillmentStatus)}</div>
        <label><span>自提门店</span><select id="orderPickupStore"><option>${escapeHtml(order.pickupStore || "MC 澳门门市")}</option><option>MC 氹仔门市</option></select></label>
        <label><span>备货备注</span><textarea id="orderPickupRemark" placeholder="填写备货位置或交接说明">${escapeHtml(order.warehouseRemark || "")}</textarea></label>
        <div class="operation-footer"><span id="orderPickupHint" class="form-hint">确认后订单进入待自提状态。</span><button class="primary-btn compact" data-confirm-pickup-prepared type="button" ${pickupPrepared ? "disabled" : ""}>${pickupPrepared ? "已完成备货" : "确认完成备货"}</button></div>
      </section>` : `
      <form id="orderShippingForm" class="detail-block fulfillment-operation">
        <div class="operation-title"><div><h4>填写物流并发货</h4><small>确认发货后系统自动记录发货时间。</small></div>${getOrderBadge(order.fulfillmentStatus)}</div>
        <div class="shipping-form-grid">
          <label><span>物流公司</span><select id="orderDeliveryCompany"><option>${escapeHtml(order.deliveryCompany || "本地配送车队")}</option><option>顺丰澳门</option><option>澳门本地配送</option></select></label>
          <label><span>物流单号</span><input id="orderTrackingNo" value="${escapeHtml(order.trackingNo || "")}" placeholder="请输入物流单号" /></label>
        </div>
        <label><span>发货备注</span><textarea id="orderShippingRemark" placeholder="填写仓库交接或配送说明">${escapeHtml(order.warehouseRemark || "")}</textarea></label>
        <div class="operation-footer"><span id="orderShippingHint" class="form-hint">${canShip ? "物流公司和物流单号为必填项。" : "当前订单需完成支付和拣货后才能发货。"}</span><button class="primary-btn compact" type="submit" ${canShip ? "" : "disabled"}>${shipmentCompleted ? "已确认发货" : canShip ? "填写物流并确认发货" : "当前状态不可发货"}</button></div>
      </form>`}
    <section class="detail-block service-note-block">
      <div class="operation-title"><div><h4>客服备注</h4><small>仅后台可见，不会展示到商城客户端。</small></div><span class="internal-only-tag">后台可见</span></div>
      <textarea id="orderServiceRemark" placeholder="填写客服跟进、特殊处理或内部协作信息">${escapeHtml(order.serviceRemark || "")}</textarea>
      <div class="operation-footer"><span id="orderServiceHint" class="form-hint">当前操作：${escapeHtml(getOrderNextAction(order))}</span><button class="ghost-btn compact" data-save-order-service-note type="button">保存客服备注</button></div>
    </section>
    <section class="detail-block"><h4>操作日志</h4><ul class="record-list"><li>${escapeHtml(order.createdAt)} 客户提交订单</li><li>${escapeHtml(getOrderPaidAt(order))} ${escapeHtml(order.paymentStatus)}</li>${order.preparedAt ? `<li>${escapeHtml(order.preparedAt)} 后台确认完成备货</li>` : ""}${order.shippedAt ? `<li>${escapeHtml(order.shippedAt)} 后台填写物流并确认发货</li>` : ""}<li>当前履约状态：${escapeHtml(order.fulfillmentStatus)}</li></ul></section>
  `;
  bindOrderDetailActions(order);
}

function getCurrentOrderTime() {
  const date = new Date();
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function bindOrderDetailActions(order) {
  document.querySelector("#orderShippingForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const company = document.querySelector("#orderDeliveryCompany").value.trim();
    const trackingNo = document.querySelector("#orderTrackingNo").value.trim();
    const hint = document.querySelector("#orderShippingHint");
    if (!company || !trackingNo) {
      hint.textContent = "请完整填写物流公司和物流单号。";
      return;
    }
    order.deliveryCompany = company;
    order.trackingNo = trackingNo;
    order.warehouseRemark = document.querySelector("#orderShippingRemark").value.trim();
    order.shippedAt = getCurrentOrderTime();
    order.fulfillmentStatus = "待签收";
    order.nextAction = "查看物流 / 手动签收";
    renderOrderDetail();
    renderOrders();
    renderPresaleOrders();
  });

  document.querySelector("[data-confirm-pickup-prepared]")?.addEventListener("click", () => {
    order.pickupStore = document.querySelector("#orderPickupStore").value;
    order.warehouseRemark = document.querySelector("#orderPickupRemark").value.trim();
    order.preparedAt = getCurrentOrderTime();
    order.fulfillmentStatus = "待自提";
    order.nextAction = "核销自提码";
    renderOrderDetail();
    renderOrders();
    renderPresaleOrders();
  });

  document.querySelector("[data-save-order-service-note]")?.addEventListener("click", () => {
    order.serviceRemark = document.querySelector("#orderServiceRemark").value.trim();
    document.querySelector("#orderServiceHint").textContent = `已保存，仅后台可见 · ${getCurrentOrderTime()}`;
  });
}

function getOrderBadge(status) {
  const className = {
    "已支付": "up",
    "待支付": "presale",
    "已退款": "soldout",
    "待发货": "presale",
    "待自提": "presale",
    "售后中": "soldout",
    "无": "down",
    "已完成": "up",
    "已发货": "up",
    "已拒绝": "down",
    "处理中": "presale",
    "售后发起": "soldout",
    "已受理": "up",
    "现售": "up",
    "预售": "presale",
    "无售后": "down",
    "待备货": "presale",
    "备货中": "presale",
    "可履约": "up",
    "待拣货": "presale",
    "已拣货": "up",
    "待签收": "up",
    "已到自提点": "up",
  }[status] || "";
  return `<span class="badge ${className}">${escapeHtml(status)}</span>`;
}

function getOrderNextAction(order) {
  if (order.afterSaleStatus === "售后中") return "查看售后详情";
  if (order.nextAction) return order.nextAction;
  const status = order.fulfillmentStatus;
  const delivery = order.deliveryType;
  if (order.paymentStatus === "待支付") return "查看订单 / 取消订单";
  if (status === "待备货") return "开始备货";
  if (status === "备货中") return "标记可履约";
  if (status === "可履约") return "去拣货";
  if (status === "待拣货") return "开始拣货";
  if (status === "已拣货" && delivery === "澳门本地配送") return "填写物流并发货";
  if (status === "已拣货" && delivery === "门店自提") return "标记已到自提点";
  if (status === "待签收") return "查看物流 / 手动签收";
  if (status === "待自提") return "核销自提码";
  if (status === "已完成") return "查看订单 / 发起售后";
  return "查看";
}

function getSkuBarcodeRecord(barcode) {
  const normalized = String(barcode || "").trim();
  for (const product of products) {
    const sku = product.skus.find((item) => item.barcode === normalized);
    if (sku) return { product, sku };
  }
  return null;
}

function getExchangeEligibleOrders(keyword) {
  const normalized = String(keyword || "").trim().toLowerCase();
  const compactKeyword = normalized.replace(/\s+/g, "");
  if (!normalized) return [];
  return orders.filter((order) => {
    const phone = String(order.phone || "").toLowerCase();
    const barcodes = order.items.map((item) => item.barcode || "").join(" ").toLowerCase();
    const matches = order.customer.toLowerCase().includes(normalized)
      || phone.includes(normalized)
      || phone.replace(/\s+/g, "").includes(compactKeyword)
      || barcodes.includes(normalized);
    return matches && order.paymentStatus === "已支付" && order.fulfillmentStatus === "已完成";
  });
}

function setExchangeStep(step) {
  exchangeSearchStep.classList.toggle("hidden", step !== 1);
  exchangeBarcodeStep.classList.toggle("hidden", step !== 2);
  exchangeConfirmStep.classList.toggle("hidden", step !== 3);
  exchangeSuccessStep.classList.toggle("hidden", step !== 4);
  document.querySelectorAll("[data-exchange-step-indicator]").forEach((item) => {
    item.classList.toggle("active", Number(item.dataset.exchangeStepIndicator) <= Math.min(step, 3));
  });
}

function renderExchangeOrderResults(rows = [], searched = false) {
  const confirmButton = document.querySelector("#confirmExchangeOrderBtn");
  confirmButton.disabled = !selectedExchangeOrderId;
  if (!searched) {
    exchangeOrderResults.innerHTML = `<div class="exchange-result-empty">输入货品条码、手机号或收货人姓名后查询历史订单。</div>`;
    return;
  }
  if (!rows.length) {
    exchangeOrderResults.innerHTML = `<div class="exchange-result-empty">未找到已支付且已完成的匹配订单，请核对查询信息。</div>`;
    return;
  }
  exchangeOrderResults.innerHTML = `
    <table class="exchange-result-table">
      <thead><tr><th>选择</th><th>订单 / 时间</th><th>收货人</th><th>商品 / 条码</th><th>履约</th></tr></thead>
      <tbody>${rows.map((order) => `
        <tr data-exchange-order-row="${order.id}" class="${selectedExchangeOrderId === order.id ? "selected" : ""}">
          <td><input type="radio" name="exchangeOrder" value="${order.id}" ${selectedExchangeOrderId === order.id ? "checked" : ""} aria-label="选择订单 ${order.id}" /></td>
          <td><strong>${escapeHtml(order.id)}</strong><small>${escapeHtml(order.createdAt)}</small></td>
          <td><strong>${escapeHtml(order.customer)}</strong><small>${escapeHtml(order.phone)}</small></td>
          <td>${order.items.map((item) => `<strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.sku)} · ${escapeHtml(item.barcode || "未登记条码")}</small>`).join("")}</td>
          <td>${getOrderBadge(order.fulfillmentStatus)}<small>${escapeHtml(order.pickupStore || order.deliveryType)}</small></td>
        </tr>
      `).join("")}</tbody>
    </table>`;
  document.querySelectorAll("[data-exchange-order-row]").forEach((row) => {
    row.addEventListener("click", () => {
      selectedExchangeOrderId = row.dataset.exchangeOrderRow;
      renderExchangeOrderResults(exchangeMatches, true);
    });
  });
}

function openExchangeDialog() {
  selectedExchangeOrderId = null;
  exchangeMatches = [];
  pendingExchange = null;
  createdExchangeAfterSaleId = null;
  document.querySelector("#exchangeOrderSearch").value = "";
  document.querySelector("#exchangeReturnBarcode").value = "";
  document.querySelector("#exchangeOutboundBarcode").value = "";
  document.querySelector("#exchangeConfirmCheck").checked = false;
  document.querySelector("#exchangeSearchHint").textContent = "可输入示例：6901001001012、6688 1226 或 梁太。";
  document.querySelector("#exchangeBarcodeHint").textContent = "录入两个条码后核对库存变化。";
  document.querySelector("#exchangeConfirmHint").textContent = "最终确认后将自动更新两个 SKU 的库存，并生成已完成售后单。";
  renderExchangeOrderResults();
  setExchangeStep(1);
  exchangeDialog.showModal();
  requestAnimationFrame(() => document.querySelector("#exchangeOrderSearch")?.focus());
}

function queryExchangeOrders() {
  const input = document.querySelector("#exchangeOrderSearch");
  const keyword = input.value.trim();
  const hint = document.querySelector("#exchangeSearchHint");
  if (!keyword) {
    hint.textContent = "请先输入货品条码、手机号或收货人姓名。";
    input.focus();
    return;
  }
  selectedExchangeOrderId = null;
  exchangeMatches = getExchangeEligibleOrders(keyword);
  hint.textContent = exchangeMatches.length ? `找到 ${exchangeMatches.length} 笔可办理换货的历史订单。` : "仅显示已支付且已完成的历史订单。";
  renderExchangeOrderResults(exchangeMatches, true);
}

function confirmExchangeOrder() {
  const order = orders.find((item) => item.id === selectedExchangeOrderId);
  if (!order) return;
  const originalRecord = getSkuBarcodeRecord(order.items[0]?.barcode);
  const availableExchangeSkus = originalRecord?.product.skus.filter((sku) => sku.barcode && sku.saleable && Number(sku.stock) > 0 && sku.barcode !== order.items[0]?.barcode) || [];
  document.querySelector("#exchangeSelectedOrderSummary").innerHTML = `
    <strong>${escapeHtml(order.id)} · ${escapeHtml(order.customer)}</strong>
    <span>${escapeHtml(order.phone)} · ${escapeHtml(order.createdAt)} · ${escapeHtml(order.pickupStore || order.deliveryType)}</span>
    ${order.items.map((item) => `<small>${escapeHtml(item.name)} / ${escapeHtml(item.sku)} / 原货品条码 ${escapeHtml(item.barcode || "未登记")}</small>`).join("")}
    ${availableExchangeSkus.length ? `<small>当前可换条码：${availableExchangeSkus.map((sku) => `${escapeHtml(sku.barcode)}（${escapeHtml(sku.spec)}，库存 ${sku.stock}）`).join("；")}</small>` : ""}`;
  document.querySelector("#exchangeReturnBarcode").value = order.items[0]?.barcode || "";
  document.querySelector("#exchangeOutboundBarcode").value = "";
  document.querySelector("#exchangeBarcodeHint").textContent = availableExchangeSkus.length ? "请扫描客户实际领取的新货品条码。" : "当前同款商品暂无其他可换库存。";
  setExchangeStep(2);
  requestAnimationFrame(() => document.querySelector("#exchangeOutboundBarcode")?.focus());
}

function reviewExchange() {
  const order = orders.find((item) => item.id === selectedExchangeOrderId);
  const returnBarcode = document.querySelector("#exchangeReturnBarcode").value.trim();
  const outboundBarcode = document.querySelector("#exchangeOutboundBarcode").value.trim();
  const hint = document.querySelector("#exchangeBarcodeHint");
  const orderItem = order?.items.find((item) => item.barcode === returnBarcode);
  const returnRecord = getSkuBarcodeRecord(returnBarcode);
  const outboundRecord = getSkuBarcodeRecord(outboundBarcode);

  if (!orderItem || !returnRecord) {
    hint.textContent = "退回货品条码不属于所选原订单，请重新核对。";
    return;
  }
  if (!outboundRecord) {
    hint.textContent = "未找到重新出库货品条码，请检查条码是否完整。";
    return;
  }
  if (returnBarcode === outboundBarcode) {
    hint.textContent = "退回和重新出库不能是同一货品条码。";
    return;
  }
  if (returnRecord.product.id !== outboundRecord.product.id) {
    hint.textContent = "重新出库货品必须与退回货品属于同一款商品。";
    return;
  }
  if (!outboundRecord.sku.saleable || Number(outboundRecord.sku.stock) < 1) {
    hint.textContent = "重新出库货品当前不可售或库存不足，无法完成换货。";
    return;
  }

  pendingExchange = { order, orderItem, returnRecord, outboundRecord, returnBarcode, outboundBarcode };
  document.querySelector("#exchangeConfirmCheck").checked = false;
  document.querySelector("#exchangeConfirmSummary").innerHTML = `
    <article class="exchange-stock-card">
      <span>客户退回 · 库存 +1</span>
      <strong>${escapeHtml(returnRecord.product.name)}</strong>
      <small>${escapeHtml(returnRecord.sku.spec)}<br>${escapeHtml(returnBarcode)}<br>库存 ${returnRecord.sku.stock} → ${Number(returnRecord.sku.stock) + 1}</small>
    </article>
    <div class="exchange-stock-arrow">⇄</div>
    <article class="exchange-stock-card">
      <span>重新出库 · 库存 -1</span>
      <strong>${escapeHtml(outboundRecord.product.name)}</strong>
      <small>${escapeHtml(outboundRecord.sku.spec)}<br>${escapeHtml(outboundBarcode)}<br>库存 ${outboundRecord.sku.stock} → ${Number(outboundRecord.sku.stock) - 1}</small>
    </article>`;
  hint.textContent = "条码校验通过，请进行最终确认。";
  setExchangeStep(3);
}

function createExchangeAfterSaleId() {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const count = afterSales.filter((item) => item.id.startsWith(`AS${datePart}`)).length + 1;
  return `AS${datePart}${String(count).padStart(3, "0")}`;
}

function completeExchange() {
  const hint = document.querySelector("#exchangeConfirmHint");
  if (!pendingExchange) return;
  if (!document.querySelector("#exchangeConfirmCheck").checked) {
    hint.textContent = "请勾选确认已核对客户、订单和实物条码。";
    return;
  }

  const { order, returnRecord, outboundRecord, returnBarcode, outboundBarcode } = pendingExchange;
  if (Number(outboundRecord.sku.stock) < 1) {
    hint.textContent = "重新出库货品库存已发生变化，请返回重新核对。";
    return;
  }
  returnRecord.sku.stock = Number(returnRecord.sku.stock) + 1;
  outboundRecord.sku.stock = Number(outboundRecord.sku.stock) - 1;
  const afterSaleId = createExchangeAfterSaleId();
  createdExchangeAfterSaleId = afterSaleId;
  afterSales.unshift({
    id: afterSaleId,
    orderId: order.id,
    type: "门店换货",
    status: "已完成",
    source: "后台录入",
    customer: order.customer,
    productId: returnRecord.product.id,
    product: returnRecord.product.name,
    sku: `${returnRecord.sku.spec} → ${outboundRecord.sku.spec}`,
    reason: "客户携带服装到门店现场换货。",
    proofs: 0,
    result: "门店已核对原订单和实物条码，现场完成换货。",
    inventoryImpact: `退回 ${returnBarcode} 库存 +1；重新出库 ${outboundBarcode} 库存 -1，系统已自动更新。`,
    records: [`门店后台录入：关联原订单 ${order.id}`, `退回货品条码：${returnBarcode}`, `重新出库货品条码：${outboundBarcode}`, "系统自动完成库存换入与换出"],
  });
  order.afterSaleStatus = "已完成";
  order.nextAction = "查看售后详情";
  resetPagination("afterSales");
  renderAfterSales();
  renderOrders();
  renderPresaleOrders();
  renderInventoryAlerts();
  document.querySelector("#exchangeSuccessText").textContent = `${afterSaleId} 已生成；退回货品库存已增加 1，重新出库货品库存已扣减 1。`;
  setExchangeStep(4);
}

function closeExchangeDialog() {
  exchangeDialog.close();
}

function viewCreatedExchangeAfterSale() {
  if (!createdExchangeAfterSaleId) return;
  selectedAfterSaleId = createdExchangeAfterSaleId;
  closeExchangeDialog();
  navigateToPage("afterSales");
  renderAfterSaleDetail();
  afterSaleDialog.showModal();
}

function getFilteredAfterSales() {
  const keyword = document.querySelector("#afterSaleSearch").value.trim().toLowerCase();
  const type = document.querySelector("#afterSaleTypeFilter").value;
  const status = document.querySelector("#afterSaleStatusFilter").value;
  return afterSales.filter((item) => {
    const text = `${item.id} ${item.orderId} ${item.customer} ${item.product} ${item.sku} ${item.reason}`.toLowerCase();
    return (!keyword || text.includes(keyword)) && (type === "all" || item.type === type) && (status === "all" || item.status === status);
  });
}

function renderAfterSales() {
  const rows = getFilteredAfterSales();
  const page = getPageSlice(rows, "afterSales");
  afterSaleRows.innerHTML = page.rows.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.id)}</strong><small>${escapeHtml(item.type)}${item.source ? ` · ${escapeHtml(item.source)}` : " · 线上申请"}</small></td>
      <td><strong>${escapeHtml(item.customer)}</strong><small>${escapeHtml(item.orderId)}</small></td>
      <td>${renderOrderProductItems([{ name: item.product, sku: item.sku, qty: item.qty || 1, productId: item.productId }])}</td>
      <td><small>${escapeHtml(item.reason)}</small><span class="proof-chip">${item.proofs} 张凭证</span></td>
      <td>${getOrderBadge(item.status)}</td>
      <td><button class="text-btn" type="button" data-aftersale-detail="${item.id}">${item.status === "已完成" ? "查看" : "审核"}</button></td>
    </tr>
  `).join("") || `<tr><td colspan="6"><small>未找到匹配售后单。</small></td></tr>`;
  renderPagination("afterSales", page.total, page.totalPages);

  document.querySelectorAll("[data-aftersale-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAfterSaleId = button.dataset.aftersaleDetail;
      renderAfterSaleDetail();
      afterSaleDialog.showModal();
    });
  });
}

function renderAfterSaleDetail() {
  const item = afterSales.find((row) => row.id === selectedAfterSaleId) || afterSales[0];
  if (!item || !afterSaleDetail) return;
  afterSaleDialogTitle.textContent = `${item.id} ${item.status === "已完成" ? "售后详情" : "售后审核"}`;
  const reviewActions = item.status === "已完成"
    ? `<span class="proof-chip">处理已完成</span>`
    : `<div class="two-actions"><button class="primary-btn compact" type="button">受理</button><button class="ghost-btn compact" type="button">拒绝</button></div>`;

  afterSaleDetail.innerHTML = `
    <section class="detail-block"><strong>${escapeHtml(item.id)}</strong><small>${escapeHtml(item.type)} · ${escapeHtml(item.status)} · ${escapeHtml(item.source || "线上申请")}</small></section>
    <section class="detail-block"><h4>${item.status === "已完成" ? "换货信息" : "审核信息"}</h4><p>${escapeHtml(item.reason)}</p><small>订单：${escapeHtml(item.orderId)}<br>商品：${escapeHtml(item.product)} / ${escapeHtml(item.sku)}<br>图片凭证：${item.proofs} 张</small>${reviewActions}</section>
    <section class="detail-block"><h4>处理记录</h4><ul class="record-list">${item.records.map((record) => `<li>${escapeHtml(record)}</li>`).join("")}</ul><textarea>${escapeHtml(item.result)}</textarea><button class="primary-btn compact" type="button">追加记录</button></section>
    <section class="detail-block"><h4>库存影响</h4><p>${escapeHtml(item.inventoryImpact)}</p><label class="check-line"><input type="checkbox" /> 已人工确认库存处理</label></section>
  `;
}

function getCustomerById(id) {
  return customers.find((customer) => customer.id === id);
}

function getFilteredCustomers() {
  const keyword = document.querySelector("#customerSearch").value.trim().toLowerCase();
  const type = document.querySelector("#customerTypeFilter").value;
  const source = document.querySelector("#customerSourceFilter").value;
  const owner = document.querySelector("#customerOwnerFilter").value;
  return customers.filter((customer) => {
    const ownerText = getEmployeeAccountText(customer.ownerId);
    const text = `${customer.id} ${customer.name} ${customer.phone} ${customer.whatsapp} ${customer.email} ${getUnitName(customer.unitId)} ${ownerText} ${customer.tags.join(" ")}`.toLowerCase();
    return (!keyword || text.includes(keyword))
      && (type === "all" || customer.type === type)
      && (source === "all" || customer.source === source)
      && (owner === "all" || customer.ownerId === owner);
  });
}

function renderCustomers() {
  const rows = getFilteredCustomers();
  const page = getPageSlice(rows, "customers");
  customerRows.innerHTML = page.rows.map((customer) => `
    <tr>
      <td><strong>${escapeHtml(customer.name)}</strong><small>${escapeHtml(customer.id)}<br>${getCrmBadge(customer.type)}</small><span class="customer-points-inline">积分 ${getCustomerPoints(customer.id).toLocaleString()}</span></td>
      <td><strong>${escapeHtml(customer.phone)}</strong><small>WhatsApp：${escapeHtml(customer.whatsapp)}<br>${escapeHtml(customer.email)}</small></td>
      <td><strong>${escapeHtml(customer.source)}</strong><div class="tag-list">${customer.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div></td>
      <td><small>${escapeHtml(getUnitName(customer.unitId))}</small></td>
      <td><strong>${customer.orderCount} 单</strong><small>售后 ${customer.afterSaleCount} 单</small></td>
      <td><button class="text-btn" type="button" data-customer-detail="${customer.id}">查看</button></td>
    </tr>
  `).join("") || `<tr><td colspan="6"><small>未找到匹配客户。</small></td></tr>`;
  renderPagination("customers", page.total, page.totalPages);

  document.querySelectorAll("[data-customer-detail]").forEach((button) => {
    button.addEventListener("click", () => openCustomerDetail(button.dataset.customerDetail));
  });
}

function getFilteredOpportunities() {
  const keyword = document.querySelector("#opportunitySearch").value.trim().toLowerCase();
  const type = document.querySelector("#opportunityTypeFilter").value;
  const status = document.querySelector("#opportunityStatusFilter").value;
  const owner = document.querySelector("#opportunityOwnerFilter").value;
  return opportunities.filter((opportunity) => {
    const customer = getCustomerById(opportunity.customerId);
    const ownerText = getEmployeeAccountText(opportunity.ownerId);
    const text = `${opportunity.id} ${opportunity.title} ${customer?.name || ""} ${customer?.phone || ""} ${opportunity.type} ${opportunity.source} ${opportunity.need} ${ownerText}`.toLowerCase();
    return (!keyword || text.includes(keyword))
      && (type === "all" || opportunity.type === type)
      && (status === "all" || opportunity.status === status)
      && (owner === "all" || opportunity.ownerId === owner)
      && (selectedOpportunityTab === "all" || opportunity.status === selectedOpportunityTab);
  });
}

function renderOpportunities() {
  const rows = getFilteredOpportunities();
  const page = getPageSlice(rows, "opportunities");
  opportunityRows.innerHTML = page.rows.map((opportunity) => {
    const customer = getCustomerById(opportunity.customerId);
    return `
      <tr>
        <td><strong>${escapeHtml(opportunity.title)}</strong><small>${escapeHtml(opportunity.id)}<br>${escapeHtml(opportunity.source)}</small></td>
        <td><strong>${escapeHtml(customer?.name || "未知客户")}</strong><small>${escapeHtml(customer?.phone || "")}</small></td>
        <td><strong>${escapeHtml(opportunity.type)}</strong><small>${escapeHtml(opportunity.need)}</small></td>
        <td><strong>${escapeHtml(opportunity.quantity)}</strong><small>${escapeHtml(opportunity.budget)}</small></td>
        <td>${escapeHtml(opportunity.dueDate)}</td>
        <td>${getCrmBadge(opportunity.status)}</td>
        <td><strong>${escapeHtml(getEmployeeName(opportunity.ownerId))}</strong><small>${escapeHtml(getEmployeeById(opportunity.ownerId)?.username || "未分配账号")}</small></td>
        <td><small>${escapeHtml(opportunity.lastFollow)}</small></td>
        <td><button class="text-btn" type="button" data-opportunity-detail="${opportunity.id}">查看</button></td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="9"><small>未找到匹配商机。</small></td></tr>`;
  renderPagination("opportunities", page.total, page.totalPages);

  document.querySelectorAll("[data-opportunity-detail]").forEach((button) => {
    button.addEventListener("click", () => openOpportunityDetail(button.dataset.opportunityDetail));
  });
}

function getCrmBadge(status) {
  const className = {
    "成交客户": "up",
    "商城客户": "presale",
    "咨询客户": "soldout",
    "新线索": "soldout",
    "待联系": "presale",
    "已联系": "up",
    "资料待补充": "presale",
    "已报价": "up",
    "已成交": "up",
    "无效": "down",
  }[status] || "";
  return `<span class="badge ${className}">${escapeHtml(status)}</span>`;
}

function openCustomerDetail(id) {
  const customer = getCustomerById(id);
  if (!customer || !crmDialog) return;
  crmDialogEyebrow.textContent = "Customer Detail";
  crmDialogTitle.textContent = `${customer.name} 客户详情`;
  const relatedOpportunities = opportunities.filter((item) => item.customerId === customer.id);
  const pointRows = getCustomerPointTransactions(customer.id);
  const pointBalance = getCustomerPoints(customer.id);
  crmDetail.innerHTML = `
    <div class="status-tabs customer-detail-tabs" role="tablist" aria-label="客户详情">
      <button class="active" type="button" role="tab" aria-selected="true" data-customer-detail-tab="profile">客户资料</button>
      <button type="button" role="tab" aria-selected="false" data-customer-detail-tab="points">积分流水</button>
    </div>
    <div data-customer-detail-panel="profile">
      <div class="detail-stack">
        <section class="detail-block"><strong>${escapeHtml(customer.name)}</strong><small>${escapeHtml(customer.type)} · ${escapeHtml(customer.source)} · ${escapeHtml(getUnitName(customer.unitId))}</small></section>
        <section class="detail-block"><h4>联系方式</h4><p>${escapeHtml(customer.phone)} / WhatsApp ${escapeHtml(customer.whatsapp)}</p><small>${escapeHtml(customer.email)}</small></section>
        <section class="detail-block"><h4>客户标签</h4><div class="tag-list">${customer.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div><p>${escapeHtml(customer.remark)}</p></section>
        <section class="detail-block"><h4>业务沉淀</h4><ul class="record-list"><li>订单：${customer.orderCount} 单</li><li>售后：${customer.afterSaleCount} 单</li><li>积分：${pointBalance.toLocaleString()}</li><li>负责人：${escapeHtml(getEmployeeAccountText(customer.ownerId))}</li><li>最近跟进：${escapeHtml(customer.lastFollow)}</li></ul></section>
        <section class="detail-block"><h4>关联商机</h4><ul class="record-list">${relatedOpportunities.map((item) => `<li>${escapeHtml(item.title)} / ${escapeHtml(item.status)}</li>`).join("") || "<li>暂无关联商机</li>"}</ul></section>
      </div>
    </div>
    <div class="hidden" data-customer-detail-panel="points">
      <section class="points-summary-card">
        <div><small>当前可用积分</small><strong>${pointBalance.toLocaleString()}</strong></div>
        <p>商城客户每消费 1 MOP 获得 1 积分，订单支付成功后自动入账。</p>
      </section>
      <div class="points-ledger-wrap">
        <table class="points-ledger-table">
          <thead><tr><th>入账时间</th><th>流水说明</th><th>消费金额</th><th>积分变动</th><th>入账后余额</th></tr></thead>
          <tbody>${pointRows.map((item) => `
            <tr>
              <td>${escapeHtml(item.createdAt)}</td>
              <td><strong>${escapeHtml(item.type)}</strong><small>${escapeHtml(item.description)}</small></td>
              <td>MOP ${item.amount.toLocaleString()}</td>
              <td><strong class="points-positive">+${item.change.toLocaleString()}</strong></td>
              <td>${item.balanceAfter.toLocaleString()}</td>
            </tr>
          `).join("") || `<tr><td colspan="5" class="points-empty">暂无积分流水。商城订单支付成功后将自动入账。</td></tr>`}</tbody>
        </table>
      </div>
    </div>
  `;
  crmDetail.querySelectorAll("[data-customer-detail-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTab = button.dataset.customerDetailTab;
      crmDetail.querySelectorAll("[data-customer-detail-tab]").forEach((item) => {
        const active = item.dataset.customerDetailTab === selectedTab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      crmDetail.querySelectorAll("[data-customer-detail-panel]").forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.customerDetailPanel !== selectedTab);
      });
    });
  });
  crmDialog.showModal();
}

function openOpportunityDetail(id) {
  const opportunity = opportunities.find((item) => item.id === id);
  const customer = getCustomerById(opportunity?.customerId);
  if (!opportunity || !crmDialog) return;
  crmDialogEyebrow.textContent = "Opportunity Detail";
  crmDialogTitle.textContent = `${opportunity.id} 商机详情`;
  crmDetail.innerHTML = `
    <section class="detail-block"><strong>${escapeHtml(opportunity.title)}</strong><small>${escapeHtml(opportunity.type)} · ${escapeHtml(opportunity.source)} · ${escapeHtml(opportunity.status)}</small></section>
    <section class="detail-block"><h4>客户资料</h4><p>${escapeHtml(customer?.name || "未知客户")} · ${escapeHtml(customer?.phone || "")}</p><small>${escapeHtml(customer ? getUnitName(customer.unitId) : "")}</small></section>
    <section class="detail-block"><h4>需求信息</h4><p>${escapeHtml(opportunity.need)}</p><small>数量：${escapeHtml(opportunity.quantity)}<br>预算：${escapeHtml(opportunity.budget)}<br>交期：${escapeHtml(opportunity.dueDate)}</small></section>
    <section class="detail-block"><h4>跟进状态</h4><ul class="record-list"><li>负责人：${escapeHtml(getEmployeeAccountText(opportunity.ownerId))}</li><li>当前状态：${escapeHtml(opportunity.status)}</li><li>最近跟进：${escapeHtml(opportunity.lastFollow)}</li></ul><textarea>${escapeHtml(opportunity.lastFollow)}</textarea><button class="primary-btn compact" type="button">追加跟进</button></section>
  `;
  crmDialog.showModal();
}

function getLocalDateText(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createOpportunityId() {
  const datePart = getLocalDateText().replaceAll("-", "");
  const prefix = `OPP${datePart}`;
  const sequence = opportunities.reduce((max, item) => {
    if (!item.id.startsWith(prefix)) return max;
    const value = Number(item.id.slice(prefix.length));
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0) + 1;
  return `${prefix}${String(sequence).padStart(3, "0")}`;
}

function openOpportunityCreateDialog() {
  opportunityCreateForm.reset();
  document.querySelector("#opportunityType").value = "定制咨询";
  document.querySelector("#opportunitySource").value = "手动录入";
  document.querySelector("#opportunityOwner").value = "unassigned";
  document.querySelector("#opportunityFormHint").textContent = "新建商机默认进入“新线索”，保存后可在商机详情中继续跟进。";
  opportunityCreateDialog.showModal();
  document.querySelector("#opportunityTitle").focus();
}

function closeOpportunityCreateDialog() {
  opportunityCreateDialog.close();
}

function saveOpportunity(event) {
  event.preventDefault();
  const title = document.querySelector("#opportunityTitle").value.trim();
  const customerId = document.querySelector("#opportunityCustomer").value;
  const type = document.querySelector("#opportunityType").value;
  const source = document.querySelector("#opportunitySource").value;
  const need = document.querySelector("#opportunityNeed").value.trim();
  const quantity = document.querySelector("#opportunityQuantity").value.trim();
  const budget = document.querySelector("#opportunityBudget").value.trim();
  const dueDate = document.querySelector("#opportunityDueDate").value;
  const ownerId = document.querySelector("#opportunityOwner").value || "unassigned";
  const firstFollow = document.querySelector("#opportunityFirstFollow").value.trim();
  const hint = document.querySelector("#opportunityFormHint");
  if (!title || !customerId || !type || !source || !need || !quantity || !budget || !dueDate) {
    hint.textContent = "请完整填写商机名称、关联客户、需求、数量、预算和期望交期。";
    opportunityCreateForm.reportValidity();
    return;
  }
  const today = getLocalDateText();
  opportunities.unshift({
    id: createOpportunityId(),
    title,
    customerId,
    type,
    source,
    need,
    quantity,
    budget,
    dueDate,
    status: "新线索",
    ownerId,
    lastFollow: firstFollow ? `${today} ${firstFollow}` : `${today} 手动录入商机，待首次联系`,
  });
  closeOpportunityCreateDialog();
  document.querySelector("#opportunitySearch").value = "";
  document.querySelector("#opportunityTypeFilter").value = "all";
  document.querySelector("#opportunityStatusFilter").value = "all";
  document.querySelector("#opportunityOwnerFilter").value = "all";
  document.querySelectorAll("[data-opportunity-tab]").forEach((button) => button.classList.toggle("active", button.dataset.opportunityTab === "all"));
  selectedOpportunityTab = "all";
  resetPagination("opportunities");
  renderOpportunities();
}

function getFilteredEmployees() {
  const keyword = document.querySelector("#employeeSearch").value.trim().toLowerCase();
  const role = document.querySelector("#employeeRoleFilter").value;
  const status = document.querySelector("#employeeStatusFilter").value;
  return employees.filter((employee) => {
    const roleItem = getRoleById(employee.roleId);
    const storeNames = getEmployeeStores(employee).map((store) => store.name).join(" ");
    const text = `${getEmployeeUsername(employee)} ${employee.name} ${roleItem?.name || ""} ${storeNames}`.toLowerCase();
    return (!keyword || text.includes(keyword))
      && (role === "all" || employee.roleId === role)
      && (status === "all" || employee.status === status);
  });
}

function renderEmployees() {
  updateEmployeeMetrics();
  const rows = getFilteredEmployees();
  const page = getPageSlice(rows, "employees");
  employeeRows.innerHTML = page.rows.map((employee) => `
    <tr>
      <td><strong>${escapeHtml(getEmployeeUsername(employee))}</strong><small>${escapeHtml(employee.id)}</small></td>
      <td><strong>${escapeHtml(employee.name)}</strong><small>账号创建后即可登录</small></td>
      <td>${getSystemBadge(getRoleName(employee.roleId))}</td>
      <td><div class="tag-list">${getEmployeeStores(employee).map((store) => `<span>${escapeHtml(store.name)}</span>`).join("") || "<span>未授权门店</span>"}</div></td>
      <td>${getSystemBadge(employee.status)}</td>
      <td><small>${escapeHtml(employee.lastLogin)}</small></td>
      <td>
        <div class="row-actions">
          <button class="text-btn" type="button" data-employee-detail="${employee.id}">查看</button>
          <button class="text-btn" type="button" data-employee-toggle="${employee.id}">${employee.status === "停用" ? "启用" : "停用"}</button>
        </div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="7"><small>未找到匹配员工账号。</small></td></tr>`;
  renderPagination("employees", page.total, page.totalPages);

  document.querySelectorAll("[data-employee-detail]").forEach((button) => {
    button.addEventListener("click", () => openEmployeeDetail(button.dataset.employeeDetail));
  });
  document.querySelectorAll("[data-employee-toggle]").forEach((button) => {
    button.addEventListener("click", () => toggleEmployeeStatus(button.dataset.employeeToggle));
  });
}

function getFilteredRoles() {
  const keyword = document.querySelector("#roleSearch").value.trim().toLowerCase();
  const status = document.querySelector("#roleStatusFilter").value;
  return roles.filter((role) => {
    const pageNames = getRolePageNames(role).join(" ");
    const apiNames = getRoleApiNames(role).join(" ");
    const text = `${role.name} ${role.status} ${role.description} ${pageNames} ${apiNames}`.toLowerCase();
    return (!keyword || text.includes(keyword)) && (status === "all" || role.status === status);
  });
}

function renderRoles() {
  const rows = getFilteredRoles();
  const page = getPageSlice(rows, "roles");
  roleRows.innerHTML = page.rows.map((role) => {
    const employeeCount = employees.filter((employee) => employee.roleId === role.id).length;
    return `
      <tr>
        <td><strong>${escapeHtml(role.name)}</strong><small>${escapeHtml(role.description)}</small></td>
        <td>${getSystemBadge(role.status)}</td>
        <td><div class="tag-list">${getRolePageNames(role).slice(0, 6).map((page) => `<span>${escapeHtml(page)}</span>`).join("")}</div><small>共 ${role.permissions.pages.length} 个页面</small></td>
        <td><small>${getRoleApiNames(role).slice(0, 8).map(escapeHtml).join(" / ")}${role.permissions.apis.length > 8 ? " ..." : ""}</small></td>
        <td><strong>${employeeCount}</strong><small>个员工账号</small></td>
        <td>
          <div class="row-actions">
            <button class="text-btn" type="button" data-role-edit="${role.id}">编辑</button>
            <button class="text-btn" type="button" data-role-detail="${role.id}">查看</button>
          </div>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="6"><small>未找到匹配角色。</small></td></tr>`;
  renderPagination("roles", page.total, page.totalPages);

  document.querySelectorAll("[data-role-edit]").forEach((button) => {
    button.addEventListener("click", () => openRoleDialog(button.dataset.roleEdit));
  });
  document.querySelectorAll("[data-role-detail]").forEach((button) => {
    button.addEventListener("click", () => openRoleDetail(button.dataset.roleDetail));
  });
}

function getCheckoutPickupPoints() {
  const storePoints = stores.map((store) => ({
    id: store.id,
    type: "门店自提",
    name: store.name,
    address: store.address,
    phone: store.phone,
    businessHours: store.businessHours,
    deliveryFee: { baseFee: 0, freeThreshold: 0 },
  }));
  const hivePoints = hivePickupPoints
    .filter((point) => point.status === "启用")
    .map((point) => ({ ...point, type: "窝蜂驿站", deliveryFee: { ...deliveryFeeConfig.hivePickup } }));
  return [...storePoints, ...hivePoints];
}

function updatePickupMetrics() {
  document.querySelector("#storePickupMetric").textContent = String(stores.length);
  document.querySelector("#hivePickupEnabledMetric").textContent = String(hivePickupPoints.filter((point) => point.status === "启用").length);
  document.querySelector("#hivePickupDisabledMetric").textContent = String(hivePickupPoints.filter((point) => point.status === "停用").length);
  document.querySelector("#checkoutPickupMetric").textContent = String(getCheckoutPickupPoints().length);
}

function getFilteredHivePickupPoints() {
  const keyword = document.querySelector("#hivePickupSearch").value.trim().toLowerCase();
  const status = document.querySelector("#hivePickupStatusFilter").value;
  return hivePickupPoints.filter((point) => {
    const text = `${point.name} ${point.address} ${point.phone} ${point.businessHours}`.toLowerCase();
    return (!keyword || text.includes(keyword)) && (status === "all" || point.status === status);
  });
}

function renderHivePickupPoints() {
  updatePickupMetrics();
  const rows = getFilteredHivePickupPoints();
  const page = getPageSlice(rows, "hivePickupPoints");
  hivePickupRows.innerHTML = page.rows.map((point) => `
    <tr>
      <td><strong>${escapeHtml(point.name)}</strong><small>${escapeHtml(point.id)}</small></td>
      <td>
        <div class="pickup-image-cell">
          ${point.imageUrl ? `<img src="${escapeHtml(point.imageUrl)}" alt="${escapeHtml(point.name)}门头" />` : `<div class="pickup-image-placeholder">暂无图片</div>`}
          <label class="pickup-image-upload">
            <input type="file" accept="image/*" data-hive-image-upload="${point.id}" />
            <span>${point.imageUrl ? "更换" : "上传"}</span>
          </label>
          <small data-hive-image-hint="${point.id}">${escapeHtml(point.imageName || "客户端展示门头")}</small>
        </div>
      </td>
      <td><span class="pickup-address">${escapeHtml(point.address)}</span></td>
      <td><strong>${escapeHtml(point.phone)}</strong></td>
      <td><small>${escapeHtml(point.businessHours)}</small></td>
      <td>${getSystemBadge(point.status)}</td>
      <td>
        <div class="row-actions">
          <button class="text-btn" type="button" data-hive-pickup-edit="${point.id}">编辑</button>
          <button class="text-btn" type="button" data-hive-pickup-toggle="${point.id}">${point.status === "启用" ? "停用" : "启用"}</button>
        </div>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="7"><small>未找到匹配窝蜂自提点。</small></td></tr>`;
  renderPagination("hivePickupPoints", page.total, page.totalPages);

  document.querySelectorAll("[data-hive-pickup-edit]").forEach((button) => {
    button.addEventListener("click", () => openHivePickupDialog(button.dataset.hivePickupEdit));
  });
  document.querySelectorAll("[data-hive-pickup-toggle]").forEach((button) => {
    button.addEventListener("click", () => toggleHivePickupStatus(button.dataset.hivePickupToggle));
  });
  document.querySelectorAll("[data-hive-image-upload]").forEach((input) => {
    input.addEventListener("change", () => uploadHivePickupImage(input.dataset.hiveImageUpload, input.files?.[0]));
  });
}

function getHivePickupById(id) {
  return hivePickupPoints.find((point) => point.id === id);
}

function openHivePickupDialog(pointId = null) {
  editingHivePickupId = pointId;
  const point = getHivePickupById(pointId);
  document.querySelector("#hivePickupDialogTitle").textContent = point ? "编辑窝蜂自提点" : "新增窝蜂自提点";
  document.querySelector("#hivePickupName").value = point?.name || "";
  document.querySelector("#hivePickupAddress").value = point?.address || "";
  document.querySelector("#hivePickupPhone").value = point?.phone || "";
  document.querySelector("#hivePickupBusinessHours").value = point?.businessHours || "";
  document.querySelector("#hivePickupFormHint").textContent = point
    ? `当前状态：${point.status}。保存后保持当前状态。`
    : "新增后默认启用，并出现在客户下单的自提点选项中。";
  hivePickupEditDialog.showModal();
  document.querySelector("#hivePickupName").focus();
}

function closeHivePickupDialog() {
  hivePickupEditDialog.close();
  editingHivePickupId = null;
}

function saveHivePickupPoint(event) {
  event.preventDefault();
  const name = document.querySelector("#hivePickupName").value.trim();
  const address = document.querySelector("#hivePickupAddress").value.trim();
  const phone = document.querySelector("#hivePickupPhone").value.trim();
  const businessHours = document.querySelector("#hivePickupBusinessHours").value.trim();
  const hint = document.querySelector("#hivePickupFormHint");
  if (!name || !address || !phone || !businessHours) {
    hint.textContent = "请完整填写自提点名称、地址、联系电话和营业时间。";
    return;
  }
  const duplicate = hivePickupPoints.some((point) => point.name === name && point.id !== editingHivePickupId);
  if (duplicate) {
    hint.textContent = "自提点名称已存在，请检查后再保存。";
    document.querySelector("#hivePickupName").focus();
    return;
  }
  const nextPoint = {
    id: editingHivePickupId || `hive-${Date.now()}`,
    name,
    address,
    phone,
    businessHours,
    status: getHivePickupById(editingHivePickupId)?.status || "启用",
    imageUrl: getHivePickupById(editingHivePickupId)?.imageUrl || "",
    imageName: getHivePickupById(editingHivePickupId)?.imageName || "",
  };
  if (editingHivePickupId) {
    const index = hivePickupPoints.findIndex((point) => point.id === editingHivePickupId);
    if (index >= 0) hivePickupPoints[index] = nextPoint;
  } else {
    hivePickupPoints.unshift(nextPoint);
  }
  closeHivePickupDialog();
  resetPagination("hivePickupPoints");
  renderHivePickupPoints();
}

function toggleHivePickupStatus(id) {
  const point = getHivePickupById(id);
  if (!point) return;
  point.status = point.status === "启用" ? "停用" : "启用";
  renderHivePickupPoints();
}

function uploadHivePickupImage(id, file) {
  const point = getHivePickupById(id);
  const hint = document.querySelector(`[data-hive-image-hint="${id}"]`);
  if (!point || !file) return;
  if (!file.type.startsWith("image/")) {
    if (hint) hint.textContent = "请选择图片文件。";
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    if (hint) hint.textContent = "图片不能超过 5MB。";
    return;
  }
  if (hint) hint.textContent = "正在读取图片...";
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    point.imageUrl = String(reader.result || "");
    point.imageName = file.name;
    renderHivePickupPoints();
  });
  reader.addEventListener("error", () => {
    const currentHint = document.querySelector(`[data-hive-image-hint="${id}"]`);
    if (currentHint) currentHint.textContent = "图片读取失败，请重新上传。";
  });
  reader.readAsDataURL(file);
}

function renderDeliveryFeeConfig() {
  document.querySelector("#hivePickupBaseFee").value = String(deliveryFeeConfig.hivePickup.baseFee);
  document.querySelector("#hivePickupFreeThreshold").value = String(deliveryFeeConfig.hivePickup.freeThreshold);
  document.querySelector("#courierBaseFee").value = String(deliveryFeeConfig.courier.baseFee);
  document.querySelector("#courierFreeThreshold").value = String(deliveryFeeConfig.courier.freeThreshold);
}

function saveDeliveryFeeConfig(event) {
  event.preventDefault();
  const values = {
    hivePickupBaseFee: document.querySelector("#hivePickupBaseFee").value.trim(),
    hivePickupFreeThreshold: document.querySelector("#hivePickupFreeThreshold").value.trim(),
    courierBaseFee: document.querySelector("#courierBaseFee").value.trim(),
    courierFreeThreshold: document.querySelector("#courierFreeThreshold").value.trim(),
  };
  const amounts = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, Number(value)]));
  const hint = document.querySelector("#deliveryFeeHint");
  if (Object.values(values).some((value) => !value) || Object.values(amounts).some((value) => !Number.isFinite(value) || value < 0)) {
    hint.textContent = "两种履约方式的配送费和免配送费门槛都必须填写大于或等于 0 的金额。";
    return;
  }
  deliveryFeeConfig.hivePickup = { baseFee: amounts.hivePickupBaseFee, freeThreshold: amounts.hivePickupFreeThreshold };
  deliveryFeeConfig.courier = { baseFee: amounts.courierBaseFee, freeThreshold: amounts.courierFreeThreshold };
  hint.textContent = `已保存：窝蜂自提 MOP ${amounts.hivePickupBaseFee} / 满 ${amounts.hivePickupFreeThreshold} 免；速递 MOP ${amounts.courierBaseFee} / 满 ${amounts.courierFreeThreshold} 免。`;
}

function getSystemBadge(status) {
  const className = {
    "启用": "up",
    "停用": "down",
    "禁用": "down",
    "已绑定": "up",
    "未绑定": "down",
    "管理员": "up",
    "商品运营": "presale",
    "订单客服": "up",
    "仓库 / 门店": "presale",
    "业务销售": "up",
    "管理层只读": "down",
  }[status] || "";
  return `<span class="badge ${className}">${escapeHtml(status)}</span>`;
}

function getPageById(id) {
  return permissionCatalog.flatMap((group) => group.pages).find((page) => page.id === id);
}

function getApiById(id) {
  return permissionCatalog.flatMap((group) => group.pages.flatMap((page) => page.apis)).find((api) => api.id === id);
}

function getRolePageNames(role) {
  return role.permissions.pages.map((id) => getPageById(id)?.name || id);
}

function getRoleApiNames(role) {
  return role.permissions.apis.map((id) => getApiById(id)?.name || id);
}

function openEmployeeDetail(id) {
  const employee = getEmployeeById(id);
  if (!employee || !systemDialog) return;
  const role = getRoleById(employee.roleId);
  systemDialogEyebrow.textContent = "Employee Account";
  systemDialogTitle.textContent = `${employee.name} 员工账号`;
  systemDetail.innerHTML = `
    <section class="detail-block"><strong>${escapeHtml(getEmployeeUsername(employee))}</strong><small>${escapeHtml(employee.name)} · ${escapeHtml(employee.status)} · 最近登录：${escapeHtml(employee.lastLogin)}</small></section>
    <section class="detail-block"><h4>角色权限</h4><p>${escapeHtml(role?.name || "未配置角色")}</p><small>${escapeHtml(role?.description || "")}</small><div class="tag-list">${role ? getRolePageNames(role).map((page) => `<span>${escapeHtml(page)}</span>`).join("") : ""}</div></section>
    <section class="detail-block"><h4>可登录门店</h4><div class="tag-list">${getEmployeeStores(employee).map((store) => `<span>${escapeHtml(store.name)}</span>`).join("") || "<span>未授权门店</span>"}</div><small>员工登录时需选择授权门店，进入系统后可在右上角切换。</small></section>
    <section class="detail-block"><h4>CRM 负责人关联</h4><ul class="record-list"><li>负责客户：${customers.filter((customer) => customer.ownerId === employee.id).length} 个</li><li>负责商机：${opportunities.filter((opportunity) => opportunity.ownerId === employee.id).length} 个</li></ul></section>
    <section class="detail-block"><h4>重置密码</h4><label><span>新密码</span><input id="resetEmployeePassword" type="password" placeholder="输入新登录密码" /></label><button class="primary-btn compact" type="button" data-reset-employee-password="${employee.id}">确认重置</button><p id="resetPasswordHint" class="form-hint"></p></section>
  `;
  systemDetail.querySelector("[data-reset-employee-password]")?.addEventListener("click", (event) => resetEmployeePassword(event.currentTarget.dataset.resetEmployeePassword));
  systemDialog.showModal();
}

function openRoleDetail(id) {
  const role = getRoleById(id);
  if (!role || !systemDialog) return;
  const roleEmployees = employees.filter((employee) => employee.roleId === role.id);
  systemDialogEyebrow.textContent = "Role Permission";
  systemDialogTitle.textContent = `${role.name} 角色权限`;
  systemDetail.innerHTML = `
    <section class="detail-block"><strong>${escapeHtml(role.name)}</strong><small>${escapeHtml(role.status)} · ${roleEmployees.length} 个员工账号</small></section>
    <section class="detail-block"><h4>页面权限</h4><div class="tag-list">${getRolePageNames(role).map((page) => `<span>${escapeHtml(page)}</span>`).join("") || "<span>未分配页面</span>"}</div></section>
    <section class="detail-block"><h4>接口权限</h4><ul class="record-list">${getRoleApiNames(role).map((action) => `<li>${escapeHtml(action)}</li>`).join("") || "<li>未分配接口</li>"}</ul></section>
    <section class="detail-block"><h4>关联员工</h4><ul class="record-list">${roleEmployees.map((employee) => `<li>${escapeHtml(employee.name)}（${escapeHtml(getEmployeeUsername(employee))}）</li>`).join("") || "<li>暂无员工使用该角色</li>"}</ul></section>
    <section class="detail-block"><button class="primary-btn compact" type="button" data-edit-role-from-detail="${role.id}">编辑角色</button></section>
  `;
  systemDetail.querySelector("[data-edit-role-from-detail]")?.addEventListener("click", (event) => {
    systemDialog.close();
    openRoleDialog(event.currentTarget.dataset.editRoleFromDetail);
  });
  systemDialog.showModal();
}

function renderPermissionMatrix(role) {
  const selectedPages = new Set(role?.permissions?.pages || []);
  const selectedApis = new Set(role?.permissions?.apis || []);
  document.querySelector("#permissionMatrix").innerHTML = `
    <div class="permission-header-row">
      <div>归属</div>
      <div>页面</div>
      <div>接口</div>
    </div>
    ${permissionCatalog.map((group) => `
    <div class="permission-group-row">
      <div class="permission-group-cell">${escapeHtml(group.group)}</div>
      <div class="permission-pages-cell">
        ${group.pages.map((page) => `
          <div class="permission-page-row">
            <label class="check-line"><input type="checkbox" data-permission-page="${page.id}" ${selectedPages.has(page.id) ? "checked" : ""} /> ${escapeHtml(page.name)}</label>
            <div class="permission-api-list">
              ${page.apis.map((api) => `<label class="check-line"><input type="checkbox" data-permission-api="${api.id}" data-api-page="${page.id}" ${selectedApis.has(api.id) ? "checked" : ""} /> ${escapeHtml(api.name)}</label>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("")}`;

  document.querySelectorAll("[data-permission-page]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const pageId = checkbox.dataset.permissionPage;
      if (!checkbox.checked) {
        document.querySelectorAll(`[data-api-page="${pageId}"]`).forEach((apiCheckbox) => { apiCheckbox.checked = false; });
      }
    });
  });
  document.querySelectorAll("[data-permission-api]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (!checkbox.checked) return;
      document.querySelector(`[data-permission-page="${checkbox.dataset.apiPage}"]`).checked = true;
    });
  });
}

function openRoleDialog(roleId = null) {
  editingRoleId = roleId;
  const role = roles.find((item) => item.id === roleId);
  document.querySelector("#roleDialogTitle").textContent = role ? "编辑角色权限" : "新增角色权限";
  document.querySelector("#roleId").value = role?.id || "";
  document.querySelector("#roleName").value = role?.name || "";
  document.querySelectorAll('[name="roleStatus"]').forEach((input) => { input.checked = input.value === (role?.status || "启用"); });
  renderPermissionMatrix(role || { permissions: { pages: [], apis: [] } });
  document.querySelector("#roleFormHint").textContent = "勾选页面后可继续勾选该页面对应接口权限。";
  roleEditDialog.showModal();
}

function closeRoleDialog() {
  roleEditDialog.close();
}

function saveRole() {
  const name = document.querySelector("#roleName").value.trim();
  const status = document.querySelector('[name="roleStatus"]:checked')?.value || "启用";
  const pages = Array.from(document.querySelectorAll("[data-permission-page]:checked")).map((input) => input.dataset.permissionPage);
  const apis = Array.from(document.querySelectorAll("[data-permission-api]:checked")).map((input) => input.dataset.permissionApi);
  const hint = document.querySelector("#roleFormHint");
  if (!name) {
    hint.textContent = "请填写角色名称。";
    return;
  }
  if (!pages.length) {
    hint.textContent = "请至少勾选一个页面权限。";
    return;
  }
  const duplicate = roles.some((role) => role.name === name && role.id !== editingRoleId);
  if (duplicate) {
    hint.textContent = "角色名称已存在，请换一个名称。";
    return;
  }
  const nextRole = {
    id: editingRoleId || `role-${Date.now()}`,
    name,
    status,
    description: `${name} 自定义页面 / 接口权限`,
    permissions: { pages, apis },
  };
  if (editingRoleId) {
    roles = roles.map((role) => role.id === editingRoleId ? nextRole : role);
  } else {
    roles.unshift(nextRole);
  }
  closeRoleDialog();
  refreshReferenceOptions();
  resetPagination("roles");
  renderRoles();
  renderEmployees();
}

function toggleEmployeeStatus(id) {
  const employee = getEmployeeById(id);
  if (!employee) return;
  employee.status = employee.status === "停用" ? "启用" : "停用";
  refreshReferenceOptions();
  renderEmployees();
  renderCustomers();
  renderOpportunities();
}

function updateEmployeeMetrics() {
  document.querySelector("#employeeTotalMetric").textContent = String(employees.length);
  document.querySelector("#employeeEnabledMetric").textContent = String(employees.filter((employee) => employee.status === "启用").length);
  document.querySelector("#employeeDisabledMetric").textContent = String(employees.filter((employee) => employee.status === "停用").length);
  document.querySelector("#employeeRoleMetric").textContent = String(roles.length);
}

function renderEmployeeStoreChoices(selectedIds = []) {
  const selected = new Set(selectedIds);
  const container = document.querySelector("#employeeStoreChoices");
  container.innerHTML = stores.map((store) => `
    <label class="store-access-option">
      <input type="checkbox" value="${store.id}" ${selected.has(store.id) ? "checked" : ""} />
      <span>${escapeHtml(store.name)}</span>
    </label>
  `).join("");
  container.classList.remove("has-error");
  container.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => container.classList.remove("has-error"));
  });
}

function getSelectedEmployeeStoreIds() {
  return Array.from(document.querySelectorAll('#employeeStoreChoices input[type="checkbox"]:checked')).map((checkbox) => checkbox.value);
}

function openCreateEmployeeDialog() {
  document.querySelector("#employeeUsername").value = "";
  document.querySelector("#employeeName").value = "";
  document.querySelector("#employeeInitialPassword").value = "";
  document.querySelector("#employeeRole").value = roles[0]?.id || "";
  renderEmployeeStoreChoices();
  document.querySelector("#employeeFormHint").textContent = "请为账号分配至少一家可登录门店；登录后可在已授权门店之间切换。";
  employeeEditDialog.showModal();
}

function closeEmployeeDialog() {
  employeeEditDialog.close();
}

async function saveEmployee() {
  const username = document.querySelector("#employeeUsername").value.trim();
  const name = document.querySelector("#employeeName").value.trim();
  const roleId = document.querySelector("#employeeRole").value;
  const storeIds = getSelectedEmployeeStoreIds();
  const password = document.querySelector("#employeeInitialPassword").value.trim();
  const hint = document.querySelector("#employeeFormHint");
  if (!username || !name || !roleId || !password || !storeIds.length) {
    hint.textContent = "请完整填写账号名、员工姓名、角色、可登录门店和初始密码。";
    document.querySelector("#employeeStoreChoices").classList.toggle("has-error", !storeIds.length);
    return;
  }
  const usernameHash = await hashEmployeeUsername(username);
  if (employees.some((employee) => employee.usernameHash === usernameHash)) {
    hint.textContent = "账号名已存在，请换一个账号名。";
    document.querySelector("#employeeUsername").focus();
    return;
  }
  const id = `emp-${Date.now()}`;
  employees.unshift({
    id,
    username,
    usernameHash,
    name,
    roleId,
    storeIds,
    passwordHash: await hashEmployeePassword(id, password),
    status: "启用",
    lastLogin: "未登录",
  });
  closeEmployeeDialog();
  refreshReferenceOptions();
  resetPagination("employees");
  renderEmployees();
  renderRoles();
  renderCustomers();
  renderOpportunities();
}

async function resetEmployeePassword(id) {
  const employee = getEmployeeById(id);
  const input = document.querySelector("#resetEmployeePassword");
  const hint = document.querySelector("#resetPasswordHint");
  const password = input?.value.trim();
  if (!employee || !password) {
    if (hint) hint.textContent = "请输入新密码。";
    return;
  }
  employee.passwordHash = await hashEmployeePassword(employee.id, password);
  input.value = "";
  if (hint) hint.textContent = "密码已重置，员工下次可使用新密码登录。";
}

["#orderSearch", "#orderStatusFilter", "#orderUnitFilter", "#deliveryFilter", "#paymentFilter", "#paymentStatusFilter", "#afterSaleFilter", "#orderDateFilter"].forEach((selector) => document.querySelector(selector)?.addEventListener("input", () => { resetPagination("orders"); renderOrders(); }));
["#presaleOrderSearch", "#presaleOrderStatusFilter", "#presaleOrderUnitFilter", "#presaleDeliveryFilter", "#presalePaymentFilter", "#presalePaymentStatusFilter", "#presaleAfterSaleFilter", "#presaleOrderDateFilter"].forEach((selector) => document.querySelector(selector)?.addEventListener("input", () => { resetPagination("presaleOrders"); renderPresaleOrders(); }));
document.querySelectorAll("[data-presale-order-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-presale-order-tab]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedPresaleOrderTab = button.dataset.presaleOrderTab;
    resetPagination("presaleOrders");
    renderPresaleOrders();
  });
});
document.querySelectorAll("[data-order-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-order-tab]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedOrderTab = button.dataset.orderTab;
    resetPagination("orders");
    renderOrders();
  });
});
["#afterSaleSearch", "#afterSaleTypeFilter", "#afterSaleStatusFilter"].forEach((selector) => document.querySelector(selector)?.addEventListener("input", () => { resetPagination("afterSales"); renderAfterSales(); }));
["#customerSearch", "#customerTypeFilter", "#customerSourceFilter", "#customerOwnerFilter"].forEach((selector) => document.querySelector(selector)?.addEventListener("input", () => { resetPagination("customers"); renderCustomers(); }));
["#opportunitySearch", "#opportunityTypeFilter", "#opportunityStatusFilter", "#opportunityOwnerFilter"].forEach((selector) => document.querySelector(selector)?.addEventListener("input", () => { resetPagination("opportunities"); renderOpportunities(); }));
["#employeeSearch", "#employeeRoleFilter", "#employeeStatusFilter"].forEach((selector) => document.querySelector(selector)?.addEventListener("input", () => { resetPagination("employees"); renderEmployees(); }));
["#roleSearch", "#roleStatusFilter"].forEach((selector) => document.querySelector(selector)?.addEventListener("input", () => { resetPagination("roles"); renderRoles(); }));
["#hivePickupSearch", "#hivePickupStatusFilter"].forEach((selector) => document.querySelector(selector)?.addEventListener("input", () => { resetPagination("hivePickupPoints"); renderHivePickupPoints(); }));
document.querySelectorAll("[data-opportunity-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-opportunity-tab]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedOpportunityTab = button.dataset.opportunityTab;
    document.querySelector("#opportunityStatusFilter").value = "all";
    resetPagination("opportunities");
    renderOpportunities();
  });
});
document.querySelector("#exportPresaleOrdersBtn")?.addEventListener("click", () => {
  document.querySelector("#exportPresaleOrdersBtn").textContent = "已生成导出文件";
});
document.querySelector("#importPresaleShipmentsBtn")?.addEventListener("click", () => {
  document.querySelector("#importPresaleShipmentsBtn").textContent = "已导入发货单";
});
document.querySelector("#exportOrdersBtn")?.addEventListener("click", () => {
  document.querySelector("#exportOrdersBtn").textContent = "已生成导出文件";
});
document.querySelector("#importShipmentsBtn")?.addEventListener("click", () => {
  document.querySelector("#importShipmentsBtn").textContent = "已导入发货单";
});
document.querySelector("#exportCustomersBtn")?.addEventListener("click", () => {
  document.querySelector("#exportCustomersBtn").textContent = "已生成客户导出";
});
document.querySelector("#exportOpportunitiesBtn")?.addEventListener("click", () => {
  document.querySelector("#exportOpportunitiesBtn").textContent = "已生成商机导出";
});
document.querySelector("#openOpportunityCreateBtn")?.addEventListener("click", openOpportunityCreateDialog);
document.querySelector("#closeOpportunityCreateBtn")?.addEventListener("click", closeOpportunityCreateDialog);
document.querySelector("#cancelOpportunityCreateBtn")?.addEventListener("click", closeOpportunityCreateDialog);
opportunityCreateForm?.addEventListener("submit", saveOpportunity);
document.querySelector("#openEmployeeCreateBtn")?.addEventListener("click", openCreateEmployeeDialog);
document.querySelector("#closeEmployeeDialogBtn")?.addEventListener("click", closeEmployeeDialog);
document.querySelector("#cancelEmployeeBtn")?.addEventListener("click", closeEmployeeDialog);
document.querySelector("#saveEmployeeBtn")?.addEventListener("click", saveEmployee);
document.querySelector("#openRoleCreateBtn")?.addEventListener("click", () => openRoleDialog());
document.querySelector("#closeRoleDialogBtn")?.addEventListener("click", closeRoleDialog);
document.querySelector("#cancelRoleBtn")?.addEventListener("click", closeRoleDialog);
document.querySelector("#saveRoleBtn")?.addEventListener("click", saveRole);
document.querySelector("#openHivePickupCreateBtn")?.addEventListener("click", () => openHivePickupDialog());
document.querySelector("#closeHivePickupDialogBtn")?.addEventListener("click", closeHivePickupDialog);
document.querySelector("#cancelHivePickupBtn")?.addEventListener("click", closeHivePickupDialog);
document.querySelector("#hivePickupForm")?.addEventListener("submit", saveHivePickupPoint);
document.querySelector("#deliveryFeeForm")?.addEventListener("submit", saveDeliveryFeeConfig);
document.querySelector("#closeOrderDialogBtn")?.addEventListener("click", () => orderDialog.close());
document.querySelector("#closeAfterSaleDialogBtn")?.addEventListener("click", () => afterSaleDialog.close());
document.querySelector("#openExchangeBtn")?.addEventListener("click", openExchangeDialog);
document.querySelector("#closeExchangeDialogBtn")?.addEventListener("click", closeExchangeDialog);
document.querySelector("#cancelExchangeBtn")?.addEventListener("click", closeExchangeDialog);
document.querySelector("#queryExchangeOrdersBtn")?.addEventListener("click", queryExchangeOrders);
document.querySelector("#exchangeOrderSearch")?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    queryExchangeOrders();
  }
});
document.querySelector("#confirmExchangeOrderBtn")?.addEventListener("click", confirmExchangeOrder);
document.querySelector("#backToExchangeSearchBtn")?.addEventListener("click", () => setExchangeStep(1));
document.querySelector("#reviewExchangeBtn")?.addEventListener("click", reviewExchange);
document.querySelector("#backToExchangeBarcodeBtn")?.addEventListener("click", () => setExchangeStep(2));
document.querySelector("#completeExchangeBtn")?.addEventListener("click", completeExchange);
document.querySelector("#viewCreatedAfterSaleBtn")?.addEventListener("click", viewCreatedExchangeAfterSale);
document.querySelector("#finishExchangeBtn")?.addEventListener("click", closeExchangeDialog);
document.querySelector("#closeCrmDialogBtn")?.addEventListener("click", () => crmDialog.close());
document.querySelector("#closeSystemDialogBtn")?.addEventListener("click", () => systemDialog.close());

function drawSalesChart() {
  const canvas = document.querySelector("#salesChart");
  if (!canvas || canvas.offsetParent === null) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = Math.max(760, Math.round(rect.width));
  const cssHeight = 320;
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.height = `${cssHeight}px`;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const width = cssWidth;
  const height = cssHeight;
  const padding = { top: 28, right: 34, bottom: 42, left: 68 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const rawMax = Math.max(...sales);
  const rawMin = Math.min(...sales);
  const max = Math.ceil(rawMax / 5000) * 5000;
  const min = Math.max(0, Math.floor(rawMin / 5000) * 5000 - 5000);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#eef0f4";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#667085";
  ctx.font = "12px Arial";
  ctx.textBaseline = "middle";

  for (let i = 0; i <= 5; i += 1) {
    const y = padding.top + (chartHeight / 5) * i;
    const value = Math.round(max - ((max - min) / 5) * i);
    ctx.beginPath();
    ctx.setLineDash(i === 5 ? [] : [4, 6]);
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.textAlign = "right";
    ctx.fillText(`${Math.round(value / 1000)}k`, padding.left - 12, y);
  }

  latestChartPoints = sales.map((value, index) => {
    const x = padding.left + (chartWidth / (sales.length - 1)) * index;
    const y = padding.top + chartHeight - ((value - min) / (max - min)) * chartHeight;
    return { x, y, value, index };
  });

  ctx.textAlign = "center";
  [0, 9, 19, 29].forEach((index) => {
    const point = latestChartPoints[index];
    if (!point) return;
    ctx.fillStyle = "#98a2b3";
    ctx.fillText(`第${index + 1}天`, point.x, height - 18);
  });

  const areaGradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  areaGradient.addColorStop(0, "rgba(23, 105, 168, 0.24)");
  areaGradient.addColorStop(0.65, "rgba(23, 105, 168, 0.08)");
  areaGradient.addColorStop(1, "rgba(23, 105, 168, 0)");

  ctx.beginPath();
  drawSmoothLine(ctx, latestChartPoints);
  ctx.lineTo(latestChartPoints[latestChartPoints.length - 1].x, height - padding.bottom);
  ctx.lineTo(latestChartPoints[0].x, height - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = areaGradient;
  ctx.fill();

  ctx.beginPath();
  drawSmoothLine(ctx, latestChartPoints);
  ctx.strokeStyle = "#1769A8";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(23, 105, 168, 0.22)";
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.shadowBlur = 0;

  latestChartPoints.forEach((point, index) => {
    if (index % 5 !== 0 && index !== latestChartPoints.length - 1) return;
    drawPoint(ctx, point, index === latestChartPoints.length - 1 ? 5 : 3.5);
  });

  const last = latestChartPoints[latestChartPoints.length - 1];
  ctx.fillStyle = "#1769A8";
  ctx.font = "600 12px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillText(`最新 MOP ${last.value.toLocaleString()}`, width - padding.right, last.y - 12);
}

function drawSmoothLine(ctx, points) {
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
      return;
    }
    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    ctx.bezierCurveTo(controlX, previous.y, controlX, point.y, point.x, point.y);
  });
}

function drawPoint(ctx, point, radius) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#1769A8";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function updateChartTooltip(event) {
  const canvas = document.querySelector("#salesChart");
  if (!canvas || !latestChartPoints.length || !chartTooltip) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const nearest = latestChartPoints.reduce((best, point) => (
    Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best
  ));

  chartTooltip.innerHTML = `<span>第 ${nearest.index + 1} 天销售额</span><strong>MOP ${nearest.value.toLocaleString()}</strong>`;
  chartTooltip.style.left = `${nearest.x + 8}px`;
  chartTooltip.style.top = `${nearest.y + 8}px`;
  chartTooltip.classList.remove("hidden");
}

function hideChartTooltip() {
  chartTooltip?.classList.add("hidden");
}

document.querySelector("#salesChart")?.addEventListener("mousemove", updateChartTooltip);
document.querySelector("#salesChart")?.addEventListener("mouseleave", hideChartTooltip);
window.addEventListener("resize", drawSalesChart);
renderLoginStoreOptions();
refreshReferenceOptions();
renderProducts();
renderInventoryAlerts();
renderOrders();
renderPresaleOrders();
renderAfterSales();
renderCustomers();
renderOpportunities();
renderEmployees();
renderRoles();
renderHivePickupPoints();
renderDeliveryFeeConfig();
