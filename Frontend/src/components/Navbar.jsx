import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Navbar = ({ userName, userRole, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    const roles = {
      FARMER:              { label: 'Farmer',             icon: '🌾' },
      QUALITY_INSPECTOR:   { label: 'Quality Inspector',  icon: '🔍' },
      PROCUREMENT_OFFICER: { label: 'Procurement Officer',icon: '🛒' },
      ADMIN:               { label: 'Admin',               icon: '⚙️' },
    };
    return roles[userRole] || { label: userRole, icon: '👤' };
  };

  const badge = getRoleBadge();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <div>
            <h1>🌾 AgriProcure</h1>
            <span className="tagline">Quality Grading & Procurement System</span>
          </div>
        </div>

        {/* Right side */}
        <div className="navbar-user">
          {userName && (
            <div className="user-info">
              <span className="user-role">{badge.icon} {badge.label}</span>
              <span className="user-name">{userName}</span>
            </div>
          )}

          <div className="dropdown">
            <button
              className="dropdown-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="User menu"
            >
              ⋮
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
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
