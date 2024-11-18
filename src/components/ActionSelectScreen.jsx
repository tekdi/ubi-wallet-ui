import React from 'react'
import { Upload,Download } from 'lucide-react';

const ActionSelectScreen = ({ navigate, goBack }) => {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {/* <button
              onClick={() => navigate('upload')}
              className="w-full p-4 bg-white rounded-lg shadow flex items-center space-x-3"
            >
              <Upload className="w-5 h-5 text-blue-600" />
              <span>Upload</span>
            </button> */}
            
            <button
              onClick={() => navigate('fetch')}
              className="w-full p-4 bg-white rounded-lg shadow flex items-center space-x-3"
            >
              <Download className="w-5 h-5 text-blue-600" />
              <span>Fetch</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

export default ActionSelectScreen