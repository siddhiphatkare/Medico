import React, { useState } from 'react';

const Calendar = ({ appointments = [], onDateSelect }) => {
  // Extract unique sorted dates from appointments
  const dates = Array.from(new Set(appointments.map(a => a.date))).sort((a, b) => new Date(a) - new Date(b));

  const [selectedDate, setSelectedDate] = useState(dates[0] || null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <div>
      <h3>Appointment Dates</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {dates.map(date => (
          <li
            key={date}
            onClick={() => handleDateClick(date)}
            style={{
              cursor: 'pointer',
              padding: '8px',
              backgroundColor: date === selectedDate ? '#ff6f61' : '#f0f0f0',
              color: date === selectedDate ? 'white' : 'black',
              marginBottom: '5px',
              borderRadius: '4px',
            }}
          >
            {new Date(date).toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendar;
