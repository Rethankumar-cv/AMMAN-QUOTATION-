import React from 'react';

const Badge = ({ status, children, style = {} }) => {
  let bgColor, color, border;
  
  switch (status?.toLowerCase()) {
    case 'finalized':
      bgColor = '#ECFDF5';
      color = '#10B981';
      border = '#A7F3D0';
      break;
    case 'draft':
      bgColor = '#F3F4F6';
      color = '#6B7280';
      border = '#E5E7EB';
      break;
    case 'archived':
      bgColor = '#EFF6FF';
      color = '#3B82F6';
      border = '#BFDBFE';
      break;
    case 'cancelled':
      bgColor = '#FEF2F2';
      color = '#EF4444';
      border = '#FECACA';
      break;
    default:
      bgColor = '#F3F4F6';
      color = '#6B7280';
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
