import { openMojiArt } from "../media/event-art.js";
import { formatMoney } from "../core/money-format.js";
import { getCareerProfile, getCareerTopic, getEmploymentContext } from "./career-jobs.js";
import { getCareerAnnualSalary, RETIREMENT_AGE } from "./career-salary.js";
import { addMoodEffect } from "../stats/mood-rules.js";

// Mất việc: ba nguyên nhân tách biệt, không có xác suất sa thải ngẫu nhiên chung mỗi năm.
// - Sa thải: chỉ sau chuỗi Vấn đề → Cảnh báo → Đánh giá lại (hoặc che giấu sai phạm bị phát hiện, có cảnh báo trước).
// - Cắt giảm nhân sự: hiếm, có thông báo trước một năm, chỉ cho nghề làm thuê (không áp dụng nhập ngũ, hợp đồng dự án).
// - Hết hợp đồng: nghề theo dự án/mùa giải, báo trước một năm, có thể xin gia hạn.
// Các con số là thông số gameplay.

// Nghề theo hợp đồng dự án/mùa giải; nhập ngũ là đơn vị nhà nước (không cắt giảm, không hết hợp đồng).
const CONTRACT_CAREERS = ["acting", "singing", "football", "esports", "tiktok", "youtube", "fashion"];
export const getEmploymentType = (careerId) =>
  careerId === "military" ? "service" : CONTRACT_CAREERS.includes(careerId) ? "contract" : "employee";
export const CONTRACT_YEARS = 3;

export const JOB_LOSS = {
  // Vấn đề trong công việc: chỉ khi đã đi làm ít nhất 1 năm, chưa có cảnh báo. Trí tuệ thấp khó xử lý việc,
  // sức khỏe thấp khó chịu lịch làm, hạnh phúc thấp thiếu động lực (trừ khi đang đau buồn vì biến cố).
  problem: { base: 0.04, lowIntelligence: 0.03, lowHealth: 0.03, lowMotivation: 0.02, perStrike: 0.03, max: 0.15, minYears: 1 },
  // Khả năng qua đánh giá lại theo kế hoạch cải thiện và chỉ số.
  review: { improve: 0.8, study: 0.8, adjust: 0.7, ignore: 0.15, intelligenceHigh: 0.1, intelligenceLow: -0.1,
    healthLow: -0.1, motivationLow: -0.05, perStrike: -0.15, min: 0.05, max: 0.95 },
  hideDiscovered: 0.5,
  studyCost: 2_000_000,
  // Cắt giảm nhân sự: hiếm, sau 2 năm làm việc. Gói nghỉ việc nhận ngay = 50% lương năm; bị cắt giảm năm sau = 25%.
  layoff: { chance: 0.015, minYears: 2, transfer: 0.5, packageRate: 0.5, forcedRate: 0.25 },
  renewal: { base: 0.7, intelligenceHigh: 0.1, intelligenceLow: -0.1, healthLow: -0.1, perStrike: -0.15 },
  // Hạnh phúc giảm ngay khi mất việc; lo lắng thất nghiệp −2 mỗi năm tối đa 2 năm (MOOD_EFFECTS["job-loss"]).
  happiness: { fired: 8, layoff: 5, contract: 5, quit: 2 },
  strikeWindow: 10,
};
const CAUSES = {
  fired: { label: "bị sa thải", icon: "📦" },
  layoff: { label: "bị cắt giảm nhân sự", icon: "📉" },
  contract: { label: "hết hợp đồng", icon: "📄" },
  quit: { label: "chủ động nghỉ việc", icon: "🚪" },
};
export const describeJobLossCause = (cause) => CAUSES[cause]?.label ?? cause;

const art = (code, alt) => openMojiArt(code, alt);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const isGrieving = (player) => (player.moodEffects ?? []).some((effect) => ["bereavement", "job-loss", "breakup"].includes(effect.id));
export const getRecentStrikes = (player, age) => (player.jobStrikes ?? []).filter((at) => age - at < JOB_LOSS.strikeWindow).length;
const dismissalPhrase = (careerId) => ({ service: "cho xuất ngũ trước hạn", contract: "chấm dứt hợp đồng", employee: "cho thôi việc" })[getEmploymentType(careerId)];

