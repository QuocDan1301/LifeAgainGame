# Cài Life Again từ website

- `/` và `/gioi-thieu` dùng trang giới thiệu hiện có, hướng dẫn cài trên máy tính, Android và iPhone.
- `/choi` luôn mở phần chơi, kể cả khi biểu tượng trên máy tính mở bằng tab trình duyệt. Trang giới thiệu luôn có nút Mở game.
- Sau khi cài hoặc mở game một lần, ghi nhớ lựa chọn trên máy bằng `lifeAgain:launchGame`; biểu tượng cũ mở `/` sẽ vào game. `/gioi-thieu` vẫn mở được hướng dẫn và sao lưu trong tab thường. Nếu trình duyệt chặn lưu trữ, `/choi` vẫn chơi được.
- Khi trình duyệt báo cài hoàn tất (`appinstalled`), mở `/choi` ngay trong cửa sổ hiện tại.
- Manifest giữ `id: "./"` để nhận diện cùng PWA cũ, đổi `start_url` thành `./choi`. Ứng dụng cũ khởi chạy `/` được chuyển vào game. Không đổi origin hoặc khóa bản lưu.
- Nút cài dùng lời mời cài thật của trình duyệt khi có. Nếu chưa có lời mời hoặc người dùng từ chối, vẫn có hướng dẫn bằng menu. iPhone hướng dẫn Safari → Chia sẻ → Thêm vào Màn hình chính; máy tính dùng Chrome/Edge hoặc Thêm vào Dock trên Safari hỗ trợ.

## Bản lưu

Trang giới thiệu có nút tải bản sao khi phát hiện dữ liệu game trong trình duyệt. Tệp dùng cùng định dạng Chuyển thiết bị của game. Không tự động ghi đè hay xóa dữ liệu. iPhone có thể dùng vùng lưu riêng khi thêm ứng dụng: giữ dữ liệu cũ và nhập tệp sao lưu trong ứng dụng nếu cần.

Mã chuyển trên URL được giữ khi bấm Mở game hoặc chuyển từ biểu tượng cũ vào `/choi`. Nếu việc cài mất quá lâu làm mã hết hạn, tạo lại mã trên máy cũ. Tệp sao lưu không có giới hạn 10 phút.

## Build và kiểm tra

- `npm run build`
- `npm run test:server`
- `npm run test:offline`
- `npm run test:installation:ui` (cần Playwright/Chrome; hỗ trợ `PLAYWRIGHT_PATH`, `CHROME_PATH`)

Service worker tải cả trang giới thiệu lẫn phần chơi, và định tuyến `/choi` về bản game đã tải khi ngoại tuyến. Cache mới không xóa localStorage.

Kiểm thử UI bao gồm biểu tượng mở bằng tab thường, mở ngay sau cài, ghi nhớ lần chơi, các chế độ standalone và giữ bản lưu khi ngoại tuyến; không thay cho cài thật trên Android/iPhone.

Triển khai bằng quy trình Render hiện tại khi đã duyệt thay đổi. Không cần bộ cài `.exe`, domain mới hoặc chuyển dữ liệu sang máy chủ. Chưa tự động deploy/push trong tác vụ này.
