import {
  applyTransferPackage,
  backupFileName,
  claimTransferPackage,
  createTransferPackage,
  describeTransferPackage,
  hasSaveData,
  parseTransferPackage,
  uploadTransferPackage,
} from "../core/transfer.js";

// Popup Chuyển thiết bị ở bến xe: tab Gửi đi (tạo mã, lưu tệp) và tab Nhận về (nhập mã, mở tệp).
export function initTransfer() {
  const get = id => document.getElementById(id);
  const dialog = get("transfer-dialog");
  const tabs = [get("transfer-tab-send"), get("transfer-tab-receive")];
  const sendStatus = get("transfer-send-status");
  const receiveStatus = get("transfer-receive-status");
  const confirmBox = get("transfer-confirm");
  let pending = null;
  let busy = false;

  function selectTab(tab) {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      get(item.getAttribute("aria-controls")).hidden = !selected;
    }
  }
  function reset() {
    pending = null;
    confirmBox.hidden = true;
    get("transfer-claim-form").hidden = false;
    get("transfer-file-choice").hidden = false;
    get("transfer-code-box").hidden = true;
    sendStatus.textContent = receiveStatus.textContent = "";
    get("transfer-code-input").value = "";
  }
  async function run(button, status, task) {
    if (busy) return;
    busy = true;
    button.disabled = true;
    status.textContent = "";
    status.classList.remove("is-error");
    try {
      await task();
    } catch (error) {
      status.textContent = error.message;
      status.classList.add("is-error");
    } finally {
      busy = false;
      button.disabled = false;
    }
  }
  function showConfirm(pack, sourceNote) {
    pending = pack;
    get("transfer-summary").textContent = describeTransferPackage(pack);
    get("transfer-overwrite-note").hidden = !hasSaveData();
    get("transfer-source-note").textContent = sourceNote;
    get("transfer-claim-form").hidden = true;
    get("transfer-file-choice").hidden = true;
    confirmBox.hidden = false;
    get("transfer-apply").focus();
  }

  get("open-transfer").addEventListener("click", () => {
    reset();
    selectTab(tabs[0]);
    dialog.showModal();
  });
  get("close-transfer").addEventListener("click", () => dialog.close());
  for (const tab of tabs) tab.addEventListener("click", () => selectTab(tab));
  get("transfer-tabs").addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const next = tabs[(tabs.indexOf(document.activeElement) + 1) % tabs.length];
    selectTab(next);
    next.focus();
  });

  get("transfer-create").addEventListener("click", event => run(event.currentTarget, sendStatus, async () => {
    if (!hasSaveData()) throw new Error("Máy này chưa có dữ liệu game để gửi.");
    const { code, expiresIn } = await uploadTransferPackage(createTransferPackage());
    const expires = new Date(Date.now() + expiresIn * 1000);
    get("transfer-code").textContent = code;
    get("transfer-expiry").textContent = `Dùng được một lần, hết hạn lúc ${expires.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}.`;
    get("transfer-code-box").hidden = false;
  }));

  get("transfer-download").addEventListener("click", event => run(event.currentTarget, sendStatus, async () => {
    if (!hasSaveData()) throw new Error("Máy này chưa có dữ liệu game để lưu.");
    const file = new File([JSON.stringify(createTransferPackage())], backupFileName(), { type: "application/json" });
    // App đã cài trên iPhone không tải tệp trực tiếp được: dùng bảng chia sẻ để lưu vào Tệp.
    if (navigator.standalone && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Sao lưu Life Again" });
      } catch (error) {
        if (error.name === "AbortError") return;
        throw error;
      }
    } else {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = file.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 10000);
    }
    sendStatus.textContent = `Đã tạo tệp ${file.name}. Gửi tệp này sang máy mới rồi chọn Nhận về → Mở tệp sao lưu.`;
  }));

  get("transfer-claim-form").addEventListener("submit", event => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type=submit]");
    run(button, receiveStatus, async () => {
      const code = get("transfer-code-input").value.trim();
      if (!code) throw new Error("Hãy nhập mã 6 ký tự hiện trên máy cũ.");
      showConfirm(await claimTransferPackage(code), "Mã này đã được dùng. Nếu hủy, hãy tạo mã mới trên máy cũ.");
    });
  });

  get("transfer-file").addEventListener("change", event => {
    const input = event.currentTarget;
    const [file] = input.files;
    input.value = "";
    if (!file) return;
    run(get("transfer-file-label"), receiveStatus, async () => {
      if (file.size > 8 * 1024 * 1024) throw new Error("Tệp quá lớn, không phải tệp sao lưu của Life Again.");
      showConfirm(parseTransferPackage(await file.text()), "");
    });
  });

  get("transfer-cancel").addEventListener("click", () => {
    const note = get("transfer-source-note").textContent;
    reset();
    receiveStatus.textContent = note ? "Đã hủy. " + note : "Đã hủy, dữ liệu trên máy này không thay đổi.";
  });

  get("transfer-apply").addEventListener("click", event => run(event.currentTarget, receiveStatus, async () => {
    if (!pending) return;
    await applyTransferPackage(pending);
    receiveStatus.textContent = "Đã nhận dữ liệu. Đang mở lại game…";
    location.reload();
  }));
}
