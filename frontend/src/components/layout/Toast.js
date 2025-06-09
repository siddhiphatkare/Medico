import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', buttonLabel, onButtonClick, onClose, autoClose = true, autoCloseTime = 3000 }) => {
  useEffect(() => {
    if (autoClose && message) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [message, autoClose, autoCloseTime, onClose]);

  if (!message) return null;

  const backgroundColors = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#333',
  };

  const icons = {
    success: (
      <svg style={{ width: '40px', height: '40px', fill: 'white' }} viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    ),
    error: (
      <svg style={{ width: '40px', height: '40px', fill: 'white' }} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
          10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17
          12 13.41 8.41 17 7 15.59 10.59 12 7 8.41
          8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
      </svg>
    ),
    info: null,
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: backgroundColors[type] || backgroundColors.info,
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      width: '320px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ marginBottom: '15px' }}>
        {icons[type]}
      </div>
      <div style={{ fontSize: '16px', marginBottom: '20px' }}>
        {message}
      </div>
      {buttonLabel && onButtonClick && (
        <button
          onClick={onButtonClick}
          style={{
            backgroundColor: 'white',
            color: backgroundColors[type] || backgroundColors.info,
            border: 'none',
            borderRadius: '20px',
            padding: '10px 25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        >
          {buttonLabel}
        </button>
      )}
      {!buttonLabel && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Toast;
