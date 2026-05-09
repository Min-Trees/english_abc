# Check the actual bytes stored in the test title column in PostgreSQL
$ErrorActionPreference = 'Continue'
try {
    # Direct PostgreSQL connection via PowerShell
    $connString = "Host=localhost;Port=5432;Database=abcenglish;Username=postgres;Password=password"
    # Try using psql if available, otherwise try .NET

    # Try reading directly via pg
    $result = Invoke-WebRequest -Uri "http://localhost:8080/api/tests" -TimeoutSec 5 -UseBasicParsing
    Write-Host "Raw bytes from API:"
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($result.Content)
    Write-Host "First 50 bytes:"
    for ($i = 0; $i -lt [Math]::Min(50, $bytes.Length); $i++) {
        Write-Host ("{0:X2} " -f $bytes[$i]) -NoNewline
    }
    Write-Host ""
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
