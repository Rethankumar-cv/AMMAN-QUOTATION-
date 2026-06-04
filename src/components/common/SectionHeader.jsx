import React from 'react';

const SectionHeader = ({ title, subtitle, rightElement }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-3)' }}>
      <div>
        <h2 className="text-h2" style={{ margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtitle}</p>}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};

export default SectionHeader;
