import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include token in requests
apiClient.interceptors.request.use(
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

// Authentication services
export const authService = {
  register: async (username: string, email: string, password: string) => {
    return apiClient.post('/auth/register', { username, email, password });
  },

  login: async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
    }
    return response;
  }
};

// Password management services
export const passwordService = {
  getAllPasswords: async () => {
    return apiClient.get('/passwords');
  },

  searchPasswords: async (query: string) => {
    return apiClient.get(`/passwords/search?query=${query}`);
  },

  getPassword: async (id: string, masterPassword: string) => {
    return apiClient.post(`/passwords/${id}`, { masterPassword });
  },

  addPassword: async (passwordData: {
    website: string;
    username: string;
    password: string;
    notes?: string;
  }, masterPassword: string) => {
    return apiClient.post('/passwords', {
      ...passwordData,
      masterPassword
    });
  },

  updatePassword: async (
    id: string,
    passwordData: {
      website: string;
      username: string;
      password: string;
      notes?: string;
    },
    masterPassword: string
  ) => {
    return apiClient.put(`/passwords/${id}`, {
      ...passwordData,
      masterPassword
    });
  },

  deletePassword: async (id: string) => {
    return apiClient.delete(`/passwords/${id}`);
  }
};