import React, { useRef, useState } from 'react';
import { FaTimes, FaCamera } from 'react-icons/fa';
import './NewPostModal.css';

export default function NewPostModal({ show, onClose, onSubmit, user }) {
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  if (!show) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!title.trim() || !steps.trim() || !image) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    try {
      await onSubmit({ title, steps, image });
      setTitle('');
      setSteps('');
      setImage(null);
      setPreview('');
      onClose();
    } catch (err) {
      setError('Failed to create post.');
    }
    setLoading(false);
  };

  return (
    <div className="newpost-modal-overlay" onClick={onClose}>
      <div className="newpost-modal" onClick={e => e.stopPropagation()}>
        <button className="newpost-close" onClick={onClose} aria-label="Close"><FaTimes /></button>
        <div className="newpost-header">
          <img className="newpost-avatar" src={user?.avatar || '/default-avatar.png'} alt="avatar" />
          <span className="newpost-username">{user?.username}</span>
        </div>
        <form className="newpost-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="newpost-title"
            placeholder="Recipe Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            disabled={loading}
            maxLength={64}
          />
          <div
            className="newpost-image-drop"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
          >
            {preview ? (
              <img src={preview} className="newpost-image-preview" alt="preview" />
            ) : (
              <span className="newpost-image-placeholder"><FaCamera /> Add Food Image</span>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileRef}
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>
          <textarea
            className="newpost-steps"
            placeholder="Cooking Steps (one per line or paragraph)"
            value={steps}
            onChange={e => setSteps(e.target.value)}
            rows={6}
            disabled={loading}
          />
          {error && <div className="newpost-error">{error}</div>}
          <button type="submit" className="newpost-submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
}
