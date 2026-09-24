import React from 'react';
import { AlertOctagon, Check, ShieldAlert } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const AnomalyCard = ({ anomaly }) => {
  const { resolveAnomaly } = useFinance();
  const { id, description, amount, category, date, confidence, message, resolved } = anomaly;

  if (resolved) return null;

  return (
    <div className="card animate-fade-in" style={{
      border: '1px solid var(--danger)',
      backgroundColor: 'rgba(239, 68, 68, 0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'var(--danger)',
        color: '#ffffff',
        fontSize: '0.6rem',
        fontWeight: 700,
        padding: '0.2rem 0.6rem',
        borderBottomLeftRadius: 'var(--radius-sm)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        display: 'flex',
        alignItems: 'center',
        gap: '0.2rem'
      }}>
        <ShieldAlert size={10} />
        Anomaly Alert
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
        <div style={{
          display: 'flex',
          padding: '0.5rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)'
        }}>
          <AlertOctagon size={20} />
        </div>
        <div>
          <h4 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>
            ₹{amount.toLocaleString('en-IN')}
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {description} • {category}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
          "{message}"
        </p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          Transaction Date: {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <div className="flex-between" style={{
        marginTop: '0.25rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Confidence</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--danger)' }}>{confidence}% Score</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => resolveAnomaly(id, false)}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
          >
            Dismiss
          </button>
          <button
            onClick={() => resolveAnomaly(id, true)}
            className="btn btn-primary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.75rem',
              backgroundColor: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Check size={12} />
            Mark as Normal
          </button>
        </div>
      </div>
    </div>
  );
};
