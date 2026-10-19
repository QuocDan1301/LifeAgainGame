import assert from 'node:assert/strict';
import { createChildConversation, rememberChildConversation, CHILD_MEMORY_LIMIT } from '../js/relationships/child-conversations.js';
import { getChildActions, interactWithChild } from '../js/relationships/child-interactions.js';

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log(`PASS ${name}`); };
// Child of a given age when the parent is `age`.
// Children in the topic tests already have a recorded dream seed, so seed scenes do not interrupt them.
const kid = (childAge, age, extra = {}) => ({ id: `c${childAge}`, name: 'Phạm Gia Bảo', initialAge: 0, joinedAtAge: age - childAge, relationship: 70,
  dreamSeed: { id: 'music', interest: 'quiet', age: 1 }, ...extra });
const parent = (age, children, extra = {}) => ({ age, gender: 'male', money: 10_000_000, happiness: 50, health: 80,
  employmentStatus: 'employed', children, ...extra });
const talk = (player, child, pickChoice = scene => scene.choices[0]) => {
  const scene = createChildConversation(player, child);
  const choice = pickChoice(scene);
  const log = interactWithChild(player, child.id, 'talk', { sceneId: scene.id, age: scene.age, choiceId: choice.id });
  return { scene, choice, log, child: player.children.find(entry => entry.id === child.id) };
};

test('Con dưới 3 tuổi vẫn ôm ấp như cũ, từ 3 tuổi mới trò chuyện', () => {
  const baby = kid(2, 30);
  const player = parent(30, [baby]);
  assert.equal(createChildConversation(player, baby), null);
  assert.equal(getChildActions(player, baby).talk.conversation, false);
  assert.ok(interactWithChild(player, baby.id, 'talk'), 'ôm ấp không cần hộp thoại');
  assert.equal(getChildActions(parent(30, [kid(3, 30)]), kid(3, 30)).talk.conversation, true);
});

test('Chủ đề theo tuổi con và hoàn cảnh', () => {
  const topics = (childAge, age, extra = {}, childExtra = {}) => {
    const child = kid(childAge, age, childExtra);
    return createChildConversation(parent(age, [child], extra), child).topic;
  };
  assert.ok(['moon', 'nap', 'ants'].includes(topics(4, 30)));
  assert.ok(['friend', 'test'].includes(topics(8, 35)));
  assert.ok(['belong', 'drawing'].includes(topics(15, 45)));
  assert.ok(['leaving', 'first-job'].includes(topics(21, 50)));
  assert.ok(['adult-life', 'old-photo', 'decision'].includes(topics(35, 60)));
  assert.equal(topics(45, 75), 'care', 'cha mẹ đã già thì con lo cho mình');
  assert.equal(topics(30, 55, { money: -5_000_000 }), 'hard-times');
  assert.equal(topics(9, 40, {}, { relationship: 30 }), 'rebuilding');
  assert.equal(topics(9, 40, { prison: { releaseAge: 43 } }), 'prison-visit');
  assert.equal(topics(9, 40, {}, { adopted: true }), 'origin', 'con nuôi hỏi về nơi ở trước đây');
});

test('Xưng hô theo giới tính người chơi', () => {
  const child = kid(8, 35);
  assert.ok(/bố/iu.test(JSON.stringify(createChildConversation(parent(35, [child]), child))));
  const mother = createChildConversation(parent(35, [child], { gender: 'female' }), child);
  assert.ok(/mẹ/iu.test(JSON.stringify(mother)) && !/(^|[^\p{L}])[bB]ố([^\p{L}]|$)/u.test(JSON.stringify(mother)));
});

test('Câu trả lời đổi gắn kết, lưu kỷ niệm, mỗi năm một lần', () => {
  const child = kid(10, 38);
  const player = parent(38, [child]);
  const warm = talk(player, child, scene => scene.choices.reduce((best, choice) => choice.bond > best.bond ? choice : best));
  assert.equal(warm.child.relationship, Math.min(100, 70 + 4 + warm.choice.bond));
  assert.ok(warm.log.content.includes(warm.choice.reply));
  assert.equal(warm.child.conversationMemories.length, 1);
  assert.ok(warm.child.memories.at(-1).text.includes(warm.choice.memory));
  assert.equal(interactWithChild(player, child.id, 'talk', { sceneId: warm.scene.id, age: 38, choiceId: warm.choice.id }), null, 'không trò chuyện hai lần trong năm');
  const harsh = parent(38, [kid(10, 38, { id: 'h' })]);
  const cold = talk(harsh, harsh.children[0], scene => scene.choices.reduce((low, choice) => choice.bond < low.bond ? choice : low));
  assert.ok(cold.child.relationship <= 74 && cold.child.relationship < warm.child.relationship, 'đáp lạnh nhạt thì gắn kết tăng ít hoặc giảm');
});

test('Con nhớ chuyện cũ và hỏi tiếp năm sau', () => {
  const child = kid(8, 35);
  const player = parent(35, [child]);
  const first = talk(player, child, scene => scene.choices.find(choice => choice.followUp) ?? scene.choices[0]);
  assert.ok(first.choice.followUp);
  player.age = 36;
  const next = createChildConversation(player, player.children[0]);
  assert.equal(next.topic, `follow-up-${first.choice.followUp}`);
  assert.ok(next.recall.includes('35 tuổi'));
});

test('Lời nặng sẽ để lại khoảng cách cần hàn gắn', () => {
  const child = kid(14, 44);
  const player = parent(44, [child]);
  const snap = talk(player, child, scene => scene.choices.find(choice => choice.followUp === 'distance'));
  assert.ok(snap.choice.bond < 0);
  player.age = 45;
  const repair = createChildConversation(player, player.children[0]);
  assert.equal(repair.topic, 'follow-up-distance');
  assert.ok(repair.choices.some(choice => choice.id === 'sorry' && choice.bond > 0));
});

