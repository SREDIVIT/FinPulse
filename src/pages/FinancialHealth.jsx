import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { HeartPulse, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';

export const FinancialHealth = () => {
  const { stats } = useFinance();

  const score = 78;

  const parameters = [
    { label: 'Budget Discipline', val: 82, desc: 'Adherence to set category spending limits.', status: 'Strong' },
    { label: 'Savings Rate', val: 75, desc: 'Percentage of income allocated to savings goals.', status: 'Strong' },
    { label: 'Spending Control', val: 79, desc: 'Velocity of discretionary expenses transactions.', status: 'Good' },
    { label: 'Subscription Management', val: 68, desc: 'Recurring yearly commitments control.', status: 'Average' },
    { label: 'Expense Consistency', val: 86, desc: 'Month-over-month expenses volatility check.', status: 'Excellent' }
  ];

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Radial score banner layout */}
      <div className="card grid-3" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'center' }}>
        {/* Left Side Score Indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
          <div style={{
            position: 'relative',
            width: '160px',
            height: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg height="160" width="160" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
              <circle stroke="var(--bg-tertiary)" fill="transparent" strokeWidth="10" r="65" cx="80" cy="80" />
              <circle stroke="var(--success)" fill="transparent" strokeWidth="10" strokeDasharray={`${2 * Math.PI * 65}`} style={{ strokeDashoffset: `${2 * Math.PI * 65 * (1 - score / 100)}` }} r="65" cx="80" cy="80" strokeLinecap="round" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{score}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>HEALTH SCORE</span>
            </div>
          </div>
          <span className="badge badge-success" style={{ padding: '0.35rem 1rem', fontSize: '0.85rem' }}>
            🟢 Good Standing
          </span>
        </div>

        {/* Right Side Analysis Statement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
            <ShieldCheck size={24} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>You are in a healthy financial standing!</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Your financial health score is calculated dynamically based on your budget discipline, savings velocity, and subscription management. With a score of <strong>78/100</strong>, you perform better than 79% of users with similar income levels. Maintaining this trajectory will help you secure your emergency funds and laptop targets ahead of schedule.
          </p>
          <div style={{
            padding: '0.65rem 0.85rem',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 500
          }}>
            🎯 <strong>Target Check:</strong> If you trim subscription spending by ₹4,500/year, your health score will rise to <strong>82/100 (Excellent)</strong>.
          </div>
        </div>
      </div>

      {/* Breakdown list parameters */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Health Index Parameters</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {parameters.map((param) => (
            <div key={param.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{param.label}</span>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{param.desc}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>{param.status}</span>
                  <span style={{ fontWeight: 800 }}>{param.val} / 100</span>
                </div>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${param.val}%`, backgroundColor: 'var(--success)', borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths vs Room for Improvement details */}
      <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
        {/* Strengths */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={18} />
            Key Strengths
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Strong savings rate (75/100)</strong>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>You regularly save 70% of your earnings, which builds wealth rapidly.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Consistent income flows (86/100)</strong>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>Salary is deposited consistently at the start of the month, minimizing credit risk.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Good budget control (82/100)</strong>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>Utilities and travel budgets are well below thresholds.</p>
            </div>
          </div>
        </div>

        {/* Areas to Improve */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ color: 'var(--warning)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertTriangle size={18} />
            Areas to Improve
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Subscription spending (68/100)</strong>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>Annual subscription commitment totals ₹22,764. Evaluate Netflix/Spotify usage.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Shopping expenses (79/100)</strong>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>Discretionary retail orders frequently exceed allocations.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Discretionary food outings (82/100)</strong>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>Food delivery shows a 22% month-over-month spike.</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
export default FinancialHealth;
