import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Modal } from './Modal';

export const AddBudgetModal = ({ isOpen, onClose }) => {
  const { addBudget } = useFinance();
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    // End of current month
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
  });
  const [threshold, setThreshold] = useState(80);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!limit || parseFloat(limit) <= 0) return;

    addBudget({
      category,
      limit: parseFloat(limit),
      startDate,
      endDate,
      threshold: parseInt(threshold)
    });

    // Reset Form
    setCategory('Food');
    setLimit('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setThreshold(80);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Category Budget">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Budget Limit (₹) *</label>
          <input
            type="number"
            placeholder="e.g. 5000"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            required
            min="100"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div className="flex-between">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Alert Threshold (%)</label>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>{threshold}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="100"
            step="5"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            style={{ width: '100%', padding: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
            We'll notify you when spending in this category crosses {threshold}% of limit.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Create Budget
          </button>
        </div>
      </form>
    </Modal>
  );
};
