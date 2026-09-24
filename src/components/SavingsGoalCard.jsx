import React, { useState } from 'react';
import { Target, TrendingUp, Pencil, Trash2, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const SavingsGoalCard = ({ goal, onEdit, onDelete }) => {
  const { addMoneyToGoal } = useFinance();
  const [addAmount, setAddAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { id, name, target, saved, deadline, notes } = goal;
  const pct = Math.min(100, Math.round((saved / target) * 100));
  const remaining = Math.max(0, target - saved);

  const handleAddMoney = (e) => {
    e.preventDefault();
    const val = parseFloat(addAmount);
    if (!isNaN(val) && val > 0) {
      addMoneyToGoal(id, val);
      setAddAmount('');
      setIsAdding(false);
    }
  };

  return (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'flex',
            padding: '0.4rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)'
          }}>
            <Target size={18} />
          </div>
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>{name}</h4>
            {notes && <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{notes}</span>}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button onClick={() => onEdit(goal)} style={{ color: 'var(--text-secondary)', padding: '0.25rem' }} title="Edit Goal">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(id)} style={{ color: 'var(--danger)', padding: '0.25rem' }} title="Delete Goal">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div style={{ margin: '0.25rem 0' }}>
        <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Progress</span>
          <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{pct}%</span>
        </div>
        <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: 'var(--accent)',
            borderRadius: '4px',
            transition: 'width 0.5s'
          }} />
        </div>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
        <div style={{ padding: '0.4rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Target</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>₹{target.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ padding: '0.4rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Saved</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>₹{saved.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ padding: '0.4rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Remaining</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger)' }}>₹{remaining.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {deadline && (
        <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          <span>Deadline: {new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          {pct < 100 && (
            <span style={{ fontWeight: 500, color: 'var(--success)' }}>
              Est. Complete: {Math.round(remaining / 5000) || 1} months
            </span>
          )}
        </div>
      )}

      {isAdding ? (
        <form onSubmit={handleAddMoney} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <input
            type="number"
            placeholder="Amount"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            required
            min="1"
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            Add
          </button>
          <button type="button" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }} onClick={() => setIsAdding(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-secondary"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            padding: '0.5rem',
            fontSize: '0.8rem',
            marginTop: '0.25rem'
          }}
        >
          <Plus size={14} />
          Add Money
        </button>
      )}
    </div>
  );
};
