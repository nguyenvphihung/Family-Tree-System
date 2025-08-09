import { api } from "../config/axios";
import { API_ENDPOINTS } from "../config/apiEndpoints";
import { LoginCredentials, AuthResponse, RefreshTokenResponse } from "../types/auth";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken },
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi refresh token:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      throw error;
    }
  }

  async register(userData: any): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData,
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
