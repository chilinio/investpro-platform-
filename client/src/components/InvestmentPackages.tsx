import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import api from '../lib/api';
import { useForm } from '../hooks/useForm';

interface Package {
  id: string;
  name: string;
  minInvestment: number;
  dailyReturn: number;
  duration: number;
  description: string;
}

interface InvestmentFormData {
  packageId: string;
  amount: string;
}

const InvestmentPackages: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset } = useForm<InvestmentFormData>(
    { packageId: '', amount: '' },
    {
      packageId: {
        required: true,
        custom: (value) => !!value
      },
      amount: {
        required: true,
        custom: (value, formData) => {
          if (!selectedPackage) return false;
          const amount = parseFloat(value);
          return !isNaN(amount) && amount >= selectedPackage.minInvestment;
        }
      }
    }
  );

  const fetchPackages = useCallback(async () => {
    try {
      const response = await api.get('/investments/packages');
      setPackages(response.data.packages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch investment packages. Please try again later.');
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
    handleChange('packageId', pkg.id);
  };

  const onSubmit = async (formData: InvestmentFormData) => {
    try {
      const response = await api.post('/investments', {
        packageId: parseInt(formData.packageId),
        amount: parseFloat(formData.amount)
      });
      console.log('Investment creation response:', response.data);
      addNotification({
        type: 'success',
        message: 'Investment created successfully!',
      });
      reset();
      setSelectedPackage(null);
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      addNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create investment. Please try again.',
      });
    }
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
          onClick={fetchPackages}
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
        <h1 className="text-2xl font-bold text-gray-900">Investment Packages</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedPackage?.id === pkg.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
            }`}
            onClick={() => handlePackageSelect(pkg)}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Minimum Investment:</span>
                  <span className="font-medium">${pkg.minInvestment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Daily Return:</span>
                  <span className="font-medium text-green-600">{pkg.dailyReturn}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{pkg.duration} days</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPackage && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Investment</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Investment Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  value={values.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  onBlur={() => handleBlur('amount')}
                  className={`block w-full pl-7 pr-12 sm:text-sm rounded-md ${
                    errors.amount && touched.amount ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && touched.amount && (
                <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating Investment...' : 'Create Investment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InvestmentPackages; 