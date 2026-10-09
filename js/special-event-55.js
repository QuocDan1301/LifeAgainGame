const art = (code, alt) => {
  const image = new URL(`./img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;
  return { image, imageAlt: alt, imageFallback: image, imageFallbackAlt: alt };
};
const next = (label, nextStep, transitionText = "") => ({ label, nextStep, transitionText });
const accident = (label, text) => ({
  label, title: "🧳 Một lần tin nhầm", text: `${text}\nTai nạn làm giảm 40 điểm sức khỏe, nhưng sức khỏe luôn còn ít nhất 1 điểm. Chuỗi kết thúc, tôi không nhận thưởng đặc biệt.`,
  effects: { health: -40 }, minimumHealth: 1, nonFatal: true,
  confirmText: "Kết thúc chuyện chiếc vali",
  logContent: `🧳 Năm 55 tuổi, một lần lấy nhầm vali dẫn tôi vào màn giả danh. ${text} Tôi bị thương, nhưng sống sót; chuỗi kết thúc mà không nhận thưởng đặc biệt.`,
  ...art("1F9F3", "Tai nạn nhẹ sau khi tin nhầm người nhận vali"),
});
const diary = "🧳 Năm 55 tuổi, một lần lấy nhầm vali khiến tôi vướng vào màn nhận chủ giả. Nhờ kiểm tra từng manh mối, tôi trả lại được món kỷ vật quý và nhận khoản tiền cảm ơn lớn. Từ đó, vali của tôi có thêm dòng chữ: ‘BÊN TRONG CHỈ CÓ BÁNH TRÁNG.’";
const success = (label, money, happiness, text) => ({
  label, title: "🧳 Tỉnh táo tuổi năm mươi lăm", text, money,
  effects: { happiness }, achievementIds: ["story-luggage"], confirmText: "Nhận thành tựu!",
  logContent: diary,
  logSummary: `${diary}\nHạnh phúc +${happiness} · Tiền +${money.toLocaleString("vi-VN")} VNĐ`,
  ...art("1F3B5", "Chiếc hộp nhạc được trả lại đúng người chủ"),
});
const steps = {
  1: {
    title: "🧳 Đúng vali, sai mật khẩu",
    text: "Sau chuyến xe về quê, tôi lấy chiếc vali xanh ở khoang hành lý. Về đến nhà, mã khóa quen thuộc không mở được.\n\nTôi nhìn kỹ: cũng chiếc khăn đỏ buộc ở quai, nhưng thẻ hành lý ghi Nguyễn Minh Sơn, trong khi vali của tôi có vết xước dài cạnh bánh xe. Chiếc này không có.\n\nĐiện thoại reo. Một người tự xưng nhân viên nhà xe bảo tôi mang vali đến bãi đất sau bến để đổi ngay, ‘khỏi mất công làm giấy tờ’.",
    warningPhrases: ["Nguyễn Minh Sơn", "vết xước dài cạnh bánh xe. Chiếc này không có", "bãi đất sau bến"],
    ...art("1F9F3", "Chiếc vali xanh không có vết xước quen thuộc"),
    choices: [
      next("Gọi số trên vé xe xác nhận đã.", 2, "Nhà xe xác nhận có người lấy nhầm, nhưng chưa cử ai gọi cho tôi. Họ hẹn đổi tại quầy hành lý và nhắn: ‘Đổi tại quầy số 2, đọc mã 731 để nhân viên kiểm tra.’\n\n"),
      accident("Họ biết vụ vali, chắc đúng rồi.", "Tôi đến điểm hẹn giả, bị kẻ gian giật vali rồi xô ngã."),
    ],
  },
  2: {
    title: "🪪 Người đón ở cổng",
    text: "Tại bến, một người đeo thẻ ‘Hỗ trợ hành khách’ tiến đến, đọc đúng tên tôi và số điện thoại.\n\n‘Quầy đang đông, bác giao vali đây, cháu xử lý riêng cho nhanh.’\n\nTôi suýt đưa thì nhớ lúc xác nhận, nhà xe đã nhắn: ‘Đổi tại quầy số 2, đọc mã 731 để nhân viên kiểm tra.’\n\nTôi hỏi mã. Người ấy đáp: ‘Mã đó hết hạn rồi bác, tên với số điện thoại đúng là được!’",
    warningPhrases: ["quầy số 2", "mã 731", "Mã đó hết hạn rồi"],
    ...art("1FAAA", "Thẻ nhân viên chưa đủ để xác nhận người hỗ trợ"),
    choices: [
      next("Tôi vào quầy số 2 cho đủ thủ tục.", 3, "Nhân viên tại quầy đối chiếu đúng mã 731.\n\n"),
      accident("Biết cả thông tin tôi thì tin được.", "Người giả danh dẫn tôi qua lối đang sửa chữa để tránh quầy chính. Khi hắn bỏ chạy cùng vali, tôi bước hụt xuống rãnh công trình."),
    ],
  },
  3: {
    title: "🔍 Chủ thật hay người nhớ giỏi?",
    text: "Nhà xe mời hai người đang cùng nhận là chủ vali đến làm rõ.\n\nNgười thứ nhất nói vanh vách: ‘Vali xanh, khăn đỏ, thẻ tên Nguyễn Minh Sơn!’ — toàn những thứ nhìn được từ bên ngoài.\n\nNgười thứ hai nói: ‘Bên trong có một hộp nhạc bị gãy chân và tấm ảnh mẹ tôi mặc áo tím.’\n\nNhân viên mở vali theo quy trình xác minh. Cả hộp nhạc lẫn bức ảnh đều đúng, nhưng người thứ nhất lập tức đưa ra ảnh một chiếc vali tương tự trên điện thoại và giục tôi ra xe lấy tiền cảm ơn.",
    warningPhrases: ["toàn những thứ nhìn được từ bên ngoài", "hộp nhạc bị gãy chân", "mẹ tôi mặc áo tím", "Cả hộp nhạc lẫn bức ảnh đều đúng"],
    ...art("1F50D", "Đối chiếu kỷ vật bên trong để xác nhận chủ thật"),
    choices: [
      next("Để nhà xe đối chiếu rồi bàn giao.", 4, "Tôi ở lại quầy. Giấy tờ và những đặc điểm riêng tiếp tục xác nhận người thứ hai là chủ thật.\n\n"),
      accident("Có ảnh chụp vali thì chắc là chủ.", "Tôi theo người thứ nhất ra ngoài. Khi bị nhân viên gọi quay lại, hắn xô tôi vào dãy xe đẩy rồi chạy mất."),
    ],
  },
  4: {
    title: "🎼 Thứ quý nhất trong vali",
    text: "Chủ thật mở chiếc hộp nhạc. Giai điệu vang lên chập chờn, còn ông thì bật khóc.\n\nĐó là món quà cuối cùng mẹ tặng ông. Ông đã mang nó đi sửa nhiều nơi, lần này mới tìm được người nhận sửa. Chiếc vali còn chứa giấy tờ quan trọng phục vụ một dự án của doanh nghiệp ông.\n\nNhận lại đồ, ông ngỏ ý tặng tôi 150.000.000 VNĐ để cảm ơn vì đã giữ và bàn giao cẩn thận.\n\nTôi nhìn chiếc hộp nhạc rồi nhìn vali mình vừa được trả lại. Trong đó chỉ có quần áo và hai bịch bánh tráng — thế mà làm cả buổi muốn lên huyết áp.",
    ...art("1F3B5", "Giai điệu của món quà người mẹ để lại"),
    choices: [
      success("Tôi xin nhận, chúc ông sửa được hộp nhạc.", 150_000_000, 10, "Tôi nhận 150.000.000 VNĐ và chúc ông sửa được hộp nhạc. Vali của tôi được trả lại nguyên vẹn, kể cả hai bịch bánh tráng. Từ nay tôi sẽ kiểm tra kỹ hơn trước khi nhận đồ."),
      success("Tôi nhận một phần, còn lại xin giúp người khó khăn.", 100_000_000, 15, "Tôi nhận 100.000.000 VNĐ; 50.000.000 VNĐ còn lại được ông góp thiện nguyện. Chiếc hộp nhạc trở về đúng người, còn vali của tôi có thêm dòng chữ: ‘BÊN TRONG CHỈ CÓ BÁNH TRÁNG.’"),
    ],
  },
};

export function createLuggageSpecialStep(stepNumber) {
  const step = steps[stepNumber];
  if (!step) return null;
  return { ...step, id: `special-luggage-${stepNumber}`, kind: "special-chain",
    priority: false, specialId: "luggage", specialStep: stepNumber };
}
export const luggageSpecialEvent = createLuggageSpecialStep(1);
