import { formatMoney, formatMoneyAmount } from "./money-format.js";
import { recordAchievementFlags } from "./achievements-data.js";
import { getLicenseType, hasLicense } from "./licenses.js";
import { askConfirm } from "./confirm-dialog.js";

// Cửa hàng dùng chung cho "Mua vật nuôi" và "Mua sắm". Giá và lãi tính bằng VNĐ;
// món có profit sinh lãi mỗi năm, mọi món đều bán lại được một nửa giá mua.
// limit: số lượng tối đa được sở hữu cùng lúc, để lãi không nhân lên vô hạn.
export const shopCatalog = [
  // Thú cưng: không sinh lãi; mỗi năm vuốt ve mỗi con một lần để được cộng hạnh phúc.
  // food, vaccine: tiền thức ăn và tiêm ngừa trả mỗi năm từ năm sau khi mua (không có vaccine = không cần tiêm).
  { id: "hamster", shop: "pets", group: "companion", icon: "🐹", name: "Chuột hamster", price: 300_000, happiness: 1, limit: 1,
    food: 600_000, description: "Nhỏ xíu, má phồng, chạy vòng quay lách cách suốt đêm." },
  { id: "cat", shop: "pets", group: "companion", icon: "🐱", name: "Mèo", price: 2_500_000, happiness: 2, limit: 1,
    food: 3_000_000, vaccine: 500_000, description: "Hay cuộn tròn bên cửa sổ, kêu rừ rừ mỗi khi được gãi cằm." },
  { id: "dog", shop: "pets", group: "companion", icon: "🐶", name: "Chó", price: 6_000_000, happiness: 3, limit: 1,
    food: 5_000_000, vaccine: 600_000, description: "Trung thành, lần nào bạn về nhà cũng vẫy đuôi chạy ra đón." },
  { id: "capybara", shop: "pets", group: "companion", icon: "🦫", name: "Capybara", price: 30_000_000, happiness: 4, limit: 1,
    food: 8_000_000, description: "Chuột lang nước điềm tĩnh nhất thế giới, ngồi cạnh thôi cũng thấy bình yên." },
  // Vật nuôi lấy lãi
  { id: "pigeon", shop: "pets", group: "poultry", icon: "🕊️", name: "Bồ câu", price: 100_000, profit: 20_000, limit: 5,
    description: "Nhỏ gọn, sinh sản nhanh, chỉ cần một chiếc chuồng nhỏ trên mái nhà." },
  { id: "duck", shop: "pets", group: "poultry", icon: "🦆", name: "Vịt", price: 120_000, profit: 24_000, limit: 5,
    description: "Thích bơi lội, đẻ trứng đều. Nuôi gần ao thì càng khỏe." },
  { id: "chicken", shop: "pets", group: "poultry", icon: "🐔", name: "Gà ta", price: 150_000, profit: 30_000, limit: 5,
    description: "Dễ nuôi, ăn tạp, mỗi sáng đều có trứng tươi." },
  { id: "turkey", shop: "pets", group: "poultry", icon: "🦃", name: "Gà tây", price: 600_000, profit: 100_000, limit: 5,
    description: "To con, được giá vào dịp lễ cuối năm." },
  { id: "goat", shop: "pets", group: "cattle", icon: "🐐", name: "Dê", price: 3_500_000, profit: 500_000, limit: 5,
    description: "Leo trèo giỏi, ăn cỏ đồi, cho sữa đều." },
  { id: "pig", shop: "pets", group: "cattle", icon: "🐖", name: "Lợn", price: 4_000_000, profit: 600_000, limit: 5,
    description: "Lớn nhanh, mỗi lứa đều mang lại khoản thu ổn định." },
  { id: "sheep", shop: "pets", group: "cattle", icon: "🐑", name: "Cừu", price: 5_000_000, profit: 700_000, limit: 5,
    description: "Hiền lành, mỗi năm cho một mùa lông." },
  { id: "cow", shop: "pets", group: "cattle", icon: "🐄", name: "Bò", price: 18_000_000, profit: 2_500_000, limit: 5,
    description: "Cho sữa và sức kéo, là tài sản lớn của nhà nông." },
  { id: "buffalo", shop: "pets", group: "cattle", icon: "🐃", name: "Trâu", price: 25_000_000, profit: 3_500_000, limit: 5,
    description: "Khỏe mạnh, bền bỉ, người bạn của đồng ruộng." },
  { id: "horse", shop: "pets", group: "cattle", icon: "🐎", name: "Ngựa", price: 40_000_000, profit: 6_000_000, limit: 5,
    description: "Nhanh nhẹn, được thuê kéo xe và phục vụ du lịch." },
  // Phương tiện: chỉ có giá mua, không sinh lãi.
  // license: loại bằng lái cần có trong Tài sản mới được mua.
  { id: "motorbike", shop: "shopping", group: "vehicles", icon: "🛵", name: "Xe máy", price: 30_000_000, license: "motorbike",
    achievement: "own-motorbike", description: "Chiếc xe máy đầu tiên, tự do đi khắp phố phường." },
  { id: "big-bike", shop: "shopping", group: "vehicles", icon: "🏍️", name: "Xe phân khối lớn", price: 400_000_000, license: "motorbike",
    achievement: "own-big-bike", description: "Tiếng pô trầm, dành cho những chuyến đi đường dài." },
  { id: "car", shop: "shopping", group: "vehicles", icon: "🚗", name: "Ô tô", price: 800_000_000, license: "car",
    achievement: "own-car", description: "Chiếc ô tô đầu tiên, che mưa che nắng cho cả nhà." },
  { id: "porsche", shop: "shopping", group: "vehicles", icon: "🏎️", name: "Porsche", price: 8_000_000_000, license: "car",
    achievement: "own-porsche", description: "Xe thể thao Đức, mạnh mẽ và tinh tế." },
  { id: "lamborghini", shop: "shopping", group: "vehicles", icon: "🐂", name: "Lamborghini", price: 25_000_000_000, license: "car",
    achievement: "own-lamborghini", description: "Siêu xe Ý, đi đến đâu cũng có người ngoái nhìn." },
  { id: "rolls-royce", shop: "shopping", group: "vehicles", icon: "🚘", name: "Rolls-Royce", price: 40_000_000_000, license: "car",
    achievement: "own-rolls-royce", description: "Biểu tượng của sự sang trọng bậc nhất." },
  { id: "private-jet", shop: "shopping", group: "vehicles", icon: "✈️", name: "Máy bay riêng", price: 500_000_000_000,
    achievement: "own-private-jet", description: "Bầu trời là của riêng bạn, bay đi đâu tùy thích." },
  // Bất động sản: có lãi cho thuê mỗi năm (12–15%), đủ để lãi chồng lãi tới máy bay riêng trong một đời.
  { id: "house", shop: "shopping", group: "realestate", icon: "🏠", name: "Nhà lầu", price: 5_000_000_000, profit: 600_000_000,
    achievement: "own-house", description: "Căn nhà nhiều tầng khang trang, cho thuê nguyên căn." },
  { id: "restaurant", shop: "shopping", group: "realestate", icon: "🍽️", name: "Nhà hàng", price: 8_000_000_000, profit: 1_200_000_000,
    achievement: "own-restaurant", description: "Mặt bằng nhà hàng rộng rãi ở khu đông khách." },
  { id: "hotel", shop: "shopping", group: "realestate", icon: "🏨", name: "Khách sạn", price: 50_000_000_000, profit: 6_000_000_000,
    achievement: "own-hotel", description: "Khách sạn trung tâm, phòng kín khách quanh năm." },
  { id: "resort", shop: "shopping", group: "realestate", icon: "🏝️", name: "Resort", price: 200_000_000_000, profit: 24_000_000_000,
    achievement: "own-resort", description: "Khu nghỉ dưỡng ven biển, sóng vỗ rì rào." },
  // Kinh doanh: tự có lãi mỗi năm, không cần cho thuê.
  { id: "noodle-cart", shop: "shopping", group: "business", icon: "🍜", name: "Xe hủ tiếu", price: 30_000_000, profit: 6_000_000, limit: 3,
    achievement: "own-noodle-cart", description: "Gánh hủ tiếu đầu đời, nước lèo ngọt thanh, khách quen ghé mỗi tối." },
  { id: "cafe", shop: "shopping", group: "business", icon: "☕", name: "Quán cafe", price: 1_500_000_000, profit: 225_000_000, limit: 2,
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
      { id: "items", label: "🧸 Mua vật dụng", comingSoon: true },
      { id: "vehicles", label: "🚗 Mua phương tiện" },
      { id: "realestate", label: "🏢 Mua bất động sản" },
      { id: "business", label: "🏪 Kinh doanh" },
    ],
  },
};

