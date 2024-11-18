import React, { useState, useEffect } from 'react';
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
  FormHelperText,
  InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MuiOtpInput } from 'mui-one-time-password-input';
import Header from './Header';

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState(''); // Store phone number without country code
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(300); // Start with 5 minutes (300 seconds)
  const [error, setError] = useState({ phone: '', otp: '' }); // Error state for validation

  // Timer countdown logic
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [timer]);

  // Format the timer as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Handle OTP change
  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
    validateOtp(newOtp); // Validate OTP on change
  };

  // Handle Phone number change
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    validatePhoneNumber(value); // Validate phone number on change
  };

  // Phone number validation (10 digits, starts with a valid number)
  const validatePhoneNumber = (phoneNumber) => {
    // Validate that phone number is exactly 10 digits
    const regex = /^\d{10}$/; 
    if (phoneNumber === '' || !regex.test(phoneNumber)) {
      setError((prevState) => ({
        ...prevState,
        phone: 'Please enter a valid 10-digit phone number.',
      }));
    } else {
      setError((prevState) => ({ ...prevState, phone: '' }));
    }
  };

  // OTP validation (exactly 6 digits)
  const validateOtp = (otpValue) => {
    if (otpValue.length !== 6) {
      setError((prevState) => ({
        ...prevState,
        otp: 'OTP must be exactly 6 digits.',
      }));
    } else {
      setError((prevState) => ({ ...prevState, otp: '' }));
    }
  };

  // Resend OTP logic (reset the timer)
  const handleResendOtp = () => {
    setOtp(''); // Clear OTP
    setTimer(300); // Reset the timer to 5 minutes
    setError((prevState) => ({ ...prevState, otp: '' })); // Clear OTP error
  };

  // Handle Login Button click
  const handleLogin = () => {
    // Basic validation before proceeding
    if (!error.phone && !error.otp && phone && otp.length === 6) {
      // Prepend the +91 country code to the phone number
      const fullPhoneNumber = `+91${phone}`;
      console.log('Phone Number:', fullPhoneNumber); // Use full phone number with country code

      // Proceed with login logic (Navigate or call API)
      navigate('/home');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, fontFamily: 'Poppins, sans-serif' }}>
            Log In to E-Wallet
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          {/* Phone Number Input with +91 as an InputAdornment */}
          <TextField
            fullWidth
            label="Mobile Number"
            value={phone}
            onChange={handlePhoneChange}
            sx={{ mb: 4 }}
            error={Boolean(error.phone)}
            helperText={error.phone}
            inputProps={{
              maxLength: 10, // Limit to 10 digits
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">+91</InputAdornment>, // Display +91 as non-editable
            }}
          />

          <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: 16 }} gutterBottom>
            Enter the 6-digit OTP sent via SMS
          </Typography>

          {/* OTP Input using MuiOtpInput */}
          <MuiOtpInput
            value={otp}
            onChange={handleOtpChange}
            length={6} // Set the number of OTP digits
            separator="-"
            sx={{ mb: 3 }} // Optional styling
          />

          {/* OTP Validation Error */}
          {error.otp && (
            <FormHelperText error sx={{ mb: 2 }}>
              {error.otp}
            </FormHelperText>
          )}

          {/* OTP Timer */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontFamily: 'Poppins, sans-serif', fontSize: 16 }}>
            Request to{' '}
            <Button sx={{ p: 0, minWidth: 0 }} onClick={handleResendOtp}>
              Resend OTP
            </Button>{' '}
            in {formatTime(timer)}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleLogin}
            sx={{ borderRadius: 7 }}
            disabled={Boolean(error.phone) || Boolean(error.otp) || !phone || otp.length !== 6}
          >
            Log In
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
