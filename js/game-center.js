import { formatMoney, formatMoneyAmount } from "./money-format.js";
import { askConfirm } from "./confirm-dialog.js";
import {
  addPlush, arcadeGames, arcadeOf, CLAW_RARE_ACHIEVEMENT, CLAW_SECONDS, CLAW_START, COIN_VALUE, coinPacks, cowOf, cowTypes,
  describeTiers, formatPercent, gameOf, HAPPY_PLAYS_PER_YEAR, judgeClawGrab, playsThisYear, plushies, plushOf, plushRarities,
  prizes, rarityLabels, rollCowOutcome, stockClawMachine, ticketsForScore,
} from "./game-center-data.js";
import { playArcadeGame } from "./arcade-games.js";
import { recordAchievementFlags } from "./achievements-data.js";

// Game Center: đổi xu, chơi trò, đổi quà và xem bộ sưu tập (dữ liệu trong player.arcade).
// Phí và hạnh phúc được tính ngay khi bắt đầu, cùng một lần lưu; lượt đang chơi nằm trong
// arcade.session. Đóng popup hay tải lại trang giữa chừng thì lượt được tính với kết quả đã lưu
// lúc đó (không hoàn xu). Thưởng chỉ cộng khi xóa session nên mỗi lượt được tính đúng một lần.
export function initGameCenter(state, { renderMoney, renderStats, renderLogEntry, checkAchievements = () => {} }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("game-center-dialog");
  const body = $("game-center-body");
  let stopGame = null;
  let saveTimer = null;
  let interrupted = null;

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
  const save = () => {
    clearTimeout(saveTimer);
    saveTimer = null;
    localStorage.setItem("lifeAgainSave", JSON.stringify(state));
  };
  // Điểm của trò tính giờ thay đổi liên tục: gom lại lưu mỗi chút một.
  const saveSoon = () => { saveTimer ??= setTimeout(save, 800); };
  const arcade = () => arcadeOf(state.player);
  const pushLog = (content) => {
    const log = { age: state.player.age, content, summary: content };
    state.logs.push(log);
    return log;
  };
  const show = (...nodes) => {
    body.replaceChildren(...nodes.filter(Boolean));
    (body.querySelector(".game-primary:not(:disabled)") ?? body.querySelector("button:not(:disabled)"))?.focus({ preventScroll: true });
  };
  const happyLeft = () => Math.max(0, HAPPY_PLAYS_PER_YEAR - playsThisYear(state.player));
  const tableRows = (rows) => {
    const list = element("ul", "dialog-entries game-table");
    for (const [label, value] of rows) {
      const row = element("li");
      row.append(element("span", "", label), element("strong", "", value));
      list.append(row);
    }
    return list;
  };

  function walletBar(withExchange = true) {
    const bar = element("div", "gc-wallet");
    const chip = (icon, value, unit, label) => {
      const node = element("span", "gc-chip");
      node.setAttribute("aria-label", `${value} ${label}`);
      node.append(`${icon} `, element("strong", "", String(value)), ` ${unit}`);
      return node;
    };
    bar.append(chip("🪙", arcade().coins, "xu", "xu"), chip("🎟️", arcade().tickets, "vé", "vé thưởng"));
    if (withExchange) bar.append(button("gc-exchange", "➕ Đổi xu", renderExchange));
    return bar;
  }
  const toActivities = () => button("shop-back", "← Quay lại Hoạt động", () => {
    dialog.close();
    $("activities-dialog").showModal();
  });
  const toHub = () => button("shop-back", "← Về Game Center", renderHub);

  // ---------- Màn chính ----------
  function renderHub() {
    const grid = element("div", "gc-games");
    for (const game of arcadeGames) {
      const card = button("gc-game", "", () => renderIntro(game.id));
      card.dataset.game = game.id;
      card.disabled = !game.ready;
      card.append(element("span", "gc-game-icon", game.icon), element("span", "gc-game-name", game.name),
        element("span", "gc-game-meta", game.ready ? `${game.cost} xu · thưởng ${game.reward}` : "Sắp ra mắt"));
      grid.append(card);
    }
    const links = element("div", "gc-links");
    links.append(button("shop-group gc-link", "🎁 Quầy đổi quà", renderPrizes),
      button("shop-group gc-link", "🧸 Bộ sưu tập", renderCollection));
    show(toActivities(), walletBar(),
      element("p", "game-motto", happyLeft()
        ? `Năm nay còn ${happyLeft()}/${HAPPY_PLAYS_PER_YEAR} lượt chơi được +1 hạnh phúc.`
        : "Năm nay đã hết lượt cộng hạnh phúc, nhưng vẫn nhận thưởng như thường."),
      grid, links);
  }

  // ---------- Đổi xu ----------
  function renderExchange() {
    const card = element("section", "dialog-card");
    card.append(element("h3", "", "🪙 Đổi xu"), element("p", "side-job-intro",
      `1 xu = ${formatMoney(COIN_VALUE)}. Xu chỉ dùng trong Game Center: không đổi ngược ra tiền, không chuyển cho người khác.`));
    const items = element("div", "shop-items");
    for (const pack of coinPacks) {
      const affordable = state.player.money >= pack.price;
      const item = element("article", "shop-item");
      const buy = button("shop-buy gc-buy-coins", affordable ? `Đổi · ${formatMoney(pack.price)}` : `Không đủ tiền (${formatMoney(pack.price)})`,
        () => askConfirm(`🪙 Đổi ${pack.coins} xu?`,
          `Bạn trả ${formatMoney(pack.price)} để nhận ${pack.coins} xu.\nXu không đổi ngược lại thành tiền.`,
          "Xác nhận đổi", () => exchange(pack)));
      buy.dataset.coins = String(pack.coins);
      buy.disabled = !affordable || state.player.isAlive === false;
      item.append(element("h4", "", `🪙 ${pack.coins} xu`), buy);
      items.append(item);
    }
    card.append(items);
    show(toHub(), walletBar(false), element("p", "shop-wallet", `Ví hiện có: ${formatMoney(state.player.money)}`), card);
  }
  function exchange(pack) {
    const player = state.player;
    if (player.isAlive === false || player.money < pack.price) return;
    player.money -= pack.price;
    arcade().coins += pack.coins;
    const log = pushLog(`🪙 Game Center: đổi ${pack.coins} xu. Tiền -${formatMoneyAmount(pack.price)} VNĐ.`);
    save();
    renderMoney();
    renderLogEntry(log);
    if (dialog.open) renderExchange();
  }

  // ---------- Giới thiệu trò: phí, luật, bảng thưởng ----------
  function rewardTable(game) {
    if (game.id === "cow") {
      return tableRows([...cowTypes.map((cow) => [`${cow.crown ? "👑" : ""}${cow.icon} ${cow.name} · bắt được ${formatPercent(cow.catchChance)}`,
        `${cow.payout} xu`]), ["💨 Trượt dây hoặc bò thoát", "0 xu"]]);
    }
    if (game.id === "claw") {
      return tableRows(Object.entries(plushRarities).map(([id, rarity]) => [
        `${rarity.label}: ${plushies.filter((plush) => plush.rarity === id).map((plush) => plush.icon).join(" ")}`,
        `${formatPercent(rarity.grab)} khi căn giữa`]));
    }
    return tableRows(describeTiers(game));
  }
  function renderIntro(gameId) {
    const game = gameOf(gameId);
    if (!game?.ready) return renderHub();
    const coins = arcade().coins;
    const enough = coins >= game.cost;
    const card = element("section", "dialog-card gc-intro");
    const rules = element("ul", "dialog-entries gc-rules");
    for (const rule of game.rules) rules.append(element("li", "", rule));
    card.append(element("h3", "", `${game.icon} ${game.name}`), element("p", "game-tagline", `“${game.tagline}”`),
      element("p", "game-hint", "📜 Luật chơi"), rules,
      element("p", "game-hint", "🏆 Bảng thưởng"), rewardTable(game),
      element("p", "game-hint", "💰 Phí"), tableRows([
        [game.id === "cow" ? "Mỗi lần thả dây" : "Mỗi lượt", `${game.cost} xu`],
        ["Hạnh phúc", happyLeft() ? `+1 (còn ${happyLeft()}/${HAPPY_PLAYS_PER_YEAR} lượt năm nay)` : "Hết lượt cộng năm nay"],
      ]),
      element("p", "gc-warning", game.id === "claw"
        ? "💾 Đóng popup hoặc tải lại trang giữa chừng: lượt gắp được giữ nguyên để chơi tiếp, không hoàn xu và không đổi kết quả."
        : "⚠️ Đóng popup hoặc tải lại trang giữa chừng: lượt vẫn được tính với kết quả lúc đó và không hoàn xu."));
    // Gắp thú: vào xem máy miễn phí, trừ xu khi bấm “Chơi” ở máy.
    const viewOnly = game.id === "claw";
    const start = button("shop-buy game-primary gc-start",
      viewOnly ? "🧸 Xem máy gắp" : !enough ? `Thiếu xu (cần ${game.cost}, đang có ${coins})`
        : game.id === "cow" ? "🐄 Vào đồng cỏ · mỗi lần thả dây −1 xu" : `▶️ Bắt đầu · −${game.cost} xu`, () => startGame(game.id));
    start.disabled = (!enough && !viewOnly) || state.player.isAlive === false;
    card.append(start);
    if (!enough) card.append(button("shop-back gc-need-coins", "🪙 Đổi thêm xu", renderExchange));
    show(toHub(), walletBar(), card);
  }
  // Máy gắp dùng chung giữa các lượt; sang tuổi mới thì bổ sung thú.
  function clawMachine() {
    const data = arcade();
    const stocked = stockClawMachine(data.clawMachine, state.player.age);
    if (stocked !== data.clawMachine) {
      data.clawMachine = stocked;
      save();
    }
    return data.clawMachine;
  }

  // ---------- Một lượt chơi ----------
  // Trừ phí, cộng hạnh phúc (3 lượt đầu năm) và lưu lượt mới trong cùng một lần lưu.
  function beginSession(game, extra = {}) {
    const player = state.player;
    const data = arcade();
    if (!game?.ready || player.isAlive === false || data.session || data.coins < game.cost) return null;
    data.coins -= game.cost;
    const played = playsThisYear(player);
    data.plays = { age: player.age, count: played + 1 };
    let happiness = 0;
    if (played < HAPPY_PLAYS_PER_YEAR) {
      const before = player.happiness;
      player.happiness = Math.min(100, before + 1);
      happiness = player.happiness - before;
    }
    const session = {
      id: `gc-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
      game: game.id, cost: game.cost, age: player.age, happiness, score: 0, outcome: null, ...extra,
    };
    data.session = session;
    save();
    renderStats();
    return session;
  }
  function startGame(gameId) {
    const game = gameOf(gameId);
    if (game?.id === "cow") return renderCowField();
    if (game?.id === "claw") return renderClawMachine();
    const session = beginSession(game);
    if (session) renderPlay(session);
  }
  // Kéo bò: vào sân miễn phí; mỗi lần thả dây là một lượt (1 xu). Kết quả được bốc ngẫu nhiên và lưu
  // cùng lúc trừ phí, nên tải lại trang giữa chừng không đổi được kết quả; thưởng cộng khi diễn xong.
  function renderCowField() {
    const game = gameOf("cow");
    if (state.player.isAlive === false || arcade().session) return renderHub();
    const stage = element("section", "dialog-card gc-stage gc-stage-cow");
    let wallet = walletBar(false);
    const refreshWallet = () => {
      const next = walletBar(false);
      wallet.replaceWith(next);
      wallet = next;
    };
    show(wallet, stage);
    const current = (session) => arcade().session?.id === session.id;
    stopGame = playArcadeGame("cow", {
      stage,
      coins: () => arcade().coins,
      begin: (cowId) => {
        const cow = cowOf(cowId);
        if (!cow) return null;
        const session = beginSession(game, { target: cowId, phase: "throw", outcome: rollCowOutcome(cow) });
        refreshWallet();
        return session;
      },
      // now: lưu ngay (vừa trúng dây); còn lại gom lưu vì thanh kéo đổi liên tục.
      progress: (session, value, now = false) => {
        if (!current(session)) return;
        session.score = value;
        if (now) save();
        else saveSoon();
      },
      resolve: (session) => {
        if (!current(session)) return null;
        const result = settle(session);
        refreshWallet();
        return result;
      },
      exit: () => {
        endGame();
        renderHub();
      },
    });
  }
  function renderPlay(session) {
    const game = gameOf(session.game);
    const stage = element("section", `dialog-card gc-stage gc-stage-${game.id}`);
    stage.append(element("h3", "", `${game.icon} ${game.name}`));
    show(walletBar(false), stage);
    const current = () => arcade().session?.id === session.id;
    stopGame = playArcadeGame(game.id, {
      stage,
      session,
      decide: (outcome) => {
        if (!current()) return;
        session.outcome = outcome;
        save();
      },
      progress: (score) => {
        if (!current()) return;
        session.score = score;
        saveSoon();
      },
      finish: () => {
        endGame();
        const result = settle(session);
        if (result && dialog.open) renderResult(session, result);
      },
    });
  }
  // Gắp thú: xem máy miễn phí; “Chơi” trừ 3 xu. Lượt dở (đóng/tải lại) được chơi tiếp đúng chỗ cũ.
  function renderClawMachine() {
    const game = gameOf("claw");
    const data = arcade();
    if (state.player.isAlive === false || (data.session && data.session.game !== "claw")) return renderHub();
    clawMachine();
    const stage = element("section", "dialog-card gc-stage gc-stage-claw");
    let wallet = walletBar(false);
    const refreshWallet = () => {
      const next = walletBar(false);
      wallet.replaceWith(next);
      wallet = next;
    };
    show(wallet, stage);
    const current = (session) => arcade().session?.id === session.id;
    stopGame = playArcadeGame("claw", {
      stage,
      cost: game.cost,
      machine: () => arcade().clawMachine,
      session: () => (arcade().session?.game === "claw" ? arcade().session : null),
      coins: () => arcade().coins,
      begin: () => {
        if (!arcade().clawMachine?.items.length) return null;
        const session = beginSession(game, { phase: "aim", timeLeft: CLAW_SECONDS, claw: { ...CLAW_START } });
        refreshWallet();
        return session;
      },
      persist: (now = false) => (now ? save() : saveSoon()),
      // Chốt kết quả đúng một lần, ngay khi bắt đầu hạ càng.
      lockIn: (session) => {
        if (!current(session)) return null;
        if (session.phase !== "drop") {
          session.outcome = judgeClawGrab(arcade().clawMachine.items, session.claw);
          session.phase = "drop";
          save();
        }
        return session.outcome;
      },
      finish: (session) => {
        if (!current(session)) return null;
        const result = settle(session);
        refreshWallet();
        return result;
      },
      exit: () => {
        endGame();
        renderHub();
      },
    });
  }
  function endGame() {
    stopGame?.();
    stopGame = null;
  }

  // Cộng thưởng và ghi nhật ký đúng một lần cho mỗi lượt.
  function settle(session, wasInterrupted = false) {
    const data = arcade();
    if (data.session?.id !== session.id) return null;
    data.session = null;
    const game = gameOf(session.game);
    let title;
    let text;
    let detail;
    let win = false;
    if (game.id === "cow") {
      // Kết quả đã bốc khi thả dây (kể cả khi lượt bị gián đoạn). Bản lưu cũ chưa có thì tính như trượt/thoát.
      const outcome = session.outcome ?? { result: session.phase === "pull" ? "escaped" : "miss" };
      const cow = outcome.result === "caught" ? cowOf(outcome.cow) : null;
      const target = cowOf(session.cow ?? session.target);
      if (cow) {
        data.coins += cow.payout;
        win = true;
        title = `🎉 Bắt được ${cow.crown ? "👑" : ""}${cow.icon} ${cow.name}!`;
        text = `Nhận ${cow.payout} xu.`;
        detail = `bắt được ${cow.name}, nhận ${cow.payout} xu`;
      } else if (outcome.result === "escaped") {
        title = "🐄 Bò thoát mất!";
        text = `${target?.name ?? "Con bò"} giãy đứt dây trước khi bạn kéo về.`;
        detail = `trúng ${target?.name ?? "bò"} nhưng bò giãy đứt dây chạy thoát`;
      } else {
        title = "💨 Trượt dây!";
        text = "Thòng lọng rơi xuống bãi cỏ trống. Lần sau may mắn hơn nhé!";
        detail = `thả dây trượt${target ? ` (nhắm ${target.name})` : ""}`;
      }
    } else if (game.id === "claw") {
      // Thành công: thú rời máy và vào Bộ sưu tập (chỉ gọi sau khi thú đã rơi vào cửa nhận quà).
      // Tuột: thú nằm lại trong máy ở chỗ rơi. Bản lưu cũ chưa có kết quả thì tính như gắp trượt.
      const outcome = session.outcome ?? { result: "empty", chance: 0 };
      const machine = data.clawMachine;
      const item = machine?.items.find((entry) => entry.uid === outcome.uid) ?? null;
      const plush = item ? plushOf(item.id) : null;
      if (outcome.result === "caught" && plush) {
        addPlush(data, plush);
        if (plush.rarity === "rare") recordAchievementFlags(state, [CLAW_RARE_ACHIEVEMENT]);
        machine.items = machine.items.filter((entry) => entry !== item);
        win = true;
        title = "🎉 Gắp được rồi! Cuối cùng cái càng cũng chịu hợp tác.";
        text = `${plush.icon} ${plush.name} (${rarityLabels[plush.rarity]}) đã vào Tài sản → Bộ sưu tập thú bông.`;
        detail = `gắp được ${plush.icon} ${plush.name} (${rarityLabels[plush.rarity]}, tỉ lệ ${formatPercent(outcome.chance)})`;
      } else {
        if (outcome.result === "slipped" && item && outcome.slipTo) Object.assign(item, outcome.slipTo);
        title = "😅 Tưởng chắc ăn, ai ngờ em nó chọn ở lại với bạn bè.";
        text = !plush ? "Càng hạ xuống chỗ trống, không chạm con thú nào."
          : outcome.result === "slipped" ? `${plush.icon} ${plush.name} tuột giữa đường và rơi lại trong máy.`
            : `Càng chạm ${plush.icon} ${plush.name} nhưng không giữ được.`;
        detail = !plush ? "gắp trúng chỗ trống"
          : `${outcome.result === "slipped" ? "tuột" : "không giữ được"} ${plush.icon} ${plush.name} (tỉ lệ ${formatPercent(outcome.chance)})`;
      }
    } else {
      const tickets = ticketsForScore(game, session.score);
      data.tickets += tickets;
      win = tickets > 0;
      title = `🏁 ${session.score} điểm!`;
      text = tickets ? `Nhận ${tickets} vé thưởng.` : `Cần từ ${game.tiers[1][0]} điểm để nhận vé. Thử lại nhé!`;
      detail = `${session.score} điểm, nhận ${tickets} vé`;
    }
    const log = pushLog(`${game.icon} Game Center · ${game.name}: ${detail}${wasInterrupted ? " (lượt bị gián đoạn)" : ""}. ` +
      `Phí ${session.cost} xu${session.happiness ? ` · Hạnh phúc +${session.happiness}` : ""}.`);
    save();
    renderLogEntry(log);
    checkAchievements();
    if (wasInterrupted) text += "\nLượt chơi bị gián đoạn nên được tính theo kết quả đã lưu lúc đó.";
    return { title, text, win };
  }
  function renderResult(session, result) {
    const game = gameOf(session.game);
    const enough = arcade().coins >= game.cost;
    const card = element("section", `dialog-card game-result gc-result ${result.win ? "is-win" : "is-lose"}`);
    card.append(element("h3", "", result.title), element("p", "game-summary gc-result-text", result.text));
    const actions = element("div", "license-actions");
    const again = button("shop-buy game-primary",
      !enough ? `Thiếu xu (cần ${game.cost})` : game.id === "cow" ? "🐄 Quay lại đồng cỏ" : `🔁 Chơi lại · −${game.cost} xu`,
      () => startGame(game.id));
    again.disabled = !enough || state.player.isAlive === false;
    actions.append(again);
    if (!enough) actions.append(button("shop-back", "🪙 Đổi thêm xu", renderExchange));
    actions.append(button("shop-back", "🕹️ Về Game Center", renderHub));
    card.append(actions);
    show(walletBar(), card);
  }

  // ---------- Quầy đổi quà ----------
  function renderPrizes() {
    const data = arcade();
    const card = element("section", "dialog-card");
    card.append(element("h3", "", "🎁 Quầy đổi quà"),
      element("p", "side-job-intro", "Dùng vé thưởng để đổi quà. Quà được cất vào Tài sản → Sưu tập và không quy đổi ra tiền."));
    const items = element("div", "shop-items");
    for (const prize of prizes) {
      const enough = data.tickets >= prize.tickets;
      const item = element("article", "shop-item");
      const redeemButton = button("shop-buy gc-redeem", enough ? `Đổi · ${prize.tickets} vé` : `Còn thiếu ${prize.tickets - data.tickets} vé`,
        () => askConfirm(`🎁 Đổi ${prize.name}?`, `Dùng ${prize.tickets} vé để đổi ${prize.icon} ${prize.name}.`, "Xác nhận đổi",
          () => redeem(prize)));
      redeemButton.dataset.prize = prize.id;
      redeemButton.disabled = !enough || state.player.isAlive === false;
      item.append(element("h4", "", `${prize.icon} ${prize.name}`),
        element("p", "shop-figures", `🎟️ ${prize.tickets} vé · Đang có: ${data.collection[prize.id] ?? 0}`), redeemButton);
      items.append(item);
    }
    card.append(items);
    show(toHub(), walletBar(), card);
  }
  function redeem(prize) {
    const data = arcade();
    if (state.player.isAlive === false || data.tickets < prize.tickets) return;
    data.tickets -= prize.tickets;
    data.collection[prize.id] = (data.collection[prize.id] ?? 0) + 1;
    const log = pushLog(`🎁 Game Center: đổi ${prize.icon} ${prize.name} bằng ${prize.tickets} vé.`);
    save();
    renderLogEntry(log);
    if (dialog.open) renderPrizes();
  }

  // ---------- Bộ sưu tập (Tài sản, Game Center) và tặng quà (Quan hệ) ----------
  // Thú bông theo thứ tự danh mục; món lạ (bản lưu từ phiên bản khác) vẫn hiện bằng tên/ảnh đã lưu.
  function ownedItems() {
    const data = arcade();
    const plushIds = [...plushies.map((plush) => plush.id), ...Object.keys(data.plushes).filter((id) => !plushOf(id))];
    const owned = plushIds.filter((id) => data.plushes[id]?.count > 0).map((id) => {
      const entry = data.plushes[id];
      return { kind: "plush", id, icon: entry.icon, name: entry.name, count: entry.count,
        label: `Thú bông · ${rarityLabels[entry.rarity] ?? entry.rarity}`, gift: plushOf(id)?.gift ?? 3 };
    });
    for (const prize of prizes) {
      const count = data.collection[prize.id] ?? 0;
      if (count) owned.push({ kind: "prize", id: prize.id, icon: prize.icon, name: prize.name, count, label: "Quà đổi vé", gift: prize.gift });
    }
    return owned;
  }
  function fillCollection(list) {
    list.replaceChildren();
    for (const item of ownedItems()) {
      const row = element("li", "shop-owned");
      row.dataset.count = item.count;
      row.append(element("span", "", `${item.icon} ${item.name}${item.count > 1 ? ` ×${item.count}` : ""} · ${item.label}`));
      list.append(row);
    }
  }
  // Màn Quan hệ: danh sách món có thể tặng người yêu / bạn đời (mỗi năm 1 lần).
  function fillGifts() {
    const list = $("relationship-gifts");
    const note = $("relationship-gifts-note");
    if (!list || !note) return;
    const data = arcade();
    const partner = state.player.partner;
    const gifted = data.giftAge === state.player.age;
    const owned = ownedItems();
    note.textContent = !owned.length ? "Chưa có thú bông hay quà nào. Ghé Hoạt động → Game Center để gắp thú nhé!"
      : !partner ? "Khi có người yêu hoặc bạn đời, bạn có thể tặng một món để tăng quan hệ."
        : gifted ? `Năm nay bạn đã tặng quà cho ${partner.name}. Sang năm tặng tiếp nhé!`
          : `Tặng ${partner.name} một món để tăng quan hệ (mỗi năm 1 lần).`;
    list.replaceChildren();
    for (const item of owned) {
      const row = element("li", "shop-owned");
      const gift = button("shop-sell gc-gift", partner ? `💝 Tặng · +${item.gift}%` : "💝 Tặng", () => askConfirm(`💝 Tặng ${item.name}?`,
        `Tặng ${partner.name} ${item.icon} ${item.name}: quan hệ +${item.gift}%.\nMỗi năm chỉ tặng được một lần; món quà sẽ rời Bộ sưu tập.`,
        "Tặng", () => {
          giftItem(item);
          fillGifts();
        }));
      gift.dataset.item = item.id;
      gift.disabled = !partner || gifted || state.player.isAlive === false;
      row.append(element("span", "", `${item.icon} ${item.name}${item.count > 1 ? ` ×${item.count}` : ""} · ${item.label}`), gift);
      list.append(row);
    }
  }
  function giftItem(item) {
    const player = state.player;
    const data = arcade();
    const partner = player.partner;
    const store = item.kind === "plush" ? null : data.collection;
    const have = item.kind === "plush" ? data.plushes[item.id]?.count ?? 0 : store[item.id] ?? 0;
    if (!partner || player.isAlive === false || data.giftAge === player.age || have <= 0) return;
    if (item.kind === "plush") {
      data.plushes[item.id].count -= 1;
      if (!data.plushes[item.id].count) delete data.plushes[item.id];
    } else {
      store[item.id] -= 1;
      if (!store[item.id]) delete store[item.id];
    }
    data.giftAge = player.age;
    const before = partner.relationship ?? 80;
    partner.relationship = Math.min(100, before + item.gift);
    const log = pushLog(`💝 Tặng ${item.icon} ${item.name} cho ${partner.name}: Quan hệ +${partner.relationship - before}% (hiện ${partner.relationship}%).`);
    save();
    renderLogEntry(log);
    // Cập nhật con số quan hệ đang hiện trong popup Quan hệ.
    const currentText = $("relationship-current");
    if (currentText) currentText.textContent = currentText.textContent.replace(/Quan hệ: \d+%/, `Quan hệ: ${partner.relationship}%`);
  }
  function renderCollection() {
    const partner = state.player.partner;
    const card = element("section", "dialog-card");
    const list = element("ul", "dialog-entries gc-collection");
    card.append(element("h3", "", "🧸 Bộ sưu tập"), element("p", "side-job-intro", partner
      ? `Muốn tặng ${partner.name}? Mở Quan hệ → Tặng thú bông (mỗi năm 1 lần). Đồ sưu tập không bán, không đổi ra xu hay tiền.`
      : "Đồ sưu tập không bán, không đổi ra xu hay tiền. Khi có người yêu hoặc bạn đời, bạn có thể tặng trong Quan hệ."), list);
    fillCollection(list);
    show(toHub(), walletBar(), card);
  }
  // Bản lưu đã có thú hiếm từ trước khi có thành tựu: ghi nhận luôn (main.js kiểm tra thành tựu sau khi khởi tạo).
  {
    const data = arcadeOf(state.player);
    const ownsRare = Object.entries(data.plushes).some(([id, entry]) => entry.count > 0 && (plushOf(id)?.rarity ?? entry.rarity) === "rare");
    if (ownsRare && state.player.achievementFlags?.[CLAW_RARE_ACHIEVEMENT] !== true) {
      recordAchievementFlags(state, [CLAW_RARE_ACHIEVEMENT]);
      save();
    }
  }
  const renderAssetCollection = () => fillCollection($("life-collection"));
  // Popup Tài sản / Quan hệ tự mở ở module của chúng; ở đây chỉ vẽ phần Game Center.
  $("assets").addEventListener("click", renderAssetCollection);
  $("relationships").addEventListener("click", fillGifts);
  renderAssetCollection();

  // Lượt còn dở từ lần mở trang trước (tải lại giữa chừng): tính ngay theo kết quả đã lưu.
  // Riêng gắp thú được giữ nguyên để chơi tiếp.
  const pending = arcadeOf(state.player).session;
  if (pending && pending.game !== "claw") {
    const result = settle(pending, true);
    if (result) interrupted = { session: pending, result };
  }

  // ---------- Mở / đóng popup ----------
  $("activity-game-center").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    dialog.showModal();
    if (arcade().session?.game === "claw") {
      renderClawMachine();
    } else if (interrupted) {
      renderResult(interrupted.session, interrupted.result);
      interrupted = null;
    } else {
      renderHub();
    }
  });
  // Đóng giữa chừng (nút ✕ hoặc phím Esc): dừng trò và tính lượt theo kết quả hiện có.
  // Gọi ngay khi bấm, không chờ sự kiện close (trình duyệt có thể hoãn sự kiện này); gọi lại cũng không sao.
  const abandon = () => {
    endGame();
    const session = arcade().session;
    // Gắp thú: giữ lượt (vị trí càng, thời gian, kết quả đã chốt) để chơi tiếp lần sau.
    if (session?.game === "claw") save();
    else if (session) settle(session, true);
  };
  // Đóng xong thì hiện thông báo thành tựu đang chờ (hộp thông báo không mở chồng lên popup khác).
  $("close-game-center").addEventListener("click", () => {
    abandon();
    dialog.close();
    checkAchievements();
  });
  dialog.addEventListener("cancel", abandon);
  dialog.addEventListener("close", () => {
    abandon();
    checkAchievements();
  });
}