// Ghi nhận thời điểm bắt đầu làm và hạn hợp đồng cho công việc chính mới.
export function startEmploymentRecord(player, age) {
  if (age >= RETIREMENT_AGE || player.employmentStatus !== "employed") return;
  player.employedSince ??= age;
  if (getEmploymentType(player.careerPath?.id) === "contract" && !Number.isInteger(player.contractEndAge)) {
    player.contractEndAge = age + CONTRACT_YEARS;
    player.contractNoticeAge = null;
  }
}

// Cập nhật khi mất công việc chính. Chỉ dừng lương của công việc này; việc làm thêm, học vấn,
// kinh nghiệm (bậc nghề cũ) được giữ lại để ứng tuyển vị trí phù hợp sau này.
export function getJobLossUpdates(player, age, cause, extra = {}) {
  const careerId = player.careerPath?.id;
  return {
    employmentStatus: "unemployed", job: "Thất nghiệp", careerLevel: 0, nextPromotionAge: null,
    jobWarning: null, layoffDue: null, contractEndAge: null, contractNoticeAge: null, contractEnding: null, employedSince: null,
    // Sau khi mất việc có thể tìm việc cùng ngành, làm tạm (Làm thêm), học bổ sung hoặc đổi sang ngành cùng khối học.
    careerSwitchOpen: true,
    careerExperience: { careerId, level: Number(player.careerLevel) || 1, title: player.job, lostAt: age, cause,
      years: Math.max(0, age - (player.employedSince ?? age)) },
    jobHistory: [...(player.jobHistory ?? []), { age, title: player.job, careerId, cause }],
    moodEffects: cause === "quit" ? player.moodEffects ?? [] : addMoodEffect(player, "job-loss", age),
    ...extra,
  };
}

// Bậc khi được nhận lại cùng ngành: giữ kinh nghiệm (bị sa thải thì lùi một bậc), không vượt bậc 2.
export function getRehireLevel(player, careerId) {
  const experience = player.careerExperience;
  if (!experience || experience.careerId !== careerId) return 1;
  return clamp((experience.level ?? 1) - (experience.cause === "fired" ? 1 : 0), 1, 2);
}

function reviewChance(player, plan, age) {
  const r = JOB_LOSS.review;
  let chance = r[plan] ?? r.ignore;
  if (player.intelligence >= 60) chance += r.intelligenceHigh;
  if (player.intelligence < 40) chance += r.intelligenceLow;
  if (player.health < 40) chance += r.healthLow;
  if (player.happiness < 40 && !isGrieving(player)) chance += r.motivationLow;
  chance += r.perStrike * Math.max(0, getRecentStrikes(player, age) - 1);
  return clamp(chance, r.min, r.max);
}

export function getProblemChance(player, age) {
  const p = JOB_LOSS.problem;
  if (age >= RETIREMENT_AGE || player.employmentStatus !== "employed" || player.jobWarning || player.layoffDue ||
      age - (player.employedSince ?? age) < p.minYears) return 0;
  let chance = p.base + p.perStrike * getRecentStrikes(player, age);
  if (player.intelligence < 40) chance += p.lowIntelligence;
  if (player.health < 40) chance += p.lowHealth;
  // Đau buồn vì biến cố không tự tạo thêm cảnh báo sa thải.
  if (player.happiness < 40 && !isGrieving(player)) chance += p.lowMotivation;
  return Math.min(p.max, chance);
}

