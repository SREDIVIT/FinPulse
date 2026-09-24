import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Sun, Moon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const Navbar = ({ title }) => {
  const { profile, notifications, darkMode, setDarkMode } = useFinance();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Generate page titles depending on route if not explicitly passed
  const getPageTitle = () => {
    if (title) return title;
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    
    // Capitalize and format path
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const pageTitle = getPageTitle();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 2rem',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }} className="top-navbar-container">
      {/* Dynamic Title / Greeting */}
      <div>
        {pageTitle === 'Dashboard' ? (
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Good morning, {profile.name} 👋
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Here's how your money is doing this month.
            </p>
          </div>
        ) : (
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            {pageTitle}
          </h1>
        )}
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Month Selector (for dashboard mostly, but nice decorative for header) */}
        {pageTitle === 'Dashboard' && (
          <select style={{
            padding: '0.4rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border)'
          }}>
            <option>August 2026</option>
            <option>July 2026</option>
            <option>June 2026</option>
          </select>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            display: 'flex',
            padding: '0.5rem',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)'
          }}
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Icon Badge */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => navigate('/notifications')}
            style={{
              display: 'flex',
              padding: '0.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)'
            }}
            title="Notification Center"
          >
            <Bell size={18} />
          </button>
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              backgroundColor: 'var(--danger)',
              color: '#ffffff',
              fontSize: '0.6rem',
              fontWeight: 700,
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadCount}
            </span>
          )}
        </div>

        {/* Profile Avatar Trigger Link */}
        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-tertiary)'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.8rem'
          }}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            display: 'block'
          }} className="nav-profile-name">
            {profile.name}
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .top-navbar-container {
            margin-top: 60px; /* Offset for floating mobile header */
          }
        }
        @media (max-width: 640px) {
          .nav-profile-name { display: none !important; }
        }
      `}</style>
    </div>
  );
};
export default Navbar;
