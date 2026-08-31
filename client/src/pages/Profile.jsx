import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Shield, Check, Lock, Camera } from 'lucide-react';

export const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    title: user?.title || '',
    avatar: user?.avatar || '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setSuccessMsg('Profile updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">User Profile Settings</h1>
        <p className="text-xs text-gray-500">Manage your personal information and credentials</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check size={16} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="card">
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-100 dark:border-gray-800">
          <img
            src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500/20 shadow-md"
          />
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-xs text-indigo-600 font-semibold">{user?.title}</p>
            <span className="badge badge-in_progress mt-1.5 inline-flex items-center gap-1">
              <Shield size={12} /> {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read-Only)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="form-input opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Full Stack Developer"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL</label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://..."
              className="form-input"
            />
          </div>

          <div className="form-group pt-2 border-t border-gray-100 dark:border-gray-800">
            <label className="form-label">Change Password (leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password (min 6 chars)"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary text-xs font-bold w-full py-2.5"
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
