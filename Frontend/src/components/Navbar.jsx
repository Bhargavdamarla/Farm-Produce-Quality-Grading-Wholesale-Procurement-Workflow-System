import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Navbar = ({ userName, userRole, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const getRoleDisplay = () => {
    const roles = {
      FARMER: '👨‍🌾 Farmer',
      QUALITY_INSPECTOR: '🔍 Inspector',
      PROCUREMENT_OFFICER: '🛒 Procurement',
      ADMIN: '⚙️ Admin',
    };
    return roles[userRole] || userRole;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🌾 AgriProcure</h1>
          <span className="tagline">Quality Grading & Procurement System</span>
        </div>

        <ul className="navbar-menu">
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-role">{getRoleDisplay()}</span>
            <span className="user-name">{userName}</span>
          </div>

          <div className="dropdown">
            <button
              className="dropdown-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              ⋮
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <a href="#profile">👤 Profile</a>
                <a href="#settings">⚙️ Settings</a>
                <hr />
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Logout
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
