import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, IconButton, Avatar ,ListItemIcon} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { Box } from '@mui/system';
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SlideMenu = () => {
    // const {keycloak} = useKeycloak();
  const [open, setOpen] = useState(false); // State to control drawer open/close

  // Handle the toggle of the drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };
const navigate = useNavigate();
const apiURL = import.meta.env.VITE_APP_API_URL;
const token=localStorage.getItem('authToken');
const refreshtoken = localStorage.getItem('refreshToken');
  const handleLogout = async () => {
    try {

      const response = await axios.post(`${apiURL}/auth/logout`, {access_token : token,refresh_token:refreshtoken}, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.status === 200) {

        localStorage.clear();
        localStorage.setItem('logout', true);
        
        console.log('Logging out...', window.location.origin);
        navigate('/')
      } else {
        console.error('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error.response?.data?.message || error.message);
    }
  };
  

  return (
    <Box>
      {/* IconButton that triggers the Drawer */}
      <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>

      {/* Drawer component */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 230,fontFamily:'Poppins, sans-serif' }} role="presentation" onClick={toggleDrawer}>
          <List>
            {/* User Profile Section */}
            <ListItem button>
            <ListItemIcon>
            <PermIdentityOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary="User Profile" />
            </ListItem>
            <Divider />

            {/* Logout Section */}
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SlideMenu;
