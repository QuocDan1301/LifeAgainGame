import { getRecordPenalty, isRehabilitated } from '../events/crime-consequences.js';
import { saveGame } from "../core/save-store.js";
import { getStudyAbroadCountry, getOverseasJobBlocker } from "../education/study-abroad.js";
import { formatMoney } from "../core/money-format.js";
import { careerPaths } from "./career-event.js";
import { createJobInterview, createInterviewResult, getCareerProfile, getEmploymentContext } from "./career-jobs.js";
import { hasCareerMilestone } from "./career-milestones.js";
import { getCareerAnnualSalary, completeCareerYear, RETIREMENT_AGE } from "./career-salary.js";
import { FOOTBALL_MIN_HEALTH, getJobHealthRule } from "../stats/health-rules.js";
import { getRehireLevel, startEmploymentRecord } from "./job-loss.js";
import { canChooseCareer } from "../education/study-blocks.js";
import { INTERVIEW, getInterviewChance, hasInterviewPrep, formatPercent, rollInterview } from "../stats/intellect-rules.js";

 
 
 
export const GRADUATION_AGE = 22;
 
const FIRST_PROMOTION_AGE = 27;
const PROMOTION_WAIT_YEARS = 2;

export function getJobApplicationBlocker(player) {
  if (player.isAlive === false) return "Nhân vật đã qua đời.";
  if (player.prison && player.prison.releaseAge > player.age) return "Bạn đang thụ án, chưa thể nộp hồ sơ xin việc.";
  if (player.careerPath?.id === "casual") return "Bạn không đi học tiếp. Vào Hoạt động → Làm thêm để nhận nghề tự do.";
  if (!player.careerPath) return "Bạn chưa chọn ngành học nên chưa có hồ sơ để nộp.";
  if (player.age < GRADUATION_AGE) {
    return `🎓 Học xong mới xin việc được. Còn ${GRADUATION_AGE - player.age} năm nữa (${GRADUATION_AGE} tuổi).`;
  }
  const overseasBlocker = getOverseasJobBlocker(player);
  if (overseasBlocker) return overseasBlocker;
  if (player.age >= RETIREMENT_AGE) return "🌅 Bạn đã đến tuổi nghỉ hưu.";
  if (player.employmentStatus === "employed") {
    return `💼 Bạn đang làm ${player.job}. Muốn xin việc lại, hãy nghỉ công việc chính trong Tài sản.`;
  }
  if (player.jobAppliedAtAge === player.age && !player.jobInterview) {
    return "📭 Năm nay bạn đã nộp hồ sơ. Sang năm hãy thử lại nhé!";
  }
   
  const health = getJobHealthRule(player);
  if (!health.allowed && !player.jobInterview) return health.message;
  return "";
}

 
export function createGraduationNotice(player, age) {
  if (age !== GRADUATION_AGE || !player.careerPath || player.careerPath.id === "casual" || player.employmentStatus === "employed" ||
      hasCareerMilestone(player)) return null;
  const country = getStudyAbroadCountry(player.careerPath);
  if (country) return { content: `🎓 Bạn đã hoàn thành chặng du học tại ${country.name}. Vào Hoạt động → Xin việc để nộp hồ sơ và phỏng vấn tại nước này.` };
  return {
    content: `🎓 Chặng học tập đã khép lại. Vào Hoạt động → 💼 Xin việc để nộp hồ sơ ngành ${player.careerPath.field} và phỏng vấn.`,
  };
}

