export const maleNames = [
  "Quốc Dân",
  "Gia Bảo",
  "Hoàng Nam",
  "Anh Khoa",
  "Đức Anh",
  "Minh Khôi",
  "Tuấn Kiệt",
  "Nhật Minh",
  "Hải Đăng",
  "Quang Huy",
  "Minh Quân",
  "Đăng Khoa",
  "Gia Huy",
  "Thanh Bình",
];

export const femaleNames = [
  "Ngọc Anh",
  "Phương Anh",
  "Minh Châu",
  "Bảo Ngọc",
  "Khánh Linh",
  "Thảo Nhi",
  "Quỳnh Anh",
  "Ngọc Hân",
  "Hà My",
  "Thu Hà",
  "Mai Anh",
  "Thanh Trúc",
  "Tú Uyên",
  "Lan Anh",
];
// Danh sách quê quán dùng cho lựa chọn ngẫu nhiên và gợi ý khi nhập.
export const provinces = [
  "Hà Nội",
  "Cao Bằng",
  "Tuyên Quang",
  "Điện Biên",
  "Lai Châu",
  "Sơn La",
  "Lào Cai",
  "Thái Nguyên",
  "Lạng Sơn",
  "Quảng Ninh",
  "Bắc Ninh",
  "Phú Thọ",
  "Hải Phòng",
  "Hưng Yên",
  "Ninh Bình",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Trị",
  "Huế",
  "Đà Nẵng",
  "Quảng Ngãi",
  "Gia Lai",
  "Khánh Hòa",
  "Đắk Lắk",
  "Lâm Đồng",
  "Đồng Nai",
  "Tây Ninh",
  "Thành phố Hồ Chí Minh",
  "Đồng Tháp",
  "Vĩnh Long",
  "An Giang",
  "Cần Thơ",
  "Cà Mau",
  "Bình Định",
];
export const pick = (items) => items[Math.floor(Math.random() * items.length)];
export function validateCharacter(name, province) {
  name = name.normalize("NFC").trim().replace(/\s+/g, " ");
  province = province.normalize("NFC").trim().replace(/\s+/g, " ");
  if (!name) return { error: "Bạn chưa nhập tên nhân vật.", field: "name" };
  if (name.split(" ").length > 2)
    return {
      error: "Tên chỉ được tối đa 2 từ. Bạn hãy nhập lại.",
      field: "name",
    };
  if (
    name.length > 30 ||
    !name.split(" ").every((word) => /^\p{L}[\p{L}\p{M}]*$/u.test(word))
  ) {
    return {
      error: "Tên chỉ gồm chữ cái và dài tối đa 30 ký tự.",
      field: "name",
    };
  }
  if (
    !province ||
    province.length > 60 ||
    !/^[\p{L}\p{M}\d .'-]+$/u.test(province)
  ) {
    return {
      error: "Hãy nhập tỉnh/thành bằng chữ, dài tối đa 60 ký tự.",
      field: "province",
    };
  }
  return { name, province };
}
