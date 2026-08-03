import axiosClient from './axiosClient';

export const meetingsApi = {
  getMeetings: async () => {
    const response = await axiosClient.get('/meetings');
    return response.data;
  },
  createMeeting: async (data) => {
    const response = await axiosClient.post('/meetings', data);
    return response.data;
  },
  getMeetingById: async (id) => {
    const response = await axiosClient.get(`/meetings/${id}`);
    return response.data;
  },
  updateMeeting: async (id, data) => {
    const response = await axiosClient.put(`/meetings/${id}`, data);
    return response.data;
  },
  deleteMeeting: async (id) => {
    const response = await axiosClient.delete(`/meetings/${id}`);
    return response.data;
  },
};
