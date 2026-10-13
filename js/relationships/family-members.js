import { getDatingPartners, removeDatingPartnerUpdates } from './concurrent-dating.js';
import { maleNames, femaleNames } from "../core/character-data.js";
import { openMojiArt } from "../media/event-art.js";
import { formatMoney } from "../core/money-format.js";
import { addMoodEffect } from "../stats/mood-rules.js";

// Người thân có danh tính và tuổi: cha mẹ (tạo cho mọi cuộc đời) và bạn đời (dùng lại người yêu hiện có).
// Mỗi người có tên, vai trò, tuổi, còn sống/đã mất, mức gắn kết và tình trạng sức khỏe.
// Các con số là thông số gameplay, không phải mô phỏng y khoa.
export const PARENT_AGE_AT_BIRTH = { father: [24, 36], mother: [21, 33] };
// Bản lưu cũ: cha mẹ đã quá tuổi này được ghi là đã mất từ trước, không tạo sự kiện qua đời.
export const PARENT_MAX_TRACKED_AGE = 92;
// Vừa bổ sung cha mẹ cho cuộc đời đang chơi thì vài năm đầu chưa có nguy cơ qua đời.
export const TRACKING_GRACE_YEARS = 2;

// Tình trạng: khỏe → yếu → bệnh nặng. Chỉ người đang yếu hoặc bệnh nặng mới có nguy cơ qua đời
// (trừ tuổi rất cao), nên luôn có dấu hiệu báo trước.
export const CONDITIONS = {
  healthy: { label: "Khỏe", icon: "🙂" },
  weak: { label: "Yếu", icon: "🥀" },
  severe: { label: "Bệnh nặng", icon: "🏥" },
};
const WEAKEN_CHANCE = [{ from: 85, chance: 0.2 }, { from: 75, chance: 0.1 }, { from: 65, chance: 0.04 }];
export const WORSEN_CHANCE = 0.25;
export const RECOVER_CHANCE = 0.15;
const DEATH_BASE = [{ from: 100, chance: 0.4 }, { from: 90, chance: 0.15 }, { from: 80, chance: 0.06 }, { from: 70, chance: 0.03 }, { from: 60, chance: 0.015 }];
const DEATH_CONDITION = { healthy: 0, weak: 1, severe: 3 };
export const SUDDEN_DEATH_AGE = 95;
export const MAX_RELATIVE_AGE = 110;
// Chăm sóc trong năm giảm nguy cơ (không bảo đảm cứu sống); nhờ người khác hỗ trợ cũng giúp một phần.
export const CARE_RISK_RATE = { self: 0.7, helper: 0.85, treatment: 0.6 };

// Tương tác: giới hạn lượt mỗi năm, luôn có cách kết nối miễn phí (gọi điện).
export const RELATIVE_ACTIONS = {
  call: { label: "📞 Gọi điện, trò chuyện", cost: 0, bond: 2, happiness: 1 },
  visit: { label: "🏠 Về thăm, dành thời gian cùng nhau", cost: 2_000_000, bond: 4, happiness: 2 },
  care: { label: "🩺 Trực tiếp chăm sóc", cost: 0, bond: 5, health: -2, needsCare: true },
  helper: { label: "🤝 Nhờ người khác hỗ trợ chăm sóc", cost: 3_000_000, bond: 1, needsCare: true },
  treatment: { label: "💊 Tìm điều trị cho người thân", cost: 20_000_000, bond: 2, needsSevere: true },
  postpone: { label: "🗓️ Xin hoãn, hẹn lần sau", cost: 0, bond: 0 },
};
export const BROKEN_FAMILY_PROMISE = 3;
// Hỗ trợ tài chính từ cha mẹ khi gặp khó khăn: cần ít nhất một người còn sống, gắn kết từ 40, 3 năm một lần.
export const FAMILY_SUPPORT = { amount: 10_000_000, minBond: 40, everyYears: 3, maxParentAge: 85 };

// Đau buồn: mức trừ ngay theo gắn kết (<40: 5, 40–79: 10, từ 80: 15), sau đó −3, −2, −1 (MOOD_EFFECTS.bereavement).
export const getGriefLoss = (bond) => (bond >= 80 ? 15 : bond >= 40 ? 10 : 5);

const art = (code, alt) => openMojiArt(code, alt);
const between = ([min, max], random) => min + Math.floor(random() * (max - min + 1));

