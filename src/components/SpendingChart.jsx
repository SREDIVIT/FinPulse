import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from 'lucide-react';

const WEEKLY_DATA = [
  { name: 'Week 1', Income: 12500, Expenses: 3500, Savings: 9000 },
  { name: 'Week 2', Income: 12500, Expenses: 4200, Savings: 8300 },
  { name: 'Week 3', Income: 12500, Expenses: 3800, Savings: 8700 },
  { name: 'Week 4', Income: 12500, Expenses: 3500, Savings: 9000 }
];

const MONTHLY_DATA = [
  { name: 'Mar 2026', Income: 45000, Expenses: 18000, Savings: 27000 },
  { name: 'Apr 2026', Income: 45000, Expenses: 16500, Savings: 28500 },
  { name: 'May 2026', Income: 48000, Expenses: 19000, Savings: 29000 },
  { name: 'Jun 2026', Income: 50000, Expenses: 15500, Savings: 34500 },
  { name: 'Jul 2026', Income: 50000, Expenses: 15800, Savings: 34200 },
  { name: 'Aug 2026', Income: 50000, Expenses: 15000, Savings: 35000 }
];

const YEARLY_DATA = [
  { name: '2023', Income: 480000, Expenses: 220000, Savings: 260000 },
  { name: '2024', Income: 540000, Expenses: 210000, Savings: 330000 },
  { name: '2025', Income: 580000, Expenses: 195000, Savings: 385000 }
];

export const SpendingChart = ({ initialData }) => {
  const [range, setRange] = useState('monthly'); // weekly | monthly | yearly

  const getData = () => {
    switch (range) {
      case 'weekly': return WEEKLY_DATA;
      case 'yearly': return YEARLY_DATA;
      default: return initialData || MONTHLY_DATA;
    }
  };

  const currentData = getData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--card-shadow)',
          fontSize: '0.8rem'
        }}>
          <p style={{ fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>{label}</p>
          {payload.map((pld) => (
            <p key={pld.name} style={{ color: pld.color, margin: '0.15rem 0', fontWeight: 600 }}>
              {pld.name}: ₹{pld.value.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      <div className="flex-between">
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Income vs Expenses vs Savings</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Visualizing monthly cash flow allocations</span>
        </div>
        
        {/* Toggle Controls */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          padding: '0.2rem',
          border: '1px solid var(--border)'
        }}>
          {['weekly', 'monthly', 'yearly'].map((mode) => (
            <button
              key={mode}
              onClick={() => setRange(mode)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                color: range === mode ? '#ffffff' : 'var(--text-secondary)',
                backgroundColor: range === mode ? 'var(--accent)' : 'transparent',
                transition: 'all 0.2s'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--success)" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="name"
              stroke="var(--text-tertiary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value / 1000}k`}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '0.8rem', fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="Income"
              stroke="var(--accent)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="Expenses"
              stroke="var(--danger)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
            <Area
              type="monotone"
              dataKey="Savings"
              stroke="var(--success)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSavings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
