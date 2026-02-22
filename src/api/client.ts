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

export interface EventDto {
  _id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  color?: string;
  user: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  start: string;
  end: string;
  color: string;
}

export const ApiClient = {
  login: async (username: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', {
      username,
      password,
    });

    return {
      success: true,
      token: response.data.token,
      user: {
        id: response.data._id,
        username: response.data.username,
        name: response.data.name,
        dob: response.data.dob,
        profilePhoto: response.data.profilePhoto,
      },
    };
  },

  fetchTasks: async (): Promise<TaskDto[]> => {
    const response = await axiosInstance.get('/tasks');
    return response.data;
  },

  fetchEvents: async (): Promise<EventDto[]> => {
    const response = await axiosInstance.get('/events');
    return response.data;
  },

  createEvent: async (data: CreateEventDto): Promise<EventDto> => {
    const response = await axiosInstance.post('/events', data);
    return response.data;
  },

  updateEvent: async (
    eventId: string,
    data: Partial<CreateEventDto>,
  ): Promise<EventDto> => {
    const response = await axiosInstance.put(`/events/${eventId}`, data);
    return response.data;
  },

  syncTask: async (task: any) => {
    const response = await axiosInstance.post('/tasks/sync', {
      operation: 'UPDATE',
      data: task,
    });

    return response.data;
  },

  updateProfile: async (data: {
    name: string;
    dob: string;
    profilePhoto?: string;
  }) => {
    const response = await axiosInstance.put('/users/profile', data);
    return response.data;
  },

  deleteEvent: async (eventId: string) => {
    const response = await axiosInstance.delete(`/events/${eventId}`);
    return response.data;
  },
};
