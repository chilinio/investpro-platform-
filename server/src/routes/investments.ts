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

// Get investment stats and daily profits - MUST be before the /:id route
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userInvestments = await db.query.investments.findMany({
      where: eq(investments.userId, req.session.userId!),
      with: {
        package: true
      }
    });

    // Calculate daily profits for each investment
    const investmentStats = userInvestments.map(inv => {
      const startDate = new Date(inv.startDate!);
      const currentDate = new Date();
      const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const dailyRate = inv.package ? Number(inv.package.dailyInterestRate) / 100 : 0;
      const amount = Number(inv.amount);
      const dailyProfit = amount * dailyRate;
      const totalProfit = dailyProfit * Math.max(daysDiff, 0);
      
      return {
        id: inv.id,
        packageName: inv.package?.name || 'Unknown Package',
        amount,
        dailyProfit,
        totalProfit,
        daysDiff: Math.max(daysDiff, 0),
        status: inv.status,
        dailyRate: dailyRate * 100, // Convert back to percentage for display
        startDate: inv.startDate
      };
    });

    // Generate daily profit signals (mock data for now)
    const profitSignals = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const signalDate = new Date(today);
      signalDate.setDate(today.getDate() - i);
      
      const dailyTotal = investmentStats.reduce((sum, inv) => {
        if (inv.status === 'active' && new Date(inv.startDate!) <= signalDate) {
          return sum + inv.dailyProfit;
        }
        return sum;
      }, 0);

      profitSignals.push({
        date: signalDate.toISOString().split('T')[0],
        profit: Math.round(dailyTotal * 100) / 100,
        percentage: dailyTotal > 0 ? '+' + (dailyTotal / 1000 * 100).toFixed(2) + '%' : '0%'
      });
    }

    const totalInvestment = investmentStats.reduce((sum, inv) => sum + inv.amount, 0);
    const totalDailyProfit = investmentStats.reduce((sum, inv) => 
      inv.status === 'active' ? sum + inv.dailyProfit : sum, 0
    );
    const totalProfit = investmentStats.reduce((sum, inv) => sum + inv.totalProfit, 0);

    res.json({
      summary: {
        totalInvestment,
        totalDailyProfit: Math.round(totalDailyProfit * 100) / 100,
        totalProfit: Math.round(totalProfit * 100) / 100,
        activeInvestments: investmentStats.filter(inv => inv.status === 'active').length
      },
      investmentStats,
      profitSignals
    });

  } catch (error) {
    console.error('Get investment stats error:', error);
    res.status(500).json({ error: 'Failed to fetch investment stats' });
  }
});

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
      const startDate = new Date(inv.startDate!);
      const currentDate = new Date();
      const daysDiff = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      const dailyRate = inv.package ? Number(inv.package.dailyInterestRate) / 100 : 0;
      const amount = Number(inv.amount);
      const dailyProfit = amount * dailyRate;
      const totalProfit = dailyProfit * Math.max(daysDiff, 0);
      
      return {
        id: inv.id,
        packageName: inv.package?.name || 'Unknown Package',
        amount,
        status: inv.status,
        startDate: inv.startDate,
        endDate: inv.endDate,
        dailyReturn: dailyProfit,
        totalReturn: totalProfit,
        daysActive: Math.max(daysDiff, 0),
        package: inv.package ? {
          name: inv.package.name,
          dailyInterestRate: inv.package.dailyInterestRate,
          duration: inv.package.duration
        } : null
      };
    })

    res.json({ investments: formattedInvestments })
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
    const investmentId = parseInt(req.params.id);
    if (isNaN(investmentId)) {
      return res.status(400).json({ error: 'Invalid investment ID' });
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
    const investment = await db.query.investments.findFirst({
      where: eq(investments.id, Number(req.params.id))
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


export default router 