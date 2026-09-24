import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Modal } from './Modal';

export const AddSubscriptionModal = ({ isOpen, onClose }) => {
  const { addSubscription } = useFinance();
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [category, setCategory] = useState('Entertainment');
  const [nextPayment, setNextPayment] = useState(() => {
    const d = new Date();
    // Default to tomorrow
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !cost || parseFloat(cost) <= 0) return;

    addSubscription({
      name,
      cost: parseFloat(cost),
      billingCycle,
      category,
      nextPayment
    });

    // Reset Form
    setName('');
    setCost('');
    setBillingCycle('monthly');
    setCategory('Entertainment');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Active Subscription">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Subscription Name *</label>
          <input
            type="text"
            placeholder="e.g. Netflix, Spotify, Internet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Cost (₹) *</label>
            <input
              type="number"
              placeholder="0.00"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              min="1"
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Billing Cycle</label>
            <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Next Payment Date</label>
            <input
              type="date"
              value={nextPayment}
              onChange={(e) => setNextPayment(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Register Subscription
          </button>
        </div>
      </form>
    </Modal>
  );
};
