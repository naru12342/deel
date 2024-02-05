import React from 'react';

const Modal = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;
  
    const handleBackdropClick = (event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    };
  
    return (
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal m-5">
          
          <p>{content}</p>
        </div>
      </div>
    );
  };
  
export default Modal;