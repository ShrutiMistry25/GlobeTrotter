import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('gt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error.response?.status;
    if (status === 401 && !String(error.config?.url).includes('/auth/')) {
      localStorage.removeItem('gt_token');
      localStorage.removeItem('gt_user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(
      new Error(error.response?.data?.error || error.message || 'Something went wrong')
    );
  }
);

export default client;
