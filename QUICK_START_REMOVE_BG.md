# 🚀 Quick Start: Remove.bg Setup

## ⚠️ Kenapa Background Tidak Terhapus?

Jika Anda melihat pesan ini di console:
```
Remove.bg API key not configured, returning original image
```

Artinya **API key belum di-setup**. Ikuti langkah berikut:

---

## 📝 Setup dalam 3 Langkah

### 1️⃣ Dapatkan API Key (GRATIS)

1. Buka: https://www.remove.bg/users/sign_up
2. Daftar dengan email Anda
3. Verifikasi email
4. Login ke dashboard: https://www.remove.bg/dashboard
5. Copy API key Anda

**Gratis 50 gambar/bulan!** ✨

---

### 2️⃣ Tambahkan ke File `.env`

Buat file `.env` di root project (jika belum ada):

```env
# Database (sudah ada)
DATABASE_URL="mysql://..."
JWT_SECRET="..."

# Tambahkan ini untuk Remove.bg
REMOVE_BG_API_KEY="your-api-key-here-paste-disini"
```

**⚠️ PENTING:** 
- Ganti `your-api-key-here-paste-disini` dengan API key Anda yang sebenarnya
- Jangan commit file `.env` ke git!

---

### 3️⃣ Restart Server

```bash
# Stop server (Ctrl+C)
# Lalu jalankan lagi:
npm run dev
```

---

## ✅ Cara Test Apakah Sudah Berfungsi

1. **Buka halaman user**: http://localhost:3000
2. **Buka Console** (F12 → Console tab)
3. **Lihat log:**

### ✅ Berhasil:
```
Processing 13 member images...
✓ Background removed for: Khansa (new)
✓ Background removed for: Ulfa (cached)
✓ Background removed for: Tania (new)
...
```

### ❌ Masih Error:
```
Remove.bg API key not configured, returning original image
```
→ API key belum di-set atau server belum di-restart

---

## 🎯 Mode Development (Skip Background Removal)

Jika Anda ingin **skip background removal** saat development (untuk hemat quota):

Tambahkan di `.env`:
```env
NEXT_PUBLIC_ENABLE_BG_REMOVAL=false
```

Atau comment code di `CabinetCarousel.jsx` line 43-48.

---

## 🔍 Troubleshooting

### Problem: "API key not configured"
**Solution:** 
- Pastikan API key sudah di `.env`
- Restart server dengan `npm run dev`
- Check typo di nama variable: `REMOVE_BG_API_KEY`

### Problem: "API quota exceeded"
**Solution:**
- Check dashboard: https://www.remove.bg/dashboard
- Upgrade ke paid plan atau tunggu bulan depan
- Gambar yang sudah diproses tetap ter-cache

### Problem: Background tidak hilang
**Solution:**
- Check console untuk error messages
- Pastikan gambar accessible (bukan localhost)
- Try manual test: https://www.remove.bg/upload

---

## 📊 Monitoring API Usage

Check berapa banyak API calls yang sudah dipakai:
1. Login ke: https://www.remove.bg/dashboard
2. Lihat "API Calls This Month"
3. Free tier: 50 calls/month

---

## 💡 Tips

### Hemat Quota:
1. ✅ Gunakan caching (sudah built-in)
2. ✅ Process hanya saat upload (optional)
3. ✅ Skip default images
4. ✅ Test dengan sedikit member dulu

### Optimal Usage:
- First load: API calls dibuat
- Subsequent loads: Pakai cache (instant!)
- Processed images disimpan di: `/public/uploads/processed/`

---

## 🎨 Hasil yang Diharapkan

**Before (Original):**
```
/uploads/1234567890-photo.jpg
→ Foto dengan background
```

**After (Processed):**
```
/uploads/processed/nobg-1234567890-photo.jpg
→ Foto tanpa background (transparent PNG)
```

---

## 📞 Need Help?

1. Check full documentation: `REMOVE_BG_SETUP.md`
2. Remove.bg support: support@remove.bg
3. API docs: https://www.remove.bg/api/documentation

---

## ⚡ Quick Commands

```bash
# Restart server
npm run dev

# Check if .env is loaded
# Add console.log in route.js to verify

# Clear cache (if needed)
rm -rf public/uploads/processed/*
```

---

**Ready to go!** 🚀 
Setelah setup API key dan restart server, background removal akan bekerja otomatis!
