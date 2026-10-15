import assert from 'node:assert/strict';
import {
  createDetectiveCase, candidatesOf, describeClue, clearingClue, detectiveTiers, detectiveScenes, describeMismatch,
  ensureBoard, takeOffer, getOfferBlocker, investigate, hoursLeft, baseRewardOf, accuse, detectiveAchievementIds,
  detectiveOf, boardTiers, BOARD_SIZE, MAX_EXTRA_HOURS, matchesClue, sourceOf,
} from '../js/leisure/detective-data.js';

import { evidenceNoteOf, setEvidenceNote, notedReasons, solutionSteps, detectiveBriefOf } from '../js/leisure/detective-reasoning.js';

const observedPatterns = { either: new Set(), xor: new Set() };
 
for (const type of ['either', 'xor']) {
  for (const [a, b] of [[false, false], [false, true], [true, false], [true, true]]) {
    const suspect = { attrs: { bag: a ? 0 : 1, route: b ? 0 : 1 } };
    const clue = { type, terms: [{ attr: 'bag', value: 0 }, { attr: 'route', value: 0 }] };
    assert.equal(matchesClue(suspect, clue, []), type === 'either' ? a || b : a !== b);
  }
}

 
function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}
const subsets = (size, n) => {
  const out = [];
  const walk = (start, head) => {
    if (head.length === size) return void out.push(head);
    for (let i = start; i < n; i++) walk(i + 1, [...head, i]);
  };
  walk(0, []);
  return out;
};

for (const tier of detectiveTiers) {
  const random = seeded(tier.id + 7);
  for (let round = 0; round < 300; round++) {
    const file = createDetectiveCase(tier.id, random);
    const n = file.clues.length;
    assert.equal(file.suspects.length, tier.suspects);
    assert.equal(n, tier.attrs.length + 1, 'Một nguồn thời gian và một nguồn cho mỗi đặc điểm');
    assert.deepEqual(candidatesOf(file), [file.culprit], 'Toàn bộ manh mối chỉ ra đúng một người');
    const compounds = file.clues.filter(clue => clue.terms);
    assert.equal(compounds.length, tier.id);
    if (tier.id) assert.ok(candidatesOf(file, file.clues.flatMap((clue, index) => clue.terms ? [] : [index])).length > 1,
      'Không thể bỏ qua manh mối kết hợp rồi vẫn giải được vụ nâng cao');
    for (const clue of compounds) {
      observedPatterns[clue.type].add(clue.terms.map(term => Number(file.suspects[file.culprit].attrs[term.attr] === term.value)).join(''));
      assert.ok(sourceOf(clue).tells.length > 20);
    }
    assert.equal(detectiveBriefOf(file).verified.length, 3);
    assert.deepEqual(solutionSteps({ ...file, revealed: [] }), [], 'Không lộ chuỗi lời giải trước khi nộp');
    const steps = solutionSteps({ ...file, revealed: [], result: {} });
    assert.equal(steps.length, tier.hours, 'Lời giải dùng chuỗi ngắn nhất đủ chứng minh');
    assert.deepEqual(steps.at(-1).remaining, [file.culprit]);
    assert.ok(steps.every(step => !step.removed.includes(file.culprit) && step.removed.length > 0));
    for (let size = 1; size < tier.hours; size++) {
      assert.ok(subsets(size, n).every((set) => candidatesOf(file, set).length > 1), 'Ít giờ hơn mức giao thì chưa chứng minh được');
    }
    const fitting = subsets(tier.hours, n).filter((set) => candidatesOf(file, set).length === 1).length;
    assert.ok(fitting > 0 && fitting < subsets(tier.hours, n).length, 'Chọn khéo thì vừa đủ giờ, chọn bừa có thể thiếu');
    const negatives = file.clues.filter((clue) => clue.type === 'not').length;
    assert.ok(negatives >= tier.minNegative && negatives <= tier.maxNegative);
    assert.ok(file.suspects.some((suspect, index) => clearingClue(file, index, [0]) === 0), 'Mốc thời gian loại được ít nhất một người');
    assert.equal(new Set(file.suspects.map((s) => s.name)).size, tier.suspects, 'Không trùng tên');
    for (const clue of file.clues) assert.ok(describeClue(file, clue).length > 20);
    file.suspects.forEach((suspect, index) => {
      assert.ok(suspect.leave > suspect.arrive && suspect.leave <= 18 * 60);
      const clue = clearingClue(file, index);
      assert.equal(clue === -1, index === file.culprit);
      if (clue !== -1) assert.ok(describeMismatch(file, index, clue).length > 3);
    });
    assert.deepEqual(JSON.parse(JSON.stringify(file)), file, 'Hồ sơ lưu được bằng JSON');
  }
}
assert.deepEqual([...observedPatterns.either].sort(), ['01', '10', '11'], 'Không đoán được đáp án theo vế luôn đúng');
assert.deepEqual([...observedPatterns.xor].sort(), ['01', '10']);
assert.equal(detectiveScenes.length, 12);
assert.ok(detectiveScenes.every((scene) => scene.roles.length >= detectiveTiers.at(-1).suspects));
assert.deepEqual(boardTiers(0), [0, 0, 0]);
assert.deepEqual(boardTiers(4), [0, 1, 1]);
assert.deepEqual(boardTiers(12), [0, 1, 2]);

 
const random = seeded(99);
const young = { age: 17, money: 0, happiness: 50, intelligence: 50, isAlive: true };
assert.equal(ensureBoard(young, random), false, 'Dưới 18 tuổi chưa có bảng hồ sơ');
const player = { age: 25, money: 0, happiness: 50, intelligence: 50, isAlive: true };
assert.equal(ensureBoard(player, random), true);
assert.equal(ensureBoard(player, random), false, 'Mỗi năm chỉ dựng bảng một lần');
assert.equal(player.detective.board.offers.length, BOARD_SIZE);
assert.equal(new Set(player.detective.board.offers.map((offer) => offer.file.scene)).size, BOARD_SIZE, 'Bảng không trùng bối cảnh');

