import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { canAffordChoice } from '../js/core/story-transactions.js';
import { lifeStoryCatalog } from '../js/events/life-stories/index.js';
import { elderLifeStories } from '../js/events/life-stories/elder-everyday.js';
import {
  createLifeStoryEvents, isLifeStoryEligible, pickElderStory, POOL_SIZE, MAX_CHAINS_IN_POOL, ELDER_THEME_GAP,
} from '../js/events/life-stories.js';
import {
  DREAMS, DREAM_IDS, DREAM_LATER_YEARS, getDreamStory, getDreamChoiceUpdates, setDreamPaused, normalizeDreams,
  describeDreams, describeDreamEnding,
} from '../js/events/dreams.js';

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log(`PASS ${name}`); };
const partner = { id: 'p1', name: 'Lê Minh Thư', gender: 'female', relationship: 80 };
const adultChild = { id: 'c1', name: 'Phạm Gia Bảo', initialAge: 0, joinedAtAge: 30, alive: true };
const elder = (extra = {}) => ({ ...createInitialState().player, name: 'Thử Ước Mơ', province: 'Huế', age: 57,
  health: 80, money: 1_000_000_000, storyFlags: [], dreams: null, ...extra });
// Keep the other dreams out of the way so a test follows exactly one of them.
const only = id => ({ active: null, entries: {}, offers: {}, later: Object.fromEntries(DREAM_IDS.filter(other => other !== id).map(other => [other, 999])) });
const apply = (player, story, index, age) => {
  const choice = story.choices[index];
  const updates = getDreamChoiceUpdates(player, choice.dream, age, choice.money ?? 0);
  assert.ok(updates, `${story.id}: "${choice.label}" phải khớp trạng thái`);
  Object.assign(player, updates, { money: player.money + (choice.money ?? 0) });
  if (choice.keepsake && !(player.keepsakes ?? []).some(item => item.id === choice.keepsake.id))
    player.keepsakes = [...(player.keepsakes ?? []), { ...choice.keepsake, receivedAtAge: age }];
  return choice;
};
const byAction = (story, action, extra = () => true) => story.choices.findIndex(choice => choice.dream.action === action && extra(choice));
const nextDream = (player, from) => {
  for (let age = from; age <= 104; age++) {
    const story = getDreamStory(player, age);
    if (story) return { story, age };
  }
  return null;
};

test('1. Đi hết chuỗi cả ba ước mơ, mỗi chuỗi có kết thúc, kỷ vật và dư âm', () => {
  for (const id of DREAM_IDS) {
    const player = elder({ dreams: only(id), partner: id === 'trip' ? partner : null });
    let { story, age } = nextDream(player, 57);
    assert.equal(story.dreamStep, 'spark');
    apply(player, story, byAction(story, 'accept'), age);
    ({ story, age } = nextDream(player, age + 1));
    assert.equal(story.dreamStep, 'prepare');
    const before = player.money;
    apply(player, story, byAction(story, 'prepare', choice => choice.dream.scale === 'large'), age);
    assert.equal(before - player.money, DREAMS[id].scales.large.cost, `${id}: trừ đúng chi phí quy mô lớn`);
    let guard = 0;
    while (player.dreams.entries[id].status === 'active' && guard++ < 5) {
      ({ story, age } = nextDream(player, age + 1));
      apply(player, story, 0, age);
    }
    const entry = player.dreams.entries[id];
    assert.equal(entry.status, 'done');
    assert.equal(entry.step, 3);
    assert.ok(entry.summary.includes(DREAMS[id].name) && entry.summary.includes(DREAMS[id].scales.large.label.toLowerCase()));
    assert.ok(player.keepsakes.some(item => item.id === `dream-${id}`), `${id}: nhận kỷ vật`);
    const echo = nextDream(player, age + 2);
    assert.equal(echo.story.dreamStep, 'echo');
    apply(player, echo.story, 0, echo.age);
    assert.ok(!Array.from({ length: 40 }, (_, i) => getDreamStory(player, echo.age + 1 + i)).some(s => s?.dreamId === id), `${id}: không quay lại sau khi xong`);
  }
});

