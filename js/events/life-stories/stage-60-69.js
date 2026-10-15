 
 
export const stage60To69 = [
   
  {
    id: 'ls60-sinh-nhat-sau-muoi', age: 60,
    title: 'Sáu mươi năm',
    text: 'Sinh nhật sáu mươi. Một người bạn cũ gửi tặng cuốn album, trong đó có những tấm ảnh tôi chưa từng thấy: tôi lúc hai mươi tuổi đang cười, lúc ba mươi đang ngủ gật trên xe. Cuối album có một trang trống, ghi: “Phần tiếp theo.”',
    choices: [
      { label: 'Dán ảnh hôm nay vào trang trống', effects: { happiness: 3 }, flags: ['album_sau_muoi'],
        text: 'Tôi nhờ người chụp một tấm, in ra, dán vào. Trong ảnh tôi tóc bạc, cười hở cả răng. Tôi gọi cho người bạn, hai đứa nói chuyện tới khuya.' },
      { label: 'Để trang trống', effects: { happiness: 1 },
        text: 'Tôi để trang ấy trống, đặt album lên kệ. Thỉnh thoảng mở ra, nhìn trang trống, nghĩ xem mình muốn dán gì vào đó.' },
    ],
  },
  {
    id: 'ls60-kinh-lao', age: 60,
    title: 'Mổ mắt',
    text: 'Mắt tôi mờ dần vì đục thủy tinh thể. Bác sĩ nói mổ thì nhìn rõ trở lại, nhưng có rủi ro nhỏ. Tôi sợ dao kéo, sợ nằm viện. Không mổ thì mỗi năm một mờ hơn, đọc sách khó, đi đường dễ ngã.',
    choices: [
      { label: 'Mổ', effects: { health: 3, happiness: 2 }, money: -15000000, flags: ['mo_mat'],
        text: 'Ca mổ mười lăm phút. Tháo băng, tôi nhìn thấy những nếp nhăn trên tay mình rõ tới từng đường. Tối đó, tôi đọc sách tới khuya, không cần kính lúp.' },
      { label: 'Chưa mổ', effects: { health: -1 },
        text: 'Tôi mua kính lúp, bật đèn sáng hơn. Đọc được, nhưng chậm. Có lần tôi nhầm lọ muối với lọ đường, nấu nồi chè mặn chát.' },
    ],
  },
  {
    id: 'ls60-con-chau-vay', age: 60,
    title: 'Đứa cháu xin vốn',
    text: 'Đứa cháu họ, mới ngoài hai mươi, xin vay tiền mở tiệm sửa điện thoại. Nó nói đã học nghề hai năm, có tay nghề, chỉ thiếu vốn. Số tiền nó xin là một phần ba tiền dưỡng già của tôi.',
    choices: [
      { label: 'Cho vay một phần', effects: { happiness: 1 }, flags: ['cho_chau_vay_von'],
        text: 'Tiệm nhỏ mở ở chợ. Năm đầu khó, năm hai đông khách. Nó trả tiền đều đặn, mỗi lần trả lại mang theo trái cây. Điện thoại tôi hỏng gì, nó sửa miễn phí.' },
      { label: 'Từ chối, giới thiệu chỗ vay', effects: { intelligence: 1 },
        text: 'Tôi giúp nó làm hồ sơ vay ưu đãi cho thanh niên khởi nghiệp. Nó vay được ít hơn, mở tiệm nhỏ hơn. Năm sau, nó tới khoe tiệm có thêm một người phụ.' },
    ],
  },
  {
    id: 'ls60-con-viec-tuoi-sau-muoi', age: 60, needs: ['employed'],
    title: 'Hai năm cuối',
    text: 'Còn hai năm nữa nghỉ hưu. Sếp hỏi tôi có muốn ký thêm hợp đồng làm cố vấn sau khi nghỉ, làm bán thời gian. Tôi đã tính sẵn kế hoạch cho những năm nghỉ ngơi.',
    choices: [
      { label: 'Nhận làm cố vấn', effects: { intelligence: 1 }, flags: ['co_van_sau_huu'],
        text: 'Tôi giữ được một chân trong công ty, mỗi tuần tới hai buổi. Cảm giác vẫn có người cần mình. Nhưng có những sáng thứ hai muốn ngủ thêm, tôi lại phải dậy.' },
      { label: 'Nghỉ hẳn khi tới tuổi', effects: { happiness: 2 },
        text: 'Tôi từ chối, nói muốn dành thời gian cho mình. Sếp gật đầu. Hai năm cuối tôi làm thong thả, đếm ngược từng tháng.' },
    ],
  },
  {
    id: 'ls60-chua-co-luong-huu', age: 60, needs: ['notEmployed'],
    title: 'Trợ cấp tuổi già',
    text: 'Tôi không có lương hưu, tiền dành dụm sắp cạn. Phường hướng dẫn làm hồ sơ xin trợ cấp người cao tuổi khó khăn. Tôi thấy ngại, cả đời chưa xin ai thứ gì.',
    choices: [
      { label: 'Làm hồ sơ', effects: { happiness: -1, intelligence: 1 }, money: 3000000, flags: ['tro_cap_tuoi_gia'],
        text: 'Cán bộ phường hướng dẫn tận tình. Tiền trợ cấp ít, nhưng đều đặn. Lần đầu nhận tiền, tôi đứng ở quầy hơi lâu, rồi nói cảm ơn rất nhỏ.' },
      { label: 'Tìm việc nhẹ làm tiếp', effects: { health: -1 }, money: 2000000,
        text: 'Tôi nhận việc gói hàng tại nhà cho một cửa hàng, ngồi cả ngày. Tay mỏi, lưng đau. Có tiền chợ, không phải xin ai.' },
    ],
  },
  {
    id: 'ls60-ban-doi-sau-muoi', age: 60, needs: ['partner'],
    title: 'Lời hứa năm hai mươi',
    text: 'Hồi trẻ, tôi từng hứa với {tenBanDoi} khi về già sẽ cùng đi xem biển ở một nơi rất xa. Sáu mươi tuổi, {tenBanDoi} nhắc lại lời hứa ấy, nửa đùa nửa thật. Đường xa, sức khỏe hai đứa không còn như trước.',
    choices: [
      { label: 'Đi', effects: { happiness: 4, health: -1 }, flags: ['giu_loi_hua_bien'],
        text: 'Hai đứa đi chậm, nghỉ nhiều. Đứng trước biển, {tenBanDoi} nói: “Bốn mươi năm mới giữ một lời hứa.” Tôi nói: “Nhưng giữ rồi đó.”' },
      { label: 'Đi biển gần nhà', effects: { happiness: 2 },
        text: 'Hai đứa ngồi trên bãi biển gần nhà, nhìn hoàng hôn. {tenBanDoi} nói: “Biển nào cũng là biển.” Rồi tựa đầu vào vai tôi.' },
    ],
  },
  {
    id: 'ls60-mot-minh-sau-muoi', age: 60, needs: ['single'],
    title: 'Câu lạc bộ dưỡng sinh',
    text: 'Sáu mươi tuổi, sống một mình. Người hàng xóm rủ tôi vào câu lạc bộ dưỡng sinh ở công viên mỗi sáng. Toàn người lớn tuổi, nói chuyện nhiều, hay hỏi han chuyện riêng.',
    choices: [
      { label: 'Tham gia', effects: { happiness: 2, health: 2 }, flags: ['clb_duong_sinh'],
        text: 'Tuần đầu tôi đứng cuối hàng. Tuần thứ ba có người để dành chỗ cho tôi. Tháng thứ hai, cả nhóm biết tôi thích ăn gì, mỗi người mang tới một món.' },
      { label: 'Tập một mình ở nhà', effects: { health: 1 },
        text: 'Tôi tập theo video mỗi sáng. Sức khỏe ổn. Buổi sáng yên tĩnh, chỉ có tiếng của mình đếm nhịp thở.' },
    ],
  },
  {
    id: 'ls60-chau-ve-choi', age: 60, needs: ['children'], childAge: [28, 45],
    title: 'Đứa cháu nghịch ngợm',
    text: 'Đứa cháu về chơi, làm vỡ chiếc bình gốm tôi giữ ba mươi năm. Nó sợ, khóc, đứng nép sau lưng ba mẹ nó. {tenCon} định la nó. Tôi nhìn những mảnh vỡ trên sàn.',
    choices: [
      { label: 'Nói: “Không sao, bình vỡ thì mua bình khác”', effects: { happiness: 2 }, flags: ['tha_chau_vo_binh'],
        text: 'Đứa cháu nín khóc, chạy lại ôm tôi. Tối đó tôi ngồi gom từng mảnh vỡ, cất vào hộp. Bình mua mới được, cái ôm ấy thì không.' },
      { label: 'Để {tenCon} dạy cháu', effects: { intelligence: 1 },
        text: '{tenCon} nói chuyện với cháu, nghiêm nhưng không la. Cháu xin lỗi tôi, giọng run run. Tôi nhận lời xin lỗi, rồi dắt nó ra vườn hái ổi.' },
    ],
  },

   
  {
    id: 'ls61-ban-tre-tren-mang', age: 61,
    title: 'Người bạn trên mạng',
    text: 'Tôi quen một người trên mạng, nói chuyện rất hợp, đã ba tháng. Người ấy nói sắp về nước, nhưng cần tôi chuyển giúp một khoản tiền để nhận gói quà ở hải quan. Tin nhắn rất ngọt ngào.',
    choices: [
      { label: 'Từ chối, hỏi người thân', effects: { intelligence: 2 }, flags: ['tranh_lua_tinh'],
        text: 'Đứa cháu đọc tin nhắn, nói ngay đây là lừa đảo. Tôi xóa tài khoản người ấy, ngồi im cả buổi tối. Ba tháng nói chuyện, mà chẳng có gì là thật.' },
      { label: 'Đòi gọi video trước', effects: { intelligence: 1 },
        text: 'Người ấy hẹn mai gọi, rồi mai, rồi mai. Rồi im lặng. Tôi chờ thêm một tuần, rồi tự hiểu. Tôi không kể với ai chuyện này.' },
    ],
  },
  {
    id: 'ls61-dat-trong-rau', age: 61,
    title: 'Mảnh đất trống',
    text: 'Khu nhà có một mảnh đất trống bỏ hoang, đầy rác. Tôi muốn dọn sạch, trồng rau chung cho cả khu. Phải xin phép phường, kêu gọi hàng xóm góp công. Nhiều người nói làm chi cho mệt.',
    choices: [
      { label: 'Đứng ra làm', effects: { happiness: 3, health: 1 }, flags: ['vuon_rau_chung'],
        text: 'Ba tháng sau, mảnh đất thành vườn rau xanh mướt. Mỗi nhà một luống. Chiều nào cũng có người ra tưới, tụi trẻ chạy theo ông bà, hỏi tên từng loại rau.' },
      { label: 'Trồng rau trong chậu ở nhà', effects: { happiness: 1 },
        text: 'Tôi trồng mấy chậu rau trên ban công. Rau lên tốt. Mảnh đất trống vẫn đầy rác, tôi đi ngang mỗi ngày.' },
    ],
  },
  {
    id: 'ls61-di-kham-thuong-xuyen', age: 61,
    title: 'Danh sách thuốc',
    text: 'Tôi đang uống bảy loại thuốc mỗi ngày, mỗi loại do một bác sĩ khác kê. Có hôm uống xong thấy chóng mặt. Một người quen nói nên tìm một bác sĩ xem lại toàn bộ, nhưng phải đi bệnh viện lớn, chờ cả ngày.',
    choices: [
      { label: 'Đi khám tổng hợp', effects: { health: 3 }, money: -2000000, flags: ['xem_lai_thuoc'],
        text: 'Bác sĩ bỏ hai loại thuốc trùng tác dụng, đổi một loại khác. Tuần sau, tôi hết chóng mặt. Tôi ghi lại danh sách mới, dán lên tủ thuốc.' },
      { label: 'Tiếp tục như cũ', effects: { health: -2 },
        text: 'Tôi uống đủ bảy loại, có lúc quên, có lúc uống trùng. Chóng mặt vài lần một tuần. Tôi nghĩ tại tuổi già.' },
    ],
  },
  {
    id: 'ls61-cuoi-cung-lam-viec', age: 61, needs: ['employed'],
    title: 'Năm cuối cùng',
    text: 'Năm cuối cùng đi làm. Đồng nghiệp hỏi tôi có muốn làm tiệc chia tay không. Tôi nghĩ tới những người đã cùng làm suốt mấy chục năm, có người đã đi xa, có người đã mất.',
    choices: [
      { label: 'Làm tiệc, mời cả người cũ', effects: { happiness: 3 }, money: -10000000, flags: ['tiec_chia_tay'],
        text: 'Tôi tự tay gọi điện mời những người cũ. Có người đi xe ba trăm cây số tới. Bữa tiệc kéo dài tới khuya, ai cũng kể một chuyện về tôi, có chuyện tôi đã quên.' },
      { label: 'Ra về lặng lẽ', effects: { happiness: 1 },
        text: 'Ngày cuối, tôi dọn bàn, chào từng người, rồi về. Không có tiệc. Tối đó, nhận được hàng chục tin nhắn, đọc tới khuya.' },
    ],
  },
  {
    id: 'ls61-tu-lam-them', age: 61, needs: ['notEmployed'],
    title: 'Dạy kèm miễn phí',
    text: 'Tôi đang có nhiều thời gian. Mấy đứa trẻ nghèo trong khu không có tiền học thêm. Một người gợi ý tôi mở lớp dạy kèm miễn phí ở nhà, buổi tối. Tôi lo mình đã lâu không học hành, kiến thức cũ rồi.',
    choices: [
      { label: 'Mở lớp', effects: { happiness: 3, intelligence: 1 }, flags: ['lop_day_mien_phi'],
        text: 'Lớp bắt đầu với ba đứa, sau một tháng thành mười. Có bài tôi phải học trước một đêm mới dạy được. Cuối năm, một đứa đậu vào trường chuyên, chạy sang khoe đầu tiên.' },
      { label: 'Dạy kèm một đứa nhà bên', effects: { happiness: 1 },
        text: 'Tôi dạy một đứa, mỗi tuần hai buổi. Nó tiến bộ chậm nhưng đều. Mẹ nó mang sang mấy con cá, tôi nhận để mẹ nó khỏi ngại.' },
    ],
  },
  {
    id: 'ls61-ban-doi-hon-gian', age: 61, needs: ['partner'],
    title: 'Cơn giận vì chuyện nhỏ',
    text: 'Dạo này hai đứa hay cãi nhau vì những chuyện rất nhỏ: cái điều khiển tivi, giờ tắt đèn, ai quên mua nước mắm. Hôm nay {tenBanDoi} giận, đi ra ngoài, chưa về. Trời sắp tối.',
    choices: [
      { label: 'Đi tìm {tenBanDoi}', effects: { happiness: 2 }, flags: ['di_tim_ban_doi'],
        text: 'Tôi tìm thấy {tenBanDoi} ngồi ở ghế đá công viên. Ngồi xuống cạnh, không ai nói gì. Một lúc sau, {tenBanDoi} nói: “Mình già rồi, khó chịu với chính mình chứ không phải với nhau.”' },
      { label: 'Ở nhà, nấu cơm chờ', effects: { happiness: 1 },
        text: '{tenBanDoi} về, thấy mâm cơm đã dọn sẵn, có món {tenBanDoi} thích. Hai đứa ăn trong im lặng, rồi {tenBanDoi} gắp cho tôi một miếng.' },
    ],
  },
  {
    id: 'ls61-mot-minh-tho-nhan', age: 61, needs: ['single'],
    title: 'Lá thư gửi chính mình',
    text: 'Dọn tủ, tôi tìm thấy một lá thư tự viết cho mình năm hai mươi tuổi, hẹn sáu mươi tuổi mới mở. Phong bì đã ố vàng. Tôi không nhớ mình đã viết gì trong đó.',
    choices: [
      { label: 'Mở ra đọc', effects: { happiness: 2 }, flags: ['doc_thu_tuoi_hai_muoi'],
        text: 'Năm hai mươi tuổi, tôi viết: “Mong sáu mươi tuổi mình vẫn còn tò mò.” Tôi đọc, cười, rồi viết một lá thư mới, hẹn tám mươi tuổi mới mở.' },
      { label: 'Cất lại, chưa đọc', effects: { happiness: -1 },
        text: 'Tôi cất lá thư vào hộp, nói để khi nào thấy cần. Có những đêm không ngủ được, tôi nghĩ tới lá thư ấy, nhưng vẫn không mở.' },
    ],
  },

   
  {
    id: 'ls62-ngay-dau-nghi-huu', age: 62,
    title: 'Sáng thứ hai đầu tiên',
    text: 'Sáng thứ hai đầu tiên không phải đi làm. Tôi thức dậy đúng sáu giờ như mọi khi, rồi không biết làm gì. Căn nhà im lặng. Lịch trong điện thoại trống trơn.',
    choices: [
      { label: 'Lập lịch cho cả tuần', effects: { happiness: 2, intelligence: 1 }, flags: ['lich_huu_tri'],
        text: 'Tôi chia mỗi ngày thành việc: sáng đi bộ, trưa đọc sách, chiều làm vườn, tối gọi điện cho một người. Tuần đầu cứng nhắc, tuần sau quen dần. Ngày không còn dài như sáng thứ hai ấy.' },
      { label: 'Để ngày tự trôi', effects: { happiness: -1 },
        text: 'Tôi ngủ thêm, xem tivi, ăn trưa muộn. Một tuần, hai tuần, tôi không còn biết hôm nay thứ mấy. Một sáng nhìn gương, thấy mình già đi nhanh hơn.' },
    ],
  },
  {
    id: 'ls62-tien-huu-dau', age: 62,
    title: 'Tháng lương hưu đầu',
    text: 'Tháng lương hưu đầu tiên về tài khoản, ít hơn một nửa lương cũ. Tôi ngồi tính lại chi tiêu. Có hai khoản phải chọn bỏ một: tiền cà phê với bạn mỗi sáng, hoặc gói tập thể dục ở trung tâm.',
    choices: [
      { label: 'Giữ cà phê với bạn', effects: { happiness: 2 }, flags: ['ca_phe_ban_gia'],
        text: 'Sáng nào tôi cũng ngồi quán với ba người bạn, nói chuyện trên trời dưới đất. Tôi tập thể dục ở công viên, miễn phí. Bạn bè là thứ không mua lại được.' },
      { label: 'Giữ gói tập thể dục', effects: { health: 2 },
        text: 'Tôi tập đều, sức khỏe tốt. Cà phê thì tự pha ở nhà, uống một mình. Bạn bè hỏi sao dạo này không ra quán, tôi nói bận.' },
    ],
  },
  {
    id: 'ls62-ban-cu-o-xa', age: 62,
    title: 'Chuyến đi thăm bạn cũ',
    text: 'Có thời gian rồi, tôi muốn đi thăm những người bạn cũ ở xa, những người hứa “khi nào rảnh gặp”. Có năm người ở năm tỉnh khác nhau. Chuyến đi mất cả tháng, tốn kém.',
    choices: [
      { label: 'Đi một vòng', effects: { happiness: 4, health: -1 }, flags: ['vong_tham_ban'],
        text: 'Mỗi nơi tôi ở hai ngày. Có người khỏe, có người yếu, có người đã không còn nhớ rõ. Về nhà, tôi in ảnh từng người, dán lên tường thành một hàng.' },
      { label: 'Gọi video cho từng người', effects: { happiness: 1 },
        text: 'Mỗi tối tôi gọi một người. Nói chuyện vui, hẹn sẽ gặp. Một năm sau, một trong năm người mất. Tôi chưa kịp gặp.' },
    ],
  },
  {
    id: 'ls62-ban-doi-nghi-huu-chung', age: 62, needs: ['partner'],
    title: 'Hai người ở nhà cả ngày',
    text: 'Cả hai cùng nghỉ hưu, ở nhà cả ngày. Mới được một tháng, hai đứa đã hay va chạm vì những thói quen nhỏ. {tenBanDoi} đề nghị mỗi người có một ngày riêng trong tuần, đi đâu tùy ý.',
    choices: [
      { label: 'Đồng ý', effects: { happiness: 2 }, flags: ['ngay_rieng_moi_tuan'],
        text: 'Thứ ba tôi đi câu lạc bộ cờ, thứ năm {tenBanDoi} đi lớp vẽ. Tối hai ngày ấy, hai đứa có chuyện để kể. Những ngày còn lại, ở cạnh nhau dễ chịu hơn.' },
      { label: 'Đề nghị làm chung một việc', effects: { happiness: 1 },
        text: 'Hai đứa cùng đi học nấu ăn. Cãi nhau trong bếp nhiều hơn, nhưng món ăn ngon dần. Có hôm cãi xong lại ngồi ăn, cười.' },
    ],
  },
  {
    id: 'ls62-mot-minh-nghi-huu', age: 62, needs: ['single'],
    title: 'Căn nhà vắng',
    text: 'Nghỉ hưu, tôi ở nhà một mình cả ngày. Có hôm tới chiều mới nhận ra mình chưa nói câu nào. Tôi tính đăng ký làm tình nguyện viên ở bệnh viện, mỗi tuần ba buổi, hướng dẫn người bệnh.',
    choices: [
      { label: 'Đăng ký làm tình nguyện', effects: { happiness: 3 }, flags: ['tinh_nguyen_benh_vien'],
        text: 'Tôi đứng ở sảnh bệnh viện, chỉ đường, đẩy xe lăn, nói chuyện với người chờ khám. Mỗi ngày nói hàng trăm câu. Tối về, giọng khàn, mà vui.' },
      { label: 'Nuôi một con vật', effects: { happiness: 2 }, flags: ['nuoi_thu_cung_huu'],
        text: 'Tôi nhận nuôi một con chó nhỏ. Ngày nào cũng dắt nó đi dạo hai lần, nói chuyện với nó suốt. Hàng xóm quen tôi qua con chó, giờ biết tên cả hai.' },
    ],
  },

   
  {
    id: 'ls63-hoc-may-tinh', age: 63,
    title: 'Gọi video cho cháu',
    text: 'Đứa cháu ở xa muốn gọi video với tôi mỗi tuần, nhưng tôi không biết cài đặt, hay bấm nhầm. Cháu kiên nhẫn chỉ qua điện thoại, nhưng tôi vẫn lúng túng. Có một lớp hướng dẫn ở nhà văn hóa phường.',
    choices: [
      { label: 'Đi học ở nhà văn hóa', effects: { intelligence: 2, happiness: 1 }, flags: ['hoc_goi_video'],
        text: 'Sau ba buổi, tôi tự gọi được. Lần đầu thấy mặt cháu trên màn hình, tôi cứ nhìn mãi, quên cả nói. Cháu cười: “Nói gì đi chứ.”' },
      { label: 'Nhờ hàng xóm cài sẵn', effects: { happiness: 1 },
        text: 'Đứa nhỏ nhà bên cài giúp, dán một tờ giấy ghi các bước lên tường. Tôi làm theo, được. Mỗi lần gọi, tôi lại nhìn tờ giấy.' },
    ],
  },
  {
    id: 'ls63-tang-le-ban', age: 63,
    title: 'Đám tang người bạn',
    text: 'Người bạn thân thời thanh niên mất. Gia đình nhờ tôi canh linh cữu đêm cuối, vì tôi là người bạn còn lại gần nhất. Tôi đã sáu mươi ba, thức trắng một đêm là mệt mấy ngày.',
    choices: [
      { label: 'Ngồi canh tới sáng', effects: { happiness: 1, health: -2 }, flags: ['canh_ban_dem_cuoi'],
        text: 'Một đứa cháu nhỏ của bạn ngồi cùng tôi. Tôi kể cho nó nghe về ông nó thời trẻ, kể tới khi gà gáy. Nó nói chưa ai kể những chuyện ấy.' },
      { label: 'Ngồi tới nửa đêm', effects: { happiness: -1 },
        text: 'Tôi ngồi tới mười hai giờ, rồi về nghỉ. Sáng hôm sau quay lại tiễn bạn. Đứng ở nghĩa trang, tôi nghĩ nếu ngồi thêm vài tiếng nữa thì sao.' },
    ],
  },
  {
    id: 'ls63-khu-pho-thay-doi', age: 63,
    title: 'Con hẻm sắp giải tỏa',
    text: 'Con hẻm tôi ở ba mươi năm có quyết định giải tỏa để mở đường. Tiền đền bù đủ mua căn hộ ở xa trung tâm. Hàng xóm chia làm hai phe: nhận tiền, hoặc khiếu nại đòi thêm.',
    choices: [
      { label: 'Nhận tiền, chuyển đi', effects: { happiness: -1 }, flags: ['nhan_den_bu'],
        text: 'Tôi chuyển tới căn hộ mới, sạch sẽ, xa lạ. Hàng xóm cũ tản mỗi người một nơi. Mỗi tháng, mấy người cũ hẹn nhau ăn một bữa, ngồi kể chuyện con hẻm.' },
      { label: 'Cùng hàng xóm khiếu nại', effects: { happiness: 1, health: -1 }, money: 20000000, flags: ['khieu_nai_giai_toa'],
        text: 'Hai năm khiếu nại, họp hành. Được thêm một ít. Những buổi họp ấy, hàng xóm ngồi với nhau nhiều hơn ba mươi năm cộng lại.' },
    ],
  },
  {
    id: 'ls63-ban-doi-cham-soc', age: 63, needs: ['partner'],
    title: 'Ca mổ khớp háng',
    text: '{tenBanDoi} phải mổ thay khớp háng, nằm một chỗ hai tháng. Con cái ở xa. Thuê người chăm thì tốn, mà tôi tự chăm thì sức khỏe mình cũng không tốt, lưng hay đau.',
    choices: [
      { label: 'Tự chăm', effects: { happiness: 2, health: -3 }, flags: ['tu_cham_ban_doi'],
        text: 'Hai tháng tôi tự lo hết: thay băng, tắm, đút cơm. Có đêm lưng đau không ngủ được. {tenBanDoi} hồi phục, tập đi những bước đầu, tay bám vào tay tôi.' },
      { label: 'Thuê người phụ một phần', effects: { happiness: 1 },
        text: 'Người giúp việc tới buổi sáng, tôi lo buổi chiều tối. Hai đứa vẫn có thời gian ngồi nói chuyện. {tenBanDoi} hồi phục chậm nhưng đều.' },
    ],
  },
  {
    id: 'ls63-mot-minh-ban-nhay', age: 63, needs: ['single'],
    title: 'Lời mời nhảy',
    text: 'Ở câu lạc bộ khiêu vũ người cao tuổi, một người mời tôi nhảy mỗi tối thứ bảy, đã hai tháng. Hôm nay người ấy mời tôi đi ăn tối riêng. Tôi đã sống một mình rất lâu.',
    choices: [
      { label: 'Nhận lời', effects: { happiness: 3 }, flags: ['hen_ho_tuoi_gia'],
        text: 'Bữa tối giản dị. Người ấy kể về những năm sống một mình, tôi cũng kể. Không ai hứa hẹn gì. Tối thứ bảy tuần sau, người ấy vẫn mời tôi nhảy bài đầu tiên.' },
      { label: 'Cảm ơn, chỉ nhảy thôi', effects: { happiness: 1 },
        text: 'Người ấy gật đầu, không giận. Tối thứ bảy nào hai người cũng nhảy với nhau, rồi ai về nhà nấy. Vậy là đủ.' },
    ],
  },
  {
    id: 'ls63-con-nho-ve-o', age: 63, needs: ['children'], childAge: [30, 45],
    title: 'Con muốn đón về ở',
    text: '{tenCon} muốn đón tôi về ở chung cho tiện chăm sóc. Nhà con ở thành phố, căn hộ nhỏ, có cháu đang tuổi ăn học. Tôi quen nhà mình, quen hàng xóm, nhưng cũng biết sức mình đang yếu đi.',
    choices: [
      { label: 'Về ở với con', effects: { happiness: 1 }, flags: ['ve_o_voi_con'],
        text: 'Tôi có phòng riêng, nhỏ, sạch. Sáng đưa cháu đi học, chiều nấu cơm. Có lúc thấy mình là người khách trong nhà con. Có lúc thấy mình là trụ cột.' },
      { label: 'Ở lại nhà mình', effects: { happiness: 2 }, flags: ['o_lai_nha_minh'],
        text: '{tenCon} lắp camera, nút báo động, thuê người qua dọn dẹp mỗi tuần. Ngày nào con cũng gọi. Tôi vẫn sống trong nhà mình, giữa những thứ quen thuộc.' },
    ],
  },

   
  {
    id: 'ls64-bai-tap-tri-nho', age: 64,
    title: 'Bắt đầu quên',
    text: 'Tôi để ý mình hay quên: quên tên người quen, quên đã khóa cửa chưa. Bác sĩ nói bình thường ở tuổi này, nhưng nên tập luyện trí nhớ: học một thứ mới, chơi cờ, đọc sách.',
    choices: [
      { label: 'Học chơi cờ tướng', effects: { intelligence: 3 }, flags: ['hoc_co_tuong'],
        text: 'Tôi ra công viên, xin ngồi xem mấy ông chơi cờ. Một tháng sau được mời đánh thử. Thua liền mười ván. Ván thứ mười một thắng, cả nhóm vỗ tay.' },
      { label: 'Viết nhật ký mỗi tối', effects: { intelligence: 1, happiness: 1 }, flags: ['nhat_ky_tuoi_gia'],
        text: 'Mỗi tối tôi viết vài dòng: hôm nay gặp ai, ăn gì, nghĩ gì. Có hôm đọc lại tuần trước, ngạc nhiên vì những chuyện mình đã quên.' },
    ],
  },
  {
    id: 'ls64-hang-xom-gia-yeu', age: 64,
    title: 'Ông cụ nhà bên',
    text: 'Ông cụ nhà bên chín mươi tuổi, sống một mình, người thân ở xa. Mấy hôm nay ông không ra hiên ngồi như mọi khi. Gõ cửa, ông nói vọng ra không sao, giọng yếu.',
    choices: [
      { label: 'Gọi điện cho người nhà ông', effects: { intelligence: 1, happiness: 1 }, flags: ['bao_con_ong_cu'],
        text: 'Con trai ông về ngay trong ngày. Ông bị viêm phổi, đi viện kịp. Mấy tuần sau ông về, lại ra hiên ngồi, thấy tôi thì giơ tay vẫy.' },
      { label: 'Mang cháo sang mỗi ngày', effects: { happiness: 2 }, flags: ['mang_chao_ong_cu'],
        text: 'Ông ăn được nửa chén, nói cảm ơn. Ba ngày sau ông đỡ, rồi lại ra hiên. Từ đó, sáng nào ông cũng chờ tôi đi ngang để chào.' },
    ],
  },
  {
    id: 'ls64-chia-tai-san', age: 64,
    title: 'Chia của cải',
    text: 'Tôi muốn chia trước một phần của cải cho người thân khi mình còn minh mẫn, để tránh tranh chấp sau này. Nhưng có người nói chia sớm thì người thân dễ bỏ bê người già. Luật sư đã soạn sẵn giấy tờ.',
    choices: [
      { label: 'Chia một phần, giữ một phần', effects: { intelligence: 1, happiness: 1 }, money: -50000000, flags: ['chia_mot_phan'],
        text: 'Mọi người nhận phần mình, cảm ơn. Tôi giữ đủ để tự lo những năm cuối. Không ai thay đổi với tôi, ít ra là tôi không thấy.' },
      { label: 'Để theo di chúc', effects: { happiness: -1 },
        text: 'Tôi cất giấy tờ vào tủ. Mọi chuyện để sau này. Thỉnh thoảng tôi nghĩ, nếu mình không còn minh mẫn để giải thích thì sao.' },
    ],
  },
  {
    id: 'ls64-ban-doi-di-hoc', age: 64, needs: ['partner'],
    title: 'Học vẽ tuổi sáu mươi tư',
    text: '{tenBanDoi} mê vẽ tranh, muốn biến phòng khách thành chỗ vẽ, đầy giá vẽ, màu, mùi dầu thông. Tôi quen phòng khách gọn gàng, để tiếp khách. {tenBanDoi} hỏi ý tôi.',
    choices: [
      { label: 'Đồng ý', effects: { happiness: 2 }, flags: ['phong_ve_tranh'],
        text: 'Phòng khách thành xưởng vẽ, khách tới phải ngồi ghế nhựa. {tenBanDoi} vẽ mỗi ngày, tranh treo kín tường. Có một bức vẽ tôi đang ngủ trưa, tôi không biết lúc nào.' },
      { label: 'Đề nghị dùng phòng nhỏ', effects: { intelligence: 1 },
        text: '{tenBanDoi} dọn vào phòng nhỏ, hơi chật. Vẫn vẽ mỗi ngày. Tối nào {tenBanDoi} cũng mang ra một bức, hỏi tôi thấy sao.' },
    ],
  },
  {
    id: 'ls64-mot-minh-o-vien', age: 64, needs: ['single'],
    title: 'Ngày đi khám một mình',
    text: 'Tôi đi khám, bác sĩ nói phải làm thủ thuật nhỏ, cần người nhà đưa về vì có gây mê. Tôi không có ai để nhờ. Bệnh viện có dịch vụ đưa đón, nhưng phải đặt trước, tốn tiền.',
    choices: [
      { label: 'Gọi cho người bạn trong câu lạc bộ', effects: { happiness: 2 }, flags: ['nho_ban_clb'],
        text: 'Người bạn tới ngay, chờ ở hành lang. Đưa tôi về, nấu cho tôi tô cháo. Lúc về, bạn nói: “Lần sau tới lượt tôi nhờ nhé.” Hai người cười.' },
      { label: 'Đặt dịch vụ của bệnh viện', effects: { intelligence: 1 },
        text: 'Người đưa đón chu đáo, đúng giờ. Về tới nhà, người ấy đỡ tôi lên giường, chào rồi đi. Căn nhà im lặng, tôi nằm nghe tiếng đồng hồ.' },
    ],
  },
  {
    id: 'ls64-chau-hoc-gioi', age: 64, needs: ['children'], childAge: [32, 50],
    title: 'Học bổng của cháu',
    text: 'Đứa cháu đậu học bổng du học, nhưng học bổng không đủ chi phí sinh hoạt. Gia đình {tenCon} đang khó khăn. Tôi có một khoản để dành, đủ giúp cháu năm đầu.',
    choices: [
      { label: 'Giúp cháu', effects: { happiness: 3 }, flags: ['giup_chau_du_hoc'],
        text: 'Cháu đi, gửi thư tay về mỗi tháng. Thư viết lộn xộn, kể chuyện bạn bè, thời tiết, món ăn. Tôi xếp từng lá vào hộp, đánh số.' },
      { label: 'Giúp một phần, cháu tự làm thêm', effects: { intelligence: 1 },
        text: 'Cháu đi, làm thêm ở quán ăn. Vất vả, nhưng cháu nói học được nhiều thứ. Mỗi lần gọi về, cháu kể chuyện quán ăn nhiều hơn chuyện học.' },
    ],
  },

   
  {
    id: 'ls65-mat-bang-lai', age: 65,
    title: 'Chiếc chìa khóa xe',
    text: 'Phản xạ của tôi chậm đi. Tuần trước suýt va vào một đứa trẻ. Người thân khuyên thôi lái xe. Không lái thì mọi việc phải nhờ người khác, mà tôi ghét phải nhờ.',
    choices: [
      { label: 'Thôi lái xe', effects: { happiness: -1, health: 1 }, flags: ['thoi_lai_xe'],
        text: 'Tôi đưa chìa khóa cho người thân, tay hơi run. Từ đó đi xe buýt, đi bộ, gọi xe. Chậm hơn, nhưng tôi thấy nhiều thứ trên đường mà trước kia không thấy.' },
      { label: 'Chỉ lái quãng ngắn, ban ngày', effects: { happiness: 1 },
        text: 'Tôi chỉ lái đi chợ, đi chùa, ban ngày, đường quen. Đi chậm, người sau bóp còi. Mỗi lần về tới nhà, tôi ngồi trong xe một lúc rồi mới xuống.' },
    ],
  },
  {
    id: 'ls65-ve-que-to-tien', age: 65,
    title: 'Ngôi mộ tổ',
    text: 'Họ hàng bàn chuyện xây lại khu mộ tổ, mỗi nhà góp một phần lớn. Tôi là người lớn tuổi nhất còn lại của chi mình, mọi người chờ tôi quyết. Tiền dưỡng già của tôi không nhiều.',
    choices: [
      { label: 'Góp đủ phần', effects: { happiness: 2 }, flags: ['gop_mo_to'],
        text: 'Khu mộ xây xong, khang trang. Ngày khánh thành, người thân đông đủ. Tôi đứng trước mộ ông bà, nghĩ một ngày nào đó mình cũng nằm ở đây.' },
      { label: 'Đề nghị xây vừa phải', effects: { intelligence: 1 },
        text: 'Có người không vui, nhưng đa số đồng ý. Khu mộ đơn giản, sạch sẽ. Phần tiền dư, cả họ lập quỹ khuyến học cho con em trong họ.' },
    ],
  },
  {
    id: 'ls65-doc-sach-cho-tre', age: 65,
    title: 'Thư viện phường',
    text: 'Thư viện phường cần người đọc sách cho trẻ em chiều chủ nhật. Giọng tôi khàn, mắt kém, đọc chậm. Người phụ trách nói tụi nhỏ thích nghe người già đọc, vì người già đọc chậm, dễ nghe.',
    choices: [
      { label: 'Nhận lời', effects: { happiness: 3 }, flags: ['doc_sach_cho_tre'],
        text: 'Chủ nhật nào tôi cũng đọc một cuốn. Tụi nhỏ ngồi quây quanh, có đứa ngủ gật trong lòng tôi. Có đứa nhớ tôi hơn nhớ truyện.' },
      { label: 'Từ chối', effects: { happiness: -1 },
        text: 'Thư viện tìm được một sinh viên đọc giúp. Tôi ghé thư viện mượn sách, thấy tụi nhỏ ngồi nghe. Đứng ở cửa một lúc, rồi đi.' },
    ],
  },
  {
    id: 'ls65-ban-doi-mat-ngu', age: 65, needs: ['partner'],
    title: 'Đêm không ngủ',
    text: '{tenBanDoi} mất ngủ, đêm nào cũng trằn trọc, làm tôi cũng thức theo. Bác sĩ cho thuốc ngủ, nhưng {tenBanDoi} sợ quen thuốc. {tenBanDoi} đề nghị hai đứa ngủ riêng một thời gian.',
    choices: [
      { label: 'Thức cùng, nói chuyện', effects: { happiness: 2, health: -1 }, flags: ['thuc_cung_ban_doi'],
        text: 'Những đêm mất ngủ, hai đứa ngồi dậy pha trà, nói chuyện về đủ thứ. Có đêm nói tới ba giờ sáng rồi cùng ngủ quên. {tenBanDoi} nói đó là những đêm dễ chịu nhất.' },
      { label: 'Ngủ riêng một thời gian', effects: { health: 1 },
        text: 'Hai đứa ngủ hai phòng. Tôi ngủ ngon. {tenBanDoi} vẫn mất ngủ, nhưng không còn lo làm phiền tôi. Sáng nào hai đứa cũng ăn sáng cùng nhau.' },
    ],
  },
  {
    id: 'ls65-mot-minh-ban-cung-tuoi', age: 65, needs: ['single'],
    title: 'Nhóm bạn sống một mình',
    text: 'Mấy người bạn cùng tuổi, đều sống một mình, rủ tôi lập nhóm: mỗi ngày nhắn tin báo bình an trước chín giờ sáng. Ai không nhắn thì người khác gọi, không gọi được thì tới nhà.',
    choices: [
      { label: 'Tham gia', effects: { happiness: 3 }, flags: ['nhom_bao_binh_an'],
        text: 'Sáng nào cũng có năm tin nhắn: “Ổn.” Có hôm một người quên, cả nhóm gọi liên tục. Người ấy nghe máy, ngái ngủ, bị cả nhóm mắng. Ai cũng cười.' },
      { label: 'Cảm ơn, tự lo được', effects: { happiness: -1 },
        text: 'Tôi nói mình còn khỏe. Nhóm vẫn chạy, có bốn người. Có buổi sáng tôi tỉnh dậy, nhớ tới nhóm, nghĩ không ai biết hôm nay mình có dậy được hay không.' },
    ],
  },
  {
    id: 'ls65-con-it-ve', age: 65, needs: ['children'], childAge: [32, 50],
    title: 'Tết con không về',
    text: '{tenCon} gọi điện, nói Tết này công việc bận, không về được, hẹn sang năm. Đây là năm thứ hai. Tôi đã chuẩn bị nồi thịt kho, phòng của con đã dọn sẵn.',
    choices: [
      { label: 'Nói thật mình buồn', effects: { happiness: 1 }, flags: ['noi_buon_voi_con'],
        text: '{tenCon} im lặng rất lâu. Hai ngày sau, con gọi lại, nói đã xin nghỉ được ba ngày. Mùng hai, con về, ôm tôi ở cổng. Nồi thịt kho vẫn còn.' },
      { label: 'Nói: “Không sao, con lo việc đi”', effects: { happiness: -2 },
        text: '{tenCon} cảm ơn, hứa năm sau. Đêm giao thừa tôi ăn một mình, gọi video với con. Con xoay màn hình cho tôi xem pháo hoa bên đó.' },
    ],
  },

   
  {
    id: 'ls66-te-nga', age: 66,
    title: 'Cú ngã ngoài chợ',
    text: 'Tôi ngã ở chợ, trầy tay, đau hông. Không gãy gì, nhưng từ đó đi đâu cũng sợ ngã. Bác sĩ khuyên dùng gậy. Tôi thấy cây gậy là thứ biến mình thành người già thật sự.',
    choices: [
      { label: 'Dùng gậy', effects: { health: 2, happiness: -1 }, flags: ['dung_gay'],
        text: 'Mấy ngày đầu thấy ngượng. Rồi quen. Tôi đi vững hơn, đi xa hơn. Cây gậy thành bạn đồng hành, tôi còn dán lên đó mấy cái nhãn dán của đứa cháu.' },
      { label: 'Không dùng, đi cẩn thận', effects: { happiness: 1 },
        text: 'Tôi đi chậm, nhìn kỹ đường. Không ngã thêm lần nào. Nhưng tôi ít ra ngoài hơn, đi chợ cũng nhờ người.' },
    ],
  },
  {
    id: 'ls66-ke-chuyen-chien-tranh', age: 66,
    title: 'Câu chuyện chưa kể',
    text: 'Một nhóm sinh viên làm dự án ghi lại ký ức người cao tuổi, mời tôi kể chuyện đời mình. Có những chuyện tôi chưa từng kể với ai, kể cả người thân. Kể ra thì nhẹ lòng, nhưng ai cũng sẽ biết.',
    choices: [
      { label: 'Kể hết', effects: { happiness: 2, intelligence: 1 }, flags: ['ke_chuyen_doi'],
        text: 'Tôi kể ba buổi chiều. Sinh viên ghi âm, có bạn khóc. Khi dự án công bố, người thân nghe được, gọi điện hỏi sao không kể sớm. Tôi nói lúc trước chưa có ai hỏi.' },
      { label: 'Chỉ kể những chuyện vui', effects: { happiness: 1 },
        text: 'Tôi kể chuyện tuổi thơ, chuyện đi học, chuyện cưới hỏi. Sinh viên cảm ơn. Những chuyện khác, tôi giữ lại, như cất một cái hộp chưa tới lúc mở.' },
    ],
  },
  {
    id: 'ls66-vi-trong-tui', age: 66,
    title: 'Người bán vé số',
    text: 'Bà cụ bán vé số đi ngang nhà tôi mỗi ngày, chân đau, tóc bạc trắng, già hơn tôi. Bà mời mua. Tôi không bao giờ mua vé số. Nhưng sáng nay trời mưa, bà vẫn đi, ướt sũng.',
    choices: [
      { label: 'Mời bà vào trú mưa, uống trà', effects: { happiness: 2 }, flags: ['ban_ba_ban_ve_so'],
        text: 'Bà ngồi ở hiên, kể chuyện người thân ở quê. Mưa tạnh, bà đứng dậy, nhất định không nhận tiền tôi biếu. Từ đó, ngày mưa nào bà cũng ghé uống trà.' },
      { label: 'Mua một tờ vé số', effects: { happiness: 1 },
        text: 'Bà cảm ơn, đi tiếp. Tờ vé số không trúng. Tôi mua thêm vài lần, không phải vì mong trúng.' },
    ],
  },
  {
    id: 'ls66-ban-doi-nho-nha-cu', age: 66, needs: ['partner'],
    title: 'Trở về chỗ cũ',
    text: '{tenBanDoi} muốn quay lại thăm con phố nơi hai đứa ở trọ thời mới cưới. Đường xa, sức khỏe {tenBanDoi} không tốt. {tenBanDoi} nói: “Đi được lần này, sau này không biết có đi nổi nữa không.”',
    choices: [
      { label: 'Đi', effects: { happiness: 3, health: -1 }, flags: ['ve_pho_cu'],
        text: 'Con phố đã khác hẳn, căn nhà trọ cũ thành quán cà phê. Hai đứa ngồi trong quán, đúng chỗ ngày xưa kê cái giường. {tenBanDoi} nắm tay tôi, nói: “Ở đây mình nghèo mà vui ghê.”' },
      { label: 'Xem ảnh trên mạng', effects: { happiness: 1 },
        text: 'Đứa cháu tìm được ảnh con phố trên mạng. Hai đứa ngồi xem, chỉ trỏ, nhận ra góc này góc kia. {tenBanDoi} nói: “Cũng như đi rồi.” Nhưng giọng hơi tiếc.' },
    ],
  },
  {
    id: 'ls66-mot-minh-nuoi-cay', age: 66, needs: ['single'],
    title: 'Khu vườn trên sân thượng',
    text: 'Tôi trồng cả một khu vườn trên sân thượng: lan, hồng, rau thơm. Leo cầu thang lên tưới mỗi ngày ngày càng khó. Người thân khuyên bỏ bớt. Khu vườn là việc tôi mong nhất mỗi sáng.',
    choices: [
      { label: 'Giữ khu vườn, lắp hệ thống tưới', effects: { happiness: 2 }, flags: ['vuon_san_thuong'],
        text: 'Đứa cháu lắp giúp hệ thống tưới tự động. Tôi lên sân thượng hai ngày một lần, ngồi giữa vườn uống trà. Hoa lan nở đúng dịp sinh nhật tôi.' },
      { label: 'Chuyển vài chậu xuống ban công', effects: { health: 1 },
        text: 'Tôi giữ năm chậu yêu thích nhất ở ban công. Phần còn lại cho hàng xóm. Đi ngang nhà họ, tôi thấy hoa của mình nở bên cửa sổ nhà người khác.' },
    ],
  },
  {
    id: 'ls66-con-gap-kho', age: 66, needs: ['children'], childAge: [32, 50],
    title: 'Con gặp khó khăn',
    text: '{tenCon} làm ăn thua lỗ, nợ một khoản lớn, không dám nói với ai, chỉ gọi cho tôi. Tôi có căn nhà đang ở, có thể thế chấp để giúp con. Thế chấp thì nếu con không trả được, tôi mất nhà.',
    choices: [
      { label: 'Thế chấp nhà giúp con', effects: { happiness: -1 }, flags: ['the_chap_giup_con'],
        text: '{tenCon} trả nợ được, làm lại từ đầu. Mỗi tháng con gửi tiền trả ngân hàng, đều đặn. Ba năm sau, con mang sổ đỏ về trả, quỳ xuống trước mặt tôi.' },
      { label: 'Giúp tiền mặt, không thế chấp', effects: { intelligence: 1 }, money: -50000000,
        text: 'Tôi đưa con số tiền dành dụm. Không đủ trả hết nợ, nhưng đủ để con thương lượng với chủ nợ. Con mất ba năm để trả. Tôi giữ được nhà, và con biết tôi đã cân nhắc.' },
    ],
  },

   
  {
    id: 'ls67-chan-tay-yeu', age: 67,
    title: 'Lớp thái cực quyền',
    text: 'Chân tay yếu dần, bác sĩ khuyên tập thái cực quyền ở công viên mỗi sáng, giúp giữ thăng bằng. Lớp toàn người lạ, sáu giờ sáng phải có mặt. Tôi chưa từng tập môn này.',
    choices: [
      { label: 'Đi tập', effects: { health: 3 }, flags: ['tap_thai_cuc'],
        text: 'Tuần đầu tôi đứng không vững, luống cuống. Tháng thứ hai, tôi đứng một chân được mười giây. Cả lớp toàn người già, ai cũng chậm, không ai cười ai.' },
      { label: 'Tập đi bộ ở nhà', effects: { health: 1 },
        text: 'Tôi đi bộ quanh nhà mỗi ngày nửa tiếng. Chân đỡ yếu hơn một chút. Sáng nào đi ngang công viên, tôi nhìn lớp tập thái cực quyền chuyển động chậm như mây.' },
    ],
  },
  {
    id: 'ls67-giup-hang-xom-dien-thoai', age: 67,
    title: 'Người hướng dẫn trong khu',
    text: 'Mấy người hàng xóm già trong khu hay nhờ tôi chỉ cách dùng điện thoại, vì tôi học trước. Ngày nào cũng có người gõ cửa, hỏi đi hỏi lại một chuyện. Tôi bắt đầu thấy mệt.',
    choices: [
      { label: 'Mở lớp hướng dẫn mỗi tuần', effects: { happiness: 2, intelligence: 1 }, flags: ['lop_dien_thoai_khu'],
        text: 'Chiều thứ bảy, tôi mở lớp ở nhà văn hóa. Mười người tới, mang theo điện thoại và sổ ghi chép. Ngày thường ít người gõ cửa hơn. Thứ bảy thì vui như hội.' },
      { label: 'Nói khéo là mình bận', effects: { happiness: -1 },
        text: 'Hàng xóm ngại, ít gõ cửa. Có bà cụ không biết hỏi ai, bấm nhầm, gửi tiền nhầm tài khoản. Tôi nghe tin, thấy mình có lỗi.' },
    ],
  },
  {
    id: 'ls67-chuyen-di-hanh-huong', age: 67,
    title: 'Chuyến hành hương',
    text: 'Nhóm bạn già rủ đi hành hương ở một ngôi chùa trên núi, phải leo hàng nghìn bậc đá. Ai cũng nói đi được lần này là mãn nguyện. Tôi sợ đầu gối không chịu nổi.',
    choices: [
      { label: 'Đi, leo từ từ', effects: { happiness: 3, health: -2 }, flags: ['hanh_huong_nui'],
        text: 'Tôi leo chậm nhất nhóm, nghỉ ở mỗi trăm bậc. Lên tới chùa thì trời đã chiều. Đứng nhìn mây dưới chân, tôi thấy mình vẫn còn làm được nhiều thứ.' },
      { label: 'Đi cáp treo', effects: { happiness: 2 },
        text: 'Tôi đi cáp treo, đợi cả nhóm trên đỉnh. Họ lên tới, thở dốc, trêu tôi gian lận. Tôi mời mọi người uống trà nóng.' },
    ],
  },
  {
    id: 'ls67-ban-doi-giu-thuoc', age: 67, needs: ['partner'],
    title: 'Hộp chia thuốc',
    text: '{tenBanDoi} hay quên uống thuốc huyết áp, có hôm uống hai lần. Tôi mua một hộp chia thuốc theo ngày, nhưng {tenBanDoi} không thích bị nhắc như trẻ con. Hôm qua huyết áp lên cao.',
    choices: [
      { label: 'Đưa thuốc tận tay mỗi ngày', effects: { happiness: -1 }, flags: ['dua_thuoc_ban_doi'],
        text: 'Sáng nào tôi cũng mang thuốc và ly nước tới. {tenBanDoi} cằn nhằn mấy tuần, rồi quen. Có hôm {tenBanDoi} tự chờ ở bàn, chìa tay ra xin thuốc.' },
      { label: 'Đặt báo thức trên điện thoại', effects: { intelligence: 1 },
        text: 'Đứa cháu cài báo thức, mỗi sáng điện thoại nhắc. {tenBanDoi} tự uống, thấy mình vẫn tự lo được. Huyết áp ổn định hơn.' },
    ],
  },
  {
    id: 'ls67-mot-minh-o-vien-duong-lao', age: 67, needs: ['single'],
    title: 'Tới lượt',
    text: 'Viện dưỡng lão gọi báo đã tới lượt tôi, có một phòng trống. Tôi đã đăng ký từ nhiều năm trước. Tôi vẫn còn tự lo được, nhưng nếu từ chối, lần sau phải chờ thêm nhiều năm.',
    choices: [
      { label: 'Vào viện', effects: { happiness: 1, health: 1 }, flags: ['vao_vien_duong_lao'],
        text: 'Phòng nhỏ, có cửa sổ nhìn ra vườn. Có người nấu ăn, có người chơi cờ cùng. Đêm đầu không ngủ được, nhớ nhà. Tháng thứ hai, tôi được bầu làm trưởng nhóm đọc báo.' },
      { label: 'Nhường lượt, ở nhà thêm', effects: { happiness: 1 },
        text: 'Tôi nhường lượt cho người khác, ở nhà thêm vài năm. Mỗi lần mệt, tôi lại nghĩ tới căn phòng có cửa sổ nhìn ra vườn ấy.' },
    ],
  },
  {
    id: 'ls67-chau-cuoi', age: 67, needs: ['children'], childAge: [38, 55],
    title: 'Đám cưới đứa cháu',
    text: 'Đứa cháu lớn nhất sắp cưới, mời tôi phát biểu trong lễ cưới. Nó nói muốn nghe lời chúc của người lớn tuổi nhất trong nhà. Tôi đã lâu không đứng trước đông người.',
    choices: [
      { label: 'Nhận lời', effects: { happiness: 3 }, flags: ['phat_bieu_cuoi_chau_noi'],
        text: 'Tôi kể chuyện ngày cưới của mình, những năm nghèo khó, những năm tốt đẹp. Giọng run, nhưng nói hết. Đứa cháu chạy xuống ôm tôi trước mặt cả hội trường.' },
      { label: 'Viết thư tay tặng cháu', effects: { happiness: 2 },
        text: 'Tôi viết một lá thư tay, dặn những điều muốn nói. Đứa cháu đọc thư trong đêm tân hôn, sáng hôm sau gọi cho tôi, giọng nghẹn.' },
    ],
  },

   
  {
    id: 'ls68-thinh-luc', age: 68,
    title: 'Máy trợ thính',
    text: 'Tai tôi nghe kém, người khác phải nói to, nói lại nhiều lần. Có lúc tôi giả vờ nghe được, gật đầu cho qua. Máy trợ thính đắt, đeo vào nhìn thấy rõ.',
    choices: [
      { label: 'Đeo máy trợ thính', effects: { happiness: 2, health: 1 }, money: -20000000, flags: ['deo_tro_thinh'],
        text: 'Lần đầu đeo, tôi nghe thấy tiếng chim ngoài cửa sổ, tiếng nồi cơm sôi, những thứ đã quên từ lâu. Nói chuyện với người khác không còn phải đoán.' },
      { label: 'Không đeo', effects: { happiness: -1 },
        text: 'Tôi tiếp tục gật đầu cho qua. Người ta ít nói chuyện với tôi hơn, vì mệt. Tôi ngồi trong những bữa cơm đông người, nghe như qua một bức tường.' },
    ],
  },
  {
    id: 'ls68-lam-chung-di-chuc', age: 68,
    title: 'Người làm chứng',
    text: 'Người bạn già nhờ tôi làm chứng cho bản di chúc, chia hết tài sản cho người con út, không cho người con cả. Tôi biết người con cả là người chăm sóc bạn những năm gần đây.',
    choices: [
      { label: 'Hỏi bạn lý do', effects: { intelligence: 1 }, flags: ['hoi_ly_do_di_chuc'],
        text: 'Bạn kể chuyện cũ giữa hai cha con, những chuyện tôi không biết. Bạn suy nghĩ thêm một tuần, rồi sửa lại di chúc, chia đều. Bạn nói: “Cảm ơn mày đã hỏi.”' },
      { label: 'Làm chứng, không hỏi', effects: { happiness: -1 },
        text: 'Tôi ký làm chứng. Một năm sau bạn mất. Hai người con kiện nhau. Người con cả tới gặp tôi, hỏi tôi có biết gì không. Tôi kể những gì tôi biết.' },
    ],
  },
  {
    id: 'ls68-con-meo-hoang', age: 68,
    title: 'Ngôi nhà quá rộng',
    text: 'Căn nhà ngày càng rộng so với sức mình: nhiều phòng không dùng, nhiều đồ không đụng tới. Người thân gợi ý chuyển sang căn hộ nhỏ có thang máy, gần chợ, gần bệnh viện.',
    choices: [
      { label: 'Chuyển nhà', effects: { health: 2, happiness: -1 }, flags: ['chuyen_can_ho_nho'],
        text: 'Tôi cho đi quá nửa đồ đạc. Căn hộ nhỏ, đi mấy bước là tới bếp. Đêm đầu không ngủ được, nghe tiếng thang máy chạy. Rồi quen.' },
      { label: 'Ở lại, đóng bớt phòng', effects: { happiness: 1 },
        text: 'Tôi chỉ dùng tầng dưới, khóa các phòng trên. Căn nhà yên tĩnh như một bảo tàng nhỏ. Có hôm tôi mở cửa phòng cũ, ngồi một lúc rồi khóa lại.' },
    ],
  },
  {
    id: 'ls68-ban-doi-nam-vien', age: 68, needs: ['partner'],
    title: 'Ngủ ở bệnh viện',
    text: '{tenBanDoi} nằm viện vì viêm phổi, phải ở một tuần. Bệnh viện chỉ cho một người nhà ở lại ban đêm, trên chiếc ghế xếp. Con cái đề nghị thay phiên, để tôi về nhà nghỉ.',
    choices: [
      { label: 'Ở lại mỗi đêm', effects: { happiness: 2, health: -2 }, flags: ['o_lai_vien_cung'],
        text: 'Đêm nào tôi cũng nằm trên ghế xếp, nghe tiếng thở của {tenBanDoi}. Có đêm {tenBanDoi} tỉnh dậy, thò tay ra tìm tay tôi. Tôi đã ở đó.' },
      { label: 'Thay phiên với người thân', effects: { happiness: 1 },
        text: 'Tôi về nhà ngủ hai đêm. Hai đêm ấy, tôi ngủ không ngon, nửa đêm gọi điện hỏi thăm. Đứa cháu trả lời: “Ngủ ngon rồi, đừng lo.”' },
    ],
  },
  {
    id: 'ls68-mot-minh-hoc-ve', age: 68, needs: ['single'],
    title: 'Triển lãm nhỏ',
    text: 'Mấy năm nay tôi vẽ tranh cho vui. Câu lạc bộ người cao tuổi đề nghị tổ chức một triển lãm nhỏ tranh của tôi. Tôi sợ tranh mình xấu, người ta cười.',
    choices: [
      { label: 'Đồng ý triển lãm', effects: { happiness: 4 }, flags: ['trien_lam_tuoi_gia'],
        text: 'Hai mươi bức tranh treo trong nhà văn hóa. Có người dừng lại rất lâu trước một bức. Một đứa trẻ hỏi tôi vẽ con mèo này lâu không. Tôi nói, cả đời.' },
      { label: 'Tặng tranh cho bạn bè', effects: { happiness: 2 },
        text: 'Tôi tặng mỗi người bạn một bức. Đi thăm ai, cũng thấy tranh mình treo ở đâu đó trong nhà họ, có khi ở phòng khách, có khi trong nhà tắm.' },
    ],
  },
  {
    id: 'ls68-chat-nho', age: 68, needs: ['children'], childAge: [36, 55],
    title: 'Cháu nội ngoại ở xa',
    text: 'Đứa cháu nhỏ ở xa chỉ biết tôi qua màn hình điện thoại. Lần về thăm, nó nép sau ba mẹ, không chịu lại gần. Tôi muốn ở lại chơi với nó một tuần, nhưng nhà con chật.',
    choices: [
      { label: 'Ở lại một tuần', effects: { happiness: 3 }, flags: ['o_lai_voi_chau'],
        text: 'Ngày thứ ba, đứa cháu leo lên lòng tôi đòi kể chuyện. Ngày thứ năm, nó không cho tôi về. Lúc tôi đi, nó khóc, ôm chân tôi như tôi từng ôm chân mẹ.' },
      { label: 'Ở hai ngày rồi về', effects: { happiness: 1 },
        text: 'Đứa cháu vừa bắt đầu quen thì tôi về. Lần gọi video sau, nó vẫy tay chào, rồi chạy đi chơi. Tôi nhìn màn hình thêm một lúc.' },
    ],
  },

   
  {
    id: 'ls69-ban-cung-lop-mat', age: 69,
    title: 'Danh sách lớp',
    text: 'Lớp cấp ba của tôi lập danh sách những người còn sống để họp lớp năm mươi năm. Ba mươi người, giờ còn mười bảy. Lớp trưởng nhờ tôi gọi điện cho từng người, vì tôi nhớ tên nhiều nhất.',
    choices: [
      { label: 'Gọi từng người', effects: { happiness: 2 }, flags: ['goi_ca_lop'],
        text: 'Mười bảy cuộc gọi, mỗi cuộc kéo dài hàng tiếng. Có người khóc, có người không nhớ tôi, có người nhớ tôi từng làm vỡ bình hoa. Họp lớp có mười hai người tới.' },
      { label: 'Nhắn tin vào nhóm', effects: { intelligence: 1 },
        text: 'Tôi gửi thông tin vào nhóm chat. Tám người trả lời. Họp lớp có bảy người. Ngồi nhìn những chỗ trống, tôi nghĩ nếu mình gọi điện thì có khác không.' },
    ],
  },
  {
    id: 'ls69-hen-ho-lai', age: 69,
    title: 'Lá thư của người lạ',
    text: 'Tôi nhận được một lá thư tay từ một người lạ. Người ấy viết: năm mươi năm trước, tôi từng giúp người ấy một việc nhỏ trên chuyến tàu đêm, người ấy chưa từng quên. Người ấy muốn gặp tôi để cảm ơn.',
    choices: [
      { label: 'Gặp người ấy', effects: { happiness: 3 }, flags: ['gap_nguoi_la_tau_dem'],
        text: 'Người ấy giờ là một cụ già, mang theo tấm ảnh cũ. Tôi không nhớ chuyện năm ấy. Người ấy kể, rất chi tiết. Lúc chia tay, người ấy nói: “Một việc nhỏ của người này có thể là cả cuộc đời của người khác.”' },
      { label: 'Viết thư trả lời', effects: { happiness: 2 },
        text: 'Tôi viết thư cảm ơn, kể rằng mình không nhớ chuyện ấy, nhưng vui khi biết. Hai người viết thư cho nhau thêm vài năm, chưa từng gặp mặt.' },
    ],
  },
  {
    id: 'ls69-sach-mat-chu', age: 69,
    title: 'Sách nói',
    text: 'Mắt tôi kém, đọc sách vài trang là mỏi. Đứa cháu cài cho tôi ứng dụng sách nói, nhưng tôi quen cầm sách, lật từng trang, ngửi mùi giấy. Kệ sách trong nhà vẫn còn nhiều cuốn chưa đọc.',
    choices: [
      { label: 'Nghe sách nói', effects: { intelligence: 2 }, flags: ['nghe_sach_noi'],
        text: 'Tôi nghe sách mỗi tối trước khi ngủ, nghe hết ba cuốn trong một tháng. Không ngửi được mùi giấy, nhưng câu chuyện vẫn là câu chuyện.' },
      { label: 'Đọc chậm, mỗi ngày vài trang', effects: { happiness: 1 },
        text: 'Mỗi ngày tôi đọc năm trang, bằng kính lúp. Một cuốn sách đọc cả tháng mới hết. Đọc chậm, nên nhớ lâu.' },
    ],
  },
  {
    id: 'ls69-ban-doi-ky-niem-bon-muoi', age: 69, needs: ['partner'],
    title: 'Những người còn lại',
    text: 'Bạn bè hai đứa lần lượt ra đi. Tối nay, {tenBanDoi} đề nghị lập một danh sách những người bạn còn sống, rồi mỗi tháng mời một người tới nhà ăn cơm, trước khi quá muộn.',
    choices: [
      { label: 'Lập danh sách, bắt đầu ngay', effects: { happiness: 3 }, flags: ['moi_ban_moi_thang'],
        text: 'Danh sách có mười một người. Tháng đầu, một người bạn tới, ngồi tới khuya. Tháng thứ ba, người trong danh sách mất trước khi kịp mời. Hai đứa mời người tiếp theo sớm hơn dự định.' },
      { label: 'Nói: “Để từ từ”', effects: { happiness: -1 },
        text: '{tenBanDoi} gật đầu. Danh sách nằm trên tủ lạnh. Mỗi lần có tin buồn, {tenBanDoi} lại gạch một cái tên. Danh sách ngắn dần.' },
    ],
  },
  {
    id: 'ls69-mot-minh-chuyen-hau-su', age: 69, needs: ['single'],
    title: 'Những món đồ để lại',
    text: 'Tôi muốn quyết định trước những món đồ quý của mình sẽ về tay ai: cuốn album, cây đàn, chiếc đồng hồ. Không có con cái, tôi phân vân giữa người thân và những người bạn đã ở bên mình.',
    choices: [
      { label: 'Gặp từng người, trao tận tay', effects: { happiness: 3 }, flags: ['trao_do_tan_tay'],
        text: 'Tôi trao cuốn album cho đứa cháu, cây đàn cho người bạn hàng xóm, chiếc đồng hồ cho người bạn thân nhất. Mỗi lần trao, tôi kể câu chuyện của món đồ. Có người khóc.' },
      { label: 'Ghi vào di chúc', effects: { intelligence: 1 },
        text: 'Tôi ghi rõ từng món vào di chúc. Mọi người sẽ biết khi tôi không còn. Có hôm tôi nghĩ, sao không trao tận tay để được thấy họ vui.' },
    ],
  },
  {
    id: 'ls69-chau-hoi-chuyen-xua', age: 69, needs: ['children'], childAge: [36, 55],
    title: 'Bài tập của cháu',
    text: 'Đứa cháu có bài tập ở trường: phỏng vấn ông bà về cuộc sống ngày xưa. Nó gọi điện, hỏi tôi hồi nhỏ chơi gì, ăn gì, có điện thoại không. Nó còn hỏi: điều gì làm tôi tiếc nhất.',
    choices: [
      { label: 'Kể thật điều mình tiếc nhất', effects: { happiness: 2, intelligence: 1 }, flags: ['ke_chau_dieu_tiec'],
        text: 'Tôi kể một chuyện cũ, chuyện chưa từng kể với con. Đứa cháu im lặng, rồi nói: “Con sẽ không làm vậy.” Bài tập của nó được điểm cao, cô giáo đọc trước lớp.' },
      { label: 'Kể những chuyện vui', effects: { happiness: 2 },
        text: 'Tôi kể chuyện thả diều, đá banh, ăn kẹo kéo ở cổng chợ. Đứa cháu cười suốt. Còn câu cuối, tôi nói: “Không có gì tiếc cả.” Không hẳn là thật.' },
    ],
  },

   
  {
    id: 'ls-phong-hop-lop', ages: [60, 72], requiresAny: ['khai_phong', 'im_lang_binh_hoa', 'nhan_thay_phong', 'nhac_binh_hoa'],
    title: 'Phong ở buổi họp lớp',
    text: 'Buổi họp lớp tiểu học sau sáu mươi năm. Phong tới, tóc bạc trắng, chống gậy. Phong ngồi xuống cạnh tôi, rồi kể cho cả bàn nghe chuyện bình hoa năm lớp ba. Mọi người quay sang nhìn tôi.',
    choices: [
      { label: 'Kể lại phần của mình', effects: { happiness: 3 }, flags: ['ke_chuyen_binh_hoa'],
        text: 'Tôi kể lại đúng những gì mình đã làm hôm ấy, không thêm bớt. Cả bàn cười. Phong vỗ vai tôi: “Sáu mươi năm rồi, cuối cùng cũng nghe mày kể.” Hai đứa cụng ly.' },
      { label: 'Cười, để Phong kể', effects: { happiness: 1 },
        text: 'Phong kể theo cách của Phong, có chỗ sai, tôi không sửa. Cuối buổi, Phong nói nhỏ: “Hồi đó tao sợ lắm.” Tôi nói: “Tao cũng vậy.”' },
    ],
  },
  {
    id: 'ls-chau-hoc-dan', ages: [62, 80], requiresAny: ['tap_dan_lai', 'hoc_dan'], needs: ['children'], childAge: [30, 60],
    title: 'Dạy cháu đàn',
    text: 'Đứa cháu thấy cây đàn trong nhà, xin tôi dạy. Ngón tay tôi giờ run, đàn sai nhiều. Nó mới bảy tuổi, ngồi không yên quá năm phút.',
    choices: [
      { label: 'Dạy mỗi tuần một bài', effects: { happiness: 3 }, flags: ['day_chau_dan'],
        text: 'Mỗi chủ nhật, tôi với cháu ngồi cạnh đàn. Cháu học nhanh hơn tôi ngày xưa. Có hôm nó đàn một bài, vấp đúng chỗ tôi từng vấp năm chín tuổi. Tôi bật cười.' },
      { label: 'Tìm thầy cho cháu', effects: { intelligence: 1 },
        text: 'Cháu học với thầy, tiến bộ nhanh. Mỗi lần về nhà tôi, nó đàn cho tôi nghe. Tôi ngồi nghe, nhìn những ngón tay nhỏ chạy trên phím đàn cũ.' },
    ],
  },
  {
    id: 'ls-canh-dem-cuoi', ages: [60, 80], requiresAny: ['canh_ba', 'ngu_dem_canh'],
    title: 'Đứa cháu nhỏ trong đêm canh',
    text: 'Đêm canh linh cữu một người họ hàng, một đứa cháu chừng mười ba tuổi ngồi cạnh tôi. Người lớn đi nằm hết. Đứa cháu hỏi tôi có muốn đi nằm không, nó canh thay. Tôi nhớ có một đêm như vậy, rất lâu rồi.',
    choices: [
      { label: 'Ở lại, kể chuyện cho cháu', effects: { happiness: 2, health: -1 }, flags: ['ke_chuyen_dem_canh'],
        text: 'Tôi kể về người đã khuất, kể cả chuyện bà tôi ngày xưa gánh hàng đi chợ. Đứa cháu nghe tới gà gáy. Sáng ra, nó nói nó sẽ nhớ đêm nay.' },
      { label: 'Để cháu canh, mình đi nằm', effects: { health: 1 },
        text: 'Tôi đi nằm, nhưng không ngủ được. Nửa đêm ra xem, đứa cháu vẫn ngồi đó, thẳng lưng, nhìn ngọn đèn. Tôi ngồi xuống cạnh nó, không nói gì, tới sáng.' },
    ],
  },
  {
    id: 'ls-chau-nuoi-lon', ages: [64, 78], requires: ['nuoi_chau'],
    title: 'Đứa cháu năm ấy',
    text: 'Đứa cháu tôi nuôi từ năm nó mười tuổi giờ đã đi làm, lập gia đình. Hôm nay nó về, nói muốn đón tôi về ở cùng, để nó chăm tôi, như ngày xưa tôi đã chăm nó.',
    choices: [
      { label: 'Về ở với cháu', effects: { happiness: 3 }, flags: ['ve_o_voi_chau_nuoi'],
        text: 'Nhà cháu nhỏ, nhưng có phòng cho tôi. Sáng nào nó cũng pha trà, hỏi tôi ngủ ngon không. Có đêm tôi nghe nó kể với vợ: “Không có người ấy thì không có tôi.”' },
      { label: 'Cảm ơn, ở nhà mình', effects: { happiness: 2 },
        text: 'Tôi nói còn tự lo được. Cháu không ép, nhưng tuần nào cũng về, mang theo đồ ăn, sửa giúp cái này cái kia. Nó gọi tôi bằng cái tên ngày xưa nó vẫn gọi.' },
    ],
  },
  {
    id: 'ls-cay-cau-nam-ay', ages: [64, 85], requires: ['xay_cau'],
    title: 'Cây cầu nhỏ',
    text: 'Một người trẻ tìm tới nhà, nói lớn lên ở ngôi làng có cây cầu tôi góp tiền xây năm nào. Ngày đó, nó là một trong những đứa trẻ chạy qua cầu đi học. Giờ nó là giáo viên ở chính ngôi trường ấy.',
    choices: [
      { label: 'Mời vào nhà, nghe kể chuyện', effects: { happiness: 4 }, flags: ['nguoi_qua_cau'],
        text: 'Nó kể ngôi làng giờ đã có đường nhựa, nhưng tụi nhỏ vẫn thích đi qua cây cầu cũ. Nó mang theo một tấm ảnh: tấm biển nhỏ trên cầu, không ghi tên ai, chỉ ghi “cảm ơn”.' },
      { label: 'Cảm ơn, nói đó là việc nhỏ', effects: { happiness: 2 },
        text: 'Nó nói với nó thì không nhỏ. Trước khi đi, nó cúi chào rất thấp. Tôi đứng ở cửa nhìn theo, thấy mình đã làm được một việc tử tế.' },
    ],
  },
];
