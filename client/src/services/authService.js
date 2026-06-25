import api from './api';
import { TOKEN_KEY } from '../constants/roles';

export const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch('/auth/me', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.patch('/auth/change-password', data);
    return response.data;
  },

  saveToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },
};
