import { RESCUE_CARRY_MIN_HEALTH } from "../stats/health-rules.js";

const art = (code, alt) => {
  const image = new URL(
    `../img/events/openmoji/color/svg/${code}.svg`,
    import.meta.url,
  ).href;
  return { image, imageAlt: alt, imageFallback: image, imageFallbackAlt: alt };
};
const next = (label, nextStep, transitionText) => ({
  label,
  nextStep,
  transitionText,
});
const fatal = (label, text) => ({
  label,
  title: "Một bước giữa sống và chết",
  text,
  death: true,
  effects: { health: -100 },
  confirmText: "Kết thúc cuộc đời",
  logContent: `🏗️ Năm 35 tuổi, tôi gặp một tai nạn tại công trường bỏ hoang. ${text}`,
  logSummary: text,
  ...art("26A0", "Tai nạn tại công trường"),
});
const diary =
  "🚑 Năm 35 tuổi, tôi giúp một người thoát khỏi công trường sắp sập. Ông ấy cảm ơn tôi vì đã cứu mạng. Còn tôi, tối đó về nhà thấy bữa cơm bình thường cũng ngon hơn mọi ngày.";
const success = (label, money, happiness, text) => ({
  label,
  title: "🚑 Giữ lấy một mạng người",
  text,
  money,
  effects: { happiness },
  achievementIds: ["story-save-life"],
  confirmText: "Nhận thành tựu!",
  logContent: diary,
  logSummary: `${diary}\nHạnh phúc +${happiness} · Tiền +${money.toLocaleString("vi-VN")} VNĐ`,
  ...art("1F91D", "Một người được trở về bình an"),
});
const steps = {
  1: {
    title: "🏗️ Tiếng kêu sau hàng rào",
    text: "Trên đường về nhà, tôi thấy một người đàn ông bị kẹt chân dưới thanh sắt trong công trình, phía trên là giàn giáo nguy hiểm.\n\nNgay trước mặt tôi có tấm biển ‘Nền yếu — nguy cơ sụt lún’.",
    warningPhrases: ["Nền yếu — nguy cơ sụt lún", "giàn giáo đang nghiêng"],
    ...art("1F6A7", "Biển cảnh báo tại công trường bỏ hoang"),
    choices: [
      next(
        "Gọi cứu hộ, đi vòng xem sao!",
        2,
        "Tôi báo vị trí rồi theo lối bê tông đến gần.\n\n",
      ),
      fatal(
        "Chạy thẳng tới cho nhanh!",
        "Tôi phớt lờ biển báo nền yếu và chạy thẳng tới. Nền đất sụp xuống, kéo tôi rơi vào hố công trình. Tôi tử vong; cuộc đời kết thúc ở tuổi 35.",
      ),
      {
        label: "Đứng ngoài gọi người giúp!",
        title: "📞 Chờ cứu hộ ở nơi an toàn",
        text: "Tôi báo cứu hộ và chờ ở nơi an toàn. Người đàn ông được đội cứu hộ hỗ trợ. Tôi trở về bình an; chuỗi kết thúc, không nhận phần thưởng đặc biệt.",
        effects: {},
        confirmText: "Trở về nhà",
        logContent:
          "🏗️ Năm 35 tuổi, tôi nghe tiếng kêu cứu từ công trường bỏ hoang. Tôi báo cứu hộ và đứng chờ ở nơi an toàn. Đội cứu hộ đến hỗ trợ người đàn ông bị nạn.",
        logSummary:
          "Tôi gọi cứu hộ từ nơi an toàn. Người bị nạn được đội cứu hộ hỗ trợ.",
        ...art("1F4F1", "Gọi cứu hộ và chờ ở nơi an toàn"),
      },
    ],
  },
  2: {
    title: "⚡ Sợi dây trong vũng nước",
    text: "Đến gần, tôi thấy một sợi dây điện đứt đang tóe lửa trong vũng nước chắn ngang. Người đàn ông cố nhổm dậy rồi chỉ về phía tôi: ‘Đừng bước xuống!’\n\nBên trái có một đoạn nền khô, tách khỏi vũng nước, dẫn đến chỗ ông ấy.",
    warningPhrases: ["dây điện đứt đang tóe lửa", "Đừng bước xuống!"],
    ...art("26A1", "Dây điện tóe lửa trong vũng nước"),
    choices: [
      next(
        "Đi lối khô, tránh xa dây điện!",
        3,
        "Tôi vòng qua đoạn nền khô.\n\n",
      ),
      fatal(
        "Có tí nước thôi, cứu người nhanh vẫn hơn!",
        "Tôi phớt lờ sợi dây điện đang tóe lửa và bước vào vùng nước có điện. Tôi bị điện giật tử vong; cuộc đời kết thúc ở tuổi 35.",
      ),
    ],
  },
  3: {
    title: "⏳ Tiếng kim loại rạn nứt",
    text: "Tôi đến bên người đàn ông. Thanh sắt đè lên phần ống quần. Ông đã rút được chân ra khỏi chiếc giày mắc kẹt, nhưng vẫn cố với lấy túi tài liệu nằm dưới giàn giáo.\n\nPhía trên một thanh sắc khác vừa bung khỏi mối nối.",
    warningPhrases: [
      "Phía trên vang lên tiếng rắc. Một thanh giằng vừa bung khỏi mối nối.",
    ],
    ...art("23F3", "Giàn giáo rạn nứt, thời gian thoát ra đang cạn"),
    choices: [
      next(
        "Bỏ túi tài liệu đi",
        4,
        "Ông buông túi tài liệu, cùng tôi rời khỏi khu vực.\n\n",
      ),
      fatal(
        "Đợi tôi chui vào lấy giúp!",
        "Tôi phớt lờ tiếng rạn nứt và thanh giằng vừa bung khỏi mối nối. Khi tôi cúi xuống dưới giàn giáo, cả khung sắt đổ sập. Tôi tử vong; cuộc đời kết thúc ở tuổi 35.",
      ),
    ],
  },
  4: {
    title: "🚑 Người được cứu",
    text: "Chúng tôi vừa đến chỗ an toàn thì giàn giáo phía sau đổ xuống. Đội cứu hộ đến nơi. Tôi ngồi bệt xuống, hai tay vẫn run.\n\nVài ngày sau, ông tìm đến cảm ơn. Hóa ra ông là chủ một doanh nghiệp, hôm ấy đến kiểm tra công trình đang tạm dừng thi công. Ông nói:\n\n‘Cậu nhắc tôi bỏ cái túi, tôi mới chịu đi. Nghĩ lại, chẳng có giấy tờ nào đáng để đổi mạng cả.’\n\nÔng ngỏ ý tặng tôi 50.000.000 VNĐ để cảm ơn.",
    ...art("1F691", "Đội cứu hộ tiếp nhận người được cứu"),
    choices: [
      success(
        "Ông bình an là tốt rồi, tôi xin nhận.",
        50_000_000,
        10,
        "Tôi nhận 50.000.000 VNĐ từ ông. Tôi đã trở về, và giúp một người khác cũng được trở về. Tối đó, bữa cơm bình thường cũng ngon hơn mọi ngày.",
      ),
      success(
        "Chia một nửa giúp người khó khăn nhé.",
        25_000_000,
        15,
        "Tôi nhận 25.000.000 VNĐ. Nửa còn lại được ông chuyển đi hỗ trợ người khó khăn. Tôi đã trở về, và giúp một người khác cũng được trở về.",
      ),
    ],
  },
};

const callRescueTeam = next(
  "Tôi không đủ sức dìu. Gọi cứu hộ vào khiêng ông ra!",
  4,
  "Tôi khuyên ông buông túi tài liệu, rồi gọi to chỉ lối nền khô cho đội cứu hộ vừa tới. Họ vào khiêng ông ra khỏi khu vực.\n\n",
);

export function createSaveLifeSpecialStep(stepNumber, player) {
  let step = steps[stepNumber];
  if (!step) return null;
  if (stepNumber === 3 && (player?.health ?? 100) < RESCUE_CARRY_MIN_HEALTH) {
    step = {
      ...step,
      text: `${step.text}\n\nNgười tôi đang yếu (Sức khỏe ${player.health}%), không đủ sức dìu một người trưởng thành.`,
      choices: step.choices.map((choice) =>
        choice.nextStep === 4 ? callRescueTeam : choice,
      ),
    };
  }
  return {
    ...step,
    id: `special-save-life-${stepNumber}`,
    kind: "special-chain",
    priority: false,
    specialId: "save-life",
    specialStep: stepNumber,
  };
}
export const saveLifeSpecialEvent = createSaveLifeSpecialStep(1);
