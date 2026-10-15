export const COIN_VALUE = 10_000;
export const coinPacks = [
  { coins: 10, price: 100_000 },
  { coins: 50, price: 500_000 },
  { coins: 100, price: 1_000_000 },
];

export const HAPPY_PLAYS_PER_YEAR = 3;

export const arcadeGames = [
  {
    id: "cow",
    icon: "🐄",
    name: "Kéo bò",
    cost: 1,
    ready: true,
    reward: "xu",
    tagline: "Quăng một sợi dây, thử một chút may!",
    rules: [
      "Chạm vào một con bò để chọn",
      "Bấm Thả dây, mỗi lần thả tốn 1 xu.",
      "Bắt được thì nhận đúng số xu trên đầu bò.",
    ],
  },
  {
    id: "claw",
    icon: "🧸",
    name: "Gắp thú",
    cost: 3,
    ready: true,
    reward: "thú bông",
    tagline: "Căn thật chuẩn, gắp thật chắc!",
    rules: [
      "Mỗi lượt 3 xu, được gắp một lần.",
      "Gắp được thì thú vào Tài sản → Bộ sưu tập thú bông. Thú bông tặng được trong Quan hệ.",
    ],
  },
  {
    id: "basketball",
    icon: "🏀",
    name: "Bóng rổ",
    cost: 2,
    ready: true,
    reward: "vé",
    duration: 30,
    tagline: "Rổ chạy, bóng bay, tim đập!",
    tiers: [
      [0, 0],
      [10, 3],
      [20, 6],
      [30, 10],
    ],
    rules: [
      "Có 30 giây để ném bóng thẳng lên.",
      "Mỗi quả vào rổ +2 điểm; trong 5 giây cuối +3 điểm.",
    ],
  },
  {
    id: "whack",
    icon: "🔨",
    name: "Đập chuột",
    cost: 2,
    ready: true,
    reward: "vé",
    duration: 30,
    tagline: "Nhanh tay, tinh mắt, đừng đập nhầm!",
    tiers: [
      [0, 0],
      [15, 3],
      [30, 6],
      [45, 10],
    ],
    rules: [
      "Có 30 giây. Chạm vào chuột vừa ló lên khỏi hang (hoặc phím 1–9).",
      "🐭 Chuột thường +1 · 🌟 Chuột vàng +3",
      "💣 Bom và 🐱 Mèo là mục tiêu giả: đập nhầm −2 điểm",
    ],
  },
];
export const gameOf = (id) => arcadeGames.find((game) => game.id === id);

export const LASSO_FLIGHT = 0.45;

export const COW_ESCAPE_SHARE = 0.4;
export const cowTypes = [
  {
    id: "dairy",
    icon: "🐄",
    name: "Bò sữa",
    payout: 2,
    chance: 0.4,
    catchChance: 0.375,
    size: 60,
    struggle: 0,
  },
  {
    id: "brown",
    icon: "🐂",
    name: "Bò nâu",
    payout: 3,
    chance: 0.27,
    catchChance: 0.25,
    size: 56,
    struggle: 0.4,
    tag: "#c98a4b",
  },
  {
    id: "buffalo",
    icon: "🐃",
    name: "Bò đen",
    payout: 5,
    chance: 0.18,
    catchChance: 0.15,
    size: 54,
    struggle: 0.6,
    tag: "#5a6b78",
  },
  {
    id: "gold",
    icon: "🐄",
    name: "Bò vàng",
    payout: 10,
    chance: 0.1,
    catchChance: 0.075,
    size: 48,
    struggle: 0.8,
    tag: "#f2b705",
    glow: "#ffd23f",
  },
  {
    id: "crown",
    icon: "🐄",
    name: "Bò vương miện",
    payout: 20,
    chance: 0.05,
    catchChance: 0.0375,
    size: 42,
    struggle: 1,
    tag: "#e0457b",
    glow: "#ff9fd0",
    crown: true,
  },
];
export const cowOf = (id) => cowTypes.find((cow) => cow.id === id);
export const formatPercent = (rate) =>
  `${String(Math.round(rate * 10000) / 100).replace(".", ",")}%`;

export function rollCowOutcome(cow, random = Math.random) {
  const roll = random();
  if (roll < cow.catchChance) return { result: "caught", cow: cow.id };
  const escaped =
    roll < cow.catchChance + (1 - cow.catchChance) * COW_ESCAPE_SHARE;
  return { result: escaped ? "escaped" : "miss", cow: cow.id };
}

export const plushRarities = {
  common: { label: "Phổ thông", grab: 0.45, gift: 3 },
  big: { label: "Thú lớn", grab: 0.3, gift: 5 },
  rare: { label: "Hiếm", grab: 0.15, gift: 8 },
};
export const rarityLabels = Object.fromEntries(
  Object.entries(plushRarities).map(([id, rarity]) => [id, rarity.label]),
);

