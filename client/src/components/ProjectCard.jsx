import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, Users, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();
  const stats = project.taskStats || { total: 0, completed: 0, progressPercent: 0 };

  return (
    <div
      className="card project-card card-interactive"
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="category-badge">{project.category}</span>
        <span className={`status-pill ${project.status === 'Completed' ? 'completed' : 'active'}`}>
          {project.status}
        </span>
      </div>

      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.description}</p>

      {/* Tech Stack Pills */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 my-3">
          {project.techStack.map((tech, idx) => (
            <span key={idx} className="tech-pill">
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="my-3 space-y-1">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-gray-500">Completion</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            {stats.progressPercent}% ({stats.completed}/{stats.total} Tasks)
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer-flex">
        <div className="members-stack">
          {project.members && project.members.length > 0 ? (
            project.members.slice(0, 4).map((m) => (
              <img
                key={m._id}
                src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`}
                alt={m.name}
                title={m.name}
                className="member-avatar-stack"
              />
            ))
          ) : (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Users size={12} /> No members
            </span>
          )}
          {project.members && project.members.length > 4 && (
            <span className="more-members">+{project.members.length - 4}</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
          <Calendar size={13} />
          {formatDate(project.dueDate)}
        </div>
      </div>

      <style>{`
        .project-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.25rem;
        }
        .category-badge {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--primary-600);
          background-color: var(--primary-50);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
        }
        .status-pill {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }
        .status-pill.active {
          background-color: #fef3c7;
          color: #b45309;
        }
        .status-pill.completed {
          background-color: #dcfce7;
          color: #15803d;
        }
        .project-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 0.3rem;
          margin-bottom: 0.3rem;
        }
        .project-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tech-pill {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-secondary);
          background-color: var(--bg-tertiary);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .card-footer-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-color);
        }
        .members-stack {
          display: flex;
          align-items: center;
        }
        .member-avatar-stack {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--bg-card);
          margin-left: -6px;
        }
        .member-avatar-stack:first-child {
          margin-left: 0;
        }
        .more-members {
          font-size: 0.65rem;
          font-weight: 700;
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: -6px;
          border: 2px solid var(--bg-card);
        }
      `}</style>
    </div>
  );
};
