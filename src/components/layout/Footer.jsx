import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} Amman Earth Movers.</p>
      <p style={{fontSize: '12px', marginTop: '4px', color: 'var(--text-secondary)'}}>
        Quotation Generator v1.0
      </p>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#F3F4F6',
  borderTop: '1px solid var(--border-light)',
  padding: '16px',
  textAlign: 'center',
  color: 'var(--brand-grey)',
  fontSize: '14px',
  marginTop: 'auto'
};

export default Footer;
