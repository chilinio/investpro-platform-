import { Router } from 'express';
import { db } from '../db';
import { users, transactions } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth';
import { createNotification } from './notifications';

const router = Router();

// Create wallet table for user balances
const createWalletTable = async () => {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS wallets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE,
        balance NUMERIC(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    console.log('Wallets table ready');
  } catch (error) {
    console.error('Error creating wallets table:', error);
  }
};

// Initialize table on module load
createWalletTable();

// Get user wallet balance
router.get('/wallet', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;

    // Get or create wallet
    let walletResult = await db.execute(sql`
      SELECT * FROM wallets WHERE user_id = ${userId}
    `);

    if (walletResult.rows.length === 0) {
      // Create wallet if it doesn't exist
      await db.execute(sql`
        INSERT INTO wallets (user_id, balance) VALUES (${userId}, 0.00)
      `);
      walletResult = await db.execute(sql`
        SELECT * FROM wallets WHERE user_id = ${userId}
      `);
    }

    const wallet = walletResult.rows[0] as any;

    // Get recent transactions
    const recentTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, userId),
      orderBy: sql`created_at DESC`,
      limit: 10
    });

    res.json({
      balance: Number(wallet.balance),
      transactions: recentTransactions
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet information' });
  }
});

// Deposit funds (simulation - in production, integrate with payment gateway)
router.post('/deposit', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount' });
    }

    if (amount > 100000) {
      return res.status(400).json({ error: 'Maximum deposit amount is $100,000' });
    }

    // In production, here you would:
    // 1. Validate payment with payment gateway (Stripe, PayPal, etc.)
    // 2. Process the actual payment
    // 3. Update balance only after successful payment

    // For demo purposes, we'll simulate successful payment
    const depositAmount = Number(amount);

    // Start transaction
    await db.execute(sql`BEGIN`);

    try {
      // Update wallet balance
      await db.execute(sql`
        INSERT INTO wallets (user_id, balance) 
        VALUES (${userId}, ${depositAmount})
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          balance = wallets.balance + ${depositAmount},
          updated_at = NOW()
      `);

      // Create transaction record
      const [transaction] = await db.insert(transactions).values({
        userId,
        type: 'deposit',
        amount: depositAmount.toString(),
        status: 'completed'
      }).returning();

      // Create notification
      await createNotification(
        userId,
        'Deposit Successful',
        `Your deposit of $${depositAmount.toLocaleString()} has been processed successfully.`,
        'success'
      );

      await db.execute(sql`COMMIT`);

      res.json({
        success: true,
        transaction,
        message: 'Deposit processed successfully'
      });

    } catch (error) {
      await db.execute(sql`ROLLBACK`);
      throw error;
    }

  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ error: 'Failed to process deposit' });
  }
});

