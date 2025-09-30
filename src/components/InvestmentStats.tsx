import React, { useState, useEffect } from 'react';
import api from '../lib/api';

interface InvestmentSummary {
  totalInvestment: number;
  totalDailyProfit: number;
  totalProfit: number;
  activeInvestments: number;
}

interface InvestmentStat {
  id: number;
  packageName: string;
  amount: number;
  dailyProfit: number;
  totalProfit: number;
  daysDiff: number;
  status: string;
  dailyRate: number;
  startDate: string;
}

interface ProfitSignal {
  date: string;
  profit: number;
  percentage: string;
}

interface StatsResponse {
  summary: InvestmentSummary;
  investmentStats: InvestmentStat[];
  profitSignals: ProfitSignal[];
}

const InvestmentStats: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock investment stats data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockStats: StatsResponse = {
          summary: {
            totalInvestment: 3500,
            totalDailyProfit: 107.5,
            totalProfit: 3225,
            activeInvestments: 2
          },
          investmentStats: [
            {
              id: 1,
              packageName: 'Starter Package',
              amount: 1000,
              dailyProfit: 20,
              totalProfit: 600,
              daysDiff: 30,
              status: 'active',
              dailyRate: 0.02,
              startDate: '2024-01-15'
            },
            {
              id: 2,
              packageName: 'Growth Package',
              amount: 2500,
              dailyProfit: 87.5,
              totalProfit: 2625,
              daysDiff: 45,
              status: 'active',
              dailyRate: 0.035,
              startDate: '2024-01-01'
            }
          ],
          profitSignals: [
            { date: '2024-01-01', profit: 87.5, percentage: '3.5%' },
            { date: '2024-01-02', profit: 95.2, percentage: '3.8%' },
            { date: '2024-01-03', profit: 78.3, percentage: '3.1%' },
            { date: '2024-01-04', profit: 102.1, percentage: '4.1%' },
            { date: '2024-01-05', profit: 89.7, percentage: '3.6%' },
            { date: '2024-01-06', profit: 115.3, percentage: '4.6%' },
            { date: '2024-01-07', profit: 93.8, percentage: '3.8%' }
          ]
        };
        
        setStats(mockStats);
        setError(null);
      } catch (err) {
        setError('Failed to fetch investment statistics. Please try again later.');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!stats) {
    return null;
  }

  // Calculate investment distribution from the investmentStats
  const investmentDistribution = stats.investmentStats.reduce((acc, inv) => {
    const existing = acc.find(item => item.packageName === inv.packageName);
    if (existing) {
      existing.amount += inv.amount;
    } else {
      acc.push({
        packageName: inv.packageName,
        amount: inv.amount
      });
    }
    return acc;
  }, [] as { packageName: string; amount: number }[]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Investment</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            ${stats.summary.totalInvestment.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Investments</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {stats.summary.activeInvestments}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Daily Profit</h3>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            ${stats.summary.totalDailyProfit.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Profit</h3>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            ${stats.summary.totalProfit.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Profit Signals (Last 7 Days)</h3>
          <div className="h-64">
            <div className="flex items-end h-48 space-x-2">
              {stats.profitSignals.map((signal) => {
                const maxProfit = Math.max(...stats.profitSignals.map(s => s.profit));
                const height = maxProfit > 0 ? (signal.profit / maxProfit) * 100 : 0;
                return (
                  <div key={signal.date} className="flex-1">
                    <div
                      className="bg-blue-500 rounded-t"
                      style={{
                        height: `${Math.max(height, 5)}%`,
                        minHeight: '4px'
                      }}
                    />
                    <div className="text-xs text-center mt-2 text-gray-500">
                      {new Date(signal.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-center text-gray-400">
                      ${signal.profit.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Distribution</h3>
          <div className="space-y-4">
            {investmentDistribution.map((item) => (
              <div key={item.packageName}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.packageName}</span>
                  <span className="text-gray-900">${item.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(item.amount / stats.summary.totalInvestment) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentStats; 