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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import icon from "../assets/icon.svg";
import { languageOptions } from "../config";
import { useKeycloak } from "@react-keycloak/web";
import {jwtDecode} from 'jwt-decode'; // Fixed import

const LanguageSelect = () => {
  const { keycloak, initialized } = useKeycloak();
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("English");
  if(localStorage.getItem('logout')) {
    localStorage.clear();
  }

  // Handle redirect after successful login
  useEffect(() => {
    
    if (initialized && keycloak.authenticated) {
      const decoded = jwtDecode(keycloak.token);

      // Save authentication info in localStorage
      localStorage.setItem("authToken", keycloak.token);
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box
            component="img"
            src={icon}
            alt="Icon"
            sx={{
              width: 60, // Adjust width
              height: 60, // Adjust height
              display: "block", // Ensure image behaves like a block element
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontStyle: "italic",
              textAlign: "center", // Align text center
              lineHeight: "60px", // Match the image height for vertical centering
            }}
            gutterBottom
          >
            E-Wallet
          </Typography>
        </Box>
        <Typography variant="subtitle1">
          Unlock Opportunities, Seamlessly
        </Typography>
      </Box>

      {/* Language Selection Section */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "24px 24px 0 0",
          mt: "auto", // Push this section to the bottom of the screen
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
          sx={{ borderRadius: 7 }}
        >
          Log In to E-Wallet
        </Button>
      </Paper>
    </Box>
  );
};

export default LanguageSelect;
