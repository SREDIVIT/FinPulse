import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ title, value, change, isPositive, icon: Icon, color = 'var(--accent)' }) => {
  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="flex-between">
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <div style={{
          display: 'flex',
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: `${color}15`,
          color: color
        }}>
          <Icon size={20} />
        </div>
      </div>
      
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          {value}
        </h2>
      </div>

      {change && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: isPositive ? 'var(--success)' : 'var(--danger)',
            backgroundColor: isPositive ? 'var(--success-bg)' : 'var(--danger-bg)',
            padding: '0.15rem 0.4rem',
            borderRadius: 'var(--radius-sm)'
          }}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>from last month</span>
        </div>
      )}
    </div>
  );
};
