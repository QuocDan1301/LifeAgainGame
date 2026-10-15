import { describeYearLivingCost } from './relationships/family.js';
import { educationEntryAchievementIds } from './achievements/achievement-progress.js';
import { archiveLife, observeLifeProgress, getLifeId } from './core/life-archive.js';
import { describeDeathCause } from './core/life-profile.js';
import { renderFamilyBudgetControls } from './relationships/family-budget.js';
import { saveGame } from "./core/save-store.js";
import {
  createStudyAbroadMajorEvent,
  createStudyAbroadYearEvent,
  createStudyAbroadDramaStep,
} from "./education/study-abroad.js";
import { createDatingDramaStep } from "./relationships/dating-drama.js";
import { createMaritalAffairEvent } from "./relationships/marital-affair.js";
import {
  createConcurrentDatingEvent,
  postponeDatingMarriage,
} from "./relationships/concurrent-dating.js";
import { retirePlayer } from "./career/career-salary.js";
import { canAffordChoice } from "./core/story-transactions.js";
import { renderAvatar, getAvatarSource } from "./ui/avatar.js";
import {
  createCareerTest,
  createExamPrepEvent,
  createFailedTestEvent,
} from "./career/career-tests.js";
import {
  studyBlocks,
  canChooseCareer,
  getStudyBlockLabel,
} from "./education/study-blocks.js";
import {
  compactLogText,
  createEventLogSummary,
  summarizeLifeLog,
} from "./core/log-summary.js";
import { createEventImageRenderer } from "./media/event-image.js";
import {
  formatMoney,
  formatMoneyAmount,
  formatMoneyText,
} from "./core/money-format.js";
import {
  createChainStep,
  createMediaTransition,
} from "./media/event-media-transition.js";
import { rollEverydayLuck } from "./events/everyday-difficulty.js";
import { createAcquaintanceEvent } from "./relationships/acquaintance.js";
import {
  createCastingEvent,
  createMeetFamilyEvent,
} from "./stats/appearance-rules.js";
import {
  EXAM_PREP,
  createProjectBugEvent,
  createRiskOfferEvent,
  rollInterview,
} from "./stats/intellect-rules.js";
import {
  LOW_HAPPINESS,
  SUPPORT_OPTIONS,
  createMoodEvent,
  createSupportEvent,
  getMoodEffectLoss,
  isSupportActive,
  softenSetback,
} from "./stats/mood-rules.js";
import {
  EMERGENCY,
  FOOTBALL_MIN_HEALTH,
  failsFootballFitness,
  formatChance,
  getHealthBand,
  getOldAgeDeathChance,
} from "./stats/health-rules.js";
import { eventCategories, getEventCategory } from "./events/event-category.js";
import { getSpecialDialogue } from "./events/special-dialogue.js";
import { state } from "./core/state.js";
import { createCasualStartChoice, createCasualServiceEvent, isServing } from "./career/street-work.js";
import { addEventEmotions, addChoiceIcon, addChoiceIcons } from "./events/event-emotions.js";
import { createPrisonEvent, initCrime, isInPrison } from "./events/crime.js";
import { createWorkTemptationEvent, createWorkInvestigationEvent } from "./career/work-temptation.js";
import { initEducation } from "./education/education.js";
import { createSchoolEntryReward } from "./education/school-rewards.js";
import {
  LIVING_MODES,
  DEBT_INTEREST_RATE,
  FRUGAL_MAX_SAVING,
  createChildProposalEvent,
  forecastNextYear,
  getChildProposalUpdates,
  getChildcareExpenses,
  completeLifeYear,
} from "./relationships/family.js";
import {
  createContractNoticeEvent,
  createJobReviewEvent,
  createLayoffNoticeEvent,
  createWorkProblemEvent,
} from "./career/job-loss.js";
import {
  CONDITIONS,
  FAMILY_SUPPORT,
  canGetFamilySupport,
  createRelativeDeathEvent,
  ensureRelatives,
  getLivingFamily,
} from "./relationships/family-members.js";
import {
  RETIREMENT_AGE,
  completeCareerYear,
  getAnnualSalaryPayment,
  getPlayerAnnualSalary,
} from "./career/career-salary.js";
import {
  createDatingEvent,
  createMarriageEvent,
  getDatingUpdates,
  getMarriageUpdates,
  initRelationships,
} from "./relationships/relationships.js";
import { getAgeEvents, isPriorityEvent } from "./events/events.js";
import { pickWeightedStory, fillStoryText } from "./events/life-stories.js";
import { careerEvent } from "./career/career-event.js";
import { academyLogos, createSchoolEvent } from "./career/career-schools.js";
import {
  applySpecialInventory,
  createSpecialStep,
} from "./special-events/special-chain.js";
import { reviewPendingMedia } from "./media/semantic-event-media.js";
import { initLifeProfile, renderLifeSummary } from "./core/life-profile.js";
import { initShop } from "./leisure/shop.js";
import { initLicenses } from "./career/licenses.js";
import {
  initSideJobs,
  canReduceSideJobs,
  quitSideJobs,
  reduceSideJobs,
} from "./career/side-jobs.js";
import { initJobApplications } from "./career/job-applications.js";
import {
  ILLNESS_STAGES,
  describeIllness,
  getDangerousIllnesses,
  getDisease,
  getIllnessStage,
  initHospital,
} from "./stats/hospital.js";
import { initMatchmaking } from "./relationships/matchmaking.js";
import { initGames } from "./leisure/games.js";
import { initFood } from "./stats/food.js";
import { initBeauty } from "./stats/beauty.js";
import { initLottery, mergeLotteryPurchaseLogs } from "./leisure/lottery.js";
import { initTravel } from "./leisure/travel.js";
import { initGameCenter } from "./leisure/game-center.js";
import { initTarot } from "./leisure/tarot.js";
import { initDetective } from "./leisure/detective.js";
import { initGarden } from "./leisure/garden.js";
import { playEventSound, playOutcomeSound } from "./ui/music.js";
import { initSelfDevelopment } from "./stats/self-development.js";
import {
  createOrientationEvent,
  getOrientationLabel,
} from "./special-events/special-event-24.js";
import {
  createEmploymentEvent,
  createInterviewResult,
  createJobInterview,
  createMilestonePromotionEvent,
  getPromotionUpdates,
} from "./career/career-jobs.js";
import {
  createCareerSparkStep,
  getRankLock,
} from "./career/career-milestones.js";
import {
  initAchievements,
  checkAchievements,
  recordAchievementFlags,
} from "./achievements/achievements.js";
const statNames = {
  health: "Sức khỏe",
  intelligence: "Trí tuệ",
  happiness: "Hạnh phúc",
  appearance: "Ngoại hình",
};
 
 
const nameElement = document.getElementById("player-name");
const ageElement = document.getElementById("player-age");
 
nameElement.textContent = state.player.name;
renderAvatar(state.player);
ageElement.textContent = state.player.age;
document.getElementById("player-province").textContent =
  state.player.province || "";
const ageButton = document.getElementById("age-up");
const logElement = document.getElementById("life-log");
 
const logLines = new WeakMap();
logElement.replaceChildren();
state.logs = mergeLotteryPurchaseLogs(state.logs);
state.logs.forEach((log) => {
  renderLogEntry(log);
});
 
requestAnimationFrame(() => {
  const logContainer = logElement.parentElement;
  logContainer.scrollTop = logContainer.scrollHeight;
});
const menuToggle = document.getElementById("menu-button");
const menuPanel = document.getElementById("menu-panel");
function setMenuOpen(isOpen) {
  menuPanel.hidden = !isOpen;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Đóng cài đặt" : "Mở cài đặt");
}
 
menuToggle.addEventListener("click", () => {
  setMenuOpen(menuPanel.hidden);
});
 
document.addEventListener("click", (event) => {
  if (!menuToggle.contains(event.target) && !menuPanel.contains(event.target)) {
    setMenuOpen(false);
  }
});
 
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
 
restartButton.addEventListener("click", () => {
  setMenuOpen(false);
  restartDialog.showModal();
});
 
cancelRestart.addEventListener("click", () => {
  restartDialog.close();
  menuToggle.focus();
});
 
