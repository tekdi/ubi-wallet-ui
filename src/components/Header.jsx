import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Box } from "@mui/material";
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
  const navigate = useNavigate();
  // Define the state to store selected language
  const [language, setLanguage] = useState("EN");
  const shouldShowSlideMenu = !["/signup", "/login"].includes(
    location.pathname
  );

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{ height: "80px" }}
    >
      <Toolbar>
        {/*Menu & Back Button*/}
        {shouldShowSlideMenu ? (
          <SlideMenu />
        ) : (
          <IconButton edge="start" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        )}

        {/*Title & Language Selector Container*/}
        <Box sx={{ 
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '100%'
        }}>
          {/*Title - Center*/}
          <Typography
            variant="h6"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontStyle: "italic",
              letterSpacing: "0.5px",
              lineHeight: 1.2,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            DigiPramaan
          </Typography>

          {/*Language Selector - Right Align*/}
          <FormControl
            sx={{
              minWidth: 30,
              border: "2px solid black",
              borderRadius: "8px",
              position: 'absolute',
              right: 16
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
      </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;