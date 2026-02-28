import React, { useEffect, useState } from 'react';
import './RecipePickerModal.css';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function RecipePickerModal({ show, onClose, onPick, user, token }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) return;
    setLoading(true);
    axios.get('https://recipedia-m8ji.onrender.com/api/recipes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setRecipes(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load recipes');
        setLoading(false);
      });
  }, [show, token]);

  if (!show) return null;

  return (
    <div className="recipepicker-modal-overlay" onClick={onClose}>
      <div className="recipepicker-modal" onClick={e => e.stopPropagation()}>
        <button className="recipepicker-close" onClick={onClose} aria-label="Close"><FaTimes /></button>
        <h3 className="recipepicker-title">Select a Recipe to Post</h3>
        {loading ? <div className="recipepicker-loading">Loading...</div> : null}
        {error ? <div className="recipepicker-error">{error}</div> : null}
        <div className="recipepicker-list">
          {recipes.length === 0 && !loading ? <div className="recipepicker-empty">No recipes found.</div> : null}
          {recipes.map(recipe => (
            <div
              className="recipepicker-item"
              key={recipe._id}
              onClick={() => onPick(recipe)}
            >
              <img src={recipe.image || '/default-food.png'} alt="food" className="recipepicker-img" />
              <div className="recipepicker-info">
                <div className="recipepicker-name">{recipe.name || recipe.title}</div>
                <div className="recipepicker-steps">{recipe.steps?.slice(0, 80)}{recipe.steps?.length > 80 ? '...' : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
