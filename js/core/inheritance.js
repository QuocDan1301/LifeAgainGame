import { getShopItem, getSellPrice } from "../leisure/shop.js";
import { getChildAge } from "../relationships/family.js";

// Di chúc và chia thừa kế. Đây là quy tắc trong game, không mô phỏng pháp luật.
// Mọi khoản được tính tại lúc qua đời; lập di chúc không khóa tiền hay tài sản.
export const WILL_MIN_AGE = 50;
export const COMMUNITY_KEY = "community";
const ROUND = 1000;
const RECIPIENT = /^(partner|child):[\w.:-]{1,80}$|^community$/u;
const ASSET = /^(purchase|livestock|auction):[\w.:-]{1,120}$/u;

const givenName = (name) => String(name ?? "").trim().split(/\s+/u).at(-1) ?? "";
const floorTo = (value) => Math.floor(Math.max(0, value) / ROUND) * ROUND;

// Người nhận hợp lệ ở thời điểm hiện tại: bạn đời đã kết hôn, các con còn sống, quỹ cộng đồng.
export function listRecipients(player, age = player.age) {
  const list = [];
  if (player.partner && player.marriedAtAge != null) {
    list.push({ key: `partner:${player.partner.id}`, kind: "partner", id: player.partner.id, name: player.partner.name, label: `Bạn đời ${player.partner.name}` });
  }
  for (const child of player.children ?? []) {
    if (child.alive === false || child.isAlive === false) continue;
    list.push({ key: `child:${child.id}`, kind: "child", id: child.id, name: child.name, age: getChildAge(child, age),
      adopted: child.adopted === true, label: `${child.adopted ? "Con nuôi" : "Con"} ${child.name} (${getChildAge(child, age)} tuổi)` });
  }
  list.push({ key: COMMUNITY_KEY, kind: "community", name: "Quỹ cộng đồng", label: "🤝 Quỹ cộng đồng" });
  return list;
}

// Tài sản cụ thể đứng tên người chơi, kèm giá trị bán lại hiện tại và khoản vay gắn với tài sản.
export function listEstateAssets(player, age = player.age) {
  const loans = player.homeLoans ?? [];
  const assets = [];
  for (const [kind, list] of [["purchase", player.purchases ?? []], ["livestock", player.livestock ?? []]]) {
    list.forEach((entry, index) => {
      const item = getShopItem(entry.id);
      if (!item) return;
      const uid = entry.uid ?? `${entry.id}-${index}`;
      const loan = loans.filter((item) => item.assetUid === entry.uid && item.outstanding > 0)
        .reduce((sum, item) => sum + item.outstanding, 0);
      assets.push({ key: `${kind}:${uid}`, kind, uid, id: entry.id, name: item.name, icon: item.icon, group: item.group,
        value: getSellPrice(item, entry, age), loan, entry });
    });
  }
  (player.auctionItems ?? []).forEach((entry, index) => {
    const uid = entry.uid ?? `auction-${index}`;
    assets.push({ key: `auction:${uid}`, kind: "auction", uid, id: entry.id ?? uid, name: entry.name ?? "Cổ vật",
      icon: entry.icon ?? "🏺", group: "auction", value: Math.max(0, Number(entry.value) || 0), loan: 0, entry });
  });
  return assets;
}

export function normalizeWill(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const pick = (source, keyTest, valueTest) => Object.fromEntries(Object.entries(source && typeof source === "object" ? source : {})
    .filter(([key, value]) => keyTest(key) && valueTest(value)));
  const shares = pick(raw.shares, (key) => RECIPIENT.test(key), (value) => Number.isInteger(value) && value > 0 && value <= 100);
  return {
    shares,
    assets: pick(raw.assets, (key) => ASSET.test(key), (value) => typeof value === "string" && RECIPIENT.test(value)),
    keepsakes: pick(raw.keepsakes, (key) => typeof key === "string" && key.length <= 80, (value) => typeof value === "string" && RECIPIENT.test(value) && value !== COMMUNITY_KEY),
    messages: Object.fromEntries(Object.entries(pick(raw.messages, (key) => RECIPIENT.test(key) && key !== COMMUNITY_KEY,
      (value) => typeof value === "string" && value.trim())).map(([key, value]) => [key, value.trim().slice(0, 240)])),
    createdAtAge: Number.isInteger(raw.createdAtAge) ? raw.createdAtAge : null,
    updatedAtAge: Number.isInteger(raw.updatedAtAge) ? raw.updatedAtAge : null,
  };
}

