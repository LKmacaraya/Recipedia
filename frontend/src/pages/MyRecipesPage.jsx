import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyRecipes.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

export default function MyRecipes({ user, darkMode, setCurrentPage }) {
  // If you want to personalize recipe display or filter by user, use the 'user' prop here.
  const navigate = useNavigate();
  function handleBackClick() {
    if (setCurrentPage) setCurrentPage('home');
    setTimeout(() => navigate('/'), 10); // slight delay ensures state updates
  }
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', 'view'
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [form, setForm] = useState({ name: '', image: '', steps: '' });
  const [formError, setFormError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line
  }, []);

  // Modal for viewing recipe details
  function ViewRecipeModal({ recipe, onClose, darkMode }) {
    if (!recipe) return null;
    return (
      <div className="modal show fade d-block" tabIndex="-1" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className={`modal-content home-profile-view-modal${darkMode ? ' dark' : ''}`} style={{ borderRadius: '22px', padding: '2.2rem 1.5rem', fontFamily: 'Dosis, Roboto, Arial, sans-serif' }}>
            <button className="btn-close ms-auto mb-2" onClick={onClose} aria-label="Close"></button>
            <div className="d-flex flex-column align-items-center">
              <img src={recipe.image} alt={recipe.name} className="profile-avatar-img mb-3 shadow" style={{ width: 110, height: 110, border: '4px solid #ffb347', background: '#fff', objectFit: 'cover' }} />
              <h4 className="mb-1 dosis-font" style={{ fontWeight: 700, letterSpacing: '0.02em', fontSize: '1.5rem', color: '#ff7d00' }}>{recipe.name}</h4>
              <div className="text-secondary mb-2 roboto-font" style={{ fontSize: '1.02rem', fontWeight: 400, display: 'flex', alignItems: 'center', gap: 8 }}>
                Recipe by {recipe.ownerName ? recipe.ownerName : 'you'}
              </div>
            </div>
            <div className="mt-3 w-100">
              <div className="mb-2"><span className="profile-label">Steps:</span><span className="profile-value" style={{ whiteSpace: 'pre-wrap', marginLeft: 8 }}>{recipe.steps}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fetchRecipes = () => {
    setLoading(true);
    axios.get('https://recipedia-m8ji.onrender.com/api/recipes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setRecipes(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch recipes.');
        setLoading(false);
      });
  };

  const openAddModal = () => {
    setModalType('add');
    setForm({ name: '', image: '', steps: '' });
    setCurrentRecipe(null);
    setFormError('');
    setShowModal(true);
  };

  const openViewModal = (recipe) => {
    setModalType('view');
    setCurrentRecipe(recipe);
    setShowModal(true);
  };

  const openDeleteModal = (recipe) => {
    setDeleteTarget(recipe);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };


  const openEditModal = (recipe) => {
    setModalType('edit');
    setForm({ name: recipe.name, image: recipe.image, steps: recipe.steps });
    setCurrentRecipe(recipe);
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentRecipe(null);
    setForm({ name: '', image: '', steps: '' });
    setFormError('');
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setActionLoading(true);
    try {
      if (modalType === 'add') {
        await axios.post('https://recipedia-m8ji.onrender.com/api/recipes', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setToast({ show: true, message: 'Recipe added!', type: 'success' });
      } else if (modalType === 'edit' && currentRecipe) {
        await axios.put(`https://recipedia-m8ji.onrender.com/api/recipes/${currentRecipe._id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setToast({ show: true, message: 'Recipe updated!', type: 'success' });
      }
      fetchRecipes();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Action failed');
      setToast({ show: true, message: 'Error: ' + (err.response?.data?.message || 'Action failed'), type: 'danger' });
    }
    setActionLoading(false);
  };


  const handleDelete = async (recipe) => {
    setActionLoading(true);
    try {
      await axios.delete(`https://recipedia-m8ji.onrender.com/api/recipes/${recipe._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRecipes();
      setToast({ show: true, message: 'Recipe deleted!', type: 'success' });
      closeDeleteModal();
    } catch (err) {
      setError('Failed to delete recipe.');
      setToast({ show: true, message: 'Error: ' + (err.response?.data?.message || 'Delete failed'), type: 'danger' });
    }
    setActionLoading(false);
  };

  return (
    <div className={`container py-4 px-2 px-md-4 home-main${darkMode ? ' dark' : ''}`}>
      {/* Back Button & Header */}
    <div className={`myrecipes-header-outer${darkMode ? ' dark' : ''}`}> 
      <div className="myrecipes-header-bar d-flex align-items-center gap-2">
      <button className="btn profile-back-btn" style={{fontSize: darkMode ? '1.05rem' : '1.3rem'}} onClick={() => setCurrentPage('home')} title="Back" aria-label="Back">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle'}} width="1.5em" height="1.5em"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 5 12 12 19"/></svg>
        </button>
        <span className="profile-header-title ms-2">My Recipes</span>
      </div>
      <div className="myrecipes-header-actions d-flex align-items-center gap-2 mt-3 mt-md-0 justify-content-md-end">
        <input
          type="text"
          className={`form-control home-search${darkMode ? ' dark' : ''}`}
          style={{maxWidth:220, borderRadius: '0.7rem', fontSize:'1.01rem',padding:'0.5rem 1rem'}} 
          placeholder="Search recipes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-gradient d-flex align-items-center justify-content-center" style={{padding:'0.52rem 1.15rem',borderRadius:'0.7rem',fontWeight:600,fontSize:'1rem',boxShadow:'0 2px 8px rgba(255,125,0,0.07)'}} onClick={openAddModal} title="Add Recipe">
          <FaPlus className="me-2" /> Add
        </button>
      </div>
    </div>
      {/* Toast */}
      {toast.show && (
        <div className={`home-success-modal${toast.type === 'danger' ? ' home-error-modal' : ''}${darkMode ? ' dark' : ''}`} role="alert" aria-live="polite" style={{ top: '2.2rem', right: '2.2rem' }}>
          {toast.type === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="10" cy="10" r="9.2" fill="#22bb55" /><polyline points="6.2 10.7 9 13.5 14 8.5" stroke="#fff" strokeWidth="2.2" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="10" cy="10" r="9.2" fill="#e74c3c" /><line x1="7" y1="7" x2="13" y2="13" stroke="#fff" strokeWidth="2.2" /><line x1="13" y1="7" x2="7" y2="13" stroke="#fff" strokeWidth="2.2" /></svg>
          )}
          <span style={{ marginLeft: '0.7rem', fontWeight: 600 }}>{toast.message}</span>
          <button type="button" className="btn-close btn-close-white ms-3" style={{ filter: darkMode ? 'invert(1)' : 'none' }} aria-label="Close" onClick={() => setToast({ ...toast, show: false })}></button>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {(showDeleteModal && deleteTarget) && (
  <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ background: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.15)', display:'flex', alignItems:'flex-start', justifyContent:'center', minHeight:'100vh', paddingTop:'6.5rem' }}>
    <div className="modal-dialog" role="document" style={{margin:'0 auto', maxWidth:340, width:'100%'}}>
      <div className={`modal-content position-relative${darkMode ? ' dark' : ''}`} style={{ borderRadius: '20px', padding: '1.4rem 1.7rem 1.4rem 1.7rem', boxShadow:'0 6px 28px rgba(255,125,0,0.12), 0 2px 10px rgba(0,0,0,0.13)' }}>
        <div className="modal-header border-0 pb-0" style={{paddingBottom: '0.04rem'}}>
          <h5 className="modal-title fw-bold" style={{color:'#e74c3c',letterSpacing:'0.01em'}}>Delete Recipe</h5>
          <button type="button" className="btn-close" style={{ filter: darkMode ? 'invert(1)' : 'none' }} onClick={closeDeleteModal}></button>
        </div>
        <div className="modal-body pt-0" style={{padding: '0.08rem 0 0.01rem 0'}}>
          <div style={{ fontSize: '1.04rem', color: darkMode ? '#fff' : '#222', fontWeight: 500, marginBottom: '0.45rem', lineHeight: 1.22, textAlign:'center' }}>
            Are you sure you want to delete <span style={{ color: '#e74c3c', fontWeight: 700 }}>{deleteTarget.name}</span>?
          </div>
        </div>
        <div className="modal-footer border-0 d-flex justify-content-end gap-2" style={{paddingTop:0}}>
          <button className="btn btn-secondary px-3 py-1" type="button" onClick={closeDeleteModal} disabled={actionLoading} style={{borderRadius:'0.6rem',fontWeight:600}}>Cancel</button>
          <button className="btn btn-gradient-danger px-3 py-1" type="button" onClick={async () => { await handleDelete(deleteTarget); }} disabled={actionLoading} style={{borderRadius:'0.6rem',fontWeight:600}}>Delete</button>
        </div>
      </div>
    </div>
  </div>
 )}
      {/* Recipe Cards */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row g-3 g-md-3">
          {recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(recipe => (
            <div className="col-12 col-sm-6 col-md-4" key={recipe._id}>
              <div className="card h-100 border-0 rounded-4 shadow-lg recipe-card-hover" style={{transition:'box-shadow 0.13s',background:darkMode?'#131619':'#fff',boxShadow:'0 1.5px 20px rgba(0,0,0,0.15)'}}>
                <img src={recipe.image} alt={recipe.name} className="card-img-top" style={{ height: '150px', objectFit: 'cover', borderRadius: '14px 14px 0 0', borderBottom:darkMode?'1.5px solid #23272b':'1.5px solid #f3f3f3'}} />
                {/* Owner credit under image */}
                <div className="my-recipes-owner-credit" style={{margin:'0.5rem 0 0.2rem 0',display:'flex',alignItems:'center',gap:8,fontSize:'0.98rem',color:'#888'}}>
                  Recipe by {recipe.ownerName ? recipe.ownerName : 'you'}
                </div>
                <div className="card-body d-flex flex-column align-items-start p-3" style={{gap:'0.5rem'}}>
                  <h5 className="card-title fw-bold mb-1" style={{fontSize:'1.08rem',letterSpacing:'0.01em'}}>{recipe.name}</h5>
                  <div className="d-flex gap-2 mt-auto">
                    <button className="btn btn-gradient-primary d-flex align-items-center px-3" style={{borderRadius:'0.6rem',fontWeight:600}} onClick={() => openViewModal(recipe)}>View</button>
                    <button className="btn btn-gradient-secondary d-flex align-items-center px-3" style={{borderRadius:'0.6rem',fontWeight:600}} onClick={() => openEditModal(recipe)}><FaEdit className="me-1" />Edit</button>
                    <button className="btn btn-gradient-danger d-flex align-items-center px-3" style={{borderRadius:'0.6rem',fontWeight:600}} onClick={() => openDeleteModal(recipe)}><FaTrash className="me-1" />Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Add/Edit Modal */}
      {showModal && (modalType === 'add' || modalType === 'edit') && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ background: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.15)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className={`modal-content position-relative${darkMode ? ' dark' : ''}`} style={{ borderRadius: '18px', padding: '1.5rem 1.3rem' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{modalType === 'add' ? 'Add Recipe' : 'Edit Recipe'}</h5>
                <button type="button" className="btn-close" style={{ filter: darkMode ? 'invert(1)' : 'none' }} onClick={closeModal}></button>
              </div>
              <form className="modal-body pt-0" onSubmit={handleFormSubmit} autoComplete="off">
                <div className="mb-3">
                  <label className="form-label" htmlFor="recipe-name">Recipe Name</label>
                  <input type="text" className="form-control" id="recipe-name" name="name" value={form.name} onChange={handleFormChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="recipe-image">Image URL</label>
                  <input type="text" className="form-control" id="recipe-image" name="image" value={form.image} onChange={handleFormChange} placeholder="Paste image URL" />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="recipe-steps">Steps</label>
                  <textarea className="form-control" id="recipe-steps" name="steps" value={form.steps} onChange={handleFormChange} rows={4} required></textarea>
                </div>
                {formError && <div className="alert alert-danger">{formError}</div>}
                <div className="modal-footer border-0">
                  <button className="btn btn-secondary" type="button" onClick={closeModal} disabled={actionLoading}>Cancel</button>
                  <button className="btn btn-primary" type="submit" disabled={actionLoading}>{modalType === 'add' ? 'Add' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* View Modal */}
      {showModal && modalType === 'view' && (
        <ViewRecipeModal recipe={currentRecipe} onClose={closeModal} darkMode={darkMode} />
      )}
    </div>
  );
}
