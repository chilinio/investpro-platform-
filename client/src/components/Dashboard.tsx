import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import InvestmentStats from './InvestmentStats';
import ProfitChart from './ProfitChart';

interface Investment {
  id: string;
  packageName: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
  dailyReturn: number;
  totalReturn: number;
  daysActive: number;
  package?: {
    name: string;
    dailyInterestRate: string;
    duration: number;
  };
}

interface DashboardStats {
  totalInvestment: number;
  activeInvestments: number;
  totalReturns: number;
  totalDailyProfit?: number;
  totalProfit?: number;
}

interface ProfitSignal {
  date: string;
  profit: number;
  percentage: string;
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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalInvestment: 0,
    activeInvestments: 0,
    totalReturns: 0
  });
  const [profitSignals, setProfitSignals] = useState<ProfitSignal[]>([]);
  const [investmentStats, setInvestmentStats] = useState<InvestmentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvestments = useCallback(async () => {
    try {
      const response = await api.get('/investments');
      const data = response.data;
      const investmentsArray = data.investments || [];
      setInvestments(investmentsArray);
      
      // Calculate basic stats
      const totalInvestment = investmentsArray.reduce((sum: number, inv: Investment) => sum + inv.amount, 0);
      const activeInvestments = investmentsArray.filter((inv: Investment) => inv.status === 'active').length;
      const totalReturns = investmentsArray.reduce((sum: number, inv: Investment) => sum + inv.totalReturn, 0);
      
      setStats({
        totalInvestment,
        activeInvestments,
        totalReturns
      });
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch investments. Please try again later.');
      console.error('Error fetching investments:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchProfitStats = useCallback(async () => {
    try {
      const response = await api.get('/investments/stats');
      const data = response.data;
      
      if (data.summary) {
        setStats(prev => ({
          ...prev,
          totalDailyProfit: data.summary.totalDailyProfit,
          totalProfit: data.summary.totalProfit
        }));
      }
      
      if (data.profitSignals) {
        setProfitSignals(data.profitSignals);
      }
      
      if (data.investmentStats) {
        setInvestmentStats(data.investmentStats);
      }
    } catch (err) {
      console.error('Error fetching profit stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchInvestments();
    fetchProfitStats();
  }, [fetchInvestments, fetchProfitStats]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchInvestments();
    fetchProfitStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {refreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </>
          )}
        </button>
      </div>

      <InvestmentStats />

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Investment</dt>
                <dd className="text-lg font-medium text-gray-900">${stats.totalInvestment.toFixed(2)}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Daily Profit</dt>
                <dd className="text-lg font-medium text-green-600">${(stats.totalDailyProfit || 0).toFixed(2)}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Profit</dt>
                <dd className="text-lg font-medium text-purple-600">${(stats.totalProfit || 0).toFixed(2)}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Investments</dt>
                <dd className="text-lg font-medium text-orange-600">{stats.activeInvestments}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Profit Chart */}
      {profitSignals.length > 0 && (
        <ProfitChart signals={profitSignals} />
      )}

      {/* Investment Details */}
      {investmentStats.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Package</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Daily Rate</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Daily Profit</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Total Profit</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Days</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {investmentStats.map((investment) => (
                  <tr key={investment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{investment.packageName}</td>
                    <td className="py-3 px-4 text-right text-gray-900">${investment.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-blue-600">{investment.dailyRate.toFixed(2)}%</td>
                    <td className="py-3 px-4 text-right text-green-600 font-medium">${investment.dailyProfit.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-semibold">${investment.totalProfit.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-gray-600">{investment.daysDiff}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        investment.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : investment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {investment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Investments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Days Active</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Profit</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Profit</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-2">No investments yet</p>
                      <p className="text-gray-600 mb-4">Start investing to see your portfolio here</p>
                      <a href="/invest" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Browse Investment Packages
                      </a>
                    </div>
                  </td>
                </tr>
              ) : (
                investments.map((investment) => (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {investment.packageName || investment.package?.name || 'Unknown Package'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Started: {new Date(investment.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ${investment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                      {investment.daysActive || 0} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                      ${investment.dailyReturn.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                      ${investment.totalReturn.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        investment.status === 'active' ? 'bg-green-100 text-green-800' :
                        investment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View Details
                      </button>
                      {investment.status === 'active' && (
                        <button className="text-red-600 hover:text-red-900">
                          Withdraw
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 