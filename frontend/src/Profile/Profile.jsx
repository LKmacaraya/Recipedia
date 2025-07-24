import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const DEFAULT_AVATAR = 'https://media.istockphoto.com/id/2219141543/photo/3d-render-chef-woman-avatar-for-culinary-and-restaurant-illustration.webp?a=1&b=1&s=612x612&w=0&k=20&c=V6BlF7eOGuqtVVWNC1wuD84zjVmi95Z5UPI1Klt6OQA=';


export default function Profile({ user, onSave, darkMode }) {
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
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch profile from backend
    async function fetchProfile() {
      try {
        const res = await axios.get('http://localhost:5000/api/profile/me', {
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
        const uploadRes = await axios.post('http://localhost:5000/api/avatar/upload', formData, {
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
      const res = await axios.put('http://localhost:5000/api/profile/me', {
        ...profile,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setAvatarPreview(res.data.avatar || DEFAULT_AVATAR);
      onSave && onSave(res.data);
    } catch (err) {
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <div className={`profile-page${darkMode ? ' dark' : ''}`}>Loading...</div>;
  return (
    <div className={`profile-page${darkMode ? ' dark' : ''}`}>
      <div className="profile-card mx-auto">
        <div className="profile-avatar-wrapper mx-auto mb-3">
          <img
            src={avatarPreview && avatarPreview.startsWith('/') ? `http://localhost:5000${avatarPreview}` : avatarPreview}
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
  <button type="submit" className="btn btn-primary w-100" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
</form>
      </div>
    </div>
  );
}
