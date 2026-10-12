import { openMojiArt } from "./event-art.js";
import { formatMoney } from "./money-format.js";
import { hasInternationalDegreeForCareer } from "./study-abroad.js";
import { getAppearanceImpression } from "./appearance-rules.js";

// Cấu hình tập trung cho cơ chế phụ thuộc Trí tuệ. Các con số là thông số gameplay.
// Trí tuệ thấp không có nghĩa là lười hay thiếu đạo đức, và luôn còn đường phát triển (học bổ sung, thi lại,
// nhờ người hướng dẫn). Trí tuệ cao không biến một lựa chọn vô trách nhiệm thành đúng, không tăng lương tự động,
// không bảo đảm thắng trò may rủi hay đầu tư.

// 80–100 học nhanh, 50–79 ổn định, 30–49 cần thêm chuẩn bị, 0–29 gặp khó ở việc phức tạp.
export const INTELLECT_BANDS = [
  { id: "sharp", min: 80, label: "Nhạy bén" },
  { id: "steady", min: 50, label: "Ổn định" },
  { id: "developing", min: 30, label: "Cần thêm chuẩn bị" },
  { id: "struggling", min: -Infinity, label: "Đang phát triển" },
];
export const getIntellectBand = (intelligence) => INTELLECT_BANDS.find((band) => (Number(intelligence) || 0) >= band.min);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const formatPercent = (chance) => `${Math.round(chance * 100)}%`;

// Mức ảnh hưởng của trí tuệ theo nghề: nghề chuyên môn/tri thức 0,4 điểm % mỗi điểm trí tuệ,
// nghề năng khiếu/thể chất 0,2 (không để trí tuệ thành chỉ số quyết định duy nhất).
const TALENT_CAREERS = ["acting", "singing", "painting", "football", "esports", "tiktok", "youtube", "fashion", "culinary", "military"];
export const getIntellectWeight = (careerId) => (TALENT_CAREERS.includes(careerId) ? 0.2 : 0.4);
export const isTechnicalCareer = (careerId) =>
  ["programming", "accounting", "finance", "mechanical", "architecture", "medicine", "law", "business", "marketing"].includes(careerId);

// Phỏng vấn: chất lượng câu trả lời có trọng lượng lớn nhất, trí tuệ và chuẩn bị điều chỉnh thêm.
export const INTERVIEW = {
  base: { good: 0.6, acceptable: 0.35, weak: 0.1 },
  prepBonus: 0.1, min: 0.05, max: 0.95,
  qualityLabel: { good: "Tốt", acceptable: "Chấp nhận được", weak: "Chưa phù hợp" },
};
// Chuẩn bị phỏng vấn (Xin việc → Luyện phỏng vấn): dùng được cho buổi phỏng vấn trong năm đó hoặc năm sau.
export const hasInterviewPrep = (player) => Number.isInteger(player.interviewPrepAge) && player.age - player.interviewPrepAge <= 1;
export function getInterviewChance(player, quality, careerId = player.careerPath?.id) {
  const base = INTERVIEW.base[quality] ?? INTERVIEW.base.weak;
  const intellect = ((player.intelligence ?? 50) - 50) * getIntellectWeight(careerId) / 100;
  const prep = hasInterviewPrep(player) ? INTERVIEW.prepBonus : 0;
  // Nghề hình ảnh (diễn xuất, thời trang, sáng tạo nội dung…): ấn tượng ngoại hình (Ngoại hình − 50) × 0,1 điểm %.
  const looks = getAppearanceImpression(player, careerId);
  const abroad = (careerId === "study-abroad" || hasInternationalDegreeForCareer(player, careerId)) && player.abroadProgress
    ? clamp(((player.abroadProgress.language ?? 50) - 50) * 0.002 + ((player.abroadProgress.academic ?? 50) - 50) * 0.001 + ((player.abroadProgress.integration ?? 50) - 50) * 0.001, -0.2, 0.2) : 0;
  return { base, intellect, prep, looks, abroad, chance: clamp(base + intellect + prep + looks + abroad, INTERVIEW.min, INTERVIEW.max) };
}
export function describeInterviewChance(info, quality) {
  const sign = (value) => `${value >= 0 ? "+" : "−"}${Math.abs(Math.round(value * 100))}`;
  return `Câu trả lời: ${INTERVIEW.qualityLabel[quality]} (${formatPercent(info.base)}) · Trí tuệ ${sign(info.intellect)} · Chuẩn bị ${sign(info.prep)}` +
    `${info.looks ? ` · Ấn tượng ngoại hình ${sign(info.looks)}` : ""}${info.abroad ? ` · Ngoại ngữ, học tập và hòa nhập ${sign(info.abroad)}` : ""} → khả năng đỗ ${formatPercent(info.chance)}`;
}
// Tung kết quả phỏng vấn một lần (kết quả được lưu ngay nên tải lại không đổi).
export function rollInterview(player, quality, random = Math.random, careerId) {
  const info = getInterviewChance(player, quality, careerId);
  return { ...info, quality, passed: random() < info.chance, note: describeInterviewChance(info, quality) };
}

