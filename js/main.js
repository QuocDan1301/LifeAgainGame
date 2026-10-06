import { state } from "./state.js";
import { ageEvents } from "./events.js";

const statNames = {
  health: "Sức khỏe",
  intelligence: "Trí tuệ",
  happiness: "Hạnh phúc",
  appearance: "Ngoại hình",
};

const savedGame = localStorage.getItem("lifeAgainSave");

if (savedGame) {
  try {
    const savedState = JSON.parse(savedGame);

    if (savedState?.player && Array.isArray(savedState.logs)) {
      Object.assign(state.player, savedState.player);
      state.logs = savedState.logs;
    }
  } catch (error) {
    console.warn("Không đọc được dữ liệu lưu:", error);
  }
}

if (!savedGame) {
  const enteredName = prompt("Nhập tên nhân vật của bạn:");

  if (enteredName !== null && enteredName.trim() !== "") {
    state.player.name = enteredName.trim();
  }
  // Tạo chỉ số riêng cho cuộc đời mới
  state.player.health = randomStat();
  state.player.intelligence = randomStat();
  state.player.happiness = randomStat();
  state.player.appearance = randomStat();
  // Những câu chuyện mở đầu
  const birthStories = [
    "Bạn chào đời trong vòng tay yêu thương của gia đình.",
    "Tiếng khóc đầu tiên của bạn khiến cả nhà xúc động.",
    "Bạn chào đời vào một buổi sáng yên bình.",
  ];

  // Chọn ngẫu nhiên một câu chuyện
  const randomIndex = Math.floor(Math.random() * birthStories.length);

  // Tạo nhật ký đầu tiên
  state.logs.push({
    age: 0,
    content: `Bạn tên là ${state.player.name}. ${birthStories[randomIndex]}`,
  });

  // Lưu cuộc đời mới
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
  const logItem = document.createElement("section");
  logItem.classList.add("log-entry");

  const title = document.createElement("h3");
  title.textContent = `${log.age} tuổi`;

  const content = document.createElement("p");
  renderLogContent(content, log.content);

  logItem.append(title, content);
  logElement.append(logItem);
});
// Sau khi khôi phục xong nhật ký, cuộn xuống cuối
requestAnimationFrame(() => {
  const logContainer = logElement.parentElement;
  logContainer.scrollTop = logContainer.scrollHeight;
});

ageButton.addEventListener("click", () => {
  // Tăng tuổi và cập nhật màn hình
  state.player.age += 1;
  ageElement.textContent = state.player.age;
  state.player.health;
  state.player.intelligence;
  state.player.happiness;
  state.player.appearance;

  const stories = ageEvents[state.player.age];

  let message = "Một năm nữa đã trôi qua.";
  if (stories && stories.length > 0) {
    const randomIndex = Math.floor(Math.random() * stories.length);
    const story = stories[randomIndex];

    message = story.text;

    const changes = [];

    for (const stat in story.effects) {
      const oldValue = state.player[stat];
      const change = story.effects[stat];

      const newValue = Math.max(0, Math.min(100, oldValue + change));

      state.player[stat] = newValue;

      // Tính mức thay đổi thực tế
      const actualChange = newValue - oldValue;

      if (actualChange !== 0) {
        const sign = actualChange > 0 ? "+" : "";

        changes.push(`${statNames[stat]} ${sign}${actualChange}`);
      }
    }

    // Thêm một dòng mô tả thay đổi vào nội dung nhật ký
    if (changes.length > 0) {
      message += "\n" + changes.join(" · ");
    }
  }

  // Cập nhật chỉ số sau khi xử lý sự kiện
  renderStats();

  // Lưu tuổi và nội dung cùng nhau
  state.logs.push({
    age: state.player.age,
    content: message,
  });

  // Tạo khối nhật ký cho một năm
  const logItem = document.createElement("section");
  logItem.classList.add("log-entry");

  // Tiêu đề tuổi
  const title = document.createElement("h3");
  title.textContent = `${state.player.age} tuổi`;

  // Nội dung bên dưới
  const content = document.createElement("p");
  renderLogContent(content, message);

  // Ghép tiêu đề và nội dung vào khối nhật ký
  logItem.append(title, content);
  logElement.append(logItem);
  const logContainer = logElement.parentElement;
  logContainer.scrollTop = logContainer.scrollHeight;
  localStorage.setItem("lifeAgainSave", JSON.stringify(state));
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

restartButton.addEventListener("click", () => {
  const confirmed = confirm(
    "Bạn muốn bắt đầu cuộc đời mới? Tiến trình hiện tại sẽ bị xóa.",
  );

  if (!confirmed) return;

  // Xóa bản lưu của game
  localStorage.removeItem("lifeAgainSave");

  // Tải lại trang để lấy dữ liệu ban đầu trong state.js
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
  const parts = text.split(/([+-]\d+)/g);

  parts.forEach((part) => {
    if (/^[+-]\d+$/.test(part)) {
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
