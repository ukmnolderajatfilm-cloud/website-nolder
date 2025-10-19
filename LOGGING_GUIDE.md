# 📋 Logging System Guide - Nolder Rajat Film

## 🎯 Overview

Project ini sekarang memiliki sistem logging yang komprehensif menggunakan **Winston** untuk memudahkan debugging dan monitoring aplikasi.

## 📁 Struktur Log Files

```
logs/
├── error-YYYY-MM-DD.log      # Error logs (14 hari retention)
├── combined-YYYY-MM-DD.log   # Semua logs (14 hari retention)
├── http-YYYY-MM-DD.log       # HTTP request logs (7 hari retention)
└── debug-YYYY-MM-DD.log      # Debug logs (3 hari retention, dev only)
```

## 🔧 Konfigurasi Logger

### Log Levels
- **error** (0) - Error messages
- **warn** (1) - Warning messages  
- **info** (2) - Informational messages
- **http** (3) - HTTP request logs
- **debug** (4) - Debug messages (development only)

### Environment-based Logging
- **Development**: Semua level logs ditampilkan di console + file
- **Production**: Hanya warn+ level di console, info+ level di file

## 📝 Cara Menggunakan Logger

### 1. Import Logger
```javascript
const { logger, error, warn, info, http, debug } = require('../../lib/logger');
```

### 2. Basic Logging
```javascript
// Basic logging
logger.info('User logged in successfully');
logger.error('Database connection failed');
logger.warn('File size exceeds recommended limit');

// With metadata
logger.info('API request processed', {
  userId: 123,
  endpoint: '/api/films',
  responseTime: '150ms'
});
```

### 3. Specialized Logging Functions

#### Authentication Logging
```javascript
logger.auth('Login successful', 'admin', true, {
  adminId: 1,
  role: 'admin',
  ip: '192.168.1.1'
});

logger.auth('Login failed', 'hacker', false, {
  reason: 'invalid_password',
  ip: '192.168.1.100'
});
```

#### File Upload Logging
```javascript
logger.fileUpload('image.jpg', 1024000, true, null); // Success
logger.fileUpload('virus.exe', 2048000, false, 'Invalid file type'); // Failed
```

#### Database Operation Logging
```javascript
logger.dbOperation('CREATE', 'films', { title: 'New Movie', year: 2024 });
logger.dbOperation('UPDATE', 'admin', { lastLogin: new Date() });
```

#### Performance Logging
```javascript
logger.performance('Database Query', 250, {
  query: 'SELECT * FROM films',
  recordCount: 150
});
```

#### API Request Logging
```javascript
logger.apiRequest(req, res, 120); // Automatically logs method, URL, status, response time
```

## 🚀 Contoh Implementasi

### API Route dengan Logging
```javascript
export async function POST(request) {
  const startTime = Date.now();
  
  try {
    logger.info('API request started', { 
      method: 'POST',
      url: request.url,
      ip: request.ip 
    });

    // Your business logic here
    const result = await processRequest(request);
    
    const responseTime = Date.now() - startTime;
    logger.performance('API Response', responseTime, {
      success: true,
      recordCount: result.length
    });

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    logger.error('API error', {
      error: error.message,
      stack: error.stack,
      ip: request.ip,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
```

## 📊 Monitoring & Debugging

### 1. Real-time Monitoring
```bash
# Monitor error logs
tail -f logs/error-$(date +%Y-%m-%d).log

# Monitor all logs
tail -f logs/combined-$(date +%Y-%m-%d).log

# Monitor HTTP requests
tail -f logs/http-$(date +%Y-%m-%d).log
```

### 2. Log Analysis
```bash
# Count errors today
grep -c "ERROR" logs/error-$(date +%Y-%m-%d).log

# Find specific user activity
grep "admin" logs/combined-$(date +%Y-%m-%d).log

# Check API performance
grep "Performance" logs/combined-$(date +%Y-%m-%d).log
```

### 3. Log Rotation
- Logs otomatis di-rotate setiap hari
- File lama otomatis dihapus sesuai retention policy
- Ukuran file dibatasi 20MB per file

## 🔍 Debugging Tips

### 1. Error Investigation
```bash
# Cari error berdasarkan waktu
grep "2024-10-19 14:30" logs/error-2024-10-19.log

# Cari error dengan stack trace
grep -A 10 "Database connection failed" logs/error-2024-10-19.log
```

### 2. Performance Analysis
```bash
# Cari operasi lambat (>1 detik)
grep "Performance.*[1-9][0-9][0-9][0-9]ms" logs/combined-2024-10-19.log

# Analisis response time API
grep "API Response" logs/combined-2024-10-19.log | jq '.duration'
```

### 3. Security Monitoring
```bash
# Monitor login attempts
grep "Authentication" logs/combined-2024-10-19.log

# Monitor file uploads
grep "File Upload" logs/combined-2024-10-19.log
```

## 🛠️ Customization

### Menambah Log Level Baru
```javascript
// Di src/lib/logger.js
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  custom: 5  // Level baru
};
```

### Menambah Transport Baru
```javascript
// Contoh: Log ke database
new winston.transports.Database({
  db: 'mongodb://localhost:27017/logs',
  collection: 'app_logs'
})
```

## 📈 Best Practices

1. **Jangan log sensitive data** (password, token, dll)
2. **Gunakan structured logging** dengan metadata yang relevan
3. **Log level yang tepat** - jangan spam debug di production
4. **Include context** - IP, user ID, request ID untuk tracing
5. **Monitor log size** - pastikan tidak menghabiskan disk space
6. **Regular cleanup** - hapus log lama sesuai retention policy

## 🚨 Troubleshooting

### Log tidak muncul?
1. Cek permission folder `logs/`
2. Cek environment variable `NODE_ENV`
3. Cek disk space
4. Cek winston configuration

### Log terlalu banyak?
1. Adjust log level di production
2. Reduce debug logging
3. Check for infinite loops yang generate logs

### Performance issue?
1. Check log file size
2. Consider async logging
3. Review log retention policy

---

**Happy Debugging! 🐛✨**
