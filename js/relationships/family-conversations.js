 
export const FAMILY_MEMORY_LIMIT = 12;
const answer = (id, label, reply, memory, bond = 0, happiness = 0, followUp = null) =>
  ({ id, label, reply, memory, bond, happiness, followUp });

export function createFamilyConversation(player, relative, action) {
  if (!relative?.alive || player.isAlive === false || !['call', 'visit'].includes(action)) return null;
  const age = player.age ?? 0;
  const who = relative.role.toLowerCase();
  const memories = Array.isArray(relative.conversationMemories) ? relative.conversationMemories : [];
  const last = memories.at(-1);
  const greeting = action === 'visit'
    ? age < 18 ? `Bạn ngồi xuống bên ${who} sau bữa cơm.` : `Bạn về thăm nhà. ${relative.role} dọn thêm một chỗ ngồi bên mâm cơm.`
    : age < 18 ? `Bạn tìm ${who} để trò chuyện.` : `Đầu dây bên kia vang lên giọng ${who}.`;
  let topic, title, prompt, choices;
   
  if (last?.followUp) {
    topic = `follow-up-${last.followUp}`;
    title = 'Chuyện lần trước';
    if (last.followUp === 'worry') {
      prompt = `“Lần trước con bảo đang có chuyện khó nghĩ. Dạo này đã đỡ hơn chưa?” ${relative.role} vẫn nhớ lời bạn kể.`;
      choices = [
        answer('better', 'Kể điều đã khá hơn', `“Nghe vậy ${who} cũng nhẹ lòng. Có gì cứ kể, không cần đợi mọi chuyện hoàn hảo đâu.”`, 'Tôi kể điều đã khá hơn sau lần chia sẻ nỗi lo.', 2, 1),
        answer('listen', 'Nói rằng vẫn khó, chỉ muốn được lắng nghe', `${relative.role} không vội khuyên: “Ừ, ${who} nghe đây.” Cuộc nói chuyện chậm lại, nhưng gần gũi hơn.`, 'Tôi được lắng nghe mà không phải tỏ ra mình đã ổn.', 2, 1),
        answer('boundary', 'Cảm ơn và xin được tự thu xếp', `“Được, ${who} không hỏi dồn. Khi nào muốn nói thì cứ nói nhé.”`, 'Tôi cảm ơn sự quan tâm và nói rõ mình cần chút không gian.', 1),
      ];
    } else if (last.followUp === 'distance') {
      prompt = `“Lần trước mình nói chuyện chưa được bao nhiêu. Hôm nay con có muốn ngồi lại một chút không?” Giọng ${who} có phần dè dặt.`;
      choices = [
        answer('reconnect', 'Xin lỗi vì lần trước đã gắt gỏng', `${relative.role} thở nhẹ: “${who} không cần con lúc nào cũng vui. Chỉ mong mình đừng làm đau nhau khi đang mệt.”`, 'Tôi xin lỗi và nối lại cuộc trò chuyện còn dang dở.', 3, 1),
        answer('explain', 'Giải thích vì sao mình ít nói', `“Hóa ra là vậy. ${who} cứ tưởng con không muốn nói chuyện với nhà nữa.” Sự hiểu lầm vơi đi.`, 'Tôi giải thích sự im lặng của mình để người thân bớt hiểu lầm.', 2),
        answer('quiet', 'Xin ngồi cạnh nhau, chưa cần nói nhiều', `${relative.role} gật đầu. Hai người ở bên nhau một lúc, không ai ép người kia phải tìm lời.`, 'Chúng tôi ở cạnh nhau dù chưa sẵn sàng kể hết mọi chuyện.', 1, 1),
      ];
    } else {
      prompt = `“Cái dự định con kể lần trước ấy, con còn muốn theo đuổi không?” ${relative.role} hỏi, không quên điều từng khiến bạn hào hứng.`;
      choices = [
        answer('progress', 'Kể về bước nhỏ mình đã làm', `“Chậm một chút cũng được. ${who} vui vì con đang tự tìm đường cho mình.”`, 'Tôi chia sẻ một bước tiến trong dự định từng kể với gia đình.', 2, 1),
        answer('change', 'Thú nhận mình đã đổi ý', `“Đổi hướng không có nghĩa là thất bại. Con đã nghĩ kỹ là được.”`, 'Tôi được nói thật rằng dự định của mình đã thay đổi.', 1, 1),
        answer('unsure', 'Nhờ cùng suy nghĩ, chưa quyết định vội', `${relative.role} kể cả những lần mình chọn sai. Cuộc nói chuyện không cho bạn đáp án sẵn, nhưng có thêm một góc nhìn.`, 'Chúng tôi cùng cân nhắc một quyết định còn bỏ ngỏ.', 2),
      ];
    }
  } else if (age < 6) {
    topic = 'little-day'; title = 'Một ngày bé xíu';
    prompt = `${relative.role} cúi xuống hỏi: “Hôm nay con có chuyện gì vui muốn kể không?”`;
    choices = [
      answer('play', 'Rủ cùng chơi một trò', `${relative.role} gác việc đang làm, ngồi xuống chơi cùng bạn. Tiếng cười làm căn nhà rộn lên.`, 'Chúng tôi cùng chơi một trò và cười rất lâu.', 2, 1),
      answer('story', 'Xin nghe một câu chuyện', `Câu chuyện ${who} kể có chỗ quên, chỗ tự bịa thêm. Bạn vẫn muốn nghe tiếp.`, 'Tôi nghe người thân kể một câu chuyện.', 1, 1),
      answer('hug', 'Lại gần và ôm một cái', `${relative.role} ôm bạn vào lòng: “Không có gì để kể cũng được mà.”`, 'Tôi được ôm dù chẳng có chuyện gì đặc biệt.', 2),
    ];
  } else if (age < 18) {
    topic = age < 12 ? 'school-day' : 'growing-up'; title = age < 12 ? 'Chuyện ở trường' : 'Điều mình muốn trở thành';
    prompt = age < 12 ? `“Ở lớp có vui không? Có điều gì làm con buồn không?” ${relative.role} hỏi trong lúc xếp lại đồ trên bàn.`
      : `“Sau này con muốn làm gì?” Bạn nhận ra ${who} đang chờ một câu trả lời, nhưng chính mình cũng chưa chắc.`;
    choices = [
      answer('share', age < 12 ? 'Kể cả chuyện vui lẫn chuyện khó ở lớp' : 'Kể điều mình muốn thử, dù chưa chắc chắn', `“${who} có thể chưa hiểu hết, nhưng muốn nghe con kể.” Bạn có thêm một người biết điều mình đang nghĩ.`, age < 12 ? 'Tôi kể chuyện ở lớp mà không chỉ nói về điểm số.' : 'Tôi chia sẻ ước muốn của mình, dù chưa có kế hoạch hoàn hảo.', 2, 1, age < 12 ? 'worry' : 'dream'),
      answer('ask', 'Hỏi hồi bằng tuổi mình thì bố mẹ ra sao', `${relative.role} bật cười rồi kể một chuyện vụng về thời đi học. Hóa ra người lớn cũng từng bối rối như bạn.`, 'Tôi biết thêm một chuyện thời trẻ của người thân.', 1, 1),
      answer('space', 'Nói rằng mình cần thêm thời gian để trả lời', `“Ừ, không cần trả lời ngay hôm nay. Khi nào muốn kể thì ${who} vẫn nghe.”`, 'Tôi nói rõ mình chưa sẵn sàng và được cho thêm thời gian.', 1),
    ];
  } else if ((relative.bond ?? 70) < 40) {
    topic = 'rebuilding'; title = 'Khoảng cách giữa hai người';
    prompt = `Cuộc trò chuyện có nhiều quãng lặng. ${relative.role} hỏi: “Có phải lâu rồi nhà mình chỉ hỏi nhau vài câu cho xong?”`;
    choices = [
      answer('honest', 'Nói thật điều khiến mình khó gần gũi', `${relative.role} lắng nghe, đôi lúc còn chưa đồng ý. Nhưng lần này, hai người không kết thúc bằng việc quay đi.`, 'Chúng tôi bắt đầu nói về điều đã khiến mình xa cách.', 3, 0, 'worry'),
      answer('small', 'Bắt đầu bằng một chuyện nhỏ trong ngày', `Câu chuyện rất bình thường. Dù chưa giải quyết hết khúc mắc, cả hai đã nói với nhau nhiều hơn một chút.`, 'Chúng tôi tìm lại một cuộc trò chuyện bình thường.', 1, 1),
      answer('not-now', 'Nói mình chưa sẵn sàng, mong đừng thúc ép', `“${who} hiểu. Chỉ mong con biết là nhà vẫn muốn nghe con.”`, 'Tôi nói rõ giới hạn của mình thay vì im lặng bỏ đi.', 0),
    ];
  } else if (relative.condition === 'weak' || relative.condition === 'severe') {
    topic = 'health'; title = 'Không chỉ hỏi về bệnh';
    prompt = `“Ai cũng hỏi ${who} đã uống thuốc chưa. Con kể chuyện của con một chút đi.” ${relative.role} muốn có một cuộc trò chuyện bình thường.`;
    choices = [
      answer('ordinary', 'Kể một chuyện vui nhỏ trong ngày', `${relative.role} mỉm cười, hỏi thêm vài chi tiết. Một lúc, cuộc nói chuyện không còn chỉ xoay quanh bệnh tình.`, 'Tôi kể chuyện thường ngày để người thân có một lúc nhẹ lòng.', 2, 1),
      answer('listen', 'Hỏi ngoài sức khỏe thì điều gì đang làm bố mẹ lo', `“${who} sợ làm phiền các con.” Bạn ngồi nghe hết câu, không vội gạt đi nỗi sợ ấy.`, 'Người thân nói với tôi về nỗi lo trở thành gánh nặng.', 2, 0, 'worry'),
      answer('memory', 'Gợi lại một kỷ niệm vui của hai người', `${relative.role} sửa ngay một chi tiết bạn nhớ nhầm. Hai người cùng cười vì vẫn còn nhớ câu chuyện ấy.`, 'Chúng tôi cùng kể lại một kỷ niệm vui giữa những ngày mệt mỏi.', 1, 1),
    ];
  } else if ((player.money ?? 0) < 0 || player.employmentStatus === 'unemployed' || player.employmentStatus === 'declined') {
    topic = 'hard-times'; title = 'Khi mọi chuyện chưa ổn';
    prompt = `“Dạo này con có đang phải lo nghĩ nhiều không?” ${relative.role} không hỏi bạn kiếm được bao nhiêu, chỉ chờ bạn trả lời.`;
    choices = [
      answer('honest', 'Kể thật về khó khăn, không xin tiền', `“${who} không giải quyết hết được, nhưng con không cần phải giấu vì sợ nhà thất vọng.”`, 'Tôi nói thật về khó khăn thay vì cố tỏ ra thành công.', 2, 1, 'worry'),
      answer('plan', 'Kể một việc nhỏ mình định làm để xoay xở', `${relative.role} nghe hết kế hoạch rồi nhắc: “Nhớ ăn ngủ cho đàng hoàng nữa nhé.”`, 'Tôi kể cách mình muốn từng bước vượt qua khó khăn.', 1, 1, 'dream'),
      answer('snap', 'Gắt lên: “Đừng hỏi con nữa!”', `Đầu bên kia im lặng một lúc. “Ừ, khi nào bình tĩnh mình nói tiếp.” Bạn nhận ra lời mình vừa nói đã làm ${who} buồn.`, 'Tôi đã gắt gỏng khi người thân hỏi thăm.', -6, -2, 'distance'),
    ];
  } else if (player.employmentStatus === 'employed' && !((player.children ?? []).length && action === 'visit')) {
    topic = 'work'; title = 'Sau một ngày làm việc';
    prompt = `“Công việc dạo này có làm con mệt không?” ${relative.role} hỏi. “Đừng chỉ kể với nhà chuyện được tăng lương nhé.”`;
    choices = [
      answer('pressure', 'Kể về áp lực mà mình thường giấu', `${relative.role} chưa hiểu hết công việc của bạn, nhưng vẫn nghe rất chăm chú: “Mệt thì cứ nói là mệt.”`, 'Tôi kể về áp lực công việc mà trước đây hay giấu.', 2, 1, 'worry'),
      answer('joy', 'Chia sẻ một điều khiến mình tự hào', `“Chuyện nhỏ với người khác thôi, nhưng ${who} biết con đã cố.” Bạn thấy niềm vui của mình được chia sẻ.`, 'Tôi chia sẻ một niềm vui trong công việc với gia đình.', 1, 1),
      answer('later', 'Nói hôm nay muốn nghe chuyện ở nhà hơn', `${relative.role} kể đủ chuyện nhỏ: món mới nấu, người hàng xóm, cái cây vừa ra lá. Bạn được nghỉ khỏi công việc một lúc.`, 'Tôi gác công việc để nghe những chuyện thường ngày ở nhà.', 1, 1),
    ];
  } else if ((player.children ?? []).length) {
    topic = 'parenthood'; title = 'Khi mình cũng đã làm cha mẹ';
    prompt = `Nhắc đến con bạn, ${who} kể lại một lần chính mình từng lúng túng khi nuôi con. “Hồi đó ${who} cũng đâu biết hết mọi thứ.”`;
    choices = [
      answer('ask', 'Kể một điều mình đang lo khi nuôi con', `Hai thế hệ không đồng ý mọi chuyện, nhưng bạn nhận ra mình có thể hỏi mà không cần làm theo tất cả.`, 'Chúng tôi chia sẻ những bối rối khi làm cha mẹ.', 2, 1, 'worry'),
      answer('thanks', 'Cảm ơn một việc bố mẹ đã làm cho mình', `${relative.role} ngập ngừng: “Chuyện lâu rồi mà con vẫn nhớ à?” Một điều tưởng nhỏ hóa ra ở lại rất lâu.`, 'Tôi nói lời cảm ơn về một điều từng được bố mẹ chăm lo.', 2, 1),
      answer('different', 'Giải thích một cách nuôi con mình muốn làm khác', `“${who} còn phải học cách nghe con nữa.” Cuộc trò chuyện có bất đồng, nhưng không biến thành tranh cãi.`, 'Tôi nói về cách nuôi con mình chọn, dù khác với thế hệ trước.', 1),
    ];
  } else {
    const variants = ['ordinary', 'old-story', 'future'];
    const available = variants.filter(value => value !== last?.topic);
    topic = available[(age + (relative.id === 'mother' ? 1 : 0) + (action === 'visit' ? 1 : 0)) % available.length];
    title = topic === 'old-story' ? 'Một chuyện chưa từng được kể' : topic === 'future' ? 'Một dự định còn để dành' : 'Chuyện nhỏ ở nhà';
    prompt = topic === 'old-story' ? `${relative.role} nhắc một tấm ảnh cũ. Bạn nhận ra mình biết khá ít về cuộc sống của ${who} trước khi có bạn.`
      : topic === 'future' ? `“Có điều gì con vẫn muốn làm mà chưa bắt đầu không?” Lần này, ${who} hỏi vì tò mò chứ không giục giã.`
        : `${relative.role} kể chuyện bữa cơm, chuyện hàng xóm rồi hỏi: “Một ngày bình thường của con bây giờ thế nào?”`;
    choices = [
      answer('share', topic === 'future' ? 'Kể một dự định mình đang ấp ủ' : topic === 'old-story' ? 'Hỏi thêm về thời trẻ của bố mẹ' : 'Kể một chi tiết nhỏ trong ngày của mình', `Câu chuyện nối sang câu chuyện khác. ${relative.role} vui vì bạn chịu kể, chịu hỏi, dù hôm nay chẳng có tin gì lớn.`, topic === 'future' ? 'Tôi kể một dự định chưa từng chia sẻ với gia đình.' : topic === 'old-story' ? 'Tôi nghe một câu chuyện thời trẻ của người thân.' : 'Chúng tôi chia sẻ những điều nhỏ trong một ngày bình thường.', 2, 1, topic === 'future' ? 'dream' : null),
      answer('listen', 'Để bố mẹ kể, mình lắng nghe', `“${who} nói nhiều quá rồi nhỉ?” Bạn bảo vẫn đang nghe. Câu chuyện lại tiếp tục, thong thả hơn.`, 'Tôi dành thời gian lắng nghe mà không vội kết thúc cuộc trò chuyện.', 1, 1),
      answer('brief', 'Nói hôm nay hơi mệt, chỉ muốn hỏi thăm đôi câu', `“Vậy nghỉ sớm nhé. Nghe được giọng con là ${who} vui rồi.”`, 'Tôi nói mình mệt nhưng vẫn dành một chút thời gian hỏi thăm.', 0),
    ];
  }
  const recall = last ? `${relative.role} vẫn nhớ chuyện khi bạn ${last.age} tuổi: ${last.memory.replace(/^Tôi /, 'Bạn ').replace(/^Chúng tôi /, 'Hai người ')}` : null;
  return { id: `${relative.id}:${age}:${action}:${topic}:${last?.id ?? 'first'}`, relativeId: relative.id,
    age, action, topic, title, greeting, recall, prompt, choices };
}

export function rememberFamilyConversation(relative, scene, choiceId) {
  const choice = scene?.choices.find(item => item.id === choiceId);
  if (!choice || scene.relativeId !== relative.id) return null;
  const old = Array.isArray(relative.conversationMemories) ? relative.conversationMemories : [];
   
  const memory = { id: `${scene.age}:${scene.action}:${scene.topic}:${choice.id}`, age: scene.age,
    action: scene.action, topic: scene.topic, choiceId: choice.id, label: choice.label,
    memory: choice.memory, reply: choice.reply, followUp: choice.followUp };
  return { choice, memory, memories: [...old, memory].slice(-FAMILY_MEMORY_LIMIT) };
}
