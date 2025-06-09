import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from './Toast';

const Header = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  const closeToast = () => {
    setToastMessage('');
    setToastType('info');
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setToastMessage('You are not logged in.');
      setToastType('error');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      });
      if (response.ok) {
        localStorage.removeItem('accessToken');
        setToastMessage('Logout successful');
        setToastType('success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setToastMessage('Logout failed');
        setToastType('error');
      }
    } catch (error) {
      setToastMessage('Error during logout: ' + error.message);
      setToastType('error');
    }
  };

  return (
    <>
      <header style={{ padding: '10px 20px', backgroundColor: '#ff6f61', color: 'white', fontWeight: 'bold', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/medico.png" alt="Medico Logo" style={{ height: '40px', verticalAlign: 'middle', marginRight: '10px' }} />
          Medico
        </div>
        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '15px', margin: 0, padding: 0 }}>
            {localStorage.getItem('userRole') === 'patient' && <li><Link to="/patient-dashboard" style={{ color: 'white', textDecoration: 'none' }}>Patient Dashboard</Link></li>}
            {localStorage.getItem('userRole') === 'doctor' && <li><Link to="/doctor-dashboard" style={{ color: 'white', textDecoration: 'none' }}>Doctor Dashboard</Link></li>}
            <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem', textDecoration: 'underline' }}>Logout</button></li>
          </ul>
        </nav>
      </header>
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={closeToast}
      />
    </>
  );
};

export default Header;
