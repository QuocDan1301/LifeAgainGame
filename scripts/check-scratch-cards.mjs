import assert from 'node:assert/strict';
import { createInitialState } from '../js/core/state.js';
import { SCRATCH_CARDS, SCRATCH_CELLS, buyScratch, canBuyScratch, createScratchCard, getOpenScratchCard, scratchCells,
  scratchExpectedReturn, scratchThisYear, scratchWinChance, scratchWinner } from '../js/leisure/scratch-cards.js';
import { buyTicket, canBuyTicket, scratchRules, ticketsUsedThisYear, MAX_TICKETS_PER_YEAR, LOTTERY_MIN_AGE } from '../js/leisure/lottery.js';
import { shopCatalog, getShopItem, getSellPrice } from '../js/leisure/shop.js';
import { achievements, meetsAchievement, recordAchievementFlags } from '../js/achievements/achievements-data.js';
import { NEEDS } from '../js/events/life-stories.js';

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log(`PASS ${name}`); };
const seeded = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 2 ** 32; };
const adult = (extra = {}) => ({ ...createInitialState().player, age: 30, money: 10_000_000, ...extra });

test('Ba loại vé: giá tăng thì giải lớn hơn nhưng hiếm hơn; trung bình trả lại khoảng một nửa giá vé', () => {
  assert.equal(SCRATCH_CARDS.length, 3);
  const [loc, phat, daiCat] = SCRATCH_CARDS;
  assert.ok(loc.price < phat.price && phat.price < daiCat.price);
  assert.ok(scratchWinChance(loc) > scratchWinChance(phat) && scratchWinChance(phat) > scratchWinChance(daiCat), 'vé đắt khó trúng hơn');
  for (const card of SCRATCH_CARDS) {
    const ev = scratchExpectedReturn(card);
    assert.ok(ev > 0.4 && ev < 0.6, `${card.id}: trả lại trung bình ${ev}`);
    assert.ok(card.prizes.length >= 5 && card.prizes.every(([amount, chance]) => amount > 0 && chance > 0), `${card.id}: mọi mức giải đều có thật`);
  }
});

test('Xếp ô trên 200.000 vé: vé trúng có đúng một bộ ba, vé trượt không có; tần suất trúng khớp tỷ lệ', () => {
  for (const card of SCRATCH_CARDS) {
    const random = seeded(card.price);
    let wins = 0;
    const tally = new Map();
    const runs = 200_000;
    for (let i = 0; i < runs; i++) {
      const ticket = createScratchCard(card.id, 30, random);
      assert.equal(ticket.cells.length, SCRATCH_CELLS);
      const counts = new Map();
      for (const amount of ticket.cells) counts.set(amount, (counts.get(amount) ?? 0) + 1);
      const triples = [...counts].filter(([, count]) => count >= 3);
      assert.ok(triples.length === (ticket.prize ? 1 : 0) && [...counts.values()].every(count => count <= 3), 'không có hai bộ ba hay bộ bốn');
      assert.equal(scratchWinner(ticket.cells), ticket.prize);
      assert.ok(ticket.cells.every(amount => card.prizes.some(([value]) => value === amount)), 'chỉ in số tiền có trong bảng giải');
      if (ticket.prize) { wins++; tally.set(ticket.prize, (tally.get(ticket.prize) ?? 0) + 1); }
    }
    const rate = wins / runs, expected = scratchWinChance(card);
    assert.ok(Math.abs(rate - expected) < 0.01, `${card.id}: tỷ lệ trúng ${rate} so với ${expected}`);
    const smallest = card.prizes[0];
    assert.ok(Math.abs(tally.get(smallest[0]) / runs - smallest[1]) < 0.01, `${card.id}: giải nhỏ nhất đúng tỷ lệ`);
  }
});

test('Mua vé: đủ tuổi, đủ tiền, cào xong vé đang cầm, chung giới hạn 30 vé với kiến thiết và Vietlott', () => {
  assert.ok(!canBuyScratch(adult({ age: LOTTERY_MIN_AGE - 1 }), 'loc', scratchRules(adult({ age: LOTTERY_MIN_AGE - 1 }))), 'dưới 18 tuổi');
  const broke = adult({ money: 5_000 });
  assert.ok(!canBuyScratch(broke, 'loc', scratchRules(broke)), 'thiếu tiền');
  const player = adult();
  const first = buyScratch(player, 'phat', scratchRules(player), seeded(1));
  assert.ok(first && player.money === 10_000_000 - 20_000, 'trừ đúng giá vé');
  assert.equal(scratchThisYear(player), 1);
  assert.equal(buyScratch(player, 'loc', scratchRules(player)), null, 'còn vé chưa cào thì chưa mua vé mới');
  scratchCells(player, [...Array(SCRATCH_CELLS).keys()]);
  for (let i = 0; i < 28; i++) assert.ok(buyTicket(player, { type: 'kien-thiet', number: String(100000 + i) }));
  assert.equal(ticketsUsedThisYear(player), 29);
  assert.ok(canBuyScratch(player, 'loc', scratchRules(player)), 'vé thứ 30 vẫn mua được');
  buyScratch(player, 'loc', scratchRules(player), seeded(2));
  scratchCells(player, [...Array(SCRATCH_CELLS).keys()]);
  assert.equal(ticketsUsedThisYear(player), MAX_TICKETS_PER_YEAR);
  assert.ok(!canBuyTicket(player) && !canBuyScratch(player, 'loc', scratchRules(player)), 'đủ 30 vé thì khóa cả hai loại');
  player.age = 31;
  assert.ok(canBuyScratch(player, 'loc', scratchRules(player)) && canBuyTicket(player), 'năm mới mở lại giới hạn');
});

