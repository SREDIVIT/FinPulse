import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { Activity, Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';
import secureAccessImg from '../assets/secure_access.png';
import { GoogleAuthModal } from '../components/GoogleAuthModal';
import { ForgotPasswordModal } from '../components/ForgotPasswordModal';

export const Login = () => {
  const { login, googleLogin } = useFinance();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Quick Validation
    if (!email) {
      setError('Email address is required.');
      setIsSubmitting(false);
      return;
    }
    if (!password) {
      setError('Password is required.');
      setIsSubmitting(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    // Login with API / fallback
    setTimeout(async () => {
      const success = await login(email, password);
      setIsSubmitting(false);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    }, 400);
  };

  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleGoogleClick = (e) => {
    e.preventDefault();
    setError('');
    setShowGoogleModal(true);
  };

  const handleAccountSelected = async (account) => {
    setShowGoogleModal(false);
    setIsSubmitting(true);
    setError('');
    try {
      const success = await googleLogin(account);
      setIsSubmitting(false);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } catch {
      setIsSubmitting(false);
      setError('An error occurred during Google sign-in.');
    }
  };

  return (
    <div className="auth-split-wrapper">
      {/* Left Panel: Branding & Showcase */}
      <div className="auth-showcase-panel" style={{ padding: '3rem' }}>
        <div className="auth-showcase-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
          {/* Logo Header */}
          <div className="auth-brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="auth-brand-logo-icon" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              padding: '0.6rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              color: '#fff'
            }}>
              <Activity size={20} />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>FinPulse</span>
          </div>

          {/* Centered Glassmorphic Showcase Card */}
          <div style={{ margin: 'auto 0', width: '100%', maxWidth: '440px', alignSelf: 'center' }}>
            <div className="auth-glass-card" style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
              position: 'relative'
            }}>
              {/* Security Graphic Asset */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img 
                  src={secureAccessImg} 
                  alt="Secure Access Illustration" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '220px', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.4))'
                  }} 
                />
              </div>

              {/* Title & Star Icon Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.85rem', 
                  fontWeight: 700, 
                  color: '#ffffff', 
                  lineHeight: '1.25',
                  letterSpacing: '-0.5px',
                  margin: 0
                }}>
                  Secure access,<br />always.
                </h2>
                <Sparkles size={22} color="#818cf8" style={{ opacity: 0.9, marginBottom: '6px' }} />
              </div>
            </div>
          </div>

          {/* Spacer footer to balance layout */}
          <div style={{ height: '32px' }}></div>
        </div>
      </div>

      {/* Right Panel: Authentication Form */}
      <div className="auth-form-panel">
        <div className="auth-form-card animate-fade-in">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-subtitle">Enter your credentials to access your dashboard.</p>
          </div>

          {/* Error Callout */}
          {error && (
            <div style={{
              padding: '0.85rem 1.15rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Field */}
            <div className="auth-input-group">
              <label className="auth-input-label">Email</label>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="auth-input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-input-group">
              <div className="flex-between">
                <label className="auth-input-label">Password</label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setShowForgotModal(true); 
                  }} 
                  className="auth-action-link"
                >
                  Forgot password?
                </a>
              </div>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input-field auth-input-field-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-password-toggle"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex-between" style={{ marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#6366f1'
                  }}
                  disabled={isSubmitting}
                />
                <label htmlFor="remember" style={{ fontSize: '0.85rem', color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}>
                  Remember me
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={isSubmitting}
              style={{ marginTop: '0.5rem' }}
            >
              {isSubmitting ? 'Signing In...' : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Social Sign-In Divider */}
          <div className="auth-divider">OR CONTINUE WITH</div>

          {/* Google Button */}
          <button 
            type="button" 
            className="auth-social-btn" 
            onClick={handleGoogleClick}
            disabled={isSubmitting}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.938 5.48 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.549 0 9s.347 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.32 0 2.507.454 3.44 1.347l2.58-2.58C13.463.893 11.426 0 9 0 5.48 0 2.438 2.062.957 5.039l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          {/* Footer Link */}
          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-footer-link">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Google Account Selector Dialog */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelectAccount={handleAccountSelected}
        onForgotPassword={(accountEmail) => {
          setShowGoogleModal(false);
          if (accountEmail) setEmail(accountEmail);
          setShowForgotModal(true);
        }}
      />

      {/* Forgot / Reset Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        initialEmail={email}
        onClose={() => setShowForgotModal(false)}
        onSuccess={(resetEmail, newPass) => {
          setEmail(resetEmail);
          setPassword(newPass);
          setShowForgotModal(false);
        }}
      />
    </div>
  );
};

export default Login;
