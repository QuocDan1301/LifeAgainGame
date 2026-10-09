# Minh họa OpenMoji động

Game chỉ dùng OpenMoji: mỗi tình huống và kết quả có một biểu tượng SVG động.
Thư viện chính thức 17.0.0 chứa đầy đủ 4.495 biểu tượng màu trong
`openmoji/color/svg/`. Tất cả biểu tượng màu có phiên bản chuyển động trong
`openmoji/animated/svg/`.

Chuyển động được thêm trên hình gốc, giữ nét vẽ và màu OpenMoji. Khi bật giảm
chuyển động hoặc tệp động tải lỗi, game dùng đúng SVG gốc của cùng biểu tượng.
Không có giới hạn số lần dùng. `openmoji/NOTICE.md` và `LICENSE.txt` ghi nguồn,
giấy phép và mô tả thay đổi.

Các file `openmoji/reviewed-*.json` gán mã biểu tượng cho từng nội dung đã rà.
`js/reviewed-event-openmoji.js` là bảng dùng trong game, được biên dịch từ các
file đó. Công cụ biên dịch báo lỗi nếu thiếu tình huống/kết quả trong bản audit.

```powershell
python scripts/sync-openmoji.py
python scripts/build-openmoji-animations.py
python scripts/export-openmoji-audit.py
# Rà nội dung mới, cập nhật openmoji/reviewed-*.json nếu cần.
python scripts/build-reviewed-openmoji.py
python scripts/audit-event-assets.py
python scripts/run-media-checks.py --expansion
```
