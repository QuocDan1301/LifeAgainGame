import { saveGame } from "./save-store.js";
import { formatMoney } from "./money-format.js";
import {
  COMMUNITY_KEY, WILL_MIN_AGE, groupAssets, listEstateAssets, listRecipients, normalizeWill, settleEstate, summarizeAssets, validateWill,
} from "./inheritance.js";

const node = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
};
const emptyDraft = () => ({ shares: {}, assets: {}, keepsakes: {}, messages: {} });
const listNames = (people) => people.length < 2 ? people.map((person) => person.name).join("")
  : `${people.slice(0, -1).map((person) => person.name).join(", ")} và ${people.at(-1).name}`;

// Lập và sửa di chúc từ 50 tuổi. Di chúc không khóa tiền hay tài sản; mọi khoản tính lúc qua đời.
export function initWill(state, { renderLogEntry }) {
  const dialog = document.getElementById("will-dialog");
  const body = document.getElementById("will-body");
  const profile = document.getElementById("life-profile-dialog");
  if (!dialog || !body || !profile) return;
  const open = node("button", "📜 Di chúc", "shop-group");
  open.type = "button";
  open.id = "open-will";
  document.getElementById("life-tabs").before(open);
  const refreshButton = () => {
    const player = state.player;
    open.hidden = player.isAlive === false || (player.age ?? 0) < WILL_MIN_AGE;
    open.textContent = player.will ? `📜 Di chúc (sửa lần cuối năm ${player.will.updatedAtAge ?? player.age} tuổi)` : "📜 Lập di chúc";
  };
  document.getElementById("assets").addEventListener("click", refreshButton);
  refreshButton();
  let draft = null;
  let extraOpen = false;
  const section = (title, intro) => {
    const box = node("section", undefined, "will-section");
    box.append(node("h4", title));
    if (intro) box.append(node("p", intro, "will-hint"));
    return box;
  };
  const choiceRow = (label, select) => {
    const row = node("label", undefined, "will-item");
    row.append(node("span", label, "will-item-label"), select);
    return row;
  };

  // Ai nhận gì nếu qua đời hôm nay: tính bằng đúng hàm chia thừa kế lúc qua đời.
  function summary(result) {
    const box = section("📋 Nếu qua đời hôm nay");
    box.classList.add("will-preview-box");
    const cards = node("div", undefined, "will-summary");
    for (const allocation of result.allocations) {
      const lines = [
        allocation.cash ? `💰 ${formatMoney(allocation.cash)}` : "",
        allocation.assets.length ? summarizeAssets(allocation.assets) : "",
        allocation.keepsakes.length ? `🎁 ${allocation.keepsakes.map((item) => item.name).join(", ")}` : "",
        allocation.message ? "💌 Có lời nhắn" : "",
      ].filter(Boolean);
      if (!lines.length) continue;
      const card = node("div", undefined, "will-summary-card");
      card.append(node("strong", allocation.kind === "community" ? "🤝 Quỹ cộng đồng" : allocation.name), ...lines.map((line) => node("span", line)));
      cards.append(card);
    }
    box.append(cards.children.length ? cards : node("p", "Hiện chưa có tiền hay tài sản để chia.", "will-hint"));
    for (const text of result.notes) box.append(node("p", text, "will-hint"));
    return box;
  }

  function render(message = "") {
    const player = state.player;
    const recipients = listRecipients(player);
    const heirs = recipients.filter((recipient) => recipient.kind !== "community");
    const nameOf = (recipient) => recipient.kind === "community" ? "🤝 Quỹ cộng đồng" : recipient.name;
    const assets = listEstateAssets(player);
    const check = validateWill(draft, player);
    const result = settleEstate(player, draft, player.age);
    const cash = result.totalCash;
    const saved = normalizeWill(player.will);
    const changed = JSON.stringify(normalizeWill(draft) ?? emptyDraft()) !== JSON.stringify(saved
      ? { ...saved, createdAtAge: null, updatedAtAge: null } : normalizeWill(emptyDraft()));

    // Cách di chúc được thực hiện, trong ba bước.
    const how = section("📜 Di chúc làm gì?");
    const steps = node("ol", undefined, "will-steps");
    steps.append(node("li", "Trả hết nợ trước. Thiếu tiền thì bán bớt tài sản."),
      node("li", "Chia theo những gì bạn ghi dưới đây."),
      node("li", heirs.length ? `Phần chưa ghi chia đều cho ${listNames(heirs)}.` : "Phần chưa ghi chuyển vào quỹ cộng đồng."));
    how.append(steps, node("p", "Tiền và tài sản vẫn dùng bình thường. Mọi khoản tính lại theo số bạn có lúc qua đời.", "will-hint"));

    // Tiền mặt: mặc định chia đều; phần trăm là phần riêng trả trước, phần còn lại vẫn chia đều cho cả nhà.
    const money = section("💰 Tiền mặt",
      `Hôm nay có ${formatMoney(cash)} để chia${result.debt ? ` (đã trừ ${formatMoney(result.debtPaid)} tiền nợ)` : ""}.`);
    money.append(node("p", heirs.length
      ? `Để 0% thì tiền chia đều cho ${listNames(heirs)}. Muốn ai nhận nhiều hơn, thêm phần riêng cho người ấy: phần riêng được trả trước, phần còn lại vẫn chia đều cho cả nhà.`
      : "Chưa có bạn đời hay người con: tiền không ghi cho ai sẽ vào quỹ cộng đồng.", "will-hint"));
    const shareTotal = Object.values(draft.shares).reduce((sum, value) => sum + Math.floor(cash * value / 100), 0);
    const rest = Math.max(0, cash - shareTotal);
    for (const recipient of recipients) {
      const percent = draft.shares[recipient.key] ?? 0;
      const setPercent = (value) => {
        const next = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
        if (next) draft.shares[recipient.key] = next; else delete draft.shares[recipient.key];
        render();
      };
      const row = node("div", undefined, "will-share");
      const name = recipient.kind === "community" ? "🤝 Quỹ cộng đồng (làm việc thiện)"
        : `${recipient.kind === "partner" ? "💞" : "🧒"} ${recipient.name}${recipient.age != null ? ` · ${recipient.age} tuổi` : ""}`;
      const input = node("input");
      Object.assign(input, { type: "number", min: 0, max: 100, step: 5, inputMode: "numeric", value: String(percent) });
      input.dataset.share = recipient.key;
      input.setAttribute("aria-label", `Phần riêng cho ${recipient.kind === "community" ? "quỹ cộng đồng" : recipient.name}, tính theo phần trăm`);
      input.addEventListener("change", () => setPercent(input.value));
      const stepper = node("div", undefined, "will-stepper");
      for (const [label, delta, className] of [["−", -5, "will-minus"], ["+", 5, "will-plus"]]) {
        const button = node("button", label, `will-step ${className}`);
        button.type = "button";
        button.disabled = delta < 0 ? percent <= 0 : percent >= 100;
        button.setAttribute("aria-label", `${delta < 0 ? "Bớt" : "Thêm"} 5% cho ${recipient.kind === "community" ? "quỹ cộng đồng" : recipient.name}`);
        button.dataset.for = recipient.key;
        button.addEventListener("click", () => {
          setPercent(percent + delta);
          const same = body.querySelector(`.${className}[data-for="${recipient.key}"]`);
          (same && !same.disabled ? same : body.querySelector(`[data-share="${recipient.key}"]`))?.focus();
        });
        if (delta < 0) stepper.append(button, input, node("span", "%", "will-share-unit")); else stepper.append(button);
      }
      const own = Math.floor(cash * percent / 100);
      const got = result.allocations.find((item) => item.key === recipient.key)?.cash ?? 0;
      const detail = !check.ok ? "Sửa tổng phần riêng về tối đa 100% để xem số tiền."
        : recipient.kind === "community" ? (percent ? `Nhận ≈ ${formatMoney(got)}` : "Không nhận gì khi để 0%.")
          : percent ? `Nhận ≈ ${formatMoney(got)}: phần riêng ${percent}% ≈ ${formatMoney(own)} + phần chia đều ≈ ${formatMoney(Math.max(0, got - own))}`
            : `Nhận ≈ ${formatMoney(got)} (phần chia đều)`;
      row.append(node("span", name, "will-share-name"), stepper, node("span", detail, "will-share-amount"));
      money.append(row);
    }
    if (!check.ok) for (const error of check.errors) money.append(node("p", error, "will-error"));
    else if (check.total) {
      money.append(node("p", check.unassigned === 0 ? `Phần riêng đã đủ 100%: không còn phần chia đều.`
        : heirs.length ? `Phần riêng: ${check.total}%. ${check.unassigned}% còn lại (≈ ${formatMoney(rest)}) chia đều cho ${listNames(heirs)}.`
          : `Phần riêng: ${check.total}%. ${check.unassigned}% còn lại (≈ ${formatMoney(rest)}) chuyển vào quỹ cộng đồng.`, "will-total"));
      const reset = node("button", "↺ Về chia đều (bỏ mọi phần riêng)", "will-quick-button will-reset");
      reset.type = "button";
      reset.addEventListener("click", () => { draft.shares = {}; render(); });
      money.append(reset);
    }

    // Tài sản cụ thể: món giống nhau gộp một dòng, chọn người nhận áp cho cả nhóm.
    const things = section("🏠 Nhà, xe, vật nuôi, cổ vật", assets.length
      ? "Chọn người nhận cho từng món. Món không chọn được giao cho người đang nhận ít nhất." : "Hiện chưa có nhà, xe, vật nuôi hay cổ vật đứng tên bạn.");
    for (const group of groupAssets(assets)) {
      const select = node("select");
      const many = group.units.length > 1;
      if (many) select.dataset.assetGroup = group.key; else select.dataset.asset = group.units[0].key;
      select.append(new Option("Chưa chọn", ""));
      for (const recipient of recipients) select.append(new Option(nameOf(recipient), recipient.key));
      const chosen = [...new Set(group.units.map((unit) => draft.assets[unit.key] ?? ""))];
      if (chosen.length > 1) select.append(new Option("Giữ cách chia hiện tại (nhiều người nhận)", "__mixed"));
      select.value = chosen.length > 1 ? "__mixed" : chosen[0];
      select.addEventListener("change", () => {
        if (select.value === "__mixed") return;
        for (const unit of group.units) {
          if (select.value) draft.assets[unit.key] = select.value; else delete draft.assets[unit.key];
        }
        render();
      });
      things.append(choiceRow(`${group.icon} ${group.name}${many ? ` ×${group.units.length}` : ""} · ${formatMoney(group.value)}${group.loan ? ` · còn nợ ${formatMoney(group.loan)}` : ""}`, select));
    }

    // Kỷ vật và lời nhắn: không bắt buộc, thu gọn khi chưa dùng. Chỉ gửi cho bạn đời và các con.
    const extra = node("details", undefined, "will-section will-extra");
    extra.open = extraOpen || Object.keys(draft.keepsakes).length > 0 || Object.keys(draft.messages).length > 0;
    extra.addEventListener("toggle", () => { extraOpen = extra.open; });
    extra.append(node("summary", "🎁 Kỷ vật và 💌 lời nhắn (không bắt buộc)"));
    const gifts = node("div", undefined, "will-subsection");
    gifts.append(node("p", (player.keepsakes ?? []).length ? "Kỷ vật không chọn người nhận được giữ trong album gia đình." : "Chưa có kỷ vật nào.", "will-hint"));
    for (const keepsake of heirs.length ? player.keepsakes ?? [] : []) {
      const select = node("select");
      select.dataset.keepsake = keepsake.id;
      select.append(new Option("Giữ trong album gia đình", ""));
      for (const heir of heirs) select.append(new Option(heir.name, heir.key));
      select.value = draft.keepsakes[keepsake.id] ?? "";
      select.addEventListener("change", () => {
        if (select.value) draft.keepsakes[keepsake.id] = select.value; else delete draft.keepsakes[keepsake.id];
        render();
      });
      gifts.append(choiceRow(`🎁 ${keepsake.name}`, select));
    }
    const notes = node("div", undefined, "will-subsection");
    notes.append(node("p", heirs.length ? "Lời nhắn được đọc khi chia thừa kế." : "Chưa có bạn đời hay người con để gửi lời nhắn.", "will-hint"));
    for (const heir of heirs) {
      const input = node("textarea");
      Object.assign(input, { rows: 2, maxLength: 240, placeholder: `Điều muốn nói với ${heir.name}`, value: draft.messages[heir.key] ?? "" });
      input.dataset.message = heir.key;
      input.addEventListener("change", () => {
        const text = input.value.trim().slice(0, 240);
        if (text) draft.messages[heir.key] = text; else delete draft.messages[heir.key];
        render();
      });
      notes.append(choiceRow(`💌 Gửi ${heir.name}`, input));
    }
    extra.append(gifts, notes);

    const save = node("button", player.will ? "Lưu thay đổi" : "Lập di chúc", "shop-buy will-save");
    save.type = "button";
    save.disabled = !check.ok || player.isAlive === false;
    save.addEventListener("click", () => {
      if (!validateWill(draft, state.player).ok) return render();
      const first = !state.player.will;
      state.player.will = { ...normalizeWill(draft), createdAtAge: state.player.will?.createdAtAge ?? state.player.age, updatedAtAge: state.player.age };
      const content = first ? "📜 Tôi lập di chúc. Tiền và tài sản vẫn dùng bình thường; mọi khoản sẽ tính lại khi tôi qua đời."
        : "📜 Tôi sửa lại di chúc.";
      const log = { age: state.player.age, content, summary: content };
      state.logs.push(log);
      saveGame(state);
      renderLogEntry(log);
      refreshButton();
      render("Đã lưu di chúc.");
    });
    const clear = node("button", "Xóa di chúc", "shop-sell will-clear");
    clear.type = "button";
    clear.hidden = !player.will;
    clear.addEventListener("click", () => {
      state.player.will = null;
      draft = emptyDraft();
      saveGame(state);
      refreshButton();
      render("Đã xóa di chúc. Khi qua đời, tiền chia đều cho gia đình theo quy tắc mặc định.");
    });
    const status = message ? node("p", message, "will-status")
      : changed ? node("p", "Có thay đổi chưa lưu.", "will-unsaved") : null;
    // Thanh lưu dính ở đáy hộp thoại để luôn thấy trạng thái chưa lưu.
    const actions = node("div", undefined, "will-actions");
    actions.append(...(status ? [status] : []), save, clear);
    body.replaceChildren(how, summary(result), ...check.warnings.map((text) => node("p", text, "will-hint")),
      money, things, extra, actions);
  }

  open.addEventListener("click", () => {
    if (state.player.isAlive === false || state.player.age < WILL_MIN_AGE) return;
    const current = normalizeWill(state.player.will);
    draft = current ? { shares: { ...current.shares }, assets: { ...current.assets }, keepsakes: { ...current.keepsakes }, messages: { ...current.messages } }
      : emptyDraft();
    extraOpen = false;
    render();
    dialog.showModal();
    dialog.scrollTop = 0;
  });
  document.getElementById("close-will").addEventListener("click", () => dialog.close());
}
export { COMMUNITY_KEY };
