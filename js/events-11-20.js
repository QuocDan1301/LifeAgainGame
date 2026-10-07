// Tuổi 11–20: 30 sự kiện, 60 lựa chọn, GIF ở cả hai popup.
// Theo cấu trúc hiện tại của bạn: js/img/events/childhood/*.gif
const asset = (name) => new URL(`./img/events/childhood/${name}`, import.meta.url).href;

export const ageEvents11To20 = {
  "11": [
    {
      "id": "teen-11-1",
      "title": "🎒 Chiếc cặp nặng trĩu",
      "text": "Sách vở năm nay nhiều hơn trước. Mỗi sáng, bạn phải nhấc chiếc cặp như đang tập tạ. 📚",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🗂️ Soạn cặp theo thời khóa biểu",
          "title": "Một trải nghiệm mới",
          "text": "Bạn bỏ bớt sách chưa cần dùng. Vai nhẹ hơn, mà cũng ít quên đồ hơn! 😌",
          "effects": {
            "health": 2,
            "intelligence": 2
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Nhẹ cả người!",
          "achievementIds": []
        },
        {
          "label": "💪 Mang hết cho chắc",
          "title": "Điều bạn nhận ra",
          "text": "Bạn không thiếu quyển nào nhưng vai mỏi nhừ. Ít ra hôm nay bạn vẫn theo kịp bài. 😮‍💨",
          "effects": {
            "health": -2,
            "intelligence": 1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Mai soạn lại vậy!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-11-2",
      "title": "🤝 Một người bạn mới",
      "text": "Một bạn mới chuyển đến ngồi một mình trong giờ nghỉ, tay cứ xoay chiếc bút. 🖊️",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🙋 Chủ động bắt chuyện",
          "title": "Một trải nghiệm mới",
          "text": "Bạn hỏi thăm và biết thêm một trò đố chữ. Giờ nghỉ bỗng trở nên thú vị. 🌈",
          "effects": {
            "intelligence": 1,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Có bạn mới rồi!",
          "achievementIds": []
        },
        {
          "label": "🧩 Rủ chơi câu đố",
          "title": "Điều bạn nhận ra",
          "text": "Hai bạn loay hoay giải một câu khó rồi bật cười vì đáp án quá đơn giản. 🤭",
          "effects": {
            "intelligence": 3,
            "happiness": 2
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Hóa ra là vậy!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-11-3",
      "title": "🏸 Quả cầu mắc trên cây",
      "text": "Bạn và nhóm bạn vừa chơi được vài lượt thì quả cầu bay lên cành cây. 🌳",
      "image": "joy.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🧑 Nhờ người lớn lấy giúp",
          "title": "Một trải nghiệm mới",
          "text": "Chờ một lát, cả nhóm có cầu để chơi tiếp. Buổi vận động kết thúc đầy tiếng cười. 😄",
          "effects": {
            "health": 2,
            "happiness": 2
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Chơi tiếp nào!",
          "achievementIds": []
        },
        {
          "label": "🚶 Đổi sang đi dạo",
          "title": "Điều bạn nhận ra",
          "text": "Bạn tiếc trận cầu dang dở nhưng đi bộ một vòng cũng giúp cơ thể thư giãn. 🍃",
          "effects": {
            "health": 2,
            "happiness": -1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Mai đấu tiếp!",
          "achievementIds": []
        }
      ]
    }
  ],
  "12": [
    {
      "id": "teen-12-1",
      "title": "🔬 Thí nghiệm sủi bọt",
      "text": "Trong giờ khoa học, cô hướng dẫn cả nhóm làm một thí nghiệm an toàn có bọt nổi lên. 🫧",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "📋 Ghi từng bước thực hiện",
          "title": "Một trải nghiệm mới",
          "text": "Bạn hiểu vì sao bọt xuất hiện, nhưng mải ghi nên bỏ lỡ lúc cả nhóm reo lên. 🧐",
          "effects": {
            "intelligence": 4,
            "happiness": -1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Đã hiểu nguyên lý!",
          "achievementIds": []
        },
        {
          "label": "👀 Quan sát rồi hỏi cô",
          "title": "Điều bạn nhận ra",
          "text": "Bạn thích thú nhìn bọt trào lên và hỏi ngay điều mình chưa hiểu. 💡",
          "effects": {
            "intelligence": 2,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Hay quá cô ơi!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-12-2",
      "title": "🪞 Một nốt mụn bất ngờ",
      "text": "Sáng soi gương, bạn thấy một nốt mụn ngay giữa trán. Cảm giác nó to hơn cả cái chuông trường! 😳",
      "image": "joy.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🧼 Chăm sóc da nhẹ nhàng",
          "title": "Một trải nghiệm mới",
          "text": "Bạn giữ da sạch và không sờ nốt mụn. Sau một thời gian, da dễ chịu hơn và bạn bớt lo. 🌷",
          "effects": {
            "appearance": 2,
            "happiness": 2
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Từ từ sẽ ổn!",
          "achievementIds": []
        },
        {
          "label": "🧢 Che bằng mũ cả buổi",
          "title": "Điều bạn nhận ra",
          "text": "Bạn đỡ ngại lúc đầu, nhưng đội mũ bí bách khiến vùng trán khó chịu hơn. 😅",
          "effects": {
            "appearance": -1,
            "happiness": 1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Mai thử cách khác!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-12-3",
      "title": "📱 Tin nhắn chưa có hồi âm",
      "text": "Bạn gửi một câu đùa vào nhóm lớp nhưng mãi chẳng ai trả lời. Đầu bạn bắt đầu nghĩ đủ chuyện. 💭",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "⏳ Đợi và làm việc khác",
          "title": "Một trải nghiệm mới",
          "text": "Lát sau bạn bè mới trả lời vì đang bận. Bạn học được rằng im lặng không hẳn là giận. 🙂",
          "effects": {
            "intelligence": 2,
            "happiness": 2
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Mình nghĩ nhiều rồi!",
          "achievementIds": []
        },
        {
          "label": "🔎 Đọc đi đọc lại tin nhắn",
          "title": "Điều bạn nhận ra",
          "text": "Bạn nhận ra câu đùa hơi khó hiểu, nhưng việc chờ đợi khiến tâm trạng chùng xuống. 😔",
          "effects": {
            "intelligence": 1,
            "happiness": -2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Lần sau nói rõ hơn!",
          "achievementIds": []
        }
      ]
    }
  ],
  "13": [
    {
      "id": "teen-13-1",
      "title": "🎸 Buổi thử câu lạc bộ",
      "text": "Trường mở buổi trải nghiệm âm nhạc. Một chiếc đàn đang chờ người thử, còn tim bạn thì đánh trống. 🥁",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🎶 Thử một đoạn đơn giản",
          "title": "Một trải nghiệm mới",
          "text": "Bạn gảy sai vài nốt nhưng học được nhịp đầu tiên. Tiếng vỗ tay khiến bạn mạnh dạn hơn. 👏",
          "effects": {
            "intelligence": 2,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Sai mà vẫn vui!",
          "achievementIds": []
        },
        {
          "label": "👂 Ngồi nghe và hỏi cách chơi",
          "title": "Điều bạn nhận ra",
          "text": "Bạn chú ý cách đặt tay và trò chuyện với người hướng dẫn sau buổi diễn. 🎼",
          "effects": {
            "intelligence": 3,
            "happiness": 1
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Lần sau mình thử!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-13-2",
      "title": "🥾 Chuyến đi bộ dã ngoại",
      "text": "Lớp đi dã ngoại trên lối đi có người hướng dẫn. Một đoạn dốc khiến cả nhóm thở phì phò. ⛰️",
      "image": "joy.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🥤 Đi đều và nghỉ đúng lúc",
          "title": "Một trải nghiệm mới",
          "text": "Bạn đến nơi vẫn còn sức ngắm cảnh và chụp hình cùng bạn bè. 🌤️",
          "effects": {
            "health": 3,
            "happiness": 2
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Đáng công đi quá!",
          "achievementIds": []
        },
        {
          "label": "🏁 Đi nhanh để tới trước",
          "title": "Điều bạn nhận ra",
          "text": "Bạn tới điểm nghỉ sớm nhưng mệt rã rời. Cảnh đẹp vẫn khiến bạn mỉm cười. 😮‍💨",
          "effects": {
            "health": -2,
            "happiness": 2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Cho mình ngồi chút!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-13-3",
      "title": "🗣️ Bài nói trước lớp",
      "text": "Đến lượt trình bày, bạn bỗng quên mất câu mở đầu đã tập rất kỹ. 🫣",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "📝 Nhìn dàn ý rồi nói tiếp",
          "title": "Một trải nghiệm mới",
          "text": "Bạn lấy lại mạch kể và hoàn thành bài nói. Hóa ra quên một câu cũng không sao. 🌟",
          "effects": {
            "intelligence": 3,
            "happiness": 2
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Mình làm được rồi!",
          "achievementIds": []
        },
        {
          "label": "⚡ Cố nói thật nhanh cho xong",
          "title": "Điều bạn nhận ra",
          "text": "Bạn vượt qua bài nói nhưng vẫn tiếc vì bỏ sót vài ý. Đây là bài học về giữ bình tĩnh. 😬",
          "effects": {
            "intelligence": 1,
            "happiness": -2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Lần sau chậm lại!",
          "achievementIds": []
        }
      ]
    }
  ],
  "14": [
    {
      "id": "teen-14-1",
      "title": "🧮 Đề ôn tập khó nhằn",
      "text": "Một trang bài tập khiến bạn nhìn mãi mà chưa biết bắt đầu từ đâu. ❔",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🪜 Chia thành từng phần nhỏ",
          "title": "Một trải nghiệm mới",
          "text": "Bạn giải được từng câu và thấy bài khó cũng có đường vào. 🎯",
          "effects": {
            "intelligence": 4,
            "happiness": 2
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Từng bước một thôi!",
          "achievementIds": []
        },
        {
          "label": "🌙 Cố làm hết trong đêm",
          "title": "Điều bạn nhận ra",
          "text": "Bạn hiểu thêm vài dạng bài, nhưng thiếu ngủ khiến hôm sau đầu óc nặng trĩu. 🥱",
          "effects": {
            "intelligence": 2,
            "health": -3
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Cần ngủ bù thôi!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-14-2",
      "title": "🎨 Tấm áp phích của lớp",
      "text": "Lớp cần một áp phích cho ngày hội. Ai cũng có ý tưởng, thành ra bàn đầy giấy nháp. 🖍️",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🤝 Ghép ý tưởng của mọi người",
          "title": "Một trải nghiệm mới",
          "text": "Bạn học thêm cách bố trí hình và cả nhóm vui vì đều có đóng góp. 🧩",
          "effects": {
            "intelligence": 2,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Đúng là làm cùng nhau!",
          "achievementIds": []
        },
        {
          "label": "🙇 Tự làm gần hết",
          "title": "Điều bạn nhận ra",
          "text": "Bạn luyện được nhiều kỹ năng nhưng hơi tủi vì phải ngồi một mình đến muộn. 😞",
          "effects": {
            "intelligence": 3,
            "happiness": -2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Lần sau chia việc nhé!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-14-3",
      "title": "🚲 Buổi đạp xe cuối tuần",
      "text": "Gia đình rủ bạn đạp xe trên tuyến đường an toàn. Bạn vẫn còn muốn nằm nướng. ☀️",
      "image": "joy.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🪖 Đội mũ rồi đi cùng",
          "title": "Một trải nghiệm mới",
          "text": "Bạn vận động vừa sức và nghe được cả đống chuyện vui trên đường. 🌿",
          "effects": {
            "health": 3,
            "happiness": 2
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Đi rồi mới thấy thích!",
          "achievementIds": []
        },
        {
          "label": "🛌 Ở nhà ngủ thêm",
          "title": "Điều bạn nhận ra",
          "text": "Bạn nghỉ ngơi được một chút nhưng hơi tiếc khi thấy ảnh cả nhà vui vẻ. 📷",
          "effects": {
            "health": 1,
            "happiness": -1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Lần sau mình đi!",
          "achievementIds": []
        }
      ]
    }
  ],
  "15": [
    {
      "id": "teen-15-1",
      "title": "🧭 Ngã rẽ học tập",
      "text": "Bạn được giới thiệu nhiều hướng học sau năm học này. Càng nghe càng thấy có nhiều điều chưa biết. 📌",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "❓ Hỏi về từng hướng",
          "title": "Một trải nghiệm mới",
          "text": "Bạn hiểu rõ hơn điều mình thích và nhẹ lòng khi chưa cần biết hết mọi thứ. 💡",
          "effects": {
            "intelligence": 3,
            "happiness": 2
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Có hướng để tìm rồi!",
          "achievementIds": []
        },
        {
          "label": "👥 Chỉ xem bạn bè chọn gì",
          "title": "Điều bạn nhận ra",
          "text": "Bạn biết thêm vài lựa chọn, nhưng càng so sánh càng bối rối về bản thân. 😵‍💫",
          "effects": {
            "intelligence": 1,
            "happiness": -2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Mình cần nghĩ thêm!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-15-2",
      "title": "👕 Bộ đồ cho ngày hội",
      "text": "Bạn chuẩn bị đi ngày hội của trường và phân vân trước vài bộ đồ quen thuộc. 🪞",
      "image": "joy.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🧺 Chọn bộ sạch, vừa vặn",
          "title": "Một trải nghiệm mới",
          "text": "Bạn thấy gọn gàng, thoải mái và tự tin hòa vào đám đông. 😎",
          "effects": {
            "appearance": 2,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Vừa ý mình là đẹp!",
          "achievementIds": []
        },
        {
          "label": "✨ Thử phối đồ thật khác",
          "title": "Điều bạn nhận ra",
          "text": "Cách phối chưa hợp lắm nhưng bạn rất vui vì dám thử điều mới. 🤭",
          "effects": {
            "appearance": -1,
            "happiness": 2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Một lần thử thú vị!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-15-3",
      "title": "🏐 Trận đấu giao hữu",
      "text": "Đội bạn bị dẫn điểm và mọi người bắt đầu cuống lên. Quả bóng lại được chuyền tới. 🏟️",
      "image": "joy.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🤲 Phối hợp và cổ vũ đồng đội",
          "title": "Một trải nghiệm mới",
          "text": "Cả đội lấy lại tinh thần. Bạn có một buổi vận động vui dù không chắc thắng. 💚",
          "effects": {
            "health": 3,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Hết mình là vui rồi!",
          "achievementIds": []
        },
        {
          "label": "🔥 Gắng sức ghi điểm một mình",
          "title": "Điều bạn nhận ra",
          "text": "Bạn ghi được một điểm đẹp nhưng nhanh chóng kiệt sức và phải ra nghỉ. 😮‍💨",
          "effects": {
            "health": -2,
            "happiness": 2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Cần phối hợp hơn!",
          "achievementIds": []
        }
      ]
    }
  ],
  "16": [
    {
      "id": "teen-16-1",
      "title": "💻 Trang web đầu tay",
      "text": "Bạn thử làm một trang giới thiệu bản thân. Một chiếc nút cứ chạy lệch sang bên như có ý riêng. 🐛",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🔍 Tìm lỗi từng phần",
          "title": "Một trải nghiệm mới",
          "text": "Bạn sửa được một thuộc tính và chiếc nút về đúng chỗ. Cảm giác như vừa giải mã bí mật! 🥳",
          "effects": {
            "intelligence": 4,
            "happiness": 3
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Chạy được rồi!",
          "achievementIds": []
        },
        {
          "label": "🕛 Sửa liên tục quên nghỉ",
          "title": "Điều bạn nhận ra",
          "text": "Bạn hiểu thêm vài dòng mã, nhưng ngồi quá lâu khiến mắt mỏi và người uể oải. 😵",
          "effects": {
            "intelligence": 2,
            "health": -2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Nghỉ mắt chút đã!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-16-2",
      "title": "🥪 Bữa sáng vội vàng",
      "text": "Bạn dậy trễ trong ngày có tiết học sớm. Bữa sáng đã chuẩn bị sẵn trên bàn. ⏰",
      "image": "joy.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🍽️ Ăn rồi sắp xếp lại đồ",
          "title": "Một trải nghiệm mới",
          "text": "Bạn ra khỏi nhà gọn gàng hơn dự tính, có sức và cũng bớt cáu kỉnh. 😊",
          "effects": {
            "health": 2,
            "happiness": 2
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Ổn rồi, đi thôi!",
          "achievementIds": []
        },
        {
          "label": "🏃 Bỏ bữa để đi cho nhanh",
          "title": "Điều bạn nhận ra",
          "text": "Bạn nhẹ nhõm vì kịp giờ nhưng bụng cồn cào suốt buổi sáng. 🫠",
          "effects": {
            "health": -2,
            "happiness": 1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Mai dậy sớm hơn!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-16-3",
      "title": "💬 Một cuộc hiểu lầm",
      "text": "Bạn nghe nói người bạn thân không thích ý kiến của mình trong buổi làm nhóm. 🌥️",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🤝 Hỏi trực tiếp, nói bình tĩnh",
          "title": "Một trải nghiệm mới",
          "text": "Hai người nhận ra lời kể đã thiếu mất một đoạn. Bạn hiểu bạn mình hơn. 💞",
          "effects": {
            "intelligence": 2,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "May mà đã hỏi!",
          "achievementIds": []
        },
        {
          "label": "📓 Viết ra điều mình đang nghĩ",
          "title": "Điều bạn nhận ra",
          "text": "Bạn hiểu cảm xúc của mình rõ hơn, nhưng chuyện chưa được nói ra vẫn khiến bạn buồn. 😔",
          "effects": {
            "intelligence": 2,
            "happiness": -1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Mình sẽ nói khi sẵn sàng!",
          "achievementIds": []
        }
      ]
    }
  ],
  "17": [
    {
      "id": "teen-17-1",
      "title": "📅 Lịch ôn tập kín mít",
      "text": "Bàn học đầy giấy ghi chú. Bạn cần chọn cách ôn mà vẫn có sức theo đến cuối. 📚",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🧘 Xen kẽ học và nghỉ",
          "title": "Một trải nghiệm mới",
          "text": "Bạn nhớ bài tốt hơn và không còn mệt lả sau mỗi buổi học. 🌱",
          "effects": {
            "intelligence": 3,
            "health": 2
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Giữ nhịp này nhé!",
          "achievementIds": []
        },
        {
          "label": "☕ Thức khuya học thêm",
          "title": "Điều bạn nhận ra",
          "text": "Bạn học thêm được một phần, nhưng sáng hôm sau thiếu ngủ thấy rõ. 🥱",
          "effects": {
            "intelligence": 2,
            "health": -3
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Không thể kéo dài thế này!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-17-2",
      "title": "🏫 Ngày hội hướng nghiệp",
      "text": "Các gian tư vấn giới thiệu đủ nghề, từ kỹ thuật đến nghệ thuật. Bạn chỉ có một buổi để khám phá. 🎪",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🎤 Hỏi người đang làm nghề",
          "title": "Một trải nghiệm mới",
          "text": "Những câu chuyện thực tế giúp bạn hiểu cả mặt vui lẫn khó của công việc. 🔎",
          "effects": {
            "intelligence": 3,
            "happiness": 2
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Biết thêm nhiều quá!",
          "achievementIds": []
        },
        {
          "label": "📊 Chỉ nhìn mức thu nhập",
          "title": "Điều bạn nhận ra",
          "text": "Bạn biết thêm vài con số nhưng lại thấy áp lực khi so sánh các hướng đi. 😟",
          "effects": {
            "intelligence": 1,
            "happiness": -2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Còn nhiều điều phải cân nhắc!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-17-3",
      "title": "📷 Tấm ảnh cuối buổi học",
      "text": "Nhóm bạn muốn chụp một tấm ảnh chung. Bạn vừa chạy từ sân về, tóc rối hết cả lên. 🍃",
      "image": "joy.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🪞 Chỉnh tóc rồi vào khung hình",
          "title": "Một trải nghiệm mới",
          "text": "Bạn có một tấm ảnh tươi tắn với cả nhóm và cứ nhìn lại mãi. 🥰",
          "effects": {
            "appearance": 2,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Lưu làm kỷ niệm!",
          "achievementIds": []
        },
        {
          "label": "🤪 Tạo dáng hài hước ngay",
          "title": "Điều bạn nhận ra",
          "text": "Tóc vẫn rối nhưng cả nhóm cười nghiêng ngả vì biểu cảm của bạn. 😂",
          "effects": {
            "appearance": -1,
            "happiness": 3
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Ảnh này không được xóa!",
          "achievementIds": []
        }
      ]
    }
  ],
  "18": [
    {
      "id": "teen-18-1",
      "title": "🗺️ Kế hoạch tuổi mười tám",
      "text": "Một người hỏi bạn định làm gì tiếp theo. Bạn nhận ra mình muốn tự tìm hiểu trước khi quyết định. 💭",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "📝 Viết vài hướng rồi tìm thông tin",
          "title": "Một trải nghiệm mới",
          "text": "Bạn hiểu rõ hơn điều cần chuẩn bị, cảm giác tương lai cũng bớt mù mờ. 🧭",
          "effects": {
            "intelligence": 3,
            "happiness": 2
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Cứ đi từng bước!",
          "achievementIds": []
        },
        {
          "label": "📱 Xem thành tích người khác cả tối",
          "title": "Điều bạn nhận ra",
          "text": "Bạn biết thêm vài con đường nhưng lại thấy mình chậm hơn mọi người. 😞",
          "effects": {
            "intelligence": 1,
            "happiness": -3
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Quay về nhịp của mình thôi!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-18-2",
      "title": "🍳 Bữa ăn tự nấu",
      "text": "Bạn thử tự nấu một bữa đơn giản. Căn bếp trông quen mà đứng nấu mới thấy lạ. 🥕",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "📖 Làm theo công thức từng bước",
          "title": "Một trải nghiệm mới",
          "text": "Bữa ăn hơi vụng nhưng đủ món. Bạn học được cách chuẩn bị và ăn uống đều đặn hơn. 🥣",
          "effects": {
            "intelligence": 2,
            "health": 2
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Ăn được là thành công!",
          "achievementIds": []
        },
        {
          "label": "🧪 Tự biến tấu ngay lần đầu",
          "title": "Điều bạn nhận ra",
          "text": "Món ăn quá mặn nên bạn phải làm lại phần đơn giản. Bạn rút được kinh nghiệm nhưng hơi hụt hẫng. 😅",
          "effects": {
            "intelligence": 2,
            "happiness": -1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Lần sau bớt muối!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-18-3",
      "title": "🚌 Chuyến xe tự đi",
      "text": "Bạn tự đi xe buýt tới một địa điểm chưa quen. Bảng tuyến có nhiều số nhìn hoa cả mắt. 🚏",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "📍 Xem tuyến và hỏi nhân viên",
          "title": "Một trải nghiệm mới",
          "text": "Bạn đến đúng nơi, tự tin hơn vì tự xử lý được một việc mới. 🙌",
          "effects": {
            "intelligence": 2,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Đi được rồi nhé!",
          "achievementIds": []
        },
        {
          "label": "🚶 Xuống sớm rồi đi bộ thêm",
          "title": "Điều bạn nhận ra",
          "text": "Bạn phải đi bộ khá xa nhưng cũng học được cách đọc các điểm dừng cho lần sau. 😮‍💨",
          "effects": {
            "intelligence": 2,
            "health": -1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Nhớ tuyến này rồi!",
          "achievementIds": []
        }
      ]
    }
  ],
  "19": [
    {
      "id": "teen-19-1",
      "title": "💰 Quyển sổ chi tiêu",
      "text": "Bạn nhìn lại những khoản mua lặt vặt và bất ngờ vì chúng cộng lại khá nhiều. 🧾",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🧮 Ghi chép và lên kế hoạch",
          "title": "Một trải nghiệm mới",
          "text": "Bạn hiểu thói quen của mình và thấy yên tâm hơn khi biết sẽ dành tiền cho việc gì. 😌",
          "effects": {
            "intelligence": 3,
            "happiness": 2
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Rõ ràng hơn rồi!",
          "achievementIds": []
        },
        {
          "label": "🔒 Cắt hết mọi khoản giải trí",
          "title": "Điều bạn nhận ra",
          "text": "Bạn học được cách theo dõi chi tiêu nhưng thấy kế hoạch quá ngột ngạt. 😣",
          "effects": {
            "intelligence": 2,
            "happiness": -2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Cần cân bằng hơn!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-19-2",
      "title": "🧹 Một buổi tình nguyện",
      "text": "Khu phố tổ chức dọn một khu sinh hoạt chung. Bạn được rủ tham gia trong buổi sáng rảnh. 🌳",
      "image": "joy.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🧤 Nhận phần việc vừa sức",
          "title": "Một trải nghiệm mới",
          "text": "Bạn vận động nhẹ và vui vì thấy không gian sạch lên từng chút. 🌼",
          "effects": {
            "health": 2,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Nhìn thích thật!",
          "achievementIds": []
        },
        {
          "label": "🏋️ Nhận quá nhiều việc",
          "title": "Điều bạn nhận ra",
          "text": "Bạn rất vui khi giúp được mọi người nhưng chiều về mỏi nhừ vì cố quá sức. 🫠",
          "effects": {
            "health": -2,
            "happiness": 3
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Lần sau chia việc nhé!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-19-3",
      "title": "📹 Đoạn video đầu tiên",
      "text": "Bạn thử quay một video chia sẻ sở thích. Xem lại mới thấy mình nói hơi vấp nhưng khá hào hứng. 🎬",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "✂️ Học chỉnh sửa cơ bản",
          "title": "Một trải nghiệm mới",
          "text": "Bạn cắt bớt đoạn thừa và hoàn thành một video ngắn vừa ý. 🎞️",
          "effects": {
            "intelligence": 3,
            "happiness": 2
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Sản phẩm đầu tay đây!",
          "achievementIds": []
        },
        {
          "label": "🔁 Quay lại quá nhiều lần",
          "title": "Điều bạn nhận ra",
          "text": "Bạn luyện được cách trình bày nhưng dần bực mình vì muốn mọi thứ hoàn hảo. 😵‍💫",
          "effects": {
            "intelligence": 2,
            "happiness": -2
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Tạm nghỉ rồi xem lại!",
          "achievementIds": []
        }
      ]
    }
  ],
  "20": [
    {
      "id": "teen-20-1",
      "title": "🛠️ Món đồ nhỏ bị hỏng",
      "text": "Một chiếc hộp gỗ bị lỏng bản lề. Bạn muốn thử sửa với dụng cụ cầm tay và có người hướng dẫn. 🔩",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "👂 Nghe hướng dẫn rồi làm thử",
          "title": "Một trải nghiệm mới",
          "text": "Bạn sửa được chiếc hộp và học thêm cách dùng dụng cụ đúng cách. 🏅",
          "effects": {
            "intelligence": 3,
            "happiness": 2
          },
          "image": "learn.gif",
          "imageAlt": "GIF quyển sách chuyển động.",
          "confirmText": "Dùng lại được rồi!",
          "achievementIds": []
        },
        {
          "label": "🤲 Nhờ làm mẫu trước",
          "title": "Điều bạn nhận ra",
          "text": "Bạn quan sát từng bước rồi phụ phần đơn giản, cảm thấy học cùng người khác thật dễ chịu. 🤗",
          "effects": {
            "intelligence": 2,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Lần sau mình thử thêm!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-20-2",
      "title": "🏃 Thử thách vận động",
      "text": "Bạn muốn tạo thói quen vận động và đang chọn mục tiêu cho tuần đầu tiên. 👟",
      "image": "joy.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🌤️ Bắt đầu bằng những buổi ngắn",
          "title": "Một trải nghiệm mới",
          "text": "Bạn theo được lịch nhẹ nhàng và vui khi thấy mình giữ lời với bản thân. 💚",
          "effects": {
            "health": 3,
            "happiness": 2
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Đều đặn là được!",
          "achievementIds": []
        },
        {
          "label": "🔥 Đặt mục tiêu quá cao",
          "title": "Điều bạn nhận ra",
          "text": "Bạn hào hứng hoàn thành buổi đầu nhưng hôm sau mệt rã rời vì quá sức. 😮‍💨",
          "effects": {
            "health": -3,
            "happiness": 1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Giảm nhịp lại thôi!",
          "achievementIds": []
        }
      ]
    },
    {
      "id": "teen-20-3",
      "title": "✉️ Lá thư gửi tương lai",
      "text": "Bạn nảy ra ý định viết một lá thư cho bản thân vài năm nữa. Trang giấy vẫn trắng, còn đầu thì đầy chuyện. 🌌",
      "image": "learn.gif",
      "imageAlt": "GIF biểu tượng minh họa sự kiện.",
      "choices": [
        {
          "label": "🖊️ Ghi điều muốn học và trải nghiệm",
          "title": "Một trải nghiệm mới",
          "text": "Viết xuống giúp bạn hiểu mình hơn và háo hức với những điều còn phía trước. 🧭",
          "effects": {
            "intelligence": 2,
            "happiness": 3
          },
          "image": "joy.gif",
          "imageAlt": "GIF khuôn mặt vui.",
          "confirmText": "Hẹn mình của tương lai!",
          "achievementIds": []
        },
        {
          "label": "📖 Nhìn lại những lần chưa làm được",
          "title": "Điều bạn nhận ra",
          "text": "Bạn rút ra vài bài học nhưng cũng hơi buồn khi nhớ những dự định dang dở. 🌧️",
          "effects": {
            "intelligence": 3,
            "happiness": -1
          },
          "image": "effort.gif",
          "imageAlt": "GIF biểu tượng cố gắng.",
          "confirmText": "Vẫn còn thời gian mà!",
          "achievementIds": []
        }
      ]
    }
  ]
};

for (const events of Object.values(ageEvents11To20)) {
  for (const event of events) {
    event.image = asset(event.image);
    for (const choice of event.choices) choice.image = asset(choice.image);
  }
}
