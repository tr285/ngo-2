import api from './api';

export const reportService = {
  getAll: async (params = {}) => {
    const response = await api.get('/reports', { params });
    return {
      items: response.data.reports || [],
      pagination: response.data.pagination || {},
    };
  },

  generate: async (data) => {
    const response = await api.post('/reports/generate', data);
    return response.data.report;
  },

  getById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data.report;
  },

  download: async (id) => {
    const response = await api.get(`/reports/${id}/download`, {
      responseType: 'blob',
    });

    const disposition = response.headers['content-disposition'] || '';
    const match = disposition.match(/filename="(.+)"/);
    const filename = match?.[1] || `report-${id}`;

    return { blob: response.data, filename };
  },

  remove: async (id) => {
    await api.delete(`/reports/${id}`);
  },
};
