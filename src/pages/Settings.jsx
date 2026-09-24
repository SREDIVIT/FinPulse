import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, Shield, LogOut, Check } from 'lucide-react';

export const Settings = () => {
  const { darkMode, setDarkMode, profile, setProfile, logout, triggerToast, updatePassword } = useFinance();
  const navigate = useNavigate();

  // Notification states
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [spendingAlerts, setSpendingAlerts] = useState(true);
  const [subReminders, setSubReminders] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(true);

  // Security password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      triggerToast('All password fields are required!', 'danger');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('New passwords do not match!', 'danger');
      return;
    }
    if (newPassword.length < 6) {
      triggerToast('Password must be at least 6 characters!', 'danger');
      return;
    }

    const success = updatePassword(oldPassword, newPassword);
    if (success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleCurrencyChange = (e) => {
    setProfile(prev => ({ ...prev, currency: e.target.value }));
    triggerToast(`Default currency changed to ${e.target.value}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. Appearance selection */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Sun size={18} color="var(--accent)" />
          Appearance Settings
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>Configure the default dark or light system layout theme.</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => setDarkMode(false)}
            className="btn btn-secondary"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderColor: !darkMode ? 'var(--accent)' : 'var(--border)',
              backgroundColor: !darkMode ? 'var(--accent-light)' : 'var(--bg-secondary)',
              color: !darkMode ? 'var(--accent)' : 'var(--text-primary)'
            }}
          >
            <Sun size={16} />
            Light Mode
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className="btn btn-secondary"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              borderColor: darkMode ? 'var(--accent)' : 'var(--border)',
              backgroundColor: darkMode ? 'var(--accent-light)' : 'var(--bg-secondary)',
              color: darkMode ? 'var(--accent)' : 'var(--text-primary)'
            }}
          >
            <Moon size={16} />
            Dark Mode
          </button>
        </div>
      </div>

      {/* 2. Currency selection */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem' }}>Currency Configuration</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>Change display currency symbols dynamically.</p>
        
        <select
          value={profile.currency}
          onChange={handleCurrencyChange}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          <option value="INR">Indian Rupee (₹)</option>
          <option value="USD">US Dollar ($)</option>
          <option value="EUR">Euro (€)</option>
          <option value="GBP">British Pound (£)</option>
        </select>
      </div>

      {/* 3. Notifications settings */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Bell size={18} color="var(--accent)" />
          Notification Alerts
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>Define custom alert boundaries for emails and system logs.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
          <div className="flex-between" style={{ fontSize: '0.9rem' }}>
            <span>Category Budget threshold alerts (80%)</span>
            <input type="checkbox" checked={budgetAlerts} onChange={(e) => setBudgetAlerts(e.target.checked)} style={{ cursor: 'pointer' }} />
          </div>
          <div className="flex-between" style={{ fontSize: '0.9rem' }}>
            <span>Discretionary spending velocity warnings</span>
            <input type="checkbox" checked={spendingAlerts} onChange={(e) => setSpendingAlerts(e.target.checked)} style={{ cursor: 'pointer' }} />
          </div>
          <div className="flex-between" style={{ fontSize: '0.9rem' }}>
            <span>Subscriptions upcoming bill renewal reminders</span>
            <input type="checkbox" checked={subReminders} onChange={(e) => setSubReminders(e.target.checked)} style={{ cursor: 'pointer' }} />
          </div>
          <div className="flex-between" style={{ fontSize: '0.9rem' }}>
            <span>Monthly compiled executive statements report notifications</span>
            <input type="checkbox" checked={monthlyReports} onChange={(e) => setMonthlyReports(e.target.checked)} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      {/* 4. Security change password */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
          <Shield size={18} color="var(--accent)" />
          Security Credentials
        </h3>
        
        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Current Password</label>
            <input type="password" placeholder="••••••••" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>New Password</label>
              <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Confirm New Password</label>
              <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem', fontWeight: 700 }}>
              Update Password
            </button>
            <button type="button" onClick={handleLogout} className="btn btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.65rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <LogOut size={16} />
              Logout Session
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
export default Settings;
