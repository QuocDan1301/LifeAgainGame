export const ageEvents = {
  1: [
    {
      title: "Những bước chân đầu tiên",
      text: "Mẹ đang dang tay gọi bạn ở phía trước. Bạn đứng lên, đôi chân còn hơi run. Bạn sẽ làm gì?",
      image: "",
      choices: [
        {
          label: "👣 Tự bước về phía mẹ",
          title: "Bạn làm được rồi!",
          text: "Bạn chập chững bước vài bước rồi ngã vào vòng tay mẹ. Cả nhà vỗ tay cổ vũ.",
          effects: { health: 3, happiness: 4 },
          image: "",
          confirmText: "Thích quá!",
        },
        {
          label: "🤝 Nắm tay ba để bước đi",
          title: "Có ba bên cạnh",
          text: "Bạn nắm chặt tay ba và tập đi quanh phòng. Bạn thấy an tâm hơn sau mỗi bước chân.",
          effects: { health: 2, happiness: 5 },
          image: "",
          confirmText: "Đi cùng ba!",
        },
      ],
    },

    {
      title: "Tiếng gọi đầu tiên",
      text: "Mẹ ngồi bên cạnh và chậm rãi nói “mẹ… mẹ…”. Bạn chăm chú nhìn mẹ.",
      image: "",
      choices: [
        {
          label: "🗣️ Bập bẹ gọi “mẹ”",
          title: "Mẹ nghe thấy rồi!",
          text: "Bạn bật ra tiếng “mẹ” còn ngọng nghịu. Mẹ xúc động ôm bạn vào lòng.",
          effects: { intelligence: 3, happiness: 3 },
          image: "",
          confirmText: "Mẹ ơi!",
        },
        {
          label: "👏 Vỗ tay và cười với mẹ",
          title: "Nụ cười thay lời nói",
          text: "Bạn chưa nói được nhưng vui vẻ vỗ tay. Mẹ cười và tiếp tục trò chuyện cùng bạn.",
          effects: { intelligence: 1, happiness: 5 },
          image: "",
          confirmText: "Hihi!",
        },
      ],
    },

    {
      title: "Ú òa!",
      text: "Ba lấy hai tay che mặt rồi bất ngờ ló ra: “Ú òa!”. Bạn tròn mắt nhìn ba.",
      image: "",
      choices: [
        {
          label: "😆 Cười và chơi tiếp",
          title: "Tiếng cười khắp phòng",
          text: "Bạn cười khanh khách mỗi khi ba ló mặt ra. Ba cũng bật cười theo bạn.",
          effects: { happiness: 5 },
          image: "",
          confirmText: "Nữa đi ba!",
        },
        {
          label: "🙈 Bắt chước ba che mặt",
          title: "Đến lượt bạn!",
          text: "Bạn đưa đôi tay nhỏ lên che mặt rồi hé nhìn. Ba giả vờ bất ngờ khiến bạn vô cùng thích thú.",
          effects: { intelligence: 3, happiness: 2 },
          image: "",
          confirmText: "Ú òa!",
        },
      ],
    },
  ],

  2: [
    {
      title: "Tự xúc ăn nào!",
      text: "Mẹ đặt bát cơm nhỏ trước mặt bạn và đưa cho bạn chiếc thìa. Bạn muốn tự mình ăn thử.",
      image: "",
      choices: [
        {
          label: "🥄 Tự xúc ăn",
          title: "Bạn tự lập rồi!",
          text: "Bạn cầm thìa thật chắc, xúc được vài miếng dù đôi lúc làm rơi thức ăn. Mẹ mỉm cười khen bạn rất giỏi.",
          effects: { health: 3, intelligence: 2, happiness: 3 },
          image: "",
          confirmText: "Con tự ăn!",
        },
        {
          label: "🤗 Nhờ mẹ giúp một chút",
          title: "Mẹ luôn ở đây",
          text: "Bạn nhờ mẹ giúp khi gặp miếng khó xúc. Sau đó, bạn lại tự mình thử tiếp.",
          effects: { health: 2, happiness: 4 },
          image: "",
          confirmText: "Mẹ giúp con!",
        },
      ],
    },

    {
      title: "Con muốn nói!",
      text: "Bạn nhìn thấy một chú mèo đang đi ngang qua sân. Bạn muốn kể cho ba nghe điều mình nhìn thấy.",
      image: "",
      choices: [
        {
          label: "🐱 Gọi “mèo kìa!”",
          title: "Bạn biết kể chuyện rồi!",
          text: "Bạn chỉ tay về phía chú mèo và nói thật to. Ba nhìn theo rồi cùng bạn quan sát chú mèo.",
          effects: { intelligence: 4, happiness: 3 },
          image: "",
          confirmText: "Mèo kìa!",
        },
        {
          label: "👉 Chỉ tay cho ba xem",
          title: "Ba hiểu bạn!",
          text: "Bạn chưa nói được nhiều nhưng biết chỉ tay và gọi ba. Hai ba con cùng nhìn chú mèo chạy qua.",
          effects: { intelligence: 2, happiness: 4 },
          image: "",
          confirmText: "Ba nhìn này!",
        },
      ],
    },

    {
      title: "Đồ chơi của con",
      text: "Bạn đang chơi ô tô thì anh/chị muốn mượn. Bạn nhìn chiếc ô tô yêu thích của mình.",
      image: "",
      choices: [
        {
          label: "🤝 Cho anh/chị chơi cùng",
          title: "Chơi cùng vui hơn!",
          text: "Bạn đưa chiếc ô tô cho anh/chị. Hai người cùng đẩy xe qua lại và cười vui vẻ.",
          effects: { happiness: 5, intelligence: 2 },
          image: "",
          confirmText: "Chơi cùng nhé!",
        },
        {
          label: "🚗 Giữ đồ chơi của mình",
          title: "Đây là đồ chơi của con",
          text: "Bạn ôm chiếc ô tô vào lòng. Mẹ nhẹ nhàng dạy bạn cách nói “cho con chơi xong nhé” thay vì giành đồ chơi.",
          effects: { intelligence: 3, happiness: 2 },
          image: "",
          confirmText: "Con chơi trước!",
        },
      ],
    },
  ],

  3: [
    {
      title: "Ngày đầu đến lớp",
      text: "Hôm nay bạn lần đầu đến lớp mầm non. Cô giáo đang đứng ở cửa đón bạn, còn mẹ chuẩn bị ra về.",
      image: "",
      choices: [
        {
          label: "👋 Vẫy tay chào mẹ",
          title: "Bạn thật dũng cảm!",
          text: "Bạn hơi buồn nhưng vẫn vẫy tay chào mẹ. Cô giáo nắm tay bạn và dẫn vào lớp làm quen với các bạn.",
          effects: { happiness: 4, intelligence: 3 },
          image: "",
          confirmText: "Mẹ về nhé!",
        },
        {
          label: "🤗 Ôm mẹ thật chặt",
          title: "Một cái ôm thật ấm áp",
          text: "Bạn ôm mẹ thêm một lúc. Sau khi được mẹ động viên, bạn lấy can đảm bước vào lớp cùng cô.",
          effects: { happiness: 5, intelligence: 2 },
          image: "",
          confirmText: "Con sẽ cố gắng!",
        },
      ],
    },

    {
      title: "Chiếc hộp màu sắc",
      text: "Cô giáo đưa cho bạn một hộp bút màu và hỏi: “Con muốn vẽ gì hôm nay?”",
      image: "",
      choices: [
        {
          label: "🌈 Vẽ một chiếc cầu vồng",
          title: "Bức tranh thật nhiều màu!",
          text: "Bạn chọn từng màu mình thích và vẽ một chiếc cầu vồng thật lớn. Cô giáo khen trí tưởng tượng của bạn.",
          effects: { intelligence: 4, happiness: 4 },
          image: "",
          confirmText: "Con vẽ cầu vồng!",
        },
        {
          label: "👨‍👩‍👧 Vẽ gia đình",
          title: "Gia đình trong mắt bạn",
          text: "Bạn vẽ ba, mẹ và mình đứng cạnh nhau. Dù hình vẽ còn ngộ nghĩnh, ai cũng có một nụ cười thật lớn.",
          effects: { intelligence: 3, happiness: 5 },
          image: "",
          confirmText: "Đây là gia đình con!",
        },
      ],
    },

    {
      title: "Cùng bạn xây lâu đài",
      text: "Bạn và các bạn đang có một đống khối gỗ. Bạn muốn xây một tòa lâu đài thật cao.",
      image: "",
      choices: [
        {
          label: "🏰 Cùng nhau xây",
          title: "Lâu đài của chúng mình!",
          text: "Mỗi người đặt một khối gỗ. Cuối cùng, cả nhóm xây được một tòa lâu đài nhỏ và cùng nhau reo vui.",
          effects: { intelligence: 3, happiness: 5 },
          image: "",
          confirmText: "Xây cùng nhau!",
        },
        {
          label: "🧱 Tự xây thật cao",
          title: "Thử thách của bạn",
          text: "Bạn cẩn thận xếp từng khối gỗ. Tòa tháp càng lúc càng cao, nhưng rồi đổ xuống. Bạn bật cười và bắt đầu lại.",
          effects: { intelligence: 4, happiness: 3 },
          image: "",
          confirmText: "Xây lại nào!",
        },
      ],
    },
  ],

  4: [
    {
      title: "Bạn mới trong lớp",
      text: "Hôm nay lớp có một bạn mới. Bạn ấy ngồi một mình ở góc lớp và có vẻ hơi ngại ngùng.",
      image: "",
      choices: [
        {
          label: "👋 Chủ động làm quen",
          title: "Một người bạn mới!",
          text: "Bạn đến gần, mỉm cười và hỏi: “Bạn tên gì?”. Hai bạn nhanh chóng cùng chơi đồ hàng.",
          effects: { happiness: 5, intelligence: 3 },
          image: "",
          confirmText: "Mình làm bạn nhé!",
        },
        {
          label: "🧸 Đưa bạn một món đồ chơi",
          title: "Chia sẻ thật đáng yêu",
          text: "Bạn đưa cho bạn mới một món đồ chơi. Bạn ấy mỉm cười và cùng bạn chơi.",
          effects: { happiness: 5, intelligence: 2 },
          image: "",
          confirmText: "Bạn chơi cùng mình!",
        },
      ],
    },

    {
      title: "Hạt giống nhỏ",
      text: "Ba đưa bạn một hạt giống và nói: “Nếu chăm sóc tốt, hạt giống này sẽ lớn thành cây.”",
      image: "",
      choices: [
        {
          label: "🌱 Tự trồng hạt giống",
          title: "Một mầm cây đang lớn!",
          text: "Bạn cho đất vào chậu, đặt hạt giống xuống rồi tưới nước. Mỗi ngày bạn đều háo hức kiểm tra xem cây đã mọc chưa.",
          effects: { intelligence: 4, happiness: 4 },
          image: "",
          confirmText: "Mau lớn nhé!",
        },
        {
          label: "💧 Cùng ba chăm sóc",
          title: "Cùng nhau chăm cây",
          text: "Bạn cùng ba tưới nước và đặt chậu cây nơi có ánh nắng. Bạn bắt đầu hiểu rằng cây cần thời gian để lớn lên.",
          effects: { intelligence: 5, happiness: 3 },
          image: "",
          confirmText: "Con chăm cây!",
        },
      ],
    },

    {
      title: "Chiếc bánh sinh nhật",
      text: "Sinh nhật bạn sắp bắt đầu. Trên bàn có một chiếc bánh thật đẹp và mọi người đang chờ bạn.",
      image: "",
      choices: [
        {
          label: "🎂 Mời mọi người cùng ăn",
          title: "Niềm vui được chia sẻ",
          text: "Bạn cắt bánh và mời từng người một. Nhìn mọi người vui vẻ, bạn cũng cười thật tươi.",
          effects: { happiness: 6, intelligence: 2 },
          image: "",
          confirmText: "Mọi người ăn bánh nhé!",
        },
        {
          label: "🎁 Mở quà trước",
          title: "Món quà bất ngờ!",
          text: "Bạn háo hức mở món quà được tặng. Sau đó, bạn cảm ơn mọi người và cùng cả nhà ăn bánh.",
          effects: { happiness: 5, intelligence: 3 },
          image: "",
          confirmText: "Con cảm ơn!",
        },
      ],
    },
  ],

  5: [
    {
      title: "Bạn đã lớn rồi!",
      text: "Buổi sáng, mẹ chuẩn bị quần áo cho bạn. Hôm nay bạn muốn tự chuẩn bị mọi thứ trước khi đi học.",
      image: "",
      choices: [
        {
          label: "👕 Tự mặc quần áo",
          title: "Bạn thật tự lập!",
          text: "Bạn tự chọn quần áo, mặc vào và cố gắng cài từng chiếc cúc. Có một chiếc hơi khó nhưng bạn vẫn kiên nhẫn thử lại.",
          effects: { intelligence: 4, happiness: 4 },
          image: "",
          confirmText: "Con tự làm!",
        },
        {
          label: "🎒 Tự chuẩn bị ba lô",
          title: "Sẵn sàng đến trường!",
          text: "Bạn kiểm tra sách, hộp bút và bình nước rồi tự đeo ba lô. Mẹ nhìn bạn và mỉm cười vì bạn đã lớn hơn rất nhiều.",
          effects: { intelligence: 5, happiness: 3 },
          image: "",
          confirmText: "Con sẵn sàng rồi!",
        },
      ],
    },

    {
      title: "Bài toán đầu tiên",
      text: "Cô giáo đặt trước mặt bạn 5 quả táo và hỏi: “Nếu cô lấy đi 2 quả thì còn lại bao nhiêu quả?”",
      image: "",
      choices: [
        {
          label: "🍎 Đếm từng quả táo",
          title: "Bạn tìm ra đáp án!",
          text: "Bạn vừa chỉ vừa đếm: một, hai, ba. Bạn vui mừng khi tìm được đáp án và cô giáo khen bạn biết suy nghĩ.",
          effects: { intelligence: 6, happiness: 3 },
          image: "",
          confirmText: "Còn 3 quả!",
        },
        {
          label: "🧠 Suy nghĩ rồi trả lời",
          title: "Bạn đang học cách suy luận",
          text: "Bạn suy nghĩ một lúc rồi đưa ra câu trả lời. Cô giáo giải thích thêm và bạn hiểu cách tính.",
          effects: { intelligence: 5, happiness: 4 },
          image: "",
          confirmText: "Con biết rồi!",
        },
      ],
    },

    {
      title: "Giúp đỡ bạn",
      text: "Trong giờ chơi, một bạn vô tình làm rơi hộp bút. Những chiếc bút lăn khắp sàn.",
      image: "",
      choices: [
        {
          label: "🤝 Giúp bạn nhặt bút",
          title: "Một người bạn tốt",
          text: "Bạn nhanh chóng cúi xuống nhặt những chiếc bút cùng bạn. Hai người cùng cất chúng lại vào hộp.",
          effects: { happiness: 5, intelligence: 3 },
          image: "",
          confirmText: "Mình giúp bạn!",
        },
        {
          label: "💬 Hỏi bạn có cần giúp không",
          title: "Biết quan tâm đến người khác",
          text: "Bạn hỏi: “Bạn có cần mình giúp không?”. Khi bạn gật đầu, hai người cùng nhau nhặt hết số bút.",
          effects: { happiness: 6, intelligence: 3 },
          image: "",
          confirmText: "Mình cùng làm nhé!",
        },
      ],
    },
  ],

  6: [
    {
      title: "Ngày đầu đến trường",
      text: "Hôm nay là ngày đầu tiên bạn vào lớp 1.",
      choices: [
        {
          label: "Hào hứng bước vào lớp",
          title: "Một khởi đầu mới",
          text: "Bạn chính thức trở thành học sinh tiểu học và làm quen với bạn mới.",
          effects: { intelligence: 2, happiness: 3 },
          achievementIds: ["primary-school"],
          confirmText: "Đi học thôi!",
        },
        {
          label: "Nắm tay mẹ đi vào lớp",
          title: "Đã bớt bỡ ngỡ",
          text: "Nhờ mẹ động viên, bạn bước vào lớp và bắt đầu buổi học đầu tiên.",
          effects: { happiness: 2 },
          achievementIds: ["primary-school"],
          confirmText: "Mình làm được rồi!",
        },
      ],
    },
  ],
};
