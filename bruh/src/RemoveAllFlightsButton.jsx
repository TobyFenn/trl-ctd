import React from 'react';
import { getDatabase, ref, set } from 'firebase/database';

const RemoveAllFlightsButton = () => {
  const handleRemoveAllFlights = () => {
    // Get the database reference to the "flights" node
    const database = getDatabase();
    const flightsRef = ref(database, 'flights');

    // Remove all flights by setting the "flights" node to null
    set(flightsRef, null);
  };

  return (
    <button onClick={handleRemoveAllFlights}>Remove All Flights</button>
  );
};

export default RemoveAllFlightsButton;
