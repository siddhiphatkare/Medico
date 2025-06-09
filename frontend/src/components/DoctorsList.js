import React, { useEffect, useState } from 'react';
import Toast from './layout/Toast';

const DoctorsList = ({ accessToken }) => {
  const [doctors, setDoctors] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [loading, setLoading] = useState(false);

  const fetchDoctors = () => {
    setLoading(true);
    fetch('http://localhost:5000/v1/users/my-doctors', {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data && data.data) {
          setDoctors(data.data);
        } else {
          setToastMessage('Failed to fetch doctors');
          setToastType('error');
        }
      })
      .catch(err => {
        setLoading(false);
        setToastMessage('Error fetching doctors: ' + err.message);
        setToastType('error');
      });
  };

  useEffect(() => {
    fetchDoctors();
    const interval = setInterval(fetchDoctors, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const closeToast = () => {
    setToastMessage('');
    setToastType('info');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Doctors List</h3>
      {loading && <p>Loading doctors...</p>}
      {!loading && doctors.length === 0 && <p>No doctors found.</p>}
      {!loading && doctors.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>First Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Last Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Specialization</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{doctor.name?.split(' ')[0] || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{doctor.name?.split(' ')[1] || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{doctor.specialization || 'General'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{doctor.contact || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Toast message={toastMessage} type={toastType} onClose={closeToast} />
    </div>
  );
};

export default DoctorsList;
