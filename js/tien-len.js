import { formatMoney, formatMoneyAmount } from "./money-format.js";
import { askConfirm } from "./confirm-dialog.js";
import {
  applyPass, applyPlay, arrangeByGroups, canPass, cardLabel, checkPlay, chooseAiMove, chooseAiOutOfTurnChop, createGame,
  dealHands, describeCombo, isRed, legalPlays, RANKS, rankOf, sortCards, suggestPlay, SUITS, suitOf,
} from "./tien-len-rules.js";

// Tiến lên miền Nam (Hoạt động → Trò chơi): người chơi và 3 máy, cược bằng tiền trong ví.
// Mỗi người góp một mức cược; ai hết bài trước nhận cả 4 phần. Cả bàn lưu trong player.tienLen:
// trừ cược và chia bài trong cùng một lần lưu, trả thưởng cùng lần lưu với nước đánh cuối,
// nên tải lại trang chỉ tiếp tục đúng ván đang chơi, không hoàn tiền hay chia lại.
export const TIEN_LEN_STAKES = [10_000, 50_000, 100_000, 500_000];
export const TIEN_LEN_SEATS = [
  { name: "Bạn", icon: "🙂", place: "bottom" },
  { name: "Anh Tư", icon: "🧔", place: "right" },
  { name: "Chị Ba", icon: "👩", place: "top" },
  { name: "Bác Sáu", icon: "👴", place: "left" },
];
export const hasActiveTienLen = (player) => Boolean(player.tienLen?.game && !player.tienLen.game.over);
const SUIT_NAMES = ["Bích", "Chuồn", "Rô", "Cơ"];
const spokenCard = (card) => `${RANKS[rankOf(card)]} ${SUIT_NAMES[suitOf(card)]}`;
const cardsText = (cards) => sortCards(cards).map(cardLabel).join(" ");

