import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { getShopItem, getSellPrice } from '../js/leisure/shop.js';
import { groupAssets, summarizeAssets } from '../js/core/inheritance.js';
import { settleEstate, applyEstateOnce, validateWill, normalizeWill, listEstateAssets, allocationFor, COMMUNITY_KEY } from '../js/core/inheritance.js';
import { canOfferSuccession, buildSuccessor, describeHeir, describeTwoLives, getLineage, listHeirCandidates } from '../js/core/succession.js';
import { hasPendingSuccession, canContinue } from '../js/core/ticket-store.js';
import { buildLifeSummary } from '../js/core/life-archive.js';
import { completeLifeYear } from '../js/relationships/family.js';
import { createLifeStoryEvents, isLifeStoryEligible } from '../js/events/life-stories.js';
import { lineageStories } from '../js/events/life-stories/lineage-stories.js';
import { getDreamStory, getDreamChoiceUpdates, normalizeDreams } from '../js/events/dreams.js';
import { seedSentence } from '../js/events/dream-roots.js';
import { achievements, meetsAchievement, trackInferredSavings, inferredMoney } from '../js/achievements/achievements-data.js';
import { knownFamilyHistory } from '../js/core/succession.js';
import { createMarriageEvent, createAdmirer, getDatingUpdates, getMarriageUpdates } from '../js/relationships/relationships.js';
import { createChildProposalEvent, migrateChildcareDebt, getChildAge } from '../js/relationships/family.js';
import { createRelativeDeathEvent } from '../js/relationships/family-members.js';
import { collectStoryLoanYear } from '../js/core/story-transactions.js';
import { lifeStoryCatalog } from '../js/events/life-stories/index.js';

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log(`PASS ${name}`); };
const spouse = { id: 'p1', name: 'Lê Minh Thư', gender: 'female', relationship: 80, ageAtMeeting: 26, metAtAge: 27 };
// Children joined at the given founder age: at founder age 80, kid joined at 32 is 48.
const kid = (id, joinedAtAge, extra = {}) => ({ id, name: `Phạm ${id.toUpperCase()} Bảo`, gender: 'male', initialAge: 0, joinedAtAge,
  relationship: 75, coParent: { id: 'p1', name: 'Lê Minh Thư' }, ...extra });
const founder = (extra = {}) => ({ ...createInitialState().player, name: 'Nguyễn Quốc Dân', gender: 'male', province: 'Huế', age: 80,
  lifeSeed: 4242, lifeId: 'life-founder', money: 900_000_000, health: 20, happiness: 60, intelligence: 60, appearance: 50,
  partner: spouse, marriedAtAge: 28, children: [kid('a', 32), kid('b', 35)], storyFlags: ['xay_cau', 'seen:ls59-ky-niem-60'],
  relatives: [{ id: 'father', role: 'Bố', name: 'Nguyễn Văn Cả', alive: false, ageAtPlayerBirth: 25 }], ...extra });
const home = { uid: 'house-1', id: 'house', boughtAtAge: 50 };
const car = { uid: 'car-1', id: getShopItemId('vehicles'), boughtAtAge: 70 };
function getShopItemId(group) { return ['motorbike', 'car', 'big-bike'].find(id => getShopItem(id)?.group === group) ?? 'motorbike'; }
const value = entry => getSellPrice(getShopItem(entry.id), entry, 80);
const conserved = (player, result) => {
  const assetsIn = listEstateAssets(player).reduce((sum, asset) => sum + asset.value, 0);
  const out = result.allocations.reduce((sum, item) => sum + item.cash + item.assets.reduce((total, asset) => total + asset.value, 0), 0);
  assert.equal(out + result.debtPaid, Math.max(0, player.money) + assetsIn, 'không tạo thêm hay làm mất tiền');
};
const dead = (extra = {}) => ({ ...founder(extra), isAlive: false });

test('1. Không di chúc: chia đều bạn đời và các con, tài sản cân theo giá trị', () => {
  const player = founder({ purchases: [home, car] });
  const result = settleEstate(player, null);
  assert.equal(result.usedWill, false);
  const cash = ['partner:p1', 'child:a', 'child:b'].map(key => allocationFor(result, key).cash);
  assert.ok(cash.every(amount => amount >= 300_000_000 - 1000), cash.join());
  assert.equal(cash.reduce((a, b) => a + b, 0), 900_000_000);
  const owners = ['partner:p1', 'child:a', 'child:b'].filter(key => allocationFor(result, key).assets.length);
  assert.equal(owners.length, 2, 'hai tài sản không chia nhỏ về hai người khác nhau');
  assert.equal(allocationFor(result, COMMUNITY_KEY)?.cash ?? 0, 0, 'có người thừa kế thì quỹ cộng đồng không nhận phần mặc định');
  conserved(player, result);
});

