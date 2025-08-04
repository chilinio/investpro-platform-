import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://invest-k79xgdhaq-paddys-projects-0a00fd55.vercel.app/api';

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
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await api.get<User | null>('/auth/user');
    return data;
  }
};

export const packages = {
  getAll: async () => {
    const { data } = await api.get<InvestmentPackage[]>('/investments/packages');
    return data;
  }
};

export default api; 