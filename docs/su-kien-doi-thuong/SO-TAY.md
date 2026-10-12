# Sổ tay sự kiện đời thường

Toàn bộ sự kiện đời thường của game nằm ở `js/life-stories/` (627 sự kiện, tuổi 1–104). Mỗi lần sửa hay viết thêm, kể cả khi nhờ AI, đều phải theo sổ tay này.

| File | Tuổi |
|---|---|
| `stage-01-10.js` | 1–10 |
| `stage-11-23.js` | 11–14, 17, 19–21, 23 |
| `stage-26-32.js` | 26–32 |
| `stage-33-39.js` | 33–39 |
| `stage-40-49.js` | 40–49 |
| `stage-50-59.js` | 50–59 |
| `stage-60-69.js` | 60–69 |
| `stage-70-79.js` | 70–79 |
| `stage-80-89.js` | 80–89 |
| `stage-90-104.js` | 90–104 |

## 1. Cách game chọn sự kiện

- Mỗi năm có 80% khả năng xảy ra một sự kiện. Game gom **tối đa 4 sự kiện hợp với hoàn cảnh người chơi** ở tuổi đó rồi bốc 1.
- Mỗi tuổi có vài sự kiện chung (ai cũng gặp được) và các phiên bản theo hoàn cảnh (đang yêu, đã cưới, độc thân, có con, đi làm hay không…). Người chơi nào cũng phải nhận ít nhất 3 sự kiện, mục tiêu là 4.
- **Sự kiện chuỗi** (nối với chuyện cũ) mở trong một **khoảng tuổi**, chỉ xuất hiện khi người chơi có đủ dấu, chiếm tối đa 2 trong 4 chỗ và được bốc với trọng số ×3. Khi chuỗi sẵn sàng, khoảng 50% số năm nó được bốc.
- Mỗi sự kiện chỉ xuất hiện một lần trong một đời (dấu `seen:<id>` được ghi tự động).
- **Không có sự kiện đời thường** ở các tuổi 15, 16, 18, 22, 24, 25, 105, vì đây là năm có sự kiện đặc biệt không thể thay thế (18 tuổi luôn là sự kiện chọn ngành).
- Sự kiện đặc biệt (lạc đường năm 10 tuổi, mỏ kim cương, chuyến tàu cuối…) vẫn do `js/events.js` lo, không nằm trong bộ này.

### Những điều game tự quyết: không viết vào sự kiện đời thường

Cưới, sinh con, nhận con nuôi, người thân hay bạn đời qua đời, có việc hay mất việc, đổi ngành đều do các hệ thống khác của game quyết định. Sự kiện đời thường **không được tự gây ra** những chuyện này, chỉ được kể **hệ quả** khi game đã xác nhận (ví dụ dùng `fatherGone`, `widowed`). Đừng viết “bác sĩ nói không còn bao lâu” về bạn đời, vì game có thể để người ấy sống thêm 20 năm.

## 2. Giọng văn

- Kể ở ngôi **“Tôi”**, thì hiện tại, câu gọn nhưng phải nối với nhau (xem mục bên dưới). Kể bình thản, không bình luận cảm xúc thay người chơi.
- **Không viết hài.** Cảm xúc phải đến từ chi tiết cụ thể: cái mấu u trên thân cây, tờ giấy bị giặt nát, ba ngồi bậc thềm thở dốc.
- Kết quả **không dạy đời**. Không kết bằng bài học. Để người chơi tự nghĩ.
- Hệ quả thể hiện qua **hành động hoặc lời nói của người khác** (“Ba nhìn xuống chén”), đừng chỉ ghi “mọi người buồn”.
- **Giới tính người chơi là ngẫu nhiên.** Không để ai gọi người chơi bằng “ông”, “bà”, “anh”, “chị”, “cô chú”, và không viết “anh/chị”. Cháu chắt gọi người chơi là “cố”, người lạ gọi là “cụ”, “bác”.
- Cấm: “vô cùng”, “bỗng nhiên”, “bạn cảm thấy”, câu mở đầu bằng “Thật là”, “rút ra bài học”, dấu `!`. Script kiểm tra sẽ tự bắt các lỗi này.
- **Mặt cười do game tự gắn**, đừng viết emoji vào dữ liệu. `js/life-stories.js` thêm một mặt cười vào cuối tình huống và cuối mỗi kết quả, chọn theo cảm xúc:
  - Kết quả: hạnh phúc từ +3 trở lên 😄🥰, +1/+2 🙂😌, 0 thì xét chỉ số khác, −1 😕😬, −2/−3 😔😢, từ −4 trở xuống 😭.
  - Tình huống: mặt phân vân 🤔😟😬; nếu là chuyện buồn thì mặt buồn.
  - Chuyện buồn được nhận ra qua từ khóa (qua đời, đám tang, quan tài, viếng, bệnh nặng, khóc…). Khi đó kết quả tích cực chỉ dùng mặt bùi ngùi 🥲😌, không cười tươi.
  - Muốn đổi bộ mặt hoặc từ khóa thì sửa `FACES` và `SOMBER` trong `js/life-stories.js`.
