// Chọn ngành học hoặc hướng nghề nghiệp ở tuổi 18.
const careerPaths = [
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
];

export const careerEvent = {
  id: "career-18",
  title: "🎓 Tuổi 18 – Chọn hướng đi của bạn",
  text: "Bạn đã bước sang tuổi 18! Hãy chọn ngành học hoặc hướng nghề nghiệp bạn muốn theo đuổi. Mỗi lựa chọn là bước khởi đầu để phấn đấu tới mục tiêu của mình.",
  choices: careerPaths.map(([id, emoji, field]) => ({
    label: `${emoji} ${field}`,
    title: `${emoji} Hành trình mới bắt đầu`,
    text: `Bạn chọn hướng ${field}.\nBạn bắt đầu học hỏi, rèn luyện và tích lũy kinh nghiệm cho hành trình này.`,
    careerPath: { id, field, status: `Đang theo đuổi ${field}` },
    confirmText: "Bắt đầu hành trình!",
  })),
};
