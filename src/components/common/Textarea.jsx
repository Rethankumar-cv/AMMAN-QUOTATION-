import React from 'react';

const Textarea = ({ label, error, required, rows = 4, ...props }) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}
      <textarea 
        className={`form-input ${error ? 'error' : ''}`}
        rows={rows}
        style={{ resize: 'vertical', minHeight: '80px' }}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default Textarea;
