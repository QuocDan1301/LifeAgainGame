import { openMojiArt } from "../media/event-art.js";
import { formatMoney } from "../core/money-format.js";

// Cấu hình tập trung cho cơ chế phụ thuộc Ngoại hình. Các con số là thông số gameplay.
// Ngoại hình chỉ ảnh hưởng ấn tượng ban đầu, cơ hội được làm quen và một số nghề liên quan đến hình ảnh.
// Không quyết định giá trị, đạo đức, trí tuệ hay khả năng giữ một mối quan hệ; không tăng lương tự động.

export const APPEARANCE_BANDS = [
  { id: "striking", min: 70, label: "Nổi bật" },
  { id: "pleasant", min: 40, label: "Dễ nhìn" },
  { id: "plain", min: -Infinity, label: "Giản dị" },
];
export const getAppearanceBand = (appearance) => APPEARANCE_BANDS.find((band) => (Number(appearance) || 0) >= band.min);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Cơ hội được làm quen: 15% + (Ngoại hình − 50) × 0,2 điểm % + 10% nếu có hoạt động giao tiếp trong năm,
// giới hạn 5–35%, tối đa một lời làm quen mỗi năm, chỉ khi có bối cảnh giao tiếp (trường, nơi làm, cộng đồng).
export const ACQUAINTANCE = { base: 0.15, perPoint: 0.002, socialBonus: 0.1, min: 0.05, max: 0.35, minAge: 12, schoolUntil: 22 };
// Hoạt động giao tiếp trong năm: cộng đồng, học nhóm, tâm sự với người thân, hoặc chủ động kết nối.
const SOCIAL_ACTIVITIES = ["community", "study-together", "call-family"];
export function wasSocialThisYear(player, age) {
  const last = age - 1;
  return player.reachOutAge === last || SOCIAL_ACTIVITIES.some((id) => player.developmentDone?.[id] === last);
}
export function getSocialContext(player, age) {
  if (age < ACQUAINTANCE.minAge || player.isAlive === false) return null;
  if (player.employmentStatus === "employed") return "work";
  if (age <= ACQUAINTANCE.schoolUntil && (age < 18 || player.careerPath?.school)) return "school";
  if (wasSocialThisYear(player, age)) return "community";
  return null;
}
export function getAcquaintanceChance(player, age) {
  const social = wasSocialThisYear(player, age) ? ACQUAINTANCE.socialBonus : 0;
  return clamp(ACQUAINTANCE.base + ((player.appearance ?? 50) - 50) * ACQUAINTANCE.perPoint + social, ACQUAINTANCE.min, ACQUAINTANCE.max);
}
// Lời mời hẹn tìm hiểu: ngoại hình chỉ tạo lợi thế nhỏ (±10%), không bảo đảm đồng ý cũng không khiến mọi lời mời thất bại.
export const ROMANCE = { base: 0.55, perPoint: 0.002, min: 0.35, max: 0.75, startBond: 70, bondPerPoint: 0.06, maxBondBonus: 3 };
export const getRomanceChance = (player) => clamp(ROMANCE.base + ((player.appearance ?? 50) - 50) * ROMANCE.perPoint, ROMANCE.min, ROMANCE.max);
export const getStartingBond = (player) =>
  ROMANCE.startBond + clamp(Math.round(((player.appearance ?? 50) - 50) * ROMANCE.bondPerPoint), -ROMANCE.maxBondBonus, ROMANCE.maxBondBonus);

// Nghề liên quan đến hình ảnh (diễn xuất, thời trang, quảng cáo, sáng tạo nội dung trước máy quay).
export const IMAGE_CAREERS = ["acting", "fashion", "tiktok", "youtube", "singing"];
export const isImageCareer = (careerId) => IMAGE_CAREERS.includes(careerId);
// Ấn tượng ban đầu ở phỏng vấn nghề hình ảnh: (Ngoại hình − 50) × 0,1 điểm %, nhỏ hơn nhiều so với câu trả lời.
export const IMAGE_INTERVIEW_PER_POINT = 0.001;
export const getAppearanceImpression = (player, careerId) =>
  isImageCareer(careerId) ? ((player.appearance ?? 50) - 50) * IMAGE_INTERVIEW_PER_POINT : 0;

