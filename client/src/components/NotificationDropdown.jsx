import React from 'react';
import { useNotification } from '../hooks/useNotification';
import { Bell, Check, MessageSquare, AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatters';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'ASSIGNMENT': return <UserPlus size={16} className="text-indigo-500" />;
    case 'DEADLINE': return <AlertCircle size={16} className="text-amber-500" />;
    case 'COMMENT': return <MessageSquare size={16} className="text-sky-500" />;
    case 'STATUS_CHANGE': return <CheckCircle2 size={16} className="text-emerald-500" />;
    default: return <Bell size={16} className="text-indigo-500" />;
  }
};

export const NotificationDropdown = ({ onClose }) => {
  const { notifications, unreadCount, markSingleRead, markAllRead } = useNotification();

  return (
    <div className="notification-dropdown">
      <div className="dropdown-header">
        <div className="flex items-center gap-2">
          <Bell size={18} />
          <h4 className="font-bold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <span className="unread-tag">{unreadCount} new</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs font-semibold text-indigo-600 hover:underline">
            Mark all read
          </button>
        )}
      </div>

      <div className="dropdown-body">
        {notifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={32} className="text-gray-300" />
            <p className="text-xs text-gray-500 mt-2">No notifications yet</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              onClick={() => markSingleRead(item._id)}
              className={`notification-item ${!item.isRead ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                {getNotificationIcon(item.type)}
              </div>
              <div className="notification-content">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  {item.message}
                </p>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  {formatRelativeTime(item.createdAt)}
                </span>
              </div>
              {!item.isRead && <span className="unread-dot"></span>}
            </div>
          ))
        )}
      </div>
      
      <style>{`
        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          width: 340px;
          max-height: 420px;
          background-color: var(--bg-modal);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: fadeIn 0.15s ease;
        }
        .dropdown-header {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .unread-tag {
          background-color: #e0e7ff;
          color: #4338ca;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
        }
        .dropdown-body {
          overflow-y: auto;
          max-height: 340px;
        }
        .notification-item {
          padding: 0.75rem 1rem;
          display: flex;
          align-items: start;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: background-color 0.15s;
          position: relative;
        }
        .notification-item:hover {
          background-color: var(--bg-tertiary);
        }
        .notification-item.unread {
          background-color: rgba(99, 102, 241, 0.05);
        }
        .notification-icon {
          padding: 6px;
          border-radius: 50%;
          background-color: var(--bg-tertiary);
          margin-top: 2px;
        }
        .unread-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #6366f1;
          position: absolute;
          right: 12px;
          top: 14px;
        }
        .empty-notifications {
          padding: 2.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  );
};
