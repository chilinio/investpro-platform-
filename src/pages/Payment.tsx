import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

interface InvestmentDetails {
  amount: number;
  packageName: string;
  packageId: number;
  dailyReturn: number;
  totalReturn: number;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const investment = location.state?.investment as InvestmentDetails;

  return (
    <>
      <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-12 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-foreground">Make Your Payment</h1>
        
        {investment && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 text-foreground">Investment Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package:</span>
                <span className="font-medium">{investment.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">${investment.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Return:</span>
                <span className="font-medium">${investment.dailyReturn.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Return:</span>
                <span className="font-medium text-green-600">${investment.totalReturn.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <p className="mb-4 text-center text-muted-foreground">
          Please send your investment payment to one of the wallet addresses below. After payment, contact support with your transaction details for confirmation.
        </p>
        
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-2">Bitcoin (BTC)</h2>
            <div className="bg-gray-100 p-3 rounded border">
              <code className="text-sm break-all">bc1qqur7fv6czvt86u50lqk84tjs6askcskvdgzjaj</code>
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-2">USDT (ERC-20)</h2>
            <div className="bg-gray-100 p-3 rounded border">
              <code className="text-sm break-all">0x412a8fc04ecc4007a9b5c6efa76f64407193e1af</code>
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            After making your payment, please contact support with your transaction ID for confirmation.
          </p>
          <Link 
            to="/dashboard" 
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Payment; 