// Withdraw funds
router.post('/withdraw', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const { amount, withdrawalMethod, accountDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }

    if (amount < 10) {
      return res.status(400).json({ error: 'Minimum withdrawal amount is $10' });
    }

    // Get current balance
    const walletResult = await db.execute(sql`
      SELECT balance FROM wallets WHERE user_id = ${userId}
    `);

    if (walletResult.rows.length === 0) {
      return res.status(400).json({ error: 'Wallet not found' });
    }

    const currentBalance = Number((walletResult.rows[0] as any).balance);
    const withdrawalAmount = Number(amount);

    if (withdrawalAmount > currentBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Start transaction
    await db.execute(sql`BEGIN`);

    try {
      // Update wallet balance
      await db.execute(sql`
        UPDATE wallets 
        SET balance = balance - ${withdrawalAmount}, updated_at = NOW()
        WHERE user_id = ${userId}
      `);

      // Create transaction record (pending until processed)
      const [transaction] = await db.insert(transactions).values({
        userId,
        type: 'withdrawal',
        amount: `-${withdrawalAmount}`,
        status: 'pending'
      }).returning();

      // Create notification
      await createNotification(
        userId,
        'Withdrawal Request Submitted',
        `Your withdrawal request of $${withdrawalAmount.toLocaleString()} is being processed. Funds will be transferred within 1-3 business days.`,
        'info'
      );

      await db.execute(sql`COMMIT`);

      res.json({
        success: true,
        transaction,
        message: 'Withdrawal request submitted successfully'
      });

    } catch (error) {
      await db.execute(sql`ROLLBACK`);
      throw error;
    }

  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

// Get payment methods
router.get('/methods', requireAuth, async (req, res) => {
  try {
    // In production, these would be configured payment methods
    const paymentMethods = {
      deposit: [
        {
          id: 'card',
          name: 'Credit/Debit Card',
          type: 'card',
          minAmount: 10,
          maxAmount: 10000,
          fee: 0.029, // 2.9%
          processingTime: 'Instant'
        },
        {
          id: 'bank_transfer',
          name: 'Bank Transfer',
          type: 'bank',
          minAmount: 100,
          maxAmount: 100000,
          fee: 0.01, // 1%
          processingTime: '1-3 business days'
        },
        {
          id: 'crypto',
          name: 'Cryptocurrency',
          type: 'crypto',
          minAmount: 50,
          maxAmount: 50000,
          fee: 0.005, // 0.5%
          processingTime: '10-60 minutes'
        }
      ],
      withdrawal: [
        {
          id: 'bank_transfer',
          name: 'Bank Transfer',
          type: 'bank',
          minAmount: 10,
          maxAmount: 50000,
          fee: 5, // Flat $5 fee
          processingTime: '1-3 business days'
        },
        {
          id: 'crypto',
          name: 'Cryptocurrency',
          type: 'crypto',
          minAmount: 20,
          maxAmount: 25000,
          fee: 0.01, // 1%
          processingTime: '10-60 minutes'
        }
      ]
    };

    res.json(paymentMethods);

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Get transaction history
router.get('/transactions', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const type = req.query.type as string;
    const offset = (page - 1) * limit;

    let whereClause = `WHERE user_id = ${userId}`;
    if (type && ['deposit', 'withdrawal', 'investment', 'profit'].includes(type)) {
      whereClause += ` AND type = '${type}'`;
    }

    const transactionsResult = await db.execute(sql`
      SELECT * FROM transactions 
      ${sql.raw(whereClause)}
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `);

    // Get total count
    const totalResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM transactions ${sql.raw(whereClause)}
    `);
    const total = Number((totalResult.rows[0] as any).count);

    res.json({
      transactions: transactionsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Calculate fees for amount
router.post('/calculate-fees', requireAuth, async (req, res) => {
  try {
    const { amount, method, type } = req.body;

    if (!amount || !method || !type) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Mock fee calculation - in production, get from payment processor
    let fee = 0;
    let processingTime = 'Instant';

    switch (method) {
      case 'card':
        fee = Number(amount) * 0.029; // 2.9%
        processingTime = 'Instant';
        break;
      case 'bank_transfer':
        fee = type === 'deposit' ? Number(amount) * 0.01 : 5; // 1% or $5 flat
        processingTime = '1-3 business days';
        break;
      case 'crypto':
        fee = Number(amount) * (type === 'deposit' ? 0.005 : 0.01); // 0.5% or 1%
        processingTime = '10-60 minutes';
        break;
      default:
        return res.status(400).json({ error: 'Invalid payment method' });
    }

    const netAmount = type === 'deposit' 
      ? Number(amount) - fee 
      : Number(amount) + fee;

    res.json({
      amount: Number(amount),
      fee: Math.round(fee * 100) / 100,
      netAmount: Math.round(netAmount * 100) / 100,
      processingTime
    });

  } catch (error) {
    console.error('Calculate fees error:', error);
    res.status(500).json({ error: 'Failed to calculate fees' });
  }
});

export default router;