// Chăm sóc cá nhân miễn phí (Phát triển bản thân → Ngoại hình): tăng ít, mỗi hoạt động một lần mỗi năm.
// "Học xây dựng phong cách" học một lần, mở lựa chọn chuẩn bị theo phong cách riêng cho các dịp quan trọng.
export const APPEARANCE_ACTIVITIES = [
  { id: "home-care", stat: "appearance", icon: "🧴", name: "Chăm sóc cá nhân tại nhà", description: "Miễn phí. Ngủ đủ, rửa mặt kỹ, cắt móng, chải tóc gọn gàng.",
    gain: { plain: 2, pleasant: 1, striking: 1 } },
  { id: "outfit", stat: "appearance", icon: "👕", name: "Phối lại trang phục sẵn có", description: "Miễn phí. Ủi phẳng, phối màu hợp nhau từ đồ đã có.",
    gain: { plain: 1, pleasant: 1, striking: 1 } },
  { id: "style-lesson", stat: "appearance", icon: "🧭", name: "Học xây dựng phong cách riêng", description: "Miễn phí, học một lần. Hiểu dáng người và màu hợp mình; mở lựa chọn chuẩn bị theo phong cách riêng cho casting và buổi gặp quan trọng.",
    gain: { plain: 1, pleasant: 1, striking: 1 }, once: true },
];

// Tuổi tác: ngoại hình biến động nhẹ, không mặc định tuổi già là kém. Từ 60 tuổi, năm không chăm sóc bản thân
// có 20% khả năng giảm 1 điểm; năm có chăm sóc (tại nhà, salon, spa, nail) thì giữ được phong cách.
export const APPEARANCE_AGING = { from: 60, chance: 0.2, loss: 1 };
const CARE_ACTIVITIES = ["home-care", "outfit", "style-lesson", "salon", "spa"];
export function collectAppearanceYear(player, age, random = Math.random) {
  if (age < APPEARANCE_AGING.from || player.isAlive === false) return null;
  const last = age - 1;
  const cared = CARE_ACTIVITIES.some((id) => player.developmentDone?.[id] === last) || player.nailAge === last;
  if (cared || random() >= APPEARANCE_AGING.chance) return null;
  const before = player.appearance ?? 0;
  player.appearance = Math.max(0, before - APPEARANCE_AGING.loss);
  if (player.appearance === before) return null;
  return { content: `🪞 Tuổi tác để lại dấu vết nhẹ: Ngoại hình -${before - player.appearance}. Chăm sóc bản thân đều đặn giúp giữ phong cách ở mọi tuổi.` };
}