// Kỳ thi (bài test ngành ở tuổi 18): đáp án đúng luôn được ghi nhận đúng và đỗ. Sai đáp án vẫn có thể đỗ
// nhờ phần thi tổng thể, phụ thuộc mức chuẩn bị và trí tuệ. Có thể học bổ sung và thi lại một lần.
export const EXAM_PREP = {
  steady: { label: "📖 Ôn tập đều đặn mỗi ngày", overall: 0.4, text: "Tôi ôn đều mỗi ngày, làm lại các câu từng sai." },
  group: { label: "👥 Học cùng bạn, nhờ thầy cô hướng dẫn", overall: 0.35, lowIntellectBonus: 0.15, hint: true,
    text: "Tôi học nhóm và nhờ thầy cô giảng lại phần chưa hiểu." },
  cram: { label: "🌙 Học dồn những ngày cuối", overall: 0.35, health: -3, text: "Tôi thức khuya học dồn, nhớ được nhiều thứ nhưng người mệt rã rời." },
  none: { label: "🎲 Không chuẩn bị, thi bằng năng lực hiện có", overall: 0.15, text: "Tôi đi thi với những gì mình đang có." },
};
export const EXAM_HINT_INTELLECT = 80;
export const EXAM_RETAKES = 1;
export function getExamOverallChance(player, prepId) {
  const prep = EXAM_PREP[prepId] ?? EXAM_PREP.none;
  const lowBonus = prep.lowIntellectBonus && (player.intelligence ?? 50) < 50 ? prep.lowIntellectBonus : 0;
  return clamp(prep.overall + lowBonus + ((player.intelligence ?? 50) - 50) * 0.4 / 100, INTERVIEW.min, INTERVIEW.max);
}

// Thăng chức: xử lý đúng là điều kiện cần; kết quả còn tùy kinh nghiệm, trí tuệ (theo nghề) và thành tích.
export const PROMOTION = { base: 0.65, perYearExperience: 0.02, maxExperience: 0.1, perMerit: 0.05, maxMerit: 3, min: 0.05, max: 0.95 };
export function getPromotionChance(player, age) {
  const years = Math.max(0, age - (player.employedSince ?? age));
  const merit = Math.min(PROMOTION.maxMerit, player.workMerit ?? 0);
  const integration = (player.careerPath?.id === "study-abroad" || hasInternationalDegreeForCareer(player)) && player.abroadProgress
    ? clamp(((player.abroadProgress.integration ?? 50) - 50) * 0.001, -0.05, 0.05) : 0;
  return clamp(PROMOTION.base + Math.min(PROMOTION.maxExperience, years * PROMOTION.perYearExperience) +
    ((player.intelligence ?? 50) - 50) * getIntellectWeight(player.careerPath?.id) / 100 + merit * PROMOTION.perMerit + integration, PROMOTION.min, PROMOTION.max);
}