confirmRestart.addEventListener("click", () => {
  saveEventProgress();
  window.location.reload();
});
if (!Array.isArray(state.player.relatives)) {
  ensureRelatives(state.player);
   
  saveGame(state);
}
let hospitalUi = null;
function renderStats() {
   
  document.getElementById("health").value = state.player.health;
  document.getElementById("health-value").textContent =
    `${state.player.health}%`;
   
  document.getElementById("smarts").value = state.player.intelligence;
  document.getElementById("smarts-value").textContent =
    `${state.player.intelligence}%`;
   
  document.getElementById("happiness").value = state.player.happiness;
  document.getElementById("happiness-value").textContent =
    `${state.player.happiness}%`;
   
  document.getElementById("looks").value = state.player.appearance;
  document.getElementById("looks-value").textContent =
    `${state.player.appearance}%`;
  updateStatColor("health", state.player.health);
  updateStatColor("smarts", state.player.intelligence);
  updateStatColor("happiness", state.player.happiness);
  updateStatColor("looks", state.player.appearance);
  renderHealthAlert();
}
 
 
 
let healthAlertOpen = false;
function getMoodAlertItems(player) {
  const nextAge = player.age + 1;
  const items = [];
  for (const effect of player.moodEffects ?? []) {
    const { config, loss, yearsLeft, label } = getMoodEffectLoss(
      player,
      effect,
      nextAge,
    );
    if (!config || yearsLeft <= 0) continue;
    items.push({
      short: `${config.icon} ${config.label}`,
      title: `${config.icon} ${label} lúc ${effect.startedAt} tuổi · còn ${yearsLeft} năm ảnh hưởng`,
      detail: `Năm tới: Hạnh phúc -${loss}. Nghỉ ngơi và hỗ trợ tinh thần giúp nhẹ bớt; một chuyến du lịch không xóa hết nỗi buồn.`,
    });
  }
  if (isSupportActive(player, nextAge)) {
    const support = player.moodSupport;
    items.push({
      short: "🌱 Đang hồi phục",
      title: `🌱 Đang được hỗ trợ tinh thần · còn ${support.untilAge - player.age} năm`,
      detail: `Mỗi sinh nhật: Hạnh phúc +${SUPPORT_OPTIONS[support.type].perYear}.`,
    });
  }
  if (
    (player.lowHappinessYears ?? 0) > 0 &&
    !isSupportActive(player, nextAge)
  ) {
    items.push({
      short: `😔 ${player.lowHappinessYears} năm buồn`,
      title: `😔 Hạnh phúc dưới ${LOW_HAPPINESS}: ${player.lowHappinessYears} năm liên tiếp`,
      detail:
        "Thử làm sở thích, gọi điện tâm sự (Phát triển bản thân → Hạnh phúc) hoặc trò chuyện với người thân. Kéo dài 3 năm sẽ mở chuỗi hỗ trợ.",
    });
  }
  const promise = player.partnerPromise;
  if (promise && player.partner?.id === promise.partnerId) {
    items.push({
      short: "🤫 Lời hẹn",
      title: `🤫 Đã hẹn nói chuyện với ${player.partner.name}`,
      detail: `Vào Quan hệ → Trò chuyện trước sinh nhật ${promise.dueAge + 1} tuổi để giữ lời hẹn.`,
    });
  }
  return items;
}
function renderHealthAlert() {
  const box = document.getElementById("health-alert");
  if (!box) return;
  const player = state.player;
  const illnesses = (player.illnesses ?? []).filter((illness) =>
    getDisease(illness.id),
  );
  const band = getHealthBand(player.health);
  const lowHealth = ["weak", "critical", "empty"].includes(band.id);
  const moodItems =
    player.isAlive === false
      ? []
      : [...getLifeAlertItems(player), ...getMoodAlertItems(player)];
  box.replaceChildren();
  box.hidden =
    player.isAlive === false ||
    (!illnesses.length && !lowHealth && !moodItems.length);
  if (box.hidden) return;
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const infos = illnesses.map((illness) => describeIllness(player, illness));
  const details = node("details", "health-alert-details");
  details.open = healthAlertOpen;
  details.addEventListener("toggle", () => {
    healthAlertOpen = details.open;
  });
  const summary = node(
    "summary",
    "health-alert-summary",
    [
      ...infos.map(
        (info) =>
          `${info.disease.icon} ${info.disease.name} (${ILLNESS_STAGES[info.stage].label})`,
      ),
      ...(lowHealth ? [`💪 ${player.health}% (${band.label})`] : []),
      ...moodItems.map((item) => item.short),
    ].join(" · "),
  );
  if (
    infos.some((info) => info.stage !== "mild") ||
    ["critical", "empty"].includes(band.id)
  ) {
    summary.classList.add("is-danger");
  }
  details.append(summary);
  for (const info of infos) {
    details.append(
      node(
        "p",
        `health-alert-title is-${info.stage}`,
        `${info.disease.icon} ${info.disease.name} · ${ILLNESS_STAGES[info.stage].label} · chưa điều trị ${info.years} năm`,
      ),
      node(
        "p",
        "health-alert-risk",
        `${info.risk} · Viện phí ${formatMoney(info.cost)}`,
      ),
    );
  }
  if (lowHealth) {
    details.append(
      node(
        "p",
        "health-alert-title is-severe",
        `💪 Sức khỏe ${player.health}% (${band.label})`,
      ),
      node(
        "p",
        "health-alert-risk",
        band.id === "weak"
          ? "Dễ phải nghỉ ốm, không nhận thêm việc khi đã có việc. Nghỉ ngơi, đi bộ nhẹ (Phát triển bản thân) hoặc nghỉ dưỡng (Bệnh viện) để hồi phục."
          : `Không nhận thêm việc; làm quá sức đến kiệt sẽ phải cấp cứu (${formatMoney(EMERGENCY.cost)}). Nên nghỉ dưỡng hoặc giảm ca.`,
      ),
    );
  }
  for (const item of moodItems) {
    details.append(
      node("p", "health-alert-title is-mood", item.title),
      node("p", "health-alert-risk", item.detail),
    );
    if (item.action) {
      const button = node("button", "health-alert-button", item.action.label);
      button.type = "button";
      button.addEventListener("click", item.action.run);
      details.append(button);
    }
  }
  if (infos.length || lowHealth) {
    const go = node("button", "health-alert-button", "🏥 Đến bệnh viện");
    go.type = "button";
    go.addEventListener("click", () => hospitalUi?.open());
    details.append(go);
  }
  box.append(details);
}
 
 
 
