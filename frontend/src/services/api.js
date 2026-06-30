import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally - redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Opportunities
export const getOpportunities = (params) => api.get('/opportunities', { params });
export const getOpportunityById = (id) => api.get(`/opportunities/${id}`);
export const createOpportunity = (data) => api.post('/opportunities', data);
export const updateOpportunity = (id, data) => api.put(`/opportunities/${id}`, data);
export const deleteOpportunity = (id) => api.delete(`/opportunities/${id}`);

export default api;
