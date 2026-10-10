import { formatMoney, formatMoneyAmount } from "./money-format.js";

// Mua vé số (từ 18 tuổi): vé 10.000 VNĐ, tối đa 10 vé mỗi năm cho cả hai loại.
// Mỗi loại chỉ quay một kết quả cho cả năm; kết quả được tạo khi mua vé đầu tiên và
// lưu cùng vé để tải lại trang không đổi. Nhấn + Tuổi mới dò vé, cộng thưởng vào ví.
export const LOTTERY_MIN_AGE = 18;
export const TICKET_PRICE = 10_000;
export const MAX_TICKETS_PER_YEAR = 10;
export const VIETLOTT_MAX = 45;
export const VIETLOTT_PICKS = 6;
export const VIETLOTT_JACKPOT = 12_000_000_000;
const KIEN_THIET_CHOICES = 6;

// Vé kiến thiết: so các chữ số cuối, đúng thứ tự; mỗi vé chỉ nhận giải cao nhất.
export const kienThietPrizes = [
  { digits: 6, prize: 2_000_000_000 },
  { digits: 5, prize: 30_000_000 },
  { digits: 4, prize: 1_000_000 },
  { digits: 3, prize: 200_000 },
  { digits: 2, prize: 100_000 },
];
// Vietlott Mega 6/45: số lượng số trùng, không cần đúng thứ tự.
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
// Dùng dấu cách để số không bị tô màu như số tăng/giảm trong nhật ký.
export const formatVietlott = (numbers) => numbers.map((number) => String(number).padStart(2, "0")).join(" ");

export function kienThietResult(ticket, draw) {
  let tail = 0;
  while (tail < 6 && ticket[5 - tail] === draw[5 - tail]) tail++;
  return { tail, prize: kienThietPrizes.find((tier) => tail >= tier.digits)?.prize ?? 0 };
}
export function vietlottResult(numbers, draw) {
  const hits = numbers.filter((number) => draw.includes(number)).length;
  return { hits, prize: vietlottPrizes.find((tier) => hits === tier.hits)?.prize ?? 0 };
}

export const ticketsThisYear = (player) => (player.lotteryTickets ?? []).filter((ticket) => ticket.age === player.age);

const isValidTicket = (ticket) => ticket.type === "kien-thiet"
  ? /^\d{6}$/.test(ticket.number)
  : ticket.type === "vietlott" && ticket.numbers?.length === VIETLOTT_PICKS &&
    new Set(ticket.numbers).size === VIETLOTT_PICKS &&
    ticket.numbers.every((number) => Number.isInteger(number) && number >= 1 && number <= VIETLOTT_MAX);

