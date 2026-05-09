$ErrorActionPreference = 'Continue'
try {
    # Login and get token
    $body = @{ username = "admin"; password = "admin123" } | ConvertTo-Json
    $resp = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 10
    $token = $resp.data.token
    $headers = @{ "Authorization" = "Bearer $token" }

    # Get all tests first
    $tests = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/tests' -Headers $headers -TimeoutSec 10
    Write-Host "Found $($tests.Count) tests"

    # Delete all tests
    foreach ($t in $tests) {
        Invoke-RestMethod -Uri "http://localhost:8080/api/admin/tests/$($t.id)" -Headers $headers -Method DELETE -TimeoutSec 10 | Out-Null
        Write-Host "Deleted test $($t.id)"
    }

    # Now create fresh tests using the reseed endpoint
    $r = Invoke-RestMethod -Uri 'http://localhost:8080/api/admin/reseed' -Method POST -Headers $headers -ContentType 'application/json' -TimeoutSec 15
    Write-Host "Reseed: $($r | ConvertTo-Json -Compress)"

} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
