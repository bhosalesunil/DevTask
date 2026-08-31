import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@devtask.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoNotice, setInfoNotice] = useState('');

  // Live email validation helper
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setInfoNotice('');
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
    setError('');
    setInfoNotice(`Selected ${demoEmail.includes('admin') ? 'Admin' : 'Developer'} demo profile`);
    setTimeout(() => setInfoNotice(''), 3000);
  };

  const handleForgotPassword = () => {
    setInfoNotice('Demo Mode: Use demo credentials below (password: password123)');
    setTimeout(() => setInfoNotice(''), 4000);
  };

  return (
    <div className="w-full">
      {/* Welcome Heading Section */}
      <div className="relative flex items-center justify-center my-4">
        <div className="flex-grow border-t border-slate-800/80"></div>
        <span className="flex-shrink mx-3 text-white text-base font-bold tracking-wide flex items-center gap-1.5">
          Welcome Back! <span className="inline-block animate-bounce">👋</span>
        </span>
        <div className="flex-grow border-t border-slate-800/80"></div>
      </div>
      <p className="text-center text-xs text-slate-400 -mt-2 mb-6">
        Sign in to continue to your account
      </p>

      {/* Notifications */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {infoNotice && (
        <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-indigo-400 flex-shrink-0" />
          <span>{infoNotice}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Address */}
        <div>
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@devtask.com"
              className="w-full bg-[#101628]/90 text-white placeholder-slate-500 border border-[#232d4b] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-11 pr-11 py-3 text-sm outline-none transition-all"
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
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#101628]/90 text-white placeholder-slate-500 border border-[#232d4b] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-11 pr-11 py-3 text-sm outline-none transition-all font-mono"
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

        {/* Auxiliary options: Remember me & Forgot password */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-[#101628] text-indigo-600 focus:ring-indigo-500/30 accent-indigo-600 cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-semibold"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#3b82f6] shadow-[0_4px_25px_rgba(79,70,229,0.45)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.65)] hover:scale-[1.008] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer mt-2"
        >
          {loading ? (
            'Authenticating...'
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Switcher */}
      <div className="mt-6">
        <div className="relative flex items-center justify-center mb-4">
          <div className="flex-grow border-t border-slate-800/80"></div>
          <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400">
            Or sign in with demo account
          </span>
          <div className="flex-grow border-t border-slate-800/80"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Admin Demo Card */}
          <button
            type="button"
            onClick={() => setDemoUser('admin@devtask.com', 'password123')}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-indigo-950/20 hover:bg-indigo-900/30 border border-indigo-500/25 hover:border-indigo-500/60 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform flex-shrink-0">
              <ShieldCheck size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-200">
                Login as <span className="font-bold text-white">Admin</span>
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                Full access to all features
              </p>
            </div>
          </button>

          {/* Developer Demo Card */}
          <button
            type="button"
            onClick={() => setDemoUser('rahul@devtask.com', 'password123')}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-500/25 hover:border-emerald-500/60 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform flex-shrink-0">
              <UserCheck size={17} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-200">
                Login as <span className="font-bold text-white">Developer</span>
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                Developer workspace access
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1 transition-colors"
        >
          <span>Register now</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};
