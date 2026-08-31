import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as projectService from '../services/projectService';
import * as notificationService from '../services/notificationService';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { Plus, Search, Filter } from 'lucide-react';
import { PROJECT_CATEGORIES } from '../utils/constants';

export const Projects = () => {
  const { globalSearch } = useOutletContext() || {};
  const { isAdmin } = useAuth();

  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (globalSearch) params.search = globalSearch;
      if (categoryFilter) params.category = categoryFilter;

      const [projRes, devRes] = await Promise.all([
        projectService.getProjects(params),
        notificationService.getDevelopers(),
      ]);

      if (projRes.success) setProjects(projRes.data);
      if (devRes.success) setDevelopers(devRes.data);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [globalSearch, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Projects Management</h1>
          <p className="text-xs text-gray-500">Overview of active software development projects</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg text-xs">
            <Filter size={14} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <option value="">All Categories</option>
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary text-xs font-bold"
            >
              <Plus size={16} /> Create Project
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-gray-500">Loading Projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-sm font-semibold text-gray-500">No projects found</p>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary text-xs mt-3"
            >
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="grid-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal
          developers={developers}
          onClose={() => setShowModal(false)}
          onSaveSuccess={fetchProjects}
        />
      )}
    </div>
  );
};
