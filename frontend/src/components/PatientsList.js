import React, { useEffect, useState } from 'react';
import Toast from './layout/Toast';

const PatientsList = ({ accessToken }) => {
  const [patients, setPatients] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [loading, setLoading] = useState(false);

  const fetchPatients = () => {
    setLoading(true);
    fetch('http://localhost:5000/v1/users/my-patients', {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data && data.data) {
          setPatients(data.data);
        } else {
          setToastMessage('Failed to fetch patients');
          setToastType('error');
        }
      })
      .catch(err => {
        setLoading(false);
        setToastMessage('Error fetching patients: ' + err.message);
        setToastType('error');
      });
  };

  useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const closeToast = () => {
    setToastMessage('');
    setToastType('info');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Patients List</h3>
      {loading && <p>Loading patients...</p>}
      {!loading && patients.length === 0 && <p>No patients found.</p>}
      {!loading && patients.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>First Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Last Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Age</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient.name?.split(' ')[0] || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient.name?.split(' ')[1] || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient.age || 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{patient.contact || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Toast message={toastMessage} type={toastType} onClose={closeToast} />
    </div>
  );
};

export default PatientsList;
