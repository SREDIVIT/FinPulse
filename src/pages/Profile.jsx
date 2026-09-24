import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { User, Mail, Phone, DollarSign, Target, Award } from 'lucide-react';

export const Profile = () => {
  const { profile, setProfile, triggerToast } = useFinance();

  // Form states initialized from context profile values
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [currency, setCurrency] = useState(profile.currency || 'INR');
  const [monthlyIncome, setMonthlyIncome] = useState(profile.monthlyIncome || 50000);
  const [goalsText, setGoalsText] = useState(profile.financialGoals || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      triggerToast('Name and Email are required!', 'danger');
      return;
    }

    setProfile({
      name,
      email,
      phone,
      currency,
      monthlyIncome: parseFloat(monthlyIncome),
      financialGoals: goalsText
    });

    triggerToast('Profile updated successfully!');
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
        
        {/* Profile Card Header details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '2rem',
            boxShadow: 'var(--card-shadow)'
          }}>
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>{email}</p>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Premium Tier Account</span>
          </div>
        </div>

        {/* Profile Editor Fields form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="profile-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Monthly Income Target (₹)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Active Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Long Term Financial Goals</label>
            <div style={{ position: 'relative' }}>
              <Target size={16} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-tertiary)' }} />
              <textarea
                value={goalsText}
                onChange={(e) => setGoalsText(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem', resize: 'vertical' }}
                placeholder="e.g. Save for laptop, Build emergency fund, Buy index funds"
                rows={3}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem', fontWeight: 700, marginTop: '0.5rem' }}>
            Save Profile
          </button>
        </form>

      </div>

      <style>{`
        @media (max-width: 640px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
export default Profile;
