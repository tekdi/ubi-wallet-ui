// FloatingActionButton.jsx
import React, { useState } from "react";
import { Box, IconButton, Popover, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Add from "../assets/FAB.svg";
import { Download, Upload } from "lucide-react";
const FloatingActionButton = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null); // State for managing Popover visibility

  // Handle opening of Popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing of Popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl); // Determine if Popover is open
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 90,
        right: 24,
        zIndex: 2,
      }}
    >
      <img src={Add} onClick={handleClick} />

      {/* Popover component */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Paper sx={{ p: 2,bgcolor:'#EDEFFF' }}>
          <Button
            startIcon={<Upload color="black" />}
            fullWidth
            onClick={() => navigate("/upload")}
            sx={{
              mb: 1,
              color: "black",
              fontSize: 16,
              justifyContent: "flex-start", // Aligns content to the left
              textAlign: "left", // Ensures text and icon are aligned left
              paddingLeft: 2,
              gap:3
              // Adjusts the left padding if needed
            }}
          >
            Upload
          </Button>
          <Button
            startIcon={<Download color="black" />}
            fullWidth
            onClick={() => navigate("/fetch")}
            sx={{
              color: "black",
              fontSize: 16,
              justifyContent: "flex-start", // Aligns content to the left
              textAlign: "left", // Ensures text and icon are aligned left
              paddingLeft: 2, 
              gap:3// Adjusts the left padding if needed
            }}
          >
            Fetch
          </Button>
        </Paper>
      </Popover>
    </Box>
  );
};

export default FloatingActionButton;
