import { renderAvatar } from "./avatar.js";
import { createCareerTest, createFailedTestEvent } from "./career-tests.js";
import { studyBlocks, canChooseCareer } from "./study-blocks.js";
import { createEventLogSummary, summarizeLifeLog } from "./log-summary.js";
import { createEventImageRenderer } from "./event-image.js";
import { state } from "./state.js";
import { initEducation } from "./education.js";
import {
  createDatingEvent,
  getDatingUpdates,
  initRelationships,
} from "./relationships.js";
import { getAgeEvents } from "./events.js";
import { careerEvent } from "./career-event.js";
import { academyLogos, createSchoolEvent } from "./career-schools.js";
import { createDiamondSpecialStep } from "./special-event-20.js";
import { createLostChildSpecialStep } from "./special-event-10.js";
import {
  createOrientationEvent,
  getOrientationLabel,
} from "./special-event-24.js";
import {
  createEmploymentEvent,
  createInterviewResult,
  createJobInterview,
  getPromotionUpdates,
} from "./career-jobs.js";
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
const renderEducation = initEducation(state, saveEventProgress);
// Hiển thị khi mở hoặc tải lại game
renderEducation();
initRelationships(state);
function renderLogEntry(log) {
  const logItem = document.createElement("section");
  logItem.classList.add("log-entry");
  const title = document.createElement("h3");
  title.textContent = `${log.age} tuổi`;
  const content = document.createElement("p");
  // Giữ màu xanh/đỏ cho các số tăng, giảm
  renderLogContent(content, log.summary ?? summarizeLifeLog(log.content));
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
const eligibilityFeedback = document.getElementById(
  "career-eligibility-feedback",
);
const studyDialog = document.getElementById("study-block-dialog");
function showStudyBlocks() {
  const pendingCareer =
    state.pendingEvent?.stage === "choice" &&
    state.pendingEvent.age === 18 &&
    state.pendingEvent.choices?.some(
      (choice) =>
        choice.careerPath && !Object.hasOwn(choice.careerPath, "school"),
    );
  if (
    state.player.isAlive === false ||
    state.player.age < 15 ||
    state.player.studyBlock ||
    (state.pendingEvent && !pendingCareer)
  )
    return;
  if (pendingCareer && eventDialog.open) eventDialog.close();
  if (document.querySelector("dialog[open]")) return;
  const choices = document.getElementById("study-block-choices");
  choices.replaceChildren();
  for (const block of studyBlocks) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "event-choice";
    const heading = document.createElement("strong");
    heading.textContent = `Khối ${block.id}: ${block.subjects}`;
    const description = document.createElement("span");
    description.textContent = `Nhóm ngành chính: ${careerEvent.choices
      .filter((choice) => block.careers.includes(choice.careerPath.id))
      .map((choice) => choice.careerPath.field)
      .join(", ")}.`;
    button.append(heading, description);
    button.addEventListener("click", () => {
      state.player.studyBlock = block.id;
      renderEducation();
      const log = {
        age: state.player.age,
        content: `📚 Chọn khối ${block.id}: ${block.subjects}.`,
      };
      state.logs.push(log);
      saveEventProgress();
      renderLogEntry(log);
      studyDialog.close();
      if (state.pendingEvent) showPendingEvent();
      else ageButton.disabled = state.player.isAlive === false;
    });
    choices.append(button);
  }
  ageButton.disabled = true;
  studyDialog.showModal();
  choices.querySelector("button")?.focus({ preventScroll: true });
}
studyDialog.addEventListener("cancel", (event) => event.preventDefault());
document.addEventListener("achievement-closed", (event) => {
  if (event.detail === "high-school") showStudyBlocks();
});
document.addEventListener("achievement-flow-idle", showStudyBlocks);
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const setEventImage = createEventImageRenderer(eventImage, motionPreference);
motionPreference.addEventListener("change", () => {
  const pending = state.pendingEvent;
  if (pending && eventDialog.open) {
    setEventImage(
      pending.image,
      pending.imageAlt,
      pending.imageFallback,
      pending.imageFallbackAlt,
    );
  }
});
// Lưu toàn bộ tiến trình, gồm cả bước sự kiện đang mở
function saveEventProgress() {
  localStorage.setItem("lifeAgainSave", JSON.stringify(state));
}
// Hiển thị bước chọn hành động hoặc bước kết quả
function showPendingEvent() {
  const pending = state.pendingEvent;
  if (!pending) return;
  if (pending.kind === "orientation-chain" && pending.stage === "choice") {
    const current = createOrientationEvent(state.player, pending.specialStep);
    if (current) Object.assign(pending, current);
  }
  // Replace a saved age-15 story with the school milestone and block selection.
  if (pending.age === 15) {
    state.player.age = 15;
    state.pendingEvent = null;
    saveEventProgress();
    ageElement.textContent = 15;
    renderAvatar(state.player);
    renderEducation();
    ageButton.disabled = state.player.isAlive === false;
    if (eventDialog.open) eventDialog.close();
    checkAchievements();
    return;
  }
  if (
    pending.age === 18 &&
    pending.stage === "choice" &&
    !state.player.studyBlock &&
    pending.choices?.some(
      (choice) =>
        choice.careerPath && !Object.hasOwn(choice.careerPath, "school"),
    )
  ) {
    showStudyBlocks();
    return;
  }
  eligibilityFeedback.hidden = true;
  eligibilityFeedback.textContent = "";
  // Refresh saved story illustrations to use the current mixed media.
  if (pending.age >= 1 && pending.age <= 29) {
    const events = getAgeEvents(pending.age, state.player.careerPath) ?? [];
    const current =
      pending.stage === "choice"
        ? events.find(
            (event) =>
              event.title === pending.title ||
              event.title.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D]/gu, "").trim() ===
                pending.title
                  .replace(
                    /[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D]/gu,
                    "",
                  )
                  .trim(),
          )
        : events
            .flatMap((event) => event.choices)
            .find(
              (branch) =>
                branch.title === pending.title &&
                pending.content?.startsWith(branch.text),
            );
    if (current) {
      if (pending.age >= 23 && pending.stage === "choice" && !pending.kind) {
        pending.title = current.title;
        pending.text = current.text;
        pending.choices = current.choices;
      }
      for (const key of [
        "image",
        "imageAlt",
        "imageFallback",
        "imageFallbackAlt",
      ]) {
        pending[key] = current[key];
        if (pending.stage === "choice") {
          pending.choices?.forEach((branch, index) => {
            branch[key] = current.choices[index]?.[key] ?? branch[key];
          });
        }
      }
    }
  }
  // Remove the old introductory line from events already saved mid-choice.
  if (
    pending.stage === "choice" &&
    pending.text?.startsWith("Bạn đang theo đuổi ")
  ) {
    pending.text = pending.text.replace(/^Bạn đang theo đuổi [^\n]*\n/u, "");
  }
  ageButton.disabled = true;
  eventChoices.replaceChildren();
  eventTitle.textContent = `${pending.title}`;
  setEventImage(
    pending.image,
    pending.imageAlt,
    pending.imageFallback,
    pending.imageFallbackAlt,
  );
  if (pending.stage === "choice") {
    // Bước 1: tình huống và các lựa chọn
    eventContent.textContent = pending.text;
    eventConfirm.hidden = true;
    pending.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "event-choice";
      button.textContent = choice.label;
      // Resolve by academy ID as well, so previously saved choices gain logos.
      const logo = academyLogos[choice.careerPath?.school?.id];
      if (logo) {
        button.classList.add("event-choice--academy");
        const emblem = document.createElement("img");
        emblem.className = "event-choice-logo";
        emblem.src = logo;
        emblem.alt = "";
        emblem.width = 44;
        emblem.height = 44;
        emblem.addEventListener(
          "error",
          () => {
            emblem.hidden = true;
          },
          { once: true },
        );
        const label = document.createElement("span");
        label.textContent = choice.label.replace(/^🎮\s*/u, "");
        button.replaceChildren(emblem, label);
      }
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
  if (pending.kind === "job-interview") {
    state.pendingEvent = createInterviewResult(
      state.player,
      choice.correct === true,
      pending.age,
    );
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "job-interview-retry" && choice.retryInterview) {
    state.pendingEvent = {
      ...createJobInterview(state.player),
      stage: "choice",
      age: pending.age,
    };
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "job-interview-retry" && choice.skipInterview) {
    state.player.age = pending.age;
    state.player.employmentStatus = "declined";
    const log = {
      age: pending.age,
      content:
        pending.skipLogContent ??
        "Bạn quyết định không tiếp tục đăng ký thử việc.",
      summary: pending.skipLogSummary ?? "Không tiếp tục đăng ký thử việc.",
    };
    state.logs.push(log);
    state.pendingEvent = null;
    saveEventProgress();
    ageElement.textContent = state.player.age;
    renderAvatar(state.player);
    renderEducation();
    renderLogEntry(log);
    eventDialog.close();
    ageButton.disabled = false;
    ageButton.focus({ preventScroll: true });
    const logContainer = logElement.parentElement;
    logContainer.scrollTop = logContainer.scrollHeight;
    checkAchievements();
    return;
  }
  if (pending.kind === "orientation-chain" && choice.nextStep) {
    const nextStep = createOrientationEvent(state.player, choice.nextStep);
    if (!nextStep) return;
    state.pendingEvent = { ...nextStep, stage: "choice", age: pending.age };
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "lost-child-chain" && choice.nextStep) {
    const nextStep = createLostChildSpecialStep(choice.nextStep);
    if (!nextStep) return;
    state.pendingEvent = {
      ...nextStep,
      stage: "choice",
      age: pending.age,
      text: `${choice.transitionText ?? ""}${nextStep.text}`,
      logPrefix: `${pending.logPrefix ?? ""}${pending.text}\nBạn chọn: ${choice.label}\n`,
    };
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "special-chain" && choice.nextStep) {
    const inventory = { ...(pending.specialInventory ?? {}) };
    if (choice.grants) inventory[choice.grants] = true;
    const nextStep = createDiamondSpecialStep(choice.nextStep, inventory);
    if (!nextStep) return;
    state.pendingEvent = {
      ...nextStep,
      stage: "choice",
      age: pending.age,
      specialInventory: inventory,
      text: `${choice.transitionText ?? ""}${nextStep.text}`,
    };
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "career-test") {
    const next = choice.correct
      ? createSchoolEvent(pending.testedCareer)
      : createFailedTestEvent();
    state.pendingEvent = {
      ...next,
      stage: "choice",
      age: pending.age,
      text: choice.correct ? `✅ Trả lời đúng!\n${next.text}` : next.text,
      logPrefix: `${pending.logPrefix ?? ""}Bài test ${pending.testedCareer.field}: ${choice.correct ? "đạt" : "không đạt"}.\n`,
    };
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (
    choice.careerPath &&
    !Object.hasOwn(choice.careerPath, "school") &&
    !canChooseCareer(choice.careerPath.id, state.player.studyBlock)
  ) {
    const suggestions = careerEvent.choices.filter((entry) =>
      studyBlocks
        .find((block) => block.id === state.player.studyBlock)
        ?.careers.includes(entry.careerPath.id),
    );
    eligibilityFeedback.textContent = `${choice.careerPath.field} không phù hợp với khối ${state.player.studyBlock ?? "chưa chọn"}. Hãy chọn lại. Ngành phù hợp: ${suggestions.map((entry) => entry.careerPath.field).join(", ") || "cần chọn khối học trước"}. Nhập ngũ, Liên Quân, TikTok và YouTube không yêu cầu khối.`;
    eligibilityFeedback.hidden = false;
    return;
  }
  // Cả lựa chọn cũ đã lưu cũng chuyển sang chọn trường nếu chưa chọn trường/hướng huấn luyện.
  if (choice.careerPath && !Object.hasOwn(choice.careerPath, "school")) {
    const schoolEvent =
      createCareerTest(choice.careerPath) ??
      createSchoolEvent(choice.careerPath);
    state.pendingEvent = {
      ...schoolEvent,
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
  if (
    pending.kind === "workplace-dating" &&
    choice.acceptDating === true &&
    pending.person
  ) {
    Object.assign(
      updates,
      getDatingUpdates(state.player, pending.person, pending.age),
    );
  }
  if (
    pending.kind === "orientation-chain" &&
    getOrientationLabel(choice.orientation, state.player.gender)
  ) {
    updates.orientation = choice.orientation;
  }
  if (pending.kind === "career-promotion") {
    Object.assign(
      updates,
      getPromotionUpdates(state.player, pending.age, choice.correct === true),
    );
  }
  if (
    pending.kind === "lost-child-chain" &&
    Object.hasOwn(choice, "schoolYearDueAge")
  ) {
    updates.lostChildSchoolYearDueAge = choice.schoolYearDueAge;
  }
  if (choice.careerPath) updates.careerPath = choice.careerPath;
  if (typeof choice.job === "string") updates.job = choice.job;
  if (typeof choice.employmentStatus === "string") {
    updates.employmentStatus = choice.employmentStatus;
  }
  if (Number.isInteger(choice.careerLevel)) {
    updates.careerLevel = choice.careerLevel;
  }
  if (choice.death === true) updates.isAlive = false;
  const changes = [];
  if (
    pending.kind === "lost-child-chain" &&
    pending.specialStep === 5 &&
    pending.age === 11
  ) {
    for (const stat of Object.keys(statNames)) {
      const oldValue = state.player[stat];
      updates[stat] = Math.max(oldValue, choice.minimumStats);
      if (updates[stat] > oldValue) {
        changes.push(`${statNames[stat]} +${updates[stat] - oldValue}`);
      }
    }
  }
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
    imageFallback: choice.imageFallback ?? "",
    imageFallbackAlt: choice.imageFallbackAlt ?? "",
    confirmText: choice.confirmText ?? "Xác nhận",
    content: resultContent,
    achievementIds: choice.achievementIds ?? [],
    logSummary:
      choice.logSummary ??
      createEventLogSummary({
        title: pending.title,
        choiceLabel: choice.label,
        resultTitle: choice.title,
        resultText: choice.text,
        changes,
      }),
    // Nhật ký ghi cả tình huống, lựa chọn và kết quả
    logContent:
      choice.logContent ??
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
  if (state.player.age >= 15 && !state.player.studyBlock) {
    showStudyBlocks();
    return;
  }
  const nextAge = state.player.age + 1;

  // Kiểm tra tuổi thọ trước khi chọn có/không có sự kiện.
  if (checkOldAgeDeath(nextAge)) {
    return;
  }

  // Age 15 has only the high-school achievement and study-block popup.
  // The selected block is the sole diary entry for this birthday.
  if (nextAge === 15) {
    state.player.age = nextAge;
    saveEventProgress();
    ageElement.textContent = nextAge;
    renderAvatar(state.player);
    renderEducation();
    checkAchievements();
    return;
  }

  const schoolYearEvent =
    nextAge === 11 && state.player.lostChildSchoolYearDueAge === 11
      ? createLostChildSpecialStep(5)
      : null;
  const orientationEvent =
    nextAge === 24 ? createOrientationEvent(state.player) : null;
  const employmentEvent = createEmploymentEvent(state.player, nextAge);
  const promotionEvent =
    employmentEvent?.kind === "career-promotion" ? employmentEvent : null;
  const datingEvent =
    !state.player.partner &&
    !promotionEvent &&
    (nextAge === 25 || nextAge === 28)
      ? createDatingEvent(state.player, nextAge)
      : null;
  const stories = [
    ...(getAgeEvents(nextAge, state.player.careerPath) ?? []),
    ...(datingEvent ? [datingEvent] : []),
  ];
  // Tuổi này chưa có sự kiện: ghi nhật kí và tăng tuổi trực tiếp.
  // 80% có sự kiện, 20% không có sự kiện.
  const eventChance = 0.8;

  const hasEvent =
    Boolean(orientationEvent) ||
    Boolean(schoolYearEvent) ||
    Boolean(employmentEvent) ||
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
    promotionEvent ??
    orientationEvent ??
    schoolYearEvent ??
    employmentEvent ??
    (nextAge === 18
      ? careerEvent
      : stories?.length
        ? stories[Math.floor(Math.random() * stories.length)]
        : {
            title: "Một năm mới",
            text: "Một năm nữa đã trôi qua.",
            effects: {},
          });
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
          imageFallback: story.imageFallback ?? "",
          imageFallbackAlt: story.imageFallbackAlt ?? "",
          confirmText: story.confirmText ?? "Xác nhận",
          achievementIds: story.achievementIds ?? [],
          death: story.death === true,
        },
      ];
  state.pendingEvent = {
    stage: "choice",
    kind: story.kind,
    person: story.person,
    specialId: story.specialId,
    specialStep: story.specialStep,
    specialInventory: story.kind === "special-chain" ? {} : undefined,
    age: nextAge,
    title: story.title ?? "Sự kiện",
    text: story.text,
    image: story.image ?? "",
    imageAlt: story.imageAlt ?? "",
    imageFallback: story.imageFallback ?? "",
    imageFallbackAlt: story.imageFallbackAlt ?? "",
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
    summary:
      pending.logSummary ??
      summarizeLifeLog(pending.logContent ?? pending.content),
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

  renderEducation();

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
