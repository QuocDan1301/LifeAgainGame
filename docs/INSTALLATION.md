# Cài Life Again từ website

- `/` và `/gioi-thieu` dùng trang giới thiệu hiện có, hướng dẫn cài trên máy tính, Android và iPhone.
- `/choi` là phần chơi. Bản build yêu cầu cửa sổ PWA đã cài; tab trình duyệt thường trở về trang cài. Mã nguồn chạy local vẫn cho phép kiểm thử trong tab.
- Manifest giữ `id: "./"` để nhận diện cùng PWA cũ, đổi `start_url` thành `./choi`. Ứng dụng cũ khởi chạy `/` được chuyển vào game. Không đổi origin hoặc khóa bản lưu.
- Nút cài dùng lời mời cài thật của trình duyệt khi có. Nếu chưa có lời mời hoặc người dùng từ chối, vẫn có hướng dẫn bằng menu. iPhone hướng dẫn Safari → Chia sẻ → Thêm vào Màn hình chính; máy tính dùng Chrome/Edge hoặc Thêm vào Dock trên Safari hỗ trợ.

## Bản lưu

Trang giới thiệu có nút tải bản sao khi phát hiện dữ liệu game trong trình duyệt. Tệp dùng cùng định dạng Chuyển thiết bị của game. Không tự động ghi đè hay xóa dữ liệu. iPhone có thể dùng vùng lưu riêng khi thêm ứng dụng: giữ dữ liệu cũ và nhập tệp sao lưu trong ứng dụng nếu cần.

Mã chuyển trên URL được giữ khi tab thường chuyển từ `/choi` về hướng dẫn cài. Nếu việc cài mất quá lâu làm mã hết hạn, tạo lại mã trên máy cũ. Tệp sao lưu không có giới hạn 10 phút.

## Build và kiểm tra

- `npm run build`
- `npm run test:server`
- `npm run test:offline`
- `npm run test:installation:ui` (cần Playwright/Chrome; hỗ trợ `PLAYWRIGHT_PATH`, `CHROME_PATH`)

Service worker tải cả trang giới thiệu lẫn phần chơi, và định tuyến `/choi` về bản game đã tải khi ngoại tuyến. Cache mới không xóa localStorage.

Kiểm thử UI giả lập thiết bị và chế độ standalone; không thay cho cài thật trên Android/iPhone. Yêu cầu cài là luồng sản phẩm, không phải cơ chế xác thực hoặc giấu JavaScript.

Triển khai bằng quy trình Render hiện tại khi đã duyệt thay đổi. Không cần bộ cài `.exe`, domain mới hoặc chuyển dữ liệu sang máy chủ. Chưa tự động deploy/push trong tác vụ này.
