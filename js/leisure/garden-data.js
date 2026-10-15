import { applyActivityGain, getActivitySlotsLeft, useActivitySlot } from "../core/stat-budget.js";

 
 
 
 
 
 
 
 
export const GARDEN_MIN_AGE = 11;
export const START_PLOTS = 4;
export const PLOT_PRICES = [500_000, 1_000_000, 1_500_000, 2_000_000];
export const MAX_PLOTS = START_PLOTS + PLOT_PRICES.length;
export const CARE_PER_SEASON = 3;
export const DILIGENT_CARE_BONUS = 3;
export const PEST_CHANCE = 0.2;
export const MAX_FERTILIZER = 2;
export const REST_SEASON = 4;
 
export const STARTER_SEEDS = { "rau-muong": 2, "hanh-la": 2 };

export const seasons = [
  { id: "spring", name: "Mùa xuân", short: "Xuân", icon: "🌸" },
  { id: "summer", name: "Mùa hạ", short: "Hạ", icon: "☀️" },
  { id: "autumn", name: "Mùa thu", short: "Thu", icon: "🍂" },
  { id: "winter", name: "Mùa đông", short: "Đông", icon: "❄️" },
];
export const weathers = {
  fair: { icon: "⛅", name: "Ôn hòa", note: "Luống nào được tưới mới lớn thêm. Mỗi luống tốn 1 công tưới." },
  rain: { icon: "🌧️", name: "Mưa thuận", note: "Mưa đều, mọi luống tự được tưới trong mùa này." },
  drought: { icon: "🔥", name: "Nắng hạn", note: "Luống nào không được tưới sẽ héo khi hết mùa." },
};
 
const WEATHER_ODDS = [[0.55, 0.35, 0.1], [0.4, 0.2, 0.4], [0.45, 0.45, 0.1], [0.7, 0.1, 0.2]];

 
export const crops = [
  { id: "rau-muong", icon: "🥬", name: "Rau muống", seed: 20_000, grow: 1, plant: [0, 1, 2], yield: 4, price: 12_000 },
  { id: "hanh-la", icon: "🧅", name: "Hành lá", seed: 15_000, grow: 1, plant: [0, 1, 2, 3], yield: 3, price: 10_000 },
  { id: "rau-thom", icon: "🌿", name: "Rau thơm", seed: 25_000, grow: 1, plant: [0, 1, 2], yield: 3, price: 15_000 },
  { id: "ca-chua", icon: "🍅", name: "Cà chua", seed: 40_000, grow: 2, plant: [0, 2, 3], yield: 4, price: 25_000 },
  { id: "dua-leo", icon: "🥒", name: "Dưa leo", seed: 35_000, grow: 2, plant: [0, 1], yield: 4, price: 20_000 },
  { id: "ot", icon: "🌶️", name: "Ớt", seed: 30_000, grow: 2, plant: [0, 1, 2], yield: 5, price: 15_000 },
  { id: "ngo", icon: "🌽", name: "Ngô", seed: 40_000, grow: 2, plant: [0, 1], yield: 4, price: 22_000 },
  { id: "khoai-lang", icon: "🍠", name: "Khoai lang", seed: 50_000, grow: 3, plant: [1, 2], yield: 5, price: 30_000 },
  { id: "bi-do", icon: "🎃", name: "Bí đỏ", seed: 60_000, grow: 3, plant: [0, 2], yield: 3, price: 60_000 },
  { id: "dau-tay", icon: "🍓", name: "Dâu tây", seed: 150_000, grow: 3, plant: [2, 3], yield: 3, price: 120_000 },
];
 
export const groceries = [
  { id: "trung", icon: "🥚", name: "Trứng", price: 30_000 },
  { id: "thit", icon: "🥩", name: "Thịt heo", price: 90_000 },
  { id: "ca", icon: "🐟", name: "Cá", price: 80_000 },
  { id: "tom", icon: "🦐", name: "Tôm", price: 120_000 },
  { id: "gao", icon: "🍚", name: "Bột gạo", price: 25_000 },
  { id: "phan", icon: "🪱", name: "Phân hữu cơ", price: 30_000, note: "Bón cho một luống: thêm 1 phần khi thu hoạch, tối đa 2 lần mỗi lứa." },
];

