import React, { useState } from 'react';
import * as projectService from '../services/projectService';
import { X, Plus, Check } from 'lucide-react';
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '../utils/constants';

export const ProjectModal = ({ project, developers = [], onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || 'Web Development',
    status: project?.status || 'In Progress',
    techStack: project?.techStack ? project.techStack.join(', ') : 'React, Node.js, MongoDB',
    dueDate: project?.dueDate ? new Date(project?.dueDate).toISOString().split('T')[0] : '',
    members: project?.members ? project.members.map((m) => m._id || m) : [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberToggle = (devId) => {
    setFormData((prev) => {
      const exists = prev.members.includes(devId);
      if (exists) {
        return { ...prev, members: prev.members.filter((id) => id !== devId) };
      } else {
        return { ...prev, members: [...prev.members, devId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      };

      let res;
      if (project) {
        res = await projectService.updateProject(project._id, payload);
      } else {
        res = await projectService.createProject(payload);
      }

      if (res.success) {
        onSaveSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content text-left" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {project ? 'Edit Project' : 'Create New Project'}
          </h3>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Project Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. E-Commerce Website Redesign"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              rows="3"
              required
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe objectives, scope, and key deliverables..."
              className="form-textarea"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                {PROJECT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
              >
                {PROJECT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Tech Stack (comma separated)</label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                placeholder="React, Node.js, MongoDB"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Assign Developers Checklist */}
          <div className="form-group">
            <label className="form-label mb-1">Assign Team Members / Developers</label>
            <div className="grid-2 max-h-40 overflow-y-auto p-2 border rounded-lg border-gray-200 dark:border-gray-800">
              {developers.map((dev) => {
                const isSelected = formData.members.includes(dev._id);
                return (
                  <div
                    key={dev._id}
                    onClick={() => handleMemberToggle(dev._id)}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-xs border ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                        : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={dev.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dev.name}`}
                        alt={dev.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-bold block leading-tight">{dev.name}</span>
                        <span className="text-[10px] text-gray-500">{dev.title}</span>
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="text-indigo-600 font-bold" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="modal-footer px-0 pb-0">
            <button type="button" onClick={onClose} className="btn btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary text-xs">
              {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
