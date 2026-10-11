import assert from 'node:assert/strict';
import { vietnamStories, vietnamStoryFallbacks } from '../js/vietnam-story-data.js';
import { createVietnamEverydayEvents, meetsStoryConditions } from '../js/vietnam-stories.js';
import { getAgeEvents } from '../js/events.js';
import { enrichEverydayRewards } from '../js/everyday-rewards.js';

const words = value => value.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
const allowedStats = new Set(['health', 'happiness', 'intelligence', 'appearance']);
const ids = new Set();
const excludedAges = new Set([15, 16, 22, 24, 25, 105]);
let interactive = 0, automatic = 0;
for (const [name, catalog] of [['primary', vietnamStories], ['alternative', vietnamStoryFallbacks]]) {
  assert.equal(Object.keys(catalog).length, 99, name);
  for (let age = 1; age <= 105; age++) {
    if (excludedAges.has(age)) { assert.equal(catalog[age], undefined); continue; }
    const pool = catalog[age];
    assert.equal(pool.length, 5);
    assert.equal(pool.filter(story => story.mode === 'automatic').length, 2);
    assert.equal(pool.filter(story => story.mode === 'choice').length, 3);
    for (const story of pool) {
      assert.equal(story.age, age);
      assert.equal(story.conditions.age, age);
      assert(words(story.text) > 0 && words(story.text) <= 60, `${name}: situation length ${age}: ${story.title}`);
      assert(!/Tôi mời tôi|Rủ tôi cùng|Tình tôi|hai tôi|Hai tôi/u.test(story.text));
      assert(!story.id.startsWith('later-special-'), 'A milestone was copied into the ordinary catalog');
      for (const text of [story.text, ...story.choices.map(c => c.text)]) {
        assert(!/Tôi giữ lại phần đã làm được|Tôi thấy cách này hợp với mình lúc ấy|Tôi chưa nói mình sẽ làm theo cách nào/u.test(text), 'Generic padding remains');
      }
      assert(story.conditions.minimumMoney >= 0);
      if (name === 'primary') {
        assert(!ids.has(story.id), `Duplicate identity ${story.id}`);
        ids.add(story.id);
        story.mode === 'automatic' ? automatic++ : interactive++;
      }
      assert(story.mode === 'automatic' ? story.choices.length === 1 : [2, 3].includes(story.choices.length));
      const seenResults = new Set();
      for (const choice of story.choices) {
        assert(words(choice.label) <= 12, choice.label);
        if (story.mode === 'choice') assert(words(choice.text) > 0 && words(choice.text) <= 55, choice.text);
        assert(!seenResults.has(choice.text), `Identical outcomes: ${age}: ${story.title}`);
        seenResults.add(choice.text);
        for (const [stat, effect] of Object.entries(choice.effects)) {
          assert(allowedStats.has(stat), stat);
          assert(Number.isFinite(effect) && effect >= -5 && effect <= 4, `${age}: ${stat}: ${effect}`);
        }
        assert(choice.money === undefined || Number.isSafeInteger(choice.money));
      }
    }
  }
}
const profiles = [
  { isAlive: true, age: 0, money: 0, health: 10, relatives: [], partner: null, children: [], purchases: [] },
  { isAlive: true, money: 100_000_000, health: 80, relatives: [{id:'father',alive:true},{id:'mother',alive:true}],
    employmentStatus:'employed', careerPath:{id:'programming'}, partner:{id:'partner'}, children:[{id:'child'}], purchases:[{id:'bicycle',name:'Xe đạp'}] },
  { isAlive: true, money: 0, health: 50, employmentStatus:'unemployed', relatives:[{id:'father',alive:false},{id:'mother',alive:false}] },
];
for (const profile of profiles) for (let age = 1; age <= 105; age++) {
  if (excludedAges.has(age)) {
    assert.equal(createVietnamEverydayEvents(age, profile).length, 0);
    assert.equal(getAgeEvents(age, undefined, profile).filter(event => event.catalogVersion).length, 0);
    continue;
  }
  const player = { ...profile, age: age - 1 };
  const pool = createVietnamEverydayEvents(age, player);
  assert.equal(pool.length, 5);
  assert.equal(pool.filter(e => e.automaticResult).length, 2);
  assert.deepEqual(createVietnamEverydayEvents(age, player), pool, 'Reload changes the pool');
  for (const event of pool) {
    assert(meetsStoryConditions(event, player), `${age}: ineligible ${event.title}`);
    assert.deepEqual(enrichEverydayRewards(event, age), event, 'An authored reward was rewritten');
    for (const choice of event.choices) assert((choice.money ?? 0) + player.money >= 0, 'Unaffordable purchase');
  }
  assert.equal(getAgeEvents(age, undefined, player).filter(event => event.catalogVersion).length, 5);
}
assert.equal(createVietnamEverydayEvents(20, {isAlive:false}).length, 0);
assert(getAgeEvents(16).some(event => event.kind === 'career-spark'));
assert.equal(getAgeEvents(105)[0].specialId, 'later-105');
console.log(`PASS: ${ids.size} stories (${interactive} interactive / ${automatic} automatic); lengths, distinct branches, supported stats, 297 state/age combinations, affordability and reserved milestones.`);
