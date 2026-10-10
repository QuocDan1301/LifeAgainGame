import { getCareerProfile } from "./career-jobs.js";
import { getStudyBlockLabel } from "./study-blocks.js";
import { getSideJobTitle } from "./side-jobs.js";
import { getCareerAnnualSalary, getPlayerAnnualSalary, formatSalary } from "./career-salary.js";

const careerIcons = {
  acting: "🎬", military: "🪖", singing: "🎤", painting: "🎨", medicine: "🩺",
  programming: "💻", accounting: "🧾", law: "⚖️", teaching: "📚", football: "⚽",
  psychology: "🧠", esports: "🎮", tiktok: "📱", youtube: "▶️", business: "📈",
  finance: "🏦", mechanical: "⚙️", architecture: "🏗️", fashion: "👗",
  marketing: "📣", tourism: "🧳", culinary: "🍳",
};

export function getEducationStatus(player) {
  if (player.isAlive === false) return { text: "Đã qua đời", icon: "🕊️" };
  // Chưa có công việc chính thì hiện cửa hàng làm thêm đầu tiên.
  const sideJob = getSideJobTitle(player);
  if (sideJob && !(player.employmentStatus === "employed" && player.job)) return { text: sideJob, icon: "🏪" };
  if (player.employmentStatus === "unemployed" || player.job === "Thất nghiệp") {
    return { text: "Chưa có việc làm", icon: "🔎" };
  }
  if (player.job) {
    return { text: player.job.replace(/^\S+\s+(?=\p{L})/u, match =>
      /\p{Extended_Pictographic}/u.test(match) ? "" : match),
      icon: careerIcons[player.careerPath?.id] ?? "💼" };
  }
  const career = player.careerPath;
  if (career) {
    return { text: career.status || `Học ${career.field}`,
      icon: career.id === "military" || career.id === "esports"
        ? careerIcons[career.id] : "🎓" };
  }
  if (player.age < 3) return { text: "Chưa đi học", icon: "🧸" };
  if (player.age < 6) return { text: "Học mẫu giáo", icon: "🧩" };
  if (player.age < 11) return { text: "Học sinh tiểu học", icon: "🎒" };
  if (player.age < 15) return { text: "Học sinh THCS", icon: "📚" };
  if (player.age < 18) return { text: "Học sinh THPT", icon: "🏫" };
  return { text: "Chưa có việc làm", icon: "🔎" };
}

export function updateEducationHistory(state) {
  const { player } = state;
  if (!Array.isArray(state.educationHistory) || !state.educationHistory.length) {
    state.educationHistory = [
      [3, "🧩", "Bắt đầu học mẫu giáo"],
      [6, "🎒", "Bắt đầu học tiểu học"],
      [11, "📚", "Bắt đầu học THCS"],
      [15, "🏫", "Bắt đầu học THPT"],
    ].filter(([age]) => age <= player.age)
      .map(([age, icon, text]) => ({ age, icon, text }));
    // Bổ sung những mốc đã ghi trong nhật ký của bản lưu cũ.
    for (const log of state.logs ?? []) {
      if (!/(Chọn khối |Hành trình học tập của bạn bắt đầu|bắt đầu hành trình nhập ngũ|gia nhập .*Academy|bắt đầu làm việc tại|chính thức được đưa lên đội 1|bạn được nâng lên bậc|thất nghiệp|bắt đầu một năm học ở trường mới|một năm học đáng nhớ)/iu.test(log.content ?? "")) continue;
      state.educationHistory.push({ age: log.age, icon: "📖", text: log.summary || log.content });
    }
    state.educationHistory.sort((a, b) => a.age - b.age);
  }
  const status = getEducationStatus(player);
  const key = JSON.stringify([status.text, player.careerPath?.school?.id,
    player.studyBlock, player.lostChildSchoolYearDueAge]);
  const last = state.educationHistory.at(-1);
  if (last?.statusKey !== key && player.isAlive !== false) {
    const details = [player.careerPath?.school?.name,
      getStudyBlockLabel(player.studyBlock),
      player.lostChildSchoolYearDueAge === 11 ? "Bắt đầu một năm học miễn phí tại trường mới" : "",
    ].filter(Boolean);
    state.educationHistory.push({ age: player.age, icon: status.icon,
      text: [status.text, ...details].join(" · "), statusKey: key });
    return true;
  }
  return false;
}

