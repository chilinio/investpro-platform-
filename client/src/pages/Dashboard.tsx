import React from 'react';
import { useAuth } from '../lib/auth';
import { Link } from 'wouter';
import Footer from '../components/Footer';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const portfolioStats = {
    totalInvestment: 5000,
    totalReturns: 750,
    activeInvestments: 2,
    pendingWithdrawals: 250
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'Investment',
      amount: 2500,
      date: '2024-03-15',
      status: 'Completed'
    },
    {
      id: 2,
      type: 'Return',
      amount: 187.5,
      date: '2024-03-16',
      status: 'Completed'
    },
    {
      id: 3,
      type: 'Withdrawal',
      amount: 250,
      date: '2024-03-17',
      status: 'Pending'
    }
  ];

  const activeInvestments = [
    {
      id: 1,
      package: 'Platinum Package',
      amount: 2500,
      startDate: '2024-03-15',
      dailyReturn: 8.5,
      totalReturns: 187.5
    },
    {
      id: 2,
      package: 'Gold Package',
      amount: 1000,
      startDate: '2024-03-10',
      dailyReturn: 4.5,
      totalReturns: 90
    }
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-2">Total Investment</h2>
            <p className="text-2xl font-bold text-primary">$0.00</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-2">Total Returns</h2>
            <p className="text-2xl font-bold text-primary">$0.00</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-2">Active Packages</h2>
            <p className="text-2xl font-bold text-primary">0</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="text-muted-foreground text-center py-8">
            No recent activity to display
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard; 