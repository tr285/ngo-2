import api from './api';

export const settingsService = {
  getProfile: async () => {
    const res = await api.get('/settings/profile');
    return res.data.user;
  },

  updateProfile: async (formData) => {
    const res = await api.patch('/settings/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.user;
  },

  changePassword: async (data) => {
    const res = await api.patch('/settings/change-password', data);
    return res.data;
  },

  getNgoProfile: async () => {
    const res = await api.get('/settings/ngo');
    return res.data.ngoProfile;
  },
};
