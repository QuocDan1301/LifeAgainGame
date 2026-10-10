import { celebrateAchievement } from "./achievement-confetti.js";
import { formatMoneyText } from "./money-format.js";
import { scrollerOf } from "./dialog-close.js";
import { playOutcomeSound } from "./music.js";
import {
  achievements,
  achievementGroups,
  meetsAchievement,
} from "./achievements-data.js";
export { recordAchievementFlags } from "./achievements-data.js";

const STORAGE_KEY = "lifeAgainAchievements";
const QUEUE_KEY = "lifeAgainAchievementQueue";
let gameState;
let unlocked = {};
let queue = [];
let activeId = null;
let stopConfetti = () => {};
let initialized = false;
let listDialog, listElement, countElement, unlockDialog;
const groupOpen = new Map();

const get = (id) => {
  const element = document.getElementById(id);
  if (!element)
    throw new Error(`Thiếu phần tử HTML id="${id}" cho hệ thống thành tựu.`);
  return element;
};
const known = (id) => achievements.some((entry) => entry.id === id);
const achieved = (id) => Object.hasOwn(unlocked, id) && Boolean(unlocked[id]);
const create = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = formatMoneyText(text);
  return element;
};

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch (error) {
    console.warn(`Không đọc được ${key}:`, error);
    return fallback;
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.warn("Không lưu được thành tựu trên thiết bị:", error);
  }
}

export function initAchievements(state) {
  gameState = state;
  // Ngăn gắn sự kiện trùng nếu vô tình gọi khởi tạo lần thứ hai.
  if (initialized) {
    renderAchievements();
    return;
  }
  listDialog = get("achievements-dialog");
  listElement = get("achievements-list");
  countElement = get("achievements-count");
  unlockDialog = get("achievement-unlock-dialog");
  const openButton = get("achievements");
  const closeButton = get("close-achievements");
  const confirmButton = get("achievement-unlock-confirm");
  get("unlock-icon");
  get("unlock-title");
  get("unlock-description");

  const saved = readJSON(STORAGE_KEY, {});
  unlocked =
    saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  const savedQueue = readJSON(QUEUE_KEY, []);
  queue = Array.isArray(savedQueue)
    ? [...new Set(savedQueue.filter((id) => known(id) && achieved(id)))]
    : [];

  openButton.addEventListener("click", () => {
    if (document.querySelector("dialog[open]")) return;

    groupOpen.clear();
    renderAchievements();
    listDialog.showModal();
  });
  closeButton.addEventListener("click", () => listDialog.close());
  confirmButton.addEventListener("click", () => unlockDialog.close());
  const resetButton = get("reset-achievements");

  resetButton.addEventListener("click", () => {
    const confirmed = window.confirm(
      "Bạn muốn xóa toàn bộ thành tựu đã đạt? Không thể hoàn tác.",
    );

    if (!confirmed) return;

    // Đặt lại thành tựu và thông báo đang chờ.
    unlocked = {};
    queue = [];
    activeId = null;
    stopConfetti();

    // Xóa dấu ghi nhận thành tựu của nhân vật.
    gameState.player.achievementFlags = {};

    // Lưu dữ liệu sau khi reset.
    persist();
    localStorage.setItem("lifeAgainSave", JSON.stringify(gameState));

    // Hiển thị lại các thẻ mờ và bộ đếm thành tựu.
    renderAchievements();
  });
  document.addEventListener(
    "close",
    (event) => {
      if (event.target === unlockDialog) stopConfetti();
      if (event.target === unlockDialog && activeId) {
        const closedId = activeId;
        queue = queue.filter((id) => id !== activeId);
        activeId = null;
        persist();
        document.dispatchEvent(new CustomEvent("achievement-closed", { detail: closedId }));
      }
      // Nhường cho code xác nhận sự kiện hoàn tất trước khi mở thông báo tiếp.
      queueMicrotask(showNextAchievement);
    },
    true,
  );

  initialized = true;
  renderAchievements();
  showNextAchievement();
}

