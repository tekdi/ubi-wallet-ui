import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import { QrCode, FileText, Calendar, User, Plus, Eye, Clock, CalendarDays } from 'lucide-react';

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Verifiable Credentials</h1>
          <p className="text-gray-600">Manage your digital credentials</p>
        </div>
        <button
          onClick={handleAddVc}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add VC
        </button>
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
            <div
              key={vc.id}
              onClick={() => handleVcClick(vc.id)}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-primary-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {vc.name || 'Unnamed Credential'}
                      </h3>
                    </div>
                  </div>
                  <Eye className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">Issued:</span>
                    <span className="ml-1">{formatDate(vc.issuedAt)}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium text-gray-600">Expires:</span>
                    <span className={`ml-1 ${isExpired(vc.expiresAt) ? 'text-red-600' : 'text-gray-600'}`}>
                      {formatDate(vc.expiresAt)}
                    </span>
                    {isExpired(vc.expiresAt) && (
                      <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Expired
                      </span>
                    )}
                  </div>

                  {vc.issuer && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">Issuer:</span>
                      <span className="ml-1 truncate">{vc.issuer}</span>
                    </div>
                  )}

                  {vc.status && (
                    <div className="flex items-center">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vc.status === 'active' ? 'bg-green-100 text-green-800' :
                        vc.status === 'expired' ? 'bg-red-100 text-red-800' :
                        vc.status === 'revoked' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {vc.status.charAt(0).toUpperCase() + vc.status.slice(1)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VcList; 
