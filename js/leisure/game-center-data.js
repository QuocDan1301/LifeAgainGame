// Game Center: cấu hình tiền tệ, trò chơi, quà tặng và các hàm tính thưởng (không đụng giao diện).
// Xu mua bằng tiền game, dùng để chơi; vé thưởng dùng đổi quà. Cả hai lưu trong player.arcade
// theo từng nhân vật, giữ qua các năm và không đổi ngược ra tiền.
export const COIN_VALUE = 10_000;
export const coinPacks = [
  { coins: 10, price: 100_000 },
  { coins: 50, price: 500_000 },
  { coins: 100, price: 1_000_000 },
];
// Mỗi năm, vài lượt chơi đầu tiên được cộng hạnh phúc dù thắng hay thua.
export const HAPPY_PLAYS_PER_YEAR = 3;

export const arcadeGames = [
  { id: "cow", icon: "🐄", name: "Kéo bò", cost: 1, ready: true, reward: "xu", tagline: "Quăng một sợi dây, thử một chút may!",
    rules: [
      "Chạm vào một con bò để chọn (hoặc phím mũi tên). Số trên đầu bò là xu thưởng.",
      "Bấm Thả dây (hoặc phím cách): mỗi lần thả tốn 1 xu.",
      "Kết quả được bốc ngẫu nhiên theo tỉ lệ của từng loại bò ngay khi thả dây: trượt dây, trúng nhưng bò thoát, hoặc bắt được.",
      "Bắt được thì nhận đúng số xu trên đầu bò. Nút ✊ khi kéo chỉ để thêm phần hồi hộp, nhấn nhiều hay ít không đổi kết quả.",
      "Bò thưởng càng cao càng ít xuất hiện và tỉ lệ bắt được càng thấp.",
    ] },
  { id: "claw", icon: "🧸", name: "Gắp thú", cost: 3, ready: true, reward: "thú bông", tagline: "Căn thật chuẩn, gắp thật chắc!",
    rules: [
      "Mỗi lượt 3 xu, được gắp một lần. Xem các món trong máy rồi bấm “Chơi — 3 xu”.",
      "Máy nhìn từ trên xuống. Dùng 4 nút ◀ ▶ ▲ ▼ (hoặc phím mũi tên) để đưa càng; bóng tròn dưới càng là vùng gắp.",
      "Có 20 giây để căn. Bấm GẮP (hoặc phím cách) để hạ càng; hết giờ càng tự gắp tại chỗ.",
      "Càng lắc lư khá mạnh khi căn: canh lúc bóng tròn nằm đúng giữa thú rồi mới gắp. Căn thật chuẩn: thú phổ thông 45%, thú lớn 30%, thú hiếm 15%. Lệch một chút tỉ lệ đã giảm nhanh; ngoài vùng gắp là 0%.",
      "Gắp được thì thú rơi vào cửa nhận quà và vào Tài sản → Bộ sưu tập thú bông. Thú bông tặng được trong Quan hệ.",
      "Thú đã gắp được sẽ rời máy; sang tuổi mới máy được bổ sung thú.",
    ] },
  { id: "basketball", icon: "🏀", name: "Bóng rổ", cost: 2, ready: true, reward: "vé", duration: 30, tagline: "Rổ chạy, bóng bay, tim đập!",
    tiers: [[0, 0], [10, 3], [20, 6], [30, 10]],
    rules: [
      "Có 30 giây. Bấm Ném (hoặc phím cách, hoặc chạm vào sân) để ném bóng thẳng lên.",
      "Rổ chạy qua lại và nhanh dần, hãy canh lúc rổ tới giữa.",
      "Mỗi quả vào rổ +2 điểm; trong 5 giây cuối +3 điểm.",
    ] },
  { id: "whack", icon: "🔨", name: "Đập chuột", cost: 2, ready: true, reward: "vé", duration: 30, tagline: "Nhanh tay, tinh mắt, đừng đập nhầm!",
    tiers: [[0, 0], [15, 3], [30, 6], [45, 10]],
    rules: [
      "Có 30 giây. Chạm vào chuột vừa ló lên khỏi hang (hoặc phím 1–9).",
      "🐭 Chuột thường +1 · 🌟 Chuột vàng +3 (hiếm, lặn rất nhanh).",
      "💣 Bom và 🐱 Mèo là mục tiêu giả: đập nhầm −2 điểm (điểm không dưới 0).",
      "Chuột ló lên ngày càng nhanh.",
    ] },
];
export const gameOf = (id) => arcadeGames.find((game) => game.id === id);

