import { createInitialState } from "./state.js";
import { hashText, getLifeSeed, seededRandom } from "./life-seed.js";
import { getChildAge } from "../relationships/family.js";
import { careerEvent } from "../career/career-event.js";
import { getCareerProfile } from "../career/career-jobs.js";
import { getCareerAnnualSalary, retirePlayer, RETIREMENT_AGE } from "../career/career-salary.js";
import { studyBlocks } from "../education/study-blocks.js";
import { allocationFor, assetsValue, givenName, summarizeAssets } from "./inheritance.js";
import { describeDreamEnding, normalizeDreams, DREAMS } from "../events/dreams.js";
import { describeRootJourney, ROOT_NAMES } from "../events/dream-roots.js";
import { createAdmirer } from "../relationships/relationships.js";
import { maleNames, femaleNames } from "./character-data.js";
import { getOrientationLabel } from "../special-events/special-event-24.js";

// Xu hướng tính dục của người con chưa được ghi lại: chọn ngẫu nhiên đều giữa bốn lựa chọn của game,
// theo chuỗi ngẫu nhiên riêng để tải lại không đổi.
export const ORIENTATIONS = ["heterosexual", "homosexual", "bisexual", "pansexual"];
export const heirOrientation = (founder, childId) =>
  ORIENTATIONS[Math.floor(seededRandom(hashText(`${getLifeSeed(founder)}|orientation|${childId}`))() * ORIENTATIONS.length)];

// Một lượt chơi có tối đa hai đời: nhân vật đầu và đúng một người con. Không có đời cháu.
export const MAX_GENERATIONS = 2;
export const HEIR_MIN_AGE = 18;
const SIMPLE_CAREERS = new Set(["programming", "accounting", "teaching", "business", "finance", "mechanical", "architecture",
  "marketing", "medicine", "psychology", "law", "culinary", "tourism", "painting", "fashion"]);
// Việc tốt đời trước đã thực sự làm (theo dấu sự kiện), dùng cho sự kiện gặp lại người được giúp.
const DEEDS = [
  ["giup_hoc_tro", "giúp một học trò vùng cao được đi học tiếp"], ["do_dau_tre", "nhận đỡ đầu một đứa trẻ"],
  ["xay_cau", "góp tiền xây một cây cầu ở quê"], ["thu_vien_truong_lang", "góp xây thư viện cho trường làng"],
  ["hoc_bong_ten_minh", "đứng tên một suất học bổng"], ["bao_ban_cat_giam", "báo trước cho một người bạn chuyện cắt giảm"],
  ["kem_bai_tre_hang_xom", "kèm bài cho đứa trẻ hàng xóm"], ["bep_tu_thien", "nấu bếp từ thiện cho bệnh nhân nghèo"],
  ["giup_chau_du_hoc", "giúp một đứa cháu đi du học"], ["gom_qua_bao_ve", "gom quà tiễn người bảo vệ khu phố"],
  ["dan_khan_vung_nui", "đan khăn gửi trẻ vùng núi"],
];
const clamp = (value) => Math.max(1, Math.min(100, Math.round(value)));
const roleOf = (gender) => gender === "female" ? "mẹ" : "bố";

export function getLineage(player) {
  const raw = player?.lineage;
  return raw && typeof raw === "object" ? { generation: raw.generation === 2 ? 2 : 1, successionUsed: raw.successionUsed === true,
    declined: raw.declined === true, ...raw } : { generation: 1, successionUsed: false, declined: false };
}

export function listHeirCandidates(player) {
  return (player.children ?? []).filter((child) => child.alive !== false && child.isAlive !== false)
    .map((child) => ({ child, age: getChildAge(child, player.age) })).filter(({ age }) => age >= HEIR_MIN_AGE);
}

// Lựa chọn tiếp nối chỉ có ở đời đầu, sau khi qua đời, khi chưa dùng quyền và chưa chọn kết thúc.
export function canOfferSuccession(player) {
  const lineage = getLineage(player);
  return player?.isAlive === false && lineage.generation === 1 && !lineage.successionUsed && !lineage.declined &&
    listHeirCandidates(player).length > 0;
}

