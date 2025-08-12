# UBAS Financial Trust - Enterprise Banking Application

A comprehensive, **production-ready** banking application built with modern technologies and enterprise-grade security features.

## 🎉 **STATUS: 100% COMPLETE & DEPLOYMENT READY**

## 🏦 Overview

UBAS Financial Trust is a full-stack banking application that provides:
- **Multi-tier Banking Services**: Personal, Business, Corporate, and Private Banking
- **Real-time Transactions**: Instant money transfers with WebSocket notifications
- **Advanced Security**: JWT authentication, 2FA, encryption, and comprehensive audit trails
- **Compliance Ready**: KYC/AML features, regulatory reporting, and data protection
- **Scalable Architecture**: Microservices-ready with Docker containerization

## 🚀 **READY FOR DEPLOYMENT**
- 📋 [Complete Deployment Guide](./COMPLETE_DEPLOYMENT_GUIDE.md)
- 🎯 [Deployment Ready Summary](./DEPLOYMENT_READY_SUMMARY.md)
- ✅ [KYC & Notifications Completion](./KYC_NOTIFICATIONS_COMPLETE.md)

## ✅ **COMPLETION STATUS**

### **🎉 FULLY IMPLEMENTED & WORKING:**
- ✅ **Complete KYC Document Upload System** - Backend fully implemented with admin approval workflow
- ✅ **Multi-Provider Email/SMS Notifications** - SendGrid, Mailgun, Twilio, Vonage, TextBelt with automatic failover
- ✅ **Enterprise Authentication System** - JWT, 2FA, session management, password security
- ✅ **Real Banking Operations** - Account management, transactions, transfers with database persistence
- ✅ **Admin Dashboard** - User management, KYC approval, system monitoring
- ✅ **Security & Compliance** - Rate limiting, encryption, audit trails, fraud detection
- ✅ **File Upload System** - Secure document handling with validation
- ✅ **Production Tools** - Security key generator, environment templates, system verification scripts

### **🚀 DEPLOYMENT READY:**
- ✅ **All TypeScript Issues Fixed** - Proper imports and compilation
- ✅ **Database Migrations** - Complete schema with all required tables
- ✅ **Environment Configuration** - Templates and generators for easy setup
- ✅ **Platform Support** - Vercel, Railway, Render deployment guides
- ✅ **Testing Scripts** - Comprehensive system verification tools

## 🚀 Features

### Core Banking Features
- ✅ **Account Management**: Multiple account types with real-time balance tracking
- ✅ **Internal Transfers**: Instant transfers with fee calculation and fraud detection
- ✅ **Inter-Bank Transfers**: Complete global banking network simulation
- ✅ **Transaction History**: Comprehensive transaction tracking with filtering
- ✅ **Credit Scoring**: Real-time credit score calculation and monitoring
- ✅ **Investment Platform**: Multiple investment products with realistic returns
- ✅ **Bill Payment System**: Complete utility and service payment processing
- ✅ **Loan Services**: Eligibility assessment, application, and approval workflow
- ✅ **KYC Document Upload**: Complete document verification system with admin approval

### Security & Compliance
- ✅ **Multi-Factor Authentication**: TOTP-based 2FA with QR code setup
- ✅ **JWT Authentication**: Secure token-based authentication with refresh tokens
- ✅ **Encryption**: Data encryption at rest and in transit
- ✅ **Audit Trails**: Comprehensive logging for compliance and security
- ✅ **Rate Limiting**: Protection against brute force and DDoS attacks
- ✅ **KYC/AML**: Complete Know Your Customer and Anti-Money Laundering compliance
- ✅ **Fraud Detection**: Real-time transaction risk analysis and blocking
- ✅ **Account Verification**: Comprehensive internal bank account verification system

### Real-time Features
- ✅ **WebSocket Integration**: Real-time transaction notifications
- ✅ **Live Balance Updates**: Instant balance updates across sessions
- ✅ **Security Alerts**: Real-time security event notifications
- ✅ **System Notifications**: Maintenance and service updates

