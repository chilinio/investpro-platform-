import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Footer from '../components/Footer';

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to InvestPro
          </h1>
          <p className="text-xl text-muted-foreground">
            Your trusted partner in investment growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Why Choose InvestPro?
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Expert investment strategies</li>
              <li>• Secure and transparent platform</li>
              <li>• Competitive returns on investment</li>
              <li>• Professional portfolio management</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Investment Packages
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Starter Package: $1,000 - $5,000</li>
              <li>• Growth Package: $5,000 - $20,000</li>
              <li>• Premium Package: $20,000+</li>
              <li>• Custom Solutions Available</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home; 