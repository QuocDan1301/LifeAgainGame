import { openMojiArt } from "../media/event-art.js";

export const careerPaths = [
  ["casual", "🧭", "Lông bông (không thích đi học)"],
  ["study-abroad", "✈️", "Đi du học"],
  ["acting", "🎬", "Diễn xuất"],
  ["military", "🪖", "Nhập ngũ"],
  ["singing", "🎤", "Thanh nhạc"],
  ["painting", "🎨", "Mỹ thuật"],
  ["medicine", "🩺", "Y khoa"],
  ["programming", "💻", "Công nghệ thông tin"],
  ["accounting", "🧮", "Kế toán"],
  ["law", "⚖️", "Luật"],
  ["teaching", "🏫", "Sư phạm"],
  ["football", "⚽", "Bóng đá"],
  ["psychology", "🧠", "Tâm lý học"],
  ["esports", "🎮", "Liên Quân Mobile"],
  ["tiktok", "📱", "Sáng tạo nội dung TikTok"],
  ["youtube", "📹", "Sáng tạo nội dung YouTube"],
  ["business", "💼", "Kinh doanh"],
  ["finance", "💰", "Tài chính"],
  ["mechanical", "⚙️", "Cơ khí"],
  ["architecture", "🏛️", "Kiến trúc"],
  ["fashion", "👗", "Thiết kế thời trang"],
  ["marketing", "📣", "Marketing"],
  ["tourism", "🧳", "Du lịch"],
  ["culinary", "👨‍🍳", "Ẩm thực"],
];

export const careerEvent = {
  id: "career-18",
  ...openMojiArt("1F9ED", "Chọn hướng học tập và nghề nghiệp"),
  title: "🎓 Tuổi 18 – Chọn hướng đi của bạn",
  text: "Bạn đã bước sang tuổi 18! Hãy chọn ngành học hoặc hướng nghề nghiệp bạn muốn theo đuổi.",
  choices: careerPaths.map(([id, emoji, field]) => ({
    label: `${emoji} ${field}`,
    title: `${emoji} Hành trình mới bắt đầu`,
    text: `Bạn chọn hướng ${field}.\nBạn bắt đầu học hỏi, rèn luyện và tích lũy kinh nghiệm cho hành trình này.`,
    careerPath: {
      id,
      field,
      status: `Đang theo đuổi ${field}`,
      ...(id === "casual" ? { school: null } : {}),
    },
    confirmText: "Bắt đầu hành trình!",
  })),
};
