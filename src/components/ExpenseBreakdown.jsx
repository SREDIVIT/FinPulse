import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { Receipt, X } from 'lucide-react';

const COLORS = [
  '#6366f1', // Food - Indigo
  '#06b6d4', // Transport - Cyan
  '#ec4899', // Shopping - Pink
  '#f59e0b', // Bills - Amber
  '#10b981', // Entertainment - Emerald
  '#8b5cf6', // Healthcare - Violet
  '#3b82f6', // Education - Blue
  '#64748b'  // Other - Slate
];

export const ExpenseBreakdown = () => {
  const { transactions } = useFinance();
  const [activeCategory, setActiveCategory] = useState(null);

  // Group transactions for Aug 2026 by category
  const getCategoryData = () => {
    const augExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith('2026-08'));
    const groups = {};
    
    augExpenses.forEach(t => {
      const cat = t.category || 'Other';
      groups[cat] = (groups[cat] || 0) + t.amount;
    });

    return Object.keys(groups).map((name, idx) => ({
      name,
      value: groups[name],
      color: COLORS[idx % COLORS.length]
    })).sort((a, b) => b.value - a.value);
  };

  const data = getCategoryData();
  const totalExpense = data.reduce((sum, item) => sum + item.value, 0);

  // Filter transactions for clicked category
  const getCategoryTransactions = () => {
    if (!activeCategory) return [];
    return transactions.filter(t => 
      t.type === 'expense' && 
      t.category.toLowerCase() === activeCategory.toLowerCase() && 
      t.date.startsWith('2026-08')
    );
  };

  const categoryTxs = getCategoryTransactions();

  const handleSliceClick = (data, index) => {
    const cat = data.name;
    setActiveCategory(activeCategory === cat ? null : cat);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '380px' }}>
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Expense Breakdown</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Click a category slice to inspect related transactions</p>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '1rem', alignItems: 'center' }}>
        {/* Pie Donut Chart */}
        <div style={{ position: 'relative', width: '100%', height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                onClick={handleSliceClick}
                cursor="pointer"
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.color}
                    stroke={activeCategory === entry.name ? 'var(--text-primary)' : 'transparent'}
                    strokeWidth={2}
                    style={{
                      outline: 'none',
                      opacity: activeCategory === null || activeCategory === entry.name ? 1 : 0.4,
                      transition: 'opacity 0.2s, stroke 0.2s'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Total Spent</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{totalExpense.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Legend List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
          {data.map((item) => {
            const percentage = Math.round((item.value / totalExpense) * 100) || 0;
            const isActive = activeCategory === item.name;
            return (
              <div
                key={item.name}
                onClick={() => setActiveCategory(isActive ? null : item.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.name}
                  </p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>₹{item.value.toLocaleString('en-IN')}</span>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Category Transactions list inside the Card */}
      {activeCategory && (
        <div className="animate-fade-in" style={{
          marginTop: '0.5rem',
          padding: '0.75rem',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Receipt size={14} color="var(--accent)" />
              Recent {activeCategory}
            </span>
            <button onClick={() => setActiveCategory(null)} style={{ color: 'var(--text-tertiary)', display: 'flex' }}>
              <X size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '120px', overflowY: 'auto' }}>
            {categoryTxs.length === 0 ? (
              <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>No transactions this month.</p>
            ) : (
              categoryTxs.map(tx => (
                <div key={tx.id} className="flex-between" style={{ fontSize: '0.75rem', padding: '0.2rem 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{tx.description}</span>
                  <span style={{ fontWeight: 600, color: 'var(--danger)' }}>-₹{tx.amount.toLocaleString('en-IN')}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