// Chuẩn bị cho dịp quan trọng (casting, ra mắt gia đình người yêu): ấn tượng tạm thời chỉ cho dịp đó,
// không cộng vĩnh viễn vào chỉ số. Phương án đắt nhất không luôn tốt nhất.
export const OCCASION_PREP = {
  simple: { label: "🪞 Chuẩn bị đơn giản", cost: 200_000, impression: 5, text: "Tôi ủi bộ đồ đẹp nhất, cắt tóc gọn gàng ở tiệm quen." },
  pro: { label: "💇 Thuê dịch vụ trang điểm, trang phục chuyên nghiệp", cost: 3_000_000, impression: 10, text: "Tôi thuê chuyên viên trang điểm và thuê trang phục hợp dịp." },
  practice: { label: "🎭 Dành thời gian luyện kỹ năng", cost: 0, skill: 12, fatigue: 3,
    text: "Tôi tập đi tập lại phần chuẩn bị đến khuya; người hơi mệt (chỉ ảnh hưởng hôm đó) nhưng tự tin hơn hẳn." },
  current: { label: "🙂 Đi với phong cách hiện tại", cost: 0, impression: 0, text: "Tôi đi với phong cách thường ngày của mình." },
  style: { label: "🧭 Phối đồ theo phong cách riêng đã học", cost: 0, impression: 8, needsStyle: true, text: "Tôi phối bộ đồ hợp dáng người và màu da theo những gì đã học." },
};
// Casting: năng lực, kinh nghiệm và chuẩn bị quyết định phần lớn; ngoại hình chỉ cộng nhỏ và tùy vai.
export const CASTING = { chance: 0.15, base: 45, perYear: 2, maxExperience: 10, perMerit: 5, maxMerit: 3, lookPerPoint: 0.15, min: 10, max: 90 };
const CASTING_ROLES = {
  acting: [["vai chính trong phim tình cảm", 1], ["vai người cha/mẹ đời thường", 0], ["vai phản diện cá tính", 0.5]],
  fashion: [["người mẫu trình diễn bộ sưu tập", 1], ["mẫu ảnh trang phục đời thường", 0.3], ["gương mặt cho chiến dịch đa dạng vóc dáng", 0]],
  singing: [["MV quảng cáo nước giải khát", 0.8], ["chương trình hát chủ đề gia đình", 0], ["đêm nhạc acoustic nhỏ", 0.3]],
  tiktok: [["video quảng cáo mỹ phẩm", 1], ["chuỗi video hướng dẫn nấu ăn", 0], ["video giới thiệu du lịch địa phương", 0.3]],
  youtube: [["series vlog thời trang", 1], ["kênh giải thích khoa học", 0], ["chương trình phỏng vấn đường phố", 0.3]],
};
export function getCastingChance(player, age, prepId, lookWeight) {
  const prep = OCCASION_PREP[prepId] ?? OCCASION_PREP.current;
  const experience = Math.min(CASTING.maxExperience, Math.max(0, age - (player.employedSince ?? age)) * CASTING.perYear);
  const merit = Math.min(CASTING.maxMerit, player.workMerit ?? 0) * CASTING.perMerit;
  const look = ((player.appearance ?? 50) - 50) * CASTING.lookPerPoint * lookWeight;
  return clamp(CASTING.base + experience + merit + (prep.skill ?? 0) + (prep.impression ?? 0) - (prep.fatigue ?? 0) + look, CASTING.min, CASTING.max) / 100;
}
const art = (code, alt) => openMojiArt(code, alt);
const prepOptions = (player) => Object.entries(OCCASION_PREP)
  .filter(([, prep]) => (!prep.needsStyle || player.styleSkill) && (prep.cost <= (player.money ?? 0)));
const prepNote = (prep) => [prep.cost ? formatMoney(prep.cost) : "Miễn phí", prep.impression ? `Ấn tượng +${prep.impression} (chỉ dịp này)` : "",
  prep.skill ? `Kỹ năng +${prep.skill}, mệt -${prep.fatigue}` : ""].filter(Boolean).join(" · ");

