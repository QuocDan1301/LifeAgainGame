import { hasInternationalDegreeForCareer } from "../education/study-abroad.js";
import { openMojiArt } from "../media/event-art.js";
import { formatMoney } from "../core/money-format.js";
import { canChooseCareer } from "../education/study-blocks.js";
import { careerMilestones, CAREER_SPARK_SUCCESS_RATE } from "./career-milestones-data.js";

export { careerMilestones };

function shuffle(items, random) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

// Khóa bậc nghề (một hàm dùng chung, theo mã ngành ổn định, tiến độ thuộc từng cuộc đời):
// bậc 3 chỉ mở khi hoàn thành chuỗi khám phá ngành ở tuổi 16 (thành công) và chọn đúng ngành đó ở tuổi 18.
// Thiếu điều kiện thì tối đa bậc 2.
export const MAX_RANK_WITHOUT_MILESTONE = 2;
export function getRankLock(player, careerId = player?.careerPath?.id) {
  if (hasInternationalDegreeForCareer(player, careerId)) return {
    unlocked: true, maxRank: 3,
    reason: "Bằng du học đúng chuyên ngành: mở bậc 3 bằng kinh nghiệm và đánh giá công việc.",
  };
  if (careerId === "study-abroad") return {
    unlocked: true, maxRank: 3,
    reason: "Lộ trình du học: thăng tiến đến bậc 3 bằng kinh nghiệm và đánh giá công việc tại nước đã chọn.",
  };
  const unlocked = Boolean(careerId && player?.careerSpark === careerId && careerMilestones[careerId]);
  const sparkField = careerMilestones[player?.careerSpark]?.field;
  return {
    unlocked,
    maxRank: unlocked ? 3 : MAX_RANK_WITHOUT_MILESTONE,
    reason: unlocked
      ? `Đã có dấu mốc tuổi 16 của ngành này: mở được bậc 3.`
      : sparkField
        ? `Dấu mốc tuổi 16 thuộc ngành ${sparkField}, nên ngành này tối đa bậc 2.`
        : "Bậc 3 cần hoàn thành chuỗi khám phá ngành này ở tuổi 16 và chọn đúng ngành ở tuổi 18; hiện tối đa bậc 2.",
  };
}
// Dấu mốc tuổi 16 chỉ có hiệu lực khi tuổi 18 chọn đúng ngành đã hoàn thành chuỗi.
export function hasCareerMilestone(player) {
  return Boolean(player?.careerPath?.id && player.careerSpark === player.careerPath.id && careerMilestones[player.careerPath.id]);
}

// Vòng quyết định tuổi 16 vẫn có bước ngẫu nhiên thành công/thất bại, nhưng tỉ lệ dựa trên chỉ số
// phù hợp với ngành và được công khai trước: 60% ở mức 50, mỗi điểm ±0,5%, giới hạn 35–85%.
const SPARK_STAT = {
  football: "health", military: "health",
  acting: "happiness", singing: "happiness", painting: "happiness", fashion: "happiness",
  tiktok: "happiness", youtube: "happiness", esports: "happiness",
};
const STAT_NAMES = { health: "Sức khỏe", happiness: "Hạnh phúc", intelligence: "Trí tuệ" };
export const SPARK_CHANCE = { base: CAREER_SPARK_SUCCESS_RATE, perPoint: 0.005, min: 0.35, max: 0.85 };
export function getSparkChance(careerId, player) {
  const stat = SPARK_STAT[careerId] ?? "intelligence";
  const value = Number(player?.[stat] ?? 50);
  const chance = Math.max(SPARK_CHANCE.min, Math.min(SPARK_CHANCE.max, SPARK_CHANCE.base + (value - 50) * SPARK_CHANCE.perPoint));
  return { stat, statName: STAT_NAMES[stat], value, chance };
}
const describeSparkChance = (careerId, player) => {
  const info = getSparkChance(careerId, player);
  return `📊 Vòng quyết định: khả năng thành công khoảng ${Math.round(info.chance * 100)}% (dựa trên ${info.statName} ${info.value}%).`;
};

