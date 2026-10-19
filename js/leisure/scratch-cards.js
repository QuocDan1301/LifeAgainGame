import { recordAchievementFlags } from "../achievements/achievements-data.js";

// Vé số cào: mua và cào ngay trong năm. Lưới 3×3; ba ô cùng số tiền là trúng đúng số tiền ấy.
// Kết quả được quyết định lúc mua và lưu lại, nên tải lại không đổi được vận may.
// Tiền thưởng chỉ vào ví khi đã cào hết vé. Trung bình mỗi loại vé trả lại khoảng một nửa giá vé.
export const SCRATCH_CELLS = 9;
export const SCRATCH_CARDS = [
  { id: "loc", name: "Cào Lộc", icon: "🍀", price: 10_000,
    prizes: [[10_000, 0.12], [20_000, 0.05], [50_000, 0.02], [100_000, 0.008], [1_000_000, 0.0008], [20_000_000, 0.00002]] },
  { id: "phat", name: "Cào Phát", icon: "🧧", price: 20_000,
    prizes: [[20_000, 0.1], [50_000, 0.04], [200_000, 0.01], [2_000_000, 0.0008], [100_000_000, 0.00003]] },
  { id: "dai-cat", name: "Cào Đại Cát", icon: "🐉", price: 50_000,
    prizes: [[50_000, 0.08], [200_000, 0.02], [1_000_000, 0.006], [10_000_000, 0.0005], [1_000_000_000, 0.000005]] },
];

export const getScratchCard = (id) => SCRATCH_CARDS.find((card) => card.id === id) ?? null;
export const scratchTopPrize = (card) => Math.max(...card.prizes.map(([amount]) => amount));
export const scratchWinChance = (card) => card.prizes.reduce((sum, [, chance]) => sum + chance, 0);
export const scratchExpectedReturn = (card) => card.prizes.reduce((sum, [amount, chance]) => sum + amount * chance, 0) / card.price;

// Số tiền xuất hiện đủ ba lần trên vé; 0 là không trúng. Mỗi vé có nhiều nhất một bộ ba.
export function scratchWinner(cells) {
  const counts = new Map();
  for (const amount of cells) counts.set(amount, (counts.get(amount) ?? 0) + 1);
  return [...counts].find(([, count]) => count >= 3)?.[0] ?? 0;
}

const shuffle = (list, random) => {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [copy[index], copy[other]] = [copy[other], copy[index]];
  }
  return copy;
};

// Rút giải theo tỷ lệ rồi xếp ô: vé trúng có đúng một bộ ba; mọi số tiền khác xuất hiện nhiều nhất hai lần.
// Mỗi loại vé có ít nhất 5 mức giải, nên luôn đủ 9 ô mà không cần số tiền giả.
export function createScratchCard(typeId, age, random = Math.random) {
  const card = getScratchCard(typeId);
  if (!card) return null;
  let roll = random();
  let prize = 0;
  for (const [amount, chance] of card.prizes) {
    if (roll < chance) { prize = amount; break; }
    roll -= chance;
  }
  const others = card.prizes.map(([amount]) => amount).filter((amount) => amount !== prize);
  const fillers = shuffle(others.flatMap((amount) => [amount, amount]), random).slice(0, SCRATCH_CELLS - (prize ? 3 : 0));
  const cells = shuffle([...(prize ? [prize, prize, prize] : []), ...fillers], random);
  return { type: card.id, price: card.price, cells, revealed: cells.map(() => false), prize, boughtAtAge: age, settled: false };
}

const isValidCard = (raw) => raw && typeof raw === "object" && getScratchCard(raw.type) &&
  Array.isArray(raw.cells) && raw.cells.length === SCRATCH_CELLS && raw.cells.every((amount) => Number.isInteger(amount) && amount > 0) &&
  Array.isArray(raw.revealed) && raw.revealed.length === SCRATCH_CELLS && scratchWinner(raw.cells) === raw.prize;

// Vé đang cào dở (đã mua, chưa cào hết). Bản lưu hỏng thì bỏ qua thay vì làm vỡ màn vé số.
export function getOpenScratchCard(player) {
  const card = player?.scratchCard;
  return isValidCard(card) && !card.settled ? card : null;
}

export const scratchThisYear = (player) => player?.scratchYear?.age === player?.age ? player.scratchYear.bought ?? 0 : 0;

export function canBuyScratch(player, typeId, { minAge, ticketsUsed, maxTickets }) {
  const card = getScratchCard(typeId);
  return Boolean(card) && player.isAlive !== false && player.age >= minAge && player.money >= card.price &&
    !getOpenScratchCard(player) && ticketsUsed < maxTickets;
}

export function buyScratch(player, typeId, rules, random = Math.random) {
  if (!canBuyScratch(player, typeId, rules)) return null;
  const card = createScratchCard(typeId, player.age, random);
  player.money -= card.price;
  const year = player.scratchYear?.age === player.age ? player.scratchYear : { age: player.age, bought: 0, spent: 0, won: 0 };
  player.scratchYear = { ...year, bought: year.bought + 1, spent: year.spent + card.price };
  player.scratchCard = card;
  return card;
}

// Cào một ô (hoặc tất cả). Khi ô cuối được cào, tiền thưởng vào ví đúng một lần.
export function scratchCells(player, indexes) {
  const card = getOpenScratchCard(player);
  if (!card) return null;
  const revealed = [...card.revealed];
  for (const index of indexes) if (Number.isInteger(index) && index >= 0 && index < SCRATCH_CELLS) revealed[index] = true;
  const done = revealed.every(Boolean);
  player.scratchCard = { ...card, revealed, settled: done };
  if (done) {
    player.money += card.prize;
    if (player.scratchYear?.age === player.age) player.scratchYear = { ...player.scratchYear, won: (player.scratchYear.won ?? 0) + card.prize };
    if (card.prize > 0) recordAchievementFlags({ player }, ["first-lottery-win"]);
  }
  return { card: player.scratchCard, done, prize: done ? card.prize : 0 };
}
