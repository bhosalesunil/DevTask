import React, { useState, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { ThemeContext } from '../context/ThemeContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Search, Bell, Sun, Moon, LogOut, User as UserIcon, Shield, Menu, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ searchFilter, setSearchFilter, onToggleSidebar = () => {} }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotification();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="app-navbar">
      <div className="flex items-center gap-3 flex-1">
        {/* Sidebar Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 lg:hidden transition"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar */}
        <div className="search-container">
          <Search className="search-icon text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Search projects, tasks, developers..."
            value={searchFilter || ''}
            onChange={(e) => setSearchFilter && setSearchFilter(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-actions">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} className="text-slate-600" /> : <Sun size={20} className="text-amber-400" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon relative"
            title="Notifications"
          >
            <Bell size={20} className="text-slate-600" />
            {unreadCount > 0 && (
              <span className="bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

        {/* User Profile Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="profile-btn"
          >
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Dev'}`}
              alt={user?.name}
              className="user-avatar"
            />
            <div className="user-info text-left hidden sm:block">
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="user-role flex items-center gap-1">
                {user?.role === 'admin' && <Shield size={10} className="text-indigo-600" />}
                {user?.role ? user.role.toUpperCase() : 'USER'}
              </span>
            </div>
            <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="profile-menu">
              <div className="menu-header">
                <p className="font-extrabold text-sm text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
                className="menu-item text-slate-700 hover:text-indigo-600"
              >
                <UserIcon size={16} /> Profile Settings
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="menu-item text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .app-navbar {
          height: 72px;
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 30;
        }
        .search-container {
          position: relative;
          width: 100%;
          max-width: 420px;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 0.6rem 1rem 0.6rem 2.6rem;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          color: #0f172a;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .search-input:focus {
          border-color: #4f46e5;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .bell-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 800;
          height: 16px;
          min-width: 16px;
          padding: 0 4px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
        }
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 0.75rem;
          transition: background-color 0.15s ease;
        }
        .profile-btn:hover {
          background-color: #f8fafc;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e2e8f0;
        }
        .user-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
          display: block;
          line-height: 1.2;
        }
        .user-role {
          font-size: 0.65rem;
          color: #64748b;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .profile-menu {
          position: absolute;
          right: 0;
          top: 100%;
          margin-top: 0.5rem;
          width: 220px;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          z-index: 100;
          overflow: hidden;
          animation: fadeIn 0.15s ease;
        }
        .menu-header {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          background-color: #f8fafc;
        }
        .menu-item {
          width: 100%;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          font-weight: 600;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.15s ease;
        }
        .menu-item:hover {
          background-color: #f8fafc;
        }
      `}</style>
    </header>
  );
};
