import api from './api';

const createCrudService = (resourcePath, listKey) => ({
  getAll: async (params = {}) => {
    const response = await api.get(resourcePath, { params });
    return {
      items: response.data[listKey] || [],
      pagination: response.data.pagination || {},
    };
  },
  getById: async (id) => {
    const response = await api.get(`${resourcePath}/${id}`);
    const singularKey = listKey.endsWith('s') ? listKey.slice(0, -1) : listKey;
    return response.data[singularKey] || response.data;
  },
  create: async (data) => {
    const response = await api.post(resourcePath, data);
    const singularKey = listKey.endsWith('s') ? listKey.slice(0, -1) : listKey;
    return response.data[singularKey] || response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`${resourcePath}/${id}`, data);
    const singularKey = listKey.endsWith('s') ? listKey.slice(0, -1) : listKey;
    return response.data[singularKey] || response.data;
  },
  remove: async (id) => {
    await api.delete(`${resourcePath}/${id}`);
  },
});

export const volunteerService = createCrudService('/volunteers', 'volunteers');
export const donorService = createCrudService('/donors', 'donors');
export const campaignService = createCrudService('/campaigns', 'campaigns');
export const beneficiaryService = createCrudService('/beneficiaries', 'beneficiaries');
export const eventService = createCrudService('/events', 'events');
export const userService = createCrudService('/users', 'users');
