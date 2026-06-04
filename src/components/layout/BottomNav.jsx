import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, History } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="no-print" style={navStyle}>
      <div style={containerStyle}>
        <NavLink to="/" style={linkStyle} className={({isActive}) => isActive ? 'nav-active' : ''} end>
          <LayoutDashboard size={20} />
          <span style={labelStyle}>Dashboard</span>
        </NavLink>
        
        <NavLink to="/create" style={linkStyle} className={({isActive}) => isActive ? 'nav-active' : ''}>
          <FileText size={20} />
          <span style={labelStyle}>New Quote</span>
        </NavLink>
        
        <NavLink to="/history" style={linkStyle} className={({isActive}) => isActive ? 'nav-active' : ''}>
          <History size={20} />
          <span style={labelStyle}>History</span>
        </NavLink>
        
        <NavLink to="/settings" style={linkStyle} className={({isActive}) => isActive ? 'nav-active' : ''}>
          <Settings size={20} />
          <span style={labelStyle}>Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};

const navStyle = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'var(--bg-surface)',
  borderTop: '1px solid var(--border-default)',
  paddingBottom: 'env(safe-area-inset-bottom)',
  zIndex: 100,
  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: '64px',
  maxWidth: '1024px',
  margin: '0 auto'
};

const linkStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  flex: 1,
  height: '100%',
  transition: 'color 0.2s ease',
  gap: '4px'
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '500',
  letterSpacing: '0.2px'
};

export default BottomNav;
