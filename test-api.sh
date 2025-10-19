#!/bin/bash
# API Testing Script for Tabeeb Backend

echo "🧪 Testing Tabeeb Backend API Endpoints"
echo "======================================"

# Base URL
BASE_URL="http://localhost:5000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "Endpoint: $method $BASE_URL$endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ SUCCESS (HTTP $http_code)${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}❌ FAILED (HTTP $http_code)${NC}"
        echo "Response: $body"
    fi
}

echo -e "\n${YELLOW}1. Testing Server Health${NC}"
test_endpoint "GET" "/" "" "Server Health Check"

echo -e "\n${YELLOW}2. Testing User Registration${NC}"
test_endpoint "POST" "/signup" '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "patient"
}' "User Registration"

echo -e "\n${YELLOW}3. Testing User Login${NC}"
test_endpoint "POST" "/login" '{
    "email": "test@example.com",
    "password": "password123"
}' "User Login"

echo -e "\n${YELLOW}4. Testing Get Users${NC}"
test_endpoint "GET" "/" "" "Get All Users"

echo -e "\n${YELLOW}5. Testing Add User${NC}"
test_endpoint "POST" "/" '{
    "name": "New Patient",
    "email": "patient@example.com",
    "password": "password123",
    "role": "patient"
}' "Add New User"

echo -e "\n${YELLOW}6. Testing MongoDB Connection${NC}"
echo "Checking if MongoDB Atlas is connected..."
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas Connected'))
  .catch(err => console.log('❌ MongoDB Atlas Failed:', err.message));
"

echo -e "\n${GREEN}API Testing Complete!${NC}"
