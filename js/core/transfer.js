// Chuyển thiết bị: đóng gói mọi dữ liệu lưu của game (các khóa lifeAgain… trong localStorage)
// để mang sang máy khác bằng mã 6 ký tự (qua máy chủ, 10 phút) hoặc bằng tệp sao lưu.
import { withSaveLock } from "./save-store.js";

const KEY_PATTERN = /^lifeAgain[A-Za-z]+$/;
const SKIPPED_KEYS = new Set(["lifeAgainModuleRefresh"]);
const isGameKey = key => KEY_PATTERN.test(key) && !SKIPPED_KEYS.has(key);

function gameKeys(storage) {
  const keys = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (isGameKey(key)) keys.push(key);
  }
  return keys;
}

export function hasSaveData(storage = localStorage) {
  return gameKeys(storage).length > 0;
}

export function createTransferPackage(storage = localStorage) {
  const data = {};
  for (const key of gameKeys(storage)) data[key] = storage.getItem(key);
  return { app: "life-again", v: 1, exportedAt: new Date().toISOString(), data };
}

export function parseTransferPackage(value) {
  let pack = value;
  if (typeof value === "string") {
    try { pack = JSON.parse(value); } catch { throw new Error("Tệp này không phải tệp sao lưu của Life Again."); }
  }
  if (pack?.app !== "life-again") throw new Error("Tệp này không phải tệp sao lưu của Life Again.");
  if (pack.v !== 1) throw new Error("Tệp sao lưu được tạo từ phiên bản game mới hơn. Hãy mở game bản mới nhất rồi thử lại.");
  const entries = Object.entries(pack.data ?? {});
  if (!entries.length || !entries.every(([key, item]) => isGameKey(key) && typeof item === "string")) {
    throw new Error("Dữ liệu sao lưu bị hỏng hoặc trống.");
  }
  return pack;
}

const readJson = text => { try { return JSON.parse(text); } catch { return null; } };

// Tóm tắt ngắn để người chơi biết mình sắp nhận gì trước khi thay dữ liệu.
export function describeTransferPackage(pack) {
  const { data } = pack;
  const parts = [];
  const player = readJson(data.lifeAgainSave)?.player;
  if (player?.name) parts.push(player.isAlive === false ? `Cuộc đời gần nhất: ${player.name} (đã khép lại)` : `Đang chơi: ${player.name}, ${player.age} tuổi`);
  const archive = readJson(data.lifeAgainLifeArchive);
  const lives = Array.isArray(archive) ? archive.length : archive?.entries?.length ?? 0;
  if (lives) parts.push(`${lives} cuộc đời trong sổ`);
  const tickets = readJson(data.lifeAgainTickets)?.tickets;
  if (Number.isInteger(tickets)) parts.push(`${tickets} vé`);
  const achievements = readJson(data.lifeAgainAchievements);
  const unlocked = Array.isArray(achievements) ? achievements.length : Object.keys(achievements ?? {}).length;
  if (unlocked) parts.push(`${unlocked} thành tựu`);
  if (pack.exportedAt) {
    const time = new Date(pack.exportedAt);
    if (!Number.isNaN(time.getTime())) parts.push(`gửi lúc ${time.toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}`);
  }
  return parts.length ? parts.join("; ") + "." : "Dữ liệu cài đặt của game.";
}

// Thay toàn bộ dữ liệu game trên máy này. Ghi lỗi giữa chừng (hết dung lượng) thì trả lại dữ liệu cũ.
export async function applyTransferPackage(pack, storage = localStorage) {
  await withSaveLock(() => {
    const previous = createTransferPackage(storage).data;
    const replace = data => {
      for (const key of gameKeys(storage)) storage.removeItem(key);
      for (const [key, item] of Object.entries(data)) storage.setItem(key, item);
    };
    try {
      replace(pack.data);
    } catch (cause) {
      replace(previous);
      throw new Error("Máy này không đủ chỗ lưu dữ liệu nhận về. Dữ liệu cũ vẫn được giữ nguyên.", { cause });
    }
  });
}

async function postJson(url, body) {
  if (!navigator.onLine) throw new Error("Máy đang không có mạng. Hãy kết nối mạng, hoặc dùng tệp sao lưu.");
  let response;
  try {
    response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
  } catch {
    throw new Error("Không kết nối được máy chủ. Hãy kiểm tra mạng rồi thử lại, hoặc dùng tệp sao lưu.");
  }
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error ?? "Máy chủ đang gặp sự cố. Hãy thử lại sau ít phút.");
  return result;
}

export function uploadTransferPackage(pack) {
  return postJson("./api/transfer", pack);
}

export async function claimTransferPackage(code) {
  return parseTransferPackage(await postJson("./api/transfer/claim", { code }));
}

export function backupFileName(date = new Date()) {
  const pad = n => String(n).padStart(2, "0");
  return `life-again-sao-luu-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.json`;
}
