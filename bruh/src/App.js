import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import "Routes" instead of "Switch"
import Home from './Home';
import NewPage from './NewPage';
import FlightForm from './FlightForm';

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <div className="centered-container">
          <Routes> {/* Use "Routes" instead of "Switch" */}
            <Route path="/" element={<Home />} /> {/* Use "element" instead of "component" */}
            <Route path="/new-page" element={<NewPage />} /> {/* Use "element" instead of "component" */}
          </Routes>
        </div>
        <div>
          <h1>Flight Booking Form</h1>
          <FlightForm />
        </div>
      </div>
    </Router>
  );
};

export default App;
