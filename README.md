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

## Phiên bản

| Phiên bản | Ngày       | Thay đổi |
|-----------|-----------|---------|
| v1.4.8    | 2026-10   | Tách dữ liệu khỏi các app khác cùng tên miền: khoá lưu trữ đổi sang tiền tố `lai_` (tự chuyển dữ liệu cũ, trước đây `setting_...` trùng với app Mủ Cao Su); Service Worker chỉ xoá cache `laisuat-` của chính app, không xoá bản offline của app khác |
| v1.0.1    | 2026-09   | Dấu chấm phân cách, số tiền đầy đủ, tự lưu lịch sử khi xóa |
| v1.0.0    | 2026-09   | Phiên bản đầu tiên |
