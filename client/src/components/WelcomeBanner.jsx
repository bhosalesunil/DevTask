import React from 'react';
import { Plus, Sparkles, Layers, CheckSquare } from 'lucide-react';

export const WelcomeBanner = ({ user, isAdmin, onOpenTaskModal, onOpenProjectModal }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 md:p-8 text-white shadow-lg">
      {/* Background Decorative SVG Isometric 3D Graphic (Inspired by reference) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block opacity-90 pointer-events-none">
        <svg width="220" height="180" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer glowing isometric cube base */}
          <path d="M100 20 L160 50 L100 80 L40 50 Z" fill="url(#grad1)" opacity="0.8" />
          <path d="M40 50 L100 80 L100 140 L40 110 Z" fill="url(#grad2)" opacity="0.9" />
          <path d="M160 50 L100 80 L100 140 L160 110 Z" fill="url(#grad3)" opacity="0.85" />

          {/* Floating inner cube */}
          <path d="M100 40 L140 60 L100 80 L60 60 Z" fill="#60a5fa" />
          <path d="M60 60 L100 80 L100 120 L60 100 Z" fill="#3b82f6" />
          <path d="M140 60 L100 80 L100 120 L140 100 Z" fill="#2563eb" />

          {/* Top cyan glowing screen */}
          <rect x="85" y="55" width="30" height="20" rx="4" fill="#38bdf8" opacity="0.9" />

          <defs>
            <linearGradient id="grad1" x1="40" y1="20" x2="160" y2="80">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <linearGradient id="grad2" x1="40" y1="50" x2="100" y2="140">
              <stop offset="0%" stopColor="#4c1d95" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="grad3" x1="100" y1="50" x2="160" y2="140">
              <stop offset="0%" stopColor="#6b21a8" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-[11px] font-extrabold uppercase tracking-wider text-indigo-100 border border-white/20">
          <Sparkles size={12} className="text-amber-300" />
          GOOD MORNING 👋
        </div>

        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
          Welcome back, {user?.name || 'Developer'}! 🚀
        </h1>

        <p className="text-sm text-indigo-100 font-medium leading-relaxed">
          Track real-time project progress, manage Kanban workflows, and collaborate with your team seamlessly.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenTaskModal}
            className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold text-xs rounded-2xl shadow-md transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus size={16} className="text-indigo-600" /> + Create New Task
          </button>

          {isAdmin && (
            <button
              onClick={onOpenProjectModal}
              className="px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-xs rounded-2xl backdrop-blur-md transition flex items-center gap-2"
            >
              <Plus size={16} /> + New Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
