# 🔧 Hướng Dẫn Sửa Lỗi Audio & Loading

## ✅ Đã Fix

### 1. **Loading lâu khi vào link** ✓
**Vấn đề:** Trang đợi Supabase response, gây loading vòng tròn lâu

**Giải pháp đã áp dụng:**
- ✅ Load DEFAULT_WEDDING_DATA ngay lập tức (instant display)
- ✅ Fetch Supabase trong background
- ✅ Thêm timeout 5 giây cho Supabase query
- ✅ Nếu timeout/error → dùng default data
- ✅ Xóa loading screen, show content ngay

**Kết quả:** Trang hiện **ngay lập tức**, không còn loading lâu!

---

### 2. **Audio không phát được** ✓
**Vấn đề:** Google Drive link format cũ bị deprecated

**Giải pháp đã áp dụng:**
```typescript
// ❌ OLD (không hoạt động)
https://docs.google.com/uc?export=download&id=xxx

// ✅ NEW (hoạt động)
https://drive.google.com/uc?export=open&id=xxx
```

**Cải tiến thêm:**
- ✅ Audio preload = 'auto' (tải trước)
- ✅ Hiển thị loading spinner khi đang tải
- ✅ Hiển thị lỗi nếu không load được (icon đỏ)
- ✅ Better error handling với console logs
- ✅ Auto-pause nếu browser block autoplay

---

## 🎵 Nếu Audio Vẫn Không Hoạt Động

### Option 1: Upload lên Supabase Storage (Recommended)

1. **Vào Supabase Dashboard** → Storage → Create bucket `wedding-music`
2. **Upload file MP3** của bạn
3. **Get Public URL** và update vào database:

```sql
UPDATE weddings 
SET music_url = 'https://[YOUR_PROJECT].supabase.co/storage/v1/object/public/wedding-music/song.mp3'
WHERE slug = 'trang-chien-2026';
```

**Ưu điểm:**
- ✅ Stable, không bị chặn
- ✅ Fast loading
- ✅ CORS-friendly
- ✅ Free tier: 1GB storage

---

### Option 2: Dùng Direct MP3 Link

Host file MP3 trên:
- **Dropbox:** Get direct link (thay `dl=0` → `dl=1`)
- **Google Cloud Storage:** Public bucket
- **Cloudinary:** Free tier
- **Vercel Blob Storage:** Nếu deploy trên Vercel

**Example với Dropbox:**
```
https://www.dropbox.com/s/xxx/song.mp3?dl=1
```

---

### Option 3: Fix Google Drive (Nâng cao)

Nếu muốn giữ Google Drive, cần:

1. **Set file public** (Anyone with link)
2. **Get File ID** từ share link
3. **Dùng format mới:**

```typescript
// Thay vì docs.google.com/uc
https://drive.google.com/uc?export=open&id=[FILE_ID]

// Hoặc dùng proxy endpoint (nếu bị CORS)
https://www.googleapis.com/drive/v3/files/[FILE_ID]?alt=media&key=[API_KEY]
```

⚠️ **Lưu ý:** Google Drive có rate limit, không recommend cho production.

---

## 📊 Các Cải Tiến Khác Đã Làm

### Performance
- ⚡ Instant page load (no more spinner)
- ⚡ 5s timeout cho database
- ⚡ Background data fetching
- ⚡ Better error recovery

### Audio UX
- 🎵 Loading indicator khi đang tải nhạc
- 🎵 Error state (icon đỏ) nếu không load được
- 🎵 Preload audio for smooth playback
- 🎵 Better console logging để debug

### Developer Experience
- 🔧 Clear error messages
- 🔧 Timeout protection
- 🔧 Fallback to default data
- 🔧 Audio error detection

---

## 🧪 Test Cases

### Test 1: First Load
```
✅ Page shows immediately (no loading)
✅ Hero image visible
✅ Music button shows loading spinner
✅ After ~2s, music ready (or error shown)
```

### Test 2: Supabase Timeout
```
✅ After 5s, uses default data
✅ No infinite loading
✅ Console shows timeout warning
```

### Test 3: Audio Error
```
✅ Music button turns red
✅ Console shows error details
✅ Can't click button (disabled)
✅ Page still functional
```

---

## 🚀 Deploy Checklist

Trước khi deploy production:

1. ✅ Test audio URL trong incognito mode
2. ✅ Check console.log cho audio errors
3. ✅ Test trên mobile (slow 3G)
4. ✅ Verify Supabase timeout works
5. ✅ Ensure default data looks good

---

## 💡 Recommended Audio Format

**Best practices:**
- Format: MP3 (universal support)
- Bitrate: 128kbps (balance quality/size)
- Size: < 5MB (for mobile)
- Duration: 2-3 minutes (loop enabled)

**Sample ffmpeg command to compress:**
```bash
ffmpeg -i input.mp3 -b:a 128k -ar 44100 output.mp3
```

---

## 🆘 Troubleshooting

### Issue: "Audio play blocked"
**Cause:** Browser autoplay policy  
**Fix:** User must click music button manually (this is expected)

### Issue: "Failed to load"
**Cause:** Wrong URL format or CORS  
**Fix:** Use Option 1 (Supabase Storage)

### Issue: Audio stutters
**Cause:** Large file size or slow network  
**Fix:** Compress to 128kbps, use CDN

### Issue: "No supported source"
**Cause:** Invalid audio format  
**Fix:** Ensure MP3 format, test URL in browser

---

## 📝 Current Status

✅ **Loading:** FIXED - Instant page display  
✅ **Audio URL:** FIXED - New format  
✅ **Error Handling:** IMPROVED - Clear states  
✅ **UX:** ENHANCED - Loading & error indicators  

🎉 **Trang web giờ load cực nhanh và audio có better error handling!**
