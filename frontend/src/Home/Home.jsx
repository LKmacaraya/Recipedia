import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import './Home.css';
import Profile from '../Profile/Profile';

function Home() {
  // User state, synced with backend profile
  const [user, setUser] = useState({
    name: 'New User',
    email: 'user@email.com',
    address: '',
    gender: 'Rather not Say',
    hobbies: '',
    bio: '',
    avatar: ''
  });

  // Fetch profile from backend and sync user state
  async function fetchUserProfile() {
    try {
      const res = await axios.get('http://localhost:5000/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      // Optionally show error/toast
    }
  }
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'profile'
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Modal that always fetches latest profile data from backend
  function HomeProfileModal({ profile: profileProp, onClose, darkMode, token }) {
    const [profile, setProfile] = React.useState(profileProp || null);
    const [loading, setLoading] = React.useState(!profileProp);
    React.useEffect(() => {
      let mounted = true;
      if (profileProp) {
        setProfile(profileProp);
        setLoading(false);
        return;
      }
      async function fetchProfile() {
        setLoading(true);
        try {
          const res = await window.axios.get('http://localhost:5000/api/profile/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (mounted) setProfile(res.data);
        } catch (err) {
          if (mounted) setProfile(null);
        } finally {
          if (mounted) setLoading(false);
        }
      }
      fetchProfile();
      return () => { mounted = false; };
    }, [token, profileProp]);
    if (loading) return (
      <div className="modal show fade d-block home-profile-modal-overlay" tabIndex="-1" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className={`modal-content${darkMode ? ' dark' : ''}`} style={{borderRadius:'18px',padding:'1.5rem 1.3rem'}}>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
    if (!profile) return (
      <div className="modal show fade d-block home-profile-modal-overlay" tabIndex="-1" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className={`modal-content${darkMode ? ' dark' : ''}`} style={{borderRadius:'18px',padding:'1.5rem 1.3rem'}}>
            <div>Profile not found.</div>
          </div>
        </div>
      </div>
    );
    return (
      <div className="modal show fade d-block home-profile-modal-overlay" tabIndex="-1" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className={`modal-content${darkMode ? ' dark' : ''}`} style={{borderRadius:'18px',padding:'1.5rem 1.3rem'}}>
            <button className="btn-close ms-auto mb-2" onClick={onClose} aria-label="Close"></button>
            <div className="d-flex flex-column align-items-center">
              <img
                src={profile.avatar && profile.avatar.startsWith('/') ? `http://localhost:5000${profile.avatar}` : (profile.avatar || 'https://media.istockphoto.com/id/2219141543/photo/3d-render-chef-woman-avatar-for-culinary-and-restaurant-illustration.webp?a=1&b=1&s=612x612&w=0&k=20&c=V6BlF7eOGuqtVVWNC1wuD84zjVmi95Z5UPI1Klt6OQA=')}
                alt="Profile"
                className="profile-avatar-img mb-2"
                style={{width:90,height:90}}
              />
              <h4 className="fw-bold mb-1">{profile.name || 'No Name'}</h4>
              <div className="text-secondary mb-2">{profile.email}</div>
            </div>
            <div className="mt-2">
              <div><strong>Address:</strong> {profile.address || <span className="text-muted">(not set)</span>}</div>
              <div><strong>Gender:</strong> {profile.gender || <span className="text-muted">(not set)</span>}</div>
              <div><strong>Hobbies:</strong> {profile.hobbies || <span className="text-muted">(not set)</span>}</div>
              <div><strong>Bio:</strong> <span style={{whiteSpace:'pre-wrap'}}>{profile.bio || <span className="text-muted">(not set)</span>}</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [darkMode, setDarkMode] = useState(false);
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

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal || showDeleteModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [showModal, showDeleteModal]);
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    return () => document.body.classList.remove('dark');
  }, [darkMode]);

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
    fetchUserProfile(); // Fetch user profile on mount
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

  if (currentPage === 'profile') {
    return (
      <>
        <div className={`w-100 d-flex align-items-center px-4 pt-3 pb-2 home-appbar${darkMode ? ' dark' : ''}`}
             style={{justifyContent:'flex-start'}}>
          <button className="btn btn-link px-0 me-3" style={{fontSize:'1.6rem'}} onClick={()=>setCurrentPage('home')} title="Back" aria-label="Back">&#8592;</button>
          <span className="fs-4 fw-bold">Edit Profile</span>
        </div>
        <Profile
          user={user}
          onSave={() => {
            fetchUserProfile(); // Sync after profile save
          }}
          darkMode={darkMode}
        />
      </>
    );
  }
  return (
    <>
      {/* App Bar */}
      <div className={`w-100 d-flex justify-content-between align-items-center px-4 pt-3 pb-2 home-appbar${darkMode ? ' dark' : ''}`}>
        <h1 className="recipedia-logo home-logo" style={{color: darkMode ? '#ffb347' : '#ff7d00'}}>Recipedia.</h1>
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Hamburger menu button */}
          <button className="header-btn home-hamburger" onClick={() => setSidebarOpen(true)} title="Open menu" aria-label="Open menu">
            <span className="home-hamburger-bar"></span>
            <span className="home-hamburger-bar"></span>
            <span className="home-hamburger-bar"></span>
          </button>
        </div>
      </div>
      {/* Profile Modal */}
      {showProfileModal && (
        <HomeProfileModal
          key={user.avatar || user.email}
          profile={user}
          token={token}
          darkMode={darkMode}
          onClose={() => setShowProfileModal(false)}
        />
      )}
      {/* Sidebar overlay and drawer */}
      {sidebarOpen && (
        <>
          <div className="home-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
          <aside className={`home-sidebar${darkMode ? ' dark' : ''}`} tabIndex="-1">
            <div className="home-sidebar-header d-flex justify-content-between align-items-center px-3 pt-3 pb-2">
              <span className="fw-bold">Menu</span>
              <button className="btn-close" style={{zIndex:2}} onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"></button>
            </div>
            {/* Sidebar Profile Picture */}
            <div className="home-sidebar-profilepic mb-3 d-flex flex-column align-items-center">
              <img
                src={user?.avatar && user.avatar.startsWith('/') ? `http://localhost:5000${user.avatar}` : (user?.avatar || 'https://media.istockphoto.com/id/2219141543/photo/3d-render-chef-woman-avatar-for-culinary-and-restaurant-illustration.webp?a=1&b=1&s=612x612&w=0&k=20&c=V6BlF7eOGuqtVVWNC1wuD84zjVmi95Z5UPI1Klt6OQA=')}
                alt="Profile"
                className="home-sidebar-avatar-img"
                style={{cursor:'pointer'}}
                onClick={() => setShowProfileModal(true)}
              />
            </div>
            <ul className="home-sidebar-options list-unstyled px-3">
              <li><button className="home-sidebar-link" onClick={() => { setCurrentPage('profile'); setSidebarOpen(false); }}>Profile</button></li>
              <li><button className="home-sidebar-link">My Recipes</button></li>
              <li><button className="home-sidebar-link">Favorites</button></li>
            </ul>
            <div className="home-sidebar-footer mt-auto px-3 pb-4 d-flex flex-column gap-2">
              <button className="btn btn-outline-secondary w-100 d-flex align-items-center gap-2 justify-content-center" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
              <button className="btn btn-outline-secondary w-100 d-flex align-items-center gap-2 justify-content-center" onClick={() => setDarkMode(!darkMode)}>{darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'} Mode</button>
            </div>
          </aside>
        </>
      )}

      <div className="home-appbar-spacer"></div>
      <div className={`container py-4 px-2 px-md-4 home-main${darkMode ? ' dark' : ''}`}>

      {/* Header Bar */}
      <div className="d-flex flex-row justify-content-end align-items-center mb-4 gap-2 gap-md-4 home-headerbar">
        <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
          <input
            type="text"
            className={`form-control home-search${darkMode ? ' dark' : ''}`}
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary d-flex align-items-center justify-content-center home-add-btn" onClick={openAddModal} title="Add Recipe"><FaPlus /></button>
        </div>
      </div>
      {toast.show && (
        <div className={`toast align-items-center text-bg-${toast.type} show position-fixed top-0 end-0 m-3 home-toast${darkMode ? ' dark' : ''}`} role="alert">
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
                <p><span className="home-delete-confirm-text">Are you sure you want to delete</span> <strong>{deleteTarget.name}</strong>?</p>
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
            <div className="modal-content rounded-4 position-relative home-modal-content">
              <button type="button" className={`btn-close position-absolute top-0 end-0 m-3 home-modal-close${darkMode ? ' dark' : ''}`} onClick={closeModal}></button>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{currentRecipe?.name}</h5>
              </div>
              <div className="modal-body pt-0">
                <img src={currentRecipe?.image} alt={currentRecipe?.name} className="img-fluid mb-3 rounded-3 home-modal-img" />
                <h6 className="fw-semibold">Cooking Steps:</h6>
                <pre className={`home-steps${darkMode ? ' dark' : ''}`}>{currentRecipe?.steps}</pre>
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

export default Home;
