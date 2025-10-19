# 🧪 API Endpoint Testing Guide

## Prerequisites
1. Make sure the backend server is running on port 5000
2. MongoDB Atlas connection should be established

## Manual Testing Steps

### 1. Start Backend Server
```bash
cd src/backend
npm run dev
```
Expected output: `🚀 Server running on port 5000`

### 2. Test Server Health
```bash
curl http://localhost:5000/api
```
Expected: Should return some response (even if error, server is running)

### 3. Test User Registration
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123",
    "role": "patient"
  }'
```
Expected: Success response with user data

### 4. Test User Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
Expected: Success response with JWT token

### 5. Test Get All Users
```bash
curl http://localhost:5000/api/
```
Expected: Array of users

### 6. Test Add User (Admin endpoint)
```bash
curl -X POST http://localhost:5000/api/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Patient",
    "email": "patient@example.com",
    "password": "password123", 
    "role": "patient"
  }'
```
Expected: Success response with new user data

## Using PowerShell (Windows)

### Test with Invoke-RestMethod
```powershell
# Test registration
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    role = "patient"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/signup" -Method Post -Body $body -ContentType "application/json"
```

## Expected Results
- ✅ All endpoints should return HTTP 200/201 for success
- ✅ MongoDB Atlas connection should be established
- ✅ JWT tokens should be generated for login
- ✅ User data should be stored in MongoDB Atlas

## Troubleshooting
- If connection refused: Backend server not running
- If MongoDB errors: Check .env file and Atlas connection
- If 404 errors: Check route definitions in UserRoute.js