// Bổ sung cha mẹ (một lần). Cuộc đời đang chơi: tuổi hợp lý theo tuổi nhân vật, chưa có nguy cơ qua đời ngay.
export function ensureRelatives(player, random = Math.random) {
  if (Array.isArray(player.relatives)) return player.relatives;
  const parent = (id, role, names, range) => {
    const ageAtPlayerBirth = between(range, random);
    const alive = ageAtPlayerBirth + (player.age ?? 0) <= PARENT_MAX_TRACKED_AGE;
    return {
      id, role, name: names[Math.floor(random() * names.length)], ageAtPlayerBirth, alive,
      diedAtAge: alive ? null : undefined, passedBeforeTracking: !alive, bond: 70, condition: "healthy",
      trackedFrom: player.age ?? 0, interactions: { calls: 0, visits: 0, cares: 0, helpers: 0, treatments: 0 },
      done: {}, promise: null,
    };
  };
  player.relatives = [
    parent("father", "Bố", maleNames, PARENT_AGE_AT_BIRTH.father),
    parent("mother", "Mẹ", femaleNames, PARENT_AGE_AT_BIRTH.mother),
  ];
  return player.relatives;
}

export const getRelativeAge = (relative, playerAge) =>
  relative.ageAtPlayerBirth + (relative.alive ? playerAge : relative.diedAtAge ?? playerAge);
export const getPartnerAge = (partner, playerAge) => partner.ageAtMeeting + Math.max(0, playerAge - partner.metAtAge);

// Danh sách người thân đang theo dõi: cha mẹ còn sống và bạn đời (nếu có), dạng thống nhất.
export function getRelativeActionConfig(player, type) {
  const config = RELATIVE_ACTIONS[type];
  if (!config) return null;
  if ((player.age ?? 0) >= 18) return config;
  if (type === "call") return { ...config, label: "🤗 Chơi và trò chuyện cùng nhau" };
  if (type === "visit") return { ...config, label: "🏠 Dành thời gian cùng gia đình", cost: 0 };
  return null;
}

export function getLivingFamily(player) {
  const list = (player.relatives ?? []).filter((relative) => relative.alive)
    .map((relative) => ({ key: relative.id, role: relative.role, name: relative.name, age: getRelativeAge(relative, player.age),
      bond: relative.bond, condition: relative.condition ?? "healthy", trackedFrom: relative.trackedFrom ?? 0 }));
  if (player.partner) {
    const partner = player.partner;
    list.push({ key: "partner", role: player.marriedAtAge != null ? "Bạn đời" : "Người yêu", name: partner.name,
      age: getPartnerAge(partner, player.age), bond: partner.relationship ?? 80, condition: partner.condition ?? "healthy",
      trackedFrom: partner.metAtAge ?? 0 });
  }
  for (const partner of getDatingPartners(player).filter(person => person.id !== player.partner?.id)) {
    list.push({ key: `dating:${partner.id}`, personId: partner.id, role: "Người yêu", name: partner.name,
      age: getPartnerAge(partner, player.age), bond: partner.relationship ?? 80,
      condition: partner.condition ?? "healthy", trackedFrom: partner.metAtAge ?? 0 });
  }
  return list;
}

export function getDeathChance(member, age, caredWith = null) {
  if (member.age >= MAX_RELATIVE_AGE) return 1;
  if (age - member.trackedFrom < TRACKING_GRACE_YEARS) return 0;
  const base = DEATH_BASE.find((entry) => member.age >= entry.from)?.chance ?? 0;
  const factor = member.age >= SUDDEN_DEATH_AGE && member.condition === "healthy" ? 0.5 : DEATH_CONDITION[member.condition] ?? 0;
  return Math.min(0.9, base * factor * (caredWith ? CARE_RISK_RATE[caredWith] : 1));
}

