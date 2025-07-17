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
  const [token, setToken] = useState(localStorage.getItem('walletToken'));
  const [loading, setLoading] = useState(true);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [waitingForParentAuth, setWaitingForParentAuth] = useState(false);

  useEffect(() => {
    // Check if we're in an iframe
    const embedded = window.parent && window.parent !== window;
    setIsEmbedded(embedded);

    // If we have existing auth data, use it immediately
    const existingToken = localStorage.getItem('walletToken');
    const existingUser = localStorage.getItem('user');

    if (existingToken && existingUser) {
      try {
        const userObj = JSON.parse(existingUser);
        setToken(existingToken);
        setUser(userObj);
        setLoading(false);
        setWaitingForParentAuth(false);
        return;
      } catch (error) {
        console.error('Error parsing existing user data:', error);
      }
    }

    // If we're embedded and don't have auth data, wait for parent to send it
    if (embedded && (!existingToken || !existingUser)) {
      setWaitingForParentAuth(true);
      // Set a timeout to stop waiting after reasonable time
      const timeout = setTimeout(() => {
        setWaitingForParentAuth(false);
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timeout)
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Update loading state when we have authentication data
    if (token && user) {
      setLoading(false);
      setWaitingForParentAuth(false);
    }
  }, [token, user]);

  // Listen for authentication data from parent window (for iframe embedding)
  useEffect(() => {
    const handleMessage = (event) => {
      // Validate origin - only accept messages from the configured parent origin
      const allowedOrigin = process.env.REACT_APP_PARENT_APP_ALLOWED_ORIGIN;
      if (!allowedOrigin) {
        console.error('REACT_APP_PARENT_APP_ALLOWED_ORIGIN environment variable is not configured');
        return;
      }
      if (event.origin !== allowedOrigin) {
        console.warn('Rejected message from untrusted origin:', event.origin, 'Expected:', allowedOrigin);
        return;
      }

      if (event.data?.type === 'WALLET_AUTH' && event.data?.data) {
        const { walletToken, user: userData, embeddedMode } = event.data.data;
        if (walletToken && userData) {
          // Handle user data - it might be a string or object
          let userObject;
          if (typeof userData === 'string') {
            try {
              userObject = JSON.parse(userData);
            } catch (error) {
              console.error('Failed to parse user data:', error);
              return;
            }
          } else {
            userObject = userData;
          }

          // Store the authentication data in localStorage
          localStorage.setItem('walletToken', walletToken);
          localStorage.setItem('user', JSON.stringify(userObject));
          if (embeddedMode) {
            localStorage.setItem('embeddedMode', 'true');
          }

          // Update state immediately
          setToken(walletToken);
          setUser(userObject);
          setWaitingForParentAuth(false);
          setLoading(false);

          // Set token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${walletToken}`;
        }
      }
    };

    // Only listen for messages if we're in an iframe
    if (isEmbedded) {
      window.addEventListener('message', handleMessage);

      // Send a ready message to parent to indicate iframe is loaded
      const readyMessage = {
        type: 'IFRAME_READY',
        data: { timestamp: new Date().toISOString() }
      };

      // Send ready message after a short delay to ensure parent is ready
      const sendReadyMessage = () => {
        try {
          // Use the configured parent origin or fall back to document.referrer origin
          const targetOrigin = process.env.REACT_APP_PARENT_APP_ALLOWED_ORIGIN;
          if (!targetOrigin) {
            console.error('REACT_APP_PARENT_APP_ALLOWED_ORIGIN environment variable is not configured');
            return;
          }
          window.parent.postMessage(readyMessage, targetOrigin);
        } catch (error) {
          console.error('Failed to send ready message to parent:', error);
        }
      };

      // Send immediately and also after a delay
      sendReadyMessage();
      const delayedTimeout = setTimeout(sendReadyMessage, 100);

      // Clean up event listener and timeout
      return () => {
        window.removeEventListener('message', handleMessage);
        clearTimeout(delayedTimeout);
      };
    }
  }, [isEmbedded]);

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

      const { token: userToken, accountId } = response.data.data;
      const { firstName, lastName, email, phone } = response?.data?.data?.user;

      // Create user object with all available information
      const userInfo = {
        accountId,
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        phone: phone || '',
      };

      // Store token and user info
      localStorage.setItem('walletToken', userToken);
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setToken(userToken);
      setUser(userInfo);

      // Set token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

      return response.data;
    } catch (error) {
      // Return the error message from the response or from the thrown error
      throw error.message || 'Login failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('walletToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading: loading || waitingForParentAuth,
    isAuthenticated,
    isEmbedded,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};