import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import VcList from './pages/VcList';
import VcDetails from './pages/VcDetails';
import QrScanner from './pages/QrScanner';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/vcs" />} />
        <Route path="vcs" element={<VcList />} />
        <Route path="vcs/:vcId" element={<VcDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="qr-scanner" element={<QrScanner />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App; 