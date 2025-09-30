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
        const response = await api.get('/investments/stats');
        setStats(response.data);
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