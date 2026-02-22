import axios from 'axios';
import { API_URL } from '@env';

// Global token storage
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Optional: Add a timeout
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Inject auth token if available
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle specific error status codes here if needed
    if (error.response) {
      console.error(
        `[API Error] ${error.response.status} - ${
          error.response.data?.message || error.message
        }`,
      );

      // Handle 401 Unauthorized globally if needed
      if (error.response.status === 401) {
        console.warn('Unauthorized! Token may be expired or invalid.');
        // Consider triggering a global event or callback here to log the user out
      }
    } else {
      console.error(`[Network Error] ${error.message}`);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
