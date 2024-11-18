import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { languages } from "../config";
const Header = () => {
  // Define the state to store selected language
  const [language, setLanguage] = useState("EN");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ bgcolor: "#EDEFFF" }}
    >
      <Toolbar>
        {/* Menu Icon (Uncommented for use) */}
        {/* <IconButton edge="start">
          <MenuIcon />
        </IconButton> */}

        {/* E-Wallet Title */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            textAlign: "start",
            fontFamily: "Poppins, sans-serif",
            fontStyle: "italic",
          }}
        >
          E-Wallet
        </Typography>

        {/* Language Selector */}
        <FormControl
          sx={{
            m: 1,
            px:2,
            minWidth: 60, // Adjust this based on your layout
            border: "2px solid black", // Add border around the FormControl
            borderRadius: "8px", // Optional: adds rounded corners
          }}
          variant="standard"
        >
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            label="Language"
          >
            {languages.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
