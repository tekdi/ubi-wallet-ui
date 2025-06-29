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
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/wallet/login', {
        username,
        password
      });

      if (response.data.statusCode !== 200) {
        // Throw an error with the message from the response
        throw new Error(response.data.message || 'Login failed');
      }

      const { token: userToken, accountId, firstName, lastName, email, phone, username: userUsername } = response.data.data;

      // Create user object with all available information
      const userInfo = {
        accountId,
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        phone: phone || '',
        username: userUsername || username
      };

      // Store token and user info
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setToken(userToken);
      setUser(userInfo);

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

      return response.data;
    } catch (error) {
      // Return the error message from the response or from the thrown error
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};