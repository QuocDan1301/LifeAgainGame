// Tình huống trong game: hành trình academy → thử việc → cơ hội lên đội 1.
export function createEsportsAgeEvents(event, choice) {
  return {
    19: [
      event(19, 1, "🎮 Suất đánh chính đầu tiên",
        "Trước buổi scrim, tuyển thủ cùng vị trí với bạn xin nghỉ. Huấn luyện viên cho bạn vào đội hình academy, nhưng một đồng đội bảo: ‘Đừng feed rồi kéo cả đội xuống nhé.’ Bạn chỉ có vài phút để thống nhất cách đánh.", "1F4F1", [
          choice("🎧 Chốt vai trò và phối hợp theo bài đã tập", "🤝 Có chỗ đứng trong đội",
            "Bạn gọi thông tin rõ ràng, phối hợp kiểm soát mục tiêu và nhận lỗi khi xử lý sai. Academy thắng một ván quan trọng; huấn luyện viên cho bạn thêm lượt scrim để đánh giá độ ổn định.",
            { intelligence: 4, happiness: 2 }, "1F91D"),
          choice("🔥 Chọn tướng tủ để tự gánh trận", "⚡ Highlight đẹp, đội hình rối",
            "Bạn có vài pha solo nổi bật nhưng lệch nhịp với đồng đội, khiến academy mất mục tiêu lớn. Huấn luyện viên công nhận kỹ năng cá nhân và yêu cầu bạn tập lại cách phối hợp trước khi giữ suất đánh chính.",
            { intelligence: 2, happiness: -2 }, "1F525"),
        ]),
      event(19, 2, "🎭 Chiến thuật bị nhận công",
        "Bạn nghiên cứu replay và đề xuất một bài di chuyển mới. Trong buổi họp academy, người cạnh tranh cùng vị trí trình bày nó như ý tưởng riêng. Bạn vẫn giữ bản phân tích và tin nhắn đã gửi từ tối qua.", "1F5E3", [
          choice("📼 Đưa replay và tin nhắn cho huấn luyện viên", "📌 Công sức được ghi nhận",
            "Huấn luyện viên đối chiếu thời gian gửi bản phân tích và ghi đúng đóng góp của bạn. Hai người vẫn phải đấu tập cùng nhau, nhưng từ đó các ý tưởng được lưu vào tài liệu chung của academy.",
            { intelligence: 3, happiness: -1 }, "1F4CB"),
          choice("🤝 Nói riêng, yêu cầu đính chính trước đội", "🗣️ Giữ hòa khí, đặt ranh giới",
            "Bạn cho người ấy cơ hội sửa lời trong buổi review kế tiếp. Họ đính chính và cả đội tiếp tục thử chiến thuật. Bạn giữ được nhịp tập luyện, dù chưa thể tin họ hoàn toàn.",
            { intelligence: 2, happiness: 1 }, "1F91D"),
        ]),
      event(19, 3, "📱 Clip feed lan khỏi phòng tập",
        "Một pha xử lý lỗi của bạn trong scrim bị cắt thành clip và đăng lên nhóm cộng đồng. Bình luận nói bạn vào academy nhờ quen biết. Trong khi đó, replay đầy đủ cho thấy cả đội đã gọi hai phương án khác nhau.", "1F4F1", [
          choice("🔎 Review cùng đội, nhờ academy làm rõ ngữ cảnh", "🌤️ Tập trung sửa lỗi",
            "Bạn nhận phần xử lý sai của mình và cùng huấn luyện viên xem lại call của đội. Academy giải thích ngữ cảnh, còn bạn sửa thói quen giao tiếp trong các buổi scrim tiếp theo. Lời đồn dịu đi khi bạn chơi ổn định hơn.",
            { intelligence: 3, happiness: 1 }, "1F9ED"),
          choice("💬 Đáp trả bình luận ngay trong đêm", "💥 Drama kéo dài tới sáng",
            "Bạn giải thích được một phần tình huống, nhưng tranh cãi kéo thêm người vào công kích đồng đội. Sáng hôm sau thiếu ngủ, bạn bị huấn luyện viên nhắc về cách ứng xử của một tuyển thủ academy.",
            { happiness: -4, health: -2 }, "1F5E3"),
        ]),
    ],
    20: [
      event(20, 1, "🏁 Vòng đánh giá lên đội 1",
        "Academy tổ chức buổi đánh giá để chọn người được thử việc cùng đội 1. Một người quen rủ bạn đánh tài khoản hộ để làm đẹp thành tích, bảo rằng ‘chỉ cần lọt danh sách trước đã’. Huấn luyện viên sẽ xem cả replay và cách phối hợp.", "1F3C1", [
          choice("🎮 Dùng thành tích thật và chuẩn bị replay của mình", "🧠 Được đánh giá bằng thực lực",
            "Bạn trình bày những trận tốt lẫn các pha đã sửa sau review. Chưa có suất đội 1 được bảo đảm, nhưng huấn luyện viên ghi nhận sự tiến bộ và đưa bạn vào nhóm tiếp tục theo dõi cho đợt thử việc.",
            { intelligence: 4, happiness: 2 }, "1F4CB"),
          choice("⚠️ Báo riêng lời rủ rê và xin đấu thử trực tiếp", "⚖️ Một buổi đánh giá minh bạch",
            "Bạn xin chứng minh kỹ năng trong trận đấu do huấn luyện viên theo dõi. Lời rủ đánh hộ được kiểm tra riêng. Người quen giận bạn, nhưng hồ sơ ứng viên đội 1 của bạn giữ được sự tin cậy.",
            { intelligence: 3, happiness: -1 }, "1F9ED"),
        ]),
      event(20, 2, "🚪 Lời mời thử việc cùng đội 1",
        "Huấn luyện viên đội 1 mời bạn tham gia một đợt tập thử để đánh giá khả năng thi đấu chuyên nghiệp. Lịch thử việc trùng với trận quan trọng của academy; đồng đội cùng vị trí nói bạn đang bỏ đội để tìm hào quang.", "1F4F1", [
          choice("🗓️ Thống nhất lịch với hai ban huấn luyện", "🌱 Tiến gần sân khấu chuyên nghiệp",
            "Bạn bàn giao bài đánh và thống nhất người thay thế tại academy trước khi tập thử cùng đội 1. Nhịp scrim cao hơn làm bạn mệt, nhưng bạn tích lũy kinh nghiệm và nhận được đánh giá để cạnh tranh suất thi đấu chuyên nghiệp.",
            { intelligence: 4, happiness: 3, health: -2 }, "1F91D"),
          choice("🤝 Hoàn thành trận academy, xin đợt thử việc sau", "💛 Chậm một bước, giữ lòng tin",
            "Bạn giữ lời với academy và xin ban huấn luyện đội 1 đánh giá ở đợt sau. Suất thử việc lần này có thể thuộc về người khác, nhưng đồng đội tin bạn hơn và huấn luyện viên giữ replay của bạn trong danh sách theo dõi.",
            { intelligence: 2, happiness: 2 }, "1F9E9"),
        ]),
    ],
    21: [
      event(21, 1, "🚨 Scrim quan trọng mất người",
        "Đội 1 đang theo dõi một buổi scrim của academy thì đồng đội mất kết nối. Người cạnh tranh với bạn đề nghị cứ đánh tiếp rồi đổ lỗi cho mạng nếu thua. Cả đội đang chờ quyết định xử lý.", "1F6E0", [
          choice("📣 Báo huấn luyện viên, xin tạm dừng theo thỏa thuận", "🛠️ Giữ nhịp của cả đội",
            "Bạn báo rõ sự cố để hai bên thống nhất cách tiếp tục, thay vì giấu vấn đề. Trận scrim được sắp xếp lại; người theo dõi đội 1 ghi nhận khả năng giao tiếp và bình tĩnh của bạn.",
            { intelligence: 4, happiness: 1 }, "1F6E0"),
          choice("🎧 Xin dùng người dự bị và điều chỉnh bài đánh", "🤝 Thích nghi với đội hình mới",
            "Sau khi hai ban huấn luyện đồng ý, academy dùng người dự bị. Bạn đơn giản hóa cách gọi mục tiêu để người mới bắt nhịp. Kết quả chưa đẹp, nhưng cách phối hợp giúp bạn có thêm điểm trong đánh giá tuyển thủ.",
            { intelligence: 3, happiness: 1 }, "1F91D"),
        ]),
      event(21, 2, "🧭 Lời hứa suất đội 1",
        "Một người tự nhận có thể giúp bạn được lên đội 1 nếu bạn bỏ lịch academy để tập riêng mỗi đêm. Họ không đưa ra kế hoạch đánh giá hay xác nhận từ ban huấn luyện. Bạn bè sợ rằng từ chối sẽ mất cơ hội thi đấu chuyên nghiệp.", "1F9ED", [
          choice("📋 Xác minh với ban huấn luyện, xin tiêu chí rõ ràng", "🌿 Cơ hội có căn cứ",
            "Bạn biết quyết định lên đội 1 cần đánh giá từ ban huấn luyện. Bạn thống nhất lịch thử việc và tiêu chí về kỹ năng, phối hợp, kỷ luật; lời hứa bên ngoài không còn khiến bạn bỏ bê lịch academy.",
            { intelligence: 3, happiness: 2 }, "1F4CB"),
          choice("🔥 Nhận lịch tập riêng vì sợ mất cơ hội", "🥱 Tập nhiều, suất vẫn chưa rõ",
            "Bạn học thêm vài cách xử lý nhưng liên tục thiếu ngủ và xuống phong độ trong scrim. Suất đội 1 vẫn chỉ là lời hứa. Cuối cùng bạn phải quay lại trao đổi trực tiếp với huấn luyện viên về lộ trình thử việc.",
            { intelligence: 2, health: -4, happiness: -2 }, "1F4DA", "sleepy"),
        ]),
      event(21, 3, "🏆 Highlight cá nhân hay tiếng nói của đội?",
        "Academy được yêu cầu gửi replay để đội 1 xem xét ứng viên thi đấu chuyên nghiệp. Một đồng đội muốn cắt hết phần phối hợp, chỉ giữ highlight của bạn để hồ sơ nổi bật. Người đã hỗ trợ bạn trong các pha quyết định thấy mình bị xóa khỏi câu chuyện.", "1F3C6", [
          choice("🤝 Gửi replay đầy đủ và ghi rõ đóng góp đồng đội", "✨ Hồ sơ của một tuyển thủ biết phối hợp",
            "Bạn gửi highlight kèm ngữ cảnh và review những pha phối hợp. Ban huấn luyện đội 1 có cơ sở đánh giá cả kỹ năng cá nhân lẫn khả năng chơi cùng đội. Bạn tiến gần cơ hội thi đấu chuyên nghiệp mà vẫn giữ được lòng tin tại academy.",
            { intelligence: 3, happiness: 4 }, "1F91D"),
          choice("🔥 Chỉ gửi highlight để tranh suất nhanh hơn", "🎭 Nổi bật nhưng bị hỏi khó",
            "Những pha đẹp giúp bạn được chú ý, nhưng ban huấn luyện đội 1 yêu cầu replay đầy đủ để đánh giá tiếp. Đồng đội thất vọng vì công sức bị bỏ qua; bạn phải sửa hồ sơ và hàn gắn quan hệ trước buổi tập thử tiếp theo.",
            { intelligence: 2, happiness: -3 }, "1F3C6"),
        ]),
    ],
  };
}
