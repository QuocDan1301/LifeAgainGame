import { openMojiArt } from "./event-art.js";
import { ensureEventOpenMoji } from "./event-openmoji.js";
// Nguồn ngành đào tạo được lưu theo từng lựa chọn để tiện cập nhật.
const school = (id, name, city, program, source) => ({
  id, name, city, program, source,
});
const ute = (program) => school(
  "ute", "Đại học Công nghệ Kỹ thuật TP.HCM (UTE)", "TP.HCM", program,
  program === "Kế toán"
    ? "https://fe.hcmute.edu.vn/?TopicId=c5f6d9c6-b242-4967-80d4-8fb40c5d9401"
    : "https://tuyensinh.hcmute.edu.vn/",
);
const multimediaSchools = [
  school("ptit", "Học viện Công nghệ Bưu chính Viễn thông", "Hà Nội", "Truyền thông đa phương tiện", "https://iqa.ptit.edu.vn/2026/04/15/cac-chuong-trinh-dao-tao/"),
  school("ussh-hcm-media", "Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM", "TP.HCM", "Truyền thông đa phương tiện", "https://hcmussh.edu.vn/bai-viet/DH-tong-quan-nganh-truyen-thong-da-phuong-tien"),
];

export const careerSchools = {
  acting: [
    school("skda-hn", "Đại học Sân khấu – Điện ảnh Hà Nội", "Hà Nội", "Diễn viên kịch, điện ảnh – truyền hình", "https://skda.edu.vn/"),
    school("skda-hcm", "Đại học Sân khấu – Điện ảnh TP.HCM", "TP.HCM", "Diễn viên kịch, điện ảnh – truyền hình", "https://skdahcm.edu.vn/tuyen-sinh/page/3/"),
  ],
  singing: [
    school("vnam", "Học viện Âm nhạc Quốc gia Việt Nam", "Hà Nội", "Thanh nhạc", "https://www.vnam.edu.vn/NewsDetail.aspx?CatID=9&ItemID=2047&SubID=5&lang=vn"),
    school("hcmcons", "Nhạc viện TP.HCM", "TP.HCM", "Thanh nhạc", "https://hcmcons.vn/tin-tuc/chuong-trinh-bieu-dien-hop-xuong-thang-01-2026-khoa-thanh-nhac-1001.html"),
  ],
  painting: [
    school("hcmufa", "Đại học Mỹ thuật TP.HCM", "TP.HCM", "Hội họa", "https://www.hcmufa.edu.vn/tuyensinh/"),
  ],
  medicine: [
    school("hmu", "Đại học Y Hà Nội", "Hà Nội", "Y khoa", "https://hmu.edu.vn/vn/default.aspx"),
    school("ump", "Đại học Y Dược TP.HCM", "TP.HCM", "Y khoa", "https://ump.edu.vn/index.php/tuyen-sinh-dao-tao/dai-hoc/dao-tao/y-khoa"),
  ],
  programming: [
    ute("Công nghệ thông tin"),
    school("uit", "Đại học Công nghệ Thông tin – ĐHQG TP.HCM", "TP.HCM", "Công nghệ thông tin", "https://tuyensinh.uit.edu.vn/"),
    school("ptit-it", "Học viện Công nghệ Bưu chính Viễn thông", "Hà Nội", "Công nghệ thông tin", "https://iqa.ptit.edu.vn/2026/04/15/cac-chuong-trinh-dao-tao/"),
  ],
  accounting: [
    ute("Kế toán"),
    school("ueh", "Đại học Kinh tế TP.HCM (UEH)", "TP.HCM", "Kế toán", "https://tuyensinh.ueh.edu.vn/danh-muc-bai-viet/linh-vuc/ke-toan/"),
    school("aof", "Học viện Tài chính", "Hà Nội", "Kế toán", "https://xettuyen.hvtc.edu.vn/Home/Index"),
  ],
  law: [
    school("hlu", "Đại học Luật Hà Nội", "Hà Nội", "Luật", "https://tuyensinh.hlu.edu.vn/"),
    school("ulaw", "Đại học Luật TP.HCM", "TP.HCM", "Luật", "https://tuyensinh.hcmulaw.edu.vn/thong-tin-tuyen-sinh-dai-hoc"),
  ],
  teaching: [
    school("hnue", "Đại học Sư phạm Hà Nội", "Hà Nội", "Sư phạm", "https://hnue.edu.vn/tin-tuc/11216/thong-tin-tuyen-sinh-dai-hoc-he-chinh-quy-nam-2026.html"),
    school("hcmue", "Đại học Sư phạm TP.HCM", "TP.HCM", "Sư phạm", "https://tuyensinh.hcmup.edu.vn/vi/"),
  ],
  football: [
    school("hupes", "Đại học Sư phạm Thể dục Thể thao Hà Nội", "Hà Nội", "Huấn luyện thể thao – hướng Bóng đá", "https://hupes.edu.vn/gioi-thieu.html"),
  ],
  psychology: [
    school("ussh-hcm-psych", "Đại học Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM", "TP.HCM", "Tâm lý học", "https://hcmussh.edu.vn/post/42908"),
    school("hcmue-psych", "Đại học Sư phạm TP.HCM", "TP.HCM", "Tâm lý học", "https://m.hcmup.edu.vn/vi/dam-bao-chat-luong/chung-nhan-ket-qua-kiem-dinh/2215-kq-kdclgd-ctdt"),
  ],
  tiktok: multimediaSchools,
  youtube: multimediaSchools,
  business: [
    school("ueh-business", "Đại học Kinh tế TP.HCM (UEH)", "TP.HCM", "Quản trị kinh doanh", "https://tuyensinh.ueh.edu.vn/"),
    school("ftu-business", "Đại học Ngoại thương", "Hà Nội", "Quản trị kinh doanh", "https://tuyensinh.ftu.edu.vn/"),
    school("neu-business", "Đại học Kinh tế Quốc dân", "Hà Nội", "Quản trị kinh doanh", "https://www.neu.edu.vn/"),
  ],
  finance: [
    school("ueh-finance", "Đại học Kinh tế TP.HCM (UEH)", "TP.HCM", "Tài chính", "https://tuyensinh.ueh.edu.vn/"),
    school("aof-finance", "Học viện Tài chính", "Hà Nội", "Tài chính – Ngân hàng", "https://xettuyen.hvtc.edu.vn/Home/Index"),
    school("ftu-finance", "Đại học Ngoại thương", "Hà Nội", "Tài chính – Ngân hàng", "https://tuyensinh.ftu.edu.vn/"),
  ],
  mechanical: [
    school("ute-mechanical", "Đại học Công nghệ Kỹ thuật TP.HCM (UTE)", "TP.HCM", "Công nghệ kỹ thuật cơ khí", "https://tuyensinh.hcmute.edu.vn/"),
    school("hust-mechanical", "Đại học Bách khoa Hà Nội", "Hà Nội", "Kỹ thuật cơ khí", "https://www.hust.edu.vn/"),
  ],
  architecture: [
    school("uah-architecture", "Đại học Kiến trúc TP.HCM", "TP.HCM", "Kiến trúc", "https://uah.edu.vn/"),
    school("hau-architecture", "Đại học Kiến trúc Hà Nội", "Hà Nội", "Kiến trúc", "https://hau.edu.vn/"),
  ],
  fashion: [
    school("ute-fashion", "Đại học Công nghệ Kỹ thuật TP.HCM (UTE)", "TP.HCM", "Thiết kế thời trang", "https://tuyensinh.hcmute.edu.vn/"),
    school("uad-fashion", "Đại học Mỹ thuật Công nghiệp", "Hà Nội", "Thiết kế thời trang", "https://mythuatcongnghiep.edu.vn/"),
  ],
  marketing: [
    school("ueh-marketing", "Đại học Kinh tế TP.HCM (UEH)", "TP.HCM", "Marketing", "https://tuyensinh.ueh.edu.vn/"),
    school("neu-marketing", "Đại học Kinh tế Quốc dân", "Hà Nội", "Marketing", "https://www.neu.edu.vn/"),
    school("ftu-marketing", "Đại học Ngoại thương", "Hà Nội", "Marketing", "https://tuyensinh.ftu.edu.vn/"),
  ],
  tourism: [
    school("huflit-tourism", "Đại học Ngoại ngữ – Tin học TP.HCM", "TP.HCM", "Quản trị dịch vụ du lịch và lữ hành", "https://huflit.edu.vn/"),
    school("ueh-tourism", "Đại học Kinh tế TP.HCM (UEH)", "TP.HCM", "Quản trị dịch vụ du lịch và lữ hành", "https://tuyensinh.ueh.edu.vn/"),
  ],
  culinary: [
    school("hutech-culinary", "Đại học Công nghệ TP.HCM (HUTECH)", "TP.HCM", "Quản trị nhà hàng và dịch vụ ăn uống", "https://www.hutech.edu.vn/"),
    school("sthc-culinary", "Trường Cao đẳng Du lịch Sài Gòn", "TP.HCM", "Kỹ thuật chế biến món ăn", "https://dulichsaigon.edu.vn/"),
  ],
};