// Thứ tự các thẻ trong popup Tài sản.
export const ownedSections = [
  { list: "life-livestock", groups: ["companion", "cattle", "poultry"] },
  { list: "life-realestate", groups: ["realestate", "business"] },
  { list: "life-vehicles", groups: ["vehicles"] },
];

export const getShopItem = (id) => shopCatalog.find((item) => item.id === id);
export const getSellPrice = (item) => Math.floor(item.price / 2);

// Bất động sản chỉ có lãi khi người chơi cho thuê trong Tài sản; mỗi hợp đồng kéo dài 4 năm.
export const LEASE_YEARS = 4;
export const isRental = (item) => item?.group === "realestate";
export const getLeaseEndAge = (owned) => Number.isInteger(owned.rentedAtAge) ? owned.rentedAtAge + LEASE_YEARS : null;
export const isLeased = (owned, age) => getLeaseEndAge(owned) !== null && age < getLeaseEndAge(owned);

// Thú cưng được vuốt ve một lần mỗi năm (mỗi con), lưu tuổi lần cuối vào pettedAtAge.
export const isCompanion = (item) => item?.group === "companion";
export const hasPettedThisYear = (owned, age) => owned.pettedAtAge === age;

// Tài sản gộp các món cùng loại thành một dòng (×N) để danh sách không dài ra.
// Nhà cho thuê chỉ gộp các căn cùng trạng thái: chưa cho thuê, hoặc cùng tuổi hết hạn.
export function groupOwned(entries, age) {
  const groups = new Map();
  for (const owned of entries) {
    const key = `${owned.id}|${isLeased(owned, age) ? getLeaseEndAge(owned) : ""}`;
    groups.set(key, [...(groups.get(key) ?? []), owned]);
  }
  return [...groups.values()];
}
// "25 tuổi", "25, 27 tuổi", hoặc "25–40 tuổi" khi có nhiều mốc.
export function describeAges(ages) {
  const unique = [...new Set(ages)].sort((a, b) => a - b);
  return unique.length > 3 ? `${unique[0]}–${unique.at(-1)} tuổi` : `${unique.join(", ")} tuổi`;
}

