import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { Activity, Eye, EyeOff, User, Mail, Lock, Globe, Sparkles, ArrowRight } from 'lucide-react';
import secureAccessImg from '../assets/secure_access.png';

export const Signup = () => {
  const { signup } = useFinance();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setIsSubmitting(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    // Signup with API / fallback
    setTimeout(async () => {
      const success = await signup(name, email, password, currency);
      setIsSubmitting(false);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Signup failed.');
      }
    }, 400);
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
        <div className="auth-form-card animate-fade-in" style={{ maxWidth: '440px' }}>
          <div className="auth-form-header">
            <h2 className="auth-form-title">Create Account</h2>
            <p className="auth-form-subtitle">Start your personalized finance intelligence journey.</p>
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Full Name Field */}
            <div className="auth-input-group">
              <label className="auth-input-label">Full Name</label>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="auth-input-field"
                  placeholder="Sredivit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="auth-input-group">
              <label className="auth-input-label">Email Address</label>
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

            {/* Password Row */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {/* Password Field */}
              <div className="auth-input-group" style={{ flex: 1 }}>
                <label className="auth-input-label">Password</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input-field auth-input-field-password"
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                    style={{ paddingLeft: '2.5rem !important' }}
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="auth-input-group" style={{ flex: 1 }}>
                <label className="auth-input-label">Confirm</label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input-field auth-input-field-password"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                    style={{ paddingLeft: '2.5rem !important' }}
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
            </div>

            {/* Default Currency Field */}
            <div className="auth-input-group">
              <label className="auth-input-label">Default Currency</label>
              <div className="auth-input-container">
                <span className="auth-input-icon">
                  <Globe size={16} />
                </span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="auth-input-field"
                  disabled={isSubmitting}
                  style={{
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1rem',
                    paddingRight: '2.5rem !important'
                  }}
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={isSubmitting}
              style={{ marginTop: '0.75rem' }}
            >
              {isSubmitting ? 'Creating Account...' : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-footer-link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
