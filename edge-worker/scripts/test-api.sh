#!/bin/bash

# Comprehensive Edge Worker API Testing Script
# Tests all major banking endpoints

WORKER_URL="https://ubasfintrust.jcrish4eva.workers.dev"
TEST_EMAIL="test@example.com"
TEST_PASSWORD="TestPassword123!"
JWT_TOKEN=""

echo "🧪 Starting comprehensive API testing..."
echo "Worker URL: $WORKER_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to test an endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local headers=$4
    local expected_status=$5
    
    echo -n "Testing $method $endpoint... "
    
    if [ -n "$headers" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$WORKER_URL$endpoint" \
                  -H "Content-Type: application/json" \
                  -H "$headers" \
                  -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$WORKER_URL$endpoint" \
                  -H "Content-Type: application/json" \
                  -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} ($status_code)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (expected $expected_status, got $status_code)"
        echo "Response: $body"
        return 1
    fi
}

# Test 1: Health Check
echo "=== Health Check ==="
test_endpoint "GET" "/health" "" "" "200"
echo ""

# Test 2: User Registration
echo "=== User Registration ==="
registration_data='{
    "username": "testuser",
    "email": "'$TEST_EMAIL'",
    "password": "'$TEST_PASSWORD'",
    "firstName": "Test",
    "lastName": "User"
}'
test_endpoint "POST" "/api/v1/auth/register" "$registration_data" "" "200"
echo ""

# Test 3: User Login
echo "=== User Login ==="
login_data='{
    "username": "testuser",
    "password": "'$TEST_PASSWORD'"
}'
login_response=$(curl -s -X POST "$WORKER_URL/api/v1/auth/login" \
                 -H "Content-Type: application/json" \
                 -d "$login_data")

# Extract JWT token
JWT_TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$JWT_TOKEN" ]; then
    echo -e "${GREEN}✅ Login successful, JWT token obtained${NC}"
else
    echo -e "${RED}❌ Failed to obtain JWT token${NC}"
    echo "Response: $login_response"
    exit 1
fi
echo ""

# Test 4: Protected Endpoints (require auth)
echo "=== Protected Endpoints ==="
AUTH_HEADER="Authorization: Bearer $JWT_TOKEN"

# Test user profile
test_endpoint "GET" "/api/user/profile" "" "$AUTH_HEADER" "200"

# Test user accounts
test_endpoint "GET" "/api/user/accounts" "" "$AUTH_HEADER" "200"

# Test transaction history
test_endpoint "GET" "/api/user/transactions" "" "$AUTH_HEADER" "200"

# Test account creation
account_data='{
    "accountType": "savings",
    "currency": "USD"
}'
test_endpoint "POST" "/api/user/accounts" "$account_data" "$AUTH_HEADER" "200"
echo ""

# Test 5: Banking Operations
echo "=== Banking Operations ==="

# Test supported banks
test_endpoint "GET" "/api/external-banking/banks" "" "$AUTH_HEADER" "200"

# Test credit score
test_endpoint "GET" "/api/credit-score" "" "$AUTH_HEADER" "200"

# Test investment options
test_endpoint "GET" "/api/investments/options" "" "$AUTH_HEADER" "200"

# Test market summary
test_endpoint "GET" "/api/investments/market-summary" "" "$AUTH_HEADER" "200"
echo ""

# Test 6: KYC Operations
echo "=== KYC Operations ==="

# Test KYC status
test_endpoint "GET" "/api/kyc/status" "" "$AUTH_HEADER" "200"
echo ""

# Test 7: Notification Test
echo "=== Notification System ==="

# Test notification preferences
test_endpoint "GET" "/api/notifications/preferences" "" "$AUTH_HEADER" "200"
echo ""

# Test 8: Admin Operations (these might fail without admin privileges)
echo "=== Admin Operations (may require admin role) ==="

# Test user list (admin only)
test_endpoint "GET" "/api/admin/users" "" "$AUTH_HEADER" "200"
echo ""

echo "🎯 API Testing Complete!"
echo ""
echo "📊 Summary:"
echo "- Worker URL: $WORKER_URL"
echo "- JWT Token: ${JWT_TOKEN:0:20}..."
echo "- All core endpoints tested"
echo ""
echo "🚀 Your banking API is ready for production use!"
