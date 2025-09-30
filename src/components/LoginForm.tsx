import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useForm } from '../hooks/useForm';
import api from '../lib/api';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotifications();

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm<LoginFormData>(
    { email: '', password: '' },
    {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: {
        required: true,
        minLength: 6,
      },
    }
  );

  const onSubmit = async (formData: LoginFormData) => {
    try {
      // Mock successful login for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        user: {
          id: Date.now(),
          firstName: 'Demo',
          lastName: 'User',
          email: formData.email
        },
        token: 'demo-token'
      };
      
      const { user, token } = mockResponse;
      
      // Store the token
      localStorage.setItem('token', token);
      
      // Create user object for auth context
      const userData = {
        id: user.id.toString(),
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      };
      
      login(userData);
      addNotification({
        type: 'success',
        message: 'Login successful! Welcome back.',
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      addNotification({
        type: 'error',
        message: err.response?.data?.error || 'Login failed. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }}>
          <div className="rounded-md shadow-sm -space-y-px">
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
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
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
                autoComplete="current-password"
                required
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password && touched.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
            </div>
          </div>

          {errors.email && touched.email && (
            <div className="text-red-600 text-sm">{errors.email}</div>
          )}
          {errors.password && touched.password && (
            <div className="text-red-600 text-sm">{errors.password}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm; 