function needsFinanceCheck() {
  const forecast = forecastNextYear(state.player);
  return (
    state.player.age >= 22 &&
    forecast.after < 0 &&
    forecast.income < forecast.costs
  );
}
function showFinanceCheck() {
  const dialog = document.getElementById("finance-check-dialog");
  const body = document.getElementById("finance-check-body");
  const player = state.player;
  const forecast = forecastNextYear(player);
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const action = (
    text,
    onClick,
    className = "shop-group health-check-action",
  ) => {
    const button = node("button", className, text);
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  };
  const record = (content) => {
    const log = { age: player.age, content, summary: content };
    state.logs.push(log);
    saveEventProgress();
    renderLogEntry(log);
    renderMoney();
    renderStats();
  };
  const list = node("ul", "dialog-entries health-check-risks");
  list.append(
    node("li", "", `💵 Thu nhập dự kiến: ${formatMoney(forecast.income)}`),
    node(
      "li",
      "",
      `🏠 Sinh hoạt phí (${(LIVING_MODES[player.livingMode] ?? LIVING_MODES.normal).label.toLowerCase()}): ${formatMoney(forecast.living)}` +
        (forecast.childcare
          ? ` · Nuôi con: ${formatMoney(forecast.childcare)}`
          : "") +
        (forecast.dating ? ` · Chi phí hẹn hò: ${formatMoney(forecast.dating)}` : "") +
        (forecast.familyBudget > forecast.dating ? ` · Học cho con và hỗ trợ cha mẹ: ${formatMoney(forecast.familyBudget - forecast.dating)}` : "") +
        (forecast.tuition
          ? ` · Học phí: ${formatMoney(forecast.tuition)}`
          : "") +
        (forecast.mortgage
          ? ` · Trả góp nhà: ${formatMoney(forecast.mortgage)}`
          : "") +
        (forecast.upkeep
          ? ` · Chăm thú cưng: ${formatMoney(forecast.upkeep)}`
          : "") +
        (forecast.interest
          ? ` · Lãi nợ: ${formatMoney(forecast.interest)}`
          : ""),
    ),
    node(
      "li",
      "",
      `👛 Ví hiện có ${formatMoney(player.money)} → sau sinh nhật khoảng ${formatMoney(forecast.after)}`,
    ),
  );
  const budgetControls = node("div", "shop-groups finance-budget");
  budgetControls.append(node("p", "side-job-intro", "Các lựa chọn áp dụng từ sinh nhật tới và giữ đến khi bạn đổi. Học cơ bản đã nằm trong phí nuôi con; các gói dưới đây là chi thêm. Con 6–22 tuổi không có gói học thêm hay hỗ trợ đại học thì gắn kết giảm dần. Hỗ trợ cha mẹ từ 65 tuổi hoặc khi yếu/bệnh nặng. Có thể giảm hoặc dừng trước năm kế tiếp; khoản đã cam kết vẫn trừ khi ở tù. Tiền thiếu trở thành nợ."));
  const livingLabel = node("label", "side-job-intro", "Mức sống: ");
  const livingSelect = node("select");
  livingSelect.id = "budget-living-mode";
  for (const [id, config] of Object.entries(LIVING_MODES)) {
    const option = node("option", "", config.label + (config.extra ? ` · thêm ${formatMoney(config.extra)}/năm · Hạnh phúc +${config.happiness} khi không nợ` : id === "frugal" ? " · bớt tối đa 12 triệu/năm · Hạnh phúc −1" : ` · ${describeYearLivingCost(player.careerPath, forecast.age)}`));
    option.value = id; livingSelect.append(option);
  }
  livingSelect.value = player.livingMode ?? "normal";
  livingSelect.disabled = player.age < 23 || player.isAlive === false || isInPrison(player);
   
  livingSelect.addEventListener("change", () => {
    player.livingMode = livingSelect.value;
    saveEventProgress();
    showFinanceCheck();
  });
  livingLabel.append(livingSelect); budgetControls.append(livingLabel);
  renderFamilyBudgetControls(budgetControls, player, () => {
    saveEventProgress();
    showFinanceCheck();
  });
  const choices = node("div", "shop-groups");
  if (player.livingMode !== "frugal") {
    choices.append(
      action(
        `📉 Giảm mức sống (sinh hoạt phí tối thiểu ${formatMoney(LIVING_MODES.frugal.floor)}, bớt tối đa ${formatMoney(FRUGAL_MAX_SAVING)}/năm, Hạnh phúc -1/năm)`,
        () => {
          state.player.livingMode = "frugal";
          record("📉 Chuyển sang sống tiết kiệm để giảm chi phí sinh hoạt.");
          showFinanceCheck();
        },
      ),
    );
  }
  if (canGetFamilySupport(player)) {
    choices.append(
      action(
        `👪 Nhận hỗ trợ từ bố mẹ (+${formatMoney(FAMILY_SUPPORT.amount)})`,
        () => {
           
          if (!canGetFamilySupport(state.player)) return;
          state.player.money += FAMILY_SUPPORT.amount;
          state.player.familySupportAge = state.player.age;
          record(
            `👪 Bố mẹ hỗ trợ một khoản lúc khó khăn: Tiền +${formatMoneyAmount(FAMILY_SUPPORT.amount)} VNĐ.`,
          );
          showFinanceCheck();
        },
      ),
    );
  }
   
  const canSeekWork = player.age < RETIREMENT_AGE && !isInPrison(player);
  if (canSeekWork) {
    choices.append(
      action("🧰 Tìm việc làm thêm", () => {
        dialog.close();
        document.getElementById("activity-part-time").click();
      }),
    );
  }
  if (canSeekWork && player.employmentStatus !== "employed") {
    choices.append(
      action("💼 Tìm việc chính (Xin việc)", () => {
        dialog.close();
        document.getElementById("activity-jobs").click();
      }),
    );
  }
  if (player.livingMode === "frugal") {
    choices.append(
      action("↩️ Trở lại mức sống bình thường", () => {
        state.player.livingMode = "normal";
        record("↩️ Trở lại mức sống bình thường.");
        showFinanceCheck();
      }),
    );
  }
  choices.append(
    action(
      player.money > 0
        ? "💰 Dùng tiền tiết kiệm"
        : "▶️ Chấp nhận thiếu hụt (ví âm)",
      () => dialog.close(),
      "shop-group health-check-action is-risky",
    ),
  );
  body.replaceChildren(
    node(
      "p",
      "side-job-intro",
      forecast.after < 0
        ? "Thu nhập năm tới chưa đủ chi phí bắt buộc. Bạn muốn xử lý thế nào trước khi sang tuổi mới?"
        : "Chi phí và thu nhập dự kiến cho năm tới.",
    ),
    list,
    budgetControls,
    node(
      "p",
      "health-check-note",
      `Thiếu hụt được ghi thành số âm trong ví (nợ) và sẽ trả dần khi có thu nhập. Từ 23 tuổi, nợ mang sang năm mới bị tính lãi ${Math.round(DEBT_INTEREST_RATE * 100)}%/năm, và kết thúc năm với ví âm thì phải sống tằn tiện (Hạnh phúc -3).`,
    ),
    choices,
  );
  if (!dialog.open) dialog.showModal();
  choices.querySelector("button")?.focus({ preventScroll: true });
}
 
function getLifeAlertItems(player) {
  const items = [];
  if (needsFinanceCheck()) {
    const forecast = forecastNextYear(player);
    items.push({
      short: "💸 Thiếu hụt dự kiến",
      title: `💸 Năm tới: thu ${formatMoney(forecast.income)}, chi ${formatMoney(forecast.costs)}`,
      detail: `Ví sau sinh nhật khoảng ${formatMoney(forecast.after)}. Có thể giảm mức sống, nhận hỗ trợ người thân, làm thêm hoặc dùng tiết kiệm.`,
      action: { label: "💸 Phương án tài chính", run: showFinanceCheck },
    });
  } else if (player.livingMode === "frugal") {
     
    items.push({
      short: "📉 Đang sống tiết kiệm",
      title: "📉 Đang sống tiết kiệm (Hạnh phúc -1/năm)",
      detail:
        "Thu nhập đã đủ chi phí năm tới. Có thể trở lại mức sống bình thường trong Phương án tài chính.",
      action: { label: "💸 Phương án tài chính", run: showFinanceCheck },
    });
  }
  for (const member of getLivingFamily(player)) {
    if (member.condition === "healthy") continue;
    const condition = CONDITIONS[member.condition];
    items.push({
      short: `${condition.icon} ${member.role} ${condition.label.toLowerCase()}`,
      title: `${condition.icon} ${member.role} ${member.name} (${member.age} tuổi) · ${condition.label}`,
      detail:
        "Gọi điện, về thăm hoặc chăm sóc trong Quan hệ → Gia đình. Chăm sóc giúp ích nhưng không bảo đảm khỏi bệnh.",
    });
  }
  if (player.jobWarning && player.employmentStatus === "employed") {
    items.push({
      short: "⚠️ Cảnh báo công việc",
      title: `⚠️ Đang trong diện cảnh báo · đánh giá lại ở sinh nhật ${player.jobWarning.issuedAt + 1} tuổi`,
      detail:
        "Kết quả phụ thuộc kế hoạch cải thiện đã chọn, Trí tuệ, Sức khỏe và động lực.",
    });
  }
  if (player.layoffDue && player.employmentStatus === "employed") {
    items.push({
      short: "📉 Sắp bị cắt giảm",
      title: `📉 Bị cắt giảm nhân sự ở sinh nhật ${player.layoffDue} tuổi`,
      detail: `Nhận trợ cấp ${formatMoney(player.layoffSeverance ?? 0)}. Có thể chuẩn bị trước: Xin việc, làm thêm, tiết kiệm.`,
    });
  }
  if (
    Number.isInteger(player.contractEndAge) &&
    player.employmentStatus === "employed" &&
    player.contractEndAge - player.age <= 1
  ) {
    items.push({
      short: "📄 Hợp đồng sắp hết",
      title: `📄 Hợp đồng hết hạn ở sinh nhật ${player.contractEndAge} tuổi`,
      detail: player.contractEnding
        ? "Hợp đồng sẽ không gia hạn. Có thể tìm việc mới qua Xin việc khi hết hạn."
        : "Sẽ có thông báo để xin gia hạn hoặc chọn hướng khác.",
    });
  }
  return items;
}
 
