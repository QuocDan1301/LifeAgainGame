import { saveGame } from "../core/save-store.js";
import { formatMoney, formatMoneyAmount } from "../core/money-format.js";
import { askConfirm } from "../ui/confirm-dialog.js";
import { EMERGENCY, REST_ILLNESS_LOSS_RATE, formatChance, getEmergencyDeathChance, getHealthBand } from "./health-rules.js";

 
 
 
 
export const diseases = [
  { id: "gastritis", icon: "🤢", name: "Viêm dạ dày", cost: 5_000_000, severeAfter: 3, criticalAfter: 7, loss: [1, 2, 4], criticalRisk: 0.04 },
  { id: "gout", icon: "🦶", name: "Gout", cost: 10_000_000, severeAfter: 3, criticalAfter: 8, loss: [1, 2, 4], criticalRisk: 0.04 },
  { id: "pneumonia", icon: "🫁", name: "Viêm phổi", cost: 12_000_000, severeAfter: 1, criticalAfter: 2, loss: [3, 6, 10], criticalRisk: 0.25 },
  { id: "hypertension", icon: "💓", name: "Cao huyết áp", cost: 15_000_000, severeAfter: 3, criticalAfter: 6, loss: [1, 3, 5], criticalRisk: 0.1 },
  { id: "kidney-stones", icon: "🪨", name: "Sỏi thận", cost: 20_000_000, severeAfter: 2, criticalAfter: 5, loss: [2, 3, 5], criticalRisk: 0.06 },
  { id: "diabetes", icon: "🩸", name: "Tiểu đường", cost: 25_000_000, severeAfter: 3, criticalAfter: 6, loss: [2, 3, 6], criticalRisk: 0.1 },
  { id: "hepatitis-b", icon: "🟡", name: "Viêm gan B", cost: 35_000_000, severeAfter: 3, criticalAfter: 6, loss: [1, 3, 6], criticalRisk: 0.12 },
  { id: "herniated-disc", icon: "🦴", name: "Thoát vị đĩa đệm", cost: 40_000_000, severeAfter: 2, criticalAfter: 6, loss: [2, 3, 4], criticalRisk: 0.02 },
  { id: "coronary", icon: "❤️‍🩹", name: "Bệnh mạch vành", cost: 150_000_000, minAge: 40, severeAfter: 1, criticalAfter: 3, loss: [3, 5, 8], criticalRisk: 0.25 },
  { id: "early-cancer", icon: "🎗️", name: "Ung thư giai đoạn sớm", cost: 400_000_000, minAge: 40, severeAfter: 1, criticalAfter: 3, loss: [3, 6, 10], criticalRisk: 0.35 },
];

export const ILLNESS_MIN_AGE = 18;
export const ILLNESS_MAX_AGE = 95;

 
export const ILLNESS_STAGES = {
  mild: { label: "Nhẹ", costRate: 1 },
  severe: { label: "Nặng", costRate: 1.5 },
  critical: { label: "Nguy kịch", costRate: 2 },
};
const STAGE_ORDER = ["mild", "severe", "critical"];
 
 
const HEALTH_PROGRESS_YEARS = { good: 0, fair: 0, weak: 1, critical: 2, empty: 2 };
const CRITICAL_RISK_FACTOR = { good: 0.5, fair: 1, weak: 1.5, critical: 2, empty: 2 };
export const ILLNESS_MAX_DEATH_CHANCE = 0.9;

export const getDisease = (id) => diseases.find((disease) => disease.id === id);

 
export function planIllnesses(player, random = Math.random) {
  if (Array.isArray(player.illnessPlan)) return player.illnessPlan;
  const from = Math.max(ILLNESS_MIN_AGE, (player.age ?? 0) + 1);
  const pool = [...diseases];
  const count = from > ILLNESS_MAX_AGE ? 0 : Math.floor(random() * 3);
  player.illnessPlan = Array.from({ length: count }, () => {
    const [disease] = pool.splice(Math.floor(random() * pool.length), 1);
    const start = Math.max(from, disease.minAge ?? 0);
    return { id: disease.id, age: start + Math.floor(random() * (ILLNESS_MAX_AGE - start + 1)) };
  });
  return player.illnessPlan;
}

