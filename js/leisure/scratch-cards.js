import { recordAchievementFlags } from "../achievements/achievements-data.js";

// Vé số cào kiểu miền Nam: cào 2 ô "Số của bạn", rồi cào 6 ô dò bên dưới, mỗi ô có một con số và một mức tiền.
// Ô nào có số trùng với số của bạn thì trúng đúng mức tiền in ở ô đó.
// Kết quả được quyết định lúc mua và lưu lại, nên tải lại không đổi được vận may.
// Tiền thưởng chỉ vào ví khi đã cào hết vé. Trung bình mỗi loại vé trả lại khoảng một nửa giá vé.
export const SCRATCH_LUCKY = 2;
export const SCRATCH_SPOTS = 6;
export const SCRATCH_CELLS = SCRATCH_LUCKY + SCRATCH_SPOTS;
export const SCRATCH_NUMBER_MAX = 30;
export const SCRATCH_CARDS = [
  { id: "loc", name: "Cào Lộc", icon: "🍀", price: 10_000,
    prizes: [[10_000, 0.14], [20_000, 0.055], [50_000, 0.022], [100_000, 0.009], [1_000_000, 0.0008], [20_000_000, 0.00002]] },
  { id: "phat", name: "Cào Phát", icon: "🧧", price: 20_000,
    prizes: [[20_000, 0.115], [50_000, 0.045], [200_000, 0.011], [2_000_000, 0.0008], [100_000_000, 0.00003]] },
  { id: "dai-cat", name: "Cào Đại Cát", icon: "🐉", price: 50_000,
    prizes: [[50_000, 0.09], [200_000, 0.022], [1_000_000, 0.007], [10_000_000, 0.0005], [1_000_000_000, 0.000005]] },
];

export const getScratchCard = (id) => SCRATCH_CARDS.find((card) => card.id === id) ?? null;
export const scratchTopPrize = (card) => Math.max(...card.prizes.map(([amount]) => amount));
export const scratchWinChance = (card) => card.prizes.reduce((sum, [, chance]) => sum + chance, 0);
export const scratchExpectedReturn = (card) => card.prizes.reduce((sum, [amount, chance]) => sum + amount * chance, 0) / card.price;
export const formatScratchNumber = (number) => String(number).padStart(2, "0");

// Ô 0–1 là "Số của bạn", ô 2–7 là các ô dò.
export const isLuckyIndex = (index) => index < SCRATCH_LUCKY;
export const scratchSpotWins = (card, spot) => card.lucky.includes(spot.number);
// Tổng tiền các ô dò có số trùng số của bạn; 0 là không trúng.
export const scratchWinner = (card) => card.spots.reduce((sum, spot) => sum + (scratchSpotWins(card, spot) ? spot.amount : 0), 0);

// Rút giải theo tỷ lệ rồi in vé: mọi con số trên vé khác nhau, nên vé trúng có đúng một ô dò trùng số của bạn.
// Ô trượt vẫn in các mức tiền trong bảng giải (kể cả giải lớn) cho giống vé thật.
export function createScratchCard(typeId, age, random = Math.random) {
  const card = getScratchCard(typeId);
  if (!card) return null;
  let roll = random();
  let prize = 0;
  for (const [amount, chance] of card.prizes) {
    if (roll < chance) { prize = amount; break; }
    roll -= chance;
  }
  const pool = Array.from({ length: SCRATCH_NUMBER_MAX }, (_, index) => index + 1);
  const draw = () => pool.splice(Math.floor(random() * pool.length), 1)[0];
  const lucky = Array.from({ length: SCRATCH_LUCKY }, draw).sort((a, b) => a - b);
  const amounts = card.prizes.map(([amount]) => amount);
  const spots = Array.from({ length: SCRATCH_SPOTS }, () => ({ number: draw(), amount: amounts[Math.floor(random() * amounts.length)] }));
  if (prize) spots[Math.floor(random() * SCRATCH_SPOTS)] = { number: lucky[Math.floor(random() * SCRATCH_LUCKY)], amount: prize };
  return { type: card.id, price: card.price, lucky, spots, revealed: Array(SCRATCH_CELLS).fill(false), prize, boughtAtAge: age, settled: false };
}

const isScratchNumber = (number) => Number.isInteger(number) && number >= 1 && number <= SCRATCH_NUMBER_MAX;
const isValidCard = (raw) => raw && typeof raw === "object" && getScratchCard(raw.type) &&
  Array.isArray(raw.lucky) && raw.lucky.length === SCRATCH_LUCKY && raw.lucky.every(isScratchNumber) &&
  Array.isArray(raw.spots) && raw.spots.length === SCRATCH_SPOTS &&
  raw.spots.every((spot) => spot && isScratchNumber(spot.number) && Number.isInteger(spot.amount) && spot.amount > 0) &&
  Array.isArray(raw.revealed) && raw.revealed.length === SCRATCH_CELLS && scratchWinner(raw) === raw.prize;

// Vé đang cào dở (đã mua, chưa cào hết). Bản lưu hỏng hay vé kiểu cũ thì bỏ qua thay vì làm vỡ màn vé số.
export function getOpenScratchCard(player) {
  const card = player?.scratchCard;
  return isValidCard(card) && !card.settled ? card : null;
}

// Vé đã cào xong còn hiển thị được (đúng kiểu vé hiện tại).
export function getSettledScratchCard(player) {
  const card = player?.scratchCard;
  return isValidCard(card) && card.settled ? card : null;
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