const solveWith = (file) => {
   
  for (let clue = 0; clue < file.clues.length && candidatesOf(file, file.revealed).length > 1; clue++) investigate(player, clue);
  return Object.fromEntries(file.suspects.map((_, index) => [index, clearingClue(file, index)]).filter(([index]) => Number(index) !== file.culprit));
};

let file = takeOffer(player, 0);
assert.equal(file.hours, detectiveTiers[0].hours);
const notesSnapshot = JSON.stringify(file);
assert.equal(setEvidenceNote(file, 0, 0, 'conflict'), false, 'Chưa mở nguồn thì không ghi chú được');
assert.equal(JSON.stringify(file), notesSnapshot);
investigate(player, 0);
const hoursBeforeNote = hoursLeft(file);
assert.equal(setEvidenceNote(file, 0, 0, 'conflict'), true);
assert.equal(evidenceNoteOf(JSON.parse(JSON.stringify(file)), 0, 0), 'conflict', 'Ghi chú lưu qua JSON');
assert.equal(hoursLeft(file), hoursBeforeNote, 'Ghi chú không dùng giờ');
assert.equal(notedReasons(file, 1)[0], 0, 'Kết luận lấy căn cứ từ ghi chú, chưa tự kiểm đúng sai');
assert.equal(setEvidenceNote(file, 0, 0, 'unknown'), true);
assert.equal(evidenceNoteOf(file, 0, 0), 'unknown');
assert.equal(setEvidenceNote(file, 999, 0, 'fits'), false);
assert.equal(setEvidenceNote(file, 0, 999, 'fits'), false);
assert.equal(setEvidenceNote(file, 0, 0, 'invalid'), false);
assert.ok(getOfferBlocker(player, 1).includes('khép hồ sơ'), 'Không mở hai hồ sơ cùng lúc');
assert.equal(takeOffer(player, 0), null);
let reasons = solveWith(file);
const extra = file.extraHours;
assert.equal(baseRewardOf(file), Math.round(2_000_000 * (1 - 0.2 * extra) / 10_000) * 10_000);
let result = accuse(player, file.culprit, reasons);
assert.equal(result.correct, true);
assert.equal(result.unproven, 0);
assert.equal(player.money, baseRewardOf(file));
assert.equal(player.detective.reputation, 1);
assert.equal(player.detective.streak, 1);
assert.equal(accuse(player, file.culprit, reasons), null, 'Không nhận thưởng hai lần');
assert.ok(detectiveAchievementIds(player.detective, file).includes('detective-first'));

 
player.detective.current = null;
file = takeOffer(player, 1);
investigate(player, 0);
const before = player.money;
result = accuse(player, file.culprit, {});
assert.equal(result.correct, true);
assert.equal(result.unproven, file.suspects.length - 1);
assert.equal(result.reward, Math.round(baseRewardOf(file) * 0.25 / 10_000) * 10_000);
assert.equal(player.money - before, result.reward);
assert.equal(result.reputation, 0);
assert.equal(player.detective.streak, 0);

 
player.detective.current = null;
file = takeOffer(player, 2);
const unrevealed = Object.fromEntries(file.suspects.map((_, index) => [index, clearingClue(file, index)])
  .filter(([index]) => index !== file.culprit));
