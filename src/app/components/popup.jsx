// Popup.js
import React from "react";

const Popup = ({ title="Lỗi", message, isOpen, onClose, canClose=true }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="detectOut" onClick={onClose}></div>
      <div className="popup-content">
        <div className="header">
          <div className="title">{title}</div>
          <div className="popup-close" onClick={onClose}>
            &times;
          </div>
        </div>
        <div className="message">{message}</div>
      </div>
    </div>
  );
};

export default Popup;