// Mỗi sinh nhật: người thân già đi, tình trạng sức khỏe thay đổi (có thông báo), lời hẹn được kiểm tra.
export function collectFamilyYear(player, age, random = Math.random) {
  ensureRelatives(player);
  const lines = [];
  const progress = (member, setCondition, caredRecently) => {
    const weaken = WEAKEN_CHANCE.find((entry) => member.age >= entry.from)?.chance ?? 0;
    if (member.condition === "healthy" && weaken > 0 && random() < weaken) {
      setCondition("weak");
      lines.push(`🥀 ${member.role} ${member.name} (${member.age} tuổi) dạo này yếu đi. Hãy gọi điện, về thăm hoặc chăm sóc (Quan hệ → Gia đình).`);
    } else if (member.condition === "weak" && random() < (caredRecently ? WORSEN_CHANCE / 2 : WORSEN_CHANCE)) {
      setCondition("severe");
      lines.push(`🏥 ${member.role} ${member.name} (${member.age} tuổi) bệnh nặng hơn. Chăm sóc hoặc tìm điều trị có thể giúp, dù không bảo đảm.`);
    } else if (member.condition === "weak" && caredRecently && random() < RECOVER_CHANCE) {
      setCondition("healthy");
      lines.push(`🌿 Nhờ được chăm sóc, ${member.role.toLowerCase()} ${member.name} đã khỏe lại.`);
    }
  };
  player.relatives = (player.relatives ?? []).map((relative) => {
    if (!relative.alive) return relative;
    const next = { ...relative };
    const member = { role: next.role, name: next.name, age: getRelativeAge(next, age), condition: next.condition ?? "healthy" };
    progress(member, (condition) => { next.condition = condition; }, next.caredAt === age - 1);
    // Xin hoãn mà không giữ lời hẹn (không gọi, không thăm trước hạn) thì gắn kết giảm nhẹ.
    if (next.promise && age > next.promise.dueAge) {
      next.bond = Math.max(0, next.bond - BROKEN_FAMILY_PROMISE);
      lines.push(`🤐 Tôi đã hẹn gọi lại cho ${next.role.toLowerCase()} ${next.name} nhưng chưa giữ lời: Gắn kết -${BROKEN_FAMILY_PROMISE}.`);
      next.promise = null;
    }
    return next;
  });
  if (player.partner) {
    const partner = player.partner;
    const member = { role: player.marriedAtAge != null ? "Bạn đời" : "Người yêu", name: partner.name,
      age: getPartnerAge(partner, age), condition: partner.condition ?? "healthy" };
    progress(member, (condition) => { player.partner = { ...player.partner, condition }; }, partner.caredAt === age - 1);
  }
  player.otherPartners = (player.otherPartners ?? []).map(partner => {
    const next = { ...partner };
    progress({ role: "Người yêu", name: next.name, age: getPartnerAge(next, age),
      condition: next.condition ?? "healthy" }, condition => { next.condition = condition; }, next.caredAt === age - 1);
    const promise = next.datingState?.partnerPromise;
    if (promise && age > promise.dueAge) {
      next.relationship = Math.max(0, (next.relationship ?? 80) - 5);
      next.datingState = { ...next.datingState, partnerPromise: null };
      lines.push(`Tôi đã hẹn trò chuyện với ${next.name} nhưng không giữ lời: Quan hệ -5%.`);
    }
    return next;
  });
  return lines.length ? { content: lines.join("\n") } : null;
}

// Kỷ niệm chỉ dựng từ những tương tác đã thật sự xảy ra.
function describeMemories(interactions = {}, role) {
  const parts = [
    interactions.calls ? `${interactions.calls} cuộc gọi` : "",
    interactions.visits ? `${interactions.visits} lần về thăm` : "",
    interactions.cares ? `${interactions.cares} lần chăm sóc` : "",
    interactions.helpers ? `${interactions.helpers} lần nhờ người hỗ trợ chăm sóc` : "",
    interactions.treatments ? `${interactions.treatments} lần tìm điều trị` : "",
    interactions.talks ? `${interactions.talks} lần trò chuyện` : "",
    interactions.together ? `${interactions.together} ngày dành cho nhau` : "",
  ].filter(Boolean);
  return parts.length ? `Kỷ niệm còn lưu: ${parts.join(", ")}.` : `Những năm tháng có ${role.toLowerCase()} bên cạnh vẫn ở lại trong ký ức.`;
}

// Người thân qua đời (tuổi già, bệnh nặng): quyết định khi sang tuổi, hiện thành sự kiện ưu tiên.
// Chỉ một người mỗi năm; người đã mất không còn tham gia tương tác hay lời mời.
// Chỉ xét người thân đã có (không tạo mới ở đây để không tốn lượt ngẫu nhiên khi chọn sự kiện).
export function createRelativeDeathEvent(player, age, random = Math.random) {
  for (const member of getLivingFamily(player)) {
    const atAge = { ...member, age: member.age + 1 };
    const relative = (player.relatives ?? []).find((entry) => entry.id === member.key);
    const datingPerson = getDatingPartners(player).find(person => person.id === (member.personId ?? player.partner?.id));
    const caredWith = member.key === "partner" || member.personId
      ? (datingPerson?.caredAt === age - 1 ? "self" : null)
      : relative?.treatedAt === age - 1 ? "treatment" : relative?.caredAt === age - 1 ? (relative.careBy ?? "self") : null;
    const chance = getDeathChance(atAge, age, caredWith);
    if (!chance || random() >= chance) continue;
    return buildDeathEvent(player, member, atAge.age, age);
  }
  return null;
}

