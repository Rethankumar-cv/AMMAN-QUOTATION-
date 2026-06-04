import React from 'react';

const Input = ({ label, error, required, className = '', ...props }) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span style={{color: 'var(--color-error)'}}>*</span>}
        </label>
      )}
      <input 
        className={`form-input ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Input;
