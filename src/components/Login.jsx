import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Button,
  TextField,
  Toolbar,
  IconButton,
  Container,
  InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Header from './Header';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ username: '', password: '', form: '' });

  const apiURL = import.meta.env.VITE_APP_API_URL;

  // Validate input fields
  const validateFields = () => {
    const errors = {};
    if (!username) errors.username = 'Username is required.';
    if (!password) errors.password = 'Password is required.';
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.post(`${apiURL}/auth/login`, { username, password });

      if (response?.data?.statusCode === 200) {
        // Store the auth token in local storage or session storage
        localStorage.setItem('authToken', response.data.data.access_token);
        localStorage.setItem('refreshToken',response.data.data.refresh_token)
        // Navigate to home page or dashboard
        const redirectUrl = localStorage.getItem('login-redirect') || '/home';
        navigate(redirectUrl);
      } else {
        setError((prevState) => ({
          ...prevState,
          form: response?.data?.message || 'Login failed. Please try again.',
        }));
      }
    } catch (err) {
      setError((prevState) => ({
        ...prevState,
        form: err.response?.data?.message || 'An error occurred. Please try again.',
      }));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      
      <AppBar position="static" color="transparent" elevation={0} sx={{ mt:8 }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1, fontFamily: 'Poppins, sans-serif' }}>
            Log In
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          {/* Username Input */}
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 3 }}
            error={Boolean(error.username)}
            helperText={error.username}
          />

          {/* Password Input */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            error={Boolean(error.password)}
            helperText={error.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Form Error */}
          {error.form && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error.form}
            </Typography>
          )}

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleLogin}
            sx={{ borderRadius: 7 }}
            disabled={!username || !password}
          >
            Log In
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
