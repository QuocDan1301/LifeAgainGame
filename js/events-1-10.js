// 30 sự kiện • 60 lựa chọn • Emoji ở cả hai popup.
// Đặt file này cùng thư mục js/events.js; media ở img/events/childhood.
const asset = () => "";

export const ageEvents1To10 = {
  1: [
    {
      id: "a1-first-steps",
      title: "👣 Những bước chân đầu tiên",
      text: "Ba dang tay đón ở phía bên kia tấm thảm. Bạn vịn ghế đứng lên, đôi chân còn run run. 👶",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "🤝 Nắm tay ba rồi bước thử",
          title: "🚶 Từng bước vững vàng",
          text: "Bạn nắm tay ba và bước được một đoạn ngắn. Cả nhà vỗ tay, còn bạn cười toe toét. 👏",
          effects: {
            health: 3,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Mình đi được rồi!",
          achievementIds: [],
        },
        {
          label: "🪑 Ngồi xuống nghỉ rồi thử lại",
          title: "🐢 Chậm một chút cũng được",
          text: "Bạn ngồi phịch xuống tấm thảm, hơi phụng phịu. Nghỉ một lúc giúp bạn lấy lại sức trước khi tập tiếp. 🌤️",
          effects: {
            health: 2,
            happiness: -1,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Lát nữa thử tiếp!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a1-bath-time",
      title: "🛁 Chậu nước đầy tiếng cười",
      text: "Đến giờ tắm, mẹ thả một chú vịt đồ chơi vào chậu. Bạn nhìn những gợn nước nhỏ lan ra. 🦆",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "💦 Vỗ nước chơi cùng chú vịt",
          title: "🌊 Cơn mưa tí hon",
          text: "Bạn làm nước bắn tung tóe rồi cười khanh khách. Buổi tắm kết thúc khi bạn đã sạch sẽ và thoải mái. 😆",
          effects: {
            health: 2,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Vui quá đi!",
          achievementIds: [],
        },
        {
          label: "🧺 Ôm khăn, chờ mẹ tắm nhanh",
          title: "🫧 Sạch sẽ nhưng hơi phụng phịu",
          text: "Bạn chưa thích nước lắm nên ôm chặt chiếc khăn. Mẹ tắm nhanh cho bạn, nhưng bạn vẫn còn hơi khó chịu. 😗",
          effects: {
            health: 2,
            happiness: -1,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Xong rồi nhé!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a1-bedtime",
      title: "🧸 Cơn buồn ngủ kéo đến",
      text: "Trời đã tối mà con gấu bông trên giường vẫn khiến bạn muốn chơi thêm. Mẹ bắt đầu hát ru. 🌙",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "🧸 Ôm gấu và nghe mẹ hát",
          title: "💤 Giấc ngủ êm đềm",
          text: "Bạn lim dim rồi ngủ ngon trong tiếng ru quen thuộc. Sáng hôm sau, bạn tỉnh dậy đầy sức sống. 🛌",
          effects: {
            health: 3,
            happiness: 2,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Ngủ ngon nào!",
          achievementIds: [],
        },
        {
          label: "🎲 Chơi thêm với gấu bông",
          title: "🥱 Thêm một chút thôi",
          text: "Bạn vui vẻ chơi thêm một lúc rồi mới chịu ngủ. Đêm ngắn hơn khiến sáng hôm sau bạn hơi uể oải. 🌅",
          effects: {
            health: -2,
            happiness: 2,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Mai ngủ sớm hơn!",
          achievementIds: [],
        },
      ],
    },
  ],
  2: [
    {
      id: "a2-picture-book",
      title: "📖 Quyển sách biết kể chuyện",
      text: "Mẹ mở một quyển sách tranh có mèo, chó và những chiếc xe nhiều màu. Bạn tò mò chỉ vào từng hình. 🖼️",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "❓ Hỏi tên từng hình",
          title: "🧠 Một kho từ mới",
          text: "Bạn bập bẹ nhắc lại những từ mẹ vừa đọc. Mỗi lần gọi đúng, bạn lại được mẹ ôm và khen. 🔎",
          effects: {
            intelligence: 4,
            happiness: 2,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Con nhớ rồi!",
          achievementIds: [],
        },
        {
          label: "🗨️ Tự kể chuyện theo tranh",
          title: "🦄 Câu chuyện ngộ nghĩnh",
          text: "Bạn ghép những hình vẽ thành câu chuyện chẳng giống ai. Cả nhà bật cười trước trí tưởng tượng của bạn. 🤭",
          effects: {
            intelligence: 2,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Còn nữa cơ!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a2-block-tower",
      title: "🧱 Tòa tháp nhỏ bị đổ",
      text: "Bạn đang xếp những khối gỗ thì tòa tháp nghiêng sang một bên rồi đổ xuống thảm. 🏗️",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🧱 Thử xếp khối to xuống dưới",
          title: "🏰 Nền móng chắc chắn",
          text: "Sau vài lần thử, bạn làm được tòa tháp đứng vững hơn. Bạn reo lên khi đặt khối cuối cùng. 🥳",
          effects: {
            intelligence: 3,
            happiness: 2,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Lần này không đổ!",
          achievementIds: [],
        },
        {
          label: "👨‍👧 Nhờ ba xếp cùng mình",
          title: "🛠️ Hai người cùng xây",
          text: "Ba chỉ bạn cách đặt từng khối. Tòa tháp không cao lắm, nhưng được chơi cùng ba khiến bạn rất vui. 💞",
          effects: {
            intelligence: 1,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Ba xây nữa đi!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a2-lost-toy",
      title: "🚗 Chiếc xe đồ chơi đi đâu mất?",
      text: "Bạn muốn chơi chiếc xe nhỏ nhưng tìm mãi không thấy. Lần cuối bạn nhớ nó ở gần chiếc ghế. 🛋️",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "🔍 Cùng mẹ tìm quanh chiếc ghế",
          title: "🕵️ Thám tử bé xíu",
          text: "Bạn lần theo chỗ mình vừa chơi và thấy xe nằm dưới ghế. Bạn học được cách nhớ lại những việc đã làm. 🎯",
          effects: {
            intelligence: 3,
            happiness: 2,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Tìm thấy rồi!",
          achievementIds: [],
        },
        {
          label: "🪀 Lấy món khác ra chơi",
          title: "🍃 Tạm quên chiếc xe",
          text: "Bạn tự chọn một món đồ chơi khác. Bạn biết thêm cách chơi mới nhưng vẫn hơi tiếc chiếc xe đang thất lạc. 😕",
          effects: {
            intelligence: 1,
            happiness: -1,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Lát nữa tìm tiếp!",
          achievementIds: [],
        },
      ],
    },
  ],
  3: [
    {
      id: "a3-preschool",
      title: "🎒 Buổi đầu ở mẫu giáo",
      text: "Lớp mẫu giáo đầy đồ chơi lạ. Cô giáo mời bạn vào chơi, còn ba mẹ đứng chờ ngoài cửa. 🏫",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "👫 Ra sân chơi cùng cô và các bạn",
          title: "🌈 Những người bạn đầu tiên",
          text: "Bạn chạy những bước nhỏ theo trò chơi của cô. Chẳng mấy chốc, bạn đã cười cùng một người bạn mới. 😁",
          effects: {
            health: 2,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Mai con lại đi học!",
          achievementIds: [],
        },
        {
          label: "🍽️ Nhờ cô ngồi cạnh khi ăn và nghỉ",
          title: "🤗 Dần quen nơi mới",
          text: "Cô ở bên giúp bạn ăn, nghỉ đúng giờ. Bạn được chăm sóc chu đáo nhưng vẫn hơi nhớ ba mẹ. 🌷",
          effects: {
            health: 2,
            happiness: -2,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Rồi mình sẽ quen!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a3-playground",
      title: "🛝 Cầu trượt đông vui",
      text: "Đến giờ chơi ngoài trời, bạn nhìn thấy cầu trượt và một khoảng sân rộng để chạy nhảy. ☀️",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "🚶 Xếp hàng chờ lượt trượt",
          title: "🎢 Đến lượt mình rồi!",
          text: "Bạn chờ tới lượt rồi trượt xuống trong tiếng cười. Chơi ngoài trời giúp bạn vận động thoải mái. 😃",
          effects: {
            health: 3,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Trượt thêm lần nữa!",
          achievementIds: [],
        },
        {
          label: "🏃 Chạy chơi liên tục khắp sân",
          title: "🔋 Vui đến quên nghỉ",
          text: "Bạn thích thú chạy từ góc này sang góc khác. Khi cô gọi vào lớp, bạn mới nhận ra mình đã thấm mệt. 😮‍💨",
          effects: {
            health: -1,
            happiness: 4,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Nghỉ một chút đã!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a3-nap",
      title: "😴 Giờ ngủ trưa",
      text: "Cô giáo kéo rèm cho lớp dịu ánh sáng. Bạn nằm cạnh chiếc gối nhỏ nhưng vẫn muốn trò chuyện. 🕛",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "🛏️ Ôm gối và ngủ một giấc",
          title: "🌞 Buổi chiều tỉnh táo",
          text: "Bạn ngủ được một giấc êm rồi thức dậy vui vẻ. Buổi chiều, bạn có đủ sức tham gia trò chơi cùng lớp. 🍀",
          effects: {
            health: 4,
            happiness: 1,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Khỏe khoắn quá!",
          achievementIds: [],
        },
        {
          label: "🤫 Thì thầm kể chuyện với bạn bên cạnh",
          title: "💬 Chuyện chưa kể hết",
          text: "Hai bạn khúc khích nói chuyện rồi mới ngủ. Bạn rất vui nhưng đến chiều lại hơi buồn ngủ. 🥱",
          effects: {
            health: -2,
            happiness: 3,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Mai ngủ đúng giờ!",
          achievementIds: [],
        },
      ],
    },
  ],
  4: [
    {
      id: "a4-painting",
      title: "🎨 Bức tranh đầy màu sắc",
      text: "Cô phát giấy và màu vẽ. Bạn muốn vẽ một khu vườn nhưng chưa biết bắt đầu từ đâu. 🖌️",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🥼 Mặc tạp dề rồi thử pha màu",
          title: "🌈 Họa sĩ gọn gàng",
          text: "Bạn khám phá được màu mới và nhớ dùng tạp dề. Bức tranh rực rỡ còn quần áo vẫn sạch đẹp. 😎",
          effects: {
            intelligence: 3,
            appearance: 2,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Màu này đẹp quá!",
          achievementIds: [],
        },
        {
          label: "🖐️ Vẽ ngay bằng những ngón tay",
          title: "🎭 Sáng tạo hết mình",
          text: "Bạn tạo ra những hình thù thú vị bằng đầu ngón tay. Mải mê quá, bạn làm màu lem lên tay áo. 🙈",
          effects: {
            intelligence: 4,
            appearance: -2,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Rửa tay thay áo thôi!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a4-buttons",
      title: "👕 Chiếc áo có hàng cúc",
      text: "Bạn muốn tự mặc chiếc áo mới. Những chiếc cúc nhỏ trông đơn giản nhưng cài lại không dễ chút nào. 🧵",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "🐌 Kiên nhẫn cài từng chiếc cúc",
          title: "🏅 Tự làm được rồi",
          text: "Bạn tập cách đưa cúc qua khuy và sửa lại chỗ cài lệch. Cuối cùng chiếc áo đã ngay ngắn. 😌",
          effects: {
            intelligence: 2,
            appearance: 3,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Con tự mặc được!",
          achievementIds: [],
        },
        {
          label: "⚡ Cài thật nhanh để ra chơi",
          title: "🪞 Nhanh nhưng hơi lệch",
          text: "Bạn tìm ra cách cài cúc nhanh hơn, nhưng một chiếc bị lệch hàng. Chiếc áo trông hơi xộc xệch. 🫣",
          effects: {
            intelligence: 1,
            appearance: -1,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Để chỉnh lại nào!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a4-garden",
      title: "🌱 Chậu cây của lớp",
      text: "Cô giáo mang đến một chậu đất và vài hạt giống. Bạn được giúp cô trồng cây bên cửa sổ. 🪴",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🧤 Làm theo hướng dẫn và đeo găng",
          title: "🌻 Người làm vườn tí hon",
          text: "Bạn học cách đặt hạt vào đất và tưới vừa đủ. Nhờ làm cẩn thận, quần áo vẫn gọn gàng. 🦋",
          effects: {
            intelligence: 3,
            appearance: 1,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Mau lớn nhé, cây ơi!",
          achievementIds: [],
        },
        {
          label: "🤲 Dùng tay khám phá chậu đất",
          title: "🪱 Một buổi khám phá lấm lem",
          text: "Bạn nhận ra đất khô và đất ướt khác nhau thế nào. Đổi lại, tay áo và đầu gối đều dính đất. 🤎",
          effects: {
            intelligence: 4,
            appearance: -2,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Lấm lem mà học được nhiều!",
          achievementIds: [],
        },
      ],
    },
  ],
  5: [
    {
      id: "a5-letter",
      title: "🔤 Chữ cái trong tên mình",
      text: "Cô viết tên bạn lên một tấm thẻ rồi hỏi bạn có nhận ra chữ cái nào không. 🏷️",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "👩‍🏫 Tập nhận từng chữ với cô",
          title: "💡 Tên mình thật đặc biệt",
          text: "Bạn nhận ra vài chữ quen thuộc và thử đọc theo. Được cô động viên, bạn thấy mình lớn hơn một chút. 🤓",
          effects: {
            intelligence: 4,
            happiness: 2,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Đó là tên của mình!",
          achievementIds: [],
        },
        {
          label: "🔎 Nhờ bạn cùng tìm chữ giống nhau",
          title: "🎲 Học qua trò chơi",
          text: "Hai bạn thi tìm những chữ giống nhau trên các tấm thẻ. Bạn nhớ thêm được một ít và có một giờ học vui. 🥰",
          effects: {
            intelligence: 2,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Chơi thêm một vòng!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a5-puzzle",
      title: "🧩 Mảnh ghép cuối cùng",
      text: "Bức tranh ghép hình sắp hoàn thành, nhưng bạn còn một mảnh không biết đặt vào đâu. 🌀",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🔄 Quan sát màu và xoay mảnh ghép",
          title: "🎯 Ghép đúng rồi!",
          text: "Bạn thử xoay mảnh ghép và so màu với phần còn thiếu. Bức tranh cuối cùng cũng hoàn chỉnh. 🥳",
          effects: {
            intelligence: 4,
            happiness: 2,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Mình làm được rồi!",
          achievementIds: [],
        },
        {
          label: "📦 Cất lại để thử vào hôm khác",
          title: "⏳ Một câu đố còn dang dở",
          text: "Bạn nhớ được hình dáng của mảnh ghép nhưng quyết định dừng lại. Chưa hoàn thành khiến bạn hơi tiếc. 😔",
          effects: {
            intelligence: 1,
            happiness: -1,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Mai mình thử tiếp!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a5-storytelling",
      title: "🗣️ Kể chuyện trước lớp",
      text: "Cô mời bạn kể lại một câu chuyện đã nghe. Các bạn ngồi thành vòng tròn chờ đến lượt bạn. 📖",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🎤 Kể theo những gì mình nhớ",
          title: "🌟 Giọng kể đầu tiên",
          text: "Bạn cố nhớ trình tự câu chuyện và kể chậm rãi. Hơi hồi hộp khiến bạn chưa thật thoải mái, nhưng bạn đã luyện được trí nhớ. 😳",
          effects: {
            intelligence: 4,
            happiness: -1,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Lần sau sẽ tự tin hơn!",
          achievementIds: [],
        },
        {
          label: "🎭 Rủ một bạn cùng đóng vai",
          title: "🤝 Câu chuyện có hai người",
          text: "Hai bạn chia vai và thêm những động tác ngộ nghĩnh. Bạn hiểu câu chuyện hơn và cả lớp cười vui. 😂",
          effects: {
            intelligence: 2,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Vở kịch thành công!",
          achievementIds: [],
        },
      ],
    },
  ],
  6: [
    {
      id: "a6-first-school",
      title: "🏫 Ngày đầu đến trường",
      text: "Bạn bước vào lớp 1 với chiếc cặp mới. Cô giáo giới thiệu chỗ ngồi và những người bạn trong lớp. 🔔",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🙋 Chào cô và làm quen bạn cùng bàn",
          title: "👫 Khởi đầu đầy háo hức",
          text: "Bạn chính thức trở thành học sinh tiểu học, biết thêm nề nếp lớp và có một người bạn mới. 💛",
          effects: {
            intelligence: 2,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Chào lớp 1!",
          achievementIds: ["primary-school"],
        },
        {
          label: "👂 Chăm chú nghe cô hướng dẫn",
          title: "🧭 Bỡ ngỡ nhưng chăm chỉ",
          text: "Bạn chính thức vào tiểu học và nhớ kỹ lời cô dặn. Môi trường mới khiến bạn hơi căng thẳng trong buổi đầu. 🧐",
          effects: {
            intelligence: 4,
            happiness: -1,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Mình sẽ quen thôi!",
          achievementIds: ["primary-school"],
        },
      ],
    },
    {
      id: "a6-pencil",
      title: "✏️ Chiếc bút chì để quên",
      text: "Đến giờ tập viết, bạn mở hộp bút và nhận ra chiếc bút chì vẫn nằm ở nhà. 🎒",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🙏 Lễ phép hỏi mượn bạn",
          title: "💝 Một lời nhờ giúp đỡ",
          text: "Bạn mượn được bút, hoàn thành bài và nhớ cảm ơn. Bạn vừa học thêm một cách giải quyết khó khăn. 😊",
          effects: {
            intelligence: 2,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Cảm ơn bạn nhé!",
          achievementIds: [],
        },
        {
          label: "👩‍🏫 Báo cô và ghi nhớ chuẩn bị cặp",
          title: "📋 Bài học về sự chuẩn bị",
          text: "Cô cho bạn mượn bút. Bạn nhớ kiểm tra cặp từ hôm sau, dù hôm nay hơi ngại vì quên đồ. 🧠",
          effects: {
            intelligence: 3,
            happiness: -1,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Lần sau nhớ mang!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a6-reading",
      title: "📚 Dòng chữ đầu tiên",
      text: "Bạn ghép được vài chữ trong quyển truyện nhỏ, nhưng một câu dài khiến bạn dừng lại. 🔠",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🗣️ Đánh vần từng tiếng",
          title: "🏆 Chậm mà chắc",
          text: "Bạn kiên nhẫn ghép hết câu và hiểu được nội dung. Đọc được bằng chính mình khiến bạn rất tự hào. 😄",
          effects: {
            intelligence: 4,
            happiness: 2,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Mình đọc được rồi!",
          achievementIds: [],
        },
        {
          label: "🛌 Nhờ người thân đọc cùng",
          title: "🌛 Câu chuyện trước giờ ngủ",
          text: "Bạn đọc một đoạn, người thân đọc tiếp một đoạn. Bạn học thêm vài từ và tận hưởng thời gian bên gia đình. 💗",
          effects: {
            intelligence: 2,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Đọc thêm một trang nhé!",
          achievementIds: [],
        },
      ],
    },
  ],
  7: [
    {
      id: "a7-tag",
      title: "🏃 Giờ ra chơi náo nhiệt",
      text: "Các bạn rủ bạn chơi đuổi bắt trong sân. Bạn vừa ăn xong và đang phân vân có tham gia không. 🏟️",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "🥤 Nghỉ một lúc rồi chơi vừa sức",
          title: "💚 Chơi vui, vẫn khỏe",
          text: "Bạn đợi một lúc rồi tham gia vài lượt. Bạn vận động vừa phải và có giờ ra chơi đầy tiếng cười. 😌",
          effects: {
            health: 3,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Hết giờ nhanh thế!",
          achievementIds: [],
        },
        {
          label: "🏁 Chạy hết sức để thắng",
          title: "🏃 Cuộc đua mệt nhoài",
          text: "Bạn thắng được một lượt và reo lên sung sướng. Chạy quá nhiều khiến bạn mệt khi vào tiết tiếp theo. 😵‍💫",
          effects: {
            health: -2,
            happiness: 4,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Uống nước nghỉ đã!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a7-rain",
      title: "🌧️ Cơn mưa lúc tan học",
      text: "Mưa bất chợt đổ xuống lúc tan học. Bạn đứng dưới mái hiên cùng vài người bạn chờ người thân đến đón. ☔",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "🏠 Ở chỗ khô và trò chuyện cùng bạn",
          title: "💬 Đợi mưa cũng vui",
          text: "Bạn giữ người khô ráo, nghỉ ngơi sau buổi học và nghe bạn kể chuyện. Người thân đến đón ngay sau đó. 🤗",
          effects: {
            health: 1,
            happiness: 2,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Về nhà thôi!",
          achievementIds: [],
        },
        {
          label: "💦 Nghịch nước hắt vào sát mái hiên",
          title: "👟 Đôi giày ướt sũng",
          text: "Bạn thích thú nhìn những giọt nước bắn lên, nhưng vô tình làm ướt giày và thấy lạnh trước khi được đón. 🥶",
          effects: {
            health: -2,
            happiness: 2,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Về thay đồ ngay!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a7-late-cartoon",
      title: "📺 Tập phim chưa kết thúc",
      text: "Đã đến giờ ngủ nhưng bộ phim hoạt hình yêu thích vẫn còn một đoạn. Ngày mai bạn phải dậy đi học. 🌃",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "📴 Tắt màn hình và đi ngủ",
          title: "🛌 Giữ sức cho ngày mai",
          text: "Bạn tiếc đoạn phim còn lại nhưng vẫn đi ngủ đúng giờ. Sáng hôm sau, bạn thức dậy tỉnh táo hơn. 😒",
          effects: {
            health: 4,
            happiness: -1,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Mai xem tiếp vậy!",
          achievementIds: [],
        },
        {
          label: "🍿 Xin xem nốt tập phim",
          title: "🎬 Một tối vui hơi muộn",
          text: "Bạn xem được đoạn kết rất hài hước. Đi ngủ muộn hơn khiến sáng hôm sau bạn khó rời khỏi giường. 🥱",
          effects: {
            health: -3,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Tập này hay thật!",
          achievementIds: [],
        },
      ],
    },
  ],
  8: [
    {
      id: "a8-hard-math",
      title: "🧮 Bài toán khó nhằn",
      text: "Bạn gặp một bài toán có cách hỏi khác hẳn ví dụ trong sách. Bạn đã thử một lần nhưng chưa ra đáp án. ❔",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "📐 Vẽ hình để tìm cách giải",
          title: "🗝️ Tự tìm được đường đi",
          text: "Bạn chia bài toán thành những phần nhỏ và tìm ra lời giải. Khoảnh khắc hiểu bài khiến bạn rất phấn khởi. 🤩",
          effects: {
            intelligence: 4,
            happiness: 2,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "À, ra là vậy!",
          achievementIds: [],
        },
        {
          label: "🙋 Nhờ bạn giải thích rồi tự làm lại",
          title: "🧑‍🤝‍🧑 Cùng nhau hiểu bài",
          text: "Bạn nghe gợi ý, sau đó tự làm lại từ đầu. Bài toán dễ hiểu hơn khi có người cùng trao đổi. 😇",
          effects: {
            intelligence: 3,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Cảm ơn vì đã chỉ mình!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a8-library",
      title: "📚 Một buổi ở thư viện",
      text: "Bạn có thể mượn một cuốn sách mang về. Trên kệ có sách khám phá và truyện tranh vui nhộn. 📖",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🦉 Chọn sách khám phá thiên nhiên",
          title: "🌍 Thế giới rộng lớn",
          text: "Bạn đọc về những loài cây và con vật chưa từng thấy. Nhiều điều mới khiến bạn tò mò muốn tìm hiểu thêm. 🐾",
          effects: {
            intelligence: 4,
            happiness: 1,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Thật nhiều điều lạ!",
          achievementIds: [],
        },
        {
          label: "🗯️ Chọn truyện tranh để đọc cùng bạn",
          title: "🎉 Chia sẻ tiếng cười",
          text: "Bạn đọc được vài từ mới và kể lại những đoạn hài cho bạn nghe. Cuốn truyện làm buổi chiều vui hơn. 🤣",
          effects: {
            intelligence: 1,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Đoạn này buồn cười quá!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a8-group-project",
      title: "🖍️ Tấm áp phích của nhóm",
      text: "Nhóm bạn được giao làm áp phích về bảo vệ môi trường. Mỗi người có một ý tưởng khác nhau. 📌",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🤝 Lắng nghe rồi chia việc cùng nhau",
          title: "🏅 Mỗi người một phần",
          text: "Bạn học cách sắp xếp ý tưởng và phối hợp với các bạn. Tấm áp phích hoàn thành trong không khí vui vẻ. 😁",
          effects: {
            intelligence: 3,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Nhóm mình làm tốt lắm!",
          achievementIds: [],
        },
        {
          label: "🙇 Ôm phần lớn công việc về tự làm",
          title: "🗂️ Xong việc nhưng mệt đầu",
          text: "Bạn tự tìm hiểu được nhiều điều khi làm áp phích. Tuy nhiên, khối lượng công việc khiến bạn ít thời gian vui chơi. 😩",
          effects: {
            intelligence: 4,
            happiness: -2,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Lần sau chia việc nhé!",
          achievementIds: [],
        },
      ],
    },
  ],
  9: [
    {
      id: "a9-school-photo",
      title: "📸 Ngày chụp ảnh lớp",
      text: "Cả lớp chuẩn bị chụp ảnh kỷ niệm. Bạn nhìn lại cổ áo và mái tóc trước khi ra sân. 🏫",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "👔 Chỉnh trang rồi đứng cạnh các bạn",
          title: "🌼 Một tấm ảnh tươi tắn",
          text: "Bạn sửa lại cổ áo, chải tóc và mỉm cười thật tự nhiên. Tấm ảnh ghi lại một ngày đáng nhớ. 😎",
          effects: {
            appearance: 3,
            happiness: 2,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Nhớ gửi mình tấm ảnh!",
          achievementIds: [],
        },
        {
          label: "🤪 Mải đùa nên quên chỉnh áo",
          title: "🎞️ Nụ cười rất thật",
          text: "Bạn cười hết cỡ khi máy ảnh chụp. Cổ áo hơi lệch nhưng bạn rất thích khoảnh khắc vui nhộn này. 😆",
          effects: {
            appearance: -1,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Cười tươi là được!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a9-haircut",
      title: "💇 Kiểu tóc mới",
      text: "Người thân đưa bạn đi cắt tóc. Bạn được hỏi muốn giữ kiểu quen thuộc hay thử một kiểu gọn hơn. 💈",
      image: "",
      imageAlt: "Emoji khuôn mặt vui chuyển động nhẹ.",
      choices: [
        {
          label: "✂️ Chọn kiểu gọn gàng mình thích",
          title: "🪞 Diện mạo mới",
          text: "Mái tóc được cắt gọn đúng ý bạn. Bạn ngắm mình trong gương và hào hứng khoe với gia đình. 🥰",
          effects: {
            appearance: 3,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Hợp với mình ghê!",
          achievementIds: [],
        },
        {
          label: "🙆 Để người lớn chọn giúp",
          title: "🍄 Chưa quen với mái tóc",
          text: "Mái tóc trông gọn gàng hơn, nhưng ngắn hơn bạn mong đợi. Bạn cần một chút thời gian để làm quen. 😬",
          effects: {
            appearance: 2,
            happiness: -2,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Rồi tóc sẽ dài lại!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a9-school-fair",
      title: "🎁 Gian hàng thủ công",
      text: "Lớp tổ chức làm đồ trang trí cho ngày hội. Trên bàn có giấy màu, hồ dán và màu nước. 🎪",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🧵 Làm cẩn thận và giữ áo sạch",
          title: "🎀 Khéo tay, gọn gàng",
          text: "Bạn hoàn thành món đồ trang trí xinh xắn, nhớ lau tay trước khi chạm vào áo. Bạn tự hào đem sản phẩm ra trưng bày. 😌",
          effects: {
            appearance: 2,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Tác phẩm của mình đây!",
          achievementIds: [],
        },
        {
          label: "🙌 Hăng hái giúp mọi gian hàng",
          title: "🎊 Ngày hội đầy màu sắc",
          text: "Bạn chạy đi giúp các bạn và có rất nhiều niềm vui. Đến cuối buổi, áo bạn đã lấm tấm màu và hồ dán. 🤭",
          effects: {
            appearance: -2,
            happiness: 4,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Vui là đáng rồi!",
          achievementIds: [],
        },
      ],
    },
  ],
  10: [
    {
      id: "a10-science",
      title: "🌱 Thí nghiệm hạt đậu",
      text: "Cô giao theo dõi sự nảy mầm của một hạt đậu. Bạn có thể ghi chép mỗi ngày hoặc quan sát cùng bạn. 🫘",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "📏 Ghi lại thay đổi từng ngày",
          title: "🔬 Nhà quan sát nhỏ",
          text: "Bạn phát hiện rễ xuất hiện trước những chiếc lá đầu tiên. Cuốn sổ ghi chép giúp bạn hiểu rõ quá trình cây lớn lên. 🤓",
          effects: {
            intelligence: 4,
            happiness: 2,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Hạt đậu mọc rồi!",
          achievementIds: [],
        },
        {
          label: "👫 Rủ bạn cùng quan sát và trao đổi",
          title: "🌿 Hai người cùng khám phá",
          text: "Bạn và người bạn so sánh hai chậu cây rồi kể cho nhau điều vừa thấy. Việc học trở nên thật thú vị. 😲",
          effects: {
            intelligence: 3,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Mai xem tiếp nhé!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a10-class-test",
      title: "📝 Bài kiểm tra chưa như ý",
      text: "Bạn nhận lại bài kiểm tra và thấy mình sai vài câu vốn tưởng đã làm đúng. 📉",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "🔎 Xem lại lỗi và hỏi cô chỗ chưa hiểu",
          title: "🪜 Sai để hiểu hơn",
          text: "Bạn nhận ra mình đã đọc thiếu dữ kiện. Sửa được lỗi giúp bạn tiến bộ, dù điểm số hôm nay vẫn khiến bạn hơi buồn. 😤",
          effects: {
            intelligence: 4,
            happiness: -2,
          },
          image: "",
          imageAlt: "Biểu tượng khuôn mặt đang cố gắng, chuyển động nhẹ.",
          confirmText: "Lần sau sẽ tốt hơn!",
          achievementIds: [],
        },
        {
          label: "🤝 Học cùng bạn rồi nghỉ ngơi một chút",
          title: "☕ Có người đồng hành",
          text: "Bạn cùng bạn chữa những câu sai rồi ra sân thư giãn. Bạn hiểu thêm bài và cảm thấy nhẹ lòng hơn. 🙂",
          effects: {
            intelligence: 2,
            happiness: 3,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Mình sẽ cố gắng tiếp!",
          achievementIds: [],
        },
      ],
    },
    {
      id: "a10-primary-memories",
      title: "💌 Cuốn sổ kỷ niệm tiểu học",
      text: "Năm học cuối tiểu học đang trôi qua. Bạn muốn làm một cuốn sổ để giữ lại những chuyện đáng nhớ. 📔",
      image: "",
      imageAlt: "Emoji quyển sách chuyển động nhẹ.",
      choices: [
        {
          label: "✍️ Viết lại những điều mình đã học",
          title: "🧭 Nhìn lại chặng đường",
          text: "Bạn sắp xếp kỷ niệm theo từng năm và nhận ra mình đã học được nhiều điều. Bạn thấy tự hào về quãng đường đã qua. 😌",
          effects: {
            intelligence: 3,
            happiness: 3,
          },
          image: "",
          imageAlt: "Biểu tượng quyển sách với những ngôi sao chuyển động nhẹ.",
          confirmText: "Mình đã lớn hơn rồi!",
          achievementIds: [],
        },
        {
          label: "💬 Rủ các bạn cùng viết lời nhắn",
          title: "💝 Những dòng chữ thân thương",
          text: "Bạn học cách trình bày cuốn sổ và nhận được nhiều lời nhắn dễ thương. Mỗi trang đều gợi lại một tiếng cười. 🥹",
          effects: {
            intelligence: 1,
            happiness: 5,
          },
          image: "",
          imageAlt:
            "Biểu tượng khuôn mặt vui với những ngôi sao chuyển động nhẹ.",
          confirmText: "Giữ mãi cuốn sổ này!",
          achievementIds: [],
        },
      ],
    },
  ],
};

// Chuyển tên Emoji thành đường dẫn dựa trên vị trí file JS.
for (const events of Object.values(ageEvents1To10)) {
  for (const event of events) {
    event.image = asset(event.image);
    for (const choice of event.choices) choice.image = asset(choice.image);
  }
}
