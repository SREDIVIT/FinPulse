import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Modal } from './Modal';

export const AddIncomeModal = ({ isOpen, onClose }) => {
  const { addIncome } = useFinance();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || parseFloat(amount) <= 0) return;

    addIncome({
      description,
      amount: parseFloat(amount),
      category,
      date,
      paymentMethod: 'Bank Transfer', // Default for income
      notes,
      isRecurring
    });

    // Reset Form
    setDescription('');
    setAmount('');
    setCategory('Salary');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsRecurring(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Income">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Income Source *</label>
          <input
            type="text"
            placeholder="Salary, Freelance Project, Dividend, etc."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount (₹) *</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="any"
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Notes (Optional)</label>
          <textarea
            placeholder="Add special notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
          <input
            type="checkbox"
            id="recurring-income"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            style={{ width: 'auto', cursor: 'pointer' }}
          />
          <label htmlFor="recurring-income" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            Is this a recurring monthly income?
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Add Income
          </button>
        </div>
      </form>
    </Modal>
  );
};
