import { candidatesOf, matchesClue } from './detective-data.js';

 
export function evidenceNoteOf(file, suspectIndex, clueIndex) {
  const value = file.evidenceNotes?.[suspectIndex]?.[clueIndex];
  return ['fits', 'conflict'].includes(value) ? value : 'unknown';
}
export function setEvidenceNote(file, suspectIndex, clueIndex, value) {
  if (file.result || !Number.isInteger(suspectIndex) || !file.suspects[suspectIndex] ||
      !Number.isInteger(clueIndex) || !file.clues[clueIndex] || !file.revealed.includes(clueIndex) ||
      !['unknown', 'fits', 'conflict'].includes(value)) return false;
  file.evidenceNotes ??= {};
  file.evidenceNotes[suspectIndex] ??= {};
  if (value === 'unknown') delete file.evidenceNotes[suspectIndex][clueIndex];
  else file.evidenceNotes[suspectIndex][clueIndex] = value;
  return true;
}
export function notedReasons(file, accused) {
  return Object.fromEntries(file.suspects.flatMap((_, index) => {
    if (index === accused) return [];
    const clue = file.revealed.find(clueIndex => evidenceNoteOf(file, index, clueIndex) === 'conflict');
    return clue === undefined ? [] : [[index, clue]];
  }));
}

 
export function solutionSteps(file) {
  if (!file.result) return [];
  const all = [...new Set([...file.revealed, ...file.clues.map((_, index) => index)])]
    .filter(index => file.clues[index]);
  let selected = null;
  function search(size, start = 0, head = []) {
    if (head.length === size) {
      if (candidatesOf(file, head).length === 1) selected = head;
      return;
    }
    for (let index = start; index < all.length && !selected; index++) search(size, index + 1, [...head, all[index]]);
  }
  for (let size = 1; size <= all.length && !selected; size++) search(size);
  let remaining = file.suspects.map((_, index) => index);
  return (selected ?? []).map(clueIndex => {
    const before = remaining;
    remaining = before.filter(index => matchesClue(file.suspects[index], file.clues[clueIndex], file.window));
    return { clueIndex, before, remaining, removed: before.filter(index => !remaining.includes(index)) };
  });
}

const DETAILS = {
  'cafe-wallet': ['Giấy tờ và tiền cọc thuê nhà khiến việc trả lại chiếc ví trở nên cấp thiết.', 'Ngồi gần bàn số 4 chỉ là cơ hội tiếp cận; chưa đủ để kết luận ai cầm ví.'],
  'tailor-ring': ['Chiếc nhẫn được để lại trong lúc khách thử áo dài.', 'Đừng suy từ nghề nghiệp hoặc việc quen cửa tiệm sang việc có lỗi.'],
  'community-fund': ['Phong bì là tiền nhiều hộ góp để mua sách vở cho các em.', 'Người có trách nhiệm giữ tiền cũng cần được đối chiếu như mọi người khác.'],
  warehouse: ['Chênh lệch được ghi nhận giữa hai lần kiểm kho.', 'Có mặt ở cửa hàng không đồng nghĩa có mặt trong khoảng hàng biến mất.'],
  'studio-camera': ['Chiếc máy ảnh dự phòng cần được tìm lại trước buổi chụp đã hẹn.', 'Vai trò trong studio không phải bằng chứng; hãy đối chiếu từng dữ kiện.'],
  pharmacy: ['Một xấp tiền lẻ đã bó sẵn không khớp với sổ cuối ca.', 'Khách quen và nhân viên đều được áp dụng cùng một tiêu chuẩn bằng chứng.'],
  'library-laptop': ['Chiếc máy chứa bài luận sắp đến hạn nộp.', 'Mang túi đủ lớn chỉ cho thấy khả năng cất đồ, chưa xác định người lấy máy.'],
  'garden-bonsai': ['Chậu cây đã được chăm hơn mười năm và chuẩn bị đi hội chợ.', 'Đừng chọn người chỉ vì công việc của họ có liên quan đến cây cảnh.'],
  'gallery-catalog': ['Bản danh mục có chữ ký xác nhận của các tác giả, cần cho buổi bàn giao.', 'Việc quen các tác phẩm không thay thế được chứng cứ về người mang tài liệu đi.'],
  'bakery-recipe': ['Sổ công thức có những ghi chép tay mà cửa hàng chưa sao lưu.', 'Biết làm bánh không tự động đồng nghĩa là người giữ cuốn sổ.'],
  'station-luggage': ['Hai hành lý có ngoại hình gần giống nhau; mục tiêu là tìm đúng người cầm nhầm.', 'Đừng mặc định đây là một vụ cố ý lấy cắp. Chỉ kết luận điều bằng chứng cho phép.'],
  'school-projector': ['Máy chiếu cần dùng cho buổi sinh hoạt sáng hôm sau.', 'Được phép vào phòng không có nghĩa là đã mang thiết bị ra ngoài.'],
};
export function detectiveBriefOf(file) {
  const details = DETAILS[file.scene] ?? ['Khách hàng cần tìm lại tài sản.', 'Đối chiếu bằng chứng trước khi kết luận.'];
  return {
    stakes: details[0], caution: details[1],
    verified: [
      'Danh sách đã bao quát những người có thể liên quan. Vụ việc có một người cần tìm.',
      'Giờ có mặt, trang phục, đồ mang theo và lối đi trên thẻ đã được xác minh trong hồ sơ; các dấu hiệu được giữ nguyên trong khoảng điều tra.',
      'Manh mối mở được là dữ kiện đã kiểm chứng. Một người khớp một manh mối vẫn chưa đủ để kết luận.',
    ],
  };
}
