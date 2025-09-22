# Admin Panel - Nolder Rajat Film

## Akses Admin Panel

### Cara Mengakses:
1. **Triple Click** pada logo Nolder di pojok kiri atas halaman utama
2. Atau langsung akses: `http://localhost:3000/admin/login`

### Kredensial Admin:

| Username | Password | Level |
|----------|----------|-------|
| `admin` | `nolder2024` | Admin |
| `superadmin` | `nolderfilm2024` | Super Admin |
| `manager` | `nolderstudio2024` | Manager |

## Fitur Admin Panel:

### 🔐 **Keamanan:**
- Autentikasi berbasis username/password
- Session management dengan localStorage
- Middleware proteksi halaman admin
- Auto-redirect jika tidak login
- Logout otomatis

### 📊 **Dashboard:**
- Statistik konten (Projects, Videos, Followers, Engagement)
- Quick Actions untuk manajemen konten
- Recent Activity log
- Security notice

### 🎨 **Design:**
- Minimalis dan profesional
- Glass morphism effect
- Responsive design
- Smooth animations dengan Framer Motion

## File Structure:

```
src/app/admin/
├── layout.jsx          # Admin layout
├── page.jsx            # Redirect ke login
├── login/page.jsx      # Halaman login
├── dashboard/page.jsx  # Dashboard admin
└── admin.css          # Admin styles

src/middleware.js       # Proteksi halaman admin
```

## Security Notes:

⚠️ **PENTING:**
- Ganti password default sebelum production
- Implementasi database untuk user management
- Tambahkan rate limiting untuk login attempts
- Gunakan HTTPS di production
- Implementasi proper session management dengan JWT

## Development:

```bash
# Akses admin panel
http://localhost:3000/admin/login

# Dashboard setelah login
http://localhost:3000/admin/dashboard
```

## Next Steps untuk Production:

1. **Database Integration:**
   - User management dengan database
   - Role-based access control
   - Audit logging

2. **Enhanced Security:**
   - JWT tokens
   - Password hashing (bcrypt)
   - Rate limiting
   - CSRF protection

3. **Features:**
   - Content management
   - User analytics
   - File upload system
   - Email notifications
