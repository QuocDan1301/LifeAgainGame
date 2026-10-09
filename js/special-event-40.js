const art = (code, alt) => {
  const image = new URL(`./img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;
  return { image, imageAlt: alt, imageFallback: image, imageFallbackAlt: alt };
};
const next = (label, nextStep, transitionText = "") => ({ label, nextStep, transitionText });
const ending = (label, text) => ({
  label, title: "🏚️ Rời căn nhà cũ", text, effects: {},
  confirmText: "Tiếp tục cuộc đời",
  logContent: `🏚️ Năm 40 tuổi, tôi gặp một bà cụ kỳ lạ trong căn nhà cũ trên đường về quê. ${text}`,
  logSummary: text, ...art("1F3DA", "Căn nhà cũ và lời hẹn chưa trọn vẹn"),
});
const diary = "🕯️ Năm 40 tuổi, tôi giúp một người mẹ gửi những lá thư đến đứa con thất lạc. Tôi được nhận một khoản tiền lớn, nhưng điều nhớ rõ nhất vẫn là nụ cười của bà bên khung cửa chiều hôm ấy.";
const success = (label, money, happiness, text) => ({
  label, title: "🕯️ Lời hẹn âm dương", text, money,
  effects: { happiness }, achievementIds: ["story-reincarnation"],
  confirmText: "Nhận thành tựu!", logContent: diary,
  logSummary: `${diary}\nHạnh phúc +${happiness} · Tiền +${money.toLocaleString("vi-VN")} VNĐ`,
  ...art("1F56F", "Cuộc đoàn tụ dưới mái nhà cũ"),
});
const steps = {
  1: {
    title: "🏚️ Căn nhà gọi tên tôi",
    text: "Trên đường về quê, xe tôi chết máy giữa cơn mưa. Tôi ghé mái hiên một căn nhà cũ trú tạm. Điện thoại hết sóng, xung quanh không có nhà nào còn sáng đèn.\n\nBỗng bên trong vang lên tiếng một bà cụ:\n\n‘Vào đi con. Đứng ngoài đó ướt hết.’\n\nTôi vừa định đáp thì bà gọi đúng tên mình.",
    ...art("1F3DA", "Căn nhà cũ giữa cơn mưa"),
    choices: [
      next("Dạ… mà sao bà biết tên con?", 2, "Tôi bước vào hỏi chuyện.\n\n"),
      ending("Biết tên càng phải chạy!", "Tôi quay ra đường chờ xe qua. Khi ngoảnh lại, căn nhà tối om. Tôi rời đi mà chưa biết vì sao bà cụ biết tên mình."),
    ],
  },
  2: {
    title: "🍵 Hai chén trà, một người khách",
    text: "Bà cụ ngồi cạnh bàn gỗ, trước mặt là hai chén trà. Bà bảo đã đợi người đến giúp từ lâu.\n\nKhi tôi cúi xuống đặt ba lô, ánh chớp lóe lên. Trên tường chỉ có bóng của tôi.\n\nBà nhận ra ánh mắt ấy, khẽ nói: ‘Đừng sợ. Bà chỉ muốn nhờ con gửi lại một món đồ.’",
    ...art("1F375", "Chén trà trên chiếc bàn gỗ"),
    choices: [
      next("Bà cứ nói, con nghe.", 3),
      ending("Con nhớ ra có việc gấp!", "Tôi xin phép rời đi. Bà không giữ lại, chỉ nhìn chén trà còn nguyên. Lời nhờ gửi món đồ chưa kịp được nói hết."),
    ],
  },
  3: {
    title: "📷 Đứa trẻ trong bức ảnh",
    text: "Bà đưa tôi tấm ảnh một bé gái đeo vòng bạc, mặt dây hình trăng khuyết.\n\n‘Con gái bà, tên An. Hai mẹ con lạc nhau trong một trận lũ. Bà đợi mãi… chưa kịp gặp lại.’\n\nBà nhờ tôi lấy chiếc hộp ở căn phòng cuối hành lang. Trong đó có những thứ giúp tìm cô bé.\n\nNhưng khi đến cửa phòng, tôi nghe tiếng trẻ con bên trong: ‘Đừng tin bà ấy…’",
    ...art("1F4F8", "Tấm ảnh bé An đeo vòng bạc hình trăng khuyết"),
    choices: [
      next("Hỏi bà rõ chuyện đã.", 4, "Bà giải thích căn nhà thường vọng lại những âm thanh cũ; dặn tôi tìm chiếc hộp khắc tên An.\n\n"),
      ending("Thôi, chuyện này con chịu!", "Tôi quay ra. Bà gật đầu, cánh cửa chính tự mở. Tôi chưa đủ can đảm tìm hiểu câu chuyện của hai mẹ con."),
    ],
  },
  4: {
    title: "🪞 Người trong gương",
    text: "Căn phòng phủ bụi, riêng chiếc gương vẫn sáng rõ. Trong gương, một bé gái đang ngồi ôm chiếc hộp. Tôi quay lại — chiếc ghế phía sau hoàn toàn trống.\n\nCô bé chỉ xuống gầm giường rồi mấp máy môi: ‘Mang cho mẹ…’\n\nTôi cúi xuống, thấy chiếc hộp gỗ khắc chữ An. Bên cạnh là một hộp trang sức đang hé mở, ánh vàng lấp lánh.",
    ...art("1FA9E", "Hình bóng cô bé trong chiếc gương"),
    choices: [
      next("Lấy đúng hộp bà nhờ thôi.", 5, "Tôi mang chiếc hộp gỗ khắc tên An ra.\n\n"),
      ending("Lấy thêm chút chắc không sao…", "Vừa chạm vào trang sức, tôi nghe giọng bà: ‘Thứ không phải của mình, con ạ.’ Tôi giật mình chạy ra; khi quay lại, cửa đã khóa. Tôi không mang theo được món trang sức nào."),
    ],
  },
  5: {
    title: "✉️ Lá thư chưa được mở",
    text: "Trong hộp là giấy tờ cũ và những lá thư bà viết cho con qua từng năm. Lá cuối chỉ có một câu:\n\n‘Nếu con còn sống, đừng nghĩ mẹ đã bỏ con.’\n\nDưới đáy hộp có một phong thư gửi đến từ mái ấm, vẫn chưa bóc. Ngày gửi muộn hơn ngày mất ghi trên di ảnh của bà ở góc phòng.\n\nTôi mở thư: cô bé đã được cứu, sau đó được một gia đình nhận nuôi. Bức thư có tên mái ấm và thông tin liên hệ.\n\nBà nhìn tôi, đôi tay run run: ‘Vậy là con bà còn sống?’",
    ...art("1F48C", "Những lá thư người mẹ viết cho đứa con thất lạc"),
    choices: [
      next("Con sẽ tìm cô ấy cho bà.", 6, "Tôi nhận giữ hộp thư và quyết định lần theo thông tin từ mái ấm.\n\n"),
      ending("Để con gửi đồ cho bên tìm thân nhân.", "Tôi bàn giao manh mối cho bên tìm thân nhân nhưng không tiếp tục tham gia. Câu chuyện của hai mẹ con vẫn còn chờ một cuộc đoàn tụ; tôi không nhận thưởng đặc biệt."),
    ],
  },
  6: {
    title: "🌙 Người con gái đã lớn",
    text: "Sau nhiều ngày lần theo hồ sơ mái ấm, tôi tìm được bà An — giờ đã lớn tuổi và đang điều hành một doanh nghiệp.\n\nNghe câu chuyện, bà nghi tôi lừa đảo. Nhưng khi nhìn thấy tấm ảnh, bà lặng người, lấy từ trong cổ áo ra chiếc vòng bạc có mặt trăng khuyết.\n\n‘Tôi cứ nghĩ mẹ không đi tìm mình…’\n\nTôi đưa bà đọc những lá thư. Bà đọc rất chậm, rồi hỏi liệu tôi có thể dẫn bà về căn nhà cũ không.",
    ...art("1F319", "Chiếc vòng bạc hình trăng khuyết nối lại ký ức"),
    choices: [
      next("Mình về thôi, bà vẫn đang đợi.", 7),
      ending("Để tôi giao đồ, bà tự về nhé.", "Bà An cảm ơn và nhận lại kỷ vật. Tôi không chứng kiến cuộc đoàn tụ; câu chuyện của tôi dừng ở đây, chưa mở khóa thành tựu và không nhận thưởng đặc biệt."),
    ],
  },
  7: {
    title: "🕯️ Lời hẹn cuối cùng",
    text: "Tôi đưa bà An trở lại vào buổi chiều. Căn nhà giờ chỉ còn mái ngói sụp một góc và chiếc bàn gỗ phủ bụi.\n\nBà đặt những lá thư xuống, nghẹn ngào:\n\n‘Mẹ ơi, con về rồi.’\n\nMột làn gió nhẹ thổi qua. Trong khoảnh khắc, tôi thấy bà cụ đứng bên cửa, mỉm cười như lần đầu gặp. Bà đưa tay vuốt tóc con gái, rồi bóng dáng dần tan trong nắng.\n\nBà An khẽ nhắm mắt: ‘Mùi dầu gió của mẹ… Tôi vẫn nhớ.’\n\nVài tuần sau, bà cho sửa lại căn nhà thành nơi hương khói và trao tôi 200.000.000 VNĐ từ tiền cá nhân để cảm ơn. Bà cũng quyết định hỗ trợ mái ấm từng cưu mang mình.",
    ...art("1F56F", "Lời hẹn được hoàn thành trong nắng chiều"),
    choices: [
      success("Con xin nhận, để lo cho gia đình.", 200_000_000, 15, "Tôi nhận 200.000.000 VNĐ để lo cho gia đình. Bà An tiếp tục hỗ trợ mái ấm từng cưu mang mình. Điều tôi nhớ nhất vẫn là nụ cười của người mẹ bên khung cửa chiều hôm ấy."),
      success("Con nhận một nửa, còn lại giúp mái ấm.", 100_000_000, 20, "Tôi nhận 100.000.000 VNĐ. Phần còn lại góp thêm cho mái ấm, bên cạnh khoản hỗ trợ bà An đã quyết định. Một lời hẹn được trọn vẹn và sự giúp đỡ tiếp tục đến với những người khác."),
    ],
  },
};

export function createOldHouseSpecialStep(stepNumber) {
  const step = steps[stepNumber];
  if (!step) return null;
  return { ...step, id: `special-old-house-${stepNumber}`, kind: "special-chain",
    priority: false, specialId: "old-house", specialStep: stepNumber };
}
export const oldHouseSpecialEvent = createOldHouseSpecialStep(1);
