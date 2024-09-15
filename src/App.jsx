import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


import Houses from './components/Products/product';
import Registration from './components/Register/registration';
import Login from './components/Login/login';
import LandLord from './components/LandlordHouses';
import CreateHouse from './components/CreateHouse';
import { AuthProvider } from './components/AuthContext'; // Correct path for AuthContext

import './App.css';

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/landlord" element={<LandLord />} />
          <Route path="/house/create" element={<CreateHouse />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
