'use strict';

const checkoutSchools = [
  { id: 'PH', name: '培华中学', logo: 'pui-wa.webp', stages: ['中学部', '小学部', '幼稚园'] },
  { id: 'AF', name: '澳坊中学', logo: 'ao-fang.webp', stages: ['中学部'] },
  { id: 'GD', name: '广大学校', logo: 'kwong-tai.webp', stages: ['小学部'] },
];

const schoolSizes = {
  中学部: ['150', '155', '160', '165', '170', '175', '180'],
  小学部: ['110', '120', '130', '140', '150', '160'],
  幼稚园: ['90', '100', '110', '120', '130'],
};

const uniformDetails = {
  shirt: { description: '夏季短袖翻领衬衫，可搭配同校夏季制服下装。', guide: 'top' },
  tee: { description: '夏季短袖运动上衣，可搭配同校运动短裤。', guide: 'top' },
  shorts: { description: '夏季运动短裤，适合体育课和日常运动。', guide: 'shorts' },
  polo: { description: '夏季短袖翻领 POLO，可搭配同校夏季制服下装。', guide: 'top' },
  jacket: { description: '秋冬长袖运动外套，可搭配同校秋冬运动服。', guide: 'top' },
};

// Reference garment measurements in cm for the store-terminal demo.
const uniformSizeGuides = {
  top: {
    columns: ['胸围', '衣长'],
    values: {
      90: [60, 38], 100: [64, 41], 110: [68, 44], 120: [72, 47],
      130: [76, 50], 140: [80, 54], 150: [86, 58], 155: [90, 60],
      160: [94, 62], 165: [98, 64], 170: [102, 66], 175: [106, 68], 180: [110, 70],
    },
  },
  shorts: {
    columns: ['腰围', '裤长'],
    values: {
      90: [42, 25], 100: [44, 27], 110: [46, 29], 120: [49, 31],
      130: [52, 33], 140: [55, 35], 150: [59, 38], 155: [62, 40],
      160: [65, 42], 165: [68, 44], 170: [71, 46], 175: [74, 48], 180: [77, 50],
    },
  },
};

// Catalog prices, sizes and pick locations are store-terminal demo data.
const checkoutUniforms = [
  ['PH-S-SHIRT', '中学部', '夏季短袖衬衫', '白色', 9900, 'A-01', 'shirt'],
  ['PH-S-TEE', '中学部', '夏季运动上衣', '白 / 紫', 8900, 'A-02', 'tee'],
  ['PH-S-SHORTS', '中学部', '夏季运动短裤', '深紫色', 7900, 'A-03', 'shorts'],
  ['PH-P-POLO', '小学部', '夏季短袖 POLO', '白色', 8900, 'A-04', 'polo'],
  ['PH-P-SHORTS', '小学部', '夏季运动短裤', '深紫色', 6900, 'A-05', 'shorts'],
  ['PH-P-JACKET', '小学部', '秋冬运动外套', '白 / 紫', 16900, 'A-06', 'jacket'],
  ['PH-K-POLO', '幼稚园', '夏季短袖 POLO', '白色', 7900, 'A-07', 'polo'],
  ['PH-K-SHORTS', '幼稚园', '夏季运动短裤', '深紫色', 5900, 'A-08', 'shorts'],
  ['AF-S-SHIRT', '中学部', '夏季短袖衬衫', '白色', 9900, 'B-01', 'shirt'],
  ['AF-S-TEE', '中学部', '夏季运动上衣', '白 / 蓝', 8900, 'B-02', 'tee'],
  ['AF-S-SHORTS', '中学部', '夏季运动短裤', '藏青色', 7900, 'B-03', 'shorts'],
  ['GD-P-POLO', '小学部', '夏季短袖 POLO', '白色', 8900, 'C-01', 'polo'],
  ['GD-P-TEE', '小学部', '夏季运动上衣', '酒红色', 8900, 'C-02', 'tee'],
  ['GD-P-JACKET', '小学部', '秋冬运动外套', '酒红色', 16900, 'C-03', 'jacket'],
].map(([id, stage, name, color, price, location, style]) => ({
  id, stage, name, color, price, location,
  school: checkoutSchools.find((school) => id.startsWith(school.id + '-')),
  sizes: schoolSizes[stage],
  description: uniformDetails[style].description,
  sizeGuide: uniformSizeGuides[uniformDetails[style].guide],
  image: `catalog/${id.toLowerCase()}.webp`,
}));

const checkoutRetail = [
  { sku: '200000001003', name: '运动袜（3 双装）', shortName: '运动袜', spec: '白色 / 均码', price: 2900, image: 'a002-socks.svg' },
  { sku: '200000001004', name: '运动水壶', shortName: '运动水壶', spec: '蓝色 / 600 mL', price: 5900, image: 'a003-bottle.svg' },
  { sku: '200000001005', name: '轻量双肩包', shortName: '双肩包', spec: '黑色 / 20 L', price: 12900, image: 'a004-backpack.svg' },
].map((product) => ({
  ...product,
  image: `../mc-mall-ui-demo-spec/demo/assets/products/${product.image}`,
}));
