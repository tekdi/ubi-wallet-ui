import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import { ArrowLeft, FileText, User, Calendar, Shield, Copy, Check } from 'lucide-react';

const VcDetails = () => {
  const [vc, setVc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
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
      setVc(data?.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="text-center py-12">
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
      <div className="text-center py-12">
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
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/vcs')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to VCs
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {vc.name || vc.type || 'Verifiable Credential'}
              </h1>
              <p className="text-gray-600">Credential Details</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Credential ID</label>
                    <div className="mt-1 flex items-center">
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md flex-1 font-mono">
                        {vc.id}
                      </p>
                      <button
                        onClick={() => handleCopy(vc.id)}
                        className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {vc.type || 'VerifiableCredential'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Issuer</label>
                    <div className="mt-1 flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md flex-1">
                        {vc.issuer}
                      </p>
                    </div>
                  </div>

                  {vc.issuedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Issued Date</label>
                      <div className="mt-1 flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                          {new Date(vc.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Credential Subject</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  {vc.credentialSubject ? (
                    <div className="space-y-3">
                      {Object.entries(vc.credentialSubject).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No subject information available</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Status</h3>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600 font-medium">Verified</span>
                </div>
              </div>
            </div>
          </div>

          {vc.rawData && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Raw Data</h3>
              <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <code>{JSON.stringify(vc.rawData || vc, null, 2)}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VcDetails; 