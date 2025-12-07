import React from 'react';
import './Confirmation.css';


const Confirmation = ({ 
  message, 
  severity = 'normal', 
  onConfirm, 
  isOpen = true 
}) => {
  if (!isOpen) return null;

  const getTitle = () => {
    switch (severity) {
      case 'alert': return 'Critical Action';
      case 'warning': return 'Warning';
      default: return 'Confirmation';
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'alert': return '⚠️';
      case 'warning': return '❗';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="confirmation-overlay">
      <div className={`confirmation-modal ${severity}`}>
        <div className="confirmation-header">
          <span>{getIcon()}</span>
          <h2 className="confirmation-title ml-3">{getTitle()}</h2>
        </div>
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-actions">
          <button
            type="button"
            className="confirmation-btn cancel"
            onClick={() => onConfirm(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`confirmation-btn confirm ${severity}`}
            onClick={() => onConfirm(true)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;