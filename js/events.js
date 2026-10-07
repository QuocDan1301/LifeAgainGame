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
      text: "Bạn theo ba mẹ đến công viên và có một người bạn mới.",
      effects: { health: 2, happiness: 3 },
    },
    {
      text: "Bạn thích thú xếp các khối đồ chơi thành một tòa tháp.",
      effects: { intelligence: 3 },
    },
  ],

  3: [
    {
      text: "Bạn hơi buồn vì phải xa ba mẹ trong ngày đầu đi mẫu giáo.",
      effects: { happiness: -2 },
    },
    {
      text: "Bạn học được một bài hát và hát cho cả nhà nghe.",
      effects: { intelligence: 2, happiness: 3 },
    },
  ],

  4: [
    {
      text: "Bạn vẫn chưa làm quen được ai vì rụt rè.",
      effects: { happiness: -2 },
    },
    {
      text: "Bài hát cô mới dạy khó quá.hic.",
      effects: { intelligence: -2, happiness: -3 },
    },
  ],

  5: [
    {
      text: "Bạn được cậu cho 50k lúc về ngoại",
      effects: { happiness: +10 },
      money: 50000,
    },
    {
      title: "Nhặt được của rơi, tạm thời bỏ túi",
      text: "Bạn nhặt được 10k",
      effects: { happiness: +5 },
      money: 10000,
      confirmText: "Hehe!",
    },
  ],

  6: [
    {
      title: "Món quà đầu năm",
      image: "./img/events/li-xi.gif",
      imageAlt: "Phong bao lì xì",
      text: "Bạn được ông bà lì xì và ba mẹ cất vào ví tiết kiệm cho bạn.",
      effects: { happiness: 3 },
      money: 200000,
      confirmText: "Mừng quá!",
    },
  ],
};
