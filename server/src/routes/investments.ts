import { Router } from 'express'
import { db } from '../db'
import { investments, investmentPackages, transactions } from '../db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '../middleware/auth'
import type { InferSelectModel } from 'drizzle-orm'

type Investment = InferSelectModel<typeof investments>
type InvestmentPackage = InferSelectModel<typeof investmentPackages>

interface InvestmentWithPackage extends Investment {
  package: InvestmentPackage | null
}

const router = Router()

// Get all investments for current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userInvestments = await db.query.investments.findMany({
      where: eq(investments.userId, req.session.userId!),
      with: {
        package: true
      }
    }) as InvestmentWithPackage[]

    const formattedInvestments = userInvestments.map(inv => {
      const amount = Number(inv.amount);
      const dailyRate = inv.package ? Number(inv.package.dailyInterestRate) : 0;
      const duration = inv.package ? Number(inv.package.duration) : 0;
      const dailyReturn = amount * (dailyRate / 100);
      const totalReturn = dailyReturn * duration;

      return {
        id: inv.id,
        packageName: inv.package ? inv.package.name : '',
        amount,
        startDate: inv.startDate,
        endDate: inv.endDate,
        status: inv.status,
        dailyReturn,
        totalReturn,
      };
    });

    res.json({ investments: formattedInvestments });
  } catch (error) {
    console.error('Get investments error:', error)
    res.status(500).json({ error: 'Failed to fetch investments' })
  }
})

// Create new investment
router.post('/', requireAuth, async (req, res) => {
  try {
    const { packageId, amount } = req.body

    // Check if package exists
    const pkg = await db.query.investmentPackages.findFirst({
      where: eq(investmentPackages.id, packageId)
    })

    if (!pkg) {
      return res.status(404).json({ error: 'Investment package not found' })
    }

    // Check minimum investment
    if (Number(amount) < Number(pkg.minimumInvestment)) {
      return res.status(400).json({ 
        error: `Minimum investment amount is ${pkg.minimumInvestment}` 
      })
    }

    // Create investment
    const [investment] = await db.insert(investments).values({
      userId: req.session.userId!,
      packageId,
      amount: amount.toString(),
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000)
    }).returning()

    // Create transaction record
    await db.insert(transactions).values({
      userId: req.session.userId!,
      investmentId: investment.id,
      type: 'investment',
      amount: `-${amount}`,
      status: 'completed'
    })

    res.status(201).json(investment)
  } catch (error) {
    console.error('Create investment error:', error)
    res.status(500).json({ error: 'Failed to create investment' })
  }
})

// Get investment details
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const investmentId = Number(req.params.id)
    console.log('Fetching investment with ID:', req.params.id, 'Parsed:', investmentId)
    // Validate that the ID is a valid number
    if (isNaN(investmentId)) {
      return res.status(400).json({ error: 'Invalid investment ID' })
    }
    const investment = await db.query.investments.findFirst({
      where: eq(investments.id, investmentId),
      with: {
        package: true
      }
    })
    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' })
    }
    if (investment.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }
    res.json({
      id: investment.id,
      amount: investment.amount,
      status: investment.status,
      startDate: investment.startDate,
      endDate: investment.endDate,
      package: investment.package ? {
        name: investment.package.name,
        dailyInterestRate: investment.package.dailyInterestRate,
        duration: investment.package.duration
      } : null
    })
  } catch (error) {
    console.error('Get investment error:', error)
    res.status(500).json({ error: 'Failed to fetch investment' })
  }
})

// Cancel investment
router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const investmentId = Number(req.params.id)
    
    // Validate that the ID is a valid number
    if (isNaN(investmentId)) {
      return res.status(400).json({ error: 'Invalid investment ID' })
    }

    const investment = await db.query.investments.findFirst({
      where: eq(investments.id, investmentId)
    })

    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' })
    }

    if (investment.userId !== req.session.userId) {
      return res.status(403).json({ error: 'Not authorized' })
    }

    if (investment.status !== 'active') {
      return res.status(400).json({ error: 'Investment is not active' })
    }

    // Update investment status
    await db.update(investments)
      .set({ status: 'cancelled' })
      .where(eq(investments.id, investment.id))

    // Create refund transaction
    await db.insert(transactions).values({
      userId: req.session.userId!,
      investmentId: investment.id,
      type: 'refund',
      amount: investment.amount,
      status: 'completed'
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Cancel investment error:', error)
    res.status(500).json({ error: 'Failed to cancel investment' })
  }
})

// Calculate investment returns
router.post('/calculate', requireAuth, async (req, res) => {
  try {
    const { initialInvestment, monthlyContribution, expectedReturn, years } = req.body

    // Validate inputs
    if (!initialInvestment || !expectedReturn || !years) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Calculate monthly rate
    const monthlyRate = expectedReturn / 12 / 100

    // Calculate future value of initial investment
    const futureValueInitial = initialInvestment * Math.pow(1 + monthlyRate, years * 12)

    // Calculate future value of monthly contributions
    const futureValueContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, years * 12) - 1) / monthlyRate)

    // Calculate total investment
    const totalInvestment = Number(initialInvestment) + (Number(monthlyContribution) * years * 12)

    // Calculate final amount
    const finalAmount = futureValueInitial + futureValueContributions

    // Calculate total return
    const totalReturn = finalAmount - totalInvestment

    res.json({
      totalInvestment,
      totalReturn,
      finalAmount,
      monthlyRate: monthlyRate * 100
    })
  } catch (error) {
    console.error('Calculate returns error:', error)
    res.status(500).json({ error: 'Failed to calculate returns' })
  }
})

// Add a dummy stats route to prevent 400 errors
router.get('/stats', requireAuth, async (req, res) => {
  // Return dummy stats for now
  res.json({
    totalInvestment: 0,
    activeInvestments: 0,
    totalReturns: 0,
    monthlyReturns: [],
    investmentDistribution: []
  });
});

export default router 