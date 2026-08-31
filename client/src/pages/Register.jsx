import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, Briefcase, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck, Code2 } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'developer',
    title: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Welcome Heading Section */}
      <div className="relative flex items-center justify-center my-4">
        <div className="flex-grow border-t border-slate-800/80"></div>
        <span className="flex-shrink mx-3 text-white text-base font-bold tracking-wide flex items-center gap-1.5">
          Create Account <span className="inline-block">🚀</span>
        </span>
        <div className="flex-grow border-t border-slate-800/80"></div>
      </div>
      <p className="text-center text-xs text-slate-400 -mt-2 mb-6">
        Join DevTask to collaborate on modern projects
      </p>

      {/* Notifications */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1 block">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-[#101628]/90 text-white placeholder-slate-500 border border-[#232d4b] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1 block">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="rahul@devtask.com"
              className="w-full bg-[#101628]/90 text-white placeholder-slate-500 border border-[#232d4b] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-11 pr-11 py-2.5 text-sm outline-none transition-all"
            />
            {isEmailValid && (
              <CheckCircle2 
                size={17} 
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)] pointer-events-none" 
              />
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1 block">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full bg-[#101628]/90 text-white placeholder-slate-500 border border-[#232d4b] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-11 pr-11 py-2.5 text-sm outline-none transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Role Selector (Interactive Cards) */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
            Account Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('developer')}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                formData.role === 'developer'
                  ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-[#101628]/80 border-[#232d4b] text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                formData.role === 'developer' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                <Code2 size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">Developer</p>
                <p className="text-[10px] text-slate-400 truncate">Dev Access</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                formData.role === 'admin'
                  ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                  : 'bg-[#101628]/80 border-[#232d4b] text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                formData.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'
              }`}>
                <ShieldCheck size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">Admin</p>
                <p className="text-[10px] text-slate-400 truncate">Full Control</p>
              </div>
            </button>
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1 block">
            Job Title
          </label>
          <div className="relative flex items-center">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full bg-[#101628]/90 text-white placeholder-slate-500 border border-[#232d4b] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#3b82f6] shadow-[0_4px_25px_rgba(79,70,229,0.45)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.65)] hover:scale-[1.008] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer mt-3"
        >
          {loading ? (
            'Creating Account...'
          ) : (
            <>
              <span>Register Account</span>
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-5 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <span>Sign in</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};
