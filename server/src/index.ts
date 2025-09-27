import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import investmentRouter from './routes/investments';
import contactRoutes from './routes/contact';
import adminRouter from './routes/admin';
import notificationsRouter from './routes/notifications';
import paymentsRouter from './routes/payments';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter, paymentLimiter, investmentLimiter, contactLimiter } from './middleware/rateLimiter';
import helmet from 'helmet';
import { db } from './db';
import { investmentPackages } from './db/schema';
import { sql } from 'drizzle-orm';

dotenv.config();

// PostgreSQL connection check
const checkDBConnection = async () => {
  try {
    // Test the database connection
    await db.execute(sql`SELECT 1`);
    console.log('Connected to PostgreSQL');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    // Don't exit in production, just log the error
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
  }
};

checkDBConnection();

// Extend session type
declare module 'express-session' {
  interface SessionData {
    userId?: number;
    user?: {
      email: string;
    };
  }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
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

// Public packages route (no authentication required)
app.get('/api/investments/packages', async (req, res) => {
  try {
    const packages = await db.query.investmentPackages.findMany()
    
    const formattedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      minInvestment: Number(pkg.minimumInvestment),
      dailyReturn: Number(pkg.dailyInterestRate),
      duration: pkg.duration,
      description: pkg.description
    }))

    res.json({ packages: formattedPackages })
  } catch (error) {
    console.error('Get packages error:', error)
    res.status(500).json({ error: 'Failed to fetch packages' })
  }
});

app.use('/api/investments', investmentLimiter, requireAuth, investmentRouter);

// Root route
app.get('/', (req, res) => {
  res.redirect('/api/health');
});

// Favicon route to prevent 404s
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Robots.txt route
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /api/\nAllow: /');
});

app.get('/api/health', async (req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ 
      status: 'ok',
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.json({ 
      status: 'error',
      database: 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Investment routes
app.get('/api/packages', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Gold Package',
      minInvestment: 1000,
      dailyReturn: 4.5,
      duration: 30,
      description: 'Perfect for beginners'
    },
    {
      id: 2,
      name: 'Platinum Package',
      minInvestment: 2500,
      dailyReturn: 8.5,
      duration: 30,
      description: 'For serious investors'
    },
    {
      id: 3,
      name: 'Diamond Package',
      minInvestment: 5000,
      dailyReturn: 15,
      duration: 30,
      description: 'Premium investment opportunity'
    }
  ]);
});

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method 
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 