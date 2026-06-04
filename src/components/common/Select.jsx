import React from 'react';

const Select = ({ label, error, required, options = [], className = '', ...props }) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span style={{color: 'var(--color-error)'}}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select 
          className={`form-input ${error ? 'error' : ''}`}
          style={{ appearance: 'none', backgroundColor: '#fff', width: '100%', paddingRight: '36px' }}
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {/* Custom Chevron icon to replace the default ugly browser dropdown arrow on mobile */}
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-grey-500)' }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Select;
