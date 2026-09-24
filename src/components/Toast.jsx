import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useFinance();

  return (
    <div style={{
      position: 'fixed',
      top: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      width: 'calc(100% - 3rem)'
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast }) => {
  const { id, message, type } = toast;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color="var(--success)" />;
      case 'warning':
        return <AlertTriangle size={20} color="var(--warning)" />;
      case 'danger':
        return <XCircle size={20} color="var(--danger)" />;
      default:
        return <Info size={20} color="var(--accent)" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'var(--success)';
      case 'warning': return 'var(--warning)';
      case 'danger': return 'var(--danger)';
      default: return 'var(--accent)';
    }
  };

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: 'var(--bg-secondary)',
      borderLeft: `4px solid ${getBorderColor()}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid var(--border)',
      borderLeftWidth: '4px'
    }}>
      <div style={{ display: 'flex', flexShrink: 0 }}>
        {getIcon()}
      </div>
      <p style={{
        fontSize: '0.9rem',
        fontWeight: 500,
        color: 'var(--text-primary)',
        margin: 0,
        flex: 1
      }}>
        {message}
      </p>
    </div>
  );
};