- Độ dài: tình huống tối đa 60 chữ, kết quả tối đa 55 chữ, nhãn lựa chọn tối đa 12 chữ (đếm theo âm tiết).
- Bối cảnh trung tính vùng miền, vì tỉnh thành là ngẫu nhiên. Tránh từ quá địa phương (hẻm/ngõ → “đầu đường”). Không dùng “cấp huyện” vì cấp huyện đã bỏ từ 2025.
- Sự kiện cố định (không có `requires`) **không được khẳng định một ký ức mà người chơi có thể chưa từng trải qua**. Muốn nhắc chuyện cũ thì viết thành sự kiện chuỗi.

### Tình huống phải đọc liền mạch

Lỗi hay gặp nhất khi ép câu cho ngắn: các câu đứng rời nhau như ghi chú, người đọc không hiểu chuyện gì đang xảy ra và vì sao có các lựa chọn. Trước khi giữ một sự kiện, kiểm tra 4 điều:

1. **Câu sau nối được với câu trước** (vì vậy, nhưng, nên, cùng lúc đó…). Đọc to lên phải nghe như đang kể chuyện.
2. **Không nhắc tới thứ chưa giới thiệu.** Sai: “Mẹ đã ủi bộ đồ từ tối qua” khi chưa nói bộ đồ nào. Đúng: “Mẹ mặc cho tôi bộ đồ mới mua, đã ủi phẳng từ tối qua.”
3. **Câu cuối nói rõ nhân vật đang phải chọn gì**, hoặc đang muốn gì: “Tôi kéo cổ áo, nhìn chiếc áo thun cũ trên giường.” Đừng dừng ở một câu tả cảnh.
4. **Mỗi lựa chọn trả lời đúng câu cuối đó.** Đọc tình huống xong, người chơi phải tự đoán được các lựa chọn sẽ xoay quanh chuyện gì.

Thà dùng thêm vài chữ để liền mạch, còn hơn ngắn mà khó hiểu.

## 3. Lựa chọn khiến người chơi phân vân

1. Mỗi lựa chọn **được một thứ và mất một thứ**. Thường là hai giá trị đều đúng: tiền và tình, mình và gia đình, nói thật và giữ hòa khí, trước mắt và lâu dài.
2. Không có lựa chọn “người xấu”. Lựa chọn nào cũng có lý do để một người tử tế chọn.
3. Chỉ số chỉ dao động nhẹ (−5..+4). Cái giá thật nằm ở câu chữ và ở dấu để lại.
4. Tự kiểm tra: nếu 80% người chơi sẽ chọn cùng một đáp án thì viết lại.
5. Ở hai đầu cuộc đời, lựa chọn là **phản ứng thế nào**, không phải làm gì.

## 4. Giai đoạn tuổi

| Tuổi | Tự quyết | Chủ đề đời thường |
|---|---|---|
| 1–3 | Gần như không. Chỉ phản ứng: khóc, níu, chạy lại | Bám ai, sợ gì, những lần đầu |
| 4–5 | Rất ít | Chia đồ, nói dối lần đầu, bạn ở mẫu giáo, lời hứa của người lớn |
| 6–10 | Nhỏ | Tiền ăn sáng, giữ bí mật, điểm kém, bạn bè, ba mẹ cãi nhau |
| 11–14 | Có, nhưng bị cấm nhiều | Nhóm bạn, mụn, thuốc lá, quỹ lớp, bà yếu đi |
| 17–23 | Khá | Thích ai đó, chọn ngành, làm thêm, rời nhà, tiền trọ, lương đầu |
| 26–39 | Cao nhất | Nhà cửa, hôn nhân, con nhỏ, công việc, bạn cũ hỏi vay |
| 40–49 | Cao nhưng bị trói | Con tuổi mới lớn, cha mẹ già, sự nghiệp chững, sức khỏe |
| 50–59 | Giảm dần | Con cưới, cháu đầu, di chúc, chuẩn bị nghỉ hưu |
| 60–69 | Trung bình | Nghỉ hưu, trông cháu, bạn bè mất dần, quên |
| 70–79 | Thấp | Giấu bệnh, chia đất, góa bụa, lời xin lỗi muộn |
| 80–89 | Thấp | Phụ thuộc, trí nhớ, trao lại đồ vật, chắt |
| 90–104 | Rất thấp | Đón nhận chăm sóc, những người còn lại, lời dặn |

