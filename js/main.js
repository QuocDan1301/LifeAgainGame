import { state } from "./state.js";
import { ageEvents } from "./events.js";
import { initAchievements, checkAchievements } from "./achievements.js";

const statNames = {
  health: "Sức khỏe",
  intelligence: "Trí tuệ",
  happiness: "Hạnh phúc",
  appearance: "Ngoại hình",
};

const savedGame = localStorage.getItem("lifeAgainSave");
let hasLoadedGame = false;

// Khôi phục bản lưu nếu có
if (savedGame) {
  try {
    const savedState = JSON.parse(savedGame);

    if (savedState?.player && Array.isArray(savedState.logs)) {
      Object.assign(state.player, savedState.player);
      state.logs = savedState.logs;
      state.pendingEvent = savedState.pendingEvent ?? null;

      hasLoadedGame = true;
    }
  } catch (error) {
    console.warn("Không đọc được dữ liệu lưu:", error);
  }
}

// Chỉ tạo cuộc đời mới nếu chưa khôi phục được bản lưu
if (!hasLoadedGame) {
  state.player.name = await askCharacterName();
  state.player.age = 0;
  state.logs = [];
  state.pendingEvent = null;

  // Tạo chỉ số ban đầu
  state.player.health = randomStat();
  state.player.intelligence = randomStat();
  state.player.happiness = randomStat();
  state.player.appearance = randomStat();

  const birthStories = [
    "Bạn chào đời trong vòng tay yêu thương của gia đình.",
    "Tiếng khóc đầu tiên của bạn khiến cả nhà xúc động.",
    "Bạn chào đời vào một buổi sáng yên bình.",
  ];

  const randomIndex = Math.floor(Math.random() * birthStories.length);

  state.logs.push({
    age: 0,
    content: `Bạn tên là ${state.player.name}. ${birthStories[randomIndex]}`,
  });

  localStorage.setItem("lifeAgainSave", JSON.stringify(state));
}

// Lấy phần tử HTML
const nameElement = document.getElementById("player-name");
const ageElement = document.getElementById("player-age");

// Đưa dữ liệu nhân vật lên giao diện
nameElement.textContent = state.player.name;
ageElement.textContent = state.player.age;

const ageButton = document.getElementById("age-up");
const logElement = document.getElementById("life-log");

logElement.replaceChildren();

state.logs.forEach((log) => {
  renderLogEntry(log);
});
// Sau khi khôi phục xong nhật ký, cuộn xuống cuối
requestAnimationFrame(() => {
  const logContainer = logElement.parentElement;
  logContainer.scrollTop = logContainer.scrollHeight;
});

const menuToggle = document.getElementById("menu-button");
const menuPanel = document.getElementById("menu-panel");

function setMenuOpen(isOpen) {
  menuPanel.hidden = !isOpen;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
}

// Bấm ba gạch để mở hoặc đóng
menuToggle.addEventListener("click", () => {
  setMenuOpen(menuPanel.hidden);
});

// Bấm ra ngoài để đóng menu
document.addEventListener("click", (event) => {
  if (!menuToggle.contains(event.target) && !menuPanel.contains(event.target)) {
    setMenuOpen(false);
  }
});

// Nhấn Escape để đóng menu
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menuPanel.hidden) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

const restartButton = document.getElementById("restart-button");
const restartDialog = document.getElementById("restart-dialog");
const cancelRestart = document.getElementById("cancel-restart");
const confirmRestart = document.getElementById("confirm-restart");

// Mở hộp xác nhận
restartButton.addEventListener("click", () => {
  setMenuOpen(false);
  restartDialog.showModal();
});

// Hủy: giữ nguyên tiến trình
cancelRestart.addEventListener("click", () => {
  restartDialog.close();
  menuToggle.focus();
});

// Xác nhận: xóa bản lưu rồi bắt đầu lại
confirmRestart.addEventListener("click", () => {
  localStorage.removeItem("lifeAgainSave");
  window.location.reload();
});

