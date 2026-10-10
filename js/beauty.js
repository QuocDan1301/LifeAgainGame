import { formatMoney, formatMoneyAmount } from "./money-format.js";
import { askConfirm } from "./confirm-dialog.js";

// Làm đẹp: làm nail (an toàn, mỗi năm một lần) và phẫu thuật thẩm mỹ (từ 18 tuổi,
// mỗi năm một lần). Gói càng đắt thì tỉ lệ thành công càng cao và chỉ số tăng càng
// nhiều, nhưng khi thất bại thì mức trừ cũng nặng tương ứng.
export const NAIL = { id: "nail", icon: "💅", name: "Làm nail", price: 300_000, effects: { appearance: 1, happiness: 2 } };

export const SURGERY_MIN_AGE = 18;
export const surgeryPackages = [
  { id: "basic", icon: "🩹", name: "Gói Cơ bản", price: 20_000_000, successRate: 0.6,
    gain: { appearance: 5, happiness: 3 }, loss: { health: 5, appearance: 5, happiness: 5 },
    description: "Phòng khám nhỏ, giá mềm. Rẻ thì rủi ro cũng nhiều hơn." },
  { id: "standard", icon: "💉", name: "Gói Tiêu chuẩn", price: 80_000_000, successRate: 0.75,
    gain: { appearance: 10, happiness: 6 }, loss: { health: 8, appearance: 8, happiness: 8 },
    description: "Bệnh viện thẩm mỹ uy tín, bác sĩ có tay nghề." },
  { id: "premium", icon: "👑", name: "Gói Cao cấp", price: 250_000_000, successRate: 0.9,
    gain: { appearance: 18, happiness: 10 }, loss: { health: 12, appearance: 12, happiness: 12 },
    description: "Chuyên gia hàng đầu, công nghệ hiện đại. Thất bại hiếm nhưng rất nặng." },
];

export const statLabels = { health: "Sức khỏe", intelligence: "Trí tuệ", happiness: "Hạnh phúc", appearance: "Ngoại hình" };
const listText = (stats, sign) => Object.entries(stats).map(([stat, value]) => `${statLabels[stat]} ${sign}${value}`).join(" · ");
export const hasNailThisYear = (player) => (player.nailAge ?? -1) === player.age;
export const hasSurgeryThisYear = (player) => (player.surgeryAge ?? -1) === player.age;

// Cộng/trừ chỉ số trong khoảng 0–100 (sức khỏe tối thiểu 1 để phẫu thuật không gây tử vong ngay).
function applyStats(player, stats, sign) {
  const changes = [];
  for (const [stat, value] of Object.entries(stats)) {
    const before = player[stat] ?? 0;
    const floor = stat === "health" ? Math.min(1, before) : 0;
    player[stat] = Math.max(floor, Math.min(100, before + sign * value));
    const diff = player[stat] - before;
    if (diff) changes.push(`${statLabels[stat]} ${diff > 0 ? "+" : ""}${diff}`);
  }
  return changes;
}