const ownedOf = (player) => [...(player.livestock ?? []), ...(player.purchases ?? [])];
export const countOwned = (player, id) => ownedOf(player).filter((entry) => entry.id === id).length;
export const isAtLimit = (player, item) => Boolean(item.limit) && countOwned(player, item.id) >= item.limit;

export const getPetUpkeep = (item) => (item.food ?? 0) + (item.vaccine ?? 0);
const describeUpkeep = (item) => item.vaccine ? "thức ăn và tiêm ngừa" : "thức ăn";

// Lãi trả khi sang tuổi mới, cho mỗi món đã sở hữu ít nhất từ năm trước.
// Thú cưng nuôi từ năm trước thì trừ tiền thức ăn và tiêm ngừa.
export function collectAssetIncome(player, age) {
  const companions = ownedOf(player).filter((entry) => isCompanion(getShopItem(entry.id)) && entry.boughtAtAge < age);
  const owned = ownedOf(player).filter((entry) => getShopItem(entry.id)?.profit);
  // Bất động sản: trả tiền thuê cho các năm nằm trong hợp đồng 4 năm.
  const earning = owned.filter((entry) => isRental(getShopItem(entry.id))
    ? Number.isInteger(entry.rentedAtAge) && entry.rentedAtAge < age && age <= getLeaseEndAge(entry)
    : entry.boughtAtAge < age);
  const expired = owned.filter((entry) => isRental(getShopItem(entry.id)) && getLeaseEndAge(entry) === age);
  if (!earning.length && !expired.length && !companions.length) return null;
  const pets = earning.filter((entry) => getShopItem(entry.id).shop === "pets");
  const rentals = earning.filter((entry) => isRental(getShopItem(entry.id)));
  const businesses = earning.filter((entry) => getShopItem(entry.id).group === "business");
  const total = (list) => list.reduce((sum, entry) => sum + getShopItem(entry.id).profit, 0);
  const upkeep = companions.reduce((sum, entry) => sum + getPetUpkeep(getShopItem(entry.id)), 0);
  const amount = total(earning) - upkeep;
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
  return { amount, content: lines.join("\n") };
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
    localStorage.setItem("lifeAgainSave", JSON.stringify(state));
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
    if (player.isAlive === false || !current || hasPettedThisYear(current, player.age)) return;
    player.livestock = list.map((entry) => entry.uid === owned.uid ? { ...entry, pettedAtAge: player.age } : entry);
    const before = player.happiness;
    player.happiness = Math.min(100, before + item.happiness);
    const gain = player.happiness - before;
    record(`🤲 Vuốt ve ${item.icon} ${item.name}${gain ? `: Hạnh phúc +${gain}` : ""}.`);
    renderStats();
  }

  const petButton = (item, owned, rerender) => {
    const done = hasPettedThisYear(owned, state.player.age);
    const button = element("button", "shop-pet", done ? "✅ Đã vuốt ve năm nay" : `🤲 Vuốt ve · Hạnh phúc +${item.happiness}`);
    button.type = "button";
    button.disabled = done || state.player.isAlive === false;
    button.addEventListener("click", () => {
      pet(item, owned);
      rerender();
    });
    return button;
  };

  function renderItem(item) {
    const card = element("article", "shop-item");
    const figures = [`💰 Giá mua: ${formatMoney(item.price)}`];
    figures.push(item.profit
      ? `📈 ${item.shop === "pets" ? "Lãi mỗi năm" : item.group === "business" ? "Lãi kinh doanh mỗi năm" : "Lãi cho thuê mỗi năm"}: +${formatMoney(item.profit)}`
      : isCompanion(item) ? `💖 Vuốt ve mỗi năm: Hạnh phúc +${item.happiness}`
      : `🔁 Bán lại: ${formatMoney(getSellPrice(item))}`);
    if (isRental(item)) figures.push(`🔑 Vào Tài sản để cho thuê, mỗi lần ${LEASE_YEARS} năm`);
    if (isCompanion(item)) {
      figures.push(`🍖 Thức ăn: -${formatMoney(item.food)}/năm`,
        item.vaccine ? `💉 Tiêm ngừa: -${formatMoney(item.vaccine)}/năm` : "💉 Không cần tiêm ngừa");
    }
    if (item.license) figures.push(`🪪 Cần ${getLicenseType(item.license).name.toLocaleLowerCase("vi-VN")}`);
    if (item.limit) figures.push(`📦 Đang có ${countOwned(state.player, item.id)}/${item.limit}`);
    const buy = element("button", "shop-buy");
    buy.type = "button";
    const licensed = !item.license || hasLicense(state.player, item.license);
    const affordable = state.player.money >= item.price;
    const full = isAtLimit(state.player, item);
    buy.disabled = !licensed || !affordable || full;
    buy.textContent = !licensed ? `🪪 Cần ${getLicenseType(item.license).name.toLocaleLowerCase("vi-VN")}`
      : full ? `Đã đủ ${item.limit}` : affordable ? "🛒 Mua" : "Không đủ tiền";
    buy.addEventListener("click", () => ask(
      `🛒 Mua ${item.name}?`,
      `Bạn muốn mua ${item.icon} ${item.name} với giá ${formatMoney(item.price)}?\n` +
        (isRental(item)
          ? `Tiền thuê: +${formatMoney(item.profit)}/năm. Sau khi mua, vào Tài sản để cho thuê, mỗi hợp đồng ${LEASE_YEARS} năm.\n`
          : item.profit ? `Lãi mỗi năm: +${formatMoney(item.profit)}, bắt đầu từ năm sau.\n`
          : isCompanion(item) ? `Mỗi năm vuốt ve một lần: Hạnh phúc +${item.happiness}.\n` +
            `Chi phí ${describeUpkeep(item)}: -${formatMoney(getPetUpkeep(item))}/năm, bắt đầu từ năm sau.\n` : "") +
        `Nếu bán lại chỉ nhận ${formatMoney(getSellPrice(item))}.`,
      "Xác nhận mua",
      () => {
        if (state.player.money < item.price || isAtLimit(state.player, item) ||
            (item.license && !hasLicense(state.player, item.license))) return;
        const key = shops[item.shop].owned;
        state.player.money -= item.price;
        state.player[key] = [...(state.player[key] ?? []), {
          uid: `${item.id}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
          id: item.id,
          boughtAtAge: state.player.age,
        }];
        if (item.achievement) recordAchievementFlags(state, [item.achievement]);
        record(`${item.shop === "pets" ? "🐾" : "🛍️"} Mua ${item.icon} ${item.name}: Tiền -${formatMoneyAmount(item.price)} VNĐ.`);
        checkAchievements();
        renderShop();
      },
    ));
    const figureText = element("p", "shop-figures", figures.join("\n"));
    card.append(element("h4", "", `${item.icon} ${item.name}`), element("p", "", item.description), figureText, buy);
    const companion = isCompanion(item) && (state.player.livestock ?? []).find((entry) => entry.id === item.id);
    if (companion) card.append(petButton(item, companion, renderShop));
    return card;
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

  // units: các căn cùng loại, cùng trạng thái thuê (một dòng trong Tài sản); nút chỉ cho thuê một căn.
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
        // Bán món mua sau cùng trong nhóm.
        const owned = units.at(-1);
        const many = units.length > 1;
        const row = element("li", "shop-owned");
        row.dataset.count = units.length;
        const income = item.profit && !isRental(item)
          ? ` · Lãi +${formatMoney(item.profit * units.length)}/năm${many ? ` (${units.length} × ${formatMoney(item.profit)})` : ""}`
          : isCompanion(item) ? ` · Chăm sóc -${formatMoney(getPetUpkeep(item) * units.length)}/năm` : "";
        const sell = element("button", "shop-sell", `${many ? "Bán bớt 1" : "Bán"} · ${formatMoney(getSellPrice(item))}`);
        sell.type = "button";
        sell.disabled = state.player.isAlive === false;
        sell.addEventListener("click", () => ask(
          `💸 Bán ${item.name}?`,
          `Bạn muốn bán ${many ? "1 " : ""}${item.icon} ${item.name} với giá ${formatMoney(getSellPrice(item))} (một nửa giá mua)?` +
            (many ? `\nBạn còn lại ${units.length - 1} ${item.name.toLocaleLowerCase("vi-VN")}.` : "") +
            (item.profit ? "\nSau khi bán sẽ không còn nhận lãi từ tài sản này."
              : isCompanion(item) ? "\nBạn sẽ phải chia tay người bạn nhỏ này." : ""),
          "Xác nhận bán",
          () => {
            const key = shops[item.shop].owned;
            const before = state.player[key] ?? [];
            if (!before.some((entry) => entry.uid === owned.uid)) return;
            state.player[key] = before.filter((entry) => entry.uid !== owned.uid);
            state.player.money += getSellPrice(item);
            record(`💸 Bán ${item.icon} ${item.name}: Tiền +${formatMoneyAmount(getSellPrice(item))} VNĐ.`);
            renderOwned();
          },
        ));
        row.append(element("span", "",
          `${item.icon} ${item.name}${many ? ` ×${units.length}` : ""} · Mua lúc ${describeAges(units.map((unit) => unit.boughtAtAge))}${income}`));
        if (isRental(item)) row.append(renderLease(item, units));
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
  // Popup Tài sản tự mở trong life-profile.js; ở đây chỉ vẽ các tài sản đã mua.
  $("assets").addEventListener("click", renderOwned);
}
