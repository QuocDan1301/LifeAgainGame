import { SAVE_KEY, withSaveLock } from "./save-store.js";
export { SAVE_KEY } from "./save-store.js";
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
 
export async function recoverTicketPurchase() {
  if (!readProfile().pendingGame) return;
  await withSaveLock(() => {
    const profile = readProfile();
    if (!profile.pendingGame) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(profile.pendingGame));
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ tickets: profile.tickets }));
  });
}
export function getTickets() { return readProfile().tickets; }
export const MAX_TICKETS_PER_PURCHASE = 20;
export function addTickets(quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_TICKETS_PER_PURCHASE) {
    throw new Error(`Mỗi lượt chỉ được nhận từ 1 đến ${MAX_TICKETS_PER_PURCHASE} vé nguyên.`);
  }
  const profile = readProfile();
  if (profile.pendingGame) throw new Error("Hãy phục hồi cuộc đời đang chờ lưu trước khi nhận thêm vé.");
  const remaining = profile.tickets;
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
      !Number.isInteger(saved.player.age) || saved.player.age < 0 || saved.player.age > 105) return null;
  const player = saved.player;
  if (!Number.isFinite(player.money) ||
      ["health", "happiness", "intelligence", "appearance"].some(key =>
        !Number.isFinite(player[key]) || player[key] < 0 || player[key] > 100)) return null;
  for (const key of ["children", "otherPartners", "purchases", "licenses", "sideJobs", "streetJobs", "illnesses"]) {
    if (player[key] !== undefined && !Array.isArray(player[key])) return null;
  }
  const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
  for (const key of ["children", "otherPartners", "purchases", "sideJobs", "streetJobs", "illnesses"]) {
    if (player[key]?.some(entry => !object(entry))) return null;
  }
  if (player.illnesses?.some(entry => typeof entry.id !== "string" || !entry.id ||
      !Number.isInteger(entry.since) || entry.since < 0 || entry.since > 105)) return null;
  const validEvent = (event, depth = 0) => {
    if (event == null) return true;
    if (!object(event) || depth > 20 || !["choice", "result"].includes(event.stage) ||
        !Number.isInteger(event.age) || event.age < 0 || event.age > 105) return false;
    if (event.choices !== undefined && (!Array.isArray(event.choices) ||
        event.choices.some(choice => !object(choice) || typeof choice.label !== "string"))) return false;
    if (event.stage === "choice" && !event.choices?.length) return false;
    if (event.updates !== undefined && !object(event.updates)) return false;
    if (event.mediaTransition && !event.nextScene) return false;
    return validEvent(event.nextScene, depth + 1);
  };
  if (!validEvent(saved.pendingEvent) || !validEvent(saved.followUpEvent)) return null;
  if (saved.logs.some(log => !log || typeof log.content !== "string" ||
      !Number.isInteger(log.age) || log.age < 0 || log.age > 105)) return null;
  return saved;
}
export function canContinue(saved) {
  return Boolean(saved?.player && saved.player.isAlive !== false &&
    saved.player.isDead !== true && saved.player.dead !== true &&
    Number.isFinite(saved.player.health) && saved.player.health > 0);
}
export async function startLife(nextGame, expectedSave) {
  if (localStorage.getItem(SAVE_KEY) !== expectedSave) {
    throw new Error("Tiến trình đã thay đổi ở tab khác. Hãy đóng hộp tạo nhân vật rồi thử lại.");
  }
  const tickets = getTickets();
  if (tickets < 1) throw new Error("Bạn hết vé rồi. Hãy nhận vé miễn phí ở quầy nhé!");
   
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ tickets: tickets - 1, pendingGame: nextGame }));
  try { await recoverTicketPurchase(); }
  catch (cause) {
    throw new Error("Cuộc đời đã được ghi nhận nhưng chưa hoàn tất lưu. Hãy kiểm tra dung lượng/quyền lưu dữ liệu rồi thử Chơi tiếp; vé sẽ không bị trừ thêm.", { cause });
  }
  return nextGame;
}
