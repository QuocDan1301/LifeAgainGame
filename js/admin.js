const $ = id => document.getElementById(id);
let page = 1, pages = 0, selected = null, pending = null, busy = false, requestId = 0;
const date = value => value ? new Date(value).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : 'Chưa ghi nhận';
function text(tag, value, className) { const el = document.createElement(tag); el.textContent = value; if (className) el.className = className; return el; }
async function api(route, body) {
  const response = await fetch(`/api/ranking/${route}`, { credentials: 'same-origin', signal: AbortSignal.timeout(75000), ...(body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
  const value = await response.json();
  if (!response.ok) { if (response.status === 401 || response.status === 403) { $('dashboard').hidden = true; $('login').hidden = false; } throw new Error(value.error || 'Không thực hiện được yêu cầu.'); }
  return value;
}
function report(error) { $('message').textContent = error.message; }
function action(label, callback) { const el = text('button', label, 'secondary'); el.type = 'button'; el.addEventListener('click', () => void callback().catch(report)); return el; }
function confirm(description, callback) { pending = callback; $('confirm-description').textContent = description; $('confirm-dialog').showModal(); }
async function loadAccounts() {
  const id = ++requestId;
  $('message').textContent = 'Đang tải danh sách…';
  const result = await api(`admin/accounts?q=${encodeURIComponent($('search').value)}&page=${page}`);
  if (id !== requestId) return;
  if (page > Math.max(1, result.pages)) { page = Math.max(1, result.pages); return loadAccounts(); }
  pages = result.pages;
  $('stats').replaceChildren(...[['Tài khoản', result.stats.accounts], ['Đang bị khóa', result.stats.disabled], ['Cuộc đời hoàn thành', result.stats.runs]].map(([label, value]) => { const el = text('div', '', 'stat'); el.append(text('strong', value.toLocaleString('vi-VN')), text('span', label)); return el; }));
  $('accounts').replaceChildren(...result.accounts.map(account => {
    const tr = document.createElement('tr'), person = document.createElement('td');
    person.append(text('strong', `${account.avatar} ${account.nickname}`), text('small', `@${account.username}`));
    const state = document.createElement('td'); state.append(text('span', account.admin ? 'Quản trị viên' : account.disabled ? 'Đã khóa' : 'Hoạt động', `badge${account.disabled ? ' locked' : ''}`));
    const controls = document.createElement('td'), actions = text('div', '', 'actions');
    actions.append(action('Xem điểm', async () => { selected = account; $('runs-title').textContent = `Hành trình của ${account.nickname}`; $('runs').replaceChildren(); $('run-message').textContent = 'Đang tải…'; $('runs-dialog').showModal(); await loadRuns(); }));
    if (!account.admin) actions.append(action(account.disabled ? 'Mở khóa' : 'Khóa', async () => confirm(account.disabled ? `Mở khóa @${account.username}? Người chơi cần đăng nhập lại.` : `Khóa @${account.username}? Các phiên đăng nhập sẽ bị thu hồi và người chơi bị ẩn khỏi bảng xếp hạng.`, async () => { await api('admin/account-state', { id: account.id, disabled: !account.disabled }); await loadAccounts(); })));
    controls.append(actions); tr.append(person, text('td', date(account.createdAt)), text('td', account.runs), text('td', `${account.best}/1.000`), state, controls); return tr;
  }));
  if (!result.accounts.length) { const row = document.createElement('tr'), cell = text('td', 'Không tìm thấy tài khoản.'); cell.colSpan = 6; row.append(cell); $('accounts').append(row); }
  $('page').textContent = `Trang ${page}/${Math.max(1, pages)} · ${result.total} tài khoản`;
  $('previous').disabled = page <= 1; $('next').disabled = page >= pages;
  $('message').textContent = '';
}
async function loadRuns() {
  const account = selected;
  const result = await api(`admin/runs?accountId=${encodeURIComponent(account.id)}`);
  if (selected?.id !== account.id || !$('runs-dialog').open) return;
  $('run-message').textContent = result.runs.length ? '' : 'Người chơi chưa hoàn thành cuộc đời nào.';
  $('runs').replaceChildren(...result.runs.map(run => {
    const row = text('article', '', 'run');
    row.append(text('h3', `${run.name || 'Cuộc đời'} · ${run.score.total}/1.000 điểm`), text('p', `${run.age} tuổi · Mùa ${run.season} · ${date(run.completedAt)}`), text('p', run.excluded ? 'Đã ẩn khỏi xếp hạng' : 'Đang tính vào xếp hạng'), text('p', Object.entries(run.score.breakdown ?? {}).map(([key, value]) => `${({ achievements: 'Thành tựu', happiness: 'Hạnh phúc', longevity: 'Tuổi thọ', wealth: 'Tài sản', milestones: 'Dấu mốc' })[key] ?? key}: ${value}`).join(' · ')));
    const actions = text('div', '', 'actions'); actions.append(action(run.excluded ? 'Khôi phục điểm' : 'Ẩn kết quả', async () => confirm(run.excluded ? 'Khôi phục kết quả này vào bảng xếp hạng?' : 'Ẩn kết quả này khỏi bảng xếp hạng? Lịch sử người chơi vẫn được giữ.', async () => { await api('admin/run-state', { id: run.id, excluded: !run.excluded }); await loadRuns(); await loadAccounts(); })));
    row.append(actions); return row;
  }));
}
async function connect() {
  const { user } = await api('status');
  $('login').hidden = Boolean(user?.admin); $('dashboard').hidden = !user?.admin;
  $('identity').textContent = user?.admin ? `Đang quản trị với ${user.nickname}` : user ? 'Tài khoản này chưa được cấp quyền quản trị.' : 'Chỉ tài khoản quản trị được truy cập dữ liệu người chơi.';
  if (user?.admin) await loadAccounts();
}
$('login-form').addEventListener('submit', async event => {
  event.preventDefault(); const button = event.currentTarget.querySelector('button'); button.disabled = true;
  try { const data = new FormData(event.currentTarget); await api('login', { username: data.get('username'), password: data.get('password') }); $('login-form').reset(); await connect(); }
  catch (error) { report(error); } finally { button.disabled = false; }
});
$('search-form').addEventListener('submit', event => { event.preventDefault(); page = 1; void loadAccounts().catch(report); });
$('refresh').addEventListener('click', () => void loadAccounts().catch(report));
$('previous').addEventListener('click', () => { if (page > 1) { page--; void loadAccounts().catch(report); } });
$('next').addEventListener('click', () => { if (page < pages) { page++; void loadAccounts().catch(report); } });
$('logout').addEventListener('click', () => void api('logout', {}).then(() => { $('runs-dialog').close(); $('confirm-dialog').close(); return connect(); }).catch(report));
$('close-runs').addEventListener('click', () => { selected = null; $('runs-dialog').close(); });
$('cancel-change').addEventListener('click', () => { pending = null; $('confirm-dialog').close(); });
$('confirm-change').addEventListener('click', async () => {
  if (!pending || busy) return; busy = true; $('confirm-change').disabled = true; $('cancel-change').disabled = true;
  try { await pending(); pending = null; $('confirm-dialog').close(); } catch (error) { $('confirm-dialog').close(); report(error); }
  finally { busy = false; $('confirm-change').disabled = false; $('cancel-change').disabled = false; }
});
$('confirm-dialog').addEventListener('cancel', event => { if (busy) event.preventDefault(); else pending = null; });
void connect().catch(report);
