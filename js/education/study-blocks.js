 
export const studyBlocks = [
  { id: "A00", subjects: "Toán, Vật lí, Hóa học", careers: ["study-abroad", "programming", "accounting", "teaching", "business", "finance", "mechanical", "architecture", "marketing"] },
  { id: "A01", subjects: "Toán, Vật lí, Tiếng Anh", careers: ["study-abroad", "programming", "accounting", "teaching", "business", "finance", "mechanical", "architecture", "marketing"] },
  { id: "B00", subjects: "Toán, Hóa học, Sinh học", careers: ["study-abroad", "medicine", "psychology", "teaching", "football", "culinary"] },
  { id: "C00", subjects: "Ngữ văn, Lịch sử, Địa lí", careers: ["study-abroad", "law", "psychology", "teaching", "acting", "singing", "painting", "fashion", "tourism"] },
  { id: "D01", subjects: "Ngữ văn, Toán, Tiếng Anh", careers: ["study-abroad", "programming", "accounting", "law", "psychology", "teaching", "acting", "singing", "painting", "football", "business", "finance", "architecture", "fashion", "marketing", "tourism", "culinary"] },
   
  { id: "TD", label: "Khối Tự do", subjects: "Không theo tổ hợp môn", careers: ["study-abroad", "military", "esports", "tiktok", "youtube"] },
];

export function getStudyBlockLabel(blockId) {
  const block = studyBlocks.find((entry) => entry.id === blockId);
  return block?.label ?? (blockId ? `Khối ${blockId}` : "");
}

export function canChooseCareer(careerId, blockId) {
  return studyBlocks.find((block) => block.id === blockId)?.careers.includes(careerId) ?? false;
}