export function founderDeed(player) {
  const flags = new Set(player.storyFlags ?? []);
  return DEEDS.find(([flag]) => flags.has(flag))?.[1] ?? null;
}

// Ước mơ chưa hoàn thành của đời đầu, để người con có thể tự chọn tiếp nối.
export function unfinishedWish(player) {
  const dreams = normalizeDreams(player.dreams);
  for (const id of Object.keys(DREAMS)) {
    const entry = dreams.entries[id];
    if (entry && ["active", "paused"].includes(entry.status)) return { id, name: DREAMS[id].name, from: "dream" };
  }
  const root = dreams.roots;
  if (root && !["done"].includes(root.stage) && root.status !== "dropped" && !dreams.entries[root.id]) {
    return { id: root.id, name: DREAMS[root.id].name, from: "root" };
  }
  return null;
}

// Mô tả từng người con ở màn chọn: chỉ dùng dữ liệu thật đang có và phần được chia.
export function describeHeir(player, child) {
  const age = getChildAge(child, player.age);
  const allocation = allocationFor(player.estate, `child:${child.id}`);
  const plan = { supported: "học bổ trợ", intensive: "học chuyên sâu" }[child.educationPlan] ?? "học theo chương trình thường";
  const seed = child.dreamSeed ? ROOT_NAMES[child.dreamSeed.id] ?? DREAMS[child.dreamSeed.id]?.name : null;
  const bond = Number.isFinite(child.relationship) ? child.relationship : Number.isFinite(child.bond) ? child.bond : 80;
  return { id: child.id, name: child.name, age, adopted: child.adopted === true, bond,
    education: `${plan}${child.collegeSupport ? ", được hỗ trợ học đại học" : ""}`,
    dream: seed ? `Từng mê: ${seed.toLowerCase()} (năm ${child.dreamSeed.age} tuổi)` : "Chưa ghi nhận mầm ước mơ",
    inheritedCash: allocation?.cash ?? 0, inheritedAssets: allocation?.assets ?? [], inheritedValue: (allocation?.cash ?? 0) + assetsValue(allocation),
    memories: (child.memories ?? []).length };
}

function founderSnapshot(player, cause) {
  const dreamLines = describeDreamEnding(player);
  return {
    lifeId: player.lifeId ?? null, name: player.name, given: givenName(player.name), gender: player.gender, role: roleOf(player.gender),
    province: player.province ?? "", age: player.age, cause: cause ?? "", job: player.retiredJob ?? player.job ?? "",
    moneyBefore: player.estate?.moneyBefore ?? 0, totalCash: player.estate?.totalCash ?? 0,
    keepsakes: (player.estate?.before?.keepsakes ?? player.keepsakes ?? []).map((item) => ({ id: item.id, name: item.name, receivedAtAge: item.receivedAtAge, description: item.description ?? "" })),
    memories: (player.memories ?? []).map((item) => ({ title: item.title, receivedAtAge: item.receivedAtAge, text: item.text ?? "" })),
    dreamLines, deed: founderDeed(player), wish: unfinishedWish(player),
    children: (player.children ?? []).map((child) => ({ id: child.id, name: child.name, gender: child.gender, adopted: child.adopted === true,
      age: getChildAge(child, player.age), alive: child.alive !== false && child.isAlive !== false })),
  };
}

