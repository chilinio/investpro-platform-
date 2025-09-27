-- InvestPro Database Setup for Neon PostgreSQL
-- Run this in your Neon SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investment_packages table
CREATE TABLE IF NOT EXISTS investment_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    minimum_investment NUMERIC(10, 2) NOT NULL,
    daily_interest_rate NUMERIC(5, 2) NOT NULL,
    duration INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investments table
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
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    investment_id INTEGER REFERENCES investments(id),
    type VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample investment packages
INSERT INTO investment_packages (name, minimum_investment, daily_interest_rate, duration, description)
VALUES 
    ('Gold Package', 1000.00, 4.50, 30, 'Perfect for beginners'),
    ('Platinum Package', 2500.00, 8.50, 30, 'For serious investors'),
    ('Diamond Package', 5000.00, 15.00, 30, 'Premium investment opportunity')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id); 