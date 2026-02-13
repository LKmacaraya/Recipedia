import React, { useState } from 'react';
import './AuthPage.css';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState('register'); // 'login' or 'register'
  // Registration fields
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regVerify, setRegVerify] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegVerify, setShowRegVerify] = useState(false);
  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Switch logic
  const switchToLogin = () => {
    setActiveCard('login');
    setRegError(''); setRegSuccess(''); setLoginError('');
  };
  const switchToRegister = () => {
    setActiveCard('register');
    setRegError(''); setRegSuccess(''); setLoginError('');
  };

  // Registration submit
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError(''); setRegSuccess('');
    if (!regEmail || !regUsername || !regPassword || !regVerify) {
      setRegError('All fields are required.'); return;
    }
    if (regPassword !== regVerify) {
      setRegError('Passwords do not match.'); return;
    }
    try {
      await axios.post('https://recipedia-m8ji.onrender.com/api/auth/register', { email: regEmail, username: regUsername, password: regPassword });
      setRegSuccess('Registration successful! You can now login.');
      setTimeout(() => switchToLogin(), 1200);
    } catch (err) {
      setRegError(err.response?.data?.message || 'Registration failed');
    }
  };

  // Login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUsername || !loginPassword) {
      setLoginError('Username and password required.'); return;
    }
    try {
      const res = await axios.post('https://recipedia-m8ji.onrender.com/api/auth/login', { username: loginUsername, password: loginPassword });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-animated-bg">
      <div className={`auth-card-main${activeCard==='register' ? ' show-register' : ''}`}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <h1 className="recipedia-logo">Recipedia</h1>
            <h3 className="auth-title">{activeCard === 'register' ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK !'}</h3>
            <div className="auth-desc">
              {activeCard === 'register'
                ? 'Just enter your credentials to join.'
                : 'Log in with your username and password.'}
            </div>
          </div>
          <div className="auth-form-stack" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {/* Login Form */}
            <form className={`auth-form auth-form-login${activeCard==='login' ? ' auth-form-active' : ' auth-form-inactive'}`} onSubmit={handleLogin} autoComplete="off">
              <div className="auth-input-row">
                <input className="auth-input" type="text" placeholder="Username" value={loginUsername} onChange={e=>setLoginUsername(e.target.value)} required />
              </div>
              <div className="auth-input-row auth-input-password">
                <input className="auth-input" type={showLoginPassword ? 'text' : 'password'} placeholder="Password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} required />
                <span className="auth-eye" onClick={()=>setShowLoginPassword(v=>!v)}>{showLoginPassword ? <FaRegEyeSlash/> : <FaRegEye/>}</span>
              </div>
              {loginError && <div className="auth-error">{loginError}</div>}
              <button className="auth-submit-btn" type="submit">LOG IN</button>
              <div className="auth-tab-footer">
                <button className={`auth-tab-btn${activeCard==='login' ? ' active' : ''}`} type="button" onClick={switchToLogin}>SIGN IN</button>
                <button className={`auth-tab-btn${activeCard==='register' ? ' active' : ''}`} type="button" onClick={switchToRegister}>SIGN UP</button>
              </div>
            </form>
            {/* Register Form */}
            <form className={`auth-form auth-form-register${activeCard==='register' ? ' auth-form-active' : ' auth-form-inactive'}`} onSubmit={handleRegister} autoComplete="off" style={{ minHeight: '440px' }}>
              <div className="auth-input-row">
                <input className="auth-input" type="text" placeholder="Username" value={regUsername} onChange={e=>setRegUsername(e.target.value)} required />
              </div>
              <div className="auth-input-row">
                <input className="auth-input" type="email" placeholder="Email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} required />
              </div>
              <div className="auth-input-row auth-input-password">
                <input className="auth-input" type={showRegPassword ? 'text' : 'password'} placeholder="Insert Password" value={regPassword} onChange={e=>setRegPassword(e.target.value)} required />
                <span className="auth-eye" onClick={()=>setShowRegPassword(v=>!v)}>{showRegPassword ? <FaRegEyeSlash/> : <FaRegEye/>}</span>
              </div>
              <div className="auth-input-row auth-input-password">
                <input className="auth-input" type={showRegVerify ? 'text' : 'password'} placeholder="Verify Password" value={regVerify} onChange={e=>setRegVerify(e.target.value)} required />
                <span className="auth-eye" onClick={()=>setShowRegVerify(v=>!v)}>{showRegVerify ? <FaRegEyeSlash/> : <FaRegEye/>}</span>
              </div>
              {regError && <div className="auth-error">{regError}</div>}
              {regSuccess && <div className="auth-success">{regSuccess}</div>}
              <button className="auth-submit-btn" type="submit">REGISTER</button>
              <div className="auth-tab-footer">
                <button className={`auth-tab-btn${activeCard==='login' ? ' active' : ''}`} type="button" onClick={switchToLogin}>SIGN IN</button>
                <button className={`auth-tab-btn${activeCard==='register' ? ' active' : ''}`} type="button" onClick={switchToRegister}>SIGN UP</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default AuthPage;
