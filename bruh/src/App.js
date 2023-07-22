// import logo from './logo.svg';
import './App.css';
import React from 'react';
import FlightNumberInput from './FlightNumberInput';
import FlightDateInput from './FlightDateInput';

function App() {
  return (
    <div className="app-container">
      <FlightNumberInput />
      <FlightDateInput />
    </div>
  );
}

export default App;