// Bước 1–2: vấn đề trong công việc và cảnh báo kèm cơ hội cải thiện.
export function createWorkProblemEvent(player, age, random = Math.random) {
  const chance = getProblemChance(player, age);
  if (!chance || random() >= chance) return null;
  const careerId = player.careerPath?.id;
  const context = getEmploymentContext(careerId);
  const topic = getCareerTopic(careerId);
  const dismissal = dismissalPhrase(careerId);
  const discovered = random() < JOB_LOSS.hideDiscovered;
  const warning = (plan) => ({ jobWarning: { issuedAt: age, plan, careerId }, jobStrikes: [...(player.jobStrikes ?? []), age] });
  const fired = getJobLossUpdates(player, age, "fired", { jobStrikes: [...(player.jobStrikes ?? []), age] });
  return {
    id: `job-warning-${age}`, kind: "job-warning", category: "career", priority: true,
    title: "⚠️ Cảnh báo trong công việc",
    text: `${topic ? `Trong một ca làm, ${topic.issue}, và cách tôi xử lý khiến cả nhóm gặp rắc rối.` : "Một sai sót của tôi khiến công việc của cả nhóm bị chậm lại."} ` +
      `${context.leader[0].toLocaleUpperCase("vi-VN")}${context.leader.slice(1)} gửi cảnh báo bằng văn bản: tôi có một năm để cải thiện; lần đánh giá lại năm sau nếu vẫn không đạt, ${context.place} sẽ ${dismissal}.` +
      `\n\nTrí tuệ giúp xử lý việc tốt hơn, sức khỏe giúp chịu được lịch làm, hạnh phúc giữ động lực.`,
    ...art("26A0", "Cảnh báo trong công việc"),
    choices: [
      { label: "📝 Lập kế hoạch cải thiện, phối hợp với đồng nghiệp", title: "📝 Một kế hoạch rõ ràng",
        text: `Tôi nhận phần trách nhiệm của mình, lập kế hoạch sửa lỗi theo từng tuần và nhờ đồng nghiệp góp ý. Năm sau sẽ có buổi đánh giá lại.`,
        effects: { happiness: -1 }, playerUpdates: warning("improve"), confirmText: "Bắt tay sửa", ...art("1F4DD", "Kế hoạch cải thiện") },
      { label: `📚 Học bổ sung, nhờ người hướng dẫn (${formatMoney(JOB_LOSS.studyCost)})`, title: "📚 Học thêm để làm tốt hơn",
        text: `Tôi đăng ký một khóa ngắn và nhờ một người có kinh nghiệm hướng dẫn${topic ? ` về ${topic.standard}` : ""}. Năm sau sẽ có buổi đánh giá lại.`,
        effects: { intelligence: 2 }, money: -JOB_LOSS.studyCost, playerUpdates: warning("study"), confirmText: "Học thôi", ...art("1F4DA", "Học bổ sung") },
      { label: "🗂️ Xin điều chỉnh nhiệm vụ vì đang quá tải", title: "🗂️ Khối lượng vừa sức hơn",
        text: `Tôi trình bày rằng mình đang ôm quá nhiều việc. ${context.leader[0].toLocaleUpperCase("vi-VN")}${context.leader.slice(1)} giảm bớt nhiệm vụ để tôi tập trung sửa lỗi; lần xét nâng bậc lùi lại một năm.`,
        effects: { happiness: 1 }, playerUpdates: { ...warning("adjust"), ...(Number.isInteger(player.nextPromotionAge) ? { nextPromotionAge: Math.max(player.nextPromotionAge, age) + 1 } : {}) },
        confirmText: "Làm cho kỹ", ...art("1F5C2", "Điều chỉnh nhiệm vụ") },
      discovered
        ? { label: `🙈 Phớt lờ cảnh báo, che giấu lỗi (⚠️ ${Math.round(JOB_LOSS.hideDiscovered * 100)}% bị phát hiện và sa thải ngay)`, title: "📦 Bị phát hiện và sa thải",
          text: `Tôi sửa lại hồ sơ để che lỗi cũ. Chỉ vài tuần sau, việc này bị phát hiện; ${context.place} ${dismissal} ngay lập tức vì sai phạm nghiêm trọng.\nHạnh phúc -${JOB_LOSS.happiness.fired}. Kinh nghiệm và học vấn vẫn còn: có thể vào Hoạt động → Xin việc, làm thêm hoặc học bổ sung.`,
          effects: { happiness: -JOB_LOSS.happiness.fired }, playerUpdates: fired, confirmText: "Bắt đầu lại", ...art("1F4E6", "Bị sa thải") }
        : { label: `🙈 Phớt lờ cảnh báo, che giấu lỗi (⚠️ ${Math.round(JOB_LOSS.hideDiscovered * 100)}% bị phát hiện và sa thải ngay)`, title: "🙈 Tạm thời chưa ai phát hiện",
          text: "Tôi phớt lờ cảnh báo và che lỗi cũ. Tạm thời chưa ai phát hiện, nhưng mọi thứ chưa được sửa: lần đánh giá năm sau gần như chắc chắn không đạt.",
          effects: {}, playerUpdates: warning("ignore"), confirmText: "Cứ thế đã", ...art("1F648", "Phớt lờ cảnh báo") },
      { label: "🚪 Chủ động nghỉ việc", title: "🚪 Rời đi theo cách của mình",
        text: `Tôi quyết định nộp đơn nghỉ việc thay vì chờ đánh giá. Tôi giữ lại kinh nghiệm và có thể ứng tuyển lại sau.\nHạnh phúc -${JOB_LOSS.happiness.quit}.`,
        effects: { happiness: -JOB_LOSS.happiness.quit }, playerUpdates: getJobLossUpdates(player, age, "quit"), confirmText: "Nộp đơn", ...art("1F6AA", "Chủ động nghỉ việc") },
    ],
  };
}