export function canBuyTicket(player) {
  return player.isAlive !== false && player.age >= LOTTERY_MIN_AGE && player.money >= TICKET_PRICE &&
    ticketsThisYear(player).length < MAX_TICKETS_PER_YEAR;
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

// Gọi mỗi lần sang tuổi mới: dò các vé mua ở năm trước, cộng thưởng và xóa vé đã dò.
export function collectLotteryYear(player, age) {
  const due = (player.lotteryTickets ?? []).filter((ticket) => ticket.age < age);
  if (!due.length) return null;
  const lines = [];
  let total = 0;
  for (const boughtAge of [...new Set(due.map((ticket) => ticket.age))]) {
    const draw = player.lotteryDraws?.[boughtAge] ?? { kienThiet: randomKienThiet(), vietlott: randomVietlott() };
    const tickets = due.filter((ticket) => ticket.age === boughtAge);
    const kienThiet = tickets.filter((ticket) => ticket.type === "kien-thiet");
    if (kienThiet.length) {
      lines.push(`🎟️ Xổ số kiến thiết mở thưởng số ${draw.kienThiet}.`);
      let misses = 0;
      for (const ticket of kienThiet) {
        const { tail, prize } = kienThietResult(ticket.number, draw.kienThiet);
        if (!prize) { misses++; continue; }
        total += prize;
        lines.push(`• Vé ${ticket.number} trùng ${tail === 6 ? "cả 6 số" : `${tail} số cuối`}: +${formatMoneyAmount(prize)} VNĐ.`);
      }
      if (misses) lines.push(`• ${misses} vé kiến thiết không trúng.`);
    }
    const vietlott = tickets.filter((ticket) => ticket.type === "vietlott");
    if (vietlott.length) {
      lines.push(`🎰 Vietlott Mega 6/45 mở thưởng: ${formatVietlott(draw.vietlott)}.`);
      let misses = 0;
      for (const ticket of vietlott) {
        const { hits, prize } = vietlottResult(ticket.numbers, draw.vietlott);
        if (!prize) { misses++; continue; }
        total += prize;
        lines.push(`• Vé ${formatVietlott(ticket.numbers)} trùng ${hits} số${hits === 6 ? " (JACKPOT)" : ""}: +${formatMoneyAmount(prize)} VNĐ.`);
      }
      if (misses) lines.push(`• ${misses} vé Vietlott không trúng.`);
    }
  }
  player.money += total;
  player.lotteryTickets = (player.lotteryTickets ?? []).filter((ticket) => ticket.age >= age);
  player.lotteryDraws = Object.fromEntries(Object.entries(player.lotteryDraws ?? {}).filter(([key]) => Number(key) >= age));
  lines.push(luckyLine(total));
  return { amount: total, content: lines.join("\n") };
}

// Mọi vé mua trong cùng một năm ghi chung một dòng nhật ký, liệt kê số vé.
function setPurchaseLogText(log) {
  const { kienThiet, vietlott } = log.lotteryPurchase;
  const count = kienThiet.length + vietlott.length;
  const lines = [`🎟️ Mua ${count} vé số: Tiền -${formatMoneyAmount(count * TICKET_PRICE)} VNĐ.`];
  if (kienThiet.length) lines.push(`• Kiến thiết: ${kienThiet.join(", ")}`);
  if (vietlott.length) lines.push(`• Vietlott: ${vietlott.map(formatVietlott).join("; ")}`);
  log.content = log.summary = lines.join("\n");
}

// Bản lưu cũ ghi mỗi vé một dòng: gộp các dòng cùng tuổi vào dòng đầu tiên.
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
    localStorage.setItem("lifeAgainSave", JSON.stringify(state));
    renderMoney();
    isNew ? renderLogEntry(log) : updateLogEntry(log);
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
      : `Giá ${formatMoney(TICKET_PRICE)}/vé · Đã mua ${bought.length}/${MAX_TICKETS_PER_YEAR} vé năm nay. ` +
        "Nhấn + Tuổi để quay thưởng; tiền thưởng tự cộng vào ví.");

    // Vé số kiến thiết: chọn một vé trong dãy số ngẫu nhiên.
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

    // Vietlott Mega 6/45: chọn 6 số khác nhau từ 01 đến 45.
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
    vietlott.append(element("h3", "", "🎰 Vietlott Mega 6/45"),
      element("p", "side-job-intro", "Chọn 6 số khác nhau từ 01 đến 45, không cần đúng thứ tự."),
      grid, tools, status, buyVietlott, prizeTable([
        ["Trùng 3 số", formatMoney(30_000)],
        ["Trùng 4 số", formatMoney(300_000)],
        ["Trùng 5 số", formatMoney(10_000_000)],
        ["Trùng 6 số (Jackpot)", formatMoney(VIETLOTT_JACKPOT)],
      ]));
    update();

    const owned = element("section", "dialog-card");
    owned.append(element("h3", "", `🧾 Vé đã mua năm nay (${bought.length}/${MAX_TICKETS_PER_YEAR})`));
    const list = element("ul", "dialog-entries lottery-owned");
    for (const ticket of bought) {
      list.append(element("li", "", ticket.type === "vietlott"
        ? `🎰 Vietlott: ${formatVietlott(ticket.numbers)}`
        : `🎟️ Kiến thiết: ${ticket.number}`));
    }
    if (!bought.length) list.append(element("li", "lottery-empty", "Chưa mua vé nào."));
    owned.append(list);

    body.replaceChildren(back, wallet, info, kienThiet, vietlott, owned);
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
}
