import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VcDetails from '../components/VcDetails';

const VcDetailsPage = () => {
  const { vcId } = useParams();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/vcs');
  };

  return (
    <VcDetails
      vcId={vcId}
      showBackButton={true}
      onBackClick={handleBackClick}
      isPopup={false}
    />
  );
};

export default VcDetailsPage;