export const cookTiers = [
  { id: 0, name: "Món đơn giản", minCooked: 0, rank: "Mới vào bếp" },
  { id: 1, name: "Món vừa", minCooked: 3, rank: "Nấu khá" },
  { id: 2, name: "Món phức tạp", minCooked: 8, rank: "Đầu bếp tại gia" },
];
export const recipes = [
  { id: "rau-muong-luoc", tier: 0, icon: "🥬", name: "Rau muống luộc", needs: { "rau-muong": 2 }, effects: { health: 2 },
    description: "Đĩa rau xanh mướt, chấm nước mắm tỏi ớt." },
  { id: "trung-chien-hanh", tier: 0, icon: "🍳", name: "Trứng chiên hành", needs: { trung: 1, "hanh-la": 1 }, effects: { happiness: 2 },
    description: "Món quen thuộc của mọi gian bếp, thơm mùi hành phi." },
  { id: "khoai-lang-nuong", tier: 0, icon: "🍠", name: "Khoai lang nướng", needs: { "khoai-lang": 2 }, effects: { happiness: 1, health: 1 },
    description: "Vỏ cháy xém, ruột vàng ươm và ngọt bùi." },
  { id: "dua-leo-tron", tier: 0, icon: "🥒", name: "Dưa leo trộn rau thơm", needs: { "dua-leo": 2, "rau-thom": 1 }, effects: { appearance: 1, health: 1 },
    description: "Giòn mát, thanh nhẹ cho ngày nắng." },
  { id: "trung-sot-ca-chua", tier: 1, icon: "🍅", name: "Trứng sốt cà chua", needs: { trung: 2, "ca-chua": 2, "hanh-la": 1 }, effects: { health: 2, happiness: 2 },
    description: "Sốt cà chua sánh mịn ôm lấy từng miếng trứng mềm." },
  { id: "canh-bi-do", tier: 1, icon: "🎃", name: "Canh bí đỏ thịt bằm", needs: { "bi-do": 1, thit: 1, "hanh-la": 1 }, effects: { health: 3, intelligence: 1 },
    description: "Nồi canh ngọt thanh, ấm bụng cả nhà." },
  { id: "sup-ngo", tier: 1, icon: "🌽", name: "Súp ngô trứng", needs: { ngo: 2, trung: 1, "hanh-la": 1 }, effects: { health: 2, happiness: 1 },
    description: "Bát súp sánh, từng hạt ngô ngọt bùi." },
  { id: "ca-kho", tier: 1, icon: "🐟", name: "Cá kho tộ", needs: { ca: 1, ot: 1, "hanh-la": 1 }, effects: { health: 2, happiness: 2 },
    description: "Kho lửa liu riu đến khi nước sánh lại, cay nồng vị ớt." },
  { id: "sinh-to-dau", tier: 1, icon: "🍓", name: "Sinh tố dâu", needs: { "dau-tay": 2 }, effects: { appearance: 2, happiness: 1 },
    description: "Ly sinh tố hồng mát lạnh từ dâu chín mọng." },
  { id: "canh-chua-ca", tier: 2, icon: "🍲", name: "Canh chua cá", needs: { ca: 1, "ca-chua": 2, ot: 1, "rau-thom": 1, "rau-muong": 1 }, effects: { health: 3, happiness: 2 },
    description: "Vị chua thanh, cay nhẹ, thơm rau, đậm đà miền sông nước." },
  { id: "goi-cuon", tier: 2, icon: "🥢", name: "Gỏi cuốn tôm thịt", needs: { tom: 1, thit: 1, "rau-thom": 2, "dua-leo": 1, gao: 1 }, effects: { health: 2, appearance: 2, happiness: 1 },
    description: "Từng cuốn trong veo, tôm hồng ẩn sau lớp rau xanh." },
  { id: "banh-xeo", tier: 2, icon: "🥞", name: "Bánh xèo", needs: { gao: 1, tom: 1, thit: 1, "hanh-la": 1, "rau-thom": 1 }, effects: { happiness: 3, health: 1, intelligence: 1 },
    description: "Vỏ bánh vàng giòn kêu xèo xèo, cuốn rau chấm nước mắm chua ngọt." },
  { id: "lau-chua-cay", tier: 2, icon: "🫕", name: "Lẩu chua cay", needs: { tom: 1, ca: 1, "ca-chua": 1, ot: 2, "rau-muong": 2 }, effects: { happiness: 3, health: 2 },
    description: "Nồi lẩu nghi ngút khói cho một buổi tối quây quần." },
];

