import assert from 'node:assert/strict';
import { achievements, meetsAchievement, recordAchievementFlags } from '../js/achievements/achievements-data.js';
import { activityAchievementIds } from '../js/achievements/activity-achievements.js';
import { tarotCards, tarotAchievementIds } from '../js/leisure/tarot.js';
import { crops, recipes, gardenAchievementIds } from '../js/leisure/garden-data.js';
import { detectiveAchievementIds, rankOf, boardTiers } from '../js/leisure/detective-data.js';

const earned = (id, player) => meetsAchievement(achievements.find(a => a.id === id), player);
const collection = count => Object.fromEntries(tarotCards.slice(0, count).map(c => [c.id, 1]));
assert.equal(new Set(achievements.map(a => a.id)).size, achievements.length);

// Cash milestones must not skip their exact boundary or count missing/invalid money.
for (const [id, amount] of [['money-100m', 1e8], ['billionaire', 1e9], ['money-5b', 5e9], ['money-10b', 1e10]]) {
  for (const money of [undefined, NaN, Infinity, -1, amount - 1]) assert.ok(!earned(id, { money }), id);
  assert.ok(earned(id, { money: amount }), id);
}

// Duplicate draws, invented IDs and repeated dishes cannot substitute for variety.
assert.ok(!tarotAchievementIds({ [tarotCards[0].id]: 100, invented: 100 }).includes('tarot-ten'));
for (const [id, count] of [['tarot-ten', 10], ['tarot-half', 39], ['tarot-all', 78]]) {
  assert.ok(!tarotAchievementIds(collection(count - 1)).includes(id));
  assert.ok(tarotAchievementIds(collection(count)).includes(id));
}
const garden = { harvested: { [crops[0].id]: 100, invented: 100 }, cooked: { [recipes[0].id]: 100, invented: 100 } };
assert.ok(!gardenAchievementIds(garden).includes('garden-five-crops'));
assert.ok(!gardenAchievementIds(garden).includes('cook-three-recipes'));
garden.harvested = Object.fromEntries(crops.slice(0, 4).map(c => [c.id, 1]));
garden.cooked = Object.fromEntries(recipes.slice(0, 2).map(r => [r.id, 1]));
assert.ok(!gardenAchievementIds(garden).includes('garden-five-crops'));
assert.ok(!gardenAchievementIds(garden).includes('cook-three-recipes'));
garden.harvested[crops[4].id] = 1;
garden.cooked[recipes[2].id] = 1;
const player = { garden, achievementFlags: { 'detective-top-rank': true } };
const before = JSON.stringify(player);
const ids = activityAchievementIds(player, collection(39));
assert.equal(JSON.stringify(player), before, 'Restoring progress must not reset seasons or consume actions');
for (const id of ['garden-five-crops', 'cook-three-recipes', 'tarot-ten', 'tarot-half']) assert.ok(ids.includes(id));
recordAchievementFlags({ player }, ids);
const reloaded = JSON.parse(JSON.stringify(player));
assert.ok(earned('detective-top-rank', reloaded), 'Existing unlocked flags remain valid');
for (const id of ids) assert.ok(earned(id, reloaded), id);
const fresh = {};
activityAchievementIds(fresh, {});
assert.deepEqual(fresh, {}, 'Checking achievements must not initialize a garden');
assert.doesNotThrow(() => activityAchievementIds({ garden: {} }, {}));

// Hard cases remain available at ten reputation, with mastery earned later.
assert.ok(boardTiers(10).includes(2));
assert.notEqual(rankOf(10).name, rankOf(24).name);
assert.ok(!detectiveAchievementIds({ solved: 10, streak: 5, reputation: 23 }).includes('detective-top-rank'));
assert.ok(detectiveAchievementIds({ solved: 15, streak: 5, reputation: 24 }).includes('detective-top-rank'));
console.log('PASS achievement balance: cash boundaries; distinct collections; legacy progress restoration; detective access and mastery');
