import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Otp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, role } = location.state || {};

  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(180); // 3 minutes countdown
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email || !role) {
      navigate('/login');
    }
  }, [email, role, navigate]);

  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (element, index) => {
    if (!/^\d*$/.test(element.value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setMessage('Please enter complete 6-digit OTP.');
      return;
    }
    setMessage('');
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setMessage('No access token found, please login again.');
        return;
      }
      const response = await fetch('http://localhost:5000/v1/auth/email-verify/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({ otp: enteredOtp }),
      });
      const data = await response.json();
      if (response.ok) {
        if (role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      } else {
        setMessage('OTP verification failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Error verifying OTP: ' + error.message);
    }
  };

  const handleResend = async () => {
    setMessage('');
    setTimer(180);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setMessage('No access token found, please login again.');
        return;
      }
      const response = await fetch('http://localhost:5000/v1/auth/email-verify/request', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      });
      if (response.ok) {
        setMessage('OTP resent to your email.');
        setOtp(new Array(6).fill(''));
      } else {
        const data = await response.json();
        setMessage('Failed to resend OTP: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Error resending OTP: ' + error.message);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
    }}>
      <h2>OTP Verification</h2>
      <p>Enter the code sent to <strong>{email}</strong></p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
        {otp.map((data, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            name="otp"
            maxLength="1"
            value={data}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            style={{
              width: '40px',
              height: '50px',
              fontSize: '24px',
              textAlign: 'center',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
            autoFocus={index === 0}
          />
        ))}
      </form>
      <div style={{ marginBottom: '15px' }}>
        {timer > 0 ? (
          <p>Resend OTP in {formatTime(timer)}</p>
        ) : (
          <button onClick={handleResend} style={{
            backgroundColor: '#ff6f61',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '25px',
            cursor: 'pointer',
          }}>Resend OTP</button>
        )}
      </div>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <button type="submit" onClick={handleSubmit} style={{
        width: '100%',
        backgroundColor: '#ff6f61',
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '25px',
        fontSize: '1rem',
        cursor: 'pointer',
      }}>Submit</button>
    </div>
  );
};

export default Otp;
