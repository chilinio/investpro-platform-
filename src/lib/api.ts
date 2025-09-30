import axios from 'axios';

// Use local development server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  email: string;
}

export interface InvestmentPackage {
  id: number;
  name: string;
  minInvestment: number;
  dailyReturn: number;
  duration: number;
  description: string;
}

export const auth = {
  login: async (email: string, password: string) => {
    // Mock successful login for demo
    return {
      user: { email, firstName: 'Demo', lastName: 'User' },
      token: 'demo-token'
    };
  },
  logout: async () => {
    return { success: true };
  },
  getCurrentUser: async () => {
    return { email: 'demo@example.com' };
  }
};

export const packages = {
  getAll: async () => {
    // Mock investment packages for demo
    return {
      packages: [
        {
          id: 1,
          name: "Starter Package",
          minInvestment: 100,
          dailyReturn: 0.02,
          duration: 30,
          description: "Perfect for beginners"
        },
        {
          id: 2,
          name: "Growth Package", 
          minInvestment: 500,
          dailyReturn: 0.035,
          duration: 60,
          description: "Balanced growth opportunity"
        },
        {
          id: 3,
          name: "Premium Package",
          minInvestment: 1000,
          dailyReturn: 0.05,
          duration: 90,
          description: "High-yield investment"
        }
      ]
    };
  }
};

export default api; 