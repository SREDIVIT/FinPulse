import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Modal } from './Modal';

export const AddExpenseModal = ({ isOpen, onClose }) => {
  const { addExpense } = useFinance();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || parseFloat(amount) <= 0) return;

    addExpense({
      description,
      amount: parseFloat(amount),
      category,
      date,
      paymentMethod,
      notes,
      isRecurring
    });

    // Reset Form
    setDescription('');
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('UPI');
    setNotes('');
    setIsRecurring(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Expense">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Expense Name *</label>
          <input
            type="text"
            placeholder="Swiggy, Uber, Rent, etc."
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

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
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
            id="recurring-expense"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            style={{ width: 'auto', cursor: 'pointer' }}
          />
          <label htmlFor="recurring-expense" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            Is this a recurring subscription/bill?
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Add Expense
          </button>
        </div>
      </form>
    </Modal>
  );
};