function getAgeUpHealthRisks() {
  const player = state.player;
  const nextAge = player.age + 1;
  const illnesses = getDangerousIllnesses(player, nextAge);
  const band = getHealthBand(player.health).id;
  const lowHealth =
    (band === "critical" || band === "empty") && player.restYear !== nextAge;
  return {
    nextAge,
    illnesses,
    lowHealth,
    any: illnesses.length > 0 || lowHealth,
  };
}
function showHealthCheck() {
  const dialog = document.getElementById("health-check-dialog");
  const body = document.getElementById("health-check-body");
  const player = state.player;
  const { nextAge, illnesses, lowHealth } = getAgeUpHealthRisks();
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const action = (
    text,
    onClick,
    className = "shop-group health-check-action",
  ) => {
    const button = node("button", className, text);
    button.type = "button";
    button.addEventListener("click", onClick);
    return button;
  };
  const record = (content) => {
    const log = { age: player.age, content, summary: content };
    state.logs.push(log);
    saveEventProgress();
    renderLogEntry(log);
    renderStats();
    renderEducation();
  };
  const proceed = () => {
    state.player.healthCheckAge = state.player.age;
    saveEventProgress();
    dialog.close();
    ageButton.click();
  };
  const list = node("ul", "dialog-entries health-check-risks");
  for (const entry of illnesses) {
    list.append(
      node(
        "li",
        "",
        `${entry.disease.icon} ${entry.disease.name}: năm tới mức ${ILLNESS_STAGES[entry.stage].label}, Sức khỏe -${entry.loss}` +
          (entry.deathChance
            ? `, nguy cơ tử vong ${formatChance(entry.deathChance)}`
            : "") +
          ".",
      ),
    );
  }
  if (lowHealth) {
    list.append(
      node(
        "li",
        "",
        `💪 Sức khỏe ${player.health}%: ${(player.sideJobs ?? []).length ? "làm thêm dễ phải nghỉ ốm, làm đến kiệt sức sẽ phải cấp cứu" : "cơ thể rất yếu, bệnh tiến triển nhanh hơn"} (${formatMoney(EMERGENCY.cost)} nếu cấp cứu).`,
      ),
    );
  }
  const choices = node("div", "shop-groups");
  if (illnesses.length)
    choices.append(
      action("🏥 Đến bệnh viện điều trị", () => hospitalUi?.open()),
    );
  if (lowHealth && (player.sideJobs ?? []).length) {
    if (canReduceSideJobs(player)) {
      choices.append(
        action("✂️ Giảm ca: chỉ giữ 1 ca part-time", () => {
          reduceSideJobs(state.player);
          record("✂️ Giảm ca làm thêm vì sức khỏe: chỉ giữ 1 ca part-time.");
          showHealthCheck();
        }),
      );
    }
    choices.append(
      action("🚪 Nghỉ hết việc làm thêm", () => {
        quitSideJobs(state.player);
        record("🚪 Nghỉ hết việc làm thêm để giữ sức khỏe.");
        showHealthCheck();
      }),
    );
  }
  if (player.restYear !== nextAge) {
    choices.append(
      action("🛌 Nghỉ dưỡng năm tới rồi sang tuổi mới", () => {
        state.player.restYear = nextAge;
        record(`🛌 Đăng ký nghỉ dưỡng trong năm tới (${nextAge} tuổi).`);
        proceed();
      }),
    );
  }
  choices.append(
    action(
      "▶️ Vẫn tiếp tục sang tuổi mới",
      proceed,
      "shop-group health-check-action is-risky",
    ),
  );
  body.replaceChildren(
    node(
      "p",
      "side-job-intro",
      "Sức khỏe của bạn đang gặp nguy cơ. Bạn muốn xử lý thế nào trước khi sang tuổi mới?",
    ),
    list,
    node(
      "p",
      "health-check-note",
      "Nghỉ dưỡng miễn phí: hồi phục sức khỏe, tạm nghỉ ca làm thêm, bệnh hao sức ít hơn nhưng không khỏi nếu không điều trị. Tiếp tục mà không xử lý có thể phải cấp cứu hoặc nguy hiểm đến tính mạng.",
    ),
    choices,
  );
  if (!dialog.open) dialog.showModal();
  choices.querySelector("button")?.focus({ preventScroll: true });
}
 
renderStats();
function renderLogContent(element, text) {
  element.replaceChildren();
  appendColoredNumbers(element, cleanLogText(text));
}
// Hide chain bookkeeping in results and journals, including older saves.
function cleanLogText(text) {
  const cleaned = formatMoneyText(text)
    .replace(
      /\n?Sức khỏe luôn còn ít nhất 1 điểm; chuỗi này không gây tử vong\./giu,
      "",
    )
    .replace(/(^|[.!?]\s+)(?:kết thúc chuỗi|chuỗi kết thúc)\.[ \t]*/giu, "$1")
    .replace(/(?:kết thúc chuỗi|chuỗi kết thúc)(?:\s+mà)?\s*,?\s*/giu, "")
    .replace(/[,;]\s*\./g, ".")
    .replace(/([.!?])\s*\./g, "$1");
  return addEventEmotions(cleaned);
}
function appendColoredNumbers(element, text) {
   
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
       
      element.append(document.createTextNode(part));
    }
  });
}
function updateStatColor(id, value) {
  const bar = document.getElementById(id);
  let color;
  if (value <= 20) {
    color = "#e53935";  
  } else if (value <= 50) {
    color = "#fb8c00"; // Cam
  } else if (value <= 80) {
    color = "#fdd835";  
  } else {
    color = "#43a047";  
  }
  bar.style.setProperty("--stat-color", color);
}
function renderMoney() {
  const moneyElement = document.getElementById("money-value");
  moneyElement.textContent = formatMoneyAmount(state.player.money);
   
  moneyElement
    .closest(".wallet")
    ?.classList.toggle("is-debt", state.player.money < 0);
   
  const forecastElement = document.getElementById("money-forecast");
  if (forecastElement) {
    const forecast = forecastNextYear(state.player);
    const net = forecast.income - forecast.costs;
    forecastElement.hidden =
      state.player.isAlive === false || (!forecast.income && !forecast.costs);
    forecastElement.textContent = `Năm tới: ${net >= 0 ? "+" : "−"}${formatMoneyAmount(Math.abs(net))}`;
    forecastElement.title = `Thu ${formatMoney(forecast.income)} · Chi ${formatMoney(forecast.costs)} · Ví sau sinh nhật ${formatMoney(forecast.after)}`;
    forecastElement.classList.toggle("is-negative", forecast.after < 0);
  }
}
 
// Update legacy employment state without inventing historical pension payments.
retirePlayer(state.player);
 
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
      : isInPrison(state.player)
        ? `Đang thụ án · Ra tù ở tuổi ${state.player.prison.releaseAge}`
        : state.player.age < 11
          ? "Mở khi vào cấp 2 (11 tuổi)"
          : "Mở hoạt động";
  button.title = description;
  button.setAttribute("aria-label", `Hoạt động. ${description}`);
}
 
renderEducation();
initRelationships(state, saveEventProgress, (log) => {
  renderLogEntry(log);
  renderMoney();
  renderStats();
});
 
 
 
