# Script untuk monitoring blog logs secara live
# Jalankan dengan: .\watch-blog-logs.ps1

Write-Host "🔍 Monitoring Blog Logs Live..." -ForegroundColor Green
Write-Host "Tekan Ctrl+C untuk berhenti" -ForegroundColor Yellow
Write-Host ""

# Cek apakah file log ada
if (Test-Path "logs\combined-2025-10-19.log") {
    Write-Host "✅ Log file ditemukan: logs\combined-2025-10-19.log" -ForegroundColor Green
    Write-Host ""
    
    # Monitor log file secara real-time
    Get-Content "logs\combined-2025-10-19.log" -Wait -Tail 10 | ForEach-Object {
        try {
            $logEntry = $_ | ConvertFrom-Json
            
            # Filter hanya blog-related logs
            if ($logEntry.message -like "*Blog*" -or $logEntry.message -like "*blog*") {
                $timestamp = $logEntry.timestamp
                $level = $logEntry.level
                $message = $logEntry.message
                
                # Warna berdasarkan level
                $color = switch ($level) {
                    "error" { "Red" }
                    "warn" { "Yellow" }
                    "info" { "Cyan" }
                    "debug" { "Gray" }
                    default { "White" }
                }
                
                Write-Host "[$timestamp] [$level] $message" -ForegroundColor $color
                
                # Tampilkan detail tambahan jika ada
                if ($logEntry.duration) {
                    Write-Host "  ⏱️  Duration: $($logEntry.duration)" -ForegroundColor Gray
                }
                if ($logEntry.page) {
                    Write-Host "  📄 Page: $($logEntry.page)" -ForegroundColor Gray
                }
                if ($logEntry.returnedPosts) {
                    Write-Host "  📝 Posts: $($logEntry.returnedPosts)" -ForegroundColor Gray
                }
                if ($logEntry.category) {
                    Write-Host "  🏷️  Category: $($logEntry.category)" -ForegroundColor Gray
                }
                Write-Host ""
            }
        } catch {
            # Jika bukan JSON, tampilkan sebagai plain text
            if ($_ -like "*Blog*" -or $_ -like "*blog*") {
                Write-Host $_ -ForegroundColor White
            }
        }
    }
} else {
    Write-Host "❌ Log file tidak ditemukan: logs\combined-2025-10-19.log" -ForegroundColor Red
    Write-Host "Pastikan server sudah berjalan dan ada aktivitas logging" -ForegroundColor Yellow
}