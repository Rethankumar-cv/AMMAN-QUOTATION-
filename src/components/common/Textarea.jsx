import React from 'react';

const Textarea = ({ label, error, required, className = '', ...props }) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span style={{color: 'var(--color-error)'}}>*</span>}
        </label>
      )}
      <textarea 
        className={`form-input ${error ? 'error' : ''}`}
        style={{ minHeight: '100px', resize: 'vertical' }}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Textarea;
