import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Target, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';
import { SavingsGoalCard } from '../components/SavingsGoalCard';
import { AddGoalModal } from '../components/AddGoalModal';

export const SavingsGoals = () => {
  const { goals, stats } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Totals calculations
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
  const totalRemaining = Math.max(0, totalTarget - totalSaved);
  const averagePct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Target Progression Summary Panel */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="flex-between">
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Savings Progression</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Combined progress across all savings verticals</p>
          </div>
          <button onClick={handleCreate} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
            <Plus size={16} />
            Add Goal
          </button>
        </div>

        <div className="grid-3" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <div className="flex-between" style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Savings Progress</span>
              <span style={{ color: 'var(--accent)' }}>{averagePct}% Achieved</span>
            </div>
            <div style={{ height: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${averagePct}%`,
                backgroundColor: 'var(--accent)',
                borderRadius: '5px',
                transition: 'width 0.5s'
              }} />
            </div>
          </div>

          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Target</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>₹{totalTarget.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Saved</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)' }}>₹{totalSaved.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Remaining</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--danger)' }}>₹{totalRemaining.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid List mapping Goal cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Active Goals</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {goals.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              No goals set yet! Start mapping out your dream purchases and funds.
            </p>
          ) : (
            goals.map((g) => (
              <SavingsGoalCard
                key={g.id}
                goal={g}
                onEdit={handleEdit}
                onDelete={(id) => { if (window.confirm('Delete this savings goal?')) { goals.filter(x => x.id !== id); } }} // Let Context handle deletion
              />
            ))
          )}
        </div>
      </div>

      {/* Goal Form Modal */}
      <AddGoalModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingGoal(null); }}
        editingGoal={editingGoal}
      />
    </div>
  );
};
export default SavingsGoals;
