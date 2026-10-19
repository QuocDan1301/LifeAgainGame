import { saveGame } from "../core/save-store.js";
import { formatMoney, formatMoneyAmount } from "../core/money-format.js";
import { recordAchievementFlags } from "../achievements/achievements-data.js";
import { getLicenseType, hasLicense } from "../career/licenses.js";
import { askConfirm } from "../ui/confirm-dialog.js";
import { applyActivityGain } from "../core/stat-budget.js";
import { isInPrison } from "../events/crime.js";
import { crimeTools } from "../events/crime-tools.js";
import { getHomeFinancing, prepareHomePurchase } from "../core/housing.js";
import { getHomePurchasePreview } from "../core/housing-preview.js";

 
 
 
export const shopCatalog = [
  ...crimeTools,
   
   
  { id: "hamster", shop: "pets", group: "companion", icon: "🐹", name: "Chuột hamster", price: 300_000, happiness: 1, limit: 1,
    food: 420_000, description: "Nhỏ xíu, má phồng, chạy vòng quay lách cách suốt đêm." },
  { id: "cat", shop: "pets", group: "companion", icon: "🐱", name: "Mèo", price: 2_500_000, happiness: 2, limit: 1,
    food: 2_100_000, vaccine: 350_000, description: "Hay cuộn tròn bên cửa sổ, kêu rừ rừ mỗi khi được gãi cằm." },
  { id: "dog", shop: "pets", group: "companion", icon: "🐶", name: "Chó", price: 6_000_000, happiness: 3, limit: 1,
    food: 3_500_000, vaccine: 420_000, description: "Trung thành, lần nào bạn về nhà cũng vẫy đuôi chạy ra đón." },
  { id: "capybara", shop: "pets", group: "companion", icon: "🦫", name: "Capybara", price: 30_000_000, happiness: 4, limit: 1,
    food: 5_600_000, description: "Chuột lang nước điềm tĩnh nhất thế giới, ngồi cạnh thôi cũng thấy bình yên." },
   
  { id: "pigeon", shop: "pets", group: "poultry", icon: "🕊️", name: "Bồ câu", price: 100_000, profit: 30_000, limit: 5,
    description: "Nhỏ gọn, sinh sản nhanh, chỉ cần một chiếc chuồng nhỏ trên mái nhà." },
  { id: "duck", shop: "pets", group: "poultry", icon: "🦆", name: "Vịt", price: 120_000, profit: 36_000, limit: 5,
    description: "Thích bơi lội, đẻ trứng đều. Nuôi gần ao thì càng khỏe." },
  { id: "chicken", shop: "pets", group: "poultry", icon: "🐔", name: "Gà ta", price: 150_000, profit: 45_000, limit: 5,
    description: "Dễ nuôi, ăn tạp, mỗi sáng đều có trứng tươi." },
  { id: "turkey", shop: "pets", group: "poultry", icon: "🦃", name: "Gà tây", price: 600_000, profit: 180_000, limit: 5,
    description: "To con, được giá vào dịp lễ cuối năm." },
  { id: "goat", shop: "pets", group: "cattle", icon: "🐐", name: "Dê", price: 3_500_000, profit: 700_000, limit: 5,
    description: "Leo trèo giỏi, ăn cỏ đồi, cho sữa đều." },
  { id: "pig", shop: "pets", group: "cattle", icon: "🐖", name: "Lợn", price: 4_000_000, profit: 800_000, limit: 5,
    description: "Lớn nhanh, mỗi lứa đều mang lại khoản thu ổn định." },
  { id: "sheep", shop: "pets", group: "cattle", icon: "🐑", name: "Cừu", price: 5_000_000, profit: 1_000_000, limit: 5,
    description: "Hiền lành, mỗi năm cho một mùa lông." },
  { id: "cow", shop: "pets", group: "cattle", icon: "🐄", name: "Bò", price: 18_000_000, profit: 3_600_000, limit: 5,
    description: "Cho sữa và sức kéo, là tài sản lớn của nhà nông." },
  { id: "buffalo", shop: "pets", group: "cattle", icon: "🐃", name: "Trâu", price: 25_000_000, profit: 5_000_000, limit: 5,
    description: "Khỏe mạnh, bền bỉ, người bạn của đồng ruộng." },
  { id: "horse", shop: "pets", group: "cattle", icon: "🐎", name: "Ngựa", price: 40_000_000, profit: 8_000_000, limit: 5,
    description: "Nhanh nhẹn, được thuê kéo xe và phục vụ du lịch." },
   
   
  { id: "motorbike", shop: "shopping", group: "vehicles", icon: "🛵", name: "Xe máy", price: 30_000_000, license: "motorbike",
    achievement: "own-motorbike", description: "Chiếc xe máy đầu tiên, tự do đi khắp phố phường." },
  { id: "big-bike", shop: "shopping", group: "vehicles", icon: "🏍️", name: "Xe phân khối lớn", price: 400_000_000, license: "motorbike",
    achievement: "own-big-bike", description: "Tiếng pô trầm, dành cho những chuyến đi đường dài." },
  { id: "car", shop: "shopping", group: "vehicles", icon: "🚗", name: "Ô tô", price: 800_000_000, license: "car",
    achievement: "own-car", description: "Chiếc ô tô đầu tiên, che mưa che nắng cho cả nhà." },
  { id: "porsche", shop: "shopping", group: "vehicles", icon: "🏎️", name: "Porsche", price: 8_000_000_000, license: "car",
    achievement: "own-porsche", description: "Xe thể thao Đức, mạnh mẽ và tinh tế." },
  { id: "lamborghini", shop: "shopping", group: "vehicles", icon: "🐂", name: "Lamborghini", price: 10_000_000_000, license: "car",
    achievement: "own-lamborghini", description: "Siêu xe Ý, đi đến đâu cũng có người ngoái nhìn." },
  { id: "rolls-royce", shop: "shopping", group: "vehicles", icon: "🚘", name: "Rolls-Royce", price: 12_000_000_000, license: "car",
    achievement: "own-rolls-royce", description: "Biểu tượng của sự sang trọng bậc nhất." },
  { id: "private-jet", shop: "shopping", group: "vehicles", icon: "✈️", name: "Máy bay riêng", price: 15_000_000_000,
    achievement: "own-private-jet", description: "Bầu trời là của riêng bạn, bay đi đâu tùy thích." },
  { id: "tesla-roadster", shop: "shopping", group: "vehicles", icon: "⚡", name: "Tesla Roadster", price: 25_000_000_000, license: "car",
    achievement: "own-tesla-roadster", description: "Siêu xe điện tăng tốc như tên lửa, chạy êm gần như không một tiếng động." },
   
  { id: "starter-apartment", shop: "shopping", group: "realestate", icon: "🏡", name: "Căn hộ đầu tiên", price: 800_000_000, residential: true, limit: 1,
    description: "Căn hộ để ở. Mua xong không còn tiền thuê nhà hằng năm; không tự sinh lãi. Được giảm trừ thuế nhà ở." },
  { id: "story-home", residential: true, shop: "shopping", group: "realestate", icon: "🏠", name: "Nhà trả góp", price: 600_000_000, minAge: 18, limit: 1,
    description: "Nhà để ở giá 600 triệu, trả trước 120 triệu và trả góp phần còn lại. Được miễn tiền thuê nhà ngay khi mua." },
  { id: "house", residential: true, shop: "shopping", group: "realestate", icon: "🏠", name: "Nhà lầu", price: 5_000_000_000, profit: 300_000_000, limit: 3,
    achievement: "own-house", description: "Dùng để ở thì không phải thuê nhà. Có thể cho thuê nguyên căn để nhận thu nhập, nhưng khi đó cần chỗ ở khác." },
  { id: "restaurant", shop: "shopping", group: "realestate", icon: "🍽️", name: "Nhà hàng", price: 8_000_000_000, profit: 640_000_000, limit: 2,
    achievement: "own-restaurant", description: "Mặt bằng nhà hàng rộng rãi ở khu đông khách." },
  { id: "hotel", shop: "shopping", group: "realestate", icon: "🏨", name: "Khách sạn", price: 15_000_000_000, profit: 900_000_000, limit: 2,
    achievement: "own-hotel", description: "Khách sạn trung tâm, phòng kín khách quanh năm." },
  { id: "resort", shop: "shopping", group: "realestate", icon: "🏝️", name: "Resort", price: 30_000_000_000, profit: 1_800_000_000, limit: 1,
    achievement: "own-resort", description: "Khu nghỉ dưỡng ven biển, sóng vỗ rì rào." },
   
  { id: "noodle-cart", shop: "shopping", group: "business", icon: "🍜", name: "Xe hủ tiếu", price: 30_000_000, limit: 3,
    achievement: "own-noodle-cart", description: "Phương tiện để nhận nghề Bán hủ tiếu trong Hoạt động → Làm thêm. Không tự sinh lãi hoặc cho thuê." },
  { id: "cafe", shop: "shopping", group: "business", icon: "☕", name: "Quán cafe", price: 1_500_000_000, profit: 120_000_000, limit: 2,
    achievement: "own-cafe", description: "Một góc nhỏ thơm mùi cà phê, khách quen ghé mỗi sáng." },
];

