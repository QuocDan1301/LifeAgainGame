import { recordAchievementFlags } from '../achievements/achievements-data.js';
import { saveGame, isSavePaused } from "../core/save-store.js";
import { formatMoney, formatMoneyAmount } from "../core/money-format.js";
import { SCRATCH_CARDS, SCRATCH_CELLS, SCRATCH_LUCKY, buyScratch, canBuyScratch, formatScratchNumber, getOpenScratchCard, getScratchCard,
  getSettledScratchCard, scratchCells, scratchSpotWins, scratchThisYear, scratchTopPrize, scratchWinChance } from "./scratch-cards.js";

 
 
 
export const LOTTERY_MIN_AGE = 18;
export const TICKET_PRICE = 10_000;
export const MAX_TICKETS_PER_YEAR = 30;
export const VIETLOTT_MAX = 45;
export const VIETLOTT_PICKS = 6;
export const VIETLOTT_JACKPOT = 12_000_000_000;
 
 
export const VIETLOTT_JACKPOT_GROWTH = 3_000_000_000;
export const VIETLOTT_JACKPOT_MAX = 300_000_000_000;
export const VIETLOTT_OTHER_WINNER = 0.2;
const KIEN_THIET_CHOICES = 6;

 
export function getVietlottJackpot(player) {
  return player.vietlottPot?.amount ?? VIETLOTT_JACKPOT;
}
 
export function getVietlottJackpotYears(player) {
  const pot = player.vietlottPot;
  return pot ? Math.max(0, Math.round((pot.amount - VIETLOTT_JACKPOT) / VIETLOTT_JACKPOT_GROWTH)) : 0;
}
 
function advanceVietlottPot(player, age, playerWon, random) {
  const before = getVietlottJackpot(player);
  if (player.vietlottPot?.updatedAge >= age) return null;
  let outcome;
  let amount;
  if (playerWon) {
    outcome = "player";
    amount = VIETLOTT_JACKPOT;
  } else if (random() < VIETLOTT_OTHER_WINNER) {
    outcome = "other";
    amount = VIETLOTT_JACKPOT;
  } else {
    outcome = "grow";
    amount = Math.min(VIETLOTT_JACKPOT_MAX, before + VIETLOTT_JACKPOT_GROWTH);
  }
  player.vietlottPot = { amount, updatedAge: age };
  return { drawn: before, next: amount, outcome };
}

 
export const kienThietPrizes = [
  { digits: 6, prize: 2_000_000_000 },
  { digits: 5, prize: 30_000_000 },
  { digits: 4, prize: 1_000_000 },
  { digits: 3, prize: 200_000 },
  { digits: 2, prize: 100_000 },
];
 
export const vietlottPrizes = [
  { hits: 6, prize: VIETLOTT_JACKPOT },
  { hits: 5, prize: 10_000_000 },
  { hits: 4, prize: 300_000 },
  { hits: 3, prize: 30_000 },
];

export const randomKienThiet = (random = Math.random) => String(Math.floor(random() * 1_000_000)).padStart(6, "0");
export function randomVietlott(random = Math.random) {
  const pool = Array.from({ length: VIETLOTT_MAX }, (_, index) => index + 1);
  return Array.from({ length: VIETLOTT_PICKS }, () => pool.splice(Math.floor(random() * pool.length), 1)[0])
    .sort((a, b) => a - b);
}
 
export const formatVietlott = (numbers) => numbers.map((number) => String(number).padStart(2, "0")).join(" ");

export function kienThietResult(ticket, draw) {
  let tail = 0;
  while (tail < 6 && ticket[5 - tail] === draw[5 - tail]) tail++;
  return { tail, prize: kienThietPrizes.find((tier) => tail >= tier.digits)?.prize ?? 0 };
}
export function vietlottResult(numbers, draw, jackpot = VIETLOTT_JACKPOT) {
  const hits = numbers.filter((number) => draw.includes(number)).length;
  return { hits, prize: hits === 6 ? jackpot : vietlottPrizes.find((tier) => hits === tier.hits)?.prize ?? 0 };
}

