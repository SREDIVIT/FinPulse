import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

const FORECAST_COMPARISON = [
  { name: 'July (Actual)', Income: 50000, Expenses: 15800, Savings: 34200 },
  { name: 'August (Current)', Income: 50000, Expenses: 15000, Savings: 35000 },
  { name: 'September (Predicted)', Income: 50000, Expenses: 19200, Savings: 30800 }
];

export const Forecast = () => {
  const { stats } = useFinance();

  const expectedIncome = 50000;
  const expectedExpenses = 19200;
  const expectedSavings = expectedIncome - expectedExpenses;
  const expectedSavingsRate = Math.round((expectedSavings / expectedIncome) * 100);

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* AI Warning block */}
      <div className="card" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        border: '1px solid var(--warning)',
        backgroundColor: 'var(--warning-bg)',
        color: 'var(--warning)'
      }}>
        <div style={{
          display: 'flex',
          padding: '0.65rem',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--warning)',
          flexShrink: 0
        }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Spending Forecast Alert</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Your projected savings may decrease by 8.4% next month due to upcoming annual renewals (Broadband) and expected shopping adjustments.
          </p>
        </div>
      </div>

      {/* Grid of projected parameters */}
      <div className="grid-4">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Projected Inflows</span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--success)' }}>₹{expectedIncome.toLocaleString('en-IN')}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Normal salary expectations</span>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Projected Outflows</span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--danger)' }}>₹{expectedExpenses.toLocaleString('en-IN')}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 500 }}>↑ ₹4,200 more expected</span>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Projected Savings</span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--info)' }}>₹{expectedSavings.toLocaleString('en-IN')}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Expected laptop buffer</span>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Projected Savings Rate</span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--accent)' }}>{expectedSavingsRate}%</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 500 }}>↓ 8.4% drop in efficiency</span>
        </div>
      </div>

      {/* Main comparative forecasts chart */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '400px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Projected Cash Flow Trajectory</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Comparing actuals (July, August) against predictive forecast model (September)</span>
        </div>

        <div style={{ flex: 1, width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FORECAST_COMPARISON} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.8rem' }} />
              <Bar dataKey="Income" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Savings" fill="var(--success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Explanation parameters box details */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '1rem' }}>
          <Sparkles size={18} color="var(--accent)" />
          How Predictions Work
        </h4>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 1.5 }}>
          <p>
            FinPulse uses a mock **discretionary expense velocity algorithm** to predict your spending for the upcoming month.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowRight size={14} color="var(--accent)" />
              <span><strong>Historical Baselines:</strong> Evaluation of your average grocery, food, and utility spend patterns.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowRight size={14} color="var(--accent)" />
              <span><strong>Billing Schedules:</strong> Parsing registered subscriptions next-payment dates and upcoming annual costs.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowRight size={14} color="var(--accent)" />
              <span><strong>Exceed Volatilities:</strong> Extrapolating the impact of budget limits exceeded (e.g. Shopping is at 120% this month).</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default Forecast;