export const untreatedYears = (illness, age) => Math.max(0, age - illness.since);

export function getIllnessStage(illness, age, health) {
  const disease = getDisease(illness.id);
  const years = untreatedYears(illness, age) + HEALTH_PROGRESS_YEARS[getHealthBand(health).id];
  return years >= disease.criticalAfter ? "critical" : years >= disease.severeAfter ? "severe" : "mild";
}

export const getTreatmentCost = (disease, stage) =>
  Math.round((disease.cost * ILLNESS_STAGES[stage].costRate) / 1000) * 1000;

 
export function getIllnessOutlook(player, illness, age = player.age + 1) {
  const disease = getDisease(illness.id);
  const stage = getIllnessStage(illness, age, player.health);
  const resting = player.restYear === age;
  const loss = Math.ceil(disease.loss[STAGE_ORDER.indexOf(stage)] * (resting ? REST_ILLNESS_LOSS_RATE : 1));
  const deathChance = stage === "critical"
    ? Math.min(ILLNESS_MAX_DEATH_CHANCE, disease.criticalRisk * CRITICAL_RISK_FACTOR[getHealthBand(player.health - loss).id])
    : 0;
  return { disease, stage, loss, deathChance, years: untreatedYears(illness, age), resting };
}

 
export function getDangerousIllnesses(player, age = player.age + 1) {
  return (player.illnesses ?? [])
    .filter((illness) => getDisease(illness.id) && illness.since < age)
    .map((illness) => ({ illness, ...getIllnessOutlook(player, illness, age) }))
    .filter((entry) => entry.stage !== "mild" || entry.loss >= player.health);
}

 
 
export function applyEmergency(player, reason, age, random = Math.random) {
  const deathChance = getEmergencyDeathChance(player, age);
  player.emergencyAges = [...(player.emergencyAges ?? []), age];
  if (deathChance && random() < deathChance) {
    player.isAlive = false;
    player.health = 0;
    player.deathCause = "exhaustion";
    return `💀 ${reason} Cơ thể đã kiệt quệ sau nhiều lần cấp cứu liên tiếp và không thể gượng dậy được nữa.`;
  }
  player.money -= EMERGENCY.cost;
  player.health = EMERGENCY.healthAfter;
  const warning = getEmergencyDeathChance(player, age + 1)
    ? ` ⚠️ Nếu lại kiệt sức trong ${EMERGENCY.window} năm tới, nguy cơ tử vong là ${formatChance(getEmergencyDeathChance(player, age + 1))}.`
    : "";
  return `🚑 ${reason} Bạn được đưa đi cấp cứu kịp thời: Tiền -${formatMoneyAmount(EMERGENCY.cost)} VNĐ, Sức khỏe hồi về ${EMERGENCY.healthAfter}.${warning}`;
}

 
export function collectIllnessYear(player, age, random = Math.random) {
  planIllnesses(player);
  const lines = [];
  for (const illness of player.illnesses ?? []) {
    const disease = getDisease(illness.id);
    if (!disease || illness.since >= age || player.isAlive === false) continue;
    const before = getIllnessStage(illness, age - 1, player.health);
    const { stage, loss, deathChance, years, resting } = getIllnessOutlook(player, illness, age);
    const stageLabel = ILLNESS_STAGES[stage].label;
    if (STAGE_ORDER.indexOf(stage) > STAGE_ORDER.indexOf(before)) {
      lines.push(`⚠️ ${disease.icon} ${disease.name} chuyển sang mức ${stageLabel}.`);
    }
    if (deathChance && random() < deathChance) {
      player.isAlive = false;
      player.health = 0;
      player.deathCause = illness.id;
      lines.push(`💀 ${disease.icon} ${disease.name} ở mức Nguy kịch sau ${years} năm không điều trị. Cơ thể không còn chống chọi được nữa.`);
      continue;
    }
    const health = Math.max(0, player.health - loss);
    const lost = player.health - health;
    player.health = health;
    lines.push(`🤒 ${disease.name} (${stageLabel}, chưa điều trị ${years} năm)${lost ? `: Sức khỏe -${lost}` : ""}` +
      `${resting ? " (nghỉ dưỡng nên hao sức ít hơn)" : ""}. Vào Bệnh viện để điều trị.`);
    if (health === 0) {
      if (stage === "critical") {
        player.isAlive = false;
        player.deathCause = illness.id;
        lines.push(`💀 ${disease.icon} ${disease.name} ở mức Nguy kịch khiến sức khỏe cạn kiệt. Cơ thể không còn chống chọi được nữa.`);
      } else {
        lines.push(applyEmergency(player, `${disease.icon} ${disease.name} làm sức khỏe cạn kiệt.`, age, random));
      }
    }
  }
  if (player.isAlive !== false) {
    const lifestyle = rollLifestyleIllness(player, age, random);
    if (lifestyle) lines.push(lifestyle);
    for (const planned of player.illnessPlan) {
      const disease = getDisease(planned.id);
      if (!disease || planned.age !== age || (player.illnesses ?? []).some((entry) => entry.id === planned.id)) continue;
      player.illnesses = [...(player.illnesses ?? []), { id: planned.id, since: age }];
      lines.push(`🩺 Bạn được chẩn đoán mắc ${disease.icon} ${disease.name} (mức Nhẹ). Điều trị sớm rẻ hơn và tránh bệnh nặng thêm: Hoạt động → Bệnh viện.`);
    }
  }
  return lines.length ? { content: lines.join("\n") } : null;
}

 
 
