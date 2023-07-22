import React, { useState } from 'react';
import { format } from 'date-fns'; // Import the format function from date-fns

const FlightDateInput = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flight-date-input">
      <h2>Select Your Flight Date</h2>
      <input
        type="date"
        value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
        onChange={(e) => handleDateChange(new Date(e.target.value))}
        className="input-style"
      />
    </div>
  );
};

export default FlightDateInput;
