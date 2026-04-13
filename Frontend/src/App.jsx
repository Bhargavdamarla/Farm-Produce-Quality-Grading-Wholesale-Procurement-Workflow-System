import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import FarmerDashboard from './pages/FarmerDashboard.jsx';
import InspectorDashboard from './pages/InspectorDashboard.jsx';
import ProcurementDashboard from './pages/ProcurementDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// Components
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  // Check if user is logged in on component mount
  useEffect(() => {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const { isAuth, role, name } = JSON.parse(authData);
      setIsAuthenticated(isAuth);
      setUserRole(role);
      setUserName(name);
    }
  }, []);


  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    setUserRole(data.role);
    setUserName(data.name);
    localStorage.setItem(
      'authData',
      JSON.stringify({
        isAuth: true,
        id: data.id,
        role: data.role,
        name: data.name,
        email: data.email,
        createdAt: data.createdAt,
      })
    );
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('');
    localStorage.removeItem('authData');
  };

  return (
    <Router>
      {isAuthenticated && (
        <Navbar userName={userName} userRole={userRole} onLogout={handleLogout} />
      )}
      
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userRole.toLowerCase()}`} />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/farmer"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole="FARMER"
            >
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inspector"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole="QUALITY_INSPECTOR"
            >
              <InspectorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/procurement"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole="PROCUREMENT_OFFICER"
            >
              <ProcurementDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole="ADMIN"
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userRole.toLowerCase()}`} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