function renderLogLines(element, text) {
  const LOG_ICON =
    /^((?:\p{Extended_Pictographic}|\p{Regional_Indicator})(?:️|⃣|\p{Emoji_Modifier}|\p{Regional_Indicator}|‍\p{Extended_Pictographic})*)\s*/u;
  element.replaceChildren();
  const rows = cleanLogText(text)
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);
  for (const row of rows) {
    const line = document.createElement("span");
    line.className = "log-line";
    const icon = document.createElement("span");
    icon.className = "log-icon";
    const body = document.createElement("span");
    body.className = "log-text";
    const match = row.match(LOG_ICON);
    if (match) icon.textContent = match[1];
    else line.classList.add("is-plain");
    appendColoredNumbers(body, match ? row.slice(match[0].length) : row);
    line.append(icon, body);
    element.append(line);
  }
  const count = Number(element.dataset.count ?? 1);
  if (count > 1) {
    const badge = document.createElement("span");
    badge.classList.add("log-repeat");
    badge.textContent = ` ×${count}`;
    (element.querySelector(".log-line:last-child .log-text") ?? element).append(
      badge,
    );
  }
}
function renderLogEntry(log) {
  const text = compactLogText(log.summary ?? summarizeLifeLog(log.content));
  const last = logElement.lastElementChild;
  const sameAge = last?.dataset.age === String(log.age);
   
  const repeated =
    sameAge &&
    [...last.querySelectorAll("p")].find((line) => line.dataset.text === text);
  if (repeated) {
    repeated.dataset.count = Number(repeated.dataset.count ?? 1) + 1;
    renderLogLines(repeated, text);
    logLines.set(log, repeated);
    return;
  }
  const content = document.createElement("p");
  content.dataset.text = text;
  logLines.set(log, content);
   
  renderLogLines(content, text);
   
  if (sameAge) {
    last.classList.remove("is-quiet");
    last.append(content);
    return;
  }
  const logItem = document.createElement("section");
  logItem.classList.add("log-entry");
   
  if (text === "Một năm bình lặng.") logItem.classList.add("is-quiet");
  logItem.dataset.age = log.age;
  const title = document.createElement("h3");
  title.textContent = `${log.age} tuổi`;
  logItem.append(title, content);
  logElement.append(logItem);
}
 
