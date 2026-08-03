import axiosClient from './axiosClient';

export const notesApi = {
  getNotes: async (meetingId) => {
    const response = await axiosClient.get(`/notes/${meetingId}`);
    return response.data;
  },
  createNote: async (data) => {
    const response = await axiosClient.post('/notes', data);
    return response.data;
  },
  updateNote: async (id, data) => {
    const response = await axiosClient.put(`/notes/${id}`, data);
    return response.data;
  },
  deleteNote: async (id) => {
    const response = await axiosClient.delete(`/notes/${id}`);
    return response.data;
  },
  summarizeNote: async (data) => {
    const response = await axiosClient.post('/notes/summarize', data);
    return response.data;
  },
};
