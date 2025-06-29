import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: process.env.WALLET_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to automatically add authorization header
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

// Auth API service
export const authApi = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/api/wallet/onboard', userData);
      
      if (response.data.statusCode !== 200) {
        // Throw an error with the message from the response
        throw new Error(response.data.message || 'Registration failed');
      }
      
      return response.data;
    } catch (error) {
      // Return the error message from the response or from the thrown error
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  },

  // Login user
  login: async (username, password) => {
    try {
      const response = await api.post('/api/wallet/login', {
        username,
        password
      });
      
      if (response.data.statusCode !== 200) {
        // Throw an error with the message from the response
        throw new Error(response.data.message || 'Login failed');
      }
      
      return response.data;
    } catch (error) {
      // Return the error message from the response or from the thrown error
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  }
};

// VC API service
export const vcApi = {
  // Get all VCs for a user
  getAllVcs: async (userId) => {
    try {
      const response = await api.get(`/api/wallet/${userId}/vcs`);

      if (response.data.statusCode !== 200) {
        // Throw an error with the message from the response
        throw new Error(response?.data?.message || 'Failed to fetch VCs');
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch VCs';
    }
  },

  // Get specific VC by ID
  getVcById: async (userId, vcId) => {
    try {
      const response = await api.get(`/api/wallet/${userId}/vcs/${vcId}`);

      if (response.data.statusCode !== 200) {
        // Throw an error with the message from the response
        throw new Error(response?.data?.message || 'Failed to fetch VC');
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch VC';
    }
  },

  // Upload VC from QR code
  uploadFromQr: async (userId, qrData) => {
    try {
      const response = await api.post(`/api/wallet/${userId}/vcs/upload-qr`, {
        qrData
      });

      if (response.data.statusCode !== 200) {
        // Throw an error with the message from the response
        throw new Error(response?.data?.message || 'Failed to upload VC');
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to upload VC';
    }
  }
}; 