test('2. Có di chúc: tỷ lệ, phần chưa phân bổ, tài sản chỉ định, lời nhắn', () => {
  const player = founder({ purchases: [home], keepsakes: [{ id: 'k1', name: 'Chiếc đồng hồ cũ', receivedAtAge: 60 }] });
  const will = { shares: { 'child:a': 50, [COMMUNITY_KEY]: 20 }, assets: { 'purchase:house-1': 'child:b' },
    keepsakes: { k1: 'child:a' }, messages: { 'child:a': 'Giữ gìn sức khỏe.' } };
  assert.equal(validateWill(will, player).ok, true);
  assert.equal(validateWill(will, player).unassigned, 30);
  const result = settleEstate(player, will);
  assert.equal(allocationFor(result, 'child:a').cash, 450_000_000 + 90_000_000);
  assert.equal(allocationFor(result, COMMUNITY_KEY).cash, 180_000_000);
  assert.equal(allocationFor(result, 'partner:p1').cash, 90_000_000);
  assert.deepEqual(allocationFor(result, 'child:b').assets.map(asset => asset.key), ['purchase:house-1']);
  assert.equal(allocationFor(result, 'child:a').keepsakes[0].name, 'Chiếc đồng hồ cũ');
  assert.equal(allocationFor(result, 'child:a').message, 'Giữ gìn sức khỏe.');
  conserved(player, result);
});

test('3. Tổng tỷ lệ sai, tài sản không thể chỉ định trùng, dữ liệu hỏng bị loại', () => {
  const player = founder();
  const bad = { shares: { 'child:a': 70, 'child:b': 60 } };
  assert.equal(validateWill(bad, player).ok, false);
  const result = settleEstate(player, bad);
  assert.ok(result.notes.some(note => note.includes('vượt 100%')));
  assert.equal(allocationFor(result, 'child:a').cash, allocationFor(result, 'child:b').cash, 'tỷ lệ sai thì chia mặc định');
  const clean = normalizeWill({ shares: { 'child:a': -5, 'evil key': 10, 'child:b': 10.5 }, assets: { 'purchase:x': 'child:a', 'purchase:x ': 'child:b', bad: 'child:a' } });
  assert.deepEqual(clean.shares, {});
  assert.deepEqual(Object.keys(clean.assets), ['purchase:x'], 'mỗi tài sản chỉ có một người nhận');
});

test('4. Người nhận mất trước, tài sản bán hoặc mua sau khi lập, số dư thay đổi', () => {
  const player = founder({ children: [kid('a', 32, { alive: false }), kid('b', 35)], purchases: [car], money: 500_000_000 });
  const will = { shares: { 'child:a': 40, 'child:b': 10 }, assets: { 'purchase:house-1': 'child:a' }, messages: { 'child:a': 'x' } };
  const result = settleEstate(player, will);
  assert.equal(allocationFor(result, 'child:a'), null, 'người mất không nhận');
  assert.equal(allocationFor(result, 'child:b').cash, 50_000_000 + 225_000_000);
  assert.equal(allocationFor(result, 'partner:p1').cash, 225_000_000);
  assert.ok(result.notes.some(note => note.includes('đã bán')), 'nhà đã bán không được trao');
  assert.equal(result.allocations.reduce((sum, item) => sum + item.assets.length, 0), 1, 'xe mua sau theo quy tắc mặc định');
  conserved(player, result);
});

test('5. Nợ: trả trước khi chia, bán bớt tài sản, phần thiếu khép lại, không chuyển nợ', () => {
  const debtor = founder({ money: -100_000_000, purchases: [home, car],
    homeLoans: [{ id: 'l1', assetUid: 'house-1', outstanding: 200_000_000, principal: 400_000_000 }] });
  const result = settleEstate(debtor, { assets: { 'purchase:house-1': 'child:a' } });
  assert.equal(result.debt, 300_000_000);
  assert.equal(result.debtPaid, 300_000_000);
  assert.equal(result.liquidated[0].key, 'purchase:car-1', 'bán tài sản không chỉ định trước');
  assert.ok(result.allocations.every(item => item.cash >= 0));
  conserved(debtor, result);
  const broke = founder({ money: -5_000_000_000, purchases: [car] });
  const ruined = settleEstate(broke, null);
  assert.ok(ruined.debtWrittenOff > 0 && ruined.allocations.every(item => item.cash === 0 && !item.assets.length));
  assert.ok(ruined.notes.some(note => note.includes('không chuyển sang người nhận')));
});

test('6. Không người thừa kế: vào quỹ cộng đồng; chia đúng một lần', () => {
  const alone = founder({ partner: null, marriedAtAge: null, children: [], purchases: [car] });
  const result = settleEstate(alone, null);
  assert.equal(allocationFor(result, COMMUNITY_KEY).cash, 900_000_000);
  assert.equal(allocationFor(result, COMMUNITY_KEY).assets.length, 1);
  const player = dead({ purchases: [home] });
  const first = applyEstateOnce(player);
  assert.equal(player.money, 0);
  assert.deepEqual(player.purchases, []);
  const reloaded = JSON.parse(JSON.stringify(player));
  const second = applyEstateOnce(reloaded);
  assert.deepEqual(second.allocations, JSON.parse(JSON.stringify(first.allocations)), 'tải lại không chia lần hai');
  assert.equal(second.before.money, 900_000_000, 'tổng kết vẫn biết tài sản lúc mất');
});

