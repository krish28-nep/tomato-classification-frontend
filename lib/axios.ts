// tomato-classification-frontend/lib/axios.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

let accessToken: string | null = null;
let isRefreshing = false;

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
};
let failedQueue: FailedRequest[] = [];

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Request interceptor - adds token to headers
axiosInstance.interceptors.request.use(config => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Process queued requests after token refresh
const processQueue = (error: Error | null, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token as string);
    }
  });
  failedQueue = [];
};

// Response interceptor - handles token refresh
axiosInstance.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const errorData = error.response?.data as { code?: string } | undefined;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token?: string) => {
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get new access token using refresh token from cookie
        const res = await axiosInstance.post('/auth/refresh');

        // Check multiple possible response structures
        const newToken = res.data.data.access_token;

        setAccessToken(newToken);

        // Update the original request's authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Process all queued requests with new token
        processQueue(null, newToken);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (err) {
        // If refresh fails, reject all queued requests

        processQueue(err as Error, undefined);
        setAccessToken(null); // Clear the invalid token

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;