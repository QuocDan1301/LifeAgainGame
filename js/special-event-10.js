const image = new URL("./img/events/childhood/joy.gif", import.meta.url).href;
const completionLog = "🌟 Một lần giúp em bé đi lạc đã mang đến cho tôi một năm học đáng nhớ. Tôi khỏe mạnh, tự tin và học được nhiều điều mới — tất cả bắt đầu từ việc chịu ngồi lại bên một “chiếc còi báo động” giữa công viên.";
const next = (label, nextStep, transitionText = "") => ({ label, nextStep, transitionText });
const ending = (label, text, extra = {}) => ({
  label, title: "🌳 Một lần gặp gỡ ở công viên", text, effects: {},
  image, imageAlt: "Khuôn mặt vui", confirmText: "Tiếp tục", ...extra,
});

const steps = {
  1: {
    title: "🌳 Tiếng khóc ngoài công viên",
    text: "Tôi đang chơi ngoài công viên thì thấy một cậu bé đứng cạnh cầu trượt, vừa khóc vừa gọi mẹ. Mọi người đi ngang, cậu cứ ngơ ngác nhìn theo. Có vẻ cậu bé đã bị lạc.",
    choices: [
      next("Để tui đây lo!", 2),
      ending("Nhờ bác bảo vệ giúp!", "Tôi báo bác bảo vệ rồi quay lại chơi. Cậu bé được hỗ trợ."),
      ending("Chắc mẹ em ở gần thôi…", "Tôi tiếp tục chơi nhưng vẫn hơi băn khoăn."),
    ],
  },
  2: {
    title: "😭 Nhiệm vụ khó hơn bài toán đố",
    text: "Tôi đến hỏi tên và người nhà, nhưng cậu bé chỉ đáp lại bằng một tràng “oa oa”. Tôi dỗ đến khô cả cổ, làm mặt hề đến mỏi cả má mà em vẫn khóc.\n\nĐúng lúc tôi định hỏi thêm, em quệt nước mũi vào tay áo tôi. Tuyệt vời, áo mới giặt sáng nay…",
    choices: [
      next("Nín đi, anh/chị vẫn ở đây!", 3, "Tôi kiên nhẫn ngồi cạnh, rồi nhờ bác bảo vệ đến giúp.\n\n"),
      ending("Bác ơi, cháu hết phép rồi!", "Tôi bàn giao cho bác bảo vệ rồi về. Cậu bé được giúp đỡ, nhưng chuỗi đặc biệt kết thúc."),
    ],
  },
  3: {
    title: "👨‍👩‍👦 Cuộc đoàn tụ bất ngờ",
    text: "Tôi ở lại cùng cậu bé tại chốt bảo vệ, đợi thông báo tìm người thân. Một lúc sau, một đôi vợ chồng hớt hải chạy đến. Cậu bé lập tức lao vào lòng mẹ.\n\nNghe bác bảo vệ kể chuyện, họ cảm ơn tôi liên tục. Hóa ra họ là chủ một ngôi trường tiểu học xịn xò, có cả hồ bơi, sân bóng và thư viện rộng đến mức tôi chắc mình cũng có thể lạc trong đó.",
    choices: [
      next("Em tìm được mẹ là vui rồi!", 4),
      next("Dạ… cứu được em, dơ cái áo!", 4, "Cả nhà bật cười, mẹ cậu bé đưa khăn giúp tôi lau tay áo.\n\n"),
    ],
  },
  4: {
    title: "✉️ Lời mời ngoài dự kiến",
    text: "Sau khi liên hệ với ba mẹ tôi, gia đình cậu bé ngỏ ý tặng tôi một năm học miễn phí tại trường, bao gồm học phí, bữa ăn và các lớp ngoại khóa.\n\nBa mẹ hỏi tôi có muốn chuyển trường không. Tôi nghe đến hồ bơi thì thích lắm, nhưng nghĩ đến việc xa đám bạn lại hơi chần chừ.",
    choices: [
      ending("Dạ học! Con tự soạn cặp!", "Gia đình đồng ý nhận lời. Tôi bắt đầu một năm học ở trường mới; khi 11 tuổi, tôi sẽ nhìn lại những điều mình đã học được.", { schoolYearDueAge: 11, title: "🎒 Bắt đầu năm học mới" }),
      ending("Con muốn ở lại với bạn bè!", "Tôi lễ phép từ chối. Gia đình cậu bé vẫn cảm ơn, còn tôi tiếp tục học ở trường cũ."),
    ],
  },
  5: {
    title: "🌟 Một năm học thay đổi bản thân",
    text: "Một năm ở trường mới trôi qua với biết bao trải nghiệm. Tôi được thầy cô hướng dẫn tận tình, học bơi, chơi thể thao và làm quen với những người bạn tốt. Tôi còn biết chăm sóc bản thân, ăn ngủ điều độ và tự tin hơn trước.\n\nNgày đầu vào trường, tôi còn đứng nhầm lớp. Cuối năm, tôi đã tự tin lên sân khấu nhận giấy khen. Ba mẹ ngồi dưới vỗ tay, còn cậu bé năm nào hét to: “Anh chị cứu con kìa!” khiến cả hội trường quay lại nhìn.",
    choices: [ending("Giúp người, mình cũng lớn lên!", "🎁 Sau một năm học, sức khỏe, trí tuệ, hạnh phúc và ngoại hình đều đạt ít nhất 85%.", {
      title: "🌟 Một năm học đáng nhớ", minimumStats: 85, schoolYearDueAge: null,
      confirmText: "Nhận phần thưởng", logContent: completionLog, logSummary: completionLog,
    })],
  },
};

export function createLostChildSpecialStep(step) {
  if (!steps[step]) return null;
  return { kind: "lost-child-chain", specialId: "lost-child-school", specialStep: step,
    image, imageAlt: "Khuôn mặt vui", ...steps[step] };
}

export const lostChildSpecialEvent = { id: "a10-lost-child-school", ...createLostChildSpecialStep(1) };
