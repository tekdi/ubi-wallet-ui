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
  FormHelperText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MuiOtpInput } from "mui-one-time-password-input";
import Header from "./Header";

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [error, setError] = useState({ phone: "", otp: "" });
  const [tokens, setTokens] = useState(""); // Store the token received from the API
  const apiURL= import.meta.env.VITE_APP_API_URL;

  // Timer countdown logic
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const validatePhoneNumber = (phoneNumber) => {
    const regex = /^\d{10}$/;
    if (phoneNumber === "" || !regex.test(phoneNumber)) {
      setError((prevState) => ({
        ...prevState,
        phone: "Please enter a valid 10-digit phone number.",
      }));
    } else {
      setError((prevState) => ({ ...prevState, phone: "" }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    validatePhoneNumber(value);
  };

  const handleOtpChange = (newOtp) => {
    setOtp(newOtp);
    if (newOtp.length !== 6) {
      setError((prevState) => ({
        ...prevState,
        otp: "OTP must be exactly 6 digits.",
      }));
    } else {
      setError((prevState) => ({ ...prevState, otp: "" }));
    }
  };

  const handleProceed = async () => {
    if (!phone || error.phone) return;

    try {
      const response = await axios.post(`${apiURL}/otp/send_otp`, {
        phone_number: `+91-${phone}`,
      });

      setTokens(response.data.data.token); // Save the token for OTP verification
      setShowOtpSection(true);
      setTimer(300); // Start 5-minute timer
    } catch (err) {
      setError((prevState) => ({
        ...prevState,
        phone: err.response?.data?.message || "Failed to send OTP.",
      }));
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`${apiURL}/otp/send_otp`, {
        phone_number: `+91-${phone}`,
      });

      setTokens(response.data.data.token); // Save the token again
      setOtp("");
      setTimer(300); // Reset timer
    } catch (err) {
      setError((prevState) => ({
        ...prevState,
        phone: err.response?.data?.message || "Failed to resend OTP.",
      }));
    }
  };

  const handleSignUp = async () => {
    if (!otp || error.otp) return;

    try {
      // First, verify the OTP
      const otpResponse = await axios.post(`${apiURL}/otp/verify_otp`, {
        phone_number: `+91-${phone}`,
        otp: Number(otp),
        token: tokens,
      });
  
      // If OTP is verified successfully, proceed to register the user
      if (otpResponse?.data?.statusCode === 200) {
        const registrationResponse = await axios.post(`${apiURL}/auth/register`, {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phone,
        });
  
        // If registration is successful, navigate to the login page
        if (registrationResponse?.data?.statusCode === 200) {
          navigate("/");
        } else {
          // Handle registration failure (optional)
          setError((prevState) => ({
            ...prevState,
            otp: registrationResponse?.data?.message || "Registration failed. Please try again.",
          }));
        }
      } else {
        setError((prevState) => ({
          ...prevState,
          otp: otpResponse?.data?.message || "Invalid OTP. Please try again.",
        }));
      }
    } catch (err) {
      // Handle any other errors (network issues, etc.)
      setError((prevState) => ({
        ...prevState,
        otp: err.response?.data?.message || "An error occurred. Please try again.",
      }));
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Header/>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(-1)}>
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
          />
          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Mobile Number"
            value={phone}
            onChange={handlePhoneChange}
            sx={{ mb: 2 }}
            error={Boolean(error.phone)}
            helperText={error.phone}
            inputProps={{
              maxLength: 10,
            }}
          />

          {!showOtpSection && (
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ borderRadius: 7, fontFamily: "Poppins, sans-serif" }}
              onClick={handleProceed}
              disabled={!phone || Boolean(error.phone)}
            >
              Proceed
            </Button>
          )}

          {showOtpSection && (
            <>
              <Typography variant="subtitle1" sx={{ fontFamily: "Poppins, sans-serif", mb: 2 }}>
                Enter the 6-digit OTP sent via SMS
              </Typography>
              <MuiOtpInput
                value={otp}
                onChange={handleOtpChange}
                length={6}
                separator="-"
                sx={{ mb: 3 }}
              />
              {error.otp && (
                <FormHelperText error sx={{ mb: 2 }}>
                  {error.otp}
                </FormHelperText>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontFamily: "Poppins, sans-serif" }}>
                Resend OTP in {formatTime(timer)}
                <Button onClick={handleResendOtp} sx={{ p: 0, ml: 1, fontFamily: "Poppins, sans-serif" }}>
                  Resend
                </Button>
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ borderRadius: 7 }}
                onClick={handleSignUp}
                disabled={Boolean(error.otp) || !otp || otp.length !== 6}
              >
                Sign Up
              </Button>
            </>
          )}
        </Paper>

        <Typography variant="body2" align="center" sx={{ mt: 3, fontFamily: "Poppins, sans-serif" }}>
          Already signed up?
          <Button
            onClick={() => navigate("/")}
            sx={{ textTransform: "none", fontSize: "inherit" }}
          >
            Login
          </Button>
        </Typography>
      </Container>
    </Box>
  );
};

export default Signup;