function relativeFromPartner(founder, child, childAge, rand) {
  const coParent = child.coParent;
  if (!coParent) return null;
  const partner = founder.partner?.id === coParent.id ? founder.partner : null;
  const widowed = (founder.relationshipHistory ?? []).find((entry) => entry.type === "widowed" && entry.person?.id === coParent.id);
  const partnerAge = partner && Number.isFinite(partner.ageAtMeeting) && Number.isFinite(partner.metAtAge)
    ? partner.ageAtMeeting + founder.age - partner.metAtAge : founder.age - 2 + Math.floor(rand() * 5);
  const gender = partner?.gender ?? widowed?.person?.gender ?? (founder.gender === "female" ? "male" : "female");
  const alive = Boolean(partner) || !widowed;
  return { gender, relative: {
    role: gender === "female" ? "Mẹ" : "Bố", name: coParent.name, ageAtPlayerBirth: Math.max(16, partnerAge - childAge), alive,
    diedAtAge: alive ? null : Math.max(0, childAge - (founder.age - widowed.age)), passedBeforeTracking: false,
    bond: 70, condition: "healthy", job: partner?.job ?? "Chưa rõ", trackedFrom: childAge,
    interactions: { calls: 0, visits: 0, cares: 0, helpers: 0, treatments: 0 }, done: {}, promise: null,
  } };
}

// Nghề, chỉ số và tiền riêng của người con chưa được game mô phỏng: suy ra một lần, có định danh,
// đánh dấu là suy ra để không trao thành tựu hay danh hiệu dựa trên đó.
function inferAdultLife(founder, child, age, rand) {
  const blocks = studyBlocks.filter((block) => block.id !== "TD");
  const block = blocks[Math.floor(rand() * blocks.length)];
  const options = block.careers.filter((id) => SIMPLE_CAREERS.has(id));
  const careerId = options[Math.floor(rand() * options.length)] ?? "business";
  const choice = careerEvent.choices.find((item) => item.careerPath?.id === careerId);
  const careerPath = choice ? JSON.parse(JSON.stringify(choice.careerPath)) : { id: careerId, field: careerId, school: null };
  const working = age >= RETIREMENT_AGE || rand() < 0.85;
  const level = age < 30 ? 1 : 2;
  const years = Math.max(0, Math.min(age, RETIREMENT_AGE) - 22);
  const salary = getCareerAnnualSalary(careerId, level, careerPath);
  const savings = working ? Math.round(Math.min(3_000_000_000, Math.max(5_000_000, salary * years * 0.08)) / 1_000_000) * 1_000_000
    : Math.round(Math.max(2_000_000, years * 1_500_000) / 1_000_000) * 1_000_000;
  const plan = { supported: 6, intensive: 12 }[child.educationPlan] ?? 0;
  const bond = Number.isFinite(child.relationship) ? child.relationship : Number.isFinite(child.bond) ? child.bond : 80;
  const stats = {
    health: clamp(Math.max(35, 90 - Math.max(0, age - 30) * 0.6 + rand() * 8 - 4)),
    intelligence: clamp(52 + plan + (child.collegeSupport ? 5 : 0) + rand() * 10 - 5),
    happiness: clamp(48 + (bond - 50) * 0.4 + rand() * 8 - 4),
    appearance: clamp(50 + rand() * 20 - 10),
  };
  const profile = getCareerProfile(careerId, careerPath);
  const career = working ? {
    careerPath, studyBlock: block.id, employmentStatus: "employed", careerLevel: level, job: profile.ranks[level - 1],
    employedSince: Math.max(22, age - Math.max(1, Math.min(years, 3 + Math.floor(rand() * 6)))),
    nextPromotionAge: age < 40 ? Math.max(27, age + 3) : null, lastSalaryAge: age,
  } : { careerPath, studyBlock: block.id, employmentStatus: "unemployed", careerLevel: 0, job: "Thất nghiệp", nextPromotionAge: null, lastSalaryAge: age };
  return { stats, career, savings, careerId };
}

