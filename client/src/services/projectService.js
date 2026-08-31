import API from './api';

export const getProjects = async (params = {}) => {
  const response = await API.get('/projects', { params });
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await API.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await API.post('/projects', projectData);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await API.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await API.delete(`/projects/${id}`);
  return response.data;
};

export const assignDevelopers = async (id, members) => {
  const response = await API.put(`/projects/${id}/assign`, { members });
  return response.data;
};
