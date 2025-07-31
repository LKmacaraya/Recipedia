import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaRegCommentDots, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import './HomePostCard.css';


const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

import { FaTrash } from 'react-icons/fa';

export default function HomePostCard({ post, userId, onHeart, onSave, onComment, onImageClick, onDelete, onSnackbar, onAvatarClick }) {
  
  const [showComments, setShowComments] = useState(false);

  const isHearted = post.hearts.includes(userId);
  const isSaved = post.saves.includes(userId);

  const isOwner = String(post.currentPostUserId) === String(userId);
  return (
    <div className="home-post-card home-post-card-animate">
      <div className="home-post-header">
        <div className="home-post-header-avatar-wrap">
          <img
            className="home-post-avatar"
            src={
              post.user?.avatar
                ? post.user.avatar.startsWith('http')
                  ? post.user.avatar
                  : `http://localhost:5000${post.user.avatar}`
                : '/default-avatar.png'
            }
            alt="avatar"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (typeof onAvatarClick === 'function') onAvatarClick(post.user);
            }}
          />
        </div>
        <div className="home-post-userinfo">
          <span className="home-post-username">{post.user?.username}</span>
          <span className="home-post-date">{formatDate(post.createdAt)}</span>
        </div>
      </div>
      <div className="home-post-image-container" onClick={() => onImageClick(post)}>
        <img className="home-post-image" src={post.image} alt={post.title} />
      </div>
      <div className="home-post-credit">Recipe by <span className="home-post-credit-name">{post.user?.username}</span></div>
      <div className="home-post-title">{post.title}</div>
      <div className="home-post-actions">
        <button
          className={`home-heart-btn${isHearted ? ' hearted' : ''}`}
          aria-label={isHearted ? 'Unheart post' : 'Heart post'}
          onClick={() => onHeart(post)}
        >
          {isHearted ? <FaHeart size={22} color="#e53935" /> : <FaRegHeart size={22} />}
          <span>{post.hearts.length}</span>
        </button>
        <button
          className="home-comment-btn"
          aria-label="Show comments"
          onClick={() => setShowComments(!showComments)}
        >
          <FaRegCommentDots size={22} /> <span>{post.comments.length}</span>
        </button>
        <button
          className={`home-save-btn${isSaved ? ' saved' : ''}`}
          aria-label={isSaved ? 'Unsave post' : 'Save post'}
          onClick={() => onSave(post)}
        >
          {isSaved ? <FaBookmark size={22} /> : <FaRegBookmark size={22} />}
        </button>
        {isOwner && (
          <button
            className="home-delete-btn visible"
            style={{ alignItems: 'center', justifyContent: 'center' }}
            onClick={async () => {
              if (window.confirm('Delete this post?')) {
                await onDelete(post);
                onSnackbar && onSnackbar('Post deleted', 'success');
              }
            }}
            aria-label="Delete post"
            title="Delete Post"
          >
            <FaTrash size={22} />
          </button>
        )}
      </div>
      {showComments && (
        <div className="home-post-comments">
          {post.comments.map((c) => (
            <div key={c._id} className="home-post-comment">
              <img
                className="home-post-comment-avatar"
                src={
                  c.user?.avatar
                    ? c.user.avatar.startsWith('http')
                      ? c.user.avatar
                      : `http://localhost:5000${c.user.avatar}`
                    : '/default-avatar.png'
                }
                alt="avatar"
              />
              <div className="home-post-comment-body">
                <span className="home-post-comment-username">{c.user?.username}</span>
                <span className="home-post-comment-date">{formatDate(c.createdAt)}</span>
                <div className="home-post-comment-text">{c.text}</div>
              </div>
            </div>
          ))}
          <form className="home-post-comment-form" onSubmit={e => { e.preventDefault(); onComment(post, e.target.elements.comment.value); e.target.reset(); }}>
            <input name="comment" className="home-post-comment-input" placeholder="Write a comment..." required />
            <button type="submit" className="home-post-comment-submit">Post</button>
          </form>
        </div>
      )}

    </div>
  );
}
