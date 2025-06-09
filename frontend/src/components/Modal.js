import React from 'react';

const Modal = ({ isOpen, title, children, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        maxWidth: '90%',
        boxSizing: 'border-box',
      }}>
        <h2>{title}</h2>
        <div>{children}</div>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button onClick={onClose} style={{ marginRight: '10px' }}>Cancel</button>
          <button onClick={onConfirm} style={{ backgroundColor: '#ff6f61', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