test('7. Điều kiện chọn người con', () => {
  assert.equal(canOfferSuccession(dead({ children: [] })), false, 'không có con');
  assert.equal(canOfferSuccession(dead({ children: [kid('a', 70)] })), false, 'con 10 tuổi chưa trưởng thành');
  assert.equal(canOfferSuccession(dead({ children: [kid('a', 32, { alive: false })] })), false, 'con đã mất');
  assert.equal(canOfferSuccession(dead({ children: [kid('a', 75, { adopted: true, initialAge: 13 })] })), true, 'con nuôi 18 tuổi đủ điều kiện');
  assert.equal(canOfferSuccession(founder()), false, 'còn sống thì chưa chọn');
  assert.equal(canOfferSuccession(dead({ lineage: { generation: 1, declined: true } })), false, 'đã chọn kết thúc');
  assert.equal(canOfferSuccession(dead({ lineage: { generation: 2, successionUsed: true } })), false, 'đời con không tiếp quản đời cháu');
  assert.deepEqual(listHeirCandidates(dead()).map(item => item.age), [48, 45]);
});

test('8. Dựng đời con đúng tuổi, đúng phần, đúng quan hệ; tất định khi tải lại', () => {
  const player = dead({ purchases: [home], will: { shares: { 'child:b': 50 }, assets: { 'purchase:house-1': 'child:a' } } });
  applyEstateOnce(player);
  const state = { player, logs: [] };
  const heirA = describeHeir(player, player.children[0]);
  const built = buildSuccessor(state, 'a', { cause: 'Tuổi cao' });
  const again = buildSuccessor(JSON.parse(JSON.stringify(state)), 'a', { cause: 'Tuổi cao' });
  assert.deepEqual(JSON.parse(JSON.stringify(again.player)), JSON.parse(JSON.stringify(built.player)), 'tải lại cho cùng kết quả');
  const heir = built.player;
  assert.equal(heir.age, 48, 'tiếp quản ở tuổi hiện tại');
  assert.equal(heir.isAlive, true);
  assert.equal(heir.name, player.children[0].name);
  assert.equal(heir.money, heir.lineage.inferred.savings + heirA.inheritedCash, 'tiền riêng cộng phần thừa kế của chính mình');
  assert.ok(allocationFor(player.estate, 'child:b').cash > heirA.inheritedCash, 'không dồn toàn bộ di sản cho người được chọn');
  assert.deepEqual(heir.purchases.map(item => item.uid), ['house-1']);
  assert.equal(heir.purchases[0].boughtAtAge, 48 - 30, 'tuổi mua quy đổi, giá bán lại giữ nguyên');
  const dad = heir.relatives.find(item => item.id === 'father');
  const mom = heir.relatives.find(item => item.id === 'mother');
  assert.ok(dad.alive === false && dad.diedAtAge === 48 && dad.ageAtPlayerBirth === 32, 'bố vừa mất lúc con 48 tuổi');
  assert.ok(mom.alive === true && mom.name === 'Lê Minh Thư', 'mẹ còn sống');
  assert.deepEqual(heir.lineage.siblings.map(item => item.id), ['b']);
  assert.ok(['single', 'married'].includes(heir.lineage.inferred.family.status), 'hoàn cảnh gia đình được ghi rõ');
  assert.equal(Boolean(heir.partner), heir.lineage.inferred.family.status === 'married');
  assert.deepEqual(heir.storyFlags, [], 'không mang cờ sự kiện của bố mẹ');
  assert.deepEqual(heir.achievementFlags, {});
  assert.equal(heir.illnesses.length, 0, 'không chép bệnh của bố mẹ');
  assert.equal(heir.careerYears[heir.careerPath.id], 0, 'nghề suy ra không tính năm công tác cho danh hiệu');
  assert.ok(heir.health > 20, 'không mang sức khỏe của bố');
  assert.equal(heir.lineage.generation, 2);
  assert.equal(heir.lineage.successionUsed, true);
  assert.notEqual(heir.lifeId, player.lifeId);
  assert.equal(built.logs.length, 1);
});

test('9. Đời con chạy năm tiếp theo đúng một lần, không thu chi của người đã mất', () => {
  const player = dead({ purchases: [home] });
  applyEstateOnce(player);
  const heir = buildSuccessor({ player, logs: [] }, 'a').player;
  assert.equal(heir.lastSalaryAge, 48, 'năm tiếp quản đã tính xong');
  const before = heir.money;
  const year = completeLifeYear(heir, 49);
  assert.equal(heir.age, 49);
  if (heir.employmentStatus === 'employed') assert.ok(year.salary?.amount > 0, 'lương của chính người con');
  assert.ok(Number.isFinite(heir.money) && heir.money !== before);
  const events = createLifeStoryEvents(49, { ...heir, age: 48 });
  assert.ok(events.length >= 2, 'sự kiện đời thường theo tuổi 49');
  assert.ok(events.every(event => !/^ls0\d|^ls1\d/.test(event.id)), 'không chạy lại tuổi thơ');
});

