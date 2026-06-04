import React from 'react';

const Card = ({ children, className = '', style = {}, onClick }) => {
  return (
    <div 
      className={`card ${className}`} 
      style={{ ...style, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
