import React, { useState, useEffect } from "react";
import "@fontsource/poppins";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import icon from "../assets/icon.svg";
import logo from "../assets/logo.svg";
import { languageOptions } from "../config";
import { useKeycloak } from "@react-keycloak/web";
import {jwtDecode} from 'jwt-decode'; // Fixed import

const LanguageSelect = () => {
  const { keycloak, initialized } = useKeycloak();
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("English");
  const token=localStorage.getItem('authToken');
  if(localStorage.getItem('logout')) {
    localStorage.clear();
  }

  // Handle redirect after successful login
  useEffect(() => {
    
    if (initialized && keycloak.authenticated) {
      const decoded = jwtDecode(keycloak.token);

      // Save authentication info in localStorage
      if(!token){
        localStorage.setItem("authToken", keycloak.token);
      }
      localStorage.setItem("ssoid", decoded.sub);


      const redirectUrl = localStorage.getItem('login-redirect') || '/home';
      navigate(redirectUrl);
    }
  }, [ keycloak?.authenticated, navigate, location.state]);

  // Handle the login process
  const handleLogin = async () => {
    try {
      await keycloak.login();
    } catch (error) {
      console.error("Login failed:", error instanceof Error ? error.message : "Unknown error");
    }
  };
  // Show loader if Keycloak is not initialized
  if (!initialized) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress size={50}/>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "#121943",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          p: 3,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            p: 3,
            gap: 1,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: 100,
              height: 38,
            }}
          />
          <Box
            component="img"
            src={icon}
            alt="Icon"
            sx={{
              width: 269,
              height: 51,
            }}
          />
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
              mt: 1,
            }}
          >
            Your Digital Identity
          </Typography>
        </Box>
      </Box>

      {/* Language Selection Section */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "24px 24px 0 0",
          mt: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Select Preferred Language
        </Typography>

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Select Language</InputLabel>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            label="Select Language"
          >
            {/* Dynamically generate MenuItems from the languageOptions */}
            {languageOptions.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2, display: "block" }}
        >
          You can change this later
        </Typography>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleLogin}
          sx={{
            borderRadius: 7,
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            bgcolor: "#121943",
          }}
        >
          Log In to DigiPramaan
        </Button>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          onClick={() => navigate("/signup")}
          sx={{
            borderRadius: 7,
            bgcolor: "white",
            fontFamily: "Poppins, sans-serif",
            textTransform: "none",
            color: "#121943",
            mt: 2,
            mb: 5,
          }}
        >
          Register
        </Button>
      </Paper>
    </Box>
  );
};

export default LanguageSelect;
