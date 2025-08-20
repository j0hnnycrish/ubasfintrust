#!/bin/bash

# Test KYC submission endpoint with curl

echo "Testing KYC submission endpoint..."

# First, login to get a token
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST https://ubasfintrust.jcrish4eva.workers.dev/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ubasfintrust.com","password":"StrongPass123!"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful"

# Create a test file
echo "2. Creating test file..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" | base64 -d > /tmp/test-image.png

# Submit KYC with multipart data
echo "3. Submitting KYC application..."
KYC_RESPONSE=$(curl -s -X POST https://ubasfintrust.jcrish4eva.workers.dev/api/v1/kyc/submit \
  -H "Authorization: Bearer $TOKEN" \
  -F "personal_firstName=John" \
  -F "personal_lastName=Doe" \
  -F "personal_dateOfBirth=1990-01-01" \
  -F "personal_nationality=US" \
  -F "address_street=123 Test St" \
  -F "address_city=Test City" \
  -F "address_state=Test State" \
  -F "address_country=United States" \
  -F "employment_status=employed" \
  -F "employment_monthlyIncome=5000" \
  -F "agreement_terms=true" \
  -F "agreement_privacy=true" \
  -F "document_primaryId=@/tmp/test-image.png;type=image/png" \
  -v)

echo "Response: $KYC_RESPONSE"

# Clean up
rm -f /tmp/test-image.png

if echo "$KYC_RESPONSE" | grep -q '"success":true'; then
  echo "✅ KYC submission successful!"
else
  echo "❌ KYC submission failed"
fi
