$f = 'D:\Job\DNM\abc-english\backend\src\main\java\com\abcenglish\controller\AdminController.java'
$content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
if ($content.Contains([char]0xFEFF)) {
    Write-Host "BOM found"
} else {
    Write-Host "No BOM"
}
# Check for non-ASCII
$bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
$nonAscii = @()
for ($i = 0; $i -lt $bytes.Length; $i++) {
    if ($bytes[$i] -ge 128) {
        $nonAscii += "Pos $i : 0x$($bytes[$i].ToString('X2'))"
    }
}
Write-Host "Non-ASCII bytes found: $($nonAscii.Count)"
Write-Host "First 10:"
$nonAscii[0..9] | ForEach-Object { Write-Host $_ }
