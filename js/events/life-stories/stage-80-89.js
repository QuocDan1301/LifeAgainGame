 
 
 
export const stage80To89 = [
   
  {
    id: 'ls80-tam-muoi-tuoi', age: 80,
    title: 'Tám mươi',
    text: 'Sáng sinh nhật tám mươi, tôi tỉnh dậy sớm, nằm nghe tiếng chim ngoài cửa sổ. Không có gì đau, không có gì vội. Tôi nghĩ tới việc hôm nay muốn làm gì, chỉ một việc thôi.',
    choices: [
      { label: 'Ra chợ, ăn một tô bún như hồi trẻ', effects: { happiness: 3 }, flags: ['bun_tam_muoi'],
        text: 'Tôi chống gậy ra chợ, ngồi ở quán bún quen. Bà chủ quán đã thay mấy đời, cô con dâu bây giờ múc cho tôi một tô đầy, không lấy tiền khi biết hôm nay sinh nhật.' },
      { label: 'Ngồi ở hiên cả buổi sáng', effects: { happiness: 2, health: 1 },
        text: 'Tôi pha ấm trà, ngồi ở hiên nhìn người qua lại. Có người chào, có người không. Nắng lên dần qua bậc thềm. Tám mươi năm, hóa ra một buổi sáng yên là đủ.' },
    ],
  },
  {
    id: 'ls80-mat-ban-lai-xe', age: 80,
    title: 'Hồ sơ y tế',
    text: 'Bác sĩ hỏi tôi có muốn ký giấy từ chối hồi sức cấp cứu nếu tim ngừng đập không. Ký thì nếu có chuyện, người ta sẽ để tôi đi nhẹ nhàng. Không ký thì sẽ có ép tim, máy móc, có khi gãy cả xương sườn.',
    choices: [
      { label: 'Ký', effects: { happiness: 1, intelligence: 1 }, flags: ['ky_tu_choi_hoi_suc'],
        text: 'Tôi ký, tay hơi run. Rồi gọi người thân, giải thích. Có người khóc, có người im lặng rất lâu, rồi nói hiểu. Tối đó tôi ngủ ngon.' },
      { label: 'Chưa ký, hỏi ý người thân', effects: { happiness: -1 },
        text: 'Tôi mang tờ giấy về, đặt trên bàn. Mọi người né tránh chuyện ấy. Tờ giấy nằm trên bàn cả tháng, có người lấy ly nước đè lên.' },
    ],
  },
  {
    id: 'ls80-nguoi-tre-gap', age: 80,
    title: 'Câu hỏi của người phỏng vấn',
    text: 'Một nhóm sinh viên làm phim tài liệu về người tám mươi tuổi. Họ hỏi tôi: “Nếu được quay lại một năm trong đời, bác muốn quay lại năm nào?” Máy quay đang chạy.',
    choices: [
      { label: 'Kể về năm thơ ấu', effects: { happiness: 2 },
        text: 'Tôi kể về năm mình bốn, năm tuổi, khi mọi người lớn trong nhà đều còn. Kể tới đâu, nhớ tới đó, rõ tới mức ngửi thấy mùi bếp củi. Sinh viên quên cả hỏi câu tiếp theo.' },
      { label: 'Nói: “Không muốn quay lại năm nào”', effects: { happiness: 2, intelligence: 1 }, flags: ['khong_quay_lai'],
        text: 'Tôi nói năm nào cũng có cái đáng giữ, có cái muốn quên, quay lại năm nào cũng phải sống lại cả hai. Sinh viên im lặng, rồi tắt máy, nói: “Câu này để cuối phim.”' },
    ],
  },
  {
    id: 'ls80-ban-doi-tam-muoi', age: 80, needs: ['partner'],
    title: 'Hai người tám mươi',
    text: 'Hai đứa cùng ngoài tám mươi, mỗi người một bệnh. Sáng nay {tenBanDoi} nói muốn đi chụp ảnh ở tiệm ảnh cũ, nơi hai đứa chụp tấm đầu tiên. Tiệm ảnh giờ đã đóng cửa, chỉ còn cái biển cũ.',
    choices: [
      { label: 'Đi, chụp trước cái biển cũ', effects: { happiness: 4 }, flags: ['anh_truoc_tiem_cu'],
        text: 'Đứa cháu chở hai đứa tới, chụp một tấm trước cái biển hoen gỉ. {tenBanDoi} đứng thẳng, chỉnh lại áo cho tôi như sáu mươi năm trước. Tấm ảnh in ra, đặt cạnh tấm đầu tiên.' },
      { label: 'Gọi thợ ảnh tới nhà', effects: { happiness: 2 },
        text: 'Thợ ảnh tới, dựng đèn trong phòng khách. Hai đứa ngồi trên chiếc ghế cũ, tay trong tay. {tenBanDoi} nói: “Chỗ nào có hai đứa thì chỗ đó là tiệm ảnh.”' },
    ],
  },
  {
    id: 'ls80-mot-minh-tam-muoi', age: 80, needs: ['single'],
    title: 'Những cái tên trong sổ',
    text: 'Cuốn sổ danh bạ của tôi giờ có nhiều tên đã gạch hơn tên còn lại. Tối nay tôi giở ra, đếm. Còn chín người. Tôi nghĩ có nên gọi cho cả chín, nói một điều gì đó.',
    choices: [
      { label: 'Gọi cho cả chín người', effects: { happiness: 3 }, flags: ['goi_chin_nguoi'],
        text: 'Mất ba buổi tối. Có người không nghe rõ, có người khóc, có người kể chuyện tới khuya. Cuộc gọi cuối, người ấy nói: “Lâu lắm rồi mới có người gọi chỉ để hỏi thăm.”' },
      { label: 'Gọi một người thân nhất', effects: { happiness: 2 },
        text: 'Tôi gọi người bạn thân nhất còn lại. Hai người nói chuyện hai tiếng, về những người đã gạch tên trong sổ. Lúc cúp máy, cả hai cùng nói: “Mai gọi tiếp.”' },
    ],
  },

   
  {
    id: 'ls81-an-kem', age: 81,
    title: 'Cây kem cuối hè',
    text: 'Bác sĩ dặn bớt đồ ngọt vì đường huyết. Chiều nay xe kem đi ngang, rung chuông như hồi tôi còn nhỏ. Đứa trẻ nhà bên đứng chờ mua, nhìn sang tôi.',
    choices: [
      { label: 'Mua hai cây, một cho đứa trẻ', effects: { happiness: 3 }, flags: ['kem_voi_tre'],
        text: 'Hai người ngồi ở bậc thềm ăn kem. Đứa trẻ ăn nhanh, tôi ăn chậm. Kem chảy xuống tay, nó cười tôi, tôi cười theo. Tối đó đo đường huyết hơi cao, tôi không hối hận.' },
      { label: 'Mua cho đứa trẻ, mình thì thôi', effects: { health: 1, happiness: 1 },
        text: 'Đứa trẻ cầm cây kem, cảm ơn, ngồi xuống cạnh tôi ăn. Tôi nhìn nó ăn, nhớ vị kem kéo ở cổng chợ năm bảy tuổi. Ngọt y như vậy.' },
    ],
  },
  {
    id: 'ls81-chuyen-nha-cuoi', age: 81,
    title: 'Căn phòng ở tầng trệt',
    text: 'Leo cầu thang giờ quá sức. Người thân muốn chuyển giường tôi xuống căn phòng nhỏ ở tầng trệt, gần bếp. Căn phòng trên lầu có cửa sổ nhìn ra cây bàng, nơi tôi ngủ suốt bốn mươi năm.',
    choices: [
      { label: 'Chuyển xuống tầng trệt', effects: { health: 2, happiness: -1 }, flags: ['xuong_tang_tret'],
        text: 'Phòng mới ồn hơn, nghe tiếng xoong nồi mỗi sáng. Tôi nhờ người treo tấm ảnh cây bàng lên tường. Một tháng sau, tôi quen tiếng xoong nồi, thấy như có người bên cạnh.' },
      { label: 'Ở lại, nhờ người đỡ lên xuống', effects: { happiness: 1, health: -1 },
        text: 'Tôi ít xuống nhà hơn, ăn cơm trên phòng. Sáng nào cũng ngồi bên cửa sổ, nhìn cây bàng thay lá. Người thân lên thăm thường hơn, ngồi lại lâu hơn.' },
    ],
  },
  {
    id: 'ls81-nguoi-quen-cu-lua', age: 81,
    title: 'Người bán hàng tận nhà',
    text: 'Một người bán hàng tới tận nhà, giới thiệu máy lọc nước giá cao gấp ba ngoài tiệm, nói chuyện rất ngọt, gọi tôi là cô chú, ông bà như người nhà. Người ấy ngồi đã hai tiếng, chưa chịu về.',
    choices: [
      { label: 'Nói thẳng là không mua, mời về', effects: { intelligence: 1 },
        text: 'Người ấy đổi sắc mặt, đứng dậy đi, không chào. Tôi khóa cửa, ngồi thở. Tối đó tôi gọi cho người thân, kể lại. Họ khen tôi tỉnh táo hơn họ tưởng.' },
      { label: 'Nói để hỏi ý người thân', effects: { intelligence: 1, happiness: 1 },
        text: 'Người ấy để lại danh thiếp, hẹn mai quay lại. Đứa cháu tới, đọc giấy tờ, lắc đầu. Hôm sau người ấy quay lại, gặp đứa cháu ở cửa, rồi không quay lại nữa.' },
    ],
  },
  {
    id: 'ls81-ban-doi-nho-sai', age: 81, needs: ['partner'],
    title: 'Hai trí nhớ',
    text: 'Hai đứa cãi nhau về một chuyện năm bốn mươi tuổi: ai là người quên ngày giỗ. {tenBanDoi} nhớ một kiểu, tôi nhớ một kiểu. Không còn ai khác để hỏi. {tenBanDoi} giận, quay mặt vào tường.',
    choices: [
      { label: 'Nhận là mình nhớ sai', effects: { happiness: 2 }, flags: ['nhuong_tri_nho'],
        text: '{tenBanDoi} quay lại, nhìn tôi, rồi bật cười: “Thật ra mình cũng không chắc.” Hai đứa ngồi cười tới chảy nước mắt về một ngày giỗ bốn mươi năm trước.' },
      { label: 'Để yên một lúc', effects: { happiness: 1 },
        text: 'Tôi đi pha hai ly trà, đặt một ly trên bàn cạnh giường. Một lúc sau, {tenBanDoi} quay lại uống. Không ai nhắc chuyện ngày giỗ nữa.' },
    ],
  },
  {
    id: 'ls81-mot-minh-tre-hang-xom', age: 81, needs: ['single'],
    title: 'Đứa trẻ đọc sách',
    text: 'Đứa trẻ nhà bên mỗi chiều sang đọc sách cho tôi nghe, vì mắt tôi kém. Nó đọc vấp, đọc sai, đôi khi bỏ dòng. Mẹ nó nói nếu phiền thì để nó ở nhà.',
    choices: [
      { label: 'Xin mẹ nó cho sang tiếp', effects: { happiness: 3 }, flags: ['tre_doc_sach'],
        text: 'Ba tháng sau, nó đọc trơn tru, ngắt câu đúng chỗ. Cô giáo khen nó đọc hay nhất lớp. Nó chạy sang khoe, nói nhờ đọc cho tôi nghe mỗi ngày.' },
      { label: 'Nghe sách nói cho mẹ nó yên tâm', effects: { intelligence: 1 },
        text: 'Tôi nói có sách nói rồi, cháu khỏi sang. Đứa trẻ buồn mấy hôm. Chiều nào nó cũng ngồi ở hiên nhà nó, nhìn sang nhà tôi.' },
    ],
  },

   
  {
    id: 'ls82-giac-mo', age: 82,
    title: 'Giấc mơ về nhà cũ',
    text: 'Đêm qua tôi mơ về căn nhà thời thơ ấu, nghe rõ tiếng người gọi tên mình ăn cơm. Tỉnh dậy, tôi nằm rất lâu, muốn kể với ai đó. Trời mới bốn giờ sáng.',
    choices: [
      { label: 'Viết lại giấc mơ', effects: { happiness: 2 }, flags: ['viet_giac_mo'],
        text: 'Tôi bật đèn, viết lại từng chi tiết: cái bàn gỗ, tiếng gọi, mùi canh. Viết xong, trời sáng. Tôi đọc lại, thấy như vừa về thăm nhà.' },
      { label: 'Nằm nhắm mắt, mơ tiếp', effects: { happiness: 1, health: 1 },
        text: 'Tôi nhắm mắt, cố quay lại giấc mơ. Không được. Nhưng tôi nằm nghĩ về căn nhà, từng góc một, cho tới khi ngủ lại. Sáng ra, thấy lòng nhẹ.' },
    ],
  },
  {
    id: 'ls82-tien-con-lai', age: 82,
    title: 'Khoản tiền cuối',
    text: 'Tôi còn một khoản tiền tiết kiệm. Người thân không thiếu thốn. Tôi muốn dùng nó cho một việc gì đó ý nghĩa, trong lúc mình còn tự quyết được.',
    choices: [
      { label: 'Góp xây thư viện cho trường làng', effects: { happiness: 4 }, money: -50000000, flags: ['thu_vien_truong_lang'],
        text: 'Thư viện nhỏ, có mấy trăm cuốn sách. Ngày khánh thành, tôi ngồi hàng ghế đầu, nhìn tụi nhỏ ùa vào. Một đứa ngồi bệt xuống sàn, mở cuốn đầu tiên nó vớ được.' },
      { label: 'Tặng mỗi đứa cháu một ít', effects: { happiness: 2 }, money: -50000000,
        text: 'Mỗi đứa cháu một phong bì, kèm một lá thư tay. Có đứa dùng đóng học phí, có đứa mua sách, có đứa cất phong bì không mở, nói giữ chữ của tôi.' },
    ],
  },
  {
    id: 'ls82-nguoi-cham-soc-moi', age: 82,
    title: 'Người chăm sóc trẻ',
    text: 'Người chăm sóc mới là một cô gái hai mươi tuổi, vụng về, làm đổ cháo, quên giờ thuốc. Người thân muốn đổi người khác có kinh nghiệm hơn. Cô gái nói nhà cô nghèo, cần việc này.',
    choices: [
      { label: 'Giữ cô lại, kiên nhẫn chỉ', effects: { happiness: 2 }, flags: ['day_nguoi_cham_soc'],
        text: 'Tôi chỉ cô từng việc, như dạy một đứa cháu. Ba tháng sau cô làm thành thạo. Một năm sau, cô đi học điều dưỡng, vẫn ghé thăm tôi mỗi cuối tuần.' },
      { label: 'Đổi người, giới thiệu cô chỗ khác', effects: { health: 1 },
        text: 'Người mới làm chu đáo. Tôi nhờ người thân giới thiệu cô gái tới một quán ăn quen. Cô tới chào tôi lần cuối, cúi đầu cảm ơn, mắt đỏ.' },
    ],
  },
  {
    id: 'ls82-ban-doi-hat', age: 82, needs: ['partner'],
    title: 'Bài hát cũ',
    text: 'Radio phát một bài hát cũ, bài hai đứa nghe ngày mới quen. {tenBanDoi} đang ngồi lặt rau, ngừng tay, ngẩng lên nhìn tôi. Chân tôi yếu, đứng lâu không được.',
    choices: [
      { label: 'Đứng dậy, mời {tenBanDoi} nhảy', effects: { happiness: 4, health: -1 }, flags: ['nhay_bai_cu'],
        text: 'Hai đứa nắm tay nhau, lắc lư giữa bếp, chậm hơn nhịp nhạc rất nhiều. Bài hát hết, hai đứa vẫn đứng đó. {tenBanDoi} tựa đầu vào vai tôi, thở hơi gấp, cười.' },
      { label: 'Ngồi xuống cạnh, hát theo', effects: { happiness: 3 },
        text: 'Tôi ngồi xuống cạnh rổ rau, hát theo, quên lời ở đoạn giữa. {tenBanDoi} hát tiếp đoạn ấy, rồi cũng quên. Hai đứa ngồi ậm ừ theo giai điệu tới hết bài.' },
    ],
  },
  {
    id: 'ls82-mot-minh-ban-cung-tuoi', age: 82, needs: ['single'],
    title: 'Người bạn ở viện',
    text: 'Người bạn cuối cùng cùng tuổi tôi vào viện, gọi điện nói muốn gặp, nhưng đường xa, tôi không đi xe được lâu. Người bạn nói: “Không gặp được thì thôi, nghe giọng là được rồi.”',
    choices: [
      { label: 'Nhờ người chở đi, dù mệt', effects: { happiness: 3, health: -2 }, flags: ['tham_ban_cuoi_cung'],
        text: 'Ba tiếng trên xe. Tới nơi, hai người già ngồi nhìn nhau, cười, không nói được nhiều. Lúc về, bạn nắm tay tôi: “Cảm ơn đã tới.” Đó là lần cuối.' },
      { label: 'Gọi video mỗi ngày', effects: { happiness: 2 },
        text: 'Mỗi chiều, đứa cháu giúp tôi gọi video. Hai người nhìn nhau qua màn hình, nói vài câu, rồi ngồi im. Một chiều, bên kia không ai nghe máy nữa.' },
    ],
  },

   
  {
    id: 'ls83-quen-ten-nguoi', age: 83,
    title: 'Khuôn mặt quen',
    text: 'Một người tới thăm, ôm tôi, gọi tôi rất thân thiết. Tôi biết mình quen người này, nhưng không nhớ tên, không nhớ là ai. Người ấy đang kể chuyện rất vui, chờ tôi đáp lại.',
    choices: [
      { label: 'Nói thật là không nhớ', effects: { happiness: 1 }, flags: ['noi_khong_nho'],
        text: 'Người ấy khựng lại, rồi nắm tay tôi, tự giới thiệu, kể lại hai người quen nhau thế nào. Nghe xong, tôi nhớ ra một phần. Hai người cười, ngồi tới chiều.' },
      { label: 'Cười, đáp theo câu chuyện', effects: { happiness: 2 },
        text: 'Tôi gật đầu, cười, đáp những câu chung chung. Người ấy vui vẻ ra về. Tối đó, đứa cháu nói đó là người bạn cùng lớp cấp ba. Tôi nhớ ra, gọi điện, xin lỗi.' },
    ],
  },
  {
    id: 'ls83-mua-xuan', age: 83,
    title: 'Hạt giống',
    text: 'Mùa xuân, đứa cháu mang cho tôi một gói hạt giống, nói trồng cây gì cũng được. Tôi nghĩ tới việc trồng một cây mà mình sẽ không thấy nó lớn. Hay trồng một bụi hoa, vài tháng là nở.',
    choices: [
      { label: 'Trồng một cây ăn trái', effects: { happiness: 3 }, flags: ['trong_cay_cho_doi_sau'],
        text: 'Tôi trồng một cây bưởi con ở góc sân, dặn đứa cháu tưới. Sáng nào tôi cũng ngồi nhìn nó. Nó lớn chậm. Tôi nói với nó: “Mày cứ lớn đi, không cần vội.”' },
      { label: 'Trồng một bụi hoa', effects: { happiness: 2 },
        text: 'Ba tháng sau bụi hoa nở đỏ rực. Ngày nào tôi cũng ngồi bên cửa sổ nhìn. Hoa tàn, đứa cháu gieo hạt mới. Mùa sau lại nở.' },
    ],
  },
  {
    id: 'ls83-tham-nghia-trang', age: 83,
    title: 'Thăm những người đã đi',
    text: 'Thanh minh, người thân đưa tôi đi tảo mộ. Tôi ngồi xe lăn giữa nghĩa trang, đọc những cái tên quen: ba, mẹ, người thân, bạn bè. Còn một chỗ trống mà tôi biết là của ai.',
    choices: [
      { label: 'Nói chuyện với từng ngôi mộ', effects: { happiness: 2 }, flags: ['noi_chuyen_voi_mo'],
        text: 'Tôi nhờ đẩy xe tới từng ngôi mộ, nói vài câu: kể chuyện người thân, chuyện thời tiết, chuyện giá rau. Người thân đứng chờ, không ai giục. Về nhà, tôi ngủ một giấc rất sâu.' },
      { label: 'Nhìn chỗ trống, mỉm cười', effects: { happiness: 1, intelligence: 1 },
        text: 'Tôi nhìn chỗ trống rất lâu, rồi nói đùa với đứa cháu: “Chỗ đẹp đấy, nhìn ra cánh đồng.” Đứa cháu không cười. Tôi thì thấy lòng yên.' },
    ],
  },
  {
    id: 'ls83-ban-doi-di-truoc-mot-buoc', age: 83, needs: ['partner'],
    title: 'Ngủ cùng giờ',
    text: 'Sức khỏe {tenBanDoi} yếu hơn tôi nhiều. Tối nay {tenBanDoi} nói: “Mình ngủ trước nha, mình thức thêm chút nữa thì ngủ.” Tôi đang xem dở một chương trình tivi.',
    choices: [
      { label: 'Tắt tivi, nằm xuống cùng', effects: { happiness: 3 }, flags: ['ngu_cung_gio'],
        text: 'Tôi tắt tivi, nằm xuống cạnh {tenBanDoi}. Hai đứa nắm tay nhau như mấy chục năm qua. {tenBanDoi} ngủ trước, thở đều. Tôi nằm nghe, rồi ngủ theo.' },
      { label: 'Xem nốt, rồi vào sau', effects: { happiness: 1 },
        text: 'Xem xong, tôi vào phòng, {tenBanDoi} đã ngủ, một tay để ra ngoài chăn như chờ ai nắm. Tôi nắm lấy bàn tay ấy, nằm xuống.' },
    ],
  },
  {
    id: 'ls83-mot-minh-cho-lai-do', age: 83, needs: ['single'],
    title: 'Chiếc hộp kỷ niệm',
    text: 'Tôi có một chiếc hộp đựng những thứ nhỏ nhặt cả đời: vé xem phim cũ, chiếc cúc áo, mẩu giấy nhắn. Không ai biết ý nghĩa của chúng ngoài tôi. Sau này, chiếc hộp sẽ bị bỏ đi.',
    choices: [
      { label: 'Ghi chú cho từng món', effects: { happiness: 3 }, flags: ['ghi_chu_hop_ky_niem'],
        text: 'Tôi ghi chú cho từng món, mất cả tháng. Vé xem phim: “Lần đầu đi xem phim một mình, năm 30 tuổi.” Chiếc cúc áo: “Của người ấy, rơi lại.” Chiếc hộp giờ thành một cuốn truyện ngắn.' },
      { label: 'Để nguyên, không cần ai hiểu', effects: { happiness: 1 },
        text: 'Tôi mở hộp, nhìn từng món, rồi đóng lại. Những thứ này là của tôi. Có những câu chuyện không cần ai khác biết, cũng vẫn là câu chuyện.' },
    ],
  },

   
  {
    id: 'ls84-an-com-cung-con-chau', age: 84,
    title: 'Mâm cơm đông người',
    text: 'Người thân về đông, nói chuyện ồn ào, tôi nghe không rõ, theo không kịp. Có người hỏi gì, tôi gật đầu cho qua. Ngồi giữa mâm cơm đông người mà thấy mình ở rất xa.',
    choices: [
      { label: 'Nhờ đứa cháu ngồi cạnh kể lại', effects: { happiness: 2 }, flags: ['chau_ke_lai'],
        text: 'Đứa cháu ngồi sát bên, nói nhỏ vào tai tôi từng chuyện. Tôi cười đúng lúc, hỏi đúng chỗ. Cả mâm cơm quay sang ngạc nhiên. Tôi lại thấy mình ở giữa mọi người.' },
      { label: 'Ăn xong, ra hiên ngồi', effects: { happiness: 1 },
        text: 'Tôi ra hiên, ngồi nghe tiếng cười trong nhà vọng ra. Một lúc sau, đứa cháu nhỏ chạy ra, leo lên ghế ngồi cạnh tôi. Hai người không nói gì, nhìn ra đường.' },
    ],
  },
  {
    id: 'ls84-thu-tay-cho-chat', age: 84,
    title: 'Lá thư cho người chưa biết đọc',
    text: 'Đứa cháu nhỏ mới sinh. Tôi biết mình khó sống tới ngày nó lớn để kể chuyện cho nó nghe. Tôi muốn viết cho nó một lá thư, để mười tám tuổi nó mở. Tay run, chữ khó đọc.',
    choices: [
      { label: 'Tự tay viết, dù xấu', effects: { happiness: 3 }, flags: ['thu_cho_chat'],
        text: 'Tôi viết ba ngày, mỗi ngày một đoạn. Chữ run, nghiêng ngả. Lá thư được niêm phong, ghi: “Mở năm mười tám tuổi.” Tôi không viết gì to tát, chỉ kể về một buổi chiều thả diều.' },
      { label: 'Ghi âm giọng nói', effects: { happiness: 2 },
        text: 'Đứa cháu giúp tôi ghi âm. Tôi nói chậm, kể chuyện đời mình, dặn đứa cháu nhỏ vài điều. Tệp ghi âm được lưu lại, đặt tên theo ngày sinh của nó.' },
    ],
  },
  {
    id: 'ls84-hang-xom-qua-doi', age: 84,
    title: 'Hàng xóm sáu mươi năm',
    text: 'Bà cụ hàng xóm sáu mươi năm vừa mất. Người nhà bà nhờ tôi nói vài lời trong lễ tang, vì tôi là người biết bà lâu nhất còn sống. Tôi không chắc mình đủ sức đứng lâu, giọng còn nghe được không.',
    choices: [
      { label: 'Nói vài lời', effects: { happiness: 2, health: -1 }, flags: ['dieu_van_hang_xom'],
        text: 'Tôi ngồi xe lăn, nói chậm, kể chuyện hai nhà qua lại sáu mươi năm: bát canh, nồi cơm, những đêm bão. Nói xong, người nhà bà ôm tôi khóc. Tôi về, nằm cả ngày.' },
      { label: 'Viết ra, nhờ người đọc thay', effects: { happiness: 1 },
        text: 'Tôi viết một trang, nhờ đứa cháu đọc. Giọng nó trẻ, đọc rất rõ. Tôi ngồi nghe chuyện của chính mình, thấy như nghe chuyện hai người hàng xóm nào đó, rất xa.' },
    ],
  },
  {
    id: 'ls84-ban-doi-yeu', age: 84, needs: ['partner'],
    title: 'Bữa cháo',
    text: '{tenBanDoi} ăn ngày càng ít, chỉ húp được vài muỗng cháo. Người chăm sóc nói nên ép ăn thêm, hoặc dùng sữa bột. {tenBanDoi} lắc đầu, nói không muốn bị ép.',
    choices: [
      { label: 'Nấu món {tenBanDoi} thích ngày xưa', effects: { happiness: 3 }, flags: ['nau_mon_xua'],
        text: 'Tôi nhờ đứa cháu chở ra chợ, mua đúng loại cá ngày xưa {tenBanDoi} thích. Nấu chậm, nêm như ngày xưa. {tenBanDoi} ăn được nửa chén, nói: “Đúng vị rồi.”' },
      { label: 'Tôn trọng, không ép', effects: { happiness: 1 },
        text: 'Tôi ngồi cạnh, đút từng muỗng, ăn được bao nhiêu thì thôi. {tenBanDoi} nắm tay tôi, cảm ơn vì không ép. Hai đứa ngồi bên nhau, không cần nói gì.' },
    ],
  },
  {
    id: 'ls84-mot-minh-nguoi-gui-thu', age: 84, needs: ['single'],
    title: 'Lá thư không ký tên',
    text: 'Mỗi dịp Tết, tôi nhận một tấm thiệp không ký tên, chỉ viết: “Cảm ơn vì năm ấy.” Đã mười năm nay. Tôi không biết người gửi là ai, cũng không nhớ năm ấy là năm nào.',
    choices: [
      { label: 'Nhờ đứa cháu tìm người gửi', effects: { happiness: 2 }, flags: ['tim_nguoi_gui_thiep'],
        text: 'Đứa cháu lần theo dấu bưu điện, tìm ra một người phụ nữ ngoài năm mươi. Bà kể năm xưa, trên một chuyến xe đêm, tôi đã chỉ bà cách lo giấy tờ cho người chồng vừa mất. Tôi không nhớ chuyện ấy. Bà thì nhớ từng câu.' },
      { label: 'Để là một điều bí ẩn', effects: { happiness: 2 },
        text: 'Tôi xếp mười tấm thiệp thành một chồng. Mỗi Tết lại thêm một tấm. Tôi nghĩ ở đâu đó, có một người vẫn nhớ tới mình, vậy là đủ.' },
    ],
  },

   
  {
    id: 'ls85-dem-dai', age: 85,
    title: 'Đêm dài',
    text: 'Đêm nào tôi cũng tỉnh giấc lúc hai, ba giờ sáng, nằm nghe tiếng đồng hồ. Người thân đề nghị lắp loa trong phòng, mở nhạc nhẹ, hoặc để đèn ngủ. Tôi quen bóng tối.',
    choices: [
      { label: 'Nghe nhạc những đêm mất ngủ', effects: { happiness: 2 }, flags: ['nhac_dem'],
        text: 'Đứa cháu cài sẵn những bài hát cũ. Đêm tỉnh giấc, tôi bấm một nút, nghe lại những bài hát năm hai mươi tuổi. Có đêm hát theo, khe khẽ, trong bóng tối.' },
      { label: 'Nằm nghĩ chuyện cũ', effects: { happiness: 1, intelligence: 1 },
        text: 'Tôi nằm, nhớ lại một ngày nào đó trong đời, từ sáng tới tối, chi tiết từng chút. Mỗi đêm một ngày. Có những ngày nhớ ra, ngạc nhiên vì mình đã quên chúng lâu như vậy.' },
    ],
  },
  {
    id: 'ls85-nguoi-tinh-nguyen', age: 85,
    title: 'Cậu sinh viên tình nguyện',
    text: 'Một cậu sinh viên tình nguyện tới trò chuyện với người già mỗi tuần. Cậu hỏi tôi một câu: “Bác thấy điều gì quan trọng nhất trong đời?” Cậu cầm sổ, chờ ghi lại.',
    choices: [
      { label: 'Trả lời một câu ngắn', effects: { happiness: 2 }, flags: ['dieu_quan_trong_nhat'],
        text: 'Tôi nghĩ một lúc, nói: “Có người để gọi điện khi có chuyện vui.” Cậu ghi lại, rồi ngẩng lên hỏi tôi có ai để gọi không. Tôi nói có, rồi nhận ra mình phải nghĩ một chút mới trả lời được.' },
      { label: 'Hỏi ngược lại cậu', effects: { happiness: 2, intelligence: 1 },
        text: 'Cậu bối rối, rồi kể về những lo lắng của tuổi hai mươi: học hành, việc làm, một người cậu thích. Tôi nghe hết. Lúc về, cậu nói: “Hôm nay bác hỏi cháu nhiều hơn cháu hỏi bác.”' },
    ],
  },
  {
    id: 'ls85-cho-di-do', age: 85,
    title: 'Tủ quần áo',
    text: 'Tủ quần áo của tôi đầy những bộ đồ đã nhiều năm không mặc, có bộ mặc đi đám cưới con, có bộ mặc ngày nhận bằng. Người thân muốn dọn bớt, mang cho từ thiện.',
    choices: [
      { label: 'Giữ một bộ, cho hết phần còn lại', effects: { happiness: 2 }, flags: ['giu_mot_bo_do'],
        text: 'Tôi giữ lại bộ đồ đẹp nhất, nói để mặc ngày cuối. Người thân im lặng. Những bộ còn lại được gửi đi, có bộ tới tay một ông cụ ở vùng xa, mặc đi ăn cưới cháu.' },
      { label: 'Kể chuyện từng bộ trước khi cho', effects: { happiness: 3 },
        text: 'Mỗi bộ đồ, tôi kể một câu chuyện. Đứa cháu ngồi nghe, cười, có lúc khóc. Nó xin giữ lại chiếc áo len cũ, nói sẽ mặc mỗi mùa đông.' },
    ],
  },
  {
    id: 'ls85-ban-doi-nhin-anh', age: 85, needs: ['partner'],
    title: 'Album cũ',
    text: '{tenBanDoi} muốn lật lại album ảnh từ đầu tới cuối, mỗi tối vài trang. Có những tấm ảnh hai đứa cãi nhau trước khi chụp, có những tấm có người đã mất. Lật hết chắc mất cả tháng.',
    choices: [
      { label: 'Mỗi tối lật cùng nhau', effects: { happiness: 4 }, flags: ['lat_album_cung'],
        text: 'Mỗi tối vài trang, kể lại chuyện của từng tấm. Có tấm hai đứa nhớ khác nhau, cãi nhau như ngày xưa. Hết album, {tenBanDoi} nói: “Đời mình dày ghê.”' },
      { label: 'Nhờ đứa cháu số hóa, xem trên tivi', effects: { happiness: 2 },
        text: 'Đứa cháu chụp lại từng tấm, chiếu lên tivi to. Hai đứa ngồi xem như xem phim. {tenBanDoi} chỉ vào từng khuôn mặt, gọi tên, có tên gọi đúng, có tên gọi nhầm.' },
    ],
  },
  {
    id: 'ls85-mot-minh-cuoi-tuan', age: 85, needs: ['single'],
    title: 'Ngày chủ nhật',
    text: 'Chủ nhật, người chăm sóc nghỉ, người thân bận. Tôi ở nhà một mình cả ngày. Người hàng xóm trẻ nhắn tin hỏi có muốn sang nhà họ ăn trưa không, nhà họ có ba đứa nhỏ, rất ồn.',
    choices: [
      { label: 'Sang ăn trưa', effects: { happiness: 3 }, flags: ['trua_chu_nhat_hang_xom'],
        text: 'Ba đứa nhỏ ngồi quanh tôi, hỏi đủ thứ chuyện, giành nhau gắp thức ăn cho tôi. Ồn ào, mệt. Về nhà, tôi ngủ trưa một giấc rất ngon, mơ thấy tiếng trẻ con.' },
      { label: 'Cảm ơn, ở nhà', effects: { happiness: 1 },
        text: 'Tôi ở nhà, nấu một nồi cháo, ngồi ăn trước hiên. Nghe tiếng ba đứa nhỏ nhà bên chơi đùa. Một đứa chạy sang, đưa qua hàng rào một cái bánh.' },
    ],
  },

   
  {
    id: 'ls86-te-nga-dem', age: 86,
    title: 'Chiếc nút báo động',
    text: 'Người thân đeo cho tôi một chiếc vòng có nút báo động, bấm vào là có người tới. Tôi thấy mình như đứa trẻ bị theo dõi. Đêm qua tôi suýt ngã khi đi vệ sinh, không bấm, tự vịn tường đứng dậy.',
    choices: [
      { label: 'Đeo vòng, hứa sẽ bấm', effects: { health: 2 }, flags: ['deo_vong_bao_dong'],
        text: 'Tôi đeo vòng cả ngày lẫn đêm. Một tháng sau, tôi ngã thật, bấm nút. Mười phút sau có người tới. Nằm trên sàn chờ, tôi nghĩ may mà mình đã đeo.' },
      { label: 'Kể chuyện đêm qua với người thân', effects: { happiness: 1, intelligence: 1 },
        text: 'Người thân nghe, im lặng, rồi lắp thêm đèn cảm ứng dọc lối đi. Họ không ép tôi đeo vòng, chỉ nói: “Ngã thì bấm, đừng ngại.” Tôi gật đầu.' },
    ],
  },
  {
    id: 'ls86-co-giao-cu', age: 86,
    title: 'Người học trò',
    text: 'Một người đàn ông tóc bạc tới thăm, nói là đứa trẻ tôi từng kèm bài Toán lớp năm, ba mươi năm trước. Giờ ông ấy là kỹ sư, sắp nghỉ hưu. Ông ấy hỏi tôi còn nhớ ông không.',
    choices: [
      { label: 'Nói thật là không nhớ', effects: { happiness: 2 },
        text: 'Ông ấy cười, kể về những buổi chiều ngồi ở bậc thềm nhà tôi, về bài toán chia phân số. Nghe kể, tôi nhớ ra một khuôn mặt nhỏ. Ông ấy ngồi tới tối mới về.' },
      { label: 'Nói: “Nhớ chứ”', effects: { happiness: 2 }, flags: ['nhan_hoc_tro_cu'],
        text: 'Tôi nói nhớ, dù không chắc. Ông ấy mừng rỡ, kể chuyện đời mình. Nghe ông kể, tôi dần nhớ ra thật. Lúc về, ông cúi chào rất thấp, như hồi bé.' },
    ],
  },
  {
    id: 'ls86-qua-tang-cuoi', age: 86,
    title: 'Món quà sinh nhật',
    text: 'Đứa cháu hỏi tôi muốn quà sinh nhật gì. Tôi không cần gì nữa. Nhưng nó nói nhất định phải có một điều tôi muốn. Tôi nghĩ mãi, rồi nhớ ra một điều đã muốn từ rất lâu.',
    choices: [
      { label: 'Muốn đi ra biển một lần nữa', effects: { happiness: 4, health: -1 }, flags: ['bien_lan_cuoi'],
        text: 'Đứa cháu thuê xe, đẩy xe lăn của tôi ra tới mép nước. Sóng chạm vào chân, lạnh buốt. Tôi ngồi đó tới hoàng hôn, nghe tiếng sóng như nghe ai đó gọi tên mình.' },
      { label: 'Muốn nghe cháu kể chuyện của nó', effects: { happiness: 3 },
        text: 'Đứa cháu ngạc nhiên, rồi ngồi xuống kể: chuyện công việc, chuyện người yêu, chuyện những lo lắng. Kể tới khuya. Tôi nghe hết, thấy như được nhận một món quà rất lớn.' },
    ],
  },
  {
    id: 'ls86-ban-doi-noi-loi-cuoi', age: 86, needs: ['partner'],
    title: 'Điều chưa nói',
    text: 'Tối nay {tenBanDoi} tỉnh táo hơn mọi hôm, hỏi tôi: “Có điều gì mình chưa từng nói với nhau không?” Tôi nghĩ tới một chuyện cũ, một lần tôi đã suýt rời đi, nhiều năm trước.',
    choices: [
      { label: 'Kể', effects: { happiness: 2 }, flags: ['ke_dieu_chua_noi'],
        text: '{tenBanDoi} nghe, im lặng rất lâu, rồi nói: “Mình biết. Mình chờ mình ở lại.” Hai đứa nắm tay nhau, không ai khóc. Đêm đó ngủ rất yên.' },
      { label: 'Nói: “Không có gì cả”', effects: { happiness: 1 },
        text: '{tenBanDoi} cười, nói: “Vậy là mình nói hết rồi.” Tôi nằm nghe tiếng thở của {tenBanDoi}, giữ câu chuyện ấy lại cho riêng mình, như giữ một hòn sỏi trong túi.' },
    ],
  },
  {
    id: 'ls86-mot-minh-tho-cho-chinh-minh', age: 86, needs: ['single'],
    title: 'Bài thơ cuối',
    text: 'Câu lạc bộ thơ người già đề nghị tôi viết một bài thơ về chính đời mình, đọc trong buổi họp cuối năm. Tôi không biết bắt đầu từ đâu, tám mươi sáu năm không thể gói trong một bài thơ.',
    choices: [
      { label: 'Viết về một buổi chiều', effects: { happiness: 3 }, flags: ['tho_buoi_chieu'],
        text: 'Tôi viết về một buổi chiều năm bốn tuổi, ngồi ở bậc cửa nhìn sang nhà bên. Bài thơ ngắn, mười hai câu. Đọc xong, cả phòng im lặng. Một bà cụ nói: “Ai cũng có một buổi chiều như vậy.”' },
      { label: 'Viết danh sách những người đã thương', effects: { happiness: 2 },
        text: 'Bài thơ là một danh sách tên người, mỗi người một câu. Đọc lên mất mười phút. Có người trong phòng nghe thấy tên người quen của mình trong đó.' },
    ],
  },

   
  {
    id: 'ls87-ngoi-ben-cua-so', age: 87,
    title: 'Ô cửa sổ',
    text: 'Tôi ít ra khỏi giường. Người thân hỏi muốn kê giường hướng nào: nhìn ra cửa sổ có hàng cây và con đường, hay quay vào trong, gần tivi, gần mọi người qua lại trong nhà.',
    choices: [
      { label: 'Nhìn ra cửa sổ', effects: { happiness: 2 }, flags: ['giuong_canh_cua_so'],
        text: 'Mỗi ngày tôi nhìn những người đi qua: đứa trẻ đi học, bà bán rau, người đưa thư. Tôi biết giờ giấc của từng người. Một hôm người đưa thư vẫy tay với tôi.' },
      { label: 'Quay vào trong nhà', effects: { happiness: 2 },
        text: 'Giường gần phòng khách, tôi nghe người thân nói chuyện, nghe tiếng bát đũa, tiếng tivi. Có người đi ngang là ghé vào hỏi han. Tôi không thấy mình nằm một mình.' },
    ],
  },
  {
    id: 'ls87-dieu-tri', age: 87,
    title: 'Lần nhập viện nữa',
    text: 'Bác sĩ nói tôi phải nhập viện điều trị viêm phổi, có thể nằm hai tuần. Tôi mệt mỏi với bệnh viện. Ở nhà thì có thể điều trị bằng thuốc uống, rủi ro cao hơn, nhưng được nằm trên giường của mình.',
    choices: [
      { label: 'Nhập viện', effects: { health: 3, happiness: -1 }, flags: ['nhap_vien_87'],
        text: 'Hai tuần nằm viện, kim truyền, máy đo. Tôi khỏi bệnh, về nhà. Đêm đầu nằm lại trên giường của mình, tôi ngủ một giấc dài như chưa từng ngủ.' },
      { label: 'Điều trị ở nhà', effects: { health: 1, happiness: 2 },
        text: 'Y tá tới nhà mỗi ngày. Tôi uống thuốc, nằm nghe tiếng nhà mình. Bệnh khỏi chậm hơn, có đêm sốt cao. Nhưng sáng nào tỉnh dậy cũng thấy cái trần nhà quen.' },
    ],
  },
  {
    id: 'ls87-con-meo-ngoai-hien', age: 87,
    title: 'Con mèo ngoài hiên',
    text: 'Có một con mèo hoang hay nằm ngoài hiên nhà tôi mỗi chiều, phơi nắng. Tôi không còn đủ sức nuôi. Nhưng chiều nào nó cũng tới, ngồi nhìn vào trong nhà như chờ.',
    choices: [
      { label: 'Nhờ người để sẵn đồ ăn', effects: { happiness: 3 }, flags: ['meo_ngoai_hien'],
        text: 'Đứa cháu đặt một chén cơm ngoài hiên mỗi chiều. Con mèo ăn xong, nằm ngủ ở bậc cửa. Có chiều tôi ra hiên ngồi, nó leo lên lòng tôi, nặng và ấm.' },
      { label: 'Ngồi nhìn nó qua cửa', effects: { happiness: 1 },
        text: 'Chiều nào tôi cũng ngồi nhìn nó qua cửa kính. Hai bên nhìn nhau, không ai lại gần. Một chiều nó không tới, tôi chờ tới tối.' },
    ],
  },
  {
    id: 'ls87-ban-doi-ngu-nhieu', age: 87, needs: ['partner'],
    title: 'Giờ thức của {tenBanDoi}',
    text: '{tenBanDoi} ngủ gần như cả ngày, chỉ tỉnh táo được chừng một tiếng vào buổi trưa. Tôi muốn dành trọn tiếng ấy cho {tenBanDoi}, nhưng đó cũng là lúc người thân hay gọi điện, bác sĩ hay tới.',
    choices: [
      { label: 'Giữ trọn một tiếng ấy cho hai đứa', effects: { happiness: 3 }, flags: ['mot_tieng_buoi_trua'],
        text: 'Tôi dặn mọi người đừng gọi giờ ấy. Mỗi trưa, hai đứa ngồi cạnh nhau, có hôm nói chuyện, có hôm chỉ nhìn ra cửa sổ. Một tiếng ngắn mà như cả ngày.' },
      { label: 'Để mọi người cùng chia giờ ấy', effects: { happiness: 2 },
        text: 'Người thân gọi video đúng giờ {tenBanDoi} tỉnh. {tenBanDoi} cười với từng đứa trên màn hình. Tôi ngồi bên cạnh, nhìn {tenBanDoi} cười.' },
    ],
  },
  {
    id: 'ls87-mot-minh-chuyen-vien', age: 87, needs: ['single'],
    title: 'Những ngày ở viện dưỡng lão',
    text: 'Ở viện dưỡng lão, người bạn cùng phòng mới đến hay khóc đêm, nhớ nhà. Nhân viên hỏi tôi có muốn đổi phòng. Tôi nhớ đêm đầu tiên của mình ở đây cũng như vậy.',
    choices: [
      { label: 'Ở lại, nói chuyện với người ấy', effects: { happiness: 3 }, flags: ['an_ui_ban_cung_phong'],
        text: 'Đêm nào người ấy khóc, tôi kể chuyện đêm đầu của mình, rồi kể chuyện linh tinh tới khi người ấy ngủ. Một tháng sau, người ấy ngủ được. Sáng nào cũng chào tôi trước.' },
      { label: 'Đổi phòng', effects: { health: 1 },
        text: 'Phòng mới yên tĩnh. Tôi ngủ ngon hơn. Thỉnh thoảng đi ngang phòng cũ, nghe tiếng khóc nhỏ, tôi dừng lại một chút rồi đi tiếp.' },
    ],
  },

   
  {
    id: 'ls88-ban-tay', age: 88,
    title: 'Bàn tay',
    text: 'Tay tôi giờ run nhiều, không cầm đũa được, phải dùng thìa, có khi phải nhờ người đút. Hôm nay đứa cháu nhỏ muốn đút cơm cho tôi, nó mới năm tuổi, tay cầm thìa cũng chưa vững.',
    choices: [
      { label: 'Để đứa bé đút', effects: { happiness: 4 }, flags: ['chat_dut_com'],
        text: 'Nó đút một thìa, rơi nửa thìa xuống áo tôi. Nó nhăn mặt, xin lỗi, rồi đút tiếp. Cả nhà đứng nhìn, không ai giúp. Bữa cơm lâu nhất đời tôi, và ngon nhất.' },
      { label: 'Tự cầm thìa, cho đứa bé ngồi cạnh', effects: { happiness: 2 },
        text: 'Tôi tự ăn, run, rơi vãi. Đứa cháu nhỏ ngồi cạnh, cầm khăn lau giúp mỗi lần tôi làm rơi. Hai người ăn xong, cùng cười vì cái bàn bừa bộn.' },
    ],
  },
  {
    id: 'ls88-tieng-goi', age: 88,
    title: 'Tiếng gọi tên',
    text: 'Gần đây, có những buổi chiều tôi nghe như có ai gọi tên mình từ ngoài cổng, giọng rất quen, giọng của một người đã mất từ lâu. Nói ra, người thân sẽ lo. Không nói, tôi cứ ngồi chờ.',
    choices: [
      { label: 'Kể với người thân', effects: { happiness: 1 }, flags: ['nghe_tieng_goi'],
        text: 'Người thân đưa tôi đi khám. Bác sĩ nói không có gì đáng lo ở tuổi này. Đứa cháu ngồi với tôi những buổi chiều. Khi nghe tiếng gọi, tôi kể cho nó nghe về người ấy.' },
      { label: 'Giữ cho riêng mình', effects: { happiness: 2 },
        text: 'Chiều nào nghe tiếng gọi, tôi cũng đáp nhỏ trong lòng: “Chờ chút nữa.” Rồi tiếp tục ngồi nhìn hoàng hôn. Không thấy sợ.' },
    ],
  },
  {
    id: 'ls88-chuyen-cu-nho-lai', age: 88,
    title: 'Người tới xin lỗi',
    text: 'Một người phụ nữ ngoài sáu mươi tìm tới, nói là con của người từng lừa tiền tôi bốn mươi năm trước. Ba bà đã mất, dặn bà phải tìm tôi, trả lại khoản tiền ấy, kèm lời xin lỗi.',
    choices: [
      { label: 'Nhận lời xin lỗi, không nhận tiền', effects: { happiness: 3 }, flags: ['tha_thu_nguoi_lua'],
        text: 'Tôi nói tiền ấy tôi đã quên từ lâu. Bà ấy khóc, nói ba bà mang nỗi áy náy ấy tới cuối đời. Tôi nhờ bà thắp cho ba bà một nén nhang, nói tôi không còn giận.' },
      { label: 'Nhận cả hai, góp vào quỹ khuyến học', effects: { happiness: 2, intelligence: 1 },
        text: 'Tôi nhận phong bì, nói sẽ gửi vào quỹ khuyến học, ghi tên ba bà. Bà ấy ngạc nhiên, rồi cảm ơn. Một năm sau, có một suất học bổng mang tên người từng lừa tôi.' },
    ],
  },
  {
    id: 'ls88-ban-doi-ky-niem-cuoi', age: 88, needs: ['partner'],
    title: 'Ngày kỷ niệm',
    text: 'Hôm nay là ngày kỷ niệm. Hai đứa đều yếu, không đi đâu được. {tenBanDoi} hỏi: “Năm nay tặng nhau gì?” Mấy chục năm qua, năm nào hai đứa cũng tặng nhau một món quà nhỏ.',
    choices: [
      { label: 'Tặng một câu chuyện', effects: { happiness: 4 }, flags: ['tang_cau_chuyen'],
        text: 'Tôi kể cho {tenBanDoi} nghe lần đầu tiên nhìn thấy {tenBanDoi}, kể chi tiết tới cả màu áo hôm ấy. {tenBanDoi} cười, nói: “Áo đó màu xanh chứ.” Hai đứa cãi nhau về màu áo tới tối.' },
      { label: 'Nhờ cháu mua một bông hoa', effects: { happiness: 3 },
        text: 'Đứa cháu mua một bông hồng, tôi cầm, đưa cho {tenBanDoi}. Tay tôi run, bông hoa rung rinh. {tenBanDoi} cầm lấy, cắm vào ly nước cạnh giường, nhìn nó cả ngày.' },
    ],
  },
  {
    id: 'ls88-mot-minh-noi-nho', age: 88, needs: ['single'],
    title: 'Những người không còn',
    text: 'Người chăm sóc hỏi tôi có ai muốn báo tin khi mình nằm viện không. Tôi nghĩ mãi. Những người tôi muốn báo đều đã không còn. Người chăm sóc chờ, cầm bút.',
    choices: [
      { label: 'Ghi tên những người trẻ đã quen', effects: { happiness: 2 }, flags: ['danh_sach_nguoi_tre'],
        text: 'Tôi đọc tên cậu sinh viên tình nguyện, đứa trẻ hàng xóm đọc sách, cô gái từng chăm sóc mình. Danh sách không có ai cùng tuổi, nhưng không trống. Tôi thấy nhẹ lòng.' },
      { label: 'Nói: “Không cần báo ai”', effects: { happiness: -1 },
        text: 'Người chăm sóc gật đầu, gấp sổ lại. Đêm đó tôi nằm nghĩ, rồi sáng hôm sau gọi người chăm sóc lại, đọc thêm hai cái tên.' },
    ],
  },

   
  {
    id: 'ls89-nguoi-gia-nhat-xom', age: 89,
    title: 'Người già nhất xóm',
    text: 'Tôi giờ là người già nhất xóm. Trường học gần nhà mời tôi tới kể chuyện ngày xưa cho học sinh nghe, trong tiết học về lịch sử địa phương. Tôi phải ngồi xe lăn, nói được chừng mười lăm phút là mệt.',
    choices: [
      { label: 'Tới kể chuyện', effects: { happiness: 3, health: -1 }, flags: ['ke_chuyen_truong'],
        text: 'Tôi kể về con đường đất trước cổng trường ngày xưa, về cây phượng, về những trận lũ. Tụi nhỏ hỏi nhiều tới mức mười lăm phút thành một tiếng. Về nhà, tôi ngủ ngay trên xe.' },
      { label: 'Nhờ ghi âm gửi tới trường', effects: { happiness: 2 },
        text: 'Đứa cháu ghi âm tôi kể chuyện ở nhà, gửi tới trường. Cô giáo mở cho cả lớp nghe. Tụi nhỏ viết thư cảm ơn, mỗi đứa một câu, có đứa vẽ cả cây phượng.' },
    ],
  },
  {
    id: 'ls89-mua-mua', age: 89,
    title: 'Tiếng mưa',
    text: 'Chiều nay trời mưa to. Tôi muốn ra ngồi ở hiên, nghe mưa như hồi nhỏ, nhưng người chăm sóc sợ tôi bị lạnh. Tiếng mưa trên mái tôn nghe giống hệt tiếng mưa năm tôi lên mười.',
    choices: [
      { label: 'Ra hiên, quấn chăn', effects: { happiness: 3 }, flags: ['nghe_mua_hien'],
        text: 'Tôi quấn chăn ngồi ở hiên, người chăm sóc ngồi cạnh. Mưa táp vào chân. Tôi kể chuyện những trận mưa ngày xưa, ướt sũng chạy về nhà. Người chăm sóc nghe, cười.' },
      { label: 'Nghe mưa qua cửa sổ', effects: { happiness: 1, health: 1 },
        text: 'Tôi nằm trên giường, mở hé cửa sổ, nghe tiếng mưa. Nhắm mắt lại, tôi như đang nằm trong căn nhà năm mười tuổi, nghe ba mẹ nói chuyện ở phòng ngoài.' },
    ],
  },
  {
    id: 'ls89-truoc-chin-muoi', age: 89,
    title: 'Trước tuổi chín mươi',
    text: 'Sắp chín mươi. Người thân hỏi muốn làm gì cho ngày sinh nhật. Tôi muốn một điều nhỏ: được nghe lại tiếng những người thân đã mất. Đứa cháu nói có thể ghép những đoạn ghi âm cũ.',
    choices: [
      { label: 'Nhờ cháu ghép ghi âm', effects: { happiness: 3 }, flags: ['nghe_lai_giong_cu'],
        text: 'Đứa cháu tìm được vài đoạn: tiếng ba hắng giọng, tiếng mẹ gọi ăn cơm trong một đoạn video cũ. Tôi nghe đi nghe lại, nằm im, nước mắt chảy ra hai bên thái dương.' },
      { label: 'Muốn nghe tiếng người thân hát', effects: { happiness: 3 },
        text: 'Ngày sinh nhật, người thân hát chúc mừng, lệch tông, ồn ào. Tôi nghĩ người đã mất chắc cũng muốn nghe những giọng này hơn là giọng của chính họ.' },
    ],
  },
  {
    id: 'ls89-ban-doi-giu-tay', age: 89, needs: ['partner'],
    title: 'Chiếc giường đôi',
    text: 'Người chăm sóc đề nghị kê hai giường bệnh riêng cho tiện chăm, vì hai đứa đều nằm nhiều. {tenBanDoi} không muốn, nói đã ngủ chung một giường sáu mươi năm.',
    choices: [
      { label: 'Giữ giường đôi', effects: { happiness: 3 }, flags: ['giu_giuong_doi'],
        text: 'Người chăm sóc vất vả hơn, nhưng không than. Đêm nào hai đứa cũng nằm cạnh nhau, tay trong tay. Có đêm tôi tỉnh giấc, nghe tiếng thở của {tenBanDoi}, thấy yên lòng.' },
      { label: 'Kê hai giường sát nhau', effects: { happiness: 2, health: 1 },
        text: 'Hai giường kê sát, hạ thành giường xuống. Đêm nào {tenBanDoi} cũng đưa tay sang. Tôi nắm lấy. Khoảng cách giữa hai giường chỉ bằng một bàn tay.' },
    ],
  },
  {
    id: 'ls89-mot-minh-thu-cuoi', age: 89, needs: ['single'],
    title: 'Lá thư cho chính mình',
    text: 'Tôi muốn viết một lá thư cho chính mình năm hai mươi tuổi, dù biết không ai gửi được. Người chăm sóc đề nghị viết giúp nếu tôi đọc. Có những điều tôi muốn nói với người trẻ ấy.',
    choices: [
      { label: 'Đọc cho người chăm sóc viết', effects: { happiness: 3 }, flags: ['thu_cho_tuoi_hai_muoi'],
        text: 'Tôi đọc: “Đừng sợ một mình. Một mình cũng sống được trọn một đời.” Người chăm sóc viết, rồi dừng bút, nhìn tôi. Lá thư được đóng khung, treo ở đầu giường.' },
      { label: 'Nghĩ trong lòng, không viết', effects: { happiness: 1 },
        text: 'Tôi nằm, nói thầm những điều muốn nói với chính mình năm hai mươi. Nói xong, thấy người trẻ ấy chắc cũng không nghe lời. Tôi cười một mình.' },
    ],
  },

   
  {
    id: 'ls-goi-nham-ten-chau', ages: [82, 100], requiresAny: ['ba_lan', 'nghe_chuyen_ba', 'ke_chuyen_ba_nghe'], needs: ['children'],
    title: 'Tên của con',
    text: 'Đứa cháu ngồi cạnh tôi ở hiên. Tôi gọi nó: “{tenCon} ơi, ăn cơm chưa con?” Đó là tên ba mẹ nó, con của tôi. Nó khựng lại. Tôi nhớ có một người bà từng gọi tôi bằng tên ba tôi như vậy.',
    choices: [
      { label: 'Để cháu trả lời như con mình', effects: { happiness: 3 }, flags: ['chau_dap_nhu_con'],
        text: 'Đứa cháu cười, đáp: “Con ăn rồi.” Rồi hỏi tôi kể chuyện hồi ba mẹ nó còn nhỏ. Tôi kể chuyện {tenCon} năm năm tuổi, chuyện nó chưa từng nghe. Nó ngồi nghe tới khi tôi ngủ gật.' },
      { label: 'Tự nhận ra, cười', effects: { happiness: 2 },
        text: 'Tôi cười, nói: “Ừ, lẩm cẩm rồi”, rồi khựng lại vì chính câu ấy. Đứa cháu nắm tay tôi. Tôi kể cho nó nghe về người bà ngày xưa, người đã gọi nhầm tên tôi.' },
    ],
  },
  {
    id: 'ls-thu-tam-muoi-tuoi', ages: [80, 84], requires: ['doc_thu_tuoi_hai_muoi'],
    title: 'Lá thư hẹn tám mươi',
    text: 'Năm sáu mươi mốt tuổi, tôi viết một lá thư hẹn tám mươi tuổi mới mở. Giờ lá thư nằm trước mặt, phong bì đã ố. Tôi không nhớ năm ấy mình đã mong gì cho tuổi tám mươi.',
    choices: [
      { label: 'Mở ra đọc', effects: { happiness: 3 }, flags: ['doc_thu_tam_muoi'],
        text: 'Năm sáu mươi mốt, tôi viết: “Mong tám mươi tuổi mình vẫn còn ai đó để gọi điện.” Tôi đặt lá thư xuống, cầm điện thoại, gọi cho người đầu tiên trong danh bạ.' },
      { label: 'Nhờ đứa cháu đọc to', effects: { happiness: 3 },
        text: 'Đứa cháu đọc to, chậm rãi. Nghe giọng nó đọc những lời của chính mình hai mươi năm trước, tôi cười, rồi khóc. Nó đọc xong, gấp lá thư, ôm tôi.' },
    ],
  },
  {
    id: 'ls-anh-nam-ba-tuoi', ages: [80, 100], requiresAny: ['anh_ao_moi', 'anh_ao_cu'],
    title: 'Tấm ảnh năm ba tuổi',
    text: 'Dọn đồ cũ, đứa cháu tìm thấy tấm ảnh chụp chung cả họ ở một đám cưới năm tôi ba tuổi. Nó hỏi đứa nhỏ nào là tôi. Tôi nhìn tấm ảnh, nhớ ra bộ đồ năm ấy, nhớ cả cảm giác cổ áo cọ vào cổ.',
    choices: [
      { label: 'Kể chuyện bộ đồ năm ấy', effects: { happiness: 3 }, flags: ['ke_chuyen_anh_ba_tuoi'],
        text: 'Tôi kể chuyện mẹ ủi bộ đồ từ tối hôm trước, kể chuyện chiếc áo thun sờn vai. Đứa cháu cười, nói: “Vậy mà tới giờ còn nhớ.” Tôi nói, có những thứ nhỏ mà ở lại rất lâu.' },
      { label: 'Nhờ cháu lồng khung treo lên', effects: { happiness: 2 },
        text: 'Đứa cháu lồng khung tấm ảnh, treo ở đầu giường. Sáng nào tôi cũng nhìn đứa trẻ ba tuổi trong ảnh. Có hôm thấy nó đang nhìn lại mình.' },
    ],
  },
  {
    id: 'ls-thuyen-go-cho-chat', ages: [80, 100], requiresAny: ['thuyen_go_ban_tho', 'thuyen_go'],
    title: 'Con thuyền cho đứa cháu nhỏ',
    text: 'Đứa cháu nhỏ thấy con thuyền gỗ cũ, cầm lên chơi, đẩy nó đi trên sàn nhà. Người lớn định giật lại, sợ nó làm hỏng. Con thuyền ba mang về cho tôi năm tôi ba tuổi, giờ đã {soNamConThuyen} năm.',
    choices: [
      { label: 'Để đứa nhỏ chơi, tặng luôn cho nó', effects: { happiness: 4 }, flags: ['tang_thuyen_cho_chat'],
        text: 'Tôi nói để nó chơi, con thuyền là để chơi. Đứa cháu nhỏ đẩy thuyền khắp nhà, miệng kêu “tu tu”. Tôi nhìn theo, nhớ tiếng râu ba cọ vào má năm ấy.' },
      { label: 'Ngồi xuống chơi cùng đứa nhỏ', effects: { happiness: 3 },
        text: 'Tôi nhờ người đỡ ngồi xuống sàn, cùng đứa cháu nhỏ đẩy con thuyền. Kể cho nó nghe chuyện ba tôi mang con thuyền về. Nó không hiểu, nhưng ngồi nghe, tay vẫn giữ con thuyền.' },
    ],
  },
  {
    id: 'ls-cay-xoai-tham-lai', ages: [80, 100], requiresAny: ['giu_cay_xoai', 'ghep_cay_xoai'],
    title: 'Trái xoài cuối mùa',
    text: 'Đứa cháu mang tới một rổ xoài, nói là từ cây xoài ở sân nhà cũ, cây mà tôi từng làm gãy nhánh năm bốn tuổi. Cây đã già, năm nay ra ít trái. Đây có thể là lứa cuối cùng.',
    choices: [
      { label: 'Chia cho cả nhà mỗi người một trái', effects: { happiness: 3 }, flags: ['chia_xoai_cuoi'],
        text: 'Mỗi người một trái. Tôi kể chuyện nhánh xoài gãy, chuyện ba buộc dây lại, chuyện cái mấu u. Đứa cháu nhỏ hỏi cái mấu u còn không. Đứa cháu nói còn, nó vừa sờ vào hôm qua.' },
      { label: 'Giữ một trái, ăn thật chậm', effects: { happiness: 2 },
        text: 'Tôi gọt một trái, ăn từng miếng thật chậm. Vị vẫn ngọt như năm tám tuổi. Hạt xoài, tôi nhờ đứa cháu đem gieo ở góc sân nhà mình.' },
    ],
  },
  {
    id: 'ls-khoa-gia', ages: [80, 95], requires: ['khoa_mo'],
    title: 'Người bác sĩ già',
    text: 'Khoa, người bác sĩ từng mổ cho tôi, giờ cũng đã ngoài tám mươi, chống gậy tới thăm. Khoa ngồi cạnh giường, nói giờ không cầm dao mổ nữa, chỉ đi thăm những người mình từng mổ.',
    choices: [
      { label: 'Kể lại chuyện ngày ở biển', effects: { happiness: 3 }, flags: ['ke_chuyen_bien_voi_khoa'],
        text: 'Hai đứa kể lại chuyện cái phao ngoài biển năm mười hai tuổi, cãi nhau xem ai cứu ai. Cuối cùng Khoa nói: “Thôi, tính hòa.” Hai người già cười, ho sặc sụa.' },
      { label: 'Nhờ Khoa xem bệnh cho mình', effects: { happiness: 2, health: 1 },
        text: 'Khoa đeo kính, xem đơn thuốc của tôi, gạch bỏ một loại, dặn hai điều. Rồi Khoa nói: “Lần này không cần mổ, chỉ cần sống tiếp.”' },
    ],
  },
];
