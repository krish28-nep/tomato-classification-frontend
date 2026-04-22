// lib/axios.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // required for refresh token (HttpOnly cookie)
});

let accessToken: string | null = null;
let isRefreshing = false;
let refreshTimeout: NodeJS.Timeout | null = null;

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
};

let failedQueue: FailedRequest[] = [];

// Decode JWT expiry (no external dependency)
type JwtPayload = {
  exp: number;
};

const getTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
    return payload.exp * 1000; // convert to ms
  } catch {
    return null;
  }
};

// Process queued requests after refresh completes
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

const scheduleTokenRefresh = (token: string) => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return;

  // Refresh 1 minute before expiry
  const REFRESH_BEFORE_MS = 60_000;
  const delay = expiry - Date.now() - REFRESH_BEFORE_MS;

  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }

  if (delay <= 0) {
    // Token already close to expiry
    refreshAccessToken();
    return;
  }

  refreshTimeout = setTimeout(() => {
    refreshAccessToken();
  }, delay);
};

export const setAccessToken = (token: string | null) => {
  accessToken = token;

  if (token) {
    scheduleTokenRefresh(token);
  } else if (refreshTimeout) {
    clearTimeout(refreshTimeout);
    refreshTimeout = null;
  }
};

const refreshAccessToken = async () => {
  if (isRefreshing) return;

  isRefreshing = true;

  try {
    // Uses refresh token from HttpOnly cookie
    const res = await axiosInstance.post('/auth/refresh');

    const newToken: string = res.data.data.access_token;

    setAccessToken(newToken);
    processQueue(null, newToken);
  } catch (err) {
    processQueue(err as Error);
    setAccessToken(null);
  } finally {
    isRefreshing = false;
  }
};

axiosInstance.interceptors.request.use(config => {
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      // If refresh already in progress → queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
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
        const res = await axiosInstance.post('/auth/refresh');
        const newToken: string = res.data.data.access_token;

        setAccessToken(newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err as Error);
        setAccessToken(null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;