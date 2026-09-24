import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, ChevronRight } from 'lucide-react';

export const FinancialHealthCard = ({ score = 78, breakdown }) => {
  const navigate = useNavigate();
  
  // Calculate SVG circular parameters
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const defaultBreakdown = breakdown || [
    { label: 'Budget Discipline', val: 82 },
    { label: 'Savings Rate', val: 75 },
    { label: 'Spending Control', val: 79 },
    { label: 'Subscription Management', val: 68 },
    { label: 'Expense Consistency', val: 86 }
  ];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="flex-between">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <HeartPulse size={20} color="var(--success)" />
          Financial Health
        </h3>
        <span className="badge badge-success">
          🟢 Good
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'center', padding: '0.5rem 0' }}>
        {/* SVG Radial Arc Score Meter */}
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <svg height="120" width="120" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              stroke="var(--bg-tertiary)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx="60"
              cy="60"
            />
            <circle
              stroke="var(--success)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
              r={normalizedRadius}
              cx="60"
              cy="60"
              strokeLinecap="round"
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{score}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>OF 100</span>
          </div>
        </div>

        {/* Quick Parameters summary */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {defaultBreakdown.slice(0, 3).map((item) => (
            <div key={item.label}>
              <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.val}</span>
              </div>
              <div style={{ height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.val}%`, backgroundColor: 'var(--success)', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate('/financial-health')}
        className="btn btn-secondary"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem',
          fontSize: '0.85rem',
          padding: '0.6rem'
        }}
      >
        View Financial Health
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
