import { api } from "../config/axios";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  RefreshTokenResponse,
  User,
} from "../types/auth";

class AuthService {
  private readonly AUTH_ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  };

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      this.AUTH_ENDPOINTS.LOGIN,
      credentials,
    );

    // Store tokens
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("refresh_token", response.data.refreshToken);
    }

    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      this.AUTH_ENDPOINTS.REGISTER,
      credentials,
    );

    // Store tokens
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("refresh_token", response.data.refreshToken);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post(this.AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear tokens regardless of API call success
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(this.AUTH_ENDPOINTS.ME);
    return response.data;
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post<RefreshTokenResponse>(
      this.AUTH_ENDPOINTS.REFRESH,
      { refreshToken },
    );

    // Update stored tokens
    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("refresh_token", response.data.refreshToken);

    return response.data;
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post(this.AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post(this.AUTH_ENDPOINTS.RESET_PASSWORD, {
      token,
      password,
    });
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export default authService;
