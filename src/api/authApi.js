import axiosClient from './axiosClient';

export const authApi = {
  register: async (data) => {
    const response = await axiosClient.post('/register', data);
    return response.data;
  },
  login: async (data) => {
    const response = await axiosClient.post('/login', data);
    return response.data;
  },
  getMe: async () => {
    const response = await axiosClient.get('/me');
    return response.data;
  },
  updateMe: async (data) => {
    const response = await axiosClient.put('/me', data);
    return response.data;
  },
};