export const cropOf = (id) => crops.find((crop) => crop.id === id);
export const groceryOf = (id) => groceries.find((item) => item.id === id);
export const ingredientOf = (id) => cropOf(id) ?? groceryOf(id);
export const recipeOf = (id) => recipes.find((recipe) => recipe.id === id);
export const plotPrice = (garden) => PLOT_PRICES[garden.plotsOwned - START_PLOTS] ?? null;
export const isResting = (garden) => garden.season >= REST_SEASON;
export const isDiligent = (garden) => garden.diligent === garden.year;
export const careMax = (garden) => CARE_PER_SEASON + (isDiligent(garden) ? DILIGENT_CARE_BONUS : 0);
export const careLeft = (garden) => isResting(garden) ? 0 : Math.max(0, careMax(garden) - garden.care);
export const isReady = (plot) => Boolean(plot && !plot.withered && plot.growth >= cropOf(plot.crop).grow);
export const yieldOf = (plot) => Math.max(1, cropOf(plot.crop).yield + plot.fert - plot.penalty);
export const sellPriceOf = (garden, cropId) => Math.round(cropOf(cropId).price * (garden.prices?.[cropId] ?? 1) / 1_000) * 1_000;
export const cookedTotal = (garden) => Object.values(garden.cooked).reduce((sum, count) => sum + count, 0);
export const cookRank = (garden) => cookTiers.filter((tier) => cookedTotal(garden) >= tier.minCooked).at(-1);
export const tierUnlocked = (garden, tier) => cookedTotal(garden) >= cookTiers[tier].minCooked;
export const hasEatenThisYear = (garden, age, recipeId) => garden.eaten[recipeId] === age;

function rollWeather(season, random) {
  const odds = WEATHER_ODDS[season];
  const roll = random();
  return roll < odds[0] ? "fair" : roll < odds[0] + odds[1] ? "rain" : "drought";
}
 
 
function startSeason(garden, random) {
  garden.care = 0;
  garden.weather = garden.forecast ?? rollWeather(garden.season, random);
  garden.forecast = garden.season < 3 ? rollWeather(garden.season + 1, random) : null;
  garden.prices = Object.fromEntries(crops.map((crop) => [crop.id, Math.round((0.7 + random() * 0.7) * 100) / 100]));
  for (const plot of garden.plots) {
    if (!plot || plot.withered) continue;
    plot.watered = garden.weather === "rain";
    if (!isReady(plot) && random() < PEST_CHANCE) plot.pest = true;
  }
}

export function gardenOf(player, random = Math.random) {
  if (!player.garden || typeof player.garden !== "object") {
    player.garden = { year: player.age, season: 0, care: 0, weather: "fair", forecast: null, diligent: null, prices: {},
      plotsOwned: START_PLOTS, plots: Array(START_PLOTS).fill(null), seeds: { ...STARTER_SEEDS }, goods: {}, dishes: {}, eaten: {}, cooked: {},
      harvested: {}, earned: 0 };
    startSeason(player.garden, random);
  }
  const garden = player.garden;
   
   
  if (garden.year !== player.age) {
    garden.year = player.age;
    garden.season = 0;
    garden.dishes = {};
    garden.forecast = null;
    startSeason(garden, random);
  }
   
  if (garden.forecast === undefined) garden.forecast = garden.season < 3 ? rollWeather(garden.season + 1, random) : null;
  return garden;
}

 
export function getPlantBlocker(garden, plotIndex, cropId) {
  const crop = cropOf(cropId);
  if (!crop || plotIndex >= garden.plotsOwned) return "Không có luống này.";
  if (isResting(garden)) return "Vườn đang nghỉ đông tới năm sau.";
  if (garden.plots[plotIndex]) return "Luống đang có cây.";
  if (!crop.plant.includes(garden.season)) return `${crop.name} không gieo vào ${seasons[garden.season].name.toLocaleLowerCase("vi-VN")}.`;
  if (!(garden.seeds[cropId] > 0)) return "Chưa có hạt giống.";
  return "";
}
export function plant(garden, plotIndex, cropId) {
  if (getPlantBlocker(garden, plotIndex, cropId)) return false;
  garden.seeds[cropId]--;
  garden.plots[plotIndex] = { crop: cropId, growth: 0, watered: garden.weather === "rain", pest: false, fert: 0, penalty: 0, withered: false };
  return true;
}
const isGrowing = (plot) => Boolean(plot && !plot.withered && !isReady(plot));
const dryPlots = (garden) => garden.plots.filter((plot) => isGrowing(plot) && !plot.watered);
export const dryCount = (garden) => dryPlots(garden).length;
 
export const canWaterPlot = (garden, plotIndex) => {
  const plot = garden.plots[plotIndex];
  return isGrowing(plot) && !plot.watered && careLeft(garden) > 0;
};
export function waterPlot(garden, plotIndex) {
  if (!canWaterPlot(garden, plotIndex)) return false;
  garden.care++;
  garden.plots[plotIndex].watered = true;
  return true;
}
export const canWaterAll = (garden) => dryCount(garden) > 0 && careLeft(garden) >= dryCount(garden);
export function waterAll(garden) {
  if (!canWaterAll(garden)) return 0;
  const dry = dryPlots(garden);
  garden.care += dry.length;
  dry.forEach((plot) => { plot.watered = true; });
  return dry.length;
}
export function removePest(garden, plotIndex) {
  const plot = garden.plots[plotIndex];
  if (!isGrowing(plot) || !plot.pest || careLeft(garden) === 0) return false;
  garden.care++;
  plot.pest = false;
  return true;
}
export const canFertilize = (garden, plotIndex) => {
  const plot = garden.plots[plotIndex];
  return isGrowing(plot) && plot.fert < MAX_FERTILIZER && careLeft(garden) > 0 && garden.goods.phan > 0;
};
 
