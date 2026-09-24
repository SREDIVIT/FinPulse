import React from 'react';
import { Bell, Check, Trash2, ShieldAlert, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const NotificationCard = ({ item }) => {
  const { markNotificationRead, markNotificationUnread, deleteNotification } = useFinance();
  const { id, title, message, type, read, time } = item;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return { bg: 'var(--danger-bg)', color: 'var(--danger)', icon: ShieldAlert };
      case 'warning':
        return { bg: 'var(--warning-bg)', color: 'var(--warning)', icon: Bell };
      case 'success':
        return { bg: 'var(--success-bg)', color: 'var(--success)', icon: CheckCircle2 };
      default:
        return { bg: 'var(--accent-light)', color: 'var(--accent)', icon: Sparkles };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  return (
    <div className="card animate-fade-in" style={{
      padding: '1rem 1.25rem',
      backgroundColor: read ? 'var(--bg-secondary)' : 'var(--bg-tertiary)',
      borderLeft: read ? '4px solid var(--border)' : `4px solid ${styles.color}`,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      opacity: read ? 0.75 : 1,
      transition: 'all 0.2s'
    }}>
      <div style={{
        display: 'flex',
        padding: '0.4rem',
        borderRadius: '50%',
        backgroundColor: styles.bg,
        color: styles.color,
        flexShrink: 0,
        marginTop: '0.15rem'
      }}>
        <Icon size={16} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        <div className="flex-between">
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: read ? 600 : 700,
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {title}
          </h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{time}</span>
        </div>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.4
        }}>
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.5rem', alignSelf: 'center' }}>
        {read ? (
          <button
            onClick={() => markNotificationUnread(id)}
            style={{ color: 'var(--text-tertiary)', padding: '0.25rem' }}
            title="Mark as Unread"
          >
            <RefreshCw size={14} />
          </button>
        ) : (
          <button
            onClick={() => markNotificationRead(id)}
            style={{ color: 'var(--success)', padding: '0.25rem' }}
            title="Mark as Read"
          >
            <Check size={14} />
          </button>
        )}
        <button
          onClick={() => deleteNotification(id)}
          style={{ color: 'var(--text-tertiary)', padding: '0.25rem' }}
          title="Delete Notification"
        >
          <Trash2 size={14} className="hover-danger" style={{ transition: 'color 0.2s' }} />
        </button>
      </div>
    </div>
  );
};