function updateLogEntry(log) {
  const line = logLines.get(log);
  if (!line) {
    renderLogEntry(log);
    return;
  }
  const text = compactLogText(log.summary ?? summarizeLifeLog(log.content));
  line.dataset.text = text;
  renderLogLines(line, text);
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
    isInPrison(state.player) ||
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
    heading.textContent = `🎓 ${getStudyBlockLabel(block.id)}: ${block.subjects}`;
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
 
function saveEventProgress() {
  state.player.lifeId ??= getLifeId(state);
  observeLifeProgress(state.player, state.pendingEvent);
  saveGame(state);
}
 
const DOUBLE_TAP_GUARD_MS = 350;
let choicesReadyAt = 0;
 
function showPendingEvent() {
  const pending = state.pendingEvent;
  if (!pending) return;
  if (pending.stage === "choice" && pending.id === "career-18") pending.choices = careerEvent.choices.map(choice => ({ ...choice }));
  retirePlayer(state.player, pending.age);
  if (
    pending.stage === "choice" &&
    state.player.employmentStatus === "retired" &&
    [
      "job-warning",
      "job-review",
      "layoff-notice",
      "contract-notice",
      "career-promotion",
    ].includes(pending.kind)
  ) {
    Object.assign(pending, {
      kind: "retirement",
      category: "everyday",
      title: "Một năm nghỉ hưu",
      text: "Tôi đã nghỉ hưu, những chuyện ở công ty không còn là việc của mình.",
      choices: [
        {
          label: "Tiếp tục",
          text: "Tôi dành thời gian cho cuộc sống sau nghỉ hưu.",
          effects: {},
        },
      ],
    });
  }
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
    pending.kind !== "prison" &&
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
              (pending.id && event.id === pending.id) ||
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
        pending.automaticResult = current.automaticResult === true;
        pending.catalogVersion = current.catalogVersion;
        if (current.catalogVersion || pending.automaticResult) {
          pending.title = current.title;
          pending.text = current.text;
        }
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
            const source = branch.sourceIndex ?? index;
            const match = current.choices.find(
              (candidate, position) =>
                (candidate.sourceIndex ?? position) === source,
            );
            branch[key] = match?.[key] ?? branch[key];
          });
        }
      }
    }
  }
  // Passive stories open directly on their saved result, with one acknowledgement.
  if (pending.stage === "choice" && pending.automaticResult) {
    chooseEventAction(0);
    return;
  }
  // Saved prose is also interpolated; never reapply a saved result transaction.
  const textPlayer = { ...state.player, storyAge: pending.age };
  for (const key of [
    "title",
    "text",
    "content",
    "logContent",
    "logSummary",
    "confirmText",
    "imageAlt",
    "imageFallbackAlt",
  ]) {
    if (typeof pending[key] === "string")
      pending[key] = fillStoryText(pending[key], textPlayer);
  }
  for (const choice of pending.choices ?? []) {
    for (const key of [
      "label",
      "title",
      "text",
      "logContent",
      "logSummary",
      "confirmText",
    ]) {
      if (typeof choice[key] === "string")
        choice[key] = fillStoryText(choice[key], textPlayer);
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
  choicesReadyAt = performance.now() + DOUBLE_TAP_GUARD_MS;
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
     
    eventContent.replaceChildren();
    let remaining = addEventEmotions(pending.text);
    while (remaining) {
      const matches = (pending.warningPhrases ?? [])
        .filter((phrase) => typeof phrase === "string" && phrase.length > 0)
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
    if (pending.dialogueLines?.length) {
      const dialogue = document.createElement("div");
      dialogue.className = "dating-dialogue";
      dialogue.setAttribute("aria-label", "Cuộc đối đáp");
      for (const line of pending.dialogueLines) {
        const turn = document.createElement("div");
        turn.className = "dating-dialogue-turn";
        turn.dataset.role = line.role ?? "partner";
        const speaker = document.createElement("strong");
        speaker.textContent = line.speaker;
        const words = document.createElement("p");
        words.textContent = addEventEmotions(line.text);
        turn.append(speaker, words);
        dialogue.append(turn);
      }
      eventContent.append(dialogue);
    }
    if (pending.category === "special") {
      const dialogue = getSpecialDialogue(pending);
      if (dialogue)
        eventContent.append(document.createTextNode(`\n\n${dialogue}`));
    }
     
    if (pending.referenceNotes) {
      const notes = document.createElement("details");
      notes.className = "event-reference-notes";
      const summary = document.createElement("summary");
      summary.textContent = "📜 Xem lại các manh mối trước";
      const body = document.createElement("p");
      body.textContent = formatMoneyText(pending.referenceNotes);
      notes.append(summary, body);
      eventContent.append(notes);
    }
    eventConfirm.hidden = true;
     
    const choiceLabels = addChoiceIcons(
      pending.choices.map((choice) => formatMoneyText(choice.label)),
    );
    pending.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "event-choice";
      button.textContent = choiceLabels[index];
      const blocker = getChoiceBlocker(choice);
      button.disabled = Boolean(blocker);
      if (blocker) button.textContent += ` · ${blocker}`;
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
        label.textContent = addChoiceIcon(choice.label.replace(/^🎮\s*/u, ""));
        button.replaceChildren(emblem, label);
      }
       
      if (choice.careerPath && choice.careerPath.id !== "casual" && !Object.hasOwn(choice.careerPath, "school")) {
        const lock = getRankLock(state.player, choice.careerPath.id);
        const note = document.createElement("small");
        note.className = "event-choice-note";
        note.textContent =
          choice.careerPath.id === "study-abroad"
            ? lock.reason
            : lock.unlocked
              ? "⭐ Có dấu mốc tuổi 16: mở được bậc 3"
              : "Tối đa bậc 2 · bậc 3 cần chuỗi tuổi 16 của chính ngành này";
        button.append(note);
      }
      button.addEventListener("click", (event) => {
         
        if (event.isTrusted && performance.now() < choicesReadyAt) return;
        chooseEventAction(index);
      });
      eventChoices.append(button);
    });
  } else {
     
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
    eventConfirm.textContent = addChoiceIcon(pending.confirmText ?? "Xác nhận");
    eventConfirm.hidden = false;
  }
   
  const outcomeSound =
    pending.outcome && !pending.outcomeSoundPlayed ? pending.outcome : null;
  if (outcomeSound) pending.outcomeSoundPlayed = true;
  if (!eventDialog.open) {
    eventDialog.showModal();
     
    if (!outcomeSound) playEventSound(pending.category);
  }
  if (outcomeSound) playOutcomeSound(outcomeSound);
  if (pending.stage === "result") animateEventResult();
   
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
 
 
function getChoiceOutcome(pending, choice) {
  if (choice.outcome === "success" || choice.outcome === "failure")
    return choice.outcome;
  if (
    pending.kind === "career-promotion" &&
    typeof choice.correct === "boolean"
  ) {
    return choice.correct ? "success" : "failure";
  }
   
  if (choice.careerPath?.school) return "success";
  return null;
}

 
function getChoiceBlocker(choice) {
  if (!canAffordChoice(state.player, choice)) return "Không đủ tiền";
  if (
    choice.minIntelligence &&
    (state.player.intelligence ?? 0) < choice.minIntelligence
  ) {
    return `Cần Trí tuệ ${choice.minIntelligence}`;
  }
  return "";
}
function chooseEventAction(index) {
  const pending = state.pendingEvent;
   
  if (!pending || pending.stage !== "choice") return;
  let choice = pending.choices[index];
  if (!choice) return;
  if (!canAffordChoice(state.player, choice)) {
    eligibilityFeedback.textContent = `Không đủ tiền: cần ${formatMoneyAmount(-choice.money)} VNĐ.`;
    eligibilityFeedback.hidden = false;
    return;
  }
  if (
    choice.minIntelligence &&
    (state.player.intelligence ?? 0) < choice.minIntelligence
  ) {
    eligibilityFeedback.textContent = `Chưa đủ điều kiện: cần Trí tuệ từ ${choice.minIntelligence} (hiện có ${state.player.intelligence ?? 0}).`;
    eligibilityFeedback.hidden = false;
    return;
  }
  if (pending.kind === "study-abroad-country" && choice.careerPath) {
    const next = createStudyAbroadMajorEvent(choice.careerPath, state.player);
    if (!next) return;
    state.pendingEvent = createChainStep(choice, pending, {
      ...next,
      stage: "choice",
      age: pending.age,
    });
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "study-abroad-drama" && choice.nextStep) {
    const replies = [...(pending.abroadReplies ?? []), choice.abroadReply];
    const next = createStudyAbroadDramaStep(
      state.player,
      pending.age,
      choice.nextStep,
      replies,
    );
    if (!next) return;
    next.logPrefix = `${pending.logPrefix ?? ""}${(pending.dialogueLines ?? []).map((l) => `${l.speaker}: ${l.text}`).join("\n")}\nTôi đáp: ${choice.label}\n`;
    state.pendingEvent = { ...next, stage: "choice", age: pending.age };
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "job-interview") {
     
    const assessment = rollInterview(
      state.player,
      choice.quality ?? (choice.correct === true ? "good" : "weak"),
    );
    state.pendingEvent = createInterviewResult(
      state.player,
      assessment.passed,
      pending.age,
      assessment,
    );
    state.pendingEvent.category = pending.category;
     
    state.pendingEvent.outcome =
      state.pendingEvent.updates.employmentStatus === "employed"
        ? "success"
        : "failure";
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "job-interview-retry" && choice.retryInterview) {
    state.pendingEvent = createChainStep(choice, pending, {
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
  if (
    pending.kind === "dating-discovery" &&
    choice.nextStep &&
    pending.datingDrama
  ) {
    const drama = {
      ...pending.datingDrama,
      replies: [...pending.datingDrama.replies, choice.response],
    };
    const next = createDatingDramaStep(
      state.player,
      pending.age,
      choice.nextStep,
      drama,
    );
    if (!next) return;
    const dialogue = (pending.dialogueLines ?? [])
      .map((line) => `${line.speaker}: ${line.text}`)
      .join("\n");
    state.pendingEvent = {
      ...next,
      stage: "choice",
      age: pending.age,
      logPrefix: `${pending.logPrefix ?? ""}${pending.text}\n${dialogue}\nTôi đáp: ${choice.label}\n\n`,
    };
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (pending.kind === "orientation-chain" && choice.nextStep) {
    const nextStep = createOrientationEvent(state.player, choice.nextStep);
    if (!nextStep) return;
    state.pendingEvent = createChainStep(choice, pending, {
      ...nextStep,
      stage: "choice",
      age: pending.age,
    });
    saveEventProgress();
    showPendingEvent();
    return;
  }
   
  if (pending.kind === "career-spark-pick" && choice.careerSparkId) {
    const firstStep = createCareerSparkStep(
      choice.careerSparkId,
      1,
      Math.random,
      state.player,
    );
    if (!firstStep) return;
    state.pendingEvent = {
      ...firstStep,
      stage: "choice",
      age: pending.age,
      logPrefix: `${pending.text}\nBạn chọn: ${choice.label}\n`,
    };
    saveEventProgress();
    showPendingEvent();
    return;
  }
   
  if (
    (pending.kind === "career-spark" || pending.kind === "career-promotion") &&
    choice.nextStep
  ) {
    const nextStep =
      pending.kind === "career-spark"
        ? createCareerSparkStep(
            pending.careerSparkId,
            choice.nextStep,
            Math.random,
            state.player,
          )
        : createMilestonePromotionEvent(
            state.player,
            choice.nextStep,
            pending.age,
          );
    if (!nextStep) return;
    state.pendingEvent = createChainStep(choice, pending, {
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
    const nextStep = createSpecialStep(pending.kind, pending.specialId, choice.nextStep, {}, state.player);
    if (!nextStep) return;
    state.pendingEvent = createChainStep(choice, pending, {
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
    const inventory = applySpecialInventory(pending.specialInventory, choice);
     
    const nextStep = createSpecialStep(
      pending.kind,
      pending.specialId,
      choice.nextStep,
      inventory,
      state.player,
    );
    if (!nextStep) return;
    state.pendingEvent = createChainStep(choice, pending, {
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
   
  if (pending.kind === "exam-prep" && choice.examPrep) {
    const prep = EXAM_PREP[choice.examPrep];
    if (prep?.health)
      state.player.health = Math.max(1, state.player.health + prep.health);
    const test = createCareerTest(pending.testedCareer, Math.random, {
      player: state.player,
      prep: choice.examPrep,
      retakesLeft: pending.retakesLeft,
    });
    state.pendingEvent = createChainStep(choice, pending, {
      ...test,
      stage: "choice",
      age: pending.age,
      logPrefix: `${pending.logPrefix ?? ""}Chuẩn bị bài test: ${choice.label}\n`,
    });
    saveEventProgress();
    showPendingEvent();
    return;
  }
   
  if (pending.kind === "career-test") {
    const passed = choice.correct === true || choice.passedOverall === true;
    const next = passed
      ? createSchoolEvent(pending.testedCareer, state.player)
      : createFailedTestEvent(pending.testedCareer, pending.retakesLeft ?? 0);
    state.pendingEvent = createMediaTransition(
      choice,
      pending,
      {
        ...next,
        stage: "choice",
        age: pending.age,
        text: next.text,
        logPrefix: `${pending.logPrefix ?? ""}Bài test ${pending.testedCareer.field}: ${passed ? "đạt" : "không đạt"}.\n`,
      },
      choice.correct
        ? "Bạn trả lời đúng."
        : passed
          ? "Câu trả lời chưa đúng, nhưng phần thi tổng thể (nhờ chuẩn bị và năng lực) vẫn đạt."
          : "Câu trả lời chưa đúng và phần thi tổng thể chưa đạt lần này.",
    );
    state.pendingEvent.outcome = passed ? "success" : "failure";
    saveEventProgress();
    showPendingEvent();
    return;
  }
   
  if (
    pending.kind === "enlistment-failure" &&
    (choice.retakeTest || choice.reselectCareer)
  ) {
    const next = choice.retakeTest
      ? createExamPrepEvent(
          pending.testedCareer,
          state.player,
          (pending.retakesLeft ?? 1) - 1,
        )
      : careerEvent;
    if (choice.retakeTest)
      state.player.intelligence = Math.min(100, state.player.intelligence + 2);
    state.pendingEvent = createChainStep(choice, pending, {
      ...next,
      stage: "choice",
      age: pending.age,
      logPrefix: `${pending.logPrefix ?? ""}${choice.retakeTest ? "Học bổ sung rồi thi lại (Trí tuệ +2)." : "Chọn lại ngành."}\n`,
    });
    saveEventProgress();
    showPendingEvent();
    return;
  }
  if (choice.careerPath?.id === "casual" && pending.age === 18) {
    choice = createCasualStartChoice(state.player, choice);
  }
   
  if (
    choice.careerPath &&
    !Object.hasOwn(choice.careerPath, "school") &&
    failsFootballFitness(choice.careerPath.id, state.player.health)
  ) {
    eligibilityFeedback.textContent = `${choice.careerPath.field} cần Sức khỏe từ ${FOOTBALL_MIN_HEALTH}% (hiện ${state.player.health}%). Hãy chọn ngành khác.`;
    eligibilityFeedback.hidden = false;
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
    }.`;
    eligibilityFeedback.hidden = false;
    return;
  }
   
  if (choice.careerPath && !Object.hasOwn(choice.careerPath, "school")) {
     
    const schoolEvent =
      createExamPrepEvent(choice.careerPath, state.player) ??
      createSchoolEvent(choice.careerPath, state.player);
    state.pendingEvent = createChainStep(choice, pending, {
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
   
  if (
    pending.category === "everyday" &&
    !pending.automaticResult &&
    !pending.catalogVersion
  )
    choice = rollEverydayLuck(choice, state.player);
   
  choice = softenSetback(state.player, choice, pending.category);
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
   
  if (choice.playerUpdates) Object.assign(updates, choice.playerUpdates);
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
   
  state.pendingEvent = {
    stage: "result",
    specialId: pending.specialId,
    specialStep: pending.specialStep,
    category: pending.category,
    outcome: getChoiceOutcome(pending, choice),
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
      (pending.automaticResult
        ? `${pending.title}\n${resultContent}`
        : createEventLogSummary({
            title: pending.title,
            choiceLabel: pending.automaticResult ? "" : choice.label,
            resultTitle: choice.title,
            resultText: choice.text,
            changes,
          })),
     
    logContent:
      choice.logContent ??
      (pending.automaticResult
        ? resultContent
        : `${pending.logPrefix ?? ""}${pending.text}\n${(pending.dialogueLines ?? []).map((line) => `${line.speaker}: ${line.text}`).join("\n")}${pending.dialogueLines?.length ? "\n" : ""}` +
          `Bạn chọn: ${choice.label}\n` +
          resultContent),
    updates: updates,
  };
  saveEventProgress();
  showPendingEvent();
}
 
ageButton.addEventListener("click", () => {
  if (state.pendingEvent || state.player.isAlive === false) return;
   
  if (!isInPrison(state.player) && gamesUi.hasActiveTienLen()) {
    if (!document.querySelector("dialog[open]")) {
      gamesUi.openTienLen(
        "⏳ Ván Tiến lên đang dở: đánh xong hoặc bỏ ván rồi mới sang năm mới.",
      );
    }
    return;
  }
  if (
    !isInPrison(state.player) &&
    state.player.age >= 15 &&
    !state.player.studyBlock
  ) {
    showStudyBlocks();
    return;
  }
  if (
    !isInPrison(state.player) &&
    state.player.healthCheckAge !== state.player.age &&
    getAgeUpHealthRisks().any
  ) {
    showHealthCheck();
    return;
  }
  const nextAge = state.player.age + 1;
  retirePlayer(state.player, nextAge);

   
  if (checkOldAgeDeath(nextAge)) {
    return;
  }

  const schoolYearEvent =
    nextAge === 11 && state.player.lostChildSchoolYearDueAge === 11
      ? createSpecialStep("lost-child-chain", "lost-child-school", 5, {}, state.player)
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
    createPrisonEvent(state.player, nextAge) ??
    createCasualServiceEvent(state.player, nextAge) ??
     
     
    (nextAge === 18 ? careerEvent : null) ??
    orientationEvent ??
    createWorkInvestigationEvent(state.player, nextAge) ??
    (nextAge === 16
      ? (ageStories.find((event) => event.kind === "career-spark-pick") ??
        null)
      : null) ??
    (nextAge === 100
      ? ageStories.find((event) => event.id === "centennial-memorial")
      : null) ??
    createStudyAbroadYearEvent(state.player, nextAge) ??
    promotionEvent ??
    schoolYearEvent ??
    employmentEvent ??
    createRelativeDeathEvent(state.player, nextAge) ??
    createConcurrentDatingEvent(state.player, nextAge) ??
    createMaritalAffairEvent(state.player, nextAge) ??
    createJobReviewEvent(state.player, nextAge) ??
    createContractNoticeEvent(state.player, nextAge) ??
    createSupportEvent(state.player, nextAge);
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
    postponeDatingMarriage(state.player, marriageEvent.person.id, nextAge + 1);
    marriageEvent = null;
  }
  if (childEvent && priorityEvent) {
    state.player.nextChildProposalAge = nextAge + 1;
    childEvent = null;
  }
  const datingEvent =
    state.player.marriedAtAge == null &&
    !state.player.datingActivitiesOnly &&
    !promotionEvent &&
    (nextAge === 25 || nextAge === 28)
      ? createDatingEvent(state.player, nextAge)
      : null;
  const stories = [...ageStories, ...(datingEvent ? [datingEvent] : [])];
   
  const moodEvent =
    nextAge > 18 &&
    !priorityEvent &&
    !randomAgeStory &&
    !marriageEvent &&
    !childEvent &&
    !datingEvent &&
    !orientationEvent &&
    !employmentEvent
      ? (createWorkTemptationEvent(state.player, nextAge) ??
        createWorkProblemEvent(state.player, nextAge) ??
        createProjectBugEvent(state.player, nextAge) ??
        createLayoffNoticeEvent(state.player, nextAge) ??
        createCastingEvent(state.player, nextAge) ??
        createMeetFamilyEvent(state.player, nextAge) ??
        createRiskOfferEvent(state.player, nextAge) ??
        createMoodEvent(state.player, nextAge))
      : null;
   
   
  const eventChance = 0.8;

  const hasEvent =
    Boolean(priorityEvent) ||
    (nextAge === 25 && Boolean(datingEvent)) ||
    Boolean(marriageEvent) ||
    Boolean(childEvent) ||
    Boolean(orientationEvent) ||
    Boolean(schoolYearEvent) ||
    Boolean(employmentEvent) ||
    Boolean(moodEvent) ||
    nextAge === 16 ||
    nextAge === 18 ||
    (Array.isArray(stories) &&
      stories.length > 0 &&
      (randomSpecialYear
        ? Boolean(randomAgeStory)
        : nextAge <= 10 || Math.random() < eventChance));

   
   
  const ordinaryYear =
    !priorityEvent &&
    !promotionEvent &&
    !marriageEvent &&
    !childEvent &&
    !orientationEvent &&
    !schoolYearEvent &&
    !employmentEvent &&
    !moodEvent &&
    !randomAgeStory &&
    !(nextAge === 25 && datingEvent) &&
    nextAge !== 16 &&
    nextAge !== 18;
  const quietYearAcquaintance =
    !hasEvent && ordinaryYear
      ? createAcquaintanceEvent(state.player, nextAge)
      : null;
  if (!hasEvent && !quietYearAcquaintance) {
    const {
      salary,
      childcare,
      schooling,
      livestock,
      sideJobs,
      living,
      illness,
      lottery,
      graduation,
      tuition,
      health,
      mood,
      employment,
      family,
      cognition,
    } = completeLifeYear(state.player, nextAge);

    const log = {
      age: nextAge,
      content: salary
        ? `${salary.retired ? "Một năm nghỉ hưu thong thả." : "Một năm làm việc bình thường."}\n${salary.content}`
        : "Không có gì thay đổi, mọi thứ vẫn vậy.",
    };

    if (childcare.content) log.content += `\n${childcare.content}`;
    if (schooling)
      log.content =
        schooling.content +
        (salary || childcare.content ? `\n${log.content}` : "");
     
    const extras = [
      employment,
      family,
      health,
      illness,
      cognition,
      mood,
      tuition,
      livestock,
      sideJobs,
      living,
      lottery,
      graduation,
    ]
      .filter(Boolean)
      .map((entry) => entry.content);
    if (extras.length)
      log.content =
        salary || childcare.content || schooling
          ? `${log.content}\n${extras.join("\n")}`
          : extras.join("\n");
    log.summary = log.content;
    state.logs.push(log);
    saveEventProgress();

     
    ageElement.textContent = state.player.age;
    renderMoney();
    renderStats();
    renderAvatar(state.player);
    renderEducation();
    renderLogEntry(log);

     
    if (state.player.isAlive === false) {
      endLifeAfterYear();
      return;
    }

     
    const logContainer = logElement.parentElement;
    logContainer.scrollTop = logContainer.scrollHeight;

     
    checkAchievements();
     
    lotteryUi.showResults();

     
    return;
  }
  const pickedStory =
    (["prison", "casual-service"].includes(priorityEvent?.kind) ? priorityEvent : null) ??
    quietYearAcquaintance ??
    (nextAge === 25 ? datingEvent : null) ??
    priorityEvent ??
    promotionEvent ??
    marriageEvent ??
    childEvent ??
    orientationEvent ??
    schoolYearEvent ??
    employmentEvent ??
    moodEvent ??
    (nextAge === 18
      ? careerEvent
      : (randomAgeStory ??
        (stories?.length
          ? pickWeightedStory(stories)
          : {
              title: "Một năm mới",
              text: "Một năm nữa đã trôi qua.",
              effects: {},
            })));
  const story =
    !quietYearAcquaintance && ordinaryYear
      ? (createAcquaintanceEvent(state.player, nextAge) ?? pickedStory)
      : pickedStory;
   
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
    datingDrama: story.datingDrama,
    dialogueLines: story.dialogueLines,
    abroadReplies: story.abroadReplies,
    addedEveryday: story.addedEveryday === true,
    automaticResult: story.automaticResult === true,
    catalogVersion: story.catalogVersion,
    category: story.category,
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
 
eventConfirm.addEventListener("click", (event) => {
  const pending = state.pendingEvent;
  if (!pending || pending.stage === "choice") return;
  if (event.isTrusted && performance.now() < choicesReadyAt) return;
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
  const {
    salary,
    childcare,
    schooling,
    livestock,
    sideJobs,
    living,
    illness,
    lottery,
    graduation,
    tuition,
    health,
    mood,
    employment,
    family,
    cognition,
  } = completeLifeYear(
    state.player,
    pending.age,
    pending.updates,
    pending.schoolReward,
  );
  observeLifeProgress(state.player, pending, true);
  recordAchievementFlags(state, [
    ...(pending.achievementIds ?? []),
    ...educationEntryAchievementIds(pending.updates?.careerPath, pending.age),
  ]);
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
  for (const extra of [
    employment,
    family,
    health,
    illness,
    cognition,
    mood,
    tuition,
    livestock,
    sideJobs,
    living,
    lottery,
    graduation,
  ]) {
    if (!extra) continue;
    log.content += `\n${extra.content}`;
    log.summary += `\n${extra.content}`;
  }
  state.logs.push(log);
  state.pendingEvent = null;
   
  const died =
    state.player.isAlive === false ||
    (!pending.nonFatal && state.player.health <= 0);
  if (died) {
    state.player.isAlive = false;
     
    if (!state.player.deathCause) {
      state.player.deathCause = "event";
      state.player.deathEvent = pending.title;
    }
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
    showLifeSummary();
  }
  checkAchievements();
  lotteryUi.showResults();
});
 
eventDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
});
 
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
const budgetButton = document.createElement("button");
budgetButton.type = "button";
budgetButton.id = "open-family-budget";
budgetButton.className = "shop-group";
budgetButton.textContent = "🏠 Ngân sách năm tới";
budgetButton.addEventListener("click", () => {
  document.getElementById("life-profile-dialog").close();
  showFinanceCheck();
});
document.getElementById("life-tabs").before(budgetButton);
initCrime(state, {
  save: saveEventProgress,
  renderMoney,
  renderStats,
  renderEducation,
  renderLogEntry,
});
initShop(state, {
  renderMoney,
  renderStats,
  renderLogEntry,
  checkAchievements,
});
initLicenses(state, { renderLogEntry });
initSideJobs(state, {
  renderMoney,
  renderStats,
  renderLogEntry,
  renderEducation,
  checkAchievements,
});
initJobApplications(state, {
  renderMoney,
  renderLogEntry,
  renderEducation,
  checkAchievements,
});
document
  .getElementById("close-finance-check")
  .addEventListener("click", () =>
    document.getElementById("finance-check-dialog").close(),
  );
hospitalUi = initHospital(state, {
  renderMoney,
  renderLogEntry,
  onChange: renderStats,
});
initMatchmaking(state, {
  renderMoney,
  renderStats,
  renderLogEntry,
  checkAchievements,
});
const gamesUi = initGames(state, { renderMoney, renderLogEntry, checkAchievements });
initFood(state, { renderMoney, renderStats, renderLogEntry });
initBeauty(state, { renderMoney, renderStats, renderLogEntry });
const lotteryUi = initLottery(state, {
  renderMoney,
  renderLogEntry,
  updateLogEntry,
});
 
lotteryUi.showResults();
initTravel(state, { renderMoney, renderStats, renderLogEntry });
initGameCenter(state, {
  renderMoney,
  renderStats,
  renderLogEntry,
  checkAchievements,
});
initTarot(state, {
  renderMoney,
  renderStats,
  renderLogEntry,
  checkAchievements,
});
initDetective(state, {
  renderMoney,
  renderStats,
  renderLogEntry,
  checkAchievements,
});
initGarden(state, {
  renderMoney,
  renderStats,
  renderLogEntry,
  checkAchievements,
});
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
   
  if (document.querySelector("dialog[open]")) return;
   
  if (
    typeof state.player.fortune !== "string" ||
    state.player.fortune.trim() === ""
  ) {
    const randomIndex = Math.floor(Math.random() * fortunePredictions.length);
    state.player.fortune = fortunePredictions[randomIndex];
     
    saveGame(state);
  }
  fortuneName.textContent = `Dành cho ${state.player.name}`;
  fortuneContent.textContent = state.player.fortune;
   
  setMenuOpen(false);
  fortuneDialog.showModal();
});
closeFortuneButton.addEventListener("click", () => {
  fortuneDialog.close();
});

 
const deathDialog = document.getElementById("death-dialog");
 
function showLifeSummary() {
  checkAchievements();
  const archived = archiveLife(state, undefined, describeDeathCause(state.player));
  if (archived.status === 'saved' || archived.status === 'duplicate') saveEventProgress();
  renderLifeSummary(state);
  if (archived.status === 'error') {
    const note = document.createElement('p');
    note.textContent = 'Chưa ghi được Sổ các cuộc đời trên thiết bị. Bản lưu cuộc đời vẫn được giữ để thử lại.';
    document.getElementById('death-summary').append(note);
  }
  deathDialog.showModal();
  deathDialog.scrollTop = 0;
  playOutcomeSound("death");
}
deathDialog.addEventListener("cancel", (event) => event.preventDefault());
document
  .getElementById("return-after-death")
  .addEventListener("click", () => window.location.reload());
 
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
  showLifeSummary();
  checkAchievements();
}
function checkOldAgeDeath(nextAge) {
  // Survivors of age 104 always see the final story at 105.
  if (nextAge === 105) return false;
   
  const stages = (state.player.illnesses ?? [])
    .filter((illness) => getDisease(illness.id))
    .map((illness) => getIllnessStage(illness, nextAge, state.player.health));
  const deathChance = getOldAgeDeathChance(
    nextAge,
    state.player.health,
    stages,
  );
  if (!deathChance || (deathChance < 1 && Math.random() >= deathChance)) {
    return false;
  }

   
  const healthBefore = state.player.health;
  state.player.age = nextAge;
  state.player.isAlive = false;
  state.player.health = 0;
  state.player.deathCause = "old-age";
  state.player.oldAgeDeath = { health: healthBefore, chance: deathChance };
  state.pendingEvent = null;

  const log = {
    age: nextAge,
    content:
      `Bạn đã qua đời ở tuổi ${nextAge}. ` +
      (healthBefore >= 50
        ? `Dù sức khỏe vẫn còn ${healthBefore}%, ở tuổi ${nextAge} cơ thể đã rất già: nguy cơ ra đi năm ấy khoảng ${Math.round(deathChance * 100)}%. `
        : "") +
      "Hành trình khép lại, những kỷ niệm vẫn còn mãi.",
  };

  state.logs.push(log);

   
  saveEventProgress();

  ageElement.textContent = nextAge;
  renderAvatar(state.player);
  renderStats();
  renderLogEntry(log);

  renderEducation();

  ageButton.disabled = true;

  const logContainer = logElement.parentElement;
  logContainer.scrollTop = logContainer.scrollHeight;

   
  showLifeSummary();

  checkAchievements();

  return true;
}
