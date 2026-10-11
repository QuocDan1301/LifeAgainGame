import { formatMoney, formatMoneyAmount } from "./money-format.js";
import { recordAchievementFlags } from "./achievements-data.js";
import { askConfirm } from "./confirm-dialog.js";
import { getPlayerAnnualSalary } from "./career-salary.js";
import { SICK_LEAVE, getHealthBand, getJobHealthRule } from "./health-rules.js";
import { applyEmergency } from "./hospital.js";
import { describeJobLossCause, getJobLossUpdates } from "./job-loss.js";

// Làm thêm ở cửa hàng tiện lợi. Lương và sức khỏe tính cho mỗi cửa hàng, mỗi năm.
export const convenienceStores = [
  { id: "circle-k", name: "Circle K" },
  { id: "gs25", name: "GS25" },
  { id: "ministop", name: "Mini Stop" },
  { id: "familymart", name: "FamilyMart" },
  { id: "7-eleven", name: "7-Eleven" },
];

export const shiftTypes = {
  "part-time": { id: "part-time", icon: "⏰", name: "Part-time", salary: 12_000_000, health: -5,
    rule: "Có thể làm nhiều cửa hàng cùng lúc." },
  "full-time": { id: "full-time", icon: "🕘", name: "Full-time", salary: 72_000_000, health: -10,
    rule: "Chỉ làm được ở 1 cửa hàng." },
};

export const ALL_STORES_ACHIEVEMENT = "side-job-all-stores";
// Chỉ được nhận việc làm thêm khi nhân vật đủ 16 tuổi.
export const SIDE_JOB_MIN_AGE = 16;

export const getStore = (id) => convenienceStores.find((store) => store.id === id);
const jobsOf = (player) => player.sideJobs ?? [];
export const getSideJobShift = (player) => jobsOf(player)[0]?.shift ?? null;

// Tên hiển thị khi chưa có công việc chính: chỉ lấy cửa hàng đầu tiên.
export function getSideJobTitle(player) {
  const first = getStore(jobsOf(player)[0]?.storeId);
  return first ? `Nhân viên ${first.name}` : null;
}

// Trả lương và trừ sức khỏe khi sang tuổi mới, cho mỗi việc đã làm từ năm trước (trả theo ca).
// Sức khỏe yếu: có thể phải nghỉ ốm một phần ca (mất lương và hao sức của các ca đó).
// Năm nghỉ dưỡng: tạm nghỉ mọi ca, không lương ca, không hao sức.
// Làm đến kiệt sức (sức khỏe về 0): nhập viện cấp cứu, không tự động tử vong.
export function collectSideJobYear(player, age, random = Math.random) {
  const working = jobsOf(player).filter((job) => job.startedAtAge < age && getStore(job.storeId) && shiftTypes[job.shift]);
  if (!working.length) return null;
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
  return { amount, content };
}

// Giảm ca khi sức khỏe nguy hiểm: chỉ giữ một ca part-time (ca full-time chuyển thành part-time).
export function reduceSideJobs(player) {
  const [first] = jobsOf(player);
  if (!first) return false;
  player.sideJobs = [{ ...first, shift: "part-time" }];
  return true;
}
export function quitSideJobs(player) {
  const had = jobsOf(player).length > 0;
  player.sideJobs = [];
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
    localStorage.setItem("lifeAgainSave", JSON.stringify(state));
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
    if (tooYoung) {
      body.append(element("p", "license-age-note",
        `🔞 Bạn cần đủ ${SIDE_JOB_MIN_AGE} tuổi mới được đi làm thêm. Còn ${SIDE_JOB_MIN_AGE - state.player.age} năm nữa nhé!`));
    }
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
      choice.disabled = Boolean(tooYoung || blocked || fullTimeTaken || !health.allowed);
      const note = element("span", "side-job-note", tooYoung ? `Từ ${SIDE_JOB_MIN_AGE} tuổi.` : blocked
        ? `Đang làm ${shiftTypes[working].name}, cần nghỉ hết mới chuyển được.`
        : fullTimeTaken ? "Bạn đã có một việc full-time." : shift.rule);
      choice.append(note);
      list.append(choice);
    }
    body.append(list);
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
      const apply = button("shop-buy side-job-apply", hired ? "✅ Đang làm ở đây" : health.allowed ? "📝 Nhận việc" : "🛑 Sức khỏe chưa cho phép", () => askConfirm(
        `📝 Làm ${shift.name} ở ${store.name}?`,
        `Bạn sẽ làm ${shift.name} tại ${store.name}.\nLương: +${formatMoney(shift.salary)}/năm, sức khỏe ${shift.health}/năm, tính từ năm sau.` +
          (health.warning ? `\n${health.warning}` : ""),
        "Nhận việc",
        () => {
          const jobs = jobsOf(state.player);
          if (!getJobHealthRule(state.player).allowed) return;
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
      apply.disabled = hired || otherShift || fullTimeTaken || !health.allowed;
      row.append(element("h4", "", `🏪 ${store.name}`), apply);
      items.append(row);
    }
    card.append(items);
    body.replaceChildren(button("shop-back", "← Quay lại chọn ca", () => {
      renderPicker();
      focusFirst();
    }), card);
  }

  // Thẻ "Công việc hiện tại" trong Tài sản: công việc chính và các việc làm thêm.
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
  // Popup Tài sản tự mở trong life-profile.js; ở đây chỉ vẽ thẻ công việc.
  // Thẻ Công việc: việc hiện tại và lịch sử công việc chính đã mất hoặc đã nghỉ.
  function renderJobsPanel() {
    renderCurrentJobs();
    renderJobHistory();
  }
  $("assets").addEventListener("click", renderJobsPanel);
}