export function initJobApplications(state, { renderMoney, renderLogEntry, renderEducation, checkAchievements }) {
  const $ = (id) => document.getElementById(id);
  const dialog = $("job-dialog");
  const body = $("job-body");

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const button = (className, text, onClick) => {
    const node = element("button", className, text);
    node.type = "button";
    node.addEventListener("click", onClick);
    return node;
  };
  const save = () => saveGame(state);
  const focusFirst = () => (body.querySelector(".job-answer, .shop-group:not(:disabled)")
    ?? body.querySelector("button:not(:disabled)"))?.focus({ preventScroll: true });
  const backToActivities = () => button("shop-back", "← Quay lại Hoạt động", () => {
    dialog.close();
    $("activities-dialog").showModal();
  });

  function renderList() {
    const player = state.player;
    const blocker = getJobApplicationBlocker(player);
    const studied = player.careerPath?.id;
     
    const country = getStudyAbroadCountry(player.careerPath);
    const switching = !country && Boolean(player.careerSwitchOpen) && Boolean(player.studyBlock);
    body.replaceChildren(backToActivities(),
      element("p", "side-job-intro", country
        ? `Bạn đã du học tại ${country.name}. Sau tốt nghiệp, bạn có thể nộp hồ sơ vào doanh nghiệp tại nước này. Trượt phỏng vấn hoặc mất việc thì có thể ứng tuyển lại trong những năm tiếp theo.`
        : player.abroadDestination === "return" && player.overseasEducation
        ? `Bạn đã về Việt Nam với bằng ${player.overseasEducation.program} từ ${player.overseasEducation.countryName}. Nộp hồ sơ vào ngành đã học để bắt đầu làm việc trong nước; khoản nợ du học còn lại vẫn được giữ trong ví.`
        : switching
        ? "Bạn đang đổi hướng nghề nghiệp: nộp được vào ngành đã học hoặc các ngành cùng khối học (bắt đầu ở bậc khởi điểm)."
        : "Chọn ngành để nộp hồ sơ. Chỉ nộp được vào ngành bạn đã học; đậu phỏng vấn là đi làm ngay, nhận lương năm đầu."));
    if (player.careerExperience?.careerId === studied && getRehireLevel(player, studied) > 1) {
      body.append(element("p", "side-job-intro", `💼 Kinh nghiệm cũ: ứng tuyển lại ngành này ở vị trí ${getCareerProfile(studied, player.careerPath).ranks[getRehireLevel(player, studied) - 1]}.`));
    }
    const recordPenalty = getRecordPenalty(player);
    if (recordPenalty || isRehabilitated(player)) body.append(element("p", "side-job-intro", recordPenalty
      ? `Tiền án làm giảm ${Math.round(recordPenalty * 100)} điểm % cơ hội phỏng vấn. Hoàn lương: giữ ít nhất ba năm không phạm pháp bên ngoài, hoàn thành chuỗi trở về để nhận thư giới thiệu. Tiến độ: ${player.reformedYears ?? 0}/3 năm.`
      : "Thư giới thiệu sau quá trình hoàn lương đã khôi phục cơ hội phỏng vấn; tiền án vẫn được lưu."));
    if (blocker) body.append(element("p", "license-age-note", blocker));
    if (player.age >= GRADUATION_AGE - 1 && player.isAlive !== false) {
      const prepared = hasInterviewPrep(player);
      const preview = getInterviewChance(player, "good", studied);
      const prep = button("shop-group job-prep", "🎤 Luyện phỏng vấn", () => {
        state.player.interviewPrepAge = state.player.age;
        save();
        renderList();
      });
      prep.disabled = prepared;
      prep.append(element("span", "side-job-note", prepared
        ? `Đã chuẩn bị: +${Math.round(INTERVIEW.prepBonus * 100)}% cho buổi phỏng vấn năm nay hoặc năm sau.`
        : `Miễn phí, mỗi năm một lần: +${Math.round(INTERVIEW.prepBonus * 100)}% khả năng đỗ. Trả lời tốt hiện có khoảng ${formatPercent(preview.chance)}.`));
      body.append(prep);
    }
    const list = element("div", "shop-groups");
     
    const ordered = [...careerPaths].sort(([a], [b]) => (b === studied) - (a === studied));
    for (const [id, icon, field] of ordered) {
      if (country && id !== studied) continue;
      const own = id === studied;
      const open = own || (switching && id !== "study-abroad" && canChooseCareer(id, player.studyBlock));
      const choice = button("shop-group job-career", country && own ? `${country.icon} Xin việc tại ${country.name}` : `${icon} ${field}`, () => startInterview(id));
      choice.dataset.career = id;
      choice.disabled = !open || Boolean(blocker);
      choice.append(element("span", "side-job-note", !own && open
        ? `Đổi hướng · cùng khối học · Lương khởi điểm ${formatMoney(getCareerAnnualSalary(id, 1, own ? player.careerPath : null))}/năm`
        : own
        ? `Ngành bạn đã học · ${getEmploymentContext(id, own ? player.careerPath : null).round} · Lương khởi điểm ${formatMoney(getCareerAnnualSalary(id, 1, own ? player.careerPath : null))}/năm${id === "football" ? ` · Cần Sức khỏe từ ${FOOTBALL_MIN_HEALTH}%` : ""}`
        : `Cần bằng ngành ${field}`));
      list.append(choice);
    }
    body.append(list);
  }

  const targetPath = (player, careerId) => {
    if (!careerId || careerId === player.careerPath?.id) return player.careerPath;
    const [, , field] = careerPaths.find(([id]) => id === careerId);
    return { id: careerId, field, school: null, status: `Chuyển sang ${field}`, switchedFrom: player.careerPath?.id };
  };
   
  function startInterview(careerId) {
    const player = state.player;
    if (getJobApplicationBlocker(player)) return renderList();
    if (getStudyAbroadCountry(player.careerPath) && careerId && careerId !== player.careerPath.id) return renderList();
    if (player.jobInterview?.age !== player.age) {
      if (careerId === "study-abroad" && player.careerPath?.id !== careerId) return renderList();
      const target = targetPath(player, careerId);
      const { id, title, text, choices } = createJobInterview({ ...player, careerPath: target });
      player.jobInterview = { age: player.age, id, title, text, careerId: target.id,
        choices: choices.map(({ label, correct, quality }) => ({ label, correct, quality })) };
      player.jobAppliedAtAge = player.age;
      save();
    }
    renderInterview();
    focusFirst();
  }

  function renderInterview() {
    const interview = state.player.jobInterview;
    const card = element("section", "dialog-card job-interview");
    card.append(element("h3", "", interview.title), element("p", "side-job-intro", interview.text));
    const answers = element("div", "shop-groups");
    interview.choices.forEach((choice, index) => {
      answers.append(button("shop-group job-answer", choice.label, () => answer(index)));
    });
    card.append(answers);
    body.replaceChildren(card);
  }

  function answer(index) {
    const player = state.player;
    const interview = player.jobInterview;
    const choice = interview?.choices[index];
    if (!choice || interview.age !== player.age) return;
    const target = targetPath(player, interview.careerId);
    const applicant = { ...player, careerPath: target };
     
    const assessment = rollInterview(applicant, choice.quality ?? (choice.correct === true ? "good" : "weak"), Math.random, target.id);
    const result = createInterviewResult(applicant, assessment.passed, player.age, assessment);
    const passed = result.updates.employmentStatus === "employed";
    const { age: _age, ...updates } = result.updates;
    let rehireNote = "";
    if (passed) {
      updates.nextPromotionAge = Math.max(FIRST_PROMOTION_AGE, player.age + PROMOTION_WAIT_YEARS);
       
      const level = getRehireLevel(player, target.id);
      if (level > 1) {
        updates.careerLevel = level;
        updates.job = getCareerProfile(target.id, target).ranks[level - 1];
        rehireNote = `\n💼 Nhờ kinh nghiệm trước đây, bạn vào thẳng vị trí ${updates.job}.`;
      }
      if (target !== player.careerPath) updates.careerPath = target;
      updates.careerSwitchOpen = null;
    }
     
    const salary = completeCareerYear(player, player.age, updates);
    startEmploymentRecord(player, player.age);
    delete player.jobInterview;
    result.content += rehireNote;
    result.logContent += rehireNote;
    const log = {
      age: player.age,
      content: `${result.logContent}${salary ? `\n${salary.content}` : ""}`,
      summary: `${result.logSummary}${salary ? `\n${salary.content}` : ""}`,
    };
    state.logs.push(log);
    save();
    renderMoney();
    renderEducation();
    renderLogEntry(log);
    checkAchievements();
    renderResult(result, salary, passed);
  }

  function renderResult(result, salary, passed) {
    const card = element("section", `dialog-card game-result ${passed ? "is-win" : "is-lose"}`);
    card.append(element("h3", "", result.title), element("p", "side-job-intro", result.content));
    if (salary) card.append(element("p", "side-job-intro", salary.content));
    const nodes = [card];
    if (!passed) {
      const next = element("div", "shop-groups");
      next.append(
        button("shop-group job-next", "📚 Học bổ sung (Phát triển bản thân → Trí tuệ)", () => {
          dialog.close();
          document.getElementById("activity-self-development").click();
          document.querySelector('#self-development-body .shop-group[data-stat="intelligence"]')?.click();
        }),
        button("shop-group job-next", "🎤 Luyện phỏng vấn cho lần sau (+10%)", () => {
          state.player.interviewPrepAge = state.player.age;
          save();
          dialog.close();
        }),
        button("shop-group job-next", getStudyAbroadCountry(state.player.careerPath) ? "📄 Xem lại hồ sơ xin việc tại nước du học" : "🧭 Tìm công việc phù hợp hơn (ngành cùng khối học)", () => {
          state.player.careerSwitchOpen = true;
          save();
          renderList();
        }),
      );
      nodes.push(next);
    }
    body.replaceChildren(...nodes, button("shop-buy game-primary", result.confirmText, () => dialog.close()));
    focusFirst();
  }

  $("activity-jobs").addEventListener("click", () => {
    if (state.player.isAlive === false) return;
    $("activities-dialog").close();
    if (state.player.jobInterview?.age === state.player.age) renderInterview();
    else renderList();
    dialog.showModal();
    focusFirst();
  });
  $("close-job").addEventListener("click", () => dialog.close());
}
