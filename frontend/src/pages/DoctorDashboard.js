import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Toast from '../components/layout/Toast';

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'patients', label: 'Patients' },
  { key: 'reports', label: 'Reports' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'settings', label: 'Settings' },
];

const DoctorDashboard = () => {
  const [tab, setTab] = useState('dashboard');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('info');
  const [appointments, setAppointments] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [cancelledAppointments, setCancelledAppointments] = useState(0);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = () => {
    fetch('http://localhost:5000/v1/appointment?role=doctor', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setAppointments(data.data);
          setTotalAppointments(data.data.length);
          setCancelledAppointments(data.data.filter(appt => appt.status === 'cancelled').length);
        }
      })
      .catch(err => {
        triggerToast('Failed to fetch appointments', 'error');
      });
  };

  const fetchPatients = () => {
    fetch('http://localhost:5000/v1/user/patients', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setPatientsList(data.data);
        }
      })
      .catch(err => {
        triggerToast('Failed to fetch patients', 'error');
      });
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    fetch(`http://localhost:5000/v1/appointment/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setAppointments(prev =>
            prev.map(appt => (appt._id === appointmentId ? data.data : appt))
          );
          setTotalAppointments(prev => (status === 'cancelled' ? prev - 1 : prev));
          setCancelledAppointments(prev =>
            status === 'cancelled' ? prev + 1 : prev > 0 ? prev - 1 : 0
          );
          triggerToast('Appointment status updated', 'success');
        } else {
          triggerToast('Failed to update appointment', 'error');
        }
      })
      .catch(() => {
        triggerToast('Failed to update appointment', 'error');
      });
  };

  const filteredAppointments = appointments.filter(appt =>
    appt.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPatients = patientsList.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const triggerToast = (msg, type = 'info') => {
    setToastMsg(msg);
    setToastType(type);
  };

  const closeToast = () => {
    setToastMsg('');
    setToastType('info');
  };

  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar items={sidebarItems} selectedKey={tab} onSelect={setTab} />
        <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f0f4ff', overflowY: 'auto' }}>
          {tab === 'dashboard' && (
            <>
              <h1>Welcome, Doctor</h1>
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1, background: '#4f46e5', color: 'white', padding: '20px', borderRadius: '8px' }}>
                  <h3>Total Appointments</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalAppointments}</p>
                </div>
                <div style={{ flex: 1, background: '#ef4444', color: 'white', padding: '20px', borderRadius: '8px' }}>
                  <h3>Appointments Cancelled</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{cancelledAppointments}</p>
                </div>
              </div>
              {/* Placeholder for last day patients result chart */}
              <section style={{ marginTop: '40px' }}>
                <h2>Last Day Patients Result</h2>
                <p>Chart placeholder</p>
              </section>
            </>
          )}

          {tab === 'appointments' && (
            <section>
              <h2>Appointments</h2>
              <input
                type="text"
                placeholder="Search Appointment"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '8px', width: '100%', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {filteredAppointments.map(appt => (
                  <li
                    key={appt._id}
                    style={{
                      background: '#fff',
                      marginBottom: '10px',
                      padding: '15px',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{appt.patientName || 'Unknown Patient'}</p>
                      <p style={{ margin: 0 }}>{new Date(appt.dateTime).toLocaleDateString()} {new Date(appt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div>
                      <select
                        value={appt.status}
                        onChange={e => updateAppointmentStatus(appt._id, e.target.value)}
                        style={{ padding: '6px', borderRadius: '4px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="complete">Complete</option>
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Other tabs can be implemented similarly */}

        </main>
      </div>
      <Toast message={toastMsg} type={toastType} onClose={closeToast} />
    </>
  );
};

export default DoctorDashboard;
