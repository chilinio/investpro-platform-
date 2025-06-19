import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useForm } from '../hooks/useForm';
import api from '../lib/api';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotifications();

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm<RegisterFormData>(
    { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
    {
      firstName: {
        required: true,
        minLength: 2,
      },
      lastName: {
        required: true,
        minLength: 2,
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: {
        required: true,
        minLength: 6,
      },
      confirmPassword: {
        required: true,
        custom: (value, formData) => value === formData.password,
      },
    }
  );

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      console.log('Submitting registration data:', formData);
      
      const response = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Registration response:', response.data);
      
      const user = response.data;
      
      // Create user object for auth context
      const userData = {
        id: user.id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      };
      
      // Login the user
      login(userData);
      
      addNotification({
        type: 'success',
        message: 'Registration successful! Welcome to InvestPro.',
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      
      addNotification({
        type: 'error',
        message: err.response?.data?.error || 'Registration failed. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={values.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.firstName && touched.firstName ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={values.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.lastName && touched.lastName ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Last Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email && touched.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password && touched.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={values.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.confirmPassword && touched.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
              />
            </div>
          </div>

          {errors.firstName && touched.firstName && (
            <div className="text-red-600 text-sm">{errors.firstName}</div>
          )}
          {errors.lastName && touched.lastName && (
            <div className="text-red-600 text-sm">{errors.lastName}</div>
          )}
          {errors.email && touched.email && (
            <div className="text-red-600 text-sm">{errors.email}</div>
          )}
          {errors.password && touched.password && (
            <div className="text-red-600 text-sm">{errors.password}</div>
          )}
          {errors.confirmPassword && touched.confirmPassword && (
            <div className="text-red-600 text-sm">{errors.confirmPassword}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm; 