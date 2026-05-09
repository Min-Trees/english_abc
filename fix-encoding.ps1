# Fix encoding: Read as Windows-1252 (what was used to write), convert to UTF-8 bytes, write as UTF-8
$files = @(
    'D:\Job\DNM\abc-english\backend\src\main\java\com\abcenglish\controller\AdminController.java',
    'D:\Job\DNM\abc-english\backend\src\main\java\com\abcenglish\service\TestService.java',
    'D:\Job\DNM\abc-english\backend\src\main\java\com\abcenglish\config\DataInitializer.java'
)

foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::GetEncoding(1252))
    [System.IO.File]::WriteAllText($f, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed: $f"
}
Write-Host "Done. All files rewritten as UTF-8."
