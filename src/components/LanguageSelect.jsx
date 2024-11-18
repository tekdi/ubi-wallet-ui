import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import icon from "../assets/icon.svg";
import { languageOptions } from "../config";

const LanguageSelect = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("English");

  return (
    <Box
      sx={{
        minHeight: "100dvh", // Ensure the container takes up the full viewport height
        bgcolor: "#121943",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // To make sure content is evenly spaced
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
            alignItems: "center", // Vertically align items
            justifyContent: "center", // Horizontally center the content
            gap: 2, // Space between the image and the text
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
          onClick={() => navigate("/login")}
          sx={{ borderRadius: 7 }}
        >
          Log In to E-Wallet
        </Button>
      </Paper>
    </Box>
  );
};

export default LanguageSelect;
