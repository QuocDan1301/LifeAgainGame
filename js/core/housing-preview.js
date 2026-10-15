import { forecastNextYear } from '../relationships/family.js';
import { getHomeFinancing, prepareHomePurchase } from './housing.js';
import { formatMoney } from './money-format.js';

// Use the same accounting as the budget screen; previews never change the save.
export function getHomePurchasePreview(player, id, age = player.age) {
  const terms = getHomeFinancing(id);
  const purchase = prepareHomePurchase(player, id, age, 'housing-preview');
  const projected = { ...player, ...purchase.playerUpdates, age, money: player.money + purchase.money };
  const forecast = forecastNextYear(projected);
  const annualNet = forecast.income - forecast.costs;
  const cashFlowText = annualNet >= 0
    ? `dư ${formatMoney(annualNet)}/năm`
    : `thiếu ${formatMoney(-annualNet)}/năm`;
  const warning = annualNet < 0
    ? `⚠️ Theo thu nhập hiện tại, chi vượt thu ${formatMoney(-annualNet)}/năm. Cần thêm thu nhập hoặc dùng tiền tiết kiệm để trả nợ.`
    : annualNet < 12_000_000
      ? '⚠️ Phần dư dưới 1 triệu/tháng; nên giữ tiền dự phòng cho chăm sóc sức khỏe và biến cố.'
      : '';
  return {
    ...forecast, annualNet, cashAfterDeposit: projected.money, cashFlowText, warning,
    summary: `Dự kiến năm tới sau trả góp: ${cashFlowText}. Ví sau trả trước: ${formatMoney(projected.money)}; cuối năm tới: ${formatMoney(forecast.after)}.`,
    note: 'Dự báo gồm thuế, bảo hiểm, nợ và chi gia đình đã đăng ký; chưa tính mua sắm, khám chữa bệnh hay biến cố mới.',
    annualPayment: terms.annualPayment,
  };
}
