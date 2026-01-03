import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const testService = {
  getAll: () => api.get('/tests'),
  getById: (id) => api.get(`/tests/${id}`),
  create: (data) => api.post('/tests', data),
  update: (id, data) => api.put(`/tests/${id}`, data),
  delete: (id) => api.delete(`/tests/${id}`),
  getAnalytics: () => api.get('/tests/analytics/summary'),
  getSubjectAnalytics: () => api.get('/tests/analytics/subjects'),
};

export const goalService = {
  get: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
};

export const subjectService = {
  getAll: () => api.get('/subjects'),
};

export default api;

