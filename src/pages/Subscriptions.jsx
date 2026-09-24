import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, CreditCard, Sparkles, AlertTriangle, CalendarDays, CalendarCheck } from 'lucide-react';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { AddSubscriptionModal } from '../components/AddSubscriptionModal';

export const Subscriptions = () => {
  const { subscriptions, deleteSubscription } = useFinance();
  const [createOpen, setCreateOpen] = useState(false);

  // Dynamic calculations
  const totalMonthlyCost = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      return sum + (s.billingCycle === 'monthly' ? s.cost : s.cost / 12);
    }, 0);

  const totalYearlyCost = totalMonthlyCost * 12;

  // Find if any renewal is due tomorrow (August 10, 2026 based on normalized baseline August 9, 2026)
  const getRenewalsDueSoon = () => {
    const today = new Date('2026-08-09');
    return subscriptions.filter(s => {
      const nextPay = new Date(s.nextPayment);
      const diffTime = nextPay - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 2;
    });
  };

  const dueSoon = getRenewalsDueSoon();

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top billing metrics overview */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Cost</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>₹{totalMonthlyCost.toLocaleString('en-IN')}<span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/mo</span></h2>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Annual Projections</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)' }}>₹{totalYearlyCost.toLocaleString('en-IN')}<span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/yr</span></h2>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Active Trackers</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{subscriptions.length} Services</h2>
        </div>
      </div>

      {/* Warning layout for renewals due */}
      {dueSoon.length > 0 && (
        <div className="card animate-fade-in" style={{
          border: '1px solid var(--warning)',
          backgroundColor: 'var(--warning-bg)',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            padding: '0.5rem',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--warning)'
          }}>
            <AlertTriangle size={24} />
          </div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Upcoming Subscription Renewals</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              You have {dueSoon.length} subscriptions renewal due within 48 hours: {dueSoon.map(s => `"${s.name}" (₹${s.cost})`).join(', ')}.
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--warning)', border: '1px solid var(--warning)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)' }}>
            Due Tomorrow
          </span>
        </div>
      )}

      {/* Main active sub layout list */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="flex-between">
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Registered Services</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Monitor recurring subscription costs and cancel underutilized items</p>
          </div>
          <button onClick={() => setCreateOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
            <Plus size={16} />
            Add Subscription
          </button>
        </div>

        {/* Insight note box */}
        <div style={{
          backgroundColor: 'var(--accent-light)',
          color: 'var(--accent)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem',
          lineHeight: 1.4,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Sparkles size={16} style={{ flexShrink: 0 }} />
          <span>
            💡 <strong>Subscription Insight:</strong> You spend approximately <strong>₹{totalYearlyCost.toLocaleString('en-IN')}</strong> per year on subscriptions. Trimming down one recurring service could help reach your savings goals faster.
          </span>
        </div>

        {/* Cards mapping */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginTop: '0.5rem'
        }}>
          {subscriptions.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              No subscriptions registered. Create one to start tracking billing cycles.
            </p>
          ) : (
            subscriptions.map((s) => (
              <SubscriptionCard key={s.id} sub={s} onDelete={deleteSubscription} />
            ))
          )}
        </div>
      </div>

      {/* Subscription creation Modal */}
      <AddSubscriptionModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
};
export default Subscriptions;