// Học bổng khuyến khích khi đang học (kết quả học tập tốt): trí tuệ từ 80 được giảm học phí năm đó.
export const SCHOLARSHIP = { minIntellect: 80, rate: 0.5 };

// Rèn luyện trí tuệ miễn phí (Phát triển bản thân → Trí tuệ): mỗi hoạt động một lần mỗi năm, trí tuệ càng cao tăng
// càng chậm. Khóa học trả phí vẫn có ích khi đã cao nhưng chỉ còn một nửa hiệu quả.
export const HIGH_INTELLECT_TRAINING_RATE = 0.5;
export const INTELLECT_ACTIVITIES = [
  { id: "library", stat: "intelligence", icon: "📚", name: "Đọc sách, học miễn phí", description: "Miễn phí. Mượn sách ở thư viện hoặc học một bài giảng trực tuyến miễn phí.",
    gain: { struggling: 3, developing: 3, steady: 2, sharp: 1 } },
  { id: "study-together", stat: "intelligence", icon: "👥", name: "Học cùng người khác", description: "Miễn phí. Học nhóm với bạn bè hoặc người thân, ai hiểu phần nào giảng phần đó. Hạnh phúc +1, gắn kết với người yêu +1.",
    gain: { struggling: 3, developing: 2, steady: 2, sharp: 1 }, together: true },
  { id: "learn-at-work", stat: "intelligence", icon: "🛠️", name: "Học qua công việc", description: "Miễn phí, cần đang có việc chính. Nhận một đầu việc mới, ghi lại bài học và kinh nghiệm cho lần xét nâng bậc.",
    gain: { struggling: 2, developing: 2, steady: 2, sharp: 1 }, needsJob: true },
];

// Tuổi già: có thể suy giảm trí tuệ nhẹ, khác nhau ở mỗi người. Đọc sách, học điều mới, trò chuyện trong năm
// giúp duy trì. Không chẩn đoán bệnh nhận thức chỉ vì điểm thấp.
export const COGNITIVE_AGING = { from: 70, chance: 0.35, olderFrom: 85, olderChance: 0.5, activeRate: 0.3, loss: 1, olderLoss: 2 };
export function stayedMentallyActive(player, age) {
  const last = age - 1;
  const done = player.developmentDone ?? {};
  const learned = ["library", "study-together", "learn-at-work", "language", "chess"].some((id) => done[id] === last);
  const talked = player.partnerActions?.talk === last || (player.relatives ?? []).some((relative) => relative.done?.call === last || relative.done?.visit === last);
  return learned || talked;
}
export function collectCognitiveYear(player, age, random = Math.random) {
  if (age < COGNITIVE_AGING.from) return null;
  const older = age >= COGNITIVE_AGING.olderFrom;
  const active = stayedMentallyActive(player, age);
  const chance = (older ? COGNITIVE_AGING.olderChance : COGNITIVE_AGING.chance) * (active ? COGNITIVE_AGING.activeRate : 1);
  if (random() >= chance) return null;
  const before = player.intelligence ?? 0;
  player.intelligence = Math.max(0, before - (older ? COGNITIVE_AGING.olderLoss : COGNITIVE_AGING.loss));
  if (player.intelligence === before) return null;
  return { content: `🧓 Trí nhớ đôi lúc chậm hơn trước: Trí tuệ -${before - player.intelligence}. Đọc sách, học điều mới và trò chuyện thường xuyên giúp duy trì.` };
}

const art = (code, alt) => openMojiArt(code, alt);