test('2. Không đủ tiền, vừa đủ tiền và sức khỏe thấp', () => {
  const player = elder({ dreams: only('trip'), partner });
  let { story, age } = nextDream(player, 57);
  apply(player, story, byAction(story, 'accept'), age);
  ({ story, age } = nextDream(player, age + 1));
  const large = story.choices.find(choice => choice.dream.scale === 'large');
  const small = story.choices.find(choice => choice.dream.scale === 'small');
  assert.equal(canAffordChoice({ money: DREAMS.trip.scales.large.cost - 1 }, large), false, 'thiếu 1 đồng thì bị chặn');
  assert.equal(canAffordChoice({ money: DREAMS.trip.scales.large.cost }, large), true, 'vừa đủ thì được chọn');
  assert.equal(canAffordChoice({ money: 0 }, story.choices.find(choice => choice.dream.action === 'wait')), true, 'luôn có cách để dành thêm');
  assert.ok(small && small.money > large.money, 'có quy mô nhỏ rẻ hơn');
  assert.ok(story.choices.some(choice => !(choice.money < 0)));
  for (const [health, scales] of [[40, ['small', 'gentle']], [20, ['near', 'gentle']]]) {
    const weak = elder({ dreams: player.dreams, partner, health });
    const prepare = getDreamStory(weak, age);
    assert.deepEqual(prepare.choices.filter(c => c.dream.scale).map(c => c.dream.scale), scales, `sức khỏe ${health}`);
  }
  const frailHome = elder({ dreams: { ...only('homecoming') }, health: 20 });
  let step = nextDream(frailHome, 57);
  apply(frailHome, step.story, byAction(step.story, 'accept'), step.age);
  step = nextDream(frailHome, step.age + 1);
  assert.ok(step.story.choices.some(choice => choice.dream.scale === 'near'), 'về quê cho người yếu có phương án chở về một ngày');
  apply(frailHome, step.story, byAction(step.story, 'prepare', choice => choice.dream.scale === 'near'), step.age);
  assert.equal(frailHome.dreams.entries.homecoming.spent, 6_000_000, 'quy mô gần tốn 6 triệu');
  while (frailHome.dreams.entries.homecoming.status === 'active') {
    step = nextDream(frailHome, step.age + 1);
    apply(frailHome, step.story, 0, step.age);
  }
  assert.ok(frailHome.dreams.entries.homecoming.summary.includes('chở về một ngày'), 'quy mô nhỏ vẫn hoàn thành với kết quả riêng');
  assert.deepEqual(Object.values(DREAMS).flatMap(dream => Object.values(dream.scales).map(scale => scale.cost)),
    [10, 36, 90, 240, 6, 70, 6, 16, 90].map(million => million * 1_000_000), 'giá các quy mô đã nhân đôi');
});

