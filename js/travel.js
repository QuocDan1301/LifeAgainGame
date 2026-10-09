import { formatMoney, formatMoneyAmount } from "./money-format.js";

// Du lịch: trả chi phí chuyến đi để tăng hạnh phúc. Mỗi năm đi được một chuyến.
export const destinations = [
  { id: "da-nang", icon: "🌉", name: "Đà Nẵng", country: "Việt Nam", cost: 3_000_000, happiness: 5 },
  { id: "hoi-an", icon: "🏮", name: "Hội An", country: "Việt Nam", cost: 4_000_000, happiness: 6 },
  { id: "bangkok", icon: "🛕", name: "Bangkok", country: "Thái Lan", cost: 8_000_000, happiness: 8 },
  { id: "singapore", icon: "🦁", name: "Singapore", country: "Singapore", cost: 15_000_000, happiness: 10 },
  { id: "tokyo", icon: "🌸", name: "Tokyo", country: "Nhật Bản", cost: 25_000_000, happiness: 12 },
  { id: "seoul", icon: "🎵", name: "Seoul", country: "Hàn Quốc", cost: 20_000_000, happiness: 11 },
  { id: "paris", icon: "🗼", name: "Paris", country: "Pháp", cost: 50_000_000, happiness: 16 },
  { id: "new-york", icon: "🗽", name: "New York", country: "Hoa Kỳ", cost: 70_000_000, happiness: 18 },
  { id: "sydney", icon: "🎆", name: "Sydney", country: "Úc", cost: 45_000_000, happiness: 15 },
];

export const hasTraveledThisYear = (player, id) => (player.tripsTaken?.[id] ?? -1) === player.age;
export const hasTripThisYear = (player) => Object.values(player.tripsTaken ?? {}).includes(player.age);

export function initTravel(state, { renderMoney, renderStats, renderLogEntry }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("travel-dialog");
  const body = $("travel-body");

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

  function travel(place) {
    const player = state.player;
    if (player.isAlive === false || player.money < place.cost || hasTripThisYear(player)) return;
    player.money -= place.cost;
    player.tripsTaken = { ...(player.tripsTaken ?? {}), [place.id]: player.age };
    const before = player.happiness;
    player.happiness = Math.min(100, before + place.happiness);
    const gained = player.happiness - before;
    const content = `✈️ Du lịch ${place.icon} ${place.name} (${place.country}): Tiền -${formatMoneyAmount(place.cost)} VNĐ` +
      `${gained ? ` · Hạnh phúc +${gained}` : ""}.`;
    const log = { age: player.age, content, summary: content };
    state.logs.push(log);
    localStorage.setItem("lifeAgainSave", JSON.stringify(state));
    renderMoney();
    renderStats();
    renderLogEntry(log);
    render(place.id);
  }

  function render(justVisited = null) {
    const player = state.player;
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    const sections = [
      ["🏞️ Trong nước", destinations.filter((place) => place.country === "Việt Nam")],
      ["🌏 Nước ngoài", destinations.filter((place) => place.country !== "Việt Nam")],
    ];
    const cards = sections.map(([title, places]) => {
      const card = element("section", "dialog-card");
      card.append(element("h3", "", title));
      const items = element("div", "shop-items");
      for (const place of places) {
        const visited = hasTraveledThisYear(player, place.id);
        const traveled = hasTripThisYear(player);
        const affordable = player.money >= place.cost;
        const item = element("article", `shop-item food-item${place.id === justVisited ? " is-eaten" : ""}`);
        const action = button("shop-buy travel-go",
          visited ? "✅ Đã đi năm nay" : traveled ? "Hẹn năm sau" : affordable ? "🧳 Lên đường" : "Không đủ tiền", () => travel(place));
        action.dataset.place = place.id;
        action.disabled = traveled || !affordable || player.isAlive === false;
        item.append(
          element("h4", "", `${place.icon} ${place.name} · ${place.country}`),
          element("p", "shop-figures", `💰 Chi phí: ${formatMoney(place.cost)}\n😊 Hạnh phúc +${place.happiness}`),
          action,
        );
        items.append(item);
      }
      card.append(items);
      return card;
    });
    body.replaceChildren(back, element("p", "shop-wallet", `Ví hiện có: ${formatMoney(player.money)}`),
      element("p", "game-motto", "Mỗi năm đi được một chuyến. Hạnh phúc tối đa 100."), ...cards);
  }

  $("activity-travel").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    render();
    dialog.showModal();
    (body.querySelector(".travel-go:not(:disabled)") ?? body.querySelector("button"))?.focus({ preventScroll: true });
  });
  $("close-travel").addEventListener("click", () => dialog.close());
}
