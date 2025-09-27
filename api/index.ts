// Vercel serverless function entry point
import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import helmet from 'helmet';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../server/src/db/schema';

// Import routes
import authRouter from '../server/src/routes/auth';
import investmentRouter from '../server/src/routes/investments';
import contactRoutes from '../server/src/routes/contact';
import adminRouter from '../server/src/routes/admin';
import notificationsRouter from '../server/src/routes/notifications';
import paymentsRouter from '../server/src/routes/payments';

// Import middleware
import { errorHandler } from '../server/src/middleware/errorHandler';
import { apiLimiter, authLimiter, paymentLimiter, investmentLimiter, contactLimiter } from '../server/src/middleware/rateLimiter';

// Database connection for Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.VERCEL_URL, process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

// Session middleware (for Vercel, you might want to use JWT instead)
app.use(session({
  secret: process.env.SESSION_SECRET || 'vercel-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Auth middleware
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Routes with specific rate limiting
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/payments', paymentLimiter, paymentsRouter);

// Public packages route
app.get('/api/investments/packages', async (req, res) => {
  try {
    const packages = await db.query.investmentPackages.findMany();
    
    const formattedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      minInvestment: Number(pkg.minimumInvestment),
      dailyReturn: Number(pkg.dailyInterestRate),
      duration: pkg.duration,
      description: pkg.description
    }));

    res.json({ packages: formattedPackages });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

app.use('/api/investments', investmentLimiter, requireAuth, investmentRouter);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'ok',
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error',
      database: 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Catch-all for undefined API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method 
  });
});

// Error handling middleware
app.use(errorHandler);

// Export for Vercel
export default app;