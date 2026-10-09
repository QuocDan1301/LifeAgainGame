import { formatMoney, formatMoneyAmount } from "./money-format.js";
import { askConfirm } from "./confirm-dialog.js";

// Trò chơi may rủi. Mọi hệ số là tổng tiền nhận về (đã gồm vốn): trừ tiền cược khi
// bắt đầu, cộng tiền thưởng một lần khi kết thúc. Kết quả được quyết định và lưu
// ngay khi bắt đầu lượt nên tải lại trang không tạo kết quả mới. Riêng hộp bí ẩn:
// vật phẩm được cất vào Tài sản (giá trị = giá hộp × hệ số) và bán lại được.
export const GAMES_MIN_AGE = 18;
export const GAMES_PER_YEAR = 5;
export const BET_MIN = 10_000;
export const BET_MAX = 1_000_000_000;
export const QUICK_BETS = [10_000, 100_000, 1_000_000];

export const games = [
  { id: "coin", icon: "🪙", name: "Sấp ngửa", tagline: "Một lần tung, hai số phận" },
  { id: "dice", icon: "🎲", name: "Đoán xúc xắc", tagline: "Con số định mệnh" },
  { id: "wheel", icon: "🎡", name: "Vòng quay tài lộc", tagline: "Quay một vòng, ví đổi tâm trạng" },
  { id: "box", icon: "🎁", name: "Hộp bí ẩn", tagline: "Mở hộp hay mở nỗi buồn?" },
  { id: "tower", icon: "🪜", name: "Leo tháp tài lộc", tagline: "Dừng đúng lúc" },
  { id: "race", icon: "🏁", name: "Đua thú may mắn", tagline: "Cổ vũ bằng cả cái ví" },
  { id: "blackjack", icon: "🃏", name: "Xì dách", tagline: "Thêm lá nữa hay thôi?" },
];

export const COIN_MULTIPLIER = 1.9;
export const DICE_MULTIPLIERS = { parity: 1.9, number: 5.7 };
export const wheelPrizes = [
  { icon: "💨", label: "Trắng tay", chance: 0.4, multiplier: 0, color: "#c9d6df" },
  { icon: "🪙", label: "Gỡ được một ít", chance: 0.3, multiplier: 0.5, color: "#ffe68b" },
  { icon: "🤝", label: "Hòa vốn", chance: 0.15, multiplier: 1, color: "#9fe0b4" },
  { icon: "💵", label: "Có lời", chance: 0.1, multiplier: 2, color: "#7cc8f8" },
  { icon: "💰", label: "Trúng lớn", chance: 0.04, multiplier: 5, color: "#f7a35c" },
  { icon: "👑", label: "Đại tài lộc", chance: 0.01, multiplier: 20, color: "#e05a8a" },
];
export const boxTypes = [
  { id: "normal", icon: "📦", name: "Hộp thường", price: 50_000 },
  { id: "fancy", icon: "🎀", name: "Hộp sang", price: 500_000 },
  { id: "rich", icon: "💎", name: "Hộp đại gia", price: 5_000_000 },
];
export const boxPrizes = [
  { icon: "🧦", label: "Đôi tất lạc chiếc", chance: 0.4, multiplier: 0 },
  { icon: "🪙", label: "Phong bì nhỏ", chance: 0.3, multiplier: 0.5 },
  { icon: "💵", label: "Phong bì vừa", chance: 0.2, multiplier: 1 },
  { icon: "💰", label: "Túi tiền", chance: 0.08, multiplier: 3 },
  { icon: "💎", label: "Viên đá quý", chance: 0.02, multiplier: 15 },
];
export const TOWER_MULTIPLIERS = [1.9, 3.8, 7.6, 15.2, 30.4];
export const racers = [
  { id: "rabbit", icon: "🐇", name: "Thỏ Tăng Tốc", trait: "Nhanh nhưng hay mất tập trung", chance: 0.4, multiplier: 2.3 },
  { id: "dog", icon: "🐕", name: "Cún Bền Bỉ", trait: "Chạy đều, ít làm màu", chance: 0.3, multiplier: 3 },
  { id: "cat", icon: "🐈", name: "Mèo Kiêu Kỳ", trait: "Thích chạy lúc nào thì chạy", chance: 0.2, multiplier: 4.5 },
  { id: "turtle", icon: "🐢", name: "Rùa Bất Ngờ", trait: "Chậm nhưng đôi lúc gây sốc", chance: 0.1, multiplier: 9 },
];
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