export const plushies = [
  {
    id: "teddy",
    icon: "🧸",
    name: "Gấu bông",
    rarity: "common",
    radius: 20,
    chance: 0.14,
  },
  {
    id: "bunny",
    icon: "🐰",
    name: "Thỏ bông",
    rarity: "common",
    radius: 20,
    chance: 0.13,
  },
  {
    id: "kitty",
    icon: "🐱",
    name: "Mèo bông",
    rarity: "common",
    radius: 20,
    chance: 0.13,
  },
  {
    id: "puppy",
    icon: "🐶",
    name: "Cún bông",
    rarity: "common",
    radius: 20,
    chance: 0.12,
  },
  {
    id: "chick",
    icon: "🐥",
    name: "Gà con bông",
    rarity: "common",
    radius: 18,
    chance: 0.1,
  },
  {
    id: "panda",
    icon: "🐼",
    name: "Gấu trúc lớn",
    rarity: "big",
    radius: 29,
    chance: 0.1,
  },
  {
    id: "dino",
    icon: "🦖",
    name: "Khủng long lớn",
    rarity: "big",
    radius: 29,
    chance: 0.08,
  },
  {
    id: "giraffe",
    icon: "🦒",
    name: "Hươu cao cổ lớn",
    rarity: "big",
    radius: 28,
    chance: 0.07,
  },
  {
    id: "unicorn",
    icon: "🦄",
    name: "Kỳ lân bông",
    rarity: "rare",
    radius: 16,
    chance: 0.05,
  },
  {
    id: "dragon",
    icon: "🐉",
    name: "Rồng con bông",
    rarity: "rare",
    radius: 16,
    chance: 0.04,
  },
  {
    id: "fox",
    icon: "🦊",
    name: "Cáo lửa bông",
    rarity: "rare",
    radius: 16,
    chance: 0.04,
  },
].map((plush) => ({ ...plush, gift: plushRarities[plush.rarity].gift }));
export const plushOf = (id) => plushies.find((plush) => plush.id === id);

export const CLAW_RARE_ACHIEVEMENT = "claw-rare-plush";

export const prizes = [
  { id: "sticker", icon: "🌟", name: "Sticker lấp lánh", tickets: 20, gift: 3 },
  { id: "keychain", icon: "🔑", name: "Móc khóa", tickets: 60, gift: 3 },
  { id: "big-bear", icon: "🐻", name: "Gấu bông lớn", tickets: 150, gift: 5 },
  { id: "photo-frame", icon: "🖼️", name: "Khung ảnh", tickets: 300, gift: 5 },
  {
    id: "arcade-model",
    icon: "🕹️",
    name: "Mô hình máy arcade",
    tickets: 600,
    gift: 8,
  },
  { id: "trophy", icon: "🏆", name: "Cúp vô địch", tickets: 1000, gift: 8 },
];
export const collectibles = [...plushies, ...prizes];
export const collectibleOf = (id) =>
  collectibles.find((item) => item.id === id);

export const createArcade = () => ({
  coins: 0,
  tickets: 0,
  collection: {},
  plushes: {},
  clawMachine: null,
  plays: null,
  giftAge: null,
  session: null,
});
export function addPlush(arcade, plush, count = 1) {
  const entry = arcade.plushes[plush.id] ?? { count: 0 };
  arcade.plushes[plush.id] = {
    name: plush.name,
    icon: plush.icon,
    rarity: plush.rarity,
    count: entry.count + count,
  };
}

export function arcadeOf(player) {
  const defaults = createArcade();
  player.arcade ??= defaults;
  for (const [key, value] of Object.entries(defaults))
    player.arcade[key] ??= value;
  for (const [id, count] of Object.entries(player.arcade.collection)) {
    const plush = plushOf(id);
    if (!plush) continue;
    addPlush(player.arcade, plush, count);
    delete player.arcade.collection[id];
  }
  return player.arcade;
}
export const playsThisYear = (player) =>
  player.arcade?.plays?.age === player.age ? player.arcade.plays.count : 0;

export const ticketsForScore = (game, score) =>
  game.tiers.reduce(
    (tickets, [minimum, reward]) => (score >= minimum ? reward : tickets),
    0,
  );
export const describeTiers = (game) =>
  game.tiers.map(([minimum, reward], index) => {
    const next = game.tiers[index + 1];
    return [
      next ? `${minimum}–${next[0] - 1} điểm` : `Từ ${minimum} điểm`,
      `${reward} vé`,
    ];
  });

export function pickWeighted(entries, random = Math.random) {
  let roll = random();
  for (const entry of entries) {
    roll -= entry.chance;
    if (roll < 0) return entry;
  }
  return entries.at(-1);
}

