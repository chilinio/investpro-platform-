# 🚀 InvestPro Backend API Documentation

## Overview
Your InvestPro backend is now a **professional-grade investment platform** with enterprise features including admin panel, payment processing, notifications, security, and comprehensive audit logging.

## 🔗 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication
- **Session-based authentication** using secure HTTP-only cookies
- **bcrypt password hashing** for security
- **Rate limiting** on authentication endpoints

---

## 📊 Core Investment API

### Get Investment Packages
```http
GET /investments/packages
```
**Public endpoint** - Returns available investment packages

### Get User Investments
```http
GET /investments
Authorization: Required (Session)
```
Returns user's investment portfolio with profit calculations

### Create Investment
```http
POST /investments
Authorization: Required (Session)
Content-Type: application/json

{
  "packageId": 1,
  "amount": 5000
}
```

### Get Investment Statistics
```http
GET /investments/stats
Authorization: Required (Session)
```
Returns comprehensive analytics including daily profits and 7-day trends

---

## 🔐 Authentication API

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Logout User
```http
POST /auth/logout
Authorization: Required (Session)
```

---

## 👑 Admin Panel API

### Admin Dashboard
```http
GET /admin/dashboard
Authorization: Required (Admin Session)
```
Returns platform statistics, user metrics, and investment analytics

### User Management
```http
GET /admin/users?page=1&limit=10
Authorization: Required (Admin Session)
```
Get paginated list of all users with investment statistics

### Get User Details
```http
GET /admin/users/{userId}
Authorization: Required (Admin Session)
```
Get detailed user information including investments and transactions

### Investment Oversight
```http
GET /admin/investments?page=1&limit=20&status=active
Authorization: Required (Admin Session)
```
Monitor all platform investments with filtering options

### Create Investment Package
```http
POST /admin/packages
Authorization: Required (Admin Session)
Content-Type: application/json

{
  "name": "Premium Package",
  "minimumInvestment": 10000,
  "dailyInterestRate": 12.5,
  "duration": 60,
  "description": "High-yield investment for premium clients"
}
```

### Update Investment Status
```http
PATCH /admin/investments/{investmentId}/status
Authorization: Required (Admin Session)
Content-Type: application/json

{
  "status": "completed"
}
```

---

## 💳 Payment System API

### Get Wallet Balance
```http
GET /payments/wallet
Authorization: Required (Session)
```
Returns user's wallet balance and recent transactions

### Deposit Funds
```http
POST /payments/deposit
Authorization: Required (Session)
Content-Type: application/json

{
  "amount": 1000,
  "paymentMethod": "card"
}
```

### Withdraw Funds
```http
POST /payments/withdraw
Authorization: Required (Session)
Content-Type: application/json

{
  "amount": 500,
  "withdrawalMethod": "bank_transfer",
  "accountDetails": "Account info"
}
```

### Get Payment Methods
```http
GET /payments/methods
Authorization: Required (Session)
```
Returns available deposit and withdrawal methods with fees

### Transaction History
```http
GET /payments/transactions?page=1&limit=20&type=deposit
Authorization: Required (Session)
```
Get paginated transaction history with filtering

### Calculate Fees
```http
POST /payments/calculate-fees
Authorization: Required (Session)
Content-Type: application/json

{
  "amount": 1000,
  "method": "card",
  "type": "deposit"
}
```

---

## 🔔 Notification System API

### Get Notifications
```http
GET /notifications?page=1&limit=20
Authorization: Required (Session)
```
Returns user notifications with pagination and unread count

### Mark Notification as Read
```http
PATCH /notifications/{notificationId}/read
Authorization: Required (Session)
```

### Mark All Notifications as Read
```http
PATCH /notifications/mark-all-read
Authorization: Required (Session)
```

### Delete Notification
```http
DELETE /notifications/{notificationId}
Authorization: Required (Session)
```

---

## 📞 Contact System API

### Submit Contact Form
```http
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "message": "I need help with my investment"
}
```

---

## 🛡️ Security Features

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes  
- **Payments**: 10 transactions per hour
- **Investments**: 20 investments per hour
- **Contact**: 3 submissions per hour

### Security Headers
- **Helmet.js** for security headers
- **CORS** protection with specific origins
- **Session security** with HTTP-only cookies

### Audit Logging
All user actions are logged for compliance and security monitoring.

---

## 📊 Database Schema

### Tables Created
- **users** - User accounts and authentication
- **investment_packages** - Available investment plans
- **investments** - User investment records  
- **transactions** - Payment and financial records
- **notifications** - User notification system
- **wallets** - User balance management
- **audit_logs** - Security and compliance tracking

---

## 🚀 Production Features

### Scalability
- **PostgreSQL** database with proper relationships
- **Drizzle ORM** for type-safe database queries
- **Modular architecture** with separate route files
- **Middleware-based** request processing

### Error Handling
- **Centralized error handling** middleware
- **Comprehensive logging** for debugging
- **Graceful error responses** with proper HTTP status codes

### Compliance
- **Complete audit trail** for all user actions
- **Financial transaction logging** for regulatory compliance
- **User data protection** with secure session management

---

## 🎯 Admin User Setup

To create an admin user for testing:

```http
POST /admin/create-admin
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User", 
  "email": "admin@investpro.com",
  "password": "admin123"
}
```

Then login with these credentials to access admin features.

---

## 📈 Your Platform is Production Ready!

✅ **Enterprise Security**  
✅ **Financial Compliance**  
✅ **Scalable Architecture**  
✅ **Admin Management**  
✅ **Payment Processing**  
✅ **Real-time Analytics**  

**Your InvestPro backend is now a complete, professional investment platform!** 🎉
