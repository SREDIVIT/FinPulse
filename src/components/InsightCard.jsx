import React from 'react';
import { Lightbulb, AlertTriangle, ArrowUpRight, TrendingUp, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InsightCard = ({ title, description, severity = 'info', actionText, actionPath }) => {
  const navigate = useNavigate();

  const getSeverityStyles = () => {
    switch (severity) {
      case 'warning':
        return {
          bg: 'var(--warning-bg)',
          border: 'var(--warning)',
          color: 'var(--warning)',
          icon: AlertTriangle
        };
      case 'danger':
        return {
          bg: 'var(--danger-bg)',
          border: 'var(--danger)',
          color: 'var(--danger)',
          icon: AlertTriangle
        };
      case 'success':
        return {
          bg: 'var(--success-bg)',
          border: 'var(--success)',
          color: 'var(--success)',
          icon: TrendingUp
        };
      default:
        return {
          bg: 'var(--accent-light)',
          border: 'var(--accent)',
          color: 'var(--accent)',
          icon: Lightbulb
        };
    }
  };

  const styles = getSeverityStyles();
  const Icon = styles.icon;

  return (
    <div className="card animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      borderLeft: `4px solid ${styles.border}`,
      backgroundColor: 'var(--bg-secondary)',
      padding: '1.25rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          display: 'flex',
          padding: '0.35rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: styles.bg,
          color: styles.color
        }}>
          <Icon size={16} />
        </div>
        <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>
          {title}
        </h4>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
        {description}
      </p>

      {actionText && (
        <button
          onClick={() => actionPath && navigate(actionPath)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: styles.color,
            marginTop: '0.25rem',
            alignSelf: 'flex-start'
          }}
        >
          {actionText}
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
};
