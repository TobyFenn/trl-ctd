import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import "Routes" instead of "Switch"
import Home from './Home';
import NewPage from './NewPage';
import FlightForm from './FlightForm';
import FlightList from './FlightList';



import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div>
          <h1>Ride matching form</h1>
          <FlightForm />
          <FlightList />
        </div>
      </div>
    </Router>
  );
};

export default App;