assert.equal(file.revealed.length, 0);
result = accuse(player, file.culprit, unrevealed);
assert.equal(result.unproven, file.suspects.length - 1);

 
player.age = 26;
player.intelligence = 85;
ensureBoard(player, random);
player.detective.current = null;
file = takeOffer(player, 0);
assert.equal(file.hours, detectiveTiers[0].hours + 1, 'Trí tuệ cao có thêm 1 giờ');
for (let clue = 0; clue < file.clues.length; clue++) investigate(player, clue);
assert.equal(file.revealed.length, Math.min(file.clues.length, file.hours + MAX_EXTRA_HOURS));
assert.equal(hoursLeft(file), 0);
assert.equal(file.extraHours, file.revealed.length - file.hours);

 
const wrong = file.suspects.findIndex((_, i) => i !== file.culprit);
const happiness = player.happiness;
result = accuse(player, wrong, {});
assert.equal(result.correct, false);
assert.equal(player.happiness, happiness - 3);
assert.equal(player.detective.reputation, 0, 'Danh tiếng không âm');
assert.equal(player.detective.failed, 1);

 
const old = { age: 30, detective: { reputation: 2, solved: 1, failed: 0, streak: 1, current: { clues: [], crossed: [], hinted: [] } } };
assert.equal(detectiveOf(old).current, null);
 
const legacyFile = {
  tier: 1, scene: 'cafe-wallet', window: [900, 930], revealed: [0, 1], crossed: [], result: null,
  suspects: [{ name: 'An', arrive: 890, leave: 940, attrs: { shoes: 0, vehicle: 1, bag: 2, outfit: 1 } }],
  clues: [{ type: 'time' }, { type: 'not', attr: 'shoes', value: 1 }],
};
assert.deepEqual(candidatesOf(legacyFile), [0]);
assert.ok(describeClue(legacyFile, legacyFile.clues[1]).includes('không phải'));
assert.equal(sourceOf(legacyFile.clues[1]).label, 'Khám hiện trường');
assert.equal(setEvidenceNote(legacyFile, 0, 1, 'fits'), true);
assert.equal(evidenceNoteOf(JSON.parse(JSON.stringify(legacyFile)), 0, 1), 'fits');
assert.equal(setEvidenceNote({ ...legacyFile, result: {} }, 0, 1, 'conflict'), false, 'Khép vụ thì không sửa ghi chú');
console.log('PASS detective: 900 unique solvable cases; compound truth tables and necessary evidence; 12 scenes; persistent manual notes; proof chains; rewards, penalties and legacy saves.');
