import React from 'react';

const Button = ({ children, variant = 'primary', className = '', style = {}, ...props }) => {
  // variants: 'primary', 'outline', 'text'
  const baseClass = `btn btn-${variant} ${className}`;
  
  return (
    <button className={baseClass} style={style} {...props}>
      {children}
    </button>
  );
};

export default Button;
