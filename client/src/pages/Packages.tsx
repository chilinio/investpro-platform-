import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Footer from '../components/Footer';

const Packages = () => {
  const { user } = useAuth();

  const packages = [
    {
      name: 'Starter Package',
      minAmount: 1000,
      maxAmount: 5000,
      dailyReturn: 2.5,
      duration: '30 days',
      description: 'Perfect for beginners looking to start their investment journey.'
    },
    {
      name: 'Growth Package',
      minAmount: 5000,
      maxAmount: 20000,
      dailyReturn: 3.5,
      duration: '60 days',
      description: 'Ideal for investors seeking higher returns with moderate risk.'
    },
    {
      name: 'Premium Package',
      minAmount: 20000,
      maxAmount: 100000,
      dailyReturn: 4.5,
      duration: '90 days',
      description: 'Our most exclusive package with the highest potential returns.'
    }
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Investment Packages</h1>
          <p className="text-muted-foreground">Choose the perfect package for your investment goals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.name} className="bg-card p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-foreground mb-2">{pkg.name}</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Investment Range</p>
                  <p className="text-foreground">${pkg.minAmount.toLocaleString()} - ${pkg.maxAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Return</p>
                  <p className="text-foreground">{pkg.dailyReturn}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-foreground">{pkg.duration}</p>
                </div>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="block w-full text-center bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90"
                  >
                    Invest Now
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full text-center bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90"
                  >
                    Login to Invest
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Packages; 