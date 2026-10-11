import assert from "node:assert/strict";
import { getAgeEvents } from "../js/events.js";
import { getEventCategory } from "../js/event-category.js";
import { enrichEverydayRewards } from "../js/everyday-rewards.js";
import { getBaseAgeEvents } from "../js/events.js";
import { createEverydayAdditions } from "../js/everyday-additions.js";
import { rollEverydayLuck, LUCK_NOTES } from "../js/everyday-difficulty.js";

const loss = choice => Object.values(choice.effects ?? {}).some(value => value < 0) || choice.money < 0;
const gain = choice => Object.values(choice.effects ?? {}).some(value => value > 0) || choice.money > 0;
let events = 0, pureLoss = 0, tradeoffs = 0, goodPositions = new Set();
const score = choice => Object.values(choice.effects ?? {}).reduce((sum, value) => sum + value, 0);
// Nhãn lựa chọn do tác giả viết (sự kiện bổ sung lấy từ dữ liệu gốc, chưa cân bằng).
const authoredLabels = new Map();
for (let age = 1; age <= 105; age++) {
  for (const event of getBaseAgeEvents(age, undefined, {}) ?? []) authoredLabels.set(`${age}|${event.title}`, event.choices?.map(c => c.label));
}
for (let age = 1; age <= 105; age++) {
  const pool = getAgeEvents(age);
  // Tuổi 16 là chuỗi khám phá ngành, cố ý xáo lựa chọn mỗi lần (không phải sự kiện thường ngày).
  if (age !== 16) assert.deepEqual(getAgeEvents(age), pool, `Reload changes outcomes at ${age}`);
  for (const event of pool) {
    if (getEventCategory(event) !== "everyday") {
      assert(!event.everydayDifficultyApplied, `Other category was balanced: ${event.title}`);
      continue;
    }
    events++;
    assert(event.automaticResult ? event.choices.length === 1 : [2, 3].includes(event.choices.length), event.title);
    if (event.automaticResult) {
      assert(age >= 1 && age <= 105);
      assert.equal(event.choices[0].label, 'Đồng ý');
      assert.equal(event.choices[0].confirmText, 'Đồng ý');
      assert.equal(event.text, event.choices[0].text);
    }
    const authored = authoredLabels.get(`${age}|${event.title}`);
    if (authored && !event.automaticResult && !event.catalogVersion) assert.deepEqual([...event.choices.map(c => c.label)].sort(), [...authored].sort(), `Authored choices replaced: ${event.title}`);
    if (!event.automaticResult) assert(event.choices.some(gain), `No rewarding action: ${event.title}`);
    assert.deepEqual(enrichEverydayRewards(event, age), event, `Rewards applied twice: ${event.title}`);
    const best = Math.max(...event.choices.map(score));
    if (event.choices.filter(choice => score(choice) === best).length === 1) goodPositions.add(event.choices.findIndex(choice => score(choice) === best));
    for (const choice of event.choices) {
      if (loss(choice)) gain(choice) ? tradeoffs++ : pureLoss++;
      for (const [stat, delta] of Object.entries(choice.effects)) {
        assert(["health", "happiness", "intelligence", "appearance"].includes(stat));
        assert(Number.isFinite(delta) && delta >= (age < 6 ? -3 : -5) && delta <= 4, event.title);
      }
      assert(choice.label && choice.title && choice.text && choice.image && choice.imageFallback);
      assert(!choice.death && !choice.nextStep, `Unexpected ordinary story mechanic: ${event.title}`);
    }
  }
}
assert(events === 495, `Everyday event count changed: ${events}`);
assert(goodPositions.size === 2, "Best action is always in the same position");
for (let age = 1; age <= 105; age++) {
  const pool = getAgeEvents(age).filter(event => getEventCategory(event) === "everyday");
  if ([15, 16, 22, 24, 25, 105].includes(age)) { assert.equal(pool.length, 0); continue; }
  assert.equal(pool.filter(event => event.automaticResult).length, 2, `Passive count at ${age}`);
  assert.equal(pool.filter(event => !event.automaticResult).length, 3, `Interactive count at ${age}`);
}
assert(createEverydayAdditions(30).every(event => !event.choices.some(c => /Một chút lợi|quyết định đáng tiếc/u.test(c.title))),
  "Generic risk actions are no longer injected");

// May rủi: chỉ số liên quan cao thì dễ suôn sẻ; lựa chọn chỉ có mất mát không đổi.
const study = { label: "Học", text: "Tôi học.", effects: { intelligence: 4, health: -2 } };
const great = rollEverydayLuck(study, { intelligence: 50 }, () => 0.1);
assert.deepEqual(great.effects, { intelligence: 6, health: -1 });
assert.equal(great.text, study.text, "Lucky results add no extra line");
const poor = rollEverydayLuck(study, { intelligence: 50 }, () => 0.9);
assert.deepEqual(poor.effects, { intelligence: 2, health: -2 });
assert(poor.text.endsWith(LUCK_NOTES.poor));
assert.equal(rollEverydayLuck(study, { intelligence: 50 }, () => 0.5), study, "Middle roll keeps the authored result");
assert.equal(rollEverydayLuck(study, { intelligence: 100 }, () => 0.3).luck, "great", "High stat widens the lucky range");
assert.equal(rollEverydayLuck(study, { intelligence: 0 }, () => 0.3), study);
assert.equal(rollEverydayLuck(study, { intelligence: 0 }, () => 0.7).luck, "poor", "Low stat widens the unlucky range");
const lossOnly = { label: "Bỏ", text: "x", effects: { health: -3 } };
assert.equal(rollEverydayLuck(lossOnly, {}, () => 0), lossOnly);

const bad = { label: "Bỏ bữa để đọc sách", text: "Tôi đói và mất tập trung.", effects: { health: -2 } };
const badOnly = enrichEverydayRewards({ category: "everyday", title: "Một bữa ăn", choices: [bad] }, 20);
assert(!gain(badOnly.choices[0]), "A negative action gained an automatic bonus");
const special = { category: "special", title: "Chuyện đặc biệt", choices: [bad] };
assert.equal(enrichEverydayRewards(special, 20), special);
const keyStory = getAgeEvents(18).find(event => event.id === "everyday-added-18-1");
assert.equal(keyStory.choices.find(choice => !loss(choice)).effects.health, undefined,
  "The word 'ngăn' was mistaken for 'ăn'");
console.log(`PASS: ${events} everyday events keep their authored actions (${tradeoffs} tradeoffs, ${pureLoss} pure losses); varied best position; luck rules; stable reloads, idempotent rewards and other categories preserved.`);
