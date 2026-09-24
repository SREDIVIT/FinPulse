import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Wallet, AlertTriangle, Pencil, Trash2, CalendarDays, CheckCircle } from 'lucide-react';
import { AddBudgetModal } from '../components/AddBudgetModal';
import { Modal } from '../components/Modal';

export const Budgets = () => {
  const { budgets, transactions, deleteBudget, editBudget } = useFinance();
  const [createOpen, setCreateOpen] = useState(false);

  // Edit states
  const [editingBudget, setEditingBudget] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  const [editThreshold, setEditThreshold] = useState('');

  // Total calculations dynamically
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  
  const getSpentForCategory = (category) => {
    return transactions
      .filter(t => t.category.toLowerCase() === category.toLowerCase() && t.type === 'expense' && t.date.startsWith('2026-08'))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const totalSpent = budgets.reduce((sum, b) => sum + getSpentForCategory(b.category), 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);

  const getStatus = (spent, limit) => {
    const pct = (spent / limit) * 100;
    if (pct >= 100) return { label: 'Exceeded', color: 'var(--danger)', badgeClass: 'badge-danger' };
    if (pct >= 80) return { label: 'Approaching', color: 'var(--warning)', badgeClass: 'badge-warning' };
    return { label: 'Healthy', color: 'var(--success)', badgeClass: 'badge-success' };
  };

  const handleEditClick = (b) => {
    setEditingBudget(b);
    setEditLimit(b.limit);
    setEditThreshold(b.threshold || 80);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editLimit || parseFloat(editLimit) <= 0) return;

    editBudget(editingBudget.id, {
      limit: parseFloat(editLimit),
      threshold: parseInt(editThreshold)
    });
    setEditingBudget(null);
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Overview Stat Panel */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Total Monthly Limit</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>₹{totalLimit.toLocaleString('en-IN')}</h2>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Total Spent</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)' }}>₹{totalSpent.toLocaleString('en-IN')}</h2>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Total Remaining</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>₹{totalRemaining.toLocaleString('en-IN')}</h2>
        </div>
      </div>

      {/* Main Budget Grid Section */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="flex-between">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Category Budgets</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Monitor your spending ceilings by vertical category</p>
          </div>
          <button onClick={() => setCreateOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
            <Plus size={16} />
            Create Budget
          </button>
        </div>

        {/* Budgets mapping cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginTop: '0.5rem'
        }}>
          {budgets.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              No budgets found. Let's create one to stay discipline!
            </p>
          ) : (
            budgets.map((b) => {
              const spent = getSpentForCategory(b.category);
              const pct = Math.round((spent / b.limit) * 100);
              const status = getStatus(spent, b.limit);
              const remaining = Math.max(0, b.limit - spent);

              return (
                <div key={b.id} className="card" style={{
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {/* Category Header details */}
                  <div className="flex-between">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        display: 'flex',
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent)'
                      }}>
                        <Wallet size={16} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{b.category}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <button onClick={() => handleEditClick(b)} style={{ color: 'var(--text-secondary)', padding: '0.25rem' }} title="Edit Budget">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteBudget(b.id)} style={{ color: 'var(--danger)', padding: '0.25rem' }} title="Delete Budget">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Indicators */}
                  <div>
                    <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Spent: {pct}%</span>
                      <span className={`badge ${status.badgeClass}`} style={{ fontSize: '0.65rem' }}>
                        {status.label}
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: status.color,
                        borderRadius: '4px',
                        transition: 'width 0.4s'
                      }} />
                    </div>
                  </div>

                  {/* Bottom metrics split values */}
                  <div className="flex-between" style={{ fontSize: '0.8rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Spent</span>
                      <span style={{ fontWeight: 700, color: pct >= 100 ? 'var(--danger)' : 'var(--text-primary)' }}>₹{spent.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Limit</span>
                      <span style={{ fontWeight: 600 }}>₹{b.limit.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Remaining</span>
                      <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{remaining.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex-between" style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CalendarDays size={12} />
                      Until {new Date(b.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span>Threshold: {b.threshold}%</span>
                  </div>

                  {/* AI Prediction Warning check */}
                  {pct >= 80 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.35rem',
                      padding: '0.5rem 0.65rem',
                      backgroundColor: 'var(--warning-bg)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.7rem',
                      color: 'var(--warning)',
                      fontWeight: 500,
                      lineHeight: 1.3
                    }}>
                      <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>
                        {pct >= 100 
                          ? `Exceeded budget limit by ₹${(spent - b.limit).toLocaleString('en-IN')}!`
                          : `At your current velocity, you are expected to exceed this budget by ₹${Math.round(b.limit * 0.15).toLocaleString('en-IN')} by month end.`}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Budget Modal form */}
      <AddBudgetModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />

      {/* Edit Budget Modal popups */}
      {editingBudget && (
        <Modal isOpen={!!editingBudget} onClose={() => setEditingBudget(null)} title={`Edit ${editingBudget.category} Budget`}>
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Budget Limit (₹)</label>
              <input
                type="number"
                value={editLimit}
                onChange={(e) => setEditLimit(e.target.value)}
                required
                min="1"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div className="flex-between">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Alert Threshold (%)</label>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent)' }}>{editThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={editThreshold}
                onChange={(e) => setEditThreshold(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditingBudget(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default Budgets;
