import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  User,
  Shield,
  Layers,
  X,
  Settings,
  Sparkles,
} from 'lucide-react';

export const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { path: '/projects', label: 'Projects', icon: <FolderKanban size={19} /> },
    { path: '/tasks', label: 'Tasks & Kanban', icon: <CheckSquare size={19} /> },
    { path: '/developers', label: 'Team Members', icon: <Users size={19} /> },
    { path: '/profile', label: 'Profile', icon: <User size={19} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Top Branding Section */}
        <div className="sidebar-brand">
          <div className="flex items-center gap-3">
            <div className="brand-logo">
              <Layers size={22} className="text-white" />
            </div>
            <div>
              <h1 className="brand-name">DevTask</h1>
              <p className="brand-sub">PLATFORM</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="sidebar-nav">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Pro Upgrade / Platform Highlight Banner Card */}
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-purple-50/90 border border-indigo-100/80 text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Sparkles size={18} />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900">DevTask Workspace</h4>
            <p className="text-[11px] font-medium text-slate-500 leading-tight">
              Real-time collaboration & Kanban workflows.
            </p>
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className="sidebar-footer">
          <div className="user-section flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Dev'}`}
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs flex-shrink-0"
              />
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-slate-900 truncate">{user?.name || 'Sunil Sharma'}</h4>
                <span className="text-[10px] font-extrabold text-indigo-600 flex items-center gap-1 uppercase tracking-wide">
                  <Shield size={10} />
                  {user?.role === 'admin' ? 'ADMIN' : 'DEVELOPER'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate('/profile');
              }}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition"
              title="Profile & Settings"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>

        <style>{`
          .app-sidebar {
            width: 250px;
            background-color: #ffffff;
            color: #0f172a;
            display: flex;
            flex-direction: column;
            border-right: 1px solid #e2e8f0;
            flex-shrink: 0;
            min-height: 100vh;
            position: sticky;
            top: 0;
            z-index: 50;
            transition: transform 0.3s ease-in-out;
          }

          @media (max-width: 1023px) {
            .app-sidebar {
              position: fixed;
              top: 0;
              bottom: 0;
              left: 0;
              transform: translateX(-100%);
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            .app-sidebar.open {
              transform: translateX(0);
            }
          }

          .sidebar-brand {
            padding: 1.5rem 1.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #f1f5f9;
          }
          .brand-logo {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          }
          .brand-name {
            font-size: 1.25rem;
            font-weight: 800;
            letter-spacing: -0.025em;
            color: #0f172a;
            line-height: 1.1;
          }
          .brand-sub {
            font-size: 0.65rem;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 800;
          }
          .sidebar-nav {
            padding: 1.25rem 0.85rem;
            flex: 1;
          }
          .nav-link {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.7rem 0.9rem;
            border-radius: 0.85rem;
            color: #64748b;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 600;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .nav-link:hover {
            color: #0f172a;
            background-color: #f8fafc;
          }
          .nav-link.active {
            color: #ffffff;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
            font-weight: 700;
          }
          .nav-link.active .nav-icon {
            color: #ffffff;
          }
          .sidebar-footer {
            padding: 1.25rem;
            border-top: 1px solid #f1f5f9;
          }
        `}</style>
      </aside>
    </>
  );
};