// Bước 3: đánh giá lại một năm sau cảnh báo. Kết quả được quyết định khi sự kiện xuất hiện (tải lại không đổi).
export function createJobReviewEvent(player, age, random = Math.random) {
  const warningInfo = player.jobWarning;
  if (!warningInfo || age >= RETIREMENT_AGE || player.employmentStatus !== "employed" || age <= warningInfo.issuedAt) return null;
  const careerId = player.careerPath?.id;
  const context = getEmploymentContext(careerId);
  const chance = reviewChance(player, warningInfo.plan, age);
  const passed = random() < chance;
  const plans = { improve: "kế hoạch cải thiện", study: "việc học bổ sung", adjust: "nhiệm vụ đã điều chỉnh", ignore: "việc phớt lờ cảnh báo" };
  return {
    id: `job-review-${age}`, kind: "job-review", category: "career", priority: true,
    title: "📋 Đánh giá lại sau cảnh báo",
    text: `Một năm sau cảnh báo, ${context.leader} xem lại ${plans[warningInfo.plan] ?? "quá trình làm việc"} của tôi cùng kết quả cả năm.`,
    ...art("1F4CB", "Đánh giá lại sau cảnh báo"),
    choices: [passed
      ? { label: "📣 Nghe kết quả", title: "✅ Giữ được công việc", outcome: "success",
        text: `${context.leader[0].toLocaleUpperCase("vi-VN")}${context.leader.slice(1)} ghi nhận tiến bộ rõ rệt. Cảnh báo được gỡ bỏ, tôi tiếp tục làm việc như bình thường.`,
        effects: { happiness: 3 }, playerUpdates: { jobWarning: null }, confirmText: "Nhẹ cả người", ...art("2705", "Giữ được công việc") }
      : { label: "📣 Nghe kết quả", title: "📦 Không đạt sau cảnh báo", outcome: "failure",
        text: `Kết quả vẫn chưa đạt yêu cầu sau một năm. ${context.place[0].toLocaleUpperCase("vi-VN")}${context.place.slice(1)} ${dismissalPhrase(careerId)}.\nHạnh phúc -${JOB_LOSS.happiness.fired}. Kinh nghiệm và học vấn vẫn còn: có thể vào Hoạt động → Xin việc, làm thêm hoặc học bổ sung.`,
        effects: { happiness: -JOB_LOSS.happiness.fired }, playerUpdates: getJobLossUpdates(player, age, "fired"),
        confirmText: "Bắt đầu lại", ...art("1F4E6", "Bị sa thải") }],
  };
}

