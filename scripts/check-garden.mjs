import assert from 'node:assert/strict';
import {
  gardenOf, plant, getPlantBlocker, waterAll, canWaterAll, waterPlot, dryCount, removePest, fertilize, harvest, clearPlot,
  advanceSeason, isReady, yieldOf, buy, buyPlot, sell, sellPriceOf, cook, eat, getCookBlocker, recipeOf, recipes, crops,
  cookedTotal, gardenAchievementIds, careLeft, careMax, isResting, workDiligently, getDiligentBlocker, weathers,
  CARE_PER_SEASON, DILIGENT_CARE_BONUS, STARTER_SEEDS, START_PLOTS, PLOT_PRICES, MAX_PLOTS, REST_SEASON,
} from '../js/leisure/garden-data.js';
import { ACTIVITY_SLOTS_PER_YEAR, getActivitySlotsLeft } from '../js/core/stat-budget.js';

 
const fixed = (value) => () => value;
const fair = fixed(0.01);  
const calm = fixed(0.3);  

const player = { age: 20, money: 10_000_000, health: 50, happiness: 50, intelligence: 50, appearance: 50, isAlive: true };
const g = gardenOf(player, calm);
assert.equal(g.plotsOwned, START_PLOTS);
assert.equal(g.plots.length, START_PLOTS);
assert.equal(g.season, 0);
assert.equal(g.weather, 'fair');
assert.equal(careLeft(g), CARE_PER_SEASON);
assert.deepEqual(g.seeds, STARTER_SEEDS, 'Mới mở vườn có sẵn gói hạt khởi đầu');
g.seeds = {};

 
assert.equal(buy(player, 'rau-muong', 2), 40_000);
assert.equal(buy(player, 'khoai-lang', 1), 50_000);
assert.equal(player.money, 10_000_000 - 90_000);
assert.ok(getPlantBlocker(g, 0, 'khoai-lang').includes('không gieo'), 'Khoai lang không gieo vào mùa xuân');
assert.equal(plant(g, 0, 'khoai-lang'), false);
assert.ok(getPlantBlocker(g, 1, 'ca-chua').includes('Chưa có hạt'));
assert.equal(plant(g, 0, 'rau-muong'), true);
assert.equal(plant(g, 0, 'rau-muong'), false, 'Luống đang có cây');
assert.equal(plant(g, 1, 'rau-muong'), true);
assert.equal(g.seeds['rau-muong'], 0);

 
assert.equal(dryCount(g), 2);
assert.equal(waterPlot(g, 0), true);
assert.equal(careLeft(g), CARE_PER_SEASON - 1);
assert.equal(waterPlot(g, 0), false, 'Luống đã tưới thì không tưới lại');
assert.equal(waterAll(g), 1, 'Tưới cả vườn chỉ tưới luống còn khô');
assert.equal(careLeft(g), CARE_PER_SEASON - 2);
assert.equal(canWaterAll(g), false);
 
g.plots[1].watered = false;
let report = advanceSeason(g, calm);
assert.equal(report.grown, 1);
assert.equal(isReady(g.plots[0]), true, 'Rau muống chín sau 1 mùa được tưới');
assert.equal(isReady(g.plots[1]), false, 'Không tưới thì không lớn');
assert.equal(g.season, 1);
assert.equal(careLeft(g), CARE_PER_SEASON);

 
assert.equal(harvest(g, 0), 4);
assert.equal(g.goods['rau-muong'], 4);
assert.equal(g.plots[0], null);
assert.equal(harvest(g, 1), 0, 'Chưa chín thì không thu được');
assert.ok(gardenAchievementIds(g).includes('garden-first-harvest'));

 
g.weather = 'drought';
report = advanceSeason(g, fair);
assert.equal(report.withered, 1);
assert.equal(g.plots[1].withered, true);
g.plots[1].pest = true;
assert.equal(removePest(g, 1), false, 'Không tốn công bắt sâu ở luống đã héo');
assert.equal(clearPlot(g, 1), true);
assert.equal(g.plots[1], null);
 
