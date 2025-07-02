import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import QrReader from 'react-qr-reader';
import { QrCode, ArrowLeft, CheckCircle, XCircle, Camera } from 'lucide-react';

const QrScannerPage = () => {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const qrReaderRef = useRef(null);

  // Get the source page from URL search params or default to '/vcs'
  const searchParams = new URLSearchParams(location.search);
  const sourcePage = searchParams.get('from') || '/vcs';

  useEffect(() => {
    // Cleanup function to turn off camera when component unmounts
    return () => {
      turnOffCamera();
    };
  }, []);

  const turnOffCamera = () => {
    if (qrReaderRef.current) {
      try {
        // Stop the QR reader and turn off camera
        qrReaderRef.current.stopCamera();
      } catch (err) {
        console.warn('Error stopping camera:', err);
      }
    }
  };

  const handleScan = async (data) => {
    if (data && scanning) {
      console.log('QR Code detected:', data);
      setScanning(false);
      setResult(data);
      
      // Turn off camera immediately after successful scan
      turnOffCamera();
      
      try {
        setLoading(true);
        setError('');
        
        const res = await vcApi.uploadFromQr(user.accountId, data);

        if (res?.statusCode !== 200) {
          setResult(null);
          setError(res.message);
          setScanning(true);
        } else {
          // Success - navigate back to the source page
          navigate(sourcePage);
        }
      } catch (err) {
        setError(err);
        setLoading(false);
        // Turn off camera on error
        turnOffCamera();
      }
    }
  };

  const handleError = (err) => {
    console.warn('QR scan error:', err);
    
    // Turn off camera on error
    turnOffCamera();
    
    // Handle different types of camera errors
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      setCameraError('Camera access denied. Please allow camera permissions and try again.');
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      setCameraError('No camera found. Please ensure your device has a camera.');
    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      setCameraError('Camera is already in use by another application.');
    } else if (err.message && err.message.includes('videoWidth')) {
      setCameraError('Camera initialization failed. Please refresh the page and try again.');
    } else {
      setCameraError('Camera error occurred. Please check your camera permissions and try again.');
    }
    
    setScanning(false);
  };

  const handleRetry = () => {
    setResult(null);
    setError('');
    setCameraError('');
    setScanning(true);
  };

  const handleCancel = () => {
    // Turn off camera before navigating back to source page
    turnOffCamera();
    navigate(sourcePage);
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to {sourcePage === '/fetch-vcs' ? 'Share VCs' : 'VCs'}
        </button>
      </div>

      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 mb-4">
            <QrCode className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Scan QR Code</h1>
          <p className="text-gray-600">Point your camera at a verifiable credential QR code</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center">
              <Camera className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-yellow-600">{cameraError}</p>
            </div>
            <div className="mt-3">
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-3 py-1 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !result && scanning && !cameraError && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <QrReader
              ref={qrReaderRef}
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '100%' }}
              facingMode="environment"
            />
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Make sure the QR code is clearly visible and well-lit
              </p>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                QR Code Scanned Successfully!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                The credential has been added to your wallet.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate(sourcePage)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  View My VCs
                </button>
                
                <button
                  onClick={handleRetry}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Scan Another QR Code
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Adding credential to your wallet...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrScannerPage; 