// Kiểm tra trước khi lưu: tổng tỷ lệ, người nhận còn hợp lệ, tài sản còn đứng tên.
export function validateWill(will, player, age = player.age) {
  const errors = [];
  const warnings = [];
  const clean = normalizeWill(will) ?? { shares: {}, assets: {}, keepsakes: {}, messages: {} };
  const total = Object.values(clean.shares).reduce((sum, value) => sum + value, 0);
  if (total > 100) errors.push(`Tổng tỷ lệ là ${total}%, vượt quá 100%.`);
  const valid = new Set(listRecipients(player, age).map((recipient) => recipient.key));
  const owned = new Set(listEstateAssets(player, age).map((asset) => asset.key));
  for (const key of Object.keys(clean.shares)) if (!valid.has(key)) warnings.push("Một người nhận theo tỷ lệ không còn hợp lệ; phần ấy sẽ chia theo quy tắc mặc định.");
  for (const [asset, key] of Object.entries(clean.assets)) {
    if (!owned.has(asset)) warnings.push("Một tài sản đã chỉ định không còn đứng tên bạn; khi qua đời sẽ bỏ qua.");
    else if (!valid.has(key)) warnings.push("Một tài sản được chỉ định cho người không còn hợp lệ; sẽ chia theo quy tắc mặc định.");
  }
  return { ok: errors.length === 0, errors, warnings: [...new Set(warnings)], total, unassigned: Math.max(0, 100 - total) };
}