export const CLAW_BOX = { left: 14, top: 14, right: 306, bottom: 306 };
export const CLAW_CHUTE = { x: 14, y: 236, size: 70 };
export const CLAW_REACH = 14;
export const CLAW_SECONDS = 20;
export const CLAW_STOCK = 10;
export const CLAW_START = { x: 160, y: 60 };
export const clawChuteCenter = () => ({
  x: CLAW_CHUTE.x + CLAW_CHUTE.size / 2,
  y: CLAW_CHUTE.y + CLAW_CHUTE.size / 2,
});

export const touchesChute = (x, y, radius) =>
  x - radius < CLAW_CHUTE.x + CLAW_CHUTE.size + 4 &&
  y + radius > CLAW_CHUTE.y - 4;
export const clampClaw = (x, y) => ({
  x: Math.max(CLAW_BOX.left + 6, Math.min(CLAW_BOX.right - 6, x)),
  y: Math.max(CLAW_BOX.top + 6, Math.min(CLAW_BOX.bottom - 6, y)),
});

export function stockClawMachine(machine, age, random = Math.random) {
  if (machine && machine.age === age) return machine;
  const items = [...(machine?.items ?? [])];
  let serial = 0;
  for (let tries = 0; items.length < CLAW_STOCK && tries < 400; tries += 1) {
    const plush = pickWeighted(plushies, random);
    const r = plush.radius;
    const x =
      CLAW_BOX.left + r + random() * (CLAW_BOX.right - CLAW_BOX.left - 2 * r);
    const y =
      CLAW_BOX.top + r + random() * (CLAW_BOX.bottom - CLAW_BOX.top - 2 * r);
    if (touchesChute(x, y, r)) continue;

    if (
      items.some(
        (item) =>
          Math.hypot(item.x - x, item.y - y) < plushOf(item.id).radius + r + 2,
      )
    )
      continue;
    serial += 1;
    items.push({
      uid: `p${age}-${Date.now().toString(36)}-${serial}`,
      id: plush.id,
      x: Math.round(x),
      y: Math.round(y),
    });
  }
  return { age, items };
}

export function grabChance(plush, distance) {
  const reach = plush.radius + CLAW_REACH;
  const sweet = plush.radius * 0.1;
  if (distance > reach) return 0;
  const full = plushRarities[plush.rarity].grab;
  if (distance <= sweet) return full;
  return full * (1 - (distance - sweet) / (reach - sweet)) ** 2;
}

export function clawTargets(items, claw) {
  return items
    .map((item) => ({
      item,
      distance: Math.hypot(item.x - claw.x, item.y - claw.y),
    }))
    .filter(
      ({ item, distance }) => distance <= plushOf(item.id).radius + CLAW_REACH,
    )
    .sort((a, b) => a.distance - b.distance);
}

export function judgeClawGrab(items, claw, random = Math.random) {
  const [target] = clawTargets(items, claw);
  if (!target) return { result: "empty", uid: null, chance: 0 };
  const plush = plushOf(target.item.id);
  const chance = grabChance(plush, target.distance);
  const roll = random();
  if (roll < chance) return { result: "caught", uid: target.item.uid, chance };
  if (random() < 0.5) return { result: "missed", uid: target.item.uid, chance };

  const chute = clawChuteCenter();
  const k = 0.35 + random() * 0.3;
  let x = target.item.x + (chute.x - target.item.x) * k;
  let y = target.item.y + (chute.y - target.item.y) * k;
  if (touchesChute(x, y, plush.radius))
    x = CLAW_CHUTE.x + CLAW_CHUTE.size + plush.radius + 6;
  x = Math.max(
    CLAW_BOX.left + plush.radius,
    Math.min(CLAW_BOX.right - plush.radius, x),
  );
  y = Math.max(
    CLAW_BOX.top + plush.radius,
    Math.min(CLAW_BOX.bottom - plush.radius, y),
  );
  return {
    result: "slipped",
    uid: target.item.uid,
    chance,
    slipTo: { x: Math.round(x), y: Math.round(y) },
  };
}

export const whackTargets = [
  {
    id: "mouse",
    icon: "🐭",
    label: "Chuột",
    points: 1,
    chance: 0.7,
    stay: 1000,
  },
  {
    id: "gold",
    icon: "🐭",
    label: "Chuột vàng",
    points: 3,
    chance: 0.1,
    stay: 650,
    gold: true,
  },
  { id: "bomb", icon: "💣", label: "Bom", points: -2, chance: 0.1, stay: 1200 },
  { id: "cat", icon: "🐱", label: "Mèo", points: -2, chance: 0.1, stay: 1200 },
];

export const BASKET_POINTS = 2;
export const BASKET_FINAL_POINTS = 3;
export const BASKET_FINAL_SECONDS = 5;
export const basketPoints = (secondsLeft) =>
  secondsLeft <= BASKET_FINAL_SECONDS ? BASKET_FINAL_POINTS : BASKET_POINTS;
