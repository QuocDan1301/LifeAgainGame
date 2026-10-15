import { saveGame } from "../core/save-store.js";
import { collectStreetYear, getStreetJobBlocker, startStreetJob, streetJobs, isServing } from "./street-work.js";
import { formatMoney, formatMoneyAmount } from "../core/money-format.js";
import { recordAchievementFlags } from "../achievements/achievements-data.js";
import { askConfirm } from "../ui/confirm-dialog.js";
import { getPlayerAnnualSalary, RETIREMENT_AGE } from "./career-salary.js";
import { SICK_LEAVE, getHealthBand, getJobHealthRule } from "../stats/health-rules.js";
import { applyEmergency } from "../stats/hospital.js";
import { describeJobLossCause, getJobLossUpdates } from "./job-loss.js";

 
export const convenienceStores = [
  { id: "circle-k", name: "Circle K" },
  { id: "gs25", name: "GS25" },
  { id: "ministop", name: "Mini Stop" },
  { id: "familymart", name: "FamilyMart" },
  { id: "7-eleven", name: "7-Eleven" },
];

export const shiftTypes = {
  "part-time": { id: "part-time", icon: "⏰", name: "Part-time", salary: 14_000_000, health: -2,
    rule: "Có thể làm nhiều cửa hàng cùng lúc." },
  "full-time": { id: "full-time", icon: "🕘", name: "Full-time", salary: 72_000_000, health: -10,
    rule: "Chỉ làm được ở 1 cửa hàng." },
};

export const ALL_STORES_ACHIEVEMENT = "side-job-all-stores";
 
export const SIDE_JOB_MIN_AGE = 16;
 

 
 
export const STUDENT_MAX_STORES = 2;
export const isStudying = (player, age = player.age) =>
  age < 18 || (age <= 21 && Boolean(player.careerPath?.school) && player.careerPath.id !== "casual");
export function getStudentJobBlocker(player, shiftId) {
  if (!isStudying(player)) return "";
  if (shiftId === "full-time") return "Đang đi học: chỉ nhận part-time.";
  if ((player.sideJobs ?? []).length >= STUDENT_MAX_STORES) return `Đang đi học: tối đa ${STUDENT_MAX_STORES} cửa hàng part-time.`;
  return "";
}
export const getStore = (id) => convenienceStores.find((store) => store.id === id);
const jobsOf = (player) => player.sideJobs ?? [];
export const getSideJobShift = (player) => jobsOf(player)[0]?.shift ?? null;

 
export function getSideJobTitle(player) {
  const first = getStore(jobsOf(player)[0]?.storeId);
  return first ? `Nhân viên ${first.name}` : streetJobs.find(job => (player.streetJobs ?? []).some(entry => entry.id === job.id))?.name ?? null;
}

 
 
 
 