export const LIFESTYLE_ILLNESS = {
  byBand: { good: 0, fair: 0.02, weak: 0.05, critical: 0.08, empty: 0.08 },
  overwork: 0.03, overworkLoad: 3, strained: 0.02, strainedYears: 2, olderFrom: 50, olderRate: 1.5,
  checkupRate: 0.5, maxPerLife: 3,
};
export const CHECKUP = { cost: 2_000_000 };
 
export function getWorkload(player) {
  return (player.employmentStatus === "employed" ? 1 : 0) +
    (player.sideJobs ?? []).reduce((sum, job) => sum + (job.shift === "full-time" ? 2 : 0.5), 0) +
    (player.streetJobs ?? []).length;
}
export function getLifestyleIllnessChance(player, age) {
  if (age < ILLNESS_MIN_AGE || age > ILLNESS_MAX_AGE || (player.lifestyleIllnesses ?? 0) >= LIFESTYLE_ILLNESS.maxPerLife) return 0;
  let chance = LIFESTYLE_ILLNESS.byBand[getHealthBand(player.health).id] ?? 0;
  if (getWorkload(player) >= LIFESTYLE_ILLNESS.overworkLoad) chance += LIFESTYLE_ILLNESS.overwork;
  if ((player.strainedYears ?? 0) >= LIFESTYLE_ILLNESS.strainedYears) chance += LIFESTYLE_ILLNESS.strained;
  if (age >= LIFESTYLE_ILLNESS.olderFrom) chance *= LIFESTYLE_ILLNESS.olderRate;
  if (player.checkupAge === age - 1) chance *= LIFESTYLE_ILLNESS.checkupRate;
  return Math.min(0.25, chance);
}
function rollLifestyleIllness(player, age, random) {
  const chance = getLifestyleIllnessChance(player, age);
  if (!chance || random() >= chance) return null;
  const pool = diseases.filter((disease) => age >= (disease.minAge ?? 0) &&
    !(player.illnesses ?? []).some((entry) => entry.id === disease.id) &&
    !(player.illnessPlan ?? []).some((planned) => planned.id === disease.id && planned.age >= age));
  if (!pool.length) return null;
  const disease = pool[Math.floor(random() * pool.length)];
  player.illnesses = [...(player.illnesses ?? []), { id: disease.id, since: age }];
  player.lifestyleIllnesses = (player.lifestyleIllnesses ?? 0) + 1;
  return `🩺 Sức khỏe sa sút và nhịp sống quá tải khiến bạn mắc ${disease.icon} ${disease.name} (mức Nhẹ). Giữ sức khỏe, giảm tải công việc và khám định kỳ giúp phòng bệnh: Hoạt động → Bệnh viện.`;
}

 
export function describeIllness(player, illness) {
  const disease = getDisease(illness.id);
  const stage = getIllnessStage(illness, player.age, player.health);
  const next = getIllnessOutlook(player, illness);
  const years = untreatedYears(illness, player.age);
  const risk = `Năm tới: ${ILLNESS_STAGES[next.stage].label}, Sức khỏe -${next.loss}` +
    (next.deathChance ? `, nguy cơ tử vong ${formatChance(next.deathChance)}` : "") +
    (next.loss >= player.health && !next.deathChance ? ", có thể phải cấp cứu" : "");
  return {
    disease, stage, years, next, risk,
    cost: getTreatmentCost(disease, stage),
    summary: `${ILLNESS_STAGES[stage].label} · chưa điều trị ${years} năm`,
  };
}

