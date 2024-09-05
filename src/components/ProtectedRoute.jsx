

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { authData } = useContext(AuthContext);

  if (!authData.token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(authData.role)) {
    // Role not authorized
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