export function getDiligentBlocker(player) {
  const garden = player.garden;
  if (isResting(garden)) return "Vườn đang nghỉ đông tới năm sau.";
  if (isDiligent(garden)) return "Năm nay bạn đã dành thời gian chăm kỹ.";
  if (!getActivitySlotsLeft(player)) return "Đã hết thời gian rảnh năm nay.";
  return "";
}
export function workDiligently(player) {
  if (getDiligentBlocker(player) || !useActivitySlot(player)) return false;
  player.garden.diligent = player.garden.year;
  return true;
}
export function fertilize(garden, plotIndex) {
  if (!canFertilize(garden, plotIndex)) return false;
  garden.care++;
  garden.goods.phan--;
  garden.plots[plotIndex].fert++;
  return true;
}
export function harvest(garden, plotIndex) {
  const plot = garden.plots[plotIndex];
  if (!isReady(plot)) return 0;
  const amount = yieldOf(plot);
  garden.goods[plot.crop] = (garden.goods[plot.crop] ?? 0) + amount;
  garden.harvested[plot.crop] = (garden.harvested[plot.crop] ?? 0) + amount;
  garden.plots[plotIndex] = null;
  return amount;
}
export function clearPlot(garden, plotIndex) {
  if (!garden.plots[plotIndex]?.withered) return false;
  garden.plots[plotIndex] = null;
  return true;
}

 
export function advanceSeason(garden, random = Math.random) {
  if (isResting(garden)) return null;
  const report = { season: garden.season, weather: garden.weather, grown: 0, ready: 0, withered: 0, pests: 0 };
  for (const plot of garden.plots) {
    if (!plot || plot.withered || isReady(plot)) continue;
    if (plot.pest) {
      plot.penalty++;
      report.pests++;
    }
    if (plot.watered) {
      plot.growth++;
      report.grown++;
      if (isReady(plot)) {
        report.ready++;
        plot.pest = false;
      }
    } else if (garden.weather === "drought") {
      plot.withered = true;
      report.withered++;
    }
    plot.watered = false;
  }
  garden.season++;
  if (!isResting(garden)) startSeason(garden, random);
  return report;
}

 
export function buyPlot(player) {
  const garden = player.garden;
  const price = plotPrice(garden);
  if (price === null || player.money < price) return 0;
  player.money -= price;
  garden.plotsOwned++;
  garden.plots.push(null);
  return price;
}
export function buy(player, id, amount = 1) {
  const garden = player.garden;
  const crop = cropOf(id);
  const price = (crop ? crop.seed : groceryOf(id)?.price ?? Infinity) * amount;
  if (!(amount > 0) || player.money < price) return 0;
  player.money -= price;
  const store = crop ? garden.seeds : garden.goods;
  store[id] = (store[id] ?? 0) + amount;
  return price;
}
export function sell(player, cropId, amount) {
  const garden = player.garden;
  const count = Math.min(amount, garden.goods[cropId] ?? 0);
  if (!cropOf(cropId) || count <= 0) return 0;
  const income = sellPriceOf(garden, cropId) * count;
  garden.goods[cropId] -= count;
  garden.earned += income;
  player.money += income;
  return income;
}

 
export const missingFor = (garden, recipe) =>
  Object.entries(recipe.needs).filter(([id, count]) => (garden.goods[id] ?? 0) < count);
export function getCookBlocker(garden, recipe) {
  if (!tierUnlocked(garden, recipe.tier)) return `Cần nấu ${cookTiers[recipe.tier].minCooked} món để mở ${cookTiers[recipe.tier].name.toLocaleLowerCase("vi-VN")}.`;
  if (missingFor(garden, recipe).length) return "Chưa đủ nguyên liệu.";
  return "";
}
export function cook(garden, recipeId) {
  const recipe = recipeOf(recipeId);
  if (!recipe || getCookBlocker(garden, recipe)) return false;
  for (const [id, count] of Object.entries(recipe.needs)) garden.goods[id] -= count;
  garden.dishes[recipeId] = (garden.dishes[recipeId] ?? 0) + 1;
  garden.cooked[recipeId] = (garden.cooked[recipeId] ?? 0) + 1;
  return true;
}
 
export function eat(player, recipeId) {
  const garden = player.garden;
  const recipe = recipeOf(recipeId);
  if (!recipe || !(garden.dishes[recipeId] > 0) || hasEatenThisYear(garden, player.age, recipeId) || !useActivitySlot(player)) return null;
  garden.dishes[recipeId]--;
  garden.eaten[recipeId] = player.age;
  return Object.fromEntries(Object.entries(recipe.effects).map(([stat, value]) => [stat, applyActivityGain(player, stat, value)]));
}

export function gardenAchievementIds(garden) {
  const ids = [];
  if (Object.keys(garden.harvested).length) ids.push("garden-first-harvest");
  if (crops.filter((crop) => garden.harvested[crop.id]).length >= 5) ids.push("garden-five-crops");
  if (crops.every((crop) => garden.harvested[crop.id])) ids.push("garden-all-crops");
  if (recipes.filter((recipe) => garden.cooked[recipe.id]).length >= 3) ids.push("cook-three-recipes");
  const complex = recipes.filter((recipe) => recipe.tier === 2);
  if (complex.some((recipe) => garden.cooked[recipe.id])) ids.push("cook-complex-first");
  if (complex.every((recipe) => garden.cooked[recipe.id])) ids.push("cook-all-complex");
  if (recipes.every((recipe) => garden.cooked[recipe.id])) ids.push("cook-all-recipes");
  return ids;
}
