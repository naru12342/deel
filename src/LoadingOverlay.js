import React from 'react';
import { BeatLoader } from 'react-spinners';

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <BeatLoader color="#FFFFFF" />
    </div>
  );
};

export default LoadingOverlay;


  