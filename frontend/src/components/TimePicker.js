import React, { useState } from 'react';

const TimePicker = ({ availableTimes = [], onTimeSelect }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    onTimeSelect(time);
  };

  return (
    <div>
      <h3>Select Time</h3>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap' }}>
        {availableTimes.map((time) => (
          <li
            key={time}
            onClick={() => handleTimeClick(time)}
            style={{
              cursor: 'pointer',
              padding: '8px 12px',
              margin: '5px',
              backgroundColor: time === selectedTime ? '#ff6f61' : '#f0f0f0',
              color: time === selectedTime ? 'white' : 'black',
              borderRadius: '4px',
              userSelect: 'none',
            }}
          >
            {time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimePicker;
