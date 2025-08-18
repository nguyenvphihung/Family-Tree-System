import { API_ENDPOINTS } from "../config/apiEndpoints";
import { LoginCredentials, AuthResponse, RefreshTokenResponse } from "../types/auth";
import { makeRequest } from "../utils";

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const result = await makeRequest(API_ENDPOINTS.AUTH.LOGIN, 'POST', credentials, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest
      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      const result = await makeRequest(API_ENDPOINTS.AUTH.ME, 'GET', null, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest
      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const result = await makeRequest(API_ENDPOINTS.AUTH.REFRESH, 'POST', { refreshToken }, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest
      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const result = await makeRequest(API_ENDPOINTS.AUTH.LOGOUT, 'POST', null, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest
      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  async register(userData: any): Promise<AuthResponse> {
    try {
      const result = await makeRequest(API_ENDPOINTS.AUTH.REGISTER, 'POST', userData, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest
      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