// Cắt giảm nhân sự: thông báo trước một năm, cho chọn chuyển vị trí, chuẩn bị tài chính hoặc nhận gói nghỉ việc.
export function createLayoffNoticeEvent(player, age, random = Math.random) {
  const careerId = player.careerPath?.id;
  const l = JOB_LOSS.layoff;
  if (age >= RETIREMENT_AGE || player.employmentStatus !== "employed" || getEmploymentType(careerId) !== "employee" || player.jobWarning || player.layoffDue ||
      age - (player.employedSince ?? age) < l.minYears || random() >= l.chance) return null;
  const context = getEmploymentContext(careerId);
  const salary = getCareerAnnualSalary(careerId, Number(player.careerLevel) || 1);
  const packageAmount = Math.round((salary * l.packageRate) / 1000) * 1000;
  const forcedAmount = Math.round((salary * l.forcedRate) / 1000) * 1000;
  const transferred = random() < clamp(l.transfer + (player.intelligence >= 60 ? 0.15 : 0) - (player.intelligence < 40 ? 0.15 : 0), 0.1, 0.9);
  return {
    id: `layoff-notice-${age}`, kind: "layoff-notice", category: "career", priority: true,
    title: "📉 Công ty gặp khó khăn",
    text: `${context.place[0].toLocaleUpperCase("vi-VN")}${context.place.slice(1)} thông báo doanh thu sụt giảm mạnh và sẽ cắt giảm nhân sự vào năm sau. Vị trí ${player.job} của tôi nằm trong danh sách xem xét. ` +
      `Người bị cắt giảm năm sau được trợ cấp ${formatMoney(forcedAmount)}; ai nhận gói nghỉ việc ngay được ${formatMoney(packageAmount)}.`,
    ...art("1F4C9", "Công ty cắt giảm nhân sự"),
    choices: [
      transferred
        ? { label: "🔄 Ứng tuyển vị trí khác trong nội bộ", title: "🔄 Chuyển sang bộ phận mới",
          text: "Tôi chủ động ứng tuyển sang một bộ phận đang thiếu người và được nhận. Công việc vẫn giữ nguyên bậc và lương.",
          effects: { happiness: 2 }, confirmText: "May quá", ...art("1F504", "Chuyển vị trí nội bộ") }
        : { label: "🔄 Ứng tuyển vị trí khác trong nội bộ", title: "🔄 Chưa có vị trí phù hợp",
          text: `Tôi nộp đơn sang bộ phận khác nhưng chưa có chỗ trống phù hợp. Tôi sẽ bị cắt giảm vào năm sau, nhận trợ cấp ${formatMoney(forcedAmount)}.`,
          effects: { happiness: -1 }, playerUpdates: { layoffDue: age + 1, layoffSeverance: forcedAmount }, confirmText: "Chuẩn bị tinh thần", ...art("1F504", "Chuyển vị trí nội bộ") },
      { label: "💰 Chuẩn bị tài chính, chờ quyết định", title: "💰 Chuẩn bị cho năm khó khăn",
        text: `Tôi cắt bớt chi tiêu, lập quỹ dự phòng và cập nhật hồ sơ xin việc. Năm sau tôi sẽ bị cắt giảm và nhận trợ cấp ${formatMoney(forcedAmount)}; nhờ chuẩn bị trước, nỗi lo thất nghiệp nhẹ hơn.`,
        effects: {}, playerUpdates: { layoffDue: age + 1, layoffSeverance: forcedAmount, layoffPrepared: true }, confirmText: "Có kế hoạch rồi", ...art("1F4B0", "Chuẩn bị tài chính") },
      { label: `📨 Nhận gói nghỉ việc ngay (${formatMoney(packageAmount)})`, title: "📨 Nhận gói nghỉ việc",
        text: `Tôi ký nhận gói nghỉ việc và nhận ${formatMoney(packageAmount)} trợ cấp. Tôi rời ${context.place} với kinh nghiệm còn nguyên.\nHạnh phúc -${JOB_LOSS.happiness.layoff}.`,
        effects: { happiness: -JOB_LOSS.happiness.layoff }, money: packageAmount, playerUpdates: getJobLossUpdates(player, age, "layoff"),
        confirmText: "Bước tiếp", ...art("1F4E8", "Nhận gói nghỉ việc") },
    ],
  };
}

// Hết hợp đồng: báo trước một năm (sinh nhật ngay trước năm hết hạn), cho xin gia hạn, tìm việc mới hoặc chuyển hướng.
export function createContractNoticeEvent(player, age, random = Math.random) {
  if (age >= RETIREMENT_AGE || player.employmentStatus !== "employed" || !Number.isInteger(player.contractEndAge) ||
      player.contractEndAge !== age + 1 || player.contractNoticeAge === age) return null;
  const careerId = player.careerPath?.id;
  const context = getEmploymentContext(careerId);
  const r = JOB_LOSS.renewal;
  let chance = r.base + r.perStrike * getRecentStrikes(player, age);
  if (player.intelligence >= 60) chance += r.intelligenceHigh;
  if (player.intelligence < 40) chance += r.intelligenceLow;
  if (player.health < 40) chance += r.healthLow;
  const renewed = random() < clamp(chance, 0.1, 0.95);
  const ending = { contractNoticeAge: age, contractEnding: true };
  return {
    id: `contract-notice-${age}`, kind: "contract-notice", category: "career", priority: true,
    title: "📄 Hợp đồng sắp hết hạn",
    text: `Hợp đồng của tôi với ${context.place} sẽ hết hạn vào sinh nhật ${player.contractEndAge} tuổi. Đây là lúc quyết định bước tiếp theo.`,
    ...art("1F4C4", "Hợp đồng sắp hết hạn"),
    choices: [
      renewed
        ? { label: "✍️ Xin gia hạn hợp đồng", title: "✍️ Được gia hạn",
          text: `${context.leader[0].toLocaleUpperCase("vi-VN")}${context.leader.slice(1)} đồng ý gia hạn thêm ${CONTRACT_YEARS} năm.`,
          effects: { happiness: 2 }, playerUpdates: { contractEndAge: player.contractEndAge + CONTRACT_YEARS, contractNoticeAge: age, contractEnding: null },
          confirmText: "Làm tiếp thôi", ...art("270D", "Gia hạn hợp đồng") }
        : { label: "✍️ Xin gia hạn hợp đồng", title: "✍️ Chưa được gia hạn",
          text: `${context.place[0].toLocaleUpperCase("vi-VN")}${context.place.slice(1)} không gia hạn lần này. Hợp đồng kết thúc vào sinh nhật ${player.contractEndAge} tuổi; tôi còn một năm để tìm việc mới.`,
          effects: { happiness: -1 }, playerUpdates: ending, confirmText: "Tìm hướng mới", ...art("270D", "Gia hạn hợp đồng") },
      { label: "🔎 Tìm công việc mới", title: "🔎 Chuẩn bị chặng mới",
        text: `Tôi để hợp đồng kết thúc đúng hạn và bắt đầu tìm cơ hội khác. Khi hết hợp đồng, có thể vào Hoạt động → Xin việc để ứng tuyển với kinh nghiệm đã có.`,
        effects: {}, playerUpdates: ending, confirmText: "Lên kế hoạch", ...art("1F50E", "Tìm công việc mới") },
      { label: "🧭 Chuyển hướng nghề nghiệp", title: "🧭 Một hướng đi khác",
        text: "Tôi để hợp đồng kết thúc và tìm hiểu một nghề khác cùng khối học. Khi hết hợp đồng, Xin việc sẽ mở các ngành cùng khối cho tôi thử.",
        effects: {}, playerUpdates: { ...ending, careerSwitchOpen: true }, confirmText: "Thử điều mới", ...art("1F9ED", "Chuyển hướng nghề nghiệp") },
    ],
  };
}

