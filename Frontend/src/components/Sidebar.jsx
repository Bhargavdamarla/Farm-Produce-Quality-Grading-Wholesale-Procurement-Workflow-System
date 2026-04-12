import React, { useState } from 'react';
import '../styles.css';

const Sidebar = ({ userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getMenuItems = () => {
    const commonMenus = [
      { label: 'Dashboard', href: '#dashboard', icon: '📊' },
    ];

    const roleMenus = {
      FARMER: [
        { label: 'Submit Produce', href: '#submit-produce', icon: '🌾' },
        { label: 'My Produces', href: '#my-produces', icon: '📦' },
        { label: 'Submission History', href: '#history', icon: '📋' },
      ],
      QUALITY_INSPECTOR: [
        { label: 'Pending Inspections', href: '#pending', icon: '🔍' },
        { label: 'Complete Inspection', href: '#inspect', icon: '✅' },
        { label: 'Inspection History', href: '#history', icon: '📋' },
      ],
      PROCUREMENT_OFFICER: [
        { label: 'Available Produce', href: '#graded', icon: '📦' },
        { label: 'Create Order', href: '#order', icon: '🛒' },
        { label: 'Order History', href: '#orders', icon: '📋' },
      ],
      ADMIN: [
        { label: 'Users Management', href: '#users', icon: '👥' },
        { label: 'Produce Tracking', href: '#produces', icon: '🌾' },
        { label: 'Inspections', href: '#inspections', icon: '🔍' },
        { label: 'Procurement', href: '#procurement', icon: '🛒' },
        { label: 'Inventory', href: '#inventory', icon: '📦' },
        { label: 'Analytics', href: '#analytics', icon: '📊' },
      ],
    };

    return [...commonMenus, ...(roleMenus[userRole] || [])];
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '→' : '←'}
      </button>

      <div className="sidebar-header">
        {!isCollapsed && <h2>Menu</h2>}
      </div>

      <ul className="sidebar-menu">
        {getMenuItems().map((item, index) => (
          <li key={index}>
            <a href={item.href} title={isCollapsed ? item.label : ''}>
              <span className="menu-icon">{item.icon}</span>
              {!isCollapsed && <span className="menu-label">{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <p className="version-info">v1.0 Beta</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
