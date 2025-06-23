import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import LanguageSelect from './components/LanguageSelect';
import Signup from './components/Signup';
import SignUp from './components/Signupnew';
import Login from './components/Login';
import Home from './components/Home';
import Upload from './components/Upload';
import Fetch from './components/Fetch';
import DocumentSelector from './components/DocumentSelector';
import { 
  ThemeProvider, 
  createTheme, 
} from '@mui/material';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
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
      <Header />
        <Routes>
          <Route path="/" element={<LanguageSelect />} />
          {/* <Route path="/signup" element={<Signup />} /> */} {/* Signup with keycloak */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
          <Route path="/fetch" element={<PrivateRoute><Fetch /></PrivateRoute>} />
          <Route path="/select-docs" element={<DocumentSelector />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;