import api from './api';

export const donationService = {
  getAll: async (params = {}) => {
    const response = await api.get('/donations', { params });
    return {
      items: response.data.donations || [],
      pagination: response.data.pagination || {},
    };
  },

  getHistory: async () => {
    const response = await api.get('/donations/history');
    return {
      donations: response.data.donations || [],
      summary: response.data.summary || {},
    };
  },

  getCampaignProgress: async () => {
    const response = await api.get('/donations/campaign-progress');
    return response.data.campaigns || [];
  },

  getById: async (id) => {
    const response = await api.get(`/donations/${id}`);
    return response.data.donation;
  },

  getReceipt: async (id) => {
    const response = await api.get(`/donations/${id}/receipt`);
    return response.data.receipt;
  },

  createManual: async (data) => {
    const response = await api.post('/donations', data);
    return response.data.donation;
  },

  initiateCheckout: async (data) => {
    const response = await api.post('/donations/checkout', data);
    return response.data;
  },

  confirmRazorpay: async (data) => {
    const response = await api.post('/donations/razorpay/confirm', data);
    return response.data.donation;
  },

  confirmStripe: async (data) => {
    const response = await api.post('/donations/stripe/confirm', data);
    return response.data.donation;
  },

  update: async (id, data) => {
    const response = await api.patch(`/donations/${id}`, data);
    return response.data.donation;
  },

  remove: async (id) => {
    await api.delete(`/donations/${id}`);
  },
};
