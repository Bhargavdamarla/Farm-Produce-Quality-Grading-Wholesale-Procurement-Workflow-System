import React, { useState } from 'react';
import '../styles.css';

const Sidebar = ({ userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getMenuItems = () => {
    const commonMenus = [
      { label: 'Dashboard', href: '#dashboard', icon: 'Overview' },
    ];

    const roleMenus = {
      FARMER: [
        { label: 'Submit Produce', href: '#submit-produce', icon: 'Produce' },
        { label: 'My Produces', href: '#my-produces', icon: 'Lots' },
        { label: 'Submission History', href: '#history', icon: 'History' },
      ],
      QUALITY_INSPECTOR: [
        { label: 'Pending Inspections', href: '#pending', icon: 'Queue' },
        { label: 'Complete Inspection', href: '#inspect', icon: 'Grade' },
        { label: 'Inspection History', href: '#history', icon: 'History' },
      ],
      PROCUREMENT_OFFICER: [
        { label: 'Available Produce', href: '#graded', icon: 'Pool' },
        { label: 'Create Order', href: '#order', icon: 'Order' },
        { label: 'Order History', href: '#orders', icon: 'History' },
      ],
      ADMIN: [
        { label: 'Produce Tracking', href: '#produce', icon: 'Produce' },
        { label: 'Inspection Status', href: '#inspection', icon: 'Inspect' },
        { label: 'Procurement Analytics', href: '#procurement', icon: 'Analytics' },
        { label: 'Inventory Monitoring', href: '#inventory', icon: 'Inventory' },
      ],
    };

    return [...commonMenus, ...(roleMenus[userRole] || [])];
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '>' : '<'}
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
        {!isCollapsed && <p className="version-info">v1.0 Beta</p>}
      </div>
    </aside>
  );
};

export default Sidebar;