## 5. Nhân vật lặp lại

Đây là nhân vật trong lời kể, game không theo dõi họ. Ba, mẹ, bạn đời, con là người thân thật của game: dùng `needs` và các chỗ điền tên.

| Nhân vật | Xuất hiện | Ghi chú |
|---|---|---|
| **Bà** | 1–14 | Bà nội hoặc ngoại, không nói rõ. Lưng đau, lẫn dần, mất lúc 12–14 (chuỗi) |
| **Tú** | 4 → 88 | Bạn thân nhà bên. Tên trung tính, dùng được cho cả trai lẫn gái |
| **Phong** | 8 → 72 | Bạn làm bể bình hoa |
| **Lành** | 4 → 36 | Bạn nói ngọng ở mẫu giáo, sau làm cô giáo trị liệu ngôn ngữ |
| **Lan** | 10 → 23 | Bạn bị chế giễu bằng tờ giấy chuyền tay |
| **Quân** | 5 → 45 | Bạn không có hoa ngày Nhà giáo, sau mở tiệm hoa |
| **Khoa** | 12 → 95 | Bạn trong chuyến đi biển, sau làm bác sĩ |
| **Vàng** | 8 → 14 | Chó nhặt về nuôi |

Chỗ điền tên tự động: `{tenBa}`, `{tenMe}`, `{tenBanDoi}`, `{tenCon}` (lấy tên gọi, ví dụ “Quốc Dân” → “Dân”). `{tenCon}` là đứa con hợp với `childAge` của sự kiện.

## 6. Các tuyến chạy suốt đời

- **Bà:** gần bà → bà trao nhẫn, bà mất (11–14) → chiếc nhẫn trong đám cưới em họ (30–45) → chính mình gọi nhầm tên cháu (82–100).
- **Tú:** gặp Tú (4–6) → khác lớp (6–8) → Tú chuyển nhà (9–11) → số điện thoại cũ / gợi ý kết bạn (12–23) → ở nhờ (19–23) → cưới (26–30) → hỏi vay (33–42) → lên thăm, tóc bạc (50–62) → cuộc gọi cuối (70–88).
- **Phong:** bình hoa (8) → bên kia bàn làm việc (27–34) → họp lớp sáu mươi năm (60–72).
- **Người bị bắt nạt:** Lành (4) → cô giáo của con (28–36). Tờ giấy về Lan (10) → gặp lại ở quán cà phê (19–23).
- **Ba mẹ:** cãi nhau sau vách (5) → mình cãi nhau trước mặt con (30) → con nhớ lại đêm ấy (44–56). Lời hứa sở thú (4) → hứa với con (31) → con nhắc lại (44–56). Tiền lì xì (5) → cuốn sổ lì xì (17–21) → cuốn sổ sau khi mẹ mất. Con thuyền gỗ (3) → sau khi ba mất → trao cho chắt. Chuyện ba trốn học câu cá (9) → kể lại cho ba khi ba lẫn (40–70).
- **Nhà và cây xoài:** nhánh gãy (4) → lứa xoài đầu (8–10) → cây xoài khi bán nhà cũ (50–70) → trái xoài cuối mùa (80–100).
- **Tính cách:** sợ đứng trước đám đông (6) → bài phát biểu (17–21). Biết bơi hay không (7) → chuyến đi biển (12–14) → con học bơi (33–39). Học đàn (9) → cây đàn ở tiệm đồ cũ (42–60) → dạy cháu đàn (62–80). Sợ chó, nuôi chó (1, 8) → con xin nuôi chó (33–42) → con chó già của con (48–60). Hút thử thuốc (12) → phim chụp phổi (28–36).
- **Những người mình từng giúp:** học trò vùng cao (21) → xin tiền nhập học → lễ tốt nghiệp. Báo bạn chuyện cắt giảm (37) → bạn trả ơn (40–55). Xây cây cầu (59) → người qua cầu (64–85). Nhận đỡ đầu (43) → ngồi ghế phụ huynh (52–65). Nuôi cháu (55) → cháu đón về ở (64–78).

Còn rất nhiều dấu đã gieo nhưng chưa có sự kiện nối: xem [SO-DAU.md](SO-DAU.md), dòng “chưa nối”. Đó là chỗ có thể viết thêm.

## 7. Định dạng

