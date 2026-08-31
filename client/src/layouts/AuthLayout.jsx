import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layers } from 'lucide-react';

export const AuthLayout = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070a13] relative overflow-hidden p-4 sm:p-6 select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Cyber Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#818cf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />

      {/* Ambient Cyber Geometric Lines */}
      <div className="absolute top-12 left-12 w-32 h-32 border-l border-t border-indigo-500/10 rounded-tl-3xl pointer-events-none hidden md:block" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-r border-b border-indigo-500/10 rounded-br-3xl pointer-events-none hidden md:block" />

      {/* Main Glass Container */}
      <div className="w-full max-w-[460px] cyber-card p-6 sm:p-9 relative z-10 my-8">
        {/* App Brand Header */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#6366f1] via-[#4f46e5] to-[#9333ea] flex items-center justify-center mx-auto mb-3.5 shadow-[0_8px_25px_rgba(99,102,241,0.45)] ring-1 ring-white/20 transition-transform hover:scale-105 duration-300">
            <Layers size={28} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-0.5">
            <span>Dev</span>
            <span className="text-[#818cf8] drop-shadow-[0_0_12px_rgba(129,140,248,0.4)]">Task</span>
          </h1>
          <p className="text-xs font-medium text-slate-400 mt-1 tracking-wide">
            Full Stack Project & Task Management Platform
          </p>
        </div>

        {/* Page Content (Login / Register) */}
        <Outlet />
      </div>
    </div>
  );
};
