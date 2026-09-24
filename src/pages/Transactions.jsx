import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionTable } from '../components/TransactionTable';
import { Plus, Download, Sparkles, FileSpreadsheet } from 'lucide-react';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { AddIncomeModal } from '../components/AddIncomeModal';

export const Transactions = () => {
  const { stats } = useFinance();
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);

  const handleExportCSV = () => {
    alert('CSV Export Simulated: Downloading finpulse_transactions.csv');
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header metrics summary panel */}
      <div className="card flex-between" style={{ padding: '1.25rem 1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Available Balance</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{stats.balance.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ borderRight: '1px solid var(--border)', alignSelf: 'stretch' }} />
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Inflows</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>+₹{stats.income.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ borderRight: '1px solid var(--border)', alignSelf: 'stretch' }} />
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Outflows</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>-₹{stats.expense.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Button Set */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
            <FileSpreadsheet size={16} />
            Export CSV
          </button>
          <button onClick={() => setIncomeOpen(true)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.65rem 1rem', fontSize: '0.85rem', color: 'var(--success)', borderColor: 'var(--success)' }}>
            <Plus size={16} />
            Add Income
          </button>
          <button onClick={() => setExpenseOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
            <Plus size={16} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Main Table card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
        <div className="flex-between">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Transaction History</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>August 2026 ledger</span>
        </div>
        
        {/* Full transaction component table */}
        <TransactionTable />
      </div>

      {/* Form overlays */}
      <AddExpenseModal isOpen={expenseOpen} onClose={() => setExpenseOpen(false)} />
      <AddIncomeModal isOpen={incomeOpen} onClose={() => setIncomeOpen(false)} />
    </div>
  );
};
export default Transactions;
