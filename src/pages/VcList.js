import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { vcApi } from '../services/api';
import { QrCode, FileText, Calendar, User, Plus, Eye } from 'lucide-react';

const VcList = () => {
  const [vcs, setVcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVcs();
  }, []);

  const fetchVcs = async () => {
    try {
      setLoading(true);
      const data = await vcApi.getAllVcs(user.accountId);
      setVcs(data);
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
    navigate('/qr-scanner');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vcs.map((vc) => (
            <div
              key={vc.id}
              onClick={() => handleVcClick(vc.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-primary-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {vc.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{vc.issuer}</span>
                    </div>
                    
                    {vc.issuedAt && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(vc.issuedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VcList; 