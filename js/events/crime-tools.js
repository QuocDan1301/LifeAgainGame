// Đạo cụ và giá là quy tắc của game; sở hữu trong player.purchases.
export const crimeTools = [
  { id: 'crime-gloves', crime: 'theft', shop: 'shopping', group: 'items', icon: '🧤', name: 'Găng tay đen', price: 200_000, limit: 1, minAge: 18,
    description: 'Đạo cụ cần có cho lựa chọn Trộm cắp trong Sống khác. Dùng lại được, không sinh lãi.' },
  { id: 'crime-phone', crime: 'fraud', shop: 'shopping', group: 'items', icon: '📱', name: 'Điện thoại', price: 2_000_000, limit: 1, minAge: 18,
    description: 'Đạo cụ cần có cho lựa chọn Lừa đảo trong Sống khác. Dùng lại được, không sinh lãi.' },
  { id: 'crime-mask', crime: 'robbery', shop: 'shopping', group: 'items', icon: '🎭', name: 'Mặt nạ', price: 500_000, limit: 1, minAge: 18,
    description: 'Đạo cụ cần có cho lựa chọn Cướp tài sản trong Sống khác. Dùng lại được, không sinh lãi.' },
];

export const getCrimeTool = crimeId => crimeTools.find(item => item.crime === crimeId);
export const hasCrimeTool = (player, crimeId) => {
  const tool = getCrimeTool(crimeId);
  return Boolean(tool && player.purchases?.some(item => item.id === tool.id));
};