export function initHospital(state, { renderMoney, renderLogEntry, onChange = () => {} }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("hospital-dialog");
  const body = $("hospital-body");

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
  const record = (content) => {
    const log = { age: state.player.age, content, summary: content };
    state.logs.push(log);
    saveGame(state);
    renderMoney();
    renderLogEntry(log);
    onChange();
  };

  function treat(illness) {
    const info = describeIllness(state.player, illness);
    askConfirm(
      `💊 Điều trị ${info.disease.name}?`,
      `${info.disease.icon} ${info.disease.name} đang ở mức ${ILLNESS_STAGES[info.stage].label}. Viện phí: ${formatMoney(info.cost)}.\n` +
        "Sau khi điều trị, bệnh khỏi hẳn và không còn trừ sức khỏe. Điều trị khi bệnh còn nhẹ sẽ rẻ hơn.",
      "Xác nhận điều trị",
      () => {
        const current = (state.player.illnesses ?? []).find((entry) => entry.id === illness.id);
        if (!current || state.player.isAlive === false) return;
        const cost = describeIllness(state.player, current).cost;
        if (state.player.money < cost) return;
        state.player.money -= cost;
        state.player.illnesses = state.player.illnesses.filter((entry) => entry.id !== illness.id);
        record(`💊 Điều trị khỏi ${info.disease.icon} ${info.disease.name} (mức ${ILLNESS_STAGES[info.stage].label}): Tiền -${formatMoneyAmount(cost)} VNĐ.`);
        render();
      },
    );
  }

  function render() {
    const player = state.player;
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    const band = getHealthBand(player.health);
    const wallet = element("p", "shop-wallet", `Ví hiện có: ${formatMoney(player.money)} · 💪 Sức khỏe ${player.health}% (${band.label})`);
    const current = element("section", "dialog-card");
    current.append(element("h3", "", "🤒 Bệnh đang mắc"));
    const list = element("div", "shop-items");
    for (const illness of player.illnesses ?? []) {
      if (!getDisease(illness.id)) continue;
      const info = describeIllness(player, illness);
      const card = element("article", `shop-item hospital-illness is-${info.stage}`);
      const action = button("shop-buy", "", () => treat(illness));
      const affordable = player.money >= info.cost;
      action.disabled = !affordable || player.isAlive === false;
      action.textContent = affordable ? `💊 Điều trị · ${formatMoney(info.cost)}` : `Không đủ tiền · ${formatMoney(info.cost)}`;
      action.dataset.disease = info.disease.id;
      card.append(
        element("h4", "", `${info.disease.icon} ${info.disease.name} · ${ILLNESS_STAGES[info.stage].label}`),
        element("p", "hospital-warning", `Phát hiện lúc ${illness.since} tuổi · ${info.summary}`),
        element("p", "hospital-risk", info.risk),
        action,
      );
      list.append(card);
    }
    if (!list.children.length) list.append(element("p", "hospital-healthy", "💪 Bạn chưa phát hiện bệnh nào."));
    current.append(list);

     
    const rest = element("section", "dialog-card hospital-rest");
    const resting = player.restYear === player.age + 1;
    rest.append(element("h3", "", "🛌 Nghỉ dưỡng năm tới"),
      element("p", "side-job-intro", "Miễn phí. Năm tới tạm nghỉ ca làm thêm (không lương ca, không hao sức), hồi phục nhiều hơn khi đang yếu; bệnh hao sức ít hơn nhưng vẫn cần điều trị. Công việc chính giữ lương, xét nâng bậc lùi 1 năm."),
      button("shop-buy hospital-rest-toggle", resting ? "↩️ Hủy nghỉ dưỡng" : "🛌 Đăng ký nghỉ dưỡng", () => {
        if (state.player.isAlive === false) return;
        state.player.restYear = resting ? null : state.player.age + 1;
        record(resting ? "↩️ Hủy kế hoạch nghỉ dưỡng năm tới." : `🛌 Đăng ký nghỉ dưỡng trong năm tới (${state.player.age + 1} tuổi).`);
        render();
      }));

     
    const checkup = element("section", "dialog-card hospital-checkup");
    const checked = player.checkupAge === player.age;
    const chance = getLifestyleIllnessChance(player, player.age + 1);
    checkup.append(element("h3", "", "🩺 Khám sức khỏe định kỳ"),
      element("p", "side-job-intro", `${formatMoney(CHECKUP.cost)}, mỗi năm một lần. Giảm một nửa nguy cơ mắc bệnh do lối sống năm tới ` +
        `(hiện ${formatChance(chance)}). Sức khỏe tốt, không làm quá tải và tinh thần ổn định giúp nguy cơ thấp nhất.`),
      Object.assign(button("shop-buy hospital-checkup-go", checked ? "✅ Đã khám năm nay" : player.money < CHECKUP.cost ? "Không đủ tiền" : "🩺 Đi khám", () => {
        if (state.player.isAlive === false || state.player.checkupAge === state.player.age || state.player.money < CHECKUP.cost) return;
        state.player.money -= CHECKUP.cost;
        state.player.checkupAge = state.player.age;
        record(`🩺 Khám sức khỏe định kỳ: Tiền -${formatMoneyAmount(CHECKUP.cost)} VNĐ. Nguy cơ mắc bệnh do lối sống năm tới giảm một nửa.`);
        render();
      }), { disabled: checked || player.money < CHECKUP.cost || player.isAlive === false }));

    const prices = element("section", "dialog-card");
    prices.append(element("h3", "", "📋 Bảng giá viện phí (mức Nhẹ)"));
    const table = element("ul", "dialog-entries hospital-prices");
    for (const disease of diseases) {
      const row = element("li", "");
      row.append(element("span", "", `${disease.icon} ${disease.name}`), element("strong", "", formatMoney(disease.cost)));
      table.append(row);
    }
    prices.append(table, element("p", "hospital-note",
      "Bệnh để lâu sẽ nặng dần: mức Nặng viện phí ×1,5, mức Nguy kịch ×2 và có nguy cơ tử vong mỗi năm. " +
      "Sức khỏe thấp làm bệnh tiến triển nhanh hơn. Tập luyện không chữa được bệnh. " +
      `Sức khỏe cạn khi bệnh chưa nguy kịch thì được cấp cứu (${formatMoney(EMERGENCY.cost)}).`));
    body.replaceChildren(back, wallet, current, rest, checkup, prices);
  }

  function open() {
    if (state.player.isAlive === false) return;
    document.querySelectorAll("dialog[open]").forEach((node) => node.close());
    render();
    dialog.showModal();
    (body.querySelector(".hospital-illness .shop-buy:not(:disabled)") ?? body.querySelector("button"))?.focus({ preventScroll: true });
  }

  $("activity-hospital").addEventListener("click", open);
  $("close-hospital").addEventListener("click", () => dialog.close());
  return { open };
}
