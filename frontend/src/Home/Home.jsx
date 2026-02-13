import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaSun, FaMoon, FaCog, FaBookOpen, FaUser } from 'react-icons/fa';
import './Home.css';
import { FaPlusCircle } from 'react-icons/fa';
import Profile from '../Profile/Profile';
import Checklist from './Checklist';
import CostCalculator from './CostCalculator';
import { FaCheckSquare, FaCalculator } from 'react-icons/fa';
import AccountSettings from '../AccountSettings/AccountSettings';
import MyRecipes from '../MyRecipes/MyRecipes';
import HomePostCard from './HomePostCard';
import './HomePostCard.css';
import RecipePickerModal from './RecipePickerModal';
import './RecipePickerModal.css';

function Home() {
  const token = localStorage.getItem('token');

  // ...existing code...
  // Save a recipe (My Recipe)
  async function handleSave(post) {
    try {
      // Try to save as recipe for current user
      await axios.post(`https://recipedia-m8ji.onrender.com/api/recipes/from-post/${post._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'Recipe saved to My Recipes!', type: 'success' });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message === 'Recipe already saved') {
        setSnackbar({ open: true, message: 'You have already saved this recipe!', type: 'info' });
      } else {
        setSnackbar({ open: true, message: 'Failed to save recipe.', type: 'error' });
      }
    }
  }
  // User state, synced with backend profile
  const [user, setUser] = useState(null); // initially null for robust checks

  // Fetch profile from backend and sync user state
  async function fetchUserProfile() {
    try {
      const res = await axios.get('https://recipedia-m8ji.onrender.com/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      setUser(null); // explicitly clear user on error
    }
  }

  // Always fetch user profile on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
const [sidebarClosing, setSidebarClosing] = useState(false);

  // Sidebar close with animation
  function handleSidebarClose() {
    setSidebarClosing(true);
    setTimeout(() => {
      setSidebarOpen(false);
      setSidebarClosing(false);
    }, 220); // match CSS animation duration
  }


  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'profile', 'settings'
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);

  // Modal that always fetches latest profile data from backend
  function HomeProfileModal({ userId, onClose, darkMode, token }) {
    const [profile, setProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
      let mounted = true;
      async function fetchProfile() {
        setLoading(true);
        try {
          const res = await window.axios.get(`https://recipedia-m8ji.onrender.com/api/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (mounted) setProfile(res.data);
        } catch (err) {
          if (mounted) {
            if (err.response && err.response.status === 404) {
              setProfile('notfound');
            } else {
              setProfile(null);
            }
          }
        } finally {
          if (mounted) setLoading(false);
        }
      }
      if (userId) fetchProfile();
      return () => { mounted = false; };
    }, [token, userId]);
    if (loading) return (
      <div className="modal show fade d-block home-profile-modal-overlay" tabIndex="-1" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className={`modal-content${darkMode ? ' dark' : ''}`} style={{borderRadius:'18px',padding:'1.5rem 1.3rem'}}>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
    if (profile === 'notfound') return (
      <div className="modal show fade d-block home-profile-modal-overlay" tabIndex="-1" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className={`modal-content${darkMode ? ' dark' : ''}`} style={{borderRadius:'18px',padding:'1.5rem 1.3rem'}}>
            <div>Profile not found.</div>
          </div>
        </div>
      </div>
    );
    if (!profile) return null;
    return (
      <div className="modal show fade d-block home-profile-modal-overlay" tabIndex="-1" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
          <div className={`modal-content home-profile-view-modal${darkMode ? ' dark' : ''}`} style={{borderRadius:'22px',padding:'2.2rem 1.5rem',fontFamily:'Dosis, Roboto, Arial, sans-serif'}}>
          <button className="btn-close ms-auto mb-2" onClick={onClose} aria-label="Close"></button>
          <div className="d-flex flex-column align-items-center">
            <img src={profile.avatar && profile.avatar.length > 0 ? (profile.avatar.startsWith('http') ? profile.avatar : `http://localhost:5000${profile.avatar}`) : '/default-avatar.png'} alt="Profile" className="profile-avatar-img mb-3 shadow" style={{width:110,height:110,border:'4px solid #ffb347',background:'#fff',objectFit:'cover'}} />
            <h4 className="mb-1 dosis-font" style={{fontWeight:700,letterSpacing:'0.02em',fontSize:'1.5rem',color:'#ff7d00'}}>{profile.name || profile.username || 'No Name'}</h4>
            <div className="text-secondary mb-2 roboto-font" style={{fontSize:'1.02rem',fontWeight:400}}>{profile.email}</div>
          </div>
          <div className="mt-3 w-100">
            <div className="d-flex flex-wrap align-items-center mb-2"><span className="profile-label">Address:</span><span className="profile-value">{profile.address || <span className="text-muted">(not set)</span>}</span></div>
            <div className="d-flex flex-wrap align-items-center mb-2"><span className="profile-label">Gender:</span><span className="profile-value">{profile.gender || <span className="text-muted">(not set)</span>}</span></div>
            <div className="d-flex flex-wrap align-items-center mb-2"><span className="profile-label">Hobbies:</span><span className="profile-value">{profile.hobbies || <span className="text-muted">(not set)</span>}</span></div>
            <div className="d-flex flex-wrap align-items-start"><span className="profile-label">Bio:</span><span className="profile-value" style={{whiteSpace:'pre-wrap'}}>{profile.bio || <span className="text-muted">(not set)</span>}</span></div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  const [darkMode, setDarkMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });
  const [viewPost, setViewPost] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  
  const navigate = useNavigate();

  
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    return () => document.body.classList.remove('dark');
  }, [darkMode]);

  

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (currentPage === 'home') {
      fetchUserProfile();
      fetchPosts();
    }
    // eslint-disable-next-line
  }, [navigate, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://recipedia-m8ji.onrender.com/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load posts.');
      setLoading(false);
    }
  };

  // Optimistic comment handler
  const handleComment = async (post, text) => {
    const userId = user._id;
    // Prepare optimistic comment object
    const optimisticComment = {
      _id: `optimistic-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      user: {
        _id: userId,
        username: user.username,
        avatar: user.avatar
      }
    };
    // Optimistically update UI
    setPosts(prevPosts => prevPosts.map(p =>
      p._id === post._id
        ? { ...p, comments: [...p.comments, optimisticComment] }
        : p
    ));
    try {
      const res = await axios.post(`https://recipedia-m8ji.onrender.com/api/posts/${post._id}/comment`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Replace optimistic comment with real one (by refetching or updating in place)
      setPosts(prevPosts => prevPosts.map(p =>
        p._id === post._id
          ? {
              ...p,
              comments: [
                ...p.comments.filter(c => !c._id.startsWith('optimistic-')),
                {
                  ...res.data,
                  user: {
                    _id: userId,
                    username: user.username,
                    avatar: user.avatar
                  }
                }
              ]
            }
          : p
      ));
    } catch {
      // Remove optimistic comment on failure
      setPosts(prevPosts => prevPosts.map(p =>
        p._id === post._id
          ? { ...p, comments: p.comments.filter(c => !c._id.startsWith('optimistic-')) }
          : p
      ));
      setSnackbar({ open: true, message: 'Failed to add comment.', type: 'error' });
    }
  };
  const handleHeart = async (post) => {
    const userId = user._id;
    // Optimistically update UI
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p._id === post._id
          ? {
              ...p,
              hearts: p.hearts.includes(userId)
                ? p.hearts.filter(id => id !== userId)
                : [...p.hearts, userId]
            }
          : p
      )
    );
    axios.post(`https://recipedia-m8ji.onrender.com/api/posts/${post._id}/heart`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .catch(() => {
        // Revert UI if backend fails
        setPosts(prevPosts => prevPosts.map(p => (p._id === post._id ? post : p)));
        setSnackbar({ open: true, message: 'Failed to update heart.', type: 'error' });
      });
  };
  const handleImageClick = (post) => {
    setViewPost(post);
    setViewModal(true);
  };
  const closeModal = () => {
    setViewModal(false);
    setViewPost(null);
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (currentPage === 'profile') {
    return (
      <>
        <Profile
          user={user}
          onSave={fetchUserProfile}
          darkMode={darkMode}
          setCurrentPage={setCurrentPage}
        />
      </>
    );
  }
  if (currentPage === 'myrecipes') {
    return (
      <>
        <MyRecipes user={user} darkMode={darkMode} setCurrentPage={setCurrentPage} />
      </>
    );
  }
  if (currentPage === 'settings') {
    return (
      <>
        <AccountSettings darkMode={darkMode} setCurrentPage={setCurrentPage} onSave={updated => {
          setUser(u => ({ ...u, ...updated }));
          fetchUserProfile();
        }} />
      </>
    );
  }
  if (currentPage === 'checklist') {
    return (
      <Checklist user={user} token={token} setCurrentPage={setCurrentPage} />
    );
  }
  if (currentPage === 'costcalculator') {
    return (
      <CostCalculator setCurrentPage={setCurrentPage} darkMode={darkMode} />
    );
  }
  return (
    <>
      {/* App Bar */}
      <div className={`w-100 d-flex justify-content-between align-items-center px-4 pt-3 pb-2 home-appbar${darkMode ? ' dark' : ''}`}>
        <h1 className="recipedia-logo home-logo">Recipedia.</h1>
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
      {showProfileModal && selectedProfileUserId && (
        <HomeProfileModal
          key={selectedProfileUserId}
          userId={selectedProfileUserId}
          token={token}
          darkMode={darkMode}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedProfileUserId(null);
          }}
          debug={true}
        />
      )}
      {/* Sidebar overlay and drawer */}
      {(sidebarOpen || sidebarClosing) && (
        <>
          <div className="home-sidebar-overlay" onClick={() => handleSidebarClose()}></div>
          <aside className={`home-sidebar${darkMode ? ' dark' : ''}${sidebarClosing ? ' closing' : ''}`} tabIndex="-1">
            <div className="home-sidebar-header d-flex justify-content-between align-items-center px-3 pt-3 pb-2">
              <span className="fw-bold">Menu</span>
              <button className="btn-close" style={{zIndex:2}} onClick={() => handleSidebarClose()} aria-label="Close sidebar"></button>
            </div>
            {/* Sidebar Profile Picture */}
            <div className="home-sidebar-profilepic mb-3 d-flex flex-column align-items-center">
              <img
                src={user?.avatar && user.avatar.startsWith('/') ? `https://recipedia-m8ji.onrender.com${user.avatar}` : (user?.avatar || 'https://media.istockphoto.com/id/2219141543/photo/3d-render-chef-woman-avatar-for-culinary-and-restaurant-illustration.webp?a=1&b=1&s=612x612&w=0&k=20&c=V6BlF7eOGuqtVVWNC1wuD84zjVmi95Z5UPI1Klt6OQA=')}
                alt="Profile"
                className="home-sidebar-avatar-img"
                style={{cursor:'pointer'}}
                onClick={() => {
                  if (user && user._id) {
                    setSelectedProfileUserId(user._id);
                    setShowProfileModal(true);
                  }
                }}
              />
            </div>
            <div className="home-sidebar-options">
              <button className="home-sidebar-link" onClick={() => setCurrentPage('profile')}>
                <FaUser className="me-2" /> Profile
              </button>             
              <button className="home-sidebar-link" onClick={() => setCurrentPage('myrecipes')}><FaBookOpen className="me-2" /> My Recipes</button>
              <button className="home-sidebar-link" onClick={() => setCurrentPage('checklist')}>
  <FaCheckSquare className="me-2" /> Checklist
</button>
<button className="home-sidebar-link" onClick={() => setCurrentPage('costcalculator')}>
  <FaCalculator className="me-2" /> Cost Calculator
</button>
              <button className="home-sidebar-link" onClick={() => setCurrentPage('settings')}>
                <FaCog className="me-2" /> Account Settings
              </button>
            </div>
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
        
        {/* Floating Action Button for New Post */}
        <button
          className="fab-newpost"
          aria-label="Create New Post"
          onClick={() => setShowNewPost(true)}
        >
          <FaPlusCircle />
        </button>
        {/* Social Feed */}
        <div className="home-feed-container">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : posts.length === 0 ? (
            <div className="no-recipes-message">No recipes yet. Be the first to post!</div>
          ) : (
            posts.map(post => (
              <HomePostCard
                key={post._id}
                post={post}
                userId={user ? user._id : undefined}
                onHeart={handleHeart}
                onSave={handleSave}
                onComment={handleComment}
                onImageClick={handleImageClick}
                onDelete={async (post) => {
                  await axios.delete(`https://recipedia-m8ji.onrender.com/api/posts/${post._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  fetchPosts();
                }}
                onSnackbar={(msg, type) => setSnackbar({ open: true, message: msg, type })}
                // Feed avatar click: fetch and show full profile in modal
                onAvatarClick={userObj => {
                  console.log('Avatar clicked:', userObj);
                  if (userObj && userObj._id) {
                    setSelectedProfileUserId(userObj._id);
                    setShowProfileModal(true);
                  }
                }}
              />
            ))
          )}
        </div>

        {/* Modal for Recipe Steps */}
        {viewModal && viewPost && (
          <div className="modal show fade d-block" tabIndex="-1" style={{background: 'rgba(0,0,0,0.40)'}} onClick={closeModal}>
            <div className="modal-dialog modal-dialog-centered" style={{maxWidth:'500px'}} onClick={e => e.stopPropagation()}>
              <div className="modal-content" style={{borderRadius:'22px',padding:'1.6rem 1.2rem',fontFamily:'Dosis, Roboto, Arial, sans-serif'}}>
                <button className="btn-close ms-auto mb-2" onClick={closeModal} aria-label="Close"></button>
                <h4 className="fw-bold mb-2">{viewPost.title}</h4>
                <img src={viewPost.image} alt={viewPost.title} className="img-fluid mb-3 rounded-3" style={{maxHeight:'260px',objectFit:'cover',margin:'0 auto',display:'block'}} />
                <div>
                  <h6 className="fw-semibold">Cooking Steps:</h6>
                  <pre style={{whiteSpace:'pre-wrap',background:'#f1f8e9',borderRadius:'10px',padding:'1rem',fontSize:'1.07rem',color:'#37474f'}}>{viewPost.steps}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Recipe Picker Modal */}
        <RecipePickerModal
          show={showNewPost}
          onClose={() => setShowNewPost(false)}
          user={user}
          token={token}
          onPick={async (recipe) => {
            // Send recipe as a new post
            await axios.post('https://recipedia-m8ji.onrender.com/api/posts', {
              title: recipe.name || recipe.title,
              steps: recipe.steps,
              image: recipe.image,
              recipeId: recipe._id
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setShowNewPost(false);
            fetchPosts();
          }}
        />
      {/* Snackbar */}
    {snackbar.open && (
      <div className={`home-snackbar home-snackbar-${snackbar.type}`} onClick={() => setSnackbar({ ...snackbar, open: false })}>
        {snackbar.message}
      </div>
    )}
    </div>
    </div>
    </>
  );
}

export default Home;
