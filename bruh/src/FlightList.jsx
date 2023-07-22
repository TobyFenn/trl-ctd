import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

const FlightList = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyDtXJdCDFnkS044k-_6TMrd83YQHo-NX04",
        authDomain: "flites.firebaseapp.com",
        projectId: "flites",
        storageBucket: "flites.appspot.com",
        messagingSenderId: "438351659234",
        appId: "1:438351659234:web:c110c8410d5c9300e55ebb"
      };

      const app = initializeApp(firebaseConfig);
    const database = getDatabase();
    const flightsRef = ref(database, 'flights');

    // Fetch the data from Firebase Realtime Database and set it in the state
    const fetchData = () => {
      onValue(flightsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const flightsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setFlights(flightsArray);
        } else {
          setFlights([]);
        }
      });
    };

    fetchData(); // Initial fetch

    // Listen for changes in the database to trigger a refresh
    const dataChangeCallback = () => {
      fetchData();
    };
    onValue(flightsRef, dataChangeCallback);

    // Clean up the event listener when the component is unmounted
    return () => {
      off(flightsRef, dataChangeCallback);
    };
  }, []);

  return (
    <div>
      <h2>Flight List</h2>
      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            Flight Number: {flight.flightNumber}, Date: {flight.flightDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightList;