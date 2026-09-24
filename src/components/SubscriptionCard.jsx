import React from 'react';
import { Calendar, Trash2, CreditCard, Sparkles } from 'lucide-react';

export const SubscriptionCard = ({ sub, onDelete }) => {
  const { id, name, cost, billingCycle, category, nextPayment, status } = sub;

  // Calculate annual cost
  const annualCost = billingCycle === 'monthly' ? cost * 12 : cost;

  // Determine if next payment is very soon (within 2 days)
  const isSoon = () => {
    const today = new Date('2026-08-09'); // Normalized current date from instructions
    const nextPayDate = new Date(nextPayment);
    const diffTime = nextPayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  };

  const paymentAlert = isSoon();

  return (
    <div className="card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      border: paymentAlert ? '1px solid var(--warning)' : '1px solid var(--border)',
      backgroundColor: paymentAlert ? 'rgba(245, 158, 11, 0.02)' : 'var(--bg-secondary)'
    }}>
      <div className="flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'flex',
            padding: '0.4rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: paymentAlert ? 'var(--warning-bg)' : 'var(--accent-light)',
            color: paymentAlert ? 'var(--warning)' : 'var(--accent)'
          }}>
            <CreditCard size={18} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{name}</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
              {category} • {billingCycle}
            </span>
          </div>
        </div>

        <button onClick={() => onDelete(id)} style={{ color: 'var(--text-tertiary)', padding: '0.25rem' }} title="Cancel Subscription Tracker">
          <Trash2 size={14} className="hover-danger" style={{ transition: 'color 0.2s' }} />
        </button>
      </div>

      <style>{`.hover-danger:hover { color: var(--danger) !important; }`}</style>

      <div className="flex-between" style={{ padding: '0.5rem 0', borderTop: '1px dashed var(--border)', borderBottom: '1px dashed var(--border)' }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Cost</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₹{cost.toLocaleString('en-IN')}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Yearly Cost</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            ₹{annualCost.toLocaleString('en-IN')}/yr
          </span>
        </div>
      </div>

      <div className="flex-between" style={{ fontSize: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: paymentAlert ? 'var(--warning)' : 'var(--text-secondary)', fontWeight: paymentAlert ? 600 : 400 }}>
          <Calendar size={14} />
          Next payment: {new Date(nextPayment).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span className={`badge ${status === 'active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
          {status}
        </span>
      </div>

      {paymentAlert && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.4rem 0.65rem',
          backgroundColor: 'var(--warning-bg)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.7rem',
          color: 'var(--warning)',
          fontWeight: 500
        }}>
          <Sparkles size={12} />
          Payment due tomorrow! Make sure balance is available.
        </div>
      )}
    </div>
  );
};
