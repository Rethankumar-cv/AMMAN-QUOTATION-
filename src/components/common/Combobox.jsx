import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

const Combobox = ({ label, name, value, onChange, onBlur, options, error, required, placeholder = "Search or enter custom..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(opt => {
    const optLabel = typeof opt === 'string' ? opt : opt.label;
    return optLabel.toLowerCase().includes(inputValue.toLowerCase());
  });

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
    if (onChange) {
      onChange({ target: { name, value: newValue } });
    }
  };

  const handleSelectOption = (opt) => {
    const optValue = typeof opt === 'string' ? opt : opt.value;
    const optLabel = typeof opt === 'string' ? opt : opt.label;
    
    setInputValue(optLabel);
    setIsOpen(false);
    
    if (onChange) {
      onChange({ target: { name, value: optValue } });
    }
    
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setSelectedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
        handleSelectOption(filteredOptions[selectedIndex]);
      } else {
        setIsOpen(false);
        if (inputRef.current) inputRef.current.blur();
      }
    }
  };

  return (
    <div className="form-group" ref={containerRef} style={{ position: 'relative' }}>
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-grey-400)', pointerEvents: 'none' }}>
          <Search size={18} />
        </div>
        
        <input 
          ref={inputRef}
          type="text"
          className={`form-input ${error ? 'error' : ''}`}
          style={{ paddingLeft: '44px', paddingRight: '44px' }}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={(e) => {
            if (onBlur) onBlur(e);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          name={name}
        />
        
        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-grey-400)', pointerEvents: 'none', transition: 'transform 0.2s', ...(isOpen ? { transform: 'translateY(-50%) rotate(180deg)' } : {}) }}>
          <ChevronDown size={18} />
        </div>
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid var(--border-default)',
          zIndex: 1000,
          maxHeight: '260px',
          overflowY: 'auto',
          animation: 'dropdownFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {filteredOptions.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: '8px', margin: 0 }}>
              {filteredOptions.map((opt, i) => {
                const optValue = typeof opt === 'string' ? opt : opt.value;
                const optLabel = typeof opt === 'string' ? opt : opt.label;
                const isSelected = value === optValue || inputValue === optLabel;
                const isHovered = selectedIndex === i;
                
                return (
                  <li 
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isSelected ? 'var(--color-orange-50)' : isHovered ? 'var(--color-grey-50)' : 'transparent',
                      color: isSelected ? 'var(--color-orange-600)' : 'var(--text-primary)',
                      fontWeight: isSelected ? '600' : '500',
                      fontSize: '15px',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                    onMouseLeave={() => setSelectedIndex(-1)}
                  >
                    {optLabel}
                    {isSelected && <Check size={16} />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '500' }}>Custom Equipment</p>
              <p style={{ margin: 0, fontSize: '13px' }}>Press Enter to use "{inputValue}"</p>
            </div>
          )}
        </div>
      )}
      
      {error && <span className="error-text" style={{ color: 'var(--color-error)', fontSize: '13px', marginTop: '4px' }}>{error}</span>}
      
      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Combobox;
