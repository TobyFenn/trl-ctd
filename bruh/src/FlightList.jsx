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
  const [flightInfo, setFlightInfo] = useState({}); // New state for storing flight information
  const [duplicateFlightIds, setDuplicateFlightIds] = useState([]);
  const [matchedFlights, setMatchedFlights] = useState([]);

//   const [areArrivalTimesFetched, setAreArrivalTimesFetched] = useState(false);


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
    const findMatchedFlights = (flightsArray) => {
      const duplicateIds = [];
      const matchedFlightData = []; // Array to store matched flights data


      flightsArray.forEach((flight, index) => {
        const { flightNumber, flightDate } = flight;
        const arrivalTime = arrivalTimes[`${flightNumber}-${flightDate}`];

        // Skip the flight if it has "N/A" arrival time
        if (arrivalTime === 'N/A') {
          return;
        }

        // Check for duplicates based on arrival times
        for (let i = index + 1; i < flightsArray.length; i++) {
          const otherFlight = flightsArray[i];
          const otherArrivalTime = arrivalTimes[`${otherFlight.flightNumber}-${otherFlight.flightDate}`];

          // Skip the comparison if either of the flights has "N/A" arrival time
          if (otherArrivalTime === 'N/A') {
            continue;
          }

          // Calculate the difference in minutes between the two arrival times
        const diffInMinutes = Math.abs((new Date(arrivalTime) - new Date(otherArrivalTime)) / 60000);

        // Check if the difference falls within the maxWaitTime of either flight
        if (diffInMinutes <= flight.maxWaitTime || diffInMinutes <= otherFlight.maxWaitTime) {
          duplicateIds.push(flight.id);
          duplicateIds.push(otherFlight.id);

          // Add the matched flights data to the array
          matchedFlightData.push({ flight1Id: flight.id, flight2Id: otherFlight.id });

          // Adding console debug messages here
          console.log('Two flights match:');
          console.log('Flight 1 phone #:', flight.phoneNumber);
          console.log('Flight 2 phone #:', otherFlight.phoneNumber);

          break; // Break if a match is found
          }
        }
      });

      setDuplicateFlightIds(duplicateIds);
      setMatchedFlights(matchedFlightData); // Update the matched flights data state

    };
    

    findMatchedFlights(flights);
  }, [flights, arrivalTimes]);

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
      const updatedFlightInfo = {}; // New object to store additional flight information

      for (const flight of flights) {
        const { flightNumber, flightDate } = flight;
        console.log(`Fetching Arrival Time for Flight Number: ${flightNumber} - Date: ${flightDate}`);

        try {
          const flightInfo = await fetchFlightInformation(flightNumber);
          if (flightInfo && flightInfo.response && flightInfo.response[0] && flightInfo.response[0].arr_time_utc) {
            console.log(`Arrival Time for Flight Number: ${flightNumber} - Date: ${flightDate} - ${flightInfo.response[0].arr_time_utc}`);
            updatedArrivalTimes[`${flightNumber}-${flightDate}`] = flightInfo.response[0].arr_time_utc;
            // Store additional flight information in the updatedFlightInfo object
            updatedFlightInfo[`${flightNumber}-${flightDate}`] = {
              status: flightInfo.response[0].status,
              terminal: flightInfo.response[0].arr_terminal,
            };
          } else {
            console.log(`No Arrival Time found for Flight Number: ${flightNumber} - Date: ${flightDate}`);
            updatedArrivalTimes[`${flightNumber}-${flightDate}`] = 'N/A';
            // Store default values for status and terminal in case of missing data
            updatedFlightInfo[`${flightNumber}-${flightDate}`] = {
              status: 'N/A',
              terminal: 'N/A',
            };
          }
        } catch (error) {
          console.error('Error fetching flight information:', error);
          updatedArrivalTimes[`${flightNumber}-${flightDate}`] = 'Error';
          // Store default values for status and terminal in case of an error
          updatedFlightInfo[`${flightNumber}-${flightDate}`] = {
            status: 'Error',
            terminal: 'Error',
          };
        }
      }

      setArrivalTimes(updatedArrivalTimes);
      setFlightInfo(updatedFlightInfo); // Update the flight information state
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
            <th style={{ padding: '10px', border: '1px solid black' }}>Unique User ID</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Flight Number</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Date</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Arrival Time</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Phone Number</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Wait Tolerance</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Terminal</th>
          </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr
                key={flight.id}
                className={`flight-item ${duplicateFlightIds.includes(flight.id) ? 'duplicate' : ''}`}
                style={{
                  color: duplicateFlightIds.includes(flight.id) ? 'red' : 'black',
                }}
              >
    <td style={{ padding: '10px', border: '1px solid black' }}>{flight.id}</td>
    <td style={{ padding: '10px', border: '1px solid black' }}>{flight.flightNumber}</td>
    <td style={{ padding: '10px', border: '1px solid black' }}>{flight.flightDate}</td>
    <td style={{ padding: '10px', border: '1px solid black' }}>{arrivalTimes[`${flight.flightNumber}-${flight.flightDate}`] || 'N/A'}</td>
    <td style={{ padding: '10px', border: '1px solid black' }}>{flight.phoneNumber || 'N/A'}</td>
    <td style={{ padding: '10px', border: '1px solid black' }}>{flight.maxWaitTime || 'N/A'} minutes</td>
    <td style={{ padding: '10px', border: '1px solid black' }}>{flightInfo[`${flight.flightNumber}-${flight.flightDate}`]?.status || 'N/A'}</td>
    <td style={{ padding: '10px', border: '1px solid black' }}>{flightInfo[`${flight.flightNumber}-${flight.flightDate}`]?.terminal || 'N/A'}</td>
    </tr>
            ))}
          </tbody>
        </table>

        {/* New table for displaying matched flights with the "Justification" column */}
      <h2>Matched Flights</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid black' }}>Flight 1 ID</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Flight 2 ID</th>
            <th style={{ padding: '10px', border: '1px solid black' }}>Justification</th>
          </tr>
        </thead>
        <tbody>
          {matchedFlights.map((matchedFlight, index) => {
            const flight1 = flights.find((flight) => flight.id === matchedFlight.flight1Id);
            const flight2 = flights.find((flight) => flight.id === matchedFlight.flight2Id);

            const flight1Iata = flight1 ? flight1.flightNumber : 'N/A';
            const flight2Iata = flight2 ? flight2.flightNumber : 'N/A';

            // Calculate the difference in minutes between the two arrival times
            const arrivalTime1 = arrivalTimes[`${flight1.flightNumber}-${flight1.flightDate}`];
            const arrivalTime2 = arrivalTimes[`${flight2.flightNumber}-${flight2.flightDate}`];
            const diffInMinutes = Math.abs((new Date(arrivalTime1) - new Date(arrivalTime2)) / 60000);

            // Check if the difference falls within the maxWaitTime of either flight
            const isMatched = diffInMinutes <= flight1.maxWaitTime || diffInMinutes <= flight2.maxWaitTime;

            const justification = isMatched
              ? `${flight2Iata} lands ${diffInMinutes} minutes after ${flight1Iata}`
              : 'N/A';

            return (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid black' }}>{matchedFlight.flight1Id}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{matchedFlight.flight2Id}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{justification}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FlightList;