### Admin & Management
- ✅ **Admin Dashboard**: User management and system monitoring
- ✅ **Transaction Monitoring**: Real-time transaction oversight with fraud alerts
- ✅ **KYC Approval Workflow**: Complete document verification and approval process
- ✅ **Loan Management**: Loan application review and approval
- ✅ **Fraud Alert Management**: Review and resolve security alerts
- ✅ **User Account Controls**: Activate/deactivate accounts and manage permissions

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Zustand** for state management
- **React Query** for server state management
- **Socket.IO Client** for real-time features

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** for primary database
- **Redis** for caching and sessions
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Knex.js** for database migrations and queries

### Security & Infrastructure
- **Helmet.js** for security headers
- **bcryptjs** for password hashing
- **Speakeasy** for 2FA implementation
- **Rate limiting** with express-rate-limit
- **Docker** for containerization
- **Nginx** for reverse proxy (production)

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Redis 7+
- Docker and Docker Compose (optional)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/i2sltd-dottech/provi-ai-bank-sim.git
cd provi-ai-bank-sim
```

2. **Start with Docker Compose**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- Database: localhost:5432
- Redis: localhost:6379

### Option 2: Manual Setup

1. **Clone and setup**
```bash
git clone https://github.com/i2sltd-dottech/provi-ai-bank-sim.git
cd provi-ai-bank-sim
```

2. **Setup Backend**
```bash
cd server
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run build
npm run migrate
npm run dev
```

3. **Setup Frontend**
```bash
# In a new terminal, from project root
cp .env.example .env
npm install
npm run dev
```

4. **Setup Database**
```bash
# Create PostgreSQL database
createdb provi_banking

# Run migrations
cd server
npm run migrate
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Provi Bank
```

#### Backend (server/.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/provi_banking
REDIS_HOST=localhost
JWT_SECRET=your_super_secret_jwt_key
ENCRYPTION_KEY=your_32_character_encryption_key
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/setup-2fa` - Setup 2FA
- `POST /api/v1/auth/verify-2fa` - Verify 2FA

### Account Endpoints
- `GET /api/v1/accounts/:id` - Get account details
- `GET /api/v1/accounts/:id/balance` - Get account balance
- `GET /api/v1/accounts/:id/transactions` - Get account transactions

### Transaction Endpoints
- `POST /api/v1/transactions/transfer` - Transfer funds
- `GET /api/v1/transactions/:id` - Get transaction details

### User Endpoints
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/password` - Change password

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
npm run test:coverage
```

### Frontend Tests
```bash
npm test
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
npm run build

# Backend
cd server
npm run build
```

### Docker Production
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔒 Security Features

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Encryption**: AES-256 encryption for sensitive data
- **2FA**: TOTP-based two-factor authentication
- **Rate Limiting**: Configurable rate limits per endpoint
- **Security Headers**: Comprehensive security headers via Helmet
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization and CSP headers

## 📊 Monitoring & Logging

### Probes & Health Endpoints
- Liveness: `GET /health/liveness` (no external deps; always fast)  
- Readiness: `GET /health/readiness` (checks DB + Redis; 503 if degraded)  
- Backward compatible: `GET /health` redirects to readiness; `GET /health?type=liveness` -> liveness.
- Diagnostics: `GET /api/v1/_diagnostics` (set `DIAGNOSTICS_TOKEN` to protect; returns provider health & latency metrics).

### CI Pipeline
Included GitHub Actions workflow (`.github/workflows/ci.yml`) that:
1. Spins up Postgres + Redis.
2. Builds backend.
3. Applies migrations.
4. Seeds admin (via env).
5. Runs full system integration script (`scripts/system-check.mjs`).

Configure repository secrets if you extend providers (e.g., RESEND_API_KEY) and map them in the workflow `env`.

### Render Deployment Notes
Use Readiness probe for scaling decisions; Liveness for crash detection. Ensure `VITE_API_URL` matches deployed backend, and set `DIAGNOSTICS_TOKEN` to shield diagnostics.

- **Structured Logging**: Winston with multiple log levels
- **Audit Trails**: Complete audit log for compliance
- **Health Checks**: Application and database health endpoints
- **Performance Monitoring**: Request timing and metrics
- **Error Tracking**: Comprehensive error logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: webmaster@i2sltd.tech

## 🗺 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered fraud detection
- [ ] Cryptocurrency support
- [ ] Open Banking API integration
- [ ] Advanced investment products
- [ ] International wire transfers
- [ ] Merchant payment processing
