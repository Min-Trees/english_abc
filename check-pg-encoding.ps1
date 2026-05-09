# Check PostgreSQL database encoding using .NET System.Data
$ErrorActionPreference = 'Continue'
try {
    Add-Type -AssemblyName System.Data

    $builder = New-Object System.Data.Odbc.OdbcConnectionStringBuilder
    $builder["Driver"] = "{PostgreSQL Unicode}"
    $builder["Server"] = "localhost"
    $builder["Port"] = "5432"
    $builder["Database"] = "abcenglish"
    $builder["Uid"] = "postgres"
    $builder["Pwd"] = "password"

    $conn = New-Object System.Data.Odbc.OdbcConnection($builder.ConnectionString)
    $conn.Open()

    $cmd = $conn.CreateCommand()
    $cmd.CommandText = "SELECT datname, encoding, pg_encoding_to_char(encoding) as encoding_name FROM pg_database WHERE datname = 'abcenglish'"
    $reader = $cmd.ExecuteReader()
    while ($reader.Read()) {
        Write-Host "Database: $($reader['datname'])"
        Write-Host "Encoding ID: $($reader['encoding'])"
        Write-Host "Encoding Name: $($reader['encoding_name'])"
    }
    $reader.Close()

    $conn.Close()
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
