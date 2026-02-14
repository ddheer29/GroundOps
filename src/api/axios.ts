import axios from 'axios';
import { API_URL } from '@env';

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
  (config) => {
    // You can add logic here, like adding auth tokens if they are stored globally
    // or just logging the request
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error status codes here if needed
    if (error.response) {
      console.error(`[API Error] ${error.response.status} - ${error.response.data?.message || error.message}`);
    } else {
      console.error(`[Network Error] ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
