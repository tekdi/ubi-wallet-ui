import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import { ArrowLeft, FileText } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

const VcDetails = () => {
  const [vc, setVc] = useState(null);
  const [vcName, setVcName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { vcId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVcDetails();
  }, [vcId]);

  const fetchVcDetails = async () => {
    try {
      setLoading(true);
      const data = await vcApi.getVcById(user.accountId, vcId);
      const vcData = await JSON.parse(data?.data?.json);
      console.log(vcData?.credentialSchema?.title);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/vcs')}
          className="text-primary-600 hover:text-primary-500"
        >
          Back to VCs
        </button>
      </div>
    );
  }

  if (!vc?.id) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-600">VC not found</p>
        <button
          onClick={() => navigate('/vcs')}
          className="text-primary-600 hover:text-primary-500"
        >
          Back to VCs
        </button>
      </div>
    );
  }

  return (
    <div className="page-bg min-h-screen py-4 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/vcs')}
          className="inline-flex items-center text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to VCs
        </button>
      </div>

      <div className="details-card">
        <div className="flex items-center p-4 sm:p-6">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-accent flex items-center justify-center">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div className="ml-3 sm:ml-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-navy">
              {vcName || 'Verifiable Credential'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Credential Details</p>
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="bg-gray-100 rounded-md p-3 sm:p-4 lg:p-6">
                {vc.credentialSubject ? (
                  <div className="space-y-3 sm:space-y-4">
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
                        <div key={key} className="border-b border-gray-200 pb-3 sm:pb-4 last:border-b-0">
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 capitalize mb-1 sm:mb-2">
                            {key.replace(/([A-Z_])/g, ' $1').replace(/_/g, ' ').trim()}
                          </label>
                          <p className="text-xs sm:text-sm text-navy break-all whitespace-pre-wrap leading-relaxed">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default VcDetails;