// Hai sự kiện của đời đầu đã ghi lại chuyện gia đình của một người con cụ thể. Sự kiện nói về
// đứa con đầu tiên hợp khoảng tuổi lúc ấy, nên tính lại theo đúng quy tắc chọn con của sự kiện.
const FAMILY_HISTORY = [
  { seen: "seen:ls50-con-cuoi", atAge: 50, childAge: [22, 32], fact: "married" },
  { seen: "seen:ls68-chat-nho", atAge: 68, childAge: [36, 55], fact: "grandchild" },
];
export function knownFamilyHistory(founder, childId) {
  const flags = new Set(founder.storyFlags ?? []);
  const facts = {};
  for (const entry of FAMILY_HISTORY) {
    if (!flags.has(entry.seen)) continue;
    const referred = (founder.children ?? []).find((kid) => {
      const kidAge = getChildAge(kid, entry.atAge);
      return kid.joinedAtAge <= entry.atAge && kidAge >= entry.childAge[0] && kidAge <= entry.childAge[1];
    });
    if (referred?.id === childId) facts[entry.fact] = { childAge: getChildAge(referred, entry.atAge), founderAge: entry.atAge };
  }
  return facts;
}
// Tỷ lệ đã lập gia đình theo tuổi khi không có lịch sử. Không ai được mặc định có bạn đời hay con.
const MARRIED_BY_AGE = [[45, 0.78], [35, 0.74], [30, 0.62], [25, 0.4], [22, 0.15], [0, 0.03]];

// Hoàn cảnh gia đình của người con lúc tiếp quản: ưu tiên điều đời đầu đã ghi lại, phần còn lại
// suy ra một lần theo tuổi. Kết quả nằm trong bản lưu nên tải lại không đổi.
function inferHeirFamily(founder, child, age, gender, orientation, careerPath, rand) {
  const known = knownFamilyHistory(founder, child.id);
  const chance = MARRIED_BY_AGE.find(([from]) => age >= from)[1];
  const married = Boolean(known.married || known.grandchild) || (age >= 20 && rand() < chance);
  if (!married) return { status: "single", source: "age", updates: {}, history: [] };
  const yearsAgo = founder.age - age;
  const grandchildBornAt = known.grandchild ? known.grandchild.childAge - (3 + Math.floor(rand() * 4)) : null;
  let marriedAtAge = known.married ? known.married.childAge
    : Math.min(age, 22 + Math.floor(rand() * (Math.max(0, Math.min(age, 36) - 22) + 1)));
  if (grandchildBornAt != null) marriedAtAge = Math.max(20, Math.min(marriedAtAge, grandchildBornAt - 1));
  const metAtAge = Math.max(18, marriedAtAge - 1 - Math.floor(rand() * 4));
  const partner = { ...createAdmirer({ gender, orientation, careerPath }, metAtAge, rand),
    relationship: 70 + Math.floor(rand() * 21), inferred: true };
  const births = [];
  const wanted = grandchildBornAt != null ? Math.max(1, rand() < 0.5 ? 1 : 2) : age - marriedAtAge < 1 ? 0 : rand() < 0.2 ? 0 : rand() < 0.5 ? 1 : 2;
  let next = grandchildBornAt ?? marriedAtAge + 1 + Math.floor(rand() * 4);
  for (let index = 0; index < wanted && next <= Math.min(age, 45); index++) {
    births.push(next);
    next += 2 + Math.floor(rand() * 4);
  }
  // Hai người cùng giới thì con là con nuôi, như quy tắc của game; tuổi của con vẫn giữ nguyên.
  const adopted = partner.gender === gender;
  const taken = [];
  const children = births.map((bornAt, index) => {
    // Đứa cháu đời đầu đã gặp phải có mặt trong nhà từ trước lúc sự kiện kể.
    const knownBy = index === 0 && known.grandchild ? known.grandchild.childAge - bornAt : 5;
    const initialAge = adopted ? Math.max(0, Math.min(5, age - bornAt, knownBy)) : 0;
    const kidGender = rand() < 0.5 ? "male" : "female";
    const names = (kidGender === "female" ? femaleNames : maleNames).filter((name) => !taken.includes(name));
    const name = names[Math.floor(rand() * names.length)];
    taken.push(name);
    return { id: `child-${partner.id}-${bornAt}`, name, gender: kidGender, adopted, relationship: 75 + Math.floor(rand() * 16),
      initialAge, joinedAtAge: bornAt + initialAge, coParent: { id: partner.id, name: partner.name }, lastCarePaidAtAge: age, inferred: true };
  });
  const history = [
    { age: metAtAge, type: "dating", person: partner, inferred: true, text: `Tôi bắt đầu hẹn hò với ${partner.name}.` },
    { age: marriedAtAge, type: "married", person: partner, inferred: true, text: `Tôi và ${partner.name} cưới nhau.` },
    ...children.map((kid) => ({ age: kid.joinedAtAge, type: kid.adopted ? "adopted-child" : "child-born", person: partner, inferred: true,
      text: kid.adopted ? `Gia đình nhận nuôi con ${kid.name}, ${kid.initialAge} tuổi.` : `Gia đình chào đón con ${kid.name}.` })),
  ];
  const latest = children.at(-1);
  return {
    status: "married", source: known.married || known.grandchild ? "history" : "age", marriedAtAge, children: children.length,
    yearsAgo, history,
    updates: { partner, marriedAtAge, relationshipStartedAtAge: metAtAge, marriageScheduleVersion: 2, nextMarriageProposalAge: null,
      children, childProposalCompleted: children.length > 0, childProposalDeclines: 0, childProposalStopped: false,
      nextChildProposalAge: latest ? Math.max(latest.joinedAtAge + 5, age + 1) : Math.max(marriedAtAge + 5, age + 1) },
  };
}

