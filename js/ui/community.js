// Điền URL các kênh cộng đồng chính thức tại đây.
export const communityChannels = [
  { id: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/groups/1036791046049382?locale=vi_VN',
    path: 'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.956.931-1.956 1.887v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z' },
  { id: 'discord', name: 'Discord', url: 'https://discord.gg/F8yecejTS',
    path: 'M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515c-.211.375-.457.88-.626 1.28a18.27 18.27 0 0 0-5.417 0 12.64 12.64 0 0 0-.635-1.28A19.736 19.736 0 0 0 3.87 4.373C.78 8.946-.056 13.406.362 17.802a19.9 19.9 0 0 0 5.993 3.03c.486-.662.92-1.362 1.293-2.1a12.96 12.96 0 0 1-2.037-.972c.17-.124.337-.254.498-.388 3.928 1.837 8.18 1.837 12.061 0 .163.134.33.264.499.388-.646.38-1.33.705-2.038.973.374.738.806 1.438 1.293 2.1a19.85 19.85 0 0 0 5.997-3.03c.49-5.096-.838-9.515-3.604-13.433ZM8.02 15.12c-1.18 0-2.148-1.08-2.148-2.409s.948-2.41 2.148-2.41c1.2 0 2.167 1.09 2.147 2.41 0 1.329-.947 2.41-2.147 2.41Zm7.938 0c-1.18 0-2.147-1.08-2.147-2.409s.947-2.41 2.147-2.41c1.2 0 2.167 1.09 2.147 2.41 0 1.329-.947 2.41-2.147 2.41Z' },
  { id: 'threads', name: 'Threads', url: 'https://www.threads.com/@amor_jan06',
    path: 'M12 1C5.7 1 2.5 5.1 2.5 12s3.2 11 9.5 11c5.5 0 9-3.2 9-7.7 0-3.6-2.6-6-6.8-6-3.8 0-6.2 1.6-6.2 4.3 0 2.3 1.8 3.9 4.3 3.9 3.6 0 5.2-2.6 5.2-6.3 0-4.4-2.2-6.9-6-6.9-2.5 0-4.5 1.1-5.7 3.2l1.9 1.1c.8-1.4 2-2.1 3.8-2.1 2.5 0 3.8 1.6 3.8 4.7 0 2.8-1 4.2-3 4.2-1.2 0-2.1-.7-2.1-1.8 0-1.3 1.5-2.1 4-2.1 3 0 4.6 1.5 4.6 3.8 0 3.3-2.5 5.5-6.8 5.5-4.9 0-7.3-3.2-7.3-8.8S7.1 3.2 12 3.2c3.1 0 5.3 1.3 6.5 3.8l2-1C18.9 2.7 16.1 1 12 1Z' },
];

export function initCommunity() {
  const dialog = document.getElementById('community-dialog');
  const list = document.getElementById('community-channels');
  let opener;
  list.replaceChildren();
  for (const channel of communityChannels) {
    const link = document.createElement(channel.url ? 'a' : 'button');
    link.className = `community-channel community-${channel.id}`;
    if (channel.url) {
      link.href = channel.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `${channel.name} — mở trong tab mới`);
    } else {
      link.type = 'button';
      link.disabled = true;
      link.title = 'Sắp ra mắt';
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', channel.path);
    svg.append(path);
    const label = document.createElement('span');
    label.textContent = channel.name;
    link.append(svg, label);
    list.append(link);
  }
  document.querySelectorAll('[data-open-community]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      const menu = document.getElementById('menu-panel');
      menu.hidden = true;
      const toggle = document.getElementById('menu-button');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Mở cài đặt');
      dialog.showModal();
    });
  });
  document.getElementById('close-community').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    (opener?.closest('#menu-panel') ? document.getElementById('menu-button') : opener)?.focus({ preventScroll: true });
  });
}
