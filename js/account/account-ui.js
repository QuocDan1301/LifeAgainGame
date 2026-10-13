let user = null;
let online = false;
let initialized = false;
let accountMode = 'register';
function refreshAccountButtons() {
  for (const element of document.querySelectorAll('.account-open')) {
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
    const response = await fetch(`/api/account/${route}`, { method: body ? 'POST' : 'GET', credentials: 'same-origin', signal: controller.signal,
      ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
    const value = await response.json();
    if (!response.ok) throw new Error(value.error ?? 'Chưa kết nối được tài khoản.');
    return value;
  } finally { clearTimeout(timer); }
}
async function connect() {
  try { const status = await api('status'); user = status.user; online = true; }
  catch { user = null; online = false; }
}
function notice(message) { document.getElementById('account-message').textContent = message; }
function renderAccount() {
  const container = document.getElementById('account-content');
  container.replaceChildren();
  refreshAccountButtons();
  if (!online) { container.append(node('p', 'Đang ở chế độ cá nhân. Mở game bằng máy chủ chạy thử để đăng ký và đăng nhập.')); return; }
  if (user) {
    const profile = node('section', undefined, 'account-profile');
    const avatar = node('span', user.avatar, 'account-avatar'); avatar.setAttribute('aria-hidden', 'true');
    const identity = node('div', undefined, 'account-identity');
    identity.append(node('small', 'Hồ sơ người chơi', 'account-eyebrow'), node('h3', user.nickname, 'account-name'),
      node('small', `Mã người chơi · ${user.id.slice(0, 8)}`, 'account-code'));
    const status = node('span', 'Đã đăng nhập', 'account-status');
    profile.append(avatar, identity, status); container.append(profile);
    container.append(button('Đăng xuất', async () => {
      try { await api('logout', {}); user = null; renderAccount(); } catch (error) { notice(error.message); }
    }));
    return;
  }
  const modes = node('div', undefined, 'account-actions');
  for (const [mode, label] of [['register', 'Tạo tài khoản'], ['login', 'Đăng nhập']]) {
    const tab = button(label, () => { accountMode = mode; notice(''); renderAccount(); });
    tab.setAttribute('aria-pressed', String(accountMode === mode));
    modes.append(tab);
  }
  container.append(modes, node('h3', accountMode === 'register' ? '👤 Tạo hồ sơ người chơi' : '👋 Chào mừng trở lại'));
  const form = node('form', undefined, 'account-form');
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
  const nickname = field('Biệt danh', 'text', 'nickname', 'Tên hiển thị của bạn', 30);
  nickname.required = accountMode === 'register'; nickname.disabled = accountMode !== 'register'; nickname.parentElement.hidden = accountMode !== 'register';
  const avatarLabel = node('label', 'Avatar'); const avatar = node('select');
  for (const icon of ['🙂', '😊', '😎', '🦊', '🐼', '🐱', '🦁', '🐸']) { const option = node('option', icon); option.value = icon; avatar.append(option); }
  avatarLabel.append(avatar); avatarLabel.hidden = accountMode !== 'register'; form.append(avatarLabel);
  const actions = node('div', undefined, 'account-actions');
  const login = node('button', accountMode === 'register' ? 'Tạo tài khoản' : 'Đăng nhập'); login.type = 'submit';
  actions.append(login); form.append(actions);
  async function submit(route) {
    confirmation.setCustomValidity(route === 'register' && confirmation.value !== password.value ? 'Hai mật khẩu chưa trùng nhau.' : '');
    if (!form.reportValidity()) return;
    login.disabled = true;
    try {
      const result = await api(route, { username: username.value.toLowerCase(), password: password.value, nickname: nickname.value, avatar: avatar.value });
      password.value = ''; user = result.user; notice('Đã đăng nhập.'); renderAccount();
    } catch (error) { notice(error.message); }
    finally { login.disabled = false; }
  }
  form.addEventListener('submit', event => { event.preventDefault(); void submit(accountMode); });
  container.append(form);
}
export function initAccountUI() {
  if (initialized) return;
  initialized = true;
  const dialog = node('dialog'); dialog.id = 'account-dialog'; dialog.setAttribute('aria-labelledby', 'account-title');
  const heading = node('h2', '👤 Tài khoản người chơi'); heading.id = 'account-title';
  const close = button('✕', () => dialog.close(), 'account-close'); close.setAttribute('aria-label', 'Đóng tài khoản');
  dialog.append(close, heading);
  for (const id of ['account-content', 'account-message']) {
    const section = node(id.endsWith('message') ? 'p' : 'section'); section.id = id;
    if (id.endsWith('message')) section.setAttribute('role', 'status');
    dialog.append(section);
  }
  document.body.append(dialog);
  async function open() {
    if (!dialog.open) dialog.showModal();
    notice('');
    document.getElementById('account-content').replaceChildren(node('p', 'Đang kết nối tài khoản…'));
    await connect(); renderAccount();
  }
  document.querySelector('.lobby-actions')?.append(button('👤 Đăng nhập / Tạo tài khoản', () => void open(), 'account-open'));
  document.getElementById('menu-panel')?.append(button('👤 Đăng nhập / Tạo tài khoản', () => void open(), 'account-open'));
  if (new URLSearchParams(location.search).get('account') === 'register') { accountMode = 'register'; void open(); }
  else { refreshAccountButtons(); void connect().then(refreshAccountButtons); }
}
