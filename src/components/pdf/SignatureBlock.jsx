import React, { useState } from 'react';

const SignatureBlock = ({ companyName, authorizedSignatory, hideCompanyLabel }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      {!hideCompanyLabel && (
        <div style={{ color: '#F39200', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
          FOR {companyName || 'AMMAN EARTH MOVERS'}
        </div>
      )}
      
      {!imageError ? (
        <div style={{ minHeight: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '12px' }}>
          <img 
            src="/assets/signature.png" 
            alt="Signature" 
            onError={() => setImageError(true)}
            style={{ width: '100px', height: 'auto', objectFit: 'contain' }} 
          />
        </div>
      ) : (
        <div style={{ minHeight: '50px', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
          <span style={{ color: 'transparent' }}>Fallback spacing</span>
        </div>
      )}

      <div style={{ width: '60%', minWidth: '150px', borderBottom: '1px solid #000', marginBottom: '8px' }}></div>
      <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {authorizedSignatory || 'Authorized Signatory'}
      </div>
    </div>
  );
};

export default SignatureBlock;