function renderStats() {
  // Sức khỏe
  document.getElementById("health").value = state.player.health;
  document.getElementById("health-value").textContent =
    `${state.player.health}%`;

  // Trí tuệ
  document.getElementById("smarts").value = state.player.intelligence;
  document.getElementById("smarts-value").textContent =
    `${state.player.intelligence}%`;

  // Hạnh phúc
  document.getElementById("happiness").value = state.player.happiness;
  document.getElementById("happiness-value").textContent =
    `${state.player.happiness}%`;

  // Ngoại hình
  document.getElementById("looks").value = state.player.appearance;
  document.getElementById("looks-value").textContent =
    `${state.player.appearance}%`;
  updateStatColor("health", state.player.health);
  updateStatColor("smarts", state.player.intelligence);
  updateStatColor("happiness", state.player.happiness);
  updateStatColor("looks", state.player.appearance);
}

// Hiển thị chỉ số khi mở game
renderStats();

function changeStat(value) {
  const change = Math.floor(Math.random() * 7) - 3;

  return Math.max(0, Math.min(100, value + change));
}

function renderLogContent(element, text) {
  element.replaceChildren();

  // Tách các số có dấu + hoặc - ra khỏi nội dung
  const parts = text.split(/([+-]\d+(?:\.\d{3})*)/g);

  parts.forEach((part) => {
    if (/^[+-]\d+(?:\.\d{3})*$/.test(part)) {
      const number = document.createElement("span");

      number.textContent = part;
      number.classList.add(
        part.startsWith("+") ? "stat-increase" : "stat-decrease",
      );

      element.append(number);
    } else {
      // Phần chữ giữ màu bình thường
      element.append(document.createTextNode(part));
    }
  });
}
function randomStat() {
  return Math.floor(Math.random() * 81) + 10;
}
function updateStatColor(id, value) {
  const bar = document.getElementById(id);
  let color;

  if (value <= 20) {
    color = "#e53935"; // Đỏ
  } else if (value <= 50) {
    color = "#fb8c00"; // Cam
  } else if (value <= 80) {
    color = "#fdd835"; // Vàng
  } else {
    color = "#43a047"; // Xanh lá
  }

  bar.style.setProperty("--stat-color", color);
}
function renderMoney() {
  const moneyElement = document.getElementById("money-value");

  moneyElement.textContent = state.player.money.toLocaleString("vi-VN");
}

// Hiển thị tiền khi mở game
renderMoney();
function renderEducation() {
  const age = state.player.age;
  let status;

  // Khi đã có công việc, hiển thị tên công việc
  if (state.player.job) {
    status = state.player.job;
  } else if (age < 3) {
    status = "Chưa đi học";
  } else if (age < 6) {
    status = "Học mẫu giáo";
  } else if (age < 11) {
    status = "Học sinh tiểu học";
  } else if (age < 15) {
    status = "Học sinh THCS";
  } else if (age < 18) {
    status = "Học sinh THPT";
  } else {
    status = "Chưa có việc làm";
  }

  document.getElementById("character-status").textContent = status;
}

// Hiển thị khi mở hoặc tải lại game
renderEducation();

function askCharacterName() {
  const dialog = document.getElementById("name-dialog");
  const form = document.getElementById("name-form");
  const input = document.getElementById("character-name-input");
  const error = document.getElementById("name-error");

  return new Promise((resolve) => {
    // Yêu cầu nhập tên hợp lệ trước khi bắt đầu
    function preventCancel(event) {
      event.preventDefault();
    }

    function handleSubmit(event) {
      event.preventDefault();

      const name = input.value.trim();
      const words = name.split(/\s+/);

      if (name === "" || words.length > 2) {
        error.textContent =
          name === ""
            ? "Bạn chưa nhập tên nhân vật."
            : "Tên chỉ được tối đa 2 từ. Bạn hãy nhập lại.";

        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }

      // Mỗi từ chỉ gồm chữ cái, có hỗ trợ tiếng Việt
      const validWord = /^\p{L}[\p{L}\p{M}]*$/u;

      if (!words.every((word) => validWord.test(word))) {
        error.textContent =
          "Tên chỉ được chứa chữ cái, không có số hoặc ký tự đặc biệt.";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }

      error.textContent = "";
      input.removeAttribute("aria-invalid");

      form.removeEventListener("submit", handleSubmit);
      dialog.removeEventListener("cancel", preventCancel);
      dialog.close();

      resolve(words.join(" "));
    }

    form.addEventListener("submit", handleSubmit);
    dialog.addEventListener("cancel", preventCancel);
    dialog.showModal();
  });
}

