import React from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #ff6f61, #fbc7b8)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px',
    }}>
      <img src={require('../assets/medico.png')} alt="Medico Logo" style={{ width: '120px', marginBottom: '30px' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to Medico</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
        Create an account to get started on your health and happiness journey.
      </p>
      <div>
        <button
          onClick={() => navigate('/login')}
          style={{
            backgroundColor: '#ff6f61',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '25px',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
            marginRight: '15px',
          }}
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          style={{
            backgroundColor: 'transparent',
            border: '2px solid white',
            padding: '12px 30px',
            borderRadius: '25px',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Splash;
