import assert from "node:assert/strict";
import { getAgeEvents } from "../js/events.js";
import { getEventCategory } from "../js/event-category.js";
import { enrichEverydayRewards } from "../js/everyday-rewards.js";

const loss = choice => Object.values(choice.effects ?? {}).some(value => value < 0) || choice.money < 0;
const gain = choice => Object.values(choice.effects ?? {}).some(value => value > 0) || choice.money > 0;
let events = 0, three = 0, pureLoss = 0, tradeoffs = 0, goodPositions = new Set();
for (let age = 1; age <= 105; age++) {
  const pool = getAgeEvents(age);
  assert.deepEqual(getAgeEvents(age), pool, `Reload changes outcomes at ${age}`);
  for (const event of pool) {
    if (getEventCategory(event) !== "everyday") {
      assert(!event.everydayDifficultyApplied, `Other category was balanced: ${event.title}`);
      continue;
    }
    events++;
    assert([2, 3].includes(event.choices.length), event.title);
    assert(event.choices.some(choice => gain(choice) && !loss(choice)), `No good action: ${event.title}`);
    assert(event.choices.some(loss), `No costly action: ${event.title}`);
    assert.deepEqual(enrichEverydayRewards(event, age), event, `Rewards applied twice: ${event.title}`);
    goodPositions.add(event.choices.findIndex(choice => gain(choice) && !loss(choice)));
    if (event.choices.length === 3) three++;
    for (const choice of event.choices) {
      if (loss(choice)) gain(choice) ? tradeoffs++ : pureLoss++;
      for (const [stat, delta] of Object.entries(choice.effects)) {
        assert(["health", "happiness", "intelligence", "appearance"].includes(stat));
        assert(Number.isFinite(delta) && delta >= -7 && delta <= 3, event.title);
      }
      assert(choice.label && choice.title && choice.text && choice.image && choice.imageFallback);
      assert(!choice.death && !choice.nextStep, `Unexpected ordinary story mechanic: ${event.title}`);
    }
  }
}
assert(events === 488 && three > 0 && pureLoss > 0 && tradeoffs > 0);
assert(goodPositions.size === 3, "Good action is always in the same position");

const bad = { label: "Bỏ bữa để đọc sách", text: "Tôi đói và mất tập trung.", effects: { health: -2 } };
const badOnly = enrichEverydayRewards({ category: "everyday", title: "Một bữa ăn", choices: [bad] }, 20);
assert(!gain(badOnly.choices[0]), "A negative action gained an automatic bonus");
const special = { category: "special", title: "Chuyện đặc biệt", choices: [bad] };
assert.equal(enrichEverydayRewards(special, 20), special);
const keyStory = getAgeEvents(18).find(event => event.id === "everyday-added-18-1");
assert.equal(keyStory.choices.find(choice => !loss(choice)).effects.health, undefined,
  "The word 'ngăn' was mistaken for 'ăn'");
console.log(`PASS: ${events} everyday events, ${three} with three actions, ${tradeoffs} tradeoffs and ${pureLoss} pure losses; stable reloads, idempotent rewards and other categories preserved.`);
