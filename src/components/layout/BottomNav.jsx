import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Settings } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  // Hide the bottom navigation bar on screens where we want a full-height wizard or custom sticky action buttons.
  const hideOnPaths = ['/create', '/preview'];
  if (hideOnPaths.some(path => location.pathname.startsWith(path))) {
    return null;
  }

  return (
    <nav style={navStyle}>
      <NavLink to="/" style={linkStyle} className={({isActive}) => isActive ? 'nav-active' : ''}>
        <Home size={24} />
        <span style={textStyle}>Home</span>
      </NavLink>
      <NavLink to="/history" style={linkStyle} className={({isActive}) => isActive ? 'nav-active' : ''}>
        <FileText size={24} />
        <span style={textStyle}>History</span>
      </NavLink>
      <NavLink to="/settings" style={linkStyle} className={({isActive}) => isActive ? 'nav-active' : ''}>
        <Settings size={24} />
        <span style={textStyle}>Settings</span>
      </NavLink>
    </nav>
  );
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: 'var(--bg-surface)',
  borderTop: '1px solid var(--border-default)',
  padding: '8px 0',
  paddingBottom: 'calc(8px + env(safe-area-inset-bottom))', // For modern iOS notches
  position: 'sticky',
  bottom: 0,
  zIndex: 100,
  boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
};

const linkStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'var(--text-secondary)',
  padding: '8px 16px',
  transition: 'color 0.2s'
};

const textStyle = {
  fontSize: '10px',
  marginTop: '4px',
  fontWeight: 'var(--font-weight-medium)',
  textTransform: 'uppercase'
};

export default BottomNav;
