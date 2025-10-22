import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { env } from "./env";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log base URL in development to help diagnose misconfiguration
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log("Using API base URL:", env.API_BASE_URL);
}

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug: log whether auth header is attached and target URL (without leaking token)
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(
        "[axios] auth header attached:", !!token,
        "method:", (config.method || 'GET').toUpperCase(),
        "url:", `${config.baseURL || ''}${config.url || ''}`
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
export { api };
