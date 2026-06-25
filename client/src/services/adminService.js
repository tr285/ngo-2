import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data.dashboard;
  },
};
