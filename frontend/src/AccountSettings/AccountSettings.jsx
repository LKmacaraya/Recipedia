import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AccountSettings.css';

export default function AccountSettings({ darkMode, setCurrentPage, onSave }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm(f => ({ ...f, username: res.data.username || '', email: res.data.email || '' }));
      } catch {
        setError('Failed to load user data.');
      }
      setLoading(false);
    }
    fetchSettings();
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.username || !form.email) {
      setError('Username and email required.'); return;
    }
    if (form.password && form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    setSaving(true);
    try {
      const res = await axios.put('http://localhost:5000/api/users/settings', {
        username: form.username,
        email: form.email,
        password: form.password ? form.password : undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Account updated successfully!');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
      if (onSave && res.data) {
        onSave({ username: res.data.username, email: res.data.email });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  return (
    <div className={`account-settings-page${darkMode ? ' dark' : ''}`}>
      <div className="account-settings-card">
        <div className="profile-header-row">
          <button
            className={`btn profile-back-btn${darkMode ? ' dark' : ''}`}
            style={{fontSize: darkMode ? '1.05rem' : '1.3rem'}}
            onClick={() => setCurrentPage('home')}
            title="Back"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle'}} width="1.5em" height="1.5em"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 5 12 12 19"/></svg>
          </button>
          <span className="profile-header-title">Account Settings</span>
        </div>
        <form className="account-settings-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-3">
            <label className="form-label" htmlFor="settings-username">Username</label>
            <input type="text" className="form-control" id="settings-username" name="username" value={form.username} onChange={handleChange} required autoComplete="username" />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="settings-email">Email</label>
            <input type="email" className="form-control" id="settings-email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="settings-password">New Password</label>
            <div className="input-group">
              <input type={showPassword ? 'text' : 'password'} className="form-control" id="settings-password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" placeholder="Leave blank to keep current" minLength={6} />
              <button type="button" className="btn btn-outline-secondary" tabIndex="-1" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password visibility" style={{borderTopLeftRadius:0,borderBottomLeftRadius:0}}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="settings-confirm">Confirm Password</label>
            <div className="input-group">
              <input type={showConfirm ? 'text' : 'password'} className="form-control" id="settings-confirm" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" placeholder="Repeat new password" minLength={6} />
              <button type="button" className="btn btn-outline-secondary" tabIndex="-1" onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirm password visibility" style={{borderTopLeftRadius:0,borderBottomLeftRadius:0}}>
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && <div className="account-settings-error">{error}</div>}
          {success && <div className="account-settings-success">{success}</div>}
          <button className="btn account-settings-save-btn w-100" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}
