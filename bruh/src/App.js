import React from 'react';
import FlightNumberInput from './FlightNumberInput';
import FlightDateInput from './FlightDateInput';
import SubmitButton from './SubmitButton';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <div className="centered-container">
        <FlightNumberInput />
        <FlightDateInput />
        <SubmitButton />
      </div>
    </div>
  );
};

export default App;