function renderLogEntry(log) {
  const logItem = document.createElement("section");
  logItem.classList.add("log-entry");

  const title = document.createElement("h3");
  title.textContent = `${log.age} tuổi`;

  const content = document.createElement("p");

  // Giữ màu xanh/đỏ cho các số tăng, giảm
  renderLogContent(content, log.content);

  logItem.append(title, content);
  logElement.append(logItem);
}
const activitiesButton = document.getElementById("activities");
const activitiesDialog = document.getElementById("activities-dialog");
const closeActivities = document.getElementById("close-activities");

activitiesButton.addEventListener("click", () => {
  activitiesDialog.showModal();
});

closeActivities.addEventListener("click", () => {
  activitiesDialog.close();
});
const eventDialog = document.getElementById("event-dialog");
const eventTitle = document.getElementById("event-title");
const eventImage = document.getElementById("event-image");
const eventContent = document.getElementById("event-content");
const eventChoices = document.getElementById("event-choices");
const eventConfirm = document.getElementById("event-confirm");

// Lưu toàn bộ tiến trình, gồm cả bước sự kiện đang mở
function saveEventProgress() {
  localStorage.setItem("lifeAgainSave", JSON.stringify(state));
}

// Đặt ảnh cho từng bước
function setEventImage(src, alt = "") {
  eventImage.hidden = !src;

  if (src) {
    eventImage.alt = alt;
    eventImage.src = src;
  } else {
    eventImage.removeAttribute("src");
  }
}

// Hiển thị bước chọn hành động hoặc bước kết quả
function showPendingEvent() {
  const pending = state.pendingEvent;
  if (!pending) return;

  ageButton.disabled = true;
  eventChoices.replaceChildren();

  eventTitle.textContent = `${pending.title}`;

  setEventImage(pending.image, pending.imageAlt);

  if (pending.stage === "choice") {
    // Bước 1: tình huống và các lựa chọn
    eventContent.textContent = pending.text;
    eventConfirm.hidden = true;

    pending.choices.forEach((choice, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "event-choice";
      button.textContent = choice.label;

      button.addEventListener("click", () => {
        chooseEventAction(index);
      });

      eventChoices.append(button);
    });
  } else {
    // Bước 2: nội dung kết quả và chỉ số thay đổi
    renderLogContent(eventContent, pending.content);

    eventConfirm.textContent = pending.confirmText ?? "Xác nhận";

    eventConfirm.hidden = false;
  }

  if (!eventDialog.open) {
    eventDialog.showModal();
  }

  // Đưa nội dung mới về đầu hộp thoại
  eventDialog.scrollTop = 0;

  if (pending.stage === "choice") {
    eventChoices.querySelector("button")?.focus({
      preventScroll: true,
    });
  } else {
    eventConfirm.focus({ preventScroll: true });
  }
}

