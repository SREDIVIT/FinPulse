import React, { useState } from 'react';
import { X, UserPlus, Check, ArrowRight, ShieldCheck, Mail, User, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';

const DEFAULT_ACCOUNTS = [
  {
    name: 'Sredivit',
    email: 'sredivit@gmail.com',
    avatarColor: '#4f46e5',
    lastUsed: true
  },
  {
    name: 'Sredivit Work',
    email: 'sredivit@finpulse.ai',
    avatarColor: '#059669',
    lastUsed: false
  }
];

export const GoogleAuthModal = ({ isOpen, onClose, onSelectAccount, onForgotPassword }) => {
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('google_saved_accounts');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_ACCOUNTS;
  });

  // Step state: 'select' (choose or add) | 'password' (enter password)
  const [step, setStep] = useState('select');
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Selected or active account for password step
  const [activeAccount, setActiveAccount] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Custom new email form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [customError, setCustomError] = useState('');

  if (!isOpen) return null;

  // Step 1: User picks an account -> Proceed to password step
  const handlePickAccount = (account) => {
    setCustomError('');
    setPassword('');
    setActiveAccount(account);
    setStep('password');
  };

  // Step 1b: User submits custom email -> Proceed to password step
  const handleAddNewEmailSubmit = (e) => {
    e.preventDefault();
    setCustomError('');
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      setCustomError('Please enter a valid Google email address.');
      return;
    }
    const name = newName.trim() || newEmail.split('@')[0];
    const newAcc = {
      name,
      email: newEmail.trim().toLowerCase(),
      avatarColor: '#2563eb',
      lastUsed: true
    };

    const updated = [newAcc, ...accounts.filter(a => a.email !== newAcc.email)];
    setAccounts(updated);
    try {
      localStorage.setItem('google_saved_accounts', JSON.stringify(updated));
    } catch {
      // ignore
    }

    handlePickAccount(newAcc);
  };

  // Step 2: User enters password & submits
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setCustomError('');

    if (!password) {
      setCustomError('Please enter your Google password.');
      return;
    }

    if (password.length < 6) {
      setCustomError('Wrong password. Try again or click Forgot password.');
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onSelectAccount({
        name: activeAccount.name,
        email: activeAccount.email,
        avatar: activeAccount.avatar || null,
        password
      });
      // reset state for next time
      setStep('select');
      setIsAddingNew(false);
      setPassword('');
    }, 600);
  };

  const handleResetModal = () => {
    setStep('select');
    setIsAddingNew(false);
    setActiveAccount(null);
    setPassword('');
    setCustomError('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      zIndex: 9999
    }} onClick={handleResetModal}>
      <div 
        className="animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.75rem 1.75rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          textAlign: 'center'
        }}>
          <button 
            onClick={handleResetModal} 
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <X size={16} />
          </button>

          {/* Google Logo */}
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <svg width="36" height="36" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: '#f8fafc' }}>
            {step === 'password' ? 'Welcome' : 'Choose an account'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            {step === 'password' ? 'To continue, first verify it’s you' : <>to continue to <strong style={{ color: '#818cf8' }}>FinTrack</strong></>}
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.25rem 1.5rem 1.5rem', maxHeight: '420px', overflowY: 'auto' }}>
          {/* STEP 1: Account List */}
          {step === 'select' && !isAddingNew && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {accounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handlePickAccount(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: acc.avatarColor || '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    {acc.name ? acc.name.charAt(0).toUpperCase() : acc.email.charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.email}
                    </div>
                  </div>

                  {acc.lastUsed && (
                    <span style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(99, 102, 241, 0.12)',
                      color: '#a5b4fc',
                      fontWeight: 500
                    }}>
                      Recent
                    </span>
                  )}
                </button>
              ))}

              {/* Use Another Account Button */}
              <button
                type="button"
                onClick={() => { setIsAddingNew(true); setCustomError(''); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  marginTop: '0.25rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  flexShrink: 0
                }}>
                  <UserPlus size={18} />
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>
                  Use another account
                </div>
              </button>
            </div>
          )}

          {/* STEP 1b: Add custom email address */}
          {step === 'select' && isAddingNew && (
            <form onSubmit={handleAddNewEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>
                Sign in with your Google account
              </div>

              {customError && (
                <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.8rem' }}>
                  {customError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>
                  Email or phone
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#f8fafc',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>
                  Name (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#f8fafc',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setCustomError(''); }}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  Next <ArrowRight size={15} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Password Prompt */}
          {step === 'password' && activeAccount && (
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Active User Pill */}
              <div 
                onClick={() => { setStep('select'); setCustomError(''); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem 0.35rem 0.4rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  width: 'fit-content',
                  margin: '0 auto',
                  transition: 'all 0.2s'
                }}
                title="Switch account"
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: activeAccount.avatarColor || '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#fff'
                }}>
                  {activeAccount.name ? activeAccount.name.charAt(0).toUpperCase() : activeAccount.email.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>
                  {activeAccount.email}
                </span>
                <ChevronDown size={14} color="#94a3b8" />
              </div>

              {customError && (
                <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontSize: '0.8rem' }}>
                  {customError}
                </div>
              )}

              {/* Password Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>
                  Enter your password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isAuthenticating}
                    style={{
                      width: '100%',
                      padding: '0.65rem 2.5rem 0.65rem 2.25rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#f8fafc',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Show Password Checkbox & Forgot Password */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Show password
                </label>

                <a 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    if (onForgotPassword) {
                      onForgotPassword(activeAccount?.email);
                    }
                  }} 
                  style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 500 }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setStep('select'); setCustomError(''); }}
                  disabled={isAuthenticating}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  style={{
                    flex: 2,
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    cursor: isAuthenticating ? 'default' : 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  {isAuthenticating ? (
                    <>
                      <span className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255, 255, 255, 0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Next <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Secure Google Sign-In</span>
          </div>
          <span>FinTrack Authentication</span>
        </div>
      </div>
    </div>
  );
};
