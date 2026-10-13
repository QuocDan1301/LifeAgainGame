// Chỉ được nạp bởi máy chủ; khóa bí mật không xuất hiện trong mã trình duyệt.
export function createSupabaseStorage({ url, key, request = fetch }) {
  const base = new URL(url);
  if (base.protocol !== 'https:' || !/^[a-z0-9]+\.supabase\.co$/.test(base.hostname) || base.pathname !== '/') throw new Error('SUPABASE_URL không hợp lệ.');
  if (typeof key !== 'string' || !key.startsWith('sb_secret_')) throw new Error('Cần SUPABASE_SECRET_KEY của project, chỉ đặt trên máy chủ.');
  async function rpc(name, body) {
    let response;
    try { response = await request(new URL(`/rest/v1/rpc/${name}`, base), { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(12000) }); }
    catch { throw new Error('Chưa kết nối được cơ sở dữ liệu xếp hạng.'); }
    if (!response.ok) {
      const error = new Error(response.status === 401 || response.status === 403 ? 'Kiểm tra khóa máy chủ và quyền cơ sở dữ liệu.' : 'Chưa lưu được dữ liệu Supabase. Hãy thử lại.');
      // Lỗi xung đột phiên bản: không ghi đè dữ liệu của máy chủ khác.
      try { const detail = await response.json(); if (detail.code === '40001') error.code = 'CONFLICT'; } catch {}
      throw error;
    }
    return response.json();
  }
  return {
    async load() {
      const record = await rpc('life_again_read_state', {});
      if (!Number.isSafeInteger(record?.revision) || !record.payload ||
          ['accounts', 'sessions', 'starts', 'runs'].some(key => !Array.isArray(record.payload[key]))) throw new Error('Dữ liệu Supabase chưa được khởi tạo đúng.');
      return record;
    },
    async save(payload, revision) {
      const record = await rpc('life_again_write_state', { expected_revision: revision, next_payload: payload });
      if (!Number.isSafeInteger(record?.revision) || record.revision !== revision + 1) throw new Error('Chưa xác nhận được lần lưu dữ liệu.');
      return record.revision;
    },
  };
}