test('Câu hỏi của con nuôi quay lại nếu chưa được kể thật', () => {
  const child = kid(8, 40, { adopted: true });
  const player = parent(40, [child]);
  talk(player, child, scene => scene.choices.find(choice => choice.id === 'later'));
  for (const age of [41, 42]) { player.age = age; assert.notEqual(createChildConversation(player, player.children[0]).topic, 'origin'); }
  player.age = 43;
  const again = createChildConversation(player, player.children[0]);
  assert.equal(again.topic, 'origin');
  talk(player, player.children[0], scene => scene.choices.find(choice => choice.id === 'truth'));
  player.age = 50;
  assert.notEqual(createChildConversation(player, player.children[0]).topic, 'origin', 'đã kể thật thì không hỏi lại');
});

test('Lưu/tải, câu trả lời giả, con đã mất và giới hạn kỷ niệm', () => {
  const child = kid(12, 40);
  const player = parent(40, [child]);
  const scene = createChildConversation(player, child);
  const reloaded = JSON.parse(JSON.stringify(player));
  assert.equal(createChildConversation(reloaded, reloaded.children[0]).id, scene.id, 'tải lại vẫn cùng câu chuyện');
  assert.equal(interactWithChild(player, child.id, 'talk', { sceneId: 'khac', age: 40, choiceId: scene.choices[0].id }), null);
  assert.equal(interactWithChild(player, child.id, 'talk', { sceneId: scene.id, age: 39, choiceId: scene.choices[0].id }), null);
  assert.equal(interactWithChild(player, child.id, 'talk', { sceneId: scene.id, age: 40, choiceId: 'khong-co' }), null);
  assert.equal(player.children[0].relationship, 70, 'câu trả lời không hợp lệ không đổi gì');
  assert.equal(createChildConversation(player, { ...child, alive: false }), null);
  const many = { ...child, conversationMemories: Array.from({ length: 20 }, (_, i) => ({ id: String(i), age: 20 + i, topic: 'x', memory: 'Tôi nhớ.' })) };
  assert.equal(rememberChildConversation(many, createChildConversation(parent(40, [many]), many), scene.choices[0].id).memories.length, CHILD_MEMORY_LIMIT);
});

test('Mọi nhánh đều có 3 lựa chọn khác nhau và lời kể hợp lệ', () => {
  const seen = new Set();
  for (const gender of ['male', 'female'])
    for (const childAge of [3, 4, 5, 7, 8, 10, 13, 14, 16, 19, 20, 23, 30, 31, 32, 45])
      for (const extra of [{}, { money: -1 }, { age: 80 }, { prison: { releaseAge: 999 } }])
        for (const childExtra of [{}, { relationship: 20 }, { adopted: true }])
          for (const followUp of [null, 'worry', 'dream', 'distance']) {
            const age = extra.age ?? (childAge >= 26 ? 25 : 40) + childAge;
            const child = kid(childAge, age, { ...childExtra, ...(followUp ? { conversationMemories: [{ id: 'm', age: age - 1, topic: 'x', memory: 'Tôi kể.', followUp }] } : {}) });
            const scene = createChildConversation(parent(age, [child], { ...extra, gender }), child);
            seen.add(scene.topic);
            assert.equal(scene.choices.length, 3);
            assert.equal(new Set(scene.choices.map(choice => choice.id)).size, 3);
            for (const value of [scene.title, scene.greeting, scene.prompt, ...scene.choices.flatMap(choice => [choice.label, choice.reply, choice.memory])])
              assert.ok(value && !/undefined|null|!|\{|\}/u.test(value), `${scene.topic}: "${value}"`);
          }
  assert.ok(seen.size >= 20, `đã gặp ${seen.size} chủ đề`);
});

test('Mầm ước mơ riêng của từng đứa con: tự bộc lộ, bố mẹ chỉ đổi mức độ, ghi một lần', () => {
  const seeds = new Map();
  for (const id of ['a', 'bb', 'ccc', 'dddd', 'eeeee', 'ffffff']) {
    for (let parentAge = 30; parentAge < 60; parentAge++) {
      const child = { id, name: 'Phạm Minh Anh', initialAge: 0, joinedAtAge: 28, relationship: 70 };
      const player = parent(parentAge, [child]);
      const scene = createChildConversation(player, child);
      if (!scene?.topic.startsWith('seed-')) continue;
      const kidAge = parentAge - 28;
      assert.ok(kidAge >= 6 && kidAge < 18, 'chỉ gợi mầm khi con 6–17 tuổi');
      assert.ok(scene.choices.every(choice => choice.dreamSeed?.id === scene.topic.slice(5)), 'mọi cách đáp đều giữ mong muốn của con');
      const cold = scene.choices.reduce((low, choice) => choice.bond < low.bond ? choice : low);
      const result = talk(player, child, () => cold);
      const stored = result.child.dreamSeed;
      assert.ok(stored && stored.id === cold.dreamSeed.id && stored.age === kidAge, 'ghi mầm kể cả khi bố mẹ chưa ủng hộ');
      seeds.set(id, stored.id);
      player.age += 1;
      const again = createChildConversation(player, result.child);
      assert.ok(!again.topic.startsWith('seed-'), 'không gợi mầm lần hai');
      break;
    }
  }
  assert.ok(seeds.size >= 4, `gặp mầm ở ${seeds.size} đứa con`);
  assert.ok(new Set(seeds.values()).size >= 2, 'mỗi đứa con có mầm riêng, không dùng chung');
});

console.log(`${passed} nhóm kiểm tra trò chuyện với con đều qua.`);