// Tính chia thừa kế, không thay đổi người chơi. Kết quả không bao giờ tạo thêm tiền hay tài sản.
export function settleEstate(player, rawWill = player.will, age = player.age) {
  const will = normalizeWill(rawWill);
  const recipients = listRecipients(player, age);
  const valid = new Map(recipients.map((recipient) => [recipient.key, recipient]));
  const heirs = recipients.filter((recipient) => recipient.kind !== "community");
  const assets = listEstateAssets(player, age);
  const notes = [];
  const money = Math.trunc(Number(player.money) || 0);
  let cash = Math.max(0, money);
  // Nợ thật là khoản có số dư: ví âm, hợp đồng vay nhà còn dư nợ và nợ nuôi con kiểu cũ chưa chuyển vào ví.
  // Chi tiết vay mượn chỉ có trong lời kể không có số dư nên không được suy ra thành nợ.
  const loanDebt = (player.homeLoans ?? []).reduce((sum, loan) => sum + Math.max(0, loan.outstanding ?? 0), 0);
  const legacyDebt = Math.max(0, Math.trunc(Number(player.childcareDebt) || 0));
  const debt = (money < 0 ? -money : 0) + loanDebt + legacyDebt;
  let owing = debt;
  const fromCash = Math.min(cash, owing);
  cash -= fromCash;
  owing -= fromCash;
  // Thiếu tiền trả nợ: bán trước tài sản không được chỉ định, giá trị thấp trước.
  const assignedTo = (asset) => {
    const key = will?.assets?.[asset.key];
    return key && valid.has(key) ? key : null;
  };
  const liquidated = [];
  let proceeds = 0;
  if (owing > 0) {
    const order = [...assets].sort((a, b) => (assignedTo(a) ? 1 : 0) - (assignedTo(b) ? 1 : 0) || a.value - b.value);
    for (const asset of order) {
      if (owing <= 0) break;
      liquidated.push(asset);
      proceeds += asset.value;
      const paid = Math.min(owing, asset.value);
      owing -= paid;
      cash += asset.value - paid;
    }
  }
  const debtPaid = debt - owing;
  if (debt) notes.push(`Đã trả ${debtPaid.toLocaleString("vi-VN")} VNĐ nợ của người mất trước khi chia.`);
  if (owing > 0) notes.push(`Còn ${owing.toLocaleString("vi-VN")} VNĐ nợ không đủ tài sản để trả; khoản này khép lại, không chuyển sang người nhận.`);
  if (liquidated.length) notes.push(`Đã bán ${liquidated.length} tài sản để trả nợ.`);

  const allocations = Object.fromEntries(recipients.map((recipient) => [recipient.key, {
    key: recipient.key, kind: recipient.kind, name: recipient.name, cash: 0, assets: [], keepsakes: [], message: will?.messages?.[recipient.key] ?? "",
  }]));
  const give = (key, asset) => allocations[key].assets.push({ key: asset.key, kind: asset.kind, uid: asset.uid, id: asset.id,
    name: asset.name, icon: asset.icon, value: asset.value, entry: asset.entry });
  const remaining = assets.filter((asset) => !liquidated.includes(asset));
  const residualAssets = [];
  for (const asset of remaining) {
    const key = assignedTo(asset);
    if (key) give(key, asset);
    else residualAssets.push(asset);
  }
  if (will && Object.keys(will.assets).some((key) => !assets.some((asset) => asset.key === key))) {
    notes.push("Tài sản đã bán trước khi qua đời không được trao.");
  }

  // Tiền: chia theo tỷ lệ trên số dư thực tế; tỷ lệ của người không còn hợp lệ trả về phần mặc định.
  const shareTotal = Object.values(will?.shares ?? {}).reduce((sum, value) => sum + value, 0);
  const usableShares = will && shareTotal <= 100 ? Object.entries(will.shares).filter(([key]) => valid.has(key)) : [];
  if (will && shareTotal > 100) notes.push("Tổng tỷ lệ trong di chúc vượt 100% nên phần tiền chia theo quy tắc mặc định.");
  if (will && Object.keys(will.shares).some((key) => !valid.has(key))) notes.push("Người nhận đã mất hoặc không còn hợp lệ: phần của họ chia theo quy tắc mặc định.");
  const totalCash = cash;
  let distributed = 0;
  for (const [key, percent] of usableShares) {
    const amount = floorTo(totalCash * percent / 100);
    allocations[key].cash += amount;
    distributed += amount;
  }
  let residualCash = totalCash - distributed;

  // Quy tắc mặc định: chia đều tiền cho bạn đời và các con còn sống; tài sản không chia nhỏ
  // được giao lần lượt (giá trị cao trước) cho người đang nhận ít nhất. Không ai thì vào quỹ cộng đồng.
  if (heirs.length) {
    const each = floorTo(residualCash / heirs.length);
    for (const heir of heirs) allocations[heir.key].cash += each;
    allocations[heirs[0].key].cash += residualCash - each * heirs.length;
    residualCash = 0;
    const totals = new Map(heirs.map((heir) => [heir.key, allocations[heir.key].cash + allocations[heir.key].assets.reduce((sum, asset) => sum + asset.value, 0)]));
    for (const asset of [...residualAssets].sort((a, b) => b.value - a.value)) {
      const [key] = [...totals].sort((a, b) => a[1] - b[1])[0];
      give(key, asset);
      totals.set(key, totals.get(key) + asset.value);
    }
  } else {
    allocations[COMMUNITY_KEY].cash += residualCash;
    residualCash = 0;
    for (const asset of residualAssets) give(COMMUNITY_KEY, asset);
    if (cash || residualAssets.length) notes.push("Không có người thừa kế hợp lệ: phần còn lại chuyển vào quỹ cộng đồng.");
  }

  const familyKeepsakes = [];
  for (const keepsake of player.keepsakes ?? []) {
    const key = will?.keepsakes?.[keepsake.id];
    if (key && valid.has(key)) allocations[key].keepsakes.push({ ...keepsake });
    else familyKeepsakes.push({ ...keepsake });
  }
  for (const [key, text] of Object.entries(will?.messages ?? {})) if (!valid.has(key) && text) notes.push("Một lời nhắn gửi người không còn hợp lệ được giữ trong album gia đình.");
  // Khoản người mất cho người khác vay mà chưa thu: không thành tiền mặt, không chuyển cho ai, ngừng trả góp.
  const receivables = (player.storyLoans ?? []).filter((loan) => loan.outstanding > 0)
    .map((loan) => ({ id: loan.id, outstanding: loan.outstanding }));
  const receivableTotal = receivables.reduce((sum, loan) => sum + loan.outstanding, 0);
  if (receivableTotal) notes.push(`Khoản cho vay chưa thu ${receivableTotal.toLocaleString("vi-VN")} VNĐ khép lại: không tính vào tiền chia và không chuyển cho người nhận.`);
  const openTickets = (player.lotteryTickets ?? []).length;
  if (openTickets) notes.push(`${openTickets} vé số mua trong năm cuối chưa đến kỳ dò; vé không được dò và không chuyển cho ai.`);

  const strip = (asset) => ({ key: asset.key, kind: asset.kind, uid: asset.uid, id: asset.id, name: asset.name, icon: asset.icon, value: asset.value });
  return {
    age, usedWill: Boolean(will), moneyBefore: money, debt, debtPaid, debtWrittenOff: owing, proceeds,
    liquidated: liquidated.map(strip), totalCash, notes, receivables, openTickets,
    allocations: Object.values(allocations).filter((item) => item.cash || item.assets.length || item.keepsakes.length || item.message || item.kind !== "community"),
    familyKeepsakes,
  };
}

