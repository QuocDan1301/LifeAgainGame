import assert from 'node:assert/strict';
import {
  gardenOf, plant, getPlantBlocker, waterAll, canWater, removePest, fertilize, harvest, clearPlot, advanceSeason, isReady,
  yieldOf, buy, buyPlot, sell, sellPriceOf, cook, eat, getCookBlocker, recipeOf, recipes, crops, cookedTotal,
  gardenAchievementIds, careLeft, isResting, CARE_PER_SEASON, START_PLOTS, PLOT_PRICES, MAX_PLOTS, REST_SEASON,
} from '../js/leisure/garden-data.js';
import { ACTIVITY_SLOTS_PER_YEAR, getActivitySlotsLeft } from '../js/core/stat-budget.js';

// Dãy số ngẫu nhiên điều khiển được: luôn trả về giá trị đặt sẵn.
const fixed = (value) => () => value;
const fair = fixed(0.01); // thời tiết ôn hòa (mọi mùa), có sâu (dưới 0,2)
const calm = fixed(0.3); // ôn hòa ở mùa xuân, không sâu

const player = { age: 20, money: 10_000_000, health: 50, happiness: 50, intelligence: 50, appearance: 50, isAlive: true };
const g = gardenOf(player, calm);
assert.equal(g.plotsOwned, START_PLOTS);
assert.equal(g.plots.length, START_PLOTS);
assert.equal(g.season, 0);
assert.equal(g.weather, 'fair');
assert.equal(careLeft(g), CARE_PER_SEASON);

// Mua hạt, gieo đúng mùa.
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

// Tưới tốn 1 công cho cả vườn; không tưới lại khi đã tưới hết.
assert.equal(waterAll(g), true);
assert.equal(careLeft(g), CARE_PER_SEASON - 1);
assert.equal(canWater(g), false);
// Bỏ tưới luống 2 để kiểm tra cây không lớn.
g.plots[1].watered = false;
let report = advanceSeason(g, calm);
assert.equal(report.grown, 1);
assert.equal(isReady(g.plots[0]), true, 'Rau muống chín sau 1 mùa được tưới');
assert.equal(isReady(g.plots[1]), false, 'Không tưới thì không lớn');
assert.equal(g.season, 1);
assert.equal(careLeft(g), CARE_PER_SEASON);

// Thu hoạch đúng sản lượng và ghi vào kho.
assert.equal(harvest(g, 0), 4);
assert.equal(g.goods['rau-muong'], 4);
assert.equal(g.plots[0], null);
assert.equal(harvest(g, 1), 0, 'Chưa chín thì không thu được');
assert.ok(gardenAchievementIds(g).includes('garden-first-harvest'));

// Nắng hạn làm héo luống chưa tưới; sâu không bắt làm mất sản lượng.
g.weather = 'drought';
report = advanceSeason(g, fair);
assert.equal(report.withered, 1);
assert.equal(g.plots[1].withered, true);
assert.equal(clearPlot(g, 1), true);
assert.equal(g.plots[1], null);
// Mùa thu: có sâu (fair < 0,2), gieo ớt, bón phân và để sâu.
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

// Bán theo giá chợ của mùa.
const price = sellPriceOf(g, 'rau-muong');
const before = player.money;
assert.equal(sell(player, 'rau-muong', 10), price * 4, 'Chỉ bán được số đang có');
assert.equal(player.money - before, price * 4);
assert.equal(g.goods['rau-muong'], 0);
assert.equal(g.earned, price * 4);

// Mở thêm luống tới giới hạn.
player.money = 100_000_000;
for (const cost of PLOT_PRICES) assert.equal(buyPlot(player), cost);
assert.equal(g.plotsOwned, MAX_PLOTS);
assert.equal(buyPlot(player), 0);

// Bếp: mức món mở theo số món đã nấu; thiếu nguyên liệu thì không nấu.
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

// Ăn: tốn lượt rảnh, mỗi món một lần mỗi năm, chỉ số tăng theo luật chung.
const slots = getActivitySlotsLeft(player);
assert.equal(slots, ACTIVITY_SLOTS_PER_YEAR);
const gains = eat(player, 'banh-xeo');
assert.deepEqual(gains, { happiness: 4, health: 1, intelligence: 1 });
assert.equal(player.happiness, 54);
assert.equal(getActivitySlotsLeft(player), slots - 1);
assert.equal(eat(player, 'banh-xeo'), null, 'Mỗi món chỉ ăn một lần mỗi năm');
assert.equal(eat(player, 'goi-cuon') !== null, true);
for (const recipe of recipes) eat(player, recipe.id);
assert.equal(getActivitySlotsLeft(player), 0);
assert.equal(eat(player, 'canh-chua-ca'), null, 'Hết lượt rảnh thì không ăn được');

// Sang tuổi mới: vườn về mùa xuân, món nấu năm cũ bỏ đi, cây đang trồng giữ nguyên.
plant(g, 0, 'hanh-la') || (g.plots[0] = { crop: 'hanh-la', growth: 0, watered: false, pest: false, fert: 0, penalty: 0, withered: false });
player.age = 21;
gardenOf(player, calm);
assert.equal(g.season, 0);
assert.equal(g.year, 21);
assert.deepEqual(g.dishes, {});
assert.equal(g.plots[0].crop, 'hanh-la');
assert.ok(eat(player, 'banh-xeo') === null, 'Không còn món để ăn');
assert.deepEqual(JSON.parse(JSON.stringify(g)), g, 'Vườn lưu được bằng JSON');
assert.ok(crops.every((crop) => crop.plant.length && crop.grow >= 1));
console.log('garden ok');