assert.equal(g.season, 2);
buy(player, 'ot', 1);
buy(player, 'phan', 2);
plant(g, 2, 'ot');
g.plots[2].pest = true;
assert.equal(fertilize(g, 2), true);
assert.equal(fertilize(g, 2), true);
assert.equal(fertilize(g, 2), false, 'Hết phân bón');
waterAll(g);
assert.equal(careLeft(g), CARE_PER_SEASON - 3);
report = advanceSeason(g, fair);
assert.equal(report.pests, 1);
assert.equal(g.plots[2].penalty, 1);
assert.equal(g.plots[2].pest, true, 'Sâu chưa bắt vẫn còn sang mùa sau');
assert.equal(removePest(g, 2), true);
assert.equal(removePest(g, 2), false, 'Hết sâu thì không bắt nữa');
waterAll(g);
advanceSeason(g, fair);
assert.equal(isResting(g), true, 'Sau mùa đông vườn nghỉ');
assert.equal(g.season, REST_SEASON);
assert.equal(isReady(g.plots[2]), true);
assert.equal(yieldOf(g.plots[2]), 5 + 2 - g.plots[2].penalty);
assert.equal(advanceSeason(g, fair), null, 'Không sang mùa khi đang nghỉ');
buy(player, 'hanh-la', 1);
assert.ok(getPlantBlocker(g, 0, 'hanh-la').includes('nghỉ đông'));
const chili = harvest(g, 2);
assert.equal(g.goods.ot, chili);

 
const price = sellPriceOf(g, 'rau-muong');
const before = player.money;
assert.equal(sell(player, 'rau-muong', 10), price * 4, 'Chỉ bán được số đang có');
assert.equal(player.money - before, price * 4);
assert.equal(g.goods['rau-muong'], 0);
assert.equal(g.earned, price * 4);

 
player.money = 100_000_000;
for (const cost of PLOT_PRICES) assert.equal(buyPlot(player), cost);
assert.equal(g.plotsOwned, MAX_PLOTS);
assert.equal(buyPlot(player), 0);

 
g.goods = { 'rau-muong': 30, trung: 30, 'hanh-la': 30, 'khoai-lang': 30, 'dua-leo': 30, 'rau-thom': 30,
  'ca-chua': 30, ca: 30, ot: 30, tom: 30, thit: 30, gao: 30, 'bi-do': 30, ngo: 30, 'dau-tay': 30 };
assert.ok(getCookBlocker(g, recipeOf('trung-sot-ca-chua')).includes('Cần nấu 3'));
assert.equal(cook(g, 'trung-sot-ca-chua'), false);
assert.equal(cook(g, 'rau-muong-luoc'), true);
assert.equal(g.goods['rau-muong'], 28);
cook(g, 'trung-chien-hanh');
cook(g, 'khoai-lang-nuong');
assert.equal(cookedTotal(g), 3);
assert.equal(cook(g, 'trung-sot-ca-chua'), true, 'Nấu đủ 3 món mở món vừa');
assert.ok(getCookBlocker(g, recipeOf('banh-xeo')).includes('Cần nấu 8'));
for (const id of ['canh-bi-do', 'sup-ngo', 'ca-kho', 'sinh-to-dau']) cook(g, id);
assert.equal(cook(g, 'banh-xeo'), true, 'Nấu đủ 8 món mở món phức tạp');
assert.ok(gardenAchievementIds(g).includes('cook-complex-first'));
assert.ok(!gardenAchievementIds(g).includes('cook-all-complex'));
for (const recipe of recipes) if (!g.cooked[recipe.id]) cook(g, recipe.id);
assert.ok(gardenAchievementIds(g).includes('cook-all-complex'));
assert.ok(gardenAchievementIds(g).includes('cook-all-recipes'));
const empty = { ...g, goods: {} };
assert.equal(getCookBlocker(empty, recipeOf('rau-muong-luoc')), 'Chưa đủ nguyên liệu.');

 
const slots = getActivitySlotsLeft(player);
assert.equal(slots, ACTIVITY_SLOTS_PER_YEAR);
const gains = eat(player, 'banh-xeo');
assert.deepEqual(gains, { happiness: 3, health: 1, intelligence: 1 });
assert.equal(player.happiness, 53);
assert.equal(getActivitySlotsLeft(player), slots - 1);
assert.equal(eat(player, 'banh-xeo'), null, 'Mỗi món chỉ ăn một lần mỗi năm');
assert.equal(eat(player, 'goi-cuon') !== null, true);
for (const recipe of recipes) eat(player, recipe.id);
assert.equal(getActivitySlotsLeft(player), 0);
assert.equal(eat(player, 'canh-chua-ca'), null, 'Hết lượt rảnh thì không ăn được');

 
plant(g, 0, 'hanh-la') || (g.plots[0] = { crop: 'hanh-la', growth: 0, watered: false, pest: false, fert: 0, penalty: 0, withered: false });
g.dishes['banh-xeo'] = 2;
g.eaten['banh-xeo'] = 20;
const dishesBeforeNewYear = { ...g.dishes };
const goodsBeforeNewYear = { ...g.goods };
player.age = 21;
gardenOf(player, calm);
assert.equal(g.season, 0);
assert.equal(g.year, 21);
assert.deepEqual(g.dishes, dishesBeforeNewYear, 'Món chưa ăn vẫn còn khi sang năm');
assert.deepEqual(g.goods, goodsBeforeNewYear, 'Nguyên liệu vẫn còn khi sang năm');
assert.equal(g.plots[0].crop, 'hanh-la');
assert.ok(eat(player, 'banh-xeo') !== null, 'Sang năm vẫn ăn được món đã nấu từ năm trước');
assert.equal(g.dishes['banh-xeo'], 1, 'Ăn chỉ trừ một phần đã giữ lại');
assert.equal(eat(player, 'banh-xeo'), null, 'Mỗi món vẫn chỉ ăn được một lần mỗi năm');
assert.deepEqual(JSON.parse(JSON.stringify(g)), g, 'Vườn lưu được bằng JSON');
assert.ok(crops.every((crop) => crop.plant.length && crop.grow >= 1));