test('3. Bỏ qua, để sau, tạm gác, tiếp tục và đổi mục tiêu', () => {
  const skip = elder({ dreams: only('music') });
  let step = nextDream(skip, 57);
  assert.equal(step.story.dreamId, 'music');
  for (const story of [step.story]) for (const choice of story.choices.filter(c => ['later', 'decline'].includes(c.dream.action)))
    assert.ok(Object.values(choice.effects ?? {}).every(value => value >= 0) && !(choice.money < 0), 'để sau hoặc bỏ qua không bị phạt');
  apply(skip, step.story, byAction(step.story, 'later'), step.age);
  assert.equal(getDreamStory(skip, step.age + DREAM_LATER_YEARS - 1)?.dreamId, undefined, 'để sau thì chờ vài năm');
  const again = getDreamStory(skip, step.age + DREAM_LATER_YEARS);
  assert.equal(again.title, 'Tiếng đàn nhà bên', 'lần gợi sau dùng tình huống khác');
  const decline = again.choices[byAction(again, 'decline')];
  assert.ok(Object.values(decline.effects).every(value => value >= 0), 'bỏ qua không bị trừ chỉ số');
  apply(skip, again, byAction(again, 'decline'), step.age + DREAM_LATER_YEARS);
  assert.ok(!Array.from({ length: 40 }, (_, i) => getDreamStory(skip, 62 + i)).some(Boolean), 'bỏ qua thì không gợi lại');

  const player = elder({ dreams: { ...only('trip'), later: {} }, partner });
  step = nextDream(player, 57);
  const first = step.story.dreamId;
  apply(player, step.story, byAction(step.story, 'accept'), step.age);
  step = nextDream(player, step.age + 1);
  apply(player, step.story, byAction(step.story, 'prepare'), step.age);
  const spent = player.dreams.entries[first].spent;
  assert.ok(spent > 0);
  player.dreams = setDreamPaused(player, first, true, step.age);
  assert.equal(player.dreams.active, null);
  const spark = nextDream(player, step.age + 1);
  assert.equal(spark.story.dreamStep, 'spark', 'khi tạm gác, ước mơ khác có thể được gợi');
  assert.notEqual(spark.story.dreamId, first);
  apply(player, spark.story, byAction(spark.story, 'accept'), spark.age);
  assert.equal(player.dreams.active, spark.story.dreamId);
  assert.equal(player.dreams.entries[first].status, 'paused');
  assert.equal(player.dreams.entries[first].spent, spent, 'đổi mục tiêu giữ nguyên tiền đã chi, không hoàn tiền');
  player.dreams = setDreamPaused(player, first, false, spark.age);
  assert.equal(player.dreams.active, first, 'tiếp tục ước mơ cũ');
  assert.equal(player.dreams.entries[spark.story.dreamId].status, 'paused', 'ước mơ kia chuyển sang tạm gác');
  assert.equal(getDreamStory(player, spark.age)?.dreamId === first, false, 'tiếp tục thì bước sau mở từ năm sau');
  const resumed = getDreamStory(player, spark.age + 1);
  assert.equal(resumed.dreamStep, 'twist', 'trì hoãn sau khi đã chuẩn bị dẫn tới tình huống mới');
  assert.equal(normalizeDreams(player.dreams).entries[first].delayed, true);
});

test('4. Chống trừ tiền và nhận thưởng lặp', () => {
  const player = elder({ dreams: only('music') });
  let step = nextDream(player, 57);
  apply(player, step.story, byAction(step.story, 'accept'), step.age);
  const accept = step.story.choices[byAction(step.story, 'accept')];
  assert.equal(getDreamChoiceUpdates(player, accept.dream, step.age), null, 'không nhận lại lần nữa');
  step = nextDream(player, step.age + 1);
  const prepare = step.story.choices[byAction(step.story, 'prepare')];
  apply(player, step.story, byAction(step.story, 'prepare'), step.age);
  assert.equal(getDreamChoiceUpdates(player, prepare.dream, step.age, prepare.money), null, 'không trả tiền chuẩn bị hai lần');
  const pending = JSON.parse(JSON.stringify(player));
  do { step = nextDream(player, step.age + 1); apply(player, step.story, 0, step.age); } while (player.dreams.entries.music.status === 'active');
  const journey = step.story.choices[0];
  assert.equal(getDreamChoiceUpdates(player, journey.dream, step.age), null, 'kết thúc không nhận hai lần');
  assert.ok(getDreamChoiceUpdates(pending, journey.dream, step.age), 'cùng lựa chọn ấy hợp lệ với bản lưu trước khi kết thúc');
  assert.equal(player.keepsakes.filter(item => item.id === 'dream-music').length, 1);
  player.dreams = setDreamPaused(player, 'music', true) ?? player.dreams;
  assert.equal(player.dreams.entries.music.status, 'done', 'không tạm gác được ước mơ đã xong');
});

