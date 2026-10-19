// Sự kiện liên thế hệ: chỉ dành cho người con đang tiếp quản (needs: 'heir').
// Mỗi sự kiện kèm điều kiện xác nhận bằng dữ liệu thật: nhà được thừa kế, anh chị em còn sống,
// việc tốt mà đời trước đã thực sự làm. Không bịa quan hệ để ép sự kiện xuất hiện.
// Chỗ điền tên: {vaiNguoiMat} (bố/mẹ), {VaiNguoiMat}, {tenNguoiMat}, {ongBaNguoiMat}, {tenAnhChiEm}, {viecTot}.
export const lineageStories = [
  {
    id: 'ls-the-he-don-nha', ages: [19, 104], needs: ['heir', 'inheritedHome'],
    title: 'Căn nhà được thừa kế',
    text: 'Căn nhà {vaiNguoiMat} để lại giờ đứng tên tôi. Tủ còn treo áo của {vaiNguoiMat}, trên bàn vẫn để cặp kính. Người quen khuyên dọn sạch cho nhẹ lòng, còn tôi chưa nỡ động vào. Tôi phải quyết định làm gì với căn nhà.',
    choices: [
      { label: 'Dọn dần, giữ vài món', effects: { happiness: 1 }, flags: ['giu_do_nguoi_mat'],
        text: 'Mỗi cuối tuần tôi dọn một góc. Áo quần đem cho người cần, cặp kính và cuốn sổ ghi chép thì cất vào hộp gỗ. Căn nhà thoáng dần mà vẫn còn hơi người.' },
      { label: 'Nhờ người dọn một lần', money: -3000000, effects: { health: 1 },
        text: 'Đội dọn nhà làm trong một ngày, hỏi từng món giữ hay bỏ. Tối đó căn nhà trống trải, tôi ngồi giữa phòng khách khá lâu mới bật đèn.' },
      { label: 'Để nguyên như cũ ít lâu', effects: { happiness: -1, intelligence: 1 },
        text: 'Tôi để mọi thứ nguyên chỗ, chỉ lau bụi. Mỗi lần mở cửa vào, tôi vẫn nghe như {vaiNguoiMat} sắp gọi từ trong bếp. Vài tháng sau tôi mới bắt đầu dọn.' },
    ],
  },
  {
    id: 'ls-the-he-la-thu', ages: [19, 104], needs: ['heir'],
    title: 'Phong bì trong ngăn kéo',
    text: 'Lục ngăn kéo bàn của {vaiNguoiMat}, tôi thấy một phong bì đề tên mình, nét chữ run run. Bên trong dày mấy trang. Tôi cầm phong bì, chưa biết nên đọc ngay hay đợi một lúc khác.',
    choices: [
      { label: 'Mở ra đọc ngay', effects: { happiness: 1 }, flags: ['doc_thu_nguoi_mat'],
        text: '{VaiNguoiMat} viết về những ngày tôi còn nhỏ, về vài điều chưa kịp nói. Có một câu xin lỗi vì đã nghiêm khắc. Tôi đọc hai lần, rồi kẹp lá thư vào cuốn sổ của mình.' },
      { label: 'Để dành tới ngày giỗ', effects: { intelligence: 1 },
        text: 'Tôi cất phong bì vào hộp, hẹn đến ngày giỗ mới mở. Suốt mấy tháng, mỗi lần đi ngang ngăn kéo tôi lại dừng một chút.' },
      { label: 'Đọc cùng người trong nhà', effects: { happiness: 2, health: -1 },
        text: 'Tôi gọi người nhà tới, đọc to từng trang. Có đoạn mọi người bật cười vì nhận ra giọng văn của {vaiNguoiMat}, có đoạn cả phòng im lặng rất lâu.' },
    ],
  },
  {
    id: 'ls-the-he-anh-chi-em', ages: [19, 104], needs: ['heir', 'siblings'],
    title: 'Chuyện chia của',
    text: '{tenAnhChiEm} hẹn tôi ra quán nói chuyện phần {vaiNguoiMat} để lại. Phần tiền đã chia xong, nhưng {tenAnhChiEm} muốn xin chiếc tủ gỗ cũ vốn để ở nhà tôi, vì nó gắn với một kỷ niệm riêng. Tôi phải trả lời.',
    choices: [
      { label: 'Nhường lại chiếc tủ', effects: { happiness: 1 }, flags: ['nhuong_tu_anh_chi_em'],
        text: 'Tôi gọi xe chở chiếc tủ sang nhà {tenAnhChiEm}. Hôm sau {tenAnhChiEm} gửi ảnh chiếc tủ đặt cạnh cửa sổ, kèm một dòng cảm ơn.' },
      { label: 'Giữ, mời lấy món khác', effects: { intelligence: 1 },
        text: 'Tôi nói chiếc tủ cũng gắn với tôi, mời {tenAnhChiEm} chọn món khác. {tenAnhChiEm} im một lúc rồi chọn chiếc đồng hồ treo tường. Hai người về, không ai giận.' },
      { label: 'Hẹn cả nhà cùng bàn', effects: { happiness: 1, health: -1 },
        text: 'Tôi đề nghị cả nhà ngồi lại một buổi. Buổi ấy kéo dài tới khuya, mỗi người chọn một món, kể một chuyện cũ. Chiếc tủ ở lại nhà tôi.' },
    ],
  },
  {
    id: 'ls-the-he-ke-cho-con', ages: [19, 104], needs: ['heir', 'children'], childAge: [5, 40],
    title: 'Chuyện về {ongBaNguoiMat}',
    text: '{tenCon} lật album cũ, dừng ở tấm ảnh {vaiNguoiMat} thời trẻ, hỏi {ongBaNguoiMat} ngày xưa là người thế nào. Tôi biết nhiều chuyện, có chuyện vui, có chuyện không dễ kể. Tôi phải chọn kể cho con nghe chuyện gì.',
    choices: [
      { label: 'Kể chuyện vui ngày xưa', effects: { happiness: 2 },
        text: 'Tôi kể những trận cười ở bữa cơm nhà ngày trước. {tenCon} nghe mê, đòi kể thêm, rồi nói muốn giữ tấm ảnh ấy trên bàn học.' },
      { label: 'Kể cả lúc khó khăn', effects: { intelligence: 1, happiness: 1 },
        text: 'Tôi kể cả những năm nhà túng, những lần {vaiNguoiMat} nóng giận. {tenCon} ngồi im nghe, cuối cùng nói: “Vậy mà {ongBaNguoiMat} vẫn thương mình nhiều.”' },
      { label: 'Để con tự đọc thư cũ', effects: { intelligence: 1 },
        text: 'Tôi đưa {tenCon} hộp thư cũ, dặn đọc chậm thôi. Mấy hôm sau con hỏi tôi về một cái tên lạ trong thư, và câu chuyện lại kéo dài.' },
    ],
  },
  {
    id: 'ls-the-he-viet-chuyen', ages: [19, 104], needs: ['heir', 'noChildren'],
    title: 'Viết lại chuyện về {vaiNguoiMat}',
    text: 'Nhà không có ai để kể, nên những chuyện về {vaiNguoiMat} chỉ còn trong đầu tôi. Tôi sợ một ngày mình cũng quên. Trên bàn có cuốn sổ trắng, và tôi nghĩ xem nên giữ những chuyện ấy bằng cách nào.',
    choices: [
      { label: 'Viết mỗi tối một trang', effects: { intelligence: 1, happiness: 1 }, flags: ['viet_chuyen_nguoi_mat'],
        text: 'Mỗi tối tôi viết một trang, chuyện nào nhớ trước viết trước. Hết năm, cuốn sổ dày gần kín. Đọc lại, tôi thấy {vaiNguoiMat} hiện ra rõ hơn cả trong ảnh.' },
      { label: 'Ghi âm lời kể của mình', effects: { happiness: 1 },
        text: 'Tôi ghi âm bằng điện thoại, kể như đang kể cho ai đó. Có đoạn tôi dừng lại rất lâu mới nói tiếp. Các tệp ghi âm tôi đặt tên theo từng năm.' },
      { label: 'Kể cho bạn thân nghe', effects: { happiness: 2, health: -1 },
        text: 'Tôi hẹn người bạn thân, kể một mạch tới khuya. Bạn nghe hết, rồi nói mấy chuyện ấy đáng được viết ra. Tôi mua thêm một cuốn sổ trên đường về.' },
    ],
  },
  {
    id: 'ls-the-he-gio-dau', ages: [19, 104], needs: ['heir'],
    title: 'Ngày giỗ đầu',
    text: 'Sắp tới ngày giỗ đầu của {vaiNguoiMat}. Họ hàng hỏi nhà định làm thế nào: làm mâm cơm mời mọi người, hay chỉ thắp nén nhang trong nhà. Tôi cũng muốn ra thăm mộ một mình. Tôi phải chọn cách làm ngày giỗ.',
    choices: [
      { label: 'Làm cơm mời họ hàng', money: -5000000, effects: { happiness: 2, health: -1 },
        text: 'Cả họ về đông đủ, ngồi chật hai mâm. Mỗi người kể một chuyện về {vaiNguoiMat}, có chuyện tôi chưa từng nghe. Dọn dẹp tới nửa đêm mới xong.' },
      { label: 'Làm nhỏ trong nhà', effects: { happiness: 1 },
        text: 'Tôi nấu vài món {vaiNguoiMat} thích, thắp nén nhang, ngồi một lúc trước di ảnh. Buổi tối yên tĩnh, chỉ có tiếng quạt và mùi hương.' },
      { label: 'Ra thăm mộ một mình', effects: { health: 1, intelligence: 1 },
        text: 'Sáng sớm tôi ra nghĩa trang, nhổ cỏ quanh mộ, kể chuyện một năm qua. Trên đường về, nắng lên, tôi thấy lòng nhẹ hơn tôi nghĩ.' },
    ],
  },
  {
    id: 'ls-the-he-nguoi-duoc-giup', ages: [19, 104], needs: ['heir', 'parentHelped'],
    title: 'Người còn nhớ {vaiNguoiMat}',
    text: 'Một người lạ tìm đến nhà, cầm theo túi quà. Người ấy kể {vaiNguoiMat} từng {viecTot}, nhờ vậy mà cuộc đời họ rẽ sang hướng khác. Nghe tin {vaiNguoiMat} mất, họ đến thắp nén nhang. Tôi phải đón người khách này thế nào.',
    choices: [
      { label: 'Mời vào ngồi nói chuyện', effects: { happiness: 2 }, flags: ['gap_nguoi_duoc_giup'],
        text: 'Người khách ngồi tới chiều, kể những chuyện về {vaiNguoiMat} mà tôi chưa từng biết. Lúc về, họ để lại số điện thoại, dặn có việc gì cứ gọi.' },
      { label: 'Nhận quà, gửi lại lời cảm ơn', effects: { intelligence: 1 },
        text: 'Tôi nhận quà, cảm ơn và tiễn khách ra cổng. Tối đó tôi ngồi nghĩ mãi về một {vaiNguoiMat} mà mình chỉ biết một nửa.' },
      { label: 'Mời họ dự ngày giỗ', effects: { happiness: 1, health: -1 },
        text: 'Tôi mời người khách dự ngày giỗ. Hôm ấy họ đến sớm, phụ dọn mâm, và kể lại chuyện năm xưa cho cả nhà nghe.' },
    ],
  },
];
