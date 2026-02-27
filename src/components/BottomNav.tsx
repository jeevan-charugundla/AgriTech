import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, ScanLine, BarChart3, User } from 'lucide-react';
import './BottomNav.css';

export const BottomNav: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home className="nav-icon" />
        <span>Home</span>
      </NavLink>
      <NavLink to="/marketplace" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ShoppingBag className="nav-icon" />
        <span>Market</span>
      </NavLink>
      <div className="nav-item-center-wrapper">
        <NavLink to="/scan" className={({ isActive }) => `nav-item-scan ${isActive ? 'active' : ''}`}>
          <div className="scan-btn">
            <ScanLine className="scan-icon" />
          </div>
          <span>AI Scan</span>
        </NavLink>
      </div>
      <NavLink to="/insights" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <BarChart3 className="nav-icon" />
        <span>Insights</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <User className="nav-icon" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};
