// Danh sách thành tựu
const achievements = [
  {
    id: "primary-school",
    icon: "🎒",
    title: "Ngày đầu đến trường",
    description: "Đạt 6 tuổi, bước vào giai đoạn tiểu học.",
    test: (player) => player.age >= 6,
  },
  {
    id: "secondary-school",
    icon: "📚",
    title: "Bước vào cấp hai",
    description: "Đạt 11 tuổi, bước vào giai đoạn THCS.",
    test: (player) => player.age >= 11,
  },
  {
    id: "high-school",
    icon: "🏫",
    title: "Tuổi học trò",
    description: "Đạt 15 tuổi, bước vào giai đoạn THPT.",
    test: (player) => player.age >= 15,
  },
  {
    id: "adult",
    icon: "🌱",
    title: "Đã trưởng thành",
    description: "Đạt 18 tuổi.",
    test: (player) => player.age >= 18,
  },
  {
    id: "age-30",
    icon: "🌳",
    title: "Ba mươi năm cuộc đời",
    description: "Đạt 30 tuổi.",
    test: (player) => player.age >= 30,
  },
  {
    id: "age-60",
    icon: "🌅",
    title: "Sáu mươi mùa xuân",
    description: "Đạt 60 tuổi.",
    test: (player) => player.age >= 60,
  },
  {
    id: "health-100",
    icon: "💪",
    title: "Tràn đầy sức sống",
    description: "Đạt 100% sức khỏe.",
    test: (player) => player.health >= 100,
  },
  {
    id: "intelligence-100",
    icon: "🧠",
    title: "Trí tuệ xuất chúng",
    description: "Đạt 100% trí tuệ.",
    test: (player) => player.intelligence >= 100,
  },
  {
    id: "happiness-100",
    icon: "❤️",
    title: "Hạnh phúc trọn vẹn",
    description: "Đạt 100% hạnh phúc.",
    test: (player) => player.happiness >= 100,
  },
  {
    id: "appearance-100",
    icon: "✨",
    title: "Ngoại hình nổi bật",
    description: "Đạt 100% ngoại hình.",
    test: (player) => player.appearance >= 100,
  },
  {
    id: "money-100k",
    icon: "🐷",
    title: "Ống heo đầu tiên",
    description: "Có ít nhất 100.000 VNĐ trong ví.",
    test: (player) => player.money >= 100000,
  },
  {
    id: "money-1m",
    icon: "💰",
    title: "Triệu đồng đầu tiên",
    description: "Có ít nhất 1.000.000 VNĐ trong ví.",
    test: (player) => player.money >= 1000000,
  },
];

const STORAGE_KEY = "lifeAgainAchievements";

let gameState;
let unlocked = {};
let popupQueue = [];

let listDialog;
let listElement;
let countElement;
let unlockDialog;

// Khởi tạo giao diện và đọc thành tựu đã lưu
export function initAchievements(state) {
  gameState = state;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      unlocked = saved;
    }
  } catch (error) {
    console.warn("Không đọc được thành tựu đã lưu:", error);
  }

  listDialog = document.getElementById("achievements-dialog");
  listElement = document.getElementById("achievements-list");
  countElement = document.getElementById("achievements-count");
  unlockDialog = document.getElementById("achievement-unlock-dialog");

  document.getElementById("achievements").addEventListener("click", () => {
    renderAchievements();
    listDialog.showModal();
  });

  document
    .getElementById("close-achievements")
    .addEventListener("click", () => {
      listDialog.close();
    });

  document
    .getElementById("achievement-unlock-confirm")
    .addEventListener("click", () => {
      unlockDialog.close();
    });

  // Khi một hộp thoại đóng, thử hiện thông báo đang chờ.
  // Nhờ vậy thông báo thành tựu không chồng lên hộp sự kiện.
  document.addEventListener(
    "close",
    () => {
      queueMicrotask(showNextAchievement);
    },
    true,
  );

  renderAchievements();
}

// Kiểm tra các thành tựu chưa mở khóa
export function checkAchievements() {
  if (!gameState) return;

  let hasNewAchievement = false;

  for (const achievement of achievements) {
    if (unlocked[achievement.id]) continue;
    if (!achievement.test(gameState.player)) continue;

    unlocked[achievement.id] = {
      unlockedAt: new Date().toISOString(),
    };

    popupQueue.push(achievement);
    hasNewAchievement = true;
  }

  if (hasNewAchievement) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
    renderAchievements();
  }

  showNextAchievement();
}

// Hiển thị toàn bộ danh sách, kể cả mục chưa đạt
function renderAchievements() {
  listElement.replaceChildren();

  const unlockedCount = achievements.filter(
    (achievement) => unlocked[achievement.id],
  ).length;

  countElement.textContent = `${unlockedCount}/${achievements.length}`;

  for (const achievement of achievements) {
    const isUnlocked = Boolean(unlocked[achievement.id]);

    const card = document.createElement("article");
    card.className = "achievement-card";
    card.classList.toggle("is-locked", !isUnlocked);

    const icon = document.createElement("span");
    icon.className = "achievement-icon";
    icon.textContent = achievement.icon;
    icon.setAttribute("aria-hidden", "true");

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = achievement.title;

    const description = document.createElement("p");
    description.textContent = achievement.description;

    const status = document.createElement("span");
    status.className = "achievement-status";
    status.textContent = isUnlocked ? "✓ Đã đạt" : "🔒 Chưa đạt";

    details.append(title, description, status);
    card.append(icon, details);
    listElement.append(card);
  }
}

// Nếu mở khóa nhiều mục cùng lúc, hiện lần lượt
function showNextAchievement() {
  if (popupQueue.length === 0) return;

  // Chờ các hộp thoại khác đóng trước
  if (document.querySelector("dialog[open]")) return;

  const achievement = popupQueue.shift();

  document.getElementById("unlock-icon").textContent = achievement.icon;

  document.getElementById("unlock-title").textContent = achievement.title;

  document.getElementById("unlock-description").textContent =
    achievement.description;

  unlockDialog.showModal();
}
