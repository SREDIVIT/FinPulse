import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { NotificationCard } from '../components/NotificationCard';
import { Bell, CheckSquare, Trash2 } from 'lucide-react';

export const Notifications = () => {
  const { notifications, markAllNotificationsRead } = useFinance();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="page-wrapper animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header controls */}
      <div className="card flex-between" style={{ padding: '1rem 1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'flex',
            padding: '0.4rem',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)'
          }}>
            <Bell size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Notification Center</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              You have {unreadCount} unread system notifications
            </span>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="btn btn-secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <CheckSquare size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications list layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {notifications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-tertiary)' }}>
            <Bell size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>Your inbox is clean!</p>
            <span style={{ fontSize: '0.8rem' }}>We will notify you here of budgets and savings goals updates.</span>
          </div>
        ) : (
          notifications.map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))
        )}
      </div>
      
    </div>
  );
};
export default Notifications;
