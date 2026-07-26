import axios from 'axios';

const api = axios.create({
  baseURL: 'https://foodshare-ch78qw5c2-vishnu-s-projects-efa10ec3.vercel.app/api', // Match the backend port in index.js
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
