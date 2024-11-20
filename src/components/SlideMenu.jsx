import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, IconButton, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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
    keycloak.logout();
    localStorage.clear();
    localStorage.setItem('logout',true);
     // Logout from Keycloak
    console.log('Logging out...');
  };

  return (
    <Box>
      {/* IconButton that triggers the Drawer */}
      <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>

      {/* Drawer component */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box
          sx={{ width: 250 }} 
          role="presentation"
          onClick={toggleDrawer} 
        >
          <List>
            {/* User Profile Section */}
            <ListItem button>
              <Avatar alt="User Name" src="https://via.placeholder.com/40" sx={{ marginRight: 2 }} />
              <ListItemText primary="User Profile" />
            </ListItem>
            <Divider />

            {/* Logout Section */}
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SlideMenu;