export const ticketsThisYear = (player) => (player.lotteryTickets ?? []).filter((ticket) => ticket.age === player.age);

const isValidTicket = (ticket) => ticket.type === "kien-thiet"
  ? /^\d{6}$/.test(ticket.number)
  : ticket.type === "vietlott" && ticket.numbers?.length === VIETLOTT_PICKS &&
    new Set(ticket.numbers).size === VIETLOTT_PICKS &&
    ticket.numbers.every((number) => Number.isInteger(number) && number >= 1 && number <= VIETLOTT_MAX);

export const ticketsUsedThisYear = (player) => ticketsThisYear(player).length + scratchThisYear(player);
export const scratchRules = (player) => ({ minAge: LOTTERY_MIN_AGE, ticketsUsed: ticketsUsedThisYear(player), maxTickets: MAX_TICKETS_PER_YEAR });

export function canBuyTicket(player) {
  return player.isAlive !== false && player.age >= LOTTERY_MIN_AGE && player.money >= TICKET_PRICE &&
    ticketsUsedThisYear(player) < MAX_TICKETS_PER_YEAR;
}

export function buyTicket(player, ticket) {
  if (!canBuyTicket(player) || !isValidTicket(ticket)) return false;
  player.lotteryDraws = { ...(player.lotteryDraws ?? {}) };
  player.lotteryDraws[player.age] ??= { kienThiet: randomKienThiet(), vietlott: randomVietlott() };
  player.money -= TICKET_PRICE;
  const saved = ticket.type === "vietlott"
    ? { type: "vietlott", numbers: [...ticket.numbers].sort((a, b) => a - b) }
    : { type: "kien-thiet", number: ticket.number };
  player.lotteryTickets = [...(player.lotteryTickets ?? []), { ...saved, age: player.age }];
  return true;
}

