import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as projectService from '../services/projectService';
import * as taskService from '../services/taskService';
import * as notificationService from '../services/notificationService';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskModal } from '../components/TaskModal';
import { ProjectModal } from '../components/ProjectModal';
import {
  Folder,
  Calendar,
  Users,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskModalMode, setTaskModalMode] = useState('view'); // 'view' or 'create'
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      const [projRes, devRes] = await Promise.all([
        projectService.getProjectById(id),
        notificationService.getDevelopers(),
      ]);

      if (projRes.success) {
        setProject(projRes.data);
        setTasks(projRes.data.tasks || []);
      }
      if (devRes.success) setDevelopers(devRes.data);
    } catch (err) {
      console.error('Failed to fetch project details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const res = await taskService.updateTaskStatus(taskId, newStatus);
      if (res.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error('Failed to change task status', err);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      try {
        await projectService.deleteProject(id);
        navigate('/projects');
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold text-gray-500">Loading Project Details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="card text-center py-16">
        <p className="text-sm font-semibold text-gray-500">Project not found</p>
        <button onClick={() => navigate('/projects')} className="btn btn-secondary text-xs mt-3">
          Back to Projects
        </button>
      </div>
    );
  }

  const stats = project.taskStats || { total: 0, completed: 0, progressPercent: 0 };

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/projects')}
        className="btn-icon text-xs font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1"
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Project Banner Card */}
      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="badge badge-in_progress">{project.category}</span>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
              {project.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  onClick={() => setShowEditProjectModal(true)}
                  className="btn btn-secondary text-xs font-bold"
                >
                  <Edit size={14} /> Edit Project
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="btn btn-danger text-xs font-bold"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}

            <button
              onClick={() => {
                setSelectedTask(null);
                setTaskModalMode('create');
                setShowTaskModal(true);
              }}
              className="btn btn-primary text-xs font-bold"
            >
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
          {project.description}
        </p>

        {/* Tech Stack & Dates */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
            <Calendar size={14} className="text-indigo-500" />
            Due: {formatDate(project.dueDate)}
          </div>

          <div className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Progress: {stats.progressPercent}% ({stats.completed}/{stats.total} Tasks)
          </div>
        </div>

        {/* Members List */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs font-bold text-gray-400">Assigned Team:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {project.members && project.members.length > 0 ? (
              project.members.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200"
                >
                  <img
                    src={m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`}
                    alt={m.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  {m.name}
                </div>
              ))
            ) : (
              <span className="text-xs text-gray-400">No assigned members</span>
            )}
          </div>
        </div>
      </div>

      {/* Project Kanban Board */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Project Kanban Board</h2>
        <KanbanBoard
          tasks={tasks}
          onTaskClick={(t) => {
            setSelectedTask(t);
            setTaskModalMode('view');
            setShowTaskModal(true);
          }}
          onTaskStatusChange={handleTaskStatusChange}
          onAddTaskClick={(colId) => {
            setSelectedTask(null);
            setTaskModalMode('create');
            setShowTaskModal(true);
          }}
        />
      </div>

      {/* Modals */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          mode={taskModalMode}
          projects={[project]}
          developers={developers}
          onClose={() => setShowTaskModal(false)}
          onSaveSuccess={fetchProjectDetail}
        />
      )}

      {showEditProjectModal && (
        <ProjectModal
          project={project}
          developers={developers}
          onClose={() => setShowEditProjectModal(false)}
          onSaveSuccess={fetchProjectDetail}
        />
      )}
    </div>
  );
};
