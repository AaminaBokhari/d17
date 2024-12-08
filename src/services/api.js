import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('doctor_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';

    if (error.response?.status === 401) {
      localStorage.removeItem('doctor_token');
      window.location.href = '/login';
    }

    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (credentials) => {
    // Implement login logic
  },
  logout: async () => {
    // Implement logout logic
  },
};

export default api;
