import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      zIndex: 1000
    }} onClick={onClose}>
      <div className="card animate-fade-in" style={{
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '1.75rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)'
      }} onClick={(e) => e.stopPropagation()}>
        <div className="flex-between">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{
            display: 'flex',
            padding: '0.25rem',
            borderRadius: '50%',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-tertiary)',
            transition: 'all 0.2s'
          }} className="btn-secondary">
            <X size={18} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};
