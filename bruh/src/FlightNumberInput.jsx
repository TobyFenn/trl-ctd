import React, { useState } from 'react';

const FlightNumberInput = () => {
  const [flightNumber, setFlightNumber] = useState('');

  const handleInputChange = (event) => {
    let inputValue = event.target.value.toUpperCase().slice(0, 6);
    setFlightNumber(inputValue);
  };

  return (
    <div className="flight-input"> {/* Add the class name here */}
      {/* <h2>Enter Your Airline Flight Number (Max 6 Characters)</h2> */}
      <input
        type="text"
        value={flightNumber}
        onChange={handleInputChange}
        maxLength={6}
        style={{
          textTransform: 'uppercase',
          fontSize: '18px',
          height: '40px',
          width: '200px',
          borderRadius: '10px',
          padding: '8px',
        }}
      />
    </div>
  );
};

export default FlightNumberInput;
