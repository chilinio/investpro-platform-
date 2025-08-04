import { db } from './index';
import { sql } from 'drizzle-orm';
import { investmentPackages } from './schema';

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create tables manually
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS investment_packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        minimum_investment NUMERIC(10, 2) NOT NULL,
        daily_interest_rate NUMERIC(5, 2) NOT NULL,
        duration INTEGER NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS investments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        package_id INTEGER NOT NULL REFERENCES investment_packages(id),
        amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'active' NOT NULL,
        start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        end_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        investment_id INTEGER REFERENCES investments(id),
        type VARCHAR(50) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    console.log('Tables created successfully!');

    // Seed investment packages
    await db.execute(sql`
      INSERT INTO investment_packages (name, minimum_investment, daily_interest_rate, duration, description)
      VALUES 
        ('Gold Package', 1000.00, 4.50, 30, 'Perfect for beginners'),
        ('Platinum Package', 2500.00, 8.50, 30, 'For serious investors'),
        ('Diamond Package', 5000.00, 15.00, 30, 'Premium investment opportunity')
      ON CONFLICT (id) DO NOTHING
    `);

    console.log('Investment packages seeded successfully!');
    console.log('Database setup completed!');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    process.exit();
  }
}

setupDatabase(); 