export const shops = {
  pets: {
    title: "🐾 Mua vật nuôi",
    owned: "livestock",
    groups: [
      { id: "companion", label: "🐶 Thú cưng" },
      { id: "cattle", label: "🐮 Gia súc" },
      { id: "poultry", label: "🐣 Gia cầm" },
    ],
  },
  shopping: {
    title: "🛍️ Mua sắm",
    owned: "purchases",
    groups: [
      { id: "items", label: "🧸 Mua vật dụng" },
      { id: "vehicles", label: "🚗 Mua phương tiện" },
      { id: "realestate", label: "🏢 Mua bất động sản" },
      { id: "business", label: "🏪 Kinh doanh" },
    ],
  },
};

 
export const ownedSections = [
  { list: "life-livestock", groups: ["companion", "cattle", "poultry"] },
  { list: "life-realestate", groups: ["realestate", "business"] },
  { list: "life-vehicles", groups: ["vehicles"] },
  { list: "life-items", groups: ["items"] },
];

export const getShopItem = (id) => shopCatalog.find((item) => item.id === (id === "story-small-home" ? "story-home" : id));
// Animals retain 90% initially, lose 5 percentage points per year, and floor at 50%.
// Other assets keep their existing resale rule.
export const getSellPrice = (item, owned = null, age = owned?.boughtAtAge) => {
  if (item.shop !== "pets") return Math.floor(item.price / 2);
  const years = Number.isFinite(age) && Number.isFinite(owned?.boughtAtAge)
    ? Math.max(0, Math.floor(age - owned.boughtAtAge)) : 0;
  const percent = Math.max(50, 90 - years * 5);
  return Math.floor(item.price * percent / 100);
};

 
export const LEASE_YEARS = 4;
export const isRental = (item) => item?.group === "realestate";
export const getLeaseEndAge = (owned) => Number.isInteger(owned.rentedAtAge) ? owned.rentedAtAge + LEASE_YEARS : null;
export const isLeased = (owned, age) => getLeaseEndAge(owned) !== null && age < getLeaseEndAge(owned);

 
export const isCompanion = (item) => item?.group === "companion";
export const hasPettedThisYear = (owned, age) => owned.pettedAtAge === age;

 
 
