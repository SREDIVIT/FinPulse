import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { InsightCard } from '../components/InsightCard';
import { Lightbulb, TrendingUp, Sparkles, ShieldAlert, CreditCard, ShoppingBag } from 'lucide-react';

export const SmartInsights = () => {
  const { stats } = useFinance();

  const savingsRate = stats.income > 0 ? Math.round((stats.savings / stats.income) * 100) : 0;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Introduction Banner header */}
      <div className="card" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: 'var(--accent-light)',
        color: 'var(--accent)',
        border: '1px solid var(--border)'
      }}>
        <div style={{
          display: 'flex',
          padding: '0.65rem',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--accent)',
          flexShrink: 0
        }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>FinPulse Engine</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
            Analyzing transactions velocity, budget caps, and subscriptions to improve financial behaviors.
          </p>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="insights-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.75rem'
      }}>
        
        {/* Section 1: Spending Insights */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <ShoppingBag size={18} color="var(--danger)" />
            Spending Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <InsightCard
              title="⚠️ Food Delivery Spike"
              description="Food delivery (Swiggy/Zomato) spending is 22% higher than last month. Current spent is ₹4,200."
              severity="warning"
              actionText="Inspect Transactions"
              actionPath="/transactions"
            />
            <InsightCard
              title="Shopping Velocity"
              description="Your Shopping expenses represent 32% of total outflows, which is slightly above average."
              severity="info"
            />
          </div>
        </div>

        {/* Section 2: Budget Intelligence */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <ShieldAlert size={18} color="var(--warning)" />
            Budget Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <InsightCard
              title="🚨 Shopping Limit Exceeded"
              description="You have crossed your Shopping budget of ₹4,000 by ₹800 (120% used)."
              severity="danger"
              actionText="Adjust Limit"
              actionPath="/budgets"
            />
            <InsightCard
              title="⚠️ Food Budget Alert"
              description="Food budget is currently 84% filled (₹4,200 of ₹5,000 limit). Remaining: ₹800."
              severity="warning"
              actionText="View Budgets"
              actionPath="/budgets"
            />
          </div>
        </div>

        {/* Section 3: Savings Opportunities */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <TrendingUp size={18} color="var(--success)" />
            Savings Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <InsightCard
              title="💡 Cut Back Entertainment"
              description="Reducing cinema and movie outings by ₹1,000 could speed up your Laptop savings goal target by 1 month."
              severity="info"
              actionText="View Laptop Goal"
              actionPath="/savings-goals"
            />
            <InsightCard
              title="Current Savings Rate"
              description={`Your savings rate is ${savingsRate}%. Saving ₹${stats.savings.toLocaleString('en-IN')} of your income is higher than 85% of peers.`}
              severity="success"
            />
          </div>
        </div>

        {/* Section 4: Subscription Analytics */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <CreditCard size={18} color="var(--accent)" />
            Subscription Insights
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <InsightCard
              title="Annual Subscriptions Projection"
              description="You spend approximately ₹22,764/year on subscriptions. Netflix (₹649/mo) makes up 34% of this total."
              severity="info"
              actionText="Review Subscriptions"
              actionPath="/subscriptions"
            />
            <InsightCard
              title="Upcoming Renewals Checklist"
              description="Netflix renewal charge of ₹649 is due tomorrow. Balance check is confirmed."
              severity="info"
            />
          </div>
        </div>

      </div>

      {/* MoM Success and Room for Improvements section split */}
      <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
        
        {/* Strengths Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ color: 'var(--success)', fontWeight: 700 }}>🟢 Strengths (Positive Trends)</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li>Strong savings rate of 70% reached this month.</li>
            <li>Consistent income inflow (₹50,000 salary) cleared.</li>
            <li>Excellent utility bills budget discipline (only 58% limit used).</li>
          </ul>
        </div>

        {/* Areas to Improve Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ color: 'var(--warning)', fontWeight: 700 }}>🟡 Areas to Improve</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li>Food delivery spending shows a steep upward slope (+22% spike).</li>
            <li>Shopping budget exceeded by 20% due to Amazon retail purchases.</li>
            <li>Annual subscription projection totals ₹22,764. Look for overlapping video/music plan services.</li>
          </ul>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .insights-grid {
            grid-template-columns: 1fr !important;
          }
          .insights-grid + div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default SmartInsights;
