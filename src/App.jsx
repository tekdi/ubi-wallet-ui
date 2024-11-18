import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import LanguageSelect from './components/LanguageSelect';
import Login from './components/Login';
import Home from './components/Home';
import Upload from './components/Upload';
import Fetch from './components/Fetch';
import { 
  ThemeProvider, 
  createTheme, 
  Box, 
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Grid,
  FormControl,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Home as HomeIcon,
  History as HistoryIcon,
  Group as GroupIcon
} from '@mui/icons-material';


// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4361ee',
    },
    background: {
      default: '#f8f9fa'
    }
  }
});

// Styled components
// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   borderRadius: theme.spacing(3),
//   boxShadow: 'none',
//   border: '1px solid #e0e0e0'
// }));

// const BottomNav = styled(Paper)(({ theme }) => ({
//   position: 'fixed',
//   bottom: 0,
//   left: 0,
//   right: 0,
//   padding: theme.spacing(2),
//   borderRadius: theme.spacing(3, 3, 0, 0),
// }));

const App = () => {
  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LanguageSelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/fetch" element={<Fetch />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;