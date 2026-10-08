const sticker = (code) =>
  new URL(`./img/events/stickers/${code}.svg`, import.meta.url).href;

const art = (code, alt) => ({
  image: sticker(code),
  imageAlt: alt,
  imageFallback: sticker(code),
  imageFallbackAlt: alt,
});

const next = (label, nextStep, options = {}) => ({
  label,
  nextStep,
  ...options,
});

const ending = (label, title, text, code = "1F31F") => ({
  label,
  title,
  text,
  effects: {},
  confirmText: "Kết thúc chuyến đi",
  logSummary: `${title}\n${text}`,
  ...art(code, title),
});

const success = (label, text) => ({
  label,
  title: "💎 Phát hiện đổi đời",
  text,
  effects: { happiness: 15, intelligence: 5 },
  money: 100_000_000,
  achievementIds: ["story-diamond"],
  confirmText: "Nhận thành tựu!",
  logContent:
    "💎 Năm 20 tuổi, tôi cùng đám bạn phát hiện một mỏ kim cương trong chuyến đi núi Bà Đen. Chuyến đi dự tính chỉ tốn tiền bánh tráng bỗng trở thành câu chuyện được cả nhà nhắc lại mỗi dịp Tết.",
  logSummary:
    "💎 Tìm thấy mỏ kim cương trong chuyến đi núi Bà Đen.\nHạnh phúc +15 · Trí tuệ +5 · Tiền +100.000.000 VNĐ",
  ...art("1F31F", "Tinh thể kim cương tỏa sáng"),
});

