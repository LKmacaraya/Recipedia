import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container mt-5" style={{maxWidth: 400}}>
      <h2 className="mb-4">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <div className="mt-3 text-center">
        <span>Don't have an account? </span>
        <a href="/register">Register</a>
      </div>
    </div>
  );
}

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container mt-5" style={{maxWidth: 400}}>
      <h2 className="mb-4">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
      <div className="mt-3 text-center">
        <span>Already have an account? </span>
        <a href="/login">Login</a>
      </div>
    </div>
  );
}


function Home() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    return () => document.body.classList.remove('dark');
  }, [darkMode]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit', or 'view'
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [form, setForm] = useState({ name: '', image: '', steps: '' });
  const [formError, setFormError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Fetch recipes
  const fetchRecipes = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/recipes', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setRecipes(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch recipes.');
        setLoading(false);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchRecipes();
    // eslint-disable-next-line
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const openAddModal = () => {
    setModalType('add');
    setForm({ name: '', image: '', steps: '' });
    setCurrentRecipe(null);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (recipe) => {
    setModalType('edit');
    setForm({ name: recipe.name, image: recipe.image, steps: recipe.steps });
    setCurrentRecipe(recipe);
    setFormError('');
    setShowModal(true);
  };

  const openViewModal = (recipe) => {
    setModalType('view');
    setCurrentRecipe(recipe);
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
        await axios.post('http://localhost:5000/api/recipes', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setToast({ show: true, message: 'Recipe added!', type: 'success' });
      } else if (modalType === 'edit' && currentRecipe) {
        await axios.put(`http://localhost:5000/api/recipes/${currentRecipe._id}`, form, {
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    // Optimistically remove from UI
    const prevRecipes = [...recipes];
    setRecipes(recipes.filter(r => r._id !== deleteTarget._id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ show: true, message: 'Recipe deleted!', type: 'success' });
    } catch (err) {
      setRecipes(prevRecipes);
      setError('Failed to delete recipe.');
      setToast({ show: true, message: 'Error: ' + (err.response?.data?.message || 'Delete failed'), type: 'danger' });
    }
    setActionLoading(false);
  };


  const openDeleteModal = (recipe) => {
    setDeleteTarget(recipe);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };


  return (
    <>
      {/* App Bar */}
      <div className="w-100 d-flex justify-content-between align-items-center px-4 pt-3 pb-2" style={{position:'fixed',top:0,left:0,zIndex:1050,background:darkMode?'#181c1f':'#fff',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
        <span style={{fontFamily:'cursive',fontSize:'2rem',fontWeight:700,letterSpacing:2,color:darkMode?'#ffb347':'#ff5722'}}>Recipedia</span>
        <div className="d-flex align-items-center gap-2 gap-md-3">
          <button className="header-btn" onClick={handleLogout} title="Logout"><FaSignOutAlt /></button>
          <button className="header-btn" onClick={() => setDarkMode(!darkMode)} title="Toggle light/dark mode">{darkMode ? <FaSun /> : <FaMoon />}</button>
        </div>
      </div>
      <div style={{height:76}}></div>
      <div className={`container py-4 px-2 px-md-4${darkMode ? ' dark' : ''}`} style={{background: darkMode ? '#181c1f' : '#f8fafc', borderRadius:16, minHeight:'100vh', color: darkMode ? '#f8fafc' : '#212529', boxShadow:'0 4px 32px rgba(0,0,0,0.08)'}}>

      {/* Header Bar */}
      <div className="d-flex flex-row justify-content-end align-items-center mb-4 gap-2 gap-md-4" style={{minHeight:56}}>
        <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
          <input
            type="text"
            className="form-control"
            style={{maxWidth:220, background: darkMode ? '#23272b' : undefined, color: darkMode ? '#f8fafc' : undefined}}
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary d-flex align-items-center justify-content-center" style={{width:40,height:40}} onClick={openAddModal} title="Add Recipe"><FaPlus /></button>
        </div>
      </div>
      {toast.show && (
        <div className={`toast align-items-center text-bg-${toast.type} show position-fixed top-0 end-0 m-3`} role="alert" style={{zIndex:9999,minWidth:200, background: darkMode ? '#23272b' : undefined, color: darkMode ? '#f8fafc' : undefined}}>
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={()=>setToast({...toast,show:false})}></button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {(showDeleteModal && deleteTarget) && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{background: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.15)'}}>
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content rounded-4" style={{background: darkMode ? '#23272b' : '#fff', color: darkMode ? '#f8fafc' : '#212529', border: darkMode ? '1px solid #444' : undefined}}>
      <div className="modal-header border-0 pb-0">
        <h5 className="modal-title fw-bold">Confirm Delete</h5>
        <button type="button" className="btn-close" style={{filter: darkMode ? 'invert(1)' : 'none'}} onClick={closeDeleteModal}></button>
      </div>
      <div className="modal-body pt-0">
        <p>Are you sure you want to delete <strong>{deleteTarget.name}</strong>?</p>
      </div>
      <div className="modal-footer border-0">
        <button className="btn btn-secondary" onClick={closeDeleteModal} disabled={actionLoading}>Cancel</button>
        <button className="btn btn-danger" onClick={handleDelete} disabled={actionLoading}>Delete</button>
      </div>
    </div>
  </div>
</div>
      )}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="row g-3 g-md-4">
          {recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(recipe => (
            <div className="col-12 col-sm-6 col-md-4" key={recipe._id}>
              <div className="card h-100 border-0 rounded-4" style={{
                cursor: 'pointer',
                background: darkMode ? '#444851' : '#fff',
                color: darkMode ? '#f8fafc' : '#212529',
                boxShadow: darkMode
                  ? '0 4px 20px rgba(0,0,0,0.35), 0 1.5px 4px #222'
                  : '0 4px 16px rgba(0,0,0,0.08)'
              }} onClick={() => openViewModal(recipe)}>
                <img src={recipe.image} className="card-img-top rounded-top-4" alt={recipe.name} style={{height:200,objectFit:'cover'}} />
                <div className="card-body d-flex flex-column pb-0">
                  <h5 className="card-title fw-semibold text-truncate">{recipe.name}</h5>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex justify-content-end align-items-end gap-2 p-3" style={{background: darkMode ? '#343a40' : 'transparent', minHeight: '56px'}}>
                  <button className="btn btn-sm btn-warning text-white d-flex align-items-center justify-content-center" title="Edit" style={{width:32,height:32}} onClick={e => { e.stopPropagation(); openEditModal(recipe); }}><FaEdit /></button>
                  <button className="btn btn-sm btn-danger d-flex align-items-center justify-content-center" title="Delete" style={{width:32,height:32}} onClick={e => { e.stopPropagation(); setDeleteTarget(recipe); setShowDeleteModal(true); }}><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && modalType === 'view' && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{background: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.15)'}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content rounded-4 position-relative">
              <button type="button" className="btn-close position-absolute top-0 end-0 m-3" style={{zIndex:2, filter: darkMode ? 'invert(1)' : 'none'}} onClick={closeModal}></button>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{currentRecipe?.name}</h5>
              </div>
              <div className="modal-body pt-0">
                <img src={currentRecipe?.image} alt={currentRecipe?.name} className="img-fluid mb-3 rounded-3" style={{maxHeight:200,objectFit:'cover'}} />
                <h6 className="fw-semibold">Cooking Steps:</h6>
                <pre style={{whiteSpace:'pre-wrap',background: darkMode ? '#23272b' : '#f3f4f6', color: darkMode ? '#f8fafc' : '#212529', borderRadius:8,padding:12}}>{currentRecipe?.steps}</pre>
              </div>
              <div className="modal-footer border-0 d-flex justify-content-end gap-2">
                <button className="btn btn-primary" onClick={()=>openEditModal(currentRecipe)}>Edit</button>
                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (modalType === 'add' || modalType === 'edit') && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{background: 'rgba(0,0,0,0.3)'}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content rounded-4 position-relative" style={{background: darkMode ? '#23272b' : '#fff', color: darkMode ? '#f8fafc' : '#212529'}}>
              <button type="button" className="btn-close position-absolute top-0 end-0 m-3" style={{zIndex:2}} onClick={closeModal}></button>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{modalType === 'add' ? 'Add Recipe' : 'Edit Recipe'}</h5>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body pt-0">
                  {formError && <div className="alert alert-danger">{formError}</div>}
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input type="url" className="form-control" name="image" value={form.image} onChange={handleFormChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Recipe Name</label>
                    <input type="text" className="form-control" name="name" value={form.name} onChange={handleFormChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cooking Steps</label>
                    <textarea className="form-control" name="steps" value={form.steps} onChange={handleFormChange} rows={4} required></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={actionLoading}>Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
