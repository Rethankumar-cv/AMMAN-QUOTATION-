import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

// Typically you'd use a context provider for toasts, but this is the presentation component
const Toast = ({ message, type = 'info', visible, onClose, duration = 3000 }) => {
  
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  let Icon = Info;
  let bg = 'var(--color-grey-800)';
  
  if (type === 'success') {
    Icon = CheckCircle;
    bg = '#166534'; // Dark green
  } else if (type === 'error') {
    Icon = AlertCircle;
    bg = 'var(--color-error)';
  } else if (type === 'warning') {
    Icon = AlertCircle;
    bg = 'var(--color-orange-500)';
  }

  return (
    <div style={{
      position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
      backgroundColor: bg, color: 'white',
      padding: '12px 24px', borderRadius: 'var(--radius-lg)',
      display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: 'var(--shadow-md)', zIndex: 1100,
      minWidth: '280px', maxWidth: '90%'
    }}>
      <Icon size={20} />
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
        {message}
      </span>
    </div>
  );
};

export default Toast;