export function initBeauty(state, { renderMoney, renderStats, renderLogEntry }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("beauty-dialog");
  const body = $("beauty-body");

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

  function record(content, outcome) {
    const log = { age: state.player.age, content, summary: content };
    state.logs.push(log);
    localStorage.setItem("lifeAgainSave", JSON.stringify(state));
    renderMoney();
    renderStats();
    renderLogEntry(log);
    render(outcome);
  }

  function doNail() {
    const player = state.player;
    if (player.isAlive === false || player.money < NAIL.price || hasNailThisYear(player)) return;
    player.money -= NAIL.price;
    player.nailAge = player.age;
    const changes = applyStats(player, NAIL.effects, 1);
    const content = `${NAIL.icon} ${NAIL.name}: Tiền -${formatMoneyAmount(NAIL.price)} VNĐ${changes.length ? ` · ${changes.join(" · ")}` : ""}.`;
    record(content, { type: "success", text: content });
  }

  function doSurgery(pack) {
    const player = state.player;
    if (player.isAlive === false || player.age < SURGERY_MIN_AGE || player.money < pack.price || hasSurgeryThisYear(player)) return;
    player.money -= pack.price;
    player.surgeryAge = player.age;
    const success = Math.random() < pack.successRate;
    const changes = applyStats(player, success ? pack.gain : pack.loss, success ? 1 : -1);
    const detail = changes.length ? ` · ${changes.join(" · ")}` : "";
    const content = success
      ? `✨ Phẫu thuật thẩm mỹ ${pack.name} thành công: Tiền -${formatMoneyAmount(pack.price)} VNĐ${detail}.`
      : `💔 Phẫu thuật thẩm mỹ ${pack.name} thất bại: Tiền -${formatMoneyAmount(pack.price)} VNĐ${detail}.`;
    record(content, { type: success ? "success" : "failure", text: content });
  }

  function render(outcome = null) {
    const player = state.player;
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    const parts = [back, element("p", "shop-wallet", `Ví hiện có: ${formatMoney(player.money)}`)];
    if (outcome) {
      const result = element("p", `beauty-result is-${outcome.type}`, outcome.text);
      result.setAttribute("role", "status");
      parts.push(result);
    }

    const nailCard = element("section", "dialog-card");
    nailCard.append(element("h3", "", "💅 Làm nail"),
      element("p", "side-job-intro", "Làm móng xinh xắn, an toàn tuyệt đối. Mỗi năm một lần."));
    const nailDone = hasNailThisYear(player);
    const nailAffordable = player.money >= NAIL.price;
    const nailItem = element("article", "shop-item beauty-item");
    const nailAction = button("shop-buy beauty-nail", nailDone ? "✅ Đã làm năm nay" : nailAffordable ? "💅 Làm nail" : "Không đủ tiền", doNail);
    nailAction.disabled = nailDone || !nailAffordable || player.isAlive === false;
    nailItem.append(
      element("h4", "", `${NAIL.icon} ${NAIL.name}`),
      element("p", "shop-figures", `💰 Giá: ${formatMoney(NAIL.price)}\n✨ ${listText(NAIL.effects, "+")}`),
      nailAction,
    );
    nailCard.append(nailItem);

    const surgeryCard = element("section", "dialog-card");
    const tooYoung = player.age < SURGERY_MIN_AGE;
    const surgeryDone = hasSurgeryThisYear(player);
    surgeryCard.append(element("h3", "", "🏥 Phẫu thuật thẩm mỹ"),
      element("p", "side-job-intro", tooYoung
        ? `Cần đủ ${SURGERY_MIN_AGE} tuổi để phẫu thuật thẩm mỹ.`
        : "Gói càng đắt càng dễ thành công và đẹp hơn nhiều, nhưng thất bại cũng mất nhiều hơn. Mỗi năm một lần."));
    const items = element("div", "shop-items");
    for (const pack of surgeryPackages) {
      const affordable = player.money >= pack.price;
      const item = element("article", "shop-item beauty-item");
      const label = tooYoung ? `🔒 Từ ${SURGERY_MIN_AGE} tuổi` : surgeryDone ? "✅ Đã phẫu thuật năm nay" : affordable ? "💉 Phẫu thuật" : "Không đủ tiền";
      const action = button("shop-buy beauty-surgery", label, () => askConfirm(
        `${pack.icon} Phẫu thuật ${pack.name}?`,
        `Chi phí: ${formatMoney(pack.price)}.\nTỉ lệ thành công: ${Math.round(pack.successRate * 100)}%.\n` +
          `Thành công: ${listText(pack.gain, "+")}.\nThất bại: ${listText(pack.loss, "-")}.`,
        "Xác nhận phẫu thuật",
        () => doSurgery(pack),
      ));
      action.dataset.package = pack.id;
      action.disabled = tooYoung || surgeryDone || !affordable || player.isAlive === false;
      item.append(
        element("h4", "", `${pack.icon} ${pack.name}`),
        element("p", "", pack.description),
        element("p", "shop-figures",
          `💰 Giá: ${formatMoney(pack.price)}\n🎯 Thành công: ${Math.round(pack.successRate * 100)}%\n` +
          `✨ Thành công: ${listText(pack.gain, "+")}\n⚠️ Thất bại: ${listText(pack.loss, "-")}`),
        action,
      );
      items.append(item);
    }
    surgeryCard.append(items);
    parts.push(nailCard, surgeryCard);
    body.replaceChildren(...parts);
  }

  $("activity-beauty").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    render();
    dialog.showModal();
    (body.querySelector(".shop-buy:not(:disabled)") ?? body.querySelector("button"))?.focus({ preventScroll: true });
  });
  $("close-beauty").addEventListener("click", () => dialog.close());
}