// Tính kết quả sau khi người chơi chọn hành động
function chooseEventAction(index) {
  const pending = state.pendingEvent;

  // Không cho chọn lại khi đã chuyển sang bước kết quả
  if (!pending || pending.stage !== "choice") return;

  const choice = pending.choices[index];
  if (!choice) return;

  const updates = { age: pending.age };
  const changes = [];

  // Tính mức thay đổi của bốn chỉ số
  for (const stat in choice.effects ?? {}) {
    if (!Object.hasOwn(statNames, stat)) continue;

    const oldValue = state.player[stat];
    const newValue = Math.max(
      0,
      Math.min(100, oldValue + choice.effects[stat]),
    );

    updates[stat] = newValue;

    const actualChange = newValue - oldValue;

    if (actualChange !== 0) {
      const sign = actualChange > 0 ? "+" : "";

      changes.push(`${statNames[stat]} ${sign}${actualChange}`);
    }
  }

  // Tiền được xử lý riêng, không giới hạn ở 100
  if (choice.money) {
    const oldMoney = state.player.money;
    const newMoney = Math.max(0, oldMoney + choice.money);
    const actualChange = newMoney - oldMoney;

    updates.money = newMoney;

    if (actualChange !== 0) {
      const sign = actualChange > 0 ? "+" : "";

      changes.push(`Tiền ${sign}${actualChange.toLocaleString("vi-VN")} VNĐ`);
    }
  }

  const resultContent =
    choice.text + (changes.length ? "\n" + changes.join(" · ") : "");

  // Chuyển sang bước kết quả và giữ lại hành động đã chọn
  state.pendingEvent = {
    stage: "result",
    age: pending.age,
    title: choice.title ?? "Kết quả",
    image: choice.image ?? "",
    imageAlt: choice.imageAlt ?? "",
    confirmText: choice.confirmText ?? "Xác nhận",
    content: resultContent,

    // Nhật ký ghi cả tình huống, lựa chọn và kết quả
    logContent:
      `${pending.text}\n` + `Bạn chọn: ${choice.label}\n` + resultContent,

    updates: updates,
  };

  saveEventProgress();
  showPendingEvent();
}

// Bấm tăng tuổi: tạo tình huống, chưa áp dụng kết quả
ageButton.addEventListener("click", () => {
  if (state.pendingEvent) return;

  const nextAge = state.player.age + 1;
  const stories = ageEvents[nextAge];

  const story = stories?.length
    ? stories[Math.floor(Math.random() * stories.length)]
    : {
        title: "Một năm mới",
        text: "Một năm nữa đã trôi qua.",
        effects: {},
      };

  // Sự kiện cũ chưa có choices vẫn chạy với một nút Tiếp tục
  const choices = story.choices?.length
    ? story.choices
    : [
        {
          label: "Tiếp tục",
          title: story.title ?? "Kết quả",
          text: story.text,
          effects: story.effects ?? {},
          money: story.money ?? 0,
          image: story.image ?? "",
          imageAlt: story.imageAlt ?? "",
          confirmText: story.confirmText ?? "Xác nhận",
        },
      ];

  state.pendingEvent = {
    stage: "choice",
    age: nextAge,
    title: story.title ?? "Sự kiện",
    text: story.text,
    image: story.image ?? "",
    imageAlt: story.imageAlt ?? "",
    choices: choices,
  };

  saveEventProgress();
  showPendingEvent();
});

// Xác nhận kết quả: cập nhật nhân vật và ghi nhật ký
eventConfirm.addEventListener("click", () => {
  const pending = state.pendingEvent;

  if (!pending || pending.stage === "choice") return;

  Object.assign(state.player, pending.updates);

  const log = {
    age: pending.age,
    content: pending.logContent ?? pending.content,
  };

  state.logs.push(log);
  state.pendingEvent = null;

  saveEventProgress();

  ageElement.textContent = state.player.age;
  renderStats();
  renderMoney();
  renderEducation();
  renderLogEntry(log);

  eventDialog.close();
  ageButton.disabled = false;
  ageButton.focus({ preventScroll: true });

  const logContainer = logElement.parentElement;
  logContainer.scrollTop = logContainer.scrollHeight;
  checkAchievements();
});

// Ảnh hỏng không ngăn người chơi tiếp tục
eventImage.addEventListener("error", () => {
  eventImage.hidden = true;
});

// Phải giải quyết sự kiện, không bỏ qua bằng Escape
eventDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
});

// Tải lại trang sẽ mở đúng bước đang chờ
if (state.pendingEvent) {
  showPendingEvent();
}
initAchievements(state);
checkAchievements();