export function groupOwned(entries, age) {
  const groups = new Map();
  for (const owned of entries) {
    const key = `${owned.id}|${isLeased(owned, age) ? getLeaseEndAge(owned) : ""}`;
    groups.set(key, [...(groups.get(key) ?? []), owned]);
  }
  return [...groups.values()];
}
 
// Tài sản thừa kế giữ tuổi mua quy đổi để giá bán lại không đổi; người chơi chỉ thấy năm nhận thừa kế.
function describeOrigin(units, player) {
  const bought = units.filter((unit) => !unit.inherited);
  const inherited = units.filter((unit) => unit.inherited);
  return [bought.length ? `Mua lúc ${describeAges(bought.map((unit) => unit.boughtAtAge))}` : "",
    inherited.length ? `Thừa kế năm ${describeAges(inherited.map((unit) => unit.inheritedAtAge ?? player.lineage?.takeoverAge ?? player.age))}` : ""]
    .filter(Boolean).join(" · ");
}

export function describeAges(ages) {
  const unique = [...new Set(ages)].sort((a, b) => a - b);
  return unique.length > 3 ? `${unique[0]}–${unique.at(-1)} tuổi` : `${unique.join(", ")} tuổi`;
}

const ownedOf = (player) => [...(player.livestock ?? []), ...(player.purchases ?? [])];
export const countOwned = (player, id) => ownedOf(player).filter((entry) => getShopItem(entry.id)?.id === id).length;
export const isAtLimit = (player, item) => Boolean(item.limit) && countOwned(player, item.id) >= item.limit;
 
