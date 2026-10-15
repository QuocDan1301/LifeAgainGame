import { recordGamblingLoss } from '../achievements/achievement-progress.js';
import { saveGame, isSavePaused } from "../core/save-store.js";
import { formatMoney, formatMoneyAmount } from "../core/money-format.js";
import { askConfirm } from "../ui/confirm-dialog.js";
import { describeAges } from "./shop.js";
import { hasActiveTienLen, initTienLen } from "./tien-len.js";
import { initAuction } from "./auction.js";

 
 
 
 
export const GAMES_MIN_AGE = 18;
export const GAMES_PER_YEAR = 5;
export const BET_MIN = 10_000;
export const BET_MAX = 1_000_000_000;
export const QUICK_BETS = [10_000, 100_000, 1_000_000];

export const games = [
  { id: "auction", icon: "🏺", name: "Đấu giá cổ vật", tagline: "Nhìn dấu vết, trả đúng giá" },
  { id: "coin", icon: "🪙", name: "Sấp ngửa", tagline: "Một lần tung, hai số phận" },
  { id: "dice", icon: "🎲", name: "Đoán xúc xắc", tagline: "Con số định mệnh" },
  { id: "box", icon: "🎁", name: "Hộp bí ẩn", tagline: "Mở hộp hay mở nỗi buồn?" },
  { id: "tower", icon: "🪜", name: "Leo tháp tài lộc", tagline: "Dừng đúng lúc" },
  { id: "blackjack", icon: "🃏", name: "Xì dách", tagline: "Thêm lá nữa hay thôi?" },
   
  { id: "tienlen", icon: "♠️", name: "Tiến lên miền Nam", tagline: "Ai hết bài trước, người đó ăn cả bàn!" },
];

export const COIN_MULTIPLIER = 1.9;
export const DICE_MULTIPLIERS = { parity: 1.9, number: 5.7 };
export const boxTypes = [
  { id: "normal", icon: "📦", name: "Hộp thường", price: 50_000 },
  { id: "fancy", icon: "🎀", name: "Hộp sang", price: 500_000 },
  { id: "rich", icon: "💎", name: "Hộp đại gia", price: 5_000_000 },
];
 
export const boxTiers = [
  { multiplier: 0, id: "miss", name: "Hụt" },
  { multiplier: 0.5, id: "common", name: "Thường" },
  { multiplier: 1, id: "fair", name: "Khá" },
  { multiplier: 3, id: "rare", name: "Hiếm" },
  { multiplier: 15, id: "epic", name: "Quý hiếm" },
  { multiplier: 25, id: "legend", name: "Huyền thoại" },
];
export const getBoxTier = (multiplier) => boxTiers.find((tier) => tier.multiplier === multiplier) ?? boxTiers[0];
 
export const boxPrizes = [
  { icon: "🧦", label: "Đôi tất lạc chiếc", chance: 0.14, multiplier: 0 },
  { icon: "🔑", label: "Chìa khóa không biết mở gì", chance: 0.1, multiplier: 0 },
  { icon: "🧸", label: "Gấu bông sứt chỉ", chance: 0.08, multiplier: 0 },
  { icon: "🪀", label: "Con quay đứt dây", chance: 0.08, multiplier: 0 },
  { icon: "🪙", label: "Phong bì nhỏ", chance: 0.14, multiplier: 0.5 },
  { icon: "🕯️", label: "Nến thơm làm tay", chance: 0.08, multiplier: 0.5 },
  { icon: "☕", label: "Cốc sứ in hình mèo", chance: 0.08, multiplier: 0.5 },
  { icon: "💵", label: "Phong bì vừa", chance: 0.08, multiplier: 1 },
  { icon: "🎧", label: "Tai nghe còn nguyên hộp", chance: 0.06, multiplier: 1 },
  { icon: "⌚", label: "Đồng hồ đeo tay cổ điển", chance: 0.06, multiplier: 1 },
  { icon: "💰", label: "Túi tiền", chance: 0.04, multiplier: 3 },
  { icon: "🏺", label: "Bình gốm trang trí", chance: 0.021, multiplier: 3 },
  { icon: "🎻", label: "Cây vĩ cầm mini", chance: 0.02, multiplier: 3 },
  { icon: "💎", label: "Viên đá quý", chance: 0.012, multiplier: 15 },
  { icon: "👑", label: "Vương miện mạ vàng", chance: 0.005, multiplier: 15 },
  { icon: "🌟", label: "Ngôi sao may mắn", chance: 0.002, multiplier: 25 },
];
export const TOWER_MULTIPLIERS = [1.9, 3.8, 7.6, 15.2, 30.4];
export const BLACKJACK_PAYOUTS = { lose: 0, draw: 1, normal: 2, five: 2, blackjack: 2.5, doubleAce: 3 };

const pickWeighted = (entries, random) => {
  let roll = random();
  for (let index = 0; index < entries.length; index += 1) {
    roll -= entries[index].chance;
    if (roll < 0) return index;
  }
  return entries.length - 1;
};
export const payout = (bet, multiplier) => Math.floor(bet * multiplier);

 
export function createDeck(random = Math.random) {
  const deck = [];
  for (const suit of ["♠", "♥", "♦", "♣"]) for (let rank = 1; rank <= 13; rank += 1) deck.push({ rank, suit });
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}
export function handPoints(cards) {
  let sum = 0;
  let hasAce = false;
  for (const card of cards) {
    sum += card.rank === 1 ? 1 : Math.min(10, card.rank);
    if (card.rank === 1) hasAce = true;
  }
   
  return hasAce && sum + 10 <= 21 ? sum + 10 : sum;
}
export function handType(cards) {
  if (cards.length === 2 && cards.every((card) => card.rank === 1)) return "doubleAce";
  if (cards.length === 2 && cards.some((card) => card.rank === 1) && cards.some((card) => card.rank >= 10)) return "blackjack";
  if (handPoints(cards) > 21) return "bust";
  if (cards.length === 5) return "five";
  return "normal";
}
const typeRank = { doubleAce: 4, blackjack: 3, five: 2, normal: 1 };
 
