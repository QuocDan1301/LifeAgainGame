export const AUCTION_ROUNDS = 6;
export const ARTIFACTS = [
  { id: 'vase', icon: '🏺', name: 'Bình gốm men lam' },
  { id: 'coin', icon: '🪙', name: 'Đồng tiền cổ' },
  { id: 'painting', icon: '🖼️', name: 'Tranh lụa thủ công' },
  { id: 'teapot', icon: '🫖', name: 'Ấm trà đất nung' },
  { id: 'scroll', icon: '📜', name: 'Cuộn thư pháp' },
  { id: 'mirror', icon: '🪞', name: 'Gương đồng chạm hoa' },
  { id: 'fan', icon: '🪭', name: 'Quạt giấy vẽ tay' },
  { id: 'bowl', icon: '🥣', name: 'Bát sứ hoa văn' },
  { id: 'lamp', icon: '🪔', name: 'Đèn dầu trang trí' },
  { id: 'clock', icon: '🕰️', name: 'Đồng hồ để bàn' },
  { id: 'statue', icon: '🗿', name: 'Tượng đá nhỏ' },
  { id: 'chest', icon: '🧰', name: 'Hộp gỗ khảm trai' },
];
export const AUTHENTICITY = { fake: 'Hàng giả', replica: 'Bản phục chế', genuine: 'Cổ vật thật' };
export const RARITY = ['Phổ biến', 'Hiếm', 'Độc bản'];
export const CONDITION = ['Hư hại', 'Nguyên vẹn', 'Bảo quản tốt'];
const money = value => Math.max(1000, Math.round(value / 1000) * 1000);
const choose = (items, random) => items[Math.min(items.length - 1, Math.floor(random() * items.length))];

// Identity is sampled separately from truth: every catalog item can have every outcome.
export function createAuction(random = Math.random) {
  const artifact = choose(ARTIFACTS, random);
  const authenticity = choose(['fake', 'replica', 'genuine'], random);
  const rarity = Math.floor(random() * 3), condition = Math.floor(random() * 3);
  const opening = choose([50_000, 100_000, 200_000, 500_000], random);
  const value = money(opening * ({ fake: 0.12, replica: 0.65, genuine: 2.5 }[authenticity]) *
    [1, 1.8, 3][rarity] * [0.45, 1, 1.25][condition] * (0.8 + random() * 0.4));
  const age = authenticity === 'genuine' ? 80 + Math.floor(random() * 220) : 1 + Math.floor(random() * 30);
  const provenance = choose(['Từ một căn nhà cũ được dọn lại.', 'Do một người sưu tầm gửi bán.', 'Thu mua tại một chợ đồ cũ.', 'Có trong một lô đồ gia đình để lại.'], random);
   
   
  const clues = {
    fake: ['Hoa văn có nét không đồng nhất.', 'Lớp phủ có chỗ đậm, chỗ nhạt.', 'Bề mặt có vết mòn không đều.', 'Một số chi tiết trông khá mới.'],
    replica: ['Hoa văn có nét không đồng nhất.', 'Lớp phủ có chỗ đậm, chỗ nhạt.', 'Các đường nét được làm khá kỹ.', 'Có dấu sửa chữa ở phần khuất.'],
    genuine: ['Bề mặt có vết mòn không đều.', 'Một số chi tiết trông khá mới.', 'Các đường nét được làm khá kỹ.', 'Có dấu sửa chữa ở phần khuất.'],
  }[authenticity];
  const clue = choose(clues, random);
  const confidence = choose(['low', 'medium', 'high'], random);
  const width = { low: 0.8, medium: 0.5, high: 0.25 }[confidence];
  const estimate = value * (0.85 + random() * 0.3);
  const appraisal = { confidence, low: money(estimate * (1 - width)), high: money(estimate * (1 + width)),
    note: choose(['Cần đối chiếu thêm nguồn gốc và chất liệu.', 'Có dấu hiệu đáng chú ý, nhưng ảnh hưởng của sửa chữa còn chưa rõ.', 'Chi tiết chế tác giúp thu hẹp giá ước tính; vẫn có sai số.'], random) };
  const bidders = [
    { id: 'collector', name: 'Nhà sưu tầm', note: 'Thích món hiếm', factor: 0.75 + rarity * 0.2 },
    { id: 'dealer', name: 'Tay buôn', note: 'Ưu tiên mua có lời', factor: 0.55 },
    { id: 'tycoon', name: 'Đại gia', note: 'Sẵn sàng trả cao', factor: 1.15 },
  ].map(({ factor, ...bidder }) => {
    const budget = money(opening * (1 + random() * 12));
    return { ...bidder, budget, limit: Math.min(budget, money(value * factor * (0.5 + random() * 1.5))), active: true };
  });
  return { id: crypto.randomUUID(), artifact, authenticity, rarity, condition, age, value, opening,
    step: money(opening * 0.2), fee: money(opening * 0.1), provenance, clue, appraisal, appraised: false,
    bidders, price: opening, leader: null, round: 0, phase: 'active', winner: null, messages: ['Phiên đấu giá bắt đầu.'] };
}

export function appraiseAuction(auction, wallet) {
  if (auction.phase !== 'active' || auction.appraised || wallet < auction.fee) return false;
  auction.appraised = true;
  return true;
}

export function bidAuction(auction, wallet, strong = false) {
  if (auction.phase !== 'active') return false;
  const bid = auction.leader ? auction.price + auction.step * (strong ? 3 : 1) : auction.opening + (strong ? auction.step * 2 : 0);
  if (bid > wallet) return false;
  auction.price = bid; auction.leader = 'player'; auction.round++;
  auction.messages.push(`Bạn trả ${bid}đ.`);
  const next = bid + auction.step;
  const willing = auction.bidders.filter(bidder => bidder.active && bidder.limit >= next);
  for (const bidder of auction.bidders) {
    if (bidder.active && bidder.limit < next) { bidder.active = false; auction.messages.push(`${bidder.name} bỏ cuộc.`); }
  }
  if (!willing.length) { auction.phase = 'result'; auction.winner = 'player'; return true; }
  const bidder = willing.reduce((best, item) => item.limit > best.limit ? item : best);
  auction.price = next; auction.leader = bidder.id;
  auction.messages.push(`${bidder.name} trả ${next}đ.`);
  if (auction.round >= AUCTION_ROUNDS) { auction.phase = 'result'; auction.winner = bidder.id; }
  return true;
}

export function withdrawAuction(auction) {
  if (auction.phase !== 'active') return false;
  auction.phase = 'result'; auction.winner = auction.leader;
  auction.messages.push('Bạn rời phiên đấu giá.');
  return true;
}
