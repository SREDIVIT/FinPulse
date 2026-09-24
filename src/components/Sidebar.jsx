import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  RefreshCw,
  BarChart3,
  Lightbulb,
  HeartPulse,
  TrendingUp,
  FileText,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const { profile, logout, notifications } = useFinance();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Money Management',
      items: [
        { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
        { name: 'Budgets', path: '/budgets', icon: Wallet },
        { name: 'Savings Goals', path: '/savings-goals', icon: Target },
        { name: 'Subscriptions', path: '/subscriptions', icon: RefreshCw }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Smart Insights', path: '/smart-insights', icon: Lightbulb },
        { name: 'Financial Health', path: '/financial-health', icon: HeartPulse },
        { name: 'Spending Forecast', path: '/spending-forecast', icon: TrendingUp }
      ]
    },
    {
      title: 'Reports',
      items: [
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadNotificationsCount }
      ]
    },
    {
      title: 'Account',
      items: [
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.65rem 0.85rem',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    color: isActive ? '#ffffff' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'var(--accent)' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
    transition: 'all 0.2s'
  });

  return (
    <>
      {/* Mobile Top Navbar Header */}
      <div style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--bg-secondary)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        zIndex: 99
      }} className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="var(--accent)" />
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>FinPulse</span>
        </div>
        <button onClick={() => setIsOpen(true)} style={{ display: 'flex', color: 'var(--text-primary)' }}>
          <Menu size={24} />
        </button>
      </div>

      {/* CSS Overrides for Mobile Headers */}
      <style>{`
        @media (max-width: 1024px) {
          .mobile-header { display: flex !important; }
          .sidebar-container {
            transform: translateX(-100%);
            z-index: 1000 !important;
            box-shadow: 10px 0 30px rgba(0,0,0,0.15);
          }
          .sidebar-container.open {
            transform: translateX(0);
          }
          .sidebar-overlay {
            display: block !important;
          }
        }
      `}</style>

      {/* Drawer Overlay for Mobile */}
      {isOpen && (
        <div style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 999,
          backdropFilter: 'blur(3px)'
        }} className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar container */}
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`} style={{
        width: '280px',
        height: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--sidebar-shadow)',
        transition: 'transform var(--transition-normal)',
        zIndex: 98
      }}>
        {/* Brand Logo Header */}
        <div className="flex-between" style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--accent-light)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <Sparkles size={20} color="var(--accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>FinPulse</h2>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>FINANCIAL INTELLIGENCE</span>
            </div>
          </div>
          <button className="mobile-header" style={{ display: 'none', color: 'var(--text-secondary)' }} onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation Sections */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {menuGroups.map((group) => (
            <div key={group.title}>
              <h4 style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                fontWeight: 700,
                letterSpacing: '0.075em',
                marginBottom: '0.5rem',
                paddingLeft: '0.5rem'
              }}>
                {group.title}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    style={navLinkStyle}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span style={{
                        backgroundColor: 'var(--danger)',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.4rem',
                        borderRadius: '999px',
                        minWidth: '18px',
                        textAlign: 'center'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Card Footer Profile */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--bg-tertiary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1rem'
          }}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile.name}
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
              {profile.email}
            </p>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex',
            color: 'var(--text-secondary)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)',
            transition: 'color 0.2s'
          }} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );
};