const stats = { health: 50, happiness: 50, intelligence: 50, appearance: 50, isAlive: true };

 
const kid = { age: 11, money: 0, ...stats };
const yard = gardenOf(kid, calm);
yard.prices = Object.fromEntries(crops.map((crop) => [crop.id, 0.7]));
let seedIndex = 0;
for (const [id, count] of Object.entries(STARTER_SEEDS)) {
  for (let n = 0; n < count; n++) assert.equal(plant(yard, seedIndex++, id), true);
}
yard.weather = 'rain';
yard.plots.forEach((plot) => { plot.watered = true; });
advanceSeason(yard, calm);
yard.prices = Object.fromEntries(crops.map((crop) => [crop.id, 0.7]));
yard.plots.forEach((_, index) => harvest(yard, index));
for (const id of Object.keys(STARTER_SEEDS)) sell(kid, id, yard.goods[id]);
const reseed = Object.entries(STARTER_SEEDS).reduce((total, [id, count]) => total + crops.find((crop) => crop.id === id).seed * count, 0);
assert.ok(kid.money >= reseed, `Bán lứa đầu (${kid.money}) đủ mua lại hạt (${reseed})`);

 
const farmer = { age: 30, money: 50_000_000, ...stats };
const field = gardenOf(farmer, calm);
assert.equal(buyPlot(farmer), PLOT_PRICES[0]);
buy(farmer, 'rau-muong', 5);
for (let index = 0; index < 5; index++) assert.equal(plant(field, index, 'rau-muong'), true);
assert.equal(dryCount(field), 5);
assert.equal(canWaterAll(field), false, 'Không đủ công tưới hết');
assert.equal(waterAll(field), 0);
for (let index = 0; index < CARE_PER_SEASON; index++) assert.equal(waterPlot(field, index), true);
assert.equal(careLeft(field), 0);
assert.equal(waterPlot(field, 4), false, 'Hết công');

 
assert.equal(workDiligently(farmer), true);
assert.equal(getActivitySlotsLeft(farmer), ACTIVITY_SLOTS_PER_YEAR - 1);
assert.equal(careLeft(field), DILIGENT_CARE_BONUS);
assert.equal(waterAll(field), 5 - CARE_PER_SEASON, 'Đủ công thì tưới nốt các luống còn khô');
assert.ok(getDiligentBlocker(farmer), 'Mỗi năm chỉ chăm kỹ một lần');
assert.equal(workDiligently(farmer), false);
advanceSeason(field, calm);
assert.equal(careMax(field), CARE_PER_SEASON + DILIGENT_CARE_BONUS, 'Mùa sau vẫn có thêm công');
while (!isResting(field)) advanceSeason(field, calm);
assert.equal(careLeft(field), 0, 'Vườn nghỉ thì không còn công');
assert.equal(workDiligently(farmer), false, 'Không chăm kỹ khi vườn nghỉ');
farmer.age = 31;
gardenOf(farmer, calm);
assert.equal(careMax(field), CARE_PER_SEASON, 'Sang năm mới phải chọn chăm kỹ lại');
farmer.activitySlots = { age: 31, used: ACTIVITY_SLOTS_PER_YEAR };
assert.ok(getDiligentBlocker(farmer).includes('rảnh'));
assert.equal(workDiligently(farmer), false, 'Hết lượt rảnh thì không chăm kỹ được');

 
const watcher = { age: 40, money: 0, ...stats };
const sky = gardenOf(watcher);
for (let season = 0; season < 3; season++) {
  const forecast = sky.forecast;
  assert.ok(forecast in weathers);
  advanceSeason(sky);
  assert.equal(sky.weather, forecast);
}
assert.equal(sky.forecast, null);
 
sky.season = 1;
sky.forecast = 'drought';
watcher.age = 42;
gardenOf(watcher, fixed(0.3));
assert.equal(sky.weather, 'fair', 'Không dùng dự báo của mùa khác');
 
delete sky.forecast;
gardenOf(watcher);
assert.ok(sky.forecast in weathers);
console.log('garden ok');
