import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WifiOff } from 'lucide-react';

const Header = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header style={headerStyle}>
      <div style={contentStyle}>
        <Link to="/" style={logoLinkStyle}>
          <div style={logoContainerStyle}>
            <img 
              src="/assets/logo.png" 
              alt="Amman Earth Movers" 
              style={logoImageStyle} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span style={fallbackTextStyle}>
              <span style={{color: 'var(--color-grey-500)'}}>AMMAN</span>
              <span style={{color: 'var(--color-orange-500)', marginLeft: '4px'}}>EARTH MOVERS</span>
            </span>
          </div>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Offline Sync-Safe Indicator */}
          {isOffline && (
            <div style={offlineBadgeStyle} title="You are offline. Quotations will be saved locally.">
              <WifiOff size={14} />
              <span>Offline Mode</span>
            </div>
          )}
          {!isOffline && <div style={titleStyle}>Quote Gen</div>}
        </div>
      </div>
    </header>
  );
};

const headerStyle = {
  backgroundColor: 'var(--bg-surface)',
  borderBottom: '1px solid var(--border-default)',
  padding: '12px 16px',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: 'var(--shadow-sm)'
};

const contentStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '100%'
};

const logoLinkStyle = {
  textDecoration: 'none'
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center'
};

const logoImageStyle = {
  height: '32px',
  objectFit: 'contain'
};

const fallbackTextStyle = {
  display: 'none',
  fontWeight: 'var(--font-weight-extrabold)',
  fontSize: '18px',
  letterSpacing: '0.5px'
};

const titleStyle = {
  fontSize: 'var(--font-size-xs)',
  color: 'var(--text-secondary)',
  fontWeight: 'var(--font-weight-bold)',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

const offlineBadgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: 'var(--color-orange-100)',
  color: 'var(--color-orange-600)',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '10px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  border: '1px solid var(--color-orange-500)'
};

export default Header;
