import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as taskService from '../services/taskService';
import * as projectService from '../services/projectService';
import * as notificationService from '../services/notificationService';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskModal } from '../components/TaskModal';
import {
  Kanban,
  List,
  Plus,
  Filter,
  ArrowUpDown,
  Search,
  Clock,
  MessageSquare,
  Paperclip,
  CheckCircle,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const Tasks = () => {
  const { globalSearch } = useOutletContext() || {};
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  // View switch: 'kanban' or 'list'
  const [viewMode, setViewMode] = useState('kanban');

  // Filters
  const [projectFilter, setProjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [developerFilter, setDeveloperFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Task Modal state
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'view', 'edit'
  const [showTaskModal, setShowTaskModal] = useState(false);

  const fetchTasksData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (globalSearch) params.search = globalSearch;
      if (projectFilter) params.project = projectFilter;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (developerFilter) params.assignedTo = developerFilter;
      if (sortBy) params.sortBy = sortBy;

      const [taskRes, projRes, devRes] = await Promise.all([
        taskService.getTasks(params),
        projectService.getProjects(),
        notificationService.getDevelopers(),
      ]);

      if (taskRes.success) setTasks(taskRes.data);
      if (projRes.success) setProjects(projRes.data);
      if (devRes.success) setDevelopers(devRes.data);
    } catch (err) {
      console.error('Failed to fetch tasks data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, [globalSearch, projectFilter, statusFilter, priorityFilter, developerFilter, sortBy]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const res = await taskService.updateTaskStatus(taskId, newStatus);
      if (res.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Task Management & Kanban Board</h1>
          <p className="text-xs text-gray-500">Organize development workflow stages (TODO → IN PROGRESS → REVIEW → COMPLETED)</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-md transition ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Kanban size={15} /> Kanban Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-md transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <List size={15} /> List View
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedTask(null);
              setModalMode('create');
              setShowTaskModal(true);
            }}
            className="btn btn-primary text-xs font-bold"
          >
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <div className="card p-3.5 flex flex-wrap items-center gap-3 bg-gray-50/70 dark:bg-gray-800/40">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mr-1">
          <Filter size={14} /> Filter Tasks:
        </div>

        {/* Project Filter */}
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="form-select text-xs w-auto min-w-[140px]"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select text-xs w-auto"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">Review</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="form-select text-xs w-auto"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>

        {/* Developer Filter */}
        <select
          value={developerFilter}
          onChange={(e) => setDeveloperFilter(e.target.value)}
          className="form-select text-xs w-auto min-w-[150px]"
        >
          <option value="">All Developers</option>
          {developers.map((dev) => (
            <option key={dev._id} value={dev._id}>
              {dev.name}
            </option>
          ))}
        </select>

        {/* Sort By */}
        <div className="flex items-center gap-1 text-xs ml-auto">
          <ArrowUpDown size={14} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select text-xs w-auto"
          >
            <option value="">Sort by Created</option>
            <option value="deadline">Sort by Deadline</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* View Rendering */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-gray-500">Loading Tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-sm font-semibold text-gray-500">No tasks match your filters</p>
          <button
            onClick={() => {
              setProjectFilter('');
              setStatusFilter('');
              setPriorityFilter('');
              setDeveloperFilter('');
            }}
            className="btn btn-secondary text-xs mt-3"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onTaskClick={(t) => {
            setSelectedTask(t);
            setModalMode('view');
            setShowTaskModal(true);
          }}
          onTaskStatusChange={handleTaskStatusChange}
          onAddTaskClick={(colId) => {
            setSelectedTask(null);
            setModalMode('create');
            setShowTaskModal(true);
          }}
        />
      ) : (
        /* List View Table */
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Task Title</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
              {tasks.map((t) => (
                <tr
                  key={t._id}
                  onClick={() => {
                    setSelectedTask(t);
                    setModalMode('view');
                    setShowTaskModal(true);
                  }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition"
                >
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    {t.title}
                  </td>
                  <td className="py-3 px-4 text-gray-500 font-semibold">
                    {t.project?.title || 'General'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge badge-${t.priority.toLowerCase()}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge badge-${t.status.toLowerCase()}`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {t.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={t.assignedTo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.assignedTo.name}`}
                          alt={t.assignedTo.name}
                          className="w-6 h-6 rounded-full object-cover border"
                        />
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {t.assignedTo.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-500 font-medium">
                    {formatDate(t.dueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          mode={modalMode}
          projects={projects}
          developers={developers}
          onClose={() => setShowTaskModal(false)}
          onSaveSuccess={fetchTasksData}
        />
      )}
    </div>
  );
};
