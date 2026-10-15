import { saveGame } from "../core/save-store.js";
import { recordAchievementFlags } from "../achievements/achievements-data.js";
import { applyActivityGain } from "../core/stat-budget.js";
import { formatMoney, formatMoneyAmount } from "../core/money-format.js";
import { tarotCards, tarotGroups, tarotTopics } from "./tarot-data.js";

export { tarotCards, tarotGroups, tarotTopics };
export const TAROT_FEE = 500_000;
export const TAROT_DRAW = 3;
 
export const TAROT_DISCOUNT_RATE = 0.1;
export const TAROT_DISCOUNT_MAX = 50_000;
const COLLECTION_KEY = "lifeAgainTarotCollection";
const statLabels = { health: "Sức khỏe", intelligence: "Trí tuệ", happiness: "Hạnh phúc", appearance: "Ngoại hình" };

export const getTarotCard = (id) => tarotCards.find((card) => card.id === id);

 
export function readTarotCollection() {
  try {
    const value = JSON.parse(localStorage.getItem(COLLECTION_KEY) ?? "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}
function recordInCollection(cardId) {
  const collection = readTarotCollection();
  const isNew = !collection[cardId];
  collection[cardId] = (collection[cardId] ?? 0) + 1;
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  return { isNew, discovered: Object.keys(collection).length };
}

 
export function tarotAchievementIds(collection = readTarotCollection()) {
  const known = tarotCards.filter((card) => collection[card.id]);
  const count = (group) => known.filter((card) => card.group === group).length;
  const ids = [];
  if (known.length) ids.push("tarot-first");
  if (count("major") === 22) ids.push("tarot-major");
  if (["wands", "cups", "swords", "pentacles"].every((group) => count(group) >= 5)) ids.push("tarot-suits");
  if (known.length === tarotCards.length) ids.push("tarot-all");
  return ids;
}

 
 
export function drawTarotCards(random = Math.random, collection = readTarotCollection()) {
  const fresh = tarotCards.filter((card) => !collection[card.id]).map((card) => card.id);
  const known = tarotCards.filter((card) => collection[card.id]).map((card) => card.id);
  const take = (pool) => pool.splice(Math.floor(random() * pool.length), 1)[0];
  return Array.from({ length: TAROT_DRAW }, () => (fresh.length ? take(fresh) : take(known)));
}

export const hasReadTarotThisYear = (player) => player.tarotUsedAge === player.age;

 
export function getActiveTarotBuff(player) {
  const buff = player.tarotBuff;
  return buff && buff.age === player.age ? buff : null;
}
 
export function getTarotDiscountedFee(player, fee) {
  if (getActiveTarotBuff(player)?.type !== "pentacles") return { fee, discount: 0 };
  const discount = Math.min(TAROT_DISCOUNT_MAX, Math.floor(fee * TAROT_DISCOUNT_RATE));
  return { fee: fee - discount, discount };
}
 
export const getTarotStatBonus = (player) => (getActiveTarotBuff(player)?.type === "wands" ? 1 : 0);
 
export function consumeTarotBuff(player, type) {
  if (getActiveTarotBuff(player)?.type === type) player.tarotBuff = null;
}

export function describeTarotEffect(card) {
  if (card.group === "wands") return "Hoạt động phát triển bản thân tiếp theo được thêm 1 điểm vào chỉ số chính. Hết hạn khi tăng tuổi.";
  if (card.group === "pentacles") return `Giảm 10% phí phát triển bản thân lần tiếp theo, tối đa ${formatMoney(TAROT_DISCOUNT_MAX)}. Hết hạn khi tăng tuổi.`;
  const effect = card.group === "cups" ? { happiness: 2 } : card.group === "swords" ? { intelligence: 1 } : card.effect;
  return Object.entries(effect).map(([stat, value]) => `${statLabels[stat]} +${value}`).join(" · ");
}

 
export function applyTarotEffect(player, card) {
  if (card.group === "wands" || card.group === "pentacles") {
    player.tarotBuff = { type: card.group, age: player.age, cardId: card.id };
    return [];
  }
  const effect = card.group === "cups" ? { happiness: 2 } : card.group === "swords" ? { intelligence: 1 } : card.effect;
  const changes = [];
  for (const [stat, value] of Object.entries(effect)) {
    const gained = applyActivityGain(player, stat, value);
    if (gained) changes.push(`${statLabels[stat]} +${gained}`);
  }
  return changes;
}

export function initTarot(state, { renderMoney, renderStats, renderLogEntry, checkAchievements }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("tarot-dialog");
  const body = $("tarot-body");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const time = (ms) => (reducedMotion.matches ? 1 : ms);

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
  const save = () => saveGame(state);
  const topicOf = (id) => tarotTopics.find((topic) => topic.id === id);
  const focusFirst = () => (body.querySelector(".tarot-primary:not(:disabled), .shop-group:not(:disabled), .tarot-back-card")
    ?? body.querySelector("button:not(:disabled)"))?.focus({ preventScroll: true });
  const discoveredCount = () => Object.keys(readTarotCollection()).length;

  function cardFace(card) {
    const face = element("div", `tarot-face tarot-${card.group}`);
    face.append(element("span", "tarot-number", card.number), element("span", "tarot-icon", card.icon), element("span", "tarot-name", card.name));
    return face;
  }

   
  function renderHome() {
    const player = state.player;
    const used = hasReadTarotThisYear(player);
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    const intro = element("p", "game-motto", "“Một lời nhắn để suy ngẫm, lựa chọn cuộc đời vẫn nằm ở bạn.”");
    const info = element("p", "shop-wallet", `Phí xem: ${formatMoney(TAROT_FEE)} · Lượt còn lại: ${used ? 0 : 1}/1 lượt trong năm`);
    const nodes = [back, intro, info];
    if (used) nodes.push(element("p", "license-age-note", "🔮 Bạn đã xem Tarot năm nay. Sang tuổi mới sẽ có lượt mới."));
    const buff = getActiveTarotBuff(player);
    if (buff) nodes.push(element("p", "tarot-buff", `✨ Hiệu ứng đang chờ: ${describeTarotEffect(getTarotCard(buff.cardId) ?? { group: buff.type })}`));
    const list = element("div", "shop-groups");
    for (const topic of tarotTopics) {
      const choice = button("shop-group tarot-topic", `${topic.icon} ${topic.name}`, () => renderConfirm(topic.id));
      choice.dataset.topic = topic.id;
      choice.disabled = used || player.isAlive === false;
      list.append(choice);
    }
    nodes.push(list, button("shop-back tarot-collection-open", `📚 Bộ sưu tập Tarot — Đã khám phá ${discoveredCount()}/78 lá`, () => renderCollection()));
    body.replaceChildren(...nodes);
    focusFirst();
  }

   
  function renderConfirm(topicId) {
    const topic = topicOf(topicId);
    const player = state.player;
    const card = element("section", "dialog-card");
    const missing = TAROT_FEE - player.money;
    const confirm = button("shop-buy tarot-primary tarot-confirm", "🔮 Xác nhận xem bài", () => {
      if (hasReadTarotThisYear(state.player) || state.player.money < TAROT_FEE) return;
      state.player.money -= TAROT_FEE;
      state.player.tarotUsedAge = state.player.age;
       
      state.player.tarotReading = { age: state.player.age, topic: topicId, cards: drawTarotCards(), picked: null };
      save();
      renderMoney();
      renderPick();
    });
    confirm.disabled = missing > 0;
    card.append(element("h3", "", `${topic.icon} ${topic.name}`),
      element("p", "side-job-intro", `Phí xem: ${formatMoney(TAROT_FEE)}. Hệ thống sẽ xáo 78 lá và đặt úp 3 lá; bạn chọn một lá để lật.`),
      element("p", "game-summary", missing > 0 ? `Không đủ tiền: còn thiếu ${formatMoney(missing)}.` : `Ví hiện có: ${formatMoney(player.money)}`),
      confirm);
    body.replaceChildren(button("shop-back", "← Chọn chủ đề khác", renderHome), card);
    focusFirst();
  }

   
  function renderPick() {
    const reading = state.player.tarotReading;
    const topic = topicOf(reading.topic);
    const row = element("div", "tarot-spread");
    reading.cards.forEach((cardId, index) => {
      const back = button("tarot-card tarot-back-card", "", () => pick(cardId, back));
      back.setAttribute("aria-label", `Lá bài úp thứ ${index + 1}`);
      back.append(element("span", "tarot-back-mark", "🔮"));
      back.animate([{ transform: "translateY(-40px) rotate(-8deg)", opacity: 0 }, { transform: "none", opacity: 1 }],
        { duration: time(450), delay: time(index * 160), easing: "cubic-bezier(0.2, 0.9, 0.3, 1)", fill: "backwards" });
      row.append(back);
    });
    body.replaceChildren(element("p", "shop-wallet", `${topic.icon} Chủ đề: ${topic.name}`),
      element("p", "game-motto", "Hít một hơi thật sâu, rồi chọn một lá để lật."), row);
    focusFirst();
  }

  function pick(cardId, node) {
    const reading = state.player.tarotReading;
    if (!reading || reading.picked) return;
    const card = getTarotCard(cardId);
    reading.picked = cardId;
    reading.changes = applyTarotEffect(state.player, card);
    const { isNew, discovered } = recordInCollection(cardId);
    reading.isNew = isNew;
    reading.discovered = discovered;
    recordAchievementFlags(state, tarotAchievementIds());
    const topic = topicOf(reading.topic);
    const content = `🔮 Tôi xem Tarot về ${topic.name.toLocaleLowerCase("vi-VN")} và rút được ${card.name}. ` +
      `Lời nhắn nhắc tôi ${card.hint}. Chi phí: Tiền -${formatMoneyAmount(TAROT_FEE)} VNĐ.` +
      (reading.changes.length ? ` ${reading.changes.join(" · ")}.` : "");
    const log = { age: state.player.age, content, summary: content };
    state.logs.push(log);
    save();
    renderStats();
    renderLogEntry(log);
    body.querySelectorAll(".tarot-back-card").forEach((other) => {
      other.disabled = true;
      if (other !== node) other.animate([{ opacity: 1 }, { opacity: 0.25, transform: "scale(0.92)" }], { duration: time(300), fill: "forwards" });
    });
    node.animate([{ transform: "rotateY(0)" }, { transform: "rotateY(90deg) scale(1.08)" }], { duration: time(280), fill: "forwards" })
      .finished.then(() => {
        // Closing/reopening can finish this reading before the old flip ends.
        if (dialog.open && state.player.tarotReading === reading && body.contains(node)) renderResult(true);
      }).catch(error => { if (error?.name !== 'AbortError') throw error; });
  }

   
  function renderResult(animate = false) {
    const reading = state.player.tarotReading;
    if (!reading?.picked) return;
    const card = getTarotCard(reading.picked);
    const topic = topicOf(reading.topic);
    const view = element("div", "tarot-card tarot-revealed");
    view.append(cardFace(card));
    if (animate) view.animate([{ transform: "rotateY(-90deg) scale(1.08)" }, { transform: "none" }], { duration: time(380), easing: "ease-out" });
    const result = element("section", "dialog-card tarot-result");
    result.append(
      element("h3", "", `🔮 Bạn rút được: ${card.name}`),
      element("p", "side-job-intro", `${topic.icon} Chủ đề: ${topic.name}`),
      element("p", "game-quote", `“${card.readings[reading.topic]}”`),
      element("p", "tarot-effect", `✨ ${describeTarotEffect(card)}${reading.changes?.length === 0 && !["wands", "pentacles"].includes(card.group) ? " (chỉ số đã tối đa)" : ""}`),
      element("p", "tarot-progress", reading.isNew ? `🆕 Lá mới! Bộ sưu tập: ${reading.discovered}/78.` : `Bộ sưu tập: ${reading.discovered}/78.`),
      button("shop-buy tarot-primary tarot-done", "Ghi nhớ lời nhắn", () => {
        state.player.tarotReading = null;
        save();
        dialog.close();
      }),
    );
    body.replaceChildren(view, result);
    focusFirst();
  }

   
  function renderCollection() {
    const collection = readTarotCollection();
    const nodes = [button("shop-back", "← Quay lại Tarot", renderHome),
      element("p", "shop-wallet", `📚 Đã khám phá ${Object.keys(collection).length}/78 lá`)];
    for (const group of tarotGroups) {
      const cards = tarotCards.filter((card) => card.group === group.id);
      const found = cards.filter((card) => collection[card.id]).length;
      const section = element("section", "dialog-card");
      section.append(element("h3", "", `${group.icon} ${group.name} · ${found}/${cards.length}`));
      const grid = element("div", "tarot-grid");
      for (const card of cards) {
        if (collection[card.id]) {
          const mini = button("tarot-mini is-known", "", () => renderCardDetail(card, collection[card.id]));
          mini.append(cardFace(card));
          mini.dataset.card = card.id;
          grid.append(mini);
        } else {
          const mini = element("div", "tarot-mini is-unknown", "?");
          mini.setAttribute("aria-label", "Lá chưa khám phá");
          grid.append(mini);
        }
      }
      section.append(grid);
      nodes.push(section);
    }
    body.replaceChildren(...nodes);
    focusFirst();
  }

  function renderCardDetail(card, count) {
    const view = element("div", "tarot-card tarot-revealed");
    view.append(cardFace(card));
    const info = element("section", "dialog-card");
    info.append(element("h3", "", card.name), element("p", "game-quote", card.meaning),
      element("p", "side-job-intro", `✨ Hiệu ứng khi rút: ${describeTarotEffect(card)}`),
      element("p", "tarot-progress", `Đã rút ${count} lần.`));
    body.replaceChildren(button("shop-back", "← Quay lại bộ sưu tập", renderCollection), view, info);
    focusFirst();
  }

  $("activity-tarot").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    const reading = state.player.tarotReading;
    if (reading?.picked) renderResult();
    else if (reading) renderPick();
    else renderHome();
    dialog.showModal();
    focusFirst();
  });
  $("close-tarot").addEventListener("click", () => dialog.close());
   
  dialog.addEventListener("close", () => checkAchievements?.());
}
