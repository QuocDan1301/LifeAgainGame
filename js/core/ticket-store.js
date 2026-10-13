export const SAVE_KEY = "lifeAgainSave";
const PROFILE_KEY = "lifeAgainTickets";
function readProfile() {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return { tickets: 0 };
  const profile = JSON.parse(raw);
  if (!profile || !Number.isSafeInteger(profile.tickets) || profile.tickets < 0) {
    throw new Error("Dữ liệu vé không hợp lệ. Chưa thay đổi bản lưu của bạn.");
  }
  return profile;
}
// Nếu đóng trình duyệt giữa hai lần ghi, hoàn tất cùng một lượt tạo, không trừ thêm vé.
export function recoverTicketPurchase() {
  const profile = readProfile();
  if (profile.pendingGame) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(profile.pendingGame));
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ tickets: profile.tickets }));
  }
}
export function getTickets() { return readProfile().tickets; }
export const MAX_TICKETS_PER_PURCHASE = 20;
export function addTickets(quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_TICKETS_PER_PURCHASE) {
    throw new Error(`Mỗi lượt chỉ được nhận từ 1 đến ${MAX_TICKETS_PER_PURCHASE} vé nguyên.`);
  }
  const remaining = getTickets();
  if (remaining > 0) {
    throw new Error(`Bạn còn ${remaining} vé. Hãy dùng hết vé hiện có trước khi nhận thêm.`);
  }
  const total = quantity;
  if (!Number.isSafeInteger(total)) throw new Error("Số vé vượt khả năng lưu trữ của trình duyệt.");
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ tickets: total }));
  return total;
}
export function readSavedGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  const saved = JSON.parse(raw);
  if (!saved?.player || !Array.isArray(saved.logs) ||
      typeof saved.player.name !== "string" || !saved.player.name.trim() ||
      !Number.isFinite(saved.player.age) || saved.player.age < 0) return null;
  return saved;
}
export function canContinue(saved) {
  return Boolean(saved?.player && saved.player.isAlive !== false &&
    saved.player.isDead !== true && saved.player.dead !== true &&
    Number.isFinite(saved.player.health) && saved.player.health > 0);
}
export function startLife(nextGame, expectedSave) {
  if (localStorage.getItem(SAVE_KEY) !== expectedSave) {
    throw new Error("Tiến trình đã thay đổi ở tab khác. Hãy đóng hộp tạo nhân vật rồi thử lại.");
  }
  const tickets = getTickets();
  if (tickets < 1) throw new Error("Bạn hết vé rồi. Hãy nhận vé miễn phí ở quầy nhé!");
  // Một lần ghi lưu cả vé đã trừ lẫn cuộc đời mới để có thể phục hồi an toàn.
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ tickets: tickets - 1, pendingGame: nextGame }));
  try { recoverTicketPurchase(); }
  catch (error) { console.warn("Cuộc đời đã được ghi nhận, sẽ hoàn tất khi mở lại game:", error); }
  return nextGame;
}
