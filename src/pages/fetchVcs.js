import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import { QrCode, CheckSquare, Square, Share, AlertCircle } from 'lucide-react';
import VcCard from '../components/VcCard';
import VcDetailsPopup from '../components/VcDetailsPopup';
import { formatDate, isExpired } from '../utils/dateUtils';

const FetchVcs = () => {
  const [vcs, setVcs] = useState([]);
  const [selectedVcs, setSelectedVcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewVcId, setPreviewVcId] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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

  const handlePreviewVc = (vcId) => {
    setPreviewVcId(vcId);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewVcId(null);
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
        const parentOrigin = process.env.REACT_APP_PARENT_APP_ALLOWED_ORIGIN;

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
    <div className="page-bg relative min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Select Credentials to Share</h1>
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
          <h3 className="mt-2 text-sm font-medium text-navy">No credentials available</h3>
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
              className="btn-outline inline-flex items-center justify-center w-auto px-6 py-3"
            >
              {selectedVcs.length === vcs.length ? (
                <CheckSquare className="h-4 w-4 mr-2 text-accent" />
              ) : (
                <Square className="h-4 w-4 mr-2 text-gray-400" />
              )}
              {selectedVcs.length === vcs.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vcs.map((vc) => (
              <VcCard
                key={vc.id}
                vc={vc}
                mode="select"
                isSelected={selectedVcs.includes(vc.id)}
                onSelectionChange={handleVcSelection}
                onPreviewClick={handlePreviewVc}
                formatDate={formatDate}
                isExpired={isExpired}
              />
            ))}
          </div>
          
          {/* Share Button */}
          {selectedVcs.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-center">
                <button
                  onClick={handleShareVcs}
                  disabled={sharing}
                  className="btn-primary inline-flex items-center justify-center w-auto px-8 py-3"
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
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent z-50 flex items-center justify-center"
        title="Add Verifiable Credential"
      >
        <QrCode className="h-6 w-6" />
      </button>

      {/* VC Details Popup */}
      <VcDetailsPopup
        vcId={previewVcId}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
};

export default FetchVcs;
