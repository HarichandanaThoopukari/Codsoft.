import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import './EmployersPage.css';

const EmployersPage = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/employers').then(r => setEmployers(r.data.employers || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="employers-page">
      <div className="page-header">
        <div className="container">
          <h1>Browse Employers</h1>
          <p>Explore companies hiring on JobBoard</p>
        </div>
      </div>
      <div className="container" style={{padding:'40px 24px'}}>
        {loading ? <div className="loading-spinner"><div className="spinner"></div></div> :
          employers.length > 0 ? (
            <div className="employers-grid">
              {employers.map(emp => (
                <div key={emp._id} className="employer-card card">
                  <div className="emp-logo">{(emp.company?.name || emp.name)?.charAt(0)}</div>
                  <h3>{emp.company?.name || emp.name}</h3>
                  {emp.company?.industry && <span className="badge badge-primary">{emp.company.industry}</span>}
                  {emp.company?.location && <p className="emp-location">📍 {emp.company.location}</p>}
                  {emp.company?.description && <p className="emp-desc">{emp.company.description.substring(0,120)}...</p>}
                  {emp.company?.size && <p className="emp-size">👥 {emp.company.size} employees</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-box" style={{textAlign:'center',padding:'80px'}}>
              <div className="empty-icon">🏢</div>
              <h3>No employers yet</h3>
              <p>Be the first employer to join JobBoard!</p>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default EmployersPage;