import API from './api';

export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  if (response.data.success) {
    localStorage.setItem('devtask_user', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  if (response.data.success) {
    localStorage.setItem('devtask_user', JSON.stringify(response.data.data));
  }
  return response.data;
};

export const getMe = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put('/auth/profile', profileData);
  if (response.data.success) {
    const currentUser = JSON.parse(localStorage.getItem('devtask_user')) || {};
    const updatedUser = { ...currentUser, ...response.data.data };
    localStorage.setItem('devtask_user', JSON.stringify(updatedUser));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('devtask_user');
};
