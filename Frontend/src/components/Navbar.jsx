import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Navbar = ({ userName, userRole, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('authData') || '{}');

  const resolvedUserName = userName || authData.name || '';
  const resolvedUserRole = userRole || authData.role || '';

  const handleLogout = () => {
    localStorage.removeItem('authData');
    sessionStorage.clear();

    if (onLogout) {
      onLogout();
    }

    navigate('/login', { replace: true });
    window.location.replace('/login');
  };

  const getRoleBadge = () => {
    const roles = {
      FARMER: { label: 'Farmer', icon: 'Farmer' },
      QUALITY_INSPECTOR: { label: 'Quality Inspector', icon: 'Inspector' },
      PROCUREMENT_OFFICER: { label: 'Procurement Officer', icon: 'Procurement' },
      ADMIN: { label: 'Admin', icon: 'Admin' },
    };

    return roles[resolvedUserRole] || { label: resolvedUserRole || 'User', icon: 'User' };
  };

  const badge = getRoleBadge();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div>
            <h1>AgriProcure</h1>
            <span className="tagline">Quality Grading and Procurement System</span>
          </div>
        </div>

        <div className="navbar-user">
          {resolvedUserName && (
            <div className="user-info">
              <span className="user-role">{badge.icon} {badge.label}</span>
              <span className="user-name">{resolvedUserName}</span>
            </div>
          )}

          <div className="dropdown">
            <button
              className="dropdown-btn"
              onClick={() => setShowDropdown((value) => !value)}
              aria-label="User menu"
            >
              Menu
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
