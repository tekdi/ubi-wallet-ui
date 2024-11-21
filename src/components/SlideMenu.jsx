import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, IconButton, Avatar ,ListItemIcon} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { Box } from '@mui/system';
import { useKeycloak } from "@react-keycloak/web";

const SlideMenu = () => {
    const {keycloak} = useKeycloak();
  const [open, setOpen] = useState(false); // State to control drawer open/close

  // Handle the toggle of the drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };


  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
    localStorage.clear();
    localStorage.setItem('logout',true);
     // Logout from Keycloak
    console.log('Logging out...',window.location.origin);
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
