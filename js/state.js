// Mỗi lần tạo nhân vật dùng một object mới, tránh mang dữ liệu đời trước sang.
export function createInitialState() {
  return {
    player: {
      name: "Dân",
      gender: "male",
      orientation: null,
      partner: null,
      relationshipHistory: [],
      province: "",
      age: 0,
      money: 0,
      health: 0,
      happiness: 0,
      intelligence: 0,
      appearance: 0,
      job: null,
      employmentStatus: null,
      careerLevel: 0,
      nextPromotionAge: 27,
      careerPath: null,
      studyBlock: null,
      fortune: null,
      isAlive: true,
      achievementFlags: {},
    },
    logs: [],
    pendingEvent: null,
  };
}
export const state = createInitialState();
