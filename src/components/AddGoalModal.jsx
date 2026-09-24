import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Modal } from './Modal';

export const AddGoalModal = ({ isOpen, onClose, editingGoal }) => {
  const { addGoal, editGoal } = useFinance();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name || '');
      setTarget(editingGoal.target || '');
      setSaved(editingGoal.saved || '');
      setDeadline(editingGoal.deadline || '');
      setNotes(editingGoal.notes || '');
    } else {
      setName('');
      setTarget('');
      setSaved('');
      setDeadline('');
      setNotes('');
    }
  }, [editingGoal, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !target || parseFloat(target) <= 0) return;

    if (editingGoal) {
      editGoal(editingGoal.id, {
        name,
        target: parseFloat(target),
        saved: parseFloat(saved || 0),
        deadline,
        notes
      });
    } else {
      addGoal({
        name,
        target: parseFloat(target),
        saved: parseFloat(saved || 0),
        deadline,
        notes
      });
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Goal Name *</label>
          <input
            type="text"
            placeholder="e.g. New Laptop, Emergency Fund"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Amount (₹) *</label>
            <input
              type="number"
              placeholder="0.00"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
              min="1"
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Initial Saved (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={saved}
              onChange={(e) => setSaved(e.target.value)}
              min="0"
              disabled={!!editingGoal} // Direct balance edits can be locked or unlocked. Locking helps prevent logic slips.
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Notes (Optional)</label>
          <textarea
            placeholder="e.g. Save 10k monthly"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {editingGoal ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
