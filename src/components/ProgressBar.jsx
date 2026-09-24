import React from 'react';

export const ProgressBar = ({ value, max = 100, color }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getBarColor = () => {
    if (color) return color;
    if (percentage >= 100) return 'var(--danger)';
    if (percentage >= 80) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        height: '8px',
        width: '100%',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '9999px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: getBarColor(),
          borderRadius: '9999px',
          transition: 'width 0.5s ease-out'
        }} />
      </div>
      <div className="flex-between" style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <span>{Math.round(percentage)}% filled</span>
        <span>{value.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} of {max.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</span>
      </div>
    </div>
  );
};
