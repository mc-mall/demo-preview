window.MC_MALL_DATA = {
  brand: {
    name: "MC MALL"
  },
  hero: {
    eyebrow: "MC MALL 校园焕新季",
    title: "新学期 装备指南",
    titleLines: ["新学期", "装备指南"],
    subtitle: "轻装启程 · 自信成长",
    cta: "选购新学期装备"
  },
  homeFeatures: [
    { label: "按学校选购", copy: "快速找到校服", icon: "school", theme: "blue", href: "category.html?category=uniform-set" },
    { label: "尺码推荐", copy: "合身更舒适", icon: "measure", theme: "cyan", href: "product.html" },
    { label: "品质保障", copy: "专业校园服", icon: "shirt", theme: "green", href: "#service" },
    { label: "专属客服", copy: "贴心服务", icon: "support", theme: "orange", href: "#service" }
  ],
  schoolZones: [
    {
      id: "secondary",
      title: "中学专区",
      schools: [
        { name: "培正中学", shortName: "培正", image: "assets/products/p004.svg", tag: "礼服套装", theme: "blue" },
        { name: "华英中学", shortName: "华英", image: "assets/products/p002.svg", tag: "运动套装", theme: "cyan" },
        { name: "协同中学", shortName: "协同", image: "assets/products/p003.svg", tag: "夏季衬衫", theme: "green" },
        { name: "实验中学", shortName: "实验", image: "assets/products/p004.svg", tag: "礼服套装", theme: "orange" }
      ]
    },
    {
      id: "primary",
      title: "小学专区",
      schools: [
        { name: "培英小学", shortName: "培英", image: "assets/products/p003.svg", tag: "夏季套装", theme: "cyan" },
        { name: "朝阳小学", shortName: "朝阳", image: "assets/products/p004.svg", tag: "礼服套装", theme: "blue" },
        { name: "实验小学", shortName: "实验", image: "assets/products/p001.svg", tag: "运动套装", theme: "green" },
        { name: "华侨小学", shortName: "华侨", image: "assets/products/p002.svg", tag: "秋冬套装", theme: "orange" }
      ]
    }
  ],
  accessoryProducts: [
    { name: "皮带（可调节）", price: 39, image: "assets/products/a001-belt.svg" },
    { name: "运动袜（3双装）", price: 29, image: "assets/products/a002-socks.svg" },
    { name: "运动水杯 600ml", price: 49, image: "assets/products/a003-bottle.svg" },
    { name: "双肩书包", price: 129, image: "assets/products/a004-backpack.svg" }
  ],
  quickEntries: [
    { id: "school", label: "按学校选购", icon: "school", theme: "blue", href: "category.html" },
    { id: "formal", label: "礼服套装", icon: "formal", theme: "orange", href: "category.html?category=uniform-set" },
    { id: "summer", label: "夏季衬衫", icon: "shirt", theme: "cyan", href: "category.html?category=tops" },
    { id: "sports", label: "运动服", icon: "sports", theme: "blue", href: "category.html?category=sports" },
    { id: "accessories", label: "配件专区", icon: "bag", theme: "orange", href: "category.html?category=accessories" },
    { id: "custom", label: "校徽定制", icon: "badge", theme: "green", href: "category.html?category=custom" },
    { id: "new", label: "新品上新", icon: "spark", theme: "orange", href: "category.html" },
    { id: "service", label: "服务保障", icon: "shield", theme: "green", href: "#service" }
  ],
  schools: [
    { id: "s1", name: "培正中学", shortName: "培正", theme: "blue" },
    { id: "s2", name: "濠江中学", shortName: "濠江", theme: "cyan" },
    { id: "s3", name: "粤华中学", shortName: "粤华", theme: "green" },
    { id: "s4", name: "镜平学校", shortName: "镜平", theme: "orange" }
  ],
  hotCategories: [
    { name: "POLO衫", image: "assets/products/p001.svg", category: "tops" },
    { name: "运动套装", image: "assets/products/p002.svg", category: "sports" },
    { name: "夏季衬衫", image: "assets/products/p003.svg", category: "tops" },
    { name: "礼服套装", image: "assets/products/p004.svg", category: "uniform-set" },
    { name: "运动短裤", image: "assets/products/p005.svg", category: "bottoms" },
    { name: "针织外套", image: "assets/products/p006.svg", category: "tops" }
  ],
  categories: [
    { id: "all", name: "全部分类" },
    { id: "uniform-set", name: "校服套装" },
    { id: "tops", name: "上衣" },
    { id: "bottoms", name: "下装" },
    { id: "sports", name: "运动服" },
    { id: "accessories", name: "配件" },
    { id: "custom", name: "校徽定制" }
  ],
  categoryGroups: [
    {
      id: "uniform-set",
      title: "校服套装",
      items: [
        { name: "夏季套装", image: "assets/products/p003.svg" },
        { name: "运动套装", image: "assets/products/p002.svg" },
        { name: "礼服套装", image: "assets/products/p004.svg" }
      ]
    },
    {
      id: "tops",
      title: "上衣",
      items: [
        { name: "POLO衫", image: "assets/products/p001.svg" },
        { name: "短袖衬衫", image: "assets/products/p003.svg" },
        { name: "长袖衬衫", image: "assets/products/p006.svg" },
        { name: "针织衫", image: "assets/products/p006.svg" },
        { name: "外套", image: "assets/products/p002.svg" },
        { name: "礼服上衣", image: "assets/products/p004.svg" }
      ]
    },
    {
      id: "bottoms",
      title: "下装",
      items: [
        { name: "西裤", image: "assets/products/p004.svg" },
        { name: "短裤", image: "assets/products/p005.svg" },
        { name: "半裙", image: "assets/products/p004.svg" },
        { name: "运动长裤", image: "assets/products/p002.svg" },
        { name: "运动短裤", image: "assets/products/p005.svg" },
        { name: "礼服裙", image: "assets/products/p004.svg" }
      ]
    },
    {
      id: "sports",
      title: "运动服",
      items: [
        { name: "运动外套", image: "assets/products/p002.svg" },
        { name: "运动长裤", image: "assets/products/p002.svg" },
        { name: "运动短裤", image: "assets/products/p005.svg" },
        { name: "运动POLO", image: "assets/products/p001.svg" },
        { name: "训练上衣", image: "assets/products/p003.svg" },
        { name: "运动套装", image: "assets/products/p002.svg" }
      ]
    },
    {
      id: "accessories",
      title: "配件",
      items: [
        { name: "袜子", image: "assets/products/accessories.svg" },
        { name: "书包", image: "assets/products/accessories.svg" },
        { name: "帽子", image: "assets/products/accessories.svg" },
        { name: "领带", image: "assets/products/accessories.svg" },
        { name: "领结", image: "assets/products/accessories.svg" },
        { name: "校徽", image: "assets/products/accessories.svg" }
      ]
    },
    {
      id: "custom",
      title: "校徽定制",
      items: [
        { name: "刺绣校徽", image: "assets/products/p006.svg" },
        { name: "烫印校徽", image: "assets/products/p001.svg" },
        { name: "团体订制", image: "assets/products/p002.svg" }
      ]
    }
  ],
  products: [
    {
      id: "p001",
      name: "MC 校园运动 POLO 套装",
      price: 189,
      originalPrice: 239,
      sales: "月销 1.2k",
      tags: ["透气舒适", "校徽可定制"],
      image: "assets/products/p001.svg",
      theme: "blue"
    },
    {
      id: "p002",
      name: "MC 校园运动外套套装",
      price: 219,
      originalPrice: 269,
      sales: "月销 866",
      tags: ["校园热卖", "运动轻便"],
      image: "assets/products/p002.svg",
      theme: "cyan"
    },
    {
      id: "p003",
      name: "夏季短袖校服衬衫",
      price: 149,
      originalPrice: 179,
      sales: "月销 735",
      tags: ["夏季推荐", "轻薄面料"],
      image: "assets/products/p003.svg",
      theme: "cyan"
    },
    {
      id: "p004",
      name: "校园礼服西装套装",
      price: 399,
      originalPrice: 459,
      sales: "月销 326",
      tags: ["正式礼服", "新品"],
      image: "assets/products/p004.svg",
      theme: "orange"
    },
    {
      id: "p005",
      name: "校园运动短裤",
      price: 99,
      originalPrice: 129,
      sales: "月销 1.5k",
      tags: ["运动轻便", "速干"],
      image: "assets/products/p005.svg",
      theme: "blue"
    },
    {
      id: "p006",
      name: "校徽刺绣针织外套",
      price: 269,
      originalPrice: 319,
      sales: "月销 512",
      tags: ["校徽可定制", "秋冬推荐"],
      image: "assets/products/p006.svg",
      theme: "green"
    }
  ],
  productDetail: {
    id: "p001",
    name: "MC 校园运动 POLO 套装",
    subtitle: "经典校园配色，支持校徽定制",
    price: 189,
    originalPrice: 239,
    sales: "已售 2688",
    tags: ["透气舒适", "校徽可定制"],
    images: [
      "assets/products/p001.svg",
      "assets/products/p001-detail-2.svg",
      "assets/products/p001-detail-3.svg"
    ],
    colors: [
      { id: "white", name: "白色", disabled: false },
      { id: "navy", name: "藏青", disabled: false },
      { id: "light-blue", name: "浅蓝", disabled: false }
    ],
    sizes: [
      { name: "XS", disabled: false },
      { name: "S", disabled: false },
      { name: "M", disabled: false },
      { name: "L", disabled: false },
      { name: "XL", disabled: false },
      { name: "2XL", disabled: false },
      { name: "3XL", disabled: true }
    ],
    services: ["7天无理由", "品质保障", "支持配送 / 自提"],
    tabs: ["商品详情", "尺码表", "洗护说明"]
  },
  serviceGuarantees: [
    { label: "品质保障", icon: "shield", theme: "green" },
    { label: "配送 / 自提", icon: "delivery", theme: "cyan" },
    { label: "校徽定制", icon: "badge", theme: "green" },
    { label: "售后服务", icon: "service", theme: "blue" }
  ]
};