// Dựng người con ở đúng tuổi hiện tại. Thuần, tất định theo đời và người con: tải lại cho cùng kết quả.
export function buildSuccessor(founderState, childId, { cause = "", recall = null, runId = null } = {}) {
  const founder = founderState.player;
  if (!canOfferSuccession(founder) || !founder.estate?.settled) return null;
  const candidate = listHeirCandidates(founder).find(({ child }) => child.id === childId);
  if (!candidate) return null;
  const { child, age } = candidate;
  const rand = seededRandom(hashText(`${getLifeSeed(founder)}|heir|${child.id}`));
  const base = createInitialState().player;
  const inferred = inferAdultLife(founder, child, age, rand);
  const allocation = allocationFor(founder.estate, `child:${child.id}`);
  const years = (entry) => founder.age - (Number.isFinite(entry?.boughtAtAge) ? entry.boughtAtAge : founder.age);
  // Tài sản được chia giữ nguyên định danh; tuổi mua quy đổi theo tuổi người con để giá bán lại không đổi.
  const shift = (entry) => ({ ...entry, boughtAtAge: age - years(entry),
    ...(Number.isInteger(entry.rentedAtAge) ? { rentedAtAge: age - (founder.age - entry.rentedAtAge) } : {}), inherited: true, inheritedAtAge: age });
  const purchases = [], livestock = [], auctionItems = [];
  for (const asset of allocation?.assets ?? []) {
    if (!asset.entry) continue;
    if (asset.kind === "purchase") purchases.push(shift(asset.entry));
    if (asset.kind === "livestock") livestock.push(shift(asset.entry));
    if (asset.kind === "auction") auctionItems.push({ ...asset.entry, receivedAtAge: age, inherited: true });
  }
  const founderRelative = {
    id: founder.gender === "female" ? "mother" : "father", role: founder.gender === "female" ? "Mẹ" : "Bố", name: founder.name,
    ageAtPlayerBirth: founder.age - age, alive: false, diedAtAge: age, passedBeforeTracking: false, bond: child.relationship ?? 80,
    condition: "healthy", job: founder.retiredJob ?? founder.job ?? "Chưa rõ", trackedFrom: age,
    interactions: { calls: 0, visits: 0, cares: 0, helpers: 0, treatments: 0 }, done: {}, promise: null,
  };
  const other = relativeFromPartner(founder, child, age, rand);
  const relatives = [founderRelative];
  if (other) relatives.push({ ...other.relative, id: other.relative.role === "Mẹ" && founderRelative.id !== "mother" ? "mother"
    : other.relative.role === "Bố" && founderRelative.id !== "father" ? "father" : "parent-2" });
  const siblings = (founder.children ?? []).filter((item) => item.id !== child.id).map((item) => ({
    id: item.id, name: item.name, gender: item.gender, adopted: item.adopted === true, ageOffset: getChildAge(item, founder.age) - age,
    alive: item.alive !== false && item.isAlive !== false,
    inheritedCash: allocationFor(founder.estate, `child:${item.id}`)?.cash ?? 0,
  }));
  const snapshot = founderSnapshot(founder, cause);
  // Mầm ước mơ riêng của người con (ghi lúc bố/mẹ nuôi con), hoặc điều người chơi chọn khi hồi tưởng.
  const seed = child.dreamSeed;
  const roots = seed && DREAMS[seed.id] ? { id: seed.id, status: "growing", stage: "seed", interest: seed.interest === "quiet" ? "quiet" : "eager",
    seedAge: seed.age, sourceKind: "heir", sourceId: founderRelative.id, sourceName: snapshot.given, lastStepAge: age,
    milestones: [{ age: seed.age, text: seed.text ?? `mê ${DREAMS[seed.id].name.toLowerCase()}.` }] }
    : recall && DREAMS[recall] ? { id: recall, status: "growing", stage: "seed", interest: "eager", seedAge: null, sourceKind: "recall",
      sourceId: null, sourceName: null, lastStepAge: age, milestones: [{ age, text: `nhìn lại và nhận ra mình vẫn mong: ${DREAMS[recall].name.toLowerCase()}.` }] } : null;
  const wish = snapshot.wish ? { ...snapshot.wish, parentRole: snapshot.role, parentName: snapshot.given, status: "open", laterAge: null } : null;
  const heirGender = child.gender === "female" ? "female" : "male";
  const orientation = heirOrientation(founder, child.id);
  const family = inferHeirFamily(founder, child, age, heirGender, orientation, inferred.career.careerPath, rand);
  const message = allocation?.message ? `\n💌 Lời nhắn của ${snapshot.role} ${snapshot.given}: “${allocation.message}”` : "";
  const cash = allocation?.cash ?? 0;
  const player = {
    ...base,
    name: child.name, gender: heirGender, orientation, province: founder.province ?? "",
    age, isAlive: true, lifeSeed: hashText(`${getLifeSeed(founder)}|life|${child.id}`) >>> 0,
    lifeId: `${founder.lifeId ?? "legacy"}-heir-${child.id}`,
    ...inferred.stats, ...inferred.career, careerInferred: true, careerYears: { [inferred.careerId]: 0 },
    economyPaidAge: age, familyBudgetPaidAge: age,
    money: inferred.savings + cash, purchases, livestock, auctionItems,
    // Cờ sự kiện là của riêng từng nhân vật: người con bắt đầu không mang cờ nào của bố/mẹ.
    storyFlags: [], elderThemes: [],
    relatives, keepsakes: (allocation?.keepsakes ?? []).map((item) => ({ ...item, inherited: true })),
    ...family.updates, relationshipHistory: family.history,
    dreams: roots || wish ? { active: null, entries: {}, later: {}, offers: {}, roots, seed: { offers: 0, passed: [], lastAge: null }, parentWish: wish } : null,
    lifeUnlockedAchievementIds: [], lifeAchievementIds: [], achievementFlags: {},
    lineage: {
      runId: runId ?? founder.lineage?.runId ?? founder.lifeId ?? `run-${getLifeSeed(founder)}`, generation: 2, successionUsed: true, declined: false,
      takeoverAge: age, heirChildId: child.id, adopted: child.adopted === true, founder: snapshot, siblings,
      inheritance: { cash, assets: (allocation?.assets ?? []).map((item) => ({ name: item.name, icon: item.icon, value: item.value, kind: item.kind })),
        keepsakes: (allocation?.keepsakes ?? []).map((item) => item.name), message: allocation?.message ?? "" },
      inferred: { savings: inferred.savings, savingsLeft: inferred.savings, career: inferred.careerId,
        family: { status: family.status, source: family.source, marriedAtAge: family.marriedAtAge ?? null, children: family.children ?? 0 }, orientation,
        note: "Nghề nghiệp, chỉ số, tiền riêng và hoàn cảnh gia đình trước khi tiếp quản được suy ra một lần từ dữ liệu đã có." },
      // Album: kỷ vật của đời trước chưa thuộc về người con này; món đã trao cho anh chị em ghi rõ ai đang giữ.
      familyKeepsakes: snapshot.keepsakes.filter((item) => !(allocation?.keepsakes ?? []).some((own) => own.id === item.id)).map((item) => ({
        ...item, owner: `${snapshot.role} ${snapshot.given}`,
        holder: (founder.estate?.allocations ?? []).find((entry) => entry.key !== `child:${child.id}` && entry.keepsakes.some((own) => own.id === item.id))?.name ?? null })),
      familyMemories: snapshot.memories.map((item) => ({ ...item, owner: `${snapshot.role} ${snapshot.given}` })),
      childMemories: (child.memories ?? []).slice(-12),
    },
  };
  if (player.employmentStatus === "employed" && age >= RETIREMENT_AGE) retirePlayer(player, age);
  const logs = [{ age, content:
    `🌱 ${snapshot.role === "mẹ" ? "Mẹ" : "Bố"} ${snapshot.name} đã qua đời. Từ nay câu chuyện tiếp tục với ${child.name}, ${age} tuổi.\n` +
    `💼 ${player.employmentStatus === "retired" ? "Đã nghỉ hưu" : player.job}, ngành ${player.careerPath?.field ?? "chưa rõ"}. Tiền riêng: ${inferred.savings.toLocaleString("vi-VN")} VNĐ.\n` +
    `🌈 ${getOrientationLabel(orientation, heirGender)}.\n` +
    (family.status === "married"
      ? `💞 Đã cưới ${family.updates.partner.name} từ năm ${family.marriedAtAge} tuổi${family.children ? `, có ${family.children} con` : ", chưa có con"}.\n`
      : "💞 Chưa lập gia đình.\n") +
    `📜 Phần thừa kế: ${cash.toLocaleString("vi-VN")} VNĐ${player.lineage.inheritance.assets.length ? ` và ${summarizeAssets(player.lineage.inheritance.assets)}` : ""}.${message}` }];
  return { player, logs };
}

