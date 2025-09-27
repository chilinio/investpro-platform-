# 🚀 InvestPro Deployment Guide - Vercel

This guide will help you deploy your InvestPro platform to Vercel with full functionality.

## 📋 Prerequisites

- **GitHub Repository**: Your code should be on GitHub
- **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
- **PostgreSQL Database**: Production database (Supabase, Railway, or Neon)
- **Environment Variables**: Production configuration

## 🎯 Quick Deployment Steps

### **Step 1: Database Setup**

#### **Option A: Supabase (Recommended)**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Run your database setup script

#### **Option B: Railway**
1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection string

#### **Option C: Neon**
1. Go to [neon.tech](https://neon.tech)
2. Create database
3. Copy connection string

### **Step 2: Deploy to Vercel**

#### **Method 1: Vercel Dashboard (Recommended)**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository: `chilinio/investpro`
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (uses root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`

#### **Method 2: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project: No
# - Project name: investpro
# - Directory: ./
# - Build command: npm run build
# - Output directory: client/dist
```

### **Step 3: Environment Variables**

In Vercel Dashboard → Settings → Environment Variables, add:

#### **Production Variables:**
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Security
SESSION_SECRET=your-super-secure-session-secret-here
JWT_SECRET=your-jwt-secret-here
NODE_ENV=production

# CORS (replace with your actual Vercel URL)
CORS_ORIGIN=https://your-project.vercel.app
FRONTEND_URL=https://your-project.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### **Optional Variables:**
```env
# Email (if implementing email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payments (if implementing real payments)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_public
```

### **Step 4: Database Migration**

After deployment, run database setup:

```bash
# Connect to your production database and run:
# (Use your database provider's console or psql)

-- Create tables (from server/src/db/setup.ts)
-- Insert initial investment packages
-- Verify schema is correct
```

## 🔧 Configuration Files

### **vercel.json** ✅
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.ts" },
    { "src": "/(.*)", "dest": "/client/dist/index.html" }
  ]
}
```

### **package.json** ✅
```json
{
  "scripts": {
    "build": "npm run build:client",
    "build:client": "cd client && npm run build",
    "vercel-build": "npm run build:client"
  }
}
```

## 🎯 Deployment Checklist

### **Before Deployment:**
- [ ] Code pushed to GitHub
- [ ] Database created and configured
- [ ] Environment variables prepared
- [ ] Build scripts tested locally

### **During Deployment:**
- [ ] Vercel project created
- [ ] GitHub repository connected
- [ ] Environment variables added
- [ ] Build settings configured

### **After Deployment:**
- [ ] Database schema migrated
- [ ] Health check endpoint working
- [ ] Frontend loading correctly
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] Investment features functional

## 🧪 Testing Deployed Application

### **Frontend Tests:**
1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Check landing page loads
3. Test user registration
4. Test user login
5. Verify dashboard functionality
6. Test investment creation

### **API Tests:**
```bash
# Health check
curl https://your-project.vercel.app/api/health

# Investment packages
curl https://your-project.vercel.app/api/investments/packages

# Registration
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"Password123!"}'
```

## 🔧 Common Issues & Solutions

### **Build Failures:**
```bash
# If build fails, check:
- Node.js version in package.json engines
- All dependencies installed
- Build command correct
- TypeScript compilation errors
```

### **Database Connection Issues:**
```bash
# Check:
- DATABASE_URL format correct
- Database accessible from Vercel
- SSL settings for production database
- Connection string includes all parameters
```

### **Environment Variable Issues:**
```bash
# Verify:
- All required variables set
- No typos in variable names
- Values properly escaped
- Secrets not exposed in logs
```

### **CORS Issues:**
```bash
# Update CORS_ORIGIN to match your Vercel URL:
CORS_ORIGIN=https://your-actual-domain.vercel.app
```

## 🚀 Production Optimizations

### **Performance:**
- ✅ **Static asset optimization** (Vite handles this)
- ✅ **Code splitting** configured
- ✅ **Gzip compression** (Vercel automatic)
- ✅ **CDN distribution** (Vercel automatic)

### **Security:**
- ✅ **HTTPS everywhere** (Vercel automatic)
- ✅ **Security headers** with Helmet
- ✅ **Rate limiting** configured
- ✅ **Input validation** active
- ✅ **Session security** configured

### **Monitoring:**
- ✅ **Error logging** with console.error
- ✅ **Health check endpoint** available
- ✅ **Performance monitoring** via Vercel dashboard

## 🎉 Success Metrics

### **Deployment Successful When:**
- ✅ **Frontend loads** at your Vercel URL
- ✅ **API responds** to health check
- ✅ **Database connected** and queries work
- ✅ **Authentication works** (register/login)
- ✅ **Investments can be created** and tracked
- ✅ **All features functional** as in development

## 📞 Support Resources

### **Vercel Documentation:**
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)

### **Database Providers:**
- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Neon Docs](https://neon.tech/docs)

### **Troubleshooting:**
- Check Vercel deployment logs
- Monitor Vercel function logs
- Test API endpoints individually
- Verify database connectivity

---

## 🎯 Final Steps

After successful deployment:

1. **Test thoroughly** - All features should work
2. **Update README** - Add live demo URL
3. **Monitor performance** - Check Vercel analytics
4. **Set up custom domain** (optional)
5. **Enable preview deployments** for future updates

**Your InvestPro platform is now live on Vercel!** 🚀

**Live URL**: `https://your-project-name.vercel.app`
