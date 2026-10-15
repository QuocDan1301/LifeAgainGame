 
 
 
export const stage01To14Extra = [
   
  {
    id: 'ls01-buoc-dau', age: 1,
    title: 'Những bước đầu tiên',
    text: 'Tôi vịn mép bàn đứng dậy, bước được hai bước thì chựng lại giữa nhà. Bà ngồi ở bậc cửa, dang tay chờ. Cái ghế đẩu ở ngay bên cạnh, chỉ cần vươn tay là bám được. Tôi đứng chênh vênh, nhìn bà rồi nhìn cái ghế.',
    choices: [
      { label: 'Bước tiếp về phía bà', effects: { happiness: 2, health: -1 },
        text: 'Tôi bước thêm ba bước rồi ngã sấp, trán cụng xuống nền. Bà ôm tôi dỗ mãi. Hôm sau tôi lại đứng dậy, đi thẳng một mạch tới bậc cửa.' },
      { label: 'Bám lấy cái ghế', effects: { health: 1, happiness: -1 },
        text: 'Tôi bám ghế rồi ngồi phịch xuống, không ngã. Bà cười, thu tay về. Phải gần một tháng sau tôi mới chịu buông tay đi một mình.' },
    ],
  },
  {
    id: 'ls01-tieng-sam', age: 1,
    title: 'Tiếng sấm trên mái',
    text: 'Chiều đó trời đổ mưa, sấm nổ ngay trên mái tôn. Tôi đang chơi trên chiếu thì giật mình ngồi im. Bà đang nấu cơm dưới bếp, gọi vọng lên hỏi tôi có sao không. Tiếng sấm lại rền thêm lần nữa, tôi nhìn về phía cửa bếp.',
    choices: [
      { label: 'Bò xuống bếp tìm bà', effects: { happiness: 2, health: -1 },
        text: 'Tôi bò xuống bậc bếp, trầy cả đầu gối. Bà bỏ nồi cơm, bế tôi ngồi cạnh bếp lửa tới khi tạnh mưa. Bữa cơm hôm ấy hơi khét.' },
      { label: 'Ngồi yên nghe mưa', effects: { intelligence: 1, happiness: -1 },
        text: 'Tôi ngồi yên, mắt mở to nhìn lên mái. Lâu dần tiếng mưa đều đều, tôi ngủ thiếp đi trên chiếu. Bà lên đắp chăn, thấy tay tôi vẫn còn nắm chặt.' },
    ],
  },

   
  {
    id: 'ls02-doi-dep', age: 2,
    title: 'Đôi dép tự xỏ',
    text: 'Tôi đòi tự xỏ dép như người lớn. Đôi dép mới hơi chật, tôi loay hoay mãi vẫn xỏ ngược. Bà đứng chờ ở cửa để dắt tôi ra chợ, mà chợ sắp tan. Bà cúi xuống, định xỏ giúp tôi cho nhanh.',
    choices: [
      { label: 'Gạt tay bà, tự xỏ', effects: { intelligence: 2, happiness: -1 },
        text: 'Tôi gạt tay bà, xỏ thêm mấy lần mới đúng. Ra tới chợ thì hàng rau đã dọn. Bà mua tạm bó rau héo, vẫn khen tôi giỏi.' },
      { label: 'Để bà xỏ giúp', effects: { happiness: 2 },
        text: 'Bà xỏ dép cho tôi trong chớp mắt, hai bà cháu ra chợ kịp mua cá tươi. Về nhà tôi tháo dép ra, ngồi xỏ đi xỏ lại một mình cả buổi chiều.' },
    ],
  },
  {
    id: 'ls02-hat-ru', age: 2,
    title: 'Bài hát ru',
    text: 'Tối nào bà cũng hát ru tôi bằng một bài rất cũ. Tối nay bà ho nhiều, giọng khàn đặc, hát được nửa bài thì dừng lại thở. Tôi vẫn chưa ngủ, mắt mở thao láo nhìn bà, chờ bà hát tiếp.',
    choices: [
      { label: 'Đòi bà hát tiếp', effects: { happiness: 2 },
        text: 'Bà uống ngụm nước rồi hát tiếp tới khi tôi ngủ. Nửa đêm tiếng ho của bà vọng qua vách, lâu lắm mới dứt.' },
      { label: 'Quay vào, tự nhắm mắt', effects: { health: 1, happiness: -1 },
        text: 'Tôi quay vào vách, nhắm mắt. Bà xoa lưng tôi, không hát nữa. Đêm đó bà ngủ sớm, còn tôi trằn trọc rất lâu mới ngủ được.' },
    ],
  },

   
  {
    id: 'ls03-ly-vo', age: 3,
    title: 'Cái ly vỡ',
    text: 'Tôi với lấy ly nước trên bàn, ly rơi xuống nền vỡ tan. Trong nhà chưa ai thấy, chỉ có đứa em họ đang ngồi chơi gần đó. Tiếng bước chân người lớn đang đi từ bếp lên. Tôi đứng nhìn mảnh vỡ, rồi nhìn cửa buồng.',
    choices: [
      { label: 'Đứng yên chờ người lớn', effects: { intelligence: 1, happiness: -2 },
        text: 'Bà bước vào, thấy tôi đứng cạnh mảnh vỡ. Bà bế tôi ra xa rồi mới quét, dặn lần sau gọi người lớn. Tôi ngồi thút thít một lúc lâu.' },
      { label: 'Chạy trốn vào buồng', effects: { happiness: 1, health: -1 },
        text: 'Tôi chạy vào buồng, giẫm phải một mảnh nhỏ. Bà tưởng em họ làm vỡ, đã mắng nó một câu. Tối đó bà rửa chân cho tôi, thấy vết xước, nhìn tôi rất lâu.' },
    ],
  },
  {
    id: 'ls03-cho-tet', age: 3,
    title: 'Quả bóng ở chợ Tết',
    text: 'Bà dắt tôi đi chợ Tết, người chen nhau đông nghẹt. Tôi đứng lại trước sạp bóng bay, mắt dán vào quả bóng hình con cá. Bà chỉ còn đủ tiền mua mâm ngũ quả, nên kéo tay tôi bảo phải đi tiếp.',
    choices: [
      { label: 'Ngồi bệt xuống khóc', effects: { happiness: 2 },
        text: 'Bà thở dài, mua quả bóng cho tôi. Mâm ngũ quả năm ấy thiếu nải chuối. Tôi cầm bóng đi suốt buổi, không biết chuyện ấy.' },
      { label: 'Nắm tay bà đi tiếp', effects: { intelligence: 1, happiness: -1 },
        text: 'Tôi nắm tay bà đi tiếp, ngoái lại mấy lần. Về nhà, bà lấy giấy màu gấp cho tôi một con cá, treo ở đầu giường. Nó không bay được.' },
    ],
  },

   
  {
    id: 'ls04-lop-mau-giao', age: 4,
    title: 'Buổi sáng ở lớp mẫu giáo',
    text: 'Ngày đầu đi mẫu giáo, cô giáo đón tôi ở cửa lớp. Trong lớp mấy bạn đang khóc, một bạn ngồi xếp hình một mình ở góc. Bà vẫn đứng ngoài cổng chưa về. Cô nắm tay tôi, hỏi tôi muốn vào ngồi với ai.',
    choices: [
      { label: 'Chạy ra cổng với bà', effects: { happiness: 1, intelligence: -1 },
        text: 'Tôi giật tay cô, chạy ra cổng. Bà đành dắt tôi về. Hôm sau tôi vẫn phải đi, lần này cô phải bế tôi vào từ tay bà.' },
      { label: 'Ngồi xếp hình cùng bạn', effects: { intelligence: 2, happiness: -1 },
        text: 'Tôi ngồi xuống cạnh bạn ở góc. Hai đứa xếp hình không nói câu nào. Lúc bà đến đón, tôi mới òa khóc vì nhớ bà cả buổi.' },
    ],
  },
  {
    id: 'ls04-ga-con', age: 4,
    title: 'Con gà con',
    text: 'Hàng xóm cho tôi một con gà con lông vàng. Tôi bỏ nó vào hộp giấy, cả ngày ngồi canh. Tối đến bà bảo phải thả nó về ổ với gà mẹ, vì để trong hộp nó sẽ lạnh. Tôi ôm cái hộp, không muốn buông.',
    choices: [
      { label: 'Đem gà con về ổ', effects: { intelligence: 1, happiness: -1 },
        text: 'Tôi theo bà đặt nó vào ổ, gà mẹ xòe cánh ủ nó ngay. Sáng nào tôi cũng sang nhìn, rồi không còn biết con nào là con của mình nữa.' },
      { label: 'Giữ hộp bên giường', effects: { happiness: 1, health: -1 },
        text: 'Tôi đặt hộp cạnh giường, đắp khăn cho nó. Nửa đêm nó kêu mãi, cả nhà mất ngủ. Sáng ra nó vẫn khỏe, nhưng bà dặn tối nay nhất định phải trả.' },
    ],
  },

   
  {
    id: 'ls05-bat-com', age: 5,
    title: 'Nửa bát cơm',
    text: 'Bữa trưa tôi ăn được nửa bát thì no. Bà kể ngày xưa cả nhà phải ăn độn khoai, hạt cơm nào cũng quý. Ngoài sân lũ bạn đang gọi tôi ra chơi đá bóng. Bát cơm trước mặt vẫn còn một nửa.',
    choices: [
      { label: 'Ăn cố cho hết', effects: { health: 1, happiness: -1 },
        text: 'Tôi ăn cố, nuốt từng miếng. Ra sân thì bụng nặng, chạy không nổi, đứng làm thủ môn cả buổi. Bà dọn bát, gật đầu.' },
      { label: 'Chạy ra sân chơi', effects: { happiness: 2 },
        text: 'Tôi buông đũa chạy ra sân. Bà trút phần cơm thừa cho gà, không nói gì. Từ bữa tối, bà xới cho tôi bát nhỏ hơn, vừa đủ ăn.' },
    ],
  },
  {
    id: 'ls05-but-mau', age: 5,
    title: 'Cây bút màu đỏ',
    text: 'Bạn ngồi cạnh tôi ở lớp mẫu giáo làm gãy cây bút màu đỏ duy nhất của mình. Cô giao vẽ ông mặt trời. Hộp bút của tôi còn đủ mười hai cây, cây đỏ mới tinh. Bạn ấy cứ nhìn sang hộp bút của tôi.',
    choices: [
      { label: 'Cho bạn mượn cây đỏ', effects: { happiness: 2 },
        text: 'Bạn tô mặt trời rất to, tô hết gần nửa cây bút. Tranh của tôi chỉ còn mặt trời nhạt màu. Cô vẫn treo tranh tôi lên bảng, ngay cạnh tranh bạn.' },
      { label: 'Kéo hộp bút về phía mình', effects: { intelligence: 1, happiness: -1 },
        text: 'Bạn tô mặt trời bằng màu cam. Tranh của tôi được cô khen màu đẹp. Giờ ra chơi bạn ấy sang chơi với nhóm khác.' },
    ],
  },

   
  {
    id: 'ls06-bang-den', age: 6,
    title: 'Chữ đầu tiên trên bảng',
    text: 'Ngày đầu vào lớp một, cô gọi tôi lên bảng viết chữ “a”. Phấn trơn, tay tôi run, nét đầu tiên lệch hẳn khỏi dòng kẻ. Cả lớp đang nhìn lên. Cô đưa khăn lau, bảo tôi muốn viết lại hay về chỗ cũng được.',
    choices: [
      { label: 'Xin viết lại', effects: { intelligence: 2, happiness: -1 },
        text: 'Tôi lau đi, viết lại lần nữa, vẫn lệch nhưng tròn hơn. Có bạn cười khúc khích. Cô cho tôi điểm tốt, tôi về chỗ mặt nóng bừng.' },
      { label: 'Về chỗ ngồi', effects: { happiness: 1 },
        text: 'Tôi đặt phấn xuống, đi về chỗ. Cô gọi bạn khác lên. Cả buổi tôi viết chữ “a” kín một trang vở nháp, giấu dưới ngăn bàn.' },
    ],
  },
  {
    id: 'ls06-ao-dong-phuc', age: 6,
    title: 'Chiếc áo đồng phục cũ',
    text: 'Áo đồng phục của tôi là áo cũ anh họ để lại, cổ đã ngả vàng. Bạn bàn trên hỏi sao áo tôi khác màu. Tối đó bà bảo có thể mua áo mới, nhưng như vậy đôi giày đã há mõm phải đi thêm một năm nữa.',
    choices: [
      { label: 'Xin mua áo mới', effects: { appearance: 2, happiness: -1 },
        text: 'Bà mua áo mới. Đôi giày cũ há mõm thêm cả năm, mưa xuống là nước vào lạnh buốt. Áo thì trắng tinh, không ai hỏi nữa.' },
      { label: 'Xin mua giày mới', effects: { happiness: 1, appearance: -1 },
        text: 'Bà ngâm áo với chanh, giặt tới khuya, cổ áo vẫn hơi vàng. Tôi có đôi giày mới, đi đâu cũng cúi nhìn. Bạn bàn trên không hỏi lại nữa.' },
    ],
  },

   
  {
    id: 'ls07-cham-nham', age: 7,
    title: 'Bài kiểm tra chấm nhầm',
    text: 'Cô trả bài kiểm tra, tôi được điểm mười. Nhìn kỹ, tôi thấy một câu mình làm sai mà cô vẫn chấm đúng. Bạn bên cạnh làm đúng câu đó nhưng chỉ được chín vì sai câu khác. Cô đang đi xuống cuối lớp, tôi cầm bài chưa cất.',
    choices: [
      { label: 'Giơ tay báo cô', effects: { intelligence: 1, happiness: -1 },
        text: 'Cô sửa thành chín điểm và nhắc tên tôi trước lớp. Giờ ra chơi, vài bạn bảo tôi ngốc. Tối về tôi cất bài vào cặp, không đưa ai xem.' },
      { label: 'Cất bài vào cặp', effects: { happiness: 2, intelligence: -1 },
        text: 'Tối đó tôi được khen, được thưởng que kem. Câu làm sai ấy tôi vẫn không hiểu vì sao sai, tới bài sau lại sai đúng chỗ đó.' },
    ],
  },
  {
    id: 'ls07-ban-moi', age: 7,
    title: 'Bạn mới ở bàn cuối',
    text: 'Lớp có một bạn mới chuyển đến, nói giọng vùng khác, ngồi một mình ở bàn cuối. Giờ ra chơi, nhóm bạn thân rủ tôi đi nhảy dây như mọi ngày. Bạn mới vẫn ngồi trong lớp, cầm hộp xôi chưa mở. Tôi đứng ở cửa lớp, chưa biết đi đâu.',
    choices: [
      { label: 'Ngồi với bạn mới', effects: { intelligence: 2, happiness: -1 },
        text: 'Hai đứa chia nhau hộp xôi, bạn kể quê mình có con sông rất rộng. Hôm sau nhóm nhảy dây đã đủ người, không ai rủ tôi nữa.' },
      { label: 'Chạy ra nhảy dây', effects: { happiness: 2 },
        text: 'Tôi nhảy dây tới khi trống vào lớp. Đi ngang cửa sổ, tôi thấy bạn mới đang ăn xôi một mình. Mấy tuần sau bạn ấy đã có nhóm khác.' },
    ],
  },

   
  {
    id: 'ls08-tien-thoi', age: 8,
    title: 'Tiền thối dư',
    text: 'Bà sai tôi ra tiệm tạp hóa mua chai nước mắm để nấu canh. Chủ tiệm đang mải nói điện thoại, thối dư cho tôi hai chục nghìn. Ra tới cửa tôi mới đếm lại tiền. Ở nhà, nồi canh của bà đang chờ.',
    choices: [
      { label: 'Quay vào trả lại', effects: { intelligence: 1, happiness: -1 },
        text: 'Tôi đứng chờ chủ tiệm nói chuyện xong mới trả được. Về tới nhà, canh đã sôi lâu, bà phải nêm tạm muối. Bà nghe chuyện, gật đầu, tiếp tục nhặt rau.' },
      { label: 'Chạy về đưa bà', effects: { happiness: 1 },
        text: 'Tôi chạy về đưa cả tiền lẫn chai nước mắm, canh kịp nêm. Bà bảo chiều sẽ mang trả, rồi quên mất. Tờ hai chục nghìn nằm trên nóc tủ cả tháng.' },
    ],
  },
  {
    id: 'ls08-diem-kem', age: 8,
    title: 'Chữ ký cho bài điểm bốn',
    text: 'Tôi bị điểm bốn môn toán, cô dặn mang về xin chữ ký người nhà, sáng mai phải nộp. Tối nay bà mệt, đã đi nằm sớm. Tôi cầm tờ bài kiểm tra đứng trước cửa buồng bà, nghe tiếng bà trở mình.',
    choices: [
      { label: 'Gõ cửa gọi bà dậy', effects: { intelligence: 2, happiness: -1 },
        text: 'Bà ngồi dậy, đeo kính, đọc từng câu sai. Bà ký, rồi bắt tôi làm lại hai bài tới khuya. Sáng ra bà dậy muộn hơn thường lệ.' },
      { label: 'Để sáng mai xin', effects: { happiness: 1, intelligence: -1 },
        text: 'Sáng ra tôi dậy trễ, quên luôn chuyện chữ ký. Cô ghi tên tôi vào sổ. Chiều về tôi mới đưa bài, bà ký mà không hỏi gì.' },
    ],
  },

   
  {
    id: 'ls09-tuot-xich', age: 9,
    title: 'Tuột xích giữa đường',
    text: 'Xích xe đạp của tôi tuột giữa đường đi học về. Trời sắp mưa, nhà còn xa. Tiệm sửa xe ven đường bảo sửa mất mười nghìn, đúng số tiền ăn sáng tôi để dành cả tuần. Tôi nhìn trời, rồi nhìn sợi xích lòng thòng.',
    choices: [
      { label: 'Trả tiền sửa xe', effects: { happiness: 1, health: -1 },
        text: 'Xe sửa xong trong năm phút, tôi về kịp trước cơn mưa. Cả tuần sau tôi nhịn ăn sáng, tới tiết bốn bụng sôi liên hồi.' },
      { label: 'Tự lắp xích', effects: { intelligence: 2, happiness: -1 },
        text: 'Tôi ngồi xổm lắp xích, tay đen nhẻm, tuột thêm hai lần mới vào. Mưa đổ xuống giữa đường, tôi về tới nhà ướt sũng nhưng đã biết cách lắp xích.' },
    ],
  },
  {
    id: 'ls09-tranh-du-thi', age: 9,
    title: 'Một suất dự thi',
    text: 'Lớp chọn tranh đi thi vẽ của trường. Tranh của tôi và tranh của Hà, bạn cùng tổ, được cô giữ lại sau cùng, nhưng chỉ có một suất. Hà là người đã cho tôi mượn hộp màu nước để vẽ bức tranh ấy. Cô hỏi riêng hai đứa, ai muốn nhường.',
    choices: [
      { label: 'Nhường cho Hà', effects: { happiness: 2 },
        text: 'Tranh của Hà được giải ba của trường. Hà đem giấy khen khoe khắp lớp, rồi dúi cho tôi hộp màu nước ấy, bảo tặng luôn.' },
      { label: 'Nhận suất dự thi', effects: { intelligence: 2, happiness: -1 },
        text: 'Tranh của tôi không đoạt giải, nhưng tôi được vào câu lạc bộ vẽ của trường. Hà vẫn chơi với tôi, chỉ không nhắc lại hộp màu nữa.' },
    ],
  },

   
  {
    id: 'ls10-truc-nhat', age: 10,
    title: 'Phiên trực nhật',
    text: 'Hôm nay tới phiên tổ tôi trực nhật. Ba bạn trong tổ đã trốn về sớm đi đá bóng, chỉ còn tôi và một bạn nữa. Lớp học bừa bộn, cô chủ nhiệm sẽ kiểm tra lúc năm giờ. Bạn còn lại nhìn tôi hỏi giờ tính sao.',
    choices: [
      { label: 'Ở lại dọn cho xong', effects: { intelligence: 1, happiness: -1 },
        text: 'Hai đứa quét lớp, lau bảng, kê bàn tới gần năm giờ. Cô ghi tổ tôi đạt, ba bạn kia không bị gì. Tôi về nhà muộn, cơm đã nguội.' },
      { label: 'Báo cô ba bạn trốn', effects: { happiness: 1 },
        text: 'Ba bạn kia phải trực nhật bù cả tuần. Từ đó, đá bóng giờ ra chơi, không đứa nào chuyền bóng cho tôi nữa.' },
    ],
  },
  {
    id: 'ls10-truyen-uot', age: 10,
    title: 'Cuốn truyện bị ướt',
    text: 'Tôi mượn cuốn truyện tranh của bạn cùng bàn, lỡ làm đổ nước ngọt lên, mấy trang giấy phồng cong. Mai phải trả. Nhà sách đầu đường có bán cuốn mới, giá bằng số tiền tôi dành dụm để mua quà sinh nhật cho bà.',
    choices: [
      { label: 'Mua cuốn mới trả bạn', effects: { intelligence: 1, happiness: -1 },
        text: 'Tôi trả cuốn mới, kể thật chuyện đổ nước. Bạn nhận, còn cho tôi giữ cuốn cũ. Sinh nhật bà năm ấy, tôi tự làm một tấm thiệp bằng giấy bìa.' },
      { label: 'Trả lại, xin lỗi bạn', effects: { happiness: 1 },
        text: 'Bạn lật mấy trang phồng giấy, im lặng một lúc rồi bảo thôi. Tuần sau bạn xin đổi chỗ ngồi. Sinh nhật bà, tôi mua được chiếc khăn len màu xám.' },
    ],
  },

   
  {
    id: 'ls11-doi-bong', age: 11,
    title: 'Đội bóng của lớp',
    text: 'Lớp chọn đội đá bóng thi với lớp bên, tôi được chọn đá chính. Nhưng buổi tập trùng giờ học thêm toán mà nhà đã đóng tiền cả tháng. Đội trưởng nói nếu tôi bỏ tập thì sẽ để người khác thay. Chiều nay là buổi tập đầu tiên.',
    choices: [
      { label: 'Đi tập bóng', effects: { health: 2, happiness: 1, intelligence: -2 },
        text: 'Tôi bỏ học thêm đi tập, lớp tôi thắng hai một. Cuối tháng cô dạy thêm gọi điện về hỏi, tôi bị bà mắng một trận và cắt tiền ăn sáng.' },
      { label: 'Đi học thêm', effects: { intelligence: 2, happiness: -1 },
        text: 'Tôi nhường chỗ cho bạn khác. Chiều thi đấu, tôi ngồi lớp học thêm nghe tiếng reo bên sân. Bài kiểm tra tuần sau tôi được chín điểm.' },
    ],
  },
  {
    id: 'ls11-bi-mat-ban', age: 11,
    title: 'Điều bạn dặn giữ kín',
    text: 'Bạn thân kể với tôi rằng nhà bạn sắp bán để về quê, dặn không được nói với ai. Hôm nay cả nhóm bàn chuyến cắm trại hè, chia nhau góp tiền, phần của bạn ấy nhiều nhất. Bạn ấy ngồi im, không phản đối. Cả nhóm quay sang hỏi ý tôi.',
    choices: [
      { label: 'Đề nghị chia đều lại', effects: { intelligence: 2, happiness: -1 },
        text: 'Tôi viện cớ phần ấy nhiều quá, đề nghị chia đều. Một bạn hỏi vặn sao tôi lo cho phần người khác, tôi lúng túng mãi. Bạn thân nhìn tôi, không nói gì.' },
      { label: 'Gật đầu cho qua', effects: { happiness: 1 },
        text: 'Bạn ấy góp đủ phần mình, tới sát ngày thì báo bận. Tiền đã chi, không lấy lại được. Tôi vẫn giữ kín chuyện bạn dặn.' },
    ],
  },

   
  {
    id: 'ls12-don-ca', age: 12,
    title: 'Tiết mục đơn ca',
    text: 'Lớp cần một người hát đơn ca trong buổi văn nghệ cuối năm. Cô chọn tôi vì giọng khá, nhưng tôi đang vỡ giọng, nói còn khàn. Một bạn khác xin được hát thay. Trước giờ ra về, cô hỏi tôi quyết định thế nào.',
    choices: [
      { label: 'Vẫn nhận hát', effects: { intelligence: 2, happiness: -2 },
        text: 'Tôi tập mỗi tối. Hôm diễn, tới câu cao tôi lạc giọng, cả hội trường cười ồ. Tôi vẫn hát hết bài. Cô đứng ở cánh gà, bắt tay tôi.' },
      { label: 'Nhường bạn hát', effects: { happiness: 1 },
        text: 'Bạn ấy hát trọn vẹn, được tặng hoa. Tôi ngồi hàng ghế dưới, vỗ tay cùng mọi người, môi khẽ hát theo từng câu.' },
    ],
  },
  {
    id: 'ls12-noi-xau', age: 12,
    title: 'Câu chuyện sau lưng Lý',
    text: 'Trong nhóm bạn, một đứa bắt đầu nói xấu Lý, bạn từng ngồi cùng bàn với tôi năm trước. Cả nhóm cười theo. Lý đi ngang qua, nghe được câu cuối, đứng lại nhìn chúng tôi. Mọi người quay sang chờ tôi nói gì.',
    choices: [
      { label: 'Nói Lý không như vậy', effects: { intelligence: 1, happiness: -2 },
        text: 'Không khí chùng xuống. Hôm sau nhóm đi ăn chè không rủ tôi. Lý gật đầu chào tôi ở cổng trường, vẫn ít nói như cũ.' },
      { label: 'Nhìn xuống, im lặng', effects: { happiness: 1 },
        text: 'Lý bỏ đi. Nhóm vẫn rủ tôi đi ăn chè như mọi chiều. Nhiều năm sau gặp lại Lý ở một đám cưới, hai đứa chỉ gật đầu chào nhau.' },
    ],
  },

   
  {
    id: 'ls13-dien-thoai-cu', age: 13,
    title: 'Chiếc điện thoại cũ ở chợ',
    text: 'Cả lớp đã có điện thoại, chỉ tôi còn chưa có, nên bài tập nhóm thường tới tay tôi muộn nhất. Ở chợ có người bán lại điện thoại cũ, giá đúng bằng số tiền tôi dành dụm hai năm để mua xe đạp đi học cấp ba.',
    choices: [
      { label: 'Mua điện thoại', effects: { happiness: 2, health: -1 },
        text: 'Tôi vào được nhóm lớp, đêm nào cũng nhắn tin tới khuya. Năm sau tôi vẫn đi bộ ba cây số tới trường, sáng nào cũng phải dậy sớm hơn mọi người.' },
      { label: 'Giữ tiền mua xe', effects: { health: 1, happiness: -1 },
        text: 'Có lần tôi lỡ cả buổi họp nhóm vì không ai báo kịp. Năm sau tôi có chiếc xe đạp, đạp tới trường chỉ mất mười phút.' },
    ],
  },
  {
    id: 'ls13-thuyet-trinh', age: 13,
    title: 'Bài thuyết trình nhóm',
    text: 'Nhóm tôi được giao làm bài thuyết trình môn sử. Hai bạn trong nhóm không làm phần nào, tối trước buổi nộp vẫn im lặng. Tôi có thể thức làm nốt phần của họ, hoặc chỉ nộp phần mình kèm tờ ghi rõ ai làm gì.',
    choices: [
      { label: 'Thức làm nốt', effects: { intelligence: 2, health: -2 },
        text: 'Tôi làm tới hai giờ sáng. Nhóm được điểm chín, cả bốn đứa như nhau. Tiết đầu hôm sau tôi ngủ gục, bị nhắc tên.' },
      { label: 'Ghi rõ ai làm gì', effects: { intelligence: 1, health: 1, happiness: -2 },
        text: 'Cô chấm điểm riêng từng người. Hai bạn kia giận, cả tháng không nói chuyện với tôi trong giờ ra chơi.' },
    ],
  },

   
  {
    id: 'ls14-bong-ro', age: 14,
    title: 'Đội bóng rổ hay giờ ôn thi',
    text: 'Còn ba tháng nữa thi vào lớp mười. Bạn thân rủ tôi vào đội bóng rổ của trường đi thi giải thành phố, chiều nào cũng tập hai tiếng. Thầy chủ nhiệm khuyên nên dành buổi chiều để ôn, vì điểm thi thử của tôi đang sát điểm chuẩn.',
    choices: [
      { label: 'Vào đội bóng rổ', effects: { health: 2, appearance: 1, intelligence: -2 },
        text: 'Tôi tập mỗi chiều, tối ôn bài tới khuya. Đội vào bán kết. Điểm thi thử lần sau tụt nửa điểm, thầy nhìn bảng điểm rồi nhìn tôi, không nói gì.' },
      { label: 'Ở nhà ôn thi', effects: { intelligence: 2, happiness: -1 },
        text: 'Chiều nào tôi cũng ngồi bàn học, nghe tiếng bóng nện từ sân trường vọng lại. Điểm thi thử lần sau tăng một điểm. Bạn thân đi giải một mình.' },
    ],
  },
  {
    id: 'ls14-bua-trua', age: 14,
    title: 'Bữa trưa của bạn cùng lớp',
    text: 'Tuần nào tôi cũng thấy một bạn trong lớp nhịn ăn trưa, ngồi đọc sách khi mọi người xuống căng tin. Tiền ăn trưa của tôi mỗi ngày vừa đủ một suất. Hôm nay bạn ấy lại ngồi một mình, co người trong chiếc áo khoác cũ.',
    choices: [
      { label: 'Chia đôi suất ăn', effects: { happiness: 1, health: -1 },
        text: 'Tôi nói mình ăn không hết, đưa bạn một nửa. Bạn ngần ngừ rồi nhận. Cả tuần hai đứa ăn nửa suất, chiều nào tôi cũng đói tới tiết cuối.' },
      { label: 'Xuống căng tin như mọi ngày', effects: { health: 1 },
        text: 'Cuối học kỳ, nghe nói trường đã miễn tiền ăn cho bạn ấy. Tôi chưa bao giờ hỏi bạn ấy chuyện gì đã xảy ra trước đó.' },
    ],
  },
];
