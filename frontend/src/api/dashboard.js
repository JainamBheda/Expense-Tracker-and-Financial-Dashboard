import apiClient from './client.js';

export const dashboardAPI = {
  getSummary: async (params = {}) => {
    const response = await apiClient.get('/dashboard/summary', { params });
    return response.data;
  },

  getCategoryBreakdown: async (params = {}) => {
    const response = await apiClient.get('/dashboard/categories', { params });
    return response.data;
  },

  getMonthlyTrends: async (params = {}) => {
    const response = await apiClient.get('/dashboard/trends', { params });
    return response.data;
  },
};

