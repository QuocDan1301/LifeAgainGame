import { saveGame } from "../core/save-store.js";
import { formatMoney } from "../core/money-format.js";
import { describeActivitySlots } from "../core/stat-budget.js";
import { recordAchievementFlags } from "../achievements/achievements-data.js";
import { askConfirm } from "../ui/confirm-dialog.js";
import {
  ADOPTION_AGE_GAP,
  adoptFromOrphanage,
  getAdoptionBlock,
  getOrphanageChildren,
  getTemperament,
  hasAdoptedThisYear,
} from "./orphanage.js";

export function initOrphanage(
  state,
  { renderMoney, renderStats, renderLogEntry, checkAchievements },
) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("orphanage-dialog");
  const body = $("orphanage-body");

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

  function adopt(kidId) {
    const result = adoptFromOrphanage(state.player, kidId);
    if (!result) return render();
    const log = { age: state.player.age, content: result.content, summary: result.content };
    state.logs.push(log);
    recordAchievementFlags(state, ["first-child"]);
    saveGame(state);
    renderMoney();
    renderStats();
    renderLogEntry(log);
    checkAchievements();
    render();
  }

  function confirmAdoption(kid) {
    const partner = state.player.partner && state.player.marriedAtAge != null ? state.player.partner : null;
    askConfirm(
      `🤝 Đón ${kid.name} về nhà?`,
      `Chi phí nuôi năm đầu ${formatMoney(kid.firstYearCost)} trả ngay khi làm thủ tục. ` +
        `Từ năm sau, chi phí tăng 2.000.000 VNĐ mỗi tuổi và tính đến hết năm bé 18 tuổi (tổng ${formatMoney(kid.totalCost)}). ` +
        (partner ? `${partner.name} sẽ cùng bạn làm cha mẹ của bé.` : "Bạn sẽ một mình nuôi bé."),
      "Đón bé về nhà",
      () => adopt(kid.id),
    );
  }

  function kidCard(kid) {
    const player = state.player;
    const temperament = getTemperament(kid.temperament);
    const home = hasAdoptedThisYear(player) && player.orphanageAdoption.id === kid.id;
    const blocked = getAdoptionBlock(player, kid);
    const card = element("article", `orphanage-kid${home ? " is-home" : ""}`);
    const head = element("div", "orphanage-kid-head");
    const info = element("div", "orphanage-kid-info");
    info.append(
      element("h4", "", kid.name),
      element("span", "orphanage-kid-age", `${kid.age} tuổi · ${kid.gender === "female" ? "bé gái" : "bé trai"}`),
    );
    head.append(
      element("span", "orphanage-avatar", kid.gender === "female" ? "👧" : "👦"),
      info,
      element("span", `orphanage-tag is-${temperament.id}`, temperament.label),
    );
    const action = button(
      "shop-buy orphanage-adopt",
      home ? "✅ Đã về nhà" : blocked || "🤝 Đón bé về nhà",
      () => confirmAdoption(kid),
    );
    action.dataset.kid = kid.id;
    action.disabled = Boolean(blocked);
    card.append(
      head,
      element("p", "orphanage-note", `${temperament.note} Bé ${kid.hobby}.`),
      element("p", "orphanage-story", kid.background),
      element(
        "p",
        "shop-figures orphanage-figures",
        `💰 Năm đầu (trả ngay): ${formatMoney(kid.firstYearCost)}\n` +
          `🧾 Tổng đến 18 tuổi: ${formatMoney(kid.totalCost)}\n` +
          `💞 Gắn kết ban đầu: ${temperament.bond}%`,
      ),
      action,
    );
    return card;
  }

  function render() {
    const player = state.player;
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    const gate = element("div", "orphanage-gate");
    const gateText = element("div", "orphanage-gate-text");
    gateText.append(
      element("strong", "", "Mái ấm Hoa Sữa"),
      element("span", "", "Năm nay các cô bảo mẫu giới thiệu ba bé đang chờ một gia đình. Sang năm sẽ là những bé khác."),
    );
    gate.append(element("span", "orphanage-gate-icon", "🏡"), gateText);
    const list = element("div", "orphanage-kids");
    list.append(...getOrphanageChildren(player).map(kidCard));
    body.replaceChildren(
      back,
      gate,
      element("p", "shop-wallet", `Ví hiện có: ${formatMoney(player.money)}`),
      element(
        "p",
        "game-motto",
        `Mỗi năm nhận nuôi tối đa một bé; người nhận nuôi phải lớn hơn bé ít nhất ${ADOPTION_AGE_GAP} tuổi. ` +
          `Chi phí nuôi như mọi người con: 12 triệu khi mới sinh, thêm 2 triệu mỗi tuổi, đến hết 18 tuổi.\n${describeActivitySlots(player)}`,
      ),
      list,
    );
  }

  $("activity-orphanage").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    render();
    dialog.showModal();
    (body.querySelector(".orphanage-adopt:not(:disabled)") ?? body.querySelector("button"))?.focus({ preventScroll: true });
  });
  $("close-orphanage").addEventListener("click", () => dialog.close());
}
