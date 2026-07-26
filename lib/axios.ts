// lib/axios.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

type RetryRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

const shouldSkipRefresh = (url?: string) => {
  if (!url) return false;

  return [
    "/auth/login",
    "/auth/logout",
    "/auth/register",
    "/auth/refresh",
    "/auth/verify-otp",
    "/auth/resend-otp",
  ].some(authPath => url.includes(authPath));
};

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// Kept for existing callers. Tokens are stored in HttpOnly cookies by the API,
// so the browser client cannot and should not manage them directly.
export const setAccessToken = (token: string | null) => {
  void token;
};

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