export const maxBuyable = (player, item) =>
  Math.max(0, Math.min(item.limit - countOwned(player, item.id), Math.floor(player.money / item.price)));

export const getPetUpkeep = (item) => (item.food ?? 0) + (item.vaccine ?? 0);
const describeUpkeep = (item) => item.vaccine ? "thức ăn và tiêm ngừa" : "thức ăn";

 
 
export function getAssetYearProjection(player, age) {
  const companions = ownedOf(player).filter((entry) => isCompanion(getShopItem(entry.id)) && entry.boughtAtAge < age);
  const owned = ownedOf(player).filter((entry) => getShopItem(entry.id)?.profit);
   
  const earning = owned.filter((entry) => isRental(getShopItem(entry.id))
    ? Number.isInteger(entry.rentedAtAge) && entry.rentedAtAge < age && age <= getLeaseEndAge(entry)
    : entry.boughtAtAge < age);
  const expired = owned.filter((entry) => isRental(getShopItem(entry.id)) && getLeaseEndAge(entry) === age);
  const recurringIncome = earning.reduce((sum, entry) => sum + getShopItem(entry.id).profit, 0);
  const upkeep = companions.reduce((sum, entry) => sum + getPetUpkeep(getShopItem(entry.id)), 0);
  return { companions, earning, expired, recurringIncome, upkeep, amount: recurringIncome - upkeep };
}

export function collectAssetIncome(player, age) {
  const { companions, earning, expired, recurringIncome, upkeep, amount } = getAssetYearProjection(player, age);
  if (!earning.length && !expired.length && !companions.length) return null;
  const pets = earning.filter((entry) => getShopItem(entry.id).shop === "pets");
  const rentals = earning.filter((entry) => isRental(getShopItem(entry.id)));
  const businesses = earning.filter((entry) => getShopItem(entry.id).group === "business");
  const total = (list) => list.reduce((sum, entry) => sum + getShopItem(entry.id).profit, 0);

  player.money += amount;
  const lines = [];
  if (pets.length) lines.push(`🐾 Lãi từ ${pets.length} vật nuôi: Tiền +${formatMoneyAmount(total(pets))} VNĐ.`);
  if (rentals.length) lines.push(`🔑 Tiền cho thuê ${rentals.length} bất động sản: Tiền +${formatMoneyAmount(total(rentals))} VNĐ.`);
  if (businesses.length) lines.push(`🏪 Lãi kinh doanh: Tiền +${formatMoneyAmount(total(businesses))} VNĐ.`);
  if (upkeep) {
    const details = companions.map((entry) => {
      const item = getShopItem(entry.id);
      return `${item.icon} ${item.name}: ${describeUpkeep(item)}`;
    });
    lines.push(`🍖 Chăm sóc thú cưng: Tiền -${formatMoneyAmount(upkeep)} VNĐ (${details.join("; ")}).`);
  }
  for (const entry of expired) {
    const item = getShopItem(entry.id);
    lines.push(`📋 Hợp đồng cho thuê ${item.icon} ${item.name} đã hết hạn. Vào Tài sản để cho thuê lại.`);
  }
  return { amount, recurringIncome, upkeep, content: lines.join("\n") };
}

