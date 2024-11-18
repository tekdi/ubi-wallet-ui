// Home.jsx
import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import MainContent from './MainContent';
import FloatingActionButton from './FloatingActionButton';
import BottomNavigationBar from './BottomNavigationBar';

const Home = () => {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        <MainContent />
      </Box>
      <FloatingActionButton />
      <BottomNavigationBar />
    </Box>
  );
};

export default Home;
