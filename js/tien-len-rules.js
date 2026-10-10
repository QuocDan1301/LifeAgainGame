// Tiến lên miền Nam: luật bài thuần (không đụng giao diện, không đụng tiền).
// Lá bài là số 0–51: giá trị = Math.floor(lá / 4) (0 là lá 3 … 11 là A, 12 là 2 – heo),
// chất = lá % 4 (0 ♠ < 1 ♣ < 2 ♦ < 3 ♥). Nhờ vậy so lá chỉ cần so số.
export const RANKS = ["3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2"];
export const SUITS = ["♠", "♣", "♦", "♥"];
export const TWO = 12;
export const ACE = 11;
export const THREE_SPADES = 0;
export const SEATS = 4;
export const HAND_SIZE = 13;

export const rankOf = (card) => Math.floor(card / 4);
export const suitOf = (card) => card % 4;
export const cardLabel = (card) => `${RANKS[rankOf(card)]}${SUITS[suitOf(card)]}`;
export const isRed = (card) => suitOf(card) >= 2;
export const sortCards = (cards) => [...cards].sort((a, b) => a - b);
export const nextSeat = (seat) => (seat + 1) % SEATS;

export const COMBO_NAMES = {
  single: "bài lẻ", pair: "đôi", triple: "sám cô", straight: "sảnh", quad: "tứ quý", pairs3: "ba đôi thông", pairs4: "bốn đôi thông",
};
export const describeCombo = (combo) =>
  combo.type === "straight" ? `sảnh ${combo.length} lá` : COMBO_NAMES[combo.type];

export function shuffledDeck(random = Math.random) {
  const deck = Array.from({ length: 52 }, (_, card) => card);
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}
// Chia lần lượt từng lá cho 4 người, mỗi người 13 lá.
export function dealHands(random = Math.random) {
  const deck = shuffledDeck(random);
  return Array.from({ length: SEATS }, (_, seat) => sortCards(deck.filter((_, index) => index % SEATS === seat)));
}

// ---------- Nhận dạng và so sánh bộ ----------
const makeCombo = (type, cards, key) => ({ type, cards, key, length: cards.length });
// key: lá cao nhất (lẻ, đôi, sảnh, đôi thông) hoặc giá trị (sám cô, tứ quý). Cùng loại thì key lớn hơn là mạnh hơn.
export function classify(cards) {
  const sorted = sortCards(cards);
  const count = sorted.length;
  if (!count || new Set(sorted).size !== count) return null;
  const ranks = sorted.map(rankOf);
  const top = sorted[count - 1];
  if (count === 1) return makeCombo("single", sorted, top);
  if (ranks.every((rank) => rank === ranks[0])) {
    if (count === 2) return makeCombo("pair", sorted, top);
    if (count === 3) return makeCombo("triple", sorted, ranks[0]);
    if (count === 4) return makeCombo("quad", sorted, ranks[0]);
    return null;
  }
  // Lá 2 không nằm trong sảnh hay đôi thông; A đứng sau K, không nối với 3.
  if (ranks.includes(TWO)) return null;
  if (count >= 3 && ranks.every((rank, index) => index === 0 || rank === ranks[index - 1] + 1)) {
    return makeCombo("straight", sorted, top);
  }
  if (count === 6 || count === 8) {
    for (let index = 0; index < count; index += 2) {
      if (ranks[index] !== ranks[index + 1]) return null;
      if (index && ranks[index] !== ranks[index - 2] + 1) return null;
    }
    return makeCombo(count === 6 ? "pairs3" : "pairs4", sorted, top);
  }
  return null;
}

const isTwoSingle = (combo) => combo.type === "single" && rankOf(combo.key) === TWO;
const isTwoPair = (combo) => combo.type === "pair" && rankOf(combo.key) === TWO;
// Luật chặt đặc biệt (khác loại với bộ trên bàn, hoặc bộ chặt cùng loại lớn hơn).
export function isChop(play, current) {
  if (!play || !current) return false;
  if (play.type === "pairs3") return isTwoSingle(current) || (current.type === "pairs3" && play.key > current.key);
  if (play.type === "quad") {
    return isTwoSingle(current) || isTwoPair(current) || current.type === "pairs3" || (current.type === "quad" && play.key > current.key);
  }
  if (play.type === "pairs4") {
    return isTwoSingle(current) || isTwoPair(current) || ["pairs3", "quad"].includes(current.type) ||
      (current.type === "pairs4" && play.key > current.key);
  }
  return false;
}
export function beats(play, current) {
  if (!play) return false;
  if (!current) return true;
  if (play.type === current.type && play.length === current.length && play.key > current.key) return true;
  return isChop(play, current);
}

