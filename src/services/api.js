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

// VC API service
export const vcApi = {
  // Get all VCs for a user
  getAllVcs: async (userId) => {
    try {
      const response = await api.get(`/api/wallet/${userId}/vcs`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch VCs';
    }
  },

  // Get specific VC by ID
  getVcById: async (userId, vcId) => {
    try {
      const response = await api.get(`/api/wallet/${userId}/vcs/${vcId}`);
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
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to upload VC';
    }
  }
}; 