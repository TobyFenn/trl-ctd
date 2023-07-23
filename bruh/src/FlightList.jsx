import React, { useState, useEffect } from 'react';
// import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import RemoveAllFlightsButton from './RemoveAllFlightsButton';
import axios from 'axios';

// // Initialize Firebase
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "flites.firebaseapp.com",
//   projectId: "flites",
//   storageBucket: "flites.appspot.com",
//   messagingSenderId: "438351659234",
//   appId: "1:438351659234:web:c110c8410d5c9300e55ebb"
// };

// initializeApp(firebaseConfig);

const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [arrivalTimes, setArrivalTimes] = useState({});

  useEffect(() => {
    const database = getDatabase();
    const flightsRef = ref(database, 'flights');

    const fetchData = async () => {
      try {
        const snapshot = await get(flightsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const flightsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setFlights(flightsArray);
        } else {
          setFlights([]);
        }
      } catch (error) {
        console.error('Error fetching flight data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchFlightInformation = async (flightIata) => {
    const api_key = "dcb6ad7a-9efc-4bc2-b038-709e397984d4";
    const api_base = "https://airlabs.co/api/v9/";
    try {
      const response = await axios.get(`${api_base}schedules`, {
        params: {
          api_key,
          flight_iata: flightIata,
        },
      });
      console.log(`API Call - Flight Number: ${flightIata} - Response:`, response.data); // Debug: Log API response
      return response.data;
    } catch (error) {
      console.error('Error fetching flight information:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchFlightInfoForFlights = async () => {
      const updatedArrivalTimes = {};
      for (const flight of flights) {
        const { flightNumber, flightDate } = flight;
        console.log(`Fetching Arrival Time for Flight Number: ${flightNumber} - Date: ${flightDate}`); // Debug: Log flight details
        const flightInfo = await fetchFlightInformation(flightNumber);
        if (flightInfo && flightInfo.response && flightInfo.response[0] && flightInfo.response[0].arr_time_utc) { // Check if arr_time_utc exists in the API response
          console.log(`Arrival Time for Flight Number: ${flightNumber} - Date: ${flightDate} - ${flightInfo.response[0].arr_time_utc}`); // Debug: Log arrival time
          updatedArrivalTimes[`${flightNumber}-${flightDate}`] = flightInfo.response[0].arr_time_utc;
        } else {
          console.log(`No Arrival Time found for Flight Number: ${flightNumber} - Date: ${flightDate}`); // Debug: Log if no arrival time
          updatedArrivalTimes[`${flightNumber}-${flightDate}`] = 'N/A';
        }
      }
      setArrivalTimes(updatedArrivalTimes);
    };

    fetchFlightInfoForFlights();
  }, [flights]);


  return (
    <div>
      <h2>Flight List</h2>
      <RemoveAllFlightsButton />
      <ul>
        {flights.map((flight) => (
          <li
            key={flight.id}
            style={{
              color: 'black',
            }}
          >
            Flight Number: {flight.flightNumber}, Date: {flight.flightDate}, Arrival Time: {arrivalTimes[`${flight.flightNumber}-${flight.flightDate}`] || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightList;
