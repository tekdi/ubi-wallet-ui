import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, [token]);

  const login = async (email, deviceInfo = 'Web Application') => {
    try {
      const response = await api.post('/api/wallet/login', {
        email,
        deviceInfo
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const verifyOtp = async (sessionId, otp) => {
    try {
      const response = await api.post('/api/wallet/login/verify', {
        sessionId,
        otp
      });
      
      const { token: userToken, accountId } = response.data;
      
      // Store token
      localStorage.setItem('token', userToken);
      setToken(userToken);
      
      // Set user info
      setUser({ accountId });
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'OTP verification failed';
    }
  };

  const resendOtp = async (sessionId) => {
    try {
      const response = await api.post('/api/wallet/login/resend-otp', {
        sessionId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to resend OTP';
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/api/wallet/onboard', userData);
      
      const { token: userToken, accountId } = response.data;
      
      // Store token
      localStorage.setItem('token', userToken);
      setToken(userToken);
      
      // Set user info
      setUser({ accountId });
      
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Signup failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    verifyOtp,
    resendOtp,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 