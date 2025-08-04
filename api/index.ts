import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

// CORS for Vercel frontend - allow all origins for now
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
}));
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to check JWT
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'No token' });
    return;
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
    req.user = user;
    next();
  });
}

// Register
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  console.log('Registration request:', { firstName, lastName, email, password: '***' });
  
  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ error: 'All fields required' });
    return;
  }
  
  try {
    // Test database connection first
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id, first_name, last_name, email',
      [firstName, lastName, email, hashed]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data in the format frontend expects
    const userResponse = {
      id: user.id.toString(),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    };
    
    console.log('Registration successful:', userResponse);
    res.json({ user: userResponse, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, first_name, last_name, email FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Investment packages
app.get('/api/investments/packages', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, minimum_investment, daily_interest_rate, duration, description FROM investment_packages');
    res.json({ packages: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Vercel handler
export default app; 