import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Houses from './components/Products/product';
import Registration from './components/Register/registration';
import Login from './components/Login/login';
 import LandLord from './components/LandlordHouses'

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route that redirects to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Houses route, accessible after login */}
        <Route path="/houses" element={<Houses />} />

        {/* Registration route */}
        <Route path="/register" element={<Registration />} />

        {/*Landlord Page */}
         <Route path="/landlord" element={<LandLord />} /> 

        
      </Routes>
    </Router>
  );
}

export default App;
