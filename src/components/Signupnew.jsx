import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Header from "./Header";

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({});
  const [userName, setUserName] = useState("");

  const apiURL = import.meta.env.VITE_APP_API_URL;

  const validateFields = () => {
    const errors = {};

    if (!firstName) errors.firstName = "First Name is required.";
    if (!lastName) errors.lastName = "Last Name is required.";

    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      errors.phone = "Please enter a valid 10-digit phone number.";
    }

    // Password validation with regex: at least one uppercase letter, one lowercase letter, one number, and one special character
    if (!password) errors.password = "Password is required.";
    else if (password.length < 4) {
      errors.password = "Password must be at least 4 characters long.";
    }
  
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setError(errors);

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    // Username generation logic
    if (firstName && lastName && phone.length === 10) {
      const username = `${firstName}_${lastName?.charAt(0)}_${phone.slice(-4)}`;
      setUserName(username);
    }
  }, [firstName, lastName, phone]); // Recalculate username when any of the fields change

  const handleSignUp = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.post(`${apiURL}/auth/register_with_password`, {
        firstName,
        lastName,
        phoneNumber: phone,
        password,
      });

      if (response?.data?.statusCode === 200) {
        navigate("/"); // Navigate to the login page on success
      } else {
        setError({ form: response?.data?.message || "Registration failed. Please try again." });
      }
    } catch (err) {
      setError({ form: err.response?.data?.message || "An error occurred. Please try again." });
    }
  };

  // Handle back function
  const handleBack = () => {
    navigate(-1); // This will navigate the user to the previous page
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Header />
        <Toolbar>
          <IconButton edge="start" onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, fontFamily: "Poppins, sans-serif" }}>
            Register
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pt: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ mb: 2 }}
            error={Boolean(error.firstName)}
            helperText={error.firstName}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ mb: 2 }}
            error={Boolean(error.lastName)}
            helperText={error.lastName}
          />
          <TextField
            fullWidth
            label="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ mb: 2 }}
            error={Boolean(error.phone)}
            helperText={error.phone}
            inputProps={{
              maxLength: 10,
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
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
          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
            error={Boolean(error.confirmPassword)}
            helperText={error.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {userName && (
            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              Your username will be{" "}
              <Typography component="span" sx={{ fontWeight: "bold" }}>
                {userName}
              </Typography>
            </Typography>
          )}
          {error.form && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error.form}
            </Typography>
          )}
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ borderRadius: 7, fontFamily: "Poppins, sans-serif" }}
            onClick={handleSignUp}
          >
            Register
          </Button>
        </Paper>

        <Typography variant="body2" align="center" sx={{ mt: 3, fontFamily: "Poppins, sans-serif" }}>
          Already signed up?
          <Button
            onClick={() => navigate("/login")}
            sx={{ textTransform: "none", fontSize: "inherit" }}
          >
            Login
          </Button>
        </Typography>
      </Container>
    </Box>
  );
};

export default SignUp;