// Kéo bò: payout là số xu nhận khi bắt được (phí 1 xu mỗi lần thả dây tính riêng).
// chance: tỉ lệ xuất hiện trên đồng cỏ · catchChance: tỉ lệ bắt được cho cả lượt.
// payout × catchChance = 0,75 với mọi loại bò: trung bình mỗi xu bỏ ra nhận về 0,75 xu.
// size: bề ngang ở làn gần nhất (px trên sân rộng 320px) · struggle: độ giãy khi kéo (chỉ là hoạt ảnh).
export const LASSO_FLIGHT = 0.45;
// Trong các lần không bắt được: 40% là trúng dây nhưng bò thoát, còn lại là trượt dây.
export const COW_ESCAPE_SHARE = 0.4;
export const cowTypes = [
  { id: "dairy", icon: "🐄", name: "Bò sữa", payout: 2, chance: 0.4, catchChance: 0.375, size: 60, struggle: 0 },
  { id: "brown", icon: "🐂", name: "Bò nâu", payout: 3, chance: 0.27, catchChance: 0.25, size: 56, struggle: 0.4, tag: "#c98a4b" },
  { id: "buffalo", icon: "🐃", name: "Bò đen", payout: 5, chance: 0.18, catchChance: 0.15, size: 54, struggle: 0.6, tag: "#5a6b78" },
  { id: "gold", icon: "🐄", name: "Bò vàng", payout: 10, chance: 0.1, catchChance: 0.075, size: 48, struggle: 0.8,
    tag: "#f2b705", glow: "#ffd23f" },
  { id: "crown", icon: "🐄", name: "Bò vương miện", payout: 20, chance: 0.05, catchChance: 0.0375, size: 42, struggle: 1,
    tag: "#e0457b", glow: "#ff9fd0", crown: true },
];
export const cowOf = (id) => cowTypes.find((cow) => cow.id === id);
export const formatPercent = (rate) => `${String(Math.round(rate * 10000) / 100).replace(".", ",")}%`;
// Bốc kết quả cả lượt một lần duy nhất khi thả dây; kết quả được lưu ngay cùng lượt chơi.
export function rollCowOutcome(cow, random = Math.random) {
  const roll = random();
  if (roll < cow.catchChance) return { result: "caught", cow: cow.id };
  const escaped = roll < cow.catchChance + (1 - cow.catchChance) * COW_ESCAPE_SHARE;
  return { result: escaped ? "escaped" : "miss", cow: cow.id };
}

// Gắp thú: ba loại thú. grab là tỉ lệ thành công khi càng căn chính giữa thú; gift là % quan hệ khi tặng.
export const plushRarities = {
  common: { label: "Phổ thông", grab: 0.45, gift: 3 },
  big: { label: "Thú lớn", grab: 0.3, gift: 5 },
  rare: { label: "Hiếm", grab: 0.15, gift: 8 },
};
export const rarityLabels = Object.fromEntries(Object.entries(plushRarities).map(([id, rarity]) => [id, rarity.label]));
// radius: bán kính thân thú trên mặt máy (px, máy rộng 320) · chance: tỉ lệ xuất hiện khi bổ sung máy.
export const plushies = [
  { id: "teddy", icon: "🧸", name: "Gấu bông", rarity: "common", radius: 20, chance: 0.14 },
  { id: "bunny", icon: "🐰", name: "Thỏ bông", rarity: "common", radius: 20, chance: 0.13 },
  { id: "kitty", icon: "🐱", name: "Mèo bông", rarity: "common", radius: 20, chance: 0.13 },
  { id: "puppy", icon: "🐶", name: "Cún bông", rarity: "common", radius: 20, chance: 0.12 },
  { id: "chick", icon: "🐥", name: "Gà con bông", rarity: "common", radius: 18, chance: 0.1 },
  { id: "panda", icon: "🐼", name: "Gấu trúc lớn", rarity: "big", radius: 29, chance: 0.1 },
  { id: "dino", icon: "🦖", name: "Khủng long lớn", rarity: "big", radius: 29, chance: 0.08 },
  { id: "giraffe", icon: "🦒", name: "Hươu cao cổ lớn", rarity: "big", radius: 28, chance: 0.07 },
  { id: "unicorn", icon: "🦄", name: "Kỳ lân bông", rarity: "rare", radius: 16, chance: 0.05 },
  { id: "dragon", icon: "🐉", name: "Rồng con bông", rarity: "rare", radius: 16, chance: 0.04 },
  { id: "fox", icon: "🦊", name: "Cáo lửa bông", rarity: "rare", radius: 16, chance: 0.04 },
].map((plush) => ({ ...plush, gift: plushRarities[plush.rarity].gift }));
export const plushOf = (id) => plushies.find((plush) => plush.id === id);
// Thành tựu khi gắp được thú thuộc loại hiếm nhất.
export const CLAW_RARE_ACHIEVEMENT = "claw-rare-plush";

