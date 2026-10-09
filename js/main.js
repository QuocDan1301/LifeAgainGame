import { renderAvatar, getAvatarSource } from "./avatar.js";
import { createCareerTest, createFailedTestEvent } from "./career-tests.js";
import {
  studyBlocks,
  canChooseCareer,
  getStudyBlockLabel,
} from "./study-blocks.js";
import { createEventLogSummary, summarizeLifeLog } from "./log-summary.js";
import { createEventImageRenderer } from "./event-image.js";
import { formatMoneyAmount, formatMoneyText } from "./money-format.js";
import { createMediaTransition } from "./event-media-transition.js";
import { eventCategories, getEventCategory } from "./event-category.js";
import { getSpecialDialogue } from "./special-dialogue.js";
import { state } from "./state.js";
import { initEducation } from "./education.js";
import { createSchoolEntryReward } from "./school-rewards.js";
import {
  createChildProposalEvent,
  getChildProposalUpdates,
  getChildcareExpenses,
  completeLifeYear,
} from "./family.js";
import {
  completeCareerYear,
  getAnnualSalaryPayment,
  getPlayerAnnualSalary,
} from "./career-salary.js";
import {
  createDatingEvent,
  createMarriageEvent,
  getDatingUpdates,
  getMarriageUpdates,
  initRelationships,
} from "./relationships.js";
import { getAgeEvents, isPriorityEvent } from "./events.js";
import { careerEvent } from "./career-event.js";
import { academyLogos, createSchoolEvent } from "./career-schools.js";
import { createDiamondSpecialStep } from "./special-event-20.js";
import { createEarthAuctionSpecialStep } from "./special-event-30.js";
import { createSaveLifeSpecialStep } from "./special-event-35.js";
import { createOldHouseSpecialStep } from "./special-event-40.js";
import { createLastTrainSpecialStep } from "./special-event-45.js";
import { createTheaterSpecialStep } from "./special-event-50.js";
import { createLuggageSpecialStep } from "./special-event-55.js";
import { createLaterSpecialStep } from "./special-later-life.js";
import { reviewPendingMedia } from "./semantic-event-media.js";
import { initLifeProfile, renderLifeSummary } from "./life-profile.js";
import { initShop } from "./shop.js";
import { initLicenses } from "./licenses.js";
import { initSideJobs } from "./side-jobs.js";
import { initHospital } from "./hospital.js";
import { initMatchmaking } from "./matchmaking.js";
import { initGames } from "./games.js";
import { initFood } from "./food.js";
import { initTravel } from "./travel.js";
import { initTarot } from "./tarot.js";
import { initSelfDevelopment } from "./self-development.js";
import { createLostChildSpecialStep } from "./special-event-10.js";
import {
  createOrientationEvent,
  getOrientationLabel,
} from "./special-event-24.js";
import {
  createEmploymentEvent,
  createInterviewResult,
  createJobInterview,
  createMilestonePromotionEvent,
  getPromotionUpdates,
} from "./career-jobs.js";
import { createCareerSparkStep } from "./career-milestones.js";
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
  text = formatMoneyText(text);
  // Hide chain bookkeeping in results and journals, including older saves.
  text = text
    .replace(
      /\n?Sức khỏe luôn còn ít nhất 1 điểm; chuỗi này không gây tử vong\./giu,
      "",
    )
    .replace(/(^|[.!?]\s+)(?:kết thúc chuỗi|chuỗi kết thúc)\.[ \t]*/giu, "$1")
    .replace(/(?:kết thúc chuỗi|chuỗi kết thúc)(?:\s+mà)?\s*,?\s*/giu, "")
    .replace(/[,;]\s*\./g, ".")
    .replace(/([.!?])\s*\./g, "$1");
  // Tách các số có dấu + hoặc - ra khỏi nội dung
  const parts = text.split(/([+−-]\d+(?:[.,]\d+)*(?:k| triệu| tỷ)?)/g);
  parts.forEach((part) => {
    if (/^[+−-]\d+(?:[.,]\d+)*(?:k| triệu| tỷ)?$/.test(part)) {
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
  moneyElement.textContent = formatMoneyAmount(state.player.money);
}
// Hiển thị tiền khi mở game
// Bản lưu từ trước lần trả lương đầu: cộng lương năm hiện tại vào ví một lần.
if (getPlayerAnnualSalary(state.player) && state.player.lastSalaryAge == null) {
  const salary = completeCareerYear(state.player, state.player.age);
  if (salary) {
    const log = {
      age: state.player.age,
      content: salary.content,
      summary: salary.content,
    };
    state.logs.push(log);
    renderLogEntry(log);
    saveEventProgress();
  }
}
renderMoney();
const renderEducationStatus = initEducation(state, saveEventProgress);
function renderEducation() {
  renderEducationStatus();
  const button = document.getElementById("activities");
  button.disabled = state.player.isAlive === false;
  button.classList.toggle("is-locked", state.player.age < 11);
  const description =
    state.player.isAlive === false
      ? "Cuộc đời đã kết thúc"
      : state.player.age < 11
        ? "Mở khi vào cấp 2 (11 tuổi)"
        : "Mở hoạt động";
  button.title = description;
  button.setAttribute("aria-label", `Hoạt động. ${description}`);
}
// Hiển thị khi mở hoặc tải lại game
renderEducation();
initRelationships(state, saveEventProgress, (log) => {
  renderLogEntry(log);
  renderMoney();
});
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
const activitiesLockedDialog = document.getElementById(
  "activities-locked-dialog",
);
document
  .getElementById("close-activities-locked")
  .addEventListener("click", () => {
    activitiesLockedDialog.close();
  });
const closeActivities = document.getElementById("close-activities");
activitiesButton.addEventListener("click", () => {
  if (state.player.isAlive === false || document.querySelector("dialog[open]"))
    return;
  if (state.player.age < 11) {
    activitiesLockedDialog.showModal();
    return;
  }
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
let resultAnimations = [];
function clearResultAnimations() {
  resultAnimations.forEach((animation) => animation.cancel());
  resultAnimations = [];
}
function animateEventResult() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  resultAnimations = [eventTitle, eventContent, eventConfirm].map(
    (element, index) =>
      element.animate(
        [
          { opacity: 0, transform: "translateY(10px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 300,
          delay: index * 45,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        },
      ),
  );
}
eventDialog.addEventListener("close", clearResultAnimations);
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
    heading.textContent = `${getStudyBlockLabel(block.id)}: ${block.subjects}`;
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
        content: `📚 Chọn ${getStudyBlockLabel(block.id).replace(/^K/u, "k")}: ${block.subjects}.`,
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
delete state.gifHistory; // Legacy per-life media budgets are no longer used.
delete state.eventMediaSequence;
const setEventImage = createEventImageRenderer(eventImage, motionPreference);
motionPreference.addEventListener("change", () => {
  const pending = state.pendingEvent;
  if (pending && eventDialog.open) {
    setEventImage(
      pending.image,
      pending.imageAlt,
      pending.imageFallback,
      pending.imageFallbackAlt,
      pending.imageOptions,
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
  clearResultAnimations();
  pending.category = getEventCategory(pending);
  const categoryNote = document.getElementById("event-category");
  categoryNote.textContent = eventCategories[pending.category].label;
  categoryNote.dataset.category = pending.category;
  delete pending.mediaPresentationId;
  // Replace an unresolved age-25 story from an older save with the dating milestone.
  if (
    pending.age === 25 &&
    pending.stage === "choice" &&
    pending.kind !== "workplace-dating" &&
    !pending.addedEveryday
  ) {
    const dating = createDatingEvent(state.player, 25);
    if (dating) {
      Object.assign(pending, dating);
      saveEventProgress();
    }
  }
  if (pending.kind === "orientation-chain" && pending.stage === "choice") {
    const current = createOrientationEvent(state.player, pending.specialStep);
    if (current) Object.assign(pending, current);
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
  // Refresh saved story illustrations with the current animated OpenMoji.
  if (pending.age >= 1 && pending.age <= 105) {
    const events =
      getAgeEvents(pending.age, state.player.careerPath, state.player) ?? [];
    const current =
      pending.stage === "choice"
        ? events.find(
            (event) =>
              event.title === pending.title ||
              event.title
                .replace(
                  /[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D]/gu,
                  "",
                )
                .trim() ===
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
      if (pending.stage === "choice" && pending.category === "everyday") {
        pending.choices = current.choices;
      }
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
        "imageOptions",
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
  reviewPendingMedia(pending);
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
    pending.imageOptions,
  );
  if (pending.stage === "choice") {
    // Bước 1: tình huống và các lựa chọn
    eventContent.replaceChildren();
    let remaining = pending.text;
    while (remaining) {
      const matches = (pending.warningPhrases ?? [])
        .map((phrase) => ({ phrase, index: remaining.indexOf(phrase) }))
        .filter((match) => match.index >= 0)
        .sort((a, b) => a.index - b.index);
      if (!matches.length) {
        eventContent.append(
          document.createTextNode(formatMoneyText(remaining)),
        );
        break;
      }
      const { phrase, index } = matches[0];
      eventContent.append(
        document.createTextNode(formatMoneyText(remaining.slice(0, index))),
      );
      const warning = document.createElement("strong");
      warning.className = "event-warning";
      warning.textContent = formatMoneyText(phrase);
      eventContent.append(warning);
      remaining = remaining.slice(index + phrase.length);
    }
    if (pending.category === "special") {
      const dialogue = getSpecialDialogue(pending);
      if (dialogue)
        eventContent.append(document.createTextNode(`\n\n${dialogue}`));
    }
    eventConfirm.hidden = true;
    pending.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "event-choice";
      button.textContent = formatMoneyText(choice.label);
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
    const previewOnly = pending.mediaTransition || pending.mediaSkipInterview;
    const salary = previewOnly
      ? null
      : getAnnualSalaryPayment(state.player, pending.age, pending.updates);
    const childcare = previewOnly
      ? { content: "" }
      : getChildcareExpenses(state.player, pending.age, pending.updates);
    // Keep the first notice on this result across reloads, then use only logs.
    state.annualNoticesShown ??= {};
    if (salary && pending.showSalaryNotice === undefined) {
      pending.showSalaryNotice = !state.annualNoticesShown.salary;
    }
    if (childcare.content && pending.showChildcareNotice === undefined) {
      pending.showChildcareNotice = !state.annualNoticesShown.childcare;
    }
    if (salary && pending.showSalaryNotice)
      state.annualNoticesShown.salary = true;
    if (childcare.content && pending.showChildcareNotice)
      state.annualNoticesShown.childcare = true;
    renderLogContent(
      eventContent,
      pending.content +
        (pending.schoolReward ? `\n\n${pending.schoolReward.content}` : "") +
        (salary && pending.showSalaryNotice ? `\n\n${salary.content}` : "") +
        (childcare.content && pending.showChildcareNotice
          ? `\n\n${childcare.content}`
          : ""),
    );
    eventConfirm.textContent = pending.confirmText ?? "Xác nhận";
    eventConfirm.hidden = false;
  }
  if (!eventDialog.open) {
    eventDialog.showModal();
  }
  if (pending.stage === "result") animateEventResult();
  // Đưa nội dung mới về đầu hộp thoại
  eventDialog.scrollTop = 0;
  if (pending.stage === "choice") {
    eventChoices.querySelector("button")?.focus({
      preventScroll: true,
    });
  } else {
    eventConfirm.focus({ preventScroll: true });
  }
  saveEventProgress(); // Persist refreshed OpenMoji and remove legacy media limits.
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
    state.pendingEvent.category = pending.category;
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "job-interview-retry" && choice.retryInterview) {
    state.pendingEvent = createMediaTransition(choice, pending, {
      ...createJobInterview(state.player),
      stage: "choice",
      age: pending.age,
    });
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "job-interview-retry" && choice.skipInterview) {
    const content =
      pending.skipLogContent ??
      "Bạn quyết định không tiếp tục đăng ký thử việc.";
    state.pendingEvent = {
      ...createMediaTransition(choice, pending, null, content),
      mediaTransition: false,
      mediaSkipInterview: true,
      skipLogSummary: pending.skipLogSummary,
    };
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "orientation-chain" && choice.nextStep) {
    const nextStep = createOrientationEvent(state.player, choice.nextStep);
    if (!nextStep) return;
    state.pendingEvent = createMediaTransition(choice, pending, {
      ...nextStep,
      stage: "choice",
      age: pending.age,
    });
    saveEventProgress();
    showPendingEvent();
    return;
  }
  // Chuỗi khám phá ngành tuổi 16 và chuỗi thay thế nâng bậc lần đầu.
  if (
    (pending.kind === "career-spark" || pending.kind === "career-promotion") &&
    choice.nextStep
  ) {
    const nextStep =
      pending.kind === "career-spark"
        ? createCareerSparkStep(pending.careerSparkId, choice.nextStep)
        : createMilestonePromotionEvent(
            state.player,
            choice.nextStep,
            pending.age,
          );
    if (!nextStep) return;
    state.pendingEvent = createMediaTransition(choice, pending, {
      ...nextStep,
      stage: "choice",
      age: pending.age,
      logPrefix: `${pending.logPrefix ?? ""}${pending.text}\nBạn chọn: ${choice.label}\n`,
    });
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "lost-child-chain" && choice.nextStep) {
    const nextStep = createLostChildSpecialStep(choice.nextStep);
    if (!nextStep) return;
    state.pendingEvent = createMediaTransition(choice, pending, {
      ...nextStep,
      stage: "choice",
      age: pending.age,
      text: nextStep.text,
      logPrefix: `${pending.logPrefix ?? ""}${pending.text}\nBạn chọn: ${choice.label}\n${choice.transitionText ?? ""}`,
    });
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "special-chain" && choice.nextStep) {
    const inventory = { ...(pending.specialInventory ?? {}) };
    if (choice.grants) inventory[choice.grants] = true;
    Object.assign(inventory, choice.inventoryChanges ?? {});
    const nextStep = pending.specialId?.startsWith("later-")
      ? createLaterSpecialStep(
          Number(pending.specialId.slice(6)),
          choice.nextStep,
          inventory,
        )
      : pending.specialId === "earth-auction"
        ? createEarthAuctionSpecialStep(choice.nextStep)
        : pending.specialId === "save-life"
          ? createSaveLifeSpecialStep(choice.nextStep)
          : pending.specialId === "old-house"
            ? createOldHouseSpecialStep(choice.nextStep)
            : pending.specialId === "last-train"
              ? createLastTrainSpecialStep(choice.nextStep, inventory)
              : pending.specialId === "theater"
                ? createTheaterSpecialStep(choice.nextStep)
                : pending.specialId === "luggage"
                  ? createLuggageSpecialStep(choice.nextStep)
                  : createDiamondSpecialStep(choice.nextStep, inventory);
    if (!nextStep) return;
    state.pendingEvent = createMediaTransition(choice, pending, {
      ...nextStep,
      stage: "choice",
      age: pending.age,
      specialInventory: inventory,
      text: nextStep.text,
    });
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "career-test") {
    const next = choice.correct
      ? createSchoolEvent(pending.testedCareer)
      : createFailedTestEvent();
    state.pendingEvent = createMediaTransition(
      choice,
      pending,
      {
        ...next,
        stage: "choice",
        age: pending.age,
        text: next.text,
        logPrefix: `${pending.logPrefix ?? ""}Bài test ${pending.testedCareer.field}: ${choice.correct ? "đạt" : "không đạt"}.\n`,
      },
      choice.correct ? "Bạn trả lời đúng." : "Bạn chưa trả lời đúng.",
    );
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
    eligibilityFeedback.textContent = `${choice.careerPath.field} không phù hợp với ${getStudyBlockLabel(state.player.studyBlock).replace(/^K/u, "k") || "khối chưa chọn"}. Hãy chọn lại. Ngành phù hợp: ${
      suggestions.map((entry) => entry.careerPath.field).join(", ") ||
      "cần chọn khối học trước"
    }. Nhập ngũ, Liên Quân, TikTok và YouTube thuộc khối Tự do.`;
    eligibilityFeedback.hidden = false;
    return;
  }
  // Cả lựa chọn cũ đã lưu cũng chuyển sang chọn trường nếu chưa chọn trường/hướng huấn luyện.
  if (choice.careerPath && !Object.hasOwn(choice.careerPath, "school")) {
    const schoolEvent =
      createCareerTest(choice.careerPath) ??
      createSchoolEvent(choice.careerPath);
    state.pendingEvent = createMediaTransition(choice, pending, {
      ...schoolEvent,
      stage: "choice",
      age: pending.age,
      title: schoolEvent.title,
      text: schoolEvent.text,
      choices: schoolEvent.choices,
      logPrefix: `${pending.logPrefix ?? ""}${pending.text}\nBạn chọn: ${choice.label}\n`,
    });
    saveEventProgress();
    showPendingEvent();
    return;
  }
  const updates = { age: pending.age };
  if (pending.kind === "child-proposal") {
    Object.assign(
      updates,
      getChildProposalUpdates(
        state.player,
        pending.person,
        pending.age,
        choice.childDecision,
      ),
    );
  }
  if (pending.kind === "marriage-proposal") {
    Object.assign(
      updates,
      getMarriageUpdates(
        state.player,
        pending.person,
        pending.age,
        choice.marriageDecision,
      ),
    );
  }
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
  if (typeof choice.careerSpark === "string")
    updates.careerSpark = choice.careerSpark;
  if (typeof choice.job === "string") updates.job = choice.job;
  if (typeof choice.employmentStatus === "string") {
    updates.employmentStatus = choice.employmentStatus;
  }
  if (Number.isInteger(choice.careerLevel)) {
    updates.careerLevel = choice.careerLevel;
  }
  if (choice.death === true) updates.isAlive = false;
  if (choice.ending) updates.ending = choice.ending;
  if (
    choice.memory &&
    !(state.player.memories ?? []).some((item) => item.id === choice.memory.id)
  ) {
    updates.memories = [
      ...(state.player.memories ?? []),
      {
        ...choice.memory,
        receivedAtAge: pending.age,
        image: getAvatarSource({ ...state.player, age: pending.age }),
      },
    ];
    if (pending.age === 100 && state.player.partner) {
      const partner = state.player.partner;
      const meetingAge =
        partner.metAtAge ?? state.player.relationshipStartedAtAge ?? 25;
      updates.memories.at(-1).photos = [
        {
          title: "Ngày mới quen",
          portraits: [
            {
              name: state.player.name,
              image: getAvatarSource({ ...state.player, age: meetingAge }),
            },
            {
              name: partner.name,
              image: getAvatarSource({
                gender: partner.gender,
                age: partner.ageAtMeeting ?? meetingAge,
              }),
            },
          ],
        },
        {
          title: "Sinh nhật tuổi 100",
          portraits: [
            {
              name: state.player.name,
              image: getAvatarSource({ ...state.player, age: 100 }),
            },
            {
              name: partner.name,
              image: getAvatarSource({
                gender: partner.gender,
                age: (partner.ageAtMeeting ?? meetingAge) + 100 - meetingAge,
              }),
            },
          ],
        },
      ];
    }
  }
  if (choice.unlockActivity) {
    updates.unlockedActivities = [
      ...new Set([
        ...(state.player.unlockedActivities ?? []),
        choice.unlockActivity,
      ]),
    ];
  }
  if (
    choice.partnerRelationship &&
    state.player.partner?.id === choice.partnerRelationship.id
  ) {
    updates.partner = {
      ...state.player.partner,
      relationship: choice.partnerRelationship.value,
    };
  }
  if (choice.keepsake?.id && choice.keepsake?.name) {
    const keepsakes = state.player.keepsakes ?? [];
    if (!keepsakes.some((item) => item.id === choice.keepsake.id)) {
      updates.keepsakes = [
        ...keepsakes,
        { ...choice.keepsake, receivedAtAge: pending.age },
      ];
    }
  }
  const changes = [];
  if (updates.partner && choice.partnerRelationship)
    changes.push(`Quan hệ với bạn đời: ${updates.partner.relationship}%`);
  if (updates.keepsakes) changes.push(`Kỷ vật: ${choice.keepsake.name}`);
  if (updates.memories) changes.push(`Trang kỷ niệm: ${choice.memory.title}`);
  if (choice.unlockActivity) changes.push("Mở hoạt động: Dạy sửa đồ miễn phí");
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
      stat === "health" ? (choice.minimumHealth ?? 0) : 0,
      Math.min(100, oldValue + choice.effects[stat]),
    );
    updates[stat] = newValue;
    const actualChange = newValue - oldValue;
    if (actualChange !== 0) {
      const sign = actualChange > 0 ? "+" : "";
      changes.push(`${statNames[stat]} ${sign}${actualChange}`);
    }
  }
  for (const [stat, target] of Object.entries(choice.statTargets ?? {})) {
    if (!Object.hasOwn(statNames, stat)) continue;
    const oldValue = updates[stat] ?? state.player[stat];
    updates[stat] = Math.max(0, Math.min(100, target));
    const delta = updates[stat] - oldValue;
    if (delta)
      changes.push(`${statNames[stat]} ${delta > 0 ? "+" : ""}${delta}`);
  }
  // Tiền được xử lý riêng, không giới hạn ở 100
  if (choice.money) {
    const oldMoney = state.player.money;
    const newMoney = oldMoney + choice.money;
    const actualChange = newMoney - oldMoney;
    updates.money = newMoney;
    if (actualChange !== 0) {
      const sign = actualChange > 0 ? "+" : "";
      changes.push(`Tiền ${sign}${formatMoneyAmount(actualChange)} VNĐ`);
    }
  }
  const resultContent =
    choice.text + (changes.length ? "\n" + changes.join(" · ") : "");
  // Chuyển sang bước kết quả và giữ lại hành động đã chọn
  state.pendingEvent = {
    stage: "result",
    category: pending.category,
    nonFatal: choice.nonFatal === true,
    schoolReward: createSchoolEntryReward(state.player, pending.age, updates),
    age: pending.age,
    title: choice.title ?? "Kết quả",
    mediaSceneTitle: pending.title,
    mediaChoiceLabel: choice.label,
    image: choice.image ?? "",
    imageAlt: choice.imageAlt ?? "",
    imageFallback: choice.imageFallback ?? "",
    imageFallbackAlt: choice.imageFallbackAlt ?? "",
    imageOptions: choice.imageOptions ?? [],
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

  const schoolYearEvent =
    nextAge === 11 && state.player.lostChildSchoolYearDueAge === 11
      ? createLostChildSpecialStep(5)
      : null;
  const orientationEvent =
    nextAge === 24 ? createOrientationEvent(state.player) : null;
  const employmentEvent =
    nextAge === 25 ? null : createEmploymentEvent(state.player, nextAge);
  const promotionEvent =
    employmentEvent?.kind === "career-promotion" ? employmentEvent : null;
  const ageStories =
    getAgeEvents(nextAge, state.player.careerPath, state.player) ?? [];
  let marriageEvent = createMarriageEvent(state.player, nextAge);
  let childEvent = createChildProposalEvent(state.player, nextAge);
  const fixedPriorityEvent =
    (nextAge === 105 ? ageStories[0] : null) ??
    promotionEvent ??
    orientationEvent ??
    schoolYearEvent ??
    employmentEvent;
  const randomSpecialYear = ageStories?.some(
    (story) => story.kind === "special-chain" && story.priority === false,
  );
  // Draw once before deciding whether a due relationship event must wait.
  const randomAgeStory =
    randomSpecialYear && !fixedPriorityEvent && Math.random() < 0.8
      ? ageStories[Math.floor(Math.random() * ageStories.length)]
      : null;
  const priorityEvent =
    fixedPriorityEvent ??
    (randomAgeStory?.specialId ? randomAgeStory : null) ??
    (marriageEvent || childEvent ? ageStories.find(isPriorityEvent) : null);
  if (marriageEvent && priorityEvent) {
    // Save the postponed date with the priority event, including across reloads.
    state.player.nextMarriageProposalAge = nextAge + 1;
    marriageEvent = null;
  }
  if (childEvent && priorityEvent) {
    state.player.nextChildProposalAge = nextAge + 1;
    childEvent = null;
  }
  const datingEvent =
    !state.player.partner &&
    !state.player.datingActivitiesOnly &&
    !promotionEvent &&
    (nextAge === 25 || nextAge === 28)
      ? createDatingEvent(state.player, nextAge)
      : null;
  const stories = [...ageStories, ...(datingEvent ? [datingEvent] : [])];
  // Tuổi này chưa có sự kiện: ghi nhật kí và tăng tuổi trực tiếp.
  // 80% có sự kiện, 20% không có sự kiện.
  const eventChance = 0.8;

  const hasEvent =
    Boolean(priorityEvent) ||
    (nextAge === 25 && Boolean(datingEvent)) ||
    Boolean(marriageEvent) ||
    Boolean(childEvent) ||
    Boolean(orientationEvent) ||
    Boolean(schoolYearEvent) ||
    Boolean(employmentEvent) ||
    nextAge === 16 ||
    nextAge === 18 ||
    (Array.isArray(stories) &&
      stories.length > 0 &&
      (randomSpecialYear
        ? Boolean(randomAgeStory)
        : Math.random() < eventChance));

  if (!hasEvent) {
    const { salary, childcare, schooling, livestock, sideJobs, living, illness } = completeLifeYear(
      state.player,
      nextAge,
    );

    const log = {
      age: nextAge,
      content: salary
        ? `Một năm làm việc bình thường.\n${salary.content}`
        : "Không có gì thay đổi, mọi thứ vẫn vậy.",
    };

    if (childcare.content) log.content += `\n${childcare.content}`;
    if (schooling)
      log.content =
        schooling.content +
        (salary || childcare.content ? `\n${log.content}` : "");
    // Thu nhập phụ thay câu "không có gì thay đổi" khi năm đó không có lương chính.
    const extras = [livestock, sideJobs, living, illness].filter(Boolean).map((entry) => entry.content);
    if (extras.length)
      log.content =
        salary || childcare.content || schooling
          ? `${log.content}\n${extras.join("\n")}`
          : extras.join("\n");
    log.summary = log.content;
    state.logs.push(log);
    saveEventProgress();

    // Cập nhật giao diện theo tuổi mới.
    ageElement.textContent = state.player.age;
    renderMoney();
    renderStats();
    renderAvatar(state.player);
    renderEducation();
    renderLogEntry(log);

    // Bệnh không điều trị đủ 10 năm có thể kết thúc cuộc đời ngay trong năm không có sự kiện.
    if (state.player.isAlive === false) {
      endLifeAfterYear();
      return;
    }

    // Cuộn xuống dòng nhật kí vừa thêm.
    const logContainer = logElement.parentElement;
    logContainer.scrollTop = logContainer.scrollHeight;

    // Vẫn kiểm tra các thành tựu về tuổi.
    checkAchievements();

    // Kết thúc lượt, không mở popup sự kiện.
    return;
  }
  const story =
    (nextAge === 25 ? datingEvent : null) ??
    priorityEvent ??
    promotionEvent ??
    marriageEvent ??
    childEvent ??
    orientationEvent ??
    schoolYearEvent ??
    employmentEvent ??
    (nextAge === 18
      ? careerEvent
      : (randomAgeStory ??
        (stories?.length
          ? stories[Math.floor(Math.random() * stories.length)]
          : {
              title: "Một năm mới",
              text: "Một năm nữa đã trôi qua.",
              effects: {},
            })));
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
          imageOptions: story.imageOptions ?? [],
          confirmText: story.confirmText ?? "Xác nhận",
          achievementIds: story.achievementIds ?? [],
          death: story.death === true,
        },
      ];
  state.pendingEvent = {
    stage: "choice",
    id: story.id,
    kind: story.kind,
    addedEveryday: story.addedEveryday === true,
    person: story.person,
    specialId: story.specialId,
    specialStep: story.specialStep,
    careerSparkId: story.careerSparkId,
    specialInventory:
      story.kind === "special-chain"
        ? { ...(story.specialInventory ?? {}) }
        : undefined,
    warningPhrases: story.warningPhrases,
    referenceNotes: story.referenceNotes,
    age: nextAge,
    title: story.title ?? "Sự kiện",
    text: story.text,
    image: story.image ?? "",
    imageAlt: story.imageAlt ?? "",
    imageFallback: story.imageFallback ?? "",
    imageFallbackAlt: story.imageFallbackAlt ?? "",
    imageOptions: story.imageOptions ?? [],
    choices: choices,
  };
  saveEventProgress();
  showPendingEvent();
});
// Xác nhận kết quả: cập nhật nhân vật và ghi nhật ký
eventConfirm.addEventListener("click", () => {
  const pending = state.pendingEvent;
  if (!pending || pending.stage === "choice") return;
  if (pending.mediaTransition && pending.nextScene) {
    state.pendingEvent = pending.nextScene;
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.mediaSkipInterview) {
    state.player.age = pending.age;
    state.player.employmentStatus = "declined";
    const log = {
      age: pending.age,
      content: pending.content,
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
  const { salary, childcare, schooling, livestock, sideJobs, living, illness } = completeLifeYear(
    state.player,
    pending.age,
    pending.updates,
    pending.schoolReward,
  );
  recordAchievementFlags(state, pending.achievementIds ?? []);
  const log = {
    age: pending.age,
    content: pending.logContent ?? pending.content,
    summary:
      pending.logSummary ??
      summarizeLifeLog(pending.logContent ?? pending.content),
  };
  if (salary) {
    log.content += `\n${salary.content}`;
    log.summary += `\n${salary.content}`;
  }
  if (childcare.content) {
    log.content += `\n${childcare.content}`;
    log.summary += `\n${childcare.content}`;
  }
  if (schooling) {
    log.content += `\n${schooling.content}`;
    log.summary += `\n${schooling.content}`;
  }
  for (const extra of [livestock, sideJobs, living, illness]) {
    if (!extra) continue;
    log.content += `\n${extra.content}`;
    log.summary += `\n${extra.content}`;
  }
  state.logs.push(log);
  state.pendingEvent = null;
  // Sự kiện "không gây tử vong" vẫn không cứu được nhân vật khỏi bệnh để quá 10 năm.
  const died =
    state.player.isAlive === false ||
    (!pending.nonFatal && state.player.health <= 0);
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
    renderLifeSummary(state);
  }
  checkAchievements();
});
// Phải giải quyết sự kiện, không bỏ qua bằng Escape
eventDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
});
// Tải lại trang sẽ mở đúng bước đang chờ
// Older saves at the former upper age limit now use the age-105 finale.
if (
  state.player.isAlive !== false &&
  (state.player.age >= 105 || state.pendingEvent?.age >= 105) &&
  state.pendingEvent?.specialId !== "later-105" &&
  !(
    state.pendingEvent?.stage === "result" &&
    state.pendingEvent.updates?.isAlive === false
  )
) {
  const finale = getAgeEvents(105, state.player.careerPath, state.player)[0];
  state.pendingEvent = { ...finale, stage: "choice", age: 105 };
  saveEventProgress();
}
if (state.pendingEvent) {
  showPendingEvent();
}
initAchievements(state);
initLifeProfile(state, { renderStats, renderLogEntry, checkAchievements });
initShop(state, { renderMoney, renderLogEntry, checkAchievements });
initLicenses(state, { renderLogEntry });
initSideJobs(state, { renderMoney, renderStats, renderLogEntry, renderEducation, checkAchievements });
initHospital(state, { renderMoney, renderLogEntry });
initMatchmaking(state, { renderMoney, renderStats, renderLogEntry, checkAchievements });
initGames(state, { renderMoney, renderLogEntry });
initFood(state, { renderMoney, renderStats, renderLogEntry });
initTravel(state, { renderMoney, renderStats, renderLogEntry });
initTarot(state, { renderMoney, renderStats, renderLogEntry, checkAchievements });
initSelfDevelopment(state, { renderMoney, renderStats, renderLogEntry });
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
// Kết thúc cuộc đời sau một năm không có sự kiện (ví dụ bệnh không được điều trị).
function endLifeAfterYear() {
  const log = {
    age: state.player.age,
    content: "Hành trình cuộc đời của bạn đã khép lại.",
  };
  state.logs.push(log);
  saveEventProgress();
  renderStats();
  renderEducation();
  renderLogEntry(log);
  ageButton.disabled = true;
  const logContainer = logElement.parentElement;
  logContainer.scrollTop = logContainer.scrollHeight;
  document.getElementById("death-content").textContent =
    `${state.player.name} đã kết thúc cuộc đời ở tuổi ${state.player.age}.`;
  document.getElementById("death-dialog").showModal();
  renderLifeSummary(state);
  checkAchievements();
}
function checkOldAgeDeath(nextAge) {
  // Survivors of age 104 always see the final story at 105.
  if (nextAge === 105) return false;
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
  renderLifeSummary(state);

  checkAchievements();

  return true;
}
