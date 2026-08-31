import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

export const WelcomeBanner = ({ user, isAdmin, onOpenTaskModal, onOpenProjectModal }) => {
  const userName = user?.name || 'kuldip mane';

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#2b54ff] via-[#4f46e5] to-[#7c3aed] rounded-[28px] p-7 md:p-9 text-white shadow-lg">
      {/* Subtle Background Glow Spheres */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Right Side 3D Isometric Illustration (Faithful match to reference design) */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-95 pointer-events-none select-none">
        <svg width="340" height="200" viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Window background gradient */}
            <linearGradient id="windowGrad" x1="0" y1="0" x2="300" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#312e81" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.95" />
            </linearGradient>
            
            {/* Chart fill gradient */}
            <linearGradient id="chartLineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>

            {/* Floating Purple Card Gradient */}
            <linearGradient id="purpleCardGrad" x1="0" y1="0" x2="80" y2="80">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

            {/* Pie Disk Gradient */}
            <linearGradient id="pieGrad" x1="0" y1="0" x2="60" y2="60">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            
            <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Main SaaS Dashboard Window Frame */}
          <rect x="60" y="20" width="220" height="150" rx="14" fill="url(#windowGrad)" stroke="#818cf8" strokeWidth="1.5" filter="url(#softShadow)" />

          {/* Dashboard Window Header Bar */}
          <rect x="60" y="20" width="220" height="24" rx="14" fill="#1e1b4b" />
          <circle cx="76" cy="32" r="3.5" fill="#f43f5e" />
          <circle cx="88" cy="32" r="3.5" fill="#fbbf24" />
          <circle cx="100" cy="32" r="3.5" fill="#10b981" />

          {/* Mini Dashboard Header Blocks inside window */}
          <rect x="190" y="27" width="40" height="10" rx="4" fill="#4338ca" opacity="0.8" />
          <rect x="236" y="27" width="32" height="10" rx="4" fill="#6366f1" opacity="0.8" />

          {/* Window Left Sidebar Mockup */}
          <rect x="70" y="52" width="45" height="105" rx="8" fill="#2e1065" opacity="0.5" />
          <rect x="76" y="60" width="33" height="12" rx="4" fill="#6366f1" />
          <rect x="76" y="80" width="33" height="8" rx="3" fill="#475569" />
          <rect x="76" y="94" width="33" height="8" rx="3" fill="#475569" />
          <rect x="76" y="108" width="33" height="8" rx="3" fill="#475569" />

          {/* Window Main Area - Chart */}
          <rect x="123" y="52" width="146" height="105" rx="8" fill="#0f172a" opacity="0.4" />
          <line x1="130" y1="135" x2="260" y2="135" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="130" y1="105" x2="260" y2="105" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="130" y1="75" x2="260" y2="75" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

          {/* Line Chart Area & Curve */}
          <path d="M 135 130 Q 165 110 185 120 T 225 70 T 255 85 L 255 140 L 135 140 Z" fill="url(#chartLineGrad)" />
          <path d="M 135 130 Q 165 110 185 120 T 225 70 T 255 85" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
          <circle cx="225" cy="70" r="4" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
          <circle cx="185" cy="120" r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />

          {/* Floating 3D Purple Card (Left overlap) */}
          <g filter="url(#softShadow)">
            <rect x="30" y="85" width="65" height="65" rx="14" fill="url(#purpleCardGrad)" stroke="#a5b4fc" strokeWidth="1" />
            <path d="M 45 125 A 18 18 0 1 1 70 100 L 60 115 Z" fill="#c084fc" />
            <circle cx="62.5" cy="117.5" r="10" fill="#38bdf8" />
          </g>

          {/* Potted Plant Graphic on Right */}
          <g filter="url(#softShadow)">
            {/* Plant Pot */}
            <path d="M 285 145 L 295 180 L 320 180 L 330 145 Z" fill="#a78bfa" />
            <ellipse cx="307.5" cy="145" rx="22.5" ry="4" fill="#c4b5fd" />

            {/* Green Plant Leaves */}
            <path d="M 307.5 145 Q 280 110 270 120 Q 285 135 307.5 145 Z" fill="#10b981" />
            <path d="M 307.5 145 Q 315 90 330 95 Q 325 125 307.5 145 Z" fill="#059669" />
            <path d="M 307.5 145 Q 345 125 340 140 Q 320 150 307.5 145 Z" fill="#34d399" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-xl space-y-3.5">
        {/* Amber / Yellow Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/30 backdrop-blur-md rounded-full text-[11px] font-extrabold uppercase tracking-wider text-amber-200">
          <Sparkles size={13} className="text-amber-300" />
          <span>GOOD MORNING 👋</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
          Welcome back, {userName}! 🚀
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-indigo-100/90 font-medium leading-relaxed max-w-lg">
          Track real-time project progress, manage Kanban workflows, and collaborate with your team seamlessly.
        </p>

        {/* Create Task Button */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenTaskModal}
            className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-slate-50 font-extrabold text-xs rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus size={16} className="text-indigo-600 stroke-[3]" />
            <span>+ Create New Task</span>
          </button>

          {isAdmin && (
            <button
              onClick={onOpenProjectModal}
              className="px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-xs rounded-full backdrop-blur-md transition flex items-center gap-2"
            >
              <Plus size={16} />
              <span>+ New Project</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
