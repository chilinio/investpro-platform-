import { Request, Response, NextFunction } from 'express'
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        firstName: string
        lastName: string
        email: string
      }
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.session.userId)
    })

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
} 