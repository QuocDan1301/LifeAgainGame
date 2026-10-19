import { applyEstateOnce, assetsValue, summarizeAssets } from "./inheritance.js";
import { canOfferSuccession, describeHeir, describeTwoLives, getLineage, listHeirCandidates, HEIR_MIN_AGE } from "./succession.js";
import { DREAMS } from "../events/dreams.js";
import { ROOT_NAMES } from "../events/dream-roots.js";
import { formatMoney } from "./money-format.js";

const node = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
};
const section = (title, ...children) => {
  const box = node("section", undefined, "dialog-card death-section succession-section");
  box.append(node("h3", title), ...children);
  return box;
};

// Nhãn đời trên màn chơi: đời đầu hay đời con.
export function renderLineageBadge(player) {
  const badge = document.getElementById("player-lineage");
  if (!badge) return;
  const lineage = getLineage(player);
  badge.hidden = false;
  badge.textContent = lineage.generation === 2 && lineage.founder
    ? `🌱 Đời con · con của ${lineage.founder.role} ${lineage.founder.given}`
    : "🌳 Đời đầu";
}

function estateSection(estate) {
  const list = node("ul", undefined, "succession-allocations");
  for (const allocation of estate.allocations) {
    const value = allocation.cash + assetsValue(allocation);
    if (!value && !allocation.keepsakes.length && !allocation.message) continue;
    const item = node("li");
    const label = allocation.kind === "community" ? "🤝 Quỹ cộng đồng" : allocation.kind === "partner" ? `💞 ${allocation.name}` : `🧒 ${allocation.name}`;
    item.append(node("strong", label), node("span", ` · ${formatMoney(allocation.cash)}`));
    if (allocation.assets.length) item.append(node("p", `Tài sản: ${summarizeAssets(allocation.assets)}`));
    if (allocation.keepsakes.length) item.append(node("p", `Kỷ vật: ${allocation.keepsakes.map((keepsake) => keepsake.name).join(", ")}`));
    if (allocation.message) item.append(node("p", `Lời nhắn: “${allocation.message}”`, "succession-message"));
    list.append(item);
  }
  const intro = node("p", estate.usedWill
    ? "Thực hiện theo di chúc, tính trên tài sản thực tế lúc qua đời."
    : "Không có di chúc: tiền chia đều cho bạn đời và các con còn sống; tài sản không chia nhỏ được giao lần lượt cho người đang nhận ít nhất. Không có ai thì vào quỹ cộng đồng.");
  const totals = node("p", `Tiền mặt để chia: ${formatMoney(estate.totalCash)}${estate.debt ? ` · Nợ đã trả: ${formatMoney(estate.debtPaid)}` : ""}`);
  const notes = estate.notes.map((text) => node("p", text, "side-job-note"));
  if (estate.familyKeepsakes.length) notes.push(node("p", `Album gia đình giữ ${estate.familyKeepsakes.length} kỷ vật chưa trao riêng cho ai.`, "side-job-note"));
  return section("📜 Chia thừa kế", intro, totals, list.children.length ? list : node("p", "Không còn tài sản để chia."), ...notes);
}

// Màn chọn người con. Phần thừa kế đã chia cho tất cả; chọn người con không đổi phần của ai.
function heirSection(player, onTakeover) {
  const box = section("🌱 Tiếp tục câu chuyện");
  box.append(node("p", "Chọn một người con để tiếp tục từ đúng tuổi hiện tại, hoặc kết thúc lượt chơi. Mỗi lượt chơi chỉ tiếp nối được một lần."));
  const cards = node("div", undefined, "heir-cards");
  for (const { child } of listHeirCandidates(player)) {
    const heir = describeHeir(player, child);
    const card = node("article", undefined, "heir-card");
    card.dataset.heir = child.id;
    card.append(
      node("h4", `${heir.name} · ${heir.age} tuổi${heir.adopted ? " · con nuôi" : ""}`),
      node("p", `Học: ${heir.education}. Gắn kết với bạn: ${heir.bond}%.`),
      node("p", heir.dream),
      node("p", `Phần thừa kế: ${formatMoney(heir.inheritedCash)}${heir.inheritedAssets.length ? ` và ${summarizeAssets(heir.inheritedAssets)}` : ""}.`),
      node("p", "Nghề nghiệp, sức khỏe, tiền riêng và hoàn cảnh gia đình của người con chưa được ghi lại nên sẽ được suy ra một lần khi tiếp quản. Phần suy ra không mở thành tựu.", "side-job-note"),
    );
    const choose = node("button", `Tiếp quản đời ${heir.name.split(" ").at(-1)}`, "lobby-primary heir-choose");
    choose.type = "button";
    choose.addEventListener("click", () => {
      if (child.dreamSeed) return onTakeover(child.id, null);
      // Chưa có dữ liệu mầm ước mơ: một lần hồi tưởng để người chơi tự xác định mong muốn.
      const recall = node("div", undefined, "heir-recall");
      recall.append(node("p", `Nhìn lại những năm đã qua, điều ${heir.name.split(" ").at(-1)} từng mong nhất là gì?`));
      for (const [id, label] of [...Object.entries(DREAMS).map(([key, dream]) => [key, `${dream.icon} ${ROOT_NAMES[key] ?? dream.name}`]), [null, "Chưa có điều gì rõ ràng"]]) {
        const option = node("button", label, "shop-group heir-recall-option");
        option.type = "button";
        option.dataset.recall = id ?? "";
        option.addEventListener("click", () => onTakeover(child.id, id));
        recall.append(option);
      }
      choose.replaceWith(recall);
      recall.querySelector("button")?.focus();
    });
    card.append(choose);
    cards.append(card);
  }
  box.append(cards);
  return box;
}

export function renderSuccession(state, { save, cause = "", onTakeover }) {
  const player = state.player;
  const container = document.getElementById("death-succession");
  if (!container) return { offer: false };
  container.replaceChildren();
  // Chia đúng một lần; kết quả lưu cùng bản lưu trước khi hiện ra.
  const fresh = !player.estate?.settled;
  const estate = applyEstateOnce(player);
  if (fresh) save();
  container.append(estateSection(estate));
  const lineage = getLineage(player);
  if (lineage.generation === 2) {
    const lives = describeTwoLives(player, cause) ?? [];
    container.append(section("👪 Hai cuộc đời", ...lives.map((life) => {
      const block = node("div", undefined, "two-lives-life");
      block.append(node("h4", life.title));
      for (const line of life.lines) block.append(node("p", line));
      return block;
    }), node("p", "Lượt chơi khép lại sau đời con. Bắt đầu một cuộc đời mới từ bến xe.", "side-job-note")));
    return { offer: false };
  }
  if (canOfferSuccession(player)) {
    container.append(heirSection(player, onTakeover));
    return { offer: true };
  }
  const children = (player.children ?? []).filter((child) => child.alive !== false);
  if (children.length && !lineage.successionUsed && !lineage.declined) {
    container.append(section("🌱 Tiếp tục câu chuyện", node("p", `Chưa có người con nào từ ${HEIR_MIN_AGE} tuổi để tiếp quản. Lượt chơi khép lại tại đây.`)));
  }
  return { offer: false };
}