export function checkAchievements() {
  if (!initialized || !gameState?.player) return;
  let changed = false;
  const lifeIds = new Set(gameState.player.lifeAchievementIds ?? []);
  const previousCount = lifeIds.size;
  for (const achievement of achievements) {
    if (meetsAchievement(achievement, gameState.player)) lifeIds.add(achievement.id);
    if (
      achieved(achievement.id) ||
      !meetsAchievement(achievement, gameState.player)
    )
      continue;
    unlocked[achievement.id] = { unlockedAt: new Date().toISOString() };
    queue.push(achievement.id);
    changed = true;
  }
  if (lifeIds.size !== previousCount) {
    gameState.player.lifeAchievementIds = [...lifeIds];
    localStorage.setItem("lifeAgainSave", JSON.stringify(gameState));
  }
  if (changed) {
    persist();
    renderAchievements();
  }
  showNextAchievement();
}

function makeCard(achievement) {
  const isUnlocked = achieved(achievement.id);
  const card = create("article", "achievement-card");
  card.classList.toggle("is-locked", !isUnlocked);
  const icon = create("span", "achievement-icon", achievement.icon);
  icon.setAttribute("aria-hidden", "true");
  const body = create("div", "achievement-card-body");
  body.append(
    create("h4", "", achievement.title),
    create("p", "", achievement.description),
    create(
      "span",
      "achievement-status",
      isUnlocked ? "✓ Đã đạt" : "🔒 Chưa đạt",
    ),
  );
  card.append(icon, body);
  return card;
}

function renderAchievements() {
  const scrollTop = scrollerOf(listDialog).scrollTop;
  const total = achievements.filter((entry) => achieved(entry.id)).length;
  countElement.textContent = `${total}/${achievements.length}`;
  listElement.replaceChildren();
  for (const group of achievementGroups) {
    const entries = achievements.filter((entry) => entry.group === group.id);
    const count = entries.filter((entry) => achieved(entry.id)).length;
    const details = create("details", "achievement-group");
    details.open = groupOpen.get(group.id) ?? false;
    const summary = create("summary", "achievement-group-heading");
    summary.append(
      create("span", "", group.title),
      create("span", "achievement-group-count", `${count}/${entries.length}`),
    );
    details.append(summary);
    details.addEventListener("toggle", () => {
      if (details.isConnected) groupOpen.set(group.id, details.open);
    });
    for (const section of group.sections) {
      const wrapper = create("section", "achievement-subgroup");
      wrapper.append(create("h3", "achievement-subgroup-title", section));
      const cards = create("div", "achievement-cards");
      for (const entry of entries.filter(
        (entry) => entry.section === section,
      )) {
        cards.append(makeCard(entry));
      }
      wrapper.append(cards);
      details.append(wrapper);
    }
    listElement.append(details);
  }
  scrollerOf(listDialog).scrollTop = scrollTop;
}

function showNextAchievement() {
  if (initialized && queue.length === 0 && !activeId && !gameState.pendingEvent &&
      (gameState.player.age < 15 || achieved("high-school")) && !document.querySelector("dialog[open]")) {
    document.dispatchEvent(new Event("achievement-flow-idle"));
  }
  if (!initialized || queue.length === 0 || activeId) return;
  // Sự kiện đang chờ phải được giải quyết trước; không mở chồng hộp thoại.
  if (gameState.pendingEvent || document.querySelector("dialog[open]")) return;
  const achievement = achievements.find((entry) => entry.id === queue[0]);
  if (!achievement) return;
  activeId = achievement.id;
  get("unlock-icon").textContent = achievement.icon;
  get("unlock-title").textContent = achievement.title;
  get("unlock-description").textContent = formatMoneyText(achievement.description);
  unlockDialog.showModal();
  stopConfetti();
  stopConfetti = celebrateAchievement(unlockDialog);
  playOutcomeSound("achievement");
  get("achievement-unlock-confirm").focus({ preventScroll: true });
}