export function initShop(state, { renderMoney, renderStats, renderLogEntry, checkAchievements }) {
  const $ = (id) => document.getElementById(id);
  const shopDialog = $("shop-dialog");
  const shopTitle = $("shop-title");
  const shopList = $("shop-list");
  const wallet = $("shop-wallet");
  let currentShop = "pets";
  let currentGroup = null;

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const record = (content) => {
    const log = { age: state.player.age, content, summary: content };
    state.logs.push(log);
    saveGame(state);
    renderMoney();
    renderLogEntry(log);
  };

  const ask = askConfirm;

  const focusFirst = () => (shopList.querySelector(".shop-group:not(:disabled), .shop-buy:not(:disabled)")
    ?? shopList.querySelector("button:not(:disabled)"))?.focus({ preventScroll: true });

  function renderGroupPicker() {
    const back = element("button", "shop-back", "← Quay lại Hoạt động");
    back.type = "button";
    back.addEventListener("click", () => {
      shopDialog.close();
      $("activities-dialog").showModal();
    });
    shopList.append(back);
    const picker = element("div", "shop-groups");
    for (const group of shops[currentShop].groups) {
      const count = shopCatalog.filter((item) => item.group === group.id).length;
      const button = element("button", "shop-group",
        group.comingSoon ? `${group.label} · Sắp ra mắt` : `${group.label} · ${count} lựa chọn`);
      button.type = "button";
      button.dataset.group = group.id;
      button.disabled = Boolean(group.comingSoon);
      button.addEventListener("click", () => {
        currentGroup = group.id;
        renderShop();
        focusFirst();
      });
      picker.append(button);
    }
    shopList.append(picker);
  }

  function pet(item, owned) {
    const player = state.player;
    const list = player.livestock ?? [];
    const current = list.find((entry) => entry.uid === owned.uid);
    if (player.isAlive === false || !current || hasPettedThisYear(current, player.age) || isInPrison(player)) return;
    player.livestock = list.map((entry) => entry.uid === owned.uid ? { ...entry, pettedAtAge: player.age } : entry);
    const gain = applyActivityGain(player, "happiness", item.happiness);
    record(`🤲 Vuốt ve ${item.icon} ${item.name}${gain ? `: Hạnh phúc +${gain}` : ""}.`);
    renderStats();
  }

  const petButton = (item, owned, rerender) => {
    const done = hasPettedThisYear(owned, state.player.age);
    const jailed = isInPrison(state.player);
    const button = element("button", "shop-pet", done ? "✅ Đã vuốt ve năm nay" : jailed ? "⛓️ Đang thụ án" : `🤲 Vuốt ve · Hạnh phúc +${item.happiness}`);
    button.type = "button";
    button.disabled = done || jailed || state.player.isAlive === false;
    button.addEventListener("click", () => {
      pet(item, owned);
      rerender();
    });
    return button;
  };

  function renderItem(item) {
    const card = element("article", "shop-item");
    const financing = getHomeFinancing(item.id);
    const homePreview = financing ? getHomePurchasePreview(state.player, item.id) : null;
    const figures = [`💰 Giá mua: ${formatMoney(item.price)}`];
    if (financing) figures.push(`Trả trước: ${formatMoney(financing.deposit)} · Vay: ${formatMoney(financing.principal)}`,
      `Trả góp: ${formatMoney(financing.annualPayment)}/năm × ${financing.years} năm từ năm sau · Lãi đơn ${financing.rate * 100}%/năm`);
    if (homePreview) figures.push(homePreview.summary, homePreview.note, ...(homePreview.warning ? [homePreview.warning] : []));
    figures.push(item.profit
      ? `📈 ${item.shop === "pets" ? "Lãi mỗi năm" : item.group === "business" ? "Lãi kinh doanh mỗi năm" : "Lãi cho thuê mỗi năm"}: +${formatMoney(item.profit)}`
      : isCompanion(item) ? `💖 Vuốt ve mỗi năm: Hạnh phúc +${item.happiness}`
      : `🔁 Bán lại: ${formatMoney(getSellPrice(item))}`);
    if (item.profit) figures.push("Lợi nhuận sau chi phí vận hành, trước thuế tài sản; thu từ năm sau.");
    if (item.shop === "pets") {
      figures.push(`🔁 Bán lại ngay: ${formatMoney(getSellPrice(item))} (90% giá mua); giảm 5 điểm % mỗi năm nuôi, thấp nhất 50%.`);
      if (item.profit) figures.push(`⏳ Thu hồi vốn bằng tiền lãi: khoảng ${Math.ceil(item.price / item.profit)} năm, chưa tính thuế và tiền bán lại.`);
    }
    if (item.residential) figures.push("🏠 Nếu dùng để ở: không phải trả tiền thuê nhà. Nhà đang cho thuê không được tính là chỗ ở.");
    if (item.group === "realestate") figures.push("🧾 Thuế bất động sản 0,1%/năm; có nhà để ở được giảm trừ 1 tỷ giá trị tính thuế.");
    if (isRental(item) && item.profit) figures.push(`🔑 Vào Tài sản để cho thuê, mỗi lần ${LEASE_YEARS} năm`);
    if (isCompanion(item)) {
      figures.push(`🍖 Tổng phí nuôi: -${formatMoney(getPetUpkeep(item))}/năm, bắt đầu từ năm sau`,
        `🍖 Thức ăn: -${formatMoney(item.food)}/năm`,
        item.vaccine ? `💉 Tiêm ngừa: -${formatMoney(item.vaccine)}/năm` : "💉 Không cần tiêm ngừa");
    }
    if (item.license) figures.push(`🪪 Cần ${getLicenseType(item.license).name.toLocaleLowerCase("vi-VN")}`);
    if (item.limit) figures.push(`📦 Đang có ${countOwned(state.player, item.id)}/${item.limit}`);
    const buy = element("button", "shop-buy");
    buy.type = "button";
    const licensed = !item.license || hasLicense(state.player, item.license);
    const oldEnough = !item.minAge || state.player.age >= item.minAge;
    if (item.minAge) figures.push(`🔞 Từ ${item.minAge} tuổi`);
    const affordable = state.player.money >= (financing?.deposit ?? item.price);
    const full = isAtLimit(state.player, item);
    buy.disabled = !oldEnough || !licensed || !affordable || full || state.player.isAlive === false || isInPrison(state.player);
    buy.textContent = !oldEnough ? `Từ ${item.minAge} tuổi` : !licensed ? `🪪 Cần ${getLicenseType(item.license).name.toLocaleLowerCase("vi-VN")}`
      : full ? `Đã đủ ${item.limit}` : affordable ? (financing ? "🏠 Mua trả góp" : "🛒 Mua") : (financing ? "Chưa đủ tiền trả trước" : "Không đủ tiền");
    buy.addEventListener("click", () => ask(
      `🛒 Mua ${item.name}?`,
      (financing
        ? `Giá nhà ${formatMoney(financing.price)}; trả trước ${formatMoney(financing.deposit)}, vay ${formatMoney(financing.principal)}.\nLãi đơn ${financing.rate * 100}%/năm; trả ${formatMoney(financing.annualPayment)}/năm × ${financing.years} năm từ tuổi ${state.player.age + 1}. Tổng gốc và lãi: ${formatMoney(financing.total)}.\n${homePreview.summary}\n${homePreview.note}\n${homePreview.warning ? homePreview.warning + "\n" : ""}`
        : `Bạn muốn mua ${item.icon} ${item.name} với giá ${formatMoney(item.price)}?\n`) +
        (isRental(item) && item.profit
          ? `Tiền thuê: +${formatMoney(item.profit)}/năm. Sau khi mua, vào Tài sản để cho thuê, mỗi hợp đồng ${LEASE_YEARS} năm.\n`
          : item.profit ? `Lãi mỗi năm: +${formatMoney(item.profit)}, bắt đầu từ năm sau.\n`
          : isCompanion(item) ? `Mỗi năm vuốt ve một lần: Hạnh phúc +${item.happiness}.\n` +
            `Chi phí ${describeUpkeep(item)}: -${formatMoney(getPetUpkeep(item))}/năm, bắt đầu từ năm sau.\n` : "") +
        (financing ? `Được miễn tiền thuê nhà ngay khi mua. Chỉ có thể bán sau khi trả hết nợ; giá bán lại ${formatMoney(getSellPrice(item))}.` : `Nếu bán lại ngay nhận ${formatMoney(getSellPrice(item))}.${item.shop === "pets" ? " Giá bán giảm 5 điểm % mỗi năm nuôi, từ 90% xuống tối thiểu 50% giá mua." : ""}`),
      "Xác nhận mua",
      () => purchase(item, 1),
    ));
    const figureText = element("p", "shop-figures", figures.join("\n"));
    card.append(element("h4", "", `${item.icon} ${item.name}`), element("p", "", item.description), figureText, buy);
     
    if (item.shop === "pets" && item.limit > 1) {
      const count = maxBuyable(state.player, item);
      const buyMax = element("button", "shop-buy shop-buy-max", count ? `⏫ Mua tối đa · ${count} con` : "⏫ Mua tối đa");
      buyMax.type = "button";
      buyMax.disabled = buy.disabled;
      buyMax.addEventListener("click", () => ask(
        `⏫ Mua ${count} ${item.name}?`,
        `Bạn muốn mua ${count} ${item.icon} ${item.name} với tổng giá ${formatMoney(item.price * count)}?\n` +
          `Lãi mỗi năm: +${formatMoney(item.profit * count)}, bắt đầu từ năm sau.\n` +
          `Bán lại ngay: ${formatMoney(getSellPrice(item))}/con (90%); giảm 5 điểm % mỗi năm nuôi, thấp nhất 50% giá mua.`,
        "Xác nhận mua",
        () => purchase(item, count),
      ));
      card.append(buyMax);
    }
    const companion = isCompanion(item) && (state.player.livestock ?? []).find((entry) => entry.id === item.id);
    if (companion) card.append(petButton(item, companion, renderShop));
    return card;
  }

   
  function purchase(item, count) {
    const player = state.player;
    const financing = getHomeFinancing(item.id);
    const paid = financing?.deposit ?? item.price;
    if (count < 1 || (financing && count !== 1) || player.isAlive === false || isInPrison(player) || (item.minAge && player.age < item.minAge) || player.money < paid * count ||
        (item.limit && countOwned(player, item.id) + count > item.limit) ||
        (item.license && !hasLicense(player, item.license))) return;
    const key = shops[item.shop].owned;
    const stamp = Date.now();
    if (financing) {
      const home = prepareHomePurchase(player, item.id, player.age, `${item.id}-${stamp}-${Math.floor(Math.random() * 1e6)}`);
      player.money += home.money;
      Object.assign(player, home.playerUpdates);
    } else {
      player.money -= paid * count;
      player[key] = [...(player[key] ?? []), ...Array.from({ length: count }, (_, index) => ({
        uid: `${item.id}-${stamp}-${index}-${Math.floor(Math.random() * 1e6)}`,
        id: item.id,
        boughtAtAge: player.age,
      }))];
    }
    if (item.achievement) recordAchievementFlags(state, [item.achievement]);
    record(financing
      ? `🏠 Mua ${item.name} giá ${formatMoney(item.price)}: trả trước ${formatMoney(paid)}; trả góp ${formatMoney(financing.annualPayment)}/năm trong ${financing.years} năm từ năm sau. Nhà được dùng để ở ngay.`
      : `${item.shop === "pets" ? "🐾" : "🛍️"} Mua ${count > 1 ? `${count} ` : ""}${item.icon} ${item.name}: Tiền -${formatMoneyAmount(paid * count)} VNĐ.`);
    checkAchievements();
    renderShop();
  }

  function renderShop() {
    shopTitle.textContent = shops[currentShop].title;
    wallet.textContent = `Ví hiện có: ${formatMoney(state.player.money)}`;
    shopList.replaceChildren();
    if (!currentGroup) {
      renderGroupPicker();
      shopList.querySelector(".shop-back").after(wallet);
      return;
    }
    const back = element("button", "shop-back", "← Quay lại chọn nhóm");
    back.type = "button";
    back.addEventListener("click", () => {
      currentGroup = null;
      renderShop();
      focusFirst();
    });
    const group = shops[currentShop].groups.find((entry) => entry.id === currentGroup);
    const section = element("section", "dialog-card");
    const items = element("div", "shop-items");
    shopCatalog.filter((item) => item.group === currentGroup).forEach((item) => items.append(renderItem(item)));
    section.append(element("h3", "", group.label), items);
    shopList.append(back, wallet, section);
  }

   
  function renderLease(item, units) {
    const age = state.player.age;
    const owned = units[0];
    if (isLeased(owned, age)) {
      const left = getLeaseEndAge(owned) - age;
      return element("span", "shop-lease-status",
        `🔑 Đang cho thuê · +${formatMoney(item.profit * units.length)}/năm · còn ${left} năm (hết hạn lúc ${getLeaseEndAge(owned)} tuổi)`);
    }
    const lease = element("button", "shop-lease",
      `🔑 Cho thuê ${units.length > 1 ? "1 căn " : ""}${LEASE_YEARS} năm · +${formatMoney(item.profit)}/năm`);
    lease.type = "button";
    lease.disabled = state.player.isAlive === false;
    lease.addEventListener("click", () => {
      const list = state.player.purchases ?? [];
      if (!list.some((entry) => entry.uid === owned.uid) || isLeased(owned, state.player.age)) return;
      state.player.purchases = list.map((entry) => entry.uid === owned.uid ? { ...entry, rentedAtAge: state.player.age } : entry);
      record(`🔑 Cho thuê ${item.icon} ${item.name} trong ${LEASE_YEARS} năm (đến ${state.player.age + LEASE_YEARS} tuổi): +${formatMoneyAmount(item.profit)} VNĐ mỗi năm, nhận từ năm sau.`);
      renderOwned();
    });
    return lease;
  }

  function renderOwned() {
    const age = state.player.age;
    for (const { list, groups } of ownedSections) {
      const target = $(list);
      target.replaceChildren();
      for (const units of groupOwned(ownedOf(state.player), age)) {
        const item = getShopItem(units[0].id);
        if (!item || !groups.includes(item.group)) continue;
         
        const owned = units.at(-1);
        const many = units.length > 1;
        const sellPrice = getSellPrice(item, owned, age);
        const row = element("li", "shop-owned");
        row.dataset.count = units.length;
        const income = item.profit && !isRental(item)
          ? ` · Lãi +${formatMoney(item.profit * units.length)}/năm${many ? ` (${units.length} × ${formatMoney(item.profit)})` : ""}`
          : isCompanion(item) ? ` · Chăm sóc -${formatMoney(getPetUpkeep(item) * units.length)}/năm` : "";
        const sell = element("button", "shop-sell", `${many ? "Bán bớt 1" : "Bán"} · ${formatMoney(sellPrice)}`);
        sell.type = "button";
        const loan = state.player.homeLoans?.find(entry => units.some(unit => unit.uid === entry.assetUid) && entry.outstanding > 0);
        sell.disabled = state.player.isAlive === false || Boolean(loan);
        if (loan) row.append(element("span", "", `Nợ nhà: ${formatMoney(loan.outstanding)} · ${formatMoney(loan.annualPayment)}/năm · ${loan.years - loan.paymentsMade} kỳ còn lại`));
        sell.addEventListener("click", () => ask(
          `💸 Bán ${item.name}?`,
          `Bạn muốn bán ${many ? "1 " : ""}${item.icon} ${item.name} với giá ${formatMoney(sellPrice)} (${Math.round(sellPrice / item.price * 100)}% giá mua)?` +
            (item.shop === "pets" ? `\nCon được bán ${owned.inherited ? "là con được thừa kế" : `mua lúc ${owned.boughtAtAge} tuổi`}; giá bán giảm theo số năm nuôi.` : "") +
            (many ? `\nBạn còn lại ${units.length - 1} ${item.name.toLocaleLowerCase("vi-VN")}.` : "") +
            (item.profit ? "\nSau khi bán sẽ không còn nhận lãi từ tài sản này."
              : isCompanion(item) ? "\nBạn sẽ phải chia tay người bạn nhỏ này." : ""),
          "Xác nhận bán",
          () => {
            const key = shops[item.shop].owned;
            const before = state.player[key] ?? [];
            if (!before.some((entry) => entry.uid === owned.uid)) return;
            state.player[key] = before.filter((entry) => entry.uid !== owned.uid);
            state.player.money += sellPrice;
            record(`💸 Bán ${item.icon} ${item.name}: Tiền +${formatMoneyAmount(sellPrice)} VNĐ.`);
            renderOwned();
          },
        ));
        row.append(element("span", "",
          `${item.icon} ${item.name}${many ? ` ×${units.length}` : ""} · ${describeOrigin(units, state.player)}${income}`));
        if (item.residential && units.some(unit => !Number.isInteger(unit.rentedAtAge) || age > getLeaseEndAge(unit))) {
          row.append(element("span", "shop-lease-status", "🏠 Có thể dùng để ở · không phải thuê nhà."));
        }
        if (isRental(item) && item.profit) row.append(renderLease(item, units));
        if (isCompanion(item)) row.append(petButton(item, owned, renderOwned));
        row.append(sell);
        target.append(row);
      }
    }
  }

  const open = (shop) => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    currentShop = shop;
    currentGroup = null;
    renderShop();
    shopDialog.showModal();
    focusFirst();
  };
  $("activity-pets").addEventListener("click", () => open("pets"));
  $("activity-shopping").addEventListener("click", () => open("shopping"));
  $("close-shop").addEventListener("click", () => shopDialog.close());
   
  $("assets").addEventListener("click", renderOwned);
}
