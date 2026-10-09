const art = (code, alt) => {
  const image = new URL(`./img/events/openmoji/color/svg/${code}.svg`, import.meta.url).href;
  return { image, imageAlt: alt, imageFallback: image, imageFallbackAlt: alt };
};
const next = (label, nextStep, transitionText = "") => ({ label, nextStep, transitionText });
const ending = (label, text) => ({
  label, title: "🎭 Rời rạp an toàn", text, effects: {}, confirmText: "Tiếp tục cuộc đời",
  logContent: `🎭 Năm 50 tuổi, tôi gặp một vụ cháy khi xem biểu diễn tại trung tâm thiếu nhi. ${text}`,
  logSummary: text, ...art("1F3AD", "Buổi biểu diễn kết thúc bằng cuộc sơ tán"),
});
const diary = "🏅 Năm 50 tuổi, tôi được vinh danh sau một vụ cháy tại nhà hát. Tiền thưởng giúp gia đình bớt lo, còn bức tranh của bé Mai được tôi treo ngay phòng khách. Khách đến hỏi, tôi kể hơi lâu — chuyện này chắc đủ kể đến tám mươi tuổi.";
const success = (label, opening) => ({
  label, title: "🏅 Vinh danh người hùng",
  text: `${opening}\n\nTôi nhận bằng vinh danh và 100.000.000 VNĐ tiền thưởng từ quỹ của đơn vị tổ chức. Bé Mai chạy lên tặng tôi một bức tranh. Trong tranh, tôi đứng cạnh rất nhiều người, phía trên là dòng chữ nắn nót: ‘Cảm ơn mọi người đã đưa con về với mẹ.’`,
  money: 100_000_000, effects: { happiness: 15, intelligence: 5 },
  achievementIds: ["story-hero"], confirmText: "Nhận thành tựu!",
  keepsake: { id: "hero-certificate", name: "Bằng vinh danh người hùng",
    description: "Kỷ niệm về việc bình tĩnh phối hợp giúp mọi người thoát khỏi vụ cháy nhà hát." },
  logContent: diary,
  logSummary: "🏅 Vinh danh người hùng\nHạnh phúc +15 · Trí tuệ +5 · Tiền +100.000.000 VNĐ\nNhận vật phẩm: Bằng vinh danh người hùng.",
  ...art("1F3C5", "Bằng vinh danh và bức tranh của bé Mai"),
});
const steps = {
  1: {
    title: "🎭 Buổi diễn cuối tuần",
    text: "Ở tuổi 50, tôi được mời đến xem buổi biểu diễn gây quỹ của một trung tâm thiếu nhi. Tiết mục vừa bắt đầu thì tôi ngửi thấy mùi khét, kèm một làn khói mỏng gần cửa phòng kỹ thuật.\n\nNgười bên cạnh vẫn chăm chú quay phim: ‘Chắc hiệu ứng sân khấu đó anh.’\n\nNhưng trên sân khấu, mấy đứa trẻ đang đọc thơ về quê hương. Có vẻ tiết mục này chẳng cần khói.",
    warningPhrases: ["mùi khét", "làn khói mỏng gần cửa phòng kỹ thuật", "đang đọc thơ về quê hương"],
    ...art("1F3AD", "Khói xuất hiện trong buổi biểu diễn thiếu nhi"),
    choices: [
      next("Báo nhân viên kiểm tra ngay.", 2, "Nhân viên phát hiện cháy và kích hoạt báo động.\n\n"),
      ending("Chắc hiệu ứng, ngồi xem tiếp.", "Một người khác phát hiện và báo cháy. Tôi sơ tán cùng khán giả và ra ngoài an toàn. Chuỗi kết thúc, chưa nhận thành tựu đặc biệt."),
    ],
  },
  2: {
    title: "🚪 Ai cũng muốn ra trước",
    text: "Tiếng báo động vang lên. Khán giả đứng bật dậy, nhiều người dồn về cửa chính. Một chiếc ghế bị xô đổ, tiếng trẻ khóc hòa lẫn tiếng gọi nhau.\n\nNhân viên mở lối thoát hiểm bên hông và hô lớn, nhưng ít người nghe thấy. Tôi đang đứng ngay gần đó.",
    warningPhrases: ["lối thoát hiểm bên hông"],
    ...art("1F6AA", "Lối thoát hiểm được nhân viên mở bên hông"),
    choices: [
      next("Lối bên này đang mở, đi chậm thôi!", 3, "Tôi giúp truyền lời và hướng mọi người theo chỉ dẫn của nhân viên.\n\n"),
      ending("Hét thật to: chạy đi!", "Đám đông càng hoảng. Tôi bị cuốn theo dòng người ra ngoài, rồi đến nơi an toàn. Chuỗi kết thúc, không nhận phần thưởng đặc biệt."),
      ending("Ra ngoài trước cho chắc.", "Tôi thoát ra an toàn và chờ tại khu tập kết. Tôi chưa hoàn thành chuỗi để nhận thành tựu đặc biệt."),
    ],
  },
  3: {
    title: "🧒 Bàn tay níu lấy áo",
    text: "Trên đường ra, một bé trai níu áo tôi, nức nở: ‘Bà con chưa ra được!’\n\nCách đó vài bước, bà của em đang ngồi trên ghế, chiếc gậy rơi dưới chân. Bà cố đứng lên nhưng không vững. Một nhân viên đang tiến đến giúp.",
    ...art("1F91D", "Phối hợp với nhân viên hỗ trợ hai bà cháu"),
    choices: [
      next("Tôi phụ anh, đưa bà ra cùng.", 4, "Tôi phối hợp với nhân viên hỗ trợ bà, giữ em bé đi sát bên.\n\n"),
      ending("Con ra trước, bà có người lo.", "Tôi đưa em bé đến khu tập kết; nhân viên hỗ trợ bà ra sau. Hai bà cháu an toàn, chuỗi kết thúc, chưa nhận thành tựu đặc biệt."),
    ],
  },
  4: {
    title: "📋 Một người chưa được điểm danh",
    text: "Ngoài sân, giáo viên đang điểm danh đội biểu diễn. Một cô đếm đi đếm lại rồi tái mặt: còn thiếu bé Mai.\n\nCó người nói đã thấy em chạy ra. Nhưng bé trai bên cạnh tôi lắc đầu: ‘Lúc báo động, bạn ấy quay lại phòng hóa trang tìm em.’\n\nTôi nhớ đã nhìn thấy tên phòng đó trên sơ đồ gần cửa.",
    warningPhrases: ["còn thiếu bé Mai", "phòng hóa trang"],
    ...art("1F4CB", "Điểm danh và xác định vị trí cuối cùng được kể lại"),
    choices: [
      next("Báo cứu hỏa ngay vị trí cuối.", 5, "Tôi chuyển thông tin cho đội cứu hỏa vừa đến, nói rõ đây là lời kể chưa được xác nhận.\n\n"),
      ending("Tôi nhớ đường, để tôi quay vào!", "Lính cứu hỏa chặn tôi lại trước khu vực nguy hiểm. Tôi được đưa ra chỗ an toàn, chuỗi kết thúc. Đội cứu hỏa tiếp tục tìm người bị thiếu."),
    ],
  },
  5: {
    title: "🗺️ Cánh cửa bị che khuất",
    text: "Người quản lý đưa sơ đồ tòa nhà cho đội cứu hỏa, nhưng bản vẽ chưa cập nhật phần sân khấu vừa sửa. Tôi nhớ lúc đến đã thấy nhân viên chuyển đạo cụ qua một cửa ở phía sau.\n\nChỉ huy hỏi liệu tôi có biết chính xác cửa nào không.",
    warningPhrases: ["bản vẽ chưa cập nhật", "một cửa ở phía sau"],
    ...art("1F5FA", "Đối chiếu sơ đồ với vị trí cửa đã quan sát"),
    choices: [
      next("Tôi chỉ từ đây, đoạn khác không rõ.", 6, "Tôi chỉ vị trí từ khu vực an toàn, giúp đội cứu hỏa đối chiếu và tìm lối tiếp cận.\n\n"),
      ending("Chắc cửa nào cũng thông thôi.", "Đội cứu hỏa phải tự xác minh lại. Tôi được yêu cầu lùi ra khu vực an toàn; chuỗi kết thúc, chưa nhận thành tựu đặc biệt."),
    ],
  },
  6: {
    title: "🚑 Nhường một khoảng trống",
    text: "Đội cứu hỏa đưa bé Mai ra ngoài. Em được bàn giao ngay cho nhân viên y tế, nhưng đám đông và điện thoại đang chắn lối xe cấp cứu.\n\nNgười mẹ bật khóc, cố chen vào. Một người khác giơ máy sát mặt em để quay.",
    warningPhrases: ["đang chắn lối xe cấp cứu"],
    ...art("1F691", "Giữ lối đi thông thoáng cho nhân viên y tế"),
    choices: [
      next("Cất máy, nhường đường giúp tôi!", 7, "Tôi cùng nhân viên giữ lối đi thông thoáng và đưa người mẹ đến chỗ y tế hướng dẫn.\n\n"),
      ending("Quay lại làm bằng chứng đã.", "Tôi góp phần làm lối đi thêm chật, bị nhắc lùi ra. Em bé vẫn được hỗ trợ, nhưng chuỗi thành tựu kết thúc."),
    ],
  },
  7: {
    title: "🏅 Người hùng không đứng một mình",
    text: "Vài tuần sau, trung tâm tổ chức buổi cảm ơn những người đã giúp đỡ trong vụ cháy. Bé Mai đã hồi phục, hai bà cháu hôm ấy cũng có mặt.\n\nTôi được mời lên nhận bằng vinh danh và 100.000.000 VNĐ tiền thưởng từ quỹ của đơn vị tổ chức.\n\nNgười dẫn chương trình hỏi: ‘Điều gì khiến anh quyết định giúp mọi người?’\n\nNhìn xuống hàng ghế có những người lính cứu hỏa, nhân viên nhà hát và các cô giáo, tôi cầm micro. Lần này tay còn run hơn hôm nghe báo động.",
    ...art("1F3C5", "Vinh danh những người cùng giúp khán giả thoát nạn"),
    choices: [
      success("Mỗi người giúp một tay thôi.", "Tôi cảm ơn những người đã cùng phối hợp. Tôi đã làm phần việc của mình, để mọi người được trở về."),
      success("Năm mươi tuổi, còn giúp được là mừng!", "Cả hội trường bật cười rồi vỗ tay. Tôi nhắc rằng cuộc sơ tán an toàn là nhờ rất nhiều người cùng phối hợp."),
    ],
  },
};

export function createTheaterSpecialStep(stepNumber) {
  const step = steps[stepNumber];
  if (!step) return null;
  return { ...step, id: `special-theater-${stepNumber}`, kind: "special-chain",
    priority: false, specialId: "theater", specialStep: stepNumber };
}
export const theaterSpecialEvent = createTheaterSpecialStep(1);
