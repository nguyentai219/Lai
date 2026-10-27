# Tính Lãi Suất Tiền Vay – Gửi

PWA tính lãi đơn ngân hàng, chạy offline, cài được lên màn hình điện thoại.

**Công thức:** `Lãi = Lãi suất% ÷ 365 × Số tiền × Số ngày`

## Cài lên điện thoại

Truy cập link GitHub Pages → trình duyệt sẽ hỏi "Thêm vào màn hình chính".

## Đưa lên GitHub Pages

```
1. Tạo repo mới trên GitHub
2. Upload toàn bộ thư mục này vào repo
3. Settings → Pages → Deploy from branch main
4. Truy cập: https://<username>.github.io/<repo-name>/
```

## App Android offline

`android-offline/release/LaiSuat.apk` — APK chứa sẵn toàn bộ web app, chạy không cần mạng. APK **không** tự
cập nhật theo web: sửa web xong phải build lại bằng `android-offline/build.sh` (tăng `versionCode`) và ký
bằng đúng khoá `lai.keystore` (người dùng giữ — không bao giờ đưa khoá vào repo).

## Phiên bản

| Phiên bản | Ngày       | Thay đổi |
|-----------|-----------|---------|
| v1.4.9    | 2026-10   | Sửa lỗi: ô lãi suất nhận dấu phẩy (12,5); đọc số bằng chữ đúng "không trăm lẻ", số ≥ 1.000 tỷ; trang cuộn được khi màn hình nhỏ/bàn phím mở; bảo vệ màn hình đúng 30 giây; logo không giật khi bay ra/về; không tự tải lại 2 lần khi có bản mới; dữ liệu lưu hỏng không làm trắng trang; con trỏ ô tiền không nhảy; phông chữ đóng gói sẵn (chạy offline); thêm APK offline (`android-offline/`) |
| v1.4.8    | 2026-10   | Tách dữ liệu khỏi các app khác cùng tên miền: khoá lưu trữ đổi sang tiền tố `lai_` (tự chuyển dữ liệu cũ, trước đây `setting_...` trùng với app Mủ Cao Su); Service Worker chỉ xoá cache `laisuat-` của chính app, không xoá bản offline của app khác |
| v1.0.1    | 2026-09   | Dấu chấm phân cách, số tiền đầy đủ, tự lưu lịch sử khi xóa |
| v1.0.0    | 2026-09   | Phiên bản đầu tiên |
