import React from 'react';

const Toggle = ({ label, checked, onChange }) => {
  return (
    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
      <div 
        style={{ 
          width: '40px', 
          height: '24px', 
          backgroundColor: checked ? 'var(--color-orange-500)' : 'var(--color-grey-300)',
          borderRadius: '12px',
          position: 'relative',
          transition: 'background-color 0.2s',
          marginRight: '12px'
        }}
      >
        <div 
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: 'white',
            borderRadius: '50%',
            position: 'absolute',
            top: '2px',
            left: checked ? '18px' : '2px',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        />
      </div>
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
        {label}
      </span>
      {/* Hidden checkbox for accessibility */}
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
      />
    </label>
  );
};

export default Toggle;