export function createCastingEvent(player, age, random = Math.random) {
  const careerId = player.careerPath?.id;
  if (player.employmentStatus !== "employed" || !isImageCareer(careerId) || player.jobWarning) return null;
  if (random() >= CASTING.chance) return null;
  const roles = CASTING_ROLES[careerId];
  const [role, lookWeight] = roles[Math.floor(random() * roles.length)];
  const roll = random();
  const reward = careerId === "acting" || careerId === "fashion" ? 20_000_000 : 10_000_000;
  return {
    id: `casting-${age}`, kind: "casting", category: "career",
    title: `🎬 Lời mời casting: ${role}`,
    text: `Một đơn vị sản xuất mời tôi casting cho ${role}. Năng lực, kinh nghiệm và phần thể hiện quyết định phần lớn; ` +
      `${lookWeight === 0 ? "vai này cần sự chân thật, không đòi hỏi ngoại hình nổi bật." : "ấn tượng ngoại hình chỉ là điểm cộng nhỏ."} Tôi chuẩn bị thế nào?`,
    ...art("1F3AC", "Lời mời casting"),
    choices: prepOptions(player).map(([id, prep]) => {
      const passed = roll < getCastingChance(player, age, id, lookWeight);
      return {
        label: `${prep.label} · ${prepNote(prep)} · khả năng ${Math.round(getCastingChance(player, age, id, lookWeight) * 100)}%`,
        title: passed ? "🌟 Được chọn!" : "📋 Lần này chưa được chọn",
        text: `${prep.text}\n${passed
          ? `Đoàn sản xuất chọn tôi cho ${role}. Thù lao ${formatMoney(reward)}, thêm kinh nghiệm cho lần xét nâng bậc.`
          : "Đoàn sản xuất chọn một người phù hợp hơn với vai. Tôi được góp ý chi tiết để lần sau làm tốt hơn."}`,
        effects: passed ? { happiness: 3 } : { happiness: -1 },
        money: (passed ? reward : 0) - prep.cost,
        ...(passed ? { playerUpdates: { workMerit: Math.min(CASTING.maxMerit, (player.workMerit ?? 0) + 1) } } : {}),
        outcome: passed ? "success" : "failure",
        confirmText: passed ? "Tuyệt vời!" : "Lần sau nhé",
        ...art(passed ? "1F31F" : "1F4CB", passed ? "Được chọn" : "Chưa được chọn"),
      };
    }),
  };
}

// Ra mắt gia đình người yêu: ấn tượng ban đầu chỉ là một phần; cách cư xử và sự chân thành quan trọng hơn.
export const MEET_FAMILY = { chance: 0.25, minYears: 1, base: 65, min: 40, max: 95 };
export function createMeetFamilyEvent(player, age, random = Math.random) {
  const partner = player.partner;
  if (!partner || player.marriedAtAge != null || player.metPartnerFamilyId === partner.id || age < 20 ||
      age - (partner.metAtAge ?? age) < MEET_FAMILY.minYears) return null;
  if (random() >= MEET_FAMILY.chance) return null;
  const roll = random();
  return {
    id: `meet-family-${age}`, kind: "meet-family", category: "love",
    title: `🏡 Ra mắt gia đình ${partner.name}`,
    text: `${partner.name} mời tôi về nhà ăn cơm, gặp bố mẹ lần đầu. Ấn tượng ban đầu có ích, nhưng sự chân thành và cách cư xử mới là điều gia đình nhớ lâu. Tôi chuẩn bị thế nào?`,
    ...art("1F3E1", "Ra mắt gia đình người yêu"),
    choices: prepOptions(player).map(([id, prep]) => {
      const score = clamp(MEET_FAMILY.base + (prep.impression ?? 0) + (prep.skill ?? 0) - (prep.fatigue ?? 0), MEET_FAMILY.min, MEET_FAMILY.max) / 100;
      const warm = roll < score;
      const gain = warm ? 5 : 2;
      return {
        label: `${id === "practice" ? "📖 Tìm hiểu sở thích gia đình, chuẩn bị câu chuyện" : prep.label} · ${prepNote(prep)} · ${Math.round(score * 100)}% bữa cơm ấm áp`,
        title: warm ? "🏡 Một bữa cơm ấm áp" : "🏡 Hơi bỡ ngỡ nhưng ổn",
        text: `${prep.text}\n${warm
          ? "Bữa cơm rôm rả, bố mẹ người ấy hỏi han tôi rất nhiều."
          : "Buổi đầu còn ngại ngùng, nhưng gia đình vẫn đón tôi niềm nở. Lần sau sẽ tự nhiên hơn."} Quan hệ +${gain}%.`,
        effects: { happiness: warm ? 3 : 1 },
        money: -prep.cost,
        partnerRelationship: { id: partner.id, value: Math.min(100, (partner.relationship ?? 80) + gain) },
        playerUpdates: { metPartnerFamilyId: partner.id },
        confirmText: "Về thôi",
        ...art("1F35A", "Bữa cơm gia đình"),
      };
    }),
  };
}