```js
// Sự kiện cố định
{
  id: 'ls08-binh-hoa', age: 8,
  needs: ['mother'],        // tùy chọn, xem danh sách bên dưới
  childAge: [3, 12],        // tùy chọn: có ít nhất một đứa con trong khoảng tuổi này
  minMoney: 2000000,        // tùy chọn: bắt buộc nếu có lựa chọn tốn tiền (money âm)
  title: 'Bình hoa trên bàn cô',
  text: '…tình huống, tối đa 60 chữ…',
  choices: [
    { label: 'Nói ra là Phong', effects: { happiness: -2, intelligence: 1 }, flags: ['khai_phong'],
      text: '…kết quả, tối đa 55 chữ…' },
    // 2–3 lựa chọn; chỉ số: health, happiness, intelligence, appearance; có thể thêm money
  ],
}

// Sự kiện chuỗi: dùng khoảng tuổi
{
  id: 'ls-tu-chuyen-di', ages: [9, 11],
  requires: ['ban_tu'],           // phải có đủ các dấu này
  requiresAny: [],                // có ít nhất một dấu trong danh sách
  blocks: ['chuyen_nha'],         // có dấu này thì không xuất hiện
  …
}
```

`needs` hỗ trợ:

| Nhóm | Giá trị |
|---|---|
| Ba mẹ | `father`, `mother`, `anyParent`, `fatherGone`, `motherGone`, `parentsGone` |
| Bạn đời | `partner`, `married`, `dating`, `single`, `widowed`, `neverMarried` |
| Con | `children`, `noChildren` (kết hợp với `childAge`) |
| Việc làm | `employed`, `notEmployed` (dưới 62 tuổi), `retired` (từ 62), `student`, `notStudent` (18–21) |
| Khác | `vehicle`, `mobile` (sức khỏe từ 30), `frail` (sức khỏe dưới 30) |

- Viết theo **cặp bổ sung nhau** để không ai bị thiếu sự kiện: `partner` đi với `single`, `employed` đi với `notEmployed`, `student` đi với `notStudent`.
- Câu viết “ba mẹ” thì cần cả `father` và `mother`, đừng dùng `anyParent`.
- Đặt id: `ls<tuổi>-<tên>` cho sự kiện cố định, `ls-<tuyến>-<tên>` cho sự kiện chuỗi.
- Đặt tên dấu: chữ thường không dấu, nối bằng `_`, mô tả việc đã xảy ra (`nhan_thay_phong`, không đặt `flag1`). Dấu không bao giờ bị xóa.

## 8. Sửa hoặc viết thêm

1. Sửa trong file giai đoạn tương ứng. Viết giai đoạn mới thì import trong `js/life-stories/index.js`.
2. Chạy `node scripts/check-life-stories.mjs --registry`. Script kiểm tra:
   - độ dài, lối viết cấm, dấu hợp lệ, tiền không bị âm;
   - mọi hoàn cảnh (ba mẹ còn hay mất, độc thân hay có gia đình hay góa, có con nhỏ hay con lớn hay không con, có việc hay không, khỏe hay yếu, có tiền hay không) đều nhận ít nhất 3 sự kiện mỗi tuổi;
   - mô phỏng 4000 cuộc đời, báo sự kiện nào chưa từng xuất hiện;
   - rồi cập nhật SO-DAU.md.
3. Script không bắt được lỗi đọc khó hiểu. Luôn đọc to lại theo 4 điều ở mục 2.

## 9. Prompt khi nhờ AI viết

Dán kèm mục 1 (phần “game tự quyết”), mục 2, 3, 5, 7 của sổ tay này, phần SO-DAU.md của các dấu liên quan, và 3 sự kiện mẫu ở tuổi gần nhất.

```
Viết sự kiện cho tuổi <X> đến <Y>, đúng định dạng mục 7.
Mỗi tuổi: 3 sự kiện ai cũng gặp được + một cặp phiên bản theo hoàn cảnh (partner/single hoặc employed/notEmployed).
Nhân vật ở giai đoạn này: <dòng tương ứng trong bảng mục 4>.
Viết thêm <N> sự kiện chuỗi dùng các dấu sau: <danh sách dấu và ý nghĩa>.
Mỗi lựa chọn phải được một thứ và mất một thứ. Không hài, không bài học, không emoji, không dấu chấm than.
Không xưng hô theo giới tính với người chơi. Không tự gây ra cưới, sinh, chết, mất việc.
Tình huống phải đọc liền mạch: câu sau nối với câu trước, không nhắc tới thứ chưa giới thiệu, câu cuối nói rõ nhân vật đang phải chọn gì, mỗi lựa chọn trả lời đúng câu đó.
Viết xong, tự chấm từng sự kiện: “Đọc to lên có hiểu ngay không?” và “Người chơi có thật sự phân vân không?”, rồi viết lại những sự kiện chưa đạt.
```
