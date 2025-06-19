import { db } from './db/index';
import { investmentPackages } from './db/schema';

async function seed() {
  try {
    await db.insert(investmentPackages).values([
      {
        name: 'Gold Package',
        minimumInvestment: '1000.00',
        dailyInterestRate: '4.50',
        duration: 30,
        description: 'Perfect for beginners',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Platinum Package',
        minimumInvestment: '2500.00',
        dailyInterestRate: '8.50',
        duration: 30,
        description: 'For serious investors',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Diamond Package',
        minimumInvestment: '5000.00',
        dailyInterestRate: '15.00',
        duration: 30,
        description: 'Premium investment opportunity',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log('Seeded demo investment packages successfully!');
  } catch (err) {
    console.error('Error seeding investment packages:', err);
  } finally {
    process.exit();
  }
}

seed(); 