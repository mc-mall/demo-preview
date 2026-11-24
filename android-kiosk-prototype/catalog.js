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

// Catalog prices, sizes and pick locations are store-terminal demo data.
const checkoutUniforms = [
  ['PH-S-SHIRT', '中学部', '夏季短袖衬衫', '白色', 9900, 'A-01'],
  ['PH-S-TEE', '中学部', '夏季运动上衣', '白 / 紫', 8900, 'A-02'],
  ['PH-S-SHORTS', '中学部', '夏季运动短裤', '深紫色', 7900, 'A-03'],
  ['PH-P-POLO', '小学部', '夏季短袖 POLO', '白色', 8900, 'A-04'],
  ['PH-P-SHORTS', '小学部', '夏季运动短裤', '深紫色', 6900, 'A-05'],
  ['PH-P-JACKET', '小学部', '秋冬运动外套', '白 / 紫', 16900, 'A-06'],
  ['PH-K-POLO', '幼稚园', '夏季短袖 POLO', '白色', 7900, 'A-07'],
  ['PH-K-SHORTS', '幼稚园', '夏季运动短裤', '深紫色', 5900, 'A-08'],
  ['AF-S-SHIRT', '中学部', '夏季短袖衬衫', '白色', 9900, 'B-01'],
  ['AF-S-TEE', '中学部', '夏季运动上衣', '白 / 蓝', 8900, 'B-02'],
  ['AF-S-SHORTS', '中学部', '夏季运动短裤', '藏青色', 7900, 'B-03'],
  ['GD-P-POLO', '小学部', '夏季短袖 POLO', '白色', 8900, 'C-01'],
  ['GD-P-TEE', '小学部', '夏季运动上衣', '酒红色', 8900, 'C-02'],
  ['GD-P-JACKET', '小学部', '秋冬运动外套', '酒红色', 16900, 'C-03'],
].map(([id, stage, name, color, price, location]) => ({
  id, stage, name, color, price, location,
  school: checkoutSchools.find((school) => id.startsWith(school.id + '-')),
  sizes: schoolSizes[stage],
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
