import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, set } from 'firebase/database'; // Add 'set' import here
import RemoveAllFlightsButton from './RemoveAllFlightsButton';
import axios from 'axios';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDtXJdCDFnkS044k-_6TMrd83YQHo-NX04",
    authDomain: "flites.firebaseapp.com",
    projectId: "flites",
    storageBucket: "flites.appspot.com",
    messagingSenderId: "438351659234",
    appId: "1:438351659234:web:c110c8410d5c9300e55ebb"
  };

  initializeApp(firebaseConfig);

  const FlightList = () => {
    const [flights, setFlights] = useState([]);
    const [arrivalTimes, setArrivalTimes] = useState({});
    const [duplicateFlights, setDuplicateFlights] = useState({});
  
    useEffect(() => {
      const database = getDatabase();
      const flightsRef = ref(database, 'flights');
  
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
  
      fetchData();
  
      const dataChangeCallback = () => {
        fetchData();
      };
      onValue(flightsRef, dataChangeCallback);
  
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
            duplicateIds.add(flightKey);
            duplicateMap[flightKey].push(flight.id);
          } else {
            duplicateMap[flightKey] = [flight.id];
          }
        });
  
        setDuplicateFlights(duplicateIds);
      };
  
      findDuplicateFlights(flights);
    }, [flights]);
  
    const fetchFlightInformation = async (flightIata) => {
      const api_key = "17bfab51-0ce4-4899-9fb8-70deb82eddbc"; //v2
      const api_base = "https://airlabs.co/api/v9/";
      try {
        const response = await axios.get(`${api_base}schedules`, {
          params: {
            api_key,
            flight_iata: flightIata,
          },
        });
        console.log(`API Call - Flight Number: ${flightIata} - Response:`, response.data);
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
            console.log(`Fetching Arrival Time for Flight Number: ${flightNumber} - Date: ${flightDate}`);
      
            try {
              const flightInfo = await fetchFlightInformation(flightNumber);
              if (flightInfo && flightInfo.response && flightInfo.response[0] && flightInfo.response[0].arr_time_utc) {
                console.log(`Arrival Time for Flight Number: ${flightNumber} - Date: ${flightDate} - ${flightInfo.response[0].arr_time_utc}`);
                updatedArrivalTimes[`${flightNumber}-${flightDate}`] = flightInfo.response[0].arr_time_utc;
              } else {
                console.log(`No Arrival Time found for Flight Number: ${flightNumber} - Date: ${flightDate}`);
                updatedArrivalTimes[`${flightNumber}-${flightDate}`] = 'N/A';
              }
            } catch (error) {
              console.error('Error fetching flight information:', error);
              updatedArrivalTimes[`${flightNumber}-${flightDate}`] = 'Error'; // Mark the error in the updatedArrivalTimes object
            }
          }
      
          setArrivalTimes(updatedArrivalTimes);
        };
      
        fetchFlightInfoForFlights();
      }, [flights]);

    const handleRemoveMostRecentFlight = () => {
        if (flights.length > 0) {
          const latestFlight = flights[flights.length - 1];
          const latestFlightId = latestFlight.id;
    
          // Remove the latest flight from the Firebase Realtime Database
          const database = getDatabase();
          const flightRef = ref(database, `flights/${latestFlightId}`);
          set(flightRef, null);
        }
      };
  
      return (
        <div>
          <h2>Flight List</h2>
          <RemoveAllFlightsButton />
          <button onClick={handleRemoveMostRecentFlight}>Remove Most Recent Flight</button>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', border: '1px solid black' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid black' }}>Flight Number</th>
                <th style={{ padding: '10px', border: '1px solid black' }}>Date</th>
                <th style={{ padding: '10px', border: '1px solid black' }}>Arrival Time</th>
                <th style={{ padding: '10px', border: '1px solid black' }}>Phone Number</th>
                <th style={{ padding: '10px', border: '1px solid black' }}>Wait Time</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr
                  key={flight.id}
                  className={`flight-item ${duplicateFlights.has(`${flight.flightNumber}-${flight.flightDate}`) ? 'duplicate' : ''}`}
                  style={{
                    color: duplicateFlights.has(`${flight.flightNumber}-${flight.flightDate}`) ? 'red' : 'black',
                  }}
                >
                  <td style={{ padding: '10px', border: '1px solid black' }}>{flight.id}</td>
                  <td style={{ padding: '10px', border: '1px solid black' }}>{flight.flightNumber}</td>
                  <td style={{ padding: '10px', border: '1px solid black' }}>{flight.flightDate}</td>
                  <td style={{ padding: '10px', border: '1px solid black' }}>{arrivalTimes[`${flight.flightNumber}-${flight.flightDate}`] || 'N/A'}</td>
                  <td style={{ padding: '10px', border: '1px solid black' }}>{flight.phoneNumber || 'N/A'}</td>
                  <td style={{ padding: '10px', border: '1px solid black' }}>{flight.maxWaitTime || 'N/A'} minutes</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  };
  
  export default FlightList;