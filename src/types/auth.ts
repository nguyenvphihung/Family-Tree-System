import { Phone } from 'lucide-react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Cập nhật LoginCredentials để sử dụng phone thay vì email
export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  code: number;
  status: string;
  message: string;
  data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
}

// Thêm LoginResponse interface mới
export interface LoginResponse {
  code: number;
  status: string;
  message: string;
  data: {
    token: string;
    authenticated: boolean;
  }
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}
