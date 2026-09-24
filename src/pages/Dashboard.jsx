import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { StatCard } from '../components/StatCard';
import { FinancialHealthCard } from '../components/FinancialHealthCard';
import { SpendingChart } from '../components/SpendingChart';
import { ExpenseBreakdown } from '../components/ExpenseBreakdown';
import { AnomalyCard } from '../components/AnomalyCard';
import { InsightCard } from '../components/InsightCard';
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { stats, anomalies } = useFinance();
  const navigate = useNavigate();

  // Active Unresolved Anomaly
  const activeAnomaly = anomalies.find(a => !a.resolved);

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 4 Financial Stat Cards Grid */}
      <div className="grid-4">
        <StatCard
          title="Total Balance"
          value={`₹${stats.balance.toLocaleString('en-IN')}`}
          change={null}
          isPositive={true}
          icon={Wallet}
          color="var(--accent)"
        />
        <StatCard
          title="Monthly Income"
          value={`₹${stats.income.toLocaleString('en-IN')}`}
          change="8.4%"
          isPositive={true}
          icon={ArrowUpRight}
          color="var(--success)"
        />
        <StatCard
          title="Monthly Expenses"
          value={`₹${stats.expense.toLocaleString('en-IN')}`}
          change="5.2%"
          isPositive={false}
          icon={ArrowDownRight}
          color="var(--danger)"
        />
        <StatCard
          title="Monthly Savings"
          value={`₹${stats.savings.toLocaleString('en-IN')}`}
          change="12.5%"
          isPositive={true}
          icon={TrendingUp}
          color="var(--info)"
        />
      </div>

      {/* Main Dashboard Layout splits into 2 Columns */}
      <div className="dashboard-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.7fr 1fr',
        gap: '1.75rem'
      }}>
        
        {/* LEFT COLUMN: Wide charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Anomaly Detection Banner */}
          {activeAnomaly && (
            <AnomalyCard anomaly={activeAnomaly} />
          )}

          {/* Interactive Spending Chart */}
          <SpendingChart />

        </div>

        {/* RIGHT COLUMN: Health gauges, category donuts, insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Radial score card */}
          <FinancialHealthCard />

          {/* Expense Breakdown Category Donut */}
          <ExpenseBreakdown />

          {/* Smart Insights summary lists */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Smart Insights</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <InsightCard
                title="Food Spending Increasing"
                description="Food expenses are 22% higher than last month. Consider reducing weekend delivery orders."
                severity="warning"
              />
              <InsightCard
                title="Savings Opportunity"
                description="Reducing entertainment expenses by ₹1,000 could increase your monthly savings rate to 72%."
                severity="info"
              />
            </div>
          </div>

        </div>

      </div>

      {/* Media styling overrides for grid layouts */}
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Dashboard;
