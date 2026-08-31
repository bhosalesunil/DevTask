import React from 'react';
import { Clock, MessageSquare, Paperclip, CheckCircle, ChevronRight, User } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const TaskCard = ({ task, onClick, onStatusChange }) => {
  const priorityClasses = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high',
    Urgent: 'badge-urgent',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  return (
    <div className="card task-card card-interactive" onClick={() => onClick(task)}>
      <div className="task-card-header">
        <span className={`badge ${priorityClasses[task.priority] || 'badge-medium'}`}>
          {task.priority}
        </span>
        
        {task.project && (
          <span className="project-tag">
            {task.project.title}
          </span>
        )}
      </div>

      <h4 className="task-title">{task.title}</h4>
      
      {task.description && (
        <p className="task-desc">
          {task.description.length > 80 ? `${task.description.substring(0, 80)}...` : task.description}
        </p>
      )}

      <div className="task-card-footer">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              <Clock size={13} />
              {formatDate(task.dueDate)}
            </span>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <span className="meta-icon" title={`${task.attachments.length} attachment(s)`}>
              <Paperclip size={13} /> {task.attachments.length}
            </span>
          )}

          {task.commentsCount !== undefined && task.commentsCount > 0 && (
            <span className="meta-icon" title={`${task.commentsCount} comment(s)`}>
              <MessageSquare size={13} /> {task.commentsCount}
            </span>
          )}
        </div>

        <div className="assignee-wrapper" title={task.assignedTo ? task.assignedTo.name : 'Unassigned'}>
          {task.assignedTo ? (
            <img
              src={task.assignedTo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo.name}`}
              alt={task.assignedTo.name}
              className="assignee-avatar"
            />
          ) : (
            <div className="unassigned-avatar">
              <User size={12} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .task-card {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 1rem;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          cursor: pointer;
        }
        .task-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .project-tag {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
          background-color: var(--bg-tertiary);
          padding: 2px 8px;
          border-radius: 4px;
          max-width: 130px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .task-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.35;
        }
        .task-desc {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .task-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.4rem;
          padding-top: 0.6rem;
          border-top: 1px solid var(--border-color);
        }
        .due-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .due-date.overdue {
          color: #dc2626;
          font-weight: 700;
        }
        .meta-icon {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .assignee-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--border-color);
        }
        .unassigned-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: var(--bg-tertiary);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
