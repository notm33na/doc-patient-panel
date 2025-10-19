# PowerShell script to test duplicate email/phone prevention
# This script tests that no patient can use the same email or phone to create multiple accounts

Write-Host "🧪 Testing Duplicate Email/Phone Prevention" -ForegroundColor Green
Write-Host "This will test that patients cannot create multiple accounts with the same email or phone." -ForegroundColor Yellow
Write-Host ""

# Change to backend directory
Set-Location "src/backend"

# Run the test script
Write-Host "Running duplicate prevention test..." -ForegroundColor Cyan
node test-duplicate-prevention.js

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Green
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
