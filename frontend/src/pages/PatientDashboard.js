import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Toast from '../components/layout/Toast';
import MedicalReportUpload from '../components/MedicalReportUpload';
import Calendar from '../components/Calendar';
import TimePicker from '../components/TimePicker';

const sidebarItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'doctors', label: 'Doctors' },
  { key: 'reports', label: 'Medical Reports' },
  { key: 'settings', label: 'Settings' },
];

const overviewData = [
  { label: 'Total Patients', value: 580 },
  { label: 'Upcoming Appointments', value: 12 },
  { label: 'Completed Appointments', value: 276 },
  { label: 'Unread Messages', value: 5 },
];

const PatientDashboard = () => {
  const [selectedSidebar, setSelectedSidebar] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    date: null,
    time: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/v1/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data = await res.json();
        if (data?.data) {
          setUserName(data.data.name?.split(' ')[0] || '');
          setEmail(data.data.email || '');
          setPhone(data.data.phone || '');
          setBloodGroup(data.data.bloodGroup || '');
          setAddress(data.data.address || '');
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await fetch('http://localhost:5000/v1/user/doctors', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data = await res.json();
        if (data?.data) {
          setDoctorsList(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch doctors list:', error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await fetch('http://localhost:5000/v1/appointment?role=patient', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data = await res.json();
        if (data?.data) {
          setAppointments(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    fetchUserProfile();
    fetchDoctors();
    fetchAppointments();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('http://localhost:5000/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          name: userName,
          email,
          phone,
          bloodGroup,
          address,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setToastMessage('Settings saved successfully!');
        setToastType('success');
      } else {
        setToastMessage(data.message || 'Failed to save settings');
        setToastType('error');
      }
    } catch (error) {
      setToastMessage('Error saving settings: ' + error.message);
      setToastType('error');
    }
  };

  const handleCreateAppointment = async () => {
    if (!newAppointment.doctorId || !newAppointment.date || !newAppointment.time) {
      setToastMessage('Please select doctor, date, and time');
      setToastType('error');
      return;
    }

    const dateTime = new Date(newAppointment.date);
    const [hours, minutes] = newAppointment.time.split(':').map(Number);
    dateTime.setHours(hours, minutes);

    try {
      const res = await fetch('http://localhost:5000/v1/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          doctorId: newAppointment.doctorId,
          dateTime: dateTime.toISOString(),
          status: 'pending',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(prev => [...prev, data.data]);
        setToastMessage('Appointment created successfully');
        setToastType('success');
        setNewAppointment({ doctorId: '', date: null, time: '' });
      } else {
        setToastMessage(data.message || 'Failed to create appointment');
        setToastType('error');
      }
    } catch (error) {
      setToastMessage('Error creating appointment: ' + error.message);
      setToastType('error');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const res = await fetch(`http://localhost:5000/v1/appointment/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(prev => prev.filter(appt => appt._id !== appointmentId));
        setToastMessage('Appointment cancelled successfully');
        setToastType('success');
      } else {
        setToastMessage(data.message || 'Failed to cancel appointment');
        setToastType('error');
      }
    } catch (error) {
      setToastMessage('Error cancelling appointment: ' + error.message);
      setToastType('error');
    }
  };

  const closeToast = () => {
    setToastMessage('');
    setToastType('info');
  };

  const handleSidebarSelect = (key) => {
    setSelectedSidebar(key);
  };

  // Disable past dates logic
  const disablePastDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar items={sidebarItems} selectedKey={selectedSidebar} onSelect={handleSidebarSelect} />
        <main style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f5f7ff', overflowY: 'auto' }}>
          {selectedSidebar === 'dashboard' && (
            <>
              <h1>Good Morning, {userName || 'Patient'}</h1>
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                {overviewData.map((item) => (
                  <div key={item.label} style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    flex: 1,
                    textAlign: 'center',
                  }}>
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedSidebar === 'appointments' && (
            <section>
              <h2>My Appointments</h2>

              {/* Doctor Selection */}
              <label>
                Select Doctor:
                <select
                  value={newAppointment.doctorId}
                  onChange={e => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
                  style={{ margin: '10px', padding: '5px' }}
                >
                  <option value="">-- Select Doctor --</option>
                  {doctorsList.map(doc => (
                    <option key={doc._id} value={doc._id}>{doc.name} - {doc.specialization}</option>
                  ))}
                </select>
              </label>

              {/* Calendar Date Selection as dropdown */}
              <label style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }}>
                Select Date:
                <select
                  value={newAppointment.date ? newAppointment.date.toISOString().split('T')[0] : ''}
                  onChange={e => setNewAppointment({ ...newAppointment, date: new Date(e.target.value) })}
                  style={{ marginLeft: '5px', padding: '5px' }}
                >
                  <option value="">-- Select Date --</option>
                  {/* Generate options for next 30 days */}
                  {[...Array(30)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const dateStr = date.toISOString().split('T')[0];
                    return (
                      <option key={dateStr} value={dateStr}>
                        {date.toDateString()}
                      </option>
                    );
                  })}
                </select>
              </label>

              {/* Time Picker as dropdown */}
              <label style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }}>
                Select Time:
                <select
                  value={newAppointment.time}
                  onChange={e => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  style={{ marginLeft: '5px', padding: '5px' }}
                >
                  <option value="">-- Select Time --</option>
                  {/* Generate time options from 8:00 AM to 5:00 PM in 30 min intervals */}
                  {Array.from({ length: 18 }, (_, i) => {
                    const hour = 8 + Math.floor(i / 2);
                    const minute = i % 2 === 0 ? '00' : '30';
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const displayHour = hour > 12 ? hour - 12 : hour;
                    const timeStr = `${displayHour}:${minute} ${ampm}`;
                    return (
                      <option key={timeStr} value={`${hour.toString().padStart(2, '0')}:${minute}`}>
                        {timeStr}
                      </option>
                    );
                  })}
                </select>
              </label>

              <button
                onClick={handleCreateAppointment}
                style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px' }}
              >
                Create Appointment
              </button>

              {/* Appointment Table */}
              <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#dbeafe' }}>
                  <tr>
                    <th>Doctor</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt._id}>
                      <td>{appt.doctorId?.name || 'Unknown'}</td>
                      <td>{appt.doctorId?.profile?.address || 'N/A'}</td>
                      <td>{new Date(appt.dateTime).toLocaleDateString()}</td>
                      <td>{new Date(appt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{appt.status}</td>
                      <td>
                        {appt.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelAppointment(appt._id)}
                            style={{ padding: '5px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {selectedSidebar === 'doctors' && (
            <section>
              <h2>Available Doctors</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                {doctorsList.map((doctor) => (
                  <div key={doctor._id} style={{
                    flex: '1 1 30%',
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                    <h3>{doctor.name}</h3>
                    <p><strong>Specialty:</strong> {doctor.specialization}</p>
                    <p><strong>Location:</strong> {doctor.location}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {selectedSidebar === 'reports' && (
            <section>
              <h2>Medical Reports</h2>
              <MedicalReportUpload />
            </section>
          )}

          {selectedSidebar === 'settings' && (
            <section>
              <h2>Settings</h2>
              <form style={{ marginTop: '20px', maxWidth: '400px' }} onSubmit={e => { e.preventDefault(); handleSaveSettings(); }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Name:
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </label>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Email:
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </label>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Phone:
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </label>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Blood Group:
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </label>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  Address:
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </label>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                  Save Settings
                </button>
              </form>
            </section>
          )}
        </main>
      </div>

      <Toast message={toastMessage} type={toastType} onClose={closeToast} />
    </>
  );
};

export default PatientDashboard;