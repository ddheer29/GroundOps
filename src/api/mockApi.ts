// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(() => resolve(true), ms));

export interface TaskDto {
  _id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  priority: string;
  notes?: string;
  updatedAt: string;
}

export const MockApi = {
  login: async (username: string, password: string) => {
    await delay(1000);
    if (username === 'tech' && password === 'pass') {
      return {
        success: true,
        token: 'mock-jwt-token-123',
        user: { id: 'u1', username: 'tech' },
      };
    }
    throw new Error('Invalid credentials');
  },

  fetchTasks: async (): Promise<TaskDto[]> => {
    await delay(1500);
    return [
      {
        _id: 't1',
        title: 'AC repair – Sector 18',
        description: 'Customer reported cooling issue. Check gas level.',
        location: 'Sector 18, Noida',
        status: 'Pending',
        priority: 'High',
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 't2',
        title: 'Electric meter inspection – Rohini',
        description: 'Monthly scheduled inspection.',
        location: 'Rohini, Delhi',
        status: 'Pending',
        priority: 'Normal',
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 't3',
        title: 'Internet issue – Gurgaon',
        description: 'Fiber cut reported in block C.',
        location: 'DLF Cyber City, Gurgaon',
        status: 'In Progress',
        priority: 'Critical',
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  syncTask: async (task: any) => {
    await delay(800);
    console.log('Synced task to server:', task);
    return { success: true };
  },
};
