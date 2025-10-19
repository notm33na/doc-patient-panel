# PowerShell script to rename MedicalRecord collection to "Patient Medical Record"
# This script will rename the collection and repopulate with the new structure

Write-Host "🔄 Starting MedicalRecord Collection Rename Process..." -ForegroundColor Green
Write-Host "This will rename 'MedicalRecord' to 'Patient Medical Record' and repopulate with new structure." -ForegroundColor Yellow
Write-Host ""

# Change to backend directory
Set-Location "src/backend"

# Run the rename and repopulate script
Write-Host "Running rename and repopulate script..." -ForegroundColor Cyan
node rename-and-repopulate-medical-records.js

Write-Host ""
Write-Host "Process completed!" -ForegroundColor Green
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
