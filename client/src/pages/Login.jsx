import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-6">
        Sign in to your account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@devtask.com"
              className="form-input !pl-11"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input !pl-11"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full py-3 mt-2 text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
        </button>
      </form>

      {/* Demo Credentials Quick Switcher */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5 justify-center">
          <ShieldCheck size={16} className="text-indigo-600" /> One-Click Demo Credentials:
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setDemoUser('admin@devtask.com', 'password123')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
          >
            <UserCheck size={14} /> Admin
          </button>
          <button
            type="button"
            onClick={() => setDemoUser('rahul@devtask.com', 'password123')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
          >
            <UserCheck size={14} /> Developer
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline">
          Register now
        </Link>
      </div>
    </div>
  );
};
