// Quy tắc định hướng trong game; không mô phỏng tổ hợp tuyển sinh từng trường.
export const studyBlocks = [
  { id: "A00", subjects: "Toán, Vật lí, Hóa học", careers: ["programming", "accounting", "teaching", "business", "finance", "mechanical", "architecture", "marketing"] },
  { id: "A01", subjects: "Toán, Vật lí, Tiếng Anh", careers: ["programming", "accounting", "teaching", "business", "finance", "mechanical", "architecture", "marketing"] },
  { id: "B00", subjects: "Toán, Hóa học, Sinh học", careers: ["medicine", "psychology", "teaching", "football", "culinary"] },
  { id: "C00", subjects: "Ngữ văn, Lịch sử, Địa lí", careers: ["law", "psychology", "teaching", "acting", "singing", "painting", "fashion", "tourism"] },
  { id: "D01", subjects: "Ngữ văn, Toán, Tiếng Anh", careers: ["programming", "accounting", "law", "psychology", "teaching", "acting", "singing", "painting", "football", "business", "finance", "architecture", "fashion", "marketing", "tourism", "culinary"] },
];

const unrestricted = ["military", "esports", "tiktok", "youtube"];
export function canChooseCareer(careerId, blockId) {
  return unrestricted.includes(careerId) ||
    (studyBlocks.find((block) => block.id === blockId)?.careers.includes(careerId) ?? false);
}
