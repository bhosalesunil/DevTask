import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as commentService from '../services/commentService';
import * as taskService from '../services/taskService';
import {
  X,
  Paperclip,
  Send,
  Trash2,
  Clock,
  User,
  Folder,
  AlertTriangle,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '../utils/formatters';

export const TaskModal = ({
  task,
  mode = 'view', // 'view', 'create', 'edit'
  projects = [],
  developers = [],
  onClose,
  onSaveSuccess,
}) => {
  const { user, isAdmin } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    project: task?.project?._id || (projects[0]?._id || ''),
    assignedTo: task?.assignedTo?._id || '',
    priority: task?.priority || 'Medium',
    status: task?.status || 'TODO',
    dueDate: task?.dueDate ? new Date(task?.dueDate).toISOString().split('T')[0] : '',
  });

  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentFile, setCommentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch comments when viewing an existing task
  useEffect(() => {
    if (task && task._id) {
      const fetchComments = async () => {
        try {
          const res = await commentService.getTaskComments(task._id);
          if (res.success) {
            setComments(res.data);
          }
        } catch (err) {
          console.error('Failed to load comments', err);
        }
      };
      fetchComments();
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) form.append(key, formData[key]);
      });

      files.forEach((file) => {
        form.append('attachments', file);
      });

      let res;
      if (task && mode === 'edit') {
        res = await taskService.updateTask(task._id, form);
      } else {
        res = await taskService.createTask(form);
      }

      if (res.success) {
        onSaveSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!task) return;
    try {
      const res = await taskService.updateTaskStatus(task._id, newStatus);
      if (res.success) {
        setFormData((prev) => ({ ...prev, status: newStatus }));
        onSaveSuccess(res.data);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() && !commentFile) return;

    try {
      const cForm = new FormData();
      cForm.append('content', newComment);
      if (commentFile) cForm.append('attachment', commentFile);

      const res = await commentService.addComment(task._id, cForm);
      if (res.success) {
        setComments((prev) => [...prev, res.data]);
        setNewComment('');
        setCommentFile(null);
      }
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(task._id);
        onSaveSuccess(null);
        onClose();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              {mode === 'create' ? 'Create New Task' : task?.title}
            </span>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg">
              {error}
            </div>
          )}

          {mode === 'create' || mode === 'edit' ? (
            <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Implement Payment Gateway Integration"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed task guidelines, requirement notes..."
                  className="form-textarea"
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Project</label>
                  <select
                    name="project"
                    required
                    value={formData.project}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assign Developer</label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">-- Select Developer --</option>
                    {developers.map((dev) => (
                      <option key={dev._id} value={dev._id}>
                        {dev.name} ({dev.title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status Workflow</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Deliverables / Attachments</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="form-input text-xs"
                />
              </div>
            </form>
          ) : (
            /* View Task Details Mode */
            <div className="space-y-5">
              {/* Status Stepper */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="text-xs font-bold text-gray-500 mr-2">Workflow Status:</span>
                {['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`btn text-xs px-2.5 py-1 ${
                      formData.status === st ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Details grid */}
              <div className="grid-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Folder size={14} className="text-indigo-500" />
                  <span>Project:</span>
                  <strong className="text-gray-900 dark:text-white">
                    {task?.project?.title || 'General'}
                  </strong>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <User size={14} className="text-indigo-500" />
                  <span>Assigned To:</span>
                  <strong className="text-gray-900 dark:text-white">
                    {task?.assignedTo ? task.assignedTo.name : 'Unassigned'}
                  </strong>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock size={14} className="text-amber-500" />
                  <span>Deadline:</span>
                  <strong className="text-gray-900 dark:text-white">
                    {formatDate(task?.dueDate)}
                  </strong>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <AlertTriangle size={14} className="text-red-500" />
                  <span>Priority:</span>
                  <span className={`badge badge-${task?.priority?.toLowerCase()}`}>
                    {task?.priority}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h5 className="text-xs font-bold uppercase text-gray-400 mb-1">Description</h5>
                <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg leading-relaxed">
                  {task?.description || 'No description provided.'}
                </p>
              </div>

              {/* Attachments List */}
              {task?.attachments && task.attachments.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-1">
                    <Paperclip size={14} /> Attachments ({task.attachments.length})
                  </h5>
                  <div className="space-y-1.5">
                    {task.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        <FileText size={14} />
                        {att.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <h5 className="text-xs font-bold uppercase text-gray-400 mb-3">
                  Comments & Collaboration ({comments.length})
                </h5>

                <div className="space-y-3 max-h-52 overflow-y-auto mb-3 pr-1">
                  {comments.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No comments yet. Start the conversation!</p>
                  ) : (
                    comments.map((c) => (
                      <div key={c._id} className="flex gap-2.5 bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-lg text-xs">
                        <img
                          src={c.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.name}`}
                          alt={c.user?.name}
                          className="w-7 h-7 rounded-full object-cover border"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-900 dark:text-white">{c.user?.name}</span>
                            <span className="text-[10px] text-gray-400">{formatRelativeTime(c.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 leading-snug">{c.content}</p>
                          {c.attachment && (
                            <a
                              href={c.attachment.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:underline"
                            >
                              <Paperclip size={12} /> {c.attachment.name}
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Input */}
                <form onSubmit={handleAddComment} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="form-input text-xs flex-1"
                    />
                    <button type="submit" className="btn btn-primary text-xs">
                      <Send size={14} /> Send
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                      <Paperclip size={12} /> Attach File
                      <input
                        type="file"
                        onChange={(e) => setCommentFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                    {commentFile && (
                      <span className="text-[10px] text-gray-500 truncate max-w-[200px]">
                        {commentFile.name}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {mode === 'view' && (isAdmin || task?.createdBy === user?._id) && (
            <button onClick={handleDeleteTask} className="btn btn-danger text-xs mr-auto">
              <Trash2 size={14} /> Delete Task
            </button>
          )}

          <button onClick={onClose} className="btn btn-secondary text-xs">
            Close
          </button>

          {(mode === 'create' || mode === 'edit') && (
            <button
              type="submit"
              form="task-form"
              disabled={loading}
              className="btn btn-primary text-xs"
            >
              {loading ? 'Saving...' : 'Save Task'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
