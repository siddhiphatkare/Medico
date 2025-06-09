import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/layout/Toast';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient',
  });
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [showPassword, setShowPassword] = useState(false);

  // Removed auto redirect on mount to show login form first
  // useEffect(() => {
  //   // Redirect if user already logged in
  //   const userRole = localStorage.getItem('userRole');
  //   if (userRole === 'patient') {
  //     navigate('/patient-dashboard');
  //   } else if (userRole === 'doctor') {
  //     navigate('/doctor-dashboard');
  //   }
  // }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeToast = () => {
    setToastMessage('');
    setToastType('info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await response.json();
      console.log("Login response role:", data.data?.role);  // Updated log for debugging
      if (response.ok) {
        // Save token and role
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('userRole', data.data.role);

        if (!data.data.verifiedEmail) {
          navigate('/otp', { state: { email: data.data.email, role: data.data.role } });
        } else if (data.data.role === 'patient') {
          navigate('/patient-dashboard');
        } else if (data.data.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          setToastMessage('Unknown user role');
          setToastType('error');
        }
      } else {
        setToastMessage(data.message || 'Login failed');
        setToastType('error');
      }
    } catch (error) {
      setToastMessage('Login error: ' + error.message);
      setToastType('error');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      <form onSubmit={handleSubmit}>
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
              userSelect: 'none',
              color: '#888',
              fontSize: '18px',
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
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
        <button type="submit" style={{ width: '100%', backgroundColor: '#ff6f61', color: 'white', padding: '12px', border: 'none', borderRadius: '25px', fontSize: '1rem', cursor: 'pointer' }}>Login</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <p>Don't have an account? <button onClick={() => navigate('/signup')} style={{ background: 'none', border: 'none', color: '#ff6f61', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: '1rem', fontFamily: 'Arial, sans-serif' }}>Sign up</button></p>
      </div>
      <Toast message={toastMessage} type={toastType} onClose={closeToast} />
    </div>
  );
};

export default Login;
