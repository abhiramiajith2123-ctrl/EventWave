import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const role = localStorage.getItem('role');

  if (!user || !role) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Logged in but trying to access the wrong dashboard
    if (role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/student-dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
