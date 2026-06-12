import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import './Dashboard.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    company: user?.company || { name: '', description: '', website: '', industry: '', size: '', location: '' }
  });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg({ type: '', text: '' });
    try {
      const { data } = await API.put('/users/profile', { ...form, company: JSON.stringify(form.company) });
      updateUser(data.user);
      setMsg({ type: 'success', text: 'Profile updated!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed' });
    } finally { setSaving(false); }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header"><div className="container"><h1>Employer Profile</h1></div></div>
      <div className="container" style={{maxWidth:'700px',padding:'40px 24px'}}>
        <div className="dash-section">
          <h2>Company Information</h2>
          {msg.text && <div className={`alert alert-${msg.type === 'success' ? 'success' : 'error'}`}>{msg.text}</div>}
          <form onSubmit={handleSave} className="profile-form-grid">
            <div className="form-group"><label className="form-label">Your Name</label>
              <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Phone</label>
              <input className="form-control" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div className="form-group form-full"><label className="form-label">Company Name</label>
              <input className="form-control" value={form.company.name} onChange={e => setForm({...form, company: {...form.company, name: e.target.value}})} /></div>
            <div className="form-group form-full"><label className="form-label">Company Description</label>
              <textarea className="form-control" rows="3" value={form.company.description} onChange={e => setForm({...form, company: {...form.company, description: e.target.value}})} /></div>
            <div className="form-group"><label className="form-label">Industry</label>
              <input className="form-control" value={form.company.industry} onChange={e => setForm({...form, company: {...form.company, industry: e.target.value}})} /></div>
            <div className="form-group"><label className="form-label">Company Size</label>
              <select className="form-control" value={form.company.size} onChange={e => setForm({...form, company: {...form.company, size: e.target.value}})}>
                <option value="">Select size</option><option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option><option>500+</option>
              </select></div>
            <div className="form-group"><label className="form-label">Location</label>
              <input className="form-control" value={form.company.location} onChange={e => setForm({...form, company: {...form.company, location: e.target.value}})} /></div>
            <div className="form-group"><label className="form-label">Website</label>
              <input className="form-control" value={form.company.website} onChange={e => setForm({...form, company: {...form.company, website: e.target.value}})} /></div>
            <div className="form-full" style={{display:'flex',justifyContent:'flex-end'}}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;