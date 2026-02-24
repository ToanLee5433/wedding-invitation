<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Luxury Wedding Invitation

Ứng dụng thiệp cưới điện tử cao cấp với tính năng quản lý khách mời thông minh.

View your app in AI Studio: https://ai.studio/apps/drive/1R1vlP0vT6o5vThUdjJIVE7nyYO3H-YfP

## 🚀 Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` file and configure:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-key
   VITE_ADMIN_SECRET_PATH=/admin@5433
   VITE_ADMIN_USERNAME=your-admin-username
   VITE_ADMIN_PASSWORD=your-admin-password
   VITE_WEDDING_SLUG=your-wedding-slug
   GEMINI_API_KEY=your-gemini-api-key
   ```
3. Run the app:
   ```bash
   npm run dev
   ```

## 🔐 Truy Cập Trang Admin

**Link quản lý danh sách khách mời:**

```
http://localhost:5173/admin@5433
```

Hoặc trên production:

```
https://your-domain.com/admin@5433
```

### Các Tính Năng Admin:

- 📊 **Tổng quan**: Thống kê khách mời, phản hồi, lời chúc
- 👥 **Quản lý khách mời**: Thêm/sửa/xóa khách, xem phản hồi, gửi link
- 🔗 **Tạo link mời**: Tạo link thiệp cá nhân cho từng khách
- ⚙️ **Cấu hình**: Chỉnh sửa ảnh, nhạc, địa điểm, QR code

**Xem hướng dẫn chi tiết:** [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)

---

## 📱 Features

- ✨ Thiệp cưới tương tác với hiệu ứng mở phong bì
- 🎵 Nhạc nền tự động phát
- 🌸 Hiệu ứng cánh hoa rơi
- ⏱️ Đếm ngược đến ngày cưới
- 📖 Timeline câu chuyện tình yêu
- 📸 Album ảnh
- 🤖 AI Face Booth (chụp ảnh với AI)
- 🎁 QR Code nhận quà
- 📝 Form xác nhận tham dự (RSVP)

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI**: Tailwind CSS + Framer Motion
- **Database**: Supabase
- **AI**: Google Gemini
- **Deployment**: Vercel
