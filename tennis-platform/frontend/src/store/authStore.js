import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user and token
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      // Clear authentication
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      // Refresh user data
      refreshUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await authAPI.getMe();
          const user = response.data.user;
          set({ user });
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error('Refresh user error:', error);
          // If token is invalid, logout
          if (error.response?.status === 401) {
            get().logout();
          }
        }
      },

      // Update user data locally (after profile update)
      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        set({ user: updatedUser });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
