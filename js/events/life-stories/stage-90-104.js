// Giai đoạn 90–104 tuổi (105 là sự kiện kết thúc riêng). Mỗi tuổi: 3 sự kiện chung + phiên bản có bạn đời / một mình.
// Tự quyết rất ít: lựa chọn là cách đón nhận, cách nói ra, cách trao lại.
// Quy tắc viết: docs/su-kien-doi-thuong/SO-TAY.md.
export const stage90To104 = [
  // ───────────── 90 tuổi ─────────────
  {
    id: 'ls90-chin-muoi', age: 90,
    title: 'Chín mươi',
    text: 'Chín mươi tuổi. Tờ báo địa phương muốn phỏng vấn tôi, hỏi bí quyết sống lâu. Tôi không có bí quyết nào. Phóng viên trẻ ngồi chờ, máy ghi âm đã bật.',
    choices: [
      { label: 'Nói thật: không có bí quyết', effects: { happiness: 2 }, flags: ['khong_bi_quyet'],
        text: 'Tôi nói chỉ là may, và có nhiều người tốt ở cạnh. Phóng viên hơi thất vọng, rồi viết đúng như vậy. Bài báo có tựa: “Cụ già không có bí quyết.” Người thân cắt ra, dán lên tủ lạnh.' },
      { label: 'Kể về những người đã giúp mình', effects: { happiness: 3 },
        text: 'Tôi kể tên từng người: ba, mẹ, những người bạn, những người lạ. Kể mãi, phóng viên ghi kín hai trang. Lúc về, cô ấy nói: “Bài này dài quá, chắc phải chia làm hai kỳ.”' },
    ],
  },
  {
    id: 'ls90-ngay-binh-thuong', age: 90,
    title: 'Một ngày bình thường',
    text: 'Người chăm sóc hỏi hôm nay tôi muốn làm gì. Tôi không đi đâu được, ngày nào cũng giống ngày nào. Nhưng hôm nay trời đẹp, nắng vừa, có gió nhẹ.',
    choices: [
      { label: 'Ra sân ngồi dưới gốc cây', effects: { happiness: 2, health: 1 }, flags: ['ngoi_goc_cay'],
        text: 'Người chăm sóc đẩy xe ra sân. Tôi ngồi dưới gốc cây cả buổi chiều, nghe lá xào xạc, nhìn kiến bò. Chín mươi năm, mới có một buổi chiều để ý tới đàn kiến.' },
      { label: 'Nhờ mở cửa sổ, nằm nghe gió', effects: { happiness: 2 },
        text: 'Cửa sổ mở, gió thổi vào mang theo mùi khói bếp nhà ai. Tôi nằm, nhắm mắt, đoán nhà nào đang nấu món gì. Đoán đúng hai lần, người chăm sóc đi hỏi lại giùm.' },
    ],
  },
  {
    id: 'ls90-chut-chit', age: 90,
    title: 'Nhiều thế hệ',
    text: 'Trong họ có một đứa bé mới sinh. Cả nhà muốn chụp một tấm ảnh nhiều thế hệ, có tôi là người lớn tuổi nhất bế đứa bé, nên tôi phải ngồi dậy. Hôm nay tôi mệt, tay không còn sức.',
    choices: [
      { label: 'Ngồi dậy, nhờ người đỡ tay', effects: { happiness: 4, health: -1 }, flags: ['anh_nam_the_he'],
        text: 'Hai người đỡ hai bên, đứa bé nằm trên đùi tôi. Tấm ảnh chụp xong, tôi nằm xuống ngay. Tấm ảnh được treo ở phòng khách, ai tới cũng hỏi ai là ai.' },
      { label: 'Nằm trên giường, đặt bé bên cạnh', effects: { happiness: 3 },
        text: 'Đứa bé nằm cạnh tôi trên giường. Cả nhà đứng quanh chụp. Đứa bé nắm lấy ngón tay tôi, nắm chặt. Đó là tấm ảnh mọi người thích nhất.' },
    ],
  },
  {
    id: 'ls90-ban-doi-chin-muoi', age: 90, needs: ['partner'],
    title: 'Hai người chín mươi',
    text: 'Tôi đã ngoài chín mươi, {tenBanDoi} đã {tuoiBanDoi} tuổi. Người ta gọi là “cặp vợ chồng già nhất xóm”. Hôm nay đài truyền hình muốn quay phim hai đứa. {tenBanDoi} hỏi tôi có muốn không.',
    choices: [
      { label: 'Đồng ý quay', effects: { happiness: 3 }, flags: ['quay_phim_hai_nguoi'],
        text: 'Phóng viên hỏi bí quyết hạnh phúc. Hai đứa trả lời khác nhau, cãi nhau ngay trước máy quay. Đoạn phim phát lên, cả nước cười. Hai đứa xem lại, cũng cười.' },
      { label: 'Từ chối, giữ chuyện riêng', effects: { happiness: 2 },
        text: 'Hai đứa nói cảm ơn, không quen lên hình. Tối đó {tenBanDoi} nói: “Chuyện hai đứa mình, để hai đứa mình biết là đủ.”' },
    ],
  },
  {
    id: 'ls90-mot-minh-chin-muoi', age: 90, needs: ['single'],
    title: 'Sinh nhật ở viện',
    text: 'Viện dưỡng lão làm sinh nhật chung cho những người sinh trong tháng. Tôi là người lớn tuổi nhất, được mời thổi nến đầu tiên. Tôi không còn đủ hơi thổi tắt cây nến.',
    choices: [
      { label: 'Nhờ đứa trẻ thổi giúp', effects: { happiness: 3 }, flags: ['tre_thoi_nen'],
        text: 'Một đứa cháu của người khác chạy tới, thổi giúp tôi. Cả phòng vỗ tay. Đứa trẻ hỏi tôi bao nhiêu tuổi. Nghe xong, nó ôm tôi như ôm một cái cây rất già.' },
      { label: 'Cố thổi, từng hơi một', effects: { happiness: 2 },
        text: 'Tôi thổi ba lần mới tắt. Cả phòng đếm theo, tới lần thứ ba thì hò reo. Tôi mệt, nhưng cười. Lâu rồi mới được nhiều người cổ vũ như vậy.' },
    ],
  },

  // ───────────── 91 tuổi ─────────────
  {
    id: 'ls91-an-uong', age: 91,
    title: 'Bữa ăn',
    text: 'Tôi nuốt khó, phải ăn đồ xay nhuyễn. Người chăm sóc đề nghị đặt ống ăn để đỡ sặc. Tôi muốn còn được nếm vị thức ăn, dù ăn chậm, dù có lúc sặc.',
    choices: [
      { label: 'Tiếp tục ăn bằng miệng', effects: { happiness: 2, health: -1 }, flags: ['an_bang_mieng'],
        text: 'Mỗi bữa mất cả tiếng. Người chăm sóc kiên nhẫn đút từng thìa. Có hôm được nếm một thìa nước canh chua, tôi nhắm mắt lại rất lâu.' },
      { label: 'Nghe bác sĩ, đặt ống', effects: { health: 2, happiness: -1 },
        text: 'Ống ăn giúp tôi đủ chất, không sặc nữa. Thỉnh thoảng người chăm sóc chấm một chút nước chè lên môi tôi. Vị ngọt rất nhẹ, mà nhớ rất lâu.' },
    ],
  },
  {
    id: 'ls91-nguoi-la-tham', age: 91,
    title: 'Người lạ tới thăm',
    text: 'Một người đàn ông trung niên tới thăm, nói là con của một người tôi từng giúp nhiều năm trước. Ba ông ấy đã mất, dặn ông phải tới cảm ơn. Tôi không nhớ ba ông ấy là ai.',
    choices: [
      { label: 'Nhờ ông kể lại', effects: { happiness: 3 }, flags: ['nghe_chuyen_minh_giup'],
        text: 'Ông kể một chuyện cũ, một lần tôi cho ba ông vay tiền mà không hẹn ngày trả. Tôi không nhớ, nhưng nghe như nghe về một người tốt nào đó. Rồi nhận ra người đó là mình.' },
      { label: 'Nhận lời cảm ơn, hỏi thăm ông', effects: { happiness: 2 },
        text: 'Tôi hỏi ông làm nghề gì, con cái thế nào. Ông kể, tôi nghe. Lúc về, ông nói: “Ba tôi nói đúng, bác là người dễ nói chuyện.”' },
    ],
  },
  {
    id: 'ls91-nghe-ke-chuyen', age: 91,
    title: 'Ai kể chuyện cho ai',
    text: 'Cả đời tôi kể chuyện cho người thân nghe. Giờ tôi nói không còn rõ. Đứa cháu nhỏ mười tuổi đề nghị, tối nay nó sẽ kể chuyện cho tôi nghe trước khi ngủ.',
    choices: [
      { label: 'Nằm nghe đứa nhỏ kể', effects: { happiness: 4 }, flags: ['chat_ke_chuyen'],
        text: 'Nó kể một chuyện cổ tích, kể sai, rồi kể thêm chi tiết tự nghĩ ra. Tôi nằm nghe, cười. Tới cuối truyện, nó hỏi: “Hay không?” Tôi gật đầu. Nó hứa mai kể tiếp.' },
      { label: 'Nhờ đứa nhỏ đọc lại thư cũ', effects: { happiness: 3 },
        text: 'Đứa cháu nhỏ đọc một lá thư cũ của tôi gửi cho người thân, viết năm bốn mươi tuổi. Nó đọc vấp, hỏi nghĩa vài từ. Tôi nghe giọng nó đọc lời của mình, thấy như hai thời gian gặp nhau.' },
    ],
  },
  {
    id: 'ls91-ban-doi-nam-canh', age: 91, needs: ['partner'],
    title: 'Hai chiếc giường',
    text: 'Hai đứa nằm hai giường kê sát nhau. Đêm qua {tenBanDoi} gọi tên tôi trong mơ. Sáng nay {tenBanDoi} hỏi tôi có nghe thấy không. Tôi đã nghe, nhưng lúc đó ngủ mơ màng, không đáp.',
    choices: [
      { label: 'Nói: “Nghe, và đã đáp”', effects: { happiness: 3 }, flags: ['dap_trong_mo'],
        text: '{tenBanDoi} cười, nói: “Vậy thì tốt.” Đêm hôm sau, {tenBanDoi} lại gọi. Lần này tôi tỉnh, đáp thật, nắm lấy tay {tenBanDoi} qua khe hở giữa hai giường.' },
      { label: 'Hỏi {tenBanDoi} mơ thấy gì', effects: { happiness: 2 },
        text: '{tenBanDoi} kể mơ thấy hai đứa còn trẻ, đi lạc ở chợ, gọi nhau mãi. Rồi tìm thấy nhau. Tôi nói: “Lần nào cũng tìm thấy.” {tenBanDoi} gật đầu.' },
    ],
  },
  {
    id: 'ls91-mot-minh-nguoi-cham-soc', age: 91, needs: ['single'],
    title: 'Người chăm sóc',
    text: 'Người chăm sóc tôi đã năm năm sắp nghỉ, về quê lo cho mẹ già. Chị hỏi tôi có muốn chị giới thiệu người thay không, hay để viện phân công. Năm năm, chị biết tôi hơn ai hết.',
    choices: [
      { label: 'Nhờ chị chọn người thay, dặn dò kỹ', effects: { happiness: 2 }, flags: ['nguoi_cham_soc_moi'],
        text: 'Chị chọn một người, ở lại một tuần chỉ từng thói quen của tôi: tôi thích trà nguội, thích nằm nghiêng bên trái. Ngày chị về, chị nắm tay tôi, nói sẽ gọi điện.' },
      { label: 'Cảm ơn chị, để viện lo', effects: { happiness: 1 },
        text: 'Chị về quê. Người mới làm tốt, nhưng mất mấy tháng mới biết tôi thích trà nguội. Tháng nào chị cũng gọi, hỏi người mới có pha trà đúng không.' },
    ],
  },

  // ───────────── 92 tuổi ─────────────
  {
    id: 'ls92-giac-ngu-dai', age: 92,
    title: 'Giấc ngủ dài',
    text: 'Tôi ngủ gần như cả ngày. Tỉnh dậy, có lúc không biết mình đang ở đâu, năm nào. Người thân hỏi có muốn họ đặt một tấm bảng cạnh giường, ghi ngày tháng, tên người đang chăm.',
    choices: [
      { label: 'Đặt tấm bảng', effects: { happiness: 2 }, flags: ['bang_ngay_thang'],
        text: 'Tấm bảng ghi: “Hôm nay thứ ba. Người ở cạnh: cháu Lan.” Mỗi lần tỉnh, tôi nhìn bảng, gọi đúng tên. Đứa cháu nghe gọi đúng tên mình, cười rạng rỡ.' },
      { label: 'Không cần, hỏi là được', effects: { happiness: 1 },
        text: 'Mỗi lần tỉnh, tôi hỏi: “Hôm nay là ngày gì? Ai đây?” Người ở cạnh trả lời, lần nào cũng kiên nhẫn như lần đầu.' },
    ],
  },
  {
    id: 'ls92-ky-uc-tro-ve', age: 92,
    title: 'Một ký ức rõ ràng',
    text: 'Buổi sáng, một ký ức trở về rất rõ: một buổi chiều năm tôi ba mươi tuổi, ngồi ăn kem với một người bạn ở bờ hồ. Tôi muốn kể cho ai đó nghe trước khi nó trôi đi.',
    choices: [
      { label: 'Gọi đứa cháu lại kể', effects: { happiness: 3 }, flags: ['ke_ky_uc_ro'],
        text: 'Tôi kể chậm, đứt quãng. Đứa cháu ghi lại vào điện thoại. Kể xong, tôi hỏi: “Nãy giờ kể chuyện gì vậy?” Đứa cháu đọc lại cho tôi nghe. Tôi cười, như nghe chuyện của người khác.' },
      { label: 'Giữ cho riêng mình', effects: { happiness: 2 },
        text: 'Tôi nằm, giữ ký ức ấy trong đầu cả buổi sáng: vị kem, mặt hồ, tiếng cười. Tới trưa, nó trôi đi. Nhưng cả buổi sáng ấy, tôi đã sống lại một buổi chiều.' },
    ],
  },
  {
    id: 'ls92-nguoi-hat-rong', age: 92,
    title: 'Tiếng hát ngoài đường',
    text: 'Có một ông cụ mù đi hát rong ngang nhà mỗi tuần, hát những bài hát cũ. Người chăm sóc định đóng cửa cho tôi ngủ yên. Bài hát đang vang lên là bài tôi thích năm hai mươi tuổi.',
    choices: [
      { label: 'Nhờ mở cửa, mời ông vào hát', effects: { happiness: 4 }, flags: ['nguoi_hat_rong'],
        text: 'Ông cụ ngồi ở hiên, hát ba bài. Tôi nằm trong nhà, hát theo không thành tiếng. Người chăm sóc đưa ông một phong bì. Từ đó, tuần nào ông cũng dừng lại trước nhà tôi.' },
      { label: 'Nghe qua cửa sổ', effects: { happiness: 2 },
        text: 'Tôi nằm nghe tiếng hát xa dần. Bài hát chưa hết thì ông đã đi khuất. Tôi hát nốt đoạn cuối trong đầu, nhớ đủ lời.' },
    ],
  },
  {
    id: 'ls92-ban-doi-nhin-nhau', age: 92, needs: ['partner'],
    title: 'Những ngày ít nói',
    text: 'Hai đứa giờ ít nói chuyện, vì mệt, vì nghe kém. Có những buổi chiều hai đứa nằm cạnh nhau, không nói gì. Người chăm sóc lo hai cụ buồn, đề nghị mở tivi cho có tiếng.',
    choices: [
      { label: 'Nói không cần, im lặng là đủ', effects: { happiness: 3 }, flags: ['im_lang_cung_nhau'],
        text: 'Hai đứa nằm cạnh nhau, nghe tiếng quạt, tiếng chim. Có lúc {tenBanDoi} nhìn sang, tôi nhìn lại. Sáu mươi năm, không cần nói gì nữa cũng hiểu.' },
      { label: 'Mở nhạc cũ thay tivi', effects: { happiness: 2 },
        text: 'Người chăm sóc mở những bài nhạc cũ. Hai đứa nằm nghe, thỉnh thoảng {tenBanDoi} gõ ngón tay lên thành giường theo nhịp. Tôi nhìn những ngón tay ấy.' },
    ],
  },
  {
    id: 'ls92-mot-minh-thu-tu', age: 92, needs: ['single'],
    title: 'Hộp thư',
    text: 'Đã lâu tôi không nhận được thư tay. Hôm nay có một lá thư từ một người lạ, một học sinh lớp năm, viết theo chương trình “Thư gửi người cao tuổi” của trường. Nó hỏi tôi hồi nhỏ chơi trò gì.',
    choices: [
      { label: 'Nhờ người viết thư trả lời', effects: { happiness: 3 }, flags: ['thu_hoc_sinh'],
        text: 'Tôi đọc, người chăm sóc viết: tôi kể về con diều, về trò bắn bi. Hai tuần sau, đứa trẻ gửi lại một bức vẽ con diều. Tôi treo bức vẽ cạnh giường.' },
      { label: 'Đọc đi đọc lại lá thư', effects: { happiness: 2 },
        text: 'Tôi để lá thư cạnh gối, đọc mỗi sáng. Chữ đứa trẻ to, nguệch ngoạc, có chỗ sai chính tả. Người chăm sóc hỏi có muốn trả lời không. Tôi nói để mai.' },
    ],
  },

  // ───────────── 93 tuổi ─────────────
  {
    id: 'ls93-di-dao-cuoi', age: 93,
    title: 'Vòng quanh khu phố',
    text: 'Bác sĩ nói tôi không nên ra ngoài nhiều vì sức đề kháng yếu. Đứa cháu đề nghị đẩy xe lăn đưa tôi một vòng quanh khu phố, nơi tôi đã sống mấy chục năm. Trời hơi se lạnh.',
    choices: [
      { label: 'Đi, quấn khăn ấm', effects: { happiness: 4, health: -1 }, flags: ['vong_khu_pho'],
        text: 'Đứa cháu đẩy xe chậm. Tôi chỉ từng ngôi nhà, kể ai từng sống ở đó. Có ngôi nhà giờ là quán cà phê, có ngôi nhà vẫn còn người cũ. Một bà cụ nhận ra tôi, chạy ra nắm tay.' },
      { label: 'Nhờ cháu quay video', effects: { happiness: 2 },
        text: 'Đứa cháu đi một vòng, quay lại. Tôi xem trên màn hình, chỉ từng ngôi nhà. Có những chỗ thay đổi tới mức tôi không nhận ra. Có những chỗ vẫn y nguyên.' },
    ],
  },
  {
    id: 'ls93-ten-trong-gia-pha', age: 93,
    title: 'Cuốn gia phả',
    text: 'Người thân đang làm lại cuốn gia phả, hỏi tôi về những người đời trước mà chỉ tôi còn nhớ: tên tục của ông bà, nghề nghiệp, chuyện đời. Trí nhớ tôi lúc rõ lúc mờ.',
    choices: [
      { label: 'Cố kể hết những gì nhớ', effects: { happiness: 3, intelligence: 1 }, flags: ['ke_gia_pha'],
        text: 'Mỗi ngày tôi kể một chút, khi nhớ, khi quên. Đứa cháu ghi lại cẩn thận. Có tên người chỉ tôi còn nhớ, giờ được viết vào gia phả. Tôi thấy như vừa giữ lại được một người.' },
      { label: 'Kể những người mình nhớ chắc', effects: { happiness: 2 },
        text: 'Tôi chỉ kể những gì chắc chắn. Có những khoảng trống trong gia phả. Tôi nói với người thân: “Chỗ trống cũng là một cách nhớ.”' },
    ],
  },
  {
    id: 'ls93-tieng-cuoi-tre', age: 93,
    title: 'Tụi nhỏ trong nhà',
    text: 'Mấy đứa cháu nhỏ chạy nhảy ồn ào ngoài phòng, người lớn la tụi nó im để tôi nghỉ. Tôi nằm trong phòng, nghe tiếng tụi nhỏ cười giỡn.',
    choices: [
      { label: 'Gọi tụi nhỏ vào phòng chơi', effects: { happiness: 4 }, flags: ['tre_trong_phong'],
        text: 'Tụi nhỏ ùa vào, leo lên giường, kể chuyện ríu rít. Người lớn định kéo ra, tôi giơ tay ngăn. Một đứa ngủ quên trên tay tôi. Tôi nằm im, không dám cử động.' },
      { label: 'Nói người lớn đừng la tụi nhỏ', effects: { happiness: 3 },
        text: 'Người lớn không la nữa. Tiếng cười tiếp tục vọng vào. Tôi nằm nghe, nhắm mắt, nhớ những năm nhà mình cũng đầy tiếng trẻ con như vậy.' },
    ],
  },
  {
    id: 'ls93-ban-doi-noi-loi-cam-on', age: 93, needs: ['partner'],
    title: 'Lời cảm ơn',
    text: 'Hôm nay {tenBanDoi} tỉnh táo, nhìn tôi rất lâu, rồi nói: “Cảm ơn mình đã ở lại với mình.” Tôi muốn đáp lại một điều gì đó xứng đáng với sáu mươi năm.',
    choices: [
      { label: 'Nói: “Cảm ơn mình đã chờ”', effects: { happiness: 4 }, flags: ['cam_on_nhau'],
        text: '{tenBanDoi} cười, nắm tay tôi. Hai đứa không nói gì thêm. Buổi chiều trôi qua rất chậm, nắng chuyển từ đầu giường xuống cuối giường.' },
      { label: 'Nắm tay, không nói gì', effects: { happiness: 3 },
        text: 'Tôi nắm tay {tenBanDoi}, siết nhẹ. {tenBanDoi} siết lại. Sáu mươi năm, có những câu chỉ nói được bằng tay.' },
    ],
  },
  {
    id: 'ls93-mot-minh-cay-xanh', age: 93, needs: ['single'],
    title: 'Chậu cây bên giường',
    text: 'Người chăm sóc mang tới một chậu cây nhỏ, đặt cạnh giường, nói để tôi có cái để nhìn. Cây sắp khô vì không ai nhớ tưới. Tôi không với tới được.',
    choices: [
      { label: 'Nhờ người chăm sóc tưới mỗi sáng', effects: { happiness: 2 }, flags: ['cham_cay_ben_giuong'],
        text: 'Sáng nào tôi cũng nhắc: “Tưới cây chưa?” Người chăm sóc cười, nói tôi nhớ cây hơn nhớ thuốc. Cây ra một lá non. Tôi đếm lá mỗi ngày.' },
      { label: 'Nhờ chuyển cây ra cửa sổ', effects: { happiness: 1 },
        text: 'Cây ra cửa sổ, có nắng, có mưa hắt vào. Nó sống được, xanh lại. Tôi nằm nhìn nó từ xa, như nhìn một người bạn đứng ngoài hiên.' },
    ],
  },

  // ───────────── 94 tuổi ─────────────
  {
    id: 'ls94-nhung-ngay-dau', age: 94,
    title: 'Cơn đau',
    text: 'Những cơn đau nhiều hơn. Bác sĩ đề nghị dùng thuốc giảm đau mạnh, nhưng tôi sẽ ngủ nhiều hơn, ít tỉnh táo hơn. Không dùng thì đau, nhưng tỉnh, nói chuyện được với người thân.',
    choices: [
      { label: 'Dùng thuốc, đỡ đau', effects: { health: 2, happiness: -1 }, flags: ['thuoc_giam_dau'],
        text: 'Cơn đau dịu đi. Tôi ngủ nhiều, tỉnh ít. Những lúc tỉnh, nhìn thấy người thân ngồi cạnh, tôi mỉm cười. Họ nói chỉ cần thấy tôi cười là đủ.' },
      { label: 'Dùng ít, giữ tỉnh táo', effects: { happiness: 2, health: -1 },
        text: 'Có những lúc đau, tôi nắm chặt tay người bên cạnh. Nhưng tôi tỉnh, nghe được người thân kể chuyện, đáp lại được vài câu. Đổi như vậy, tôi thấy đáng.' },
    ],
  },
  {
    id: 'ls94-nguoi-hang-xom-tre-lon', age: 94,
    title: 'Đứa trẻ năm ấy',
    text: 'Đứa trẻ hàng xóm ngày nào sang ăn kem với tôi ở bậc thềm, giờ đã thành người lớn, có con. Nó dẫn con tới thăm, nói muốn con mình biết “người đã ăn kem với ba hồi nhỏ”.',
    choices: [
      { label: 'Kể chuyện cây kem năm ấy', effects: { happiness: 4 }, flags: ['ke_chuyen_kem_cho_con_ban'],
        text: 'Tôi kể chuyện kem chảy xuống tay, chuyện hai người cười nhau. Đứa con nó nghe, cười. Lúc về, nó dặn con: “Chào cụ đi con.” Đứa bé cúi đầu, rất ngoan.' },
      { label: 'Hỏi chuyện nó bây giờ', effects: { happiness: 3 },
        text: 'Nó kể công việc, gia đình, những lo lắng của tuổi ba mươi. Tôi nghe, gật gù. Nó nói: “Hồi nhỏ ngồi ở bậc thềm nhà cụ là lúc con thấy yên nhất.”' },
    ],
  },
  {
    id: 'ls94-ngay-mua-dau', age: 94,
    title: 'Cơn mưa đầu mùa',
    text: 'Cơn mưa đầu mùa. Tôi nghe mùi đất bốc lên qua khe cửa. Người chăm sóc đang định đóng cửa sổ. Mùi đất ướt làm tôi nhớ tới cái sân nhà cũ, nơi có cây xoài.',
    choices: [
      { label: 'Xin để cửa mở', effects: { happiness: 3 }, flags: ['mui_dat_mua'],
        text: 'Người chăm sóc để cửa mở, kéo chăn đắp kín cho tôi. Tôi nằm hít mùi đất ướt, nhắm mắt. Như đang ngồi ở hiên năm năm tuổi, chờ mưa tạnh để ra sân chơi.' },
      { label: 'Kể cho người chăm sóc nghe về cái sân', effects: { happiness: 2 },
        text: 'Tôi kể về cái sân, cây xoài, những vũng nước mưa. Người chăm sóc vừa đóng cửa vừa nghe. Chị nói quê chị cũng có một cái sân như vậy. Hai người ngồi kể chuyện sân nhà.' },
    ],
  },
  {
    id: 'ls94-ban-doi-thay-doi', age: 94, needs: ['partner'],
    title: 'Ai chăm ai',
    text: 'Sức khỏe {tenBanDoi} giờ khá hơn tôi. {tenBanDoi} muốn tự tay chăm tôi, không muốn người chăm sóc làm hết. {tenBanDoi} đã {tuoiBanDoi} tuổi, tay cũng run.',
    choices: [
      { label: 'Để {tenBanDoi} làm những việc nhỏ', effects: { happiness: 3 }, flags: ['ban_doi_cham_viec_nho'],
        text: '{tenBanDoi} chải tóc cho tôi mỗi sáng, chậm, run. Rồi lau mặt bằng khăn ấm. Những việc nặng để người chăm sóc lo. Buổi sáng nào cũng bắt đầu bằng bàn tay ấy.' },
      { label: 'Nhờ {tenBanDoi} chỉ ngồi cạnh', effects: { happiness: 2 },
        text: '{tenBanDoi} ngồi cạnh, cầm tay tôi, nói chuyện với người chăm sóc như một người quản lý khó tính. Người chăm sóc cười, làm theo từng lời dặn.' },
    ],
  },
  {
    id: 'ls94-mot-minh-con-lai', age: 94, needs: ['single'],
    title: 'Người cuối cùng',
    text: 'Tôi nghe tin người cuối cùng trong lớp học năm xưa vừa mất. Giờ chỉ còn mình tôi. Đứa cháu hỏi có muốn gửi vòng hoa không, ghi gì trên băng tang.',
    choices: [
      { label: 'Ghi: “Lớp mình, còn một người”', effects: { happiness: 1 }, flags: ['nguoi_cuoi_cung_lop'],
        text: 'Vòng hoa được gửi đi. Gia đình người ấy chụp ảnh tấm băng tang, gửi lại. Tôi nhìn dòng chữ, thấy như vừa điểm danh một lớp học không còn ai trả lời.' },
      { label: 'Ghi tên cả lớp lên băng', effects: { happiness: 2 },
        text: 'Đứa cháu giúp tôi nhớ lại tên từng người. Băng tang dài, chữ nhỏ. Ở đám tang, nhiều người dừng lại đọc, có người tìm thấy tên ông bà mình trong đó.' },
    ],
  },

  // ───────────── 95 tuổi ─────────────
  {
    id: 'ls95-buoi-sang', age: 95,
    title: 'Ánh nắng buổi sáng',
    text: 'Sáng nay tôi tỉnh dậy, thấy nắng chiếu vào giường, ấm. Không đau, không mệt, hiếm có. Người chăm sóc hỏi có muốn làm gì đặc biệt không, nhân ngày khỏe.',
    choices: [
      { label: 'Gọi điện cho từng người thân', effects: { happiness: 4 }, flags: ['goi_ngay_khoe'],
        text: 'Tôi gọi cho từng đứa con, đứa cháu, nói vài câu. Đứa nào cũng ngạc nhiên vì giọng tôi khỏe. Cuộc gọi cuối, tôi nói: “Hôm nay khỏe lắm.” Rồi ngủ một giấc rất yên.' },
      { label: 'Ngồi dậy, nhìn ra cửa', effects: { happiness: 3 },
        text: 'Người chăm sóc đỡ tôi ngồi dậy. Tôi nhìn ra cửa, thấy con đường, hàng cây, đứa trẻ đạp xe đi học. Một buổi sáng bình thường. Tôi ngồi tới khi mỏi, thấy đủ.' },
    ],
  },
  {
    id: 'ls95-chuyen-tam-linh', age: 95,
    title: 'Câu hỏi về phía bên kia',
    text: 'Đứa cháu nhỏ mười hai tuổi hỏi tôi: “Có sợ chết không?” Người lớn trong nhà nhìn nó trách. Nó vẫn nhìn tôi, chờ một câu trả lời thật.',
    choices: [
      { label: 'Trả lời thật', effects: { happiness: 2, intelligence: 1 }, flags: ['tra_loi_ve_cai_chet'],
        text: 'Tôi nói có lúc sợ, có lúc không. Sợ nhất là để lại người mình thương. Đứa cháu nhỏ gật đầu, nói: “Vậy con sẽ thương cố thêm, để cố đỡ sợ.” Tôi bật cười.' },
      { label: 'Hỏi lại nó có sợ không', effects: { happiness: 2 },
        text: 'Đứa cháu nhỏ nói có, nó sợ cố đi. Tôi nắm tay nó, nói tôi vẫn ở đây hôm nay. Nó ngồi cạnh tôi cả buổi chiều, không chạy đi chơi.' },
    ],
  },
  {
    id: 'ls95-mon-an-tuoi-tho', age: 95,
    title: 'Món ăn tuổi thơ',
    text: 'Tôi chợt thèm một món ăn hồi nhỏ, món mẹ hay nấu. Không ai trong nhà biết nấu. Tôi chỉ nhớ lờ mờ vị, không nhớ cách làm.',
    choices: [
      { label: 'Kể vị cho đứa cháu nấu thử', effects: { happiness: 3 }, flags: ['nau_mon_tuoi_tho'],
        text: 'Đứa cháu nấu ba lần. Lần thứ ba, tôi nếm một thìa, nhắm mắt. Không giống hẳn, nhưng có một chút gì đó. Tôi nói: “Đúng rồi.” Nó biết tôi nói dối, vẫn vui.' },
      { label: 'Kể chuyện món ăn thay vì ăn', effects: { happiness: 2 },
        text: 'Tôi kể về căn bếp, nồi đất, tiếng mẹ gọi ăn cơm. Đứa cháu nghe, ghi lại tên món. Nó nói sẽ tìm hiểu cách nấu, để sau này nấu cho con nó.' },
    ],
  },
  {
    id: 'ls95-ban-doi-trang-thai', age: 95, needs: ['partner'],
    title: 'Ngày {tenBanDoi} không nhận ra',
    text: 'Hôm nay {tenBanDoi} không nhận ra tôi, lịch sự hỏi tôi là ai, có phải bác sĩ không. Ngày mai có thể sẽ nhớ lại, có thể không. Tôi ngồi bên giường.',
    choices: [
      { label: 'Tự giới thiệu như lần đầu gặp', effects: { happiness: 3 }, flags: ['gioi_thieu_lai'],
        text: 'Tôi nói tên mình, kể hai đứa gặp nhau ở đâu, năm nào. {tenBanDoi} nghe, cười, nói: “Nghe như chuyện tình trong phim.” Tôi nói: “Đúng là phim, mà mình đóng chính.”' },
      { label: 'Nói là người bạn tới thăm', effects: { happiness: 1 },
        text: '{tenBanDoi} gật đầu, mời tôi ngồi. Hai người nói chuyện như hai người quen mới. Tôi biết thêm vài điều về {tenBanDoi} mà sáu mươi năm chưa từng nghe kể.' },
    ],
  },
  {
    id: 'ls95-mot-minh-tieng-chuong', age: 95, needs: ['single'],
    title: 'Tiếng chuông chùa',
    text: 'Ngôi chùa gần viện dưỡng lão gióng chuông mỗi chiều. Sư thầy hỏi tôi có muốn được đưa sang ngồi nghe kinh không. Tôi không theo đạo nào, chỉ thích tiếng chuông.',
    choices: [
      { label: 'Sang ngồi nghe', effects: { happiness: 3 }, flags: ['nghe_kinh_chieu'],
        text: 'Chiều nào cũng có người đẩy xe tôi sang. Tôi ngồi ở góc, không tụng, chỉ nghe. Tiếng chuông ngân rất lâu. Sư thầy nói không cần theo đạo, chỉ cần ngồi yên.' },
      { label: 'Nghe từ cửa sổ', effects: { happiness: 2 },
        text: 'Mỗi chiều, tôi nằm nghe tiếng chuông vọng qua cửa sổ. Ba tiếng chuông, rồi im. Tôi đếm theo, như đếm những năm tháng đã qua.' },
    ],
  },

  // ───────────── 96 tuổi ─────────────
  {
    id: 'ls96-giac-mo-cha-me', age: 96,
    title: 'Giấc mơ',
    text: 'Đêm qua tôi mơ thấy ba mẹ, trẻ như năm tôi lên năm, đứng ở cổng gọi tôi về ăn cơm. Tỉnh dậy, tôi muốn kể, nhưng không biết kể cho ai, vì không ai còn nhớ ba mẹ tôi lúc trẻ.',
    choices: [
      { label: 'Kể cho người đang ngồi cạnh', effects: { happiness: 2 }, flags: ['ke_giac_mo_cha_me'],
        text: 'Đứa cháu đang ngồi cạnh, nghe tôi kể. Nó không biết ông bà cố, nhưng hỏi kỹ từng chi tiết: áo màu gì, cổng làm bằng gì. Kể xong, tôi thấy ba mẹ như vừa được thêm một người nhớ.' },
      { label: 'Nhắm mắt, mong mơ lại', effects: { happiness: 2, health: 1 },
        text: 'Tôi nhắm mắt, ngủ thêm. Không mơ lại. Nhưng tỉnh dậy lần sau, tôi vẫn nhớ khuôn mặt ba mẹ rõ hơn mọi ngày.' },
    ],
  },
  {
    id: 'ls96-ten-cho-chut', age: 96,
    title: 'Đặt tên cho đứa bé trong họ',
    text: 'Gia đình nhờ tôi đặt tên cho đứa bé trong họ mới sinh, vì tôi là người lớn tuổi nhất. Tôi nghĩ mãi, có một cái tên cứ hiện lên: tên của một người bạn thân thời nhỏ đã mất.',
    choices: [
      { label: 'Đặt theo tên người bạn', effects: { happiness: 3 }, flags: ['dat_ten_theo_ban'],
        text: 'Tôi kể về người bạn, về con diều, về những năm tháng ấy. Gia đình đồng ý. Đứa bé mang tên người bạn cũ. Tôi gọi tên nó, như gọi lại một người từ rất xa.' },
      { label: 'Đặt một cái tên mới', effects: { happiness: 2 },
        text: 'Tôi chọn một cái tên mới, có nghĩa là bình yên. Gia đình thích. Tôi bế đứa bé, gọi tên nó lần đầu tiên. Nó mở mắt nhìn tôi.' },
    ],
  },
  {
    id: 'ls96-thuoc-men', age: 96,
    title: 'Danh sách thuốc',
    text: 'Bác sĩ đề nghị bớt bớt những loại thuốc không còn cần thiết, chỉ giữ những thuốc giúp tôi dễ chịu. Người thân lo, nghĩ bớt thuốc là bỏ cuộc. Bác sĩ hỏi ý tôi.',
    choices: [
      { label: 'Đồng ý bớt thuốc', effects: { happiness: 2 }, flags: ['bot_thuoc'],
        text: 'Còn ba loại thuốc. Tôi đỡ mệt, ăn được hơn, không còn buồn nôn. Người thân thấy tôi tỉnh táo hơn, mới yên tâm. Bác sĩ nói: “Giờ là để sống dễ chịu.”' },
      { label: 'Để người thân quyết', effects: { happiness: 1 },
        text: 'Người thân bàn bạc mấy ngày, rồi đồng ý bớt một nửa. Tôi uống ít thuốc hơn, thấy nhẹ người. Thấy họ quyết được, tôi cũng yên lòng.' },
    ],
  },
  {
    id: 'ls96-ban-doi-tieng-thay', age: 96, needs: ['partner'],
    title: 'Giọng của {tenBanDoi}',
    text: 'Tai tôi giờ gần như không nghe được, chỉ còn nhận ra vài giọng quen. Giọng {tenBanDoi} là một trong số đó. {tenBanDoi} hỏi tôi muốn nghe gì mỗi tối.',
    choices: [
      { label: 'Nghe {tenBanDoi} đọc thư cũ', effects: { happiness: 4 }, flags: ['nghe_doc_thu_cu'],
        text: 'Mỗi tối {tenBanDoi} đọc một lá thư hai đứa viết cho nhau năm nào, đọc sát tai tôi. Có lá {tenBanDoi} đọc tới nửa chừng thì cười, không đọc tiếp được.' },
      { label: 'Nghe {tenBanDoi} hát ru', effects: { happiness: 3 },
        text: '{tenBanDoi} hát ru, giọng khàn, lạc nhịp. Bài hát mẹ tôi từng hát. Tôi không biết {tenBanDoi} học bài ấy từ bao giờ. Tôi ngủ ngon.' },
    ],
  },
  {
    id: 'ls96-mot-minh-loi-chao', age: 96, needs: ['single'],
    title: 'Lời chào buổi sáng',
    text: 'Người chăm sóc mới, mỗi sáng vào phòng đều chào rất to, rất vui. Tôi thấy ồn. Nhưng nhờ tiếng chào ấy, sáng nào tôi cũng biết mình vẫn còn ở đây.',
    choices: [
      { label: 'Chào lại thật to', effects: { happiness: 3 }, flags: ['chao_lai_to'],
        text: 'Sáng hôm sau, tôi chào lại, giọng khàn nhưng to. Người chăm sóc giật mình, rồi cười ngặt nghẽo. Từ đó, hai người thi xem ai chào trước, chào to hơn.' },
      { label: 'Mỉm cười, giơ tay', effects: { happiness: 2 },
        text: 'Tôi giơ tay vẫy. Người chăm sóc vẫy lại. Buổi sáng nào cũng bắt đầu bằng một cái vẫy tay. Không cần nói gì nhiều.' },
    ],
  },

  // ───────────── 97 tuổi ─────────────
  {
    id: 'ls97-cua-so-mua', age: 97,
    title: 'Mùa đổi',
    text: 'Ngoài cửa sổ, cây bàng bắt đầu đỏ lá. Tôi đã nhìn cây bàng ấy đổi màu chín mươi mấy mùa. Người chăm sóc hỏi có muốn chụp lại không, gửi cho người thân ở xa.',
    choices: [
      { label: 'Nhờ chụp, gửi cho cả nhà', effects: { happiness: 3 }, flags: ['anh_cay_bang'],
        text: 'Tấm ảnh cây bàng đỏ lá được gửi vào nhóm gia đình. Từng đứa trả lời, gửi lại ảnh cây cối nơi chúng ở. Một buổi chiều, tôi xem ảnh cây cối khắp nơi.' },
      { label: 'Chỉ ngồi nhìn', effects: { happiness: 2 },
        text: 'Tôi ngồi nhìn từng chiếc lá rụng. Có chiếc bay vào tận phòng. Người chăm sóc nhặt lên, đặt vào tay tôi. Tôi cầm chiếc lá cả buổi.' },
    ],
  },
  {
    id: 'ls97-loi-dan', age: 97,
    title: 'Lời dặn',
    text: 'Người thân tụ tập đông đủ. Người lớn nhất trong đám người thân hỏi tôi có điều gì muốn dặn lại cả nhà. Ai cũng im lặng, chờ.',
    choices: [
      { label: 'Dặn: “Thương nhau thì nói ra”', effects: { happiness: 3 }, flags: ['loi_dan_thuong_nhau'],
        text: 'Tôi nói chậm: thương nhau thì nói ra, giận nhau thì đừng để qua đêm. Có người gật đầu, có người khóc. Tối đó, tôi nghe hai người thân vốn giận nhau gọi điện cho nhau, lần đầu sau nhiều năm.' },
      { label: 'Nói: “Không có gì phải dặn”', effects: { happiness: 2 },
        text: 'Tôi nói mọi người đã sống tốt, không cần dặn gì. Mọi người cười, nhưng có vẻ chưa yên tâm. Đứa cháu nhỏ chen vào: “Vậy dặn con ăn rau đi.” Cả nhà cười.' },
    ],
  },
  {
    id: 'ls97-ngay-ky-niem-chet', age: 97,
    title: 'Một ngày không quan trọng',
    text: 'Đứa cháu hỏi tôi ngày nào trong đời là ngày hạnh phúc nhất. Tôi nghĩ mãi, không phải ngày cưới, không phải ngày nhận bằng. Là một ngày bình thường, không có gì đặc biệt.',
    choices: [
      { label: 'Kể về ngày bình thường ấy', effects: { happiness: 3 }, flags: ['ngay_binh_thuong_hanh_phuc'],
        text: 'Tôi kể về một buổi chiều mưa, cả nhà ngồi ăn bánh xèo, tivi mất điện, ai cũng kể chuyện ma. Không ai nhớ ngày ấy ngoài tôi. Đứa cháu nói nó sẽ tạo một ngày như vậy cho con nó.' },
      { label: 'Nói: “Hôm nay”', effects: { happiness: 3 },
        text: 'Đứa cháu tưởng tôi đùa. Tôi nói thật. Hôm nay tôi tỉnh táo, có người ngồi cạnh, có nắng ngoài cửa. Nó ngồi xuống cạnh tôi, lâu hơn dự định.' },
    ],
  },
  {
    id: 'ls97-ban-doi-ngoi-canh', age: 97, needs: ['partner'],
    title: 'Ghế cạnh giường',
    text: '{tenBanDoi} ngồi trên ghế cạnh giường tôi từ sáng tới tối, dù người chăm sóc nói về nghỉ đi. {tenBanDoi} cũng đã già, ngồi lâu mỏi lưng. Tôi muốn {tenBanDoi} nghỉ, nhưng cũng muốn {tenBanDoi} ở cạnh.',
    choices: [
      { label: 'Bảo {tenBanDoi} nằm lên giường cùng', effects: { happiness: 4 }, flags: ['nam_cung_giuong_cuoi'],
        text: 'Người chăm sóc đỡ {tenBanDoi} nằm xuống cạnh tôi. Giường hẹp, hai người nằm sát nhau. {tenBanDoi} ngủ trước, tay đặt trên tay tôi. Tôi nằm nghe tiếng thở ấy, rất quen.' },
      { label: 'Bảo {tenBanDoi} về nghỉ, mai tới', effects: { happiness: 1 },
        text: '{tenBanDoi} gật đầu, về phòng. Sáng hôm sau, tôi tỉnh dậy, thấy {tenBanDoi} đã ngồi ở ghế từ lúc nào, đang ngủ gật, tay cầm sẵn chiếc lược.' },
    ],
  },
  {
    id: 'ls97-mot-minh-nguoi-tre-ghe', age: 97, needs: ['single'],
    title: 'Cậu tình nguyện viên',
    text: 'Cậu tình nguyện viên trẻ tới đọc báo cho tôi mỗi tuần, đã ba năm. Hôm nay cậu nói sắp đi du học, không tới được nữa. Cậu ngồi cạnh giường, có vẻ ngại.',
    choices: [
      { label: 'Chúc cậu đi, dặn một điều', effects: { happiness: 3 }, flags: ['dan_cau_tinh_nguyen'],
        text: 'Tôi dặn cậu: ở xa thì nhớ gọi điện về nhà, nhất là cho người già. Cậu gật đầu, mắt đỏ. Trước khi đi, cậu đọc cho tôi nghe tờ báo cuối cùng, đọc rất chậm.' },
      { label: 'Tặng cậu một món đồ', effects: { happiness: 2 },
        text: 'Tôi nhờ người chăm sóc lấy cuốn sách cũ trên kệ, tặng cậu. Trong sách có dòng chữ tôi viết năm ba mươi tuổi. Cậu mở ra, đọc, rồi cất vào ba lô.' },
    ],
  },

  // ───────────── 98 tuổi ─────────────
  {
    id: 'ls98-tieng-ve-que', age: 98,
    title: 'Về quê',
    text: 'Tôi nói với người thân muốn về quê lần cuối, nằm ở căn nhà gần nơi ông bà nằm. Đường xa, bác sĩ không khuyến khích. Người thân bàn nhau, chưa ai dám quyết.',
    choices: [
      { label: 'Nói rõ đây là điều mình muốn', effects: { happiness: 3, health: -2 }, flags: ['ve_que_lan_cuoi'],
        text: 'Người thân thuê xe cứu thương, chở tôi về. Căn nhà ở quê có người quét dọn sẵn. Tôi nằm nghe tiếng gà gáy, tiếng gió qua rặng tre. Đúng như mình nhớ.' },
      { label: 'Nói: “Thôi, ở đâu cũng được”', effects: { happiness: 1 },
        text: 'Người thân mang về một bao đất quê, đặt cạnh giường, cùng mấy tấm ảnh rặng tre, con đường đất. Tôi nằm nhìn những tấm ảnh, ngửi mùi đất, thấy như đã về.' },
    ],
  },
  {
    id: 'ls98-ten-goi-thu-tu', age: 98,
    title: 'Những cái tên',
    text: 'Tôi hay gọi nhầm tên người thân, gọi đứa này bằng tên đứa kia, có khi gọi bằng tên của người đã mất. Người thân không sửa nữa, cứ thế đáp lại. Tôi biết mình đang gọi nhầm.',
    choices: [
      { label: 'Cười, xin lỗi mỗi lần nhầm', effects: { happiness: 2 }, flags: ['xin_loi_goi_nham'],
        text: 'Mỗi lần gọi nhầm, tôi cười, nói: “Lại nhầm rồi.” Đứa cháu cười theo, nói: “Không sao, cái tên nào cũng là người nhà.” Câu ấy làm tôi yên lòng.' },
      { label: 'Để mọi người cứ đáp', effects: { happiness: 2 },
        text: 'Tôi gọi tên ai thì người đang ở cạnh đáp. Có hôm tôi gọi tên mẹ, đứa cháu đáp: “Mẹ đây.” Tôi nhìn nó, rồi cười, nắm tay nó.' },
    ],
  },
  {
    id: 'ls98-cuoi-cung-cua-mot-nghe', age: 98,
    title: 'Món đồ cuối cùng',
    text: 'Trong căn phòng giờ chỉ còn vài món đồ: một tấm ảnh, một cuốn sổ, một chiếc cốc. Người chăm sóc hỏi tôi muốn để món nào gần mình nhất.',
    choices: [
      { label: 'Tấm ảnh', effects: { happiness: 3 }, flags: ['giu_tam_anh'],
        text: 'Tấm ảnh đặt trên bàn cạnh giường. Mỗi lần tỉnh dậy, tôi nhìn những khuôn mặt trong ảnh. Có những người đã mất, có những người đang ngồi ngoài phòng khách.' },
      { label: 'Cuốn sổ', effects: { happiness: 2, intelligence: 1 },
        text: 'Cuốn sổ đặt dưới gối. Trong đó là những dòng tôi viết suốt đời, nét chữ từ thẳng thớm tới run run. Tôi không đọc được nữa, chỉ cần biết nó ở đó.' },
    ],
  },
  {
    id: 'ls98-ban-doi-loi-hen', age: 98, needs: ['partner'],
    title: 'Lời hẹn',
    text: 'Đêm nay {tenBanDoi} nói: “Nếu ai đi trước, thì chờ người kia ở chỗ hai đứa gặp nhau lần đầu.” {tenBanDoi} nói như nói chuyện hẹn đi chợ ngày mai.',
    choices: [
      { label: 'Nhận lời hẹn', effects: { happiness: 4 }, flags: ['loi_hen_cuoi'],
        text: 'Tôi nói: “Ừ, nhớ đứng ở chỗ có bóng mát.” {tenBanDoi} cười, nói chỗ đó ngày xưa nắng chang chang. Hai đứa cãi nhau về cái bóng mát, rồi ngủ.' },
      { label: 'Nói: “Đi cùng thì khỏi phải chờ”', effects: { happiness: 3 },
        text: '{tenBanDoi} cười, nói: “Tham lam ghê.” Rồi nắm tay tôi, kéo lại gần. Đêm đó hai đứa ngủ rất yên, như hai đứa trẻ.' },
    ],
  },
  {
    id: 'ls98-mot-minh-ban-moi', age: 98, needs: ['single'],
    title: 'Người bạn mới',
    text: 'Viện dưỡng lão có một người mới tới, chín mươi lăm tuổi, cũng sống một mình cả đời. Người ấy được xếp giường cạnh tôi. Ở tuổi này, tôi không nghĩ mình còn kết bạn mới.',
    choices: [
      { label: 'Chào hỏi, kể chuyện', effects: { happiness: 3 }, flags: ['ban_moi_tuoi_98'],
        text: 'Hai người kể chuyện đời mình cho nhau nghe, mỗi ngày một ít, vì mệt. Có những chuyện giống nhau tới lạ. Người ấy nói: “Giá mà gặp nhau sớm hơn.” Tôi nói: “Gặp giờ cũng được.”' },
      { label: 'Để người ấy tự quen', effects: { happiness: 1 },
        text: 'Hai người nằm cạnh nhau, ít nói. Một đêm, người ấy khóc nhỏ. Tôi đưa tay sang, người ấy nắm lấy. Sáng ra, hai người chào nhau như bạn cũ.' },
    ],
  },

  // ───────────── 99 tuổi ─────────────
  {
    id: 'ls99-sap-tram-tuoi', age: 99,
    title: 'Sắp một trăm',
    text: 'Người thân đang chuẩn bị mừng thọ một trăm tuổi cho tôi vào năm sau, bàn chuyện tiệc tùng, khách mời. Tôi không chắc mình sẽ tới được ngày ấy, và không muốn ai phải hụt hẫng.',
    choices: [
      { label: 'Đề nghị mừng ngay năm nay', effects: { happiness: 4 }, flags: ['mung_tho_som'],
        text: 'Người thân ngạc nhiên, rồi đồng ý. Buổi mừng thọ nhỏ, ấm cúng, tổ chức ngay trong tháng. Tôi ngồi giữa mọi người, nghe chúc thọ, nghĩ: không cần phải đợi tới một trăm.' },
      { label: 'Để người thân chuẩn bị, cứ chờ', effects: { happiness: 2 },
        text: 'Người thân háo hức chuẩn bị. Tôi nghe họ bàn bạc, thấy vui lây. Có hay không ngày ấy, những tháng chuẩn bị này đã là một món quà.' },
    ],
  },
  {
    id: 'ls99-ban-tay-chat', age: 99,
    title: 'Bàn tay',
    text: 'Đứa cháu nhỏ đặt bàn tay nhỏ của nó lên bàn tay nhăn nheo của tôi, so sánh. Nó hỏi tay tôi hồi nhỏ có giống tay nó không.',
    choices: [
      { label: 'Kể bàn tay này đã làm gì', effects: { happiness: 3 }, flags: ['ke_ve_ban_tay'],
        text: 'Tôi kể: bàn tay này từng thả diều, từng viết thư, từng bế ba mẹ nó, từng nắm tay nhiều người trước lúc họ đi. Đứa cháu nhỏ nghe, rồi nắm chặt tay tôi, như sợ bàn tay ấy biến mất.' },
      { label: 'Nói: “Giống y như vậy”', effects: { happiness: 3 },
        text: 'Đứa cháu nhỏ cười, nói vậy sau này tay nó cũng sẽ nhăn như tay tôi. Tôi nói: “Ừ, nếu con may mắn.” Nó không hiểu, nhưng thấy tôi cười nên cũng cười.' },
    ],
  },
  {
    id: 'ls99-loi-cuoi-trong-nhat-ky', age: 99,
    title: 'Dòng cuối cùng',
    text: 'Tôi muốn viết một dòng cuối vào cuốn nhật ký đã viết suốt đời. Tay không cầm bút được nữa. Đứa cháu đề nghị viết giúp, tôi đọc.',
    choices: [
      { label: 'Đọc một dòng cảm ơn', effects: { happiness: 3 }, flags: ['dong_cuoi_nhat_ky'],
        text: 'Tôi đọc: “Cảm ơn mọi người đã cùng đi.” Đứa cháu viết, nét chữ của nó nằm ngay dưới nét chữ run run của tôi tuần trước. Hai nét chữ, hai thế hệ, trên cùng một trang.' },
      { label: 'Đọc ngày tháng và thời tiết', effects: { happiness: 2 },
        text: 'Tôi đọc: “Hôm nay trời nắng nhẹ, có gió. Ăn được nửa chén cháo.” Đứa cháu viết, rồi cười. Tôi nói, cả đời nhật ký của tôi toàn những dòng như vậy, và đó là những dòng đáng giữ nhất.' },
    ],
  },
  {
    id: 'ls99-ban-doi-tram-tuoi', age: 99, needs: ['partner'],
    title: 'Hai người gần trăm tuổi',
    text: '{tenBanDoi} hỏi tôi có nhớ ngày đầu tiên hai đứa gặp nhau không. Tôi nhớ lờ mờ, không chắc. {tenBanDoi} cũng không chắc. Không còn ai khác nhớ để hỏi.',
    choices: [
      { label: 'Cùng nhau kể lại, ai nhớ gì kể nấy', effects: { happiness: 4 }, flags: ['cung_ke_ngay_gap'],
        text: 'Mỗi người kể một mảnh, ghép lại thành một ngày hơi khác ngày thật, nhưng là của hai đứa. Đứa cháu ngồi nghe, ghi lại, nói sẽ in ra làm một cuốn sách nhỏ.' },
      { label: 'Nói: “Nhớ hay quên cũng là mình”', effects: { happiness: 3 },
        text: '{tenBanDoi} cười, gật đầu. Hai đứa thôi cố nhớ, ngồi nhìn nhau. Gần trăm năm, có những thứ không cần nhớ, chỉ cần còn.' },
    ],
  },
  {
    id: 'ls99-mot-minh-tram-nam', age: 99, needs: ['single'],
    title: 'Trăm năm một người',
    text: 'Người phụ trách viện dưỡng lão hỏi tôi muốn được chôn cất ở đâu, ai sẽ lo. Tôi đã sắp xếp từ lâu, giấy tờ đầy đủ. Chị hỏi lại, vì muốn chắc tôi không đổi ý.',
    choices: [
      { label: 'Nói giữ như cũ, cảm ơn chị', effects: { happiness: 2 }, flags: ['giu_y_hau_su'],
        text: 'Chị gật đầu, ghi lại. Rồi chị ngồi xuống, hỏi tôi có muốn gửi lời gì cho ai không. Tôi đọc vài cái tên. Chị ghi lại, hứa sẽ chuyển.' },
      { label: 'Đổi ý: muốn được ở gần viện', effects: { happiness: 3 },
        text: 'Tôi nói muốn nằm ở nghĩa trang gần viện, để những người bạn ở đây có thể ghé. Chị gật đầu, nói sẽ lo. Hôm sau, mấy người bạn trong viện nói sẽ thay nhau tới thăm.' },
    ],
  },

  // ───────────── 100 tuổi ─────────────
  {
    id: 'ls100-tram-tuoi', age: 100,
    title: 'Một trăm tuổi',
    text: 'Một trăm tuổi. Chính quyền gửi tới một tấm giấy khen và một phần quà. Người thân đông đủ. Người ta hỏi tôi cảm thấy thế nào khi sống được một thế kỷ.',
    choices: [
      { label: 'Nói: “Mệt, nhưng đáng”', effects: { happiness: 4 }, flags: ['tram_tuoi_dang'],
        text: 'Cả nhà cười. Tôi nói tiếp: đáng vì có mọi người. Đứa nhỏ nhất trong họ leo lên lòng tôi, đưa tôi miếng bánh nó đã cắn dở. Tôi ăn, ngọt.' },
      { label: 'Hỏi lại mọi người thấy thế nào', effects: { happiness: 3 },
        text: 'Mọi người ngạc nhiên, rồi lần lượt kể: có người nói vui, có người nói lạ, có đứa nói “cụ già nhất thế giới”. Tôi nghe hết, cười tới chảy nước mắt.' },
    ],
  },
  {
    id: 'ls100-thu-tu-tuong-lai', age: 100,
    title: 'Hộp thời gian',
    text: 'Trường học trong xóm làm một hộp thời gian, chôn xuống đất, năm mươi năm sau mới mở. Họ mời tôi gửi vào một món đồ hoặc một lời nhắn cho người năm mươi năm nữa.',
    choices: [
      { label: 'Gửi một lá thư ngắn', effects: { happiness: 3 }, flags: ['hop_thoi_gian'],
        text: 'Đứa cháu viết giùm: “Gửi người mở hộp. Tôi sống một trăm năm. Điều tôi học được là: ngồi xuống cạnh nhau, việc gì cũng đỡ khó.” Lá thư được bỏ vào hộp, cạnh những bức vẽ của tụi nhỏ.' },
      { label: 'Gửi một hạt giống', effects: { happiness: 3 },
        text: 'Tôi gửi một hạt xoài, kèm tờ giấy: “Trồng nó.” Tụi nhỏ cười, nói năm mươi năm nữa hạt mọc sao được. Tôi nói, không mọc thì cũng là một lời nhắn.' },
    ],
  },
  {
    id: 'ls100-buoi-chieu', age: 100,
    title: 'Buổi chiều thứ ba mươi sáu nghìn',
    text: 'Đứa cháu tính ra tôi đã sống qua hơn ba mươi sáu nghìn buổi chiều. Nó hỏi tôi muốn buổi chiều hôm nay thế nào.',
    choices: [
      { label: 'Ra hiên, có người ngồi cạnh', effects: { happiness: 4 }, flags: ['chieu_ra_hien'],
        text: 'Người ta đẩy xe tôi ra hiên. Đứa cháu ngồi cạnh, không nói gì. Nắng chiều nghiêng qua bậc thềm, y như những buổi chiều hồi tôi còn nhỏ.' },
      { label: 'Nghe kể chuyện của người khác', effects: { happiness: 3 },
        text: 'Tôi nhờ đứa cháu kể chuyện ngày hôm nay của nó: đi đâu, gặp ai, ăn gì. Nó kể, tôi nghe. Một buổi chiều bình thường của nó, với tôi là một món quà.' },
    ],
  },
  {
    id: 'ls100-ban-doi-tram', age: 100, needs: ['partner'],
    title: 'Trăm năm',
    text: 'Một trăm tuổi, {tenBanDoi} vẫn ở bên cạnh. Người thân muốn chụp một tấm ảnh hai đứa, giống tấm ảnh đầu tiên chụp hồi mới quen, cùng tư thế, cùng chỗ ngồi.',
    choices: [
      { label: 'Chụp', effects: { happiness: 4 }, flags: ['anh_tram_nam'],
        text: 'Hai đứa ngồi đúng tư thế năm xưa, tay đặt lên tay. Tấm ảnh in ra, đặt cạnh tấm ảnh đầu tiên. Cách nhau gần tám mươi năm, hai đôi mắt vẫn nhìn về cùng một hướng.' },
      { label: 'Chụp kiểu mới, cười to', effects: { happiness: 4 },
        text: '{tenBanDoi} nói không cần giống, chụp kiểu gì cũng được. Hai đứa cười to, tấm ảnh nhòe vì cười. Người thân nói ảnh hỏng. Hai đứa nói đó là tấm đẹp nhất.' },
    ],
  },
  {
    id: 'ls100-mot-minh-tram', age: 100, needs: ['single'],
    title: 'Trăm tuổi một mình',
    text: 'Một trăm tuổi, sống một mình gần trọn đời. Viện dưỡng lão tổ chức mừng thọ, cả viện tới dự. Người phụ trách hỏi tôi có muốn mời ai từ bên ngoài không.',
    choices: [
      { label: 'Mời những người từng giúp mình', effects: { happiness: 4 }, flags: ['moi_nguoi_tung_giup'],
        text: 'Cậu sinh viên tình nguyện năm nào, đứa trẻ hàng xóm đọc sách, cô gái từng chăm sóc mình. Họ tới, giờ đều đã lớn tuổi. Căn phòng đầy những người tôi từng nghĩ là người lạ.' },
      { label: 'Chỉ cần mọi người trong viện', effects: { happiness: 3 },
        text: 'Cả viện hát chúc mừng, lệch tông, ồn ào. Người bạn giường bên lén đưa tôi một viên kẹo. Tôi nghĩ, gia đình đôi khi là những người nằm giường bên.' },
    ],
  },

  // ───────────── 101 tuổi ─────────────
  {
    id: 'ls101-tuoi-moi', age: 101,
    title: 'Sau một trăm',
    text: 'Qua một trăm tuổi, mỗi ngày như được thêm. Sáng nay người chăm sóc hỏi tôi có muốn ăn gì đặc biệt không. Tôi nhớ tới vị một món ăn rất đơn giản.',
    choices: [
      { label: 'Một chén cơm trắng với trứng chiên', effects: { happiness: 3 }, flags: ['com_trung_chien'],
        text: 'Người chăm sóc nấu, đút cho tôi từng miếng nhỏ. Vị trứng chiên giống hệt mâm cơm năm tôi bốn tuổi, khi bà gắp cho tôi miếng cuối cùng.' },
      { label: 'Một ly nước chè xanh', effects: { happiness: 2, health: 1 },
        text: 'Tôi nhấp một ngụm chè xanh, đắng rồi ngọt. Người chăm sóc ngồi cạnh, cũng rót một ly. Hai người uống chè, nhìn ra cửa sổ.' },
    ],
  },
  {
    id: 'ls101-ke-chuyen-cuoi', age: 101,
    title: 'Câu chuyện cho đứa bé trong họ',
    text: 'Đứa bé trong họ năm tuổi ngồi trên giường, đòi tôi kể chuyện. Tôi nói được rất ít, giọng đứt quãng. Nó vẫn ngồi chờ, mắt mở to.',
    choices: [
      { label: 'Kể chuyện con diều mắc trên cây', effects: { happiness: 4 }, flags: ['ke_dieu_cho_chut'],
        text: 'Tôi kể từng câu ngắn, nghỉ giữa chừng. Đứa bé trong họ hỏi: “Rồi lấy xuống được không?” Tôi lắc đầu. Nó buồn. Tôi nói: “Nhưng hôm sau có bạn.” Nó cười.' },
      { label: 'Để nó kể cho mình nghe', effects: { happiness: 3 },
        text: 'Đứa bé trong họ kể chuyện con chó nhà nó, chuyện ở trường mẫu giáo. Tôi nghe, gật gù. Nó kể xong, hỏi: “Hay không?” Tôi nói: “Hay nhất.”' },
    ],
  },
  {
    id: 'ls101-mua-xuan-nua', age: 101,
    title: 'Thêm một mùa xuân',
    text: 'Lại một mùa xuân. Cây mai ngoài sân nở. Người thân đẩy giường tôi ra gần cửa sổ để nhìn. Tôi đã qua hơn một trăm mùa xuân, không nhớ hết được.',
    choices: [
      { label: 'Kể về mùa xuân nhớ nhất', effects: { happiness: 3 }, flags: ['mua_xuan_nho_nhat'],
        text: 'Tôi kể về một mùa xuân năm năm tuổi, mặc áo mới, cầm phong bao lì xì chạy khắp xóm khoe. Đứa cháu nghe, hỏi tiền lì xì năm ấy tiêu vào đâu. Tôi nói, không nhớ, chỉ nhớ cái áo.' },
      { label: 'Chỉ ngắm hoa', effects: { happiness: 3 },
        text: 'Tôi nằm nhìn cây mai cả buổi. Có một cánh hoa bay vào, rơi trên chăn. Tôi không nhặt lên, để nó nằm đó tới tối.' },
    ],
  },
  {
    id: 'ls101-ban-doi', age: 101, needs: ['partner'],
    title: 'Sáng nay',
    text: 'Sáng nay {tenBanDoi} tỉnh dậy trước, nằm nhìn tôi ngủ. Khi tôi mở mắt, {tenBanDoi} nói: “Nhìn mình ngủ, giống hồi mới cưới.”',
    choices: [
      { label: 'Nói: “Mình thì vẫn đẹp như hồi ấy”', effects: { happiness: 4 }, flags: ['sang_nay_mot_tram'],
        text: '{tenBanDoi} cười, móm mém. Tôi cũng cười. Hai đứa nằm cười như hai đứa trẻ cho tới khi người chăm sóc vào, không hiểu chuyện gì.' },
      { label: 'Nắm tay, không nói gì', effects: { happiness: 3 },
        text: 'Tôi đưa tay sang, {tenBanDoi} nắm lấy. Hai đứa nằm vậy cho tới khi nắng lên. Buổi sáng trôi qua rất chậm, rất đủ.' },
    ],
  },
  {
    id: 'ls101-mot-minh', age: 101, needs: ['single'],
    title: 'Những người ghé thăm',
    text: 'Những người từng được tôi giúp, hoặc người thân của họ, thỉnh thoảng ghé thăm. Hôm nay có một người lạ tới, nói đọc được câu chuyện của tôi trên báo, muốn ngồi với tôi một lúc.',
    choices: [
      { label: 'Mời người lạ ngồi', effects: { happiness: 3 }, flags: ['nguoi_la_ghe_tham'],
        text: 'Người lạ ngồi cạnh, kể đời mình. Tôi nghe, gật đầu. Lúc về, người ấy nói: “Cảm ơn đã nghe.” Tôi nghĩ, có khi đó là việc cuối cùng mình còn làm được cho ai đó.' },
      { label: 'Nhờ người chăm sóc tiếp', effects: { health: 1 },
        text: 'Hôm nay tôi mệt, nhờ người chăm sóc ra tiếp. Người lạ để lại một bó hoa và một tờ giấy: “Chúc cụ bình an.” Tôi nhờ cắm hoa cạnh giường.' },
    ],
  },

  // ───────────── 102 tuổi ─────────────
  {
    id: 'ls102-hoi-tho', age: 102,
    title: 'Hơi thở',
    text: 'Tôi thở khó hơn, phải dùng máy thở oxy. Người thân hỏi tôi có thấy khó chịu không, có muốn tháo ra một lúc để nói chuyện không. Đeo máy thì dễ thở, nhưng khó nói.',
    choices: [
      { label: 'Tháo ra một lúc, nói vài câu', effects: { happiness: 3, health: -1 }, flags: ['thao_may_noi_chuyen'],
        text: 'Tôi nói vài câu ngắn: hỏi thăm từng người, dặn đứa cháu ăn uống đầy đủ. Nói xong, đeo máy lại, nằm thở. Mọi người ngồi quanh, như vừa nghe một bài giảng rất dài.' },
      { label: 'Giữ máy, nói bằng ánh mắt', effects: { health: 1, happiness: 2 },
        text: 'Tôi giữ máy thở, chỉ nhìn từng người, gật đầu, mỉm cười. Đứa cháu nói: “Không cần nói, con hiểu mà.” Tôi tin là nó hiểu.' },
    ],
  },
  {
    id: 'ls102-tieng-nhac', age: 102,
    title: 'Bài hát cuối',
    text: 'Người thân hỏi tôi muốn nghe bài hát nào. Có một bài tôi nghe năm mười bảy tuổi, lần đầu đi xem phim với một người. Có một bài mẹ tôi hay hát ru.',
    choices: [
      { label: 'Bài hát năm mười bảy tuổi', effects: { happiness: 3 }, flags: ['bai_hat_muoi_bay'],
        text: 'Bài hát vang lên, tôi nhắm mắt. Thấy mình mười bảy tuổi, ngồi trong rạp phim tối, tim đập mạnh. Bài hát hết, tôi mở mắt, thấy đứa cháu đang khóc.' },
      { label: 'Bài hát ru của mẹ', effects: { happiness: 3 },
        text: 'Đứa cháu tìm được bài hát ru ấy, mở rất nhỏ. Tôi nghe, ngủ thiếp đi như đứa trẻ. Khi tỉnh dậy, bài hát vẫn còn đang lặp lại, đứa cháu vẫn ngồi đó.' },
    ],
  },
  {
    id: 'ls102-lua-chon-nho', age: 102,
    title: 'Ánh đèn',
    text: 'Người chăm sóc hỏi tôi muốn để đèn sáng hay tắt khi ngủ. Tôi đã sợ bóng tối hồi hai tuổi, rồi quen, rồi thích bóng tối khi về già.',
    choices: [
      { label: 'Để một ngọn đèn nhỏ', effects: { happiness: 2 }, flags: ['den_ngu_nho'],
        text: 'Ngọn đèn nhỏ ở góc phòng, ánh vàng. Mỗi lần tỉnh giấc, tôi thấy nó, biết mình vẫn ở đây. Giống như hồi hai tuổi, nằm một mình trong chiếc giường nhỏ sát vách.' },
      { label: 'Tắt hết, nghe tiếng đêm', effects: { happiness: 2 },
        text: 'Phòng tối, nghe rõ tiếng dế, tiếng xe xa xa. Tôi nằm nghe, không sợ. Một trăm lẻ hai năm, bóng tối giờ là một người quen.' },
    ],
  },
  {
    id: 'ls102-ban-doi', age: 102, needs: ['partner'],
    title: 'Hai người nằm cạnh',
    text: '{tenBanDoi} và tôi nằm hai giường kê sát. Cả hai đều yếu, ít khi cùng tỉnh. Hôm nay hai đứa cùng tỉnh vào buổi trưa, nhìn sang nhau.',
    choices: [
      { label: 'Gọi tên {tenBanDoi}', effects: { happiness: 4 }, flags: ['goi_ten_nhau'],
        text: 'Tôi gọi tên {tenBanDoi}, giọng rất nhỏ. {tenBanDoi} nghe được, gọi lại tên tôi. Hai cái tên, gọi qua lại một lần. Rồi cùng nhắm mắt.' },
      { label: 'Đưa tay sang', effects: { happiness: 4 },
        text: 'Tôi đưa tay sang, {tenBanDoi} cũng đưa tay. Hai bàn tay chạm nhau ở giữa hai giường, không nắm được, chỉ chạm. Vậy là đủ.' },
    ],
  },
  {
    id: 'ls102-mot-minh', age: 102, needs: ['single'],
    title: 'Người ngồi cạnh',
    text: 'Viện cử một người tình nguyện ngồi cạnh tôi mỗi đêm, để tôi không một mình. Tôi không quen ai ở bên khi ngủ. Người ấy hỏi tôi có muốn họ ngồi trong phòng hay ngoài cửa.',
    choices: [
      { label: 'Ngồi trong phòng', effects: { happiness: 3 }, flags: ['nguoi_ngoi_canh_dem'],
        text: 'Người ấy ngồi ở góc, đọc sách dưới ánh đèn nhỏ. Đêm tôi tỉnh dậy, thấy người ấy vẫn ngồi đó, ngẩng lên mỉm cười. Cả đời một mình, giờ có người thức cùng.' },
      { label: 'Ngồi ngoài cửa', effects: { happiness: 2 },
        text: 'Người ấy ngồi ngoài cửa, để cửa hé. Tôi nằm nghe tiếng lật sách khe khẽ. Biết có người ngoài kia, tôi ngủ ngon hơn.' },
    ],
  },

  // ───────────── 103 tuổi ─────────────
  {
    id: 'ls103-nho-quen', age: 103,
    title: 'Nhớ và quên',
    text: 'Tôi quên gần hết những chuyện gần đây, nhưng nhớ rõ những chuyện rất xa: tiếng ba gọi, mùi áo mẹ, con diều mắc trên cây. Đứa cháu hỏi có buồn vì quên không.',
    choices: [
      { label: 'Nói: “Giữ được cái quý là đủ”', effects: { happiness: 3 }, flags: ['giu_cai_quy'],
        text: 'Tôi nói những gì còn nhớ là những gì quý nhất, những thứ khác quên cũng không sao. Đứa cháu nghe, rồi hỏi tôi nhớ gì về nó. Tôi nhớ nó hồi năm tuổi, khóc vì làm vỡ bình hoa. Nó bật cười.' },
      { label: 'Nói thật là có buồn', effects: { happiness: 2 },
        text: 'Tôi nói có buồn, vì quên cả tên những người hôm qua tới thăm. Đứa cháu nói: “Không sao, con nhớ giùm.” Từ đó nó ghi lại tên người tới thăm mỗi ngày, đọc cho tôi nghe.' },
    ],
  },
  {
    id: 'ls103-mat-troi-len', age: 103,
    title: 'Bình minh',
    text: 'Tôi tỉnh dậy trước bình minh. Người chăm sóc đang ngủ gật trên ghế. Ngoài cửa sổ, trời bắt đầu hửng sáng. Tôi muốn nhìn mặt trời lên, nhưng không tự ngồi dậy được.',
    choices: [
      { label: 'Gọi người chăm sóc dậy', effects: { happiness: 3 }, flags: ['ngam_binh_minh'],
        text: 'Người chăm sóc giật mình, rồi đỡ tôi ngồi lên. Hai người cùng nhìn mặt trời lên, đỏ rực rồi vàng dần. Người chăm sóc nói lâu lắm rồi mới ngắm bình minh.' },
      { label: 'Nằm, nhìn trần nhà sáng dần', effects: { happiness: 2 },
        text: 'Tôi để người chăm sóc ngủ. Nằm nhìn trần nhà từ xám thành hồng rồi thành trắng. Không cần thấy mặt trời, chỉ cần thấy ánh sáng tới.' },
    ],
  },
  {
    id: 'ls103-tieng-goi-ten', age: 103,
    title: 'Ai gọi tên mình',
    text: 'Tôi nghe như có ai gọi tên mình bằng cái tên ở nhà hồi bé, cái tên không ai còn gọi từ tám mươi năm nay. Đứa cháu ngồi cạnh hỏi tôi đang nghe gì.',
    choices: [
      { label: 'Kể cho cháu nghe cái tên ấy', effects: { happiness: 3 }, flags: ['ten_o_nha'],
        text: 'Tôi nói cái tên ở nhà của mình. Đứa cháu nhắc lại, gọi thử. Nghe giọng nó gọi, tôi cười, như vừa được ai đó đón về.' },
      { label: 'Nói: “Có người gọi về ăn cơm”', effects: { happiness: 2 },
        text: 'Đứa cháu nắm tay tôi, nói: “Vậy thì cứ thong thả, cơm còn để phần.” Tôi gật đầu, nhắm mắt nghỉ.' },
    ],
  },
  {
    id: 'ls103-ban-doi', age: 103, needs: ['partner'],
    title: 'Lời chúc ngủ ngon',
    text: 'Mỗi tối, suốt gần tám mươi năm, hai đứa luôn nói với nhau một câu chúc ngủ ngon. Tối nay {tenBanDoi} đã ngủ trước khi kịp nói. Tôi nằm đó, chưa ngủ được.',
    choices: [
      { label: 'Nói khẽ lời chúc', effects: { happiness: 3 }, flags: ['chuc_ngu_ngon'],
        text: 'Tôi nói khẽ: “Ngủ ngon.” {tenBanDoi} cựa mình, ậm ừ đáp lại trong giấc ngủ. Tôi cười, nhắm mắt. Tám mươi năm, chưa lần nào bỏ.' },
      { label: 'Chờ sáng mai nói bù', effects: { happiness: 2 },
        text: 'Sáng hôm sau, {tenBanDoi} tỉnh dậy, câu đầu tiên là: “Tối qua quên chúc ngủ ngon.” Tôi nói: “Chúc bù bằng chào buổi sáng đi.” Hai đứa cười.' },
    ],
  },
  {
    id: 'ls103-mot-minh', age: 103, needs: ['single'],
    title: 'Danh sách những người đã thương',
    text: 'Người chăm sóc đọc cho tôi nghe danh sách những người tôi từng nhờ ghi vào sổ: những người đã thương mình, những người mình đã thương. Danh sách dài hơn tôi nhớ.',
    choices: [
      { label: 'Nhờ đọc hết, từng tên một', effects: { happiness: 4 }, flags: ['danh_sach_thuong'],
        text: 'Người chăm sóc đọc chậm, tôi nghe, mỗi cái tên nhớ ra một khuôn mặt. Có tên tôi đã quên, nghe lại thì nhớ. Đọc hết, tôi nói: “Một mình mà đông người ghê.”' },
      { label: 'Nhờ đọc một tên mỗi ngày', effects: { happiness: 3 },
        text: 'Mỗi ngày một cái tên. Tôi nghĩ về người đó cả ngày. Như được gặp lại từng người, chậm rãi, không vội.' },
    ],
  },

  // ───────────── 104 tuổi ─────────────
  {
    id: 'ls104-mot-ngay-nua', age: 104,
    title: 'Một ngày nữa',
    text: 'Sáng nay tôi tỉnh dậy, thấy mình vẫn ở đây. Một trăm lẻ bốn tuổi. Người chăm sóc chào buổi sáng. Tôi nghĩ hôm nay mình muốn nói một câu với ai đó.',
    choices: [
      { label: 'Nói “cảm ơn” với người chăm sóc', effects: { happiness: 3 }, flags: ['cam_on_nguoi_cham'],
        text: 'Người chăm sóc khựng lại, rồi mỉm cười, nói: “Cảm ơn gì cơ?” Tôi nói: “Vì hôm nay.” Người ấy ngồi xuống cạnh giường, nắm tay tôi một lúc lâu.' },
      { label: 'Nhờ gọi điện cho người thân', effects: { happiness: 3 },
        text: 'Đứa cháu nghe máy, tôi nói: “Khỏe không con?” Nó nói khỏe, hỏi lại tôi. Tôi nói khỏe. Hai bên cùng cười, như mọi cuộc gọi khác.' },
    ],
  },
  {
    id: 'ls104-tre-con-hoi', age: 104,
    title: 'Câu hỏi của đứa bé trong họ',
    text: 'Đứa bé trong họ bảy tuổi hỏi tôi: “Sống lâu như vậy có chán không?” Người lớn kéo nó lại. Nó vẫn nhìn tôi, rất nghiêm túc.',
    choices: [
      { label: 'Nói: “Không chán, vì có con”', effects: { happiness: 4 }, flags: ['khong_chan_vi_con'],
        text: 'Đứa bé trong họ cười rạng rỡ, như vừa được khen. Nó leo lên giường, nằm cạnh tôi, kể chuyện ở trường. Tôi nghe tiếng nó, ngủ thiếp đi lúc nào không hay.' },
      { label: 'Nói: “Có lúc chán, có lúc vui”', effects: { happiness: 3 },
        text: 'Nó hỏi lúc nào vui. Tôi nói, lúc có người hỏi những câu như con vừa hỏi. Nó gật gù, như đã hiểu, rồi chạy đi kể với mọi người.' },
    ],
  },
  {
    id: 'ls104-nhin-lai', age: 104,
    title: 'Nhìn lại',
    text: 'Đứa cháu hỏi: nếu được nói một câu với chính mình năm bốn tuổi, đứa trẻ còn rụt rè đứng sau cổng nhà, tôi sẽ nói gì.',
    choices: [
      { label: '“Cứ mạnh dạn bước ra”', effects: { happiness: 4 }, flags: ['noi_voi_minh_bon_tuoi'],
        text: 'Đứa cháu hỏi vì sao. Tôi nói, những người bạn tốt nhất đời mình đều bắt đầu từ một lần có ai đó dám bước sang trước. Nó nghe xong, nói: “Vậy là đáng bước.”' },
      { label: '“Không cần vội”', effects: { happiness: 3 },
        text: 'Tôi nói: không cần vội, mọi chuyện sẽ tới. Đứa cháu gật đầu, nhắc lại câu ấy. Tôi nghĩ có lẽ nó đang nói với chính nó hơn là với đứa trẻ bốn tuổi ngày xưa.' },
    ],
  },
  {
    id: 'ls104-ban-doi', age: 104, needs: ['partner'],
    title: 'Tám mươi năm',
    text: '{tenBanDoi} vẫn ở đây, như suốt gần tám mươi năm qua. Hôm nay {tenBanDoi} hỏi: “Nếu được chọn lại từ đầu, mình có chọn nhau nữa không?” Câu hỏi năm bốn mươi tuổi đã từng hỏi.',
    choices: [
      { label: 'Nói: “Có, không sửa chỗ nào”', effects: { happiness: 4 }, flags: ['chon_lai_khong_sua'],
        text: '{tenBanDoi} nhìn tôi, cười: “Năm bốn mươi mình nói muốn sửa vài chỗ.” Tôi nói: “Giờ thì thấy chỗ nào cũng đúng.” {tenBanDoi} siết tay tôi, rất nhẹ.' },
      { label: 'Hỏi lại {tenBanDoi}', effects: { happiness: 4 },
        text: '{tenBanDoi} nghĩ một lúc lâu, rồi nói: “Có. Nhưng lần này cưới sớm hơn một năm.” Hai đứa cười, như hai đứa trẻ vừa nghĩ ra một trò chơi mới.' },
    ],
  },
  {
    id: 'ls104-mot-minh', age: 104, needs: ['single'],
    title: 'Một mình mà không một mình',
    text: 'Cả đời sống một mình, giờ quanh giường tôi có người chăm sóc, người tình nguyện, mấy đứa cháu họ, người bạn giường bên. Người chăm sóc hỏi tôi có hối tiếc vì sống một mình không.',
    choices: [
      { label: 'Nói: “Không, vì chưa bao giờ thật sự một mình”', effects: { happiness: 4 }, flags: ['chua_bao_gio_mot_minh'],
        text: 'Tôi nhìn quanh phòng, đếm từng người. Người chăm sóc nghe, gật đầu, rồi ngồi xuống cạnh tôi. Buổi chiều đó, phòng tôi đông như một ngày Tết.' },
      { label: 'Nói: “Có, nhưng không nhiều”', effects: { happiness: 3 },
        text: 'Tôi kể về một người năm xưa, một con đường không đi. Người chăm sóc nghe, không nói gì. Kể xong, tôi thấy nhẹ, như vừa đặt xuống một chiếc lá.' },
    ],
  },
];
