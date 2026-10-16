# Life Again cho Windows

`npm run desktop:build` tạo `output/windows-release/LifeAgain-Windows-x64.exe` và tệp SHA-256 bên cạnh. Cần Internet lúc build để tải runtime/công cụ đóng gói và font; người chơi không cần cài Node.js, Chrome hoặc Edge.

Người chơi Windows x64 tải một file `.exe`, lưu vào thư mục riêng rồi bấm đúp để chơi. Đây là bản portable, không cần quyền quản trị hoặc trình cài đặt. Mỗi bản phát hành chứa toàn bộ mã game, hình ảnh và font. Thay file `.exe` bằng bản mới để cập nhật.

Bản lưu dùng profile `%APPDATA%\LifeAgain` và origin cố định `lifeagain://game.lifeagain`, độc lập với thư mục chứa file `.exe`. Không xóa thư mục profile nếu muốn giữ cuộc đời. Bản lưu trên web không tự chuyển sang Windows; dùng Chuyển thiết bị → xuất/nhập tệp sao lưu. Mã chuyển trực tuyến kết nối hai API chuyển dữ liệu của website chính thức khi người chơi yêu cầu.

`npm run test:desktop` chạy bản đã đóng gói trong profile thử riêng, chặn mạng để tạo nhân vật, đóng rồi mở lại để tiếp tục bản lưu. Kiểm tra đường dẫn tài nguyên, font ngoại tuyến, sandbox và giới hạn truy cập tệp. `npm run test:desktop:portable` chạy chính file phân phối để xác nhận tự giải nén và mở game. Giấy phép font đi kèm trong gói `game/desktop-fonts`. Có thể đặt `PLAYWRIGHT_PATH` tới thư viện Playwright đã cài; mặc định dùng runtime Codex trên máy phát triển hiện tại.

Để phân phối trên website, tải `.exe` và `.sha256` lên GitHub Releases hoặc máy chủ tải tệp, rồi dùng URL của file phát hành cho nút tải Windows. Không đưa file nhị phân lớn vào Git. Bản build local chưa được ký Authenticode; phát hành có ký số cần chứng thư của nhà phát triển. Không hướng dẫn người chơi tắt bảo vệ Windows.

Electron dùng custom protocol phục vụ file từ gói cục bộ, không mở cổng máy chủ. Renderer không có Node.js, không có preload/IPC, bật sandbox và context isolation. Liên kết HTTPS bên ngoài mở ở trình duyệt; các scheme khác bị chặn. Cấu hình theo [hướng dẫn bảo mật Electron](https://www.electronjs.org/docs/latest/tutorial/security) và [custom protocol](https://www.electronjs.org/docs/latest/api/protocol).
