import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  FormControl,
  Select,
  MenuItem,  
} from "@mui/material";
import { languages } from "../config";
import SlideMenu from "./SlideMenu";
const Header = () => {
  // Define the state to store selected language
  const [language, setLanguage] = useState("EN");
  const shouldShowSlideMenu = location.pathname !== "/signup";

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
        {/* Menu */}
        {shouldShowSlideMenu && <SlideMenu />}

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
          DigiPramaan
        </Typography>

        {/* Language Selector */}
        <FormControl
          sx={{
            m: 1,
            px:2,
            minWidth: 30,
            border: "2px solid black",
            borderRadius: "8px",
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
