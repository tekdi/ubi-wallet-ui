import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const QrScanner = () => {
  const [scanner, setScanner] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    startScanner();
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const startScanner = () => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    setScanner(html5QrcodeScanner);
    setScanning(true);
  };

  const onScanSuccess = async (decodedText) => {
    setScanning(false);
    setResult(decodedText);
    
    try {
      setLoading(true);
      setError('');
      
      await vcApi.uploadFromQr(user.accountId, decodedText);
      
      // Success - navigate back to VC list
      navigate('/vcs');
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const onScanFailure = (error) => {
    // Handle scan failure silently
    console.warn(`QR scan error = ${error}`);
  };

  const handleRetry = () => {
    setResult(null);
    setError('');
    setScanning(true);
    if (scanner) {
      scanner.clear();
    }
    startScanner();
  };

  const handleCancel = () => {
    navigate('/vcs');
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to VCs
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

        {!loading && !result && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div id="qr-reader" className="w-full"></div>
            
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
                  onClick={() => navigate('/vcs')}
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

export default QrScanner; 