$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$sourcePath = "."
$destinationPath = "../Lejebolig_Nu_Backup_$timestamp.zip"

# Create backup
Compress-Archive -Path $sourcePath\* -DestinationPath $destinationPath -Force

Write-Host "Backup created successfully at: $destinationPath"
