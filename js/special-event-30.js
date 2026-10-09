const art = (code, alt) => {
  const image = new URL(`./img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;
  return { image, imageAlt: alt, imageFallback: image, imageFallbackAlt: alt };
};
const next = (label, nextStep, transitionText = "") => ({ label, nextStep, transitionText });
const ending = (label, text) => ({
  label, title: "⏰ Tỉnh giấc trên ghế", text,
  effects: {}, confirmText: "Kết thúc giấc mơ",
  logContent: `🌍 Năm 30 tuổi, tôi mơ thấy Trái Đất được rao bán trong một phiên đấu giá ngoài vũ trụ. ${text}`,
  logSummary: text,
  ...art("1F6CC", "Tỉnh giấc sau một giấc mơ kỳ lạ"),
});
const steps = {
  1: {
    title: "🛗 Thang máy đi hơi xa",
    text: "Sau một ngày mệt nhoài, tôi về nhà, ngả lưng lên ghế rồi chợt nhớ mình để quên đồ dưới sảnh. Tôi bước vào thang máy, nhấn tầng trệt.\n\nMàn hình lần lượt hiện: 1… 0… Mặt Trăng… Sao Thổ…\n\nMột giọng nói vang lên: ‘Quý khách đang đến phiên đấu giá hành tinh. Vui lòng không tựa cửa.’",
    ...art("1F680", "Chuyến đi vượt khỏi Trái Đất"),
    choices: [next("Đi lố thì đi cho biết!", 2), ending("Cho tôi xuống, còn đồ chưa phơi!", "Cửa mở ngay trước nhà. Tôi bước ra, tỉnh giấc trên ghế. Thang máy đi đến phiên đấu giá hành tinh hóa ra chỉ là một giấc mơ.")],
  },
  2: {
    title: "🌍 Món hàng quen quen",
    text: "Cửa thang máy mở ra giữa một hội trường đầy sinh vật kỳ lạ. Một con sứa mặc vest đưa tôi bảng đấu giá. Trên sân khấu là quả cầu xanh quen thuộc.\n\n‘Lô số 030: Trái Đất. Có biển, có rừng, cư dân hơi ồn. Chủ mới có thể cải tạo thành bãi đỗ tàu.’\n\nTôi nhìn kỹ. Đúng khu nhà mình đang nằm dưới ngón tay người dẫn chương trình.",
    ...art("1F30D", "Trái Đất trở thành món hàng trong giấc mơ"),
    choices: [next("Khoan! Nhà tôi còn trong đó!", 3), ending("Chắc chương trình văn nghệ thôi.", "Tôi ngồi xem đến lúc tiếng búa hóa thành tiếng báo thức. Tôi tỉnh giấc trên ghế; phiên đấu giá chỉ là giấc mơ.")],
  },
  3: {
    title: "👽 Đại diện bất đắc dĩ",
    text: "Cả hội trường quay lại. Một thực thể có đôi mắt như hai dải ngân hà bước tới.\n\n‘Bạn là cư dân Trái Đất? Tốt. Hãy chứng minh nơi đó đáng giữ lại.’\n\nTôi hỏi sao không gọi người có chức có quyền. Nó nhìn tờ danh sách:\n\n‘Chúng tôi bấm chuông nhiều nơi rồi. Chỉ có bạn đi xuống.’",
    ...art("1F30C", "Cuộc gặp với thực thể có đôi mắt như dải ngân hà"),
    choices: [next("Được, cho tôi nói vài câu.", 4), ending("Tôi mới ba mươi, giao gì căng vậy!", "Tôi xin rút lui, bước qua cửa thoát hiểm và tỉnh dậy trên ghế. Cuộc gặp gỡ kỳ lạ chỉ diễn ra trong giấc mơ.")],
  },
  4: {
    title: "🍲 Thứ đáng giá nhất",
    text: "Thực thể đưa tôi đến một căn phòng có thể lấy ra bất cứ thứ gì từ ký ức. Tôi được chọn một món để trình bày trước hội đồng.\n\n‘Chọn cẩn thận. Chúng tôi đã thấy rất nhiều vàng và kim cương.’",
    ...art("1F373", "Bữa cơm và những ký ức đáng quý"),
    choices: [
      next("Một mâm cơm có đủ người.", 5, "Một bàn ăn hiện ra, có tiếng gọi nhau kéo ghế.\n\n"),
      next("Chiếc áo mưa từng được cho.", 5, "Tôi kể về người lạ đã giúp mình giữa cơn mưa.\n\n"),
      ending("Mang cả núi vàng lên luôn!", "Hội đồng chỉ sang thùng chặn cửa bằng vàng của họ. Tôi hết giờ trình bày rồi tỉnh giấc trên ghế. Núi vàng và phiên đấu giá đều chỉ là giấc mơ."),
    ],
  },
  5: {
    title: "⚖️ Nhưng con người đâu chỉ tốt?",
    text: "Thực thể nhìn món đồ tôi chọn rồi mở một màn hình lớn. Trên đó có những dòng sông đầy rác, những cuộc cãi vã và người đi ngang qua một người đang cần giúp.\n\n‘Nếu biết yêu thương, tại sao các bạn vẫn làm những chuyện này?’\n\nTôi định cãi, nhưng chợt nhận ra trong một hình ảnh có chính mình — đang vội bỏ đi vì nghĩ sẽ có người khác giúp.",
    ...art("1F50D", "Nhìn lại sự thờ ơ của chính mình"),
    choices: [
      next("Đúng. Có lúc tôi cũng thờ ơ.", 6, "Tôi thừa nhận và xin cơ hội sửa đổi.\n\n"),
      next("Chúng tôi chưa tốt, nhưng có thể học.", 6, "Tôi kể về những lần con người nhận lỗi và làm lại.\n\n"),
      ending("Toàn người khác, tôi có làm đâu!", "Màn hình phóng to mặt tôi. Tôi xấu hổ đến mức giật mình tỉnh dậy trên ghế. Hội đồng chỉ có trong mơ, nhưng sự thờ ơ ấy khiến tôi nghĩ ngợi."),
    ],
  },
  6: {
    title: "🎫 Một vé dành riêng cho tôi",
    text: "Hội đồng tạm ngừng phiên đấu giá. Thực thể kéo tôi sang một bên, đưa ra tấm vé:\n\n‘Bạn có thể đến một hành tinh khác. Nhà ở, thức ăn, một cuộc sống thoải mái. Nhưng chỉ có một chỗ.’\n\nTôi hỏi còn những người ở nhà thì sao.\n\nNó không trả lời, chỉ đặt tấm vé vào tay tôi.",
    ...art("1F3AB", "Một tấm vé chỉ dành cho một người"),
    choices: [
      next("Một chỗ thì tôi không đi.", 7, "Tôi trả vé, quay về hội trường.\n\n"),
      next("Có cách nào giữ mọi người lại?", 7, "Tôi xin tiếp tục trình bày.\n\n"),
      ending("Cho tôi đi trước vậy…", "Tôi bước qua cổng, nghe tiếng người thân gọi phía sau rồi tỉnh giấc trên ghế. Không có vé đi hành tinh khác; tất cả chỉ là một giấc mơ."),
    ],
  },
  7: {
    title: "⏰ Phán quyết cuối cùng",
    text: "Tôi trở lại trước hội đồng, tay không.\n\nTôi chẳng nghĩ ra bài diễn văn nào hay ho, chỉ nói: ‘Tôi chưa biết làm sao cứu cả hành tinh. Nhưng nếu được về, tôi sẽ bắt đầu bằng những chuyện mình làm được.’\n\nThực thể nhìn tôi một lúc, rồi hạ chiếc búa xuống.\n\nBíp. Bíp. Bíp.\n\nTôi bật dậy trên ghế. Điện thoại đang báo thức. Tivi vẫn phát bộ phim khoa học viễn tưởng tôi xem dở. Tấm bảng đấu giá trong tay hóa ra là chiếc điều khiển.\n\nTất cả chỉ là một giấc mơ. Không có phiên đấu giá, không có vé đi hành tinh khác. Ngoài cửa sổ, người hàng xóm lớn tuổi đang loay hoay nhặt túi đồ vừa rơi.",
    ...art("1F4F1", "Tiếng báo thức đưa tôi trở về đời thường"),
    choices: [
      {
        label: "Ra phụ bác một tay đã!", title: "👽 Thực thể ngoài vũ trụ",
        text: "Tôi đứng dậy giúp bác hàng xóm nhặt và xách đồ lên nhà. Trong túi có cả đơn hàng cam bác vừa chuẩn bị giao, may mà không quả nào bị dập. Bác cười: ‘May có cháu, bác còn kịp giao hàng. Cầm chút tiền uống nước nhé!’ Bác tặng tôi hai quả cam cùng 500.000 VNĐ để cảm ơn. Tôi không cứu thế giới trong mơ, nhưng đã làm một việc tốt khi thức dậy.",
        effects: { intelligence: 10, happiness: 10 }, achievementIds: ["story-alien"],
        money: 500_000,
        confirmText: "Nhận thành tựu!",
        logContent: "🌍 Năm 30 tuổi, tôi mơ thấy mình phải bảo vệ Trái Đất trong một phiên đấu giá ngoài vũ trụ. Tỉnh dậy, tôi xuống giúp bác hàng xóm nhặt và xách đồ, giữ được đơn hàng cam bác sắp giao. Bác tặng tôi hai quả cam cùng 500.000 VNĐ để cảm ơn — phần thưởng có vẻ nhỏ, nhưng ít nhất là hàng thật.",
        logSummary: "👽 Thực thể ngoài vũ trụ\nTrí tuệ +10 · Hạnh phúc +10 · Tiền +500.000 VNĐ",
        ...art("1F91D", "Giúp bác hàng xóm xách đồ khi thức dậy"),
      },
      ending("Nằm thêm chút… rồi tính.", "Tôi nằm xuống ngủ tiếp. Phiên đấu giá Trái Đất chỉ là giấc mơ, và tôi để lỡ cơ hội giúp bác hàng xóm."),
    ],
  },
};

export function createEarthAuctionSpecialStep(stepNumber) {
  const step = steps[stepNumber];
  if (!step) return null;
  return { ...step, id: `special-earth-auction-${stepNumber}`, kind: "special-chain",
    priority: false, specialId: "earth-auction", specialStep: stepNumber };
}
export const earthAuctionSpecialEvent = createEarthAuctionSpecialStep(1);