export const academyLogos = {
  "flash-academy": new URL("../img/teams/team-flash.png", import.meta.url).href,
  "sgp-academy": new URL("../img/teams/saigon-phantom.png", import.meta.url).href,
  "one-star-academy": new URL("../img/teams/one-star.png", import.meta.url).href,
};

function createSchoolEventData(careerPath) {
  if (careerPath.id === "esports") {
    const academies = [
      ["flash-academy", "Team Flash Academy"],
      ["sgp-academy", "SGP Academy"],
      ["one-star-academy", "One Star Academy"],
    ];
    return {
      title: "🎮 Chọn academy Liên Quân Mobile",
      text: "Chọn nơi bắt đầu hành trình tuyển thủ. Bạn sẽ tập luyện ở academy, đấu tập và cạnh tranh cơ hội thử việc để được lên đội 1 thi đấu chuyên nghiệp.",
      choices: academies.map(([id, name]) => ({
        label: name,
        logo: academyLogos[id],
        title: "🔥 Gia nhập đội hình academy",
        text: `Bạn gia nhập ${name}.\nHuấn luyện viên giao lịch tập, phân vai trò và chuẩn bị các buổi đấu tập. Mục tiêu của bạn là chứng minh bản thân để giành cơ hội thử việc ở đội 1.`,
        careerPath: {
          ...careerPath,
          school: { id, name, logo: academyLogos[id], type: "academy", program: "Đào tạo tuyển thủ Liên Quân Mobile" },
          status: `Tập luyện tại ${name}`,
        },
        confirmText: "Bắt đầu luyện tập!",
      })),
    };
  }
  const schools = careerSchools[careerPath.id] ?? [];
  const isContentCreator = ["tiktok", "youtube"].includes(careerPath.id);
  if (schools.length) {
    return {
      title: "🏫 Chọn trường theo học",
      text: `Bạn đã chọn ${careerPath.field}. Hãy chọn trường bạn muốn theo học.${isContentCreator ? "\nNgành Truyền thông đa phương tiện giúp bạn học kỹ năng sản xuất nội dung cho hướng này." : ""}`,
      choices: schools.slice(0, 3).map((entry) => ({
        label: `🏫 ${entry.name} (${entry.city})`,
        title: "🎓 Bắt đầu học tại trường mới",
        text: `Bạn chọn ${careerPath.field}.\nTrường: ${entry.name} (${entry.city}).\nChương trình: ${entry.program}.\nHành trình học tập của bạn bắt đầu!`,
        careerPath: {
          ...careerPath,
          school: { ...entry },
          status: `Học ${careerPath.field}`,
        },
        confirmText: "Bắt đầu học!",
      })),
    };
  }

  // Nhập ngũ có hướng huấn luyện riêng.
  const military = careerPath.id === "military";
  const status = military ? "Nhập ngũ" : `Tự rèn luyện ${careerPath.field}`;
  return {
    title: "🧭 Chọn hướng huấn luyện",
    text: military
      ? "Bạn chọn nhập ngũ. Bạn sẽ huấn luyện tại đơn vị được phân công, không chọn trường đại học."
      : `Chưa có trường trong danh sách đào tạo trực tiếp ${careerPath.field}. Bạn có thể bắt đầu bằng việc tự rèn luyện.`,
    choices: [{
      label: military ? "🪖 Huấn luyện tại đơn vị được phân công" : "🎮 Tự rèn luyện Liên Quân Mobile",
      title: "✨ Hành trình mới bắt đầu",
      text: military ? "Bạn bắt đầu hành trình nhập ngũ và huấn luyện tại đơn vị được phân công." : `Bạn bắt đầu tự rèn luyện ${careerPath.field}.`,
      careerPath: { ...careerPath, school: null, status },
      confirmText: "Bắt đầu hành trình!",
    }],
  };
}

export function createSchoolEvent(careerPath) {
  const event = createSchoolEventData(careerPath);
  const art = careerPath.id === "military"
    ? openMojiArt("1FA96", "Bắt đầu huấn luyện quân ngũ")
    : careerPath.id === "esports"
      ? openMojiArt("1F4F1", "Chọn academy Liên Quân Mobile")
      : openMojiArt("1F3EB", "Chọn trường và chương trình học");
  return { ...event, ...art,
    choices: event.choices.map(branch => ensureEventOpenMoji({ ...branch, ...art })),
  };
}
