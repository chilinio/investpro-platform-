import React, { useState, useEffect } from 'react';
import api from '../lib/api';

interface InvestmentStats {
  totalInvestment: number;
  activeInvestments: number;
  totalReturns: number;
  monthlyReturns: {
    month: string;
    returns: number;
  }[];
  investmentDistribution: {
    packageName: string;
    amount: number;
  }[];
}

const InvestmentStats: React.FC = () => {
  const [stats, setStats] = useState<InvestmentStats | null>(null);
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
    return (
      <div className="text-center py-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Investment</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            ${stats.totalInvestment.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Investments</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {stats.activeInvestments}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Returns</h3>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            ${stats.totalReturns.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Returns</h3>
          <div className="h-64">
            <div className="flex items-end h-48 space-x-2">
              {stats.monthlyReturns.map((item) => (
                <div key={item.month} className="flex-1">
                  <div
                    className="bg-blue-500 rounded-t"
                    style={{
                      height: `${(item.returns / Math.max(...stats.monthlyReturns.map(r => r.returns))) * 100}%`
                    }}
                  />
                  <div className="text-xs text-center mt-2 text-gray-500">
                    {item.month}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Distribution</h3>
          <div className="space-y-4">
            {stats.investmentDistribution.map((item) => (
              <div key={item.packageName}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.packageName}</span>
                  <span className="text-gray-900">${item.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(item.amount / stats.totalInvestment) * 100}%`
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