export function initTienLen(state, { dialog, body, minAge, playsLeft, usePlay, onExit, renderMoney, renderLogEntry }) {
  const selected = new Set();
  let timer = null;
  let status = "";
  let viewing = false;

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
  const save = () => localStorage.setItem("lifeAgainSave", JSON.stringify(state));
  const table = () => state.player.tienLen;
  const game = () => table()?.game ?? null;
  const pushLog = (content) => {
    const log = { age: state.player.age, content, summary: content };
    state.logs.push(log);
    return log;
  };
  const seatName = (seat) => TIEN_LEN_SEATS[seat].name;
  const startBlocker = (stake) => {
    const player = state.player;
    if (player.isAlive === false) return "Nhân vật đã qua đời.";
    if (player.age < minAge) return `Cần đủ ${minAge} tuổi mới được ngồi bàn.`;
    if (playsLeft() <= 0) return "Bạn đã chơi đủ lượt Trò chơi năm nay. Sang năm quay lại nhé!";
    if (player.money < stake) return `Ví không đủ ${formatMoney(stake)} để góp cược.`;
    return "";
  };

  // ---------- Chọn bàn ----------
  function renderLobby(notice = "") {
    stopTimer();
    const back = button("shop-back", "← Chọn trò khác", () => {
      viewing = false;
      onExit();
    });
    const card = element("section", "dialog-card");
    card.append(element("h3", "", "🃏 Tiến lên miền Nam"),
      element("p", "game-tagline", "“Ai hết bài trước, người đó ăn cả bàn!”"),
      element("p", "side-job-intro", "Bạn và 3 đối thủ máy, mỗi người 13 lá. Mỗi người góp một mức cược; ai đánh hết bài đầu tiên nhận toàn bộ tiền thưởng (gấp 4 mức cược). Người thua chỉ mất phần đã góp."));
    const tables = element("div", "shop-groups tl-tables");
    for (const stake of TIEN_LEN_STAKES) {
      const blocker = startBlocker(stake);
      const choice = button("shop-group tl-table-pick", `🃏 Bàn ${formatMoney(stake)}`, () => sitDown(stake));
      choice.dataset.stake = String(stake);
      choice.disabled = Boolean(blocker);
      choice.append(element("span", "side-job-note", `Góp ${formatMoney(stake)} · Thắng nhận ${formatMoney(stake * 4)} (lời ${formatMoney(stake * 3)})`));
      tables.append(choice);
    }
    const rules = element("details", "tl-rules");
    rules.append(element("summary", "", "📜 Luật chơi tóm tắt"));
    const list = element("ul", "dialog-entries");
    for (const text of [
      "Giá trị: 3 < 4 < … < K < A < 2 (heo). Cùng giá trị so chất: ♠ < ♣ < ♦ < ♥.",
      "Bộ: lẻ, đôi, sám cô, sảnh (từ 3 lá liên tiếp, không có heo, A không nối 3), tứ quý, ba đôi thông, bốn đôi thông.",
      "Ván đầu của bàn, người có 3♠ đi trước và bộ đầu phải có 3♠. Các ván sau người thắng ván trước đi trước.",
      "Phải đánh bộ cùng loại, cùng số lá và lớn hơn. Đã bỏ lượt thì không được đánh lại trong vòng đó.",
      "Ba đôi thông chặt heo lẻ hoặc ba đôi thông nhỏ hơn. Tứ quý chặt heo, đôi heo, ba đôi thông hoặc tứ quý nhỏ hơn.",
      "Bốn đôi thông chặt heo, đôi heo, ba đôi thông, tứ quý, bốn đôi thông nhỏ hơn; được chặt ngoài lượt kể cả khi đã bỏ vòng.",
      "Không áp dụng tới trắng, phạt cóng, thối heo hay tiền chặt. Mỗi ván tính 1 lượt Trò chơi trong năm.",
    ]) list.append(element("li", "", text));
    rules.append(list);
    body.replaceChildren(back, element("p", "shop-wallet", `Ví hiện có: ${formatMoney(state.player.money)} · Còn ${playsLeft()} lượt năm nay`),
      ...(notice ? [element("p", "license-age-note", notice)] : []), card, tables, rules);
    (body.querySelector(".tl-table-pick:not(:disabled)") ?? back).focus({ preventScroll: true });
  }
  function sitDown(stake) {
    if (startBlocker(stake) || hasActiveTienLen(state.player)) return;
    state.player.tienLen = { stake, deals: 0, lastWinner: null, sortMode: "rank", game: null };
    startDeal();
  }

  // ---------- Chia bài, trả thưởng, bỏ ván ----------
  function startDeal() {
    const current = table();
    if (!current || hasActiveTienLen(state.player)) return;
    const blocker = startBlocker(current.stake);
    if (blocker) {
      status = blocker;
      return renderTable();
    }
    const player = state.player;
    player.money -= current.stake;
    usePlay();
    const firstDeal = current.lastWinner === null;
    const next = createGame(dealHands(), { starter: firstDeal ? null : current.lastWinner, requireThreeSpades: firstDeal });
    Object.assign(next, {
      id: `tl-${Date.now()}-${Math.floor(Math.random() * 1e6)}`, stake: current.stake, pot: current.stake * 4,
      betTaken: true, paid: false, over: false, forfeited: false, number: current.deals + 1,
    });
    next.order = current.sortMode === "group" ? arrangeByGroups(next.hands[0]) : [...next.hands[0]];
    current.deals += 1;
    current.game = next;
    selected.clear();
    status = firstDeal
      ? `Đã chia bài. ${next.turn === 0 ? "Bạn có 3♠ nên đi trước: bộ đầu tiên phải có 3♠." : `${seatName(next.turn)} có 3♠ nên đi trước.`}`
      : `Đã chia bài. ${next.turn === 0 ? "Bạn thắng ván trước nên đi trước." : `${seatName(next.turn)} thắng ván trước nên đi trước.`}`;
    save();
    renderMoney();
    renderTable();
  }
  // Trả thưởng đúng một lần, cùng lần lưu với nước đánh hết bài.
  function settle() {
    const current = table();
    const round = current?.game;
    if (!round || round.paid || round.winner === null) return;
    round.over = true;
    round.paid = true;
    current.lastWinner = round.winner;
    const won = round.winner === 0;
    if (won) state.player.money += round.pot;
    const content = `🃏 Tiến lên miền Nam (bàn ${formatMoneyAmount(round.stake)} VNĐ, ván ${round.number}): ` + (won
      ? `Bạn hết bài trước! Nhận ${formatMoneyAmount(round.pot)} VNĐ. Tiền +${formatMoneyAmount(round.pot - round.stake)} VNĐ.`
      : `${seatName(round.winner)} hết bài trước. Tiền -${formatMoneyAmount(round.stake)} VNĐ.`);
    const log = pushLog(content);
    save();
    renderMoney();
    renderLogEntry(log);
  }
  function forfeit() {
    const round = game();
    if (!round || round.over) return;
    askConfirm("🏳️ Bỏ ván?", `Bạn sẽ mất ${formatMoney(round.stake)} đã góp và không nhận thưởng.\nVán này kết thúc ngay.`, "Bỏ ván", () => {
      const current = table();
      if (!current?.game || current.game.id !== round.id || current.game.over) return;
      stopTimer();
      round.over = true;
      round.forfeited = true;
      round.paid = true;
      current.lastWinner = null;
      const log = pushLog(`🃏 Tiến lên miền Nam (bàn ${formatMoneyAmount(round.stake)} VNĐ, ván ${round.number}): Bỏ ván. Tiền -${formatMoneyAmount(round.stake)} VNĐ.`);
      save();
      renderLogEntry(log);
      status = "";
      if (dialog.open) renderTable();
    });
  }
  function leaveTable() {
    if (hasActiveTienLen(state.player)) return;
    state.player.tienLen = null;
    save();
    renderLobby();
  }

  // ---------- Nước đánh ----------
  const handOrder = (round) => {
    const hand = new Set(round.hands[0]);
    const kept = (round.order ?? []).filter((card) => hand.has(card));
    return [...kept, ...sortCards(round.hands[0].filter((card) => !kept.includes(card)))];
  };
  function act(seat, cards) {
    const round = game();
    const before = round.current;
    const check = checkPlay(round, seat, cards);
    if (!check.ok) return check;
    const won = applyPlay(round, seat, cards);
    status = `${seatName(seat)} ${check.chop ? `CHẶT bằng ${describeCombo(check.combo)}` : `đánh ${describeCombo(check.combo)}`}: ${cardsText(cards)}` +
      (check.chop && before ? ` (chặt ${describeCombo(before)} của ${seatName(before.by)})` : "") + ".";
    if (won) settle();
    else save();
    return check;
  }
  function pass(seat) {
    applyPass(game(), seat);
    status = `${seatName(seat)} bỏ lượt.`;
    save();
  }
  function playSelected() {
    const round = game();
    if (!round || round.over) return;
    const cards = [...selected];
    const check = checkPlay(round, 0, cards);
    if (!check.ok) {
      status = check.reason;
      return renderTable();
    }
    stopTimer();
    act(0, cards);
    selected.clear();
    renderTable();
  }
  function passTurn() {
    const round = game();
    if (!round || !canPass(round, 0)) return;
    stopTimer();
    pass(0);
    selected.clear();
    renderTable();
  }
  function hint() {
    const round = game();
    if (!round || round.over) return;
    let cards = round.turn === 0 ? suggestPlay(round, 0) : null;
    // Ngoài lượt: chỉ có thể là bốn đôi thông chặt.
    if (round.turn !== 0) cards = legalPlays(round, 0)[0]?.cards ?? null;
    selected.clear();
    if (cards) {
      cards.forEach((card) => selected.add(card));
      status = `Gợi ý: ${cardsText(cards)}. Bấm Đánh nếu đồng ý.`;
    } else {
      status = round.turn === 0 ? "Không có bộ nào chặn được, bạn có thể Bỏ lượt." : "Chưa tới lượt bạn.";
    }
    renderTable();
  }
  function toggleSort() {
    const current = table();
    const round = current?.game;
    if (!round) return;
    current.sortMode = current.sortMode === "group" ? "rank" : "group";
    round.order = current.sortMode === "group" ? arrangeByGroups(round.hands[0]) : sortCards(round.hands[0]);
    save();
    renderTable();
  }

  // ---------- Lượt của máy ----------
  function stopTimer() {
    clearTimeout(timer);
    timer = null;
  }
  // Máy chỉ dùng bài trên tay mình, bài đã đánh và số lá còn lại của người khác.
  function schedule() {
    // Đã hẹn lượt máy thì để nguyên: lúc tới giờ máy sẽ xem lại trạng thái bàn.
    if (timer) return;
    const round = game();
    if (!viewing || !dialog.open || !round || round.over) return;
    const chopper = [1, 2, 3].some((seat) => chooseAiOutOfTurnChop(round, seat));
    if (round.turn === 0 && !chopper) return;
    timer = setTimeout(aiStep, 700 + Math.random() * 500);
  }
  function aiStep() {
    timer = null;
    const round = game();
    if (!viewing || !round || round.over) return;
    // Lần lượt từng hành động: chặt ngoài lượt bằng bốn đôi thông được xét trước.
    for (const seat of [1, 2, 3]) {
      const chop = chooseAiOutOfTurnChop(round, seat);
      if (chop) {
        act(seat, chop);
        return renderTable();
      }
    }
    if (round.turn === 0 || round.turn === null) return renderTable();
    const seat = round.turn;
    const move = chooseAiMove(round, seat);
    if (move) act(seat, move);
    else pass(seat);
    renderTable();
  }

  // ---------- Giao diện bàn ----------
  function cardFace(card, className = "tl-card") {
    const node = element("span", `${className}${isRed(card) ? " is-red" : ""}`);
    node.append(element("span", "tl-rank", RANKS[rankOf(card)]), element("span", "tl-suit", SUITS[suitOf(card)]));
    return node;
  }
  function seatBox(round, seat) {
    const info = TIEN_LEN_SEATS[seat];
    const box = element("div", `tl-seat tl-seat-${info.place}`);
    box.classList.toggle("is-turn", round.turn === seat && !round.over);
    box.classList.toggle("is-winner", round.winner === seat);
    box.classList.toggle("is-passed", round.passed[seat] && !round.over);
    const count = round.hands[seat].length;
    box.append(element("span", "tl-avatar", info.icon), element("span", "tl-name", info.name),
      element("span", "tl-count", `🂠 ${count} lá`));
    if (round.passed[seat] && !round.over) box.append(element("span", "tl-badge", "Bỏ lượt"));
    if (round.turn === seat && !round.over) box.append(element("span", "tl-badge is-turn", "Đang đánh…"));
    box.setAttribute("aria-label", `${info.name}: còn ${count} lá${round.passed[seat] ? ", đã bỏ lượt" : ""}${round.turn === seat ? ", đang tới lượt" : ""}`);
    return box;
  }
  function centerPile(round) {
    const center = element("div", "tl-center");
    if (round.current) {
      const pile = element("div", "tl-pile");
      for (const card of round.current.cards) pile.append(cardFace(card, "tl-card is-small"));
      center.append(pile, element("p", "tl-pile-caption", `${seatName(round.current.by)} · ${describeCombo(round.current)}`));
    } else if (!round.over) {
      center.append(element("p", "tl-pile-caption", round.turn === 0 ? "Bạn mở vòng mới" : `${seatName(round.turn)} mở vòng mới`));
    }
    return center;
  }
  function resultPanel(round) {
    const won = round.winner === 0;
    const panel = element("section", `dialog-card game-result tl-result ${won ? "is-win" : "is-lose"}`);
    const title = round.forfeited ? "🏳️ Bạn đã bỏ ván" : won ? "🎉 Bạn hết bài trước!" : `😢 ${seatName(round.winner)} hết bài trước`;
    const change = won ? `+${formatMoney(round.pot - round.stake)} (nhận ${formatMoney(round.pot)}, đã góp ${formatMoney(round.stake)})`
      : `−${formatMoney(round.stake)} (phần đã góp)`;
    panel.append(element("h3", "", title), element("p", "game-summary", `Thay đổi số dư: ${change}\nVí hiện có: ${formatMoney(state.player.money)}`));
    const rest = element("ul", "dialog-entries tl-remaining");
    for (let seat = 0; seat < 4; seat += 1) {
      const row = element("li");
      row.append(element("strong", "", `${TIEN_LEN_SEATS[seat].icon} ${seatName(seat)}: `));
      const cards = sortCards(round.hands[seat]);
      if (!cards.length) row.append(element("span", "", "hết bài 🏆"));
      else {
        const pile = element("span", "tl-pile is-inline");
        for (const card of cards) pile.append(cardFace(card, "tl-card is-small"));
        row.append(pile, element("span", "tl-rest-count", ` (${cards.length} lá)`));
      }
      rest.append(row);
    }
    panel.append(element("p", "game-hint", "Bài còn lại của từng người:"), rest);
    const blocker = startBlocker(round.stake);
    const actions = element("div", "license-actions");
    const again = button("shop-buy game-primary tl-again", blocker ? "Chưa thể chơi tiếp" : `🔁 Chơi tiếp · góp ${formatMoney(round.stake)}`, () => {
      status = "";
      startDeal();
    });
    again.disabled = Boolean(blocker);
    actions.append(again);
    if (blocker) actions.append(element("p", "license-age-note", blocker));
    actions.append(button("shop-back", "🚪 Rời bàn", leaveTable));
    panel.append(actions);
    return panel;
  }
  function renderTable(notice = "") {
    viewing = true;
    const round = game();
    if (!round) return renderLobby(notice);
    if (notice) status = notice;
    for (const card of [...selected]) if (!round.hands[0].includes(card)) selected.delete(card);
    const info = element("p", "shop-wallet tl-info",
      `Bàn ${formatMoney(round.stake)} · Thưởng ${formatMoney(round.pot)} · Ví ${formatMoney(state.player.money)}`);
    const board = element("div", "tl-board");
    board.append(seatBox(round, 2), seatBox(round, 3), centerPile(round), seatBox(round, 1));
    const me = element("div", "tl-me");
    me.classList.toggle("is-turn", round.turn === 0 && !round.over);
    me.append(element("span", "", `🙂 Bạn · ${round.hands[0].length} lá`),
      element("span", "tl-turn", round.over ? `Ván ${round.number} đã kết thúc`
        : round.turn === 0 ? (round.current ? "👉 Lượt của bạn" : "👉 Bạn mở vòng mới") : `Đang chờ ${seatName(round.turn)}…`));
    const hand = element("div", "tl-hand");
    hand.setAttribute("role", "group");
    hand.setAttribute("aria-label", "Bài của bạn: chạm lá để chọn hoặc bỏ chọn");
    for (const card of handOrder(round)) {
      const node = button(`tl-card${isRed(card) ? " is-red" : ""}`, "", () => {
        if (game()?.over) return;
        if (selected.has(card)) selected.delete(card);
        else selected.add(card);
        renderTable();
      });
      node.append(element("span", "tl-rank", RANKS[rankOf(card)]), element("span", "tl-suit", SUITS[suitOf(card)]));
      node.setAttribute("aria-pressed", String(selected.has(card)));
      node.setAttribute("aria-label", spokenCard(card));
      node.dataset.focus = `card-${card}`;
      node.disabled = round.over;
      hand.append(node);
    }
    const live = element("p", "game-live tl-status", status || (round.over ? "" : round.turn === 0
      ? (round.current ? `Đánh ${describeCombo(round.current)} lớn hơn, chặt, hoặc Bỏ lượt.` : round.requireThreeSpades ? "Bộ đầu tiên phải có 3♠." : "Đánh bộ hợp lệ bất kỳ.")
      : ""));
    live.setAttribute("aria-live", "polite");
    const nodes = [info, board, me, hand, live];
    if (round.over) {
      nodes.push(resultPanel(round));
    } else {
      const check = selected.size ? checkPlay(round, 0, [...selected]) : { ok: false };
      const actions = element("div", "tl-actions");
      const playButton = button("shop-buy game-primary tl-play", check.ok && check.chop ? "💥 Chặt" : "🃏 Đánh", playSelected);
      playButton.disabled = !check.ok;
      const passButton = button("shop-back tl-pass", "✋ Bỏ lượt", passTurn);
      passButton.disabled = !canPass(round, 0);
      if (round.turn === 0 && !round.current) passButton.title = "Đang mở vòng mới nên không được bỏ lượt";
      const sortButton = button("shop-back tl-sort", table().sortMode === "group" ? "🔀 Xếp theo giá trị" : "🔀 Xếp theo bộ", toggleSort);
      const hintButton = button("shop-back tl-hint", "💡 Gợi ý", hint);
      const forfeitButton = button("shop-back tl-forfeit", "🏳️ Bỏ ván", forfeit);
      for (const [node, key] of [[playButton, "play"], [passButton, "pass"], [sortButton, "sort"], [hintButton, "hint"], [forfeitButton, "forfeit"]]) {
        node.dataset.focus = key;
      }
      actions.append(playButton, passButton, sortButton, hintButton);
      if (selected.size && !check.ok && check.reason && round.turn === 0) live.textContent = check.reason;
      nodes.push(actions, forfeitButton);
    }
    // Vẽ lại sau mỗi nước: giữ focus ở lá bài / nút đang dùng (chỉ khi focus đang ở trong bàn).
    const active = document.activeElement;
    const focusKey = body.contains(active) ? active?.dataset?.focus ?? "" : null;
    body.replaceChildren(...nodes);
    if (focusKey !== null) {
      const target = (focusKey && body.querySelector(`[data-focus="${focusKey}"]:not(:disabled)`)) ||
        body.querySelector(".tl-again:not(:disabled), .tl-play:not(:disabled), .tl-pass:not(:disabled), .tl-hint");
      target?.focus({ preventScroll: true });
    }
    schedule();
  }

  // Bản lưu cũ: ván đã có người thắng mà chưa trả thưởng thì trả ngay (không bao giờ trả hai lần).
  const saved = game();
  if (saved && saved.winner !== null && !saved.paid) settle();

  return {
    open(notice = "") {
      if (!dialog.open) dialog.showModal();
      viewing = true;
      status = "";
      if (table()) renderTable(notice);
      else renderLobby(notice);
    },
    stop() {
      viewing = false;
      stopTimer();
    },
  };
}