// Mỗi sinh nhật (trước khi trả lương năm mới): thực hiện cắt giảm hoặc hết hợp đồng đã báo trước.
export function collectEmploymentYear(player, age) {
  if (age >= RETIREMENT_AGE || player.employmentStatus !== "employed") return null;
  const lines = [];
  const lose = (cause, extra = {}) => {
    const title = player.job;
    const loss = JOB_LOSS.happiness[cause];
    Object.assign(player, getJobLossUpdates(player, age, cause, extra));
    player.happiness = Math.max(0, (player.happiness ?? 0) - loss);
    return { title, loss };
  };
  if (player.layoffDue === age) {
    const severance = player.layoffSeverance ?? 0;
    const prepared = player.layoffPrepared;
    const { title, loss } = lose("layoff", { layoffSeverance: null, layoffPrepared: null });
    player.money += severance;
    // Đã chuẩn bị tài chính trước: nỗi lo thất nghiệp chỉ kéo dài một năm.
    if (prepared) player.moodEffects = player.moodEffects.map((effect) => (effect.id === "job-loss" && effect.startedAt === age ? { ...effect, years: 1 } : effect));
    lines.push(`📉 Bị cắt giảm nhân sự ở vị trí ${title}: nhận trợ cấp ${formatMoney(severance)}, Hạnh phúc -${loss}. Việc làm thêm và kinh nghiệm vẫn còn.`);
  } else if (Number.isInteger(player.contractEndAge) && age >= player.contractEndAge) {
    // Chỉ kết thúc khi đã báo trước cho chính hợp đồng này (contractEnding). contractNoticeAge còn lại từ lần
    // gia hạn trước không tính. Chưa kịp báo (năm đó có sự kiện quan trọng hơn): gia hạn tạm đến hai sinh nhật sau,
    // để sinh nhật kế tiếp có thông báo trước một năm như thường lệ.
    if (!player.contractEnding) {
      player.contractEndAge = age + 2;
      lines.push(`📄 Hợp đồng ${player.job} được gia hạn tạm đến ${age + 2} tuổi trong lúc chờ thương lượng.`);
    } else {
      const { title, loss } = lose("contract");
      lines.push(`📄 Hết hợp đồng ở vị trí ${title}: Hạnh phúc -${loss}. Không có trợ cấp; kinh nghiệm vẫn còn để ứng tuyển lại.`);
    }
  }
  return lines.length ? { content: lines.join("\n") } : null;
}

// Mô tả bậc khi được nhận lại nhờ kinh nghiệm.
export function describeRehire(player, careerId) {
  const level = getRehireLevel(player, careerId);
  return level > 1 ? `Nhờ kinh nghiệm, bạn vào thẳng vị trí ${getCareerProfile(careerId).ranks[level - 1]}.` : "";
}
