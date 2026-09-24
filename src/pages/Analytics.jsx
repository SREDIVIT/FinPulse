import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Percent, Sparkles, Scale } from 'lucide-react';

const MONTHLY_COMPARISON = [
  { month: 'Apr 2026', Income: 45000, Expenses: 16500, Savings: 28500 },
  { month: 'May 2026', Income: 48000, Expenses: 19000, Savings: 29000 },
  { month: 'Jun 2026', Income: 50000, Expenses: 15500, Savings: 34500 },
  { month: 'Jul 2026', Income: 50000, Expenses: 15800, Savings: 34200 },
  { month: 'Aug 2026', Income: 50000, Expenses: 15000, Savings: 35000 }
];

const DAILY_VELOCITY = [
  { day: '01 Aug', spent: 100 },
  { day: '02 Aug', spent: 2000 },
  { day: '03 Aug', spent: 1550 },
  { day: '04 Aug', spent: 2950 },
  { day: '05 Aug', spent: 1719 },
  { day: '06 Aug', spent: 3032 },
  { day: '07 Aug', spent: 1271 },
  { day: '08 Aug', spent: 1000 },
  { day: '09 Aug', spent: 378 }
];

export const Analytics = () => {
  const { stats, transactions } = useFinance();

  // Dynamic calculations from context
  const averageDailySpend = Math.round(stats.expense / 9) || 0; // 9 days tracked so far in August 2026
  
  // Find highest spending category
  const getCategoryData = () => {
    const augExpenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith('2026-08'));
    const groups = {};
    augExpenses.forEach(t => {
      groups[t.category] = (groups[t.category] || 0) + t.amount;
    });
    return Object.keys(groups).map(name => ({
      name,
      value: groups[name]
    })).sort((a, b) => b.value - a.value);
  };

  const catData = getCategoryData();
  const highestCategory = catData[0]?.name || 'None';
  const highestAmount = catData[0]?.value || 0;

  const savingsRate = stats.income > 0 ? Math.round((stats.savings / stats.income) * 100) : 0;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Dynamic parameters quick cards */}
      <div className="grid-4">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', padding: '0.55rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Scale size={20} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Daily Velocity</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{averageDailySpend.toLocaleString('en-IN')}/day</span>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', padding: '0.55rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Top Category</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{highestCategory}</span>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', padding: '0.55rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <Percent size={20} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Savings Rate</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{savingsRate}%</span>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', padding: '0.55rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>MoM Flow</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>+12.5% Up</span>
          </div>
        </div>
      </div>

      {/* Primary comparative charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '1.75rem'
      }}>
        
        {/* Income vs Expenses Bar Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '380px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Income vs Expenses Comparison</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Month-over-month inflows vs outflows breakdown</span>
          </div>

          <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_COMPARISON} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.8rem' }} />
                <Bar dataKey="Income" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Spending Trend Line Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '380px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daily Spending Velocity</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>August daily expenditure line graph velocity</span>
          </div>

          <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DAILY_VELOCITY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Line type="monotone" dataKey="spent" stroke="var(--danger)" strokeWidth={3} dot={{ stroke: 'var(--danger)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Rate over time Area chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '350px', gridColumn: '1/-1' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Savings Rate Trend (%)</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Percentage of income retained month over month</span>
          </div>

          <div style={{ flex: 1, width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_COMPARISON.map(item => ({
                ...item,
                'Savings Rate': Math.round((item.Savings / item.Income) * 100)
              }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavingsRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Area type="monotone" dataKey="Savings Rate" stroke="var(--success)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavingsRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .grid-4 {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .grid-4 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Analytics;