// ---------- Trạng thái ván ----------
// turn: ghế đang tới lượt (0 là người chơi, đánh ngược chiều kim đồng hồ: 0 → 1 phải → 2 trên → 3 trái).
export function createGame(hands, { starter = null, requireThreeSpades = false } = {}) {
  const first = starter ?? hands.findIndex((hand) => hand.includes(THREE_SPADES));
  return {
    hands: hands.map(sortCards), played: [], current: null, passed: [false, false, false, false],
    turn: first, requireThreeSpades, winner: null, history: [], actions: 0,
  };
}

const fail = (reason) => ({ ok: false, reason });
// Kiểm tra một nước đánh. Bốn đôi thông được chặt ngoài lượt, kể cả khi đã bỏ vòng.
export function checkPlay(game, seat, cards) {
  if (game.winner !== null || game.over) return fail("Ván đã kết thúc.");
  const hand = game.hands[seat];
  if (!cards.length) return fail("Hãy chọn bài để đánh.");
  if (!cards.every((card) => hand.includes(card))) return fail("Lá bài không có trên tay.");
  const combo = classify(cards);
  if (!combo) return fail("Các lá đang chọn không tạo thành bộ hợp lệ.");
  if (game.turn !== seat) {
    if (combo.type === "pairs4" && game.current && game.current.by !== seat && isChop(combo, game.current)) {
      return { ok: true, combo, chop: true };
    }
    return fail("Chưa tới lượt bạn.");
  }
  if (!game.current) {
    if (game.requireThreeSpades && !cards.includes(THREE_SPADES)) return fail("Bộ đánh đầu tiên của bàn phải có 3♠.");
    return { ok: true, combo, chop: false };
  }
  if (!beats(combo, game.current)) {
    return fail(`Cần ${describeCombo(game.current)} lớn hơn bộ trên bàn, hoặc bộ chặt hợp lệ.`);
  }
  return { ok: true, combo, chop: isChop(combo, game.current) };
}
export const canPass = (game, seat) => game.winner === null && !game.over && game.turn === seat && game.current !== null;

function newRound(game, seat) {
  game.current = null;
  game.passed = [false, false, false, false];
  game.turn = seat;
  game.history.push({ seat, kind: "round" });
}
// Chuyển lượt sang người kế tiếp chưa bỏ vòng; nếu vòng quay về người đánh cuối thì người đó mở vòng mới.
function advance(game, from) {
  for (let step = 1; step <= SEATS; step += 1) {
    const seat = (from + step) % SEATS;
    if (game.current && seat === game.current.by) return newRound(game, seat);
    if (!game.passed[seat]) {
      game.turn = seat;
      return;
    }
  }
}
// Gọi sau checkPlay. Trả về true nếu người này vừa hết bài (thắng).
export function applyPlay(game, seat, cards) {
  const check = checkPlay(game, seat, cards);
  if (!check.ok) throw new Error(check.reason);
  const { combo, chop } = check;
  game.hands[seat] = game.hands[seat].filter((card) => !cards.includes(card));
  game.played.push(...combo.cards);
  game.history.push({ seat, kind: chop ? "chop" : "play", cards: combo.cards, type: combo.type });
  game.current = { type: combo.type, cards: combo.cards, key: combo.key, length: combo.length, by: seat };
  game.requireThreeSpades = false;
  game.passed[seat] = false;
  game.actions += 1;
  if (!game.hands[seat].length) {
    game.winner = seat;
    game.turn = null;
    return true;
  }
  advance(game, seat);
  return false;
}
export function applyPass(game, seat) {
  if (!canPass(game, seat)) throw new Error("Không thể bỏ lượt lúc này.");
  game.passed[seat] = true;
  game.history.push({ seat, kind: "pass" });
  game.actions += 1;
  advance(game, seat);
}