// Chia đúng một lần lúc qua đời: lưu kết quả và đưa tài sản người mất về 0 trong cùng một lần ghi.
export function applyEstateOnce(player) {
  if (player.estate?.settled) return player.estate;
  const result = settleEstate(player);
  const before = { money: player.money ?? 0, purchases: player.purchases ?? [], livestock: player.livestock ?? [],
    auctionItems: player.auctionItems ?? [], homeLoans: player.homeLoans ?? [], keepsakes: player.keepsakes ?? [],
    storyLoans: player.storyLoans ?? [], childcareDebt: player.childcareDebt ?? 0, lotteryTickets: player.lotteryTickets ?? [] };
  // Tài sản thật của người nhận được giữ trong kết quả (kèm dữ liệu gốc để người con tiếp quản nhận lại đúng món).
  const estate = { ...result, settled: true, before };
  Object.assign(player, { estate, money: 0, purchases: [], livestock: [], auctionItems: [], homeLoans: [], storyLoans: [], childcareDebt: 0,
    lotteryTickets: [] });
  return estate;
}

// Gộp tài sản giống nhau (cùng loại, cùng tên) để danh sách ngắn gọn: “🐄 Bò ×3”.
export function groupAssets(assets = []) {
  const groups = new Map();
  for (const asset of assets) {
    const key = `${asset.kind ?? ""}|${asset.id ?? ""}|${asset.name ?? ""}`;
    if (!groups.has(key)) groups.set(key, { key, kind: asset.kind, id: asset.id, name: asset.name, icon: asset.icon, units: [], value: 0, loan: 0 });
    const group = groups.get(key);
    group.units.push(asset);
    group.value += asset.value ?? 0;
    group.loan += asset.loan ?? 0;
  }
  return [...groups.values()];
}
export const summarizeAssets = (assets = []) => groupAssets(assets)
  .map((group) => `${group.icon ?? ""} ${group.name}${group.units.length > 1 ? ` ×${group.units.length}` : ""}`.trim()).join(", ");

export const allocationFor = (estate, key) => estate?.allocations?.find((item) => item.key === key) ?? null;
export const assetsValue = (allocation) => (allocation?.assets ?? []).reduce((sum, asset) => sum + (asset.value ?? 0), 0);
export const describeRecipientName = (allocation) => allocation.kind === "community" ? "Quỹ cộng đồng" : allocation.name;
export { givenName };
