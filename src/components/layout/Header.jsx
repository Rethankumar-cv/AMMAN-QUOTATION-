import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WifiOff, FileText } from 'lucide-react';

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
    <header className="no-print" style={headerStyle}>
      <div style={contentStyle}>
        <Link to="/" style={logoLinkStyle}>
          <div style={logoContainerStyle}>
            <img 
              src="/assets/logo.png" 
              alt="Amman Earth Movers" 
              style={logoImageStyle} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={fallbackTextStyle}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-grey-800)' }}>AMMAN</span>
                <span style={{ color: 'var(--color-orange-500)', marginLeft: '4px' }}>EARTH MOVERS</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--color-grey-500)', fontWeight: 'normal', marginTop: '-2px' }}>
                Quotation Management
              </span>
            </div>
          </div>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isOffline && (
            <div style={offlineBadgeStyle} title="You are offline. Quotations will be saved locally.">
              <WifiOff size={14} />
              <span style={{ display: 'none' }} className="sm:inline">Offline</span>
            </div>
          )}
          <Link to="/create-quotation" style={actionButtonStyle}>
            <FileText size={20} color="var(--color-orange-500)" />
          </Link>
        </div>
      </div>
    </header>
  );
};

const headerStyle = {
  backgroundColor: 'var(--bg-surface)',
  borderBottom: '1px solid var(--border-default)',
  borderTop: '4px solid var(--color-orange-500)',
  padding: '12px 24px',
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
  alignItems: 'center',
  gap: '12px'
};

const logoImageStyle = {
  height: '36px',
  objectFit: 'contain'
};

const fallbackTextStyle = {
  display: 'none',
  flexDirection: 'column',
  fontWeight: 'var(--font-weight-bold)',
  fontSize: '18px',
  letterSpacing: '-0.5px',
  lineHeight: '1.2'
};

const actionButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '44px',
  height: '44px',
  backgroundColor: 'var(--bg-surface)',
  borderRadius: '50%',
  border: '1px solid var(--border-default)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  cursor: 'pointer'
};

const offlineBadgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'var(--color-error-bg)',
  color: 'var(--color-error)',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 'var(--font-weight-bold)'
};

export default Header;
