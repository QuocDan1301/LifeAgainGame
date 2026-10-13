import { observeRanking, rankTier, seasonId } from './scoring.js';
import { finishRanking, getRankingHistory, markRankingSubmitted } from './ranking-store.js';

let game = null;
let saveGame = null;
let user = null;
let online = false;
let initialized = false;
let scope = seasonId();
let boardRequest = 0;
let starting = false;
let accountMode = 'register';
function refreshAccountButtons() {
  for (const element of document.querySelectorAll('.ranking-account-open')) {
    const avatar = node('span', user?.avatar ?? '👤', 'account-avatar');
    avatar.setAttribute('aria-hidden', 'true');
    const identity = node('span', undefined, 'account-identity');
    identity.append(node('small', user ? 'Hồ sơ người chơi' : 'Cùng lưu lại hành trình', 'account-eyebrow'),
      node('strong', user?.nickname ?? 'Đăng nhập / Tạo tài khoản', 'account-name'));
    const arrow = node('span', '›', 'account-arrow'); arrow.setAttribute('aria-hidden', 'true');
    element.replaceChildren(avatar, identity, arrow);
    element.classList.toggle('is-signed-in', Boolean(user));
    element.setAttribute('aria-label', user ? `Mở hồ sơ của ${user.nickname}` : 'Đăng nhập hoặc tạo tài khoản');
  }
}
const node = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = text; if (className) element.className = className; return element; };
const button = (text, action, className = '') => { const element = node('button', text, className); element.type = 'button'; element.addEventListener('click', action); return element; };
async function api(route, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(`/api/ranking/${route}`, { method: body ? 'POST' : 'GET', credentials: 'same-origin', signal: controller.signal,
      ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
    const value = await response.json();
    if (!response.ok) throw new Error(value.error ?? 'Chưa kết nối được bảng xếp hạng.');
    return value;
  } finally { clearTimeout(timer); }
}
async function connect() {
  try { const status = await api('status'); user = status.user; online = true; }
  catch { user = null; online = false; }
}
async function startRankedLife(newborn = false) {
  if (!game || !user || starting) return;
  const r = observeRanking(game);
  if (r.serverRunId || game.player.isAlive === false || r.startedAge !== 0 || (!newborn && game.player.age !== 0)) return;
  starting = true;
  try {
    const run = await api('start', { localId: r.id });
    r.serverRunId = run.id; r.accountId = run.accountId;
    saveGame?.();
  } catch (error) { notice(error.message); }
  finally { starting = false; }
}
function notice(text) { const message = document.getElementById('ranking-message'); if (message) message.textContent = text; }
async function syncScores() {
  if (!online || !user) return;
  for (const record of getRankingHistory().filter(item => !item.submitted && item.serverRunId && item.accountId === user.id && item.score.eligible)) {
    await api('finish', { id: record.serverRunId, snapshot: record.snapshot });
    markRankingSubmitted(record.id);
  }
}
function renderHistory(container) {
  const records = getRankingHistory().slice().reverse();
  container.append(node('h3', '📜 Thành tích trên máy này'));
  if (!records.length) return container.append(node('p', 'Hoàn thành một cuộc đời để nhận điểm. Tạo lại nhân vật không xóa lịch sử thành tích.'));
  const seasonRuns = records.filter(item => item.season === seasonId() && item.score.eligible).sort((a, b) => b.score.total - a.score.total).slice(0, 5);
  const total = seasonRuns.reduce((sum, item) => sum + item.score.total, 0);
  container.append(node('p', `5 cuộc đời tốt nhất tháng này: ${total.toLocaleString('vi-VN')} điểm · ${rankTier(total)}`));
  for (const record of records.slice(0, 30)) {
    const details = node('details', undefined, 'ranking-history');
    details.append(node('summary', `${record.snapshot.name} · ${record.snapshot.age} tuổi · ${record.score.total} điểm${record.score.eligible ? '' : ' · Chưa đủ dữ liệu xếp hạng'}`));
    const labels = { achievements: 'Thành tựu', happiness: 'Hạnh phúc', longevity: 'Tuổi thọ', wealth: 'Tài sản ròng', milestones: 'Dấu mốc' };
    details.append(node('p', Object.entries(record.score.breakdown).map(([key, points]) => `${labels[key]}: ${points}`).join(' · ')));
    details.append(node('p', `${record.snapshot.path} · Mùa ${record.season} · ${record.submitted ? 'Đã gửi điểm' : record.serverRunId ? 'Chờ đồng bộ' : 'Thành tích cá nhân; cần đăng nhập trước khi bắt đầu cuộc đời để lên bảng chung.'}`));
    container.append(details);
  }
}
async function renderBoard() {
  const serial = ++boardRequest;
  const container = document.getElementById('ranking-board');
  container.replaceChildren(node('p', 'Đang tải bảng xếp hạng…'));
  try {
    const data = await api(`board?scope=${encodeURIComponent(scope)}`);
    if (serial !== boardRequest) return;
    container.replaceChildren();
    if (!data.entries.length) container.append(node('p', 'Chưa có người chơi hoàn thành cuộc đời trong bảng này.'));
    else {
      const table = node('table', undefined, 'ranking-table');
      const head = node('thead'); const headings = node('tr');
      for (const label of ['Hạng', 'Người chơi', 'Điểm']) headings.append(node('th', label));
      head.append(headings); table.append(head);
      const body = node('tbody');
      for (const entry of data.entries) {
        const row = node('tr'); if (entry.id === user?.id) row.className = 'ranking-mine';
        row.append(node('td', entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : String(entry.rank)));
        const identity = node('td');
        const player = node('span', undefined, 'ranking-player');
        const avatar = node('span', entry.avatar, 'account-avatar account-avatar--small'); avatar.setAttribute('aria-hidden', 'true');
        const text = node('span', undefined, 'account-identity'); text.append(node('strong', entry.nickname), node('small', `${entry.tier} · ${entry.runs} cuộc đời`));
        player.append(avatar, text); identity.append(player);
        row.append(identity, node('td', entry.score.toLocaleString('vi-VN'))); body.append(row);
      }
      table.append(body); container.append(table);
    }
    if (user) container.append(node('p', data.mine ? `Vị trí của bạn: #${data.mine.rank} · ${data.mine.score.toLocaleString('vi-VN')} điểm · ${data.mine.tier}` : 'Bạn chưa có thành tích được tính trong bảng này.', 'ranking-position'));
  } catch { if (serial === boardRequest) container.replaceChildren(node('p', 'Bảng chung chưa kết nối. Thành tích cá nhân vẫn được lưu trên máy này.')); }
}
function renderAccount() {
  const container = document.getElementById('ranking-account');
  container.replaceChildren();
  refreshAccountButtons();
  if (!online) { container.append(node('p', 'Đang ở chế độ cá nhân. Mở game bằng máy chủ chạy thử để đăng nhập và xếp hạng cùng người chơi khác.')); return; }
  if (user) {
    const profile = node('section', undefined, 'ranking-profile');
    const avatar = node('span', user.avatar, 'account-avatar'); avatar.setAttribute('aria-hidden', 'true');
    const identity = node('div', undefined, 'account-identity');
    identity.append(node('small', 'Hồ sơ người chơi', 'account-eyebrow'), node('h3', user.nickname, 'account-name'),
      node('small', `Mã người chơi · ${user.id.slice(0, 8)}`, 'account-code'));
    const status = node('span', 'Đã đăng nhập', 'account-status');
    profile.append(avatar, identity, status); container.append(profile);
    container.append(button('Đăng xuất', async () => {
      try { await api('logout', {}); user = null; renderAccount(); await renderBoard(); } catch (error) { notice(error.message); }
    }));
    container.append(node('p', 'Đăng nhập trước khi tạo nhân vật mới để cuộc đời được ghi nhận cho tài khoản này.'));
    return;
  }
  const modes = node('div', undefined, 'ranking-actions');
  for (const [mode, label] of [['register', 'Tạo tài khoản'], ['login', 'Đăng nhập']]) {
    const tab = button(label, () => { accountMode = mode; notice(''); renderAccount(); });
    tab.setAttribute('aria-pressed', String(accountMode === mode));
    modes.append(tab);
  }
  container.append(modes, node('h3', accountMode === 'register' ? '👤 Tạo hồ sơ người chơi' : '👋 Chào mừng trở lại'));
  const form = node('form', undefined, 'ranking-form');
  const field = (label, type, name, placeholder, maxLength) => {
    const wrapper = node('label', label);
    const input = node('input'); input.type = type; input.name = name; input.placeholder = placeholder;
    input.maxLength = maxLength; input.required = name !== 'nickname';
    input.autocomplete = name === 'password' ? 'current-password' : name === 'username' ? 'username' : 'nickname';
    wrapper.append(input); form.append(wrapper); return input;
  };
  const username = field('Tên đăng nhập', 'text', 'username', '3–24 chữ thường, số hoặc _', 24);
  username.pattern = '[a-zA-Z0-9_]{3,24}';
  const password = field('Mật khẩu', 'password', 'password', 'Từ 8 ký tự', 128); password.minLength = 8;
  password.autocomplete = accountMode === 'register' ? 'new-password' : 'current-password';
  const confirmation = field('Nhập lại mật khẩu', 'password', 'confirmation', 'Nhập lại mật khẩu', 128);
  confirmation.autocomplete = 'new-password';
  confirmation.required = accountMode === 'register'; confirmation.disabled = accountMode !== 'register'; confirmation.parentElement.hidden = accountMode !== 'register';
  confirmation.addEventListener('input', () => confirmation.setCustomValidity(''));
  password.addEventListener('input', () => confirmation.setCustomValidity(''));
  const nickname = field('Biệt danh', 'text', 'nickname', 'Tên hiển thị trên bảng', 30);
  nickname.required = accountMode === 'register'; nickname.disabled = accountMode !== 'register'; nickname.parentElement.hidden = accountMode !== 'register';
  const avatarLabel = node('label', 'Avatar'); const avatar = node('select');
  for (const icon of ['🙂', '😊', '😎', '🦊', '🐼', '🐱', '🦁', '🐸']) { const option = node('option', icon); option.value = icon; avatar.append(option); }
  avatarLabel.append(avatar); avatarLabel.hidden = accountMode !== 'register'; form.append(avatarLabel);
  const actions = node('div', undefined, 'ranking-actions');
  const login = node('button', accountMode === 'register' ? 'Tạo tài khoản' : 'Đăng nhập'); login.type = 'submit';
  actions.append(login); form.append(actions);
  async function submit(route) {
    confirmation.setCustomValidity(route === 'register' && confirmation.value !== password.value ? 'Hai mật khẩu chưa trùng nhau.' : '');
    if (!form.reportValidity()) return;
    login.disabled = true;
    try {
      const result = await api(route, { username: username.value.toLowerCase(), password: password.value, nickname: nickname.value, avatar: avatar.value });
      password.value = ''; user = result.user; notice('Đã đăng nhập.'); renderAccount();
      await startRankedLife(); await syncScores(); await renderBoard();
    } catch (error) { notice(error.message); }
    finally { login.disabled = false; }
  }
  form.addEventListener('submit', event => { event.preventDefault(); void submit(accountMode); });
  container.append(form);
}
export function initRankingUI() {
  if (initialized) return;
  initialized = true;
  const dialog = node('dialog'); dialog.id = 'ranking-dialog'; dialog.setAttribute('aria-labelledby', 'ranking-title');
  const heading = node('h2', '🏆 Xếp hạng người chơi'); heading.id = 'ranking-title';
  const close = button('✕', () => dialog.close()); close.setAttribute('aria-label', 'Đóng xếp hạng'); close.className = 'ranking-close';
  const intro = node('p', '', 'ranking-intro');
  const switchView = button('Mở hồ sơ của tôi', () => void open(view === 'account' ? 'ranking' : 'account'), 'ranking-switch-view');
  let view = 'ranking';
  dialog.append(close, heading, intro, switchView);
  for (const id of ['ranking-account', 'ranking-message']) { const section = node(id.endsWith('message') ? 'p' : 'section'); section.id = id; if (id.endsWith('message')) section.setAttribute('role', 'status'); dialog.append(section); }
  const tabs = node('div', undefined, 'ranking-actions');
  const monthly = button('📅 Tháng này', () => { scope = seasonId(); monthly.setAttribute('aria-pressed', 'true'); all.setAttribute('aria-pressed', 'false'); void renderBoard(); });
  const all = button('🌍 Mọi thời đại', () => { scope = 'all'; monthly.setAttribute('aria-pressed', 'false'); all.setAttribute('aria-pressed', 'true'); void renderBoard(); });
  monthly.setAttribute('aria-pressed', 'true'); all.setAttribute('aria-pressed', 'false'); tabs.append(monthly, all, button('↻ Làm mới', () => void open()));
  dialog.append(tabs);
  const board = node('section'); board.id = 'ranking-board';
  const history = node('section'); history.id = 'ranking-history'; dialog.append(board, history);
  const rules = node('details', undefined, 'ranking-history'); rules.append(node('summary', 'Cách tính điểm'),
    node('p', 'Mỗi cuộc đời tối đa 1.000 điểm: thành tựu 300, hạnh phúc trung bình 200, tuổi thọ 200, tài sản ròng 150, dấu mốc 150.'),
    node('p', 'Thành tựu thường 10 điểm, nghề nghiệp 30, câu chuyện đặc biệt 50. Tuổi thọ: 2 điểm/tuổi, tối đa 200. Tài sản ròng đạt 100 triệu / 1 tỷ / 10 tỷ / 100 tỷ / 1.000 tỷ lần lượt được 30 / 60 / 90 / 120 / 150 điểm.'),
    node('p', 'Mỗi dấu mốc 30 điểm: học xong, hoàn thành nghĩa vụ hoặc rèn nghề mưu sinh 2 năm; làm việc 10 năm, vượt biến cố, có quan hệ ít nhất 5 năm, đến tuổi nghỉ hưu. Hướng mưu sinh vẫn có thể đạt điểm cao.'),
    node('p', 'Chỉ tính cuộc đời hoàn thành và có dữ liệu từ tuổi 0. Cùng điểm và cùng điểm cuộc đời tốt nhất thì đồng hạng. Bản thử nghiệm chưa chống hoàn toàn việc sửa bản lưu.'));
  dialog.append(rules); document.body.append(dialog);
  async function open(nextView = view) {
    view = nextView;
    const accountView = view === 'account';
    dialog.dataset.view = view;
    heading.textContent = accountView ? '👤 Hồ sơ người chơi' : '🏆 Xếp hạng người chơi';
    intro.textContent = accountView ? 'Tài khoản và những cuộc đời bạn đã trải qua.' : 'Top 100 · Mỗi tháng tính 5 cuộc đời tốt nhất của mỗi người chơi.';
    document.getElementById('ranking-account').hidden = !accountView;
    history.hidden = !accountView;
    tabs.hidden = accountView;
    board.hidden = accountView;
    rules.hidden = accountView;
    if (!accountView) board.replaceChildren(node('p', 'Đang tải bảng xếp hạng…'));
    switchView.textContent = accountView ? '🏆 Xem bảng xếp hạng' : '👤 Mở hồ sơ của tôi';
    close.setAttribute('aria-label', accountView ? 'Đóng hồ sơ người chơi' : 'Đóng xếp hạng');
    if (!dialog.open) dialog.showModal();
    notice('');
    if (accountView) document.getElementById('ranking-account').replaceChildren(node('p', 'Đang kết nối tài khoản…'));
    await connect(); renderAccount();
    try { await syncScores(); } catch (error) { notice(`Điểm đã lưu trên máy; chưa đồng bộ: ${error.message}`); }
    history.replaceChildren(); renderHistory(history);
    if (view === 'ranking') await renderBoard();
  }
  document.querySelector('.lobby-actions')?.append(button('👤 Đăng nhập / Tạo tài khoản', () => void open('account'), 'ranking-account-open'));
  document.querySelector('.lobby-actions')?.append(button('🏆 Xếp hạng người chơi', () => void open('ranking'), 'ranking-open'));
  document.getElementById('menu-panel')?.append(button('👤 Đăng nhập / Tạo tài khoản', () => void open('account'), 'ranking-account-open'));
  document.getElementById('menu-panel')?.append(button('🏆 Xếp hạng người chơi', () => void open('ranking'), 'ranking-open'));
  if (new URLSearchParams(location.search).get('account') === 'register') { accountMode = 'register'; void open('account'); }
  else { refreshAccountButtons(); void connect().then(refreshAccountButtons); }
  document.addEventListener('ranking-life-ended', () => {
    try {
      const record = game && finishRanking(game);
      if (!record) return;
      const old = document.getElementById('ranking-life-score'); old?.remove();
      const card = node('section', undefined, 'dialog-card'); card.id = 'ranking-life-score';
      card.append(node('h3', `🏆 Điểm cuộc đời: ${record.score.total}/1.000`),
        node('p', record.score.eligible ? 'Đã lưu vào thành tích cá nhân.' : 'Bản lưu này chưa có đủ dữ liệu từ tuổi 0; điểm chỉ dùng để tham khảo.'),
        button('Xem xếp hạng', () => void open('ranking')));
      document.getElementById('death-summary')?.append(card);
      void syncScores().catch(error => notice(`Chưa gửi điểm: ${error.message}`));
    } catch { notice('Chưa lưu được điểm. Cuộc đời vẫn được giữ trong bản lưu game.'); }
  });
}
export function initRankingGame(state, save) {
  initRankingUI(); game = state; saveGame = save;
  observeRanking(state);
  const newborn = state.player.age === 0;
  saveGame?.();
  void connect().then(() => startRankedLife(newborn));
}