export function initEducation(state, save) {
  const button = document.getElementById("education");
  const label = document.getElementById("education-status");
  const icon = document.getElementById("education-icon");
  const dialog = document.getElementById("education-dialog");
  const history = document.getElementById("education-history");
  // Đếm số dòng thật của chữ. Không dùng scrollHeight: nét chữ Sriracha cao hơn chiều cao
  // dòng nên luôn "tràn" vài px, khiến chữ bị thu nhỏ tới mức tối thiểu dù vẫn đủ chỗ.
  function lineCount() {
    const range = document.createRange();
    range.selectNodeContents(label);
    return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
  }
  function fitLabel() {
    label.style.fontSize = "";
    if (label.textContent === "Học vấn" || !label.clientWidth) return;
    const style = getComputedStyle(label);
    const maxHeight = parseFloat(style.maxHeight);
    const lineRatio = parseFloat(style.lineHeight) / parseFloat(style.fontSize);
    let size = parseFloat(style.fontSize);
    // Chênh lệch 1px có thể do trình duyệt làm tròn kích thước chữ.
    while (size > 10 && (label.scrollWidth > label.clientWidth + 1 || lineCount() * size * lineRatio > maxHeight + 0.5)) {
      size -= 0.5;
      label.style.fontSize = `${size}px`;
    }
  }
  const observer = new ResizeObserver(fitLabel);
  observer.observe(button);
  document.fonts?.ready.then(fitLabel);
  button.addEventListener("click", () => {
    if (document.querySelector("dialog[open]")) return;
    const salaryDetails = document.getElementById("career-salary-details");
    const salaryRanks = document.getElementById("career-salary-ranks");
    const annualSalary = getPlayerAnnualSalary(state.player);
    salaryDetails.hidden = !annualSalary;
    salaryRanks.replaceChildren();
    if (annualSalary) {
      document.getElementById("career-salary-current").textContent =
        `Hiện tại: ${formatSalary(annualSalary)}/năm. Lương được cộng vào ví khi nhận việc và mỗi năm tiếp theo.`;
      getCareerProfile(state.player.careerPath?.id).ranks.forEach((rank, index) => {
        const row = document.createElement("tr");
        const name = document.createElement("th");
        name.scope = "row";
        name.textContent = `${rank}${state.player.careerLevel === index + 1 ? " (hiện tại)" : ""}`;
        const amount = document.createElement("td");
        amount.textContent = formatSalary(getCareerAnnualSalary(state.player.careerPath?.id, index + 1));
        row.append(name, amount);
        salaryRanks.append(row);
      });
    }
    history.replaceChildren();
    for (const entry of state.educationHistory ?? []) {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = `${entry.icon} ${entry.age} tuổi`;
      const content = document.createElement("p");
      content.textContent = entry.text;
      item.append(title, content);
      history.append(item);
    }
    dialog.showModal();
  });
  document.getElementById("close-education").addEventListener("click", () => dialog.close());
  return function renderEducation() {
    if (updateEducationHistory(state)) save();
    const status = getEducationStatus(state.player);
    const showDefault = state.player.age <= 5 && state.player.isAlive !== false;
    const buttonText = showDefault ? "Học vấn" : status.text;
    label.textContent = buttonText;
    icon.textContent = showDefault ? "🎓" : status.icon;
    button.title = buttonText;
    button.setAttribute("aria-label", `${buttonText}. Xem nhật ký học tập và việc làm`);
    requestAnimationFrame(fitLabel);
  };
}
