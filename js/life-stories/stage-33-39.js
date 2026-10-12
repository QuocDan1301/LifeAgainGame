// Giai đoạn 33–39 tuổi. Mỗi tuổi: 3 sự kiện chung (cặp có việc / chưa có việc tính là một) + phiên bản theo hoàn cảnh.
// Quy tắc viết: docs/su-kien-doi-thuong/SO-TAY.md.
export const stage33To39 = [
  // ───────────── 33 tuổi ─────────────
  {
    id: 'ls33-bai-dang', age: 33,
    title: 'Bài đăng lan truyền',
    text: 'Tôi đăng bài kể chuyện bị một quán ăn đối xử tệ. Bài lan truyền, quán bị chê khắp nơi. Hôm nay chủ quán nhắn riêng, xin tôi gỡ bài: hôm đó là nhân viên mới, quán vắng khách cả tuần, sắp không trả nổi tiền thuê mặt bằng.',
    choices: [
      { label: 'Gỡ bài', effects: { happiness: 1 }, flags: ['go_bai'],
        text: 'Tôi gỡ bài. Vài người hỏi sao gỡ, có người nói tôi bị mua chuộc. Ba tháng sau đi ngang, quán vẫn mở, có thêm tấm biển “Xin lỗi quý khách vì những thiếu sót”.' },
      { label: 'Viết bài đính chính', effects: { intelligence: 1 }, flags: ['dinh_chinh'],
        text: 'Tôi viết thêm một bài, kể lời chủ quán. Bài này ít người đọc hơn bài trước nhiều. Quán đông lại dần, chậm hơn lúc vắng đi.' },
      { label: 'Để nguyên', effects: { happiness: -1 },
        text: 'Tôi trả lời rằng tôi chỉ kể sự thật. Một tháng sau quán đóng cửa, mặt bằng treo biển cho thuê. Bài viết của tôi vẫn còn đó, lượt chia sẻ đã dừng.' },
    ],
  },
  {
    id: 'ls33-chuong-chay', age: 33,
    title: 'Chuông báo cháy nửa đêm',
    text: 'Nửa đêm, chuông báo cháy của khu nhà reo inh ỏi. Tháng trước nó cũng reo, hóa ra báo nhầm. Không ngửi thấy mùi khói. Tầng trên có bà cụ sống một mình, chân yếu, đi lại phải vịn tường.',
    choices: [
      { label: 'Lên gõ cửa bà cụ', effects: { happiness: 1, health: -1 }, flags: ['giup_ba_cu_chay'],
        text: 'Tôi dìu bà cụ xuống mười hai tầng thang bộ. Tới nơi thì loa thông báo báo nhầm. Bà cụ ngồi thở dốc ở sảnh, cầm tay tôi, nói lâu rồi mới có người nhớ tới bà.' },
      { label: 'Chạy xuống ngay', effects: { health: 1 },
        text: 'Tôi chạy xuống sân, đứng cùng mọi người. Lại báo nhầm. Lúc lên, tôi thấy bà cụ tầng trên vẫn đứng ở cửa phòng, tay vịn khung cửa, mặt tái mét.' },
      { label: 'Nằm lại, chờ xem', effects: { happiness: -1 },
        text: 'Mười phút sau chuông tắt. Báo nhầm thật. Sáng ra ban quản lý dán thông báo xin lỗi. Tôi đọc, rồi nghĩ nếu lần này là thật thì sao.' },
    ],
  },
  {
    id: 'ls33-dong-nghiep-sai', age: 33, needs: ['employed'],
    title: 'Lỗi của người khác',
    text: 'Đồng nghiệp thân nhất của tôi gửi nhầm báo giá cho khách, công ty mất một hợp đồng lớn. Sếp họp cả nhóm, hỏi ai phụ trách bản báo giá đó. Chỉ tôi biết. Đồng nghiệp đang nuôi con nhỏ, vừa vay tiền mua nhà.',
    choices: [
      { label: 'Im lặng', effects: { happiness: -1 }, flags: ['che_dong_nghiep'],
        text: 'Sếp phạt cả nhóm, ai cũng bị trừ thưởng. Đồng nghiệp mời tôi ăn trưa cả tuần, không nói lý do. Tôi ăn, cũng không hỏi.' },
      { label: 'Khuyên đồng nghiệp tự nhận', effects: { intelligence: 1 }, flags: ['khuyen_tu_nhan'],
        text: 'Cuối giờ, đồng nghiệp gõ cửa phòng sếp. Bị kỷ luật, mất thưởng nửa năm, nhưng không mất việc. Đồng nghiệp nói với tôi: “Cảm ơn, dù tao vẫn hơi ghét mày.”' },
    ],
  },
  {
    id: 'ls33-viec-luong-thap', age: 33, needs: ['notEmployed'],
    title: 'Lời mời lương thấp',
    text: 'Đã nửa năm không có việc ổn định. Một công ty nhỏ mời tôi về làm, lương chỉ bằng một nửa chỗ cũ, sếp kém tôi năm tuổi. Nhận thì có thu nhập đều. Từ chối thì tiền tiết kiệm chỉ đủ thêm ba tháng.',
    choices: [
      { label: 'Nhận việc', effects: { happiness: -1, intelligence: 1 }, flags: ['nhan_viec_luong_thap'],
        text: 'Ngày đầu, sếp trẻ giới thiệu tôi là “anh chị có kinh nghiệm”. Tôi làm tốt, nhưng mỗi lần ký bảng lương lại thấy nhói một chút. Ít nhất cuối tháng không phải lo.' },
      { label: 'Chờ cơ hội tốt hơn', effects: { happiness: -2 }, flags: ['cho_co_hoi'],
        text: 'Tôi gửi tiếp hồ sơ, cắt bớt mọi khoản chi. Tháng thứ ba vẫn chưa có gì. Tôi bắt đầu tính những thứ có thể bán.' },
    ],
  },
  {
    id: 'ls33-ban-doi-nghi-viec', age: 33, needs: ['partner'],
    title: 'Muốn làm lại từ đầu',
    text: '{tenBanDoi} muốn nghỉ việc văn phòng để mở một tiệm bánh nhỏ, ước mơ từ thời đi học. Tiền vốn sẽ lấy từ khoản hai đứa để dành. Nếu thất bại, mấy năm tới sẽ rất chật vật. {tenBanDoi} đã tính kỹ, giờ chờ tôi gật đầu.',
    choices: [
      { label: 'Ủng hộ', effects: { happiness: 2 }, flags: ['ung_ho_tiem_banh'],
        text: 'Tiệm mở được một năm. Có tháng lời, có tháng lỗ. {tenBanDoi} dậy từ bốn giờ sáng, tay đầy vết bỏng nhỏ, nhưng tối về vẫn kể chuyện khách quen rất say sưa.' },
      { label: 'Đề nghị làm thử cuối tuần trước', effects: { intelligence: 1 }, flags: ['tiem_banh_cuoi_tuan'],
        text: '{tenBanDoi} bán bánh trên mạng vào cuối tuần, vẫn giữ việc cũ. Một năm sau, có khách quen, có số liệu. {tenBanDoi} nói giờ thì đủ can đảm nghỉ việc rồi.' },
      { label: 'Khuyên giữ việc ổn định', effects: { happiness: -2 }, flags: ['can_tiem_banh'],
        text: '{tenBanDoi} không cãi. Mấy tháng sau, tôi thấy cuốn sổ ghi công thức bánh bị cất lên nóc tủ. Có hôm {tenBanDoi} đứng nhìn một tiệm bánh mới mở rất lâu.' },
    ],
  },
  {
    id: 'ls33-nguoi-cu', age: 33, needs: ['single'],
    title: 'Tin nhắn từ người cũ',
    text: 'Người yêu cũ, chia tay đã tám năm, nhắn tin hỏi thăm. Người ấy vừa ly hôn, đang ở cùng thành phố, hỏi có thể gặp nhau uống cà phê không. Tôi từng mất gần một năm mới quên được người ấy.',
    choices: [
      { label: 'Đồng ý gặp', effects: { happiness: 1 }, flags: ['gap_nguoi_cu'],
        text: 'Hai người ngồi hai tiếng, chủ yếu nói chuyện cũ. Người ấy khác đi nhiều, tôi cũng vậy. Lúc chia tay không ai hẹn lần sau. Tôi về nhà, thấy nhẹ lòng.' },
      { label: 'Trả lời lịch sự, không gặp', effects: { intelligence: 1 },
        text: 'Tôi chúc người ấy mọi điều tốt đẹp. Người ấy thả một trái tim vào tin nhắn. Tôi để điện thoại xuống, đi tưới mấy chậu cây ngoài ban công.' },
    ],
  },
  {
    id: 'ls33-con-bi-can', age: 33, needs: ['children'], childAge: [2, 6],
    title: 'Vết cắn trên tay con',
    text: '{tenCon} đi học về, trên tay có vết cắn đỏ tím. Cô giáo nói bạn cùng lớp cắn, đã nhắc nhở. Mẹ của đứa bạn kia đứng ở cổng trường, thấy tôi thì quay đi, không xin lỗi một câu.',
    choices: [
      { label: 'Tới nói chuyện với người mẹ', effects: { happiness: -1 }, flags: ['noi_chuyen_phu_huynh'],
        text: 'Chị ấy giật mình, rồi xin lỗi, kể đứa nhỏ ở nhà cũng hay cắn khi bực, chị không biết làm sao. Hai bên đứng nói chuyện gần nửa tiếng ở cổng trường.' },
      { label: 'Báo cô giáo xử lý', effects: { intelligence: 1 },
        text: 'Cô đổi chỗ ngồi cho hai đứa. Tuần sau {tenCon} kể lại được chơi với bạn kia, bạn cho mượn bút màu. Người mẹ kia vẫn không chào tôi.' },
    ],
  },

  // ───────────── 34 tuổi ─────────────
  {
    id: 'ls34-ba-cu-nga', age: 34,
    title: 'Bà cụ ngã trước đầu xe',
    text: 'Tôi đi xe máy chậm trên đường vắng thì một bà cụ băng ngang, giật mình ngã trước đầu xe. Xe chưa chạm tới bà. Bà ôm chân kêu đau. Mấy người bán hàng chạy ra, nói tôi tông người ta.',
    choices: [
      { label: 'Đưa bà cụ đi viện', effects: { happiness: 1, health: -1 }, flags: ['dua_ba_cu_vien'],
        text: 'Bà bị bong gân. Tôi trả tiền viện, ngồi chờ người nhà tới. Con trai bà tới, nghe kể, cảm ơn tôi rồi trả lại tiền. Bà cụ dúi vào tay tôi mấy trái chuối.' },
      { label: 'Xin xem camera của tiệm bên', effects: { intelligence: 2 }, flags: ['xem_camera'],
        text: 'Camera cho thấy xe chưa chạm. Mọi người im lặng giải tán. Tôi vẫn gọi xe đưa bà về nhà. Trên đường về, tay tôi run mãi không thôi.' },
    ],
  },
  {
    id: 'ls34-choi-hui', age: 34, minMoney: 2000000,
    title: 'Dây hụi của chị hàng xóm',
    text: 'Chị hàng xóm rủ chơi hụi, mỗi tháng góp hai triệu, ai cần thì hốt trước. Cả xóm chơi mấy năm nay chưa có chuyện gì. Gửi ngân hàng thì lãi ít hơn nhiều. Chị nói tháng này còn đúng một chân.',
    choices: [
      { label: 'Tham gia', effects: { happiness: -2 }, money: -2000000, flags: ['vo_hui'],
        text: 'Tám tháng đầu đều đặn. Tháng thứ chín, chị hàng xóm đóng cửa, cả nhà đi đâu không ai biết. Cả xóm mất tiền. Tôi mất mười sáu triệu, và mất niềm tin vào cái cười của hàng xóm.' },
      { label: 'Từ chối', effects: { intelligence: 1 },
        text: 'Chị hàng xóm hơi phật ý, mấy tuần không chào. Một năm sau, dây hụi vẫn chạy đều, người hốt được tiền khoe xây được cái bếp. Tôi không biết mình đúng hay sai.' },
    ],
  },
  {
    id: 'ls34-mo-mau', age: 34,
    title: 'Mỡ máu',
    text: 'Bác sĩ nói tôi mỡ máu cao, phải bớt đồ chiên, rượu bia, tập thể dục đều. Tuần này có ba bữa nhậu: sinh nhật bạn, liên hoan công việc, đám giỗ bên nhà. Bữa nào cũng khó từ chối.',
    choices: [
      { label: 'Đi cả ba, chỉ uống nước', effects: { health: 2, happiness: -1 }, flags: ['bo_nhau'],
        text: 'Bữa nào cũng có người ép, có người trêu. Tôi cười, nâng ly trà đá. Tới đám giỗ, ông chú lớn tuổi nói “nhà này có đứa tỉnh táo rồi”, nửa đùa nửa thật.' },
      { label: 'Đi, uống như mọi lần', effects: { health: -3, happiness: 2 },
        text: 'Ba bữa vui vẻ. Sáng thứ hai tôi dậy, đầu nặng như chì. Đơn thuốc của bác sĩ nằm trong ví, gấp làm tư.' },
      { label: 'Từ chối hết, tập thể dục', effects: { health: 3, happiness: -2 },
        text: 'Tôi đi bộ mỗi tối một tiếng. Bạn bè nói tôi khó gần. Ba tháng sau xét nghiệm lại, chỉ số về gần bình thường. Tôi gửi kết quả vào nhóm bạn, không ai trả lời.' },
    ],
  },
  {
    id: 'ls34-tiep-khach', age: 34, needs: ['employed'],
    title: 'Bữa tiếp khách',
    text: 'Sếp giao tôi đi tiếp một đối tác lớn. Đối tác thích nhậu, nói thẳng ai uống được thì ký nhanh. Tôi không uống được nhiều rượu. Hợp đồng này quyết định thưởng cuối năm của cả phòng.',
    choices: [
      { label: 'Uống cho tới khi ký', effects: { health: -3 }, flags: ['nhau_ky_hop_dong'],
        text: 'Hợp đồng được ký lúc mười một giờ đêm. Tôi nôn ở nhà vệ sinh của nhà hàng. Sáng hôm sau, sếp khen trước cả phòng. Tôi nghỉ ốm hai ngày.' },
      { label: 'Nói thẳng mình không uống được', effects: { intelligence: 1, happiness: -1 }, flags: ['tu_choi_nhau'],
        text: 'Đối tác cười, nói “thật thà vậy cũng được”. Ông ấy uống với đồng nghiệp tôi. Hợp đồng ký chậm hơn một tuần. Thưởng của phòng ít hơn dự tính.' },
    ],
  },
  {
    id: 'ls34-chua-co-viec-ba-me', age: 34, needs: ['notEmployed'],
    title: 'Câu hỏi trong bữa cơm',
    text: 'Bữa cơm họ hàng, một bà dì hỏi to: “Dạo này làm ở đâu rồi?” Cả bàn quay sang. Tôi đang không có việc ổn định, chỉ nhận việc lặt vặt. Người nhà đã kịp nói đỡ một câu “nó làm tự do”.',
    choices: [
      { label: 'Nói thật đang tìm việc', effects: { happiness: -1, intelligence: 1 }, flags: ['noi_that_that_nghiep'],
        text: 'Bà dì im một lúc, rồi kể con bà cũng từng nghỉ việc một năm. Cuối bữa, một ông chú lặng lẽ cho tôi số điện thoại của người quen đang tuyển người.' },
      { label: 'Nói đang làm tự do, rất ổn', effects: { happiness: -2 },
        text: 'Bà dì khen. Cả bàn chuyển sang chuyện khác. Tôi ăn thêm một chén, không thấy ngon. Về tới nhà, tôi ngồi mở danh sách công việc cần làm, danh sách trống trơn.' },
    ],
  },
  {
    id: 'ls34-chuyen-di-xa', age: 34, needs: ['partner'],
    title: 'Chuyến đi hay khoản để dành',
    text: '{tenBanDoi} muốn đi du lịch nước ngoài một chuyến, nói mấy năm nay chỉ biết làm. Chuyến đi tốn gần bằng sáu tháng tiền để dành. Tôi muốn giữ khoản đó phòng khi ốm đau.',
    choices: [
      { label: 'Đi', effects: { happiness: 3 }, flags: ['di_du_lich_xa'],
        text: 'Năm ngày, hai đứa đi bộ tới mỏi chân, chụp cả nghìn tấm ảnh. {tenBanDoi} cười nhiều hơn cả năm cộng lại. Về nhà, tài khoản mỏng hẳn, tôi tính lại kế hoạch chi tiêu.' },
      { label: 'Đi gần, rẻ hơn', effects: { happiness: 1, intelligence: 1 },
        text: 'Hai đứa đi biển trong nước ba ngày. {tenBanDoi} nói cũng vui, nhưng tối cuối ngồi trên bãi cát hỏi: “Bao giờ mình mới dám đi xa?”' },
    ],
  },
  {
    id: 'ls34-lop-hoc-moi', age: 34, needs: ['single'],
    title: 'Lớp học buổi tối',
    text: 'Tôi muốn học một thứ mới cho bớt những buổi tối trống. Có một lớp gốm thứ tư hằng tuần, học viên toàn người lạ. Tôi đã đứng trước cửa lớp hai lần, rồi quay về.',
    choices: [
      { label: 'Vào đăng ký', effects: { happiness: 3 }, flags: ['hoc_gom'],
        text: 'Cái chén đầu tiên méo xệch. Người ngồi bàn bên bật cười, rồi đưa tôi xem cái chén còn méo hơn của họ. Từ đó tối thứ tư có chỗ để đi, có người để chào.' },
      { label: 'Học trên mạng ở nhà', effects: { intelligence: 1 },
        text: 'Tôi xem video, mua đất sét về nặn trên bàn ăn. Nặn được vài thứ, đặt trên kệ. Căn phòng vẫn yên tĩnh như trước.' },
    ],
  },

  // ───────────── 35 tuổi ─────────────
  {
    id: 'ls35-gop-von', age: 35,
    title: 'Góp vốn mở quán',
    text: 'Bạn thân rủ góp vốn mở quán cà phê, mỗi người một nửa. Bạn ấy giỏi pha chế nhưng từng thất bại một lần. Phần của tôi là gần hết tiền để dành. Bạn ấy nói lần này đã có kinh nghiệm.',
    choices: [
      { label: 'Góp vốn', effects: { happiness: 1 }, flags: ['gop_von_quan'],
        text: 'Quán mở được một năm rưỡi rồi đóng. Tiền vốn về được một phần ba. Hai đứa ngồi dọn bàn ghế ngày cuối, không ai trách ai. Tình bạn còn, tiền thì không.' },
      { label: 'Cho vay một ít, không góp', effects: { intelligence: 1 }, flags: ['cho_ban_vay_quan'],
        text: 'Bạn ấy mở quán với người khác. Quán đông khách, trụ được. Bạn trả tôi đủ tiền sau hai năm, tặng thẻ uống miễn phí. Tôi ghé, uống ly cà phê, hơi tiếc.' },
      { label: 'Từ chối', effects: { happiness: -1 },
        text: 'Bạn nói không sao. Một năm sau quán bạn ấy khai trương, tôi tới mừng. Bạn ấy giới thiệu tôi với khách là “đứa không dám”, rồi cười.' },
    ],
  },
  {
    id: 'ls35-tre-lac', age: 35,
    title: 'Đứa trẻ trong siêu thị',
    text: 'Trong siêu thị, một đứa bé chừng bốn tuổi đứng khóc giữa lối đi, gọi mẹ. Không ai dừng lại. Một người đàn ông lạ tới gần, nắm tay đứa bé định dắt đi, nói “chú đưa con đi tìm mẹ”.',
    choices: [
      { label: 'Chặn lại, gọi bảo vệ', effects: { intelligence: 1, happiness: 1 }, flags: ['chan_nguoi_la'],
        text: 'Người đàn ông bực, nói tôi rảnh. Bảo vệ tới, đọc loa tìm mẹ. Mẹ đứa bé chạy tới, ôm con khóc. Người đàn ông thì đã đi mất từ lúc nào.' },
      { label: 'Đi theo, để ý từ xa', effects: { happiness: 1 },
        text: 'Người đàn ông dắt đứa bé tới quầy dịch vụ thật. Mẹ đứa bé tới sau năm phút. Tôi đứng sau kệ hàng, thấy mình đa nghi, nhưng không thấy mình sai.' },
    ],
  },
  {
    id: 'ls35-lam-them-cuoi-tuan', age: 35, needs: ['employed'],
    title: 'Việc làm thêm cuối tuần',
    text: 'Một công ty khác mời tôi làm thêm cuối tuần, trả bằng nửa tháng lương. Hợp đồng ở công ty chính cấm làm cho đối thủ, mà công ty kia lại khá gần với đối thủ. Không ai kiểm tra chuyện này.',
    choices: [
      { label: 'Nhận làm thêm', effects: { happiness: 1, health: -2 }, money: 6000000, flags: ['lam_them_lach'],
        text: 'Ba tháng đầu có thêm tiền. Tôi làm cả cuối tuần, ít ngủ. Một hôm, ở một buổi hội thảo, có người của công ty chính nhìn tôi lâu hơn bình thường.' },
      { label: 'Từ chối', effects: { intelligence: 1 },
        text: 'Tôi giữ cuối tuần cho mình. Tiền vẫn vậy. Năm sau, công ty chính có đợt rà soát hợp đồng, hai người bị cho nghỉ vì làm cho đối thủ.' },
    ],
  },
  {
    id: 'ls35-ban-hang-cho', age: 35, needs: ['notEmployed'],
    title: 'Sạp hàng ở chợ',
    text: 'Người quen sang lại một sạp hàng ở chợ, giá rẻ vì cần tiền gấp. Bán hàng chợ thì dậy từ bốn giờ sáng, làm cả Tết. Tôi chưa từng buôn bán, nhưng đang không có việc ổn định.',
    choices: [
      { label: 'Nhận sạp', effects: { health: -1, happiness: 1 }, flags: ['ban_cho'],
        text: 'Tháng đầu bán ế, tháng thứ ba có mối quen. Tôi học cách gọi khách, cách trả giá. Tối về tay chân rã rời, nhưng có tiền đều mỗi ngày.' },
      { label: 'Không nhận', effects: { happiness: -1 },
        text: 'Sạp được người khác mua. Mỗi lần đi chợ, tôi đi ngang, thấy người chủ mới bận rộn. Tôi vẫn gửi hồ sơ, vẫn chờ.' },
    ],
  },
  {
    id: 'ls35-me-gia-o-xa', age: 35, needs: ['father', 'mother'],
    title: 'Đón ba mẹ lên ở',
    text: 'Ba mẹ đã già, sống một mình ở quê, mấy lần bị ngã. Tôi muốn đón ba mẹ lên ở cùng. Ba mẹ không muốn rời căn nhà, hàng xóm, mảnh vườn. Ở thành phố, ba mẹ sẽ phải ngồi trong căn hộ cả ngày.',
    choices: [
      { label: 'Thuyết phục đón lên', effects: { happiness: -1 }, flags: ['don_ba_me_len'],
        text: 'Ba mẹ lên ở được tám tháng. Ngày nào cũng hỏi chuyện ở quê, gọi điện cho hàng xóm cũ. Tới mùa nước, ba mẹ xin về. Tôi đưa về, lắp thêm tay vịn trong nhà tắm.' },
      { label: 'Thuê người chăm ở quê', effects: { happiness: 1 }, flags: ['thue_nguoi_cham'],
        text: 'Tôi thuê một chị hàng xóm qua nấu cơm, xem chừng mỗi ngày. Tối nào cũng gọi video. Ba mẹ khỏe ra, nhưng có hôm gọi, mẹ nói: “Nhà vắng quá.”' },
    ],
  },
  {
    id: 'ls35-ky-niem-cuoi', age: 35, needs: ['married'],
    title: 'Mười năm',
    text: 'Gần mười năm kết hôn, hai đứa ít nói chuyện hẳn, tối nào cũng mỗi người một cái điện thoại. {tenBanDoi} không nói gì, nhưng tôi biết {tenBanDoi} cũng thấy. Ngày kỷ niệm sắp tới.',
    choices: [
      { label: 'Đề nghị một buổi tối không điện thoại', effects: { happiness: 2 }, flags: ['toi_khong_dien_thoai'],
        text: 'Tối đầu tiên hơi ngượng, hai đứa không biết nói gì. Tới tối thứ ba thì kể chuyện thời mới quen, cười ra nước mắt. Thói quen giữ được hơn một năm.' },
      { label: 'Đặt một bữa tối sang trọng', effects: { happiness: 1 },
        text: 'Bữa tối đẹp, ảnh đẹp. Về nhà, mỗi người lại một cái điện thoại. Tôi nhìn sang {tenBanDoi}, {tenBanDoi} cũng vừa nhìn sang tôi.' },
    ],
  },
  {
    id: 'ls35-ban-be-co-con', age: 35, needs: ['single'],
    title: 'Mấy đứa bạn có con',
    text: 'Bạn bè tôi giờ đều có con, những cuộc hẹn toàn ở khu vui chơi trẻ em. Tôi ngồi một mình cầm ly nước, nghe chuyện sữa, chuyện trường mầm non. Hôm nay lại có lời rủ như vậy.',
    choices: [
      { label: 'Vẫn đi, chơi với tụi nhỏ', effects: { happiness: 2 }, flags: ['co_di_cua_tre'],
        text: 'Tôi ngồi xếp hình với mấy đứa nhỏ. Tụi nó nói tôi là người lớn vui nhất. Bạn bè có được nửa tiếng nói chuyện với nhau, cảm ơn tôi rối rít.' },
      { label: 'Rủ bạn đi riêng, không mang con', effects: { happiness: 1, intelligence: 1 },
        text: 'Hai người bạn sắp xếp được, một người không. Ba đứa ngồi quán cũ như thời sinh viên. Được một tiếng thì điện thoại reo, con ốm, bạn phải về.' },
    ],
  },

  // ───────────── 36 tuổi ─────────────
  {
    id: 'ls36-vay-nong', age: 36,
    title: 'Người họ hàng vay tiền',
    text: 'Một người anh họ tới nhà, xin vay ba mươi triệu, nói làm ăn thua lỗ, chủ nợ đang đòi. Lần trước anh vay mười triệu, ba năm vẫn chưa trả. Anh ngồi ở phòng khách, uống hết ấm trà mà chưa dám đứng dậy.',
    choices: [
      { label: 'Cho vay', money: -30000000, lend: 'cousin', effects: { happiness: -1 }, flags: ['cho_anh_ho_vay'],
        text: 'Anh cầm tiền, nói cảm ơn rất nhiều lần. Một năm sau anh vẫn chưa trả, Tết vẫn tới chúc như mọi năm. Tôi coi như cho, nhưng không nói ra.' },
      { label: 'Cho một khoản, không đòi lại', money: -5000000, effects: { happiness: 1 }, flags: ['cho_anh_ho_tien'],
        text: 'Tôi đưa năm triệu, nói anh cầm tạm, không cần trả. Anh nhìn số tiền, rồi gật đầu. Từ đó anh không hỏi vay nữa, mà Tết vẫn mang qua một giỏ trái cây.' },
      { label: 'Từ chối', effects: { happiness: -2 },
        text: 'Anh đứng dậy, nói “ừ, anh hiểu”. Cả họ biết chuyện, có người nói tôi giàu mà keo kiệt. Hai năm sau anh làm ăn khá lên, gặp tôi vẫn chào, chỉ chào thôi.' },
    ],
  },
  {
    id: 'ls36-chung-nhan-gia', age: 36,
    title: 'Tờ giấy xác nhận',
    text: 'Người quen nhờ tôi ký giấy xác nhận rằng anh ta làm việc cho tôi hai năm, để đủ điều kiện vay ngân hàng. Thật ra anh ta chỉ làm giúp vài tháng. Anh nói ai cũng làm vậy, chẳng ai kiểm tra.',
    choices: [
      { label: 'Ký giúp', effects: { happiness: -1 }, flags: ['ky_xac_nhan_gia'],
        text: 'Anh ta vay được tiền, mời tôi ăn một bữa thịnh soạn. Năm sau anh trả nợ chậm, ngân hàng gọi cho người xác nhận, tức là tôi.' },
      { label: 'Từ chối', effects: { intelligence: 1 },
        text: 'Anh ta nói tôi cứng nhắc, rồi nhờ người khác. Mấy tháng sau gặp lại ở đám cưới, anh ta vẫn cười nói, như chưa có gì xảy ra.' },
    ],
  },
  {
    id: 'ls36-dau-lung', age: 36,
    title: 'Cơn đau lưng',
    text: 'Lưng tôi đau mấy tháng nay, có sáng cúi xuống buộc dây giày không nổi. Bác sĩ nói phải tập vật lý trị liệu ba buổi một tuần, kéo dài hai tháng. Mỗi buổi mất gần hai tiếng, mà tôi thì bận tối mắt.',
    choices: [
      { label: 'Đi tập đủ buổi', effects: { health: 3, happiness: -1 }, flags: ['tap_vat_ly'],
        text: 'Tôi sắp xếp lại lịch, bỏ bớt mấy cuộc hẹn. Tới tuần thứ sáu, sáng ra cúi buộc dây giày được bình thường. Tôi đứng thẳng lưng trong thang máy, thấy lạ.' },
      { label: 'Uống thuốc giảm đau', effects: { health: -2, happiness: 1 },
        text: 'Thuốc làm cơn đau dịu đi. Công việc trôi đều. Thỉnh thoảng cơn đau quay lại mạnh hơn, tôi uống thêm một viên.' },
    ],
  },
  {
    id: 'ls36-chu-nha-kho-tinh', age: 36, needs: ['married'], childAge: [5, 12],
    title: 'Con hỏi chuyện ly hôn',
    text: 'Bạn thân của {tenCon} có ba mẹ ly hôn. Tối nay, {tenCon} hỏi tôi: “Ba mẹ có ly hôn không?” Tôi với {tenBanDoi} mới cãi nhau tuần trước, chưa làm hòa hẳn. {tenBanDoi} đang ở phòng bên, chắc nghe được.',
    choices: [
      { label: 'Nói thật: ba mẹ đang giận nhau', effects: { happiness: -1, intelligence: 1 }, flags: ['noi_that_voi_con'],
        text: 'Tôi nói người lớn có lúc giận nhau, nhưng ba mẹ đang cố. {tenCon} gật đầu. Lát sau {tenBanDoi} vào, ngồi xuống cạnh hai người, không nói gì, chỉ xoa đầu con.' },
      { label: 'Nói: “Không đâu con”', effects: { happiness: 1 },
        text: '{tenCon} yên tâm đi ngủ. Tôi ra phòng khách, {tenBanDoi} đang đứng đó. Hai đứa nhìn nhau, rồi tối đó nói chuyện lần đầu tiên sau một tuần.' },
    ],
  },
  {
    id: 'ls36-ban-cu-goi', age: 36, needs: ['partner'],
    title: 'Ba người ngồi một bàn',
    text: 'Người bạn khác giới thân nhất của tôi từ thời đại học hay nhắn tin kể chuyện buồn. {tenBanDoi} không nói gì, nhưng mỗi lần điện thoại tôi sáng lúc khuya, {tenBanDoi} lại quay mặt vào tường. Hôm nay người bạn ấy rủ tôi đi ăn tối.',
    choices: [
      { label: 'Rủ {tenBanDoi} đi cùng', effects: { happiness: 1 }, flags: ['ba_nguoi_mot_ban'],
        text: 'Bữa tối hơi gượng lúc đầu, rồi dễ chịu dần. Về nhà, {tenBanDoi} nói: “Người đó cũng tốt.” Người bạn ít nhắn lúc khuya hơn, có lẽ đã hiểu.' },
      { label: 'Từ chối, giữ khoảng cách', effects: { happiness: -1 },
        text: 'Tôi nói dạo này bận. Người bạn hiểu, ít nhắn dần. Có một lần, người ấy nhắn chúc mừng sinh nhật, tôi trả lời bằng hai chữ cảm ơn.' },
    ],
  },
  {
    id: 'ls36-bao-hiem-tuoi-gia', age: 36, needs: ['single'],
    title: 'Ai sẽ chăm mình',
    text: 'Tôi ốm một tuần, sốt cao, tự đi khám, tự nấu cháo. Nằm một mình, tôi nghĩ về chuyện sau này ai sẽ chăm mình. Có một gói bảo hiểm hưu trí mỗi năm hai chục triệu, đóng hai mươi năm.',
    choices: [
      { label: 'Mua bảo hiểm', effects: { intelligence: 1, happiness: 1 }, flags: ['bao_hiem_huu'],
        text: 'Tôi ký hợp đồng, đặt nhắc lịch đóng tiền hằng năm. Mỗi năm tới hạn, tôi đóng xong lại thấy yên tâm một chút, như đang trả tiền trước cho một người chăm sóc.' },
      { label: 'Gọi bạn thân lập một giao kèo', effects: { happiness: 2 }, flags: ['giao_keo_ban_than'],
        text: 'Tôi gọi đứa bạn cũng sống một mình. Hai đứa hứa ai ốm thì người kia tới. Ba tháng sau đứa bạn ốm, tôi mang cháo qua, ngồi tới khuya.' },
    ],
  },

  // ───────────── 37 tuổi ─────────────
  {
    id: 'ls37-tien-nha-vo', age: 37,
    title: 'Thợ sửa ống nước',
    text: 'Ống nước nhà tôi vỡ lúc nửa đêm. Thợ tới, báo giá gấp ba bình thường, nói giờ này không ai đi. Nước đang chảy lênh láng khắp bếp. Tôi biết anh thợ đang nắm thế.',
    choices: [
      { label: 'Chịu giá, sửa ngay', effects: { happiness: -1 },
        text: 'Anh thợ sửa trong nửa tiếng, cầm tiền rồi đi. Sáng ra tôi lau sàn tới trưa. Tôi lưu số điện thoại của anh dưới cái tên “thợ đắt”.' },
      { label: 'Khóa van, chờ sáng', effects: { health: -1, intelligence: 1 }, flags: ['tu_xu_ly_ong_nuoc'],
        text: 'Tôi lần mò tìm van tổng, khóa được nước. Cả nhà không có nước tới sáng. Thợ ban ngày sửa với giá bình thường, còn chỉ tôi cách tự thay khớp nối.' },
    ],
  },
  {
    id: 'ls37-dong-nghiep-qua-doi', age: 37,
    title: 'Người bạn cùng tuổi',
    text: 'Một người bạn cùng tuổi đột quỵ, mất trong lúc đang chạy bộ. Đám tang đông người. Đứng trước di ảnh, tôi nghĩ tới những việc mình cứ để “khi nào rảnh”. Tối về, tôi mở danh sách những việc ấy ra.',
    choices: [
      { label: 'Gọi điện cho người thân lâu không gọi', effects: { happiness: 2 }, flags: ['goi_nguoi_than'],
        text: 'Tôi gọi ba cuộc. Một người khóc, một người ngạc nhiên, một người không nghe máy, sáng hôm sau gọi lại. Tôi ghi lịch, tháng nào cũng gọi.' },
      { label: 'Đi khám sức khỏe tổng quát', effects: { health: 2 }, flags: ['kham_tong_quat'],
        text: 'Kết quả có vài chỉ số cần theo dõi, không có gì nghiêm trọng. Tôi dán tờ kết quả lên cửa tủ lạnh. Mỗi lần mở tủ lấy bia, tôi nhìn thấy nó.' },
      { label: 'Gấp danh sách lại', effects: { happiness: -1 },
        text: 'Tôi gấp tờ giấy, cất vào ngăn kéo. Tuần sau công việc lại cuốn đi như cũ. Thỉnh thoảng nhớ tới đám tang ấy, tôi tự hứa: tháng sau.' },
    ],
  },
  {
    id: 'ls37-bi-sa-thai', age: 37, needs: ['employed'],
    title: 'Danh sách cắt giảm',
    text: 'Công ty cắt giảm nhân sự. Sếp cho tôi xem trước danh sách, trong đó có tên người bạn thân cùng phòng, sẽ thông báo vào thứ hai. Sếp dặn giữ kín. Bạn tôi đang định đặt cọc mua nhà vào cuối tuần.',
    choices: [
      { label: 'Báo riêng cho bạn', effects: { happiness: 1 }, flags: ['bao_ban_cat_giam'],
        text: 'Bạn tôi hủy đặt cọc. Thứ hai, bạn nhận quyết định rất bình tĩnh. Sếp nhìn tôi khác đi, nhưng không nói gì. Bạn tôi nói nợ tôi một lần.' },
      { label: 'Giữ kín như sếp dặn', effects: { happiness: -2 }, flags: ['giu_kin_cat_giam'],
        text: 'Bạn tôi đặt cọc xong mới nhận quyết định. Tôi ngồi cạnh bạn lúc bạn gọi điện xin hoãn hợp đồng. Bạn không biết tôi đã biết trước.' },
    ],
  },
  {
    id: 'ls37-thue-xe-cho', age: 37, needs: ['notEmployed'],
    title: 'Chạy xe công nghệ',
    text: 'Chưa có việc ổn định, tôi tính chạy xe công nghệ để có thu nhập. Có hôm phải chở người quen cũ, những người từng làm cùng tôi. Tôi sợ gặp lại họ trong bộ đồng phục ấy.',
    choices: [
      { label: 'Đăng ký chạy xe', effects: { health: -1 }, money: 4000000, flags: ['chay_xe'],
        text: 'Tháng thứ hai, tôi chở đúng một đồng nghiệp cũ. Hai người im lặng mười phút, rồi người ấy hỏi thăm, cho thêm tiền boa. Tôi không nhận. Người ấy để tiền trên yên xe.' },
      { label: 'Tìm việc khác', effects: { happiness: -1 },
        text: 'Tôi tiếp tục tìm việc văn phòng, nhận dịch tài liệu lặt vặt qua mạng. Tiền về không đều. Mỗi lần thấy người chạy xe ngoài đường, tôi lại nhìn kỹ một chút.' },
    ],
  },
  {
    id: 'ls37-ban-doi-bi-benh', age: 37, needs: ['partner'],
    title: 'Kết quả khám',
    text: '{tenBanDoi} đi khám, bác sĩ hẹn tuần sau đọc kết quả, dặn nên có người nhà đi cùng. {tenBanDoi} cười, nói chắc không có gì. Đúng ngày đó tôi có cuộc họp quan trọng, đã lên lịch cả tháng.',
    choices: [
      { label: 'Bỏ họp, đi cùng', effects: { happiness: 2 }, flags: ['di_cung_doc_ket_qua'],
        text: 'Kết quả không xấu, chỉ cần điều trị dài. {tenBanDoi} nắm tay tôi suốt lúc bác sĩ nói. Ra về, {tenBanDoi} nói: “Có mình đi cùng, đỡ sợ hẳn.” Câu đó còn lâu tôi mới quên.' },
      { label: 'Đi họp, gọi điện hỏi', effects: { happiness: -2 },
        text: '{tenBanDoi} gọi lại, giọng bình thường, nói không sao, chỉ cần điều trị. Tối về, tôi thấy tờ kết quả trên bàn, gấp làm đôi, chữ ký bác sĩ hơi nhòe.' },
    ],
  },
  {
    id: 'ls37-nuoi-chau', age: 37, needs: ['single'],
    title: 'Đứa cháu cần chỗ ở',
    text: 'Đứa cháu họ lên thành phố học đại học, nhà nghèo, xin ở nhờ chỗ tôi bốn năm. Tôi quen sống một mình, nhà chỉ có một phòng ngủ. Nếu không ở nhờ được, nó phải đi làm thêm nhiều hơn để trả tiền trọ.',
    choices: [
      { label: 'Cho cháu ở', effects: { happiness: 2, health: -1 }, flags: ['cho_chau_o'],
        text: 'Tôi kê thêm giường ở phòng khách. Cháu ngoan, sáng nấu cơm, tối học bài. Nhà có tiếng người. Có hôm tôi về muộn, thấy đèn đã bật sẵn.' },
      { label: 'Hỗ trợ tiền trọ một phần', effects: { intelligence: 1 },
        text: 'Mỗi tháng tôi gửi cháu một khoản. Cháu ở trọ với bạn, cuối tuần ghé ăn cơm. Ngày nhận bằng tốt nghiệp, cháu mời tôi đứng chụp ảnh cạnh ba mẹ nó.' },
    ],
  },

  // ───────────── 38 tuổi ─────────────
  {
    id: 'ls38-hang-xom-xay-nha', age: 38,
    title: 'Bức tường lấn sang',
    text: 'Nhà hàng xóm xây lại, bức tường lấn sang đất nhà tôi chừng hai tấc. Đo lại thì đúng. Hàng xóm là người tốt, hay cho đồ ăn, nhưng chuyện đất cát thì để lâu sẽ thành chuyện lớn.',
    choices: [
      { label: 'Sang nói chuyện thẳng', effects: { intelligence: 1 }, flags: ['noi_chuyen_ranh_dat'],
        text: 'Hàng xóm ngạc nhiên, mời thợ đo lại, rồi đồng ý dời tường. Mất nửa tháng, hai bên đều tốn tiền. Từ đó hàng xóm vẫn cho đồ ăn, nhưng ít hơn.' },
      { label: 'Bỏ qua, coi như cho', effects: { happiness: -1 }, flags: ['bo_qua_ranh_dat'],
        text: 'Hai tấc đất nằm sau bức tường mới. Hàng xóm không biết, hoặc biết mà không nói. Mỗi lần đi qua, tôi lại nhìn bức tường.' },
      { label: 'Nhờ chính quyền đo đạc', effects: { happiness: -2 }, flags: ['kien_ranh_dat'],
        text: 'Cán bộ đo đạc xác nhận. Hàng xóm phải dời tường, mặt lạnh tanh. Hai nhà thôi chào nhau. Tôi có lại hai tấc đất.' },
    ],
  },
  {
    id: 'ls38-tap-chay', age: 38,
    title: 'Giải chạy đầu tiên',
    text: 'Tôi bắt đầu chạy bộ vì lời bác sĩ. Ba tháng sau, nhóm chạy rủ tôi đăng ký giải hai mươi mốt cây số. Tôi mới chạy được mười cây. Còn sáu tuần nữa là tới ngày chạy.',
    choices: [
      { label: 'Đăng ký, tập thêm', effects: { health: 2, happiness: 2 }, flags: ['chay_ban_ma'],
        text: 'Tôi về đích sau gần ba tiếng, gần cuối bảng. Đầu gối đau một tuần. Cái huy chương bằng kim loại rẻ tiền được treo ở chỗ dễ thấy nhất trong nhà.' },
      { label: 'Chạy cự ly ngắn hơn', effects: { health: 2 },
        text: 'Tôi chạy năm cây số, về đích thoải mái. Nhóm chạy chụp ảnh, tôi đứng ở hàng sau. Năm sau, tôi hứa với mình sẽ chạy cự ly dài.' },
    ],
  },
  {
    id: 'ls38-nhan-vien-tre', age: 38, needs: ['employed'],
    title: 'Người trẻ giỏi hơn',
    text: 'Phòng tôi có một nhân viên trẻ rất giỏi, làm nhanh, ý tưởng hay. Sếp hỏi tôi nên đề bạt ai làm trưởng nhóm, tôi hay cậu ấy. Tôi biết nếu cậu ấy lên, tôi sẽ phải báo cáo cho người kém mình mười tuổi.',
    choices: [
      { label: 'Đề cử cậu ấy', effects: { happiness: -1, intelligence: 2 }, flags: ['de_cu_nguoi_tre'],
        text: 'Cậu ấy lên trưởng nhóm, hay hỏi ý tôi trước mỗi quyết định lớn. Ngày đầu tôi thấy khó chịu. Một năm sau, nhóm làm tốt nhất công ty.' },
      { label: 'Nhận vị trí cho mình', effects: { happiness: 1 }, flags: ['giu_vi_tri'],
        text: 'Tôi lên trưởng nhóm. Cậu ấy làm tốt thêm một năm rồi nghỉ, sang công ty đối thủ. Ngày chia tay, cậu ấy nói: “Em học được nhiều từ anh chị.” Tôi không biết thật hay không.' },
    ],
  },
  {
    id: 'ls38-ban-do-cu', age: 38, needs: ['notEmployed'],
    title: 'Bán bớt đồ',
    text: 'Không có việc ổn định đã lâu, tiền để dành sắp cạn. Tôi nhìn quanh nhà: chiếc máy ảnh từng là niềm vui lớn nhất, bộ sách sưu tầm mười năm, chiếc đồng hồ ba mẹ tặng ngày ra trường. Phải bán một thứ.',
    choices: [
      { label: 'Bán máy ảnh', effects: { happiness: -1 }, money: 8000000,
        text: 'Người mua là một cậu sinh viên, cầm máy lên ngắm rất lâu. Tôi dặn cậu cách lau ống kính. Cậu ấy gửi lại cho tôi bức ảnh đầu tiên chụp bằng máy ấy.' },
      { label: 'Bán bộ sách', effects: { happiness: -2 }, money: 3000000,
        text: 'Bộ sách bán được ít hơn tôi tưởng. Kệ sách trống trơn, tôi đặt mấy chậu cây lên. Có hôm tôi đứng nhìn kệ sách, quên mình định lấy gì.' },
      { label: 'Bán đồng hồ', effects: { happiness: -3 }, money: 10000000, flags: ['ban_dong_ho'],
        text: 'Tôi không kể với ai. Tiền đủ cầm cự bốn tháng. Mỗi lần nhìn cổ tay trống, tôi lại tự hứa sẽ chuộc lại, dù biết tiệm đã bán đi rồi.' },
    ],
  },
  {
    id: 'ls38-con-bi-diem-kem', age: 38, needs: ['children'], childAge: [8, 14],
    title: 'Bài kiểm tra bị giấu',
    text: 'Cô giáo nhắn: {tenCon} bị điểm kém hai bài liền, cô đã yêu cầu xin chữ ký phụ huynh. Tôi chưa thấy bài nào. Tối nay {tenCon} vẫn vui vẻ ăn cơm, kể chuyện bạn bè ở lớp.',
    choices: [
      { label: 'Hỏi thẳng trong bữa cơm', effects: { happiness: -1 }, flags: ['hoi_con_giau_bai'],
        text: '{tenCon} khựng lại, mắt đỏ lên, rồi đi lấy hai bài kiểm tra kẹp trong sách. {tenCon} nói sợ tôi buồn. Tôi ký, rồi ngồi chữa bài với con tới khuya.' },
      { label: 'Chờ con tự nói', effects: { intelligence: 1 }, flags: ['cho_con_tu_noi'],
        text: 'Ba ngày sau, {tenCon} tự mang bài tới, mặt cúi gằm. Tôi không la. {tenCon} hỏi sao tôi không giận. Tôi kể chuyện cuốn vở chính tả hồi tôi học lớp hai.' },
    ],
  },
  {
    id: 'ls38-ban-doi-thay-doi', age: 38, needs: ['partner'],
    title: 'Sở thích mới',
    text: '{tenBanDoi} mới mê leo núi, cuối tuần nào cũng đi cùng một nhóm bạn mới. Tôi không thích leo núi, ở nhà một mình. {tenBanDoi} rủ tôi đi chuyến tới, nói muốn tôi biết những người bạn ấy.',
    choices: [
      { label: 'Đi cùng một chuyến', effects: { health: 1, happiness: 1 }, flags: ['leo_nui_cung'],
        text: 'Tôi thở dốc tới đỉnh, bị trầy hai đầu gối. Nhóm bạn của {tenBanDoi} rất dễ chịu. Tối đó, {tenBanDoi} xoa thuốc cho tôi, cười mãi vì bộ dạng của tôi.' },
      { label: 'Ở nhà, tìm sở thích riêng', effects: { intelligence: 1 },
        text: 'Tôi đăng ký một lớp học vào sáng chủ nhật. Tối về, hai đứa kể cho nhau nghe chuyện của mình. Nói được nhiều hơn trước, nhưng chuyện của hai bên ít điểm chung.' },
    ],
  },
  {
    id: 'ls38-don-nha-o-mot-minh', age: 38, needs: ['single'],
    title: 'Con chó ở trạm cứu hộ',
    text: 'Tôi tới trạm cứu hộ động vật để quyên góp. Có một con chó già, mù một mắt, nằm ở góc chuồng. Người ở trạm nói nó ở đây ba năm rồi, chẳng ai nhận. Nó ngẩng đầu nhìn về phía tôi.',
    choices: [
      { label: 'Nhận nuôi', effects: { happiness: 3 }, flags: ['nuoi_cho_mu'],
        text: 'Con chó đi lần theo tường nhà mấy hôm mới quen. Sáng nào nó cũng chờ tôi ở cửa phòng ngủ. Hàng xóm hỏi sao nuôi chó già, tôi nói nó cũng hỏi tôi câu đó.' },
      { label: 'Quyên góp, hẹn quay lại', effects: { happiness: -1 },
        text: 'Tôi để lại tiền, hứa sẽ quay lại. Hai tháng sau tôi quay lại thật. Góc chuồng ấy đã có một con chó khác.' },
    ],
  },

  // ───────────── 39 tuổi ─────────────
  {
    id: 'ls39-mang-xa-hoi', age: 39,
    title: 'Tấm ảnh cũ trên mạng',
    text: 'Một người bạn cũ đăng tấm ảnh thời sinh viên, trong đó tôi đang say, mặt đỏ, áo xộc xệch. Ảnh được gắn tên tôi, nhiều người bình luận. Có cả đồng nghiệp, cả người nhà.',
    choices: [
      { label: 'Nhắn riêng xin gỡ', effects: { intelligence: 1 },
        text: 'Bạn ấy gỡ ngay, xin lỗi, nói chỉ muốn nhớ lại thời trẻ. Tôi gửi lại một tấm khác, cả nhóm cười tươi, áo quần chỉnh tề. Bạn ấy đăng tấm đó.' },
      { label: 'Vào bình luận đùa theo', effects: { happiness: 2 }, flags: ['tu_trao'],
        text: 'Tôi bình luận: “Đây là lý do tôi không uống rượu nữa.” Mọi người cười. Đồng nghiệp hôm sau kể chuyện thời sinh viên của họ. Không khí trong phòng dễ chịu hơn.' },
    ],
  },
  {
    id: 'ls39-giao-thong', age: 39,
    title: 'Chiếc xe lạng lách',
    text: 'Trên đường, một đám thanh niên chạy xe lạng lách, quẹt vào gương xe tôi rồi chửi thề, dừng lại thách thức. Đường đông, mọi người nhìn. Cơn giận trong tôi đang dâng lên.',
    choices: [
      { label: 'Bỏ qua, chạy đi', effects: { happiness: -1, health: 1 },
        text: 'Tôi chạy tiếp, tim đập mạnh. Tụi nó cười, bỏ đi hướng khác. Tối về, tôi ngồi thay cái gương, tay vẫn còn hơi run.' },
      { label: 'Chụp biển số, báo công an', effects: { intelligence: 1 }, flags: ['bao_lang_lach'],
        text: 'Tôi chụp biển số, gửi lên đường dây nóng. Một tháng sau nhận tin nhắn: đã xử phạt. Tôi đọc tin nhắn ấy hai lần.' },
    ],
  },
  {
    id: 'ls39-ba-me-di-vien', age: 39, needs: ['father'],
    title: 'Đêm trong bệnh viện',
    text: 'Ba nằm viện, phải có người ở cạnh ban đêm, kéo dài chừng ba tuần. Tôi là người ở gần nhất. Thuê người trực đêm thì tốn, nhưng tôi cũng không thể nghỉ việc ba tuần.',
    choices: [
      { label: 'Tự trực đêm', effects: { health: -3, happiness: 2 }, flags: ['truc_dem_ba_me'],
        text: 'Ba tuần ngủ trên ghế xếp, sáng đi làm thẳng từ viện. Có đêm hai người nói chuyện tới gần sáng, chuyện hồi tôi còn nhỏ, có chuyện tôi chưa nghe bao giờ.' },
      { label: 'Thuê người trực đêm', effects: { happiness: -1 },
        text: 'Chị trực đêm làm tốt, chu đáo. Tối nào tôi cũng ghé sau giờ làm, ngồi một tiếng rồi về. Có hôm vào, nghe chị kể chuyện ba hồi chiều, như chị là con trong nhà.' },
    ],
  },
  {
    id: 'ls39-cong-viec-chan', age: 39, needs: ['employed'],
    title: 'Mười năm một chỗ',
    text: 'Tôi làm ở công ty này gần mười năm, công việc lặp lại, không còn gì mới. Một người quen rủ sang công ty khởi nghiệp, lương thấp hơn, rủi ro cao, nhưng được làm thứ mình thích. Bốn mươi tuổi tới nơi.',
    choices: [
      { label: 'Chuyển sang chỗ mới', effects: { happiness: 2, intelligence: 1 }, flags: ['nhay_viec_39'],
        text: 'Năm đầu ở chỗ mới, tôi học lại từ đầu nhiều thứ, có tuần làm tới khuya. Lương ít đi. Nhưng sáng nào tôi cũng muốn tới chỗ làm.' },
      { label: 'Ở lại', effects: { happiness: -1 }, flags: ['o_lai_cong_ty_cu'],
        text: 'Tôi ở lại, công việc ổn định. Một năm sau công ty kia phá sản. Tôi vừa thở phào vừa thấy tiếc cái cảm giác mà mình đã không thử.' },
    ],
  },
  {
    id: 'ls39-viec-xa-nha', age: 39, needs: ['notEmployed'],
    title: 'Việc ở công trường xa',
    text: 'Có một công việc ở công trường cách nhà ba trăm cây số, ăn ở tại chỗ, ba tháng về một lần, lương khá. Ở nhà tôi đã nhiều tháng không có thu nhập ổn định. Người giới thiệu cần câu trả lời trong hai ngày.',
    choices: [
      { label: 'Đi làm xa', effects: { health: -2, happiness: -1 }, money: 15000000, flags: ['di_cong_truong'],
        text: 'Lán trại nóng, đêm nằm nghe tiếng máy trộn bê tông. Ba tháng sau về nhà, tôi đen nhẻm, gầy rộc, trong túi có tiền. Ở nhà, mọi người nhìn tôi như nhìn một người khách.' },
      { label: 'Ở lại tìm việc gần nhà', effects: { happiness: 1 },
        text: 'Tôi nhận những việc vặt quanh khu. Tiền ít nhưng tối nào cũng về nhà. Có hôm đi ngang công trường gần nhà, tôi đứng nhìn rất lâu.' },
    ],
  },
  {
    id: 'ls39-con-tuoi-day-thi', age: 39, needs: ['children'], childAge: [11, 15],
    title: 'Cánh cửa đóng',
    text: '{tenCon} vào tuổi dậy thì, đi học về là vào phòng đóng cửa. Hỏi gì cũng trả lời một chữ. Tối nay tôi đi ngang, nghe qua cửa phòng tiếng con khóc nhỏ.',
    choices: [
      { label: 'Gõ cửa, xin vào', effects: { happiness: 1 }, flags: ['go_cua_con'],
        text: '{tenCon} không mở. Tôi ngồi ngoài cửa, nói tôi ở đây. Một lúc lâu sau cửa mở. {tenCon} không kể gì, chỉ ngồi xuống cạnh tôi, ngả đầu vào vai.' },
      { label: 'Để yên, sáng mai hỏi', effects: { happiness: -1 },
        text: 'Sáng ra, {tenCon} đi học bình thường, mắt hơi sưng. Tôi hỏi, con nói không có gì. Tôi để ý thêm mấy tuần, không thấy con khóc nữa, hoặc không nghe thấy.' },
    ],
  },
  {
    id: 'ls39-hon-nhan-mot-nua', age: 39, needs: ['partner'],
    title: 'Chuyện sinh nhật bốn mươi',
    text: '{tenBanDoi} muốn tổ chức sinh nhật bốn mươi cho tôi thật to, mời cả họ hàng, bạn bè, đồng nghiệp. Tôi chỉ muốn một bữa tối yên tĩnh. {tenBanDoi} đã lén đặt nhà hàng, giờ mới nói.',
    choices: [
      { label: 'Đồng ý, cảm ơn', effects: { happiness: 1 },
        text: 'Tối đó đông vui, tôi cười tới mỏi miệng. Về nhà, {tenBanDoi} ngủ ngay vì mệt. Tôi ngồi một mình ở bếp, ăn miếng bánh kem còn sót, thấy vừa đủ.' },
      { label: 'Nói thật mình muốn gì', effects: { happiness: 2 }, flags: ['sinh_nhat_yen_tinh'],
        text: '{tenBanDoi} hơi buồn, rồi hủy nhà hàng. Hai đứa ăn tối ở quán quen thời mới yêu. Bà chủ quán vẫn nhớ hai đứa, mang ra món cũ.' },
    ],
  },
  {
    id: 'ls39-mot-minh-bon-muoi', age: 39, needs: ['single'],
    title: 'Mua một căn nhà nhỏ ở quê',
    text: 'Sắp bốn mươi, tôi tính mua một mảnh đất nhỏ ở quê để sau này về ở. Ai cũng nói người độc thân mua đất ở quê làm gì, già rồi ai chăm. Tôi chỉ muốn có một chỗ yên tĩnh.',
    choices: [
      { label: 'Mua, trồng cây trước', effects: { happiness: 2 }, flags: ['dat_que'],
        text: 'Tôi trồng một hàng mít, một cây xoài, mỗi tháng về một lần. Cây lớn chậm. Người hàng xóm già bên cạnh trông giúp, đổi lại tôi mang cho bà ít thuốc bổ.' },
      { label: 'Để dành tiền', effects: { intelligence: 1 },
        text: 'Tiền vẫn nằm trong ngân hàng. Thỉnh thoảng tôi xem tin bán đất ở quê, giá mỗi năm một cao. Tôi lưu lại vài tin, rồi không gọi.' },
    ],
  },

  // ───────────── Chuỗi ─────────────
  {
    id: 'ls-con-hoc-boi', ages: [33, 39], requiresAny: ['khong_biet_boi', 'nhan_khong_biet_boi', 'gia_dau_bung'], needs: ['children'], childAge: [5, 10],
    title: 'Con muốn học bơi',
    text: '{tenCon} muốn học bơi, lớp yêu cầu ba mẹ xuống nước cùng con những buổi đầu. Tôi chưa bao giờ biết bơi, từ cái hè ngồi trên thành hồ năm bảy tuổi. {tenCon} không biết chuyện đó.',
    choices: [
      { label: 'Xuống nước cùng con', effects: { health: 2, happiness: 2 }, flags: ['hoc_boi_cung_con'],
        text: 'Buổi đầu tôi bám thành hồ, {tenCon} bơi vòng quanh cười. Hai tháng sau, tôi với {tenCon} cùng bơi được hết chiều ngang hồ. Tôi gọi điện kể cho ba, ba cười rất lâu.' },
      { label: 'Nhờ người khác xuống cùng', effects: { happiness: -1 },
        text: 'Một người bà con xuống nước cùng {tenCon}. Tôi ngồi trên thành hồ, thả chân xuống nước như năm bảy tuổi. {tenCon} vẫy tôi từ giữa hồ.' },
    ],
  },
  {
    id: 'ls-con-xin-cho', ages: [33, 42], requiresAny: ['so_cho', 'khong_so_cho', 'nuoi_cho_vang'], needs: ['children'], childAge: [6, 13],
    title: 'Con xin nuôi chó',
    text: '{tenCon} năn nỉ nuôi một con chó, hứa tự cho ăn, tự dọn. Nhà ở khá chật, ai cũng đi cả ngày. Tôi nhớ những ngày tuổi thơ có một con chó ở nhà, và nhớ cả lúc phải chia tay nó.',
    choices: [
      { label: 'Đồng ý', effects: { happiness: 3 }, flags: ['con_nuoi_cho'],
        text: '{tenCon} đặt tên con chó là Vàng, dù nó lông đen. Tháng đầu con làm đủ mọi việc. Sau đó tôi làm phần nhiều hơn. Tôi nhớ có người cũng từng làm vậy cho mình.' },
      { label: 'Hẹn khi nào nhà rộng hơn', effects: { happiness: -1 },
        text: '{tenCon} buồn mấy ngày, rồi xin đi chơi với con chó nhà hàng xóm mỗi chiều. Có hôm tôi thấy con ngồi ôm nó ở bậc cửa nhà người ta.' },
    ],
  },
  {
    id: 'ls-tu-vay-tien', ages: [33, 42], requiresAny: ['tu_noi_lai', 'tu_ket_ban_im'], minMoney: 30000000,
    title: 'Tú hỏi vay tiền',
    text: 'Tú gọi, giọng ngập ngừng. Tiệm sửa xe bị cháy, Tú cần ba mươi triệu để làm lại, ngân hàng không cho vay. Tú nói hỏi tôi vì tôi là người duy nhất Tú dám hỏi. Ba mươi triệu là phần lớn số tiền tôi có.',
    choices: [
      { label: 'Cho vay đủ', effects: { happiness: 2 }, money: -30000000, lend: 'tu', repayAfter: 3, flags: ['cho_tu_vay'],
        text: 'Tiệm mở lại sau hai tháng. Mỗi tháng Tú chuyển trả một ít, kèm tin nhắn kể chuyện tiệm. Ba năm sau trả đủ. Tết đó Tú gửi lên một bao gạo quê nặng tới nỗi bưu điện phải khiêng.' },
      { label: 'Cho vay một nửa', effects: { happiness: 1 }, money: -15000000, lend: 'tu', repayAfter: 2, flags: ['cho_tu_vay_mot_nua'],
        text: 'Tú cảm ơn, nói sẽ xoay phần còn lại. Tiệm mở lại nhỏ hơn trước. Tú trả đủ sau hai năm, không chậm tháng nào.' },
      { label: 'Từ chối', effects: { happiness: -2 }, flags: ['tu_choi_tu'],
        text: 'Tú nói “không sao, tao hiểu mà”. Sau đó Tú ít nhắn hẳn. Một năm sau, tôi thấy ảnh tiệm mới của Tú trên mạng, có ghi lời cảm ơn những người đã giúp.' },
    ],
  },
  {
    id: 'ls-nhan-cua-ba', ages: [30, 45], requiresAny: ['giu_nhan_ba', 'nhan_ba_cong_khai'],
    title: 'Chiếc nhẫn của bà',
    text: 'Cô út giờ đã già, gọi điện hỏi tôi còn giữ chiếc nhẫn bạc của bà không. Con gái cô sắp cưới, cô muốn mượn cho cháu đeo trong ngày cưới, để có chút gì của bà. Chiếc nhẫn tôi vẫn cất trong hộp, chưa từng rời tay.',
    choices: [
      { label: 'Tặng luôn cho em họ', effects: { happiness: 2 }, flags: ['tang_nhan_ba'],
        text: 'Ngày cưới, em họ đeo chiếc nhẫn mòn bên cạnh nhẫn cưới mới. Cô út khóc khi kể chuyện bà. Tôi về nhà, mở cái hộp trống, thấy nhẹ hơn mình tưởng.' },
      { label: 'Cho mượn, hẹn trả lại', effects: { happiness: 1 }, flags: ['cho_muon_nhan_ba'],
        text: 'Cô út trả lại chiếc nhẫn sau đám cưới, bọc trong khăn lụa, kèm tấm ảnh em họ đeo nhẫn. Tôi kẹp tấm ảnh vào trong nắp hộp.' },
    ],
  },
  {
    id: 'ls-khoa-bac-si', ages: [30, 45], requiresAny: ['cuu_khoa', 'goi_nguoi_lon', 'nhan_khong_biet_boi'],
    title: 'Người bác sĩ quen mặt',
    text: 'Tôi vào viện cấp cứu vì đau bụng dữ dội. Bác sĩ trực là Khoa, đứa bạn cùng lớp trong chuyến đi biển năm nào. Khoa nói phải mổ ruột thừa ngay, nhưng phòng mổ đang có ca khác, phải chờ hai tiếng, hoặc chuyển sang viện khác.',
    choices: [
      { label: 'Ở lại chờ Khoa mổ', effects: { health: 2, happiness: 2 }, flags: ['khoa_mo'],
        text: 'Hai tiếng đau tưởng không qua. Khoa mổ cho tôi lúc nửa đêm. Sáng ra Khoa ghé, ngồi ở mép giường, nói: “Lần này tới lượt tao.” Hai đứa cười, đau cả vết mổ.' },
      { label: 'Chuyển viện cho nhanh', effects: { health: 1 },
        text: 'Tôi được mổ sớm hơn một tiếng ở viện khác. Khoa nhắn hỏi thăm mỗi ngày tới khi tôi xuất viện. Hai đứa hẹn đi cà phê, rồi mỗi người một việc, chưa đi được.' },
    ],
  },
  {
    id: 'ls-quan-tiem-hoa', ages: [30, 45], requires: ['chia_hoa_quan'],
    title: 'Tiệm hoa của Quân',
    text: 'Tôi ghé một tiệm hoa nhỏ để mua hoa tặng người thân. Chủ tiệm là Quân, cậu bạn mẫu giáo đứng tay không ngày Nhà giáo năm nào. Quân nhận ra tôi, gói bó hoa thật đẹp, rồi nhất định không lấy tiền.',
    choices: [
      { label: 'Nhận bó hoa', effects: { happiness: 3 }, flags: ['nhan_hoa_quan'],
        text: 'Quân kể mẹ Quân vẫn nhớ chuyện bó hoa ấy, kể cho cả nhà nghe nhiều lần. Từ đó dịp nào cần hoa, tôi đều ghé tiệm Quân, và lần nào cũng trả tiền.' },
      { label: 'Nhất định trả tiền', effects: { happiness: 1 },
        text: 'Hai đứa đẩy qua đẩy lại tờ tiền. Cuối cùng Quân nhận, rồi bỏ thêm vào bó hoa mấy cành hồng. Quân nói: “Nửa bó này là của năm đó.”' },
    ],
  },
  {
    id: 'ls-thuyen-go', ages: [30, 90], requires: ['thuyen_go'], needs: ['fatherGone'],
    title: 'Con thuyền gỗ',
    text: 'Dọn lại đồ của ba, tôi tìm thấy con thuyền gỗ nhỏ ba mang về sau chuyến công tác năm tôi ba tuổi. Ba cất nó trong hộp, bọc giấy báo cũ, kèm tờ giấy ghi ngày tháng bằng nét chữ của ba. Người nhà hỏi tôi có giữ không.',
    choices: [
      { label: 'Đặt lên bàn thờ ba', effects: { happiness: 2 }, flags: ['thuyen_go_ban_tho'],
        text: 'Con thuyền đặt cạnh di ảnh của ba. Mỗi lần thắp nhang, tôi nhìn nó, nhớ tiếng râu ba cọ vào má. Tôi không kể với ai chuyện ngày ấy mình đã đứng nép sau lưng mẹ.' },
      { label: 'Để trên bàn làm việc', effects: { happiness: 1, intelligence: 1 },
        text: 'Tôi đặt con thuyền cạnh máy tính. Đồng nghiệp hỏi, tôi kể. Có hôm mệt, tôi cầm nó lên, lật qua lật lại, rồi đặt về chỗ cũ.' },
    ],
  },
  {
    id: 'ls-so-lixi-me', ages: [30, 90], requires: ['giu_so_lixi'], needs: ['motherGone'],
    title: 'Cuốn sổ của mẹ',
    text: 'Mẹ mất đã một thời gian. Tôi lấy ra cuốn sổ lì xì mẹ ghi từ năm tôi năm tuổi. Đọc lại, tôi thấy ở trang cuối có thêm vài dòng mẹ viết sau này, về những năm tôi đã lớn.',
    choices: [
      { label: 'Đọc hết một lần', effects: { happiness: 1 }, flags: ['doc_so_me'],
        text: 'Mẹ ghi: “Năm nay con không về Tết. Mẹ để phần bánh trong tủ.” Và: “Con gọi điện, nói mệt. Mẹ không ngủ được.” Tôi đọc tới khuya, gấp sổ lại, ngồi rất lâu.' },
      { label: 'Để dành, mỗi năm đọc một trang', effects: { happiness: 2 }, flags: ['doc_so_me_tung_trang'],
        text: 'Mỗi năm vào ngày giỗ mẹ, tôi đọc một trang. Như thể mẹ vẫn còn gửi cho tôi một lá thư mỗi năm, viết vội, nét chữ nghiêng nghiêng.' },
    ],
  },
  {
    id: 'ls-dam-gio-con', ages: [33, 42], requires: ['noi_doi_dam_gio'], needs: ['children'], childAge: [8, 13],
    title: 'Câu hỏi ở đám giỗ, lần nữa',
    text: 'Đám giỗ đông người. Ông chú họ hỏi {tenCon} thi được mấy điểm, rồi kể cháu nội ông toàn điểm mười. {tenCon} liếc nhìn tôi. Tôi biết con được bảy điểm. Tôi nhớ có một đám giỗ như vậy năm tôi chín tuổi.',
    choices: [
      { label: 'Nói đỡ cho con', effects: { happiness: 1 }, flags: ['do_loi_con'],
        text: 'Tôi nói {tenCon} học Văn rất khá, cô khen bài văn tả mẹ. Ông chú gật gù. Về nhà, {tenCon} hỏi sao lúc đó tôi không để con tự trả lời.' },
      { label: 'Để con tự trả lời', effects: { intelligence: 1 }, flags: ['de_con_tu_noi'],
        text: '{tenCon} nói: “Dạ bảy điểm.” Ông chú cười, gắp cho con miếng thịt. Trên đường về, tôi nói với con: “Con nói thật, ba mẹ thấy con giỏi.” {tenCon} cười, không hiểu lắm.' },
    ],
  },
  {
    id: 'ls-cousin-repayment', ages: [38, 48], requires: ['cho_anh_ho_vay'],
    title: 'Người anh họ trả nợ',
    text: 'Anh họ ghé lại, mang theo số tiền còn nợ. Anh nói việc làm ăn đã ổn, lần này muốn trả cho rõ ràng.',
    choices: [
      { label: 'Nhận tiền trả nợ', repayLoan: 'cousin', effects: { happiness: 1 },
        text: 'Tôi nhận lại tiền, ghi vào sổ khoản vay đã trả đủ. Hai anh em ngồi uống trà, lần này nhẹ lòng hơn.' },
      { label: 'Để anh giữ thêm một thời gian', effects: {},
        text: 'Tôi bảo anh cứ giữ tiền để xoay xở thêm. Khoản cho vay vẫn còn trong sổ, chưa được coi là trả đủ.' },
    ],
  },
];