test('Cào: tiền thưởng vào ví đúng một lần khi cào ô cuối; tải lại giữ nguyên vé đang cào', () => {
  let random = seeded(7), player, card;
  for (let tries = 0; tries < 5000; tries++) {
    player = adult();
    card = buyScratch(player, 'loc', scratchRules(player), random);
    if (card.prize) break;
  }
  assert.ok(card.prize > 0, 'tìm được một vé trúng');
  const afterBuy = player.money;
  scratchCells(player, [0, 1, 2]);
  assert.equal(player.money, afterBuy, 'chưa cào hết thì chưa trả thưởng');
  const reloaded = JSON.parse(JSON.stringify(player));
  assert.deepEqual(getOpenScratchCard(reloaded).revealed.slice(0, 3), [true, true, true], 'tải lại giữ các ô đã cào');
  assert.deepEqual(getOpenScratchCard(reloaded).cells, card.cells, 'tải lại không đổi vận may');
  const result = scratchCells(reloaded, [...Array(SCRATCH_CELLS).keys()]);
  assert.ok(result.done && reloaded.money === afterBuy + card.prize, 'trả đúng số tiền của bộ ba');
  assert.equal(reloaded.scratchYear.won, card.prize);
  assert.equal(scratchCells(reloaded, [0]), null, 'vé đã cào xong không trả thêm');
  assert.equal(reloaded.money, afterBuy + card.prize);
  assert.ok(reloaded.achievementFlags['first-lottery-win'], 'lần trúng đầu mở thành tựu trúng số');
  // Mua tới khi gặp vé trượt (vé trúng thì cào hết cho xong rồi mua tiếp).
  const loser = adult();
  let lost = buyScratch(loser, 'dai-cat', scratchRules(loser), random);
  while (lost.prize) {
    scratchCells(loser, [...Array(SCRATCH_CELLS).keys()]);
    lost = buyScratch(loser, 'dai-cat', scratchRules(loser), random);
  }
  const before = loser.money;
  scratchCells(loser, [...Array(SCRATCH_CELLS).keys()]);
  assert.equal(loser.money, before, 'vé trượt không cộng tiền');
});

test('Bản lưu hỏng hay cũ không làm vỡ vé số', () => {
  for (const scratchCard of [null, 42, { type: 'loc' }, { type: 'x', cells: [], revealed: [] },
    { type: 'loc', cells: [1, 1, 1, 2, 2, 3, 3, 4, 4], revealed: Array(9).fill(false), prize: 0 }]) {
    const player = adult({ scratchCard });
    assert.equal(getOpenScratchCard(player), null);
    assert.ok(canBuyScratch(player, 'loc', scratchRules(player)), 'vẫn mua được vé mới');
    assert.equal(scratchCells(player, [0]), null);
  }
  assert.equal(scratchThisYear(createInitialState().player), 0, 'bản lưu chưa từng cào');
});

test('Tesla Roadster 25 tỷ: xe đường bộ, cần bằng lái ô tô, mở thành tựu riêng', () => {
  const tesla = getShopItem('tesla-roadster');
  assert.ok(tesla && tesla.price === 25_000_000_000 && tesla.group === 'vehicles' && tesla.license === 'car' && !tesla.profit);
  assert.ok(shopCatalog.filter(item => item.group === 'vehicles').every(item => item.price <= tesla.price), 'đắt nhất trong nhóm xe');
  const achievement = achievements.find(item => item.id === 'own-tesla-roadster');
  assert.ok(achievement && tesla.achievement === achievement.id && achievement.section === 'Phương tiện');
  const owner = adult({ purchases: [{ id: 'tesla-roadster', uid: 't1', boughtAtAge: 40 }] });
  assert.ok(!meetsAchievement(achievement, owner));
  recordAchievementFlags({ player: owner }, [achievement.id]);
  assert.ok(meetsAchievement(achievement, owner));
  assert.ok(NEEDS.vehicle(owner), 'sự kiện “có xe” nhận Tesla');
  assert.equal(getSellPrice(tesla), tesla.price / 2, 'bán lại nửa giá như xe khác');
});

console.log(`${passed} nhóm kiểm tra vé số cào và Tesla Roadster đều qua.`);
