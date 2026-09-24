import React, { useState, useRef, useEffect } from 'react';
import { Plus, ArrowLeftRight, Wallet, Target, CreditCard, Sparkles, X } from 'lucide-react';
import { AddExpenseModal } from './AddExpenseModal';
import { AddIncomeModal } from './AddIncomeModal';
import { AddBudgetModal } from './AddBudgetModal';
import { AddGoalModal } from './AddGoalModal';
import { AddSubscriptionModal } from './AddSubscriptionModal';

export const QuickActionBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'expense' | 'income' | 'budget' | 'goal' | 'subscription'
  const menuRef = useRef(null);

  // Close dropdown on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const options = [
    { key: 'expense', name: 'Add Expense', icon: ArrowLeftRight, color: 'var(--danger)' },
    { key: 'income', name: 'Add Income', icon: Sparkles, color: 'var(--success)' },
    { key: 'budget', name: 'Add Budget', icon: Wallet, color: 'var(--accent)' },
    { key: 'goal', name: 'Add Savings Goal', icon: Target, color: '#ec4899' },
    { key: 'subscription', name: 'Add Subscription', icon: CreditCard, color: '#8b5cf6' }
  ];

  return (
    <div ref={menuRef} style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 999
    }}>
      {/* Dropdown Options popover */}
      {isOpen && (
        <div className="animate-fade-in" style={{
          position: 'absolute',
          bottom: '4.5rem',
          right: 0,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          minWidth: '220px'
        }}>
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setActiveModal(opt.key);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s'
              }}
              className="quick-action-item"
            >
              <div style={{
                display: 'flex',
                padding: '0.35rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: `${opt.color}15`,
                color: opt.color
              }}>
                <opt.icon size={16} />
              </div>
              <span style={{ color: 'var(--text-primary)' }}>{opt.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Primary Floating Action Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.5)',
          transform: isOpen ? 'rotate(135deg)' : 'rotate(0deg)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        title="Quick actions"
      >
        <Plus size={28} />
      </button>

      {/* CSS Hover for items */}
      <style>{`
        .quick-action-item:hover {
          background-color: var(--bg-tertiary) !important;
          transform: translateX(-2px);
        }
      `}</style>

      {/* Form Modals */}
      <AddExpenseModal
        isOpen={activeModal === 'expense'}
        onClose={() => setActiveModal(null)}
      />
      <AddIncomeModal
        isOpen={activeModal === 'income'}
        onClose={() => setActiveModal(null)}
      />
      <AddBudgetModal
        isOpen={activeModal === 'budget'}
        onClose={() => setActiveModal(null)}
      />
      <AddGoalModal
        isOpen={activeModal === 'goal'}
        onClose={() => setActiveModal(null)}
      />
      <AddSubscriptionModal
        isOpen={activeModal === 'subscription'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
