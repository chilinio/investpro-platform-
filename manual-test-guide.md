# 🧪 Manual Testing Guide for InvestPro Platform

## 🌐 Frontend Testing (Browser)

### **Step 1: Access the Platform**
1. Open your browser
2. Go to **http://localhost:3000**
3. You should see the beautiful InvestPro landing page

### **Step 2: User Registration**
1. Click **"Start Investing Today"** or **"Register"**
2. Fill in the registration form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@test.com`
   - Password: `Password123!`
3. Click **"Register"**
4. ✅ Should redirect to dashboard after successful registration

### **Step 3: Dashboard Testing**
After registration, you should see:
- ✅ **Investment Statistics** (4 stat cards)
- ✅ **Daily Profit Signals** chart
- ✅ **Investment Distribution** chart  
- ✅ **Personal Investment Table**
- ✅ **"No investments yet"** message with call-to-action

### **Step 4: Investment Package Selection**
1. Click **"Investment Packages"** in navigation
2. You should see 3 packages:
   - **Gold Package**: $1,000 min, 4.5% daily
   - **Platinum Package**: $2,500 min, 8.5% daily
   - **Diamond Package**: $5,000 min, 15% daily
3. Click **"Invest Now"** on any package

### **Step 5: Create Investment**
1. Select investment amount (minimum as shown)
2. Click **"Create Investment"**
3. ✅ Should create investment and redirect to dashboard
4. ✅ Dashboard should now show your investment in the table

### **Step 6: Test Logout/Login**
1. Click **"Logout"** in the navigation
2. Should redirect to landing page
3. Click **"Login"**
4. Enter your credentials:
   - Email: `john.doe@test.com`
   - Password: `Password123!`
5. ✅ Should login and show your dashboard with investments

## 🔧 API Testing (Manual)

### **Direct API Calls**
You can test the API directly using these curl commands:

#### **1. Health Check**
```bash
curl http://localhost:5000/api/health
```
Expected: `{"status":"ok","database":"connected"}`

#### **2. Get Investment Packages**
```bash
curl http://localhost:5000/api/investments/packages
```
Expected: Array of 6 investment packages

#### **3. Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User", 
    "email": "test@example.com",
    "password": "Password123!"
  }' \
  -c cookies.txt
```

#### **4. Login User**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }' \
  -c cookies.txt -b cookies.txt
```

#### **5. Get User Investments (Authenticated)**
```bash
curl http://localhost:5000/api/investments \
  -b cookies.txt
```

## ✅ Expected Test Results

### **Frontend (Browser) ✅**
- **Landing Page**: Beautiful design with packages
- **Registration**: Smooth user registration flow
- **Login**: Secure authentication
- **Dashboard**: Personal investment tracking
- **Navigation**: Seamless page transitions
- **Responsive**: Works on mobile and desktop

### **Backend API ✅**
- **Health Check**: Status OK with database connected
- **Authentication**: Registration and login working
- **Session Management**: Persistent login sessions
- **Investment Management**: Create and track investments
- **Payment System**: Wallet and transaction handling
- **Security**: Rate limiting and validation active

## 🎯 Success Criteria

### **✅ Core Functionality**
- [ ] Landing page loads correctly
- [ ] User registration works
- [ ] User login maintains session
- [ ] Dashboard shows investment data
- [ ] Investment creation works
- [ ] Navigation between pages works
- [ ] Logout clears session

### **✅ Data Persistence**
- [ ] User data saved to database
- [ ] Investments tracked correctly
- [ ] Session maintained across page refreshes
- [ ] Profit calculations accurate
- [ ] Statistics update in real-time

### **✅ Security Features**
- [ ] Password hashing working
- [ ] Session authentication active
- [ ] Rate limiting prevents abuse
- [ ] Input validation working
- [ ] Error handling graceful

## 🚨 Troubleshooting

### **If Registration Fails:**
- Check server logs for errors
- Verify PostgreSQL is running
- Check email format and password strength

### **If Login Doesn't Work:**
- Verify user was created successfully
- Check password matches registration
- Clear browser cookies and try again

### **If Dashboard is Blank:**
- Check browser console for errors
- Verify API calls are successful (Network tab)
- Check if authentication session is active

### **If Investments Don't Show:**
- Verify investment was created successfully
- Check API response in browser Network tab
- Refresh the page to reload data

## 📊 Test Results Template

After testing, document your results:

```
✅ PASSED TESTS:
- Landing page display
- User registration
- User login
- Dashboard functionality
- Investment creation
- Navigation

❌ FAILED TESTS:
- [List any issues found]

🎯 OVERALL STATUS:
- Frontend: [Working/Issues]
- Backend: [Working/Issues]
- Database: [Connected/Issues]
- Authentication: [Working/Issues]
```

## 🎉 Success!

If all tests pass, your InvestPro platform is:
- ✅ **Fully Functional**
- ✅ **Production Ready**
- ✅ **Secure and Reliable**
- ✅ **User-Friendly**

Your enterprise investment platform is working perfectly! 🚀