function luckyLine(total) {
  if (total >= 1_000_000_000) return `Tôi phải nhờ cả nhà dò lại mới dám tin: trúng ${formatMoney(total)}! Cuộc đời sang trang từ hôm nay.`;
  if (total >= 10_000_000) return `Run tay cầm tờ vé trúng ${formatMoney(total)}, tôi chạy một mạch ra đại lý đổi thưởng, cả xóm kéo sang chúc mừng!`;
  if (total >= 1_000_000) return `Tôi dò vé ba lần mới tin mình trúng ${formatMoney(total)}. Hôm nay khỏi rửa chén, tôi bao cả nhà!`;
  if (total > 0) return `Trúng ${formatMoney(total)}, không giàu nhưng đủ một chầu trà sữa vui cả ngày!`;
  return "Dò hết vé vẫn trượt, thôi coi như góp tiền xây dựng quê hương.";
}

 
export function collectLotteryYear(player, age, random = Math.random) {
  const due = (player.lotteryTickets ?? []).filter((ticket) => ticket.age < age);
   
  if (!due.length) {
    advanceVietlottPot(player, age, false, random);
    return null;
  }
  const jackpot = getVietlottJackpot(player);
  let jackpotWon = false;
  const lines = [];
  let total = 0;
   
  const draws = [];
  for (const boughtAge of [...new Set(due.map((ticket) => ticket.age))]) {
    const draw = player.lotteryDraws?.[boughtAge] ?? { kienThiet: randomKienThiet(), vietlott: randomVietlott() };
    const tickets = due.filter((ticket) => ticket.age === boughtAge);
    const reveal = { boughtAge, kienThiet: null, vietlott: null };
    draws.push(reveal);
    const kienThiet = tickets.filter((ticket) => ticket.type === "kien-thiet");
    if (kienThiet.length) {
      lines.push(`🎟️ Xổ số kiến thiết mở thưởng số ${draw.kienThiet}.`);
      reveal.kienThiet = { draw: draw.kienThiet, tickets: [] };
      let misses = 0;
      for (const ticket of kienThiet) {
        const { tail, prize } = kienThietResult(ticket.number, draw.kienThiet);
        reveal.kienThiet.tickets.push({ number: ticket.number, tail, prize });
        if (!prize) { misses++; continue; }
        total += prize;
        lines.push(`• Vé ${ticket.number} trùng ${tail === 6 ? "cả 6 số" : `${tail} số cuối`}: +${formatMoneyAmount(prize)} VNĐ.`);
      }
      if (misses) lines.push(`• ${misses} vé kiến thiết không trúng.`);
    }
    const vietlott = tickets.filter((ticket) => ticket.type === "vietlott");
    if (vietlott.length) {
      lines.push(`🎰 Vietlott Mega 6/45 mở thưởng: ${formatVietlott(draw.vietlott)}.`);
      reveal.vietlott = { draw: [...draw.vietlott], tickets: [] };
      let misses = 0;
      for (const ticket of vietlott) {
        const { hits, prize } = vietlottResult(ticket.numbers, draw.vietlott, jackpot);
        if (hits === 6) jackpotWon = true;
        reveal.vietlott.tickets.push({ numbers: [...ticket.numbers], hits, prize });
        if (!prize) { misses++; continue; }
        total += prize;
        lines.push(`• Vé ${formatVietlott(ticket.numbers)} trùng ${hits} số${hits === 6 ? " (JACKPOT)" : ""}: +${formatMoneyAmount(prize)} VNĐ.`);
      }
      if (misses) lines.push(`• ${misses} vé Vietlott không trúng.`);
    }
  }
  player.money += total;
  if (total > 0) recordAchievementFlags({ player }, ['first-lottery-win']);
  player.lotteryTickets = (player.lotteryTickets ?? []).filter((ticket) => ticket.age >= age);
  player.lotteryDraws = Object.fromEntries(Object.entries(player.lotteryDraws ?? {}).filter(([key]) => Number(key) >= age));
  const pot = advanceVietlottPot(player, age, jackpotWon, random);
  const hadVietlott = draws.some((draw) => draw.vietlott);
  if (pot && hadVietlott) {
    lines.push(pot.outcome === "player"
      ? `💎 Bạn ẵm trọn Jackpot ${formatMoneyAmount(pot.drawn)} VNĐ. Jackpot kỳ sau quay về ${formatMoneyAmount(pot.next)} VNĐ.`
      : pot.outcome === "other"
        ? `💎 Một người chơi khác đã trúng Jackpot ${formatMoneyAmount(pot.drawn)} VNĐ. Jackpot kỳ sau quay về ${formatMoneyAmount(pot.next)} VNĐ.`
        : `💎 Không ai trúng Jackpot, giải tích lũy lên ${formatMoneyAmount(pot.next)} VNĐ cho kỳ sau.`);
  }
  lines.push(luckyLine(total));
  player.lotteryReveal = { age, total, message: luckyLine(total), draws, jackpot: hadVietlott ? pot : null };
  return { amount: total, content: lines.join("\n") };
}

 
function setPurchaseLogText(log) {
  const { kienThiet, vietlott } = log.lotteryPurchase;
  const count = kienThiet.length + vietlott.length;
  const lines = [`🎟️ Mua ${count} vé số: Tiền -${formatMoneyAmount(count * TICKET_PRICE)} VNĐ.`];
  if (kienThiet.length) lines.push(`• Kiến thiết: ${kienThiet.join(", ")}`);
  if (vietlott.length) lines.push(`• Vietlott: ${vietlott.map(formatVietlott).join("; ")}`);
  log.content = log.summary = lines.join("\n");
}

 
export function mergeLotteryPurchaseLogs(logs) {
  const kienThietLine = /^🎟️ Mua vé số kiến thiết (\d{6}): Tiền -10k VNĐ\.$/u;
  const vietlottLine = /^🎟️ Mua vé Vietlott ((?:\d{2} ){5}\d{2}): Tiền -10k VNĐ\.$/u;
  const merged = new Map();
  return logs.filter((log) => {
    const kienThiet = log.content?.match(kienThietLine)?.[1];
    const vietlott = log.content?.match(vietlottLine)?.[1];
    if (!kienThiet && !vietlott) return true;
    let target = merged.get(log.age);
    const isFirst = !target;
    if (isFirst) {
      target = log;
      target.lotteryPurchase = { kienThiet: [], vietlott: [] };
      merged.set(log.age, target);
    }
    if (kienThiet) target.lotteryPurchase.kienThiet.push(kienThiet);
    else target.lotteryPurchase.vietlott.push(vietlott.split(" ").map(Number));
    setPurchaseLogText(target);
    return isFirst;
  });
}

