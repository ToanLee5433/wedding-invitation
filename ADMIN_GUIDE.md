# Hướng Dẫn Quản Lý Admin - Wedding Invitation

## 📋 Tổng Quan Dự Án

Đây là một ứng dụng thiệp cưới điện tử cao cấp với các tính năng:
- ✉️ Thiệp cưới tương tác với hiệu ứng đẹp mắt
- 👥 Quản lý danh sách khách mời
- 🔗 Tạo link mời cá nhân cho từng khách
- 📊 Thống kê và theo dõi phản hồi
- ⚙️ Cấu hình nội dung thiệp trực quan

---

## 🔐 Truy Cập Trang Admin

### Link Truy Cập

Để vào trang admin quản lý danh sách khách mời, sử dụng đường dẫn:

```
https://your-domain.com/admin@5433
```

**Lưu ý:** 
- `your-domain.com` là tên miền website của bạn
- `/admin@5433` là đường dẫn mặc định, có thể thay đổi trong file `.env.local`

### Cấu Hình Đường Dẫn Admin

Nếu muốn thay đổi đường dẫn admin (để bảo mật hơn), tạo file `.env.local` và thêm:

```env
VITE_ADMIN_SECRET_PATH=/duong-dan-rieng-cua-ban
```

Ví dụ: `VITE_ADMIN_SECRET_PATH=/quan-ly-dam-cuoi-2026`

---

## 🎯 Các Tính Năng Admin

### 1. 👥 Quản Lý Khách Mời (Guest List Management)

Truy cập: **Trang Admin → Tab "Khách mời"**

**Chức năng:**
- ➕ **Tạo lời mời mới**: Nhập tên khách và chọn nhóm (Bạn bè, Đồng nghiệp, Họ hàng...)
- 📝 **Sửa thông tin**: Click icon chỉnh sửa để đổi tên hoặc nhóm khách
- 🗑️ **Xóa khách**: Xóa khách khỏi danh sách
- 🔗 **Sao chép link**: Copy link thiệp cá nhân để gửi cho khách
- 📤 **Gửi qua Zalo**: Chia sẻ link trực tiếp qua Zalo
- 📥 **Xuất Excel**: Xuất toàn bộ danh sách ra file CSV
- 🔍 **Tìm kiếm**: Lọc khách theo tên
- 👁️ **Xem lời chúc**: Đọc lời chúc mừng từ khách

**Thống kê hiển thị:**
- Tổng số khách đã mời
- Số lượng phản hồi (xác nhận/từ chối)
- Tổng số người tham dự
- Số lời chúc đã nhận

### 2. 🔗 Tạo Link Mời

Truy cập: **Trang Admin → Tab "Tạo link mời"**

Tạo link thiệp cá nhân hóa cho từng khách mời. Link có dạng:
```
https://your-domain.com/?to=Ten_Khach_Moi
```

### 3. ⚙️ Cấu Hình Thiệp

Truy cập: **Trang Admin → Tab "Cấu hình"**

Chỉnh sửa:
- Ảnh bìa
- Nhạc nền
- Album ảnh
- Thông tin lễ cưới
- Mã QR nhận quà

### 4. ✏️ Sửa Nội Dung Trực Tiếp

Click nút **"Sửa nội dung thiệp"** trong dashboard để:
- Chỉnh sửa trực tiếp trên giao diện thiệp
- Click vào văn bản hoặc ảnh để thay đổi
- Lưu ngay lập tức

---

## 🔒 Bảo Mật

### Thông Tin Đăng Nhập

Cấu hình trong file `.env.local`:

```env
VITE_ADMIN_USERNAME=your-admin-username
VITE_ADMIN_PASSWORD=your-admin-password
```

**Khuyến nghị:**
- Sử dụng mật khẩu mạnh
- Không chia sẻ đường dẫn admin công khai
- Thay đổi `VITE_ADMIN_SECRET_PATH` thành đường dẫn khó đoán

---

## 📱 Cách Sử Dụng

### Quy Trình Mời Khách

1. **Truy cập Admin**: Vào `https://your-domain.com/admin@5433`
2. **Đăng nhập**: Nhập username và password
3. **Vào tab "Khách mời"**
4. **Thêm khách mới**:
   - Nhập tên khách
   - Chọn nhóm (Bạn bè, Họ hàng, Đồng nghiệp...)
   - Click "Tạo"
5. **Gửi link**:
   - Click nút "Zalo" để gửi qua Zalo
   - Hoặc click icon "Copy" để sao chép link và gửi thủ công
6. **Theo dõi phản hồi**:
   - Xem trạng thái: "Đã gửi link", "Xác nhận", "Từ chối"
   - Xem số lượng khách tham dự
   - Đọc lời chúc mừng

### Xuất Danh Sách

Click nút **"Xuất Excel"** để tải file CSV chứa:
- Tên khách mời
- Nhóm
- Số lượng khách
- Trạng thái phản hồi
- Lời chúc
- Link mời
- Ngày tạo

---

## 🛠️ Kỹ Thuật

### Cấu Trúc Admin

- **Component chính**: `App.tsx` (routing admin)
- **Dashboard**: `components/AdminDashboard.tsx`
- **Quản lý khách**: `components/AdminGuestList.tsx`
- **Cấu hình**: `components/AdminSettings.tsx`
- **Tạo link**: `components/LinkGenerator.tsx`

### Cơ Sở Dữ Liệu

Sử dụng **Supabase** để lưu trữ:
- Bảng `weddings`: Thông tin đám cưới
- Bảng `guests`: Danh sách khách mời và phản hồi

---

## ❓ Câu Hỏi Thường Gặp

### Q: Làm sao tìm lại đường dẫn admin?

**A:** Đường dẫn admin được cấu hình trong file `.env.local`. Mặc định là `/admin@5433`. Kiểm tra file hoặc hỏi người cấu hình dự án.

### Q: Quên mật khẩu admin?

**A:** Kiểm tra file `.env.local` hoặc liên hệ với người quản lý kỹ thuật để reset.

### Q: Link mời không hoạt động?

**A:** Đảm bảo:
- Website đang chạy và truy cập được
- Link được copy đầy đủ (bao gồm `?to=Ten_Khach`)
- Tên miền trong link đúng

### Q: Không thấy tab "Khách mời"?

**A:** Đăng nhập vào admin, tab "Khách mời" sẽ hiển thị ở sidebar bên trái (desktop) hoặc menu hamburger (mobile).

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Console log trong trình duyệt (F12)
2. Kết nối Supabase
3. File cấu hình `.env.local`
