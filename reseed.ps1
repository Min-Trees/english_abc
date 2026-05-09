$ErrorActionPreference = 'Continue'
try {
    $body = @{ username = "admin"; password = "admin123" } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 10
    $token = $resp.data.token
    Write-Host "Token obtained: $($token.Substring(0, 30))..."
} catch {
    Write-Host "Login error: $($_.Exception.Message)"; exit
}

try {
    $headers = @{ "Authorization" = "Bearer $token" }
    $r = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/reseed' -Method POST -Headers $headers -ContentType 'application/json' -TimeoutSec 15
    Write-Host "Reseed response: $($r | ConvertTo-Json)"
} catch {
    Write-Host "Reseed error: $($_.Exception.Message)"
}

Start-Sleep -Seconds 2
try {
    $tests = Invoke-RestMethod -Uri 'http://localhost:8080/api/tests' -Method GET -TimeoutSec 10
    Write-Host "`nTests count: $($tests.Count)"
    foreach ($t in $tests) {
        Write-Host "  - $($t.title): $($t.totalQuestions) questions"
    }
} catch {
    Write-Host "Verify error: $($_.Exception.Message)"
}
