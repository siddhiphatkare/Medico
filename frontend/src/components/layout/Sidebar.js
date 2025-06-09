import React from 'react';
import { FaHome, FaCalendarAlt, FaUserMd, FaFileMedical, FaCog, FaBell, FaUsers } from 'react-icons/fa';

const iconMap = {
  dashboard: <FaHome />,
  appointments: <FaCalendarAlt />,
  doctors: <FaUserMd />,
  reports: <FaFileMedical />,
  settings: <FaCog />,
  notifications: <FaBell />,
  patients: <FaUsers />,
};

const Sidebar = ({ items, selectedKey, onSelect }) => {
  return (
    <aside style={{
      width: '250px',
      backgroundColor: '#4f46e5',
      color: 'white',
      height: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map((item) => {
            const isActive = item.key === selectedKey;
            return (
              <li
                key={item.key}
                onClick={() => onSelect(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? '#6366f1' : 'transparent',
                  cursor: 'pointer',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'background-color 0.3s',
                }}
              >
                <span style={{ marginRight: '12px', fontSize: '18px' }}>
                  {iconMap[item.key] || <FaHome />}
                </span>
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </nav>
      <div style={{ fontSize: '12px', color: '#c7d2fe', textAlign: 'center', marginTop: 'auto' }}>
        &copy; 2024 Medico
      </div>
    </aside>
  );
};

export default Sidebar;
