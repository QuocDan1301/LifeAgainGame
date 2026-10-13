import assert from 'node:assert/strict';
import { ARTIFACTS, createAuction, appraiseAuction, bidAuction, withdrawAuction, AUCTION_ROUNDS } from '../js/leisure/auction-core.js';
let seed = 1326;
const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
const seen = new Map(ARTIFACTS.map(item => [item.id, new Set()]));
for (let index = 0; index < 5000; index++) {
  const auction = createAuction(random);
  seen.get(auction.artifact.id).add(auction.authenticity);
  assert.ok(auction.value > 0 && auction.appraisal.low <= auction.appraisal.high);
  assert.ok(auction.bidders.every(bidder => bidder.limit <= bidder.budget));
  assert.equal(appraiseAuction(auction, auction.fee - 1), false);
  assert.equal(appraiseAuction(auction, auction.fee), true);
  assert.equal(appraiseAuction(auction, 1e9), false);
  const original = structuredClone(auction);
  const resumed = JSON.parse(JSON.stringify(auction));
  assert.equal(bidAuction(auction, auction.opening - 1), false);
  assert.deepEqual(auction, original);
  for (let turn = 0; turn < AUCTION_ROUNDS && auction.phase === 'active'; turn++) {
    const strong = turn % 2 === 1;
    assert.equal(bidAuction(auction, 1e9, strong), true);
    assert.equal(bidAuction(resumed, 1e9, strong), true);
    assert.deepEqual(auction, resumed, 'Reload must not change NPC decisions or outcome');
  }
  assert.equal(auction.phase, 'result');
  assert.ok(auction.round <= AUCTION_ROUNDS);
  const result = structuredClone(auction);
  assert.equal(bidAuction(auction, 1e9), false);
  assert.equal(withdrawAuction(auction), false);
  assert.deepEqual(auction, result);
}
assert.ok([...seen.values()].every(outcomes => outcomes.size === 3), 'Every item must be genuine, replica and fake across sessions');
const clueOutcomes = new Map();
for (let i = 0; i < 3000; i++) {
  const sample = createAuction(random);
  if (!clueOutcomes.has(sample.clue)) clueOutcomes.set(sample.clue, new Set());
  clueOutcomes.get(sample.clue).add(sample.authenticity);
}
assert.ok([...clueOutcomes.values()].every(outcomes => outcomes.size === 2), 'Every clue must fit exactly two outcomes, never proving one');
const won = createAuction(random);
won.bidders.forEach(bidder => { bidder.limit = 0; });
assert.equal(bidAuction(won, won.opening), true);
assert.equal(won.winner, 'player');
assert.equal(won.price, won.opening);
const left = createAuction(random);
assert.equal(withdrawAuction(left), true);
assert.equal(left.winner, null);
console.log('PASS auction core: all 12 items have all authenticity outcomes; budgets; appraisal fee and duplication; affordability; six-round limit; deterministic reload; ambiguous clues; win; withdrawal; final-state guards');
