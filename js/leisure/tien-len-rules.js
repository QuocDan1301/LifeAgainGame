 
 
 
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
 
export function dealHands(random = Math.random) {
  const deck = shuffledDeck(random);
  return Array.from({ length: SEATS }, (_, seat) => sortCards(deck.filter((_, index) => index % SEATS === seat)));
}

 
const makeCombo = (type, cards, key) => ({ type, cards, key, length: cards.length });
 
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

 
 
export function createGame(hands, { starter = null, requireThreeSpades = false } = {}) {
  const first = starter ?? hands.findIndex((hand) => hand.includes(THREE_SPADES));
  return {
    hands: hands.map(sortCards), played: [], current: null, passed: [false, false, false, false],
    turn: first, requireThreeSpades, winner: null, history: [], actions: 0,
  };
}

const fail = (reason) => ({ ok: false, reason });
 
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
     
    cost -= combo.length * 1.5;
     
    if (danger === 1 && combo.type === "single") cost += 30 - topRank(combo) * 2;
    if (danger === 2 && combo.type === "pair") cost += 20 - topRank(combo);
  }
  return cost;
}
 
const fewestOpponentCards = (game, seat) =>
  Math.min(...game.hands.map((hand, other) => (other === seat ? Infinity : hand.length)));

 
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
   
   
  if (danger) {
    const normal = plays.filter((combo) => !isBomb(combo) || hasTwo(game.current) || isBomb(game.current));
    const strength = (combo) => topRank(combo) * 100 + suitOf(combo.cards.at(-1)) * 10 + combo.length;
    return (normal.length ? normal : plays).reduce((a, b) => (strength(b) > strength(a) ? b : a)).cards;
  }
   
  const before = movesLeft(hand);
  const after = movesLeft(hand.filter((card) => !best.combo.cards.includes(card)));
  const breaksPlan = after >= before;
  const costly = hasTwo(best.combo) || isBomb(best.combo);
  const lowTable = topRank(game.current) < 9;
  if ((breaksPlan || costly) && lowTable && hand.length > 4) return null;
  if (costly && !hasTwo(game.current) && !isBomb(game.current) && hand.length > 6) return null;
  return best.combo.cards;
}
 
export function chooseAiOutOfTurnChop(game, seat) {
  if (!game.current || game.current.by === seat || game.turn === seat || game.winner !== null) return null;
  const chops = listCombos(game.hands[seat]).filter((combo) => combo.type === "pairs4" && checkPlay(game, seat, combo.cards).ok);
  if (!chops.length) return null;
  const worth = hasTwo(game.current) || isBomb(game.current) || fewestOpponentCards(game, seat) <= 2;
  return worth ? chops[0].cards : null;
}
 
export function suggestPlay(game, seat) {
  const hand = game.hands[seat];
  const plays = legalPlays(game, seat);
  if (!plays.length) return null;
  const fewest = fewestOpponentCards(game, seat);
  const context = { danger: fewest <= 2 ? fewest : 0, opening: !game.current, current: game.current };
  return plays.map((combo) => ({ combo, cost: moveCost(hand, combo, context) })).sort((a, b) => a.cost - b.cost)[0].combo.cards;
}
 
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
