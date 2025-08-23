# UbasFin Trust Edge Banking API Documentation

🚀 **Production URL:** https://ubasfintrust-api.jcrish4eva.workers.dev

## Authentication

### Register New User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

# Response includes JWT token
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

## Protected Endpoints
**All endpoints below require:**
```
Authorization: Bearer <jwt_token>
```

## User Management

### Get User Profile
```bash
GET /api/v1/users/profile
# Returns user details, KYC status, verification status
```

### Get User Accounts
```bash
GET /api/v1/users/accounts
# Returns all bank accounts for the user
```

### Create New Account
```bash
POST /api/v1/users/accounts
Content-Type: application/json

{
  "accountType": "savings",
  "currency": "USD"
}
```

### Get Transaction History
```bash
GET /api/v1/users/transactions
# Returns paginated transaction history
```

## Banking Operations

### Get Supported External Banks
```bash
GET /api/v1/banking/external-banks
# Returns list of supported banks for external transfers
```

### Verify External Bank Account
```bash
POST /api/v1/banking/verify-account
Content-Type: application/json

{
  "accountNumber": "1234567890",
  "bankCode": "chase"
}
```

### External Bank Transfer
```bash
POST /api/v1/banking/external-transfer
Content-Type: application/json

{
  "fromAccountId": "user-account-id",
  "toAccountNumber": "1234567890",
  "toBankCode": "chase",
  "amount": 1000,
  "description": "Transfer description"
}
```

## Investment Services

### Get Investment Options
```bash
GET /api/v1/banking/investments/options
# Returns available investment products (S&P 500, bonds, tech ETFs)
```

### Create Investment
```bash
POST /api/v1/banking/investments
Content-Type: application/json

{
  "optionId": "sp500",
  "amount": 1000,
  "accountId": "user-account-id"
}
```

### Get User Portfolio
```bash
GET /api/v1/banking/investments/portfolio
# Returns user's investment portfolio with current values
```

### Get Market Summary
```bash
GET /api/v1/banking/investments/market-summary
# Returns current market data and indices
```

## Credit Services

### Get Credit Score
```bash
GET /api/v1/banking/credit-score
# Returns user's credit score and report
```

### Check Loan Eligibility
```bash
POST /api/v1/banking/loan-eligibility
Content-Type: application/json

{
  "amount": 50000
}
# Returns eligibility status, max amount, and interest rates
```

## KYC (Know Your Customer)

### Get KYC Status
```bash
GET /api/v1/kyc/status
# Returns current KYC verification status
```

### Submit KYC Application
```bash
POST /api/v1/kyc/submit
Content-Type: application/json

{
  "personal": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "nationality": "US"
  },
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "US"
  },
  "employment": {
    "status": "employed",
    "monthlyIncome": 5000
  }
}
```

## Notifications

### Get Notification Preferences
```bash
GET /api/v1/notifications/preferences
# Returns user's notification settings
```

### Update Notification Preferences
```bash
POST /api/v1/notifications/preferences
Content-Type: application/json

{
  "email": true,
  "sms": true,
  "inApp": true
}
```

## Health & Status

### Health Check
```bash
GET /health
# Returns {"ok": true} if service is healthy
```

### System Readiness
```bash
GET /health/readiness
# Returns detailed system status including database connectivity
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## Rate Limiting

- **Limit:** 60 requests per minute per IP
- **Window:** 60 seconds
- **Headers:** Rate limit info included in response headers

## Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Rate Limiting** - Prevents abuse  
✅ **CORS Protection** - Cross-origin security  
✅ **Input Validation** - Prevents injection attacks  
✅ **Secure Password Hashing** - bcrypt with salt  
✅ **Edge Computing** - Global distribution  

## Development & Testing

### Test with curl:
```bash
# Register
curl -X POST https://ubasfintrust-api.jcrish4eva.workers.dev/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'

# Login & get token
TOKEN=$(curl -s -X POST https://ubasfintrust-api.jcrish4eva.workers.dev/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' | jq -r '.token')

# Use protected endpoint
curl -H "Authorization: Bearer $TOKEN" https://ubasfintrust-api.jcrish4eva.workers.dev/api/v1/users/profile
```

---

🎉 **Your banking API is live and ready for production use!**
