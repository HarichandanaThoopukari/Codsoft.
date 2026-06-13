import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [msg, setMsg] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, jobsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/jobs'),
        API.get('/admin/users')
      ]);
      setStats(statsRes.data.stats);
      setJobs(jobsRes.data.jobs);
      setUsers(usersRes.data.users);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId, status) => {
    try {
      await API.put(`/admin/jobs/${jobId}/approve`, { status, adminNote: note });
      setMsg(`Job ${status} successfully!`);
      setNote('');
      setSelectedJob(null);
      fetchData();
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg('Action failed');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      fetchData();
    } catch (e) { alert('Failed'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const filteredJobs = jobs.filter(j => activeTab === 'all' ? true : j.status === activeTab);

  const statusColor = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444' };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
      <div style={{ color: 'white', fontSize: '1.2rem' }}>Loading Admin Dashboard...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ background: '#0f172a', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>🔐</span>
          <span style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem' }}>JobBoard Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Welcome, {user.name}</span>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {msg && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', color: '#10b981', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>{msg}</div>}

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#0F4C81' },
              { label: 'Candidates', value: stats.totalCandidates, icon: '👤', color: '#6366f1' },
              { label: 'Employers', value: stats.totalEmployers, icon: '🏢', color: '#8b5cf6' },
              { label: 'Pending Jobs', value: stats.pendingJobs, icon: '⏳', color: '#f59e0b' },
              { label: 'Approved Jobs', value: stats.approvedJobs, icon: '✅', color: '#10b981' },
              { label: 'Rejected Jobs', value: stats.rejectedJobs, icon: '❌', color: '#ef4444' },
              { label: 'Applications', value: stats.totalApplications, icon: '📥', color: '#0F4C81' },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderTop: `4px solid ${stat.color}` }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['pending', 'approved', 'rejected', 'all', 'users'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem', textTransform: 'capitalize', background: activeTab === tab ? '#0F4C81' : 'white', color: activeTab === tab ? 'white' : '#64748b', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              {tab === 'pending' ? `⏳ Pending (${stats?.pendingJobs || 0})` :
               tab === 'approved' ? `✅ Approved` :
               tab === 'rejected' ? `❌ Rejected` :
               tab === 'all' ? `📋 All Jobs` : `👥 Users`}
            </button>
          ))}
        </div>

        {activeTab !== 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredJobs.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#64748b' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</div>
                <p>No {activeTab} jobs found</p>
              </div>
            ) : filteredJobs.map(job => (
              <div key={job._id} style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${statusColor[job.status]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>{job.title}</h3>
                      <span style={{ background: `${statusColor[job.status]}20`, color: statusColor[job.status], padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>{job.status}</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 6px' }}>🏢 {job.company} · 📍 {job.location} · ⏱ {job.jobType}</p>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 6px' }}>👤 Posted by: {job.employer?.name} ({job.employer?.email})</p>
                    <p style={{ color: '#334155', fontSize: '0.88rem', margin: '8px 0 0', lineHeight: '1.5' }}>{job.description?.substring(0, 200)}...</p>
                    {job.adminNote && <p style={{ color: '#f59e0b', fontSize: '0.82rem', marginTop: '8px' }}>📝 Admin Note: {job.adminNote}</p>}
                  </div>
                  {job.status === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
                      {selectedJob === job._id ? (
                        <>
                          <textarea
                            placeholder="Add a note (optional)..."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            style={{ padding: '8px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', resize: 'vertical', minHeight: '70px' }}
                          />
                          <button onClick={() => handleApprove(job._id, 'approved')}
                            style={{ padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem' }}>
                            ✅ Approve Job
                          </button>
                          <button onClick={() => handleApprove(job._id, 'rejected')}
                            style={{ padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem' }}>
                            ❌ Reject Job
                          </button>
                          <button onClick={() => setSelectedJob(null)}
                            style={{ padding: '8px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setSelectedJob(job._id)}
                          style={{ padding: '10px 20px', background: '#0F4C81', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem' }}>
                          Review Job
                        </button>
                      )}
                    </div>
                  )}
                  {job.status !== 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleApprove(job._id, job.status === 'approved' ? 'rejected' : 'approved')}
                        style={{ padding: '8px 16px', background: job.status === 'approved' ? '#ef4444' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                        {job.status === 'approved' ? '❌ Reject' : '✅ Approve'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {users.map(u => (
              <div key={u._id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#0F4C81', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1rem' }}>
                    {u.name?.charAt(0)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem' }}>{u.name}</p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{u.email}</p>
                    <span style={{ background: u.role === 'employer' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)', color: u.role === 'employer' ? '#6366f1' : '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>{u.role}</span>
                  </div>
                </div>
                <button onClick={() => handleDeleteUser(u._id)}
                  style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
                  Delete User
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
