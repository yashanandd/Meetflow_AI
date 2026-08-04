import axiosClient from './axiosClient';

export const tasksApi = {
  getTasks: async (meetingId = null) => {
    const url = meetingId ? `/tasks?meeting_id=${meetingId}` : '/tasks';
    const response = await axiosClient.get(url);
    return response.data;
  },
  createTask: async (data) => {
    const response = await axiosClient.post('/tasks', data);
    return response.data;
  },
  updateTask: async (id, data) => {
    const response = await axiosClient.put(`/tasks/${id}`, data);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await axiosClient.delete(`/tasks/${id}`);
    return response.data;
  },
};
