import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";
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
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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

// Response interceptor - Auto display toast from server messages
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Chỉ hiển thị toast cho mutations (POST, PUT, DELETE, PATCH), không hiển thị cho queries (GET)
    const method = response.config.method?.toUpperCase();
    const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method || '');

    if (isMutation) {
      // Lấy message từ server response
      const message = response.data?.message || 'Thao tác thành công';

      // Hiển thị toast success
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    return response;
  },
  (error) => {
    // Xử lý các lỗi và hiển thị message từ server
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || 'Đã xảy ra lỗi';

      // Hiển thị toast error với message từ server
      switch (status) {
        case 400:
          toast.error(message, {
            position: "top-center",
            autoClose: 4000,
          });
          break;
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("auth_token");
          toast.error(message || 'Phiên đăng nhập đã hết hạn', {
            position: "top-center",
            autoClose: 3000,
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
          break;
        case 403:
          toast.error(message || 'Bạn không có quyền thực hiện thao tác này', {
            position: "top-center",
            autoClose: 4000,
          });
          break;
        case 404:
          toast.error(message || 'Không tìm thấy tài nguyên', {
            position: "top-center",
            autoClose: 4000,
          });
          break;
        case 409:
          toast.warning(message, {
            position: "top-center",
            autoClose: 4000,
          });
          break;
        case 500:
          toast.error(message || 'Lỗi máy chủ', {
            position: "top-center",
            autoClose: 4000,
          });
          break;
        default:
          toast.error(message, {
            position: "top-center",
            autoClose: 4000,
          });
      }
    } else if (error.request) {
      // Lỗi network (không có response từ server)
      toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.', {
        position: "top-center",
        autoClose: 4000,
      });
    } else {
      // Lỗi khác
      toast.error(error.message || 'Đã xảy ra lỗi không xác định', {
        position: "top-center",
        autoClose: 4000,
      });
    }

    return Promise.reject(error);
  },
);

export default api;
export { api };
