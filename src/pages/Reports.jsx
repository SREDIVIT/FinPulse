import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { FileText, Download, TrendingUp, Sparkles, AlertCircle, Calendar } from 'lucide-react';

export const Reports = () => {
  const { stats, transactions } = useFinance();

  const savingsRate = stats.income > 0 ? Math.round((stats.savings / stats.income) * 100) : 0;

  // Largest transaction
  const getLargestTransaction = () => {
    const augExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith('2026-08'));
    if (augExpenses.length === 0) return { description: 'None', amount: 0 };
    return augExpenses.reduce((max, t) => t.amount > max.amount ? t : max, { description: 'None', amount: 0 });
  };

  const largestTx = getLargestTransaction();

  // Top category
  const getTopCategory = () => {
    const augExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith('2026-08'));
    const groups = {};
    augExpenses.forEach(t => {
      groups[t.category] = (groups[t.category] || 0) + t.amount;
    });
    let top = 'None';
    let max = 0;
    Object.keys(groups).forEach(cat => {
      if (groups[cat] > max) {
        max = groups[cat];
        top = cat;
      }
    });
    return top;
  };

  const topCategory = getTopCategory();

  const handleExportPDF = () => {
    alert('Simulating PDF Report Compilation: Downloading finpulse_august_2026.pdf');
  };

  const handleExportCSV = () => {
    alert('Simulating CSV Ledger Compilation: Downloading finpulse_august_2026.csv');
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Document header action controls */}
      <div className="card flex-between" style={{ padding: '1.5rem 2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)'
          }}>
            <FileText size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>August 2026 Financial Report</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Platform compiled financial overview • Aug 01 - Aug 31, 2026</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
            <Download size={16} />
            Export CSV
          </button>
          <button onClick={handleExportPDF} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Report Body Layout */}
      <div className="report-layout" style={{
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr',
        gap: '1.75rem'
      }}>
        
        {/* Left Side: Summary and Statement details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Cash Flow Summary Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Cash Flow Statement</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="flex-between" style={{ paddingBottom: '0.65rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Income Inflows</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>+₹{stats.income.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex-between" style={{ paddingBottom: '0.65rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Expense Outflows</span>
                <span style={{ fontWeight: 700, color: 'var(--danger)' }}>-₹{stats.expense.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex-between" style={{ paddingBottom: '0.65rem', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>
                <span>Net Retained Savings</span>
                <span style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>₹{stats.savings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Monthly Savings Efficiency</span>
                <span style={{ fontWeight: 700 }}>{savingsRate}% Savings Rate</span>
              </div>
            </div>
          </div>

          {/* AI Narrative Analysis */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={18} color="var(--accent)" />
              Executive Financial Narrative
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p>
                During the August 2026 billing cycle, your cash flows remained exceptionally strong with a final **70% Savings Rate**. This is primary due to a stable single salary input of **₹50,000** and successful control of core utilities and internet budgets.
              </p>
              <p>
                However, discretionary spending volumes show minor warning trends. Your largest expense category was **{topCategory}**, mostly driven by Swiggy dinners and weekend outings. Additionally, a retail purchase at **{largestTx.description}** of **₹{largestTx.amount.toLocaleString('en-IN')}** represents the single largest outflow of the month.
              </p>
              <p>
                To maintain your goal progress, we recommend capping shopping items to ₹4,000 next month and reviewing active subscriptions.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Key Highlights panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Highlights Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>August Highlights</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Top Category</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>{topCategory}</span>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Largest Outflow</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger)' }}>
                  ₹{largestTx.amount.toLocaleString('en-IN')}{' '}
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>({largestTx.description})</span>
                </span>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Savings Rate</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>{savingsRate}% Rate</span>
              </div>
            </div>
          </div>

          {/* Historical Reports Catalog */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Past Reports</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['July 2026', 'June 2026', 'May 2026'].map((rep) => (
                <div key={rep} className="flex-between" style={{ padding: '0.5rem 0.25rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    {rep} Report
                  </span>
                  <button onClick={() => alert(`Simulated Download for ${rep} Report`)} style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .report-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Reports;
