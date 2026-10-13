// Sau mỗi lần cập nhật game, trình duyệt có thể còn giữ vài file JS cũ trong bộ nhớ đệm
// (GitHub Pages cho giữ 10 phút), khiến file mới gọi hàm mà file cũ chưa có.
// Hàm này tải lại mọi file JS mà game dùng, bỏ qua bộ nhớ đệm, để lần mở trang sau là bản mới.
const IMPORT_PATTERN = /(?:\bfrom\s*|\bimport\s*\(?\s*)["'](\.{1,2}\/[^"']+\.js)["']/g;

export function refreshModuleCache(entries) {
  return crawlModules(entries, "reload");
}

// Tải sẵn (không bắt tải lại) để lần vào game sau dùng ngay từ bộ nhớ đệm.
export function warmModuleCache(entries) {
  return crawlModules(entries, "default");
}

async function crawlModules(entries, cache) {
  const seen = new Set();
  const queue = entries.map((entry) => new URL(entry, import.meta.url).href);
  while (queue.length) {
    const url = queue.pop();
    if (seen.has(url)) continue;
    seen.add(url);
    try {
      const response = await fetch(url, { cache, priority: "low" });
      if (!response.ok) continue;
      const source = await response.text();
      for (const match of source.matchAll(IMPORT_PATTERN)) queue.push(new URL(match[1], url).href);
    } catch {
      // Mất mạng hoặc file lỗi: bỏ qua, lần tải lại trang sẽ báo lỗi như bình thường.
    }
  }
  return seen.size;
}

const RETRY_KEY = "lifeAgainModuleRefresh";

// Chỉ tự sửa một lần mỗi phiên để không tải lại trang vô hạn khi lỗi là thật.
export function canRetryModuleLoad() {
  try {
    if (sessionStorage.getItem(RETRY_KEY)) return false;
    sessionStorage.setItem(RETRY_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export function clearModuleRetry() {
  try {
    sessionStorage.removeItem(RETRY_KEY);
  } catch {
    // Không có sessionStorage: không cần làm gì.
  }
}
