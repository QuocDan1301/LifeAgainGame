import { formatMoney, formatMoneyAmount } from "./money-format.js";

// Ăn uống: trả tiền để tăng chỉ số. Mỗi món ăn được một lần mỗi năm để chỉ số
// không bị đẩy lên tối đa chỉ bằng cách mua liên tục.
export const dishes = [
  { id: "banh-mi", icon: "🥖", name: "Bánh mì", price: 25_000, effects: { happiness: 1 },
    description: "Giòn rụm, nóng hổi, ăn vội mà vẫn vui." },
  { id: "pho", icon: "🍜", name: "Phở bò", price: 60_000, effects: { health: 2, happiness: 1 },
    description: "Nước dùng đậm đà, ấm bụng cả buổi sáng." },
  { id: "salad", icon: "🥗", name: "Salad rau củ", price: 120_000, effects: { health: 2, appearance: 1 },
    description: "Nhẹ bụng, nhiều rau xanh, da dẻ cũng tươi tắn hơn." },
  { id: "salmon", icon: "🐟", name: "Cá hồi áp chảo", price: 350_000, effects: { intelligence: 2, health: 1 },
    description: "Giàu dinh dưỡng, đầu óc minh mẫn hẳn ra." },
  { id: "seafood", icon: "🦞", name: "Tiệc hải sản", price: 1_500_000, effects: { happiness: 4, health: 1 },
    description: "Tôm hùm, cua, ốc… một bữa no nê đáng nhớ." },
];

export const statLabels = { health: "Sức khỏe", intelligence: "Trí tuệ", happiness: "Hạnh phúc", appearance: "Ngoại hình" };
const effectText = (effects) => Object.entries(effects).map(([stat, value]) => `${statLabels[stat]} +${value}`).join(" · ");
export const hasEatenThisYear = (player, id) => (player.mealsEaten?.[id] ?? -1) === player.age;

export function initFood(state, { renderMoney, renderStats, renderLogEntry }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("food-dialog");
  const body = $("food-body");

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

  function eat(dish) {
    const player = state.player;
    if (player.isAlive === false || player.money < dish.price || hasEatenThisYear(player, dish.id)) return;
    player.money -= dish.price;
    player.mealsEaten = { ...(player.mealsEaten ?? {}), [dish.id]: player.age };
    const changes = [];
    for (const [stat, value] of Object.entries(dish.effects)) {
      const before = player[stat];
      player[stat] = Math.min(100, before + value);
      if (player[stat] > before) changes.push(`${statLabels[stat]} +${player[stat] - before}`);
    }
    const content = `${dish.icon} Ăn ${dish.name}: Tiền -${formatMoneyAmount(dish.price)} VNĐ${changes.length ? ` · ${changes.join(" · ")}` : ""}.`;
    const log = { age: player.age, content, summary: content };
    state.logs.push(log);
    localStorage.setItem("lifeAgainSave", JSON.stringify(state));
    renderMoney();
    renderStats();
    renderLogEntry(log);
    render(dish.id);
  }

  function render(justEaten = null) {
    const player = state.player;
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    const card = element("section", "dialog-card");
    card.append(element("h3", "", "🍽️ Thực đơn hôm nay"),
      element("p", "side-job-intro", "Mỗi món ăn được một lần mỗi năm. Chỉ số tối đa 100."));
    const items = element("div", "shop-items");
    for (const dish of dishes) {
      const eaten = hasEatenThisYear(player, dish.id);
      const affordable = player.money >= dish.price;
      const item = element("article", `shop-item food-item${dish.id === justEaten ? " is-eaten" : ""}`);
      const action = button("shop-buy food-eat", eaten ? "✅ Đã ăn năm nay" : affordable ? "🍴 Ăn" : "Không đủ tiền", () => eat(dish));
      action.dataset.dish = dish.id;
      action.disabled = eaten || !affordable || player.isAlive === false;
      item.append(
        element("h4", "", `${dish.icon} ${dish.name}`),
        element("p", "", dish.description),
        element("p", "shop-figures", `💰 Giá: ${formatMoney(dish.price)}\n✨ ${effectText(dish.effects)}`),
        action,
      );
      items.append(item);
    }
    card.append(items);
    body.replaceChildren(back, element("p", "shop-wallet", `Ví hiện có: ${formatMoney(player.money)}`), card);
  }

  $("activity-food").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    render();
    dialog.showModal();
    (body.querySelector(".food-eat:not(:disabled)") ?? body.querySelector("button"))?.focus({ preventScroll: true });
  });
  $("close-food").addEventListener("click", () => dialog.close());
}
