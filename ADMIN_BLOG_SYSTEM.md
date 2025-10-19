# 📝 Admin Blog Management System

Sistem manajemen blog yang lengkap dengan desain Medium-style untuk Nol Derajat Film. Sistem ini memungkinkan admin untuk membuat, mengedit, dan mengelola artikel blog dengan antarmuka yang intuitif dan profesional.

## 🚀 **Fitur Utama**

### ✨ **Admin Features**
- **Dashboard Analytics**: Statistik artikel, kategori, dan aktivitas
- **Article Management**: CRUD lengkap untuk artikel
- **Category Management**: Kelola kategori artikel
- **Medium-style Editor**: Interface penulisan yang mirip Medium
- **Image Upload**: Upload dan kelola gambar featured
- **Publish Control**: Draft, publish, dan archive artikel
- **Real-time Preview**: Preview artikel sebelum publish

### 🎨 **UI/UX Features**
- **Responsive Design**: Optimal di semua device
- **Medium-inspired Interface**: Desain yang clean dan profesional
- **Smooth Animations**: Framer Motion untuk transisi yang halus
- **Dark/Light Theme**: Tema yang konsisten dengan brand
- **Intuitive Navigation**: Navigasi yang mudah dipahami

## 🗄️ **Database Schema**

### **Articles Table**
```sql
- id (Primary Key)
- title (String)
- slug (String, Unique)
- excerpt (Text, Optional)
- content (Text)
- featured_image (String, Optional)
- status (Enum: draft, published, archived)
- published_at (DateTime, Optional)
- read_time (Integer, minutes)
- view_count (Integer, default: 0)
- created_at (DateTime)
- updated_at (DateTime)
- deleted_at (DateTime, Optional)
- category_id (Foreign Key)
- admin_id (Foreign Key)
```

### **ArticleCategories Table**
```sql
- id (Primary Key)
- category_name (String)
- slug (String, Unique)
- description (Text, Optional)
- is_active (Boolean, default: true)
- created_at (DateTime)
- updated_at (DateTime)
```

## 🛠️ **Setup & Installation**

### **1. Database Setup**
```bash
# Generate Prisma client
npm run db:generate

# Run migration (jika database sudah ada)
npx prisma migrate dev --name add_blog_tables

# Atau setup lengkap dengan seeding
npm run blog:setup
```

### **2. Manual Setup**
```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Run migration
npx prisma migrate dev --name add_blog_tables

# 3. Seed data
npm run blog:seed
```

## 📁 **File Structure**

```
src/app/admin/
├── layout.jsx                 # Admin layout wrapper
├── page.jsx                   # Dashboard utama
├── components/
│   └── AdminNav.jsx          # Navigation component
└── blog/
    ├── page.jsx              # List semua artikel
    ├── create/
    │   └── page.jsx          # Halaman create artikel
    ├── edit/
    │   └── [id]/
    │       └── page.jsx      # Halaman edit artikel
    └── categories/
        └── page.jsx          # Kelola kategori

src/app/api/admin/
├── articles/
│   ├── route.js              # GET, POST articles
│   └── [id]/
│       ├── route.js          # GET, PUT, DELETE article
│       └── publish/
│           └── route.js      # Publish/Unpublish
└── categories/
    ├── route.js              # GET, POST categories
    └── [id]/
        └── route.js          # GET, PUT, DELETE category

src/app/api/blog/
├── posts/
│   └── route.js              # Public API untuk blog
└── categories/
    └── route.js              # Public API untuk kategori

scripts/
├── setup-blog-system.js      # Setup lengkap
└── seed-blog-data.js         # Seed data awal
```

## 🎯 **API Endpoints**

### **Admin API**

#### **Articles**
- `GET /api/admin/articles` - List semua artikel dengan filter
- `POST /api/admin/articles` - Create artikel baru
- `GET /api/admin/articles/[id]` - Get single article
- `PUT /api/admin/articles/[id]` - Update article
- `DELETE /api/admin/articles/[id]` - Soft delete article
- `POST /api/admin/articles/[id]/publish` - Publish article
- `DELETE /api/admin/articles/[id]/publish` - Unpublish article

