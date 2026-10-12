// Giai đoạn 26–32 tuổi. Mỗi tuổi: 3 sự kiện chung + phiên bản theo hoàn cảnh (đang yêu / đã cưới / độc thân…).
// Quy tắc viết: docs/su-kien-doi-thuong/SO-TAY.md.
export const stage26To32 = [
  // ───────────── 26 tuổi ─────────────
  {
    id: 'ls26-tien-thue', age: 26,
    title: 'Chủ nhà tăng giá',
    text: 'Chủ nhà báo từ tháng sau tăng tiền thuê thêm một triệu rưỡi. Ở lại thì phải bớt khoản mỗi tháng tôi vẫn gửi về nhà. Có một phòng rẻ hơn ở ngoại ô, nhưng mỗi ngày đi làm sẽ mất thêm một tiếng. Tôi phải trả lời chủ nhà trong tuần này.',
    choices: [
      { label: 'Ở lại, bớt tiền gửi về', effects: { happiness: -1 }, flags: ['bot_tien_gui_ve'],
        text: 'Tôi nhắn về nhà, nói tháng này công việc chậm. Ở nhà trả lời “ừ, không sao”. Từ đó tháng nào tôi cũng thấy mình nói dối một chút.' },
      { label: 'Dọn ra ngoại ô', effects: { health: -2, happiness: 1 }, flags: ['o_ngoai_o'],
        text: 'Phòng mới rộng hơn, có cửa sổ nhìn ra ruộng rau. Mỗi sáng tôi chen xe buýt một tiếng. Có hôm về tới nhà đã chín giờ, chỉ kịp tắm rồi ngủ.' },
    ],
  },
  {
    id: 'ls26-lam-chung', age: 26,
    title: 'Biển số xe',
    text: 'Trên đường về, tôi thấy một chiếc ô tô quẹt ngã người đi xe máy rồi chạy luôn. Tôi kịp nhớ biển số. Người bị ngã ngồi dậy được, chân chảy máu. Mọi người xúm lại, có người hỏi ai thấy biển số xe.',
    choices: [
      { label: 'Đứng ra làm chứng', effects: { happiness: 1, health: -1 }, flags: ['lam_chung'],
        text: 'Tôi lên công an ba buổi để khai và nhận dạng. Chủ xe tìm được số tôi, gọi điện xin “thông cảm”. Tôi không nghe máy nữa. Người bị ngã nhắn cảm ơn kèm ảnh cái chân đã bó bột.' },
      { label: 'Đọc biển số rồi đi', effects: { intelligence: 1 },
        text: 'Tôi đọc biển số cho người đang gọi điện báo công an, rồi rời đi trước khi ai kịp hỏi tên. Tối đó tôi lên mạng tìm tin vụ tai nạn, không thấy gì.' },
      { label: 'Lặng lẽ đi về', effects: { happiness: -2 }, flags: ['ngo_lo'],
        text: 'Tôi đi về, tự nhủ thế nào cũng có người khác thấy. Mấy hôm sau trên nhóm cư dân có bài tìm nhân chứng. Bài viết chưa ai trả lời.' },
    ],
  },
  {
    id: 'ls26-hop-lop', age: 26,
    title: 'Hóa đơn họp lớp',
    text: 'Họp lớp mười năm. Đứa giờ làm giám đốc nói to chuyện thu nhập. Đứa học giỏi nhất lớp ngày xưa đang thất nghiệp, chỉ uống nước lọc. Cuối buổi, lớp trưởng đề nghị chia đều, mỗi người bảy trăm nghìn. Tôi thấy đứa thất nghiệp cúi xuống mở ví.',
    choices: [
      { label: 'Chia đều như lớp trưởng nói', effects: { happiness: -1 },
        text: 'Ai cũng chuyển khoản. Đứa thất nghiệp chuyển sau cùng, đứng dậy về trước. Nhóm chat lớp vẫn rôm rả ảnh tối hôm đó, không có ảnh nào của nó.' },
      { label: 'Lặng lẽ trả phần của nó', effects: { happiness: 2 }, flags: ['tra_thay_ban'],
        text: 'Tôi chuyển gấp đôi, nhắn riêng lớp trưởng. Đứa thất nghiệp không biết. Nửa năm sau nó có việc, nhắn rủ tôi ăn tối, nói “tao mời”.' },
      { label: 'Đề nghị ai thu nhập cao bao', effects: { intelligence: 1, happiness: -1 },
        text: 'Cả bàn im một giây. Đứa giám đốc cười, nói “được thôi”, rồi trả hết. Bữa tiệc tan nhanh hơn dự định. Có người nói tôi làm mất vui.' },
    ],
  },
  {
    id: 'ls26-song-chung', age: 26, needs: ['dating', 'father', 'mother'],
    title: 'Dọn về chung',
    text: '{tenBanDoi} muốn hai đứa dọn về ở chung cho đỡ tiền thuê. Ba mẹ tôi chưa biết hai đứa nghiêm túc tới mức nào. Họ hàng nhà tôi thì vẫn coi chuyện chưa cưới mà ở chung là điều không hay.',
    choices: [
      { label: 'Dọn về chung, nói với ba mẹ', effects: { happiness: 1 }, flags: ['song_chung_cong_khai'],
        text: 'Ba im cả cuộc gọi. Mẹ hỏi han {tenBanDoi} đủ thứ, rồi gửi lên một thùng đồ khô. Họ hàng biết, bàn tán một thời gian rồi cũng thôi.' },
      { label: 'Dọn về chung, giấu ba mẹ', effects: { happiness: 2 }, flags: ['song_chung_giau'],
        text: 'Mỗi lần mẹ gọi video, {tenBanDoi} phải tránh ra khỏi khung hình. Có lần mẹ thấy đôi dép lạ ở góc phòng, hỏi của ai. Tôi nói của bạn để quên.' },
      { label: 'Chưa, đợi thêm', effects: { happiness: -1 },
        text: '{tenBanDoi} nói “ừ, cũng được”, nhưng mấy tuần sau ít ghé chỗ tôi hơn. Tiền thuê nhà mỗi đứa vẫn tự lo.' },
    ],
  },
  {
    id: 'ls26-tai-khoan-chung', age: 26, needs: ['married'],
    title: 'Tài khoản chung',
    text: 'Cưới nhau chưa lâu, {tenBanDoi} đề nghị gộp hết lương vào một tài khoản, ai cần gì thì nói. Tôi quen tự lo tiền từ năm mười tám. Mỗi tháng tôi vẫn gửi về nhà một khoản nhỏ, chưa kể với {tenBanDoi}.',
    choices: [
      { label: 'Gộp hết, kể chuyện gửi về nhà', effects: { happiness: 1 }, flags: ['tai_khoan_chung'],
        text: '{tenBanDoi} hơi khựng lại, rồi nói cứ gửi, ghi vào sổ chung là được. Tháng sau, {tenBanDoi} tự đề nghị gửi thêm dịp giỗ ông.' },
      { label: 'Gộp một phần, giữ riêng một phần', effects: { intelligence: 1 },
        text: 'Hai đứa thỏa thuận mỗi người giữ lại một khoản riêng. Không ai hỏi ai tiêu gì. Đôi khi tôi tự hỏi {tenBanDoi} giữ riêng để làm gì.' },
      { label: 'Gộp hết, vẫn lén gửi về', effects: { happiness: -2 }, flags: ['giau_tien_gui_ve'],
        text: 'Tôi gửi từ tiền thưởng, nói là công ty chưa trả. Mỗi lần {tenBanDoi} xem sổ chi tiêu, tôi lại đi pha trà.' },
    ],
  },
  {
    id: 'ls26-xem-mat', age: 26, needs: ['neverMarried', 'mother'],
    title: 'Buổi cà phê mẹ hẹn',
    text: 'Mẹ nhờ người quen giới thiệu cho tôi một người, hẹn cà phê sáng chủ nhật. Tôi không có hứng gặp, nhưng mẹ đã hứa với người ta. Đây là lần thứ ba mẹ gọi nhắc trong tuần.',
    choices: [
      { label: 'Đi cho mẹ vui', effects: { happiness: -1 },
        text: 'Người kia cũng đi vì mẹ. Hai đứa nhận ra điều đó sau năm phút, rồi nói chuyện thoải mái hơn hẳn. Về, tôi nhắn mẹ: “Người ta tốt, nhưng không hợp.”' },
      { label: 'Hủy hẹn, nói thật với mẹ', effects: { happiness: 1 }, flags: ['tu_choi_xem_mat'],
        text: 'Mẹ phải gọi xin lỗi người quen. Mẹ không trách, chỉ nói: “Mẹ sợ con một mình.” Tôi nói con không sao. Cả hai đều biết câu đó chưa trả lời câu kia.' },
    ],
  },

  // ───────────── 27 tuổi ─────────────
  {
    id: 'ls27-loi-chuc', age: 27,
    title: 'Lời chúc trên sân khấu',
    text: 'Bạn thân cưới, nhờ tôi lên đọc lời chúc. Tôi biết người sắp cưới bạn ấy từng ngoại tình hồi hai người mới quen, chuyện đã qua hai năm, bạn tôi không hề biết. Đám cưới còn ba ngày.',
    choices: [
      { label: 'Kể cho bạn biết', effects: { happiness: -2 }, flags: ['ke_chuyen_ngoai_tinh'],
        text: 'Bạn tôi khóc cả đêm, rồi vẫn cưới, nói người kia đã thay đổi. Lời chúc được giao cho người khác đọc. Từ đó bạn ấy ít mời tôi tới nhà.' },
      { label: 'Im lặng, đọc lời chúc', effects: { happiness: -1 }, flags: ['giu_bi_mat_cuoi'],
        text: 'Tôi đọc lời chúc, cả hội trường vỗ tay. Bạn tôi ôm tôi khóc. Nhìn nụ cười của người kia, tôi uống cạn ly rượu.' },
      { label: 'Gặp riêng người kia trước', effects: { intelligence: 1 }, flags: ['noi_rieng_chu_re'],
        text: 'Người kia tái mặt, rồi xin tôi đừng nói. Đêm trước đám cưới, chính người ấy tự kể với bạn tôi. Đám cưới vẫn diễn ra, chậm mất một tiếng.' },
    ],
  },
  {
    id: 'ls27-phong-ben', age: 27,
    title: 'Tiếng đồ vỡ phòng bên',
    text: 'Đêm nào phòng bên cũng có tiếng quát, tiếng đồ vỡ. Sáng nay tôi gặp chị hàng xóm ở hành lang, má bầm tím, chị cúi mặt đi nhanh. Đêm qua tôi nghe chị khóc tới gần sáng.',
    choices: [
      { label: 'Gõ cửa hỏi chị cần giúp không', effects: { happiness: 1 }, flags: ['giup_chi_hang_xom'],
        text: 'Chị nói không sao, nhưng lấy số điện thoại của tôi. Một tháng sau, nửa đêm chị nhắn: “Em mở cửa giúp chị.” Chị ngồi phòng tôi tới sáng, rồi về nhà mẹ đẻ.' },
      { label: 'Gọi báo công an khu vực', effects: { intelligence: 1, happiness: -1 }, flags: ['bao_cong_an'],
        text: 'Công an tới nhắc nhở. Mấy đêm sau yên ắng. Rồi tiếng quát lại bắt đầu. Anh hàng xóm nhìn tôi ở cầu thang, không nói gì.' },
      { label: 'Không can thiệp', effects: { happiness: -2 },
        text: 'Tôi đeo tai nghe đi ngủ. Ba tháng sau, phòng bên trả phòng. Chủ nhà kể chị đã bỏ đi trước đó một tuần, không mang theo gì.' },
    ],
  },
  {
    id: 'ls27-khoa-hoc-toi', age: 27,
    title: 'Một năm học buổi tối',
    text: 'Tôi muốn học thêm một khóa buổi tối, kéo dài một năm, học phí bằng hai tháng lương. Học xong, cơ hội lên lương rõ hơn. Nhưng một năm đó, gần như tối nào cũng ở trên lớp, không còn thời gian cho ai.',
    choices: [
      { label: 'Đăng ký học', salaryMonths: 2, effects: { intelligence: 3, happiness: -2 }, flags: ['hoc_buoi_toi'],
        text: 'Tôi đi học cả năm, có tối ngủ gật trên lớp. Bạn bè rủ đi chơi, tôi từ chối riết rồi tụi nó thôi rủ. Ngày nhận bằng, tôi chụp ảnh một mình ở cổng trường.' },
      { label: 'Tự học trên mạng', effects: { intelligence: 1, happiness: 1 },
        text: 'Tôi học vào cuối tuần, tuần nào bận thì bỏ. Kiến thức có thêm, nhưng không có tấm bằng. Hồ sơ năm sau vẫn trống ở dòng đó.' },
    ],
  },
  {
    id: 'ls27-ngay-ky-niem', age: 27, needs: ['dating'],
    title: 'Ngày kỷ niệm bị quên',
    text: '{tenBanDoi} quên ngày kỷ niệm hai năm, tối đó đi ăn với đồng nghiệp tới khuya. Sáng nay {tenBanDoi} hỏi tôi muốn ăn gì, như chưa có chuyện gì. Tôi đã đặt bàn từ tuần trước.',
    choices: [
      { label: 'Nói thẳng là mình buồn', effects: { happiness: 1 }, flags: ['noi_thang_ky_niem'],
        text: '{tenBanDoi} sững người, xin lỗi, rồi hủy cuộc họp chiều để đi ăn bù. Bữa ăn hơi gượng. Năm sau, {tenBanDoi} đặt nhắc lịch trước một tuần.' },
      { label: 'Bỏ qua, coi như không sao', effects: { happiness: -2 }, flags: ['nuot_buon'],
        text: 'Tôi nói muốn ăn phở. Hai đứa ăn sáng bình thường. Tối đó tôi hủy cái bàn đã đặt, chỉ có mình tôi biết.' },
    ],
  },
  {
    id: 'ls27-tet-ben-nao', age: 27, needs: ['married', 'mother'],
    title: 'Tết bên nào',
    text: 'Tết này về quê bên nào? Hai nhà cách nhau ba trăm cây số. Năm ngoái đã ăn Tết bên {tenBanDoi}. Hôm qua mẹ tôi gọi hỏi, giọng rất mong. Hôm nay mẹ {tenBanDoi} cũng gọi.',
    choices: [
      { label: 'Về nhà mình', effects: { happiness: 2 }, flags: ['tet_nha_minh'],
        text: '{tenBanDoi} đồng ý nhưng ít nói suốt đường về. Đêm giao thừa, {tenBanDoi} ra sân gọi điện về nhà rất lâu. Mẹ tôi gói thêm một đòn bánh để mang biếu bên kia.' },
      { label: 'Về nhà {tenBanDoi}', effects: { happiness: -1 }, flags: ['tet_nha_ben_kia'],
        text: 'Mẹ tôi nói “ừ, phải công bằng”. Mùng một, mẹ gửi ảnh mâm cơm có hai cái chén úp, chừa chỗ cho hai đứa. Tôi xem rồi cất điện thoại.' },
      { label: 'Chia đôi, mỗi bên vài ngày', effects: { health: -2, happiness: 1 },
        text: 'Mùng một ở bên này, mùng ba chạy xe sang bên kia. Hai ngày Tết nằm trên xe. Nhà nào cũng nói “sao về ít vậy”.' },
    ],
  },
  {
    id: 'ls27-con-meo', age: 27, needs: ['single'],
    title: 'Con mèo mười tuổi',
    text: 'Tôi sống một mình đã mấy năm. Đồng nghiệp sắp ra nước ngoài, nhờ tôi nhận nuôi con mèo mười tuổi, hay ốm. Nếu không ai nhận, nó sẽ phải vào trại. Tôi thường đi công tác, nhà thì nhỏ.',
    choices: [
      { label: 'Nhận nuôi', effects: { happiness: 3 }, flags: ['nuoi_meo_gia'],
        text: 'Con mèo trốn gầm giường cả tuần đầu. Mỗi lần đi công tác, tôi phải nhờ người qua cho ăn. Tối về, nó nằm trên ngực tôi ngủ, nặng trịch.' },
      { label: 'Giúp tìm người khác', effects: { intelligence: 1 },
        text: 'Tôi đăng bài trên mấy nhóm, hai tuần sau có một bà cụ nhận. Bà gửi ảnh con mèo nằm trên chiếu. Tôi lưu tấm ảnh lại.' },
    ],
  },

  // ───────────── 28 tuổi ─────────────
  {
    id: 'ls28-xe-bi-trom', age: 28,
    title: 'Chiếc xe ở cửa',
    text: 'Sáng ra, chiếc xe máy dựng trước cửa đã biến mất. Camera nhà bên quay được mặt kẻ trộm. Hàng xóm nhận ra đó là con trai bà cụ bán xôi đầu đường, nghiện đã lâu. Bà cụ sống một mình, nuôi nó.',
    choices: [
      { label: 'Trình báo công an', effects: { happiness: -1 }, flags: ['bao_trom'],
        text: 'Thằng con bị bắt sau hai ngày, xe đã bán mất. Bà cụ tới nhà tôi, đặt lên bàn túi xôi, không nói gì rồi đi. Từ đó tôi đi đường khác để khỏi qua sạp xôi.' },
      { label: 'Tới gặp bà cụ', effects: { happiness: 1 }, flags: ['gap_ba_ban_xoi'],
        text: 'Bà cụ khóc, xin trả dần tiền xe, mỗi tháng năm trăm nghìn. Tháng nào bà cũng mang tiền tới đúng hẹn, kèm gói xôi. Tôi nhận tiền mà nuốt xôi không trôi.' },
      { label: 'Bỏ qua, mua xe cũ', effects: { happiness: -2 },
        text: 'Tôi mua chiếc xe cũ, sắm thêm hai ổ khóa. Mỗi sáng đi ngang sạp xôi, bà cụ cúi đầu. Có lần bà gọi với theo, tôi giả như không nghe.' },
    ],
  },
  {
    id: 'ls28-khoi-u', age: 28,
    title: 'Khối nhỏ ở cổ',
    text: 'Khám sức khỏe định kỳ, bác sĩ thấy một khối nhỏ ở tuyến giáp, nói nhiều khả năng lành tính. Có thể chọc sinh thiết cho chắc, hơi đau, mất hai ngày nghỉ. Hoặc theo dõi sáu tháng rồi siêu âm lại.',
    choices: [
      { label: 'Làm sinh thiết ngay', effects: { health: 1, happiness: 1 }, flags: ['sinh_thiet'],
        text: 'Một tuần chờ kết quả, đêm nào tôi cũng đọc tin trên mạng tới hai giờ sáng. Kết quả lành tính. Tôi ra cổng bệnh viện ngồi ăn một tô bún, ăn rất chậm.' },
      { label: 'Theo dõi sáu tháng', effects: { happiness: -1 }, flags: ['theo_doi_khoi'],
        text: 'Sáu tháng trôi qua bình thường, nhưng mỗi lần sờ lên cổ tôi lại nhớ tới nó. Siêu âm lại, khối không lớn thêm. Bác sĩ hẹn một năm sau.' },
    ],
  },
  {
    id: 'ls28-bao-hiem-ban', age: 28,
    title: 'Hợp đồng của bạn cũ',
    text: 'Người bạn cũ giờ bán bảo hiểm, rủ tôi mua một gói mỗi năm hai chục triệu, nói đang thiếu doanh số, cuối tháng không đạt sẽ mất việc. Tôi không cần gói đó lắm. Những tháng đầu lên thành phố, bạn ấy đã cho tôi ở nhờ.',
    choices: [
      { label: 'Mua giúp bạn', effects: { happiness: 1 }, flags: ['mua_bao_hiem_ban'],
        text: 'Bạn ấy giữ được việc, nhắn cảm ơn rất dài. Năm sau tới hạn đóng, tôi đọc kỹ hợp đồng mới thấy nhiều điều khoản mình không hiểu. Tôi vẫn đóng.' },
      { label: 'Từ chối, nói thật', effects: { intelligence: 1, happiness: -1 },
        text: 'Bạn ấy nói “tao hiểu”. Cuối tháng bạn ấy nghỉ việc, chuyển sang bán hàng online. Hai đứa vẫn nhắn hỏi thăm, ngày sinh nhật vẫn gọi.' },
    ],
  },
  {
    id: 'ls28-ba-cu-phong-ben', age: 28,
    title: 'Cánh cửa không mở',
    text: 'Bà cụ ở phòng bên sống một mình. Ba hôm nay không thấy bà mở cửa, đèn trong phòng vẫn sáng. Tôi gõ mãi không ai trả lời. Chủ nhà về quê, cửa khóa trong.',
    choices: [
      { label: 'Gọi người phá cửa', effects: { happiness: 1 }, flags: ['cuu_ba_cu'],
        text: 'Bà cụ nằm dưới sàn, tỉnh nhưng không dậy nổi. Bà được đưa đi viện kịp. Con trai bà ở xa về, cảm ơn tôi rồi đòi chủ nhà đền cái khóa cửa.' },
      { label: 'Gọi công an phường', effects: { intelligence: 1 },
        text: 'Hai tiếng sau công an tới mở cửa. Bà cụ bị ngã từ hôm qua, mất nước. Bà sống, nhưng từ đó phải về ở với con. Phòng bên có người mới dọn tới.' },
    ],
  },
  {
    id: 'ls28-mua-nha', age: 28, needs: ['married'],
    title: 'Hợp đồng vay mười lăm năm',
    text: '{tenBanDoi} muốn vay mua nhà, trả góp mười lăm năm. Tôi xem kỹ giá nhà, tiền trả trước và khoản phải trả hằng năm. Tôi sợ nợ, vì ba mẹ tôi từng khổ nhiều năm vì một khoản vay.',
    choices: [
      { label: 'Đồng ý vay', home: 'story-home', effects: { happiness: 1, health: -1 }, flags: ['vay_mua_nha'],
        text: 'Ngày nhận nhà, {tenBanDoi} đứng giữa phòng trống cười mãi. Đêm đó tôi nằm tính lại khoản trả góp tới gần sáng. Từ đó tôi không dám nghỉ việc ngày nào.' },
      { label: 'Thuê thêm vài năm', effects: { happiness: -1 }, flags: ['thue_them'],
        text: '{tenBanDoi} đồng ý, giọng hụt hẫng. Hai năm sau giá nhà tăng thêm một phần ba. {tenBanDoi} không nhắc chuyện cũ, nhưng xem tin bất động sản rất lâu.' },
      { label: 'Mua căn nhỏ hơn, xa hơn', home: 'story-small-home', effects: { intelligence: 1 }, flags: ['nha_nho_xa'],
        text: 'Căn nhà nhỏ ở rìa thành phố, khoản góp vừa sức. Mỗi ngày hai đứa đi làm thêm bốn mươi phút. Tối về, có ban công nhỏ để ngồi.' },
    ],
  },
  {
    id: 'ls28-hoc-xa', age: 28, needs: ['dating'],
    title: 'Sáu tháng ở xa',
    text: '{tenBanDoi} được công ty cử đi học sáu tháng ở nước ngoài, cơ hội rất hiếm. Đi thì hai đứa yêu xa, lệch múi giờ, đúng lúc tôi đang có nhiều chuyện rối ở nhà. {tenBanDoi} hỏi ý tôi trước khi trả lời công ty.',
    choices: [
      { label: 'Ủng hộ đi', effects: { happiness: -1, intelligence: 1 }, flags: ['ung_ho_di_xa'],
        text: 'Sáu tháng gọi video lúc nửa đêm. Có tuần hai đứa chỉ nhắn được vài câu. Ngày {tenBanDoi} về, tôi ra sân bay sớm hai tiếng.' },
      { label: 'Xin {tenBanDoi} ở lại', effects: { happiness: 1 }, flags: ['giu_lai'],
        text: '{tenBanDoi} từ chối công ty. Năm sau, đồng nghiệp đi chuyến đó được thăng chức. {tenBanDoi} nói không sao, nhưng có lúc nhìn ra cửa sổ rất lâu.' },
    ],
  },
  {
    id: 'ls28-mua-nha-mot-minh', age: 28, needs: ['neverMarried'],
    title: 'Căn nhà cho một người',
    text: 'Tôi dành dụm đủ tiền trả trước một căn hộ nhỏ. Người nhà khuyên đợi lập gia đình rồi hãy mua, mua một mình người ta lại nghĩ mình không định lấy ai. Tôi muốn có một chỗ của riêng mình. Ngân hàng hẹn ký hợp đồng thứ hai tới.',
    choices: [
      { label: 'Ký hợp đồng', home: 'story-small-home', effects: { happiness: 2, health: -1 }, flags: ['nha_rieng'],
        text: 'Tôi tự sơn lại tường, tự lắp cái kệ sách. Đêm đầu ngủ ở nhà mới, phòng im tới mức nghe rõ tiếng tủ lạnh. Tôi để đèn hành lang sáng tới sáng.' },
      { label: 'Hoãn lại', effects: { happiness: -1 },
        text: 'Tôi gửi tiền vào ngân hàng, tiếp tục thuê. Mỗi lần dọn nhà trọ, tôi lại nhìn mấy thùng sách chất đống, tự hỏi lần này phải chờ ai.' },
    ],
  },

  // ───────────── 29 tuổi ─────────────
  {
    id: 'ls29-sep-ky-thay', age: 29, needs: ['employed'],
    title: 'Chữ ký thay sếp',
    text: 'Sếp đi công tác, nhắn tôi ký thay mấy giấy tờ thanh toán cho kịp hạn. Một tờ trong đó có số tiền cao gấp đôi giá tôi biết. Sếp gọi giục, nói làm ngay rồi về sếp giải thích.',
    choices: [
      { label: 'Ký theo lời sếp', effects: { happiness: -2 }, flags: ['ky_thay_sep'],
        text: 'Giấy tờ đi đúng hạn. Sếp về, cảm ơn, không giải thích gì. Ba tháng sau có đoàn kiểm tra. Tên tôi nằm trên tờ giấy ấy.' },
      { label: 'Hỏi lại cho rõ trước khi ký', effects: { intelligence: 2, happiness: -1 }, flags: ['hoi_ro_sep'],
        text: 'Sếp gắt, nói tôi làm chậm việc, rồi nhờ người khác ký. Từ đó tôi không được giao việc gì liên quan tới tiền. Tôi cũng ngủ ngon hơn.' },
    ],
  },
  {
    id: 'ls29-that-nghiep-ban-hang', age: 29, needs: ['notEmployed'],
    title: 'Gian hàng trên mạng',
    text: 'Chưa có việc ổn định, tôi tính bán hàng trên mạng. Một người quen bỏ sỉ mỹ phẩm giá rẻ, nói hàng chính hãng, nhưng không có hóa đơn. Lời gấp đôi. Tôi biết nhiều người vẫn bán kiểu này.',
    choices: [
      { label: 'Nhập hàng bán', effects: { happiness: 1 }, money: 3000000, flags: ['ban_hang_khong_ro'],
        text: 'Tháng đầu bán chạy, tôi có tiền. Tháng thứ ba, một khách nhắn ảnh mặt nổi mẩn đỏ, đòi đền. Tôi trả tiền lại, gỡ hết bài đăng, ngồi nhìn ba thùng hàng trong góc phòng.' },
      { label: 'Tìm nguồn hàng có hóa đơn', effects: { intelligence: 2 },
        text: 'Hàng có hóa đơn lời ít, bán chậm. Ba tháng đầu tôi gần như hòa vốn. Khách cũ quay lại mua lần hai, rồi giới thiệu thêm người.' },
    ],
  },
  {
    id: 'ls29-nhom-hoc-cu', age: 29,
    title: 'Người thầy cũ',
    text: 'Thầy dạy tôi năm cuối cấp bị tai biến, nằm viện. Nhóm lớp cũ kêu gọi góp tiền, mỗi người tùy tâm. Một bạn đề nghị cử vài người tới thăm, chăm thầy luân phiên mỗi tối. Tôi đang rất bận.',
    choices: [
      { label: 'Góp tiền và nhận một tối', money: -2000000, effects: { happiness: 2, health: -1 }, flags: ['cham_thay'],
        text: 'Tối tôi trực, thầy tỉnh một lúc, nhìn tôi rất lâu rồi gọi đúng tên. Thầy nói được nửa câu, hỏi tôi còn viết văn không. Tôi nói còn, dù đã mấy năm không viết.' },
      { label: 'Chỉ góp tiền', effects: { happiness: -1 },
        text: 'Tôi chuyển tiền, ghi lời chúc thầy mau khỏe. Nhóm gửi ảnh mấy bạn trực đêm. Thầy hồi phục chậm, về nhà sau hai tháng.' },
    ],
  },
  {
    id: 'ls29-ba-me-ve-que', age: 29, needs: ['father', 'mother'],
    title: 'Về quê làm',
    text: 'Ba mẹ già đi, gọi điện hỏi tôi có tính về quê làm không, ở gần cho ba mẹ yên tâm. Ở quê thu nhập chỉ bằng một nửa, công việc cũng không đúng sở thích. Ở thành phố, tôi vừa có chút chỗ đứng.',
    choices: [
      { label: 'Về quê', effects: { happiness: 1, intelligence: -1 }, flags: ['ve_que_lam'],
        text: 'Tôi về, làm ở một công ty nhỏ. Chiều nào cũng ăn cơm với ba mẹ. Bạn bè ở thành phố thưa dần. Có tối tôi mở lại tin tuyển dụng ở thành phố, đọc rồi tắt.' },
      { label: 'Ở lại, về thăm thường hơn', effects: { happiness: -1 }, flags: ['o_lai_thanh_pho'],
        text: 'Tôi hứa tháng nào cũng về. Năm đầu về được bảy lần. Năm sau năm lần. Mẹ không trách, chỉ hỏi lần sau về bao lâu.' },
    ],
  },
  {
    id: 'ls29-ghen', age: 29, needs: ['partner'],
    title: 'Tin nhắn lúc nửa đêm',
    text: 'Đêm qua, điện thoại của {tenBanDoi} sáng lên tin nhắn từ đồng nghiệp: “Tối nay vui ghê, cảm ơn nha.” Tối qua {tenBanDoi} nói đi họp. Sáng nay {tenBanDoi} vẫn vui vẻ chuẩn bị đi làm như thường.',
    choices: [
      { label: 'Hỏi thẳng', effects: { happiness: -1 }, flags: ['hoi_tin_nhan'],
        text: '{tenBanDoi} nói cả nhóm đi ăn sau họp, mở ảnh cho tôi xem, có cả sếp. Tôi thở ra. {tenBanDoi} thì im lặng, hỏi sao tôi không tin.' },
      { label: 'Không hỏi, để ý thêm', effects: { happiness: -2 }, flags: ['nghi_ngo'],
        text: 'Tôi để ý giờ về, để ý điện thoại úp hay ngửa. Không có gì thêm. Nhưng từ đó mỗi lần {tenBanDoi} về muộn, tôi đều nhìn đồng hồ.' },
    ],
  },
  {
    id: 'ls29-sinh-nhat-mot-minh', age: 29, needs: ['single'],
    title: 'Sinh nhật hai mươi chín',
    text: 'Sinh nhật hai mươi chín, nhóm bạn đều bận chuyện gia đình, hẹn bù cuối tháng. Đồng nghiệp mới rủ tôi đi ăn tối, chỉ hai người, nói là để mừng. Tôi chưa thân người này lắm.',
    choices: [
      { label: 'Nhận lời', effects: { happiness: 2 }, flags: ['dong_nghiep_than'],
        text: 'Bữa tối đơn giản, nói chuyện được nhiều hơn tôi tưởng. Người ấy tặng tôi cuốn sách vừa đọc xong. Từ đó, trưa nào hai người cũng đi ăn chung.' },
      { label: 'Ở nhà một mình', effects: { happiness: -1 },
        text: 'Tôi nấu một tô mì, thêm quả trứng, thắp cây nến cắm vào miếng bánh bông lan mua ở tiệm tạp hóa. Một người thân gọi video, hát chúc mừng sinh nhật lệch tông.' },
    ],
  },

  // ───────────── 30 tuổi ─────────────
  {
    id: 'ls30-ban-cu-cuoi', age: 30,
    title: 'Ba mươi tuổi',
    text: 'Ba mươi tuổi, nhìn lại thấy mình đi được một quãng. Có một việc tôi muốn làm từ lâu: nghỉ một tháng để đi một chuyến dài. Muốn đi thì phải xin nghỉ không lương và tiêu gần hết tiền tiết kiệm. Mấy năm tới có lẽ sẽ không còn dịp.',
    choices: [
      { label: 'Đi một tháng', effects: { happiness: 4, intelligence: 1 }, flags: ['chuyen_di_30'],
        text: 'Tôi đi qua mười hai tỉnh, ngủ nhà nghỉ, ngồi xe khách đêm. Về đến nhà, tài khoản gần trống, công việc dồn ứ. Tôi không hối hận, chỉ lo tháng sau.' },
      { label: 'Để dành, đi sau', effects: { intelligence: 1, happiness: -1 }, flags: ['hoan_chuyen_di'],
        text: 'Tôi dán tấm bản đồ lên tường, đánh dấu những nơi muốn đến. Năm sau, năm sau nữa, những dấu đỏ vẫn chưa được gạch.' },
    ],
  },
  {
    id: 'ls30-vet-xuoc', age: 30,
    title: 'Vết xước trong bãi xe',
    text: 'Tôi lùi xe trong bãi, quẹt vào chiếc xe bên cạnh, để lại một vết xước dài trên cửa. Bãi vắng, không có ai, camera ở góc này đã hỏng. Sửa vết xước như vậy chắc mất vài triệu. Tôi đang trễ giờ hẹn.',
    choices: [
      { label: 'Để lại số điện thoại', effects: { happiness: 1 }, flags: ['de_lai_so'],
        text: 'Tôi viết số điện thoại lên tờ giấy, kẹp vào cần gạt nước. Tối đó chủ xe gọi, ngạc nhiên vì có người để lại số. Anh ta chỉ lấy nửa tiền sửa.' },
      { label: 'Lái đi', effects: { happiness: -2 }, flags: ['bo_di_vet_xuoc'],
        text: 'Tôi tới cuộc hẹn đúng giờ. Suốt buổi, tôi nghĩ tới vết xước. Tuần sau, tôi lại đỗ xe ở bãi ấy, nhìn quanh xem chiếc xe kia có ở đó không.' },
    ],
  },
  {
    id: 'ls30-thu-gioi-thieu', age: 30,
    title: 'Lá thư giới thiệu',
    text: 'Người bạn cũ nhờ tôi giới thiệu với một người quen đang tuyển người. Bạn ấy đang rất cần việc, vợ con chờ ở nhà. Nhưng tôi từng làm chung, biết bạn ấy làm ẩu, hay bỏ dở. Người quen của tôi rất tin lời tôi.',
    choices: [
      { label: 'Giới thiệu, nói rõ điểm yếu', effects: { intelligence: 1 }, flags: ['gioi_thieu_that'],
        text: 'Người quen nhận bạn tôi làm thử ba tháng. Bạn ấy biết tôi đã nói gì, hơi buồn, nhưng làm cẩn thận hơn hẳn. Hết ba tháng thì được nhận chính thức.' },
      { label: 'Giới thiệu, chỉ nói điểm tốt', effects: { happiness: 1 }, flags: ['gioi_thieu_tot'],
        text: 'Bạn tôi được nhận ngay. Nửa năm sau, người quen gọi cho tôi, kể dự án bị trễ hai tháng. Giọng không trách, nhưng từ đó không nhờ tôi giới thiệu ai nữa.' },
      { label: 'Từ chối giới thiệu', effects: { happiness: -1 },
        text: 'Tôi nói mình không tiện. Bạn ấy im một lúc, rồi nói “tao hiểu”. Ba tháng sau bạn ấy có việc ở chỗ khác. Hai đứa vẫn chào nhau, nhưng thôi gọi điện.' },
    ],
  },
  {
    id: 'ls30-me-bi-lua', age: 30, needs: ['mother'],
    title: 'Cuộc gọi của mẹ',
    text: 'Mẹ gọi, giọng hốt hoảng. Có người xưng là công an, nói tài khoản của mẹ liên quan một vụ rửa tiền, bảo mẹ chuyển hết tiền tiết kiệm vào “tài khoản tạm giữ”. Mẹ đang đứng ở ngân hàng. Người kia dặn mẹ không được nói với ai.',
    choices: [
      { label: 'Bảo mẹ đưa máy cho nhân viên ngân hàng', effects: { intelligence: 2 }, flags: ['cuu_me_bi_lua'],
        text: 'Nhân viên ngân hàng nghe tôi nói, giữ mẹ lại, gọi bảo vệ. Mẹ ngồi run trên ghế chờ. Tối đó mẹ gọi lại ba lần, lần nào cũng nói: “May mà có con.”' },
      { label: 'Chạy ngay tới ngân hàng', effects: { happiness: 1, health: -1 }, flags: ['cuu_me_bi_lua'],
        text: 'Tôi bỏ dở cuộc họp, chạy tới trong hai mươi phút. Mẹ vẫn đứng ở quầy, chưa chuyển. Tôi cầm tay mẹ, tay mẹ lạnh ngắt. Sếp trừ tôi nửa ngày công.' },
    ],
  },
  {
    id: 'ls30-xe-hoi', age: 30, minMoney: 200000000,
    title: 'Chiếc ô tô đầu tiên',
    text: 'Tiền tiết kiệm đủ mua một chiếc ô tô cũ. Có xe thì những ngày mưa, những chuyến về quê đỡ khổ hơn nhiều. Nhưng tiền gửi xe, xăng, bảo dưỡng mỗi tháng gần bằng tiền thuê nhà. Người bán hẹn đặt cọc cuối tuần.',
    choices: [
      { label: 'Mua xe', effects: { happiness: 3 }, money: -200000000, flags: ['mua_o_to'],
        text: 'Lần đầu lái xe của mình về quê, tôi đỗ trước cổng, mấy đứa nhỏ trong xóm chạy ra sờ mãi lớp sơn. Cuối tháng, tôi ngồi cộng hóa đơn xăng và gửi xe, cộng hai lần cho chắc.' },
      { label: 'Chưa mua', effects: { intelligence: 1 },
        text: 'Tôi tiếp tục đi xe máy, mưa thì mặc áo mưa. Tiền để trong ngân hàng, lãi mỗi năm một ít. Có hôm ướt sũng giữa đường, tôi lại nghĩ tới chiếc xe đó.' },
    ],
  },
  {
    id: 'ls30-cai-nhau', age: 30, needs: ['married'], childAge: [3, 12],
    title: 'Con đứng ở cửa phòng',
    text: 'Tối nay tôi với {tenBanDoi} cãi nhau chuyện tiền, giọng mỗi lúc một to. Quay ra, tôi thấy {tenCon} đứng ở cửa phòng, tay ôm gối, mắt mở to. Không biết con đã đứng đó bao lâu.',
    choices: [
      { label: 'Dừng lại, bế con về giường', effects: { happiness: -1 }, flags: ['dung_cai_truoc_con'],
        text: 'Tôi nằm cạnh con tới khi con ngủ. Ra ngoài, {tenBanDoi} đang ngồi ở bàn, đã bình tĩnh. Hai đứa nói tiếp, nhỏ giọng. Sáng hôm sau con hỏi ba mẹ hết giận chưa.' },
      { label: 'Nói với con: “Ba mẹ đang nói chuyện”', effects: { happiness: -2 }, flags: ['cai_truoc_con'],
        text: 'Con quay về phòng. Hai đứa cãi thêm một lúc rồi im. Sáng ra con ăn sáng rất ngoan, không hỏi gì. Tôi nhớ tới một đêm hồi nhỏ của mình.' },
    ],
  },
  {
    id: 'ls30-mot-minh-ba-muoi', age: 30, needs: ['single'],
    title: 'Câu hỏi của mẹ',
    text: 'Ba mươi tuổi, tôi vẫn sống một mình. Tối qua một người thân lớn tuổi gọi điện, hỏi rất nhẹ nhàng: “Con có định sống vậy luôn không?” Tôi chưa từng tự hỏi mình câu đó cho rõ.',
    choices: [
      { label: 'Trả lời thật lòng', effects: { happiness: 1, intelligence: 1 }, flags: ['tra_loi_song_mot_minh'],
        text: 'Tôi nói tôi không biết, nhưng hiện tại tôi ổn. Đầu dây bên kia im lâu, rồi hỏi tôi ăn tối chưa. Từ hôm đó không ai hỏi câu ấy nữa.' },
      { label: 'Đùa cho qua', effects: { happiness: -1 },
        text: 'Tôi nói chắc chờ người ta tới gõ cửa. Hai bên cùng cười. Cúp máy, tôi ngồi trong căn phòng yên tĩnh, nghĩ tới câu hỏi ấy rất lâu.' },
    ],
  },

  // ───────────── 31 tuổi ─────────────
  {
    id: 'ls31-dong-nghiep-bi-chen-ep', age: 31, needs: ['employed'],
    title: 'Người bị cả phòng xa lánh',
    text: 'Phòng tôi có một đồng nghiệp lớn tuổi bị mọi người âm thầm cô lập, vì từng phản đối sếp trong một cuộc họp. Tuần này sếp giao tôi làm chung dự án với chị ấy. Đứng về phía chị, tôi biết sếp sẽ nhìn mình khác đi.',
    choices: [
      { label: 'Làm việc tử tế với chị', effects: { intelligence: 2, happiness: -1 }, flags: ['dung_ve_chi'],
        text: 'Dự án xong tốt, chị chỉ tôi nhiều thứ không có trong tài liệu. Sếp khen dự án nhưng không khen tôi. Cuối năm, tên tôi không có trong danh sách tăng lương.' },
      { label: 'Làm cho xong, giữ khoảng cách', effects: { happiness: -1 },
        text: 'Tôi chỉ trao đổi qua thư điện tử. Chị hiểu, không phiền tôi. Dự án xong đúng hạn. Mấy tháng sau chị nghỉ việc, không ai làm tiệc chia tay.' },
    ],
  },
  {
    id: 'ls31-viec-tu-do', age: 31, needs: ['notEmployed'],
    title: 'Việc không tên',
    text: 'Tôi chưa có việc ổn định, nhận việc lặt vặt qua mạng. Một khách đặt làm gấp, trả gấp ba giá thường, nhưng phải làm suốt cuối tuần. Đúng cuối tuần đó là đám giỗ bên nhà.',
    choices: [
      { label: 'Nhận việc', effects: { health: -1 }, money: 3000000, flags: ['bo_dam_gio'],
        text: 'Tôi làm xuyên hai đêm, giao đúng giờ. Khách trả đủ tiền, hẹn có việc sẽ gọi. Đám giỗ không có tôi. Họ hàng hỏi, người nhà nói tôi bận.' },
      { label: 'Về đám giỗ', effects: { happiness: 2 },
        text: 'Tôi về phụ nấu cỗ, ngồi nghe các chú bàn chuyện làm ăn. Có chú biết tôi đang không có việc, giới thiệu cho một chỗ ở tỉnh. Tôi ghi số lại.' },
    ],
  },
  {
    id: 'ls31-tien-thuong-tet', age: 31,
    title: 'Tiền mừng tuổi họ hàng',
    text: 'Tết này nhà đông cháu, đứa nào cũng chờ lì xì. Năm ngoái tôi lì xì mỗi đứa hai trăm nghìn, năm nay thu nhập giảm. Người thân dặn nhỏ: “Bớt thì người ta cười.” Trong ví tôi đã xếp sẵn các phong bao.',
    choices: [
      { label: 'Giữ như năm ngoái', effects: { happiness: 1 },
        text: 'Đứa nào cũng cảm ơn rối rít. Tháng Giêng tôi ăn uống dè sẻn. Không ai biết, chỉ cuốn sổ chi tiêu biết.' },
      { label: 'Bớt đi, mỗi đứa một trăm', effects: { intelligence: 1 }, flags: ['lixi_vua_suc'],
        text: 'Một đứa nhỏ mở phong bao ngay trước mặt, nói to số tiền. Bà cô cười, đổi chủ đề. Tôi rót thêm nước trà, không giải thích.' },
    ],
  },
  {
    id: 'ls31-ban-tho', age: 31,
    title: 'Câu chuyện của người lạ',
    text: 'Trên chuyến xe đêm, người ngồi cạnh tôi là một chị trạc bốn mươi. Chị kể chồng mới mất, chị đang về quê lo giấy tờ, không biết bắt đầu từ đâu. Tôi từng lo giấy tờ đất đai cho nhà mình nên biết khá rõ.',
    choices: [
      { label: 'Hướng dẫn chị, cho số điện thoại', effects: { happiness: 2 }, flags: ['giup_nguoi_la'],
        text: 'Tôi ghi ra giấy từng bước. Hai tháng sau chị gọi, báo đã xong, giọng nhẹ hẳn. Tết năm đó tôi nhận được một thùng bưởi không ghi tên người gửi.' },
      { label: 'Nghe chị kể, rồi ngủ', effects: { health: 1 },
        text: 'Tôi gật đầu, nói vài câu an ủi, rồi ngủ thiếp đi. Sáng ra chị đã xuống xe từ lúc nào. Trên ghế còn một gói bánh chị để lại cho tôi.' },
    ],
  },
  {
    id: 'ls31-hen-con-so-thu', age: 31, needs: ['children'], childAge: [3, 10],
    title: 'Lời hứa chủ nhật',
    text: 'Tôi hứa với {tenCon} chủ nhật này đi sở thú. Sáng chủ nhật, tôi mệt rã rời sau một tuần làm đêm. {tenCon} đã mặc áo, đội mũ, ngồi chờ ở cửa phòng tôi.',
    choices: [
      { label: 'Dậy, đưa con đi', effects: { health: -2, happiness: 2 }, flags: ['giu_loi_voi_con'],
        text: 'Tôi ngủ gật trên ghế đá trong lúc con xem hươu. Con kéo tay tôi đi hết chuồng này tới chuồng khác. Tối về con kể với cả nhà, kể ba lần.' },
      { label: 'Hẹn con tuần sau', effects: { health: 2, happiness: -2 }, flags: ['hen_con_tuan_sau'],
        text: 'Con gật đầu, cởi mũ ra. Tôi ngủ tới trưa. Tuần sau tôi bận. Con không nhắc lại, nhưng không còn mặc áo chờ ở cửa phòng tôi nữa.' },
    ],
  },
  {
    id: 'ls31-ban-doi-met', age: 31, needs: ['partner'],
    title: '{tenBanDoi} mệt',
    text: 'Dạo này {tenBanDoi} về nhà là nằm, ít nói, ăn ít. Hỏi thì nói không sao, chỉ mệt việc. Tối qua tôi thấy {tenBanDoi} ngồi trong phòng tắm rất lâu, không mở nước.',
    choices: [
      { label: 'Ngồi xuống hỏi cho ra', effects: { happiness: 1 }, flags: ['hoi_ban_doi_met'],
        text: '{tenBanDoi} kể đang bị sếp chèn ép mấy tháng, không dám nói vì sợ tôi lo. Hai đứa ngồi tới khuya. Tuần sau {tenBanDoi} xin chuyển phòng.' },
      { label: 'Đặt một chuyến đi cuối tuần', effects: { happiness: 1, health: 1 },
        text: 'Hai đứa đi biển hai ngày. {tenBanDoi} ngủ nhiều, cười được vài lần. Về tới nhà, mọi thứ lại như cũ. Tôi vẫn chưa biết chuyện gì đã xảy ra.' },
      { label: 'Để yên, chờ tự qua', effects: { happiness: -2 },
        text: 'Tôi làm việc nhà nhiều hơn, không hỏi. Ba tháng sau, {tenBanDoi} kể đã đi khám tâm lý được mấy buổi. Tôi là người biết sau cùng.' },
    ],
  },
  {
    id: 'ls31-don-nha-mot-minh', age: 31, needs: ['single'],
    title: 'Người ngồi cùng bàn ăn',
    text: 'Quán cơm trưa đông, một người lạ hỏi ngồi chung bàn với tôi. Hôm sau, rồi hôm sau nữa, người đó vẫn tới đúng giờ ấy, ngồi đúng bàn ấy. Hôm nay người đó gật đầu chào tôi trước.',
    choices: [
      { label: 'Bắt chuyện', effects: { happiness: 2 }, flags: ['ban_quan_com'],
        text: 'Người ấy làm ở tòa nhà bên cạnh, cũng ăn trưa một mình. Hai người nói chuyện về món canh, về thời tiết. Từ đó trưa nào cũng có người để chào.' },
      { label: 'Gật đầu, tiếp tục ăn', effects: { happiness: -1 },
        text: 'Hai người lặng lẽ ăn, như mọi hôm. Một tuần sau người ấy không tới nữa. Tôi vẫn ngồi đúng chỗ đó thêm một thời gian.' },
    ],
  },

  // ───────────── 32 tuổi ─────────────
  {
    id: 'ls32-thang-chuc-doi-noi', age: 32, needs: ['employed'],
    title: 'Chuyển công tác',
    text: 'Công ty đề nghị tôi lên làm quản lý ở chi nhánh tỉnh khác, lương gần gấp rưỡi. Nhận thì phải chuyển nhà, xa những người thân quen ít nhất ba năm. Hạn trả lời là thứ sáu.',
    choices: [
      { label: 'Nhận', effects: { intelligence: 2, happiness: -1 }, flags: ['chuyen_tinh_lam'],
        text: 'Năm đầu ở tỉnh mới, tối về chỉ có tiếng tivi. Công việc tốt, lương đủ để dành. Tôi về thăm nhà bằng những chuyến xe đêm, ngủ trên xe nhiều hơn ngủ ở nhà.' },
      { label: 'Từ chối', effects: { happiness: 1 }, flags: ['o_lai_gan_nha'],
        text: 'Đồng nghiệp khác nhận vị trí ấy. Tôi ở lại chỗ cũ, cuối tuần vẫn có những bữa cơm quen. Lương vẫn vậy, mỗi tháng tính toán y như cũ.' },
    ],
  },
  {
    id: 'ls32-cong-viec-tay-trai', age: 32, needs: ['notEmployed'],
    title: 'Học nghề lại từ đầu',
    text: 'Tìm việc mãi không được, tôi tính học một nghề tay chân: sửa điện lạnh. Khóa học sáu tháng, sau đó gần như chắc chắn có việc. Bạn bè cũ đều ngồi văn phòng. Có người nói tôi học xong đại học rồi đi học sửa máy lạnh thì phí.',
    choices: [
      { label: 'Đi học nghề', effects: { intelligence: 2, health: -1 }, flags: ['hoc_nghe_dien_lanh'],
        text: 'Sáu tháng học cùng mấy đứa mười tám tuổi. Có tuần tay bị bỏng vì ống đồng. Học xong, tôi có khách quen trong khu, có tiền đều mỗi tháng.' },
      { label: 'Tiếp tục tìm việc văn phòng', effects: { happiness: -1 },
        text: 'Tôi sửa lại hồ sơ, gửi thêm hai mươi chỗ, được gọi phỏng vấn ba lần. Một nơi hẹn trả lời, rồi không trả lời. Tôi vẫn tiếp tục gửi.' },
    ],
  },
  {
    id: 'ls32-ban-than-xa', age: 32,
    title: 'Nhóm bạn thưa dần',
    text: 'Nhóm bạn thân năm người, giờ mỗi người một nơi. Nhóm chat im cả tháng. Tôi muốn rủ mọi người họp mặt, nhưng lần trước tôi rủ thì chỉ có hai người trả lời. Tôi soạn tin nhắn, ngón tay để trên nút gửi.',
    choices: [
      { label: 'Gửi, tự đứng ra lo', effects: { happiness: 2 }, flags: ['giu_nhom_ban'],
        text: 'Ba người tới, một người gửi lời xin lỗi. Bữa tối kéo dài tới khuya. Người cuối cùng ra về nói: “May mà mày rủ.” Năm sau, người khác đứng ra rủ.' },
      { label: 'Xóa tin nhắn', effects: { happiness: -1 },
        text: 'Tôi xóa đi. Mấy tháng sau thấy ảnh hai người trong nhóm đi ăn với nhau. Tôi thả tim tấm ảnh, rồi tắt điện thoại.' },
    ],
  },
  {
    id: 'ls32-nhat-vi', age: 32,
    title: 'Chiếc ví nhặt được',
    text: 'Tôi nhặt được một chiếc ví trên vỉa hè, trong có năm triệu và giấy tờ của một người ở tỉnh khác. Không có số điện thoại. Mang lên công an thì mất cả buổi sáng, mà tôi đang có việc gấp.',
    choices: [
      { label: 'Mang lên công an ngay', effects: { happiness: 1, health: -1 }, flags: ['tra_vi'],
        text: 'Tôi chờ hai tiếng để làm biên bản. Một tuần sau, chủ ví gọi tới, là một người phụ hồ, đó là tiền lương cả tháng. Anh ấy nói cảm ơn mãi, giọng run.' },
      { label: 'Tìm chủ ví trên mạng', effects: { intelligence: 1 }, flags: ['tra_vi'],
        text: 'Tôi đăng ảnh giấy tờ, che bớt thông tin, lên mấy nhóm của tỉnh đó. Hai ngày sau có người nhận. Chủ ví nhờ người quen lên lấy, gửi lại tôi một chai mật ong.' },
      { label: 'Giữ tiền, gửi giấy tờ qua bưu điện', effects: { happiness: -2 }, money: 5000000, flags: ['giu_tien_vi'],
        text: 'Tôi gửi giấy tờ theo địa chỉ trên căn cước. Năm triệu nằm trong ví tôi. Tôi tiêu hết trong một tuần, không nhớ đã tiêu vào việc gì.' },
    ],
  },
  {
    id: 'ls32-ba-me-cho-tien', age: 32, needs: ['father', 'mother'],
    title: 'Sổ tiết kiệm của ba mẹ',
    text: 'Ba mẹ đưa tôi cuốn sổ tiết kiệm, nói để dành cả đời, giờ cho tôi trước để làm ăn. Tôi biết đó là tiền dưỡng già. Tôi đang cần tiền thật, mà ba mẹ nhất định không cầm lại.',
    choices: [
      { label: 'Nhận, hứa sẽ trả', effects: { happiness: 1 }, flags: ['nhan_tien_ba_me'],
        text: 'Tôi ghi một tờ giấy nợ, ba mẹ cười rồi cất vào ngăn kéo. Mỗi năm tôi gửi lại một ít, gọi là tiền lãi. Ba mẹ gửi vào sổ, ghi tên tôi.' },
      { label: 'Không nhận', effects: { happiness: -1 }, flags: ['tu_choi_tien_ba_me'],
        text: 'Tôi đặt cuốn sổ lại trên bàn thờ, nói để đó cho ba mẹ. Mẹ giận mấy ngày, nói con cái gì mà khách sáo. Tôi xoay xở bằng một khoản vay ngân hàng.' },
    ],
  },
  {
    id: 'ls32-con-hoc-mau-giao', age: 32, needs: ['children'], childAge: [2, 6],
    title: 'Trường mầm non',
    text: '{tenCon} sắp vào mầm non. Trường công gần nhà lớp đông, cô ít. Trường tư song ngữ học phí bằng nửa lương tôi, nhưng cô giáo dịu dàng, con đi học thử về cười mãi. Tôi phải đóng tiền giữ chỗ trong tuần này.',
    choices: [
      { label: 'Cho học trường tư', effects: { happiness: 1, health: -1 }, flags: ['con_truong_tu'],
        text: '{tenCon} đi học vui, về hát tiếng Anh. Tôi nhận làm thêm buổi tối để đủ học phí. Có tuần tôi gặp con chỉ lúc con đang ngủ.' },
      { label: 'Cho học trường công', effects: { intelligence: 1 }, flags: ['con_truong_cong'],
        text: 'Tuần đầu {tenCon} khóc ở cổng trường mỗi sáng. Tuần thứ ba thì có bạn thân. Tôi về nhà sớm, tối nào cũng đọc truyện cho con nghe.' },
    ],
  },
  {
    id: 'ls32-me-chong-me-vo', age: 32, needs: ['married'],
    title: 'Lên ở cùng',
    text: 'Mẹ của {tenBanDoi} muốn lên ở cùng một thời gian để giúp việc nhà. Nhà chật, tôi quen sự yên tĩnh. {tenBanDoi} rất mong, nhưng nói để tôi quyết, vì người ở nhà nhiều hơn là tôi.',
    choices: [
      { label: 'Đồng ý', effects: { happiness: -1, health: 1 }, flags: ['o_cung_nha_ben_kia'],
        text: 'Bà dậy từ năm giờ nấu cơm, nhà sạch hơn hẳn. Bà hay góp ý cách tôi sắp xếp mọi thứ. Có tối tôi về muộn hơn một chút, ngồi trong xe thêm mười phút.' },
      { label: 'Đề nghị ở gần, không ở chung', effects: { intelligence: 1 },
        text: 'Hai đứa thuê cho bà căn phòng nhỏ cách nhà năm phút đi bộ. Bà sang nấu cơm mỗi chiều, tối về phòng mình. {tenBanDoi} nói vậy cũng tốt, giọng hơi buồn.' },
    ],
  },
  {
    id: 'ls32-hen-ho-ung-dung', age: 32, needs: ['single'],
    title: 'Ứng dụng hẹn hò',
    text: 'Bạn thân cài cho tôi một ứng dụng hẹn hò, nói thử đi, có mất gì đâu. Có một người nhắn tin rất dễ chịu đã ba tuần, giờ hẹn gặp mặt tối thứ bảy. Tôi không quen gặp người lạ.',
    choices: [
      { label: 'Đi gặp', effects: { happiness: 2 }, flags: ['gap_nguoi_tren_mang'],
        text: 'Người ấy ngoài đời ít nói hơn khi nhắn tin, nhưng cười rất hiền. Hai người đi bộ dọc bờ sông tới mười giờ. Không biết rồi sẽ ra sao, nhưng tối đó dễ chịu.' },
      { label: 'Xóa ứng dụng', effects: { happiness: -1 },
        text: 'Tôi nhắn xin lỗi rồi xóa ứng dụng. Bạn thân lắc đầu. Tối thứ bảy tôi xem phim ở nhà, xem được nửa thì tắt.' },
    ],
  },

  // ───────────── Chuỗi ─────────────
  {
    id: 'ls-tu-cuoi', ages: [26, 30], requires: ['tu_noi_lai'],
    title: 'Thiệp cưới của Tú',
    text: 'Tú gửi thiệp cưới, đám cưới ở quê Tú, cách năm trăm cây số. Tú gọi điện, nói muốn tôi đứng cạnh lúc đón dâu, vì hồi nhỏ chỉ có tôi chơi với Tú. Đúng tuần đó tôi có việc lớn không dễ bỏ.',
    choices: [
      { label: 'Đi dự cưới Tú', effects: { happiness: 3, health: -1 }, flags: ['du_cuoi_tu'],
        text: 'Tôi đi xe đêm, tới nơi kịp giờ đón dâu. Tú mặc com lê, cứ chỉnh cà vạt mãi. Lúc cạn ly, Tú nói nhỏ: “Còn cái máy bay của mày, tao để trong tủ kính.”' },
      { label: 'Gửi quà, gọi video chúc mừng', effects: { happiness: -1 }, flags: ['vang_cuoi_tu'],
        text: 'Tôi gửi quà và phong bì qua bưu điện. Hôm cưới, tôi gọi video, Tú đứng giữa sân đông người, hét lên gì đó tôi không nghe rõ. Tú gửi ảnh, có chừa một chỗ trống bên cạnh.' },
    ],
  },
  {
    id: 'ls-phong-gap-lai', ages: [27, 34], requiresAny: ['khai_phong', 'im_lang_binh_hoa', 'nhan_thay_phong'],
    title: 'Người ngồi bên kia bàn',
    text: 'Buổi làm việc với đối tác, người ngồi bên kia bàn là Phong, cậu bạn làm bể bình hoa năm lớp ba. Phong giờ là trưởng phòng, hồ sơ của tôi cần chữ ký của Phong mới đi tiếp được. Phong nhận ra tôi ngay.',
    choices: [
      { label: 'Nhắc chuyện bình hoa năm xưa', effects: { happiness: 1 }, flags: ['nhac_binh_hoa'],
        text: 'Phong bật cười, rồi im một lúc. Phong nói chuyện năm đó Phong vẫn nhớ, nhớ cả ai đã làm gì. Hồ sơ của tôi được xem xét đúng quy trình, không nhanh hơn, không chậm hơn.' },
      { label: 'Chỉ bàn công việc', effects: { intelligence: 1 },
        text: 'Hai người làm việc như hai người lạ. Lúc chia tay, Phong bắt tay tôi lâu hơn một chút, hỏi: “Lớp cũ còn ai liên lạc không?” Tôi nói không.' },
    ],
  },
  {
    id: 'ls-hut-thuoc', ages: [28, 36], requires: ['hut_thu'],
    title: 'Hơi thuốc năm lớp bảy',
    text: 'Từ hơi thuốc năm lớp bảy, tôi hút lúc nào không hay, giờ mỗi ngày nửa gói. Sáng nay khám sức khỏe, bác sĩ cho xem phim chụp phổi, nói đã bắt đầu có vấn đề, bỏ bây giờ vẫn kịp.',
    choices: [
      { label: 'Bỏ hẳn từ hôm nay', effects: { health: 3, happiness: -2 }, flags: ['bo_thuoc'],
        text: 'Ba tuần đầu tôi cáu gắt, ăn nhiều, mất ngủ. Tháng thứ hai thì dễ hơn. Có lúc vẫn thèm, tôi ra ban công hít một hơi không khí thật sâu.' },
      { label: 'Giảm dần', effects: { health: 1 },
        text: 'Tôi giảm còn năm điếu, rồi lại mười. Bao thuốc vẫn nằm trong túi áo. Phim chụp phổi vẫn nằm trong ngăn kéo.' },
    ],
  },
  {
    id: 'ls-con-noi-ngong-lanh', ages: [28, 36], requires: ['ban_lanh'], needs: ['children'], childAge: [2, 6],
    title: 'Cô giáo ở phòng trị liệu',
    text: '{tenCon} chậm nói, bác sĩ giới thiệu một phòng trị liệu ngôn ngữ. Cô giáo trị liệu nhìn tôi, rồi hỏi: “Bạn có học mẫu giáo ở trường cũ không?” Là Lành, cô bạn nói ngọng năm nào, giờ nói rất rõ từng chữ.',
    choices: [
      { label: 'Nhắc lại bàn ăn năm ấy', effects: { happiness: 3 }, flags: ['gap_lai_lanh'],
        text: 'Lành cười, nói nhớ chứ, nhớ nửa cái bánh flan. Lành kể vì những năm đó mà quyết định học ngành này. Ba tháng sau, {tenCon} gọi được tên cô Lành.' },
      { label: 'Chỉ nói về con', effects: { happiness: 1 },
        text: 'Lành hỏi kỹ về {tenCon}, ghi chép cẩn thận. Cuối buổi, Lành nói: “Hồi đó bạn tốt với mình.” Tôi gật đầu, không biết trả lời sao.' },
    ],
  },
  {
    id: 'ls-con-noi-ngong-cuoi-theo', ages: [28, 36], requires: ['cuoi_theo'], needs: ['children'], childAge: [2, 6],
    title: 'Cô giáo ở phòng trị liệu',
    text: '{tenCon} chậm nói, bác sĩ giới thiệu một phòng trị liệu ngôn ngữ. Cô giáo trị liệu là Lành, cô bạn nói ngọng hồi mẫu giáo, người từng thấy tôi cười theo đám bạn. Lành nhận ra tôi, vẫn mỉm cười, hỏi về {tenCon}.',
    choices: [
      { label: 'Xin lỗi chuyện năm xưa', effects: { happiness: 2, intelligence: 1 }, flags: ['xin_loi_lanh'],
        text: 'Lành nghe xong, nói đã quên từ lâu, nhưng cảm ơn tôi đã nhắc. Những buổi sau, Lành dạy {tenCon} rất kiên nhẫn. Tôi đứng ngoài cửa kính nhìn hai cô trò.' },
      { label: 'Không nhắc gì', effects: { happiness: -1 },
        text: 'Lành dạy {tenCon} tận tình như với mọi đứa trẻ. Mỗi lần đón con, tôi chào Lành, Lành chào lại. Có điều gì đó tôi chưa nói, và có lẽ sẽ không nói.' },
    ],
  },
  {
    id: 'ls-hoc-tro-vung-cao', ages: [29, 38], requires: ['len_vung_cao'], minMoney: 5000000,
    title: 'Tin nhắn từ vùng cao',
    text: 'Một tin nhắn lạ: “Thầy cô còn nhớ em không? Em học lớp mùa hè năm đó.” Cậu bé đi bộ hai tiếng tới lớp, giờ đã đỗ đại học ở thành phố, nhưng nhà không đủ tiền nhập học. Cậu hỏi rất ngại ngùng.',
    choices: [
      { label: 'Gửi tiền nhập học', effects: { happiness: 4 }, money: -5000000, flags: ['giup_hoc_tro'],
        text: 'Cậu nhắn lại một tấm ảnh trước cổng trường, áo trắng, cười tít mắt. Mỗi kỳ cậu gửi bảng điểm, dù tôi không hỏi. Năm cuối cậu gửi thư mời dự lễ tốt nghiệp.' },
      { label: 'Giúp tìm học bổng', effects: { intelligence: 2 }, flags: ['tim_hoc_bong'],
        text: 'Tôi gọi khắp nơi, tìm được một quỹ học bổng cho sinh viên miền núi. Cậu kịp nhập học. Cậu nói cảm ơn bằng tiếng dân tộc mình, rồi dịch lại cho tôi nghe.' },
    ],
  },
];
