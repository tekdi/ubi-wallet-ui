import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import VcList from './pages/VcList';
import FetchVcs from './pages/fetchVcs';
import VcDetails from './pages/VcDetails';
import QrScanner from './pages/QrScanner';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, isEmbedded } = useAuth()

  // Show loading while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isEmbedded ? 'Waiting for authentication...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

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
        <Route path="fetch-vcs" element={<FetchVcs />} />
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