export function collectSideJobYear(player, age, random = Math.random) {
  const street = collectStreetYear(player, age, random);
  if (age >= RETIREMENT_AGE && jobsOf(player).length) {
    const stores = jobsOf(player).map((job) => getStore(job.storeId)?.name).filter(Boolean).join(", ");
    player.sideJobs = [];
    const content = `🌅 Tôi nghỉ ca làm thêm${stores ? ` ở ${stores}` : ""} khi đến tuổi nghỉ hưu.`;
    return { amount: street?.amount ?? 0, content: [content, street?.content].filter(Boolean).join("\n") };
  }
  if (isServing(player)) return street;
  const working = jobsOf(player).filter((job) => job.startedAtAge < age && getStore(job.storeId) && shiftTypes[job.shift]);
  if (!working.length) return street;
  const stores = working.map((job) => getStore(job.storeId).name).join(", ");
  const shiftName = shiftTypes[working[0].shift].name;
  if (player.restYear === age) {
    return { amount: 0, content: `🛌 Nghỉ dưỡng: tạm nghỉ ca làm thêm ${shiftName} (${stores}) cả năm, không có lương ca và không hao sức.` };
  }
  let amount = working.reduce((sum, job) => sum + shiftTypes[job.shift].salary, 0);
  let strain = working.reduce((sum, job) => sum + shiftTypes[job.shift].health, 0);
  const sick = SICK_LEAVE[getHealthBand(player.health).id];
  const sickLeave = Boolean(sick) && random() < sick.chance;
  if (sickLeave) {
    amount = Math.round((amount * (1 - sick.missed)) / 1000) * 1000;
    strain = Math.round(strain * (1 - sick.missed));
  }
  player.money += amount;
  const health = Math.max(0, player.health + strain);
  const lost = player.health - health;
  player.health = health;
  let content = `🏪 Lương làm thêm ${shiftName} (${stores}): Tiền +${formatMoneyAmount(amount)} VNĐ.` +
    (lost ? ` Sức khỏe -${lost}.` : "") +
    (sickLeave ? " Sức khỏe yếu nên phải nghỉ ốm nhiều ca, mất một nửa lương ca." : "");
  if (health === 0) content += `\n${applyEmergency(player, "Làm thêm quá sức khiến cơ thể kiệt sức.", age, random)}`;
  return { amount: amount + (street?.amount ?? 0), content: [content, street?.content].filter(Boolean).join("\n") };
}

 
export function reduceSideJobs(player) {
  const [first] = jobsOf(player);
  if (!first) return false;
  player.sideJobs = [{ ...first, shift: "part-time" }];
  return true;
}
export function quitSideJobs(player) {
  const had = jobsOf(player).length > 0 || (player.streetJobs ?? []).length > 0;
  player.sideJobs = [];
  player.streetJobs = [];
  return had;
}
export const canReduceSideJobs = (player) => jobsOf(player).length > 1 || jobsOf(player)[0]?.shift === "full-time";

