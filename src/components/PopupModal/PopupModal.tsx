import './styles.css';
import React from 'react';

interface PopupModalProps {
  children?: React.ReactNode;
  onClose: () => void;
}

export const PopupModal = ({ children, onClose }: PopupModalProps) => {
  return (
    <div className="--popup-modal-overlay">
      <div className="--popup-modal-container">
        <button className="--close-button" onClick={onClose}>
          &times;
        </button>
        <div className="--popup-modal-content">
          {children || <p>Your booking was successful! 🎉</p>}
        </div>
      </div>
    </div>
  );
};
