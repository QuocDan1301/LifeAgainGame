const art = (code, alt) => {
  const image = new URL(`./img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;
  return { image, imageAlt: alt, imageFallback: image, imageFallbackAlt: alt };
};
const next = (label, nextStep, transitionText = "") => ({ label, nextStep, transitionText });
const fatal = (label, text) => ({
  label, title: "🚉 Chuyến tàu không trở về", text, death: true,
  effects: { health: -100 }, confirmText: "Kết thúc cuộc đời",
  logContent: `🚉 Năm 45 tuổi, tôi lên một chuyến tàu kỳ lạ lúc nửa đêm. ${text}`,
  logSummary: text, ...art("26A0", "Lựa chọn sai trên chuyến tàu âm giới"),
});

export function createLastTrainSpecialStep(stepNumber, inventory = {}) {
  const reunited = inventory.reunited === true;
  const steps = {
    1: {
      title: "🚉 Chuyến cuối lúc 0 giờ",
      text: "Sau chuyến đi xa, tôi đến ga khi chuyến tàu cuối chuẩn bị rời bến. Vé ghi rõ: toa 04, ghế 18.\n\nNhân viên soát vé nhìn tôi, bỗng hạ giọng:\n\n‘Đêm nay toa bốn hỏng đèn. Anh sang toa năm, chỗ đó sáng.’\n\nTôi định nghe theo thì tấm vé nóng lên. " +
        (reunited
          ? "Mặt sau hiện dòng chữ quen thuộc, giống nét chữ trong những lá thư của bà cụ năm xưa:\n\n‘Đừng đổi chỗ đã dành cho con.’"
          : "Mặt sau hiện một tấm ảnh cũ: bà cụ đứng cạnh bé gái đeo vòng bạc có mặt dây hình trăng khuyết. Dưới ảnh là dòng chữ:\n\n‘Đừng đổi chỗ đã dành cho con.’"),
      warningPhrases: ["toa 04, ghế 18", "Đừng đổi chỗ đã dành cho con.", ...(!reunited ? ["hình trăng khuyết"] : [])],
      ...art("1F689", "Chuyến tàu cuối cùng lúc nửa đêm"),
      choices: [
        next("Theo vé, tối thì bật đèn.", 2, "Tôi giữ vé và lên toa 04.\n\n"),
        fatal("Theo nhân viên cho chắc.", "Tôi bước vào toa 05 dù tấm vé dặn không đổi chỗ. Cửa đóng sầm, dưới chân không có sàn, chỉ là khoảng tối hun hút. Tôi tử vong; cuộc đời kết thúc ở tuổi 45."),
        {
          label: "Thôi, sáng mai đi tiếp.", title: "🌅 Chờ chuyến tàu ban ngày",
          text: "Tôi rời ga an toàn và đợi đến sáng mới đi tiếp. Chuyến tàu cuối biến mất trong đêm; tôi không nhận phần thưởng đặc biệt.",
          effects: {}, confirmText: "Chờ đến sáng",
          logContent: "🚉 Năm 45 tuổi, tôi đến ga lúc nửa đêm và gặp những chỉ dẫn kỳ lạ. Tôi quyết định rời ga, chờ chuyến tàu sáng hôm sau và trở về an toàn.",
          logSummary: "Tôi rời ga an toàn, chờ chuyến tàu sáng hôm sau.",
          ...art("1F305", "Chờ trời sáng để tiếp tục hành trình"),
        },
      ],
    },
    2: {
      title: "🎫 Người soát vé thứ hai",
      text: "Toa 04 vắng tanh. Khi tàu chạy, một người soát vé đến, xin kiểm tra vé rồi bảo:\n\n‘Anh ngồi nhầm rồi. Ghế 18 ở phía sau. Để tôi giữ vé, anh đi theo.’\n\nTôi nhìn lên: ngay trên đầu mình là số 18. Trong tấm kính cửa sổ, tôi thấy bóng mình, chiếc ghế và chiếc kìm bấm vé lơ lửng — nhưng không có bóng người đang đứng trước mặt.\n\nNgười ấy vẫn cười: ‘Kính cũ nên phản chiếu sai thôi.’",
      warningPhrases: ["ngay trên đầu mình là số 18", "không có bóng người đang đứng trước mặt"],
      ...art("1F3AB", "Tấm vé và số ghế xác nhận chỗ ngồi"),
      choices: [
        next("Tôi đúng ghế, trả vé giúp.", 3, "Nụ cười tắt hẳn. Người ấy đặt vé xuống rồi lùi vào bóng tối.\n\n"),
        fatal("Chắc số ghế đổi, đi theo vậy.", "Tôi bỏ qua số 18 ngay trên đầu và bóng phản chiếu kỳ lạ, theo người soát vé qua cửa nối toa. Cánh cửa mở ra khoảng không bên ngoài đoàn tàu đang chạy. Tôi tử vong; cuộc đời kết thúc ở tuổi 45."),
      ],
    },
    3: {
      title: "🕯️ Một người quen ở sân ga",
      text: (reunited
        ? "Tàu dừng. Qua cửa kính, tôi thấy bà cụ năm xưa đứng dưới sân ga, vẫy tay:\n\n‘Xuống đây con, bà dẫn về.’\n\nTôi mừng đến mức đứng bật dậy. Nhưng bàn tay bà đang nắm một chiếc vòng có mặt dây hình ngôi sao.\n\n‘Con còn nhớ không? Chiếc vòng bà tặng bé An đấy.’\n\nTôi chợt nhớ rất rõ: trong tấm ảnh cũ, mặt dây là trăng khuyết."
        : "Tàu dừng. Qua cửa kính, tôi thấy bà cụ giống người trong tấm ảnh trên vé đứng dưới sân ga, vẫy tay:\n\n‘Xuống đây con, bà dẫn về.’\n\nTôi vừa định đứng dậy thì thấy bàn tay bà đang nắm một chiếc vòng có mặt dây hình ngôi sao.\n\n‘Con nhìn ảnh rồi chứ? Chiếc vòng bà tặng bé An đấy.’\n\nTôi cúi nhìn lại tấm ảnh trên vé: bé An đeo vòng bạc có mặt dây trăng khuyết.") +
        " Dưới sân ga, bà vẫn giục, giọng mỗi lúc một gấp.",
      warningPhrases: ["hình ngôi sao", "trăng khuyết"],
      ...art("1F319", "Trăng khuyết là manh mối để nhận ra kẻ giả mạo"),
      choices: [
        next("Vòng của cô An là trăng khuyết.", 4, "Khuôn mặt ngoài cửa kính méo đi. Tàu chuyển bánh, bóng người bị bỏ lại phía sau.\n\n"),
        fatal("Đúng bà rồi, xuống thôi!", "Tôi bước xuống dù chiếc vòng hình ngôi sao không khớp với mặt dây trăng khuyết. Sân ga biến mất, chỉ còn đường ray tối đen và ánh đèn một đoàn tàu lao tới. Tôi tử vong; cuộc đời kết thúc ở tuổi 45."),
      ],
    },
    4: {
      title: "🌅 Hai cánh cửa cuối cùng",
      text: "Khi trời gần sáng, tàu dừng lần nữa. Hai cửa cùng mở.\n\nBên trái là người thân đang gọi tôi, sau lưng họ có bảng ‘LỐI RA’. Bên phải chỉ là sân ga cũ, vắng người.\n\nTôi cúi nhìn tấm vé. Nơi đến ghi Bình An. Biển bên phải cũng là Bình An, còn chiếc đồng hồ trên sân ga đang chạy bình thường.\n\nỞ bên trái, đồng hồ cứ lặp mãi một giây. Người thân vẫn gọi đúng một câu, không thay đổi nét mặt.",
      warningPhrases: ["Nơi đến ghi Bình An", "Biển bên phải cũng là Bình An", "đồng hồ cứ lặp mãi một giây", "vẫn gọi đúng một câu"],
      ...art("1F305", "Hai cửa mở ra khi trời gần sáng"),
      choices: [
        {
          label: "Đúng ga Bình An, tôi xuống.", title: "🚉 Chuyến tàu âm giới",
          text: "Tôi bước qua cửa bên phải, xuống đúng ga Bình An. Tôi ngoảnh lại. Đường ray trống không, như chưa từng có đoàn tàu nào dừng ở đó.\n\n" +
            (reunited
              ? "Điện thoại đổ chuông. Bà An gọi, giọng lo lắng: ‘Đêm qua tôi mơ thấy mẹ dặn gọi hỏi xem cậu về đến nhà chưa.’\n\nVài ngày sau, bà mời tôi đến gặp. Đúng dịp hoàn tất việc phân chia tài sản gia đình, bà quyết định tặng thêm tôi 100.000.000 VNĐ — khoản tiền bà đã dự định từ lâu để cảm ơn người giúp mình tìm lại mẹ.\n\nTrong phong bì kèm theo có tấm ảnh căn nhà cũ. Bên khung cửa, một vệt nắng trông giống bóng người đang mỉm cười."
              : "Tôi mở lại tấm vé. Bức ảnh cũ và dòng chữ phía sau đã biến mất, chỉ còn nơi đến Bình An. Tôi giữ vé, rời sân ga và trở về nhà khi trời sáng. Tôi không biết ai đã gửi lời nhắc, nhưng hiểu rằng không phải ai gọi tên mình cũng là người đang chờ mình về."),
          effects: { intelligence: 10, happiness: 10 },
          ...(reunited ? { money: 100_000_000 } : {}),
          achievementIds: ["story-last-train"], confirmText: "Nhận thành tựu!",
          logContent: reunited
            ? "🚉 Năm 45 tuổi, tôi sống sót qua chuyến tàu âm giới nhờ những manh mối trên vé và ký ức về chiếc vòng trăng khuyết của bà An. Bà gọi hỏi thăm rồi tặng tôi 100.000.000 VNĐ để cảm ơn việc giúp bà tìm lại mẹ năm xưa. Trong tấm ảnh căn nhà cũ, vệt nắng bên cửa như một nụ cười tiễn tôi về."
            : "🚉 Năm 45 tuổi, tôi lên chuyến tàu cuối lúc nửa đêm. Tấm ảnh chiếc vòng trăng khuyết trên vé giúp tôi nhận ra kẻ giả mạo. Tôi xuống đúng ga Bình An và trở về an toàn, hiểu rằng không phải ai gọi tên mình cũng là người đang chờ mình về.",
          logSummary: `🚉 Chuyến tàu âm giới\nTrí tuệ +10 · Hạnh phúc +10${reunited ? " · Tiền +100.000.000 VNĐ" : ""}`,
          ...art("1F305", "Trở về bình an sau chuyến tàu kỳ lạ"),
        },
        fatal("Có người nhà đón mới chắc.", "Tôi bỏ qua chiếc đồng hồ lặp mãi một giây và bước sang cửa bên trái. Những bàn tay lạnh ngắt kéo tôi vào bóng tối. Tôi tử vong; cuộc đời kết thúc ở tuổi 45."),
      ],
    },
  };
  const step = steps[stepNumber];
  if (!step) return null;
  return { ...step, id: `special-last-train-${stepNumber}`, kind: "special-chain",
    priority: false, specialId: "last-train", specialStep: stepNumber,
    specialInventory: { reunited } };
}

export function createLastTrainSpecialEvent(player = {}) {
  return createLastTrainSpecialStep(1, { reunited: player.achievementFlags?.["story-reincarnation"] === true });
}