// ---------- Xì dách ----------
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
  // Một lá Át được tính 11 nếu không làm tổng vượt 21.
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
// Trả về kết quả của người chơi: "lose", "draw" hoặc kiểu bài thắng.
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
  // Hai bên cùng ngũ linh: ít điểm hơn thắng; bài thường: nhiều điểm hơn thắng.
  return (own === "five" ? a < b : a > b) ? own : "lose";
}
export const isNaturalHand = (cards) => ["doubleAce", "blackjack"].includes(handType(cards));
export const canPlayerHit = (cards) => cards.length < 5 && handPoints(cards) < 21;
export const canPlayerStand = (cards) => handPoints(cards) >= 16;
export function playDealer(data) {
  while (handPoints(data.dealer) < 17 && data.dealer.length < 5) data.dealer.push(data.deck[data.next++]);
}

// ---------- Tạo lượt chơi (quyết định kết quả ngay) ----------
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
  } else if (gameId === "wheel") {
    round.prize = pickWeighted(wheelPrizes, random);
    round.payout = payout(bet, wheelPrizes[round.prize].multiplier);
  } else if (gameId === "box") {
    round.prize = pickWeighted(boxPrizes, random);
    round.payout = payout(bet, boxPrizes[round.prize].multiplier);
  } else if (gameId === "race") {
    round.winner = racers[pickWeighted(racers, random)].id;
    round.payout = round.winner === choice ? payout(bet, racers.find((racer) => racer.id === choice).multiplier) : 0;
  } else if (gameId === "tower") {
    // Cửa an toàn của từng tầng được chọn sẵn: mỗi lần chọn có 50% đi tiếp.
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

// ---------- Giao diện ----------
export function initGames(state, { renderMoney, renderLogEntry }) {
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
  const save = () => localStorage.setItem("lifeAgainSave", JSON.stringify(state));
  const gameOf = (id) => games.find((game) => game.id === id);
  const playsUsed = () => (state.player.gamePlays?.age === state.player.age ? state.player.gamePlays.count : 0);
  const playsLeft = () => Math.max(0, GAMES_PER_YEAR - playsUsed());
  const focusFirst = () => (body.querySelector(".game-primary:not(:disabled), .shop-group:not(:disabled)")
    ?? body.querySelector("button:not(:disabled)"))?.focus({ preventScroll: true });
  const walletText = (offset = 0) => `Ví hiện có: ${formatMoney(state.player.money - offset)} · Còn ${playsLeft()}/${GAMES_PER_YEAR} lượt năm nay`;

  // Ghi kết quả vào ví và nhật ký; giao diện chỉ cập nhật sau khi hoạt ảnh kết thúc.
  function settle(round, payoutAmount, detail) {
    const game = gameOf(round.game);
    state.player.money += payoutAmount;
    state.player.gameRound = null;
    round.finalPayout = payoutAmount;
    const net = payoutAmount - round.bet;
    const content = `${game.icon} ${game.name}: ${detail}. Cược ${formatMoneyAmount(round.bet)} VNĐ, nhận về ${formatMoneyAmount(payoutAmount)} VNĐ. ` +
      `Tiền ${net >= 0 ? "+" : "-"}${formatMoneyAmount(Math.abs(net))} VNĐ.`;
    const log = { age: state.player.age, content, summary: content };
    state.logs.push(log);
    save();
    reveal = { log, payout: payoutAmount };
  }
  function flushReveal() {
    if (!reveal) return;
    const { log } = reveal;
    reveal = null;
    renderMoney();
    renderLogEntry(log);
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

  // ---------- Danh sách trò ----------
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
      const choice = button("shop-group game-pick", `${game.icon} ${game.name}`, () => renderSetup(game.id));
      choice.dataset.game = game.id;
      choice.disabled = Boolean(blocked);
      choice.append(element("span", "side-job-note", `“${game.tagline}”`));
      list.append(choice);
    }
    body.append(list);
  }

  // ---------- Màn chọn cược ----------
  function renderSetup(gameId, previous = {}) {
    flushReveal();
    const game = gameOf(gameId);
    const card = element("section", "dialog-card game-setup");
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

    // Tiền có thể nhận (tổng gồm vốn) cho lựa chọn hiện tại.
    let maxMultiplier = () => 0;
    if (gameId === "coin") {
      card.append(element("p", "game-hint", "Chọn mặt đồng xu:"),
        optionGroup([{ label: "🙂 Ngửa", value: "heads" }, { label: "🌀 Sấp", value: "tails" }], (value) => { choice = value; }, choice));
      maxMultiplier = () => COIN_MULTIPLIER;
    } else if (gameId === "dice") {
      let mode = choice?.mode ?? null;
      const values = element("div", "game-dice-values");
      const renderValues = () => {
        values.replaceChildren(mode === "parity"
          ? optionGroup([{ label: "Chẵn (2, 4, 6)", value: "even" }, { label: "Lẻ (1, 3, 5)", value: "odd" }], (value) => { choice = { mode, value }; }, choice?.value)
          : mode === "number"
            ? optionGroup([1, 2, 3, 4, 5, 6].map((value) => ({ label: diceFaces[value], value })), (value) => { choice = { mode, value }; }, choice?.value)
            : element("p", "game-hint", "Chọn một chế độ ở trên."));
      };
      card.append(element("p", "game-hint", "Chọn chế độ (mỗi lượt chỉ một lựa chọn):"),
        optionGroup([{ label: "Chẵn hoặc lẻ", value: "parity", note: `×${DICE_MULTIPLIERS.parity}` },
          { label: "Đúng một số", value: "number", note: `×${DICE_MULTIPLIERS.number}` }], (value) => {
          mode = value;
          choice = null;
          renderValues();
        }, mode), values);
      renderValues();
      maxMultiplier = () => (choice ? DICE_MULTIPLIERS[choice.mode] : 0);
    } else if (gameId === "wheel") {
      card.append(createWheel(0), wheelLegend());
      maxMultiplier = () => Math.max(...wheelPrizes.map((prize) => prize.multiplier));
      choice = "spin";
    } else if (gameId === "box") {
      card.append(element("p", "game-hint", "Chọn loại hộp:"),
        optionGroup(boxTypes.map((box) => ({ label: `${box.icon} ${box.name}`, value: box.id, note: formatMoney(box.price) })), (value) => { choice = value; }, choice),
        prizeList(boxPrizes));
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
    } else if (gameId === "race") {
      card.append(element("p", "game-hint", "Chọn một linh vật:"),
        optionGroup(racers.map((racer) => ({ label: `${racer.icon} ${racer.name}`, value: racer.id,
          note: `${racer.trait} · ×${String(racer.multiplier).replace(".", ",")}` })), (value) => { choice = value; }, choice));
      maxMultiplier = () => racers.find((racer) => racer.id === choice)?.multiplier ?? 0;
    } else if (gameId === "blackjack") {
      card.append(element("p", "game-hint",
        "Đấu với nhà cái. Dưới 16 điểm chưa được dừng; tối đa 5 lá. Thắng thường ×2 · Ngũ linh ×2 · Xì dách ×2,5 · Xì bàn ×3 · Hòa hoàn vốn."));
      maxMultiplier = () => BLACKJACK_PAYOUTS.doubleAce;
      choice = "deal";
    }

    // Chọn tiền cược (hộp bí ẩn dùng giá hộp).
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
      Object.assign(betInput, { type: "number", min: String(BET_MIN), step: "1000", value: String(bet), inputMode: "numeric" });
      betInput.setAttribute("aria-label", "Số tiền cược (VNĐ)");
      betInput.addEventListener("input", () => {
        bet = Math.floor(Number(betInput.value) || 0);
        update();
      });
      card.append(element("p", "game-hint", "Tiền cược:"), quick, betInput);
    }

    const currentBet = () => (gameId === "box" ? boxTypes.find((box) => box.id === choice)?.price ?? 0 : bet);
    function valid() {
      const amount = currentBet();
      return Boolean(choice) && amount >= (gameId === "box" ? 1 : BET_MIN) && amount <= BET_MAX &&
        amount <= state.player.money && playsLeft() > 0 && state.player.age >= GAMES_MIN_AGE;
    }
    function update() {
      const amount = currentBet();
      body.querySelectorAll(".game-quick-bets .game-option").forEach((node) =>
        node.setAttribute("aria-pressed", String(Number(node.dataset.bet) === bet)));
      const most = payout(amount, maxMultiplier());
      const partial = ["wheel", "box", "tower", "blackjack"].includes(gameId) ? "tối đa " : "";
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

  // ---------- Màn kết quả ----------
  function renderResult(round, win, title, quote) {
    flushReveal();
    const card = element("section", `dialog-card game-result ${win ? "is-win" : "is-lose"}`);
    const amount = round.finalPayout ?? 0;
    const net = amount - round.bet;
    const summary = round.game === "box"
      ? `Giá hộp ${formatMoney(round.bet)} · Vật phẩm trị giá ${formatMoney(round.payout)} · Đã cất vào Tài sản, có thể bán bất cứ lúc nào.`
      : `Cược ${formatMoney(round.bet)} · Nhận về ${formatMoney(amount)} (${net >= 0 ? "+" : "-"}${formatMoney(Math.abs(net))})`;
    card.append(element("h3", "", title), element("p", "game-quote", `“${quote}”`), element("p", "game-summary", summary));
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

  // ---------- Hoạt ảnh từng trò ----------
  const diceFaces = { 1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅" };

  function renderPlay(round) {
    const game = gameOf(round.game);
    const stage = element("section", `dialog-card game-stage game-stage-${round.game}`);
    stage.append(element("h3", "", `${game.icon} ${game.name}`));
    const instant = !["tower", "blackjack"].includes(round.game);
    if (round.game === "box") storeBoxItem(round);
    if (instant) settle(round, round.game === "box" ? 0 : round.payout, describeInstant(round));
    body.replaceChildren(element("p", "shop-wallet", walletText(instant ? reveal?.payout ?? 0 : 0)), stage);
    ({ coin: playCoin, dice: playDice, wheel: playWheel, box: playBox, race: playRace, tower: playTower, blackjack: playBlackjack })[round.game](stage, round);
  }

  function describeInstant(round) {
    if (round.game === "coin") return `chọn ${round.choice === "heads" ? "Ngửa" : "Sấp"}, ra ${round.result === "heads" ? "Ngửa" : "Sấp"}`;
    if (round.game === "dice") return `chọn ${round.choice.mode === "parity" ? (round.choice.value === "even" ? "Chẵn" : "Lẻ") : `số ${round.choice.value}`}, ra ${round.roll}`;
    if (round.game === "wheel") return `quay trúng ${wheelPrizes[round.prize].icon} ${wheelPrizes[round.prize].label}`;
    if (round.game === "box") {
      const prize = boxPrizes[round.prize];
      return `${boxTypes.find((box) => box.id === round.choice).name} có ${prize.icon} ${prize.label} ` +
        `(trị giá ${formatMoneyAmount(round.payout)} VNĐ, đã cất vào Tài sản)`;
    }
    const winner = racers.find((racer) => racer.id === round.winner);
    return `chọn ${racers.find((racer) => racer.id === round.choice).name}, ${winner.icon} ${winner.name} về nhất`;
  }

  function playCoin(stage, round) {
    const coin = element("div", "game-coin");
    coin.append(element("div", "game-coin-face is-heads", "🙂\nNGỬA"), element("div", "game-coin-face is-tails", "🌀\nSẤP"));
    stage.append(element("div", "game-coin-wrap"), element("p", "game-hint game-live", "Đồng xu đang xoay…"));
    stage.querySelector(".game-coin-wrap").append(coin);
    const turns = 6 + (round.result === "tails" ? 0.5 : 0);
    coin.animate([
      { transform: "translateY(0) rotateY(0deg)" },
      { transform: `translateY(-90px) rotateY(${turns * 180}deg)`, offset: 0.5 },
      { transform: `translateY(0) rotateY(${turns * 360}deg)` },
    ], { duration: time(1700), easing: "cubic-bezier(0.3, 0.7, 0.4, 1)", fill: "forwards" }).finished.then(() => {
      const win = round.payout > 0;
      stage.querySelector(".game-live").textContent = `Kết quả: ${round.result === "heads" ? "Ngửa" : "Sấp"}`;
      showResult(stage, round, win, win ? "🎉 Đoán đúng!" : "😢 Đoán sai",
        win ? "Đồng xu đứng về phía tôi. Mong tháng này hóa đơn cũng vậy!"
          : `Tôi chọn ${round.choice === "heads" ? "ngửa" : "sấp"}. Ví tôi chọn ${round.choice === "heads" ? "sấp" : "ngửa"}.`);
    });
  }

  function playDice(stage, round) {
    const die = element("div", "game-die", diceFaces[1]);
    stage.append(die, element("p", "game-hint game-live", "Xúc xắc đang lăn…"));
    let ticks = 0;
    const total = reducedMotion.matches ? 1 : 14;
    const roll = () => {
      ticks += 1;
      die.textContent = ticks >= total ? diceFaces[round.roll] : diceFaces[1 + Math.floor(Math.random() * 6)];
      die.animate([{ transform: "rotate(-18deg) scale(0.9)" }, { transform: "rotate(14deg) scale(1.05)" }, { transform: "none" }],
        { duration: time(110) });
      if (ticks < total) return setTimeout(roll, time(40 + ticks * 10));
      const win = round.payout > 0;
      stage.querySelector(".game-live").textContent = `Ra mặt ${round.roll} (${round.roll % 2 ? "lẻ" : "chẵn"})`;
      showResult(stage, round, win, win ? "🎉 Trúng rồi!" : "😢 Trượt rồi",
        win ? "Con số định mệnh hôm nay mỉm cười với tôi!" : "Tôi nhìn xúc xắc rất lâu. Nó vẫn không có ý định thương lượng.");
    };
    roll();
  }

  function createWheel(rotation) {
    const wrap = element("div", "game-wheel-wrap");
    const wheel = element("div", "game-wheel");
    let start = 0;
    const stops = [];
    for (const prize of wheelPrizes) {
      const end = start + prize.chance * 360;
      stops.push(`${prize.color} ${start}deg ${end}deg`);
      // Chỉ ghi biểu tượng ở những ô đủ rộng; mọi ô có trong chú thích bên dưới.
      if (prize.chance * 360 >= 20) {
        const label = element("span", "game-wheel-label", `${prize.icon}\n×${String(prize.multiplier).replace(".", ",")}`);
        label.style.transform = `rotate(${(start + end) / 2}deg)`;
        wheel.append(label);
      }
      start = end;
    }
    wheel.style.background = `conic-gradient(${stops.join(", ")})`;
    wheel.style.transform = `rotate(${rotation}deg)`;
    wrap.append(element("div", "game-wheel-pointer", "▼"), wheel);
    return wrap;
  }
  function wheelLegend() {
    const list = element("ul", "dialog-entries game-table");
    for (const prize of wheelPrizes) {
      const row = element("li");
      const swatch = element("span", "game-swatch");
      swatch.style.background = prize.color;
      const name = element("span", "", ` ${prize.icon} ${prize.label}`);
      name.prepend(swatch);
      row.append(name, element("strong", "", `×${String(prize.multiplier).replace(".", ",")}`));
      list.append(row);
    }
    list.append(element("li", "game-note", "Ô càng lớn, khả năng dừng vào càng cao."));
    return list;
  }
  function prizeList(prizes) {
    const list = element("ul", "dialog-entries game-table");
    for (const prize of prizes) {
      const row = element("li");
      row.append(element("span", "", `${prize.icon} ${prize.label}`), element("strong", "", `×${String(prize.multiplier).replace(".", ",")}`));
      list.append(row);
    }
    return list;
  }

  function playWheel(stage, round) {
    const wrap = createWheel(0);
    stage.append(wrap, element("p", "game-hint game-live", "Vòng quay đang chạy…"));
    let start = 0;
    for (let index = 0; index < round.prize; index += 1) start += wheelPrizes[index].chance * 360;
    const span = wheelPrizes[round.prize].chance * 360;
    // Dừng ở giữa ô trúng (lệch nhẹ ngẫu nhiên trong ô) dưới kim chỉ ở đỉnh.
    const target = start + span / 2 + (Math.random() - 0.5) * span * 0.6;
    const finalAngle = 360 * 6 + (360 - target);
    wrap.querySelector(".game-wheel").animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${finalAngle}deg)` }],
      { duration: time(4200), easing: "cubic-bezier(0.12, 0.8, 0.2, 1)", fill: "forwards" }).finished.then(() => {
      const prize = wheelPrizes[round.prize];
      stage.querySelector(".game-live").textContent = `Dừng ở: ${prize.icon} ${prize.label}`;
      showResult(stage, round, prize.multiplier > 1, `${prize.icon} ${prize.label}!`,
        prize.multiplier >= 5 ? "Vòng quay hôm nay biết điều thật!" : prize.multiplier >= 1 ? "Không mất là thắng rồi!" : "Quay một vòng, ví quay về số không.");
    });
  }

  function playBox(stage, round) {
    const box = boxTypes.find((entry) => entry.id === round.choice);
    const prize = boxPrizes[round.prize];
    const view = element("div", "game-box", box.icon);
    stage.append(view, element("p", "game-hint game-live", "Đang mở hộp…"));
    view.animate([
      { transform: "rotate(0)" }, { transform: "rotate(-12deg)" }, { transform: "rotate(12deg)" },
      { transform: "rotate(-8deg)" }, { transform: "rotate(8deg)" }, { transform: "rotate(0) scale(1.15)" },
    ], { duration: time(1300), easing: "ease-in-out" }).finished.then(() => {
      view.textContent = prize.icon;
      view.classList.add("is-open");
      view.animate([{ transform: "scale(0.3)", opacity: 0 }, { transform: "scale(1.25)", opacity: 1 }, { transform: "scale(1)" }],
        { duration: time(500), easing: "cubic-bezier(0.2, 1.4, 0.4, 1)" }).finished.then(() => {
        stage.querySelector(".game-live").textContent = `Bên trong là: ${prize.icon} ${prize.label}`;
        showResult(stage, round, prize.multiplier > 1, `${prize.icon} ${prize.label}`,
          prize.multiplier > 1 ? "Chiếc hộp hôm nay giàu thật sự!" : "Chiếc hộp trông rất giàu. Tiếc là bên trong không đồng ý.");
      });
    });
  }

  function playRace(stage, round) {
    const track = element("div", "game-track");
    stage.append(track, element("p", "game-hint game-live", "Các linh vật đang tăng tốc…"));
    const lanes = racers.map((racer) => {
      const lane = element("div", `game-lane${racer.id === round.choice ? " is-picked" : ""}`);
      const runner = element("span", "game-runner");
      runner.append(element("span", "game-runner-icon", racer.icon));
      lane.append(runner, element("span", "game-finish", "🏁"));
      track.append(lane);
      return { racer, lane, runner };
    });
    const base = 3600;
    const finishes = lanes.map(({ racer, lane, runner }) => {
      const distance = lane.clientWidth - runner.offsetWidth - 26;
      const duration = racer.id === round.winner ? base : base * (1.08 + Math.random() * 0.3);
      // Chạy theo từng đoạn tăng tốc, chậm lại cho sinh động nhưng luôn tiến về đích.
      const frames = [{ transform: "translateX(0)" }];
      let progress = 0;
      for (let step = 1; step < 6; step += 1) {
        progress = Math.min(0.95, progress + (1 - progress) * (0.15 + Math.random() * 0.25));
        frames.push({ transform: `translateX(${progress * distance}px)`, offset: step / 6 });
      }
      frames.push({ transform: `translateX(${distance}px)` });
      return runner.animate(frames, { duration: time(duration), easing: "linear", fill: "forwards" }).finished;
    });
    const winnerIndex = racers.findIndex((racer) => racer.id === round.winner);
    finishes[winnerIndex].then(() => {
      const winner = racers[winnerIndex];
      lanes[winnerIndex].lane.classList.add("is-winner");
      stage.querySelector(".game-live").textContent = `${winner.icon} ${winner.name} về nhất!`;
      const win = round.payout > 0;
      showResult(stage, round, win, win ? `🏆 ${winner.name} thắng!` : `😢 ${winner.name} về nhất`,
        winner.id === "turtle" ? "Tôi chưa kịp hết nghi ngờ thì rùa đã nhận cúp."
          : win ? "Cổ vũ bằng cả cái ví, và cái ví đã được đền đáp!" : "Tôi cổ vũ hết mình, linh vật của tôi thì cổ vũ… người khác.");
    });
  }

  // ---------- Leo tháp ----------
  function playTower(stage, round) {
    const live = element("p", "game-hint game-live");
    const floors = element("ol", "game-tower");
    TOWER_MULTIPLIERS.forEach((multiplier, index) => {
      const floor = element("li", "game-floor");
      floor.dataset.floor = String(index);
      floor.append(element("span", "", `Tầng ${index + 1}`), element("strong", "", `×${String(multiplier).replace(".", ",")}`));
      floors.prepend(floor);
    });
    const doors = element("div", "game-doors");
    const actions = element("div", "license-actions");
    stage.append(floors, live, doors, actions);

    const finish = (floorsCleared, fell) => {
      const amount = fell ? 0 : payout(round.bet, TOWER_MULTIPLIERS[floorsCleared - 1]);
      settle(round, amount, fell ? `rơi ở tầng ${floorsCleared + 1}` : `dừng sau khi vượt ${floorsCleared} tầng`);
      floors.querySelectorAll(".game-floor").forEach((node) => {
        node.classList.remove("is-current");
        node.classList.toggle("is-fallen", fell && Number(node.dataset.floor) === floorsCleared);
      });
      live.textContent = fell ? `💥 Tầng ${floorsCleared + 1}: chọn trúng cửa sập!` : `Mang về ${formatMoney(amount)}.`;
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
      if (round.phase === "choose") {
        live.textContent = `Tầng ${round.floor + 1}: chọn một cánh cửa.`;
        [0, 1].forEach((door) => doors.append(button("game-door", "🚪", () => open(door))));
      } else {
        const amount = payout(round.bet, TOWER_MULTIPLIERS[round.floor - 1]);
        live.textContent = `Đã vượt tầng ${round.floor}! Có thể nhận ${formatMoney(amount)}.`;
        actions.append(
          button("shop-buy game-primary game-tower-stop", "Đủ rồi, mang tiền về!", () => finish(round.floor, false)),
          button("license-answer game-tower-next", "Thêm một tầng nữa!", () => {
            round.phase = "choose";
            save();
            draw();
            focusFirst();
          }),
        );
      }
      focusFirst();
    };
    function open(door) {
      const safe = round.safeDoors[round.floor] === door;
      doors.querySelectorAll(".game-door").forEach((node, index) => {
        node.disabled = true;
        if (index === door) {
          node.textContent = safe ? "✅" : "💥";
          node.animate([{ transform: "rotateY(0)" }, { transform: "rotateY(180deg)" }, { transform: "rotateY(360deg)" }], { duration: time(500) });
        }
      });
      setTimeout(() => {
        if (!safe) return finish(round.floor, true);
        round.floor += 1;
        if (round.floor === TOWER_MULTIPLIERS.length) return finish(round.floor, false);
        round.phase = "decide";
        save();
        draw();
      }, time(650));
    }
    draw();
  }

  // ---------- Xì dách ----------
  const rankLabel = (rank) => ({ 1: "A", 11: "J", 12: "Q", 13: "K" })[rank] ?? String(rank);
  function cardView(card, hidden = false) {
    const node = element("div", `game-card${hidden ? " is-hidden" : ""}${["♥", "♦"].includes(card.suit) ? " is-red" : ""}`);
    node.append(element("span", "", hidden ? "🂠" : `${rankLabel(card.rank)}${card.suit}`));
    return node;
  }
  const handNames = { doubleAce: "👑 Xì bàn", blackjack: "🃏 Xì dách", five: "✨ Ngũ linh", bust: "💥 Quắc", normal: "" };

  function playBlackjack(stage, round) {
    const dealerRow = element("div", "game-hand");
    const playerRow = element("div", "game-hand");
    const dealerInfo = element("p", "game-hint");
    const playerInfo = element("p", "game-hint");
    const actions = element("div", "license-actions game-bj-actions");
    stage.append(element("p", "game-hand-title", "🎩 Nhà cái"), dealerRow, dealerInfo,
      element("p", "game-hand-title", "🙋 Bạn"), playerRow, playerInfo, actions);

    const describe = (cards) => `${handPoints(cards)} điểm${handNames[handType(cards)] ? ` · ${handNames[handType(cards)]}` : ""}`;
    const render = (revealDealer, animateFrom = Infinity) => {
      const paint = (row, cards, hideSecond) => {
        row.replaceChildren(...cards.map((card, index) => cardView(card, hideSecond && index === 1)));
        [...row.children].forEach((node, index) => {
          if (index >= animateFrom) node.animate([{ transform: "translateY(-30px) rotateY(90deg)", opacity: 0 }, { transform: "none", opacity: 1 }],
            { duration: time(350), delay: time((index - animateFrom) * 120), fill: "backwards" });
        });
      };
      paint(dealerRow, round.dealer, !revealDealer);
      paint(playerRow, round.player, false);
      dealerInfo.textContent = revealDealer ? describe(round.dealer) : "Một lá đang úp";
      playerInfo.textContent = describe(round.player);
    };
    const finish = () => {
      round.phase = "done";
      const outcome = compareHands(round.player, round.dealer);
      const multiplier = outcome === "lose" ? 0 : outcome === "draw" ? BLACKJACK_PAYOUTS.draw : BLACKJACK_PAYOUTS[outcome];
      render(true);
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
      settle(round, payout(round.bet, multiplier), `${title.replace(/^\S+\s/u, "")} (bạn ${handPoints(round.player)} điểm, nhà cái ${handPoints(round.dealer)} điểm)`);
      setTimeout(() => showResult(stage, round, multiplier > 1, title, quote), time(500));
    };
    const dealerTurn = () => {
      if (handType(round.player) !== "bust") {
        const before = round.dealer.length;
        playDealer(round);
        render(true);
        [...dealerRow.children].slice(before).forEach((node, index) =>
          node.animate([{ transform: "translateY(-30px)", opacity: 0 }, { transform: "none", opacity: 1 }],
            { duration: time(350), delay: time(index * 250), fill: "backwards" }));
      }
      finish();
    };
    const controls = () => {
      actions.replaceChildren();
      const hit = button("shop-buy game-primary game-hit", "➕ Rút thêm", () => {
        round.player.push(round.deck[round.next++]);
        save();
        render(false, round.player.length - 1);
        if (!canPlayerHit(round.player)) return dealerTurn();
        controls();
      });
      const stand = button("license-answer game-stand", "✋ Dừng", dealerTurn);
      stand.disabled = !canPlayerStand(round.player);
      if (stand.disabled) stand.textContent = "✋ Dừng (cần từ 16 điểm)";
      actions.append(hit, stand);
      focusFirst();
    };

    render(false, round.phase === "player" && round.player.length === 2 ? 0 : Infinity);
    // Xì bàn hoặc xì dách ngay khi chia: mở bài và phân thắng thua luôn.
    if (isNaturalHand(round.player) || isNaturalHand(round.dealer)) return finish();
    if (!canPlayerHit(round.player)) return dealerTurn();
    controls();
  }

  // ---------- Vật phẩm hộp bí ẩn trong Tài sản ----------
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
    for (const item of state.player.boxItems ?? []) {
      const row = element("li", "shop-owned");
      const worthless = !item.value;
      const action = button("shop-sell box-item-sell", worthless ? "🗑️ Bỏ đi" : `Bán · ${formatMoney(item.value)}`, () => askConfirm(
        worthless ? `🗑️ Bỏ ${item.label}?` : `💸 Bán ${item.label}?`,
        worthless ? `${item.icon} ${item.label} không bán được tiền. Bạn muốn bỏ đi cho gọn Tài sản?`
          : `Bạn muốn bán ${item.icon} ${item.label} với giá ${formatMoney(item.value)}?`,
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
      row.append(element("span", "", `${item.icon} ${item.label} · Từ ${item.box} lúc ${item.receivedAtAge} tuổi · Trị giá ${formatMoney(item.value)}`), action);
      list.append(row);
    }
  }
  // Popup Tài sản tự mở trong life-profile.js; ở đây chỉ vẽ vật phẩm hộp bí ẩn.
  $("assets").addEventListener("click", renderBoxItems);

  // ---------- Mở popup ----------
  $("activity-games").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    const active = state.player.gameRound;
    if (active && ["tower", "blackjack"].includes(active.game)) renderPlay(active);
    else renderPicker();
    dialog.showModal();
    focusFirst();
  });
  $("close-games").addEventListener("click", () => {
    flushReveal();
    dialog.close();
  });
  dialog.addEventListener("close", flushReveal);
}
