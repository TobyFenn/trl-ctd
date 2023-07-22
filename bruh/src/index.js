import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from 'firebase/app'; // Import specific module
import 'firebase/database'; // Import other Firebase modules you plan to use (e.g., firestore, auth)
import { getDatabase, ref, set } from 'firebase/database'; // Import Firebase Database functions


import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const firebaseConfig = {
  apiKey: "AIzaSyDtXJdCDFnkS044k-_6TMrd83YQHo-NX04",
  authDomain: "flites.firebaseapp.com",
  projectId: "flites",
  storageBucket: "flites.appspot.com",
  messagingSenderId: "438351659234",
  appId: "1:438351659234:web:c110c8410d5c9300e55ebb"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Add test data to Firebase database
const database = getDatabase(); // Use getDatabase() to access the database function
const dbRef = ref(database, 'flights/flight123'); // Create a database reference
set(dbRef, {
  flightNumber: 'FL123',
  flightDate: '2023-07-25',
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
