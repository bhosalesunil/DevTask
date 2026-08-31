import API from './api';

export const getTaskComments = async (taskId) => {
  const response = await API.get(`/comments/task/${taskId}`);
  return response.data;
};

export const addComment = async (taskId, commentFormData) => {
  const response = await API.post(`/comments/task/${taskId}`, commentFormData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await API.delete(`/comments/${id}`);
  return response.data;
};
