# API Testing Script for Tabeeb Backend (PowerShell)
# Run this script to test all API endpoints

Write-Host "🧪 Testing Tabeeb Backend API Endpoints" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow

# Base URL
$BASE_URL = "http://localhost:5000/api"

# Function to test endpoint
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Data = $null,
        [string]$Description
    )
    
    Write-Host "`nTesting: $Description" -ForegroundColor Cyan
    Write-Host "Endpoint: $Method $BASE_URL$Endpoint" -ForegroundColor Gray
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri "$BASE_URL$Endpoint" -Method Get -ErrorAction Stop
        } elseif ($Method -eq "POST") {
            $headers = @{"Content-Type" = "application/json"}
            $response = Invoke-RestMethod -Uri "$BASE_URL$Endpoint" -Method Post -Body $Data -Headers $headers -ErrorAction Stop
        }
        
        Write-Host "✅ SUCCESS" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor White
    }
    catch {
        Write-Host "❌ FAILED" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test MongoDB Connection
Write-Host "`n🔍 Testing MongoDB Atlas Connection..." -ForegroundColor Yellow
try {
    Set-Location "src\backend"
    node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ MongoDB Atlas Connected')).catch(err => console.log('❌ MongoDB Atlas Failed:', err.message))"
    Set-Location "..\.."
}
catch {
    Write-Host "❌ Could not test MongoDB connection" -ForegroundColor Red
}

# Test API Endpoints
Write-Host "`n1. Testing Server Health" -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Endpoint "/" -Description "Server Health Check"

Write-Host "`n2. Testing User Registration" -ForegroundColor Yellow
$signupData = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    role = "patient"
} | ConvertTo-Json
Test-Endpoint -Method "POST" -Endpoint "/signup" -Data $signupData -Description "User Registration"

Write-Host "`n3. Testing User Login" -ForegroundColor Yellow
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json
Test-Endpoint -Method "POST" -Endpoint "/login" -Data $loginData -Description "User Login"

Write-Host "`n4. Testing Get Users" -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Endpoint "/" -Description "Get All Users"

Write-Host "`n5. Testing Add User" -ForegroundColor Yellow
$addUserData = @{
    name = "New Patient"
    email = "patient@example.com"
    password = "password123"
    role = "patient"
} | ConvertTo-Json
Test-Endpoint -Method "POST" -Endpoint "/" -Data $addUserData -Description "Add New User"

Write-Host "`n✅ API Testing Complete!" -ForegroundColor Green
