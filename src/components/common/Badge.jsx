import React from 'react';

const Badge = ({ children, status = 'default' }) => {
  // status: 'draft' (grey), 'finalized' (orange), 'success' (green), 'default'
  
  let bg = 'var(--color-grey-100)';
  let color = 'var(--color-grey-600)';

  if (status === 'draft') {
    bg = 'var(--color-grey-100)';
    color = 'var(--color-grey-600)';
  } else if (status === 'finalized') {
    bg = 'var(--color-orange-100)';
    color = 'var(--color-orange-600)';
  } else if (status === 'success') {
    bg = '#DCFCE7'; // light green
    color = '#166534'; // dark green
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 'var(--font-weight-bold)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      backgroundColor: bg,
      color: color
    }}>
      {children}
    </span>
  );
};

export default Badge;
