import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <div className="footer-logo">💼 Job<span>Board</span></div>
        <p>Connecting talented professionals with the world's best opportunities.</p>
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <h4>For Candidates</h4>
          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/candidate/dashboard">Dashboard</Link>
        </div>
        <div className="footer-col">
          <h4>For Employers</h4>
          <Link to="/employer/dashboard">Post a Job</Link>
          <Link to="/employers">Browse Employers</Link>
          <Link to="/register">Get Started</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container">
        <p>© 2024 JobBoard. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;