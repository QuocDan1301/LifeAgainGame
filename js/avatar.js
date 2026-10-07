const avatarStages = [
  { maxAge: 3, file: "0-3" },
  { maxAge: 5, file: "4-5" },
  { maxAge: 10, file: "6-10" },
  { maxAge: 14, file: "11-14" },
  { maxAge: 17, file: "15-17" },
  { maxAge: 21, file: "18-21" },
  { maxAge: 30, file: "22-30" },
  { maxAge: 50, file: "31-50" },
  { maxAge: 70, file: "51-70" },
  { maxAge: 100, file: "71-100" },
  { maxAge: Infinity, file: "101-105" },
];

export function renderAvatar(player) {
  const image = document.getElementById("avt");
  if (!image) return;

  const isFemale = player.gender === "female";
  const folder = isFemale ? "Nu" : "Nam";
  const prefix = isFemale ? "nu" : "nam";

  const age = Number.isFinite(player.age) ? Math.max(0, player.age) : 0;

  const stage = avatarStages.find((item) => age <= item.maxAge);

  // Đường dẫn tính từ file avatar.js trong thư mục js.
  const src = new URL(
    `../img/${folder}/${prefix}_${stage.file}.png`,
    import.meta.url,
  ).href;

  // Chỉ thay ảnh khi bước sang giai đoạn mới.
  if (image.src !== src) {
    image.src = src;
  }

  const description = `Chân dung nhân vật ${isFemale ? "nữ" : "nam"}, ${age} tuổi`;

  const container = image.closest(".avatar");

  if (container) {
    container.setAttribute("aria-label", description);
    image.alt = "";
  } else {
    image.alt = description;
  }
}
