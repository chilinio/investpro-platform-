import { Router } from 'express'
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

const router = Router()

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.user = {
      email: user.email
    };

    res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      token: 'session-based-auth' // Since we're using sessions, not JWT
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err)
      return res.status(500).json({ error: 'Failed to logout' })
    }
    res.json({ success: true })
  })
})

// Get current user
router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.session.userId)
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Register route
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const [newUser] = await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).returning()

    // Set session
    req.session.userId = newUser.id;
    req.session.user = {
      email: newUser.email
    };

    res.status(201).json({
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      },
      token: 'session-based-auth' // Since we're using sessions, not JWT
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

export default router 