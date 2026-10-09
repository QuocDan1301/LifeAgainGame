import { formatMoney, formatMoneyAmount } from "./money-format.js";
import { askConfirm } from "./confirm-dialog.js";

// Mỗi ván có 0–2 bệnh, phát ngẫu nhiên ở tuổi 18–95. Không điều trị thì mỗi năm
// mất 3 sức khỏe; hết sức khỏe hoặc đủ 10 năm không điều trị thì nhân vật qua đời.
export const diseases = [
  { id: "gastritis", icon: "🤢", name: "Viêm dạ dày", cost: 5_000_000 },
  { id: "gout", icon: "🦶", name: "Gout", cost: 10_000_000 },
  { id: "pneumonia", icon: "🫁", name: "Viêm phổi", cost: 12_000_000 },
  { id: "hypertension", icon: "💓", name: "Cao huyết áp", cost: 15_000_000 },
  { id: "kidney-stones", icon: "🪨", name: "Sỏi thận", cost: 20_000_000 },
  { id: "diabetes", icon: "🩸", name: "Tiểu đường", cost: 25_000_000 },
  { id: "hepatitis-b", icon: "🟡", name: "Viêm gan B", cost: 35_000_000 },
  { id: "herniated-disc", icon: "🦴", name: "Thoát vị đĩa đệm", cost: 40_000_000 },
  { id: "coronary", icon: "❤️‍🩹", name: "Bệnh mạch vành", cost: 150_000_000, minAge: 40 },
  { id: "early-cancer", icon: "🎗️", name: "Ung thư giai đoạn sớm", cost: 400_000_000, minAge: 40 },
];

export const ILLNESS_MIN_AGE = 18;
export const ILLNESS_MAX_AGE = 95;
export const ILLNESS_HEALTH_LOSS = 3;
export const ILLNESS_FATAL_YEARS = 10;

export const getDisease = (id) => diseases.find((disease) => disease.id === id);

// Lên lịch bệnh một lần cho cả ván (bản lưu cũ: chỉ chọn các tuổi còn ở phía trước).
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

export const untreatedYears = (illness, age) => age - illness.since;

// Gọi mỗi lần sang tuổi mới: bệnh cũ nặng thêm, bệnh mới được chẩn đoán.
export function collectIllnessYear(player, age) {
  planIllnesses(player);
  const lines = [];
  for (const illness of player.illnesses ?? []) {
    const disease = getDisease(illness.id);
    if (!disease || illness.since >= age || player.isAlive === false) continue;
    const years = untreatedYears(illness, age);
    if (years >= ILLNESS_FATAL_YEARS) {
      player.isAlive = false;
      player.health = 0;
      player.deathCause = illness.id;
      lines.push(`💀 ${disease.icon} ${disease.name} không được điều trị suốt ${ILLNESS_FATAL_YEARS} năm. Cơ thể không còn chống chọi được nữa.`);
      continue;
    }
    const health = Math.max(0, player.health - ILLNESS_HEALTH_LOSS);
    const lost = player.health - health;
    player.health = health;
    if (health === 0) {
      player.isAlive = false;
      player.deathCause = illness.id;
      lines.push(`💀 ${disease.icon} ${disease.name} khiến sức khỏe cạn kiệt (Sức khỏe -${lost}). Cơ thể không còn chống chọi được nữa.`);
      continue;
    }
    lines.push(`🤒 ${disease.name} chưa được điều trị (${years} năm)${lost ? `: Sức khỏe -${lost}` : ""}. ` +
      `Còn ${ILLNESS_FATAL_YEARS - years} năm để vào Bệnh viện điều trị.`);
  }
  if (player.isAlive !== false) {
    for (const planned of player.illnessPlan) {
      const disease = getDisease(planned.id);
      if (!disease || planned.age !== age || (player.illnesses ?? []).some((entry) => entry.id === planned.id)) continue;
      player.illnesses = [...(player.illnesses ?? []), { id: planned.id, since: age }];
      lines.push(`🩺 Bạn được chẩn đoán mắc ${disease.icon} ${disease.name}. Hãy vào Hoạt động → Bệnh viện để điều trị.`);
    }
  }
  return lines.length ? { content: lines.join("\n") } : null;
}

export function initHospital(state, { renderMoney, renderLogEntry }) {
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

  function render() {
    const player = state.player;
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    const wallet = element("p", "shop-wallet", `Ví hiện có: ${formatMoney(player.money)}`);
    const current = element("section", "dialog-card");
    current.append(element("h3", "", "🤒 Bệnh đang mắc"));
    const list = element("div", "shop-items");
    for (const illness of player.illnesses ?? []) {
      const disease = getDisease(illness.id);
      if (!disease) continue;
      const years = Math.max(0, untreatedYears(illness, player.age));
      const card = element("article", "shop-item hospital-illness");
      const treat = button("shop-buy", "", () => askConfirm(
        `💊 Điều trị ${disease.name}?`,
        `Viện phí điều trị ${disease.icon} ${disease.name}: ${formatMoney(disease.cost)}.\nSau khi điều trị, bệnh sẽ khỏi và sức khỏe không còn bị trừ.`,
        "Xác nhận điều trị",
        () => {
          if (state.player.money < disease.cost || !(state.player.illnesses ?? []).some((entry) => entry.id === illness.id)) return;
          state.player.money -= disease.cost;
          state.player.illnesses = state.player.illnesses.filter((entry) => entry.id !== illness.id);
          const log = { age: state.player.age, content: `💊 Điều trị khỏi ${disease.icon} ${disease.name}: Tiền -${formatMoneyAmount(disease.cost)} VNĐ.` };
          log.summary = log.content;
          state.logs.push(log);
          localStorage.setItem("lifeAgainSave", JSON.stringify(state));
          renderMoney();
          renderLogEntry(log);
          render();
        },
      ));
      const affordable = player.money >= disease.cost;
      treat.disabled = !affordable || player.isAlive === false;
      treat.textContent = affordable ? `💊 Điều trị · ${formatMoney(disease.cost)}` : `Không đủ tiền · ${formatMoney(disease.cost)}`;
      treat.dataset.disease = disease.id;
      card.append(
        element("h4", "", `${disease.icon} ${disease.name}`),
        element("p", "hospital-warning",
          `Phát hiện lúc ${illness.since} tuổi · chưa điều trị ${years} năm · còn ${ILLNESS_FATAL_YEARS - years} năm`),
        treat,
      );
      list.append(card);
    }
    if (!list.children.length) list.append(element("p", "hospital-healthy", "💪 Bạn đang khỏe mạnh, chưa phát hiện bệnh nào."));
    current.append(list);

    const prices = element("section", "dialog-card");
    prices.append(element("h3", "", "📋 Bảng giá viện phí"));
    const table = element("ul", "dialog-entries hospital-prices");
    for (const disease of diseases) {
      const row = element("li", "");
      row.append(element("span", "", `${disease.icon} ${disease.name}`), element("strong", "", formatMoney(disease.cost)));
      table.append(row);
    }
    prices.append(table, element("p", "hospital-note",
      `Bệnh không điều trị sẽ trừ ${ILLNESS_HEALTH_LOSS} sức khỏe mỗi năm; hết sức khỏe hoặc sau ${ILLNESS_FATAL_YEARS} năm sẽ tử vong.`));
    body.replaceChildren(back, wallet, current, prices);
  }

  $("activity-hospital").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    render();
    dialog.showModal();
    (body.querySelector(".shop-buy:not(:disabled)") ?? body.querySelector("button"))?.focus({ preventScroll: true });
  });
  $("close-hospital").addEventListener("click", () => dialog.close());
}
