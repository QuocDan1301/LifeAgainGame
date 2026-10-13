// Inner dialogue leads into the decision without revealing its outcome.
const dialogue = {
  'lost-child-school': [
    'Em ấy khóc mãi, chắc đang sợ lắm. Mình cũng còn nhỏ, nhưng đâu thể cứ bỏ đi…',
    'Dỗ em khó hơn mình tưởng. Mình nên thử thêm hay nhờ người lớn giúp đây…',
    'Em được gặp lại mẹ rồi, mình cũng nhẹ cả người. Cô đang cảm ơn, mình nói gì bây giờ…',
    'Một ngôi trường mới nghe thật hấp dẫn, nhưng còn những người bạn hiện tại nữa…',
    'Không ngờ lần giúp em nhỏ lại đưa mình đến đây. Nhìn lại năm học này, mình muốn nói rằng…',
  ],
  'diamond-mine': [
    'Huy rủ nhiệt tình quá. Một chuyến đi có thể vui, mà nằm nhà cũng thích thật…',
    'Sắp đi rồi, mình chuẩn bị gì để chuyến này đỡ luống cuống đây…',
    'Khe đá lấp lánh nghe tò mò thật. Mình muốn khám phá tiếp hay chỉ ngắm cảnh thôi…',
    'Viên đá Bắp làm bật lên vừa lóe sáng. Có gì trong lớp bùn ấy nhỉ…',
    'Điện thoại sắp hết pin mà khe đá còn tối. Muốn nhìn rõ thì mình phải tính cách khác…',
    'Chưa kiểm định thì chưa biết đó là gì. Mình nên làm gì với phát hiện này trước tiên…',
    'Tin này khó tin đến mức mình phải đọc lại mấy lần! Mình muốn chia sẻ niềm vui này với ai trước đây…',
  ],
  'earth-auction': [
    'Khoan, mình chỉ định xuống sảnh thôi mà! Thang máy này đang đưa mình đi đâu vậy…',
    'Họ đang rao bán cả nơi mình sống sao? Mình có nên lên tiếng ngay không…',
    'Cả hội trường đang nhìn mình. Mình chưa từng đại diện cho ai, huống hồ cả Trái Đất…',
    'Vàng và kim cương không gây ấn tượng với họ. Điều gì ở quê nhà thật sự đáng giữ lại…',
    'Trong màn hình có cả mình. Giờ phủ nhận hay nói thật điều mình nghĩ đây…',
    'Một cuộc sống dễ chịu, nhưng chỉ có chỗ cho riêng mình. Còn những người mình thương thì sao…',
    'Hóa ra chỉ là mơ, nhưng bác hàng xóm ngoài kia đang cần giúp thật. Mình còn nằm đây làm gì…',
  ],
  'save-life': [
    'Người ấy đang cần giúp, nhưng nền đất trước mặt có thể sụt bất cứ lúc nào. Mình phải bình tĩnh chọn cách tiếp cận…',
    'Dây điện đang tóe lửa ngay trong nước. Mình không thể chỉ nhìn khoảng cách mà quên nguy hiểm…',
    'Giàn giáo đang rạn, mình không có nhiều thời gian. Điều gì cần được đưa ra trước đây…',
    'Ông ấy đã bình an rồi. Với lời cảm ơn này, mình muốn đáp lại thế nào…',
  ],
  'old-house': [
    'Mình chưa từng gặp bà, sao bà lại biết tên mình? Mình vừa tò mò vừa thấy lạnh sống lưng…',
    'Trên tường không có bóng của bà. Mình có đủ bình tĩnh nghe điều bà muốn nhờ không…',
    'Bà nhờ tìm hộp, còn tiếng trẻ con lại bảo đừng tin. Mình cần hiểu rõ hơn trước khi quyết…',
    'Cô bé chỉ chiếc hộp của An, nhưng bên cạnh còn có trang sức. Mình đến đây vì điều gì nhỉ…',
    'Lá thư này có thể trả lời điều bà chờ bao năm. Mình sẽ giúp lời nhắn đến được đúng người bằng cách nào…',
    'Bà An đã nhận ra chiếc vòng và những lá thư. Mình có muốn đi cùng bà đến hết cuộc gặp này không…',
    'Hai mẹ con đã được gặp lại theo một cách thật lạ. Mình muốn dùng lời cảm ơn này ra sao…',
  ],
  'last-train': [
    'Đêm khuya, lời chỉ dẫn lại chẳng giống nhau. Mình nên dựa vào điều gì để quyết định đi tiếp…',
    'Người này bảo đổi ghế, nhưng tấm vé trong tay mình ghi khác. Mình cần xem lại trước khi bước đi…',
    'Người ở sân ga trông quen quá. Mình phải nhớ kỹ dấu hiệu của cô An, chứ không chỉ tin cảm giác…',
    'Hai cánh cửa đều có vẻ là đường về. Mình nên đối chiếu điều gì trước khi xuống tàu…',
  ],
  theater: [
    'Có gì đó khác với một buổi diễn bình thường. Mình nên báo ngay hay chờ xem thêm…',
    'Mọi người đang chen nhau, càng hoảng càng khó ra ngoài. Mình nói gì để họ nghe được đây…',
    'Đứa trẻ níu áo, còn bà vẫn ở phía sau. Mình có thể phối hợp với người bên cạnh thế nào…',
    'Vẫn còn người chưa được điểm danh. Mình biết vị trí cuối của họ, nhưng quay vào có thật sự giúp được không…',
    'Mình nhớ một phần đường đi, không phải tất cả. Mình phải nói rõ đến đâu là điều mình chắc chắn…',
    'Đội cứu hộ cần một khoảng trống để làm việc. Lúc này mình nên ưu tiên điều gì…',
    'Mình đâu có làm mọi thứ một mình. Khi mọi người gọi mình là người hùng, mình muốn nói rằng…',
  ],
  luggage: [
    'Vali giống hệt nhưng mật khẩu không đúng, người gọi lại biết chuyện quá nhanh. Mình xác nhận bằng cách nào…',
    'Người ở cổng biết cả thông tin của mình. Chừng đó đã đủ để giao chiếc vali chưa…',
    'Ảnh chụp vali nghe có vẻ thuyết phục, nhưng mình đâu biết ảnh đến từ đâu. Mình cần ai kiểm tra giúp…',
    'Thứ quý nhất trong vali là kỷ niệm của ông ấy. Với khoản cảm ơn này, mình muốn lựa chọn thế nào…',
  ],
  'later-60': [
    'Sửa được chiếc quạt làm mình vui hơn tưởng tượng. Có nên thử giúp thêm bác hàng xóm không nhỉ…',
    'Cậu bé cần đèn để học mà tiền để dành chưa đủ. Mình muốn xử lý chuyện công sửa thế nào…',
    'Món đồ này giữ một kỷ niệm, đâu chỉ là thứ có thể mua mới. Mình còn cách nào để giúp…',
    'Lâu nay mình giúp mọi người, giờ mọi người muốn giúp lại. Mình có nên đón nhận không…',
    'Bộ đồ nghề mới là tấm lòng của cả xóm. Mình muốn đáp lại món quà này bằng điều gì…',
  ],
  'later-65': [
    'Bức tranh cũ bỗng được chú ý, nhưng mình chưa hiểu quy trình ở đây. Mình nên kiểm tra điều gì trước…',
    'Hai người đưa ra hai giá khác nhau. Mình có nên vội chốt khi vẫn còn điều chưa rõ không…',
    'Có người nhận là chủ cũ của tranh. Mình cần đối chiếu giấy tờ ra sao để không trao nhầm…',
    'Khoản tiền lớn đang ở trước mắt. Mình phải biết tiền đã thật sự vào tài khoản trước khi bàn giao…',
  ],
  'later-70': [
    'Trợ cấp nghe hấp dẫn, nhưng vì sao lại phải đóng phí trước? Mình cần xác minh chuyện này…',
    'Không chỉ mình, cả xóm đều nhận được lời mời. Mình làm gì để mọi người hiểu chuyện đang xảy ra…',
    'Thông tin ghép lại đã rõ hơn, nhưng mình chưa thể tự kết luận ai là thủ phạm. Mình chuyển những gì biết cho ai…',
    'Họ lại mời mình tham gia sâu hơn. Mình cần nhớ việc xác minh và xử lý thuộc về ai…',
    'Lần này là cuộc gọi được xác nhận thật. Mình muốn nói gì về công sức của những người đã cùng giúp…',
  ],
  'later-75': [
    'Lời hẹn có vẻ là một câu đố. Mình phải đọc kỹ dấu hiệu về chiếc đồng hồ…',
    'Một cuốn sách chưa từng được đọc, nhưng vẫn ghi lại thời gian. Người bạn đang muốn mình nghĩ đến thứ gì…',
    'Bên trái thay đổi theo chỗ mình đứng. Mình phải tìm lại đúng góc nhìn trong bức ảnh…',
    'Ngày gặp và ngày chụp không phải một. Mình cần nhớ lại lời hẹn ấy, chứ không đoán vội…',
  ],
  'later-80': [
    'Áo vừa bị bẩn đúng lúc đi chơi. Mình để chuyện nhỏ này quyết định cả ngày của mình sao…',
    'Buổi hội có vẻ vui, mà mình cũng chưa biết bên trong có gì. Mình muốn đi xem hay về nghỉ…',
    'Tấm vé đang giữ có số rất hợp tuổi mình. Đổi hay giữ, mình thích lựa chọn nào hơn…',
    'Mưa làm mình phải đổi kế hoạch. Mình có thể nghỉ ở đây hay nhờ người nhà đón…',
    'Họ gọi đúng số vé mình giữ rồi sao? Mình vừa mừng vừa muốn kiểm tra lại cho chắc…',
  ],
  'later-85': [
    'Cuốn sách bị đặt sai chỗ, nên manh mối trên kệ mới đáng chú ý. Mình cần nhìn lại vị trí của nó…',
    'Bên trái trong ảnh đâu nhất thiết là tay trái của người chụp. Mình phải hình dung lại cho đúng…',
    'Số cũ và số hiện tại đã đổi một lần. Mình nên theo nhãn nào để mở đúng ngăn…',
    'Chìa khóa vẫn chưa đủ, còn thứ tự mã nữa. Mình nhớ các dấu hiệu theo trình tự nào…',
  ],
  'later-90': [
    'Nhà yên quá trong ngày sinh nhật. Mình có thể chủ động gọi người mình muốn gặp mà…',
    'Bức ảnh làm mình nhớ người đã lâu không nói chuyện. Mình còn muốn giữ khoảng cách này đến bao giờ…',
    'Một bữa cơm không cần lớn, chỉ cần những người mình muốn gặp. Mình sẽ thu xếp thế nào cho vừa sức…',
    'Chín mươi năm có cả vui lẫn tiếc. Hôm nay mình muốn kể điều gì với những người đang ngồi đây…',
    'Mọi người đang chờ điều ước của mình. Điều mình thật sự mong lúc này là gì nhỉ…',
  ],
  'later-95': [
    'Nước chưa tới nhà, nhưng chờ đến lúc đó có thể không còn dễ đi. Mình nên chuẩn bị từ bây giờ…',
    'Đồ cần thiết đã có, chỉ còn chiếc túi bên tủ. Mình có nên quay lại vì nó không…',
    'Có người gọi đổi hướng, nhưng đội cứu hộ đang hỗ trợ mình ở chỗ khác. Mình phải xác nhận lại…',
    'Chỉ còn một đoạn, nhưng mình vẫn cần người dìu. Mình chờ tín hiệu nào để bước tiếp…',
  ],
  'later-100': [
    'Một trăm tuổi rồi mà vẫn còn người ngồi bên hỏi chuyện cũ. Mình muốn đáp lại lời hỏi ấy thế nào…',
    'Bức ảnh giữ cả một lời hẹn chưa làm. Có lẽ hôm nay mình vẫn có thể thực hiện nó…',
    'Mình không cần đứng giống hệt ngày xưa. Quan trọng là hai người vẫn cùng có mặt trong ảnh…',
    'Có câu nói đã để dành quá lâu. Mình muốn lắng nghe và đáp lại ngay hôm nay…',
    'Ảnh hôm nay khác ảnh cũ nhiều thật, nhưng người bên cạnh vẫn ở đây. Mình muốn nói gì với người ấy…',
  ],
  'later-105': [
    'Bên kia điện thoại là người muốn ghé thăm. Mình có muốn mở cửa cho một cuộc gặp nữa không…',
    'Những lời này vẫn chưa đến được người cần nghe. Mình muốn nhờ chuyển đi hay giữ lại…',
    'Cuốn sổ còn vài trang, lòng mình cũng còn vài câu chuyện. Mình muốn để ai cùng nghe…',
    'Có người đang hỏi mình cần ai ở lại. Mình muốn nói rõ điều mình mong trong khoảnh khắc này…',
  ],
};

export function getSpecialDialogue(event) {
  const line = dialogue[event.specialId]?.[event.specialStep - 1];
  return line ? `Tôi tự nhủ: “${line} tôi sẽ?”` : '';
}
