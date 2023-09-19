import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function UploadStats({ isUploaded }) {
  return (
    <div className={`upload-status-overlay ${isUploaded ? 'success' : 'failure'}`}>
      {isUploaded ? <FaCheckCircle /> : <FaTimesCircle />}
      <p>{isUploaded ? 'PDF Uploaded' : 'No PDF Uploaded'}</p>
    </div>
  );
}

export default UploadStats;
