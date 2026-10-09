import { openMojiArt } from "./event-art.js";
import { formatMoney } from "./money-format.js";
import { canChooseCareer } from "./study-blocks.js";
import { careerMilestones, CAREER_SPARK_SUCCESS_RATE } from "./career-milestones-data.js";

export { careerMilestones };

function shuffle(items, random) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

// Dấu mốc tuổi 16 chỉ có hiệu lực khi tuổi 18 chọn đúng ngành đã hoàn thành chuỗi.
export function hasCareerMilestone(player) {
  const careerId = player?.careerPath?.id;
  return Boolean(careerId && player.careerSpark === careerId && careerMilestones[careerId]);
}

function sparkStopChoice(careerId, label) {
  const data = careerMilestones[careerId];
  const text = `Tôi quyết định dừng lại. Chuyến khám phá ngành ${data.field} khép lại ở đây: không có phần thưởng và cũng không có dấu mốc nào được ghi nhận.`;
  return {
    label,
    title: "🚪 Dừng lại giữa chừng",
    text,
    effects: {},
    confirmText: "Để dịp khác vậy",
    logSummary: `16 tuổi: Thử khám phá ngành ${data.field} nhưng dừng lại giữa chừng.`,
    ...openMojiArt("1F6AA", "Dừng lại giữa chừng"),
  };
}

function sparkOutcomeChoice(careerId, success) {
  const data = careerMilestones[careerId];
  const { spark } = data;
  if (success) {
    const text = `${spark.success}\nDấu mốc ngành ${data.field} đã được lưu. Nếu tuổi 18 chọn đúng ngành này, câu chuyện với ${data.mentor} sẽ còn tiếp nối và mở cơ hội xét bậc nghề cao nhất.`;
    return {
      label: "📣 Nghe công bố kết quả",
      title: `🏆 ${spark.title.replace(/^\S+\s/u, "")} — Thành công!`,
      text,
      money: spark.reward,
      effects: { happiness: 3 },
      careerSpark: careerId,
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
    confirmText: "Rút kinh nghiệm",
    logSummary: `16 tuổi: Vào tới vòng cuối thử thách ngành ${data.field} nhưng chưa thành công.`,
    ...openMojiArt("1F614", "Chưa thành công ở vòng cuối"),
  };
}

// Chuỗi 4 tình huống ở tuổi 16: nhận lời → vượt khó → vòng quyết định → kết quả ngẫu nhiên.
export function createCareerSparkStep(careerId, step = 1, random = Math.random) {
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
    const success = random() < CAREER_SPARK_SUCCESS_RATE;
    return {
      ...base,
      text: "Vòng quyết định đã kết thúc. Ban tổ chức tổng hợp điểm và chuẩn bị công bố kết quả. Tim tôi đập thình thịch…",
      choices: [sparkOutcomeChoice(careerId, success)],
    };
  }
  const [text, keepGoing, stop] = spark.steps[step - 1];
  return {
    ...base,
    text,
    choices: shuffle([
      { label: keepGoing, nextStep: step + 1 },
      sparkStopChoice(careerId, stop),
    ], random),
  };
}

// Tuổi 16 chỉ có duy nhất sự kiện khám phá một ngành ngẫu nhiên, trong số
// các ngành phù hợp khối học đã chọn ở tuổi 15 (chưa có khối thì dùng mọi ngành).
export function createCareerSparkEvents(studyBlock, random = Math.random) {
  return Object.keys(careerMilestones)
    .filter(careerId => !studyBlock || canChooseCareer(careerId, studyBlock))
    .map(careerId => createCareerSparkStep(careerId, 1, random));
}
