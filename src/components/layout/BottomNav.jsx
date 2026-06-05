import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, History } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="no-print" style={wrapperStyle}>
      <nav style={navStyle}>
        <div style={containerStyle}>
          <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'nav-active' : ''}`} end>
            <LayoutDashboard size={22} className="nav-icon" />
            <span className="nav-label">Dashboard</span>
            <div className="nav-indicator"></div>
          </NavLink>
          
          <NavLink to="/create" className={({isActive}) => `nav-item ${isActive ? 'nav-active' : ''}`}>
            <FileText size={22} className="nav-icon" />
            <span className="nav-label">New</span>
            <div className="nav-indicator"></div>
          </NavLink>
          
          <NavLink to="/history" className={({isActive}) => `nav-item ${isActive ? 'nav-active' : ''}`}>
            <History size={22} className="nav-icon" />
            <span className="nav-label">History</span>
            <div className="nav-indicator"></div>
          </NavLink>
          
          <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'nav-active' : ''}`}>
            <Settings size={22} className="nav-icon" />
            <span className="nav-label">Settings</span>
            <div className="nav-indicator"></div>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

const wrapperStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '0 16px 16px 16px',
  zIndex: 100,
  pointerEvents: 'none'
};

const navStyle = {
  backgroundColor: 'var(--bg-surface)',
  borderRadius: '24px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  pointerEvents: 'auto',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(10px)',
  maxWidth: '400px',
  margin: '0 auto'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: '68px',
  padding: '0 8px'
};

export default BottomNav;
