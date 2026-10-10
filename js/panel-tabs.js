// Thanh tab dùng chung cho popup Tài sản và Mối quan hệ: mỗi thẻ .life-panel là một tab
// (data-icon, data-tab) kèm số mục, chỉ hiện thẻ đang chọn để popup không dài ra.
export function initPanelTabs(dialog, tabBar) {
  const panels = [...dialog.querySelectorAll(".life-panel")];
  let activePanel = panels[0].id;
  const span = (className, text) => {
    const element = document.createElement("span");
    element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const tabs = panels.map((panel) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "life-tab";
    tab.id = `${panel.id}-tab`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panel.id);
    const icon = span("life-tab-icon", panel.dataset.icon);
    icon.setAttribute("aria-hidden", "true");
    const count = span("life-tab-count");
    tab.append(icon, span("", panel.dataset.tab), count);
    tab.addEventListener("click", () => selectTab(panel.id));
    panel.setAttribute("role", "tabpanel");
    // Các module khác tự vẽ lại danh sách (mua, bán, vuốt ve...), nên đếm lại mỗi khi danh sách đổi.
    // Danh sách được đếm: phần tử có data-tab-count, mặc định là phần tử ngay sau tiêu đề.
    const list = panel.querySelector("[data-tab-count]") ?? panel.querySelector("h3").nextElementSibling;
    // Dòng gộp nhiều món (×N) ghi số món vào data-count.
    const recount = () => {
      const total = [...list.children].reduce((sum, row) => sum + (Number(row.dataset.count) || 1), 0);
      count.textContent = total || "";
      count.hidden = !total;
    };
    new MutationObserver(recount).observe(list, { childList: true });
    recount();
    tabBar.append(tab);
    return tab;
  });
  function selectTab(id = activePanel, focus = false) {
    activePanel = id;
    panels.forEach((panel, i) => {
      const selected = panel.id === id;
      panel.hidden = !selected;
      tabs[i].setAttribute("aria-selected", String(selected));
      tabs[i].tabIndex = selected ? 0 : -1;
      if (selected && focus) tabs[i].focus();
    });
  }
  tabBar.addEventListener("keydown", (event) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    const current = panels.findIndex((panel) => panel.id === activePanel);
    const next = event.key === "Home" ? 0 : event.key === "End" ? panels.length - 1
      : step ? (current + step + panels.length) % panels.length : null;
    if (next === null) return;
    event.preventDefault();
    selectTab(panels[next].id, true);
  });
  selectTab(activePanel);
  return selectTab;
}
