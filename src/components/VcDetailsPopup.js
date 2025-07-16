import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import { X, FileText } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const VcDetailsPopup = ({ vcId, isOpen, onClose }) => {
  const [vc, setVc] = useState(null);
  const [vcName, setVcName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && vcId) {
      fetchVcDetails();
    }
  }, [isOpen, vcId]);

  const fetchVcDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await vcApi.getVcById(user.accountId, vcId);
      const vcData = await JSON.parse(data?.data?.json);
      
      if (vcData?.credentialSchema?.title) {
        const title = vcData?.credentialSchema?.title?.split(':')?.[0] || '';
        setVcName(title || 'Verifiable Credential');
      }
      setVc(data?.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy">
                {vcName || 'Verifiable Credential'}
              </h2>
              <p className="text-sm text-gray-600">Credential Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          ) : !vc?.id ? (
            <div className="text-center py-8">
              <p className="text-gray-600">VC not found</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-md p-4">
                {vc.credentialSubject ? (
                  <div className="space-y-3">
                    {Object.entries(vc.credentialSubject).map(([key, value]) => {
                      // Skip unwanted keys
                      const skipKeys = ['start_date', 'end_date', 'id', '@context', 'originalvc', 'originalvc1', 'issueddate', 'recordvalidupto'];
                      if (skipKeys.includes(key)) return null;

                      let displayValue = value;
                      if (key === 'Expiry Date' || key === 'Issue Date') {
                        displayValue = formatDate(value);
                      } else if (typeof value === 'object') {
                        displayValue = JSON.stringify(value, null, 2);
                      }

                      return (
                        <div key={key} className="border-b border-gray-200 pb-3 last:border-b-0">
                          <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
                            {key.replace(/([A-Z_])/g, ' $1').replace(/_/g, ' ').trim()}
                          </label>
                          <p className="text-sm text-navy break-all whitespace-pre-wrap leading-relaxed">
                            {displayValue}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No information available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VcDetailsPopup; 