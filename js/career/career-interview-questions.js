// Mỗi nghề có câu hỏi và đáp án viết riêng, không ghép từ mẫu chung.
// answers theo thứ tự: đúng (duy nhất có thể đậu), chưa đủ, yếu.
// Có thể thêm đáp án vào từng câu; mọi đáp án sau đáp án đầu đều trượt.
// Game tự đảo vị trí và hiển thị đủ các đáp án.
export const careerInterviewQuestions = {
  esports: [
    {
      text: "Đội đang ăn Tà Thần, nhưng ba tướng địch mất dạng trên bản đồ. Em sẽ call thế nào?",
      answers: [
        "Từ từ tao check bụi đã.",
        "Ăn lẹ ăn lẹ đi bây.",
        "Bây ăn đi, tao lên cân tụi nó.",
        "Bây lên canh đi, để mình tao ăn cho",
      ],
    },
  ],
  acting: [
    {
      text: "Đang quay cận cảnh thì bạn diễn quên thoại. Em sẽ giữ cảnh quay thế nào?",
      answers: [
        "Nghĩ gì thoại đó chứ biết sao giờ",
        "Thế thì chịu rồi ạ.",
        "Chỉ cần 1 nụ cười thật tự tin.",
        "Em đọc luôn cả thoại của bạn diễn, một người đóng hai vai cho tiết kiệm.",
      ],
    },
  ],
  military: [
    {
      text: "Trước giờ xuất phát dã ngoại, em phát hiện một đồng đội thiếu trang bị bắt buộc. Em làm gì?",
      answers: [
        "Hỏi đồng đội có đủ tự tin để thuyết phục người phụ trách không.",
        "Báo người phụ trách, cho đồng đội ở nhà.",
        "Nhanh trí đưa đồ của em cho đồng đội.",
        "Báo người phụ trách chuyện tâm linh cấm đùa.",
      ],
    },
  ],
  singing: [
    {
      text: "Tai nghe sân khấu mất tín hiệu ngay giữa điệp khúc. Em tiếp tục tiết mục thế nào?",
      answers: [
        "Chĩa mic xuống khán giả, tới công chuyện của mọi người rồi.",
        "Nhắm mắt phiêu, lệch tông thì gọi là bản phối mới.",
        "Giả vờ xúc động nghẹn lời, chờ kỹ thuật cứu em.",
        "Hát to gấp đôi, tai em không nghe thì để cả phường nghe.",
      ],
    },
  ],
  painting: [
    {
      text: "Khách đặt tranh chỉ nói muốn một bức tranh có hồn. Em nói gì trước khi cầm cọ?",
      answers: [
        "Hồn thì em không thiếu, em chỉ thiếu *động lực*.",
        "Anh chị muốn có hồn ngay hay sau 12 giờ đêm?",
        "Để em collapse với thầy cúng ạ.",
        "Em cứ vẽ, hồn nằm trong mắt người xem, anh chị tự cảm nhận nha.",
      ],
    },
  ],
  medicine: [
    {
      text: "Khi tiếp nhận ca mới, thông tin trong hồ sơ và lời kể của người bệnh không khớp. Em làm gì?",
      answers: [
        "Nhìn với ánh mắt hoài nghi, hỏi cho ra ạ.",
        "Tin tưởng người bệnh tuyệt đối.",
        "Em chọn bản nào ngắn hơn để đọc cho kịp hết ca.",
        "Em tin hồ sơ, giấy trắng mực đen đâu có biết nói dối.",
      ],
    },
  ],
  programming: [
    {
      text: "Ứng dụng chỉ bị sập trên máy khách hàng, còn máy em chạy bình thường. Em bắt đầu từ đâu?",
      answers: [
        "Cho em xin log với đời máy của anh, em cosplay máy anh trước đã.",
        "Máy em chạy ngon mà, chắc máy anh đang có chuyện buồn.",
        "Em gửi khách luôn cái máy của em, chạy ngon là được.",
        "Em bọc try-catch hết, có sập thì cũng sập trong im lặng.",
      ],
    },
  ],
  accounting: [
    {
      text: "Số dư sổ kế toán lệch sao kê ngân hàng 999 đồng. Em xử lý khoản lệch này thế nào?",
      answers: [
        "Em bù 999 đồng tiền túi, coi như đầu tư vào sự bình yên.",
        "999 đồng cũng là tiền, em lật từng dòng sao kê tới khi nó chịu khai.",
        "Lệch chưa tới một nghìn thì làm tròn, sếp đeo kính cũng không thấy.",
        "Em ghi vào khoản chi phí tâm linh, số 999 nghe cũng hên.",
      ],
    },
  ],
  law: [
    {
      text: "Khách muốn ký ngay hợp đồng dài hai mươi trang. Em chỉ còn ít thời gian rà soát, em làm gì?",
      answers: [
        "Anh ký thì được, nhưng cho em đọc mấy trang thanh toán trước đã.",
        "Em đọc trang đầu với trang cuối, ở giữa chắc cũng là chữ.",
        "Khách là thượng đế, thượng đế muốn ký thì em đưa bút.",
        "Em xin mang về đọc kỹ, ba tháng nữa em gọi lại anh.",
      ],
    },
  ],
  teaching: [
    {
      text: "Giảng xong bài phân số, em thấy nửa lớp vẫn làm sai cùng một bước. Em sẽ dạy tiếp thế nào?",
      answers: [
        "Em giảng lại y chang lần nữa, nhưng nói to hơn.",
        "Ai làm đúng lên bảng giảng cho bạn, cô ngồi chấm bài cho nhẹ.",
        "Kiểm tra 15 phút liền, sai nữa thì em mời phụ huynh.",
      ],
    },
  ],
  football: [
    {
      text: "Đội em gặp đối thủ pressing sát ngay từ phần sân nhà. Em di chuyển hỗ trợ người cầm bóng thế nào?",
      answers: [
        "Đưa bóng đây, em rê qua hết cho tụi nó biết pressing là gì.",
        "Em chạy ra chỗ trống, hét 'đây nè' cho bạn có đường thoát.",
        "Em đứng yên giữ vị trí, chỉ tay chỉ đạo cho chắc.",
        "Em hét bạn phá thẳng lên khán đài, bóng ra ngoài là hết bị ép.",
      ],
    },
  ],
  psychology: [
    {
      text: "Thân chủ im lặng gần hết buổi gặp đầu tiên. Em sẽ mở lời thế nào?",
      answers: [
        "Mình không vội đâu, bạn muốn nói lúc nào thì mình vẫn ở đây.",
        "Em kể chuyện cười phá băng, ai mà không thích cười.",
        "Em hỏi thẳng 'bạn bị sao vậy', vào việc cho nhanh.",
        "Em im luôn, xem ai chịu không nổi trước.",
      ],
    },
  ],
  tiktok: [
    {
      text: "Một trend đang lên nhưng khác hẳn nội dung kênh em. Em có làm theo không?",
      answers: [
        "Trend thì em mượn, chất thì em giữ, em bẻ nó về đúng kênh mình.",
        "Trend lên là lên đồ, kênh nấu ăn cũng nhảy được chứ sao.",
        "Em không theo trend, em ngồi đợi trend theo em.",
        "Em làm mười video trend một ngày, trúng một cái là đủ ăn.",
      ],
    },
  ],
  youtube: [
    {
      text: "Video dài mười phút nhưng người xem rời đi nhiều ở phút đầu. Em xem lại bản dựng thế nào?",
      answers: [
        "Em ghi 'xem hết video có quà' ngay giây đầu tiên.",
        "Khán giả bỏ ở giây nào em cắt ở giây đó, khúc hay nhất cho lên đầu.",
        "Phút đầu em xin like share thôi mà, người xem phải hiểu cho em chứ.",
        "Em đổi thumbnail thành mặt há mồm, thêm ba mũi tên đỏ.",
      ],
    },
  ],
  business: [
    {
      text: "Khách nói sản phẩm tốt nhưng giá quá cao. Em tiếp tục cuộc trao đổi bằng cách nào?",
      answers: [
        "Tiền nào của nấy anh ạ, đắt là có lý do.",
        "Dạ anh định chi tầm bao nhiêu, em tìm gói vừa túi mà vẫn giữ cái anh cần.",
        "Thôi em giảm năm mươi phần trăm, coi như mình làm quen.",
        "Anh chưa mua chứ đâu phải không mua, mai em gọi lại nha.",
      ],
    },
  ],
  finance: [
    {
      text: "Một dự án hứa lợi nhuận cao nhưng chưa cung cấp được dòng tiền chi tiết. Em đánh giá thế nào?",
      answers: [
        "Hứa thì ai cũng hứa được, cho em xem dòng tiền rồi mình nói tiếp.",
        "Lãi cao vậy thì vào trước, giấy tờ bổ sung sau.",
        "Em hỏi người quen, ai cũng bảo ngon thì chắc là ngon.",
        "Em rót một ít thử thôi, mất thì coi như đóng học phí.",
      ],
    },
  ],
  mechanical: [
    {
      text: "Máy rung mạnh bất thường khi tăng tốc. Em bắt đầu kiểm tra bằng cách nào?",
      answers: [
        "Em tắt máy, khóa nguồn, rồi mới ngồi hỏi chuyện nó.",
        "Em áp tai vào nghe thử xem nó rung ở chỗ nào.",
        "Máy nào chẳng rung, chạy tiếp coi như máy đang mát-xa.",
        "Em đạp cho một cái, máy cũ hay tự hết sau khi bị đạp.",
      ],
    },
  ],
  architecture: [
    {
      text: "Khu đất nhỏ và méo nhưng khách muốn nhà thật thoáng. Em bắt đầu phương án mặt bằng từ đâu?",
      answers: [
        "Đất méo thì em đo từng góc, xem nắng gió vào đâu rồi mới đặt bút.",
        "Góc méo nào em cũng làm giếng trời, thoáng tới mức mưa vào tận giường.",
        "Em xây kín hết đất cho rộng, muốn thoáng thì mở cửa sổ.",
        "Em khuyên khách mua thêm lô bên cạnh cho nó vuông.",
      ],
    },
  ],
  fashion: [
    {
      text: "Bộ trang phục lên bản vẽ rất đẹp nhưng người mẫu khó giơ tay khi mặc thử. Em sửa gì?",
      answers: [
        "Em cho người mẫu múa vài đường, kẹt chỗ nào em nới chỗ đó.",
        "Đẹp thì phải chịu đau, chị cứ chống hông tạo dáng là được.",
        "Em xẻ hai bên nách, gọi là thiết kế phóng khoáng.",
        "Em đổi người mẫu khác, tay ngắn hơn chút.",
      ],
    },
  ],
  marketing: [
    {
      text: "Quảng cáo có nhiều lượt xem nhưng ít đơn hàng. Em kiểm tra điều gì trước khi tăng ngân sách?",
      answers: [
        "Em lần theo đường đi của khách, rớt ở bước nào rồi mới tính chuyện bơm tiền.",
        "Xem nhiều là người ta thích rồi, bơm thêm tiền là ra đơn.",
        "Em đổi nhạc nền sang remix cho khách có máu mua.",
        "Em gắn chữ 'sale sốc' vào mọi chỗ còn trống.",
      ],
    },
  ],
  tourism: [
    {
      text: "Tour có hoạt động ngoài trời nhưng dự báo mưa lớn. Em chuẩn bị gì trước khi đón đoàn?",
      answers: [
        "Em lên sẵn lịch trong nhà, báo khách trước cho khỏi bất ngờ.",
        "Mưa càng đẹp, em chụp ảnh tình cảm cho cả đoàn.",
        "Em hủy tour luôn, an toàn tuyệt đối là ở nhà.",
        "Em ra đình khấn cầu tạnh, chỗ đó linh lắm.",
      ],
    },
  ],
  culinary: [
    {
      text: "Phiếu gọi món ghi khách dị ứng thực phẩm nhưng chưa nêu rõ loại nào. Em có bắt đầu nấu ngay không?",
      answers: [
        "Dị ứng cái gì phải hỏi cho ra, chưa rõ thì chảo chưa nóng.",
        "Em nấu chay cho chắc, đồ chay thì ai mà dị ứng.",
        "Em nấu bình thường nhưng bớt gia vị, ăn nhạt cho lành.",
        "Em gửi kèm viên thuốc chống dị ứng cho khách yên tâm.",
      ],
    },
  ],
};
