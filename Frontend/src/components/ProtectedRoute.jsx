import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, userRole, requiredRole }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="unauthorized-container">
        <div className="unauthorized-message">
          <h1>❌ Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <p>Current Role: <strong>{userRole}</strong></p>
          <p>Required Role: <strong>{requiredRole}</strong></p>
          <a href="/login">← Back to Login</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
