import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug, ArrowRight, AlertCircle, Sparkles, User, Lock, Mail, Shield } from 'lucide-react';
import { api } from '../api/client';

export function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);

  // 1-Click Dedicated Demo Login
  const handleInstantDemoLogin = async (email, password, type) => {
    setError('');
    setDemoLoading(type);
    try {
      const response = await api.post('/auth/login', { email, password });
      onLogin(response.data.token, response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to connect to the BugAtlas server. Please ensure the backend is running.'
      );
    } finally {
      setDemoLoading(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister && form.name.trim().length < 2) {
      setError('Please provide a name of at least 2 characters.');
      return;
    }
    if (!form.email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
        : { email: form.email.trim(), password: form.password };

      const response = await api.post(endpoint, payload);
      onLogin(response.data.token, response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to process your request. Please check your credentials or server connection.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-wrapper">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div className="auth-header">
            <div className="auth-brand-badge">
              <Bug size={22} className="auth-brand-icon" />
            </div>
            <h1 className="auth-title">BugAtlas</h1>
            <p className="auth-subtitle">
              Engineering incident triage & root-cause investigation platform
            </p>
          </div>

          {/* Dedicated 1-Click Demo Login Banner */}
          <div className="demo-banner">
            <button
              type="button"
              className="btn-instant-demo"
              disabled={isSubmitting || demoLoading !== null}
              onClick={() => handleInstantDemoLogin('shreya@bugatlas.dev', 'shreya123', 'detective')}
            >
              <Sparkles size={16} className="sparkle-icon" />
              <div className="demo-btn-text">
                <span className="demo-btn-title">
                  {demoLoading === 'detective' ? 'Authenticating Demo...' : '1-Click Instant Demo Login'}
                </span>
                <span className="demo-btn-subtitle">Sign in as Detective (No typing required)</span>
              </div>
              <ArrowRight size={14} className="arrow-icon" />
            </button>

            <div className="secondary-demo-row">
              <button
                type="button"
                className="btn-admin-demo"
                disabled={isSubmitting || demoLoading !== null}
                onClick={() => handleInstantDemoLogin('admin@bugatlas.dev', 'admin123', 'admin')}
              >
                <Shield size={12} />
                <span>{demoLoading === 'admin' ? 'Logging in...' : 'Sign in as Admin Lead'}</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <span>or continue with credentials</span>
          </div>

          {/* Form Switcher Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${!isRegister ? 'active' : ''}`}
              onClick={() => {
                setIsRegister(false);
                setError('');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${isRegister ? 'active' : ''}`}
              onClick={() => {
                setIsRegister(true);
                setError('');
              }}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="auth-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name / Detective Alias
                </label>
                <div className="input-with-icon">
                  <User size={14} className="input-icon" />
                  <input
                    id="name"
                    type="text"
                    className="form-input with-icon"
                    placeholder="e.g. Maya Lin"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div className="input-with-icon">
                <Mail size={14} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-input with-icon"
                  placeholder="e.g. investigator@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-with-icon">
                <Lock size={14} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  className="form-input with-icon"
                  placeholder={isRegister ? 'Create password (min 6 chars)' : 'Enter your password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block mt-2"
              disabled={isSubmitting || demoLoading !== null}
            >
              {isSubmitting ? (
                <span>{isRegister ? 'Creating Account...' : 'Authenticating...'}</span>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account & Enter' : 'Sign In to Workspace'}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
