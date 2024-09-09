import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faExclamationCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const Popup = ({ title = "Lỗi", message, isOpen, onClose, canClose = true, type = "error" ,fadeOut=false}) => {
  if (!isOpen) return null;
  // Chọn icon và className dựa trên type
  let icon;
  let className = "popup-content";
  if (fadeOut==true) className="popup-content fadeOut "
  switch (type) {
    case "ok":
      icon = <FontAwesomeIcon icon={faCheckCircle} className="popup-icon success-icon" />;
      className += " success";
      break;
    case "warning":
      icon = <FontAwesomeIcon icon={faExclamationCircle} className="popup-icon warning-icon" />;
      className += " warning";
      break;
    case "error":
    default:
      icon = <FontAwesomeIcon icon={faTimesCircle} className="popup-icon error-icon" />;
      className += " error";
      break;
  }

  return (
    <div className="popup-overlay">
      <div className="detectOut" onClick={onClose}></div>
      <div className={className}>
        {canClose && (
          <div className="popup-close" onClick={onClose}>
            &times;
          </div>
        )}
        <div className="logo">{icon}</div>
        <div className="title">{title}</div>
        <div className="message">{message}</div>
      </div>
    </div>
  );
};

export default Popup;
