import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Houses from './components/Products/product';
import Registration from './components/Register/registration';
import Login from './components/Login/login';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route that redirects to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Product route, accessible after login */}
        <Route path="/products" element={<Houses />} />

        {/* Registration route */}
        <Route path="/register" element={<Registration />} />
      </Routes>
    </Router>
  );
}

export default App;
