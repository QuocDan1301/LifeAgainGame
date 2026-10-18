import assert from 'node:assert/strict';
import { getChildActions, interactWithChild } from '../js/relationships/child-interactions.js';

const player = { age: 35, money: 1_000_000, happiness: 50, children: [
  { id: 'a', name: 'An', initialAge: 8, joinedAtAge: 35, bond: 98 },
  { id: 'b', name: 'Bình', initialAge: 0, joinedAtAge: 35 },
] };
assert.ok(getChildActions(player, player.children[0]).study);
assert.equal(getChildActions(player, player.children[1]).study, undefined);
assert.ok(interactWithChild(player, 'a', 'talk'));
assert.equal(player.children[0].relationship, 100);
assert.equal(player.children[1].relationship, undefined);
assert.equal(interactWithChild(player, 'a', 'talk'), null);
assert.ok(interactWithChild(player, 'b', 'talk'));
assert.ok(interactWithChild(player, 'a', 'gift'));
assert.equal(player.money, 500_000);
assert.equal(interactWithChild(player, 'missing', 'talk'), null);
player.age++;
player.money = 0;
assert.equal(interactWithChild(player, 'a', 'gift'), null);
assert.ok(interactWithChild(player, 'a', 'talk'));
const restored = JSON.parse(JSON.stringify(player));
assert.equal(interactWithChild(restored, 'a', 'talk'), null);
assert.equal(restored.children[0].memories.length, 3);
player.age = 45;
assert.equal(getChildActions(player, player.children[0]).study, undefined);
player.isAlive = false;
assert.equal(interactWithChild(player, 'a', 'talk'), null);
player.isAlive = true;
player.children[0].alive = false;
assert.equal(interactWithChild(player, 'a', 'talk'), null);
console.log('PASS child interactions: age, legacy bond, limits, separate children, costs, persistence, death.');
