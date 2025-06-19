import React, { useState } from 'react';

interface CalculatorResult {
  totalInvestment: number;
  totalReturn: number;
  finalAmount: number;
  monthlyRate: number;
  futureValueInitial: number;
  futureValueMonthly: number;
}

const InvestmentCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    initialInvestment: '',
    monthlyContribution: '',
    expectedReturn: '',
    years: ''
  });
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/investments/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          initialInvestment: parseFloat(formData.initialInvestment),
          monthlyContribution: parseFloat(formData.monthlyContribution) || 0,
          expectedReturn: parseFloat(formData.expectedReturn),
          years: parseFloat(formData.years)
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate returns');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate returns');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-2">Investment Calculator</h2>
        <p className="text-muted-foreground mb-6">Calculate your potential investment returns</p>

        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={calculateInvestment} className="space-y-4">
          <div>
            <label htmlFor="initialInvestment" className="block text-sm font-medium text-foreground mb-1">
              Initial Investment ($)
            </label>
            <input
              type="number"
              id="initialInvestment"
              name="initialInvestment"
              value={formData.initialInvestment}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              min="0"
            />
          </div>

          <div>
            <label htmlFor="monthlyContribution" className="block text-sm font-medium text-foreground mb-1">
              Monthly Contribution ($)
            </label>
            <input
              type="number"
              id="monthlyContribution"
              name="monthlyContribution"
              value={formData.monthlyContribution}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="expectedReturn" className="block text-sm font-medium text-foreground mb-1">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              id="expectedReturn"
              name="expectedReturn"
              value={formData.expectedReturn}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div>
            <label htmlFor="years" className="block text-sm font-medium text-foreground mb-1">
              Investment Period (Years)
            </label>
            <input
              type="number"
              id="years"
              name="years"
              value={formData.years}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              required
              min="1"
              max="100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </form>

        {result && (
          <div className="mt-6 space-y-3">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Results</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Total Investment:</span>{' '}
                  <span className="font-medium">${result.totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Total Return:</span>{' '}
                  <span className="font-medium text-green-600">${result.totalReturn.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Final Amount:</span>{' '}
                  <span className="font-medium">${result.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Monthly Rate:</span>{' '}
                  <span className="font-medium">{(result.monthlyRate * 100).toFixed(2)}%</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentCalculator; 