test('5. Có hoặc không có bạn đời, con cái', () => {
  const single = getDreamStory(elder({ dreams: only('trip') }), 57);
  assert.equal(single.title, 'Cuộc gọi của Bình');
  assert.ok(!/\{tenBanDoi\}/u.test(JSON.stringify(single)));
  const couple = getDreamStory(elder({ dreams: only('trip'), partner }), 57);
  assert.ok(couple.text.includes('Thư') && couple.choices[0].dream.companion === 'partner');
  const noKid = getDreamStory(elder({ dreams: only('music') }), 57);
  assert.ok(!noKid.choices.some(choice => choice.dream.companion === 'child'), 'không nhắc con khi không có con');
  const withKid = getDreamStory(elder({ dreams: only('music'), children: [adultChild] }), 57);
  assert.ok(withKid.choices.some(choice => choice.dream.companion === 'child' && choice.label.includes('Bảo')));
  const youngKid = getDreamStory(elder({ dreams: only('music'), children: [{ ...adultChild, joinedAtAge: 50 }] }), 57);
  assert.ok(!youngKid.choices.some(choice => choice.dream.companion === 'child'), 'con nhỏ chưa đủ tuổi thì không rủ học');
  // Partner gone after planning: the trip becomes a solo or friend version, never mentions a missing spouse as present.
  const widowed = elder({ dreams: only('trip'), partner });
  let step = nextDream(widowed, 57);
  apply(widowed, step.story, byAction(step.story, 'accept'), step.age);
  step = nextDream(widowed, step.age + 1);
  apply(widowed, step.story, byAction(step.story, 'prepare'), step.age);
  widowed.partner = null;
  const twist = getDreamStory(widowed, step.age + 1);
  assert.equal(twist.title, 'Chuyến đi còn lại một người');
  apply(widowed, twist, byAction(twist, 'twist', choice => choice.dream.companion === 'solo'), step.age + 1);
  const journey = getDreamStory(widowed, step.age + 2);
  assert.ok(journey.text.includes('một mình') && journey.choices[0].text.startsWith('Tôi'), 'đi một mình thì kể ngôi “tôi”');
});

test('6. Save cũ, nhân vật đã qua 60, lưu/tải giữa chuỗi và cuộc đời mới', () => {
  const legacy = elder({ age: 72 });
  delete legacy.dreams;
  assert.equal(getDreamStory(legacy, 73)?.dreamStep, 'spark', 'save cũ trên 60 vẫn được gợi ước mơ');
  assert.deepEqual(normalizeDreams({ active: 'trip', entries: { trip: { status: 'weird' }, music: 'x' } }), { active: null, entries: {}, later: {}, offers: {}, roots: null, seed: { offers: 0, passed: [], lastAge: null }, parentWish: null });
  const player = elder({ dreams: only('homecoming') });
  let step = nextDream(player, 57);
  apply(player, step.story, byAction(step.story, 'accept'), step.age);
  step = nextDream(player, step.age + 1);
  apply(player, step.story, byAction(step.story, 'prepare'), step.age);
  const reloaded = JSON.parse(JSON.stringify(player));
  assert.deepEqual(getDreamStory(reloaded, step.age + 1)?.id, getDreamStory(player, step.age + 1)?.id, 'tải lại giữ đúng bước');
  assert.equal(reloaded.dreams.entries.homecoming.step, 2);
  assert.equal(createInitialState().player.dreams, null, 'cuộc đời mới bắt đầu không có ước mơ');
  assert.deepEqual(describeDreams(createInitialState().player), []);
  assert.equal(getDreamStory({ ...player, prison: { releaseAge: 99 }, age: 70 }, 70), null, 'đang thụ án thì không có bước ước mơ');
  assert.equal(getDreamStory(elder({ age: 50 }), 54), null, 'trước 55 tuổi chưa gợi');
});

