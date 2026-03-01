import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const DEFAULT_AVATAR = 'https://media.istockphoto.com/id/2219141543/photo/3d-render-chef-woman-avatar-for-culinary-and-restaurant-illustration.webp?a=1&b=1&s=612x612&w=0&k=20&c=V6BlF7eOGuqtVVWNC1wuD84zjVmi95Z5UPI1Klt6OQA=';


export default function Profile({ user, onSave, darkMode, setCurrentPage }) {
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    gender: 'Rather not Say',
    hobbies: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch profile from backend
    async function fetchProfile() {
      try {
        const res = await axios.get('https://recipedia-m8ji.onrender.com/api/profile/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setAvatarPreview(res.data.avatar || DEFAULT_AVATAR);
      } catch (err) {
        setProfile({ ...profile, email: user?.email || '' });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleAvatarChange = async e => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      // Upload avatar immediately and set returned URL
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        const uploadRes = await axios.post('https://recipedia-m8ji.onrender.com/api/avatar/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        setProfile(prev => ({ ...prev, avatar: uploadRes.data.url }));
      } catch (err) {
        alert('Failed to upload avatar.');
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put('https://recipedia-m8ji.onrender.com/api/profile/me', {
        ...profile,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setAvatarPreview(res.data.avatar || DEFAULT_AVATAR);
      onSave && onSave(res.data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2100);
    } catch (err) {
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <div className={`profile-page${darkMode ? ' dark' : ''}`}>Loading...</div>;
  return (
    <>
      <div className="profile-header-row">
        <button className="btn profile-back-btn" style={{fontSize: darkMode ? '1.05rem' : '1.3rem'}} onClick={() => setCurrentPage('home')} title="Back" aria-label="Back">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle'}} width="1.5em" height="1.5em"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 5 12 12 19"/></svg>
        </button>
        <span className="profile-header-title">Edit Profile</span>
      </div>
      {showSuccess && (
        <div className="profile-success-modal" role="alert" aria-live="polite">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="9.2" fill="#22bb55"/><polyline points="6.2 10.7 9 13.5 14 8.5" stroke="#fff" strokeWidth="2.2"/></svg>
          Profile saved successfully!
        </div>
      )}
      <div className={`profile-page${darkMode ? ' dark' : ''}`}>
      <div className="profile-card mx-auto">
        <div className="profile-avatar-wrapper mx-auto mb-3">
          <img
            src={avatarPreview && avatarPreview.startsWith('/') ? `https://recipedia-m8ji.onrender.com${avatarPreview}` : avatarPreview}
            alt="Profile"
            className="profile-avatar-img"
          />
          <label className="profile-avatar-upload-btn">
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            Change
          </label>
        </div>
        <form className="profile-form" onSubmit={handleSubmit} autoComplete="on">
  <div className="mb-3">
    <label className="form-label" htmlFor="profile-name">Name</label>
    <input
      type="text"
      className="form-control"
      id="profile-name"
      name="name"
      autoComplete="name"
      value={profile.name}
      onChange={handleChange}
      required
    />
  </div>
  <div className="mb-3">
    <label className="form-label" htmlFor="profile-address">Address</label>
    <input
      type="text"
      className="form-control"
      id="profile-address"
      name="address"
      autoComplete="street-address"
      value={profile.address}
      onChange={handleChange}
    />
  </div>
  <div className="mb-3">
    <label className="form-label" htmlFor="profile-gender">Gender</label>
    <select
      className="form-control"
      id="profile-gender"
      name="gender"
      autoComplete="sex"
      value={profile.gender}
      onChange={handleChange}
      required
    >
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Rather not Say">Rather not Say</option>
    </select>
  </div>
  <div className="mb-3">
    <label className="form-label" htmlFor="profile-hobbies">Hobbies</label>
    <input
      type="text"
      className="form-control"
      id="profile-hobbies"
      name="hobbies"
      autoComplete="off"
      value={profile.hobbies}
      onChange={handleChange}
      placeholder="e.g. Cooking, Reading"
    />
  </div>
  <div className="mb-3">
    <label className="form-label" htmlFor="profile-email">Email</label>
    <input
      type="email"
      className="form-control"
      id="profile-email"
      name="email"
      autoComplete="email"
      value={profile.email}
      readOnly
      tabIndex={-1}
      aria-readonly="true"
    />
  </div>
  <div className="mb-3">
    <label className="form-label" htmlFor="profile-bio">Bio</label>
    <textarea
      className="form-control"
      id="profile-bio"
      name="bio"
      autoComplete="off"
      value={profile.bio}
      onChange={handleChange}
      rows={3}
      placeholder="Tell us about yourself..."
    />
  </div>
  <button type="submit" className="btn btn-primary w-100 profile-save-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
</form>
      </div>
    </div>
    </>
  );
}