function sparkStopChoice(careerId, label) {
  const data = careerMilestones[careerId];
  const text = `Tôi quyết định dừng lại. Chuyến khám phá ngành ${data.field} khép lại ở đây: không có phần thưởng và cũng không có dấu mốc nào được ghi nhận.`;
  return {
    label,
    title: "🚪 Dừng lại giữa chừng",
    text: `${text} Cơ hội khám phá ngành này ở tuổi 16 sẽ không quay lại.`,
    effects: {},
    confirmText: "Dừng tại đây",
    logSummary: `16 tuổi: Thử khám phá ngành ${data.field} nhưng dừng lại giữa chừng.`,
    ...openMojiArt("1F6AA", "Dừng lại giữa chừng"),
  };
}

function sparkOutcomeChoice(careerId, success) {
  const data = careerMilestones[careerId];
  const { spark } = data;
  if (success) {
    const text = `${spark.success}\nDấu mốc ngành ${data.field} đã được lưu. Nếu tuổi 18 chọn đúng ngành này, ${data.mentor} hẹn gặp lại tôi ở buổi phỏng vấn khi học xong (22 tuổi); câu chuyện còn tiếp nối và mở cơ hội xét bậc nghề cao nhất.`;
    return {
      label: "📣 Nghe công bố kết quả",
      title: `🏆 ${spark.title.replace(/^\S+\s/u, "")} — Thành công!`,
      text,
      money: spark.reward,
      effects: { happiness: 3 },
      careerSpark: careerId,
      outcome: "success",
      confirmText: "Tuyệt vời!",
      logSummary: `16 tuổi: Thành công ở thử thách ngành ${data.field}, nhận ${formatMoney(spark.reward)}.\nĐã lưu dấu mốc ngành ${data.field}.`,
      ...openMojiArt("1F3C6", `Thành công ở thử thách ngành ${data.field}`),
    };
  }
  return {
    label: "📣 Nghe công bố kết quả",
    title: "😔 Lần này chưa thành công",
    text: `${spark.failure}\nTôi đã cố gắng đến vòng cuối nhưng kết quả không như mong đợi. Dấu mốc ngành ${data.field} chưa được mở khóa.`,
    effects: { happiness: -3 },
    outcome: "failure",
    confirmText: "Rút kinh nghiệm",
    logSummary: `16 tuổi: Vào tới vòng cuối thử thách ngành ${data.field} nhưng chưa thành công.`,
    ...openMojiArt("1F614", "Chưa thành công ở vòng cuối"),
  };
}

// Chuỗi 4 tình huống ở tuổi 16: nhận lời → vượt khó → vòng quyết định → kết quả ngẫu nhiên.
export function createCareerSparkStep(careerId, step = 1, random = Math.random, player = null) {
  const data = careerMilestones[careerId];
  if (!data || step < 1 || step > 4) return null;
  const { spark } = data;
  const base = {
    id: `career-spark-${careerId}-${step}`,
    kind: "career-spark",
    careerSparkId: careerId,
    specialStep: step,
    title: `${spark.title} (${step}/4)`,
    ...openMojiArt(data.icon, `Khám phá ngành ${data.field}`),
  };
  if (step === 4) {
    // Kết quả được quyết định một lần khi bước 4 xuất hiện, tải lại không đổi kết quả.
    const success = random() < getSparkChance(careerId, player).chance;
    return {
      ...base,
      text: "Vòng quyết định đã kết thúc. Ban tổ chức tổng hợp điểm và chuẩn bị công bố kết quả. Tim tôi đập thình thịch…",
      choices: [sparkOutcomeChoice(careerId, success)],
    };
  }
  const [text, keepGoing, stop] = spark.steps[step - 1];
  return {
    ...base,
    // Tỉ lệ thành công được công khai từ bước đầu và nhắc lại trước vòng quyết định.
    text: step === 1 || step === 3 ? `${text}\n\n${describeSparkChance(careerId, player)}` : text,
    choices: shuffle([
      { label: keepGoing, nextStep: step + 1 },
      sparkStopChoice(careerId, stop),
    ], random),
  };
}

// Tuổi 16 chỉ có duy nhất sự kiện khám phá một ngành ngẫu nhiên, trong số
// các ngành phù hợp khối học đã chọn ở tuổi 15 (chưa có khối thì dùng mọi ngành).
export function createCareerSparkEvents(studyBlock, random = Math.random, player = null) {
  return Object.keys(careerMilestones)
    .filter(careerId => !studyBlock || canChooseCareer(careerId, studyBlock))
    .map(careerId => createCareerSparkStep(careerId, 1, random, player));
}
