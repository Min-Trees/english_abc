$ErrorActionPreference = 'Continue'
try {
    $body = @{ username = "admin"; password = "admin123" } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 10
    Write-Host "Login response:"
    $resp | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
