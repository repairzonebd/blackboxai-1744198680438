import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

// Product API
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/product/${id}`);

// Auth API
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const getProfile = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/me/update', data);

// Order API
export const createOrder = (data) => api.post('/order/new', data);
export const getOrders = () => api.get('/orders/me');
export const getOrder = (id) => api.get(`/order/${id}`);

export default api;