// Sự cố dự án ở nghề chuyên môn: trí tuệ cao mở lựa chọn phân tích nguyên nhân; trí tuệ thấp vẫn có cách
// nhờ đồng nghiệp, chia nhỏ việc, học thêm. Giấu lỗi hoặc ôm hết việc vẫn có hậu quả dù trí tuệ cao.
export const PROJECT_BUG = { chance: 0.08, analysisIntellect: 70, hideDiscovered: 0.6 };
export function createProjectBugEvent(player, age, random = Math.random) {
  const careerId = player.careerPath?.id;
  if (player.employmentStatus !== "employed" || !isTechnicalCareer(careerId) || player.jobWarning ||
      age - (player.employedSince ?? age) < 1) return null;
  if (random() >= PROJECT_BUG.chance) return null;
  const discovered = random() < PROJECT_BUG.hideDiscovered;
  const sharp = (player.intelligence ?? 0) >= PROJECT_BUG.analysisIntellect;
  const merit = (amount) => ({ workMerit: Math.min(PROMOTION.maxMerit, (player.workMerit ?? 0) + amount) });
  const choices = [];
  if (sharp) {
    choices.push({ label: "🔍 Phân tích nguyên nhân gốc rồi sửa", title: "🔍 Tìm ra gốc rễ",
      text: "Tôi lần theo dữ liệu, tìm ra đúng chỗ sai từ đầu và đề xuất cách tránh lặp lại. Quản lý ghi nhận cách xử lý này cho lần xét nâng bậc.",
      effects: { intelligence: 2, happiness: 2 }, playerUpdates: merit(1), confirmText: "Gọn gàng", ...art("1F50D", "Phân tích nguyên nhân") });
  }
  choices.push(
    { label: "🤝 Nhờ đồng nghiệp cùng rà soát", title: "🤝 Hai người tìm nhanh hơn",
      text: "Tôi kể rõ những gì đã thử và nhờ đồng nghiệp cùng xem. Hai người phát hiện lỗi nhanh hơn, tôi cũng học thêm được cách kiểm tra.",
      effects: { intelligence: 1, happiness: 1 }, playerUpdates: merit(1), confirmText: "Cảm ơn nhé", ...art("1F91D", "Nhờ đồng nghiệp") },
    { label: "🧩 Chia nhỏ nhiệm vụ, học thêm phần còn yếu", title: "🧩 Từng bước một",
      text: "Tôi chia việc thành từng phần nhỏ, tra lại tài liệu ở phần mình chưa vững. Mất thêm thời gian nhưng lỗi được sửa và tôi hiểu sâu hơn.",
      effects: { intelligence: 2 }, confirmText: "Xong từng phần", ...art("1F9E9", "Chia nhỏ nhiệm vụ") },
    { label: "💪 Ôm hết việc, thức đêm sửa một mình", title: "💪 Sửa xong nhưng kiệt sức",
      text: "Tôi không nói với ai và thức nhiều đêm để sửa. Lỗi được xử lý, nhưng sức khỏe và tinh thần đi xuống rõ rệt.",
      effects: { health: -4, happiness: -3 }, confirmText: "Mệt quá", ...art("1F62B", "Ôm hết việc") },
    discovered
      ? { label: `🙈 Giấu lỗi, mong không ai để ý (⚠️ ${Math.round(PROJECT_BUG.hideDiscovered * 100)}% bị phát hiện)`, title: "🙈 Lỗi bị phát hiện",
        text: "Lỗi lộ ra khi khách hàng phản ánh. Việc che giấu khiến tôi nhận cảnh báo bằng văn bản và phải đánh giá lại vào năm sau, dù năng lực của tôi không tệ.",
        effects: { happiness: -3 }, playerUpdates: { jobWarning: { issuedAt: age, plan: "ignore", careerId }, jobStrikes: [...(player.jobStrikes ?? []), age] },
        confirmText: "Phải sửa thôi", ...art("26A0", "Lỗi bị phát hiện") }
      : { label: `🙈 Giấu lỗi, mong không ai để ý (⚠️ ${Math.round(PROJECT_BUG.hideDiscovered * 100)}% bị phát hiện)`, title: "🙈 Tạm thời trót lọt",
        text: "Chưa ai phát hiện, nhưng lỗi vẫn nằm đó và tôi luôn thấp thỏm mỗi lần dự án chạy.",
        effects: { happiness: -2 }, confirmText: "Thấp thỏm", ...art("1F648", "Giấu lỗi") },
  );
  return {
    id: `project-bug-${age}`, kind: "project-bug", category: "career",
    title: "🐞 Dự án gặp lỗi",
    text: "Sản phẩm của nhóm phát sinh lỗi ngay trước buổi bàn giao, và phần lỗi nằm trong việc tôi phụ trách." +
      (sharp ? "" : `\n\nTrí tuệ từ ${PROJECT_BUG.analysisIntellect} sẽ mở thêm lựa chọn phân tích nguyên nhân gốc; hiện tại vẫn có nhiều cách xử lý tốt.`),
    ...art("1F41E", "Dự án gặp lỗi"),
    choices,
  };
}

