import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('devtask_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (user && user.token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser((prev) => ({ ...prev, ...res.data }));
          }
        } catch (err) {
          console.error('Failed to verify session token', err);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const loginUser = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success) {
      setUser(res.data);
    }
    return res;
  };

  const registerUser = async (userData) => {
    const res = await authService.register(userData);
    if (res.success) {
      setUser(res.data);
    }
    return res;
  };

  const logoutUser = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res.success) {
      setUser((prev) => ({ ...prev, ...res.data }));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        isDeveloper: user?.role === 'developer',
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        updateProfile: updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
