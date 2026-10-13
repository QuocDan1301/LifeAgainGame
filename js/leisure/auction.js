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
  function render() {
    const auction = state.player.auction;
    if (!auction) return onExit();
    const card = node('section', '', 'dialog-card auction-card');
    const done = auction.phase === 'result';
    card.append(node('div', auction.artifact.icon, 'auction-artifact'), node('h3', auction.artifact.name),
      node('p', auction.provenance, 'game-hint'), node('p', `Quan sát: ${auction.clue}`, 'auction-clue'));
    if (!done) {
      card.append(node('p', `Phiên ${auction.round + 1}/${AUCTION_ROUNDS} · Ví ${formatMoney(state.player.money)}`, 'shop-wallet'),
        node('p', `Giá ${auction.leader ? 'hiện tại' : 'khởi điểm'}: ${formatMoney(auction.price)}`, 'auction-price'),
        node('p', `Mỗi bước ${formatMoney(auction.step)}. Phiên kết thúc sau tối đa ${AUCTION_ROUNDS} vòng; nếu NPC trả cao hơn ở vòng cuối, bạn không mua được món đồ.`, 'game-hint'));
      const bidders = node('ul', '', 'auction-bidders');
      for (const bidder of auction.bidders) bidders.append(node('li', `${bidder.name} · ${bidder.note} · ${bidder.active ? (auction.leader === bidder.id ? 'Đang dẫn giá' : 'Đang theo dõi') : 'Đã bỏ cuộc'}`));
      card.append(bidders);
      if (auction.appraised) {
        card.append(node('p', `Thẩm định · Độ chắc chắn ${({ low: 'thấp', medium: 'vừa', high: 'cao' })[auction.appraisal.confidence]}: ${formatMoney(auction.appraisal.low)}–${formatMoney(auction.appraisal.high)}. ${auction.appraisal.note}`, 'auction-appraisal'));
      } else card.append(button(`🔎 Thuê chuyên gia · ${formatMoney(auction.fee)}`, () => change(current => {
        if (!appraiseAuction(current, state.player.money)) return false;
        state.player.money -= current.fee;
        return log(`🔎 Thẩm định ${current.artifact.name}: Tiền -${formatMoneyAmount(current.fee)} VNĐ.`);
      }), state.player.money < auction.fee));
      const normal = auction.leader ? auction.price + auction.step : auction.opening;
      const strong = auction.leader ? auction.price + auction.step * 3 : auction.opening + auction.step * 2;
      const actions = node('div', '', 'game-options auction-actions');
      actions.append(button(`Trả ${formatMoney(normal)}`, () => change(current => bidAuction(current, state.player.money)), normal > state.player.money, 'shop-buy game-primary auction-bid'),
        button(`Tăng mạnh · ${formatMoney(strong)}`, () => change(current => bidAuction(current, state.player.money, true)), strong > state.player.money),
        button('Bỏ cuộc', () => change(withdrawAuction)));
      card.append(actions);
      if (normal > state.player.money) card.append(node('p', 'Ví không đủ cho lần trả tiếp theo. Bạn có thể bỏ cuộc.', 'game-hint'));
    } else {
      const bought = auction.winner === 'player';
      card.append(node('h4', bought ? '🔨 Bạn thắng đấu giá!' : 'Phiên đấu giá đã kết thúc'),
        node('p', `${AUTHENTICITY[auction.authenticity]} · ${auction.age} năm · ${RARITY[auction.rarity]} · ${CONDITION[auction.condition]}`),
        node('p', `Giá trị xác thực: ${formatMoney(auction.value)}.`, 'auction-price'));
      if (bought) {
        const net = auction.value - auction.price - (auction.appraised ? auction.fee : 0);
        card.append(node('p', `Giá mua ${formatMoney(auction.price)}${auction.appraised ? ` · Phí thẩm định ${formatMoney(auction.fee)}` : ''}. Chênh lệch giá trị ${net >= 0 ? '+' : '-'}${formatMoney(Math.abs(net))}. Đã cất vào Tài sản; bán mới nhận tiền.`));
      } else card.append(node('p', `Bạn không phải trả tiền mua.${auction.appraised ? ` Phí thẩm định ${formatMoney(auction.fee)} đã sử dụng.` : ''}`));
      card.append(button(`Phiên mới · Còn ${playsLeft()} lượt`, () => {
        state.player.auction = null; open();
      }, playsLeft() <= 0, 'shop-buy game-primary auction-next'));
    }
    const history = node('ol', '', 'auction-log'); history.setAttribute('aria-live', 'polite');
    for (const message of auction.messages.slice(-8)) history.append(node('li', message));
    card.append(history);
    body.replaceChildren(button('← Chọn trò khác', onExit, false, 'shop-back'), card);
  }
  function open() {
    if (isSavePaused() || state.player.isAlive === false) return;
    if (state.player.auction) return render();
    if (state.player.age < minAge || playsLeft() <= 0) return onExit();
    const card = node('section', '', 'dialog-card auction-card');
    card.append(node('h3', '🏺 Đấu giá cổ vật'),
      node('p', 'Quan sát cổ vật, thuê chuyên gia nếu cần, rồi trả giá với ba đối thủ. Cùng một mẫu đồ có thể là cổ vật thật, phục chế hoặc hàng giả ở mỗi phiên.'),
      node('p', 'Mở phiên dùng 1 lượt chơi, kể cả khi bỏ cuộc. Chỉ trả tiền mua nếu thắng; phí thẩm định không hoàn lại. Tối đa 6 vòng trả giá. Đóng cửa sổ rồi mở lại để tiếp tục phiên đang dở.'),
      button('Mở phiên · 1 lượt chơi', () => {
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
