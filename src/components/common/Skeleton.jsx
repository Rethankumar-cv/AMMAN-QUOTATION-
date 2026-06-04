import React from 'react';

const Skeleton = ({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', className = '' }) => {
  return (
    <div 
      className={className}
      style={{
        width, 
        height, 
        borderRadius,
        backgroundColor: 'var(--color-grey-100)',
        backgroundImage: 'linear-gradient(90deg, var(--color-grey-100) 0px, var(--color-grey-50) 40px, var(--color-grey-100) 80px)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite linear'
      }}
    >
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default Skeleton;
