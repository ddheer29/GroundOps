import axiosInstance from './axios';

export interface TaskDto {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  priority: string;
  notes?: string;
  updatedAt: string;
  attachments?: string[];
}

export const ApiClient = {
  login: async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { username, password });
    
    return {
        success: true,
        token: response.data.token,
        user: { id: response.data._id, username: response.data.username },
    };
  },

  fetchTasks: async (token: string): Promise<TaskDto[]> => {
    const response = await axiosInstance.get('/tasks', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
  },

  syncTask: async (task: any, token: string) => {
    const response = await axiosInstance.post('/tasks/sync', { operation: 'UPDATE', data: task }, {
        headers: { 
            'Authorization': `Bearer ${token}`
        }
    });
    
    return response.data;
  },
};

