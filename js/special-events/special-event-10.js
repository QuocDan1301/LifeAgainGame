const image = "";
const completionLog =
  "🌟 Một lần giúp em bé đi lạc đã mang đến cho tôi một năm học đáng nhớ. Tôi khỏe mạnh, tự tin và học được nhiều điều mới — tất cả bắt đầu từ việc chịu ngồi lại bên một “chiếc còi báo động” giữa công viên.";
const next = (label, nextStep, transitionText = "") => ({
  label,
  nextStep,
  transitionText,
});
const ending = (label, text, extra = {}) => ({
  label,
  title: "🌳 Một lần gặp gỡ ở công viên",
  text,
  effects: {},
  image,
  imageAlt: "Khuôn mặt vui",
  confirmText: "Tiếp tục",
  ...extra,
});

const steps = {
  1: {
    title: "🌳 Tiếng khóc ngoài công viên",
    text: "Tôi đang chơi ngoài công viên thì thấy một cậu bé vừa khóc vừa gọi mẹ. Có vẻ cậu bé đã bị lạc.",
    choices: [
      next("Đến lúc thể hiện", 2),
      ending(
        "Nhờ bác bảo vệ giúp!",
        "Tôi báo bác bảo vệ rồi quay lại chơi. Cậu bé được hỗ trợ.",
      ),
      ending(
        "Chắc mẹ em ở gần thôi",
        "Tôi tiếp tục chơi nhưng vẫn hơi băn khoăn.",
      ),
    ],
  },
  2: {
    title: "😭 Nhiệm vụ khó hơn bài toán đố",
    text: "Tôi đến hỏi thăm, nhưng cậu bé cứ “oa oa”. Tôi dỗ đến khô cả cổ mà em vẫn khóc.\n\nĐúng lúc tôi định hỏi thêm, em quệt nước mũi vào tay áo tôi. Tuyệt vời, áo mới giặt sáng nay…",
    choices: [
      next(
        "Tới đâu hay tới đó quá",
        3,
        "Tôi dắt cậu bé đến chốt bảo vệ rồi kiên nhẫn ngồi cạnh.\n\n",
      ),
      ending(
        "Đành nhờ bác bảo vệ vậy",
        "Cuối cùng cậu bé đã gặp lại mẹ, mẹ cậu bé hỏi thông tin của tôi để trả ơn nhưng không ai biết",
      ),
    ],
  },
  3: {
    title: "👨‍👩‍👦 Cuộc đoàn tụ bất ngờ",
    text: "Tôi ở lại cùng cậu bé và đợi thông báo tìm người thân. Một lúc sau, một đôi vợ chồng hớt hải chạy đến. Cậu bé lập tức lao vào lòng mẹ.\n\nQua lời bác bảo vệ, họ cảm ơn tôi liên tục. Hóa ra họ là chủ một ngôi trường tiểu học xịn xò ở trung tâm thành phố",
    choices: [
      next("Thật là mừng", 4),
      next(
        "Giúp được em nhưng áo tôi...",
        4,
        "Cả nhà bật cười, mẹ cậu bé đưa khăn giúp tôi lau tay áo.\n\n",
      ),
    ],
  },
  4: {
    title: "✉️ Lời mời ngoài dự kiến",
    text: "Sau hôm đó, gia đình cậu bé ngỏ ý tặng tôi một năm học miễn phí tại trường.\n\nBa mẹ hỏi tôi có muốn chuyển trường không. Tôi thích lắm, nhưng nghĩ đến việc xa đám bạn lại hơi chần chừ.",
    choices: [
      ending(
        "Dạ được!",
        "Gia đình đồng ý nhận lời. Tôi bắt đầu một năm học ở trường mới",
        { schoolYearDueAge: 11, title: "🎒 Bắt đầu năm học mới" },
      ),
      ending(
        "Con muốn ở lại với bạn bè!",
        "Tôi lễ phép từ chối. Gia đình cậu bé vẫn cảm ơn, còn tôi tiếp tục học ở trường cũ.",
      ),
    ],
  },
  5: {
    title: "🌟 Một năm học thay đổi bản thân",
    text: "Một năm ở trường mới đầy niềm vui trôi qua. Tôi được thầy cô hướng dẫn tận tình, học bơi, chơi thể thao và làm quen với những người bạn tốt. Tôi còn biết chăm sóc bản thân, ăn ngủ điều độ và tự tin hơn trước.",
    choices: [
      ending(
        "Giúp người, mình cũng lớn lên!",
        "🎁 Sau một năm học, sức khỏe, trí tuệ, hạnh phúc và ngoại hình đều đạt ít nhất 80%.",
        {
          title: "🌟 Một năm học đáng nhớ",
          minimumStats: 80,
          schoolYearDueAge: null,
          confirmText: "Nhận phần thưởng",
          logContent: completionLog,
          logSummary: completionLog,
        },
      ),
    ],
  },
};

export function createLostChildSpecialStep(step) {
  if (!steps[step]) return null;
  return {
    kind: "lost-child-chain",
    specialId: "lost-child-school",
    specialStep: step,
    image,
    imageAlt: "Khuôn mặt vui",
    ...steps[step],
  };
}

export const lostChildSpecialEvent = {
  id: "a10-lost-child-school",
  ...createLostChildSpecialStep(1),
};
