import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import RemoveAllFlightsButton from './RemoveAllFlightsButton'; // Import the new button component
// import axios from 'axios'; // Commented out the import for making HTTP requests

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState({});
  const [duplicateFlights, setDuplicateFlights] = useState({});

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

  useEffect(() => {
    // Function to check for duplicate flights
    const findDuplicateFlights = (flightsArray) => {
      const duplicateMap = {};
      const duplicateIds = new Set();
  
      flightsArray.forEach((flight) => {
        const flightKey = `${flight.flightNumber}-${flight.flightDate}`;
        if (duplicateMap[flightKey]) {
          duplicateIds.add(flightKey); // Use flightKey instead of flight.id
          duplicateMap[flightKey].push(flight.id); // Use flightKey instead of flight.id
        } else {
          duplicateMap[flightKey] = [flight.id];
        }
      });
  
      setDuplicateFlights(duplicateIds);
    };
  
    findDuplicateFlights(flights);
  }, [flights]);
  

  return (
    <div>
      <h2>Flight List</h2>
      <RemoveAllFlightsButton />
      <ul>
        {flights.map((flight) => (
          <li
            key={flight.id}
            className={`flight-item ${duplicateFlights.has(`${flight.flightNumber}-${flight.flightDate}`) ? 'duplicate' : ''}`}
            style={{
              color: duplicateFlights.has(`${flight.flightNumber}-${flight.flightDate}`) ? 'red' : 'black',
            }}
          >
            Flight Number: {flight.flightNumber}, Date: {flight.flightDate}, Arrival Time: {arrivalTimes[`${flight.flightNumber}-${flight.flightDate}`]}
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default FlightList;
