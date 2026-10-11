// Copy variants only: IDs, rewards, achievements and story mechanics stay on the source events.
// Each age contains three base stories followed by two everyday additions.
// [title, situation, first action, first headline, first result, second action, second headline, second result]
const stories = {
  "1": [
    [
      "👣 Cả nhà cổ vũ quá sức",
      "Ba dang tay đón, mẹ bật camera. Tôi vừa đứng lên, bà đã vỗ tay làm tôi giật mình. Cả nhà chờ tôi đi, tôi còn đang lo đứng cho vững. 😳",
      "🤝 Tôi bám tay ba, bước từng chút",
      "Đi được rồi!",
      "Tôi bám tay ba, bước được mấy bước rồi cười toe. Mẹ xem lại clip, mới phát hiện ba đứng che hết tôi. Ba bảo: “Thì con đang bám anh mà.” Mẹ yêu cầu quay lại, tôi đã bò đi chơi. 😂",
      "🪑 Tôi ngồi xuống nghỉ đã",
      "Người tập cũng biết mệt",
      "Tôi ngồi xuống nghỉ, mặt hơi quạu. Ba ngồi cạnh dỗ mãi rồi tê chân, phải nhờ mẹ kéo dậy. Mẹ hỏi: “Em tập đi cho con hay cho anh đây?” 😅"
    ],
    [
      "🛁 Mẹ cũng được tắm",
      "Mẹ thả vịt đồ chơi vào chậu. Tôi vỗ nước, mẹ ướt tay áo. Ba đứng cửa cười, rồi cúi xuống định trêu tôi. 😏",
      "💦 Tôi vỗ nước chơi với vịt",
      "Cười trước, lau sau",
      "Tôi vỗ nước chơi, được mẹ tắm sạch. Ba vừa ghé mặt lại đã bị bắn ướt. Mẹ đưa khăn, hỏi: “Sao hết cười rồi?” Ba lau mặt, tôi cười tiếp phần ba. 😂",
      "🧺 Tôi ôm khăn, chờ mẹ tắm xong",
      "Hết tắm vẫn còn quạu",
      "Tôi ôm khăn, mẹ tắm nhanh nhưng tôi vẫn quạu. Ba bóp vịt cho kêu để dỗ. Tôi đẩy vịt ra, ba bóp thử lần nữa. Mẹ bảo: “Con không thích, chỉ có anh thích thôi.” 😅"
    ],
    [
      "🧸 Ru con, ba ngủ trước",
      "Mẹ hát ru, tôi vẫn nghịch gấu. Ba nằm cạnh bảo ngủ đi rồi tự ngủ trước. Mẹ gọi ba nhỏ tiếng, tôi lại tưởng đang gọi mình. 🥱",
      "💤 Tôi ôm gấu, nhắm mắt ngủ",
      "Ngủ ngon, giữ tóc chặt",
      "Tôi ôm gấu ngủ ngon, sáng dậy khỏe. Ba nằm im vì tôi đang nắm tóc. Mẹ hỏi sao không dậy. Ba chỉ tay tôi: “Em xin phép nó hộ anh.” 🤭",
      "🧸 Tôi chơi với gấu thêm chút nữa",
      "Buồn ngủ mà vẫn cố chơi",
      "Tôi chơi thêm với gấu, ngủ muộn nên sáng còn uể oải. Mẹ gọi tôi dậy, ba cũng bảo dậy đi. Mẹ kéo chăn thì thấy ba chưa mở mắt. Người nhắc ngủ nướng ngang người được nhắc. 😴"
    ],
    [
      "🧦 Tất ở đâu, con ở đó",
      "Mẹ tìm chiếc tất còn thiếu. Một chiếc đã ở trên chân tôi, chiếc kia tôi đang cầm. Ba ngồi cạnh xem điện thoại, không ai nhìn tay tôi. 🤭",
      "🤲 Tôi đưa chiếc tất đang cầm cho mẹ",
      "Tất còn lại ở đâu",
      "Mẹ tìm tất khắp phòng, tôi giơ chiếc đang cầm lên. Mẹ hỏi ba: “Anh ngồi cạnh con mà không thấy à?” Ba đáp: “Anh tưởng nó cầm chiếc còn lại.” Mẹ giơ chân tôi lên. Chiếc còn lại đang mang trên chân. 😂",
      "🦶 Tôi giơ chân, nhờ mẹ mang tất",
      "Mang xong lại tháo",
      "Mẹ mang đủ hai tất cho tôi. Tôi kéo một chiếc ra rồi giơ chân nhờ mang lại. Ba cười bảo tôi đang rủ chơi. Mẹ đưa ba chiếc tất: “Đúng rồi, tới lượt anh chơi.” 🤭"
    ],
    [
      "🥬 Người lớn cũng chê rau",
      "Mẹ đưa thìa rau mềm, tôi quay mặt. Ba đứng cạnh bảo ăn rau ngon lắm. Mẹ quay thìa về phía ba, ba lập tức ngậm miệng. 🤨",
      "🥄 Tôi thử một miếng rau",
      "Khen ngon thì ăn hộ đi",
      "Tôi nếm một miếng rau, mặt nhăn. Mẹ nếm thử rồi khen ngon. Tôi đẩy cả bát về phía mẹ. Mẹ đẩy lại, tôi lại đẩy sang. Ba nhìn hai mẹ con nhường nhau rất nhiệt tình. 😂",
      "🙅 Tôi chạm thìa rồi lắc đầu",
      "Ba bị mời ăn rau",
      "Tôi chạm thìa rồi lắc đầu, mẹ chờ tôi làm quen. Ba bảo không được chê rau. Mẹ đưa ba nếm thử, ba bảo đã ăn no. Mẹ chỉ đĩa bánh ba đang cầm. Ba cất bánh rất chậm. 😅"
    ]
  ],
  "2": [
    [
      "📖 Con khỉ giống ai?",
      "Mẹ mở sách tranh, ba bắt chước tiếng con vật. Tới con khỉ, ba vừa kêu vừa gãi đầu. Tôi nhìn hình rồi nhìn ba. 🤭",
      "🐱 Tôi gọi tên các con vật với mẹ",
      "Ba tự tạo bằng chứng",
      "Tôi học được tên mèo, chó và xe, được mẹ khen. Tới con khỉ, tôi chỉ ba. Ba hỏi sao lại chỉ mình. Mẹ đáp: “Anh vừa làm mẫu xong còn gì.” 😂",
      "🐻 Tôi kể theo hình rồi bắt chước gấu ngủ",
      "Truyện có tiếng ngáy",
      "Tôi kể theo tranh, chỉ con gấu ngủ rồi bắt chước tiếng ngáy. Ba hỏi gấu nào ngáy thế. Tôi chỉ ba. Mẹ bảo giống, ba yêu cầu chuyển trang. 😂"
    ],
    [
      "🧱 Tháp cao bằng đầu gối",
      "Tôi xếp khối nhỏ ở dưới nên tháp cứ đổ. Ba bảo để ba thử, rồi cũng làm đổ. Tôi đẩy mấy khối gỗ về phía ba, yêu cầu làm lại. 😶",
      "🧱 Tôi thử xếp khối to ở dưới",
      "Con xây, ba đứng xem",
      "Tôi đổi khối to xuống dưới, tháp đứng vững nên reo vui. Ba định thêm một khối, tôi gạt tay ba ra. Mẹ hỏi sao không cho ba chơi. Tôi chỉ đống tháp ba vừa làm đổ. 😂",
      "🤝 Tôi để ba xếp cùng",
      "Ai làm đổ thì nhặt",
      "Hai ba con xếp được tháp, chơi rất vui. Ba vô tình làm đổ, tôi đưa từng khối cho ba xếp lại. Ba vừa xếp xong, tôi tự đẩy đổ rồi đưa tiếp. Ba hiểu ra mình vừa nhận việc dài hạn. 🤭"
    ],
    [
      "🚗 Xe đi lạc dưới ghế",
      "Xe đồ chơi mất, tôi kéo mẹ đi tìm. Ba bảo đã nhìn dưới ghế rồi, không có. Tôi vẫn chỉ ghế, mẹ cúi xuống xem lại. 🤨",
      "🔍 Tôi chỉ mẹ chỗ xe chạy vào",
      "Ba nhìn nhưng chưa thấy",
      "Tôi nhớ xe chạy dưới ghế, chỉ mẹ lấy ra. Mẹ tìm được cả xe lẫn dép ba. Ba bảo lúc nãy tối quá nên không thấy. Mẹ hỏi: “Vậy sao anh bảo chắc chắn không có?” Ba nhận dép, không nhận câu hỏi. 😅",
      "🧸 Tôi chơi gấu trong lúc ba tìm xe",
      "Người tìm xe bị giữ lại",
      "Tôi chơi gấu trong lúc ba tìm xe, vẫn hơi tiếc. Ba nằm bò ngó dưới ghế, tôi leo lên lưng vì tưởng đang chơi ngựa. Ba gọi mẹ giúp. Mẹ phải bế tôi xuống rồi ba mới lấy được xe. 😂"
    ],
    [
      "🧸 Gấu được nằm chỗ đẹp",
      "Tôi đắp chăn cho gấu giữa giường. Ba muốn nằm vào chỗ đó, thử nhấc gấu sang bên. Tôi kéo gấu về ngay. 😤",
      "🛏️ Tôi đắp chăn rồi nằm cạnh gấu",
      "Ba ngủ sát mép",
      "Tôi vuốt chăn cho gấu rồi nằm cạnh. Ba phải nằm sát mép. Mẹ hỏi sao không dời gấu. Ba chỉ tôi đang ôm nó: “Anh vừa thử, nó khóc to hơn anh nói.” 🤭",
      "🎵 Tôi nhờ bà ru gấu",
      "Người nghe ké ngủ trước",
      "Bà ru gấu, tôi ôm gấu nghe rồi ngủ ngon. Ba hỏi sao còn phải ru gấu. Bà bảo: “Không ru nó thì chủ nó không ngủ.” Ba gật đầu, đi ra nhẹ hơn lúc đi vào. 😂"
    ],
    [
      "🧺 Dọn xong còn một món",
      "Giỏ đồ chơi đầy, xe còn ngoài thảm. Tôi thử nhét vào nhưng gấu nằm chiếm chỗ. Mẹ bảo cho gấu ngồi lên sẽ rộng hơn. 🤔",
      "🚗 Tôi xếp lại đồ chơi để cất xe",
      "Đồ của ba cũng được tìm thấy",
      "Tôi dựng gấu lên, cất được xe và tìm thấy chiếc tất ba lẫn trong giỏ. Ba bảo đã tìm nó cả sáng. Mẹ hỏi có nhìn giỏ này chưa. Ba nói không, vì đây là đồ của con. Tôi ôm tất lại. Ba phải xin. 😂",
      "🧺 Tôi nhờ mẹ chia đồ vào hai giỏ",
      "Ba cũng phải dọn",
      "Mẹ chia đồ vào hai giỏ, tôi tìm đồ dễ hơn. Ba ngồi xem TV khen gọn quá. Mẹ đưa ba giỏ quần áo, bảo dọn giúp. Ba hỏi vì sao đang khen lại phải làm. Mẹ nói: “Để em khen anh nữa.” 🤭"
    ]
  ],
  "3": [
    [
      "🎒 Khóc xong vẫn kịp chơi",
      "Ngày đầu mẫu giáo, tôi bám mẹ khóc. Cô đưa xe đồ chơi, tôi vẫn khóc nhưng tay đã kéo xe lại. Mẹ thử lấy xe ra xem, tôi kéo lại nhanh hơn. 🥺",
      "🚗 Tôi mang xe ra chơi với các bạn",
      "Mẹ bị quên hơi nhanh",
      "Tôi mang xe ra chơi với các bạn, vui tới quên khóc. Mẹ hỏi còn nhớ mẹ không. Tôi gật đầu rồi nhờ mẹ né chân cho xe chạy qua. Mẹ bảo: “Nãy ôm chân mẹ chặt lắm mà.” 😅",
      "🥺 Tôi nhờ cô ngồi cạnh cho đỡ nhớ mẹ",
      "Nhớ mẹ, còn nhớ bánh",
      "Cô ngồi cạnh giúp tôi ăn nghỉ, tôi vẫn nhớ mẹ. Cô cho gọi điện, mẹ hỏi có nhớ mẹ không. Tôi nói có, rồi hỏi mẹ đã mua bánh chưa. Mẹ bảo rồi. Tôi dặn đừng ăn hết mới chịu trả điện thoại. 🥺"
    ],
    [
      "🛝 Xuống rồi, tóc còn ở trên",
      "Tôi đứng chờ cầu trượt. Bạn phía trước chưa chịu xuống, cô hỏi sao. Nó bảo sợ, rồi nhích sang nhường tôi. Tự nhiên tôi được lên trước. 😳",
      "🛝 Tôi chờ đến lượt rồi trượt",
      "Tóc làm cả lớp cười",
      "Tôi chờ tới lượt rồi trượt, cười rất vui. Tóc dựng lên làm bạn khác bật cười. Tôi nhìn gương, cũng cười, rồi hỏi cô để tóc vậy về nhà được không. Cô vừa chải xong, tôi xin trượt lại. 😂",
      "🏃 Tôi chạy đuổi bắt với các bạn",
      "Hết sức là đổi cách về",
      "Tôi chạy đuổi bắt rất vui rồi mệt. Cô gọi vào lớp, tôi xin bế. Bạn vừa bị tôi đuổi hỏi sao không chạy nữa. Tôi đáp: “Hết chạy rồi, giờ đi nhờ.” Cô nắm tay dắt tôi đi bộ. 😅"
    ],
    [
      "😴 Ngủ mà vẫn tố nhau",
      "Giờ ngủ trưa, cô kéo rèm. Bạn bên cạnh bảo không buồn ngủ. Tôi cũng bảo thế. Hai đứa vừa nói vừa ngáp nhưng chưa ai chịu nhận. 🥱",
      "😴 Tôi ôm gối, ngủ luôn",
      "Ngủ ngoan còn xin thêm",
      "Tôi ngủ ngon, chiều dậy tỉnh táo. Cô khen ngoan nhất lớp. Tôi hỏi: “Vậy con ngủ thêm được không?” Cô bảo tới giờ chơi. Tôi bật dậy luôn, không hỏi nữa. 🤭",
      "🤫 Tôi rủ bạn bên cạnh nói chuyện",
      "Giả ngủ vẫn biết chỉ tay",
      "Tôi nói chuyện với bạn cạnh bên, lén xì hơi rồi giả vờ ngủ. Cô hỏi ai làm, tôi nhắm mắt chỉ sang nó. Nó cũng nhắm mắt chỉ lại tôi. Cô đứng nhìn hai đứa ngủ mà vẫn tố cáo nhau. Chiều cả hai buồn ngủ vì ngủ trưa muộn. 😂"
    ],
    [
      "🧼 Khăn này biết đi",
      "Tôi vừa rửa tay xong, khăn treo hơi xa. Ba đứng cạnh bồn, áo ba thì vừa tầm tay. Ba đang mải nói chuyện với mẹ, chưa để ý tôi. 😏",
      "😏 Tôi lau tay vào áo ba cho tiện",
      "Ba gọi nhầm người xử",
      "Tôi rửa sạch tay rồi lau luôn vào áo ba. Ba hỏi sao không lấy khăn. Tôi chỉ áo ba: “Khăn này biết đi.” Ba gọi mẹ ra xử. Mẹ nhìn áo: “Tiện thì lau nốt tay kia đi.” 😂",
      "❓ Tôi hỏi mẹ vì sao phải rửa tay",
      "Ba muốn bớt rửa bát",
      "Mẹ giải thích tay bẩn có vi khuẩn rồi giúp tôi rửa sạch. Tôi hỏi ba rửa tay chưa. Ba nói rồi. Tôi ngửi thấy mùi bánh trên tay ba, hỏi sao bánh không tới lượt con. Ba phải mang phần còn lại ra. 🤭"
    ],
    [
      "🦋 Bướm không đứng chờ chụp",
      "Bướm đậu ngoài cửa, tôi đứng nhìn. Ba đang ngồi trong nhà, điện thoại để ngay cạnh. Tôi muốn ba ra xem trước khi nó bay mất. 😮",
      "👀 Tôi đứng xa nhìn bướm",
      "Bướm đi, ba mới tới",
      "Tôi đứng xa ngắm bướm, không đụng vào nó. Ba ra hỏi bướm đâu, đúng lúc nó bay đi. Tôi chỉ trời. Ba hỏi có quay lại không. Tôi đáp: “Ba gọi nó thử đi.” Ba đứng im, không biết gọi tên gì. 🤭",
      "📣 Tôi gọi cả nhà ra xem",
      "Không có dây giữ bướm",
      "Tôi gọi cả nhà ngắm, ba loay hoay mở camera thì bướm bay mất. Ba hỏi sao không giữ nó lại. Tôi chìa hai tay: “Ba đưa dây đây con buộc.” Mẹ bật cười, ba cất điện thoại. 😂"
    ]
  ],
  "4": [
    [
      "🎨 Vẽ nhà mà có tiếng cãi",
      "Cô phát giấy và màu để vẽ nhà. Tôi nhìn hộp màu rồi nhìn tay áo trắng. Cô đưa tạp dề, dặn đừng lau màu vào áo. 🤨",
      "🎨 Tôi mặc tạp dề rồi thử pha màu",
      "Tranh có người nhận ra mình",
      "Tôi mặc tạp dề, pha màu được bức tranh đẹp, áo vẫn sạch. Ba xem tranh hỏi mẹ đang làm gì. Tôi bảo mẹ nhắc ba tưới cây. Mẹ đặt tranh cạnh chậu cây khô: “Anh xem tranh xong làm theo nhé.” 😂",
      "🖐️ Tôi dùng ngón tay vẽ luôn",
      "Áo dính đủ hai phía",
      "Tôi vẽ bằng ngón tay, áo dính màu. Mẹ hỏi lau tay vào đâu. Tôi chỉ phía sau áo, bảo phía trước vẫn sạch. Mẹ xoay tôi lại rồi nói: “Để mẹ khen cả hai mặt.” Tôi biết câu này không phải khen. 😅"
    ],
    [
      "👕 Cúc áo cần làm lại",
      "Tôi tự cài áo nhưng lệch một hàng. Ba bảo làm chậm thôi. Mẹ nhìn áo ba, gọi tôi lại xem. Áo ba cũng lệch, chỉ là tôi chưa thấy. 😏",
      "🐌 Tôi tháo cúc, cài lại cho đúng",
      "Ba cũng phải làm lại",
      "Tôi tháo cúc cài lại, áo ngay ngắn. Mẹ nhờ tôi kiểm tra áo ba. Ba nói mình biết rồi. Tôi chỉ chiếc cúc lệch, đứng chờ ba sửa. Ba xin tôi đi chơi trước. Tôi bảo con đợi được. 😂",
      "⚡ Tôi cài nhanh cho xong",
      "Nhanh chưa chắc được đi",
      "Tôi cài nhanh cho xong, áo vẫn lệch. Mẹ bảo sửa, tôi nói đi chơi không ai nhìn. Ba vừa bước vào hỏi sao áo lệch. Mẹ khoanh tay nhìn tôi. Tôi tháo cúc ra, không tranh luận nữa. 😅"
    ],
    [
      "🌱 Trồng cây có người chỉ huy",
      "Cô hướng dẫn gieo hạt rồi tưới ít nước. Tôi hỏi tưới nhiều có lớn nhanh không. Cô bảo nhiều quá cây sẽ úng. Tôi cất bình to, lấy bình nhỏ. 🤔",
      "🧤 Tôi đeo găng, gieo hạt theo lời cô",
      "Ba nhận nhiệm vụ tưới",
      "Tôi đeo găng gieo đúng cách, biết chăm cây, áo sạch. Ở nhà ba xin tưới giúp, tôi đưa bình nhỏ và dặn chỉ một chút. Ba hỏi sao không tin ba. Mẹ chỉ chậu cây ba quên tưới tuần trước. Tôi giữ bình, rót sẵn cho ba. 😂",
      "🤲 Tôi thử sờ đất bằng tay",
      "Khám phá xong có người giặt",
      "Tôi sờ đất, biết đất khô khác đất ướt, quần áo dính bẩn. Mẹ hỏi học được gì. Tôi kể rất nhiều. Ba bảo đáng công học. Mẹ đưa ba áo bẩn: “Vậy anh giặt hộ thành quả nhé.” 🤭"
    ],
    [
      "🧢 Hai chiếc mũ giống hệt",
      "Tôi với bạn có mũ giống nhau, cùng nhận một chiếc. Cô bảo xem nhãn tên. Tôi chưa đọc được, bạn kia cũng chưa, hai đứa lại nhìn cô. 😶",
      "🏷️ Tôi nhờ cô đọc tên trong mũ",
      "Mũ giống nhau, người đội khác nhau",
      "Cô đọc tên giúp, tôi nhận đúng mũ. Tôi bảo mũ mình đẹp hơn. Bạn kia đội mũ nó lên, trông y hệt. Cô hỏi khác chỗ nào. Tôi chỉ vào đầu mình: “Chỗ này có con.” 😂",
      "🙋 Tôi nhờ cô chia lại cho đúng",
      "Tìm nhầm đúng thứ đang đội",
      "Cô chia lại đúng mũ, hai đứa hết cãi. Tôi đội mũ rồi quay đi tìm tiếp. Cô chỉ đầu tôi. Tôi sờ thấy, quay sang hỏi bạn có nhìn thấy từ nãy không. Nó gật đầu, vẫn chưa nói. 😅"
    ],
    [
      "🍊 Chia cam có người canh",
      "Bà bóc cam đặt lên đĩa, tôi ngồi đếm. Ba đi ngang lấy một múi. Tôi phải đếm lại từ đầu và đang nhìn ba rất kỹ. 🤨",
      "🔢 Tôi đếm xong rồi mới ăn cam",
      "Ba muốn ăn phải báo trước",
      "Tôi đếm đúng, học thêm số lượng. Ba lại chìa tay, tôi kéo đĩa về. Bà hỏi sao không cho ba. Tôi nói: “Ba cứ làm con đếm lại.” Ba phải xin trước từng múi. 😂",
      "🍊 Tôi mời bà một múi",
      "Mời nhỏ mà nhận to",
      "Tôi mời bà một múi nhỏ, giữ múi to cho mình. Bà cảm ơn rồi hỏi con thích múi to đúng không. Tôi gật đầu. Bà đưa múi to khác cho tôi. Tôi nhìn múi nhỏ vừa đưa, hơi quê. 😅"
    ]
  ],
  "5": [
    [
      "🔤 Tên mình không bán bớt chữ",
      "Cô viết tên tôi lên thẻ, tôi hỏi phải đọc hết à. Cô gật đầu. Tôi nhìn tên bạn bên cạnh ít chữ hơn, tự nhiên muốn đổi tên trong giờ học. 🤔",
      "🔤 Tôi nhờ cô chỉ từng chữ trong tên",
      "Tên mình thì đọc rất lớn",
      "Tôi học được mấy chữ, đọc tên mình rất to. Mẹ đưa thẻ tên ba nhờ đọc. Tôi tìm đúng chữ vừa học, đọc một chữ rồi trả. Ba hỏi còn lại đâu. Tôi bảo ba chờ con học thêm. 😂",
      "🔎 Tôi thi tìm chữ giống nhau với bạn",
      "Trò chơi bị đổi cách thắng",
      "Hai đứa thi tìm chữ giống nhau, tôi nhớ thêm chữ và chơi rất vui. Bạn tìm nhanh hơn, tôi xin nó chỉ cách. Nó bảo nhìn thật kỹ. Tôi ghé sát thẻ, che hết chữ của nó. Bạn bảo học chứ không phải chặn đường. 😅"
    ],
    [
      "🧩 Miếng ghép không phải nắp hộp",
      "Tranh còn một chỗ trống, tôi xoay miếng cuối mãi chưa vừa. Ba xin thử, cũng xoay y hệt. Mẹ nhắc nhìn màu ở cạnh, hai ba con cùng cúi xuống. 🤔",
      "🧩 Tôi nhìn màu rồi xoay miếng ghép",
      "Làm được nhưng ba vẫn nhận công",
      "Tôi so màu, xoay đúng và ghép xong, rất vui. Ba bảo nhờ mình cổ vũ. Tôi tháo miếng ra, đưa ba thử. Ba bảo để nguyên cho đẹp. Mẹ bật cười, tôi ghép lại. 🤭",
      "📦 Tôi cất lại, mai ghép tiếp",
      "Dừng rồi còn quay lại dặn",
      "Tôi cất hộp để mai thử, vẫn tiếc chưa xong. Ba hỏi có cần giúp không. Tôi mở hộp đưa miếng cuối, ba xoay rồi trả lại. Tôi đóng hộp: “Thôi mai hai ba con cùng thử.” Ba đồng ý rất nhanh. 😅"
    ],
    [
      "🗣️ Kể truyện có tiếng ngáy",
      "Cô mời kể truyện đã nghe ở nhà. Tôi nhớ sói đến cửa nhà bà, nhưng đoạn sau ba đọc nhỏ dần rồi ngủ mất. Cô hỏi đã nhớ chưa, tôi gật đầu hơi chậm. 😶",
      "🎤 Tôi kể tới đoạn mình còn nhớ",
      "Câu chuyện dừng vì người kể ngủ",
      "Tôi cố nhớ thứ tự, hồi hộp nhưng kể được đoạn đầu. Cô hỏi kết thúc, tôi nói: “Ba con ngủ tới đây.” Cô hỏi con có đánh thức không. Tôi đáp: “Có, nhưng ba nói sói cũng đi ngủ rồi.” Cả lớp cười. 😂",
      "🎭 Tôi rủ một bạn diễn cùng",
      "Sói gặp người không dễ dọa",
      "Hai đứa chia vai diễn, hiểu truyện hơn, cả lớp cười. Tôi đóng sói gõ cửa. Bạn đóng bà hỏi ai, tôi nói tên thật. Nó bảo sói đâu. Tôi phải ra ngoài gõ lại. Lần này vẫn suýt nói tên mình. 😂"
    ],
    [
      "👟 Mang giày chưa được tính xong",
      "Tôi mang giày xong thấy hai mũi quay ra ngoài. Ba bảo nhầm bên rồi. Tôi thử đi hai bước, cũng thấy khó đi, nhưng chưa biết đổi thế nào. 🤨",
      "👟 Tôi đổi giày sang đúng chân",
      "Sửa giày rồi sửa luôn ba",
      "Tôi đổi đúng chân, đi dễ hơn. Ba khen tôi rồi mang dép ra cửa. Mẹ gọi lại: ba đang mang mỗi bên một đôi. Tôi kéo ghế ngồi xem ba đổi, giống lúc ba xem tôi. 😂",
      "🙋 Tôi nhờ mẹ chỉ cách phân biệt",
      "Mang đúng nhưng ba vẫn hỏi",
      "Mẹ chỉ cách phân biệt, tôi mang đúng. Ba hỏi chắc chưa. Tôi chỉ mẹ: “Mẹ duyệt rồi.” Ba cúi xem, tôi đưa cả chân lên gần mặt. Ba bảo đủ rồi, không cần nhìn gần thế. 🤭"
    ],
    [
      "💌 Thiệp gửi bà nhiều điều kiện",
      "Tôi vẽ thiệp tặng bà, muốn dán hình đẹp nhất. Mẹ nhắc tặng thì bà giữ luôn. Tôi cầm hình dán rất lâu, chưa quyết định được. 😏",
      "📮 Tôi cùng mẹ dán tem rồi gửi thiệp",
      "Gửi xong mới nhớ hỏi lại",
      "Tôi cùng mẹ dán tem gửi thiệp. Về nhà cứ mở hộp hình dán nhìn chỗ trống. Mẹ hỏi tiếc à. Tôi bảo không, rồi hỏi bà có thể gửi lại riêng cái hình không. Mẹ nói bà sẽ giữ cả thiệp. 😅",
      "🌸 Tôi vẽ thêm hoa trước khi gửi",
      "Ông có lý do xin thêm thiệp",
      "Tôi vẽ thêm hoa trước khi gửi. Bà gọi khen đẹp, ông hỏi sao chỉ có bà. Tôi nói ông ngủ lúc tôi vẽ. Ông bảo lần sau gọi dậy, bà hỏi: “Gọi ba lần không dậy thì sao?” Tôi bảo vẽ ông nằm ngủ luôn. 😂"
    ]
  ],
  "6": [
    [
      "🏫 Lớp 1, cặp chiếm nửa người",
      "Tôi vào lớp 1, cặp to che nửa người. Ba bảo học hành đàng hoàng. Tôi hỏi nếu con không nhớ, ba có đi học hộ không. 😳",
      "🙋 Chào cô, làm quen tôi",
      "👫 Đồng minh cùng bàn",
      "Tôi vào tiểu học, vui vẻ làm quen bạn cùng bàn. Hai đứa cùng bảo không sợ cô. Cô gọi tên, cả hai đứng dậy. Cô mới gọi một đứa. Đứa còn lại đứng để cho chắc. 😅",
      "👂 Nghe kỹ cô hướng dẫn",
      "🧐 Ghi nhớ cả giờ ra chơi",
      "Tôi vào tiểu học, hơi căng thẳng nhưng nhớ kỹ lời cô. Về nhà ba hỏi học gì. Tôi kể bốn lần chuông reo. Ba hỏi còn gì nữa. Tôi bảo giữa mấy lần đó hơi lâu. 😂"
    ],
    [
      "✏️ Hộp bút có mỗi không khí",
      "Giờ viết, bút chì nằm ở nhà. Tôi mở hộp lần nữa. Vẫn không có. Tôi đã thử làm mới nhưng bút chưa tải về. 😶",
      "🙏 Hỏi mượn tôi một cây",
      "😊 Hợp đồng một tiết học",
      "Tôi mượn bút, viết xong cảm ơn. Bạn kia hỏi chì trong vở có trả lại được không. Tôi đưa cục tẩy. Nó nhìn tôi. Hai đứa vừa nghĩ ra cách đòi nợ rất mệt. 😂",
      "👩‍🏫 Báo cô xin hỗ trợ",
      "📋 Nhớ bài bằng sự ngại",
      "Cô cho mượn bút, tôi hơi quê nên tối soạn đủ ba cây. Sáng mở cặp, quên cả hộp. Mẹ hỏi sao ba cây vẫn không có cây nào. Tôi bảo chúng ở cùng nhau. 😅"
    ],
    [
      "📚 Đánh vần tới đoạn gay cấn",
      "Tôi đọc truyện, ba ngồi nghe. Tới chữ thứ tư ba nhắm mắt. Tôi hỏi nghe không. Ba gật đầu. Tôi chưa đọc tiếp. 🤨",
      "🗣️ Tự đánh vần hết câu",
      "🏆 Con đọc xong, ba tỉnh",
      "Tôi tự đánh vần hết câu, hiểu truyện, rất tự hào. Ba khen cảm động. Tôi hỏi đoạn nào. Ba chỉ trang. Đó là trang hướng dẫn rửa tay. Tôi đọc lại cho ba nghe, lần này kiểm tra luôn. 😂",
      "🛌 Chia lượt với người nhà",
      "🌙 Hai người một truyện",
      "Tôi và mẹ đọc luân phiên, học thêm từ, rất vui. Tới lượt tôi, tôi chọn đọc chữ “Hết”. Mẹ lật ngược lại một trang. Kèo đọc chung vừa được chỉnh luật. 😏"
    ],
    [
      "📏 Đo vở hay đo bố?",
      "Tôi có thước mới, đo vở rồi đo dép. Ba bảo đo gì cũng được trừ bụng ba. Tôi chưa hỏi mà ba đã khai. 😏",
      "📐 Tập đo cạnh vở",
      "🔢 Vở không cao thêm",
      "Tôi đo đúng cạnh vở, biết bắt đầu từ số không. Ba khen thước chính xác. Tôi mang tới cái cân, hỏi cái này có chính xác không. Ba đòi quay lại đo vở. 🤭",
      "🙋 Nhờ người lớn chỉ",
      "🧠 Một câu hỏi khó cho ba",
      "Ba chỉ vạch thước, tôi biết đọc số đo. Tôi hỏi đo bụng ba cần mấy cây. Ba bảo ngoài chương trình. Mẹ kéo ghế ngồi xem. Có người muốn học thêm. 😂"
    ],
    [
      "🚸 Qua đường có đội hình",
      "Mẹ dắt tôi tới vạch sang đường. Tôi hỏi sao người lớn đợi. Mẹ bảo để an toàn. Tôi gật đầu rồi nắm chặt tay mẹ bằng cả hai tay. 🥺",
      "🤝 Nắm tay chờ mẹ dẫn",
      "🚶 Đi đúng đội hình",
      "Tôi chờ rồi qua đường đúng cách cùng mẹ. Sang tới nơi tôi vẫn nắm rất chặt. Mẹ hỏi thả ra được chưa. Tôi bảo được, nhưng mẹ phải xin phép. Người bảo vệ đổi ca hơi sớm. 😂",
      "❓ Hỏi biển báo nghĩa gì",
      "🧐 Biển báo không chào mình",
      "Mẹ giải thích biển báo, tôi hiểu thêm quy tắc. Tôi hỏi người trên biển làm gì mà bị treo ảnh. Mẹ bảo đó là hình minh họa. Tôi chỉ cái cặp: “Nó mang giống con.” Tôi cần xác nhận mình chưa bị truy nã. 😳"
    ]
  ],
  "7": [
    [
      "🏃 Vừa ăn xong đã được triệu tập",
      "Tôi vừa ăn xong, hội bạn rủ đuổi bắt. Ai cũng bảo chạy nhẹ thôi. Một đứa đã tháo dép chuẩn bị tăng tốc. 😏",
      "🥤 Nghỉ rồi chơi vừa sức",
      "😌 Thắng bằng còn sức",
      "Tôi nghỉ rồi chơi vài lượt, khỏe và vui. Đứa chạy nhanh nhất xin tôi quạt lúc vào lớp. Tôi hỏi thua chưa. Nó gật đầu. Tôi quạt luôn, cần có nhân chứng. 😂",
      "🏁 Chạy hết sức để thắng",
      "😵 Cúp vô địch là cơn mệt",
      "Tôi chạy thắng một lượt rồi mệt, vào lớp đi chậm. Đứa vừa thua trêu: “Chạy nữa đi!” Cô nghe thấy, bảo hai đứa lên bảng. Nó hết cười. Tôi cũng hết sức. 😅"
    ],
    [
      "🌧️ Mưa tan học, giày gặp hạn",
      "Tan học mưa to, tôi chờ dưới mái hiên. Bạn bên cạnh bảo nước nông lắm. Giày nó đang phát tiếng óc ách. 🤨",
      "🏠 Đứng khô, nói chuyện",
      "💬 Chờ đón thành buổi tám",
      "Tôi đứng chỗ khô, nghỉ rồi kể chuyện với bạn rất vui. Mẹ tới đón, tôi xin kể nốt. Mẹ đợi xong hỏi chuyện gì. Tôi bảo chuyện mẹ hay bắt người khác chờ. 🤭",
      "💦 Nghịch nước sát mái hiên",
      "🥶 Giày chứa hồ mini",
      "Tôi nghịch nước vui rồi lạnh vì giày ướt. Mẹ hỏi đi học hay đi bơi. Tôi hỏi vậy mai có mang kính bơi không. Mẹ không hỏi câu đó nữa. 😂"
    ],
    [
      "📺 Một tập nữa là ngủ",
      "Đến giờ ngủ, phim chưa hết. Tôi nói còn một chút. Ba hỏi chút là bao lâu. Tôi chỉ màn hình, đề nghị chờ cho biết. 🥺",
      "📴 Tắt TV, mai xem tiếp",
      "🌤️ Dậy được không cần thương lượng",
      "Tôi tắt TV, ngủ đúng giờ, sáng dậy tỉnh táo. Mẹ gọi một lần đã dậy. Mẹ sờ trán hỏi có ốm không. Tôi ngoan một hôm mà nhà nghi có chuyện. 😅",
      "🍿 Xin xem hết tập",
      "🥱 Đoạn kết vui, sáng hơi căng",
      "Tôi xem đoạn cuối cười rất vui, sáng buồn ngủ xin thêm năm phút. Mẹ hỏi ai hứa dậy được. Tôi kéo chăn: “Bạn ấy nghỉ hôm nay.” Mẹ gọi nguyên họ tên. Đổi tài khoản thất bại. 🤣"
    ],
    [
      "🏷️ Hộp bút sinh đôi",
      "Tôi với bạn cùng bàn có hộp bút giống nhau. Cả hai nhận chiếc mới hơn. Mẹ hai đứa xác nhận mua cùng hôm. Không ai chịu nghe đoạn đó. 😤",
      "✍️ Dán tên cho rõ",
      "🔍 Ai về nhà nấy",
      "Tôi dán tên, không còn nhầm hộp. Hôm sau hộp đúng tên nhưng bút hết mực. Bạn kia bảo đổi nhầm ruột. Tôi mới dán một lớp bảo vệ, nó đã tìm được đường khác. 😳",
      "⭐ Vẽ dấu hiệu riêng",
      "🎨 Ngôi sao rất có cá tính",
      "Tôi vẽ sao làm dấu, không ai nhận nhầm nữa. Cô hỏi con nhện ai vẽ. Tôi bảo sao. Cô khen sao nhiều chân. Tôi cũng không biết nhận lời khen này thế nào. 😅"
    ],
    [
      "🌻 Hoa tặng cô có cánh phản loạn",
      "Lớp làm hoa tặng cô. Một cánh của tôi chĩa ngang. Tôi bảo nó đang giơ tay phát biểu, cả bông còn lại chưa cho nói. 🤭",
      "👐 Gấp lại cánh cho đẹp",
      "🌼 Hoa chịu đứng nghiêm",
      "Tôi sửa cánh, hoa đứng đẹp, cô khen khéo. Cô thử nhấc lên, khăn bàn đi cùng. Tôi bảo hoa này đứng rất chắc. Đúng là khó phản bác. 😂",
      "🤝 Ghép cùng một bạn",
      "💐 Hoa có hai tác giả",
      "Hai đứa tôi ghép hoa chung, vui vẻ đem tặng cô. Cô hỏi ai làm cánh này. Hai đứa cùng nhận. Cô bảo hơi lệch. Hai đứa cùng nhìn sang đứa còn lại. 🤣"
    ]
  ],
  "8": [
    [
      "🧮 Bài toán mua dưa gây căng thẳng",
      "Bài toán hỏi cô Lan mua dưa rồi chia cho hàng xóm. Tôi hỏi sao cô Lan không tự đếm. Mẹ bảo vì cô đang nhờ con. 🙄",
      "📐 Vẽ hình chia từng phần",
      "🤩 Dưa được kiểm kê",
      "Tôi vẽ hình, tự giải được, phấn khởi khoe mẹ. Mẹ hỏi dưa mà sao vẽ bánh bao. Tôi bảo dùng tạm, đáp án vẫn ăn được. Mẹ chưa biết sửa chỗ nào. 😂",
      "🙋 Nhờ tôi gợi ý, làm lại",
      "😇 Đồng đội cứu bài toán",
      "Tôi nghe gợi ý rồi tự làm lại, hiểu bài hơn. Hai đứa vừa chê cô Lan chia dưa rắc rối thì cô gọi lên trình bày. Tôi bắt đầu bằng “Cô Lan rất biết chia sẻ”. Đổi giọng rất nhanh. 😅"
    ],
    [
      "📚 Một vé mượn sách, hai cám dỗ",
      "Thư viện cho mượn một cuốn. Tôi cầm sách thiên nhiên, mắt nhìn truyện tranh. Cô hỏi chọn chưa. Tôi bảo tay rồi, mắt chưa. 🤔",
      "🦉 Chọn sách thiên nhiên",
      "🌍 Con lười có người hâm mộ",
      "Tôi đọc sách, học nhiều điều về con lười. Tối xin sống giống nó. Mẹ nói nó tự tìm ăn. Tôi lật sang chim non. Nghiên cứu này có mục tiêu rất rõ. 😏",
      "🗯️ Mượn truyện đọc với bạn",
      "🤣 Cười nhỏ thất bại",
      "Tôi đọc truyện cùng bạn, học từ mới và cười. Cô thư viện tới hỏi đoạn nào. Tôi chỉ, cô cũng cười. Cả ba cùng nhìn biển giữ yên lặng. Biển đang thua. 😂"
    ],
    [
      "🖍️ Làm nhóm, ai cũng là giám đốc",
      "Nhóm làm áp phích. Bốn đứa cùng muốn chỉ đạo. Cô hỏi ai làm. Cả nhóm nhìn cái bàn như nó sắp tự làm hộ. 😶",
      "🤝 Chia việc, mỗi người một phần",
      "🏅 Bốn giám đốc chịu làm",
      "Tôi chia việc, nhóm làm vui, xong đúng giờ. Đứa cầm áp phích bảo đã nâng đỡ cả nhóm. Nó đang cầm thật. Không thể nói là nó nói quá. 😂",
      "🙇 Tự ôm phần lớn công việc",
      "😩 Gánh nhóm hơi nặng vai",
      "Tôi làm gần hết, học được nhiều nhưng mất giờ chơi, mệt đầu. Nhóm hỏi sao chưa ghi tên tụi nó. Tôi bảo hết chỗ. Nó chỉ khoảng trắng. Tôi bảo chỗ đó để thở. 😏"
    ],
    [
      "🌍 Quay địa cầu tìm nhà",
      "Tôi quay địa cầu tìm Việt Nam, quay hơi nhanh. Bạn cùng bàn bảo dừng lại. Tôi nói đang đợi Việt Nam đi qua lần nữa. 😵‍💫",
      "👩‍🏫 Nhờ cô chỉ Việt Nam",
      "📍 Tìm được nước, chưa thấy hẻm",
      "Cô chỉ Việt Nam, tôi nhớ được vị trí. Tôi hỏi sao không có nhà bà. Cô bảo quả cầu nhỏ. Tôi xin quả lớn hơn. Cô nhận ra không thể dùng lý do kích thước nữa. 😂",
      "👫 Tìm cùng một bạn",
      "🔎 Hai thám tử một quả bóng",
      "Hai đứa tôi tìm đúng Việt Nam, cô kiểm tra giúp. Tôi đo hai ngón tay rồi bảo qua nước bên cạnh rất gần. Bạn kia hỏi đi bộ được không. Cô thu quả cầu trước khi hai đứa rủ thêm người. 😅"
    ],
    [
      "🥄 Cơm tới, thìa chưa tới",
      "Bạn bên cạnh quên thìa, mở hộp cơm rồi đóng lại. Tôi hỏi không ăn à. Nó bảo đang chờ cơm tự vào miệng. 😑",
      "🤲 Cho mượn thìa sạch",
      "🍱 Hậu cần thắng lớn",
      "Tôi cho mượn thìa sạch, bạn ấy ăn được rồi rửa trả. Về kể mẹ, mẹ rất vui. Sáng hôm sau cặp có thêm cái bát. Tôi làm một việc tốt, mẹ mở luôn chi nhánh. 😂",
      "🙋 Nhờ cô tìm thìa",
      "😌 Bữa trưa thoát cảnh nhìn nhau",
      "Cô mang thìa, hai đứa ăn được bữa trưa. Bạn kia hỏi mượn muối. Tôi bảo không có. Nó nhìn cặp rất thất vọng. Mang nhiều đồ tự nhiên thành người chịu trách nhiệm. 😅"
    ]
  ],
  "9": [
    [
      "📸 Ảnh lớp lưu bằng chứng",
      "Lớp chụp ảnh, chú bảo cười tự nhiên. Bạn bên cạnh cười như đau bụng. Chú bảo tự nhiên hơn. Nó bảo đây là mặt thật. 😬",
      "👔 Chỉnh áo tóc rồi cười",
      "😎 Ảnh đẹp, mất một chiếc dép",
      "Tôi chỉnh áo tóc, chụp đẹp và vui. Mẹ chọn ảnh làm màn hình. Ba vuốt sang ảnh tôi ngoáy mũi lúc chờ chụp. Tôi xin giữ tấm kia. Ba hỏi tấm kia là tấm nào. Mẹ nhìn ba. 😳",
      "🤪 Mải đùa, quên cổ áo",
      "😆 Một mình một biểu cảm",
      "Tôi mải đùa, cười tươi dù cổ áo lệch. Xem ảnh thấy cả lớp nhìn camera, mình nhìn sang bên. Tôi xin chụp lại. Chú hỏi có gọi lại cả lớp không. Tôi bảo thôi, kỷ niệm là được. 😅"
    ],
    [
      "💇 Cắt ngắn chút thôi chú",
      "Chú thợ hỏi cắt sao, tôi nói ngắn chút. Người nhà nói gọn hẳn đi. Chú nhìn tôi. Tôi nhìn người nhà. Tiệm chưa cắt mà đã căng. 😰",
      "✂️ Tự chọn kiểu gọn mình thích",
      "🥰 Gương phản chiếu đúng khách",
      "Tôi chọn đúng kiểu thích, tóc gọn, vui soi gương. Ba bảo giống ba hồi trẻ. Mẹ mở ảnh cũ. Tôi hỏi chú thợ còn đổi được không. Ba rất muốn giấu điện thoại mẹ. 😂",
      "🙆 Để người lớn chọn",
      "🍄 Nấm mới mọc trong nhà",
      "Người lớn chọn, tóc gọn nhưng ngắn quá, tôi hơi buồn. Mẹ bảo nhìn thông minh. Về bà hỏi cháu nhà ai. Tôi nhìn mẹ. Thông minh mà mất luôn nhận diện. 😶"
    ],
    [
      "🎁 Hội chợ hay xưởng nhuộm áo?",
      "Lớp làm đồ bán hội chợ. Tôi dặn mẹ tới mua. Mẹ hỏi có giảm giá không. Tôi bảo tình cảm đừng quy ra tiền. 😏",
      "🧵 Làm kỹ, giữ áo sạch",
      "🎀 Tác phẩm có người mua",
      "Tôi làm món đẹp, giữ áo sạch, tự hào bán cho mẹ. Mẹ hỏi ai mua nguyên liệu. Tôi bảo mẹ. Mẹ hỏi vậy sao vẫn phải trả tiền. Tôi nói để được ủng hộ con. Mẹ trả thật. 😂",
      "🙌 Chạy giúp mọi gian hàng",
      "🎊 Áo ghi nhật ký ngày hội",
      "Tôi chạy giúp mọi gian hàng, vui nhưng áo đầy màu và hồ. Mẹ hỏi hôm nay làm gì. Tôi bảo không nhớ. Mẹ chỉ từng vết trên áo kể lại. Áo báo hơi nhiều. 🤣"
    ],
    [
      "🏸 Quả cầu xin nghỉ trên lưới",
      "Cầu mắc trên lưới, cả nhóm nhìn lên. Tôi bảo chờ nó xuống. Bạn kia hỏi nó có chân không. Nhóm chuyển sang tìm người cao. 🤔",
      "🙋 Nhờ người phụ trách lấy",
      "🏸 Trận đấu được cứu",
      "Người phụ trách lấy cầu, nhóm chơi tiếp vui vẻ. Tôi xin giao lại lượt trước. Đối thủ bảo lỗi vẫn tính. Tôi hỏi luật đâu. Nó bảo ở phía đội đang thắng. 😏",
      "🎒 Dùng cầu dự phòng",
      "🔁 Thay người không cần còi",
      "Tôi lấy cầu dự phòng, nhóm chơi tiếp. Cầu cũ được lấy xuống, tôi cất kỹ. Bạn cùng đội hỏi sao giữ cái yếu. Tôi bảo để thua còn biết đổ ai. Nó gật đầu, khá hiểu. 😂"
    ],
    [
      "📋 Lịch trực nhật bị mất trí nhớ",
      "Nước làm nhòe lịch trực nhật. Cả tổ khẳng định hôm nay không đến lượt mình. Cô mới hỏi, chưa ai bị gọi tên. 😇",
      "✍️ Hỏi tôi rồi ghi lại",
      "🧹 Sự thật hơi có bụi",
      "Tôi đối chiếu rồi ghi đúng lịch: đến lượt mình. Đứa nhiệt tình tìm lịch nhất xin đi uống nước. Tôi hỏi uống xong về lau bảng nhé. Nó hết khát. 😂",
      "👩‍🏫 Nhờ cô kiểm tra",
      "🔍 Cô có bản dự phòng",
      "Cô khôi phục đúng lịch, cả tổ tôi phải trực. Một đứa hỏi có cần lau bảng không. Cô đưa giẻ. Nó định hỏi tiếp, tôi kéo tay. Đừng tự mở thêm nhiệm vụ. 😅"
    ]
  ],
  "10": [
    [
      "🌱 Hạt đậu chưa rep",
      "Cô giao theo dõi đậu nảy mầm. Tôi nhìn ba lần một ngày. Ba hỏi sao chưa mọc. Tôi nói ba nhìn thêm cũng không nhanh hơn. 🤨",
      "📏 Ghi thay đổi mỗi ngày",
      "🔬 Đậu mọc, hồ sơ dày lên",
      "Tôi ghi kỹ, hiểu rễ có trước lá. Ba thấy cây cao thêm liền khoe mình vừa phát hiện. Tôi mở sổ ghi từ tối qua. Ba bảo mình chỉ xác nhận. Chốt vai rất nhanh. 😏",
      "👫 Quan sát cùng một bạn",
      "🌿 Hai chậu có cuộc thi riêng",
      "Hai đứa tôi so cây, học rất vui. Cây tôi thấp, tôi bảo chất lượng quan trọng. Hôm sau cao hơn, tôi bảo chiều cao quan trọng. Bạn kia hỏi còn tiêu chí nào dự phòng không. 😂"
    ],
    [
      "📝 Điểm số không theo lời cầu nguyện",
      "Điểm bài kiểm tra thấp hơn tôi nghĩ. Tôi nhìn lại tên. Đúng tên mình, hết đường nói phát nhầm. 😶",
      "🔎 Chữa lỗi, hỏi cô lại",
      "😤 Dữ kiện bị bỏ quên",
      "Tôi chữa lỗi, hiểu đã đọc thiếu đề, vẫn hơi buồn. Ba bảo hồi nhỏ toàn điểm mười. Bà từ bếp nói vọng: “Mười trên hai mươi.” Ba hỏi bà đang nấu gì. Tôi bảo đợi, con đang nghe. 🤣",
      "🤝 Chữa cùng bạn rồi nghỉ",
      "🙂 Bài bớt sai, lòng bớt nặng",
      "Hai đứa tôi chữa bài, hiểu hơn rồi ra sân nghỉ, nhẹ lòng. Bạn kia bảo vẫn ổn. Tôi hỏi sao. Nó đưa bài mình thấp hơn một điểm. Tình bạn có lúc giúp đỡ theo cách hơi kỳ. 😅"
    ],
    [
      "💌 Lưu bút hay hồ sơ bóc phốt?",
      "Cuối tiểu học, tôi mở sổ kỷ niệm. Hội bạn xin viết. Tôi dặn không kể chuyện quê. Một đứa trả bút: vậy hết chuyện rồi. 😳",
      "✍️ Tự ghi điều đã học",
      "😌 Lớn lên có bằng chứng",
      "Tôi tự viết từng năm, thấy mình tiến bộ nên tự hào. Trang đầu muốn làm bác sĩ, trang cuối muốn ngủ thêm. Mẹ hỏi ước mơ đâu. Tôi bảo chưa bỏ, đang nghỉ. 🤭",
      "💬 Nhờ tôi viết lời nhắn",
      "🥹 Tình bạn có nét chữ khó đọc",
      "Tôi nhận lời nhắn, cười vui cả buổi. Một đứa viết “mãi là tôi”, trang sau ghi “nhớ trả tẩy”. Tôi hỏi sao không cho luôn. Nó bảo tôi thì mãi, tẩy thì mới mua. 😂"
    ],
    [
      "📓 Từ mới khiến cả nhà họp",
      "Tôi gặp từ tiết kiệm trong truyện. Ba giải thích không mua đồ linh tinh. Mẹ đứng cửa nghe, tay cầm hộp đồ ba vừa đặt. 🤨",
      "✍️ Ghi từ rồi tự tra",
      "📚 Ví dụ ở ngay phòng khách",
      "Tôi tra nghĩa, viết câu về ba tiết kiệm. Mẹ dán lên tủ lạnh. Ba hỏi có thể đổi nhân vật không. Tôi bảo đây là bài tập, không phải đơn xin phép. 😏",
      "❓ Hỏi người nhà giải thích",
      "💸 Bài học có nhân chứng",
      "Mẹ giải thích bằng chuyện mua đồ không cần. Ba ôm cần câu mới ngồi im. Tôi hỏi sao nhà cần ba cái. Mẹ đưa bánh cho tôi. Ba bảo trả lời xong hãy ăn. Mẹ bảo con cứ ăn đi. 😂"
    ],
    [
      "🎣 Câu cá hay ngồi cho muỗi ăn?",
      "Tôi ngồi cạnh người nhà xem câu cá. Người câu nói sắp có rồi. Tôi hỏi cá có báo trước không. Người ấy im, cần cũng im. 🤔",
      "👀 Ngồi quan sát cùng người nhà",
      "🐟 Cá chưa lên, chuyện lên hết",
      "Tôi nghe kể nhiều loài cá, kiên nhẫn quan sát. Người câu tả con cá thoát to bằng cánh tay. Mẹ nói hôm trước mới bằng bàn tay. Tôi hỏi nó lớn trong lúc kể à. Không ai kể tiếp. 😂",
      "🖍️ Vẽ hồ từ chỗ an toàn",
      "🎨 Cá trong tranh dễ bắt hơn",
      "Tôi vẽ hồ từ chỗ an toàn, thêm cá thật to. Người nhà chụp gửi nhóm ghi thành quả hôm nay. Tôi định nói là cá vẽ. Người nhà đưa bánh. Tôi thêm con nữa. Hai bên hợp tác khá nhanh. 🤭"
    ]
  ]
};

export function applyChildhoodHumor(event, age, index) {
  const copy = stories[age]?.[index];
  if (!copy) return event;
  const [title, text, first, firstTitle, firstText, second, secondTitle, secondText] = copy;
  return {
    ...event, title, text,
    choices: event.choices.map((choice, choiceIndex) => ({
      ...choice,
      label: choiceIndex === 0 ? first : second,
      title: choiceIndex === 0 ? firstTitle : secondTitle,
      text: choiceIndex === 0 ? firstText : secondText,
      confirmText: 'Tiếp tục',
    })),
  };
}

const automaticBaseIds = {
  1: 'a1-bath-time', 2: 'a2-block-tower', 3: 'a3-playground',
  4: 'a4-buttons', 5: 'a5-puzzle', 6: 'a6-pencil',
  7: 'a7-rain', 8: 'a8-library', 9: 'a9-haircut', 10: 'a10-class-test',
};

// Two additions and one base story per age use a single, authored outcome.
export function applyChildhoodAutomaticEvent(event, age) {
  if (age < 1 || age > 10) return event;
  const addition = /^everyday-added-\d+-(1|2)$/.exec(event.id ?? '');
  const index = addition ? Number(addition[1]) + 2
    : event.id === automaticBaseIds[age] ? 1 : null;
  if (index === null) return event;
  const copy = stories[age][index];
  const outcomeIndex = (age + index) % 2;
  const outcomeTitle = copy[outcomeIndex === 0 ? 3 : 6];
  const outcome = event.choices.find(choice => choice.title === outcomeTitle);
  if (!outcome) return event;
  const text = outcome.text;
  return {
    ...event,
    automaticResult: true,
    text,
    choices: [{
      ...outcome, label: 'Đồng ý', title: event.title, text,
      confirmText: 'Đồng ý',
    }],
  };
}