// Lời mời kiếm tiền "lợi nhuận cao, không rủi ro": trí tuệ cao thấy dấu hiệu đáng ngờ và có thêm câu hỏi về
// điều khoản; ai cũng có thể từ chối, kiểm tra thông tin hoặc nhờ tư vấn. Chấp nhận mà không kiểm tra thì mất tiền.
export const RISK_OFFER = { chance: 0.05, minAge: 20, minMoney: 10_000_000, shareOfMoney: 0.3, maxAmount: 50_000_000, sharpIntellect: 70 };
export function createRiskOfferEvent(player, age, random = Math.random) {
  if (age < RISK_OFFER.minAge || (player.money ?? 0) < RISK_OFFER.minMoney) return null;
  if (random() >= RISK_OFFER.chance) return null;
  const amount = Math.min(RISK_OFFER.maxAmount, Math.round(((player.money ?? 0) * RISK_OFFER.shareOfMoney) / 1_000_000) * 1_000_000);
  const sharp = (player.intelligence ?? 0) >= RISK_OFFER.sharpIntellect;
  const choices = [];
  if (sharp) {
    choices.push({ label: "❓ Hỏi về giấy phép, điều khoản rút vốn", title: "❓ Câu hỏi khiến họ lúng túng",
      text: "Tôi hỏi giấy phép kinh doanh, hợp đồng và điều kiện rút vốn. Người mời trả lời vòng vo rồi chặn liên lạc. Tôi giữ được tiền và cảnh báo bạn bè.",
      effects: { intelligence: 1, happiness: 1 }, confirmText: "May mà hỏi", ...art("2753", "Hỏi về điều khoản") });
  }
  choices.push(
    { label: "🙅 Từ chối", title: "🙅 Không tham gia",
      text: "Tôi lịch sự từ chối. Lời hứa không rủi ro nghe quá tốt để là thật.", effects: {}, confirmText: "Thôi bỏ qua", ...art("1F645", "Từ chối") },
    { label: "📞 Kiểm tra thông tin, nhờ người có chuyên môn tư vấn", title: "📞 Hóa ra là lừa đảo",
      text: "Tôi tra tên công ty và hỏi một người làm tài chính. Hóa ra mô hình này đã bị cảnh báo lừa đảo. Tôi không mất đồng nào.",
      effects: { intelligence: 1 }, confirmText: "Hú hồn", ...art("1F4DE", "Kiểm tra thông tin") },
    { label: `💸 Chuyển ${formatMoney(amount)} tham gia ngay`, title: "💸 Mất trắng",
      text: `Sau vài tuần nhận "lãi" nhỏ, nền tảng khóa tài khoản và biến mất. Tôi mất ${formatMoney(amount)}.`,
      effects: { happiness: -5 }, money: -amount, confirmText: "Bài học đắt giá", ...art("1F4B8", "Mất tiền vì lừa đảo") },
  );
  return {
    id: `risk-offer-${age}`, kind: "risk-offer", category: "finance",
    title: "💰 Lời mời “lợi nhuận cao, không rủi ro”",
    text: `Một người quen trên mạng mời tôi góp ${formatMoney(amount)} vào gói đầu tư "lãi 5% mỗi tháng, cam kết không rủi ro", chỉ cần chuyển khoản trong hôm nay.` +
      (sharp ? "\n\n🚩 Tôi để ý: cam kết lãi cao mà không rủi ro, giục chuyển tiền gấp, không có hợp đồng hay giấy phép rõ ràng." : ""),
    ...art("1F4B0", "Lời mời đầu tư"),
    choices,
  };
}
