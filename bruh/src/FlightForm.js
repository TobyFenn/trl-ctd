import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';

const FlightForm = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [maxWaitTime, setMaxWaitTime] = useState(0); // New state for maximum wait time

  // Function to handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'flightNumber') {
      setFlightNumber(value.toUpperCase().slice(0, 6));
    } else if (name === 'flightDate') {
      setFlightDate(value);
    } else if (name === 'phoneNumber') {
      setPhoneNumber(value);
    } else if (name === 'maxWaitTime') {
      setMaxWaitTime(Number(value));
    }
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // You can use this information to store it in Firebase or perform other actions
    console.log('Submitted Flight Number:', flightNumber);
    console.log('Submitted Flight Date:', flightDate);
    console.log('Submitted Phone Number:', phoneNumber);
    console.log('Maximum Wait Time:', maxWaitTime);

    // Store the flight information in Firebase Firestore Realtime Database
    const firebaseConfig = {
      apiKey: "AIzaSyDtXJdCDFnkS044k-_6TMrd83YQHo-NX04",
      authDomain: "flites.firebaseapp.com",
      projectId: "flites",
      storageBucket: "flites.appspot.com",
      messagingSenderId: "438351659234",
      appId: "1:438351659234:web:c110c8410d5c9300e55ebb"
    };

    initializeApp(firebaseConfig);

    const database = getDatabase();
    const flightsRef = ref(database, 'flights');
    const newFlightRef = push(flightsRef); // Generate a new unique key

    set(newFlightRef, {
      flightNumber: flightNumber,
      flightDate: flightDate,
      phoneNumber: phoneNumber,
      maxWaitTime: maxWaitTime, // Include the maximum wait time in the stored data
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="flightNumber">Flight Number: </label>
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
        <label htmlFor="flightDate">Flight Date: </label>
        <input
          type="date"
          id="flightDate"
          name="flightDate"
          value={flightDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone Number: </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={phoneNumber}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label htmlFor="maxWaitTime">Maximum Wait Time: </label>
        <select
          id="maxWaitTime"
          name="maxWaitTime"
          value={maxWaitTime}
          onChange={handleInputChange}
          required
        >
          <option value={0}>0 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>60 minutes</option>
          <option value={90}>90 minutes</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FlightForm;