// Quầy đổi quà (giá bằng vé). Quà cất vào Tài sản, không quy đổi ra tiền.
export const prizes = [
  { id: "sticker", icon: "🌟", name: "Sticker lấp lánh", tickets: 20, gift: 3 },
  { id: "keychain", icon: "🔑", name: "Móc khóa", tickets: 60, gift: 3 },
  { id: "big-bear", icon: "🐻", name: "Gấu bông lớn", tickets: 150, gift: 5 },
  { id: "photo-frame", icon: "🖼️", name: "Khung ảnh", tickets: 300, gift: 5 },
  { id: "arcade-model", icon: "🕹️", name: "Mô hình máy arcade", tickets: 600, gift: 8 },
  { id: "trophy", icon: "🏆", name: "Cúp vô địch", tickets: 1000, gift: 8 },
];
export const collectibles = [...plushies, ...prizes];
export const collectibleOf = (id) => collectibles.find((item) => item.id === id);

// collection: quà đổi vé { id: số lượng }. plushes: Bộ sưu tập thú bông { id: { name, icon, rarity, count } }.
// clawMachine: thú đang nằm trong máy gắp { age, items: [{ uid, id, x, y }] }.
export const createArcade = () => ({
  coins: 0, tickets: 0, collection: {}, plushes: {}, clawMachine: null, plays: null, giftAge: null, session: null,
});
export function addPlush(arcade, plush, count = 1) {
  const entry = arcade.plushes[plush.id] ?? { count: 0 };
  arcade.plushes[plush.id] = { name: plush.name, icon: plush.icon, rarity: plush.rarity, count: entry.count + count };
}
// Bản lưu cũ chưa có Game Center: tạo mới, hoặc bổ sung trường còn thiếu (giữ nguyên object đang có).
// Bản lưu cũ để thú bông chung với quà: chuyển sang Bộ sưu tập thú bông.
export function arcadeOf(player) {
  const defaults = createArcade();
  player.arcade ??= defaults;
  for (const [key, value] of Object.entries(defaults)) player.arcade[key] ??= value;
  for (const [id, count] of Object.entries(player.arcade.collection)) {
    const plush = plushOf(id);
    if (!plush) continue;
    addPlush(player.arcade, plush, count);
    delete player.arcade.collection[id];
  }
  return player.arcade;
}
export const playsThisYear = (player) => (player.arcade?.plays?.age === player.age ? player.arcade.plays.count : 0);

export const ticketsForScore = (game, score) =>
  game.tiers.reduce((tickets, [minimum, reward]) => (score >= minimum ? reward : tickets), 0);
export const describeTiers = (game) => game.tiers.map(([minimum, reward], index) => {
  const next = game.tiers[index + 1];
  return [next ? `${minimum}–${next[0] - 1} điểm` : `Từ ${minimum} điểm`, `${reward} vé`];
});

export function pickWeighted(entries, random = Math.random) {
  let roll = random();
  for (const entry of entries) {
    roll -= entry.chance;
    if (roll < 0) return entry;
  }
  return entries.at(-1);
}

// ---------- Máy gắp thú (nhìn từ trên xuống) ----------
// Mặt máy 320×320; cửa nhận quà ở góc dưới trái. CLAW_REACH là bán kính vùng gắp (bóng dưới càng).
export const CLAW_BOX = { left: 14, top: 14, right: 306, bottom: 306 };
export const CLAW_CHUTE = { x: 14, y: 236, size: 70 };
export const CLAW_REACH = 14;
export const CLAW_SECONDS = 20;
export const CLAW_STOCK = 10;
export const CLAW_START = { x: 160, y: 60 };
export const clawChuteCenter = () => ({ x: CLAW_CHUTE.x + CLAW_CHUTE.size / 2, y: CLAW_CHUTE.y + CLAW_CHUTE.size / 2 });
// Thân thú có chạm vào khu cửa nhận quà không (thú không được nằm trên cửa).
export const touchesChute = (x, y, radius) =>
  x - radius < CLAW_CHUTE.x + CLAW_CHUTE.size + 4 && y + radius > CLAW_CHUTE.y - 4;
export const clampClaw = (x, y) => ({
  x: Math.max(CLAW_BOX.left + 6, Math.min(CLAW_BOX.right - 6, x)),
  y: Math.max(CLAW_BOX.top + 6, Math.min(CLAW_BOX.bottom - 6, y)),
});

