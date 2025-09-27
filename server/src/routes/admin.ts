import { Router } from 'express';
import { db } from '../db';
import { users, investments, transactions, investmentPackages } from '../db/schema';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';
import bcrypt from 'bcrypt';

const router = Router();

// Admin authentication middleware
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, req.session.userId)
    });

    // For demo purposes, check if email contains 'admin' - in production, use proper role system
    if (!user || !user.email.toLowerCase().includes('admin')) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Get admin dashboard stats  
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    // Get total users count
    const totalUsersResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalUsers = Number(totalUsersResult[0].count);

    // Get total investments
    const totalInvestmentsResult = await db.select({ 
      count: sql<number>`count(*)`,
      sum: sql<number>`sum(CAST(amount as NUMERIC))`
    }).from(investments);
    const totalInvestments = Number(totalInvestmentsResult[0].count);
    const totalInvestmentAmount = Number(totalInvestmentsResult[0].sum) || 0;

    // Get active investments
    const activeInvestmentsResult = await db.select({ count: sql<number>`count(*)` })
      .from(investments)
      .where(eq(investments.status, 'active'));
    const activeInvestments = Number(activeInvestmentsResult[0].count);

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsersResult = await db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));
    const recentUsers = Number(recentUsersResult[0].count);

    // Get monthly investment trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);

      const monthlyResult = await db.select({ 
        count: sql<number>`count(*)`,
        sum: sql<number>`sum(CAST(amount as NUMERIC))`
      })
      .from(investments)
      .where(and(
        gte(investments.createdAt, startDate),
        lte(investments.createdAt, endDate)
      ));

      monthlyTrends.push({
        month: startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        investments: Number(monthlyResult[0].count),
        amount: Number(monthlyResult[0].sum) || 0
      });
    }

    res.json({
      stats: {
        totalUsers,
        totalInvestments,
        totalInvestmentAmount,
        activeInvestments,
        recentUsers
      },
      monthlyTrends
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard data' });
  }
});

// Get all users with pagination
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const allUsers = await db.query.users.findMany({
      limit,
      offset,
      orderBy: [desc(users.createdAt)],
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true
        // Exclude password
      }
    });

    // Get total count for pagination
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const total = Number(totalResult[0].count);

    // Get investment stats for each user
    const usersWithStats = await Promise.all(allUsers.map(async (user) => {
      const userInvestments = await db.select({
        count: sql<number>`count(*)`,
        sum: sql<number>`sum(CAST(amount as NUMERIC))`
      })
      .from(investments)
      .where(eq(investments.userId, user.id));

      return {
        ...user,
        totalInvestments: Number(userInvestments[0].count),
        totalInvestmentAmount: Number(userInvestments[0].sum) || 0
      };
    }));

    res.json({
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user details with investments
router.get('/users/:id', requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's investments
    const userInvestments = await db.query.investments.findMany({
      where: eq(investments.userId, userId),
      with: {
        package: true
      },
      orderBy: [desc(investments.createdAt)]
    });

    // Get user's transactions
    const userTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, userId),
      orderBy: [desc(transactions.createdAt)]
    });

    res.json({
      user,
      investments: userInvestments,
      transactions: userTransactions
    });

  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Create new investment package
router.post('/packages', requireAdmin, async (req, res) => {
  try {
    const { name, minimumInvestment, dailyInterestRate, duration, description } = req.body;

    if (!name || !minimumInvestment || !dailyInterestRate || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [newPackage] = await db.insert(investmentPackages).values({
      name,
      minimumInvestment: minimumInvestment.toString(),
      dailyInterestRate: dailyInterestRate.toString(),
      duration,
      description
    }).returning();

    res.status(201).json(newPackage);

  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ error: 'Failed to create investment package' });
  }
});

// Update investment package
router.put('/packages/:id', requireAdmin, async (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const { name, minimumInvestment, dailyInterestRate, duration, description } = req.body;

    const [updatedPackage] = await db.update(investmentPackages)
      .set({
        name,
        minimumInvestment: minimumInvestment?.toString(),
        dailyInterestRate: dailyInterestRate?.toString(),
        duration,
        description,
        updatedAt: new Date()
      })
      .where(eq(investmentPackages.id, packageId))
      .returning();

    if (!updatedPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json(updatedPackage);

  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ error: 'Failed to update investment package' });
  }
});

// Get all investments with filters
router.get('/investments', requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;
    const offset = (page - 1) * limit;

    let whereCondition = undefined;
    if (status) {
      whereCondition = eq(investments.status, status);
    }

    const allInvestments = await db.query.investments.findMany({
      where: whereCondition,
      limit,
      offset,
      orderBy: [desc(investments.createdAt)],
      with: {
        package: true,
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Get total count
    const totalResult = await db.select({ count: sql<number>`count(*)` })
      .from(investments)
      .where(whereCondition);
    const total = Number(totalResult[0].count);

    res.json({
      investments: allInvestments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get admin investments error:', error);
    res.status(500).json({ error: 'Failed to fetch investments' });
  }
});

// Update investment status
router.patch('/investments/:id/status', requireAdmin, async (req, res) => {
  try {
    const investmentId = parseInt(req.params.id);
    const { status } = req.body;

    if (!['active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [updatedInvestment] = await db.update(investments)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(investments.id, investmentId))
      .returning();

    if (!updatedInvestment) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    res.json(updatedInvestment);

  } catch (error) {
    console.error('Update investment status error:', error);
    res.status(500).json({ error: 'Failed to update investment status' });
  }
});

// Create admin user (for setup)
router.post('/create-admin', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [admin] = await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).returning({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email
    });

    res.status(201).json({ 
      message: 'Admin user created successfully',
      admin 
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

export default router;
