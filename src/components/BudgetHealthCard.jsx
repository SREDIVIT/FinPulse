import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ChevronRight, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export const BudgetHealthCard = ({ budgets = [], transactions = [] }) => {
  const navigate = useNavigate();

  const getStatus = (spent, limit) => {
    const pct = (spent / limit) * 100;
    if (pct >= 100) return { label: 'Exceeded', color: 'var(--danger)', icon: AlertCircle, badgeClass: 'badge-danger' };
    if (pct >= 80) return { label: 'Approaching Limit', color: 'var(--warning)', icon: AlertTriangle, badgeClass: 'badge-warning' };
    return { label: 'Healthy', color: 'var(--success)', icon: CheckCircle, badgeClass: 'badge-success' };
  };

  // Helper to calculate total spent per category in Aug 2026
  const getSpentForCategory = (category) => {
    return transactions
      .filter(t => t.category.toLowerCase() === category.toLowerCase() && t.type === 'expense' && t.date.startsWith('2026-08'))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const activeBudgets = budgets.slice(0, 3); // Top 3 on dashboard

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="flex-between">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Wallet size={20} color="var(--accent)" />
          Budget Intelligence
        </h3>
        <button
          onClick={() => navigate('/budgets')}
          style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center' }}
        >
          Manage
          <ChevronRight size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activeBudgets.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>No active budgets defined.</p>
        ) : (
          activeBudgets.map((b) => {
            const spent = getSpentForCategory(b.category);
            const pct = Math.min(120, Math.round((spent / b.limit) * 100));
            const status = getStatus(spent, b.limit);
            const StatusIcon = status.icon;

            return (
              <div key={b.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div className="flex-between">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.category}</span>
                    <span className={`badge ${status.badgeClass}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                      {status.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    ₹{spent.toLocaleString('en-IN')} / <span style={{ color: 'var(--text-tertiary)' }}>₹{b.limit.toLocaleString('en-IN')}</span>
                  </span>
                </div>

                <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, pct)}%`,
                    backgroundColor: status.color,
                    borderRadius: '3px',
                    transition: 'width 0.4s'
                  }} />
                </div>

                {pct >= 80 && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem', marginTop: '0.15rem' }}>
                    <StatusIcon size={12} color={status.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.7rem', color: status.color, fontWeight: 500 }}>
                      {pct >= 100 
                        ? `Exceeded limit by ₹${(spent - b.limit).toLocaleString('en-IN')}!`
                        : `At your current spending rate, you may exceed this budget by ₹${Math.round(b.limit * 0.15).toLocaleString('en-IN')}.`}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