// Bổ sung máy khi sang tuổi mới: giữ thú còn lại, thêm thú mới vào chỗ trống cho đủ CLAW_STOCK con.
export function stockClawMachine(machine, age, random = Math.random) {
  if (machine && machine.age === age) return machine;
  const items = [...(machine?.items ?? [])];
  let serial = 0;
  for (let tries = 0; items.length < CLAW_STOCK && tries < 400; tries += 1) {
    const plush = pickWeighted(plushies, random);
    const r = plush.radius;
    const x = CLAW_BOX.left + r + random() * (CLAW_BOX.right - CLAW_BOX.left - 2 * r);
    const y = CLAW_BOX.top + r + random() * (CLAW_BOX.bottom - CLAW_BOX.top - 2 * r);
    if (touchesChute(x, y, r)) continue;
    // Thú không chồng quá nhiều lên nhau để còn nhìn và căn được.
    if (items.some((item) => Math.hypot(item.x - x, item.y - y) < plushOf(item.id).radius + r + 2)) continue;
    serial += 1;
    items.push({ uid: `p${age}-${Date.now().toString(36)}-${serial}`, id: plush.id, x: Math.round(x), y: Math.round(y) });
  }
  return { age, items };
}
// Tỉ lệ gắp được theo khoảng cách từ tâm càng tới tâm thú: chỉ khi căn thật chuẩn (trong 1/10 bán kính
// thân) mới được tỉ lệ đầy đủ; lệch ra thì giảm nhanh (bậc hai) về 0% ở mép vùng gắp
// (bán kính thân + bán kính vùng gắp).
export function grabChance(plush, distance) {
  const reach = plush.radius + CLAW_REACH;
  const sweet = plush.radius * 0.1;
  if (distance > reach) return 0;
  const full = plushRarities[plush.rarity].grab;
  if (distance <= sweet) return full;
  return full * (1 - (distance - sweet) / (reach - sweet)) ** 2;
}
// Thú bị càng chạm (trong vùng gắp), gần tâm càng nhất trước.
export function clawTargets(items, claw) {
  return items
    .map((item) => ({ item, distance: Math.hypot(item.x - claw.x, item.y - claw.y) }))
    .filter(({ item, distance }) => distance <= plushOf(item.id).radius + CLAW_REACH)
    .sort((a, b) => a.distance - b.distance);
}
// Chốt kết quả một lần khi bắt đầu hạ càng. Thất bại khi đã chạm thú: một nửa là nâng lên rỗng,
// một nửa là thú tuột giữa đường về cửa và rơi lại trong máy (slipTo).
export function judgeClawGrab(items, claw, random = Math.random) {
  const [target] = clawTargets(items, claw);
  if (!target) return { result: "empty", uid: null, chance: 0 };
  const plush = plushOf(target.item.id);
  const chance = grabChance(plush, target.distance);
  const roll = random();
  if (roll < chance) return { result: "caught", uid: target.item.uid, chance };
  if (random() < 0.5) return { result: "missed", uid: target.item.uid, chance };
  // Tuột ở khoảng 35–65% quãng đường từ chỗ gắp tới cửa nhận quà, rơi xuống ngoài khu cửa.
  const chute = clawChuteCenter();
  const k = 0.35 + random() * 0.3;
  let x = target.item.x + (chute.x - target.item.x) * k;
  let y = target.item.y + (chute.y - target.item.y) * k;
  if (touchesChute(x, y, plush.radius)) x = CLAW_CHUTE.x + CLAW_CHUTE.size + plush.radius + 6;
  x = Math.max(CLAW_BOX.left + plush.radius, Math.min(CLAW_BOX.right - plush.radius, x));
  y = Math.max(CLAW_BOX.top + plush.radius, Math.min(CLAW_BOX.bottom - plush.radius, y));
  return { result: "slipped", uid: target.item.uid, chance, slipTo: { x: Math.round(x), y: Math.round(y) } };
}

// Đập chuột: mục tiêu ló lên khỏi hang; points âm là mục tiêu giả.
export const whackTargets = [
  { id: "mouse", icon: "🐭", label: "Chuột", points: 1, chance: 0.7, stay: 1000 },
  { id: "gold", icon: "🐭", label: "Chuột vàng", points: 3, chance: 0.1, stay: 650, gold: true },
  { id: "bomb", icon: "💣", label: "Bom", points: -2, chance: 0.1, stay: 1200 },
  { id: "cat", icon: "🐱", label: "Mèo", points: -2, chance: 0.1, stay: 1200 },
];

// Bóng rổ: điểm mỗi quả theo thời gian còn lại.
export const BASKET_POINTS = 2;
export const BASKET_FINAL_POINTS = 3;
export const BASKET_FINAL_SECONDS = 5;
export const basketPoints = (secondsLeft) => (secondsLeft <= BASKET_FINAL_SECONDS ? BASKET_FINAL_POINTS : BASKET_POINTS);
