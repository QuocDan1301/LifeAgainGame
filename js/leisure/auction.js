import { saveGame, isSavePaused } from '../core/save-store.js';
import { formatMoney, formatMoneyAmount } from '../core/money-format.js';
import { askConfirm } from '../ui/confirm-dialog.js';
import { createAuction, appraiseAuction, bidAuction, withdrawAuction, AUCTION_ROUNDS, AUTHENTICITY, RARITY, CONDITION } from './auction-core.js';

export function initAuction(state, { body, playsLeft, usePlay, minAge, renderMoney, renderLogEntry, onExit }) {
  const node = (tag, text, className) => {
    const element = document.createElement(tag); element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const button = (text, action, disabled = false, className = 'game-option') => {
    const element = node('button', text, className); element.type = 'button'; element.disabled = disabled;
    element.addEventListener('click', () => { if (!isSavePaused()) action(); }); return element;
  };
  const save = () => saveGame(state);
  function log(content) {
    const entry = { age: state.player.age, content, summary: content };
    state.logs.push(entry); return entry;
  }
  function finish(auction) {
    if (auction.phase !== 'result' || auction.settled) return null;
    auction.settled = true;
    if (auction.winner === 'player') {
      state.player.money -= auction.price;
      state.player.auctionItems = [...(state.player.auctionItems ?? []), {
        uid: auction.id, ...auction.artifact, authenticity: auction.authenticity, rarity: auction.rarity,
        condition: auction.condition, age: auction.age, value: auction.value, paid: auction.price,
        receivedAtAge: state.player.age,
      }];
      return log(`🏺 Đấu giá cổ vật: mua ${auction.artifact.name} (${AUTHENTICITY[auction.authenticity]}) với giá ${formatMoneyAmount(auction.price)} VNĐ, trị giá ${formatMoneyAmount(auction.value)} VNĐ. Đã cất vào Tài sản.`);
    }
    return log(`🏺 Đấu giá cổ vật: rời phiên ${auction.artifact.name}, không mất tiền mua${auction.appraised ? `; đã trả ${formatMoneyAmount(auction.fee)} VNĐ phí thẩm định` : ''}.`);
  }
  function change(action) {
    const auction = state.player.auction;
    if (!auction || state.player.isAlive === false || isSavePaused()) return;
    const actionResult = action(auction);
    if (!actionResult) return;
    const entry = finish(auction);
    save(); renderMoney();
    if (typeof actionResult === 'object') renderLogEntry(actionResult);
    if (entry) renderLogEntry(entry);
    render();
  }
   
  const formatMessage = message => message.replace(/(\d{4,})đ/g, (_, amount) => formatMoney(Number(amount)));
  const messageIcon = message => message.startsWith('Phiên đấu giá bắt đầu') ? '🔔'
    : message.startsWith('Bạn trả') ? '🙋' : message.startsWith('Bạn rời') ? '👋'
    : message.includes('bỏ cuộc') ? '🚪' : '✋';
  const RIVAL_ICONS = { collector: '🧐', dealer: '💼', tycoon: '🎩' };
  const CONFIDENCE = { low: 'thấp', medium: 'vừa', high: 'cao' };
  const leaderName = auction => auction.leader === 'player' ? 'Bạn'
    : auction.bidders.find(bidder => bidder.id === auction.leader)?.name ?? null;

  function stage(auction, extra = []) {
    const spotlight = node('div', '', 'auction-spotlight');
    spotlight.append(node('div', auction.artifact.icon, 'auction-artifact'), ...extra);
    const wrap = node('div', '', 'auction-stage');
    wrap.append(spotlight, node('h3', auction.artifact.name, 'auction-name'), node('p', auction.provenance, 'auction-provenance'));
    return wrap;
  }
  function rounds(auction) {
    const track = node('ol', '', 'auction-rounds');
    track.setAttribute('aria-label', `Đã qua ${auction.round}/${AUCTION_ROUNDS} vòng trả giá`);
    for (let index = 0; index < AUCTION_ROUNDS; index++) {
      const dot = node('li', '', index < auction.round ? 'is-done' : index === auction.round ? 'is-current' : '');
      dot.setAttribute('aria-hidden', 'true');
      track.append(dot);
    }
    return track;
  }
  function priceBoard(auction) {
    const board = node('div', '', 'auction-board');
    const leader = leaderName(auction);
    const leaderText = !leader ? 'Chưa ai trả giá'
      : auction.leader === 'player' ? '🙋 Bạn đang dẫn giá' : `${RIVAL_ICONS[auction.leader] ?? '✋'} ${leader} đang dẫn giá`;
    board.append(node('span', auction.leader ? 'Giá hiện tại' : 'Giá khởi điểm', 'auction-board-label'),
      node('strong', formatMoney(auction.price), 'auction-price'),
      node('span', leaderText, `auction-leader${auction.leader === 'player' ? ' is-player' : ''}`));
    const meta = node('div', '', 'auction-board-meta');
    meta.append(rounds(auction), node('span', `Vòng ${Math.min(auction.round + 1, AUCTION_ROUNDS)}/${AUCTION_ROUNDS} · Mỗi bước ${formatMoney(auction.step)}`));
    board.append(meta);
    return board;
  }
  function rivals(auction) {
    const list = node('ul', '', 'auction-bidders');
    for (const bidder of auction.bidders) {
      const status = !bidder.active ? 'out' : auction.leader === bidder.id ? 'leading' : 'watching';
      const item = node('li', '', `auction-rival is-${status}`);
      const text = node('span', '', 'auction-rival-text');
      text.append(node('strong', bidder.name), node('small', bidder.note));
      item.append(node('span', RIVAL_ICONS[bidder.id] ?? '👤', 'auction-rival-icon'), text,
        node('span', { out: 'Đã bỏ cuộc', leading: 'Đang dẫn giá', watching: 'Đang theo dõi' }[status], 'auction-rival-status'));
      list.append(item);
    }
    return list;
  }
  function clue(auction) {
    const box = node('div', '', 'auction-clue');
    box.append(node('span', '🔍 Quan sát', 'auction-section-label'), node('p', auction.clue));
    return box;
  }
  function appraisal(auction) {
    const box = node('div', '', 'auction-appraisal');
    const head = node('div', '', 'auction-appraisal-head');
    head.append(node('span', '🧑‍🔬 Chuyên gia thẩm định', 'auction-section-label'),
      node('span', `Độ chắc chắn ${CONFIDENCE[auction.appraisal.confidence]}`, `auction-confidence is-${auction.appraisal.confidence}`));
    box.append(head, node('p', `${formatMoney(auction.appraisal.low)} – ${formatMoney(auction.appraisal.high)}`, 'auction-range'),
      node('p', auction.appraisal.note, 'auction-note'));
    return box;
  }
  function history(auction) {
    const wrap = node('div', '', 'auction-history');
    const list = node('ol', '', 'auction-log'); list.setAttribute('aria-live', 'polite');
    for (const message of auction.messages.slice(-8)) {
      const item = node('li', '');
      item.append(node('span', messageIcon(message), 'auction-log-icon'), node('span', formatMessage(message)));
      list.append(item);
    }
    wrap.append(node('h4', '📜 Diễn biến'), list);
    return wrap;
  }
  function render() {
    const auction = state.player.auction;
    if (!auction) return onExit();
    const card = node('section', '', 'dialog-card auction-card auction-house');
    if (auction.phase !== 'result') {
      card.append(stage(auction), priceBoard(auction), clue(auction));
      if (auction.appraised) card.append(appraisal(auction));
      else card.append(button(`🔎 Thuê chuyên gia · ${formatMoney(auction.fee)}`, () => change(current => {
        if (!appraiseAuction(current, state.player.money)) return false;
        state.player.money -= current.fee;
        return log(`🔎 Thẩm định ${current.artifact.name}: Tiền -${formatMoneyAmount(current.fee)} VNĐ.`);
      }), state.player.money < auction.fee, 'game-option auction-appraise'));
      card.append(rivals(auction));
      const normal = auction.leader ? auction.price + auction.step : auction.opening;
      const strong = auction.leader ? auction.price + auction.step * 3 : auction.opening + auction.step * 2;
      card.append(node('p', `💰 Ví: ${formatMoney(state.player.money)}`, 'auction-wallet'));
      const actions = node('div', '', 'game-options auction-actions');
      actions.append(button(`🔨 Trả ${formatMoney(normal)}`, () => change(current => bidAuction(current, state.player.money)), normal > state.player.money, 'shop-buy game-primary auction-bid'),
        button(`Tăng mạnh · ${formatMoney(strong)}`, () => change(current => bidAuction(current, state.player.money, true)), strong > state.player.money, 'game-option auction-strong'),
        button('Bỏ cuộc', () => change(withdrawAuction), false, 'game-option auction-withdraw'));
      card.append(actions, node('p', normal > state.player.money
        ? 'Ví không đủ cho lần trả tiếp theo. Bạn có thể bỏ cuộc.'
        : `Tối đa ${AUCTION_ROUNDS} vòng. Nếu đối thủ trả cao hơn ở vòng cuối, món đồ thuộc về họ.`, 'game-hint auction-rule'));
    } else {
      const bought = auction.winner === 'player';
      const winner = auction.bidders.find(bidder => bidder.id === auction.winner);
      const banner = node('div', '', `auction-result-banner ${bought ? 'is-win' : 'is-lose'}`);
      banner.append(node('h4', bought ? '🔨 Bạn thắng đấu giá!' : 'Phiên đấu giá đã kết thúc'),
        node('p', bought ? `Chốt giá ${formatMoney(auction.price)}.`
          : winner ? `${RIVAL_ICONS[winner.id] ?? '👤'} ${winner.name} mua với giá ${formatMoney(auction.price)}.` : 'Không ai mua món đồ này.'));
      card.append(banner, stage(auction, [node('span', AUTHENTICITY[auction.authenticity], `auction-stamp is-${auction.authenticity}`)]));
      const facts = node('dl', '', 'auction-facts');
      for (const [label, value] of [['Tuổi đời', `${auction.age} năm`], ['Độ hiếm', RARITY[auction.rarity]], ['Tình trạng', CONDITION[auction.condition]]]) {
        const fact = node('div', '');
        fact.append(node('dt', label), node('dd', value));
        facts.append(fact);
      }
      card.append(facts, node('p', `Giá trị xác thực: ${formatMoney(auction.value)}.`, 'auction-price auction-value'));
      const ledger = node('dl', '', 'auction-ledger');
      const row = (label, value, className = '') => {
        const line = node('div', '', className);
        line.append(node('dt', label), node('dd', value));
        ledger.append(line);
      };
      if (bought) {
        const net = auction.value - auction.price - (auction.appraised ? auction.fee : 0);
        row('Giá mua', `-${formatMoney(auction.price)}`);
        if (auction.appraised) row('Phí thẩm định', `-${formatMoney(auction.fee)}`);
        row('Chênh lệch giá trị', `${net >= 0 ? '+' : '-'}${formatMoney(Math.abs(net))}`, `auction-net ${net >= 0 ? 'is-gain' : 'is-loss'}`);
        card.append(ledger, node('p', 'Đã cất vào Tài sản → Cổ vật; bán mới nhận tiền.', 'game-hint'));
      } else {
        if (auction.appraised) {
          row('Phí thẩm định', `-${formatMoney(auction.fee)}`);
          card.append(ledger);
        }
        card.append(node('p', 'Bạn không phải trả tiền mua.', 'game-hint'));
      }
      card.append(button(`Phiên mới · Còn ${playsLeft()} lượt`, () => {
        state.player.auction = null; open();
      }, playsLeft() <= 0, 'shop-buy game-primary auction-next'));
    }
    card.append(history(auction));
    body.replaceChildren(button('← Chọn trò khác', onExit, false, 'shop-back'), card);
  }
  function open() {
    if (isSavePaused() || state.player.isAlive === false) return;
    if (state.player.auction) return render();
    if (state.player.age < minAge || playsLeft() <= 0) return onExit();
    const card = node('section', '', 'dialog-card auction-card auction-house');
    const hero = node('div', '', 'auction-stage auction-intro');
    const spotlight = node('div', '', 'auction-spotlight');
    spotlight.append(node('div', '🏛️', 'auction-artifact'));
    hero.append(spotlight, node('h3', '🏺 Đấu giá cổ vật', 'auction-name'),
      node('p', 'Cùng một mẫu đồ có thể là cổ vật thật, bản phục chế hay hàng giả. Nhìn kỹ rồi hãy trả giá.', 'auction-provenance'));
    const rules = node('ul', '', 'auction-rules');
    for (const [icon, text] of [
      ['🔍', 'Quan sát manh mối. Mỗi manh mối chỉ loại được một khả năng.'],
      ['🧑‍🔬', 'Thuê chuyên gia để biết khoảng giá ước tính. Phí không hoàn lại.'],
      ['🔨', `Trả giá với ba đối thủ, tối đa ${AUCTION_ROUNDS} vòng. Chỉ trả tiền mua khi thắng.`],
      ['🎟️', 'Mở phiên dùng 1 lượt chơi, kể cả khi bỏ cuộc. Đóng cửa sổ rồi mở lại để chơi tiếp phiên dở.'],
    ]) {
      const item = node('li', '');
      item.append(node('span', icon, 'auction-rule-icon'), node('span', text));
      rules.append(item);
    }
    card.append(hero, rules, button('Mở phiên · 1 lượt chơi', () => {
      if (state.player.auction || playsLeft() <= 0 || state.player.age < minAge || state.player.isAlive === false) return;
      state.player.auction = createAuction(); usePlay(); save(); render();
    }, false, 'shop-buy game-primary auction-start'));
    body.replaceChildren(button('← Chọn trò khác', onExit, false, 'shop-back'), card);
  }
  function renderAssets() {
    const list = document.getElementById('life-auction-items');
    list.replaceChildren();
    const items = state.player.auctionItems ?? [];
    list.dataset.empty = String(items.length === 0);
    for (const item of items) {
      const row = node('li', '', 'shop-owned');
      row.append(node('span', `${item.icon} ${item.name} · ${AUTHENTICITY[item.authenticity]} · ${RARITY[item.rarity]} · ${CONDITION[item.condition]} · ${item.age} năm. Mua lúc ${item.receivedAtAge} tuổi với giá ${formatMoney(item.paid)}.`));
      row.append(button(`Bán · ${formatMoney(item.value)}`, () => askConfirm(`Bán ${item.name}?`, `Nhận ${formatMoney(item.value)} và đưa món đồ ra khỏi bộ sưu tập.`, 'Xác nhận bán', () => {
        if (isSavePaused() || state.player.isAlive === false || !(state.player.auctionItems ?? []).some(entry => entry.uid === item.uid)) return;
        state.player.auctionItems = state.player.auctionItems.filter(entry => entry.uid !== item.uid);
        state.player.money += item.value;
        const entry = log(`🏺 Bán ${item.name}: Tiền +${formatMoneyAmount(item.value)} VNĐ.`);
        save(); renderMoney(); renderLogEntry(entry); renderAssets();
      }), state.player.isAlive === false, 'shop-sell auction-sell'));
      list.append(row);
    }
  }
  document.getElementById('assets').addEventListener('click', renderAssets);
  return { open };
}