export function initLottery(state, { renderMoney, renderLogEntry, updateLogEntry }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("lottery-dialog");
  const body = $("lottery-body");
  let choices = [];
  let picked = new Set();

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
  const newChoices = () => Array.from({ length: KIEN_THIET_CHOICES }, () => randomKienThiet());

  function buy(ticket) {
    if (!buyTicket(state.player, ticket)) return;
    const age = state.player.age;
    let log = state.logs.findLast((entry) => entry.age === age && entry.lotteryPurchase);
    const isNew = !log;
    if (isNew) log = { age, lotteryPurchase: { kienThiet: [], vietlott: [] } };
    const saved = state.player.lotteryTickets.at(-1);
    if (saved.type === "vietlott") log.lotteryPurchase.vietlott.push(saved.numbers);
    else log.lotteryPurchase.kienThiet.push(saved.number);
    setPurchaseLogText(log);
    if (isNew) state.logs.push(log);
    saveGame(state);
    renderMoney();
    isNew ? renderLogEntry(log) : updateLogEntry(log);
  }

  // Một dòng nhật ký mỗi năm cho vé cào, cập nhật sau mỗi lần mua và mỗi vé cào xong.
  function recordScratchLog() {
    const year = state.player.scratchYear;
    if (!year || year.age !== state.player.age) return;
    let log = state.logs.findLast((entry) => entry.age === year.age && entry.scratchLog);
    const isNew = !log;
    if (isNew) log = { age: year.age, scratchLog: true };
    log.content = log.summary = `🪙 Vé số cào: ${year.bought} vé, Tiền -${formatMoneyAmount(year.spent)} VNĐ.` +
      (year.won ? ` Trúng tổng cộng +${formatMoneyAmount(year.won)} VNĐ.` : " Chưa trúng vé nào.");
    if (isNew) state.logs.push(log);
    isNew ? renderLogEntry(log) : updateLogEntry(log);
  }
  function buyScratchCard(id) {
    if (!buyScratch(state.player, id, scratchRules(state.player))) return;
    recordScratchLog();
    saveGame(state);
    renderMoney();
    render(".scratch-cell:not(:disabled)");
  }
  function scratch(indexes) {
    const result = scratchCells(state.player, indexes);
    if (!result) return;
    if (result.done) recordScratchLog();
    saveGame(state);
    if (result.done) renderMoney();
    render(result.done ? ".scratch-buy:not(:disabled)" : ".scratch-cell:not(:disabled)");
  }
  function scratchBoard(card) {
    const kind = getScratchCard(card.type);
    const board = element("div", `scratch-board${card.settled ? " is-done" : ""}${card.settled && card.prize ? " is-win" : ""}`);
    board.append(element("p", "scratch-board-title", `${kind.icon} ${kind.name} · ${card.settled ? "đã cào xong" : "chạm từng ô để cào"}`));
    const cell = (index, className, hidden, label, parts) => {
      const open = card.revealed[index];
      const node = button(`scratch-cell ${className}${open ? " is-revealed" : ""}`, open ? undefined : "?", () => scratch([index]));
      if (open) node.append(...parts.map(([partClass, text]) => element("span", partClass, text)));
      node.dataset.index = index;
      node.disabled = open || card.settled;
      node.setAttribute("aria-label", open ? label : hidden);
      return node;
    };
    const winning = card.settled ? card.spots.find((spot) => scratchSpotWins(card, spot)) : null;
    const lucky = element("div", "scratch-lucky");
    card.lucky.forEach((number, index) => {
      const shown = formatScratchNumber(number);
      const node = cell(index, "is-lucky", `Cào số của bạn thứ ${index + 1}`, `Số của bạn: ${shown}`, [["scratch-number", shown]]);
      if (winning?.number === number) node.classList.add("is-match");
      lucky.append(node);
    });
    const grid = element("div", "scratch-grid");
    card.spots.forEach((spot, offset) => {
      const shown = formatScratchNumber(spot.number);
      const node = cell(SCRATCH_LUCKY + offset, "is-spot", `Cào ô dò ${offset + 1}`, `Ô dò ${offset + 1}: số ${shown}, ${formatMoney(spot.amount)}`,
        [["scratch-number", shown], ["scratch-amount", formatMoneyAmount(spot.amount)]]);
      if (spot === winning) node.classList.add("is-match");
      grid.append(node);
    });
    board.append(element("p", "scratch-label", "Số của bạn"), lucky, element("p", "scratch-label", "Số cào trúng"), grid);
    if (!card.settled) board.append(button("shop-back scratch-all", "🪙 Cào hết", () => scratch([...Array(SCRATCH_CELLS).keys()])));
    else board.append(element("p", `scratch-result${card.prize ? " is-win" : ""}`, winning
      ? `Số ${formatScratchNumber(winning.number)} trùng số của bạn: trúng ${formatMoney(card.prize)}, tiền đã vào ví.`
      : "Không ô nào trùng số của bạn. Vé này không trúng."));
    return board;
  }

  function prizeTable(rows) {
    const list = element("ul", "dialog-entries lottery-prizes");
    for (const [name, prize] of rows) {
      const row = element("li", "");
      row.append(element("span", "", name), element("strong", "", prize));
      list.append(row);
    }
    return list;
  }

  function render(focusSelector = null) {
    const player = state.player;
    const bought = ticketsThisYear(player);
    const tooYoung = player.age < LOTTERY_MIN_AGE;
    const canBuy = canBuyTicket(player);
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    const wallet = element("p", "shop-wallet", `Ví hiện có: ${formatMoney(player.money)}`);
    const info = element("p", "game-motto lottery-info", tooYoung
      ? `🔒 Cần đủ ${LOTTERY_MIN_AGE} tuổi để mua vé số.`
      : `Giá ${formatMoney(TICKET_PRICE)}/vé · Đã mua ${ticketsUsedThisYear(player)}/${MAX_TICKETS_PER_YEAR} vé năm nay (tính cả vé cào). ` +
        "Nhấn + Tuổi để quay thưởng; tiền thưởng tự cộng vào ví.");

     
    const kienThiet = element("section", "dialog-card");
    kienThiet.append(element("h3", "", "🎟️ Vé số kiến thiết"),
      element("p", "side-job-intro", "Chọn một vé 6 chữ số. Trùng các số cuối (đúng thứ tự) là trúng."));
    const options = element("div", "lottery-choices");
    choices.forEach((number, index) => {
      const choice = button("shop-buy lottery-kien-thiet", `🎟️ ${number}`, () => {
        buy({ type: "kien-thiet", number });
        choices[index] = randomKienThiet();
        render(`.lottery-kien-thiet:nth-child(${index + 1})`);
      });
      choice.dataset.number = number;
      choice.disabled = !canBuy;
      choice.setAttribute("aria-label", `Mua vé kiến thiết số ${number}`);
      options.append(choice);
    });
    const shuffle = button("shop-back lottery-shuffle", "🔄 Đổi dãy số khác", () => {
      choices = newChoices();
      render(".lottery-shuffle");
    });
    shuffle.disabled = tooYoung;
    kienThiet.append(options, shuffle, prizeTable([
      ["Trùng 2 số cuối", formatMoney(100_000)],
      ["Trùng 3 số cuối", formatMoney(200_000)],
      ["Trùng 4 số cuối", formatMoney(1_000_000)],
      ["Trùng 5 số cuối", formatMoney(30_000_000)],
      ["Trùng cả 6 số", formatMoney(2_000_000_000)],
    ]));

     
    const vietlott = element("section", "dialog-card");
    const status = element("p", "lottery-picked");
    const buyVietlott = button("shop-buy lottery-vietlott-buy", "", () => {
      const numbers = [...picked];
      buy({ type: "vietlott", numbers });
      picked = new Set();
      render(".lottery-vietlott-buy");
    });
    const grid = element("div", "lottery-grid");
    const update = () => {
      for (const cell of grid.children) {
        const on = picked.has(Number(cell.dataset.number));
        cell.classList.toggle("is-picked", on);
        cell.setAttribute("aria-pressed", String(on));
        cell.disabled = tooYoung || (!on && picked.size >= VIETLOTT_PICKS);
      }
      const sorted = [...picked].sort((a, b) => a - b);
      status.textContent = `Đã chọn ${picked.size}/${VIETLOTT_PICKS}${sorted.length ? `: ${formatVietlott(sorted)}` : ""}`;
      buyVietlott.disabled = !canBuy || picked.size !== VIETLOTT_PICKS;
      buyVietlott.textContent = picked.size === VIETLOTT_PICKS ? "🎰 Mua vé Vietlott" : `Chọn đủ ${VIETLOTT_PICKS} số để mua`;
    };
    for (let number = 1; number <= VIETLOTT_MAX; number++) {
      const cell = button("lottery-number", String(number).padStart(2, "0"), () => {
        picked.has(number) ? picked.delete(number) : picked.add(number);
        update();
      });
      cell.dataset.number = number;
      grid.append(cell);
    }
    const tools = element("div", "lottery-tools");
    const quick = button("shop-back lottery-quick", "⚡ Chọn nhanh", () => {
      picked = new Set(randomVietlott());
      update();
    });
    const clear = button("shop-back lottery-clear", "🧹 Xóa chọn", () => {
      picked = new Set();
      update();
    });
    quick.disabled = clear.disabled = tooYoung;
    tools.append(quick, clear);
    const years = getVietlottJackpotYears(player);
    const pot = element("div", "lottery-jackpot");
    pot.append(element("span", "", "💎 Jackpot kỳ tới"),
      element("strong", "", formatMoney(getVietlottJackpot(player))),
      element("small", "", years ? `Đã tích lũy ${years} năm chưa ai trúng` : "Mức khởi điểm, tăng dần mỗi năm chưa ai trúng"));
    vietlott.append(element("h3", "", "🎰 Vietlott Mega 6/45"), pot,
      element("p", "side-job-intro", "Chọn 6 số khác nhau từ 01 đến 45, không cần đúng thứ tự."),
      grid, tools, status, buyVietlott, prizeTable([
        ["Trùng 3 số", formatMoney(30_000)],
        ["Trùng 4 số", formatMoney(300_000)],
        ["Trùng 5 số", formatMoney(10_000_000)],
        ["Trùng 6 số (Jackpot)", formatMoney(getVietlottJackpot(player))],
      ]));
    update();

    // Vé số cào: chọn mức rủi ro, cào ngay; cào xong vé này mới mua vé tiếp.
    const scratchCard = element("section", "dialog-card scratch-section");
    const openCard = getOpenScratchCard(player);
    scratchCard.append(element("h3", "", "🪙 Vé số cào"),
      element("p", "side-job-intro", "Mua là cào ngay. Cào 2 ô “Số của bạn”, rồi cào 6 ô dò bên dưới: ô nào có số trùng số của bạn thì trúng đúng số tiền in ở ô đó. Tiền thưởng vào ví khi cào hết vé; cào xong vé đang cầm mới mua được vé tiếp."));
    const kinds = element("div", "scratch-kinds");
    for (const card of SCRATCH_CARDS) {
      const choice = button(`shop-buy scratch-buy scratch-${card.id}`, "", () => buyScratchCard(card.id));
      choice.dataset.card = card.id;
      choice.append(element("span", "scratch-kind-name", `${card.icon} ${card.name} · ${formatMoney(card.price)}`),
        element("span", "scratch-kind-odds", `Giải cao nhất ${formatMoney(scratchTopPrize(card))} · khoảng 1/${Math.round(1 / scratchWinChance(card))} vé có thưởng`));
      choice.disabled = !canBuyScratch(player, card.id, scratchRules(player));
      kinds.append(choice);
    }
    scratchCard.append(kinds);
    const shownCard = openCard ?? getSettledScratchCard(player);
    if (shownCard && getScratchCard(shownCard.type)) scratchCard.append(scratchBoard(shownCard));
    else if (openCard === null && player.age >= LOTTERY_MIN_AGE) scratchCard.append(element("p", "lottery-empty", "Chọn một loại vé để bắt đầu cào."));

    const owned = element("section", "dialog-card");
    owned.append(element("h3", "", `🧾 Vé đã mua năm nay (${ticketsUsedThisYear(player)}/${MAX_TICKETS_PER_YEAR})`));
    const list = element("ul", "dialog-entries lottery-owned");
    for (const ticket of bought) {
      list.append(element("li", "", ticket.type === "vietlott"
        ? `🎰 Vietlott: ${formatVietlott(ticket.numbers)}`
        : `🎟️ Kiến thiết: ${ticket.number}`));
    }
    const scratchYear = player.scratchYear?.age === player.age ? player.scratchYear : null;
    if (scratchYear?.bought) list.append(element("li", "", `🪙 Vé cào: ${scratchYear.bought} vé · ${scratchYear.won ? `trúng ${formatMoney(scratchYear.won)}` : "chưa trúng"}`));
    if (!bought.length && !scratchYear?.bought) list.append(element("li", "lottery-empty", "Chưa mua vé nào."));
    owned.append(list);

    body.replaceChildren(back, wallet, info, scratchCard, kienThiet, vietlott, owned);
    if (focusSelector) {
      const target = body.querySelector(focusSelector);
      (target && !target.disabled ? target : back).focus({ preventScroll: true });
    }
  }

  $("activity-lottery").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    choices = newChoices();
    picked = new Set();
    render();
    dialog.showModal();
    (body.querySelector(".lottery-kien-thiet:not(:disabled)") ?? body.querySelector("button"))?.focus({ preventScroll: true });
  });
  $("close-lottery").addEventListener("click", () => dialog.close());

   
  const resultDialog = $("lottery-result-dialog");
  const resultBody = $("lottery-result-body");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let waiting = null;

   
  function drawRow(values, className, delayStart = 0) {
    const row = element("div", `lottery-draw ${className}`);
    values.forEach((value, index) => {
      const ball = element("span", "lottery-ball", value);
      ball.style.setProperty("--reveal-delay", `${delayStart + index * 260}ms`);
      row.append(ball);
    });
    return row;
  }
  const prizeBadge = (prize) => element("strong", `lottery-ticket-prize${prize ? " is-win" : ""}`,
    prize ? `+${formatMoney(prize)}` : "Không trúng");

  function kienThietCard(result, delayStart) {
    const card = element("section", "dialog-card lottery-result-card");
    card.append(element("h3", "", "🎟️ Xổ số kiến thiết"),
      element("p", "lottery-result-label", "Giải đặc biệt"),
      drawRow([...result.draw], "is-kien-thiet", delayStart));
    const list = element("ul", "lottery-tickets");
    for (const ticket of result.tickets) {
      const item = element("li", `lottery-ticket${ticket.prize ? " is-win" : ""}`);
      const digits = element("span", "lottery-ticket-numbers");
      [...ticket.number].forEach((digit, index) => {
        digits.append(element("span", `lottery-digit${index >= 6 - ticket.tail ? " is-hit" : ""}`, digit));
      });
      const note = ticket.prize ? (ticket.tail === 6 ? "Trùng cả 6 số" : `Trùng ${ticket.tail} số cuối`) : "";
      item.append(digits, element("span", "lottery-ticket-note", note), prizeBadge(ticket.prize));
      list.append(item);
    }
    card.append(list);
    return card;
  }

  function vietlottCard(result, delayStart, pot) {
    const card = element("section", "dialog-card lottery-result-card");
    card.append(element("h3", "", "🎰 Vietlott Mega 6/45"));
    if (pot) {
      const box = element("div", "lottery-jackpot");
      box.append(element("span", "", "💎 Jackpot kỳ này"), element("strong", "", formatMoney(pot.drawn)));
      card.append(box);
    }
    card.append(
      element("p", "lottery-result-label", "Bộ số mở thưởng"),
      drawRow(result.draw.map((number) => String(number).padStart(2, "0")), "is-vietlott", delayStart));
    const list = element("ul", "lottery-tickets");
    for (const ticket of result.tickets) {
      const item = element("li", `lottery-ticket${ticket.prize ? " is-win" : ""}`);
      const numbers = element("span", "lottery-ticket-numbers");
      for (const number of ticket.numbers) {
        numbers.append(element("span", `lottery-chip${result.draw.includes(number) ? " is-hit" : ""}`,
          String(number).padStart(2, "0")));
      }
      const note = ticket.hits ? `Trùng ${ticket.hits} số${ticket.hits === 6 ? " · Jackpot" : ""}` : "";
      item.append(numbers, element("span", "lottery-ticket-note", note), prizeBadge(ticket.prize));
      list.append(item);
    }
    card.append(list);
    if (pot) {
      const text = pot.outcome === "player"
        ? `Bạn ẵm trọn Jackpot. Kỳ sau quay về ${formatMoney(pot.next)}.`
        : pot.outcome === "other"
          ? `Một người chơi khác đã trúng Jackpot. Kỳ sau quay về ${formatMoney(pot.next)}.`
          : `Không ai trúng Jackpot. Kỳ sau tích lũy lên ${formatMoney(pot.next)}.`;
      card.append(element("p", `lottery-jackpot-next is-${pot.outcome}`, text));
    }
    return card;
  }

  function closeResults() {
    delete state.player.lotteryReveal;
    saveGame(state);
    if (resultDialog.open) resultDialog.close();
  }

  function renderResults(reveal) {
    const nodes = [element("p", "lottery-result-intro",
      `Sinh nhật ${reveal.age} tuổi, các vé mua năm ${reveal.age - 1} tuổi đã có kết quả.`)];
    let delay = 300;
    for (const draw of reveal.draws) {
      if (draw.kienThiet) {
        nodes.push(kienThietCard(draw.kienThiet, delay));
        delay += 6 * 260 + 200;
      }
      if (draw.vietlott) {
        nodes.push(vietlottCard(draw.vietlott, delay, reveal.jackpot));
        delay += 6 * 260 + 200;
      }
    }
    const summary = element("section", `lottery-result-total${reveal.total ? " is-win" : ""}`);
    summary.style.setProperty("--reveal-delay", `${delay}ms`);
    summary.append(element("span", "", reveal.total ? "Tổng tiền thưởng" : "Kết quả"),
      element("strong", "", reveal.total ? `+${formatMoney(reveal.total)}` : "Chưa trúng lần này"),
      element("p", "", reveal.message));
    const done = button("shop-buy lottery-result-confirm", reveal.total ? "💰 Nhận thưởng" : "Hẹn may mắn năm sau", closeResults);
    nodes.push(summary, done);
    resultBody.replaceChildren(...nodes);
    resultDialog.classList.toggle("is-instant", reducedMotion.matches);
    resultDialog.showModal();
    resultDialog.scrollTop = 0;
    done.focus({ preventScroll: true });
  }

   
  function showResults() {
    clearTimeout(waiting);
    if (isSavePaused()) return;
    const reveal = state.player.lotteryReveal;
    if (!reveal) return;
    if (state.player.isAlive === false || !reveal.draws?.length) {
      closeResults();
      return;
    }
    if (resultDialog.open) return;
    if (state.pendingEvent || document.querySelector("dialog[open]")) {
      waiting = setTimeout(showResults, 400);
      return;
    }
    renderResults(reveal);
  }
  resultDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeResults();
  });

  return { showResults };
}
