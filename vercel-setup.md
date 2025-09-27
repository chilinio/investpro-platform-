# Vercel Environment Variables Setup

## 🔧 Required Environment Variables

Your InvestPro backend needs these environment variables to work properly:

### 1. DATABASE_URL
- **Purpose**: PostgreSQL connection string
- **Format**: `postgresql://username:password@host:port/database`
- **Example**: `postgresql://user:pass@db.vercel.com:5432/investpro`

### 2. JWT_SECRET
- **Purpose**: Secret key for JWT token signing
- **Format**: Any secure random string (32+ characters recommended)
- **Example**: `your-super-secret-jwt-key-here-123456789`

## 🚀 How to Set Environment Variables in Vercel

### Option 1: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Login with your account
3. Find your `investpro` project
4. Go to **Settings** → **Environment Variables**
5. Add each variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string
   - **Environment**: Production, Preview, Development
6. Repeat for `JWT_SECRET`

### Option 2: Vercel CLI
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET

# Deploy with environment variables
vercel --prod
```

## 🔍 Testing Your Setup

1. Open `test-deployment.html` in your browser
2. Click **"Test Health Endpoint"** - should return `{"status":"ok"}`
3. Click **"Test Database Connection"** - should not show database errors
4. Click **"Test Registration"** - should successfully register a user

## 🚨 Common Issues

### Issue: "Registration failed: connect ECONNREFUSED"
**Solution**: `DATABASE_URL` is missing or incorrect

### Issue: "Registration failed: JWT_SECRET is not defined"
**Solution**: `JWT_SECRET` is missing

### Issue: "CORS error"
**Solution**: The backend is working, but frontend needs to be redeployed

## 📞 Next Steps

1. Set the environment variables in Vercel
2. Wait 2-3 minutes for redeployment
3. Test using the `test-deployment.html` file
4. If tests pass, try registration on your main app

## 🔐 Security Notes

- Never commit environment variables to Git
- Use strong, unique JWT secrets
- Keep your database credentials secure
- Consider using Vercel's built-in PostgreSQL for easier setup 