const steps = {
  1: {
    title: "📱 Kèo này đi không?",
    text: "Tôi đang nằm lướt điện thoại thì đám bạn réo trong nhóm: “Cuối tuần đi núi Bà Đen không? Hai mươi tuổi rồi, đi cho biết đây biết đó, biết mỗi cái giường hoài!”",
    ...art("1F4F1", "Điện thoại hiện lời rủ đi núi Bà Đen"),
    choices: [
      next("🔥 Sợ gì mà không triển!", 2),
      ending(
        "🛌 Thôi, làm biếng lắm!",
        "😴 Một ngày ôm gối",
        "Tôi ngủ đến trưa, tỉnh dậy thấy nhóm gửi 47 tấm ảnh cùng một tin nhắn: “Tiếc chưa con?” Chuyến khám phá kết thúc trước khi kịp bắt đầu.",
        "1F6CC",
      ),
    ],
  },
  2: {
    title: "🌤️ Lên đường thôi!",
    text: "Một buổi sáng đẹp trời, cả bọn xuất phát với quyết tâm chinh phục ngọn núi. Riêng Huy vừa xuống xe đã hỏi ngay chỗ bán bánh tráng. Trước khi đi, tôi ghé quầy hàng chuẩn bị đồ.",
    ...art("1F31E", "Buổi sáng bắt đầu chuyến đi núi"),
    choices: [
      next("🔦 Nước với đèn pin, đủ bộ!", 3, { grants: "flashlight" }),
      next("🥖 Bánh mì trước, tính sau!", 3, { grants: "bread" }),
      next("💪 Có niềm tin là đủ!", 3),
    ],
  },
  3: {
    title: "🧓 Chuyện bên quán nước",
    text: "Bác bán nước kể rằng trận mưa vừa rồi làm lộ một khe đá có những đốm sáng kỳ lạ. Chú Tư, người dẫn đường đang ngồi gần đó, bảo có thể dẫn cả nhóm đến xem. Huy buông ngay bịch bánh tráng: “Lấp lánh là tao thấy có tương lai rồi đó!”",
    ...art("1F964", "Bác bán nước kể chuyện về khe đá"),
    choices: [
      next("🥾 Chú dẫn tụi con đi với!", 4),
      ending(
        "📸 Thôi, ngắm cảnh được rồi!",
        "📷 Một chuyến sống ảo",
        "Cả nhóm chụp ảnh rồi xuống núi. Tôi mang về một album sống ảo và đôi chân muốn đình công, còn khe đá lấp lánh vẫn là câu chuyện chưa ai kiểm chứng.",
        "1F4F8",
      ),
    ],
  },
  4: {
    title: "🐕 Công lớn của Bắp",
    text: "Đến điểm nghỉ chân, Bắp — chú chó của chú Tư — chạy từ bụi cây ra. Huy giật mình núp sau lưng tôi: “Tao bảo vệ phía sau!” Chân Bắp làm bật một viên đá dính bùn, bên trong có thứ gì đó lóe sáng.",
    ...art("1F9ED", "Bắp phát hiện viên đá lấp lánh"),
    choices: [
      next("✨ Nhặt lên coi thử nào!", 5),
      next("🥖 Bắp, đổi bánh lấy đá!", 5, { requires: "bread" }),
      ending(
        "🚶 Đá thôi, đi tiếp đi!",
        "🪨 Manh mối bị bỏ lại",
        "Tôi bỏ qua viên đá. Huy cũng bỏ qua cơ hội được khoe rằng mình quen người giàu. Mỏ kim cương tiếp tục nằm im dưới lớp đất.",
        "1F50D",
      ),
    ],
  },
  5: {
    title: "🔦 Lấp lánh trong khe đá",
    text: "Chú Tư nhìn viên đá rồi chỉ về khe đá gần đó: “Chắc nước mưa cuốn từ chỗ kia xuống.” Từ bên ngoài, tôi thấy nhiều đốm sáng tương tự. Huy bật đèn điện thoại, máy báo còn 1% pin: “Đúng lúc đời sắp sáng thì máy lại tối.”",
    ...art("1F50D", "Những đốm sáng trong khe đá"),
    choices: [
      next("🔦 Đèn pin đây, để tôi!", 6, { requires: "flashlight" }),
      next("🙏 Chú Tư cho mượn đèn nha!", 6),
      ending(
        "🍚 Thôi, đói quá rồi!",
        "🍜 Bí mật nằm lại",
        "Tôi chọn xuống núi ăn cơm. Cả nhóm no bụng, nhưng bí mật trong khe đá vẫn nằm lại chờ một người tò mò hơn.",
        "1F37D",
      ),
    ],
  },
  6: {
    title: "📞 Khoan mua xe đã!",
    text: "Chú Tư gửi ảnh cho một người quen làm địa chất. Người đó gọi lại: “Đáng chú ý đấy, nhưng phải khảo sát và kiểm định mới kết luận được.” Trong lúc ấy, Huy đã chọn xong màu xe dù chưa ai hỏi.",
    ...art("1F4F1", "Cuộc gọi từ người am hiểu địa chất"),
    choices: [
      next("📍 Gửi vị trí, nhờ kiểm định!", 7),
      next("📣 Đăng khoe trước cho nóng!", 7, {
        transitionText: "Tôi vừa đăng bài thì mẹ bình luận: “Giàu rồi trả mẹ tiền điện nha con.” Quê quá, tôi xóa bài rồi cùng chú Tư gửi thông tin cho đoàn khảo sát.\n\n",
      }),
      ending(
        "🙅 Thủ tục quá, thôi bỏ!",
        "🪨 Viên đá chặn giấy",
        "Tôi mang viên đá về làm đồ chặn giấy. Mỗi lần nhìn nó, tôi lại nghĩ: “Biết đâu…” Nhưng không có kiểm định, câu chuyện dừng lại ở hai chữ suýt nữa.",
        "1F4CB",
      ),
    ],
  },
  7: {
    title: "💎 Đi chơi mà đổi đời",
    text: "Vài tuần sau, đoàn khảo sát báo tin: những tinh thể ấy là kim cương, và khu vực chúng tôi phát hiện có cả một mỏ trong thế giới game! Huy nhắn ngay: “Tao đi chuyến đó vì đam mê địa chất mà.” Tôi gửi lại tin nhắn đầu tiên của nó: “Ở đó có bánh tráng không?”",
    ...art("1F31F", "Phát hiện mỏ kim cương"),
    choices: [
      success(
        "📞 Má ơi, con tìm ra mỏ rồi!",
        "Tôi gọi về nhà, nói nhanh đến mức mẹ phải bắt kể lại hai lần. Chuyến đi tìm bình yên bỗng mang về một phát hiện đổi đời.",
      ),
      success(
        "🐕 Bắp xứng đáng có thưởng!",
        "Cả nhóm thống nhất Bắp mới là người có công đầu và mua tặng chú chó một chiếc vòng cổ mới. Huy vẫn xin được ghi công vì đã… ăn bánh tráng đúng chỗ.",
      ),
    ],
  },
};

export function createDiamondSpecialStep(stepNumber, inventory = {}) {
  const step = steps[stepNumber];
  if (!step) return null;
  return {
    ...step,
    id: `special-diamond-${stepNumber}`,
    kind: "special-chain",
    specialId: "diamond-mine",
    specialStep: stepNumber,
    choices: step.choices.filter(
      (choice) => !choice.requires || inventory[choice.requires] === true,
    ),
  };
}

export const diamondSpecialEvent = createDiamondSpecialStep(1);
