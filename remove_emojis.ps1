# Script to remove emoji icons from diagram files
# Usage: .\remove_emojis.ps1

Write-Host "Removing emoji icons from diagram files..." -ForegroundColor Green

$files = @(
    "docs/ActivityDiagram.puml",
    "docs/SequenceDiagram.puml",
    "docs/ClassDiagram.puml",
    "docs/EntityDiagram.puml"
)

foreach ($file in $files) {
    $filePath = "$PSScriptRoot\$file"
    
    if (Test-Path $filePath) {
        Write-Host "Processing: $file" -ForegroundColor Cyan
        
        # Read file content
        $content = Get-Content -Path $filePath -Raw -Encoding UTF8
        
        # Remove emoji patterns (common emoji unicode ranges)
        $content = $content -replace '[\p{Cs}\p{Cn}\p{Co}\p{Mc}\p{Me}\p{Mn}\p{So}]', ''
        $content = $content -replace '[\u1F300-\u1F9FF]', ''  # Miscellaneous Symbols and Pictographs, Emoticons, etc.
        $content = $content -replace '[\u2600-\u27BF]', ''    # Miscellaneous Symbols
        $content = $content -replace '[\u2300-\u23FF]', ''    # Miscellaneous Technical
        $content = $content -replace '[\u2000-\u206F]', ''    # General Punctuation
        
        # More specific emoji patterns
        $emojiPattern = '[' + 
            '\u00A9\u00AE\u203C\u2047-\u2049\u2122\u2139\u3030' +
            '\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{1F191}-\u{1F19A}' +
            '\u{1F201}\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F236}\u{1F238}-\u{1F23A}\u{1F250}-\u{1F251}' +
            '\u{1F300}-\u{1F321}\u{1F324}-\u{1F393}\u{1F396}-\u{1F397}\u{1F399}-\u{1F3F0}\u{1F3F3}-\u{1F3F5}' +
            '\u{1F3F7}-\u{1F4FD}\u{1F4FF}-\u{1F53D}\u{1F549}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F595}-\u{1F596}' +
            '\u{1F5A4}\u{1F5FB}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F910}-\u{1F9FF}' +
            ']+'
        
        # Write back to file
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        
        Write-Host "  Completed: $file" -ForegroundColor Green
    } else {
        Write-Host "  File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nEmoji removal completed!" -ForegroundColor Green
