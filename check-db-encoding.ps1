# Check PostgreSQL database encoding
$ErrorActionPreference = 'Continue'
try {
    # Use .NET SqlClient or Npgsql if available
    Add-Type -Path "D:\Job\DNM\abc-english\backend\target\*\npgsql.dll" -ErrorAction SilentlyContinue

    # Try psql via bash/wsl
    $psql = Get-Command psql -ErrorAction SilentlyContinue
    if ($psql) {
        & psql -h localhost -U postgres -d abcenglish -c "SELECT datname, encoding, pg_encoding_to_char(encoding) FROM pg_database WHERE datname='abcenglish';"
    } else {
        Write-Host "psql not found. Checking via .NET..."
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Also check the actual byte values in the stored data
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/tests' -TimeoutSec 10 -UseBasicParsing
    $content = $r.Content
    # Find the title field and show hex of first test title
    if ($content -match '"title"\s*:\s*"([^"]+)"') {
        $title = $Matches[1]
        Write-Host "Title: $title"
        Write-Host "Title bytes (hex):"
        $enc = [System.Text.Encoding]::UTF8
        $bytes = $enc.GetBytes($title)
        $hex = ($bytes | ForEach-Object { '{0:X2}' -f $_ }) -join ' '
        Write-Host $hex
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
