# GIF minh họa sự kiện

Game xen OpenMoji cục bộ với một bộ GIF GIPHY chọn sẵn trong
`js/event-gifs.js`. Thư viện có thêm 100 GIF mức nội dung G, chia thành 10
nhóm cảm xúc và tình huống. Các GIF tải trực tiếp từ GIPHY, không tìm kiếm
động lúc chơi và không cần khóa API. Dùng phiên bản rộng 200px để giảm dung
lượng tải.

Mỗi GIF có mô tả tiếng Việt và liên kết nguồn lưu trong `js/event-gifs.js`.
Đây là nội dung từ GIPHY, không thuộc giấy phép
OpenMoji trong thư mục `stickers`.

Để đổi hoặc thêm GIF, sửa `giphyGifs` và gán tên GIF vào `eventGifs`:

```js
"teen-16-1": {
  scene: "typing",
  choices: { 0: "success", 1: "chaos" },
},
```

`scene` là ảnh tình huống; `choices` là ảnh kết quả theo chỉ số lựa chọn
bắt đầu từ 0. Vị trí không được gán GIF vẫn dùng OpenMoji.

GIF cần kết nối Internet. Nếu tải lỗi hoặc quá 8 giây, game dùng nhãn dán
của chính tình huống/kết quả đó. Khi thiết bị bật giảm chuyển động, game
dùng OpenMoji ngay từ đầu.
