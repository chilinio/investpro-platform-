import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRouter from './routes/auth'; // Import the auth router
import investmentRouter from './routes/investments';
import contactRoutes from './routes/contact';
import { errorHandler } from './middleware/errorHandler';
import helmet from 'helmet';
import { db } from './db';
import { investmentPackages } from './db/schema';

dotenv.config();

// MongoDB connection with error handling
const connectDB = async () => {
  try {
    // Use local MongoDB instance
    await mongoose.connect('mongodb://127.0.0.1:27017/investpro');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit if we can't connect to the database
  }
};

connectDB();

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

// Routes
app.use('/api/auth', authRouter); // Use the auth router

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

app.use('/api/investments', requireAuth, investmentRouter);
app.use('/api/contact', contactRoutes);

// Root route
app.get('/', (req, res) => {
  res.redirect('/api/health');
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
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

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 