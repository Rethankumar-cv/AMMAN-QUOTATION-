import React from 'react';

const Badge = ({ status, children, style = {} }) => {
  let bgColor, color, border;
  
  switch (status?.toLowerCase()) {
    case 'finalized':
      bgColor = '#ECFDF5';
      color = '#059669';
      border = '#A7F3D0';
      break;
    case 'draft':
      bgColor = '#FEF4E6';
      color = '#DE8500';
      border = '#FDE68A';
      break;
    case 'archived':
      bgColor = '#F3F4F6';
      color = '#4B5563';
      border = '#E5E7EB';
      break;
    default:
      bgColor = '#F3F4F6';
      color = '#4B5563';
      border = '#E5E7EB';
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      backgroundColor: bgColor,
      color: color,
      border: `1px solid ${border}`,
      ...style
    }}>
      {children || status}
    </span>
  );
};

export default Badge;
