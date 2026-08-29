import { create } from 'zustand';

export const useStore = create((set) => ({
  token: localStorage.getItem('ba_token'),
  user: JSON.parse(localStorage.getItem('ba_user') || 'null'),
  
  login: (token, user) => {
    localStorage.setItem('ba_token', token);
    localStorage.setItem('ba_user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('ba_token');
    localStorage.removeItem('ba_user');
    set({ token: null, user: null });
  },

  setUser: (user) => {
    localStorage.setItem('ba_user', JSON.stringify(user));
    set({ user });
  },
}));
