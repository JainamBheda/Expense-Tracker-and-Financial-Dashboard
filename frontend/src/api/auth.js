import apiClient from './client.js';

export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },
};

