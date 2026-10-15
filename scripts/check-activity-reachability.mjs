import fs from 'node:fs';
import assert from 'node:assert/strict';
import { gardenOf, crops, recipes, groceries, buy, plant, waterPlot, advanceSeason, harvest, isReady, isResting, cook, gardenAchievementIds } from '../js/leisure/garden-data.js';
import { ensureBoard, takeOffer, investigate, accuse, detectiveAchievementIds, clearingClue, BOARD_SIZE } from '../js/leisure/detective-data.js';
import { solutionSteps } from '../js/leisure/detective-reasoning.js';
import { drawTarotCards, tarotAchievementIds, TAROT_FEE } from '../js/leisure/tarot.js';

const report = { assumptions: 'Constructive legal activity actions with an explicit 5m garden budget from employment; favorable nonzero weather and solved detective puzzles. This proves paths exist, not that random play always wins. Tarot collection persists across lives.' };
const gardener = { age: 22, money: 5e6, isAlive: true, health: 80, happiness: 80, intelligence: 80, appearance: 80 };
const required = Object.fromEntries(crops.map(crop => [crop.id, 1]));
for (const recipe of recipes) for (const [id, amount] of Object.entries(recipe.needs)) {
  if (crops.some(crop => crop.id === id)) required[id] += amount;
}
let garden = gardenOf(gardener, () => 0.3);
for (; gardener.age < 42 && !crops.every(crop => (garden.goods[crop.id] ?? 0) >= required[crop.id]); gardener.age++) {
  garden = gardenOf(gardener, () => 0.3);
  while (!isResting(garden)) {
    garden.plots.forEach((plot, index) => { if (isReady(plot)) harvest(garden, index); });
    for (let index = 0; index < 3; index++) {
      if (garden.plots[index]) continue;
      const crop = crops.find(candidate => candidate.plant.includes(garden.season) &&
        (garden.goods[candidate.id] ?? 0) + garden.plots.filter(plot => plot?.crop === candidate.id).length * candidate.yield < required[candidate.id]);
      if (!crop) continue;
      if (!(garden.seeds[crop.id] > 0)) assert.equal(buy(gardener, crop.id, 1), crop.seed);
      assert.equal(plant(garden, index, crop.id), true);
    }
    garden.plots.forEach((plot, index) => { if (plot && !isReady(plot) && !plot.watered) assert.equal(waterPlot(garden, index), true); });
    advanceSeason(garden, () => 0.3);
  }
  garden.plots.forEach((plot, index) => { if (isReady(plot)) harvest(garden, index); });
}
assert.ok(crops.every(crop => (garden.goods[crop.id] ?? 0) >= required[crop.id]), 'Seasonal planting can supply all recipes');
for (const recipe of [...recipes].sort((a, b) => a.tier - b.tier)) {
  for (const [id, count] of Object.entries(recipe.needs)) {
    if (groceries.some(item => item.id === id) && (garden.goods[id] ?? 0) < count) assert.ok(buy(gardener, id, count - (garden.goods[id] ?? 0)));
  }
  assert.equal(cook(garden, recipe.id), true, recipe.id);
}
const gardenFlags = gardenAchievementIds(garden);
assert.equal(gardenFlags.length, 7);
report.garden = { flags: gardenFlags, completedAtAge: gardener.age, spent: 5e6 - gardener.money,
  actions: 'Only buy in-season seeds, plant up to three plots, water with three seasonal care points, harvest, buy cooking staples, cook recipes in tier order. No stock or cooking counters injected.' };
console.log('PASS all seven garden/cooking achievements via seasonal crops and real recipe ingredients');

let seed = 123456;
const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
const detective = { age: 22, money: 0, intelligence: 85, happiness: 80, health: 80, isAlive: true };
const earned = new Set();
for (; detective.age <= 30 && earned.size < 5; detective.age++) {
  ensureBoard(detective, random);
  for (let offer = 0; offer < BOARD_SIZE; offer++) {
    const file = takeOffer(detective, offer);
    assert.ok(file);
    for (const step of solutionSteps({ ...file, result: {} })) assert.equal(investigate(detective, step.clueIndex), true);
    const reasons = Object.fromEntries(file.suspects.map((_, index) => [index, clearingClue(file, index)])
      .filter(([index]) => index !== file.culprit));
    const result = accuse(detective, file.culprit, reasons);
    assert.ok(result.correct && result.unproven === 0);
    assert.equal(file.extraHours, 0);
    for (const id of detectiveAchievementIds(detective.detective, file)) earned.add(id);
    detective.detective.current = null;
  }
}
assert.equal(earned.size, 5);
report.detective = { flags: [...earned], completedAtAge: detective.age - 1, solved: detective.detective.solved, earnings: detective.money,
  assumptions: 'Player solves the evidence puzzle; test uses the solver to choose valid clues within normal hours, rather than assigning solved/reputation counters.' };
console.log('PASS all five detective achievements through actual cases and normal investigation hours');

const collection = {};
let readings = 0;
while (Object.keys(collection).length < 78) {
  const card = drawTarotCards(random, collection)[0];
  assert.ok(!collection[card]);
  collection[card] = 1;
  readings++;
}
assert.equal(tarotAchievementIds(collection).length, 6);
report.tarot = { flags: tarotAchievementIds(collection), readings, totalCost: readings * TAROT_FEE,
  condition: 'One selected card per yearly reading; 78 readings minimum across one or several lives. Collection persists across lives; reaching it in one life also requires survival.' };
console.log('PASS all six tarot achievements: 78 paid readings, collection persists across lives');
fs.mkdirSync('output', { recursive: true });
fs.writeFileSync('output/activity-achievement-feasibility.json', JSON.stringify(report, null, 2));
