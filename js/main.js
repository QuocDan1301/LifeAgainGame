import { renderAvatar } from "./avatar.js";
import { state } from "./state.js";
import { ageEvents } from "./events.js";
import { careerEvent } from "./career-event.js";
import { createSchoolEvent } from "./career-schools.js";
import {
  initAchievements,
  checkAchievements,
  recordAchievementFlags,
} from "./achievements.js";
const statNames = {
  health: "Sức khỏe",
  intelligence: "Trí tuệ",
  happiness: "Hạnh phúc",
  appearance: "Ngoại hình",
};
// boot.js chỉ nạp file này sau khi chọn Chơi tiếp hoặc tạo nhân vật.
// Lấy phần tử HTML
const nameElement = document.getElementById("player-name");
const ageElement = document.getElementById("player-age");
// Đưa dữ liệu nhân vật lên giao diện
nameElement.textContent = state.player.name;
renderAvatar(state.player);
ageElement.textContent = state.player.age;
document.getElementById("player-province").textContent =
  state.player.province || "";
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
// Xác nhận: giữ tiến trình và trở về màn hình vé
confirmRestart.addEventListener("click", () => {
  saveEventProgress();
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
  } else if (state.player.careerPath) {
    const careerPath = state.player.careerPath;
    status = careerPath.school ? `Học ${careerPath.field}` : careerPath.status;
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
  // Cả lựa chọn cũ đã lưu cũng chuyển sang chọn trường nếu chưa chọn trường/hướng huấn luyện.
  if (choice.careerPath && !Object.hasOwn(choice.careerPath, "school")) {
    const schoolEvent = createSchoolEvent(choice.careerPath);
    state.pendingEvent = {
      stage: "choice",
      age: pending.age,
      title: schoolEvent.title,
      text: schoolEvent.text,
      choices: schoolEvent.choices,
      logPrefix: `${pending.logPrefix ?? ""}${pending.text}\nBạn chọn: ${choice.label}\n`,
    };
    saveEventProgress();
    showPendingEvent();
    return;
  }
  const updates = { age: pending.age };
  if (choice.careerPath) updates.careerPath = choice.careerPath;
  if (choice.death === true) updates.isAlive = false;
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
    achievementIds: choice.achievementIds ?? [],
    // Nhật ký ghi cả tình huống, lựa chọn và kết quả
    logContent:
      `${pending.logPrefix ?? ""}${pending.text}\n` +
      `Bạn chọn: ${choice.label}\n` +
      resultContent,
    updates: updates,
  };
  saveEventProgress();
  showPendingEvent();
}
// Bấm tăng tuổi: tạo tình huống, chưa áp dụng kết quả
ageButton.addEventListener("click", () => {
  if (state.pendingEvent || state.player.isAlive === false) return;
  const nextAge = state.player.age + 1;

  // Kiểm tra tuổi thọ trước khi chọn có/không có sự kiện.
  if (checkOldAgeDeath(nextAge)) {
    return;
  }

  const stories = ageEvents[nextAge];
  // Tuổi này chưa có sự kiện: ghi nhật kí và tăng tuổi trực tiếp.
  // 60% có sự kiện, 40% không có sự kiện.
  const eventChance = 0.6;

  const hasEvent =
    nextAge === 18 ||
    (Array.isArray(stories) &&
      stories.length > 0 &&
      Math.random() < eventChance);

  if (!hasEvent) {
    state.player.age = nextAge;

    const log = {
      age: nextAge,
      content: "Không có gì thay đổi, mọi thứ vẫn vậy.",
    };

    state.logs.push(log);
    saveEventProgress();

    // Cập nhật giao diện theo tuổi mới.
    ageElement.textContent = state.player.age;
    renderAvatar(state.player);
    renderEducation();
    renderLogEntry(log);

    // Cuộn xuống dòng nhật kí vừa thêm.
    const logContainer = logElement.parentElement;
    logContainer.scrollTop = logContainer.scrollHeight;

    // Vẫn kiểm tra các thành tựu về tuổi.
    checkAchievements();

    // Kết thúc lượt, không mở popup sự kiện.
    return;
  }
  const story =
    nextAge === 18
      ? careerEvent
      : stories?.length
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
          achievementIds: story.achievementIds ?? [],
          death: story.death === true,
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
  recordAchievementFlags(state, pending.achievementIds ?? []);
  const log = {
    age: pending.age,
    content: pending.logContent ?? pending.content,
  };
  state.logs.push(log);
  state.pendingEvent = null;
  const died = state.player.isAlive === false || state.player.health <= 0;
  if (died) {
    state.player.isAlive = false;
    state.logs.push({
      age: state.player.age,
      content: "Hành trình cuộc đời của bạn đã khép lại.",
    });
  }
  saveEventProgress();
  ageElement.textContent = state.player.age;
  renderAvatar(state.player);
  renderStats();
  renderMoney();
  renderEducation();
  renderLogEntry(log);
  if (died) renderLogEntry(state.logs[state.logs.length - 1]);
  eventDialog.close();
  ageButton.disabled = state.player.isAlive === false;
  ageButton.focus({ preventScroll: true });
  const logContainer = logElement.parentElement;
  logContainer.scrollTop = logContainer.scrollHeight;
  if (state.player.isAlive === false) {
    document.getElementById("death-content").textContent =
      `${state.player.name} đã kết thúc cuộc đời ở tuổi ${state.player.age}.`;
    document.getElementById("death-dialog").showModal();
  }
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
const fortunePredictions = [
  "Thuở nhỏ có chút nghịch ngợm, lớn lên lại rất biết lo xa. Một cơ hội bất ngờ có thể đưa bạn đến cuộc sống sung túc.",
  "Đường tình duyên đến hơi chậm, nhưng người ở lại sẽ khiến bạn hiểu rằng chờ đợi cũng đáng giá.",
  "Bạn có duyên với học hành và khám phá. Một điều tưởng như vô dụng hôm nay có thể trở thành tài năng nổi bật mai sau.",
  "Cuộc đời bạn có vài lần đổi hướng bất ngờ. Đừng vội buồn khi một cánh cửa đóng lại, có thể bạn đang đứng nhầm nhà.",
  "Bạn có số kiếm được tiền, nhưng ví tiền cũng rất thích đi du lịch. Hãy giữ nó ở nhà thường xuyên hơn.",
  "Bạn dễ được quý mến nhờ sự chân thành. Trong lúc khó khăn, một người bạn cũ có thể mang đến điều bất ngờ.",
  "Tuổi trẻ nhiều trải nghiệm, trung niên dần ổn định, về già có người cùng uống trà và kể chuyện cũ.",
  "Bạn có một tài năng đang ngủ quên. Biết đâu chỉ một lần thử điều mới cũng đủ đánh thức nó.",
  "Tình yêu có thể xuất hiện vào lúc bạn bận rộn nhất. Nhớ thỉnh thoảng ngẩng đầu lên, đừng chỉ nhìn vào công việc.",
  "Bạn có duyên với việc kinh doanh. Tuy nhiên, quả cầu chưa nhìn rõ bạn sẽ làm chủ nhà hàng hay làm chủ một xe hủ tiếu.",
  "Cuộc đời bạn không thiếu tiếng cười. Đôi khi chính sự hài hước sẽ giúp bạn vượt qua một năm đầy thử thách.",
  "Một chuyến đi xa có thể thay đổi cách bạn nhìn cuộc sống. Hãy nhớ mang hành lý, lòng can đảm và cả sạc điện thoại.",
  "Bạn có số gặp những chuyện kỳ lạ. Nếu một ngày có ai rủ tìm kho báu, hãy suy nghĩ kỹ trước khi xách ba lô.",
  "Thành công có thể đến sau vài lần vấp ngã. Người kiên trì đi tiếp thường có nhiều chuyện hay để kể hơn.",
  "Gia đình sẽ là một phần ấm áp trong cuộc đời bạn. Những ngày bình thường đôi khi lại là những ngày đáng nhớ nhất.",
  "Quả cầu nhìn thấy một tương lai sáng lạn… nhưng hơi mờ vì bạn chưa lau kính. Hãy tự viết tiếp vận mệnh của mình!",
];
const fortuneButton = document.getElementById("fortune-button");
const fortuneDialog = document.getElementById("fortune-dialog");
const fortuneName = document.getElementById("fortune-name");
const fortuneContent = document.getElementById("fortune-content");
const closeFortuneButton = document.getElementById("close-fortune");
fortuneButton.addEventListener("click", () => {
  // Không mở chồng lên popup khác.
  if (document.querySelector("dialog[open]")) return;
  // Chỉ chọn lời tiên đoán nếu nhân vật chưa từng xem.
  if (
    typeof state.player.fortune !== "string" ||
    state.player.fortune.trim() === ""
  ) {
    const randomIndex = Math.floor(Math.random() * fortunePredictions.length);
    state.player.fortune = fortunePredictions[randomIndex];
    // Lưu cùng nhân vật để tải lại trang vẫn giữ nguyên.
    localStorage.setItem("lifeAgainSave", JSON.stringify(state));
  }
  fortuneName.textContent = `Dành cho ${state.player.name}`;
  fortuneContent.textContent = state.player.fortune;
  // Đóng menu ba gạch bằng hàm bạn đang có.
  setMenuOpen(false);
  fortuneDialog.showModal();
});
closeFortuneButton.addEventListener("click", () => {
  fortuneDialog.close();
});

// Nhân vật đã mất không thể tiếp tục tăng tuổi.
const deathDialog = document.getElementById("death-dialog");
deathDialog.addEventListener("cancel", (event) => event.preventDefault());
document
  .getElementById("return-after-death")
  .addEventListener("click", () => window.location.reload());
function checkOldAgeDeath(nextAge) {
  let survivalChance = 1;

  if (nextAge >= 106) {
    survivalChance = 0;
  } else if (nextAge >= 100) {
    survivalChance = 0.4;
  } else if (nextAge >= 98) {
    survivalChance = 0.7;
  }

  // Chưa đến tuổi kiểm tra hoặc đã vượt qua lần kiểm tra.
  if (
    survivalChance === 1 ||
    (survivalChance > 0 && Math.random() < survivalChance)
  ) {
    return false;
  }

  // Nhân vật qua đời tại tuổi mới.
  state.player.age = nextAge;
  state.player.isAlive = false;
  state.player.health = 0;
  state.pendingEvent = null;

  const log = {
    age: nextAge,
    content:
      `Bạn đã qua đời ở tuổi ${nextAge}. ` +
      "Hành trình khép lại, những kỷ niệm vẫn còn mãi.",
  };

  state.logs.push(log);

  // Lưu ngay để tải lại trang không được thử lại xác suất.
  saveEventProgress();

  ageElement.textContent = nextAge;
  renderAvatar(state.player);
  renderStats();
  renderLogEntry(log);

  document.getElementById("character-status").textContent = "Đã qua đời";

  ageButton.disabled = true;

  const logContainer = logElement.parentElement;
  logContainer.scrollTop = logContainer.scrollHeight;

  // Dùng lại popup kết thúc cuộc đời đã có.
  document.getElementById("death-content").textContent =
    `${state.player.name} đã kết thúc cuộc đời ở tuổi ${nextAge}.`;

  document.getElementById("death-dialog").showModal();

  checkAchievements();

  return true;
}