test('7. Sự kiện cũ vẫn xuất hiện như trước; không nhận ước mơ vẫn chơi bình thường', () => {
  const declined = { active: null, later: {}, offers: {}, entries: Object.fromEntries(DREAM_IDS.map(id => [id, { status: 'declined', step: 0 }])) };
  for (let age = 55; age <= 104; age++) {
    for (const dreams of [null, declined]) {
      const player = elder({ age: age - 1, dreams });
      const pool = createLifeStoryEvents(age, player);
      const oldIds = new Set(lifeStoryCatalog.map(story => story.id));
      const old = pool.filter(event => oldIds.has(event.id));
      // Same algorithm as before the change: chains first, then rotated fixed stories up to POOL_SIZE.
      const eligible = lifeStoryCatalog.filter(story => isLifeStoryEligible(story, age, player));
      const expected = Math.min(POOL_SIZE, Math.min(MAX_CHAINS_IN_POOL, eligible.filter(s => Array.isArray(s.ages)).length) + eligible.filter(s => !Array.isArray(s.ages)).length);
      assert.equal(old.length, expected, `tuổi ${age}: giữ nguyên số chỗ của sự kiện cũ`);
      if (dreams === declined) assert.ok(!pool.some(event => event.dreamId), `tuổi ${age}: bỏ qua hết thì không còn bước ước mơ`);
      assert.ok(pool.filter(event => !event.dreamId).length >= 2);
    }
  }
});

test('8. Điều kiện và hiệu ứng của 24+ sự kiện đời thường mới', () => {
  const bands = [[55, 64], [65, 74], [75, 104]].map(([from, to]) => elderLifeStories.filter(story => !story.requires && story.ages[0] >= from && story.ages[0] <= to).length);
  assert.ok(bands.every(count => count >= 8), `phân bố theo nhóm tuổi: ${bands.join('/')}`);
  assert.ok(elderLifeStories.length >= 24);
  for (const story of elderLifeStories) {
    const raw = JSON.stringify(story);
    if (raw.includes('{tenCon}')) assert.ok(story.needs?.includes('children') && story.childAge, `${story.id}: nhắc con phải cần con`);
    if (raw.includes('{tenBanDoi}')) assert.ok(story.needs?.some(need => ['partner', 'married'].includes(need)), `${story.id}: nhắc bạn đời phải cần bạn đời`);
    assert.ok(story.choices.some(choice => !(choice.money < 0)), `${story.id}: luôn có lựa chọn không tốn tiền`);
    assert.ok(!story.minMoney, `${story.id}: không mặc định người chơi phải giàu`);
    const effects = story.choices.map(choice => JSON.stringify([choice.money ?? 0, choice.effects]));
    assert.equal(new Set(effects).size, story.choices.length, `${story.id}: mỗi lựa chọn có kết quả riêng`);
  }
  const lonely = elder({ age: 69, partner: null, children: [], health: 20 });
  const hearty = elder({ age: 69, partner, marriedAtAge: 30, children: [adultChild], health: 80 });
  const ids = player => elderLifeStories.filter(story => isLifeStoryEligible(story, 70, player)).map(story => story.id);
  assert.ok(ids(lonely).length >= 6, 'người độc thân, không con, sức yếu vẫn có đủ sự kiện');
  assert.ok(!ids(lonely).some(id => ['le-gio-ngu-khac-nhau', 'le-giu-meo-giup-con'].includes(id)));
  assert.ok(ids(hearty).includes('le-gio-ngu-khac-nhau') && ids(hearty).includes('le-giu-meo-giup-con'));
  assert.ok(!ids(hearty).includes('le-ban-moi-duong-sinh'), 'sự kiện dành cho người độc thân không tới người có đôi');
  const recent = elder({ age: 60, elderThemes: [{ theme: 'ban-be', age: 60 }] });
  for (let age = 61; age < 61 + ELDER_THEME_GAP - 1; age++) assert.notEqual(pickElderStory(age, recent)?.theme, 'ban-be', 'không lặp chủ đề ở năm gần nhau');
  const event = createLifeStoryEvents(61, elder({ age: 60 })).find(e => elderLifeStories.some(s => s.id === e.id));
  assert.ok(event.choices[0].playerUpdates.elderThemes.at(-1).age === 61, 'ghi lại chủ đề đã gặp');
  assert.ok(event.choices[0].playerUpdates.storyFlags.includes(`seen:${event.id}`), 'sự kiện mới chỉ gặp một lần');
});

