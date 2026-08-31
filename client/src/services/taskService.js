import API from './api';

export const getTasks = async (params = {}) => {
  const response = await API.get('/tasks', { params });
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await API.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskFormData) => {
  const response = await API.post('/tasks', taskFormData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateTask = async (id, taskFormData) => {
  const response = await API.put(`/tasks/${id}`, taskFormData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await API.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};
