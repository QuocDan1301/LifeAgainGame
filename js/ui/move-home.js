import { createTransferPackage, hasSaveData, HOME_URL, isOldHome, uploadTransferPackage } from "../core/transfer.js";

// Bản cũ trên GitHub Pages: mời người chơi sang nhà mới trên Render. Dữ liệu trình duyệt gắn với từng
// địa chỉ trang, nên gửi kèm bằng mã chuyển; nhà mới nhận mã qua ?nhan= và tự mở bước xác nhận.
export function initMoveHome() {
  if (!isOldHome()) return;
  const banner = document.getElementById("move-home");
  const button = document.getElementById("move-home-button");
  const status = document.getElementById("move-home-status");
  banner.hidden = false;
  // Không mời cài bản cũ vào máy.
  document.getElementById("install-link").hidden = true;
  button.addEventListener("click", async () => {
    if (!hasSaveData()) {
      location.href = HOME_URL;
      return;
    }
    button.disabled = true;
    status.classList.remove("is-error");
    status.textContent = "Đang gửi dữ liệu sang nhà mới. Lần đầu máy chủ có thể mất tới một phút để khởi động…";
    try {
      const { code } = await uploadTransferPackage(createTransferPackage());
      location.href = `${HOME_URL}?nhan=${code}`;
    } catch (error) {
      status.textContent = error.message;
      status.classList.add("is-error");
      button.disabled = false;
    }
  });
}