export function initSideJobs(state, { renderMoney, renderStats, renderLogEntry, renderEducation, checkAchievements }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("side-job-dialog");
  const body = $("side-job-body");
  let currentShift = null;

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (className, text, onClick) => {
    const node = element("button", className, text);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  };
  const focusFirst = () => (body.querySelector(".shop-group:not(:disabled), .shop-buy:not(:disabled)")
    ?? body.querySelector("button:not(:disabled)"))?.focus({ preventScroll: true });

  const record = (content) => {
    const log = { age: state.player.age, content, summary: content };
    state.logs.push(log);
    saveGame(state);
    renderMoney();
    renderStats();
    renderLogEntry(log);
    renderEducation();
  };

  function renderPicker() {
    currentShift = null;
    body.replaceChildren(button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    }));
    const working = getSideJobShift(state.player);
    const tooYoung = state.player.age < SIDE_JOB_MIN_AGE;
    const retired = state.player.age >= RETIREMENT_AGE;
    if (tooYoung) {
      body.append(element("p", "license-age-note",
        `🔞 Bạn cần đủ ${SIDE_JOB_MIN_AGE} tuổi mới được đi làm thêm. Còn ${SIDE_JOB_MIN_AGE - state.player.age} năm nữa nhé!`));
    }
    if (retired) body.append(element("p", "license-age-note", `🌅 Từ ${RETIREMENT_AGE} tuổi bạn đã nghỉ hưu, không nhận ca làm thêm nữa.`));
    const health = getJobHealthRule(state.player);
    if (!tooYoung && (health.message || health.warning)) {
      body.append(element("p", health.allowed ? "side-job-health-warning" : "license-age-note", health.message ?? health.warning));
    }
    const list = element("div", "shop-groups");
    for (const shift of Object.values(shiftTypes)) {
      const blocked = working && working !== shift.id;
      const fullTimeTaken = shift.id === "full-time" && working === "full-time";
      const label = `${shift.icon} ${shift.name} · ${formatMoney(shift.salary)}/năm · Sức khỏe ${shift.health}/năm`;
      const choice = button("shop-group side-job-shift", label, () => {
        currentShift = shift.id;
        renderStores();
        focusFirst();
      });
      choice.dataset.shift = shift.id;
      const studentBlock = shift.id === "full-time" ? getStudentJobBlocker(state.player, shift.id) : "";
      choice.disabled = Boolean(tooYoung || retired || blocked || fullTimeTaken || studentBlock || !health.allowed || isServing(state.player));
      const note = element("span", "side-job-note", tooYoung ? `Từ ${SIDE_JOB_MIN_AGE} tuổi.` : retired ? "Đã nghỉ hưu." : studentBlock ? studentBlock : blocked
        ? `Đang làm ${shiftTypes[working].name}, cần nghỉ hết mới chuyển được.`
        : fullTimeTaken ? "Bạn đã có một việc full-time." : shift.rule);
      choice.append(note);
      list.append(choice);
    }
    body.append(list);
    body.append(element("h3", "", "🧭 Nghề tự do · Từ 18 tuổi"));
    body.append(element("p", "side-job-intro", "Nhận nghề khi đã thôi đi học. Thu nhập ròng nhận từ năm sau; dừng ở tuổi nghỉ hưu. Bán phương tiện sẽ tạm dừng thu nhập."));
    for (const job of streetJobs) {
      const hired = (state.player.streetJobs ?? []).some(entry => entry.id === job.id);
      const blocker = getStreetJobBlocker(state.player, job.id);
      const row = element("article", "shop-item");
      row.append(element("h4", "", `${job.icon} ${job.name}`),
        element("p", "side-job-note", `${formatMoney(job.income)}/năm · Sức khỏe ${job.health}/năm · Cần ${job.assetName}.`));
      const action = button(hired ? "shop-sell" : "shop-buy", hired ? "🚪 Nghỉ nghề" : "📝 Nhận nghề", () => {
        if (hired) state.player.streetJobs = (state.player.streetJobs ?? []).filter(entry => entry.id !== job.id);
        else if (!startStreetJob(state.player, job.id)) return;
        record(`${job.icon} ${hired ? "Nghỉ nghề" : "Nhận nghề"} ${job.name.toLowerCase()}.`);
        renderPicker();
      });
      action.dataset.streetJob = job.id;
      action.disabled = hired ? state.player.isAlive === false : Boolean(blocker);
      row.append(action);
      if (blocker && !hired) row.append(element("p", "side-job-note", blocker));
      body.append(row);
    }
  }

  function renderStores() {
    const shift = shiftTypes[currentShift];
    const card = element("section", "dialog-card");
    card.append(element("h3", "", `${shift.icon} ${shift.name}`),
      element("p", "side-job-intro", `Lương ${formatMoney(shift.salary)}/năm mỗi cửa hàng, sức khỏe ${shift.health} mỗi năm. Nhận lương từ năm sau.`));
    const items = element("div", "shop-items");
    for (const store of convenienceStores) {
      const row = element("article", "shop-item");
      const hired = jobsOf(state.player).some((job) => job.storeId === store.id);
      const otherShift = getSideJobShift(state.player) && getSideJobShift(state.player) !== shift.id;
      const fullTimeTaken = shift.id === "full-time" && jobsOf(state.player).length > 0;
      const health = getJobHealthRule(state.player);
      const studentBlock = hired ? "" : getStudentJobBlocker(state.player, shift.id);
      const apply = button("shop-buy side-job-apply", hired ? "✅ Đang làm ở đây" : studentBlock ? `📚 ${studentBlock}` : health.allowed ? "📝 Nhận việc" : "🛑 Sức khỏe chưa cho phép", () => askConfirm(
        `📝 Làm ${shift.name} ở ${store.name}?`,
        `Bạn sẽ làm ${shift.name} tại ${store.name}.\nLương: +${formatMoney(shift.salary)}/năm, sức khỏe ${shift.health}/năm, tính từ năm sau.` +
          (health.warning ? `\n${health.warning}` : ""),
        "Nhận việc",
        () => {
          const jobs = jobsOf(state.player);
          if (!getJobHealthRule(state.player).allowed || isServing(state.player) || getStudentJobBlocker(state.player, shift.id) ||
              state.player.age >= RETIREMENT_AGE || state.player.isAlive === false) return;
          if (state.player.age < SIDE_JOB_MIN_AGE || jobs.some((job) => job.storeId === store.id) ||
              (jobs.length && (jobs[0].shift !== shift.id || shift.id === "full-time"))) return;
          state.player.sideJobs = [...jobs, { storeId: store.id, shift: shift.id, startedAtAge: state.player.age }];
          if (convenienceStores.every((entry) => state.player.sideJobs.some((job) => job.storeId === entry.id))) {
            recordAchievementFlags(state, [ALL_STORES_ACHIEVEMENT]);
          }
          record(`🏪 Nhận việc ${shift.name} tại ${store.name}.`);
          checkAchievements();
          renderStores();
        },
      ));
      apply.dataset.store = store.id;
      apply.disabled = hired || otherShift || fullTimeTaken || Boolean(studentBlock) || !health.allowed;
      row.append(element("h4", "", `🏪 ${store.name}`), apply);
      items.append(row);
    }
    card.append(items);
    body.replaceChildren(button("shop-back", "← Quay lại chọn ca", () => {
      renderPicker();
      focusFirst();
    }), card);
  }

   
  function renderCurrentJobs() {
    const list = $("life-jobs");
    list.replaceChildren();
    const player = state.player;
    const quit = (title, text, action) => {
      const node = button("shop-sell", "🚪 Nghỉ việc", () => askConfirm(title, text, "Xác nhận nghỉ việc", action));
      node.disabled = player.isAlive === false;
      return node;
    };
    if (player.employmentStatus === "employed" && player.job) {
      const salary = getPlayerAnnualSalary(player);
      const row = element("li", "shop-owned");
      row.append(element("span", "", `💼 ${player.job} · Công việc chính${salary ? ` · Lương ${formatMoney(salary)}/năm` : ""}`),
        quit(`🚪 Nghỉ công việc chính?`,
          `Bạn sẽ nghỉ việc ${player.job}.\nBạn sẽ không còn nhận lương và không được xét nâng bậc nghề nữa.`,
          () => {
            const job = state.player.job;
            Object.assign(state.player, getJobLossUpdates(state.player, state.player.age, "quit"));
            record(`🚪 Nghỉ công việc chính: ${job}.`);
            renderJobsPanel();
          }));
      list.append(row);
    }
    for (const entry of player.streetJobs ?? []) {
      const job = streetJobs.find(item => item.id === entry.id);
      if (!job) continue;
      const row = element("li", "shop-owned");
      row.append(element("span", "", `${job.icon} ${job.name} · Thu nhập ròng ${formatMoney(job.income)}/năm · Cần ${job.assetName}`),
        quit(`🚪 Nghỉ nghề ${job.name.toLowerCase()}?`, "Ngừng nghề này từ năm nay.", () => {
          state.player.streetJobs = (state.player.streetJobs ?? []).filter(item => item.id !== job.id);
          record(`🚪 Nghỉ nghề ${job.name.toLowerCase()}.`);
          renderJobsPanel();
        }));
      list.append(row);
    }
    for (const job of jobsOf(player)) {
      const store = getStore(job.storeId);
      const shift = shiftTypes[job.shift];
      if (!store || !shift) continue;
      const row = element("li", "shop-owned");
      row.append(element("span", "", `🏪 Nhân viên ${store.name} · ${shift.name} · Lương ${formatMoney(shift.salary)}/năm · Sức khỏe ${shift.health}/năm`),
        quit(`🚪 Nghỉ việc ở ${store.name}?`, `Bạn sẽ nghỉ ${shift.name} tại ${store.name}.`, () => {
          state.player.sideJobs = jobsOf(state.player).filter((entry) => entry.storeId !== job.storeId);
          record(`🚪 Nghỉ việc ${shift.name} tại ${store.name}.`);
          renderJobsPanel();
        }));
      list.append(row);
    }
  }

  function renderJobHistory() {
    const list = $("life-jobs");
    for (const entry of [...(state.player.jobHistory ?? [])].reverse()) {
      const row = element("li", "shop-owned job-history");
      row.append(element("span", "", `📜 ${entry.age} tuổi · ${entry.title} · ${describeJobLossCause(entry.cause)}`));
      list.append(row);
    }
  }

  $("activity-part-time").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    renderPicker();
    dialog.showModal();
    focusFirst();
  });
  $("close-side-job").addEventListener("click", () => dialog.close());
   
   
  function renderJobsPanel() {
    renderCurrentJobs();
    renderJobHistory();
  }
  $("assets").addEventListener("click", renderJobsPanel);
}