export function compareHands(player, dealer) {
  const own = handType(player);
  const other = handType(dealer);
  if (own === "bust") return "lose";
  if (other === "bust") return own;
  if (typeRank[own] !== typeRank[other]) return typeRank[own] > typeRank[other] ? own : "lose";
  if (own === "doubleAce" || own === "blackjack") return "draw";
  const a = handPoints(player);
  const b = handPoints(dealer);
  if (a === b) return "draw";
   
  return (own === "five" ? a < b : a > b) ? own : "lose";
}
export const isNaturalHand = (cards) => ["doubleAce", "blackjack"].includes(handType(cards));
export const canPlayerHit = (cards) => cards.length < 5 && handPoints(cards) < 21;
export const canPlayerStand = (cards) => handPoints(cards) >= 16;
export function playDealer(data) {
  while (handPoints(data.dealer) < 17 && data.dealer.length < 5) data.dealer.push(data.deck[data.next++]);
}

 
export function createRound(gameId, bet, choice, random = Math.random) {
  const round = { game: gameId, bet, choice };
  if (gameId === "coin") {
    round.result = random() < 0.5 ? "heads" : "tails";
    round.payout = round.result === choice ? payout(bet, COIN_MULTIPLIER) : 0;
  } else if (gameId === "dice") {
    round.roll = 1 + Math.floor(random() * 6);
    const win = choice.mode === "parity"
      ? (round.roll % 2 === 0 ? "even" : "odd") === choice.value
      : round.roll === choice.value;
    round.payout = win ? payout(bet, DICE_MULTIPLIERS[choice.mode]) : 0;
  } else if (gameId === "box") {
    round.prize = pickWeighted(boxPrizes, random);
    round.payout = payout(bet, boxPrizes[round.prize].multiplier);
  } else if (gameId === "tower") {
     
    round.safeDoors = Array.from({ length: TOWER_MULTIPLIERS.length }, () => (random() < 0.5 ? 0 : 1));
    round.floor = 0;
    round.phase = "choose";
  } else if (gameId === "blackjack") {
    const deck = createDeck(random);
    round.deck = deck;
    round.player = [deck[0], deck[2]];
    round.dealer = [deck[1], deck[3]];
    round.next = 4;
    round.phase = "player";
  }
  return round;
}

 
export function initGames(state, { renderMoney, renderLogEntry, checkAchievements = () => {} }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("games-dialog");
  const body = $("games-body");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const time = (ms) => (reducedMotion.matches ? 1 : ms);
  let reveal = null;

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
   
  const COIN_FACES = { heads: { symbol: "☀\uFE0E", label: "NGỬA", name: "Ngửa" }, tails: { symbol: "☾\uFE0E", label: "SẤP", name: "Sấp" } };
  const coinFace = (side, className) => {
    const face = element("span", `${className} is-${side}`);
    face.setAttribute("aria-hidden", "true");
    face.append(element("span", "coin-symbol", COIN_FACES[side].symbol), element("span", "coin-label", COIN_FACES[side].label));
    return face;
  };
  const save = () => saveGame(state);
  const gameOf = (id) => games.find((game) => game.id === id);
  const playsUsed = () => (state.player.gamePlays?.age === state.player.age ? state.player.gamePlays.count : 0);
  const playsLeft = () => Math.max(0, GAMES_PER_YEAR - playsUsed());
  const focusFirst = () => (body.querySelector(".game-primary:not(:disabled), .shop-group:not(:disabled)")
    ?? body.querySelector("button:not(:disabled)"))?.focus({ preventScroll: true });
  const walletText = (offset = 0) => `Ví hiện có: ${formatMoney(state.player.money - offset)} · Còn ${playsLeft()}/${GAMES_PER_YEAR} lượt năm nay`;
  const tienLen = initTienLen(state, {
    dialog, body, minAge: GAMES_MIN_AGE, playsLeft, renderMoney, renderLogEntry, checkAchievements,
    usePlay: () => { state.player.gamePlays = { age: state.player.age, count: playsUsed() + 1 }; },
    onExit: () => {
      renderPicker();
      focusFirst();
    },
  });

  const auction = initAuction(state, {
    body, minAge: GAMES_MIN_AGE, playsLeft, renderMoney, renderLogEntry,
    usePlay: () => { state.player.gamePlays = { age: state.player.age, count: playsUsed() + 1 }; },
    onExit: renderPicker,
  });

   
  function settle(round, payoutAmount, detail) {
    if (isSavePaused() || state.player.isAlive === false || round.settled ||
        !Number.isFinite(payoutAmount) || payoutAmount < 0) return false;
    if (['tower', 'blackjack'].includes(round.game) && state.player.gameRound !== round) return false;
    round.settled = true;
    const game = gameOf(round.game);
    state.player.money += payoutAmount;
    state.player.gameRound = null;
    round.finalPayout = payoutAmount;
    recordGamblingLoss(state.player, round, round.bet, payoutAmount);
    const net = payoutAmount - round.bet;
    const content = `${game.icon} ${game.name}: ${detail}. Cược ${formatMoneyAmount(round.bet)} VNĐ, nhận về ${formatMoneyAmount(payoutAmount)} VNĐ. ` +
      `Tiền ${net >= 0 ? "+" : "-"}${formatMoneyAmount(Math.abs(net))} VNĐ.`;
    const log = { age: state.player.age, content, summary: content };
    state.logs.push(log);
    save();
    reveal = { log, payout: payoutAmount };
    return true;
  }
  function flushReveal() {
    if (!reveal) return;
    const { log } = reveal;
    reveal = null;
    renderMoney();
    renderLogEntry(log);
    checkAchievements();
  }

  function startRound(gameId, bet, choice) {
    if (state.player.age < GAMES_MIN_AGE || !playsLeft() || bet > state.player.money || bet < 1) return null;
    state.player.money -= bet;
    state.player.gamePlays = { age: state.player.age, count: playsUsed() + 1 };
    const round = { ...createRound(gameId, bet, choice), startedAtAge: state.player.age };
    if (["tower", "blackjack"].includes(gameId)) {
      state.player.gameRound = round;
      save();
      renderMoney();
    }
    return round;
  }

   
  function renderPicker() {
    flushReveal();
    const back = button("shop-back", "← Quay lại Hoạt động", () => {
      dialog.close();
      $("activities-dialog").showModal();
    });
    body.replaceChildren(back, element("p", "shop-wallet", walletText()),
      element("p", "game-motto", "May thì giàu, còn chắc chắn thì không!"));
    const blocked = state.player.age < GAMES_MIN_AGE
      ? `🔞 Bạn cần đủ ${GAMES_MIN_AGE} tuổi mới được chơi. Còn ${GAMES_MIN_AGE - state.player.age} năm nữa nhé!`
      : !playsLeft() ? `⏳ Bạn đã chơi đủ ${GAMES_PER_YEAR} lượt năm nay. Sang năm quay lại nhé!` : "";
    if (blocked) body.append(element("p", "license-age-note", blocked));
    const list = element("div", "shop-groups");
    for (const game of games) {
      const choice = button("shop-group game-pick", `${game.icon} ${game.name}`,
        () => (game.id === "auction" ? auction.open() : game.id === "tienlen" ? tienLen.open() : renderSetup(game.id)));
      choice.dataset.game = game.id;
      choice.disabled = Boolean(blocked) && !(game.id === "auction" && state.player.auction && state.player.age >= GAMES_MIN_AGE);
      choice.append(element("span", "side-job-note", `“${game.tagline}”`));
      list.append(choice);
    }
    body.append(list);
  }

   
  function renderSetup(gameId, previous = {}) {
    flushReveal();
    const game = gameOf(gameId);
    const card = element("section", "dialog-card game-setup");
    card.dataset.game = gameId;
    card.append(element("h3", "", `${game.icon} ${game.name}`), element("p", "game-tagline", `“${game.tagline}”`));
    let choice = previous.choice ?? null;
    let bet = previous.bet ?? QUICK_BETS[0];
    const summary = element("p", "game-summary");
    const start = button("shop-buy game-primary game-start", "▶️ Xác nhận chơi", () => {
      if (!valid()) return;
      const round = startRound(gameId, gameId === "box" ? boxTypes.find((box) => box.id === choice).price : bet, choice);
      if (round) renderPlay(round);
    });

    const optionGroup = (items, onPick, selected) => {
      const group = element("div", "game-options");
      for (const item of items) {
        const option = button("game-option", item.label, () => {
          onPick(item.value);
          group.querySelectorAll(".game-option").forEach((node) => node.setAttribute("aria-pressed", String(node === option)));
          update();
        });
        option.dataset.value = String(item.value);
        option.setAttribute("aria-pressed", String(item.value === selected));
        if (item.note) option.append(element("small", "", item.note));
        group.append(option);
      }
      return group;
    };

     
    let maxMultiplier = () => 0;
    if (gameId === "coin") {
      card.classList.add("game-setup-coin");
      const faces = optionGroup([{ label: "Ngửa", value: "heads" }, { label: "Sấp", value: "tails" }], (value) => { choice = value; }, choice);
      faces.classList.add("coin-faces");
      faces.querySelectorAll(".game-option").forEach((option) => {
        option.classList.add("coin-pick");
        option.prepend(coinFace(option.dataset.value, "coin-mini"));
      });
      card.append(element("p", "game-hint", `Chọn mặt đồng xu. Đoán đúng nhận về ×${String(COIN_MULTIPLIER).replace(".", ",")} tiền cược.`), faces);
      maxMultiplier = () => COIN_MULTIPLIER;
    } else if (gameId === "dice") {
      card.classList.add("game-setup-dice");
      let mode = choice?.mode ?? null;
      const values = element("div", "game-dice-values");
      const renderValues = () => {
        if (mode === "parity") {
          const group = optionGroup([{ label: "Chẵn", value: "even" }, { label: "Lẻ", value: "odd" }], (value) => { choice = { mode, value }; }, choice?.value);
          group.classList.add("dice-parity");
          group.querySelectorAll(".game-option").forEach((option) => {
            const faces = element("span", "dice-parity-faces");
            faces.append(...(option.dataset.value === "even" ? [2, 4, 6] : [1, 3, 5]).map((value) => dieFace(value, "die-mini")));
            option.prepend(faces);
            option.setAttribute("aria-label", option.dataset.value === "even" ? "Chẵn: 2, 4, 6" : "Lẻ: 1, 3, 5");
          });
          values.replaceChildren(group);
        } else if (mode === "number") {
          const group = optionGroup([1, 2, 3, 4, 5, 6].map((value) => ({ label: String(value), value })), (value) => { choice = { mode, value }; }, choice?.value);
          group.classList.add("dice-numbers");
          group.querySelectorAll(".game-option").forEach((option) => {
            option.prepend(dieFace(Number(option.dataset.value), "die-mini"));
            option.setAttribute("aria-label", `Số ${option.dataset.value}`);
          });
          values.replaceChildren(group);
        } else values.replaceChildren(element("p", "game-hint", "Chọn một chế độ ở trên."));
      };
      const modes = optionGroup([{ label: "Chẵn hoặc lẻ", value: "parity", note: `Đoán đúng nhận về ${formatMultiplier(DICE_MULTIPLIERS.parity)}` },
        { label: "Đúng một số", value: "number", note: `Đoán đúng nhận về ${formatMultiplier(DICE_MULTIPLIERS.number)}` }], (value) => {
        mode = value;
        choice = null;
        renderValues();
      }, mode);
      modes.classList.add("dice-modes");
      card.append(element("p", "game-hint", "Chọn chế độ (mỗi lượt chỉ một lựa chọn):"), modes, values);
      renderValues();
      maxMultiplier = () => (choice ? DICE_MULTIPLIERS[choice.mode] : 0);
    } else if (gameId === "box") {
      card.classList.add("game-setup-box");
      const boxes = optionGroup(boxTypes.map((box) => ({ label: box.name, value: box.id, note: formatMoney(box.price) })), (value) => { choice = value; }, choice);
      boxes.classList.add("box-picks");
      boxes.querySelectorAll(".game-option").forEach((option) => {
        option.classList.add("box-pick");
        option.prepend(element("span", "box-pick-icon", boxTypes.find((box) => box.id === option.dataset.value).icon));
      });
      card.append(element("p", "game-hint", "Chọn loại hộp. Giá trị vật phẩm tính theo giá hộp:"), boxes,
        element("p", "game-hint", "Bên trong có thể là:"), prizeList(boxPrizes));
      maxMultiplier = () => Math.max(...boxPrizes.map((prize) => prize.multiplier));
    } else if (gameId === "tower") {
      const table = element("ul", "dialog-entries game-table");
      TOWER_MULTIPLIERS.forEach((multiplier, index) => {
        const row = element("li");
        row.append(element("span", "", `Vượt tầng ${index + 1}`), element("strong", "", `×${String(multiplier).replace(".", ",")}`));
        table.append(row);
      });
      card.append(element("p", "game-hint", "Mỗi tầng có hai cánh cửa: một cửa đi tiếp, một cửa mất trắng. Qua mỗi tầng bạn có thể dừng để nhận tiền."), table);
      maxMultiplier = () => TOWER_MULTIPLIERS.at(-1);
      choice = "climb";
    } else if (gameId === "blackjack") {
      card.append(element("p", "game-hint",
        "Đấu với nhà cái. Dưới 16 điểm chưa được dừng; tối đa 5 lá. Thắng thường ×2 · Ngũ linh ×2 · Xì dách ×2,5 · Xì bàn ×3 · Hòa hoàn vốn."));
      maxMultiplier = () => BLACKJACK_PAYOUTS.doubleAce;
      choice = "deal";
    }

     
    const betInput = element("input", "game-bet-input");
    if (gameId !== "box") {
      const quick = element("div", "game-options game-quick-bets");
      for (const amount of QUICK_BETS) {
        const option = button("game-option", formatMoney(amount), () => {
          bet = amount;
          betInput.value = String(amount);
          update();
        });
        option.dataset.bet = String(amount);
        quick.append(option);
      }
       
      const allIn = button("game-option game-all-in", "💥 All in", () => {
        bet = allInBet();
        betInput.value = String(bet);
        update();
      });
      allIn.dataset.bet = "all";
      quick.append(allIn);
      Object.assign(betInput, { type: "number", min: String(BET_MIN), step: "1000", value: String(bet), inputMode: "numeric" });
      betInput.setAttribute("aria-label", "Số tiền cược (VNĐ)");
      betInput.addEventListener("input", () => {
        bet = Math.floor(Number(betInput.value) || 0);
        update();
      });
      card.append(element("p", "game-hint", "Tiền cược:"), quick, betInput);
    }

    const allInBet = () => Math.min(Math.floor(state.player.money), BET_MAX);
    const currentBet = () => (gameId === "box" ? boxTypes.find((box) => box.id === choice)?.price ?? 0 : bet);
    function valid() {
      const amount = currentBet();
      return Boolean(choice) && amount >= (gameId === "box" ? 1 : BET_MIN) && amount <= BET_MAX &&
        amount <= state.player.money && playsLeft() > 0 && state.player.age >= GAMES_MIN_AGE;
    }
    function update() {
      const amount = currentBet();
      body.querySelectorAll(".game-quick-bets .game-option").forEach((node) =>
        node.setAttribute("aria-pressed", String(node.dataset.bet === "all" ? bet === allInBet() : Number(node.dataset.bet) === bet)));
      const allInButton = body.querySelector(".game-all-in");
      if (allInButton) allInButton.disabled = allInBet() < BET_MIN;
      const most = payout(amount, maxMultiplier());
      const partial = ["box", "tower", "blackjack"].includes(gameId) ? "tối đa " : "";
      summary.textContent = !choice ? "Hãy chọn một lựa chọn để xem tiền có thể nhận."
        : amount > state.player.money ? `Không đủ tiền: cần ${formatMoney(amount)}.`
          : gameId !== "box" && (amount < BET_MIN || amount > BET_MAX)
            ? `Tiền cược từ ${formatMoney(BET_MIN)} đến ${formatMoney(BET_MAX)}.`
            : `Tiền cược: ${formatMoney(amount)} · Có thể nhận ${partial}${formatMoney(most)}`;
      start.disabled = !valid();
    }
    card.append(summary, start);
    body.replaceChildren(button("shop-back", "← Chọn trò khác", renderPicker), element("p", "shop-wallet", walletText()), card);
    update();
    focusFirst();
  }

   
  function renderResult(round, win, title, quote) {
    flushReveal();
    const card = element("section", `dialog-card game-result ${win ? "is-win" : "is-lose"}`);
    const amount = round.finalPayout ?? 0;
    const net = amount - round.bet;
    const summary = round.game === "box"
      ? `Giá hộp ${formatMoney(round.bet)} · Vật phẩm trị giá ${formatMoney(round.payout)} · Đã cất vào Tài sản, có thể bán bất cứ lúc nào.`
      : `Cược ${formatMoney(round.bet)} · Nhận về ${formatMoney(amount)} (${net >= 0 ? "+" : "-"}${formatMoney(Math.abs(net))})`;
    card.append(element("h3", "", title));
    if (round.game !== "box") {
      card.append(element("p", `game-net ${net >= 0 ? "is-gain" : "is-loss"}`, `${net >= 0 ? "+" : "−"}${formatMoney(Math.abs(net))}`));
    }
    card.append(element("p", "game-quote", `“${quote}”`), element("p", "game-summary", summary));
    const actions = element("div", "license-actions");
    const again = button("shop-buy game-primary", "🔁 Chơi lại", () => renderSetup(round.game, { choice: round.choice, bet: round.bet }));
    again.disabled = !playsLeft();
    if (!playsLeft()) again.textContent = "⏳ Hết lượt năm nay";
    actions.append(again, button("shop-back", "🎮 Chọn trò khác", renderPicker));
    card.append(actions);
    return card;
  }
  const showResult = (stage, round, win, title, quote) => {
    flushReveal();
    if (!stage.isConnected) return;
    body.querySelector(".shop-wallet").textContent = walletText();
    stage.after(renderResult(round, win, title, quote));
    focusFirst();
  };

   
   
  const PIPS = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [1, 3], [3, 1], [3, 3]],
    5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]], 6: [[1, 1], [2, 1], [3, 1], [1, 3], [2, 3], [3, 3]] };
  const dieFace = (value, className = "die-face") => {
    const face = element("span", `${className} is-${value}`);
    face.setAttribute("aria-hidden", "true");
    for (const [row, column] of PIPS[value]) {
      const pip = element("span", "die-pip");
      pip.style.gridArea = `${row} / ${column}`;
      face.append(pip);
    }
    return face;
  };
  const formatMultiplier = (value) => `×${String(value).replace(".", ",")}`;

  function renderPlay(round) {
    const game = gameOf(round.game);
    const stage = element("section", `dialog-card game-stage game-stage-${round.game}`);
    stage.append(element("h3", "", `${game.icon} ${game.name}`));
    const instant = !["tower", "blackjack"].includes(round.game);
    if (round.game === "box") storeBoxItem(round);
    if (instant) settle(round, round.game === "box" ? 0 : round.payout, describeInstant(round));
    body.replaceChildren(element("p", "shop-wallet", walletText(instant ? reveal?.payout ?? 0 : 0)), stage);
    ({ coin: playCoin, dice: playDice, box: playBox, tower: playTower, blackjack: playBlackjack })[round.game](stage, round);
  }

  function describeInstant(round) {
    if (round.game === "coin") return `chọn ${round.choice === "heads" ? "Ngửa" : "Sấp"}, ra ${round.result === "heads" ? "Ngửa" : "Sấp"}`;
    if (round.game === "dice") return `chọn ${round.choice.mode === "parity" ? (round.choice.value === "even" ? "Chẵn" : "Lẻ") : `số ${round.choice.value}`}, ra ${round.roll}`;
    if (round.game === "box") {
      const prize = boxPrizes[round.prize];
      return `${boxTypes.find((box) => box.id === round.choice).name} có ${prize.icon} ${prize.label} ` +
        `(trị giá ${formatMoneyAmount(round.payout)} VNĐ, đã cất vào Tài sản)`;
    }
  }

  function playCoin(stage, round) {
    const table = element("div", "coin-table");
    const pickChip = element("p", "coin-pick-chip", `Bạn chọn ${COIN_FACES[round.choice].name} · Cược ${formatMoney(round.bet)}`);
    const wrap = element("div", "game-coin-wrap");
    const coin = element("div", "game-coin");
    coin.append(coinFace("heads", "game-coin-face"), coinFace("tails", "game-coin-face"));
    const shadow = element("div", "coin-shadow");
    wrap.append(coin, shadow);
    const live = element("p", "game-hint game-live", "Đồng xu đang xoay…");
    table.append(pickChip, wrap, live);
    stage.append(table);
    const turns = 6 + (round.result === "tails" ? 0.5 : 0);
    const timing = { duration: time(1700), easing: "cubic-bezier(0.3, 0.7, 0.4, 1)", fill: "forwards" };
    shadow.animate([
      { transform: "scale(1)", opacity: 0.55 },
      { transform: "scale(0.45)", opacity: 0.2, offset: 0.5 },
      { transform: "scale(1)", opacity: 0.55 },
    ], timing);
    coin.animate([
      { transform: "translateY(0) rotateY(0deg)" },
      { transform: `translateY(-90px) rotateY(${turns * 180}deg)`, offset: 0.5 },
      { transform: `translateY(0) rotateY(${turns * 360}deg)` },
    ], timing).finished.then(() => {
      const win = round.payout > 0;
      table.classList.add("is-landed", win ? "is-win" : "is-lose");
      live.textContent = `Kết quả: ${COIN_FACES[round.result].name}${win ? " · Đoán đúng!" : " · Đoán sai"}`;
      showResult(stage, round, win, win ? "🎉 Đoán đúng!" : "😢 Đoán sai",
        win ? "Đồng xu đứng về phía tôi. Mong tháng này hóa đơn cũng vậy!"
          : `Tôi chọn ${round.choice === "heads" ? "ngửa" : "sấp"}. Ví tôi chọn ${round.choice === "heads" ? "sấp" : "ngửa"}.`);
    });
  }

   
  const DIE_ORIENTATION = { 1: [0, 0], 2: [-90, 0], 3: [0, -90], 4: [0, 90], 5: [90, 0], 6: [0, 180] };
  function playDice(stage, round) {
    const table = element("div", "dice-table");
    const pick = round.choice.mode === "parity" ? (round.choice.value === "even" ? "Chẵn" : "Lẻ") : `Số ${round.choice.value}`;
    const scene = element("div", "dice-scene");
    const bounce = element("div", "dice-bounce");
    const cube = element("div", "dice-cube");
    for (const value of [1, 2, 3, 4, 5, 6]) cube.append(dieFace(value, `die-face dice-side side-${value}`));
    const tilt = element("div", "dice-tilt");
    tilt.append(cube);
    bounce.append(tilt);
    const shadow = element("div", "dice-shadow");
    scene.append(bounce, shadow);
    const live = element("p", "game-hint game-live", "Xúc xắc đang lăn…");
    table.append(element("p", "dice-pick-chip", `Bạn chọn ${pick} · Cược ${formatMoney(round.bet)}`), scene, live);
    stage.append(table);
    const [x, y] = DIE_ORIENTATION[round.roll];
    const duration = time(1600);
    bounce.animate([
      { transform: "translateY(0)" }, { transform: "translateY(-78px)", offset: 0.3 }, { transform: "translateY(0)", offset: 0.62 },
      { transform: "translateY(-22px)", offset: 0.8 }, { transform: "translateY(0)" },
    ], { duration, easing: "ease-in-out", fill: "forwards" });
    shadow.animate([
      { transform: "scale(1)", opacity: 0.5 }, { transform: "scale(0.5)", opacity: 0.2, offset: 0.3 }, { transform: "scale(1)", opacity: 0.5, offset: 0.62 },
      { transform: "scale(0.85)", opacity: 0.4, offset: 0.8 }, { transform: "scale(1)", opacity: 0.5 },
    ], { duration, easing: "ease-in-out", fill: "forwards" });
    cube.animate([
      { transform: "rotateX(0deg) rotateY(0deg)" },
      { transform: `rotateX(${x + 720}deg) rotateY(${y + 720}deg)` },
    ], { duration, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)", fill: "forwards" }).finished.then(() => {
      const win = round.payout > 0;
      table.classList.add("is-landed", win ? "is-win" : "is-lose");
      live.textContent = `Ra mặt ${round.roll} (${round.roll % 2 ? "lẻ" : "chẵn"})${win ? " · Trúng!" : ""}`;
      showResult(stage, round, win, win ? "🎉 Trúng rồi!" : "😢 Trượt rồi",
        win ? "Con số định mệnh hôm nay mỉm cười với tôi!" : "Tôi nhìn xúc xắc rất lâu. Nó vẫn không có ý định thương lượng.");
    });
  }

   
  function prizeList(prizes) {
    const list = element("ul", "box-tier-list");
    for (const tier of boxTiers) {
      const items = prizes.filter((prize) => prize.multiplier === tier.multiplier);
      if (!items.length) continue;
      const row = element("li", `box-tier is-${tier.id}`);
      const icons = element("span", "box-tier-items");
      for (const prize of items) {
        const icon = element("span", "box-tier-item", prize.icon);
        icon.title = prize.label;
        icon.setAttribute("aria-label", prize.label);
        icons.append(icon);
      }
      row.append(element("span", "box-tier-name", tier.name), icons,
        element("strong", "box-tier-value", `×${String(tier.multiplier).replace(".", ",")}`));
      list.append(row);
    }
    return list;
  }

  const BOX_QUOTES = {
    miss: "Chiếc hộp trông rất giàu. Tiếc là bên trong không đồng ý.",
    common: "Không lỗ hết, coi như mua một chút niềm vui.",
    fair: "Hòa vốn. Ít ra chiếc hộp cũng không lừa tôi.",
    rare: "Chiếc hộp hôm nay giàu thật sự!",
    epic: "Tôi phải mở đi mở lại để chắc mình không mơ.",
    legend: "Huyền thoại có thật, và nó đang nằm trong tay tôi!",
  };
  function playBox(stage, round) {
    const box = boxTypes.find((entry) => entry.id === round.choice);
    const prize = boxPrizes[round.prize];
    const tier = getBoxTier(prize.multiplier);
    stage.classList.add("box-stage");
    const scene = element("div", "box-scene");
    const view = element("div", "game-box", box.icon);
    scene.append(element("span", "box-rays"), view, element("span", "box-pedestal"));
    const live = element("p", "game-hint game-live", "Đang mở hộp…");
    const theater = element("div", "box-theater");
    theater.append(element("p", "box-pick-chip", `${box.icon} ${box.name} · ${formatMoney(box.price)}`), scene, live);
    stage.append(theater);
    view.animate([
      { transform: "rotate(0)" }, { transform: "rotate(-12deg)" }, { transform: "rotate(12deg)" },
      { transform: "rotate(-8deg)" }, { transform: "rotate(8deg)" }, { transform: "rotate(0) scale(1.15)" },
    ], { duration: time(1300), easing: "ease-in-out" }).finished.then(() => {
      view.textContent = prize.icon;
      view.classList.add("is-open");
      theater.classList.add("is-open", `is-${tier.id}`);
      view.animate([{ transform: "scale(0.3)", opacity: 0 }, { transform: "scale(1.25)", opacity: 1 }, { transform: "scale(1)" }],
        { duration: time(500), easing: "cubic-bezier(0.2, 1.4, 0.4, 1)" }).finished.then(() => {
        live.textContent = prize.multiplier > 1 ? "🎉 Hộp đã mở!" : "Hộp đã mở…";
        const reveal = element("div", `box-reveal is-${tier.id}`);
        reveal.setAttribute("role", "status");
        reveal.append(element("span", "box-reveal-tier", tier.name), element("strong", "box-reveal-name", prize.label),
          element("span", "box-reveal-value", round.payout ? `Trị giá ${formatMoney(round.payout)}` : "Không bán được tiền"));
        live.after(reveal);
        showResult(stage, round, prize.multiplier > 1, `${prize.icon} ${prize.label}`, BOX_QUOTES[tier.id]);
      });
    });
  }

   
  function playTower(stage, round) {
    stage.classList.add("tower-stage");
    const live = element("p", "game-hint game-live tower-status");
    live.setAttribute("aria-live", "polite");
    const summary = element("div", "tower-summary");
    const total = element("strong", "tower-total");
    const progress = element("span", "tower-progress");
    summary.append(element("span", "tower-eyebrow", "Tiền có thể mang về"), total, progress);
    const floors = element("ol", "game-tower");
    TOWER_MULTIPLIERS.forEach((multiplier, index) => {
      const floor = element("li", "game-floor");
      floor.dataset.floor = String(index);
      const name = element("span", "tower-floor-name", `${index === 4 ? "♛ " : ""}Tầng ${index + 1}`);
      const value = element("span", "tower-floor-value");
      value.append(element("strong", "", formatMoney(payout(round.bet, multiplier))), element("small", "", `×${String(multiplier).replace(".", ",")}`));
      floor.append(name, value);
      floors.prepend(floor);
    });
    const doors = element("div", "game-doors");
    const actions = element("div", "license-actions");
    const arena = element("div", "tower-arena");
    arena.append(floors, element("p", "tower-rule", "Hai cửa · Một cửa an toàn. Chọn cửa sập sẽ mất toàn bộ tiền cược."));
    const controls = element("div", "tower-controls");
    controls.append(live, doors, actions);
    stage.append(summary, arena, controls);

    const finish = (floorsCleared, fell) => {
      const amount = fell ? 0 : payout(round.bet, TOWER_MULTIPLIERS[floorsCleared - 1]);
      if (!settle(round, amount, fell ? `rơi ở tầng ${floorsCleared + 1}` : `dừng sau khi vượt ${floorsCleared} tầng`)) return;
      floors.querySelectorAll(".game-floor").forEach((node) => {
        node.classList.remove("is-current");
        node.classList.toggle("is-fallen", fell && Number(node.dataset.floor) === floorsCleared);
      });
      live.textContent = fell ? `💥 Tầng ${floorsCleared + 1}: chọn trúng cửa sập!` : `Mang về ${formatMoney(amount)}.`;
      total.textContent = formatMoney(amount);
      progress.textContent = fell ? "Cuộc leo tháp kết thúc" : `Đã vượt ${floorsCleared}/5 tầng`;
      stage.classList.toggle("tower-fell", fell);
      doors.replaceChildren();
      actions.replaceChildren();
      showResult(stage, round, !fell, fell ? "💥 Chọn nhầm cửa!" : floorsCleared === TOWER_MULTIPLIERS.length ? "👑 Chinh phục đỉnh tháp!" : "💰 Mang tiền về!",
        fell ? "Thêm một tầng nữa… và tôi đã thêm một bài học." : "Dừng đúng lúc cũng là một loại tài năng.");
    };
    const draw = () => {
      floors.querySelectorAll(".game-floor").forEach((node) => {
        const index = Number(node.dataset.floor);
        node.classList.toggle("is-cleared", index < round.floor);
        node.classList.toggle("is-current", index === round.floor && round.phase === "choose");
      });
      doors.replaceChildren();
      actions.replaceChildren();
      total.textContent = formatMoney(round.floor ? payout(round.bet, TOWER_MULTIPLIERS[round.floor - 1]) : 0);
      progress.textContent = `Đã vượt ${round.floor}/5 tầng · Cược ${formatMoney(round.bet)}`;
      if (round.phase === "choose") {
        live.textContent = `Tầng ${round.floor + 1}: chọn một cánh cửa.`;
        [0, 1].forEach((door) => {
          const choice = button("game-door", "", () => open(door));
          choice.setAttribute("aria-label", door === 0 ? "Mở cửa trái" : "Mở cửa phải");
          choice.append(element("span", "tower-door-number", door === 0 ? "I" : "II"), element("span", "tower-door-panel"), element("span", "tower-door-label", door === 0 ? "Cửa trái" : "Cửa phải"));
          doors.append(choice);
        });
      } else if (round.phase === 'decide') {
        const amount = payout(round.bet, TOWER_MULTIPLIERS[round.floor - 1]);
        live.textContent = `Đã vượt tầng ${round.floor}! Có thể nhận ${formatMoney(amount)}.`;
        actions.append(
          button("shop-buy game-primary game-tower-stop", `Nhận ${formatMoney(amount)} · Dừng lại`, () => finish(round.floor, false)),
          button("license-answer game-tower-next", `Lên tầng ${round.floor + 1} · Nhắm ${formatMoney(payout(round.bet, TOWER_MULTIPLIERS[round.floor]))}`, () => {
            round.phase = "choose";
            save();
            draw();
            focusFirst();
          }),
        );
      }
      focusFirst();
    };
    function open(door, resume = false) {
      if (isSavePaused() || state.player.isAlive === false || state.player.gameRound !== round || round.settled) return;
      if (resume ? round.phase !== 'reveal' : round.phase !== 'choose') return;
      const selectedFloor = round.floor;
      if (!resume) {
        round.selectedDoor = door;
        round.phase = 'reveal';
        save(); // Persist the chosen door before its animation; reopening cannot pick again.
      }
      const safe = round.safeDoors[selectedFloor] === door;
      doors.querySelectorAll(".game-door").forEach((node, index) => {
        node.disabled = true;
        if (index === door) {
          node.textContent = safe ? "✅" : "💥";
          node.animate([{ transform: "rotateY(0)" }, { transform: "rotateY(180deg)" }, { transform: "rotateY(360deg)" }], { duration: time(500) });
        }
      });
      setTimeout(() => {
        if (isSavePaused() || state.player.isAlive === false || state.player.gameRound !== round ||
            round.settled || round.phase !== 'reveal' || round.floor !== selectedFloor || round.selectedDoor !== door) return;
        if (!safe) return finish(round.floor, true);
        round.floor += 1;
        if (round.floor === TOWER_MULTIPLIERS.length) return finish(round.floor, false);
        round.phase = "decide";
        save();
        draw();
      }, time(650));
    }
    draw();
    if (round.phase === 'reveal') {
      live.textContent = `Đang mở cửa ở tầng ${round.floor + 1}…`;
      open(round.selectedDoor, true);
    }
  }

   
  const rankLabel = (rank) => ({ 1: "A", 11: "J", 12: "Q", 13: "K" })[rank] ?? String(rank);
   
  const faceMarks = { 11: "♞", 12: "♛", 13: "♚" };
  function cardView(card, hidden = false) {
    const node = element("div", `game-card${hidden ? " is-hidden" : ""}${["♥", "♦"].includes(card.suit) ? " is-red" : ""}`);
    node.setAttribute("role", "img");
    node.setAttribute("aria-label", hidden ? "Lá bài đang úp" : `${rankLabel(card.rank)}${card.suit}`);
    const inner = element("div", "game-card-inner");
    const front = element("div", "game-card-face game-card-front");
     
    if (!hidden) {
      const corner = (place) => {
        const node = element("span", `game-card-corner ${place}`);
        node.append(element("b", "", rankLabel(card.rank)), element("i", "", card.suit));
        return node;
      };
      const face = card.rank >= 11;
      front.append(corner("is-top"), element("span", `game-card-pip${face ? " is-face" : ""}`, face ? faceMarks[card.rank] : card.suit),
        corner("is-bottom"));
    }
    inner.append(front, element("div", "game-card-face game-card-back"));
    node.append(inner);
    return node;
  }
  const handNames = { doubleAce: "👑 Xì bàn", blackjack: "🃏 Xì dách", five: "✨ Ngũ linh", bust: "💥 Quắc", normal: "" };
  const payoutText = (value) => `×${String(value).replace(".", ",")}`;

  function playBlackjack(stage, round) {
    const seat = (title, place) => {
      const box = element("div", `bj-seat ${place}`);
      const head = element("div", "bj-seat-head");
      const score = element("span", "bj-score");
      score.setAttribute("aria-hidden", "true");
      head.append(element("p", "game-hand-title", title), score);
      const row = element("div", "game-hand");
      const info = element("p", "bj-info");
      box.append(head, row, info);
      return { box, score, row, info };
    };
    const dealer = seat("🎩 Nhà cái", "is-dealer");
    const player = seat("🙋 Bạn", "is-player");
    const shoe = element("div", "bj-shoe");
    shoe.setAttribute("aria-hidden", "true");
     
    const cash = element("div", "bj-cash");
    cash.setAttribute("aria-hidden", "true");
    for (const value of ["100000", "200000", "500000"]) {
      const note = element("span", `bj-note is-${value}`);
      note.dataset.value = Number(value).toLocaleString("vi-VN");
      cash.append(note);
    }
    const pot = element("div", "bj-pot");
    pot.append(cash, element("span", "bj-bet", `Cược ${formatMoney(round.bet)}`));
    const rules = element("p", "bj-rules",
      `Xì dách ${payoutText(BLACKJACK_PAYOUTS.blackjack)} · Xì bàn ${payoutText(BLACKJACK_PAYOUTS.doubleAce)} · Ngũ linh ${payoutText(BLACKJACK_PAYOUTS.five)}`);
    const felt = element("div", "bj-felt");
    felt.append(shoe, dealer.box, rules, pot, player.box);
    const table = element("div", "bj-table");
    table.append(felt);
    const actions = element("div", "license-actions game-bj-actions");
    stage.append(table, actions);

    const describe = (cards) => `${handPoints(cards)} điểm${handNames[handType(cards)] ? ` · ${handNames[handType(cards)]}` : ""}`;
    const showHand = (spot, cards, hidden) => {
      const type = handType(cards);
      spot.score.textContent = hidden ? "?" : String(handPoints(cards));
      spot.score.className = `bj-score${hidden ? "" : type === "bust" ? " is-bust" : handNames[type] ? " is-special" : ""}`;
      spot.info.textContent = hidden ? "Một lá đang úp" : describe(cards);
    };
     
    const dealIn = (node, delay, staysHidden) => {
      const from = shoe.getBoundingClientRect();
      const to = node.getBoundingClientRect();
      const dx = from.left + from.width / 2 - (to.left + to.width / 2);
      const dy = from.top + from.height / 2 - (to.top + to.height / 2);
      node.animate([{ transform: `translate(${dx}px, ${dy}px) rotate(-30deg) scale(0.7)`, opacity: 0.3 }, { transform: "none", opacity: 1 }],
        { duration: time(460), delay: time(delay), easing: "cubic-bezier(0.2, 0.8, 0.3, 1)", fill: "backwards" });
      if (!staysHidden) {
        node.firstChild.animate([{ transform: "rotateY(180deg)" }, { transform: "rotateY(180deg)", offset: 0.5 }, { transform: "none" }],
          { duration: time(460), delay: time(delay), easing: "ease-out", fill: "backwards" });
      }
    };
    const flipOpen = (node, delay) => node.firstChild.animate([{ transform: "rotateY(180deg)" }, { transform: "none" }],
      { duration: time(520), delay: time(delay), easing: "ease-in-out", fill: "backwards" });
    const paint = (spot, cards, hideSecond, from, delayOf) => {
      spot.row.replaceChildren(...cards.map((card, index) => cardView(card, hideSecond && index === 1)));
      [...spot.row.children].forEach((node, index) => {
        node.style.setProperty("--i", index);
        node.style.setProperty("--n", cards.length);
        if (index >= from) dealIn(node, delayOf(index - from), hideSecond && index === 1);
      });
    };
    let dealerShown = false;
     
    const render = (revealDealer, motion = {}) => {
      const deal = motion.deal === true;
      const dealerFrom = deal ? 0 : motion.dealer ?? Infinity;
      paint(player, round.player, false, deal ? 0 : motion.player ?? Infinity, (step) => (deal ? step * 2 * 170 : step * 170));
      paint(dealer, round.dealer, !revealDealer, dealerFrom,
        (step) => (deal ? (step * 2 + 1) * 170 : (motion.dealerDelay ?? 0) + step * 380));
      if (revealDealer && !dealerShown && round.dealer.length > 1 && dealerFrom > 1) {
        flipOpen(dealer.row.children[1], motion.revealDelay ?? 0);
      }
      dealerShown = revealDealer;
       
      if (motion.scoreDelay) setTimeout(() => showHand(dealer, round.dealer, !revealDealer), time(motion.scoreDelay));
      else showHand(dealer, round.dealer, !revealDealer);
      showHand(player, round.player, false);
    };
    const finish = ({ rendered = false, wait = 600 } = {}) => {
      round.phase = "done";
      const outcome = compareHands(round.player, round.dealer);
      const multiplier = outcome === "lose" ? 0 : outcome === "draw" ? BLACKJACK_PAYOUTS.draw : BLACKJACK_PAYOUTS[outcome];
      if (!rendered) render(true);
      actions.replaceChildren();
      const texts = {
        doubleAce: ["👑 Xì bàn!", "Hai con Át! Hôm nay tay thơm hơn cả nước rửa tay!"],
        blackjack: ["🃏 Xì dách!", "Vừa chia xong đã có chuyện vui!"],
        five: ["✨ Ngũ linh!", "Năm lá trên tay, tim cũng tập thể dục đủ rồi!"],
        normal: ["🎉 Thắng nhà cái!", "Đủ điểm, đủ gan, đủ tiền về."],
        draw: ["🤝 Hòa", "Căng thẳng cả buổi, tiền ai về nhà nấy."],
        lose: handType(round.player) === "bust"
          ? ["💥 Quắc!", "Đang đẹp mà tham thêm lá. Ví tôi xin phép im lặng."]
          : ["😢 Nhà cái thắng", "Nhà cái cười, tôi cũng cười… nhưng là cười trừ."],
      };
      const [title, quote] = texts[outcome];
      if (!settle(round, payout(round.bet, multiplier), `${title.replace(/^\S+\s/u, "")} (bạn ${handPoints(round.player)} điểm, nhà cái ${handPoints(round.dealer)} điểm)`)) return;
       
      setTimeout(() => felt.classList.add(multiplier > 1 ? "is-win" : multiplier === 1 ? "is-draw" : "is-lose"), time(wait));
      setTimeout(() => showResult(stage, round, multiplier > 1, title, quote), time(wait + 700));
    };
     
    const dealerTurn = (fromHit = false) => {
      actions.replaceChildren();
      const lastPlayerCard = fromHit ? round.player.length - 1 : Infinity;
      const revealDelay = fromHit ? 460 : 0;
      if (handType(round.player) === "bust") {
        render(true, { player: lastPlayerCard, revealDelay, scoreDelay: revealDelay + 520 });
        return finish({ rendered: true, wait: revealDelay + 650 });
      }
      const before = round.dealer.length;
      playDealer(round);
      const dealerDelay = revealDelay + 560;
      const settled = dealerDelay + (round.dealer.length - before) * 380 + 120;
      render(true, { player: lastPlayerCard, dealer: before, dealerDelay, revealDelay, scoreDelay: settled });
      finish({ rendered: true, wait: settled + 300 });
    };
    const controls = () => {
      actions.replaceChildren();
      const hit = button("shop-buy game-primary game-hit bj-button", "➕ Rút thêm", () => {
        round.player.push(round.deck[round.next++]);
        save();
        if (!canPlayerHit(round.player)) return dealerTurn(true);
        render(false, { player: round.player.length - 1 });
        controls();
      });
      const stand = button("license-answer game-stand bj-button", "✋ Dừng", () => dealerTurn());
      stand.disabled = !canPlayerStand(round.player);
      if (stand.disabled) stand.textContent = "✋ Dừng (cần từ 16 điểm)";
      actions.append(hit, stand);
      focusFirst();
    };

    const freshDeal = round.phase === "player" && round.player.length === 2;
     
    if (isNaturalHand(round.player) || isNaturalHand(round.dealer)) {
      render(true, { deal: freshDeal });
      return finish({ rendered: true, wait: freshDeal ? 4 * 170 + 600 : 600 });
    }
    render(false, { deal: freshDeal });
    if (!canPlayerHit(round.player)) return dealerTurn();
    controls();
  }

   
  function storeBoxItem(round) {
    const prize = boxPrizes[round.prize];
    state.player.boxItems = [...(state.player.boxItems ?? []), {
      uid: `box-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      icon: prize.icon, label: prize.label, value: round.payout,
      box: boxTypes.find((box) => box.id === round.choice).name, receivedAtAge: state.player.age,
    }];
  }
  function renderBoxItems() {
    const list = $("life-box-items");
    list.replaceChildren();
     
    const groups = new Map();
    for (const entry of state.player.boxItems ?? []) {
      const key = `${entry.icon}|${entry.label}|${entry.value}`;
      groups.set(key, [...(groups.get(key) ?? []), entry]);
    }
    for (const units of groups.values()) {
      const item = units.at(-1);
      const many = units.length > 1;
      const row = element("li", "shop-owned");
      row.dataset.count = units.length;
      const worthless = !item.value;
      const action = button("shop-sell box-item-sell",
        worthless ? `🗑️ Bỏ${many ? " bớt 1" : " đi"}` : `${many ? "Bán bớt 1" : "Bán"} · ${formatMoney(item.value)}`, () => askConfirm(
        worthless ? `🗑️ Bỏ ${item.label}?` : `💸 Bán ${item.label}?`,
        (worthless ? `${item.icon} ${item.label} không bán được tiền. Bạn muốn bỏ ${many ? "1 món" : "đi"} cho gọn Tài sản?`
          : `Bạn muốn bán ${many ? "1 " : ""}${item.icon} ${item.label} với giá ${formatMoney(item.value)}?`) +
          (many ? `\nBạn còn lại ${units.length - 1} món.` : ""),
        worthless ? "Bỏ đi" : "Xác nhận bán",
        () => {
          if (!(state.player.boxItems ?? []).some((entry) => entry.uid === item.uid)) return;
          state.player.boxItems = state.player.boxItems.filter((entry) => entry.uid !== item.uid);
          state.player.money += item.value;
          const content = worthless ? `🗑️ Bỏ ${item.icon} ${item.label} từ hộp bí ẩn.`
            : `💸 Bán ${item.icon} ${item.label} từ hộp bí ẩn: Tiền +${formatMoneyAmount(item.value)} VNĐ.`;
          const log = { age: state.player.age, content, summary: content };
          state.logs.push(log);
          save();
          renderMoney();
          renderLogEntry(log);
          renderBoxItems();
        },
      ));
      action.disabled = state.player.isAlive === false;
      const boxes = [...new Set(units.map((unit) => unit.box))].join(", ");
      row.append(element("span", "", `${item.icon} ${item.label}${many ? ` ×${units.length}` : ""} · Từ ${boxes} lúc ` +
        `${describeAges(units.map((unit) => unit.receivedAtAge))} · Trị giá ${formatMoney(item.value)}${many ? " mỗi món" : ""}`), action);
      list.append(row);
    }
  }
   
  $("assets").addEventListener("click", renderBoxItems);

   
  const gamesNotice = $("games-notice-dialog");
  function openGames() {
    if (state.player.isAlive === false) return;
     
    if (state.player.tienLen) return tienLen.open();
    const active = state.player.gameRound;
    if (active && ["tower", "blackjack"].includes(active.game)) renderPlay(active);
    else renderPicker();
    dialog.showModal();
    focusFirst();
  }
  function dismissGamesNotice() {
    gamesNotice.close();
    if (state.player.isAlive !== false) $("activities-dialog").showModal();
  }
  $("activity-games").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    gamesNotice.showModal();
  });
  $("confirm-games-notice").addEventListener("click", () => {
    if (!gamesNotice.open) return;
    gamesNotice.close();
    openGames();
  });
  $("close-games-notice").addEventListener("click", dismissGamesNotice);
  gamesNotice.addEventListener("cancel", event => {
    event.preventDefault();
    dismissGamesNotice();
  });
  $("close-games").addEventListener("click", () => {
    flushReveal();
    tienLen.stop();
    dialog.close();
  });
  dialog.addEventListener("close", () => {
    flushReveal();
    tienLen.stop();
  });
  return {
    hasActiveTienLen: () => hasActiveTienLen(state.player),
    openTienLen: (notice) => tienLen.open(notice),
  };
}
