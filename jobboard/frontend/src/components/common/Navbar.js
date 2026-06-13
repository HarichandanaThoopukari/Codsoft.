import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💼</span>
          <span className="brand-text">Job<span>Board</span></span>
        </Link>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/jobs" className={`nav-link ${isActive('/jobs')}`} onClick={() => setMenuOpen(false)}>Jobs</Link>
          <Link to="/employers" className={`nav-link ${isActive('/employers')}`} onClick={() => setMenuOpen(false)}>Employers</Link>
          {isAuthenticated && user?.role === 'candidate' && (
            <Link to="/candidate/dashboard" className={`nav-link ${isActive('/candidate/dashboard')}`} onClick={() => setMenuOpen(false)}>My Dashboard</Link>
          )}
          {isAuthenticated && user?.role === 'employer' && (
            <Link to="/employer/dashboard" className={`nav-link ${isActive('/employer/dashboard')}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
        </div>
        <div className="navbar-auth">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          ) : (
            <div className="user-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <span className="user-name">{user?.name?.split(' ')[0]}</span>
              <span className="dropdown-arrow">▾</span>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <Link to={user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'} onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                  <Link to={user.role === 'employer' ? '/employer/profile' : '/candidate/dashboard'} onClick={() => setDropdownOpen(false)}>Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
