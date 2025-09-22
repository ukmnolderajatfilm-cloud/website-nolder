# API Testing Guide - Nolder Admin Panel

## 🧪 **Endpoints untuk Testing dengan Postman**

### **1. Test Database Connection**
```
GET http://localhost:3000/api/test
```
**Response:**
```json
{
  "success": true,
  "message": "Database connected successfully",
  "adminCount": 1,
  "timestamp": "2024-09-22T06:03:59.126Z"
}
```

### **2. Test Admin Login (Simple)**
```
POST http://localhost:3000/api/auth/simple-login
Content-Type: application/json

{
  "username": "AdminN0lder",
  "password": "N0lderFilm2025"
}
```

**Response Success:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "AdminN0lder",
    "role": "superadmin",
    "name": "Admin Nolder"
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "error": "Username atau password salah"
}
```

### **3. Test Admin Login (Original)**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "AdminN0lder",
  "password": "N0lderFilm2025"
}
```

### **4. Test Admin Verification**
```
GET http://localhost:3000/api/auth/verify
Cookie: admin-token=YOUR_TOKEN_HERE
```

### **5. Test Logout**
```
POST http://localhost:3000/api/auth/logout
Cookie: admin-token=YOUR_TOKEN_HERE
```

### **6. Test Content Management**

#### Get All Contents
```
GET http://localhost:3000/api/admin/contents
Cookie: admin-token=YOUR_TOKEN_HERE
```

#### Create New Content
```
POST http://localhost:3000/api/admin/contents
Content-Type: application/json
Cookie: admin-token=YOUR_TOKEN_HERE

{
  "title": "Test Video",
  "description": "This is a test video",
  "platform": "youtube",
  "url": "https://youtube.com/watch?v=test",
  "thumbnail": "/Images/test-thumbnail.jpg",
  "isPublished": true
}
```

#### Update Content
```
PUT http://localhost:3000/api/admin/contents/1
Content-Type: application/json
Cookie: admin-token=YOUR_TOKEN_HERE

{
  "title": "Updated Video Title",
  "description": "Updated description",
  "platform": "youtube",
  "url": "https://youtube.com/watch?v=updated",
  "isPublished": false
}
```

#### Delete Content
```
DELETE http://localhost:3000/api/admin/contents/1
Cookie: admin-token=YOUR_TOKEN_HERE
```

## 🔧 **Setup Postman Collection**

### **Environment Variables:**
- `base_url`: `http://localhost:3000`
- `admin_token`: (akan diisi setelah login)

### **Pre-request Script untuk Auto Token:**
```javascript
// Set token dari login response
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    if (jsonData.success && jsonData.token) {
        pm.environment.set("admin_token", jsonData.token);
    }
}
```

### **Headers untuk Authenticated Requests:**
```
Cookie: admin-token={{admin_token}}
Content-Type: application/json
```

## 🐛 **Debugging Steps**

### **1. Cek Database Connection:**
- Test endpoint `/api/test`
- Pastikan database MySQL running
- Pastikan database `nolder_db` exists

### **2. Cek Admin Data:**
```sql
SELECT * FROM admins;
```

### **3. Cek Password Hash:**
```javascript
// Test di browser console
const bcrypt = require('bcryptjs');
bcrypt.compare('N0lderFilm2025', '$2b$12$5xcou7XoMkD2Lnjl6vM/s.p66hQFZmgHJUeL/.Qtb7l457hQFvBOy')
  .then(result => console.log('Password match:', result));
```

### **4. Cek JWT Token:**
```javascript
// Decode token di jwt.io
// Secret: nolder-film-2025-super-secret-jwt-key
```

## 📝 **Common Issues & Solutions**

### **Issue: "Database connected successfully" tapi login gagal**
**Solution:** Cek password hash di database

### **Issue: "Environment variable not found: DATABASE_URL"**
**Solution:** Pastikan file `.env` ada dan berisi:
```
DATABASE_URL=mysql://root:@localhost:3306/nolder_db
```

### **Issue: "Cannot read properties of undefined"**
**Solution:** Cek import path di API files

### **Issue: Login stuck di "Memproses..."**
**Solution:** 
1. Cek browser console untuk error
2. Test endpoint dengan Postman
3. Cek network tab di browser

## 🚀 **Quick Test Sequence**

1. **Test Database:** `GET /api/test`
2. **Test Login:** `POST /api/auth/simple-login`
3. **Test Dashboard:** Login via browser
4. **Test CRUD:** `GET /api/admin/contents`

## 📊 **Expected Results**

- ✅ Database connection: `adminCount: 1`
- ✅ Login success: `success: true` + token
- ✅ Dashboard access: Redirect to `/admin/dashboard`
- ✅ Content CRUD: Full functionality