test('10. Sự kiện liên thế hệ chỉ theo dữ liệu thật', () => {
  const player = dead({ purchases: [home], will: { assets: { 'purchase:house-1': 'child:a' } } });
  applyEstateOnce(player);
  const heir = buildSuccessor({ player, logs: [] }, 'a').player;
  const eligible = id => isLifeStoryEligible(lineageStories.find(story => story.id === id), 49, heir);
  assert.ok(eligible('ls-the-he-don-nha'), 'có nhà thừa kế');
  assert.ok(eligible('ls-the-he-anh-chi-em'), 'có anh chị em');
  assert.ok(eligible('ls-the-he-nguoi-duoc-giup'), 'bố từng góp xây cầu');
  assert.equal(eligible('ls-the-he-viet-chuyen'), heir.children.length === 0, 'chưa có con thì viết chuyện thay vì kể cho con');
  assert.equal(eligible('ls-the-he-ke-cho-con'), heir.children.some(item => getChildAge(item, 49) >= 5 && getChildAge(item, 49) <= 40), 'có con đủ lớn thì kể cho con');
  const lonely = buildSuccessor({ player: (() => { const p = dead({ children: [kid('a', 32)], storyFlags: [] }); applyEstateOnce(p); return p; })(), logs: [] }, 'a').player;
  assert.ok(!isLifeStoryEligible(lineageStories.find(story => story.id === 'ls-the-he-anh-chi-em'), 49, lonely), 'không có anh chị em thì không bịa');
  assert.ok(!isLifeStoryEligible(lineageStories.find(story => story.id === 'ls-the-he-nguoi-duoc-giup'), 49, lonely), 'không có việc tốt ghi nhận');
  assert.ok(!isLifeStoryEligible(lineageStories.find(story => story.id === 'ls-the-he-don-nha'), 49, lonely), 'không nhận nhà');
  assert.ok(lineageStories.every(story => !isLifeStoryEligible(story, 60, founder())), 'đời đầu không gặp sự kiện liên thế hệ');
  const event = createLifeStoryEvents(49, { ...heir, age: 48, storyFlags: [] }).find(item => item.id.startsWith('ls-the-he-'));
  if (event) assert.ok(/bố|ông/.test(event.text) && !/\{/.test(event.text), 'vai trò đúng: người mất là bố');
});

test('11. Mầm ước mơ của người con, hồi tưởng và ước nguyện của bố', () => {
  const player = dead({ children: [kid('a', 32, { dreamSeed: { id: 'music', interest: 'eager', age: 9, text: 'xin bố cho đi học đàn.' } }), kid('b', 35)],
    dreams: { active: 'trip', entries: { trip: { status: 'active', step: 2, scale: 'small', spent: 36_000_000 } } } });
  applyEstateOnce(player);
  const heirA = buildSuccessor({ player, logs: [] }, 'a').player;
  const roots = normalizeDreams(heirA.dreams).roots;
  assert.equal(roots.id, 'music');
  assert.equal(seedSentence(roots, heirA), 'Năm 9 tuổi, tôi xin bố Dân cho đi học đàn.');
  const heirB = buildSuccessor({ player, logs: [] }, 'b', { recall: 'homecoming' }).player;
  assert.equal(normalizeDreams(heirB.dreams).roots.sourceKind, 'recall');
  assert.equal(seedSentence(normalizeDreams(heirB.dreams).roots, heirB), 'Từ nhỏ tôi đã nhớ những mùa hè ở quê.', 'hồi tưởng không nêu sự kiện cụ thể');
  assert.equal(normalizeDreams(heirA.dreams).parentWish.id, 'trip', 'ước nguyện của bố được lưu');
  assert.equal(normalizeDreams(heirA.dreams).entries.trip, undefined, 'không chuyển nguyên chuỗi đang dở của bố');
  const wish = getDreamStory({ ...heirA, age: 49 }, 50);
  assert.equal(wish.dreamStep, 'parent-wish');
  const declined = getDreamChoiceUpdates(heirA, wish.choices.find(choice => choice.dream.action === 'wish-decline').dream, 50);
  assert.equal(declined.dreams.parentWish.status, 'declined');
  assert.equal(declined.dreams.roots.id, 'music', 'từ chối không ghi đè ước mơ riêng, không phạt');
  assert.ok(Object.values(wish.choices.find(choice => choice.dream.action === 'wish-decline').effects).every(value => value >= 0));
  // Accept and finish the continuation before 55: the parent's wish is fulfilled by the child, not by the parent.
  Object.assign(heirA, getDreamChoiceUpdates(heirA, wish.choices.find(choice => choice.dream.action === 'wish-accept').dream, 50));
  let age = 50, guard = 0, journey = null;
  while (normalizeDreams(heirA.dreams).entries.trip.status === 'active' && guard++ < 20) {
    age++;
    const step = getDreamStory({ ...heirA, age: age - 1 }, age);
    if (!step) continue;
    const choice = step.choices.find(item => item.dream.action !== 'wait') ?? step.choices[0];
    if (step.dreamStep === 'journey') journey = choice;
    Object.assign(heirA, getDreamChoiceUpdates(heirA, choice.dream, age, choice.money ?? 0));
  }
  assert.ok(age < 55 && journey.achievementIds.includes('promise-kept'), 'chuỗi tiếp nối chạy trước 55 tuổi và mở thành tựu');
  const finished = normalizeDreams(heirA.dreams);
  assert.ok(finished.entries.trip.summary.includes('Tiếp nối ước nguyện của bố Dân'));
  assert.equal(finished.parentWish.status, 'done');
});

test('12. Thành tựu: thừa kế tính cho sở hữu; flag mới; hai đời; hồ sơ và tổng kết', () => {
  const player = dead({ money: 12_000_000_000, children: [kid('a', 32)], partner: null, marriedAtAge: null });
  applyEstateOnce(player);
  const heir = buildSuccessor({ player, logs: [] }, 'a').player;
  const rich = achievements.find(item => item.rule.kind === 'number' && item.rule.field === 'money' && item.rule.value === 10_000_000_000);
  assert.ok(meetsAchievement(rich, heir), 'sở hữu tiền thừa kế');
  for (const id of ['heir-takeover', 'promise-kept', 'two-lives']) assert.ok(achievements.some(item => item.id === id && item.rule.kind === 'flag'));
  assert.deepEqual(heir.lifeAchievementIds, [], 'tiến độ trong đời tách theo nhân vật');
  const lives = describeTwoLives({ ...heir, age: 70, isAlive: false }, 'Tuổi cao');
  assert.equal(lives.length, 2);
  assert.ok(lives[0].title.includes('Nguyễn Quốc Dân') && lives[1].title.includes(heir.name));
  const summary = buildLifeSummary({ player: { ...heir, age: 70, isAlive: false }, logs: [] }, 'Tuổi cao');
  assert.equal(summary.lineage.generation, 2);
  assert.equal(summary.lineage.founderName, 'Nguyễn Quốc Dân');
});

test('13. Bản lưu: chờ chọn người con, bản cũ, giới hạn hai đời, lượt mới', () => {
  const pending = dead();
  assert.equal(hasPendingSuccession({ player: pending, logs: [] }), false, 'bản lưu cũ đã chết, chưa chia thì không tự chia hồi tố');
  applyEstateOnce(pending);
  assert.equal(hasPendingSuccession({ player: pending, logs: [] }), true);
  assert.equal(canContinue({ player: pending, logs: [] }), true, 'mở lại màn chọn người con sau khi tải');
  assert.equal(hasPendingSuccession({ player: { ...pending, lineage: { declined: true } }, logs: [] }), false);
  const heir = buildSuccessor({ player: pending, logs: [] }, 'a').player;
  const heirDead = { ...heir, isAlive: false };
  applyEstateOnce(heirDead);
  assert.equal(hasPendingSuccession({ player: heirDead, logs: [] }), false, 'không có đời cháu');
  assert.equal(buildSuccessor({ player: heirDead, logs: [] }, 'x'), null);
  assert.equal(getLineage(createInitialState().player).generation, 1, 'lượt mới bắt đầu ở đời đầu');
  assert.equal(createInitialState().player.lineage, undefined);
});

test('14. Hoàn cảnh gia đình người con: theo lịch sử trước, tuổi sau; nhất quán; độc thân vẫn chơi đủ', () => {
  const heirAt = (joinedAtAge, seed, extra = {}) => {
    const player = dead({ lifeSeed: seed, children: [kid('a', joinedAtAge)], ...extra });
    applyEstateOnce(player);
    return buildSuccessor({ player, logs: [] }, 'a').player;
  };
  // Không mặc định ai cũng có hay không có gia đình: tỷ lệ theo tuổi trên nhiều đời.
  const share = (joinedAtAge) => {
    const heirs = Array.from({ length: 300 }, (_, seed) => heirAt(joinedAtAge, seed + 1));
    return heirs.filter(heir => heir.partner).length / heirs.length;
  };
  const young = share(60), adult = share(32);
  assert.ok(young < 0.25, `20 tuổi phần lớn chưa lập gia đình: ${young}`);
  assert.ok(adult > 0.6 && adult < 0.95, `48 tuổi có cả người độc thân lẫn đã cưới: ${adult}`);
  for (let seed = 1; seed <= 300; seed++) {
    const heir = heirAt(32, seed);
    if (!heir.partner) {
      assert.deepEqual(heir.children, [], 'độc thân thì không có con suy ra');
      assert.equal(heir.marriedAtAge, null);
      continue;
    }
    assert.ok(heir.marriedAtAge >= 20 && heir.marriedAtAge <= heir.age, 'tuổi cưới hợp lý');
    assert.ok(heir.partner.metAtAge >= 18 && heir.partner.metAtAge < heir.marriedAtAge, 'quen trước khi cưới');
    assert.ok(heir.partner.inferred === true);
    if (heir.orientation === 'heterosexual') assert.notEqual(heir.partner.gender, heir.gender, 'dị tính thì bạn đời khác giới');
    if (heir.orientation === 'homosexual') assert.equal(heir.partner.gender, heir.gender, 'đồng tính thì bạn đời cùng giới');
    for (const child of heir.children) {
      const bornAt = child.joinedAtAge - child.initialAge;
      assert.ok(bornAt > heir.marriedAtAge && bornAt <= Math.min(heir.age, 45) && child.joinedAtAge <= heir.age, 'con đến sau khi cưới, trong tuổi có con');
      assert.equal(child.adopted, heir.partner.gender === heir.gender, 'cùng giới thì con là con nuôi');
      if (child.adopted) assert.ok(child.initialAge <= 5);
      assert.equal(child.coParent.id, heir.partner.id);
      assert.ok(getChildAge(child, heir.age) >= 0 && child.inferred === true);
    }
    assert.ok(heir.relationshipHistory.every(entry => entry.inferred === true), 'lịch sử suy ra có đánh dấu');
    assert.deepEqual(heir.achievementFlags, {}, 'dữ liệu suy ra không mở thành tựu');
    assert.ok(heir.nextChildProposalAge > heir.age, 'không hỏi chuyện con cái ngay trong năm tiếp quản');
  }
  // Lịch sử đời đầu: sự kiện đám cưới của con tuổi 50 nói về đúng người con đầu hợp tuổi.
  const wedding = dead({ lifeSeed: 9, children: [kid('a', 23), kid('b', 26)], storyFlags: ['seen:ls50-con-cuoi'] });
  assert.deepEqual(knownFamilyHistory(wedding, 'a'), { married: { childAge: 27, founderAge: 50 } });
  assert.deepEqual(knownFamilyHistory(wedding, 'b'), {}, 'sự kiện chỉ nói về một người con');
  for (let seed = 1; seed <= 40; seed++) {
    const heir = heirAt(23, seed, { storyFlags: ['seen:ls50-con-cuoi'] });
    assert.equal(heir.marriedAtAge, 27, 'đã cưới đúng năm sự kiện kể');
    assert.equal(heir.lineage.inferred.family.source, 'history');
  }
  const grand = dead({ lifeSeed: 3, children: [kid('a', 25)], storyFlags: ['seen:ls68-chat-nho'] });
  assert.ok(knownFamilyHistory(grand, 'a').grandchild, 'sự kiện cháu ở xa nói về người con này');
  for (let seed = 1; seed <= 40; seed++) {
    const heir = heirAt(25, seed, { storyFlags: ['seen:ls68-chat-nho'] });
    assert.ok(heir.partner && heir.children.length >= 1, 'đã có cháu thì người con có con');
    assert.ok(getChildAge(heir.children[0], 55 - 12 + 12) >= 0);
    const first = heir.children[0];
    assert.ok(first.joinedAtAge <= 43, 'đứa cháu đã ở trong nhà lúc sự kiện kể');
    const firstAgeAtFounder68 = 43 - (first.joinedAtAge - first.initialAge);
    assert.ok(firstAgeAtFounder68 >= 3 && firstAgeAtFounder68 <= 6, 'đứa cháu còn nhỏ đúng lúc sự kiện kể');
  }
  // Xu hướng tính dục ngẫu nhiên đều giữa bốn lựa chọn, cố định theo đời và người con.
  const orientations = {};
  for (let seed = 1; seed <= 400; seed++) { const heir = heirAt(32, seed); orientations[heir.orientation] = (orientations[heir.orientation] ?? 0) + 1; }
  assert.deepEqual(Object.keys(orientations).sort(), ['bisexual', 'heterosexual', 'homosexual', 'pansexual']);
  assert.ok(Object.values(orientations).every(count => count > 60 && count < 140), `phân bố đều: ${JSON.stringify(orientations)}`);
  assert.equal(heirAt(32, 9).orientation, heirAt(32, 9).orientation, 'tải lại cùng xu hướng');
  // Lưu một lần: tải lại không suy ra lại.
  const once = heirAt(32, 77);
  assert.deepEqual(JSON.parse(JSON.stringify(once)), JSON.parse(JSON.stringify(heirAt(32, 77))));
  // Người con độc thân vẫn lập gia đình được qua gameplay: hẹn hò, hỏi cưới, hỏi chuyện con cái.
  let single = null;
  for (let seed = 1; !single; seed++) { const heir = heirAt(32, seed); if (!heir.partner) single = heir; }
  const random = () => 0.3;
  const person = createAdmirer(single, single.age, random);
  Object.assign(single, getDatingUpdates(single, person, single.age));
  assert.equal(single.partner?.id, person.id, 'bắt đầu hẹn hò được');
  const proposal = createMarriageEvent(single, single.age + 5);
  assert.ok(proposal, 'được hỏi cưới sau 5 năm');
  Object.assign(single, getMarriageUpdates(single, person, single.age + 5, 'accept'));
  assert.ok(createChildProposalEvent(single, single.age + 10), 'được hỏi chuyện có con');
  for (let age = 49; age <= 52; age++) completeLifeYear(heirAt(32, 5), age);
});

test('15. Nợ thật, khoản cho vay và khoản hứa trả sau khi người chơi qua đời', () => {
  // Nợ nuôi con kiểu cũ còn treo được trả từ di sản; đã chuyển vào ví thì không trừ lần hai.
  const legacy = dead({ money: 100_000_000, childcareDebt: 30_000_000, will: null });
  assert.equal(settleEstate(legacy).debt, 30_000_000);
  const migrated = dead({ money: 100_000_000, childcareDebt: 30_000_000 });
  migrateChildcareDebt(migrated);
  assert.equal(settleEstate(migrated).debt, 0, 'đã chuyển vào ví thì chỉ còn số dư');
  assert.equal(settleEstate(migrated).totalCash, 70_000_000);
  // Lời kể có nhắc chuyện vay mà không có hợp đồng: không thành nợ.
  const narrative = dead({ storyFlags: ['cho_anh_ho_vay', 'vay_tien_cuoi', 'seen:ls-cousin-repayment'] });
  assert.equal(settleEstate(narrative).debt, 0);
  // Khoản cho vay có lịch trả: dừng khi người cho vay mất, không chuyển cho người con.
  const lender = dead({ storyLoans: [{ id: 'tu', principal: 30_000_000, outstanding: 20_000_000, lentAtAge: 76, repaymentYears: 3, lastRepaidAge: 79, amountRepaid: 10_000_000 },
    { id: 'cousin', principal: 50_000_000, outstanding: 50_000_000, lentAtAge: 40 }], storyFlags: ['cho_anh_ho_vay'],
    lotteryTickets: [{ type: 'kien-thiet', number: '123456', age: 80 }] });
  const moneyBefore = lender.money;
  const estate = applyEstateOnce(lender);
  assert.equal(estate.totalCash, moneyBefore, 'khoản chưa thu không thành tiền chia');
  assert.deepEqual(estate.receivables.map(item => item.outstanding), [20_000_000, 50_000_000]);
  assert.ok(estate.notes.some(note => note.includes('Khoản cho vay chưa thu 70.000.000')));
  assert.ok(estate.notes.some(note => note.includes('vé số')));
  assert.equal(collectStoryLoanYear(lender, 81), null, 'không cộng tiền trả nợ cho người đã mất');
  assert.equal(lender.money, 0);
  assert.equal(estate.before.storyLoans.length, 2, 'tổng kết vẫn biết khoản cho vay lúc mất');
  const heir = buildSuccessor({ player: lender, logs: [] }, 'a').player;
  assert.deepEqual(heir.storyLoans ?? [], [], 'người con không nhận khoản cho vay hay nghĩa vụ của bố mẹ');
  assert.deepEqual(heir.homeLoans ?? [], []);
  assert.ok(heir.money >= 0, 'không nhận nợ');
  const repayment = lifeStoryCatalog.find(story => story.id === 'ls-cousin-repayment');
  assert.equal(isLifeStoryEligible(repayment, 45, { ...heir, age: 44 }), false, 'sự kiện trả nợ cho bố mẹ không mở ở đời con');
  const year = completeLifeYear(heir, heir.age + 1);
  assert.ok(!JSON.stringify(year ?? {}).includes('khoản cho vay'), 'năm đầu đời con không thu khoản cho vay của bố mẹ');
});

test('16. Bạn đời được ghi trong di chúc mất trước qua luồng mất người thân thật', () => {
  const partner = { ...spouse, ageAtMeeting: 100, metAtAge: 27, condition: 'severe', trackedFrom: 0 };
  const player = founder({ age: 80, partner, will: { shares: { 'partner:p1': 60, 'child:a': 40 } } });
  const event = createRelativeDeathEvent(player, 81, () => 0);
  assert.ok(event?.kind === 'relative-death' && event.title.includes('Lê Minh Thư'), 'bạn đời mất qua sự kiện thật');
  Object.assign(player, event.choices[0].playerUpdates, { age: 81, isAlive: false });
  assert.equal(player.partner, null);
  const check = validateWill(player.will, { ...player, isAlive: true });
  assert.ok(check.warnings.some(text => text.includes('không còn hợp lệ')), 'màn di chúc cảnh báo người nhận đã mất');
  const result = settleEstate(player);
  assert.equal(allocationFor(result, 'partner:p1'), null, 'không chia cho người đã mất');
  assert.ok(result.notes.some(note => note.includes('Người nhận đã mất')));
  const a = allocationFor(result, 'child:a').cash, b = allocationFor(result, 'child:b').cash;
  assert.equal(a + b, result.totalCash, 'toàn bộ tiền vẫn được chia');
  assert.ok(a > b, 'phần 40% của con a giữ nguyên, phần còn lại chia đều');
});

test('17. Tiền tiết kiệm và chỉ số suy ra không mở thành tựu; tiền thừa kế và tiền tự kiếm thì có', () => {
  // Người mất để lại nợ nên người con không nhận tiền: số dư lúc đầu chỉ là tiền suy ra.
  const player = dead({ money: -5_000_000, children: [kid('a', 32)], partner: null, marriedAtAge: null });
  applyEstateOnce(player);
  const heir = buildSuccessor({ player, logs: [] }, 'a').player;
  const moneyRule = value => achievements.find(item => item.rule.kind === 'number' && item.rule.field === 'money' && item.rule.value === value);
  assert.equal(heir.money, heir.lineage.inferred.savings);
  assert.ok(heir.money >= 1_000_000 && !meetsAchievement(moneyRule(1_000_000), heir), 'tiền suy ra không tính');
  heir.money += 2_000_000;
  assert.ok(meetsAchievement(moneyRule(1_000_000), heir), 'tiền tự kiếm thêm thì tính');
  heir.money = 1_000_000;
  trackInferredSavings(heir);
  assert.equal(heir.lineage.inferred.savingsLeft, 1_000_000, 'tiêu bớt thì phần suy ra còn lại giảm theo');
  heir.money = 3_000_000;
  assert.equal(inferredMoney(heir), 1_000_000);
  assert.ok(meetsAchievement(moneyRule(1_000_000), heir), 'kiếm lại sau khi tiêu: chỉ trừ phần suy ra còn lại');
  // Chỉ số suy ra không bao giờ đạt 100.
  for (let seed = 1; seed <= 200; seed++) {
    const founder = dead({ lifeSeed: seed, children: [kid('a', 62, { educationPlan: 'intensive', collegeSupport: true, relationship: 100 })] });
    applyEstateOnce(founder);
    const young = buildSuccessor({ player: founder, logs: [] }, 'a').player;
    for (const stat of ['health', 'intelligence', 'happiness', 'appearance']) {
      assert.ok(!meetsAchievement(achievements.find(item => item.rule.field === stat), young), `${stat} suy ra không mở thành tựu`);
    }
  }
});

test('18. Album gia đình không lặp kỷ vật người con đã nhận; ghi người đang giữ', () => {
  const keepsakes = [{ id: 'watch', name: 'Đồng hồ', receivedAtAge: 40 }, { id: 'pen', name: 'Cây bút', receivedAtAge: 30 }, { id: 'photo', name: 'Tấm ảnh', receivedAtAge: 20 }];
  const player = dead({ keepsakes, will: { keepsakes: { watch: 'child:a', pen: 'child:b' } } });
  applyEstateOnce(player);
  const heir = buildSuccessor({ player, logs: [] }, 'a').player;
  assert.deepEqual(heir.keepsakes.map(item => item.id), ['watch'], 'người con giữ món được trao');
  assert.deepEqual(heir.lineage.familyKeepsakes.map(item => [item.id, item.holder]), [['pen', player.children[1].name], ['photo', null]], 'album không lặp, ghi người đang giữ');
});

test('19. Tài sản giống nhau được gộp khi hiển thị chia thừa kế', () => {
  const cows = ['c1', 'c2', 'c3'].map(uid => ({ uid, id: 'cow', boughtAtAge: 70 }));
  const player = dead({ partner: null, marriedAtAge: null, children: [kid('a', 32)], livestock: cows, purchases: [home] });
  const assets = listEstateAssets(player);
  const groups = groupAssets(assets);
  assert.equal(groups.length, 2, 'ba con cùng loại thành một nhóm');
  assert.equal(groups.find(group => group.units.length === 3).value, assets.filter(asset => asset.kind === 'livestock').reduce((sum, asset) => sum + asset.value, 0));
  const text = summarizeAssets(assets);
  assert.ok(/×3/.test(text) && text.split(', ').length === 2, text);
  applyEstateOnce(player);
  const heir = buildSuccessor({ player, logs: [] }, 'a');
  assert.ok(heir.logs[0].content.includes('×3'), 'nhật ký tiếp quản gộp tài sản');
  assert.equal(heir.player.livestock.length, 3, 'gộp chỉ để hiển thị, vẫn nhận đủ từng con');
});

console.log(`${passed} nhóm kiểm tra di chúc, thừa kế và tiếp nối đời con đều qua.`);
