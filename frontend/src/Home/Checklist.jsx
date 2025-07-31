import React, { useState, useEffect } from 'react';
import './Checklist.css';
import axios from 'axios';

import { FaArrowLeft } from 'react-icons/fa';

export default function Checklist({ user, token, setCurrentPage }) {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    // Fetch checklist items from backend
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError('');
    axios.get('http://localhost:5000/api/checklist', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load checklist.');
        setLoading(false);
      });
  }, [token]);

  const handleAdd = async () => {
    if (!input.trim()) return;
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/checklist', { text: input }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => [res.data, ...prev]);
      setInput('');
    } catch {
      setError('Failed to add item.');
    }
  };

  const handleToggle = async (id) => {
    const item = items.find(i => i._id === id);
    if (!item) return;
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/checklist/${id}`, { done: !item.done }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.map(i => i._id === id ? res.data : i));
    } catch {
      setError('Failed to update item.');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/checklist/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(i => i._id !== id));
    } catch {
      setError('Failed to delete item.');
    }
  };

  const handleEdit = async (id, newText) => {
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/checklist/${id}`, { text: newText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.map(i => i._id === id ? res.data : i));
    } catch {
      setError('Failed to update item.');
    }
  };

  return (
    <div className="checklist-container">
      <button
        className="checklist-back-btn"
        style={{ background: 'none', border: 'none', color: '#ff7d00', fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 600 }}
        onClick={() => setCurrentPage && setCurrentPage('home')}
      >
        <FaArrowLeft style={{ marginRight: '0.5em' }} /> Back to Home
      </button>
      <h2 className="checklist-title">My Ingredient Checklist</h2>
      <div className="checklist-input-row">
        <input
          className="checklist-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task..."
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
        />
        <button className="checklist-add-btn" onClick={handleAdd}>Add</button>
      </div>
      {loading ? (
        <div className="checklist-loading">Loading...</div>
      ) : error ? (
        <div className="checklist-error">{error}</div>
      ) : (
        <ul className="checklist-list">
          {items.map(item => (
            <li key={item._id} className={`checklist-item${item.done ? ' done' : ''}`}>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => handleToggle(item._id)}
              />
              <EditableText value={item.text} onSave={newText => handleEdit(item._id, newText)} />
              <button className="checklist-delete-btn" onClick={() => handleDelete(item._id)}>&times;</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EditableText({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  useEffect(() => { setText(value); }, [value]);

  const handleBlur = () => {
    setEditing(false);
    if (text.trim() && text !== value) onSave(text);
  };

  return editing ? (
    <input
      className="checklist-edit-input"
      value={text}
      autoFocus
      onChange={e => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={e => { if (e.key === 'Enter') handleBlur(); }}
    />
  ) : (
    <span className="checklist-text" onClick={() => setEditing(true)}>{value}</span>
  );
}
