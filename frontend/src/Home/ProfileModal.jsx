import React from 'react';
import './ProfileModal.css';

export default function ProfileModal({ user, open, onClose }) {
  React.useEffect(() => {
    console.log('[ProfileModal] Mounted. user:', user, 'open:', open);
  }, [user, open]);
  if (!open || !user) return null;
  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={e => e.stopPropagation()}>
        <button className="profile-modal-close" onClick={onClose}>×</button>
        <img
          className="profile-modal-avatar"
          src={user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) : '/default-avatar.png'}
          alt="avatar"
        />
        <h2 className="profile-modal-username">{user.username}</h2>
        {user.bio && <p className="profile-modal-bio">{user.bio}</p>}
        {/* Add more user info as needed */}
      </div>
    </div>
  );
}
