# 🚀 InvestPro - Professional Investment Platform

![InvestPro Banner](https://img.shields.io/badge/InvestPro-Investment%20Platform-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

> A comprehensive, enterprise-grade investment platform built with modern web technologies. Features include user portfolio management, admin panel, payment processing, real-time notifications, and advanced security measures.

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Technical Architecture](#️-technical-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📦 Dependencies](#-dependencies)
- [⚙️ Local Setup](#️-local-setup)
- [🚀 Getting Started](#-getting-started)
- [📊 Database Schema](#-database-schema)
- [🔐 API Documentation](#-api-documentation)
- [🔒 Security Features](#-security-features)
- [👑 Admin Panel](#-admin-panel)
- [💳 Payment System](#-payment-system)
- [🔔 Notification System](#-notification-system)
- [📈 Current Status](#-current-status)
- [🎯 Future Roadmap](#-future-roadmap)
- [🤝 Contributing](#-contributing)

## 🎯 Project Overview

InvestPro is a full-stack investment platform that allows users to:
- **Invest** in various packages (Gold, Platinum, Diamond)
- **Track** real-time portfolio performance and daily profits
- **Manage** funds through integrated wallet system
- **Receive** notifications for investment updates
- **Access** comprehensive analytics and reporting

The platform includes a powerful admin panel for complete platform management and oversight.

## ✨ Key Features

### 🎨 **User Features**
- ✅ **Beautiful Landing Page** with investment package showcase
- ✅ **User Authentication** (Register/Login with session management)
- ✅ **Investment Portfolio** with real-time profit tracking
- ✅ **Digital Wallet** for deposits and withdrawals
- ✅ **Daily Profit Signals** with 7-day trend charts
- ✅ **Investment Statistics** and performance analytics
- ✅ **Notification System** for updates and alerts
- ✅ **Contact System** for customer support

### 👑 **Admin Features**
- ✅ **Admin Dashboard** with platform analytics
- ✅ **User Management** (view, edit, monitor users)
- ✅ **Investment Oversight** (approve, cancel, track)
- ✅ **Package Management** (create, edit investment plans)
- ✅ **Payment Monitoring** (deposits, withdrawals, transactions)
- ✅ **Notification Management** (system-wide alerts)
- ✅ **Audit Logging** (complete activity tracking)

### 🛡️ **Security & Compliance**
- ✅ **Advanced Rate Limiting** (API, auth, payments)
- ✅ **Session-based Authentication** with secure cookies
- ✅ **Password Hashing** with bcrypt
- ✅ **CORS Protection** with specific origin allowlist
- ✅ **Security Headers** with Helmet.js
- ✅ **Comprehensive Audit Logging** for compliance
- ✅ **Input Validation** and sanitization

## 🏗️ Technical Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React/Vite)  │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Frontend Architecture**
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **Axios** for API communication with interceptors
- **React Router** for client-side navigation
- **Context API** for state management

### **Backend Architecture**
- **Express.js** with TypeScript for robust API
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** for reliable data storage
- **Session-based Auth** with express-session
- **Modular Routes** for organized code structure
- **Middleware Pipeline** for security and validation

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.2.0 | UI Framework |
| TypeScript | ^5.0.0 | Type Safety |
| Vite | ^5.0.0 | Build Tool |
| Tailwind CSS | ^3.4.0 | Styling |
| Axios | ^1.6.0 | HTTP Client |
| React Router | ^6.8.0 | Routing |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ^18.0.0 | Runtime |
| Express.js | ^4.19.2 | Web Framework |
| TypeScript | ^5.4.5 | Type Safety |
| Drizzle ORM | ^0.44.5 | Database ORM |
| PostgreSQL | ^16.0.0 | Database |
| bcrypt | ^6.0.0 | Password Hashing |

### **Security & Middleware**
| Technology | Version | Purpose |
|------------|---------|---------|
| Helmet | ^8.1.0 | Security Headers |
| CORS | ^2.8.5 | Cross-Origin Protection |
| express-rate-limit | ^8.1.0 | Rate Limiting |
| express-session | ^1.18.1 | Session Management |
| express-validator | ^7.2.1 | Input Validation |

## 📦 Dependencies

### **Prerequisites**
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0.0
- **Git** for version control

### **Core Dependencies**

#### Frontend (`/client`)
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.2",
  "vite": "^5.4.19",
  "tailwindcss": "^3.4.14",
  "axios": "^1.7.7",
  "react-router-dom": "^6.28.0",
  "react-icons": "^5.3.0"
}
```

#### Backend (`/server`)
```json
{
  "express": "^4.19.2",
  "typescript": "^5.4.5",
  "drizzle-orm": "^0.44.5",
  "pg": "^8.16.3",
  "bcrypt": "^6.0.0",
  "helmet": "^8.1.0",
  "cors": "^2.8.5",
  "express-session": "^1.18.1",
  "express-rate-limit": "^8.1.0",
  "express-validator": "^7.2.1",
  "dotenv": "^16.4.5",
  "nodemon": "^3.1.3",
  "ts-node": "^10.9.2"
}
```

## ⚙️ Local Setup

### **1. System Requirements**

```bash
# Check Node.js version (required: >= 18.0.0)
node --version

# Check npm version (required: >= 9.0.0)
npm --version

# Check PostgreSQL installation
psql --version
```

### **2. PostgreSQL Setup**

#### **Option A: Local Installation**
```bash
# Windows (using Chocolatey)
choco install postgresql

# macOS (using Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start
```

#### **Option B: Docker**
```bash
# Run PostgreSQL in Docker
docker run --name investpro-db \
  -e POSTGRES_USER=investpro \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=investpro \
  -p 5432:5432 \
  -d postgres:16
```

#### **Option C: Cloud Database**
- **Supabase**: Free tier with 500MB storage
- **Railway**: PostgreSQL hosting
- **Neon**: Serverless PostgreSQL
- **AWS RDS**: Production-grade database

### **3. Environment Variables**

Create `.env` files in both client and server directories:

#### **Server Environment (`.env` in `/server`)**
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/investpro
DB_HOST=localhost
DB_PORT=5432
DB_NAME=investpro
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
SESSION_SECRET=your-super-secret-session-key-here
JWT_SECRET=your-jwt-secret-key-here

# CORS Origins
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### **Client Environment (`.env` in `/client`)**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Development
VITE_NODE_ENV=development
```

## 🚀 Getting Started

### **Quick Start (5 minutes)**

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd invest

# 2. Install all dependencies
npm install

# 3. Install client dependencies
cd client && npm install && cd ..

# 4. Install server dependencies
cd server && npm install && cd ..

# 5. Set up environment variables
# Copy .env.example to .env in both /client and /server
# Update database credentials in server/.env

# 6. Set up database
cd server
npm run db:setup  # Creates tables and initial data
cd ..

# 7. Start development servers
npm run dev
```

### **Manual Setup (Step by step)**

#### **1. Clone and Install**
```bash
git clone <your-repo-url>
cd invest
npm install
```

#### **2. Client Setup**
```bash
cd client
npm install
cp .env.example .env
# Edit .env with your configuration
cd ..
```

#### **3. Server Setup**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
cd ..
```

#### **4. Database Setup**
```bash
# Create PostgreSQL database
createdb investpro

# Run database setup
cd server
npm run db:setup
cd ..
```

#### **5. Start Development**
```bash
# Start both client and server
npm run dev

# Or start individually:
# Terminal 1 (Client)
cd client && npm run dev

# Terminal 2 (Server)
cd server && npm run dev
```

### **Verification**

After setup, verify everything is working:

1. **Frontend**: http://localhost:3000
2. **Backend Health**: http://localhost:5000/api/health
3. **API Endpoints**: http://localhost:5000/api/investments/packages

Expected response from health endpoint:
```json
{
  "status": "ok",
  "database": "connected",
  "environment": "development"
}
```

## 📊 Database Schema

### **Tables Overview**
```sql
-- Users table
users (id, first_name, last_name, email, password, created_at, updated_at)

-- Investment packages
investment_packages (id, name, minimum_investment, daily_interest_rate, duration, description)

-- User investments
investments (id, user_id, package_id, amount, status, start_date, end_date)

-- Financial transactions
transactions (id, user_id, investment_id, type, amount, status, created_at)

-- User notifications
notifications (id, user_id, title, message, type, read, created_at)

-- User wallets
wallets (id, user_id, balance, created_at, updated_at)

-- Audit logs
audit_logs (id, user_id, action, resource, ip_address, user_agent, created_at)

-- Contact submissions
contacts (id, name, email, message, created_at)
```

### **Relationships**
- Users → Investments (One-to-Many)
- Investment Packages → Investments (One-to-Many)
- Users → Transactions (One-to-Many)
- Users → Notifications (One-to-Many)
- Users → Wallets (One-to-One)
- Users → Audit Logs (One-to-Many)

## 🔐 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Endpoints**
```http
POST /auth/register     # User registration
POST /auth/login        # User login
POST /auth/logout       # User logout
GET  /auth/me          # Get current user
```

### **Investment Endpoints**
```http
GET  /investments                    # Get user investments
POST /investments                    # Create new investment
GET  /investments/stats             # Get investment statistics
GET  /investments/packages          # Get available packages (public)
GET  /investments/:id              # Get specific investment
DELETE /investments/:id            # Cancel investment
```

### **Admin Endpoints**
```http
GET  /admin/dashboard              # Admin dashboard stats
GET  /admin/users                  # Get all users
GET  /admin/users/:id             # Get user details
GET  /admin/investments           # Get all investments
POST /admin/packages              # Create investment package
PUT  /admin/packages/:id          # Update investment package
PATCH /admin/investments/:id/status # Update investment status
```

### **Payment Endpoints**
```http
GET  /payments/wallet              # Get wallet balance
POST /payments/deposit             # Deposit funds
POST /payments/withdraw            # Withdraw funds
GET  /payments/methods             # Get payment methods
GET  /payments/transactions        # Get transaction history
POST /payments/calculate-fees      # Calculate transaction fees
```

### **Notification Endpoints**
```http
GET    /notifications              # Get user notifications
PATCH  /notifications/:id/read     # Mark notification as read
PATCH  /notifications/mark-all-read # Mark all as read
DELETE /notifications/:id          # Delete notification
```

### **Contact Endpoint**
```http
POST /contact                      # Submit contact form
```

## 🔒 Security Features

### **Authentication & Authorization**
- **Session-based authentication** with secure HTTP-only cookies
- **bcrypt password hashing** with salt rounds
- **Protected routes** requiring authentication
- **Admin role verification** for admin endpoints

### **Rate Limiting**
```javascript
// General API: 100 requests per 15 minutes
// Authentication: 5 attempts per 15 minutes
// Payments: 10 transactions per hour
// Investments: 20 investments per hour
// Contact: 3 submissions per hour
```

### **Security Headers**
- **Helmet.js** for comprehensive security headers
- **CORS protection** with specific origin allowlist
- **Content Security Policy** (CSP) headers
- **XSS Protection** and CSRF prevention

### **Input Validation**
- **express-validator** for request validation
- **SQL injection prevention** with parameterized queries
- **XSS protection** with input sanitization
- **File upload restrictions** and validation

### **Audit Logging**
- **Complete audit trail** for all user actions
- **IP address and user agent tracking**
- **Failed login attempt monitoring**
- **Administrative action logging**

## 👑 Admin Panel

### **Dashboard Features**
- **Platform Statistics**: Users, investments, revenue
- **Real-time Analytics**: Daily, weekly, monthly trends
- **User Growth Metrics**: Registration and activity data
- **Revenue Tracking**: Investment amounts and profits

### **User Management**
- **User List**: Paginated view of all users
- **User Details**: Complete user profile and activity
- **Investment History**: Per-user investment tracking
- **Account Actions**: Suspend, activate, or modify users

### **Investment Oversight**
- **Investment Monitoring**: All platform investments
- **Status Management**: Approve, cancel, or modify investments
- **Package Management**: Create and edit investment packages
- **Performance Analytics**: ROI and profit calculations

### **Admin Access**
```bash
# Create admin user
curl -X POST http://localhost:5000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@investpro.com",
    "password": "admin123"
  }'
```

## 💳 Payment System

### **Wallet Features**
- **Digital Wallet**: Secure balance management
- **Multi-currency Support**: Ready for future expansion
- **Transaction History**: Complete payment records
- **Balance Tracking**: Real-time balance updates

### **Payment Methods**
```javascript
// Deposit Methods
- Credit/Debit Cards (2.9% fee, instant)
- Bank Transfer (1% fee, 1-3 days)
- Cryptocurrency (0.5% fee, 10-60 minutes)

// Withdrawal Methods  
- Bank Transfer ($5 flat fee, 1-3 days)
- Cryptocurrency (1% fee, 10-60 minutes)
```

### **Transaction Processing**
- **Secure Payment Flow**: Multi-step verification
- **Fee Calculation**: Automatic fee computation
- **Status Tracking**: Pending, completed, failed states
- **Notification Integration**: Payment confirmations

## 🔔 Notification System

### **Notification Types**
- **Investment Updates**: New investments, status changes
- **Payment Alerts**: Deposits, withdrawals, confirmations
- **System Messages**: Maintenance, updates, announcements
- **Security Alerts**: Login attempts, password changes

### **Delivery Methods**
- **In-app Notifications**: Real-time dashboard alerts
- **Database Storage**: Persistent notification history
- **Read/Unread Status**: User interaction tracking
- **Bulk Operations**: Mark all read, delete multiple

### **Auto-notifications**
```javascript
// Automatically triggered notifications:
- Welcome message on registration
- Investment confirmation on purchase
- Daily profit updates
- Payment confirmations
- Security alerts for suspicious activity
```

## 📈 Current Status

### ✅ **Completed Features (100%)**

#### **Core Platform**
- ✅ User authentication and authorization
- ✅ Investment portfolio management
- ✅ Real-time profit calculations
- ✅ PostgreSQL database with Drizzle ORM
- ✅ RESTful API with comprehensive endpoints

#### **Admin Panel**
- ✅ Admin dashboard with analytics
- ✅ User management system
- ✅ Investment oversight tools
- ✅ Package management interface
- ✅ Audit logging system

#### **Payment System**
- ✅ Digital wallet functionality
- ✅ Deposit and withdrawal processing
- ✅ Multiple payment method support
- ✅ Transaction history and tracking
- ✅ Automatic fee calculation

#### **Security & Compliance**
- ✅ Advanced rate limiting
- ✅ Comprehensive audit logging
- ✅ Session-based authentication
- ✅ Input validation and sanitization
- ✅ Security headers and CORS protection

#### **User Experience**
- ✅ Beautiful responsive design
- ✅ Real-time notifications
- ✅ Investment analytics and charts
- ✅ Contact system
- ✅ Landing page with package showcase

### 🎯 **Production Readiness**
- ✅ **Scalable Architecture**: Modular, maintainable code
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Database Optimization**: Proper indexing and relationships
- ✅ **Security Compliance**: Enterprise-level security
- ✅ **Documentation**: Complete API and setup docs
- ✅ **Testing Ready**: Structure for unit and integration tests

## 🎯 Future Roadmap

### **Phase 1: Enhanced Features** (Next 1-2 months)
- [ ] **Email Notifications**: SMTP integration for email alerts
- [ ] **Two-Factor Authentication**: SMS and authenticator app support
- [ ] **Advanced Analytics**: More detailed charts and reports
- [ ] **Mobile App**: React Native mobile application
- [ ] **API Documentation**: Interactive Swagger/OpenAPI docs

### **Phase 2: Advanced Functionality** (Months 3-4)
- [ ] **Real Payment Integration**: Stripe, PayPal, cryptocurrency
- [ ] **KYC/AML Compliance**: Identity verification system
- [ ] **Referral System**: User referral and reward program
- [ ] **Advanced Security**: Biometric authentication, device tracking
- [ ] **Multi-language Support**: Internationalization (i18n)

### **Phase 3: Enterprise Features** (Months 5-6)
- [ ] **White-label Solution**: Customizable branding
- [ ] **API for Partners**: Third-party integration capabilities
- [ ] **Advanced Reporting**: Regulatory compliance reports
- [ ] **Machine Learning**: AI-powered investment recommendations
- [ ] **Blockchain Integration**: DeFi and cryptocurrency features

### **Phase 4: Scale & Performance** (Months 6+)
- [ ] **Microservices Architecture**: Service decomposition
- [ ] **Load Balancing**: High availability setup
- [ ] **CDN Integration**: Global content delivery
- [ ] **Advanced Monitoring**: Application performance monitoring
- [ ] **Automated Testing**: Comprehensive test coverage

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format
- **Testing**: Jest and React Testing Library

### **Project Structure**
```
invest/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utilities and API
│   │   └── types/         # TypeScript types
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── db/           # Database schema and setup
│   │   └── types/        # TypeScript types
│   └── package.json      # Backend dependencies
├── docs/                 # Documentation
├── package.json          # Root package.json
└── README.md            # This file
```

---

## 📞 Support

### **Documentation**
- **API Documentation**: `API-DOCUMENTATION.md`
- **Setup Guide**: This README
- **Database Schema**: `/server/src/db/schema.ts`

### **Contact**
- **Issues**: GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions
- **Email**: [Your email for support]

### **Community**
- **Discord**: [Your Discord server]
- **Twitter**: [Your Twitter handle]
- **LinkedIn**: [Your LinkedIn profile]

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Express.js** for the robust backend framework
- **PostgreSQL** for reliable data storage
- **Tailwind CSS** for beautiful styling
- **Drizzle ORM** for type-safe database operations
- **All contributors** who helped build this platform

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**🚀 InvestPro - Your Gateway to Smart Investing**

</div>