test('9. Kỷ vật, hồi tưởng và tổng kết đúng với lựa chọn', () => {
  const player = elder({ dreams: only('trip') });
  let step = nextDream(player, 57);
  apply(player, step.story, byAction(step.story, 'accept'), step.age);
  step = nextDream(player, step.age + 1);
  apply(player, step.story, byAction(step.story, 'prepare', choice => choice.dream.scale === 'small'), step.age);
  do { step = nextDream(player, step.age + 1); } while (step.story.dreamStep !== 'journey' && apply(player, step.story, 0, step.age));
  const market = byAction(step.story, 'journey', choice => choice.dream.outcome.includes('phiên chợ'));
  apply(player, step.story, market, step.age);
  const keepsake = player.keepsakes.find(item => item.id === 'dream-trip');
  assert.ok(keepsake.description.includes('phiên chợ') && keepsake.description.includes('cùng Bình'));
  const ending = describeDreamEnding(player).join('\n');
  assert.ok(ending.includes('Chuyến đi đã hẹn cùng Bình') && ending.includes('chuyến một tuần trong nước') && ending.includes('phiên chợ'));
  const echo = nextDream(player, step.age + 2).story;
  assert.ok(echo.text.includes('phiên chợ'), 'hồi tưởng nhắc lại đúng kết quả');
  const halfway = elder({ dreams: only('music') });
  step = nextDream(halfway, 57);
  apply(halfway, step.story, byAction(step.story, 'accept'), step.age);
  halfway.dreams = setDreamPaused(halfway, 'music', true, step.age);
  assert.ok(describeDreamEnding(halfway)[0].includes('dừng ở bước 1/3') && describeDreamEnding(halfway)[0].includes('tạm gác'));
});

test('10. Tối đa một bước mỗi năm và đúng thứ tự', () => {
  for (const id of DREAM_IDS) {
    const player = elder({ dreams: only(id) });
    let { story, age } = nextDream(player, 57);
    apply(player, story, byAction(story, 'accept'), age);
    assert.equal(getDreamStory(player, age), null, `${id}: cùng năm không có bước thứ hai`);
    const order = ['spark'];
    while (player.dreams.entries[id].status === 'active') {
      const next = nextDream(player, age + 1);
      assert.ok(next.age > age);
      ({ story, age } = next);
      order.push(story.dreamStep);
      apply(player, story, byAction(story, story.choices[0].dream.action === 'wait' ? 'prepare' : story.choices[0].dream.action), age);
      assert.equal(getDreamStory(player, age)?.dreamId === id && getDreamStory(player, age).dreamStep !== 'echo', false);
    }
    assert.equal(order[1], 'prepare');
    assert.equal(order.at(-1), 'journey');
    assert.ok(order.length >= 3 && order.length <= 5, `${id}: ${order.join(' → ')}`);
  }
  const waiting = elder({ dreams: only('trip') });
  let step = nextDream(waiting, 57);
  apply(waiting, step.story, byAction(step.story, 'accept'), step.age);
  step = nextDream(waiting, step.age + 1);
  apply(waiting, step.story, byAction(step.story, 'wait'), step.age);
  assert.equal(getDreamStory(waiting, step.age + 1).dreamStep, 'prepare', 'để dành thêm thì năm sau hỏi lại bước chuẩn bị');
});

console.log(`${passed} nhóm kiểm tra ước mơ và đời thường tuổi già đều qua.`);
