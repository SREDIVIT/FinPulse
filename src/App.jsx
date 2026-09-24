import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { QuickActionBtn } from './components/QuickActionBtn';
import { ToastContainer } from './components/Toast';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import SavingsGoals from './pages/SavingsGoals';
import Subscriptions from './pages/Subscriptions';
import Analytics from './pages/Analytics';
import SmartInsights from './pages/SmartInsights';
import FinancialHealth from './pages/FinancialHealth';
import Forecast from './pages/Forecast';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Layout wrapper for authenticated sessions
const ProtectedLayout = ({ children }) => {
  const { user } = useFinance();

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main viewport panels */}
      <main className="main-content">
        <Navbar />
        {children}
      </main>

      {/* FAB actions dropdown */}
      <QuickActionBtn />
    </div>
  );
};

// Route matching configurations
const AppRoutes = () => {
  const { user } = useFinance();

  return (
    <Routes>
      {/* Public pages */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/dashboard" replace /> : <Signup />} 
      />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/transactions" element={<ProtectedLayout><Transactions /></ProtectedLayout>} />
      <Route path="/budgets" element={<ProtectedLayout><Budgets /></ProtectedLayout>} />
      <Route path="/savings-goals" element={<ProtectedLayout><SavingsGoals /></ProtectedLayout>} />
      <Route path="/subscriptions" element={<ProtectedLayout><Subscriptions /></ProtectedLayout>} />
      <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
      <Route path="/smart-insights" element={<ProtectedLayout><SmartInsights /></ProtectedLayout>} />
      <Route path="/financial-health" element={<ProtectedLayout><FinancialHealth /></ProtectedLayout>} />
      <Route path="/spending-forecast" element={<ProtectedLayout><Forecast /></ProtectedLayout>} />
      <Route path="/reports" element={<ProtectedLayout><Reports /></ProtectedLayout>} />
      <Route path="/notifications" element={<ProtectedLayout><Notifications /></ProtectedLayout>} />
      <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
      <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />

      {/* Fallback routes */}
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </FinanceProvider>
  );
}
