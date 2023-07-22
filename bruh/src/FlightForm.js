import React, { useState } from 'react';

const FlightForm = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightDate, setFlightDate] = useState('');

  // Function to handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'flightNumber') {
      setFlightNumber(value.toUpperCase().slice(0, 6));
    } else if (name === 'flightDate') {
      setFlightDate(value);
    }
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // You can use this information to store it in Firebase or perform other actions
    console.log('Submitted Flight Number:', flightNumber);
    console.log('Submitted Flight Date:', flightDate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="flightNumber">Flight Number:</label>
        <input
          type="text"
          id="flightNumber"
          name="flightNumber"
          value={flightNumber}
          onChange={handleInputChange}
          maxLength={6}
          style={{ textTransform: 'uppercase' }}
          required
        />
      </div>
      <div>
        <label htmlFor="flightDate">Flight Date:</label>
        <input
          type="date"
          id="flightDate"
          name="flightDate"
          value={flightDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FlightForm;
