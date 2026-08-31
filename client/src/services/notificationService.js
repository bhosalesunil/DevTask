import API from './api';

export const getNotifications = async () => {
  const response = await API.get('/notifications');
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await API.patch(`/notifications/${id}/read`);
  return response.data;
};

export const clearNotifications = async () => {
  const response = await API.patch('/notifications/read-all');
  return response.data;
};

export const getDevelopers = async () => {
  const response = await API.get('/users/developers');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await API.get('/users/dashboard-stats');
  return response.data;
};