// ---------- Liệt kê các bộ có thể đánh ----------
function groupByRank(hand) {
  const groups = Array.from({ length: 13 }, () => []);
  for (const card of sortCards(hand)) groups[rankOf(card)].push(card);
  return groups;
}
function subsets(cards, size) {
  if (size === 0) return [[]];
  if (cards.length < size) return [];
  const [first, ...rest] = cards;
  return [...subsets(rest, size - 1).map((subset) => [first, ...subset]), ...subsets(rest, size)];
}
// Mọi bộ hợp lệ có thể tạo từ bài trên tay (lá thấp được dùng cho phần dưới của sảnh/đôi thông,
// lá cao nhất được thử đủ các chất để có đủ lựa chọn khi so).
export function listCombos(hand) {
  const groups = groupByRank(hand);
  const combos = [];
  for (const cards of groups) {
    for (const card of cards) combos.push([card]);
    for (const size of [2, 3, 4]) for (const subset of subsets(cards, size)) combos.push(subset);
  }
  for (let start = 0; start <= ACE - 2; start += 1) {
    for (let end = start + 2; end <= ACE && groups[end].length; end += 1) {
      if (groups.slice(start, end + 1).some((cards) => !cards.length)) break;
      const lower = groups.slice(start, end).map((cards) => cards[0]);
      for (const top of groups[end]) combos.push([...lower, top]);
    }
  }
  for (const pairs of [3, 4]) {
    for (let start = 0; start + pairs - 1 <= ACE; start += 1) {
      const ranks = groups.slice(start, start + pairs);
      if (ranks.some((cards) => cards.length < 2)) continue;
      const lower = ranks.slice(0, -1).flatMap((cards) => cards.slice(0, 2));
      for (const top of subsets(ranks.at(-1), 2)) combos.push([...lower, ...top]);
    }
  }
  return combos.map(classify).filter(Boolean);
}
export const legalPlays = (game, seat) =>
  listCombos(game.hands[seat]).filter((combo) => checkPlay(game, seat, combo.cards).ok);

// ---------- Máy chơi ----------
// Ước lượng số nước cần để đánh hết bài: tách tham lam thành đôi thông, sảnh, sám cô, đôi, lẻ.
// Bộ chặt (tứ quý, đôi thông) và heo được giữ riêng vì có giá trị đặc biệt.
export function planHand(hand) {
  const groups = groupByRank(hand);
  const counts = groups.map((cards) => cards.length);
  const plan = [];
  const take = (rank, count) => {
    counts[rank] -= count;
  };
  for (let rank = 0; rank < 13; rank += 1) if (counts[rank] === 4) { plan.push({ type: "quad", rank }); take(rank, 4); }
  for (let start = 0; start <= ACE - 2; start += 1) {
    let end = start;
    while (end <= ACE && counts[end] >= 2) end += 1;
    if (end - start >= 3) {
      for (let rank = start; rank < end; rank += 1) take(rank, 2);
      plan.push({ type: end - start >= 4 ? "pairs4" : "pairs3", rank: end - 1 });
    }
  }
  // Sảnh: ưu tiên các giá trị chỉ có 1 lá để khỏi phá đôi.
  for (let start = 0; start <= ACE - 2; start += 1) {
    let end = start;
    while (end <= ACE && counts[end] >= 1) end += 1;
    if (end - start >= 3) {
      const singles = groups.slice(start, end).filter((_, offset) => counts[start + offset] === 1).length;
      if (singles >= 2 || end - start >= 5) {
        for (let rank = start; rank < end; rank += 1) take(rank, 1);
        plan.push({ type: "straight", rank: end - 1, length: end - start });
      }
    }
  }
  for (let rank = 0; rank < 13; rank += 1) {
    if (counts[rank] === 3) plan.push({ type: "triple", rank });
    else if (counts[rank] === 2) plan.push({ type: "pair", rank });
    else if (counts[rank] === 1) plan.push({ type: "single", rank });
  }
  return plan;
}
const movesLeft = (hand) => planHand(hand).length;
const isBomb = (combo) => ["quad", "pairs3", "pairs4"].includes(combo.type);
const hasTwo = (combo) => combo.cards.some((card) => rankOf(card) === TWO);
const topRank = (combo) => rankOf(combo.cards.at(-1));

// Chi phí một nước: càng thấp càng nên đánh. Dựa trên số nước còn lại sau khi đánh,
// độ cao của bộ và việc phải dùng heo / bộ chặt.
function moveCost(hand, combo, { danger, opening, current }) {
  const after = hand.filter((card) => !combo.cards.includes(card));
  if (!after.length) return -1000;
  let cost = movesLeft(after) * 10 + topRank(combo);
  const twos = combo.cards.filter((card) => rankOf(card) === TWO).length;
  if (twos && !danger && after.length > 3) cost += 14 * twos;
  if (isBomb(combo)) {
    const worthIt = current && (hasTwo(current) || isBomb(current));
    if (!worthIt && !danger) cost += 40;
  }
  if (opening) {
    // Mở vòng: ưu tiên bộ nhiều lá để rút bài nhanh.
    cost -= combo.length * 1.5;
    // Đối thủ còn 1 lá thì tránh mở bài lẻ nhỏ; còn 2 lá thì tránh mở đôi nhỏ.
    if (danger === 1 && combo.type === "single") cost += 30 - topRank(combo) * 2;
    if (danger === 2 && combo.type === "pair") cost += 20 - topRank(combo);
  }
  return cost;
}
// Ít bài nhất trong các đối thủ (máy chỉ biết số lá, không biết lá gì).
const fewestOpponentCards = (game, seat) =>
  Math.min(...game.hands.map((hand, other) => (other === seat ? Infinity : hand.length)));

