import { API_URL } from '@env';

// Real API Implementation
// const API_URL = 'http://localhost:5000/api'; // Replaced by .env

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
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    
    return {
        success: true,
        token: data.token,
        user: { id: data._id, username: data.username },
    };
  },

  fetchTasks: async (token: string): Promise<TaskDto[]> => {
    const response = await fetch(`${API_URL}/tasks`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Fetch tasks failed');
    return await response.json();
  },

  syncTask: async (task: any, token: string) => {
    const response = await fetch(`${API_URL}/tasks/sync`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ operation: 'UPDATE', data: task })
    });
    
    if (!response.ok) throw new Error('Sync failed');
    return await response.json();
  },
};
