# 🔐 Link Truy Cập Trang Admin

## Câu Hỏi: Link để vào trang admin quản lý danh sách khách mời là gì?

### ✅ Câu Trả Lời:

**Development (chạy local):**
```
http://localhost:5173/admin@5433
```

**Production (trên server):**
```
https://your-domain.com/admin@5433
```

> **Lưu ý:** Thay `your-domain.com` bằng tên miền thực tế của website thiệp cưới

---

## 🎯 Đường Dẫn Mặc Định

- Đường dẫn admin mặc định: `/admin@5433`
- Có thể thay đổi trong file `.env.local` qua biến: `VITE_ADMIN_SECRET_PATH`

---

## 📍 Sau Khi Đăng Nhập

1. Bạn sẽ thấy **Dashboard** với thống kê tổng quan
2. Click vào tab **"Khách mời"** ở sidebar bên trái
3. Tại đây bạn có thể:
   - ➕ Thêm khách mới
   - 📝 Sửa thông tin khách
   - 🗑️ Xóa khách
   - 🔗 Copy link mời
   - 📤 Gửi link qua Zalo
   - 📥 Xuất danh sách Excel
   - 👁️ Xem phản hồi và lời chúc

---

## 📚 Hướng Dẫn Chi Tiết

Xem file [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) để biết hướng dẫn đầy đủ về:
- Cách cấu hình admin
- Tất cả tính năng quản lý
- Hướng dẫn sử dụng từng chức năng
- FAQ và troubleshooting
