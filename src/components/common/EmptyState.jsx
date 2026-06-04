import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 16px',
      textAlign: 'center',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-default)'
    }}>
      {Icon && (
        <div style={{ backgroundColor: 'var(--color-grey-50)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
          <Icon size={40} color="var(--color-grey-300)" />
        </div>
      )}
      <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
        {title}
      </h3>
      {description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: action ? '24px' : '0', maxWidth: '280px' }}>
          {description}
        </p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