#### **Categories**
- `GET /api/admin/categories` - List semua kategori
- `POST /api/admin/categories` - Create kategori baru
- `GET /api/admin/categories/[id]` - Get single category
- `PUT /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category

### **Public API**

#### **Blog Posts**
- `GET /api/blog/posts` - Get published articles (untuk frontend)
- `GET /api/blog/categories` - Get active categories

## 🎨 **UI Components**

### **Admin Dashboard**
- **Stats Cards**: Total articles, published, drafts, categories
- **Quick Actions**: Create article, manage categories, view all
- **Recent Articles**: List artikel terbaru dengan status

### **Article Management**
- **Article List**: Table dengan filter, search, pagination
- **Status Badges**: Visual indicator untuk draft/published
- **Bulk Actions**: Publish, unpublish, delete multiple articles

### **Article Editor (Medium-style)**
- **Clean Interface**: Minimalist design seperti Medium
- **Rich Text Editor**: Textarea dengan word count
- **Image Upload**: Drag & drop atau click to upload
- **Auto-save**: Draft otomatis tersimpan
- **Preview**: Real-time preview artikel

### **Category Management**
- **CRUD Interface**: Create, edit, delete categories
- **Article Count**: Jumlah artikel per kategori
- **Validation**: Prevent delete kategori yang memiliki artikel

## 🔧 **Configuration**

### **Environment Variables**
```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-jwt-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### **Prisma Schema**
```prisma
model Article {
  id            Int            @id @default(autoincrement())
  title         String
  slug          String         @unique
  excerpt       String?        @db.Text
  content       String         @db.Text
  featuredImage String?        @map("featured_image")
  status        ArticleStatus  @default(draft)
  publishedAt   DateTime?      @map("published_at")
  readTime      Int?           @map("read_time")
  viewCount     Int            @default(0) @map("view_count")
  createdAt     DateTime       @default(now()) @map("created_at")
  updatedAt     DateTime       @updatedAt @map("updated_at")
  deletedAt     DateTime?      @map("deleted_at")
  categoryId    Int            @map("category_id")
  category      ArticleCategory @relation(fields: [categoryId], references: [id])
  adminId       Int            @map("admin_id")
  admin         Admin          @relation(fields: [adminId], references: [id])
}

model ArticleCategory {
  id           Int       @id @default(autoincrement())
  categoryName String    @map("category_name")
  slug         String    @unique
  description  String?
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  articles     Article[]
}

enum ArticleStatus {
  draft
  published
  archived
}
```

## 🚀 **Usage Guide**

### **1. Access Admin Panel**
```
http://localhost:3000/admin
```

### **2. Create New Article**
1. Go to `/admin/blog/create`
2. Upload featured image (optional)
3. Write title, excerpt, and content
4. Select category
5. Choose status (draft/published)
6. Click "Publish" or "Save Draft"

### **3. Manage Articles**
1. Go to `/admin/blog`
2. Use filters to find specific articles
3. Click "Edit" to modify article
4. Use "Publish/Unpublish" to change status
5. Click "Delete" to remove article

### **4. Manage Categories**
1. Go to `/admin/blog/categories`
2. Click "Add New Category"
3. Enter category name and description
4. Click "Create Category"
5. Edit or delete existing categories

## 🔒 **Security Features**

- **Admin Authentication**: Hanya admin yang bisa akses
- **Input Validation**: Validasi semua input data
- **SQL Injection Protection**: Menggunakan Prisma ORM
- **XSS Protection**: Sanitasi content
- **File Upload Security**: Validasi file type dan size

## 📊 **Logging & Monitoring**

- **Request Logging**: Log semua API requests
- **Performance Monitoring**: Track response times
- **Error Logging**: Log errors dengan detail
- **Admin Actions**: Log semua admin activities

## 🎯 **Best Practices**

### **Content Management**
- Gunakan excerpt yang menarik untuk SEO
- Upload gambar dengan ukuran optimal
- Kategorisasi artikel dengan konsisten
- Update artikel secara berkala

### **Performance**
- Optimize gambar sebelum upload
- Gunakan pagination untuk list panjang
- Implement caching untuk static content
- Monitor database performance

### **SEO**
- Gunakan slug yang SEO-friendly
- Tulis meta description yang baik
- Optimize gambar dengan alt text
- Structure content dengan heading yang jelas

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Database Connection Error**
   ```bash
   # Check DATABASE_URL in .env
   # Run: npx prisma generate
   ```

2. **Migration Failed**
   ```bash
   # Reset database
   npx prisma migrate reset
   # Or manual migration
   npx prisma migrate dev --name add_blog_tables
   ```

3. **Image Upload Error**
   ```bash
   # Check upload directory permissions
   # Verify file size limits
   ```

4. **Admin Access Denied**
   ```bash
   # Check authentication middleware
   # Verify admin credentials
   ```

## 🚀 **Deployment**

### **Production Setup**
1. Set environment variables
2. Run database migration
3. Seed initial data
4. Build and deploy application

```bash
# Production deployment
npm run build
npm run db:deploy
npm run blog:seed
npm start
```

## 📈 **Future Enhancements**

- **Rich Text Editor**: WYSIWYG editor
- **Media Library**: Centralized media management
- **SEO Tools**: Meta tags, sitemap generation
- **Analytics**: Article performance metrics
- **Comments System**: User engagement features
- **Multi-language**: Internationalization support
- **API Documentation**: Swagger/OpenAPI docs

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 **License**

This project is part of Nol Derajat Film website and follows the same license terms.

---

**🎉 Happy Blogging with Nol Derajat Film! 🎬**
