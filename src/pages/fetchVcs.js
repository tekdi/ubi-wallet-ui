import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import { QrCode, CheckSquare, Square, Share, AlertCircle, Plus, FileText, Calendar, CalendarDays, User } from 'lucide-react';
import VcCard from '../components/VcCard';

const FetchVcs = () => {
  const [vcs, setVcs] = useState([]);
  const [selectedVcs, setSelectedVcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      setVcs(data?.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVcSelection = (vcId) => {
    setSelectedVcs(prev => {
      if (prev.includes(vcId)) {
        return prev.filter(id => id !== vcId);
      } else {
        return [...prev, vcId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedVcs.length === vcs.length) {
      setSelectedVcs([]);
    } else {
      setSelectedVcs(vcs.map(vc => vc.id));
    }
  };

  const handleAddVc = () => {
    navigate('/qr-scanner?from=/fetch-vcs');
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

  const handleShareVcs = async () => {
    if (selectedVcs.length === 0) {
      setError('Please select at least one credential to share.');
      return;
    }

    setSharing(true);
    setError('');
    setSuccess('');

    try {
      // Fetch detailed data for selected VCs
      const selectedVcData = await Promise.all(
        selectedVcs.map(vcId => vcApi.getVcById(user.accountId, vcId))
      );

      // Prepare the data to send to parent
      const vcDataToShare = selectedVcData.map(response => response.data);

      // Send data to parent window via postMessage
      if (window.parent && window.parent !== window) {
        const message = {
          type: 'VC_SHARED',
          data: {
            vcs: vcDataToShare,
            timestamp: new Date().toISOString(),
            userId: user.accountId
          }
        };

        // Get the parent origin
        const parentOrigin = process.env.PARENT_APP_ALLOWED_ORIGIN;

        try {
          // Send message to the specific parent origin
          window.parent.postMessage(message, parentOrigin);
          setSuccess(`Successfully shared ${selectedVcData.length} credential(s) with the parent application.`);
          // Clear selection after successful share
          setSelectedVcs([]);
        } catch (error) {
          setError(`Sharing not allowed with origin: ${parentOrigin}. Please contact administrator.`);
        }
      } else {
        setError('This page must be embedded in an iframe to share credentials.');
      }
    } catch (err) {
      setError('Failed to fetch credential details. Please try again.');
      console.error('Error sharing VCs:', err);
    } finally {
      setSharing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If auth is done loading but user is not authenticated, show error
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Required</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please log in to access your credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Select Credentials to Share</h1>
          <p className="text-gray-600">Choose the credentials you want to share with the parent application</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {vcs.length === 0 ? (
        <div className="text-center py-12">
          <QrCode className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No credentials available</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any verifiable credentials to share.
          </p>
        </div>
      ) : (
        <div>
          {/* Select All Button */}
          <div className="mb-4">
            <button
              onClick={handleSelectAll}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {selectedVcs.length === vcs.length ? (
                <CheckSquare className="h-4 w-4 mr-2 text-primary-600" />
              ) : (
                <Square className="h-4 w-4 mr-2 text-gray-400" />
              )}
              {selectedVcs.length === vcs.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vcs.map((vc) => (
              <div
                key={vc.id}
                className={`bg-white border rounded-lg shadow-sm transition-all duration-200 cursor-pointer group ${
                  selectedVcs.includes(vc.id) 
                    ? 'border-primary-500 shadow-md ring-2 ring-primary-200' 
                    : 'border-gray-200 hover:shadow-md'
                }`}
                onClick={() => handleVcSelection(vc.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVcSelection(vc.id);
                        }}
                        className="mr-3 mt-1"
                      >
                        {selectedVcs.includes(vc.id) ? (
                          <CheckSquare className="h-5 w-5 text-primary-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400 group-hover:text-primary-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-primary-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                            {vc.name || 'Unnamed Credential'}
                          </h3>
                        </div>
                      </div>
                    </div>
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
          
          {/* Share Button */}
          {selectedVcs.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-center">
                <button
                  onClick={handleShareVcs}
                  disabled={sharing}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {sharing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Share className="h-4 w-4 mr-2" />
                      Share {selectedVcs.length} Credential{selectedVcs.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
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

export default FetchVcs; 