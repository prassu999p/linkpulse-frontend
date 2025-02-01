import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');

    // Log request details
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!config.url?.includes('/auth')) {
      // Only redirect for non-auth endpoints
      window.location.href = '/login';
      return Promise.reject(new Error('No authentication token found'));
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    // Log error details
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      // Clear token on any 401 response
      localStorage.removeItem('auth_token');

      // Only redirect if not already on login page and not an auth endpoint
      const isAuthEndpoint = error.config.url?.includes('/auth');
      const isLoginPage = window.location.pathname === '/login';

      if (!isAuthEndpoint && !isLoginPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
