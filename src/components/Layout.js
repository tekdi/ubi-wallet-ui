import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, User, LogOut } from 'lucide-react';

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if embedded mode is enabled
  const isEmbeddedMode = localStorage.getItem('embeddedMode') === 'true';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Get user's full name
  const getUserName = () => {
    if (!user) return '';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || user.username || 'User';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Hidden in embedded mode */}
      {!isEmbeddedMode && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wallet className="h-8 w-8 text-primary-600" />
                <h1 className="text-xl font-semibold text-gray-900">Wallet</h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* User Welcome Section - Hidden in embedded mode */}
      {!isEmbeddedMode && user && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">
                Welcome, {getUserName()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => navigate('/vcs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isActive('/vcs')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My VCs
            </button>
            {/* <button
              onClick={() => navigate('/fetch-vcs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isActive('/fetch-vcs')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Share VCs
            </button> */}
            {/* <button
              onClick={() => navigate('/profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                isActive('/profile')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button> */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 