import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/layout/Toast';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [toastButtonLabel, setToastButtonLabel] = useState('');
  const [toastButtonHandler, setToastButtonHandler] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const closeToast = () => {
    setToastMessage('');
    setToastType('info');
    setToastButtonLabel('');
    setToastButtonHandler(null);
  };

  const handleContinue = () => {
    closeToast();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setToastMessage('Please accept the terms and conditions');
      setToastType('error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setToastMessage('Passwords do not match');
      setToastType('error');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setToastMessage('Congratulations, your account has been successfully created.');
        setToastType('success');
        setToastButtonLabel('Continue');
        setToastButtonHandler(() => handleContinue);
      } else {
        setToastMessage('Signup failed: ' + (data.message || 'Unknown error'));
        setToastType('error');
      }
    } catch (error) {
      setToastMessage('Signup error: ' + error.message);
      setToastType('error');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <label>Password</label>
        <div style={{ position: 'relative', marginBottom: '15px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#888',
              fontSize: '18px',
            }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        <label>Confirm Password</label>
        <div style={{ position: 'relative', marginBottom: '15px' }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#888',
              fontSize: '18px',
            }}
          >
            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        <label>Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            style={{ marginRight: '10px' }}
          />
          I accept the terms and conditions
        </label>
        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#ff6f61',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Sign Up
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <p>Already have an account? <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#ff6f61', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: '1rem', fontFamily: 'Arial, sans-serif' }}>Login</button></p>
      </div>
      <Toast
        message={toastMessage}
        type={toastType}
        buttonLabel={toastButtonLabel}
        onButtonClick={toastButtonHandler}
        onClose={closeToast}
      />
    </div>
  );
};

export default Signup;