// Trả về các lá sẽ đánh, hoặc null nếu bỏ lượt.
export function chooseAiMove(game, seat) {
  const hand = game.hands[seat];
  if (game.turn !== seat) return null;
  const plays = legalPlays(game, seat);
  if (!plays.length) return null;
  const finishing = plays.find((combo) => combo.length === hand.length);
  if (finishing) return finishing.cards;
  const fewest = fewestOpponentCards(game, seat);
  const danger = fewest <= 2 ? fewest : 0;
  const opening = !game.current;
  const context = { danger, opening, current: game.current };
  const ranked = plays.map((combo) => ({ combo, cost: moveCost(hand, combo, context) })).sort((a, b) => a.cost - b.cost);
  const best = ranked[0];
  if (opening) return best.combo.cards;
  // Đối thủ sắp hết bài: không bỏ lượt, đánh bộ mạnh nhất để giành quyền đánh
  // (bộ chặt chỉ dùng khi bàn đang có heo hoặc bộ chặt, trừ khi không còn cách nào khác).
  if (danger) {
    const normal = plays.filter((combo) => !isBomb(combo) || hasTwo(game.current) || isBomb(game.current));
    const strength = (combo) => topRank(combo) * 100 + suitOf(combo.cards.at(-1)) * 10 + combo.length;
    return (normal.length ? normal : plays).reduce((a, b) => (strength(b) > strength(a) ? b : a)).cards;
  }
  // Không gấp: bỏ lượt nếu phải phá bộ, dùng heo hoặc bộ chặt cho một bộ nhỏ.
  const before = movesLeft(hand);
  const after = movesLeft(hand.filter((card) => !best.combo.cards.includes(card)));
  const breaksPlan = after >= before;
  const costly = hasTwo(best.combo) || isBomb(best.combo);
  const lowTable = topRank(game.current) < 9;
  if ((breaksPlan || costly) && lowTable && hand.length > 4) return null;
  if (costly && !hasTwo(game.current) && !isBomb(game.current) && hand.length > 6) return null;
  return best.combo.cards;
}
// Máy có bốn đôi thông muốn chặt ngoài lượt không (chỉ chặt heo, bộ chặt, hoặc khi đối thủ sắp hết bài).
export function chooseAiOutOfTurnChop(game, seat) {
  if (!game.current || game.current.by === seat || game.turn === seat || game.winner !== null) return null;
  const chops = listCombos(game.hands[seat]).filter((combo) => combo.type === "pairs4" && checkPlay(game, seat, combo.cards).ok);
  if (!chops.length) return null;
  const worth = hasTwo(game.current) || isBomb(game.current) || fewestOpponentCards(game, seat) <= 2;
  return worth ? chops[0].cards : null;
}
// Gợi ý cho người chơi: một nước hợp lệ có chi phí thấp nhất (không tự đánh).
export function suggestPlay(game, seat) {
  const hand = game.hands[seat];
  const plays = legalPlays(game, seat);
  if (!plays.length) return null;
  const fewest = fewestOpponentCards(game, seat);
  const context = { danger: fewest <= 2 ? fewest : 0, opening: !game.current, current: game.current };
  return plays.map((combo) => ({ combo, cost: moveCost(hand, combo, context) })).sort((a, b) => a.cost - b.cost)[0].combo.cards;
}
// Xếp bài theo bộ: bộ chặt, đôi thông, sảnh, sám cô, đôi rồi lẻ (mỗi nhóm từ thấp đến cao).
export function arrangeByGroups(hand) {
  const remaining = new Set(hand);
  const order = [];
  const plan = planHand(hand);
  const priority = ["quad", "pairs4", "pairs3", "straight", "triple", "pair", "single"];
  const groups = groupByRank(hand);
  for (const type of priority) {
    for (const entry of plan.filter((item) => item.type === type)) {
      let cards = [];
      if (type === "quad" || type === "triple" || type === "pair" || type === "single") {
        const size = { quad: 4, triple: 3, pair: 2, single: 1 }[type];
        cards = groups[entry.rank].filter((card) => remaining.has(card)).slice(-size);
      } else {
        const length = type === "straight" ? entry.length : type === "pairs4" ? 4 : 3;
        const per = type === "straight" ? 1 : 2;
        for (let rank = entry.rank - length + 1; rank <= entry.rank; rank += 1) {
          cards.push(...groups[rank].filter((card) => remaining.has(card)).slice(0, per));
        }
      }
      for (const card of cards) remaining.delete(card);
      order.push(...cards);
    }
  }
  return [...order, ...sortCards([...remaining])];
}
