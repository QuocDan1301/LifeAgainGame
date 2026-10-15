 
 
export const stage40To49 = [
   
  {
    id: 'ls40-mat-kem', age: 40,
    title: 'Cặp kính đầu tiên',
    text: 'Bốn mươi tuổi, tôi bắt đầu phải đưa điện thoại ra xa mới đọc được chữ. Bác sĩ nói mắt lão sớm, nên đeo kính. Tôi thấy mình chưa già tới mức đó. Cặp kính đã cắt xong, nằm trong hộp trên bàn.',
    choices: [
      { label: 'Đeo kính từ hôm nay', effects: { health: 1, intelligence: 1 }, flags: ['deo_kinh'],
        text: 'Ngày đầu đeo kính đi làm, ai cũng nhìn. Tới chiều thì quen. Tối đó tôi đọc hết một chương sách, lâu lắm rồi mới đọc được mà không nhức đầu.' },
      { label: 'Để hộp kính trong ngăn kéo', effects: { health: -1, happiness: 1 },
        text: 'Tôi phóng to chữ trên điện thoại, nheo mắt đọc thực đơn. Có lần ký nhầm vào dòng của người khác. Hộp kính vẫn nằm trong ngăn kéo.' },
    ],
  },
  {
    id: 'ls40-ban-cu-ngoai-tinh', age: 40,
    title: 'Bí mật của bạn thân',
    text: 'Bạn thân kể với tôi bạn ấy đang ngoại tình, xin tôi giữ kín. Người bạn đời của bạn ấy cũng là người tôi quý, hay sang nhà chơi. Tối qua người đó nhắn hỏi tôi: “Dạo này nó có chuyện gì không?”',
    choices: [
      { label: 'Nói: “Mình không biết”', effects: { happiness: -2 }, flags: ['giu_bi_mat_ban'],
        text: 'Người đó cảm ơn, nói chắc mình nghĩ nhiều. Mấy tháng sau mọi chuyện vỡ lở. Người đó hỏi tôi có biết trước không. Tôi không trả lời được.' },
      { label: 'Khuyên bạn tự nói ra', effects: { intelligence: 1, happiness: -1 }, flags: ['khuyen_ban_tu_noi'],
        text: 'Tôi trả lời người đó rằng nên hỏi thẳng bạn ấy. Rồi tôi gặp bạn, nói tôi sẽ không nói dối thay bạn. Hai tuần sau bạn ấy tự kể. Cả hai người đều giận tôi một thời gian.' },
      { label: 'Kể thật', effects: { happiness: -1 }, flags: ['ke_ngoai_tinh_ban'],
        text: 'Người đó im lặng rất lâu, rồi cảm ơn. Bạn thân tôi không nhìn mặt tôi nữa. Một năm sau, người đó gửi tôi thiệp mừng năm mới, ký một mình một tên.' },
    ],
  },
  {
    id: 'ls40-cong-viec-tre-hon', age: 40, needs: ['employed'],
    title: 'Khóa học công nghệ mới',
    text: 'Công ty đưa vào một phần mềm mới, người trẻ học trong một tuần là thạo, còn tôi mất cả tháng vẫn lóng ngóng. Có một khóa học cuối tuần do công ty tài trợ, toàn người hai mươi mấy tuổi đăng ký.',
    choices: [
      { label: 'Đăng ký học', money: -12000000, effects: { intelligence: 3, happiness: -1 }, flags: ['hoc_lai_cong_nghe'],
        text: 'Tôi ngồi bàn cuối, ghi chép như sinh viên. Có cậu bạn trẻ ngồi cạnh kiên nhẫn chỉ lại từng bước. Hết khóa, tôi làm được những việc trước đây phải nhờ người khác.' },
      { label: 'Nhờ đồng nghiệp làm hộ phần khó', effects: { happiness: 1 },
        text: 'Đồng nghiệp trẻ làm hộ, vui vẻ. Công việc vẫn trôi. Nhưng trong các cuộc họp, tôi bắt đầu im lặng nhiều hơn, vì không theo kịp.' },
    ],
  },
  {
    id: 'ls40-viec-trung-nien', age: 40, needs: ['notEmployed'],
    title: 'Hồ sơ tuổi bốn mươi',
    text: 'Bốn mươi tuổi, tôi nộp hồ sơ mãi không được gọi. Có tin tuyển dụng ghi rõ dưới ba mươi lăm tuổi. Một người quen gợi ý học lấy chứng chỉ kế toán, sáu tháng, học phí không nhỏ.',
    choices: [
      { label: 'Đi học chứng chỉ', effects: { intelligence: 2, happiness: -1 }, flags: ['hoc_chung_chi_40'],
        text: 'Lớp học có người lớn tuổi hơn tôi. Sáu tháng sau tôi có chứng chỉ, nhận được việc kế toán cho một hợp tác xã. Lương không cao, nhưng đều.' },
      { label: 'Nhận việc gì có việc nấy', effects: { health: -1 }, money: 3000000,
        text: 'Tôi đi giao hàng, bốc xếp, phụ quán. Tháng nào cũng có tiền, không tháng nào giống tháng nào. Tối về, tôi ngủ ngay, không kịp nghĩ gì.' },
    ],
  },
  {
    id: 'ls40-tuoi-bon-muoi', age: 40, needs: ['partner'],
    title: 'Chuyện còn lại của hai người',
    text: 'Bốn mươi tuổi, tối nay {tenBanDoi} hỏi tôi một câu bất ngờ: “Nếu được làm lại, mình có chọn nhau nữa không?” Câu hỏi nhẹ nhàng, nhưng {tenBanDoi} đang nhìn tôi chờ.',
    choices: [
      { label: 'Trả lời thật lòng', effects: { happiness: 2 }, flags: ['tra_loi_that_long'],
        text: 'Tôi nói có, nhưng muốn sửa vài chỗ. {tenBanDoi} hỏi chỗ nào. Hai đứa ngồi kể tới khuya, có chỗ cười, có chỗ im lặng. Sáng ra thấy gần nhau hơn.' },
      { label: 'Đùa cho qua', effects: { happiness: -1 },
        text: 'Tôi nói: “Chọn lại thì đỡ phải tập quen.” {tenBanDoi} cười, rồi quay đi rửa chén. Tôi đứng nhìn lưng {tenBanDoi}, biết mình vừa bỏ lỡ một câu chuyện.' },
    ],
  },
  {
    id: 'ls40-mot-minh-sinh-nhat', age: 40, needs: ['single'],
    title: 'Chiếc bánh cho một người',
    text: 'Sinh nhật bốn mươi. Bạn bè hẹn mừng bù cuối tuần, mỗi người một lý do. Tối nay tôi có thể ngồi nhà, hoặc mở lời nhờ người hàng xóm lớn tuổi sang ăn tối, người cũng sống một mình như tôi.',
    choices: [
      { label: 'Mời hàng xóm sang ăn', effects: { happiness: 3 }, flags: ['ban_hang_xom_gia'],
        text: 'Bà hàng xóm mang sang nồi canh, nói hồi bà bốn mươi cũng ăn sinh nhật một mình. Hai người ngồi tới chín giờ. Từ đó tối thứ bảy nào bà cũng gõ cửa.' },
      { label: 'Ở nhà một mình', effects: { happiness: -1 },
        text: 'Tôi đặt một chiếc bánh nhỏ, cắm một cây nến. Thổi nến xong, tôi mới nhận ra không ai hát. Tôi tự hát, rồi cười một mình.' },
    ],
  },
  {
    id: 'ls40-con-dien-thoai', age: 40, needs: ['children'], childAge: [10, 16],
    title: 'Chiếc điện thoại của con',
    text: '{tenCon} xin điện thoại thông minh, nói cả lớp đều có, không có thì bị bỏ ra ngoài nhóm. Tôi đọc nhiều về chuyện trẻ con nghiện mạng. {tenCon} hứa chỉ dùng một tiếng mỗi ngày.',
    choices: [
      { label: 'Mua, đặt luật một tiếng', money: -6000000, effects: { happiness: 1 }, flags: ['con_co_dien_thoai'],
        text: '{tenCon} giữ luật được ba tuần. Tuần thứ tư, tôi thấy ánh sáng dưới chăn. Tôi nhớ có người từng thấy ánh sáng ấy dưới chăn của mình, và nhớ người đó đã làm gì.' },
      { label: 'Chưa mua', effects: { happiness: -1 }, flags: ['chua_mua_dien_thoai'],
        text: '{tenCon} giận mấy ngày, rồi mượn máy bạn để vào nhóm lớp. Cuối năm, tôi mua cho con một chiếc. Con cầm, cảm ơn rất nhỏ.' },
    ],
  },

   
  {
    id: 'ls41-tim-dap-nhanh', age: 41,
    title: 'Tim đập nhanh',
    text: 'Đang họp, tim tôi đập loạn, tay tê, phải ra ngoài ngồi. Mười phút sau thì đỡ. Đồng nghiệp bảo đi khám ngay. Tôi nghĩ chắc do thiếu ngủ. Tuần này việc dồn, nghỉ một buổi là trễ hạn.',
    choices: [
      { label: 'Đi khám ngay chiều nay', effects: { health: 3 }, money: -1000000, flags: ['kham_tim'],
        text: 'Bác sĩ nói rối loạn nhịp nhẹ, do căng thẳng kéo dài, phải giảm cà phê, ngủ đủ. Việc trễ hạn một ngày, không ai chết. Tôi ngồi ở hành lang bệnh viện, thở chậm lại.' },
      { label: 'Làm cho xong rồi tính', effects: { health: -3 },
        text: 'Tôi làm tới hạn chót, xong việc. Hai tuần sau tim lại đập loạn, lần này giữa đêm. Tôi đi khám, bác sĩ hỏi sao để lâu vậy.' },
    ],
  },
  {
    id: 'ls41-tien-ho-hang', age: 41,
    title: 'Chia tiền cúng giỗ',
    text: 'Họ hàng họp bàn sửa lại nhà thờ họ, mỗi nhà góp theo khả năng. Một người chú đề nghị chia đều, nhà nào cũng như nhà nào. Có mấy nhà khó khăn ngồi cúi mặt. Mọi người quay sang hỏi ý tôi.',
    choices: [
      { label: 'Đề nghị góp theo khả năng', effects: { happiness: 1 }, money: -10000000, flags: ['gop_theo_kha_nang'],
        text: 'Ông chú không vui, nói như vậy là chia rẽ. Nhưng mấy nhà khó khăn gật đầu. Cuối buổi, tôi góp phần lớn hơn. Có người nhìn tôi cảm ơn, có người nói tôi khoe giàu.' },
      { label: 'Đồng ý chia đều', effects: { happiness: -1 }, money: -5000000,
        text: 'Mọi người góp đều. Một nhà phải đi vay để góp phần của mình. Nhà thờ họ sửa xong, đẹp hơn trước. Hôm khánh thành, nhà ấy không tới.' },
    ],
  },
  {
    id: 'ls41-sep-moi-tre', age: 41, needs: ['employed'],
    title: 'Sếp mới hai mươi chín tuổi',
    text: 'Sếp mới hai mươi chín tuổi, giỏi nhưng cứng nhắc. Cậu ấy đưa ra một kế hoạch mà tôi biết chắc sẽ thất bại, vì tôi đã thấy nó thất bại năm năm trước. Trong cuộc họp, cậu ấy hỏi có ai ý kiến gì không.',
    choices: [
      { label: 'Nói thẳng, kèm số liệu cũ', effects: { intelligence: 2 }, flags: ['gop_y_sep_tre'],
        text: 'Cả phòng im. Sếp cảm ơn, rồi điều chỉnh kế hoạch. Sau cuộc họp, cậu ấy hỏi riêng tôi thêm vài chuyện cũ. Lần đầu tôi thấy mình có ích theo cách khác.' },
      { label: 'Im lặng, làm theo', effects: { happiness: -1 },
        text: 'Kế hoạch thất bại đúng như tôi nghĩ. Sếp bị cấp trên nhắc nhở. Cậu ấy hỏi cả phòng sao không ai cảnh báo. Không ai trả lời.' },
    ],
  },
  {
    id: 'ls41-ban-buon', age: 41, needs: ['notEmployed'],
    title: 'Làm chung với bạn',
    text: 'Bạn cũ rủ tôi buôn trái cây từ quê lên thành phố, bạn lo nguồn hàng, tôi lo bán. Không có lương cố định, lời chia đôi. Bạn ấy làm ăn không giỏi, nhưng rất thật thà.',
    choices: [
      { label: 'Làm chung', effects: { happiness: 1, health: -1 }, flags: ['buon_trai_cay'],
        text: 'Mùa đầu lỗ vì xoài hỏng. Mùa sau có mối quen. Hai đứa ngồi chia tiền lời trên cái bàn nhựa, đếm đi đếm lại cho chắc, rồi đi ăn một bữa.' },
      { label: 'Từ chối', effects: { happiness: -1 },
        text: 'Bạn ấy làm một mình, vất vả nhưng trụ được. Tết, bạn gửi tôi một thùng xoài, kèm tờ giấy: “Hàng tuyển, không bán.”' },
    ],
  },
  {
    id: 'ls41-ban-doi-nho-con', age: 41, needs: ['married'],
    title: 'Giấc mơ thời trẻ',
    text: '{tenBanDoi} muốn học lại đại học một ngành mới, học tối, kéo dài ba năm. Việc nhà sẽ dồn sang tôi gần hết. {tenBanDoi} nói đây là lần cuối có thể thử, qua năm mươi thì thôi.',
    choices: [
      { label: 'Ủng hộ, gánh việc nhà', effects: { health: -2, happiness: 1 }, flags: ['ung_ho_hoc_lai'],
        text: 'Ba năm tôi nấu cơm, đưa đón, dọn dẹp. Có tối mệt tới mức ngủ quên trên ghế. Ngày {tenBanDoi} nhận bằng, tôi đứng ở hàng ghế khán giả vỗ tay to nhất.' },
      { label: 'Đề nghị học trên mạng, chậm hơn', effects: { intelligence: 1 },
        text: '{tenBanDoi} học trực tuyến, kéo dài năm năm. Việc nhà chia đôi. {tenBanDoi} nói vậy cũng được, nhưng có lúc tôi thấy {tenBanDoi} xem ảnh giảng đường rất lâu.' },
    ],
  },
  {
    id: 'ls41-yeu-muon', age: 41, needs: ['dating'],
    title: 'Ra mắt muộn',
    text: '{tenBanDoi} muốn đưa tôi về ra mắt gia đình. Hai đứa đều đã ngoài bốn mươi, gia đình bên kia hỏi rất kỹ chuyện quá khứ. Có một chuyện cũ tôi chưa kể hết với {tenBanDoi}.',
    choices: [
      { label: 'Kể hết trước khi về', effects: { happiness: 1, intelligence: 1 }, flags: ['ke_het_qua_khu'],
        text: '{tenBanDoi} nghe xong, im một lúc, rồi nói: “Cảm ơn đã kể.” Buổi ra mắt suôn sẻ hơn tôi tưởng. Mẹ {tenBanDoi} gắp cho tôi miếng cá ngon nhất.' },
      { label: 'Về, kể sau', effects: { happiness: -1 },
        text: 'Buổi ra mắt có lúc gượng, tôi trả lời vòng vo một câu hỏi. Trên đường về, {tenBanDoi} hỏi: “Còn chuyện gì mình chưa nói với nhau không?” Tôi nói không.' },
    ],
  },
  {
    id: 'ls41-don-than-o-que', age: 41, needs: ['single'],
    title: 'Hàng xóm giới thiệu',
    text: 'Bà hàng xóm nhiệt tình giới thiệu tôi với một người cũng sống một mình, hiền lành, có một đứa con riêng. Bà nói tuổi này không cần yêu, chỉ cần có người cùng ăn cơm. Tôi chưa nghĩ tới chuyện đó.',
    choices: [
      { label: 'Đồng ý gặp một lần', effects: { happiness: 1 },
        text: 'Hai người ăn bữa cơm bà hàng xóm nấu. Người ấy hiền thật, kể chuyện đứa con rất nhiều. Lúc về, hai người hẹn sẽ nhắn tin. Tôi nhắn trước.' },
      { label: 'Cảm ơn, từ chối khéo', effects: { happiness: -1 },
        text: 'Bà hàng xóm nói tiếc, rồi thôi. Tối đó tôi nấu cơm cho một người, ăn trước tivi. Bữa cơm không khác mọi hôm, nhưng tôi để ý tới nó.' },
    ],
  },
  {
    id: 'ls41-con-di-choi-khuya', age: 41, needs: ['children'], childAge: [14, 18],
    title: 'Mười một giờ đêm',
    text: '{tenCon} đi chơi với bạn, hẹn mười giờ về. Mười một giờ chưa về, điện thoại không nghe. Bạn của {tenCon} cũng không nghe máy. Tôi đứng ở cửa, tay cầm chìa khóa xe.',
    choices: [
      { label: 'Đi tìm', effects: { health: -1 }, flags: ['di_tim_con'],
        text: 'Tôi tìm thấy {tenCon} ở quán chè gần trường, điện thoại hết pin. {tenCon} xấu hổ trước mặt bạn bè, về nhà đóng cửa phòng. Sáng ra con nhắn: “Con xin lỗi.”' },
      { label: 'Ngồi chờ, gọi tiếp', effects: { happiness: -2 },
        text: 'Mười một giờ rưỡi, {tenCon} về, điện thoại hết pin. Tôi không la, chỉ nói ba mẹ đã sợ thế nào. {tenCon} nhìn tôi rất lâu, rồi ôm tôi một cái, lần đầu từ khi dậy thì.' },
    ],
  },

   
  {
    id: 'ls42-tai-nan-ban', age: 42,
    title: 'Người bạn trong viện',
    text: 'Người bạn cũ bị tai nạn, nằm viện dài ngày. Gia đình bạn đang kêu gọi giúp đỡ trên mạng, nhiều người nghi là lừa đảo vì từng có vụ giả như vậy. Tôi chưa gặp bạn ấy mười năm nay.',
    choices: [
      { label: 'Vào viện thăm tận nơi', effects: { happiness: 2, health: -1 }, flags: ['tham_ban_vien'],
        text: 'Bạn ấy nằm đó thật, chân bó bột tới hông. Thấy tôi, bạn khóc. Tôi đưa phong bì cho vợ bạn ấy, rồi ngồi kể chuyện thời sinh viên tới hết giờ thăm.' },
      { label: 'Chuyển một ít tiền', effects: { happiness: 1 },
        text: 'Tôi chuyển tiền, gửi lời hỏi thăm. Vài tháng sau bạn xuất viện, đăng bài cảm ơn có tên tôi trong danh sách. Tôi đọc, thấy mình chỉ là một cái tên trong danh sách.' },
      { label: 'Chờ xem thật giả', effects: { happiness: -1 },
        text: 'Một tuần sau, báo đăng tin xác nhận. Tôi định chuyển tiền thì quỹ đã đủ, gia đình đóng tài khoản. Tôi nhắn hỏi thăm, bạn trả lời bằng một biểu tượng cảm ơn.' },
    ],
  },
  {
    id: 'ls42-dieu-tra-hang-xom', age: 42,
    title: 'Mùi lạ nhà bên',
    text: 'Nhà bên mới có người thuê, mấy tuần nay ra vào lúc nửa đêm, có mùi hóa chất lạ. Hôm nay tôi thấy họ khiêng mấy thùng giấy vào nhà, dán kín. Tôi có con nhỏ trong khu, có người già.',
    choices: [
      { label: 'Báo công an khu vực', effects: { intelligence: 1 }, flags: ['bao_nha_ben'],
        text: 'Công an tới kiểm tra, hóa ra là một xưởng làm nến thơm không đăng ký. Họ bị phạt, phải dọn đi. Người chủ đi ngang nhà tôi, nhìn một cái thật lâu.' },
      { label: 'Sang hỏi thẳng', effects: { happiness: 1 },
        text: 'Một cô gái trẻ mở cửa, cười ngượng, nói làm nến thơm bán trên mạng. Cô tặng tôi một hộp nến. Tôi về, nhắn cô cách đăng ký kinh doanh và lắp quạt hút mùi.' },
    ],
  },
  {
    id: 'ls42-de-bat-loi', age: 42, needs: ['employed'],
    title: 'Báo cáo đẹp',
    text: 'Phòng tôi làm không đạt chỉ tiêu quý này. Sếp gợi ý “làm đẹp” số liệu báo cáo, chuyển một phần doanh thu quý sau lên quý này. Ai cũng biết, không ai nói. Người phải ký báo cáo là tôi.',
    choices: [
      { label: 'Ký theo ý sếp', effects: { happiness: -1 }, flags: ['ky_bao_cao_dep'],
        text: 'Cả phòng được thưởng. Quý sau thiếu càng nhiều, lại phải “làm đẹp” tiếp. Tôi bắt đầu mất ngủ mỗi cuối quý.' },
      { label: 'Ký số liệu thật', effects: { intelligence: 1, happiness: -2 }, flags: ['ky_so_that'],
        text: 'Phòng mất thưởng, đồng nghiệp lạnh nhạt với tôi một thời gian. Năm sau công ty kiểm toán, hai phòng khác bị phát hiện làm đẹp số liệu. Phòng tôi thì không.' },
    ],
  },
  {
    id: 'ls42-ba-con-giup', age: 42, needs: ['notEmployed'],
    title: 'Lời mời từ người họ hàng',
    text: 'Người anh họ giàu có mời tôi về làm quản lý kho cho công ty anh. Lương khá, nhưng anh hay nói trước mặt người khác rằng anh “cưu mang” người nhà. Tôi đang cần việc.',
    choices: [
      { label: 'Nhận việc', effects: { happiness: -1 }, money: 10000000, flags: ['lam_cho_anh_ho'],
        text: 'Công việc ổn, lương đều. Mỗi dịp tiệc công ty, anh lại giới thiệu tôi là “đứa em tôi giúp cho”. Tôi cười, nâng ly, rồi uống cạn.' },
      { label: 'Từ chối', effects: { happiness: 1, intelligence: 1 },
        text: 'Anh không vui, nói tôi sĩ diện. Tôi tiếp tục tìm việc. Ba tháng sau có việc ở một nơi không ai quen biết tôi, lương bằng một nửa. Tôi ngủ ngon.' },
    ],
  },
  {
    id: 'ls42-ban-doi-lo-tien', age: 42, needs: ['partner'],
    title: 'Khoản nợ bị giấu',
    text: 'Tôi phát hiện {tenBanDoi} đang nợ thẻ tín dụng một khoản lớn, giấu tôi gần một năm. Khoản nợ đến từ việc giúp người nhà bên {tenBanDoi}. {tenBanDoi} chưa biết tôi đã biết.',
    choices: [
      { label: 'Nói chuyện thẳng', effects: { happiness: -1, intelligence: 1 }, flags: ['biet_no_ban_doi'],
        text: '{tenBanDoi} khóc, nói sợ tôi không đồng ý nên giấu. Hai đứa ngồi tính lại tiền nhà tới khuya, lập kế hoạch trả nợ hai năm. Lần đầu sau nhiều năm, hai đứa nói hết.' },
      { label: 'Âm thầm trả giúp', effects: { happiness: -2 }, flags: ['tra_no_thay'],
        text: 'Tôi trả bớt nợ bằng tiền để dành riêng. {tenBanDoi} thấy dư nợ giảm, hiểu ra, nhưng không nói gì. Hai đứa cùng biết, cùng im lặng.' },
    ],
  },
  {
    id: 'ls42-mot-minh-o-vien', age: 42, needs: ['single'],
    title: 'Người ký giấy mổ',
    text: 'Tôi phải mổ một ca nhỏ. Bệnh viện hỏi người nhà ký giấy cam đoan và ở lại chăm. Tôi sống một mình, không muốn làm phiền ai. Bạn thân nói sẽ xin nghỉ một ngày.',
    choices: [
      { label: 'Nhận lời bạn', effects: { happiness: 2 }, flags: ['ban_than_cham_mo'],
        text: 'Bạn ngồi ở hành lang suốt ca mổ, nhắn tin cập nhật cho mấy người bạn khác. Tỉnh dậy, tôi thấy bạn đang ngủ gục trên ghế. Tôi nằm nhìn bạn ngủ rất lâu.' },
      { label: 'Thuê người chăm', effects: { happiness: -1 },
        text: 'Người chăm làm tốt, đúng giờ. Ca mổ ổn. Lúc tỉnh dậy, căn phòng yên tĩnh, có người lạ ngồi đọc báo. Tôi nói cảm ơn, rồi quay mặt ra cửa sổ.' },
    ],
  },
  {
    id: 'ls42-con-chon-nganh', age: 42, needs: ['children'], childAge: [15, 18],
    title: 'Con chọn ngành',
    text: '{tenCon} muốn thi vào một ngành mà tôi thấy khó kiếm sống. Tôi muốn con học ngành ổn định hơn. Tối nay {tenCon} ngồi chờ tôi ở bàn, cầm tờ hướng dẫn tuyển sinh, muốn nghe tôi nói.',
    choices: [
      { label: 'Nghe con nói hết', effects: { happiness: 2 }, flags: ['nghe_con_chon_nganh'],
        text: '{tenCon} nói một mạch, có chuẩn bị. Tôi hỏi ra trường làm ở đâu, lương bao nhiêu. Con trả lời được một nửa. Tôi gấp tờ giấy lại: “Tìm hiểu cho kỹ rồi nói ba mẹ nghe.” Nghe quen quá.' },
      { label: 'Nói rõ ý mình', effects: { happiness: -1 }, flags: ['ep_con_chon_nganh'],
        text: '{tenCon} gật đầu, im lặng. Mấy tuần sau, tôi thấy con xem video về ngành ấy tới khuya. Tôi đứng ở cửa phòng, rồi đi ra.' },
    ],
  },

   
  {
    id: 'ls43-nam-vien-dai', age: 43,
    title: 'Đơn thuốc dài',
    text: 'Bác sĩ nói tôi bị tiểu đường giai đoạn đầu. Phải đổi cách ăn, bỏ cơm trắng, bỏ đồ ngọt, tập thể dục mỗi ngày. Mâm cơm nhà tôi xưa nay toàn món tôi thích. Tối nay có nồi chè đậu.',
    choices: [
      { label: 'Đổi ngay từ hôm nay', effects: { health: 3, happiness: -2 }, flags: ['doi_che_do_an'],
        text: 'Tôi ăn gạo lứt, rau luộc. Tuần đầu thèm tới mức mơ thấy chè. Ba tháng sau, chỉ số đường giảm. Tôi vẫn mơ thấy chè, nhưng ít hơn.' },
      { label: 'Ăn bớt, từ từ đổi', effects: { health: 1 },
        text: 'Tôi ăn nửa chén chè, nửa chén cơm. Chỉ số không giảm nhiều, cũng không tăng. Bác sĩ nhìn kết quả, nói: “Cũng được, nhưng cố thêm.”' },
    ],
  },
  {
    id: 'ls43-bua-com-ho', age: 43,
    title: 'Lời nhắn trong nhóm họ',
    text: 'Nhóm chat họ hàng có người đăng một bài sai sự thật về một loại thuốc chữa bách bệnh, kêu gọi mọi người mua. Người đăng là một bác lớn tuổi, rất được kính trọng. Mấy người già trong họ đã chuyển tiền đặt mua.',
    choices: [
      { label: 'Nhắn riêng bác, kèm thông tin', effects: { intelligence: 1 }, flags: ['nhan_rieng_bac'],
        text: 'Bác không trả lời. Hai hôm sau, bác gỡ bài, không giải thích. Một người cô đã mua ba hộp, gọi điện hỏi tôi có ai nhận lại không.' },
      { label: 'Đăng cảnh báo vào nhóm', effects: { happiness: -1 }, flags: ['canh_bao_nhom_ho'],
        text: 'Mấy người trẻ thả tim. Bác đăng một câu: “Giờ người thân dạy ông bà rồi.” Rồi bác rời nhóm. Tết đó, bác không nói chuyện với nhà tôi.' },
      { label: 'Im lặng', effects: { happiness: -1 },
        text: 'Tôi lướt qua. Hai tháng sau, một bà cô bị đau dạ dày vì uống thứ thuốc ấy. Cả nhóm im lặng, không ai nhắc tới bài viết cũ.' },
    ],
  },
  {
    id: 'ls43-chuyen-phong', age: 43, needs: ['employed'],
    title: 'Chuyển sang phòng khác',
    text: 'Công ty tái cơ cấu, tôi được chọn: chuyển sang phòng mới, công việc mới hoàn toàn, hoặc nhận một khoản tiền để nghỉ việc sớm. Tiền đủ sống hai năm. Ở lại thì phải học lại từ đầu, ở tuổi bốn mươi ba.',
    choices: [
      { label: 'Ở lại, học việc mới', effects: { intelligence: 2, happiness: -1 }, flags: ['o_lai_hoc_moi'],
        text: 'Sáu tháng đầu tôi làm chậm, hỏi nhiều. Đồng nghiệp trẻ kiên nhẫn. Một năm sau, tôi làm được việc, lại thấy mình còn học được.' },
      { label: 'Nhận tiền, tính chuyện khác', effects: { happiness: 1 }, money: 30000000, flags: ['nghi_som'],
        text: 'Ngày rời công ty, tôi ôm thùng giấy ra cổng. Ba tháng đầu ngủ bù, đi đây đi đó. Tháng thứ tư, tôi bắt đầu đếm ngày.' },
    ],
  },
  {
    id: 'ls43-nhan-viec-tre-hon', age: 43, needs: ['notEmployed'],
    title: 'Làm chung với người trẻ',
    text: 'Tôi được nhận vào một chỗ làm mới, đồng nghiệp đều trẻ hơn tôi mười mấy tuổi. Tụi nhỏ rủ đi ăn trưa, nói chuyện tôi không hiểu. Có đứa gọi tôi là “cô chú”, có đứa gọi “anh chị”.',
    choices: [
      { label: 'Đi ăn trưa cùng tụi nhỏ', effects: { happiness: 2 }, flags: ['hoa_nhap_tre'],
        text: 'Tôi hỏi nhiều, cười nhiều, chuyện không hiểu thì hỏi. Tụi nhỏ dần gọi tôi bằng tên. Có đứa tìm tôi hỏi chuyện tình cảm, như hỏi một người chị, người anh.' },
      { label: 'Ăn trưa một mình', effects: { intelligence: 1 },
        text: 'Tôi làm việc chăm chỉ, lặng lẽ. Tụi nhỏ tôn trọng, nhưng không thân. Sinh nhật tôi, cả phòng hát chúc mừng đúng một lượt, rồi ai về chỗ nấy.' },
    ],
  },
  {
    id: 'ls43-ban-doi-ngu-rieng', age: 43, needs: ['partner'],
    title: 'Tiếng ngáy',
    text: 'Mấy năm nay tôi ngáy to, {tenBanDoi} mất ngủ. {tenBanDoi} đề nghị ngủ phòng riêng, nói chỉ vì giấc ngủ, không có gì khác. Tôi nghe mà thấy chạnh lòng. Bác sĩ nói có thể chữa ngáy, phải đeo máy thở mỗi đêm.',
    choices: [
      { label: 'Đi chữa ngáy', effects: { health: 2 }, money: -15000000, flags: ['chua_ngay'],
        text: 'Tôi đeo máy thở, đêm đầu khó chịu, đêm thứ mười thì quen. {tenBanDoi} ngủ ngon trở lại. Sáng nào {tenBanDoi} cũng nói: “Đêm qua yên quá.”' },
      { label: 'Đồng ý ngủ riêng', effects: { happiness: -1, health: 1 }, flags: ['ngu_rieng'],
        text: 'Cả hai ngủ ngon hơn. Tối nào {tenBanDoi} cũng sang chúc ngủ ngon rồi về phòng mình. Có đêm tôi nằm nghe tiếng đóng cửa phòng bên.' },
    ],
  },
  {
    id: 'ls43-nuoi-con-nuoi', age: 43, needs: ['single'],
    title: 'Đứa trẻ ở chùa',
    text: 'Đi làm thiện nguyện ở một ngôi chùa nuôi trẻ mồ côi, tôi quen một đứa bé chín tuổi, rất lặng lẽ. Sư cô gợi ý tôi có thể đỡ đầu, mỗi tháng gửi tiền học, cuối tuần đón về chơi. Đỡ đầu là một trách nhiệm lâu dài.',
    choices: [
      { label: 'Nhận đỡ đầu', effects: { happiness: 3 }, flags: ['do_dau_tre'],
        text: 'Cuối tuần, đứa bé về nhà tôi, lúc đầu chỉ ngồi một góc. Tháng thứ ba, nó tự mở tủ lạnh tìm sữa. Tôi đứng ở cửa bếp, không dám thở mạnh.' },
      { label: 'Quyên góp, không đỡ đầu', effects: { intelligence: 1 },
        text: 'Tôi gửi tiền cho chùa mỗi tháng. Lần sau ghé, đứa bé đã có người đỡ đầu khác. Nó chạy ra khoe đôi giày mới, nhớ tên tôi.' },
    ],
  },
  {
    id: 'ls43-con-yeu-som', age: 43, needs: ['children'], childAge: [14, 17],
    title: 'Tin nhắn trên máy con',
    text: 'Tôi vô tình thấy tin nhắn trên điện thoại {tenCon}: con đang yêu một bạn cùng lớp, hai đứa hẹn đi chơi xa cuối tuần, nói dối là đi học nhóm. {tenCon} chưa biết tôi đã thấy.',
    choices: [
      { label: 'Nói chuyện với con', effects: { happiness: -1 }, flags: ['noi_chuyen_con_yeu'],
        text: '{tenCon} đỏ mặt, giận vì tôi xem máy. Tôi xin lỗi chuyện đó, rồi nói chuyện cuối tuần. Con hủy chuyến đi xa, đổi thành đi xem phim, về đúng giờ.' },
      { label: 'Để con đi, dặn kỹ', effects: { happiness: -2 },
        text: 'Tôi không nói gì, chỉ dặn con giữ điện thoại có pin. Cuối tuần, con về đúng hẹn. Tối đó tôi nhớ có lần mình cũng nói dối là đi học nhóm.' },
    ],
  },

   
  {
    id: 'ls44-kinh-doc-sach', age: 44,
    title: 'Cặp kính đọc sách',
    text: 'Dạo này đọc chữ nhỏ tôi phải đưa ra xa. Đi khám, bác sĩ nói mắt đã bắt đầu lão, nên đeo kính khi đọc. Cặp kính dày, đeo vào trông mình già đi mấy tuổi. Tôi cầm cặp kính thử, đứng nhìn vào gương.',
    choices: [
      { label: 'Đeo kính khi đọc', effects: { intelligence: 1, appearance: -1 },
        text: 'Lần đầu đeo, chữ trong sách rõ tới mức tôi đọc liền một mạch. Bạn bè trêu là trông nghiêm hẳn ra. Từ đó cặp kính nằm sẵn trong túi áo.' },
      { label: 'Chưa đeo, cố thêm', effects: { happiness: 1, health: -1 },
        text: 'Tôi để chữ thật to trên điện thoại, đọc sách dưới đèn sáng. Tối nào mắt cũng mỏi, đầu nhức. Bạn bè vẫn nói tôi trẻ như hồi ba mươi.' },
    ],
  },
  {
    id: 'ls44-hop-lop-hai-muoi-nam', age: 44,
    title: 'Hai mươi năm ra trường',
    text: 'Họp lớp hai mươi năm. Người từng là lớp trưởng giờ thất nghiệp, ngồi một góc. Người từng bị cả lớp cười vì nghèo giờ là doanh nhân, đứng ra bao cả bữa. Cuối buổi, lớp trưởng cũ hỏi nhỏ tôi có quen chỗ nào cần người không.',
    choices: [
      { label: 'Hứa giúp hỏi', effects: { happiness: 1 }, flags: ['giup_lop_truong'],
        text: 'Tôi hỏi khắp nơi, giới thiệu được một chỗ. Lớp trưởng cũ đi làm được ba tháng, nhắn cảm ơn kèm tấm ảnh bàn làm việc mới. Tôi lưu tấm ảnh lại.' },
      { label: 'Nói thật là không quen ai', effects: { happiness: -1 },
        text: 'Lớp trưởng cũ gật đầu, nói không sao. Tôi về nhà, mở danh bạ, nhìn một lúc, rồi tắt. Có lẽ tôi có quen, chỉ là ngại.' },
    ],
  },
  {
    id: 'ls44-tien-ke-thua', age: 44, needs: ['parentsGone'],
    title: 'Căn nhà ba mẹ để lại',
    text: 'Ba mẹ đã mất, để lại căn nhà ở quê. Họ hàng muốn tôi bán, chia một phần cho người cô từng chăm ba mẹ những năm cuối. Di chúc không nhắc tới cô. Căn nhà là nơi tôi lớn lên.',
    choices: [
      { label: 'Bán, chia cho cô một phần', effects: { happiness: 1 }, money: 100000000, flags: ['ban_nha_cu'],
        text: 'Cô cầm tiền, khóc, nói không cần nhiều vậy. Căn nhà về tay người lạ. Lần cuối về, tôi đứng ở cổng rất lâu, rồi đi mà không quay lại nhìn.' },
      { label: 'Giữ nhà, biếu cô một khoản', effects: { happiness: 2 }, money: -30000000, flags: ['giu_nha_cu'],
        text: 'Tôi biếu cô một khoản từ tiền dành dụm, nhờ cô trông nhà. Mỗi năm tôi về giỗ ba mẹ, ngủ trên chiếc giường cũ, nghe tiếng gà nhà bên gáy sớm.' },
    ],
  },
  {
    id: 'ls44-kiem-tien-ngoai', age: 44, needs: ['employed'],
    title: 'Hoa hồng từ nhà cung cấp',
    text: 'Tôi phụ trách chọn nhà cung cấp cho công ty. Một nhà cung cấp mời đi ăn, đưa phong bì, nói “chút lòng thành”, chất lượng hàng của họ cũng tương đương các bên khác. Trong phòng, ai ở vị trí này cũng từng nhận.',
    choices: [
      { label: 'Nhận phong bì', effects: { happiness: 1 }, money: 20000000, flags: ['nhan_phong_bi'],
        text: 'Hợp đồng ký suôn sẻ. Phong bì nằm trong ngăn kéo cả tháng mới mở. Năm sau, nhà cung cấp giao hàng kém, tôi không dám phàn nàn.' },
      { label: 'Từ chối, chọn theo tiêu chí', effects: { intelligence: 1 }, flags: ['tu_choi_phong_bi'],
        text: 'Nhà cung cấp cười, nói hiểu. Tôi chọn bên khác rẻ hơn một chút. Sếp không khen, không chê. Tôi về nhà, ăn bữa tối như mọi tối.' },
    ],
  },
  {
    id: 'ls44-lam-them-nhieu-viec', age: 44, needs: ['notEmployed'],
    title: 'Ba việc một ngày',
    text: 'Tôi đang làm cùng lúc ba việc nhỏ để đủ sống: sáng bán hàng, chiều dạy kèm, tối nhận đồ về may. Một cơ sở trong khu mời làm toàn thời gian, lương ít hơn ba việc cộng lại, nhưng có bảo hiểm.',
    choices: [
      { label: 'Nhận việc toàn thời gian', effects: { health: 2, happiness: 1 }, flags: ['viec_on_dinh_44'],
        text: 'Thu nhập giảm một chút. Nhưng buổi tối tôi có thời gian ngồi ăn cơm, có bảo hiểm khi ốm. Tôi ngủ được tám tiếng, lần đầu sau nhiều năm.' },
      { label: 'Giữ ba việc', effects: { health: -2 }, money: 3000000,
        text: 'Tôi chạy từ chỗ này sang chỗ kia, ăn cơm trên xe. Tiền nhiều hơn một chút. Có tối tôi ngủ quên khi đang cầm kim, kim đâm vào tay.' },
    ],
  },
  {
    id: 'ls44-ban-doi-bo-viec', age: 44, needs: ['partner'],
    title: 'Ở nhà một năm',
    text: '{tenBanDoi} bị cắt giảm, ở nhà đã ba tháng. Ngày nào cũng gửi hồ sơ, không ai gọi. {tenBanDoi} bắt đầu ngủ trưa rất lâu, không muốn ra ngoài. Tối nay, {tenBanDoi} nói muốn về quê ở một thời gian.',
    choices: [
      { label: 'Đồng ý, cùng tính', effects: { happiness: 1 }, flags: ['cho_ban_doi_ve_que'],
        text: '{tenBanDoi} về quê hai tháng, giúp người nhà làm vườn, gọi điện mỗi tối. Lần đầu tôi nghe giọng {tenBanDoi} nhẹ như vậy sau nhiều tháng. Khi quay lại, {tenBanDoi} đã có kế hoạch mới.' },
      { label: 'Khuyên ở lại, tìm việc tiếp', effects: { happiness: -1 },
        text: '{tenBanDoi} ở lại, tiếp tục gửi hồ sơ. Ba tháng sau có việc, lương thấp hơn trước. {tenBanDoi} đi làm, về nhà là im, như người vừa đi qua một cơn bão.' },
    ],
  },
  {
    id: 'ls44-mot-minh-du-lich', age: 44, needs: ['single'],
    title: 'Chuyến đi một mình',
    text: 'Tôi muốn đi một chuyến dài, một mình, đi bộ dọc một cung đường biển mười ngày. Bạn bè nói đi một mình nguy hiểm, nhất là ở tuổi này. Tôi chưa từng đi đâu một mình quá ba ngày.',
    choices: [
      { label: 'Đi', effects: { happiness: 3, health: -1 }, flags: ['di_bo_mot_minh'],
        text: 'Ngày thứ ba chân phồng rộp, ngày thứ sáu gặp một nhóm người đi bộ cùng hướng. Ngày cuối, tôi ngồi trên bãi biển một mình, thấy mình đủ.' },
      { label: 'Rủ một người bạn đi cùng', effects: { happiness: 2 },
        text: 'Bạn đi được nửa chặng thì phải về vì việc nhà. Tôi đi nốt nửa chặng còn lại một mình. Hóa ra không đáng sợ như tôi nghĩ.' },
    ],
  },
  {
    id: 'ls44-con-hut-thuoc', age: 44, needs: ['children'], childAge: [14, 18],
    title: 'Mùi khói trên áo con',
    text: 'Giặt đồ cho {tenCon}, tôi ngửi thấy mùi thuốc lá trên áo khoác. Trong túi có một bật lửa. {tenCon} đang trong phòng học bài. Tôi đứng ở máy giặt, tay cầm chiếc áo.',
    choices: [
      { label: 'Đặt bật lửa lên bàn học của con', effects: { happiness: -1 }, flags: ['dat_bat_lua'],
        text: 'Tôi đặt bật lửa lên bàn, không nói gì, rồi ra ngoài. Tối đó {tenCon} ra phòng khách, ngồi cạnh tôi, kể đám bạn rủ, kể mình ho sặc. Tôi kể chuyện năm lớp bảy của mình.' },
      { label: 'Nói chuyện ngay', effects: { happiness: -2 },
        text: '{tenCon} chối, rồi nhận, rồi giận vì tôi lục túi. Hai người lớn tiếng. Một tuần sau mới làm hòa. Bật lửa nằm trong ngăn kéo của tôi.' },
    ],
  },

   
  {
    id: 'ls45-dam-cuoi-va-dam-gio', age: 45,
    title: 'Hai lời mời cùng một ngày',
    text: 'Người bạn thời đi học mời tôi dự đám cưới ở một tỉnh xa. Cùng ngày ấy là giỗ đầu của bác hàng xóm, người từng giúp tôi rất nhiều những năm khó khăn. Con cháu bác cũng mời tôi tới. Tôi chỉ đi được một nơi.',
    choices: [
      { label: 'Đi dự đám cưới', effects: { happiness: 2, health: -1 },
        text: 'Tôi đi xe đêm, tới nơi kịp lễ. Bạn ôm tôi giữa sân, giới thiệu với cả họ là người bạn từ thời đi học. Về tới nhà, tôi sang thắp nhang cho bác muộn một ngày.' },
      { label: 'Ở lại dự giỗ', effects: { happiness: 1 },
        text: 'Tôi gửi quà mừng qua người quen, rồi phụ nhà bác nấu mâm cỗ. Bạn gửi ảnh cưới, nhắn: “Tiếc ghê.” Tối đó con cháu bác rót trà mời tôi, gọi tôi là người nhà.' },
    ],
  },
  {
    id: 'ls45-di-hoc-lai-dan', age: 45,
    title: 'Những thứ bỏ dở',
    text: 'Dọn nhà, tôi thấy một hộp toàn những thứ bỏ dở: cuốn sách học ngoại ngữ, bộ dụng cụ vẽ, đôi giày chạy bộ còn mới. Tôi có thể chọn lại một thứ, nhưng chỉ đủ thời gian cho một.',
    choices: [
      { label: 'Học lại ngoại ngữ', effects: { intelligence: 3 }, flags: ['hoc_lai_ngoai_ngu'],
        text: 'Tôi học mỗi sáng hai mươi phút. Sau một năm, tôi đọc được một cuốn truyện ngắn bằng thứ tiếng ấy. Rất chậm, nhưng hết.' },
      { label: 'Vẽ lại', effects: { happiness: 3 }, flags: ['ve_lai'],
        text: 'Tôi vẽ những thứ quanh nhà: ấm trà, chậu cây, đôi dép. Vẽ xấu, nhưng chiều chủ nhật nào cũng ngồi vẽ. Một bức được dán lên tủ lạnh.' },
      { label: 'Chạy bộ lại', effects: { health: 3 }, flags: ['chay_bo_lai'],
        text: 'Tuần đầu chạy được một cây số đã thở dốc. Ba tháng sau, năm cây. Đôi giày từ trắng thành xám. Tôi mua đôi thứ hai.' },
    ],
  },
  {
    id: 'ls45-quen-nguoi-quen', age: 45,
    title: 'Người chào ở chợ',
    text: 'Ở chợ, một người phụ nữ gầy gò, tóc bạc, chào tôi bằng tên thời đi học. Tôi không nhớ là ai. Người ấy kể từng ngồi cạnh tôi năm lớp mười, giờ bán rau ở chợ này. Người ấy cười rất tươi.',
    choices: [
      { label: 'Thú thật là không nhớ', effects: { happiness: 1 },
        text: 'Người ấy cười to, nói: “Tao cũng đoán vậy.” Rồi kể một chuyện năm lớp mười, có tôi trong đó, chuyện tôi đã quên hẳn. Từ đó, tôi mua rau ở sạp ấy.' },
      { label: 'Giả vờ nhớ', effects: { happiness: -1 },
        text: 'Hai người nói chuyện mấy câu chung chung. Người ấy hỏi tôi còn nhớ thầy chủ nhiệm không, tôi nói nhớ. Về nhà, tôi lục album cũ, tìm mãi mới thấy khuôn mặt ấy.' },
    ],
  },
  {
    id: 'ls45-thang-chuc-cuoi', age: 45, needs: ['employed'],
    title: 'Cơ hội cuối',
    text: 'Có một vị trí quản lý cấp cao đang trống. Đây có lẽ là cơ hội cuối cùng để tôi lên. Ứng viên còn lại là một đồng nghiệp từng giúp tôi rất nhiều. Sếp lớn hỏi riêng tôi nghĩ gì về người đó.',
    choices: [
      { label: 'Nói tốt về đồng nghiệp', effects: { happiness: 1 }, flags: ['nhuong_vi_tri'],
        text: 'Đồng nghiệp được chọn. Sau này người ấy biết tôi đã nói gì, mời tôi ăn một bữa, nói nợ tôi. Tôi vẫn ở vị trí cũ, ngồi nhìn văn phòng mới của người ấy qua lớp kính.' },
      { label: 'Nói về điểm yếu của đồng nghiệp', effects: { happiness: -1 }, flags: ['tranh_vi_tri'],
        text: 'Tôi được chọn. Đồng nghiệp chúc mừng, không biết gì. Mỗi lần người ấy vào phòng tôi báo cáo, tôi rót cho người ấy một ly trà, rót rất cẩn thận.' },
    ],
  },
  {
    id: 'ls45-viec-xa-que', age: 45, needs: ['notEmployed'],
    title: 'Mảnh vườn ở quê',
    text: 'Người họ hàng đề nghị tôi về quê trông mảnh vườn cây ăn trái, ăn chia theo mùa. Ở thành phố, tôi đã lâu không có việc ổn định. Về quê nghĩa là bỏ hẳn những gì tôi đã xây ở đây hơn hai mươi năm.',
    choices: [
      { label: 'Về quê làm vườn', effects: { health: 2, happiness: 1 }, flags: ['ve_que_lam_vuon'],
        text: 'Năm đầu sâu bệnh, mất mùa. Năm thứ hai trái sai. Tôi học cách ghép cành, học nhìn trời đoán mưa. Bạn bè thành phố gọi hỏi thăm, tôi gửi họ mấy thùng bưởi.' },
      { label: 'Ở lại thành phố', effects: { happiness: -1 },
        text: 'Tôi tiếp tục bám trụ, nhận việc tạm. Người họ hàng giao vườn cho người khác. Mỗi mùa, họ vẫn gửi lên cho tôi một ít trái cây.' },
    ],
  },
  {
    id: 'ls45-ban-doi-ngoai-tinh', age: 45, needs: ['partner'],
    title: 'Người đồng nghiệp hay nhắn tin',
    text: 'Một đồng nghiệp mới hay nhắn tin cho tôi, lúc đầu chuyện công việc, giờ là chuyện riêng. Tôi thấy vui khi đọc những tin nhắn ấy, vui hơn mức nên vui. Tối nay người đó rủ đi uống cà phê sau giờ làm.',
    choices: [
      { label: 'Từ chối, giữ khoảng cách', effects: { happiness: 1 }, flags: ['giu_khoang_cach'],
        text: 'Tôi trả lời ngắn, chỉ chuyện công việc. Người đó hiểu, thôi nhắn. Tối về, tôi nhìn {tenBanDoi} nấu cơm trong bếp, đứng phụ một tay, lần đầu sau nhiều tháng.' },
      { label: 'Đi một lần, chỉ cà phê', effects: { happiness: -1, health: -1 }, flags: ['cafe_dong_nghiep'],
        text: 'Một tiếng cà phê vui, không có gì xảy ra. Về nhà, {tenBanDoi} hỏi sao về muộn, tôi nói họp. Lời nói dối nhỏ, nhưng đêm đó tôi không ngủ được.' },
    ],
  },
  {
    id: 'ls45-mot-minh-ba-me-gia', age: 45, needs: ['single', 'father', 'mother'],
    title: 'Người con ở gần',
    text: 'Tôi là người con duy nhất còn ở gần ba mẹ, lại sống một mình, nên mọi người mặc định tôi sẽ lo chăm sóc. Ba mẹ ngày càng yếu. Tôi đang có cơ hội đi làm ở xa, điều tôi đã chờ nhiều năm.',
    choices: [
      { label: 'Ở lại chăm ba mẹ', effects: { happiness: 1, health: -1 }, flags: ['o_lai_cham_ba_me'],
        text: 'Tôi từ chối công việc ấy. Mỗi sáng nấu cháo, mỗi chiều đưa đi dạo. Có hôm mệt quá, tôi gắt với ba mẹ, rồi ra hiên ngồi. Tối đó mẹ gõ cửa phòng, đưa tôi ly sữa.' },
      { label: 'Đi làm, thuê người chăm', effects: { intelligence: 1, happiness: -1 }, flags: ['di_lam_xa_45'],
        text: 'Tôi đi, tháng nào cũng gửi tiền thuê người chăm, cuối tuần gọi video. Ba mẹ nói khỏe, đừng lo. Có lần gọi, tôi thấy mẹ ngồi ở góc nhà, nhìn ra cửa.' },
    ],
  },
  {
    id: 'ls45-con-thi-dai-hoc', age: 45, needs: ['children'], childAge: [17, 18],
    title: 'Ngày con đi thi',
    text: '{tenCon} thi đại học. Sáng nay con ăn không vô, tay lạnh. Tôi đưa con tới cổng trường thi, đứng trong đám đông phụ huynh. Con quay lại, như muốn nghe tôi nói một câu trước khi vào.',
    choices: [
      { label: 'Nói: “Làm hết sức là được”', effects: { happiness: 1 },
        text: '{tenCon} gật đầu, đi vào. Tôi đứng ngoài cổng bốn tiếng, không đi đâu. Con ra, cười gượng, nói làm được. Tôi không hỏi gì thêm.' },
      { label: 'Ôm con, không nói gì', effects: { happiness: 2 }, flags: ['om_con_di_thi'],
        text: '{tenCon} hơi bất ngờ, rồi ôm lại. Con đi vào, không quay đầu. Nhiều năm sau, con kể lúc ấy tay mình đã thôi run.' },
    ],
  },

   
  {
    id: 'ls46-may-cuoi', age: 46,
    title: 'Cuộc gọi lúc rạng sáng',
    text: 'Bốn giờ sáng, điện thoại reo. Một người bạn cũ, lâu không liên lạc, khóc, nói vừa mất việc, vợ con bỏ đi, không biết nói với ai. Bạn ở cách tôi hai mươi cây số. Sáng nay tôi có việc từ bảy giờ.',
    choices: [
      { label: 'Lái xe tới ngay', effects: { happiness: 2, health: -1 }, flags: ['toi_voi_ban_luc_sang'],
        text: 'Tôi tới lúc năm giờ, bạn ngồi ở bậc thềm. Hai đứa ra quán ăn sáng, bạn nói gì tôi nghe nấy. Tôi trễ việc nửa ngày. Tháng sau bạn nhắn: “Hôm đó may có mày.”' },
      { label: 'Nói chuyện qua điện thoại', effects: { happiness: 1 },
        text: 'Hai đứa nói tới sáu giờ. Bạn bình tĩnh dần. Tôi hẹn chiều ghé. Chiều tôi ghé, bạn đã ngủ, tôi để lại hộp cơm ở cửa.' },
    ],
  },
  {
    id: 'ls46-cay-thuoc', age: 46,
    title: 'Tài khoản lạ',
    text: 'Có người gọi tự xưng nhân viên ngân hàng, nói tài khoản của tôi bị lộ, cần xác nhận mã gửi về điện thoại. Giọng rất chuyên nghiệp, đọc đúng tên tôi, số tài khoản. Tin nhắn chứa mã vừa tới.',
    choices: [
      { label: 'Cúp máy, gọi tổng đài ngân hàng', effects: { intelligence: 2 }, flags: ['tranh_lua_dao'],
        text: 'Tổng đài xác nhận không có ai gọi tôi. Tôi đổi mật khẩu, khóa tạm thẻ. Rồi tôi gọi cho mấy người lớn tuổi trong nhà, dặn đi dặn lại chuyện này, dặn tới mức có người phải cắt ngang.' },
      { label: 'Hỏi lại vài câu để kiểm tra', effects: { intelligence: 1 },
        text: 'Tôi hỏi tên chi nhánh, mã nhân viên. Người kia trả lời được hết, rồi cúp máy khi tôi đòi gọi lại số tổng đài. Tim tôi đập mạnh cả buổi.' },
    ],
  },
  {
    id: 'ls46-nghi-huu-som', age: 46, needs: ['employed'],
    title: 'Kế hoạch về sớm',
    text: 'Tôi tính được, nếu sống tằn tiện thêm mười năm, có thể nghỉ việc ở tuổi năm mươi sáu. Tằn tiện nghĩa là bỏ những chuyến đi, những bữa ăn ngoài, những món mình thích. Người thân và bạn bè sẽ thấy tôi thay đổi.',
    choices: [
      { label: 'Bắt đầu tằn tiện', effects: { happiness: -1, intelligence: 1 }, flags: ['tiet_kiem_huu_som'],
        text: 'Tôi nấu cơm mang đi làm, đi xe buýt. Tài khoản tăng đều mỗi tháng. Bạn bè thôi rủ đi ăn. Tôi mở bảng tính mỗi cuối tháng, thấy con số xa dần chỗ mình đứng.' },
      { label: 'Sống như cũ', effects: { happiness: 1 },
        text: 'Tôi vẫn đi ăn với bạn, vẫn mua sách. Nghỉ hưu lúc nào thì lúc đó tính. Có hôm ngồi quán với bạn cũ, tôi thấy những bữa ăn này cũng là một khoản tiết kiệm.' },
    ],
  },
  {
    id: 'ls46-viec-cham-nguoi-gia', age: 46, needs: ['notEmployed'],
    title: 'Chăm người già',
    text: 'Một gia đình trong khu thuê người chăm ông cụ tám mươi tuổi, liệt nửa người, mỗi ngày tám tiếng. Lương khá, nhưng việc nặng: tắm rửa, thay tã, đút cơm. Tôi chưa từng làm việc này.',
    choices: [
      { label: 'Nhận việc', effects: { health: -1, happiness: 1 }, money: 6000000, flags: ['cham_ong_cu'],
        text: 'Tuần đầu tôi lóng ngóng, ông cụ cáu. Tháng thứ hai, ông bắt đầu kể chuyện thời trẻ. Tôi biết ông thích nghe đài buổi chiều, thích uống trà nóng.' },
      { label: 'Từ chối', effects: { happiness: -1 },
        text: 'Tôi chưa đủ can đảm. Gia đình kia thuê được người khác. Tôi đi ngang nhà họ, thấy ông cụ ngồi trên xe lăn ở hiên, nghe đài.' },
    ],
  },
  {
    id: 'ls46-ban-doi-noi-dau', age: 46, needs: ['partner'],
    title: 'Câu nói làm đau',
    text: 'Trong một lần cãi nhau, {tenBanDoi} nói một câu rất đau về gia đình tôi. {tenBanDoi} đã xin lỗi ngay, nhưng câu ấy cứ lặp lại trong đầu tôi cả tuần. Tối nay {tenBanDoi} hỏi tôi còn giận không.',
    choices: [
      { label: 'Nói thật là còn đau', effects: { happiness: 1 }, flags: ['noi_con_dau'],
        text: '{tenBanDoi} ngồi xuống, nghe tôi nói hết, không cãi. Lần đầu tôi kể những chuyện cũ của gia đình mình. {tenBanDoi} nắm tay tôi. Câu nói ấy lặp lại ít dần.' },
      { label: 'Nói: “Hết rồi”', effects: { happiness: -2 },
        text: '{tenBanDoi} thở phào. Mọi thứ trở lại bình thường. Nhưng mỗi lần nhắc tới gia đình tôi, tôi lại để ý giọng {tenBanDoi}, chờ câu nói ấy.' },
    ],
  },
  {
    id: 'ls46-mot-minh-mua-nha', age: 46, needs: ['single'],
    title: 'Căn nhà chung với bạn',
    text: 'Người bạn thân cũng sống một mình đề nghị hai đứa góp tiền mua một căn nhà, mỗi người một tầng, già rồi có nhau. Ý tưởng hay, nhưng chuyện nhà đất dính tới tiền, dễ mất bạn.',
    choices: [
      { label: 'Đồng ý, làm giấy tờ rõ ràng', effects: { happiness: 2 }, flags: ['nha_chung_ban'],
        text: 'Hai đứa thuê luật sư soạn thỏa thuận, chia từng mét vuông. Dọn về, tối nào cũng có người hỏi ăn cơm chưa. Có lần cãi nhau chuyện tiền điện, hai ngày sau lại ngồi uống trà.' },
      { label: 'Từ chối, ở gần nhau thôi', effects: { intelligence: 1 },
        text: 'Hai đứa mua hai căn trong cùng một con hẻm. Đi bộ ba phút là tới. Cuối tuần, đứa này mang đồ ăn sang nhà đứa kia, như sinh viên ở trọ.' },
    ],
  },
  {
    id: 'ls46-con-truot', age: 46, needs: ['children'], childAge: [18, 19],
    title: 'Kết quả thi',
    text: '{tenCon} thi trượt nguyện vọng một, đậu một trường ở xa, ngành không thích. Con muốn ở nhà ôn thi lại một năm. Họ hàng nói ôn lại là phí thời gian, cứ đi học rồi tính.',
    choices: [
      { label: 'Cho con ôn thi lại', effects: { happiness: 1 }, flags: ['con_on_thi_lai'],
        text: 'Một năm {tenCon} ôn ở nhà, có lúc chán nản, có lúc khóc. Năm sau con đậu đúng ngành mình thích. Ngày nhập học, con nói: “Cảm ơn ba mẹ đã chờ.”' },
      { label: 'Khuyên con đi học trường đã đậu', effects: { intelligence: 1 }, flags: ['con_di_hoc_xa'],
        text: '{tenCon} đi, năm đầu gọi về ít. Năm thứ hai con tìm được thứ mình thích trong ngành ấy. Con nói: “Cũng không tệ như con tưởng.”' },
    ],
  },

   
  {
    id: 'ls47-dau-dau-goi', age: 47,
    title: 'Đầu gối',
    text: 'Đầu gối tôi đau mỗi khi leo cầu thang. Bác sĩ nói thoái hóa sớm, nên giảm cân, tập nhẹ. Nhà tôi ở tầng bốn không có thang máy. Có một căn tầng trệt cho thuê ở gần, nhưng phải dọn đi, bỏ khu quen.',
    choices: [
      { label: 'Dọn xuống tầng trệt', effects: { health: 2, happiness: -1 }, flags: ['don_tang_tret'],
        text: 'Căn mới tối hơn, ồn hơn, nhưng không phải leo cầu thang. Đầu gối đỡ dần. Tôi nhớ cái ban công nhìn ra hàng cây ở căn cũ.' },
      { label: 'Ở lại, tập cho đầu gối', effects: { health: 1 },
        text: 'Tôi tập mỗi sáng, giảm được vài ký. Cầu thang vẫn khó, nhưng tôi leo chậm, nghỉ ở mỗi chiếu nghỉ. Hàng cây ngoài ban công vẫn xanh.' },
    ],
  },
  {
    id: 'ls47-giup-nguoi-la', age: 47,
    title: 'Người đàn ông ở bến xe',
    text: 'Ở bến xe, một người đàn ông lớn tuổi xin tôi mấy chục nghìn mua vé về quê, nói bị móc túi. Tôi từng gặp kiểu này, nhiều lần là lừa. Người ấy mặc áo sơ mi cũ, tay cầm tờ giấy ghi địa chỉ.',
    choices: [
      { label: 'Mua vé giúp, không đưa tiền', money: -100000, effects: { happiness: 1, intelligence: 1 }, flags: ['mua_ve_giup'],
        text: 'Tôi dẫn ông tới quầy, mua một vé. Ông cảm ơn, lên xe. Tôi đứng nhìn tới khi xe chạy. Không biết ông có thật bị móc túi không, nhưng ông đã về được nhà.' },
      { label: 'Đi qua', effects: { happiness: -1 },
        text: 'Tôi lắc đầu, đi tiếp. Lúc lên xe, tôi thấy ông vẫn đứng đó, hỏi người khác. Suốt chuyến đi, tôi nhìn ra cửa sổ, nghĩ về tờ giấy ghi địa chỉ.' },
    ],
  },
  {
    id: 'ls47-cap-duoi-sai', age: 47, needs: ['employed'],
    title: 'Lỗi của cấp dưới',
    text: 'Một nhân viên trẻ dưới quyền tôi làm sai, khách hàng nổi giận. Cấp trên hỏi ai chịu trách nhiệm. Đẩy lỗi cho nhân viên thì tôi an toàn. Nhận lỗi về mình thì cậu ấy giữ được việc, còn tôi mất điểm.',
    choices: [
      { label: 'Nhận trách nhiệm', effects: { happiness: 1 }, flags: ['nhan_loi_thay_cap_duoi'],
        text: 'Tôi bị khiển trách. Cậu nhân viên ở lại, làm việc cẩn thận hẳn. Nhiều năm sau, khi cậu ấy lên làm quản lý, cậu ấy kể chuyện này trong một buổi đào tạo.' },
      { label: 'Nói đúng sự thật', effects: { intelligence: 1 },
        text: 'Cậu nhân viên bị kỷ luật nhẹ, không mất việc. Cậu ấy làm việc lặng lẽ hơn. Tôi không biết cậu ấy nghĩ gì về tôi, và không hỏi.' },
    ],
  },
  {
    id: 'ls47-ban-hang-online', age: 47, needs: ['notEmployed'],
    title: 'Học bán hàng trên mạng',
    text: 'Đứa cháu dạy tôi bán hàng trên mạng: quay video, nói chuyện trước điện thoại. Tôi ngượng, nói vấp, thấy mình già. Cháu nói cứ nói thật, người ta thích nghe người thật nói chuyện thật.',
    choices: [
      { label: 'Thử quay video', effects: { happiness: 2, intelligence: 1 }, flags: ['ban_hang_video'],
        text: 'Video đầu có mười người xem, bảy người là họ hàng. Video thứ hai mươi có một nghìn người. Có khách nhắn: “Cô chú nói chuyện như mẹ cháu.” Tôi đọc mãi.' },
      { label: 'Nhờ cháu bán hộ', effects: { happiness: -1 },
        text: 'Cháu bán giúp vài tháng, rồi bận học. Hàng tồn trong góc nhà. Tôi mở lại video hướng dẫn của cháu, xem rồi tắt.' },
    ],
  },
  {
    id: 'ls47-ban-doi-benh-nang', age: 47, needs: ['partner'],
    title: 'Ca mổ của {tenBanDoi}',
    text: '{tenBanDoi} phải mổ, bác sĩ nói có hai cách: mổ ở bệnh viện tuyến trên, chi phí cao gấp ba, hoặc mổ ở đây, tay nghề kém hơn nhưng gần nhà. Tiền nhà đủ cho cách thứ nhất, nhưng sẽ cạn sạch.',
    choices: [
      { label: 'Lên tuyến trên', effects: { happiness: 1, health: -1 }, flags: ['mo_tuyen_tren'],
        text: 'Ca mổ tốt. Tôi ngủ ở hành lang bệnh viện một tuần. Về nhà, tài khoản gần như trống. {tenBanDoi} nói: “Tốn kém quá.” Tôi nói: “Tốn vậy là đáng.”' },
      { label: 'Mổ ở gần nhà', effects: { happiness: -1 },
        text: 'Ca mổ ổn, hồi phục lâu hơn dự kiến. Tiền còn để dành. Mỗi lần {tenBanDoi} kêu đau vết mổ, tôi lại nghĩ tới bệnh viện tuyến trên.' },
    ],
  },
  {
    id: 'ls47-mot-minh-hoc', age: 47, needs: ['single'],
    title: 'Lớp học thạc sĩ',
    text: 'Tôi muốn học thạc sĩ, điều đã bỏ lỡ hồi trẻ. Lớp toàn người hai mươi mấy tuổi, học tối, kéo dài hai năm. Không còn ai cần tôi về nhà sớm, nên thời gian thì có. Chỉ thiếu can đảm.',
    choices: [
      { label: 'Đăng ký', effects: { intelligence: 3 }, flags: ['hoc_thac_si'],
        text: 'Tôi ngồi bàn đầu, hỏi nhiều nhất lớp. Tụi trẻ gọi tôi là “trưởng lão”. Hai năm sau tôi bảo vệ luận văn, cả lớp tới dự, mang theo một bó hoa to.' },
      { label: 'Học các khóa ngắn', effects: { intelligence: 1, happiness: 1 },
        text: 'Tôi học vài khóa trực tuyến ngắn, có chứng chỉ. Không có lễ tốt nghiệp, không có lớp. Nhưng tôi vẫn học được những gì mình muốn.' },
    ],
  },
  {
    id: 'ls47-con-yeu-cau-tien', age: 47, needs: ['children'], childAge: [19, 24],
    title: 'Con xin tiền',
    text: '{tenCon} học đại học, xin thêm tiền mua máy tính đắt tiền, nói cần cho ngành học. Tôi kiểm tra thì thấy loại rẻ hơn một nửa cũng dùng được. {tenCon} nói bạn bè đều dùng loại đắt.',
    choices: [
      { label: 'Mua loại con muốn', money: -30000000, effects: { happiness: 1 },
        text: '{tenCon} cảm ơn, gửi ảnh chiếc máy mới. Tháng đó tôi cắt bớt mấy khoản chi. Con không biết, cũng không cần biết.' },
      { label: 'Mua loại vừa đủ, giải thích', money: -15000000, effects: { intelligence: 1 }, flags: ['day_con_tieu_tien'],
        text: '{tenCon} hơi buồn, nhưng nhận. Hai năm sau, con gửi tin nhắn: “Máy vẫn chạy tốt. Con hiểu rồi.” Tôi đọc, không biết con hiểu chuyện gì, nhưng thấy vui.' },
    ],
  },

   
  {
    id: 'ls48-doi-mua-khu-pho', age: 48,
    title: 'Đội múa của khu phố',
    text: 'Câu lạc bộ khu phố cần thêm người cho đội múa dịp lễ, toàn người trẻ hơn tôi. Phải tập ba buổi tối mỗi tuần trong một tháng. Người phụ trách nói tôi có dáng, chỉ cần chịu khó. Tôi chưa từng múa trước đông người bao giờ.',
    choices: [
      { label: 'Tham gia đội múa', effects: { happiness: 2, appearance: 1, health: -1 },
        text: 'Tháng đầu tôi đau khắp người, có buổi về chỉ muốn nằm. Hôm biểu diễn tôi nhầm một nhịp, cả đội vẫn vỗ tay. Tấm ảnh đội múa được dán ở bảng tin khu phố.' },
      { label: 'Nhận phần hậu cần', effects: { happiness: 1 },
        text: 'Tôi lo nước uống, trang phục, nhạc. Hôm biểu diễn tôi đứng sau cánh gà, đếm nhịp theo. Người phụ trách nói năm sau nhất định phải lên sân khấu.' },
    ],
  },
  {
    id: 'ls48-ban-cu-qua-doi', age: 48,
    title: 'Tin buồn trong nhóm lớp',
    text: 'Nhóm lớp báo tin một người bạn cũ mất vì ung thư. Bạn ấy từng nhắn hỏi thăm tôi mấy tháng trước, tôi hẹn “khi nào rảnh cà phê”, rồi quên. Đám tang ở tỉnh khác, ngày mai.',
    choices: [
      { label: 'Đi viếng', effects: { happiness: 1, health: -1 }, flags: ['vieng_ban_cu'],
        text: 'Tôi đi xe đêm, tới kịp giờ tiễn. Mẹ bạn cầm tay tôi, nói bạn hay nhắc tới tôi. Trên đường về, tôi mở tin nhắn cuối cùng của bạn, đọc đi đọc lại.' },
      { label: 'Gửi lời chia buồn', effects: { happiness: -2 },
        text: 'Tôi chuyển tiền phúng điếu, viết lời chia buồn. Tối đó, tôi mở tin nhắn cuối của bạn: “Khi nào rảnh cà phê nha.” Tôi gõ trả lời, rồi xóa.' },
    ],
  },
  {
    id: 'ls48-vay-mua-dat', age: 48, minMoney: 100000000,
    title: 'Mảnh đất ven sông',
    text: 'Người quen rủ góp tiền mua một mảnh đất ven sông, nói sắp có quy hoạch, giá sẽ tăng gấp đôi. Giấy tờ đang “chờ hoàn thiện”. Tôi có một khoản để dành, đủ góp một phần.',
    choices: [
      { label: 'Góp tiền', effects: { happiness: -2 }, money: -100000000, flags: ['mua_dat_chua_so'],
        text: 'Một năm sau, quy hoạch không có. Giấy tờ vẫn chờ. Người quen nói “đợi thêm”. Tôi lái xe ra chỗ mảnh đất, nhìn đám cỏ lau mọc cao tới ngực.' },
      { label: 'Từ chối', effects: { intelligence: 1 },
        text: 'Người quen nói tôi nhát. Hai năm sau, mảnh đất vẫn là bãi cỏ, những người góp tiền thưa kiện nhau. Tôi đi ngang, không dừng lại.' },
    ],
  },
  {
    id: 'ls48-hoc-ky-nang-moi', age: 48,
    title: 'Học nấu ăn',
    text: 'Bao nhiêu năm tôi chỉ nấu được vài món. Gần đây tôi nhận ra mình chưa từng hỏi người nấu ăn cho mình, những món ấy nấu thế nào. Có những người đã không còn để hỏi.',
    choices: [
      { label: 'Đi học một lớp nấu ăn', effects: { happiness: 2, health: 1 }, money: -3000000, flags: ['hoc_nau_an'],
        text: 'Lớp học có toàn người trẻ. Tôi học món canh chua, món thịt kho. Lần đầu nấu lại được món thịt kho đúng vị nhà mình, tôi ngồi ăn một mình, ăn rất chậm.' },
      { label: 'Gọi điện hỏi người thân còn lại', effects: { happiness: 2 },
        text: 'Tôi gọi cho người cô lớn tuổi, hỏi cách kho thịt. Cô kể một tiếng, lạc sang đủ chuyện thời xưa. Món thịt kho ấy tôi nấu không giống, nhưng cuộc gọi thì rất dài.' },
    ],
  },
  {
    id: 'ls48-nghi-viec-cham-ba-me', age: 48, needs: ['employed', 'anyParent'],
    title: 'Nghỉ việc hay thuê người',
    text: 'Người thân già yếu cần có người ở cạnh cả ngày. Thuê người thì gần bằng lương tôi. Nghỉ việc thì tự chăm được, nhưng mất thu nhập, mất luôn chỗ làm hai mươi năm.',
    choices: [
      { label: 'Xin nghỉ không lương một năm', effects: { happiness: 1, health: -1 }, flags: ['nghi_cham_ba_me'],
        text: 'Một năm ở nhà chăm người thân. Có những ngày dài vô tận, có những buổi chiều ngồi cùng nhau ngoài hiên, không ai nói gì mà vẫn thấy đủ.' },
      { label: 'Thuê người, vẫn đi làm', money: -60000000, effects: { happiness: -1 },
        text: 'Người chăm làm tốt. Tối nào tôi cũng ghé, ngồi một tiếng. Lương gần như hết vào tiền thuê. Tôi đi làm như để có cớ ra khỏi nhà.' },
    ],
  },
  {
    id: 'ls48-cho-o-viec-moi', age: 48, needs: ['notEmployed'],
    title: 'Lời mời từ người cũ',
    text: 'Một đồng nghiệp cũ giờ mở công ty riêng, gọi mời tôi về làm. Lương không cao, nhưng anh ấy nói cần người có kinh nghiệm. Năm xưa tôi từng không ủng hộ anh ấy trong một chuyện, không biết anh ấy còn nhớ không.',
    choices: [
      { label: 'Nhận lời', effects: { happiness: 2 }, flags: ['ve_cong_ty_nguoi_cu'],
        text: 'Ngày đầu, anh ấy nói chuyện cũ đã quên rồi, chỉ nhớ hồi đó tôi làm việc rất kỹ. Tôi làm ở đó tới khi nghỉ hưu.' },
      { label: 'Hỏi thẳng chuyện cũ trước', effects: { intelligence: 1 },
        text: 'Anh ấy cười, nói nhớ chứ, nhưng nhờ chuyện đó anh ấy sửa được sai lầm. Tôi nhận lời. Hai người làm việc rất thẳng thắn với nhau.' },
    ],
  },
  {
    id: 'ls48-ban-doi-muon-ve-que', age: 48, needs: ['partner'],
    title: 'Về quê sống',
    text: '{tenBanDoi} muốn về quê sống những năm tới, xây một căn nhà nhỏ, trồng rau. Tôi quen thành phố, bạn bè, công việc đều ở đây. {tenBanDoi} đã nói chuyện này mấy năm, giờ nói lại, lần này nghiêm túc.',
    choices: [
      { label: 'Đồng ý, bắt đầu chuẩn bị', effects: { happiness: 1 }, flags: ['ve_que_song'],
        text: 'Hai đứa mua mảnh đất nhỏ, xây dần trong hai năm. Mỗi lần về xem nhà, {tenBanDoi} đứng giữa sân, nhìn quanh như đứa trẻ. Tôi bắt đầu thấy nhớ nơi mình còn chưa ở.' },
      { label: 'Đề nghị chia đôi thời gian', effects: { intelligence: 1 },
        text: 'Hai đứa thống nhất: mỗi năm về quê ba tháng. {tenBanDoi} vui, nhưng nói ba tháng là ít. Năm sau thành bốn tháng.' },
    ],
  },
  {
    id: 'ls48-mot-minh-di-tinh-nguyen', age: 48, needs: ['single'],
    title: 'Chuyến tình nguyện',
    text: 'Một tổ chức tuyển người tình nguyện dạy học ở vùng xa ba tháng. Tôi có thời gian, không ai phải chăm sóc. Nhưng tôi gần năm mươi, sức khỏe không còn như trước, vùng ấy đường sá khó đi.',
    choices: [
      { label: 'Đăng ký đi', effects: { happiness: 3, health: -1 }, flags: ['tinh_nguyen_48'],
        text: 'Ba tháng ở một điểm trường không có sóng điện thoại. Tụi nhỏ gọi tôi là “thầy cô già”. Ngày đi, một đứa đưa tôi bức tranh vẽ cái máy bay.' },
      { label: 'Quyên góp, không đi', effects: { intelligence: 1 },
        text: 'Tôi gửi một khoản tiền, kèm thùng sách. Tổ chức gửi lại ảnh tụi nhỏ ôm sách. Tôi dán tấm ảnh lên tủ lạnh, cạnh hóa đơn tiền điện.' },
    ],
  },
  {
    id: 'ls48-con-ra-truong', age: 48, needs: ['children'], childAge: [21, 24],
    title: 'Con muốn đi xa',
    text: '{tenCon} ra trường, có cơ hội làm việc ở nước ngoài, ít nhất năm năm. Con hỏi ý tôi, giọng háo hức. Tôi nghĩ tới những năm mình già, ngồi một mình trong căn nhà vắng.',
    choices: [
      { label: 'Khuyến khích con đi', effects: { happiness: 1 }, flags: ['con_di_nuoc_ngoai'],
        text: 'Ngày tiễn con ở sân bay, tôi cười suốt, về tới nhà mới ngồi xuống. Mỗi tuần con gọi video một lần, kể chuyện đồng nghiệp, thời tiết, món ăn lạ.' },
      { label: 'Nói thật mình sẽ nhớ con', effects: { happiness: 2 }, flags: ['noi_nho_con'],
        text: '{tenCon} im một lúc, rồi ôm tôi. Con vẫn đi, nhưng hứa năm nào cũng về Tết. Năm đầu, con về đúng hẹn, xách theo một vali quà.' },
    ],
  },

   
  {
    id: 'ls49-buoi-sang-yen', age: 49,
    title: 'Buổi sáng không vội',
    text: 'Gần năm mươi, tôi để ý mình luôn vội: ăn vội, đi vội, nói chuyện vội. Có một lớp thiền buổi sáng ở chùa gần nhà, mỗi ngày bốn mươi phút. Bốn mươi phút ấy tôi thường dùng để xem tin tức.',
    choices: [
      { label: 'Đi thử một tháng', effects: { happiness: 2, health: 1 }, flags: ['thien_sang'],
        text: 'Tuần đầu tôi chỉ ngồi nghĩ chuyện công việc. Tuần thứ ba, tôi nghe được tiếng chim trên mái chùa. Tháng thứ hai, tôi vẫn đi, không cần ai nhắc.' },
      { label: 'Thử đi bộ chậm buổi sáng', effects: { health: 2 },
        text: 'Tôi đi bộ quanh hồ mỗi sáng, không mang tai nghe. Lần đầu tôi để ý quanh hồ có ba cây bàng, một cây sắp đổ.' },
    ],
  },
  {
    id: 'ls49-cho-vay-hang-xom', age: 49,
    title: 'Hàng xóm cần tiền viện phí',
    text: 'Người hàng xóm lâu năm gõ cửa, xin vay tiền đóng viện phí cho chồng. Gia đình họ nghèo, khả năng trả rất thấp. Họ từng giúp tôi chuyển nhà, trông nhà khi tôi đi vắng mười năm nay.',
    choices: [
      { label: 'Cho vay, không hẹn ngày trả', effects: { happiness: 2 }, money: -10000000, flags: ['cho_hang_xom_vay'],
        text: 'Chị hàng xóm cầm tiền, nói không nên lời. Chồng chị qua khỏi. Hai năm sau, chị trả được một nửa, còn lại trả bằng những rổ rau, những con cá mỗi tuần.' },
      { label: 'Cho một khoản nhỏ, không vay', effects: { happiness: 1 }, money: -2000000,
        text: 'Tôi đưa một khoản nhỏ, nói là quà thăm bệnh. Chị cảm ơn, nhưng vẫn đi vay thêm ở chỗ khác với lãi cao. Tôi biết, vì chị kể.' },
    ],
  },
  {
    id: 'ls49-nhom-cuu-ho', age: 49,
    title: 'Mùa lũ',
    text: 'Quê một người đồng nghiệp bị lũ, nhà cửa ngập tới mái. Một nhóm thiện nguyện cần người lái xe chở hàng cứu trợ, đi ba ngày, đường khó. Tôi lái xe giỏi, nhưng đã lâu không đi đường xa.',
    choices: [
      { label: 'Đi cùng nhóm', effects: { happiness: 3, health: -2 }, flags: ['cuu_tro_lu'],
        text: 'Ba ngày lội nước, ngủ trên xe. Có bà cụ ôm tôi khóc khi nhận thùng mì. Về nhà, tôi ngủ một mạch mười bốn tiếng. Lưng đau cả tuần.' },
      { label: 'Góp tiền, góp hàng', effects: { happiness: 1 },
        text: 'Tôi chở hàng tới điểm tập kết, góp một khoản tiền. Nhóm gửi ảnh, có cả thùng hàng tôi góp, nằm trên một chiếc ghe giữa dòng nước đục.' },
    ],
  },
  {
    id: 'ls49-chuan-bi-huu', age: 49, needs: ['employed'],
    title: 'Người kế nhiệm',
    text: 'Công ty muốn tôi đào tạo một người trẻ để sau này thay vị trí của mình. Dạy hết thì tôi sớm thành người thừa. Dạy nửa vời thì không ai nói được gì, nhưng công việc sẽ rối khi tôi nghỉ.',
    choices: [
      { label: 'Dạy hết những gì mình biết', effects: { happiness: 1, intelligence: 1 }, flags: ['day_nguoi_ke_nhiem'],
        text: 'Tôi viết lại hai mươi năm kinh nghiệm thành một cuốn sổ tay. Người trẻ học nhanh, hay hỏi. Có hôm cậu ấy nói: “Em sẽ giữ đúng như những gì đã học.”' },
      { label: 'Dạy vừa đủ', effects: { happiness: -1 },
        text: 'Người trẻ học những gì tôi dạy, làm được việc. Những chuyện khó, cậu ấy vẫn phải hỏi tôi. Tôi thấy mình còn cần thiết, và thấy mình hơi nhỏ nhen.' },
    ],
  },
  {
    id: 'ls49-tu-lam-chu', age: 49, needs: ['notEmployed'],
    title: 'Mở một tiệm nhỏ',
    text: 'Tôi tính mở một tiệm nhỏ ở đầu hẻm, bán đồ ăn sáng. Tiền vốn là số tiền cuối cùng còn lại. Tôi nấu được, nhưng chưa từng kinh doanh. Có người nói bốn mươi chín tuổi mới làm chủ là muộn.',
    choices: [
      { label: 'Mở tiệm', effects: { happiness: 2, health: -1 }, flags: ['tiem_an_sang'],
        text: 'Tháng đầu bán được mười tô một ngày. Tháng thứ sáu, năm mươi tô. Dậy từ bốn giờ sáng, mệt, nhưng có khách quen hỏi: “Hôm nay có món gì?”' },
      { label: 'Bán hàng rong trước', effects: { intelligence: 1 },
        text: 'Tôi đẩy xe bán ở cổng chợ, thử xem khách thích món gì. Sau một năm, tôi biết món nào bán chạy, mới thuê mặt bằng.' },
    ],
  },
  {
    id: 'ls49-ban-doi-ky-niem', age: 49, needs: ['partner'],
    title: 'Những lá thư cũ',
    text: 'Dọn tủ, {tenBanDoi} tìm thấy hộp thư tay hai đứa viết cho nhau thời mới quen. {tenBanDoi} đề nghị đọc to cho nhau nghe. Có vài lá thư tôi viết rất sến, giờ đọc chắc ngượng chết.',
    choices: [
      { label: 'Đọc cho nhau nghe', effects: { happiness: 3 }, flags: ['doc_thu_cu'],
        text: 'Hai đứa đọc tới khuya, cười chảy nước mắt. Có lá thư {tenBanDoi} đọc xong thì im, ngồi nhìn tôi. Tôi không nhớ mình đã viết những lời ấy, nhưng nhớ cái cảm giác lúc viết.' },
      { label: 'Cất hộp thư lại', effects: { happiness: -1 },
        text: '{tenBanDoi} cười, cất hộp thư lên nóc tủ. Tối đó, tôi lén lấy một lá, đọc một mình trong phòng tắm.' },
    ],
  },
  {
    id: 'ls49-mot-minh-hang-xom-gia', age: 49, needs: ['single'],
    title: 'Chìa khóa dự phòng',
    text: 'Tôi sống một mình đã nhiều năm. Hàng xóm đề nghị giữ một chìa khóa nhà tôi, phòng khi tôi ốm, ngã, không ai biết. Tôi thấy hơi riêng tư, nhưng cũng biết họ có lý.',
    choices: [
      { label: 'Đưa chìa khóa', effects: { happiness: 1 }, flags: ['hang_xom_giu_chia_khoa'],
        text: 'Hàng xóm cất chìa khóa ở hộp riêng, ghi tên tôi. Hai người hẹn nhau: sáng nào cửa nhà tôi chưa mở thì họ gõ. Từ đó, sáng nào tôi cũng mở cửa trước bảy giờ.' },
      { label: 'Đặt thiết bị báo động thay', effects: { intelligence: 1 },
        text: 'Tôi lắp nút báo động nối với điện thoại người thân. Không phải đưa chìa khóa cho ai. Mỗi tháng, hệ thống gửi tin nhắn kiểm tra, tôi bấm: “Vẫn ổn.”' },
    ],
  },
  {
    id: 'ls49-con-dua-nguoi-yeu-ve', age: 49, needs: ['children'], childAge: [22, 28],
    title: 'Người con dẫn về',
    text: '{tenCon} dẫn người yêu về ra mắt. Người ấy lịch sự, nhưng gia cảnh rất khác nhà mình, công việc không ổn định. {tenCon} nhìn tôi, chờ một lời nhận xét sau bữa cơm.',
    choices: [
      { label: 'Nói thật cảm nhận', effects: { intelligence: 1 }, flags: ['nhan_xet_nguoi_yeu_con'],
        text: 'Tôi nói người ấy tốt, nhưng tôi lo chuyện công việc. {tenCon} nghe hết, nói sẽ suy nghĩ. Một năm sau, người ấy có việc ổn định. {tenCon} báo tin, giọng tự hào.' },
      { label: 'Nói: “Con thương là được”', effects: { happiness: 2 },
        text: '{tenCon} cười, ôm tôi. Người ấy về rồi, tôi ngồi một mình ngoài hiên, nhớ tới bữa cơm ra mắt của chính mình năm nào.' },
    ],
  },

   
  {
    id: 'ls-ba-lan-cau-ca', ages: [40, 70], requires: ['nghe_chuyen_ba'], needs: ['father'],
    title: 'Chuyện câu cá',
    text: 'Ba già yếu, trí nhớ lẫn dần, nhiều hôm không nhớ mình đã ăn cơm chưa. Hôm nay ba ngồi ở hiên, nhìn ra đường, hỏi tôi là ai. Tôi nhớ tới câu chuyện bà từng kể, chuyện ba hồi nhỏ trốn học đi câu cá.',
    choices: [
      { label: 'Kể lại chuyện câu cá cho ba', effects: { happiness: 3 }, flags: ['ke_chuyen_ba_nghe'],
        text: 'Ba nghe, rồi cười, rồi nói: “Bị ông đánh đau lắm.” Ba nhớ ra. Ba kể tiếp một đoạn tôi chưa từng nghe, về con cá lóc to nhất ba từng câu được. Hôm đó ba gọi đúng tên tôi.' },
      { label: 'Nói tên mình cho ba nhớ', effects: { happiness: -1 },
        text: 'Ba gật đầu, lặp lại tên tôi, rồi quên ngay. Tôi ngồi cạnh ba tới tối. Có lúc ba nắm tay tôi, như nắm tay một người quen mà không biết là ai.' },
    ],
  },
  {
    id: 'ls-con-nho-dem-cai-nhau', ages: [44, 56], requiresAny: ['dung_cai_truoc_con', 'cai_truoc_con'], needs: ['children'], childAge: [16, 30],
    title: 'Điều con còn nhớ',
    text: 'Một tối ngồi nói chuyện, {tenCon} kể con vẫn nhớ đêm hồi nhỏ thấy ba mẹ cãi nhau, con đứng ở cửa phòng ôm gối. Con hỏi tôi đêm đó ba mẹ cãi chuyện gì.',
    choices: [
      { label: 'Kể thật', effects: { happiness: 1, intelligence: 1 }, flags: ['ke_dem_cai_nhau'],
        text: 'Tôi kể chuyện tiền bạc năm ấy, những khó khăn con không biết. {tenCon} nghe, gật đầu, rồi nói: “Con cứ tưởng là tại con.” Tôi ngồi lặng đi rất lâu.' },
      { label: 'Nói không nhớ', effects: { happiness: -1 },
        text: '{tenCon} nói: “Con thì nhớ hoài.” Rồi chuyển sang chuyện khác. Tôi nhớ chính mình cũng từng giả ngủ trong một đêm như vậy, và cũng chưa bao giờ hỏi lại ba mẹ.' },
    ],
  },
  {
    id: 'ls-con-nho-so-thu', ages: [44, 56], requires: ['giu_loi_voi_con'], needs: ['children'], childAge: [16, 30],
    title: 'Sở thú năm ấy',
    text: '{tenCon} đã lớn, rủ tôi đi sở thú chủ nhật này, nói tự nhiên nhớ hồi nhỏ, nhớ một lần tôi ngủ gật trên ghế đá trong lúc con xem hươu. Sở thú cũ đã sửa lại, có thêm nhiều chuồng mới.',
    choices: [
      { label: 'Đi cùng con', effects: { happiness: 3 }, flags: ['di_so_thu_voi_con'],
        text: 'Hai người đi chậm, con nhường tôi ngồi nghỉ ở mỗi ghế đá. Đứng trước chuồng hươu, con nói: “Hồi đó con biết ba mẹ mệt lắm.” Tôi không biết là con biết.' },
      { label: 'Hẹn dịp khác', effects: { happiness: -1 },
        text: 'Con nói “dạ”, rồi đi với bạn. Con gửi ảnh chuồng hươu mới, kèm dòng chữ: “Vẫn là cái ghế đá đó.” Tôi phóng to tấm ảnh, nhìn cái ghế đá rất lâu.' },
    ],
  },
  {
    id: 'ls-con-nho-loi-hen', ages: [44, 56], requires: ['hen_con_tuan_sau'], needs: ['children'], childAge: [16, 30],
    title: 'Lời hẹn tuần sau',
    text: '{tenCon} đã lớn, một tối kể con vẫn nhớ một sáng chủ nhật hồi nhỏ, mặc áo đội mũ chờ ở cửa phòng ba mẹ để đi sở thú, rồi không đi. Con kể không trách, chỉ kể. Rồi con rủ tôi đi sở thú chủ nhật này.',
    choices: [
      { label: 'Đi, xin lỗi con', effects: { happiness: 3 }, flags: ['xin_loi_con_so_thu'],
        text: 'Đứng trước chuồng hươu, tôi nói xin lỗi vì năm ấy. Con cười, nói đã quên từ lâu, rồi mua cho tôi một cây kem. Hai người ở lại tới khi cổng đóng.' },
      { label: 'Đi, không nhắc chuyện cũ', effects: { happiness: 1 },
        text: 'Hai người đi hết các chuồng, chụp nhiều ảnh. Lúc về, con nói: “Vậy là xong lời hẹn tuần sau rồi nha.” Con nói nhẹ tênh. Tôi thì nghe rất rõ.' },
    ],
  },
  {
    id: 'ls-ban-bi-cat-giam-giup', ages: [40, 55], requires: ['bao_ban_cat_giam'], needs: ['notEmployed'],
    title: 'Người bạn trả ơn',
    text: 'Người bạn năm xưa tôi báo trước chuyện cắt giảm, giờ làm giám đốc một công ty nhỏ. Nghe tin tôi không có việc, bạn gọi tới, nói có một vị trí phù hợp, và nói: “Lần này tới lượt tao.”',
    choices: [
      { label: 'Nhận lời', effects: { happiness: 3 }, flags: ['ban_tra_on'],
        text: 'Tôi về làm cho bạn. Hai đứa không nhắc chuyện cũ. Có lần trong tiệc công ty, bạn kể chuyện năm ấy cho nhân viên nghe, kể như kể chuyện người khác.' },
      { label: 'Cảm ơn, tự tìm việc', effects: { intelligence: 1 },
        text: 'Bạn nói vẫn để ngỏ vị trí ấy. Tôi tự tìm được việc sau ba tháng. Hai đứa đi ăn mừng, bạn trả tiền, nhất định không cho tôi trả.' },
    ],
  },
  {
    id: 'ls-hoc-dan-lai', ages: [42, 60], requiresAny: ['bo_dan', 'hoc_dan'],
    title: 'Cây đàn trong góc',
    text: 'Tôi thấy một cây đàn cũ ở tiệm đồ cũ, giống hệt cây đàn hồi chín tuổi. Ngón tay tôi giờ cứng hơn, mắt cũng kém. Ông chủ tiệm nói đàn còn tốt, bán rẻ cho người biết chơi.',
    choices: [
      { label: 'Mua về, tập lại', effects: { happiness: 3 }, money: -1500000, flags: ['tap_dan_lai'],
        text: 'Tôi tập mỗi tối nửa tiếng. Ba tháng sau đàn được bài đầu tiên, vấp ở đúng chỗ năm chín tuổi từng vấp. Tôi quay video, rồi không biết gửi cho ai.' },
      { label: 'Ngồi đàn thử một bài rồi đi', effects: { happiness: 1 },
        text: 'Tôi đàn được nửa bài, quên đoạn sau. Ông chủ tiệm vỗ tay. Tôi cảm ơn, đặt nắp đàn xuống, đi ra.' },
    ],
  },
  {
    id: 'ls-tiem-banh-sau-nay', ages: [40, 50], requiresAny: ['ung_ho_tiem_banh', 'tiem_banh_cuoi_tuan', 'can_tiem_banh'], needs: ['partner'],
    title: 'Chiếc bánh sinh nhật',
    text: 'Sinh nhật tôi, {tenBanDoi} tự tay làm một chiếc bánh. Bánh đẹp, đúng kiểu tôi thích. {tenBanDoi} nhìn tôi cắt miếng đầu tiên, nói nhỏ: “Bao năm rồi tay vẫn chưa quên.”',
    choices: [
      { label: 'Hỏi {tenBanDoi} có muốn làm lại không', effects: { happiness: 2 }, flags: ['hoi_lai_tiem_banh'],
        text: '{tenBanDoi} im lặng, rồi kể những năm qua vẫn hay xem người ta làm bánh. Hai đứa ngồi tính chuyện mở một góc bán bánh nhỏ trong nhà, bán cho hàng xóm.' },
      { label: 'Khen bánh ngon, không hỏi gì', effects: { happiness: 1 },
        text: '{tenBanDoi} cười, cất phần bánh còn lại vào tủ lạnh. Mấy hôm sau, tôi thấy cuốn sổ công thức được lấy xuống từ nóc tủ, nằm trên bàn bếp.' },
    ],
  },
  {
    id: 'ls-thu-moi-tot-nghiep', ages: [38, 50], requires: ['giup_hoc_tro'],
    title: 'Lễ tốt nghiệp',
    text: 'Cậu học trò vùng cao năm nào gửi thư mời dự lễ tốt nghiệp. Cậu viết: “Thầy cô là người đầu tiên con muốn mời.” Lễ ở thành phố khác, đúng ngày tôi có việc quan trọng.',
    choices: [
      { label: 'Đi dự', effects: { happiness: 4 }, money: -3000000, flags: ['du_le_tot_nghiep'],
        text: 'Cậu mặc áo cử nhân, chạy tới ôm tôi trước mặt bạn bè. Ba mẹ cậu từ bản xuống, mặc đồ truyền thống, nắm tay tôi không buông. Tôi đứng giữa hội trường, không biết để tay vào đâu.' },
      { label: 'Gửi hoa và lời chúc', effects: { happiness: 1 }, money: -500000,
        text: 'Cậu gửi ảnh cầm bó hoa của tôi, cười rạng rỡ. Cậu viết: “Con hiểu mà.” Tôi lưu tấm ảnh lại, rồi đặt làm hình nền điện thoại.' },
    ],
  },
  {
    id: 'ls-thu-moi-vang', ages: [40, 50], requiresAny: ['nuoi_meo_gia', 'nuoi_cho_mu'],
    title: 'Ngày cuối của bạn nhỏ',
    text: 'Con vật già tôi nhận nuôi năm nào giờ đã rất yếu, không ăn, không đi lại được. Bác sĩ thú y nói có thể để nó ra đi nhẹ nhàng, hoặc mang về nhà chăm tới cuối.',
    choices: [
      { label: 'Mang về nhà', effects: { happiness: -1 }, flags: ['tien_dua_thu_cung_o_nha'],
        text: 'Tôi lót ổ cạnh giường, đêm nào cũng thức dậy xem nó còn thở không. Một buổi sáng, nó không thở nữa, nằm quay mặt về phía tôi.' },
      { label: 'Để nó ra đi nhẹ nhàng', effects: { happiness: -1, intelligence: 1 },
        text: 'Tôi ôm nó trong lúc bác sĩ tiêm. Nó nhìn tôi, rồi nhắm mắt. Về nhà, cái ổ vẫn còn trong góc. Một tuần sau tôi mới dọn.' },
    ],
  },
];