// Tổng kết hai đời cho màn kết thúc của đời con.
export function describeTwoLives(player, cause = "") {
  const lineage = getLineage(player);
  if (lineage.generation !== 2 || !lineage.founder) return null;
  const founder = lineage.founder;
  const dreamLines = describeDreamEnding(player);
  return [
    { title: `Đời đầu · ${founder.name}`, lines: [`${founder.age} tuổi · ${founder.cause || "Hành trình đã khép lại"}`,
      founder.job ? `Công việc cuối đời: ${founder.job.replace(/^\p{Extended_Pictographic}\S*\s+/u, "")}` : "",
      `Để lại ${founder.totalCash.toLocaleString("vi-VN")} VNĐ tiền mặt sau khi trả nợ`, ...founder.dreamLines].filter(Boolean) },
    { title: `Đời con · ${player.name}`, lines: [`Tiếp quản năm ${lineage.takeoverAge} tuổi, khép lại năm ${player.age} tuổi${cause ? ` · ${cause}` : ""}`,
      `Nhận thừa kế ${(lineage.inheritance?.cash ?? 0).toLocaleString("vi-VN")} VNĐ${lineage.inheritance?.assets?.length ? ` và ${lineage.inheritance.assets.length} tài sản` : ""}`,
      ...dreamLines].filter(Boolean) },
  ];
}
export { describeRootJourney };
