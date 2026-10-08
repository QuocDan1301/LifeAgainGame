# Minh họa sự kiện tuổi 1–29

Các tình huống đời thường dùng OpenMoji cục bộ. Kết quả lựa chọn dùng GIF phù hợp nội dung và có OpenMoji dự phòng riêng. Chọn ngành, chọn trường, sự kiện khám phá bản thân và hẹn hò cũng đã có minh họa.

- `js/event-media-data.js`: ảnh tình huống và ảnh dự phòng tuổi 1–17.
- `js/event-gifs.js`: thư viện GIF, mô tả tiếng Việt và cách chọn theo nội dung.
- `js/events-19-21.js`: tình huống theo ngành học và huấn luyện.
- `js/events-23-29.js`: ảnh OpenMoji riêng cho từng tình huống/kết quả.

GIF được chọn từ những nhóm có cùng ý nghĩa: buồn ngủ, suy nghĩ, buồn, vui, thư giãn, làm việc hoặc chăm cây. Không trộn GIF gõ máy tính với GIF ăn mừng, hoặc GIF thư giãn với GIF phấn khích.

## Bộ GIF lưu cục bộ

`gifs/` chứa 21 GIF đã tải và kiểm tra định dạng. `gif-download-list.json` ghi ID nguồn; mỗi ID có trang nguồn tại `https://giphy.com/gifs/<ID>`. `js/cached-event-gifs.js` là danh sách đã tải thành công. Các GIF này không cần gọi GIPHY trong lúc chơi.

Chạy lại công cụ tải sau khi sửa danh sách:

```powershell
python scripts/cache-event-gifs.py
```

GIF ngoài danh sách lưu cục bộ vẫn dùng URL GIPHY trong thư viện. Nếu tải lỗi hoặc quá 8 giây, game chuyển sang OpenMoji tương ứng. Khi bật giảm chuyển động, game dùng OpenMoji ngay.

GIF giữ liên kết nguồn GIPHY trong `giphyGifs`; chúng không thuộc giấy phép OpenMoji. Nguồn và giấy phép OpenMoji nằm trong thư mục `stickers/`.
