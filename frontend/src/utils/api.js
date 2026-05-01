// utils/api.js — Axios instance
// Locally: http://localhost:5000/api
// Production: REACT_APP_API_URL from Vercel environment variable
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('hireley_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      config.headers.Authorization = `Bearer ${user.token}`;
    } catch (e) {
      localStorage.removeItem('hireley_user');
    }
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hireley_user');
    }
    return Promise.reject(error);
  }
);

export default api;
