import axios from 'axios';

// Create axios instance
export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

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