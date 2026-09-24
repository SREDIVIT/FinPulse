import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck, KeyRound, ExternalLink, RefreshCw } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const ForgotPasswordModal = ({ isOpen, onClose, initialEmail = '', onSuccess }) => {
  const { resetPassword, sendOtp } = useFinance();

  const [step, setStep] = useState('request'); // 'request' | 'verify' | 'success'
  const [email, setEmail] = useState(initialEmail || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [devOtp, setDevOtp] = useState(null);

  if (!isOpen) return null;

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: '#64748b' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 3) return { score, label: 'Moderate', color: '#f59e0b' };
    return { score, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await sendOtp(email.trim().toLowerCase());
    setIsSubmitting(false);

    if (res && res.success) {
      if (res.previewUrl) setPreviewUrl(res.previewUrl);
      if (res.devOtp) setDevOtp(res.devOtp);
      setStep('verify');
    } else {
      setError(res?.message || 'Could not send verification email. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError('');
    const res = await sendOtp(email.trim().toLowerCase());
    setIsResending(false);
    if (res && res.previewUrl) {
      setPreviewUrl(res.previewUrl);
    }
    if (res && res.devOtp) {
      setDevOtp(res.devOtp);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit code sent to your email.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(email.trim().toLowerCase(), otp.trim(), newPassword);
    setIsSubmitting(false);

    if (result && result.success) {
      setStep('success');
      if (onSuccess) {
        onSuccess(email.trim().toLowerCase(), newPassword);
      }
    } else {
      setError(result?.message || 'Invalid or expired verification code. Please check your email.');
    }
  };

  const handleClose = () => {
    setStep('request');
    setError('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setPreviewUrl(null);
    setDevOtp(null);
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
    }} onClick={handleClose}>
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
            onClick={handleClose} 
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

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: step === 'success' 
              ? 'rgba(16, 185, 129, 0.15)' 
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%)',
            border: step === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '0.75rem',
            color: step === 'success' ? '#10b981' : '#818cf8'
          }}>
            {step === 'success' ? <CheckCircle2 size={24} /> : <KeyRound size={24} />}
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: '#f8fafc' }}>
            {step === 'request' && 'Reset Password'}
            {step === 'verify' && 'Check Your Email'}
            {step === 'success' && 'Password Changed!'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            {step === 'request' && 'Enter your email address to receive your 6-digit verification code.'}
            {step === 'verify' && <>We sent a verification code to <strong style={{ color: '#e2e8f0' }}>{email}</strong></>}
            {step === 'success' && 'Your account password has been updated in the database.'}
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.75rem', maxHeight: '420px', overflowY: 'auto' }}>
          {error && (
            <div style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 'request' && (
            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 500 }}>
                  Account Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.25rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                  marginTop: '0.5rem'
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255, 255, 255, 0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    Sending Email...
                  </>
                ) : (
                  <>
                    Send Code to Email <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Enter OTP & New Password */}
          {step === 'verify' && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Dev Test Email Inbox Preview Link */}
              {previewUrl && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontSize: '0.8rem',
                  color: '#c7d2fe'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={14} color="#818cf8" />
                    <span>Delivered to test inbox:</span>
                  </div>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'rgba(99, 102, 241, 0.25)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    View Email <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Dev code helper when SMTP is not configured */}
              {devOtp && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontSize: '0.8rem',
                  color: '#c7d2fe'
                }}>
                  <span>Dev OTP: <strong style={{ color: '#fff' }}>{devOtp}</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtp(devOtp)}
                    style={{
                      background: 'rgba(99, 102, 241, 0.25)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.2rem 0.5rem',
                      color: '#e0e7ff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Auto-fill
                  </button>
                </div>
              )}

              {/* 6-Digit OTP */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                    Enter 6-Digit Code
                  </label>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#818cf8',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: 0
                    }}
                  >
                    <RefreshCw size={12} className={isResending ? 'animate-spin' : ''} />
                    {isResending ? 'Resending...' : 'Resend Code'}
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#f8fafc',
                    fontSize: '1.25rem',
                    letterSpacing: '6px',
                    textAlign: 'center',
                    outline: 'none',
                    fontWeight: 700
                  }}
                  autoFocus
                />
              </div>

              {/* New Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                    New Password
                  </label>
                  {newPassword && (
                    <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>
                      {strength.label}
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 2.25rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
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

                {/* Password Strength Indicator Bar */}
                {newPassword && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        style={{
                          height: '4px',
                          flex: 1,
                          borderRadius: '2px',
                          backgroundColor: level <= strength.score ? strength.color : 'rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 500 }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.25rem',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setStep('request'); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
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
                  disabled={isSubmitting}
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner" style={{ width: '14px', height: '14px', border: '2px solid rgba(255, 255, 255, 0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                      Verifying...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Your password has been successfully updated. You can now log into FinTrack with your new credentials.
              </div>

              <button
                type="button"
                onClick={handleClose}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
                }}
              >
                Log In with New Password <ArrowRight size={16} />
              </button>
            </div>
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
            <span>Secure OTP Delivery</span>
          </div>
          <span>FinTrack Security</span>
        </div>
      </div>
    </div>
  );
};