function buildDeathEvent(player, member, memberAge, age) {
  const isPartner = member.key === "partner" || Boolean(member.personId);
  const person = isPartner ? getDatingPartners(player).find(item => item.id === (member.personId ?? player.partner?.id)) : null;
  const grief = getGriefLoss(member.bond);
  const interactions = isPartner ? person?.interactions : player.relatives.find((entry) => entry.id === member.key)?.interactions;
  const memory = describeMemories(interactions, member.role);
  const cause = member.condition === "severe" ? "sau thời gian bệnh nặng" : member.condition === "weak" ? "sau một thời gian yếu dần" : "trong giấc ngủ, khi tuổi đã rất cao";
  const farewell = `${member.role} ${member.name} đã ra đi thanh thản ở tuổi ${memberAge}, ${cause}.`;
  const history = { age, type: isPartner && player.marriedAtAge != null ? "widowed" : "farewell", text: `🕯️ ${farewell} ${memory}` };
  const updates = {
    moodEffects: addMoodEffect(player, "bereavement", age, { name: `${member.role.toLowerCase()} ${member.name}` }),
    relationshipHistory: [...(player.relationshipHistory ?? []), isPartner ? { ...history, person } : history],
    familyMemories: [...(player.familyMemories ?? []), { age, role: member.role, name: member.name, memberAge, text: memory }],
  };
  if (isPartner) {
    // Góa: giữ lịch sử hôn nhân, không tự mở hẹn hò mới.
    Object.assign(updates, { ...(person.id === player.partner?.id ? { partner: null, widowedAtAge: player.marriedAtAge != null ? age : player.widowedAtAge ?? null, marriedAtAge: null,
      relationshipStartedAtAge: null, nextMarriageProposalAge: null, nextChildProposalAge: null, partnerPromise: null,
      datingActivitiesOnly: true } : {}),
      ...removeDatingPartnerUpdates(player, person.id) });
  } else {
    updates.relatives = player.relatives.map((entry) => (entry.id === member.key ? { ...entry, alive: false, diedAtAge: age, promise: null } : entry));
  }
  const choice = (label, title, text, extra = {}) => ({
    label, title, text: `${text}\nHạnh phúc -${grief - (extra.relief ?? 0)}. Nỗi buồn sẽ nhẹ dần trong 3 năm tới.`,
    effects: { happiness: -(grief - (extra.relief ?? 0)) },
    playerUpdates: { ...updates, ...(extra.updates ?? {}) }, confirmText: "Tạm biệt", ...art("1F56F", "Tưởng nhớ người thân"),
  });
  return {
    id: `family-farewell-${member.key}-${age}`, kind: "relative-death", category: "family", priority: true,
    title: `🕯️ Tạm biệt ${member.role.toLowerCase()} ${member.name}`,
    text: `${farewell}\n${memory}\n\nTôi muốn dành những ngày này thế nào?`,
    ...art("1F56F", "Tưởng nhớ người thân"),
    choices: [
      choice("👪 Ở bên gia đình", "👪 Ở bên nhau", "Cả nhà quây quần, cùng kể lại những chuyện cũ. Có người bên cạnh, nỗi buồn dễ chia hơn.", { relief: 2 }),
      choice("🛌 Xin nghỉ một thời gian", "🛌 Cho mình thời gian", "Tôi xin nghỉ để lo việc gia đình và cho bản thân được nghỉ ngơi trong năm tới.",
        { updates: { restYear: age + 1 } }),
      choice("💬 Tâm sự với người tin cậy", "💬 Được lắng nghe", "Tôi kể với một người tin cậy về những kỷ niệm và nỗi nhớ. Được lắng nghe giúp lòng nhẹ hơn trong năm tới.",
        { updates: { moodSupport: { type: "confide", startedAt: age, untilAge: age + 1 } } }),
      choice("🚶 Tiếp tục sinh hoạt theo cách riêng", "🚶 Theo nhịp của mình", "Tôi giữ nếp sinh hoạt thường ngày theo cách của riêng mình, và tưởng nhớ theo cách lặng lẽ."),
    ],
  };
}

// Có thể nhận hỗ trợ tài chính từ cha mẹ không.
export function canGetFamilySupport(player) {
  const helpers = (player.relatives ?? []).filter((relative) => relative.alive && relative.bond >= FAMILY_SUPPORT.minBond &&
    getRelativeAge(relative, player.age) <= FAMILY_SUPPORT.maxParentAge);
  const last = player.familySupportAge;
  return helpers.length > 0 && (last == null || player.age - last >= FAMILY_SUPPORT.everyYears);
}
export const describeFamilySupport = () => `Nhận hỗ trợ từ bố mẹ (${formatMoney(FAMILY_SUPPORT.amount)}, ${FAMILY_SUPPORT.everyYears} năm một lần)`;
