// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,
    role: null,
    username: null,
    email: null,
  });

  useEffect(() => {
    // On initial load, check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const { role, username, email } = decoded;
        setAuthData({ token, role, username, email });
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthData({
      token: null,
      role: null,
      username: null,
      email: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
