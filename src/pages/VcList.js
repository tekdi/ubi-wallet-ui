import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import { QrCode, Plus } from 'lucide-react';
import VcCard from '../components/VcCard';
import { formatDate, isExpired } from '../utils/dateUtils';

const VcList = () => {
  const [vcs, setVcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.accountId) {
      fetchVcs();
    }
  }, [authLoading, isAuthenticated, user?.accountId]);

  const fetchVcs = async () => {
    try {
      setLoading(true);
      const data = await vcApi.getAllVcs(user.accountId);
      console.log(data);
      setVcs(data?.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVcClick = (vcId) => {
    navigate(`/vcs/${vcId}`);
  };

  const handleAddVc = () => {
    navigate('/qr-scanner?from=/vcs');
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If auth is done loading but user is not authenticated, redirect to login
  if (!authLoading && !isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Verifiable Credentials</h1>
          <p className="text-gray-600">Manage your digital credentials</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {vcs.length === 0 ? (
        <div className="text-center py-12">
          <QrCode className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No credentials yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first verifiable credential.
          </p>
          <div className="mt-6">
            <button
              onClick={handleAddVc}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR Code
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vcs.map((vc) => (
            <VcCard
              key={vc.id}
              vc={vc}
              mode="view"
              onCardClick={handleVcClick}
              formatDate={formatDate}
              isExpired={isExpired}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleAddVc}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 z-50 flex items-center justify-center"
        title="Add Verifiable Credential"
      >
        <QrCode className="h-6 w-6" />
      </button>
    </div>
  );
};

export default VcList; 
