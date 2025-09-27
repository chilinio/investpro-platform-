import React from 'react';

interface ProfitSignal {
  date: string;
  profit: number;
  percentage: string;
}

interface ProfitChartProps {
  signals: ProfitSignal[];
}

const ProfitChart: React.FC<ProfitChartProps> = ({ signals }) => {
  const maxProfit = Math.max(...signals.map(s => s.profit));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Profit Signals</h3>
      
      {/* Chart Area */}
      <div className="relative h-48 mb-4">
        <div className="absolute inset-0 flex items-end justify-between">
          {signals.map((signal, index) => {
            const height = maxProfit > 0 ? (signal.profit / maxProfit) * 100 : 0;
            return (
              <div key={index} className="flex flex-col items-center flex-1 mx-1">
                <div className="w-full flex justify-center mb-2">
                  <div 
                    className="bg-green-500 rounded-t-md transition-all duration-300 hover:bg-green-600 w-8"
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`$${signal.profit.toFixed(2)}`}
                  />
                </div>
                <div className="text-xs text-gray-600 text-center">
                  {new Date(signal.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Signals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 font-medium text-gray-700">Date</th>
              <th className="text-right py-2 px-3 font-medium text-gray-700">Profit</th>
              <th className="text-right py-2 px-3 font-medium text-gray-700">Change</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-900">
                  {new Date(signal.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-3 text-right font-medium text-green-600">
                  ${signal.profit.toFixed(2)}
                </td>
                <td className="py-2 px-3 text-right">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    signal.profit > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {signal.percentage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitChart;
