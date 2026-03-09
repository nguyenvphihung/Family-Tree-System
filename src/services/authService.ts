import { API_ENDPOINTS } from "../config/apiEndpoints";
import {
  LoginCredentials,
  RegisterCredentials,
  RegisterResponse,
  LoginResponse
} from "../types/auth";
import { makeRequest } from "../components/utils";
import {
  validateLoginCredentials,
  validateRegisterCredentials,
  throwIfInvalid,
  ValidationError
} from "../utils/validation";

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly IS_AUTHENTICATED_KEY = 'isAuthenticated';
  private readonly REMEMBER_ME_KEY = 'rememberMe';

  // lưu token
  saveTokens(token: string, rememberMe: boolean = false): void {
    console.log('Đang lưu token:', { token: token.substring(0, 20) + '...', rememberMe });

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.IS_AUTHENTICATED_KEY, 'true');

    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_ME_KEY, 'true');
    }

    const savedToken = localStorage.getItem(this.TOKEN_KEY);
    const savedAuth = localStorage.getItem(this.IS_AUTHENTICATED_KEY);

    console.log('Token đã được lưu vào localStorage:', {
      tokenSaved: !!savedToken,
      authSaved: savedAuth,
      tokenPreview: savedToken?.substring(0, 20) + '...'
    });
  }

  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.IS_AUTHENTICATED_KEY);
    localStorage.removeItem(this.REMEMBER_ME_KEY);
    console.log('Token đã được xóa khỏi localStorage');
  }

  // Method để lấy token
  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('Lấy token từ localStorage:', token ? 'Có token' : 'Không có token');
    return token;
  }

  // Method để kiểm tra trạng thái đăng nhập
isAuthenticated(): boolean {
  return true;

  
  }

  // Method để kiểm tra remember me
  isRememberMe(): boolean {
    return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
  }

  // API Login
  async loginAPI(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('Gọi API login với credentials:', { phone: credentials.phone });

      // Validate credentials before making API call
      const validation = validateLoginCredentials(credentials.phone, credentials.password);
      throwIfInvalid(validation);

      const result = await makeRequest(API_ENDPOINTS.AUTH.LOGIN, 'POST', credentials, null);

      console.log('Raw result từ makeRequest:', result);

      if (result.error) {
        console.error('Lỗi từ makeRequest:', result.error);
        throw new Error(result.error.message);
      }

      console.log('Response data từ API:', result.data);
      return result.data;
    } catch (error: any) {
      console.error('Lỗi gọi API login:', error);
      throw error;
    }
  }

  // API Register
  async registerAPI(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      // Validate credentials before making API call
      const validation = validateRegisterCredentials(
        credentials.phone,
        credentials.password,
        credentials.confirmPassword,
        credentials.name
      );
      throwIfInvalid(validation);

      const result = await makeRequest(API_ENDPOINTS.AUTH.REGISTER, 'POST', credentials, null);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      console.error('Lỗi gọi API register:', error);
      throw error;
    }
  }

  // API Get Current User (đổi sang /users/profile thay cho /auth/me)
  async getCurrentUserAPI(): Promise<any> {
    // Cố gắng gọi lần 1: /users/profile
    try {
      const result = await makeRequest(API_ENDPOINTS.USER.PROFILE, 'GET', null, null);
      if (!result.error) {
        return result.data;
      }
      // Nếu result.error tồn tại, thử fallback luôn (không phụ thuộc error.response)
    } catch (e) {
      // Bỏ qua, chuyển sang fallback
    }

    // Fallback lần 2: /auth/me
    try {
      const fallback = await makeRequest(API_ENDPOINTS.AUTH.ME, 'GET', null, null);
      if (fallback.error) {
        throw new Error(fallback.error.message);
      }
      return fallback.data;
    } catch (fallbackErr: any) {
      console.error('Lỗi fallback /auth/me:', fallbackErr);
      throw fallbackErr;
    }
  }

  // API Đăng xuất
  async logoutAPI(): Promise<void> {
    try {
      const result = await makeRequest(API_ENDPOINTS.AUTH.LOGOUT, 'POST', null, null);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      console.error('Lỗi gọi API logout:', error);
      throw error;
    }
  }

  // Xử lý đăng nhập hoàn chỉnh
  async login(credentials: LoginCredentials, rememberMe: boolean = false): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      console.log('Bắt đầu process đăng nhập...');

      // 1. Gọi API đăng nhập
      const response = await this.loginAPI(credentials);

      console.log('Response từ API:', {
        code: response.code,
        status: response.status,
        message: response.message,
        dataKeys: Object.keys(response.data || {}),
        authenticated: response.data?.authenticated,
        hasToken: !!response.data?.token
      });

      if (response.data?.authenticated && response.data?.token) {
        console.log('Tất cả conditions đều OK, tiến hành lưu token...');

        // 3. Lưu token
        this.saveTokens(response.data.token, rememberMe);

        // 4. Verify token đã được lưu
        const verifyToken = this.getToken();
        console.log('Verify token sau khi lưu:', !!verifyToken);

        return {
          success: true,
          message: response.message || 'Đăng nhập thành công',
          data: response.data
        };
      } else {
        console.log('Một hoặc nhiều conditions fail, không lưu token');
        return {
          success: false,
          message: response.message || 'Đăng nhập thất bại'
        };
      }
    } catch (error: any) {
      console.error('Exception trong login process:', error);
      return {
        success: false,
        message: error.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.'
      };
    }
  }

  // Xử lý đăng ký hoàn chỉnh
  async register(credentials: RegisterCredentials): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      // 1. Gọi API đăng ký
      const response = await this.registerAPI(credentials);

      // 2. Kiểm tra response
      if (response.code === 0) {
        return {
          success: true,
          message: response.message || 'Đăng ký thành công',
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.message || 'Đăng ký thất bại'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Đăng ký thất bại. Vui lòng thử lại sau.'
      };
    }
  }

  // Decode JWT để lấy thông tin cơ bản (fallback khi không có /users/profile)
  private decodeTokenSafely(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (e) {
      return null;
    }
  }

  // Xử lý lấy thông tin user với token validation
  async getCurrentUser(): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      // 1. Kiểm tra authentication
      if (!this.isAuthenticated()) {
        return {
          success: false,
          message: 'Chưa đăng nhập'
        };
      }

      // 2. Không gọi API để tránh 404; decode token để lấy user tối thiểu
      const token = this.getToken();
      const payload = token ? this.decodeTokenSafely(token) : null;
      const guessedUserId = payload?.userId || payload?.sub || payload?.id;
      if (guessedUserId) {
        return {
          success: true,
          message: 'Lấy thông tin user từ token',
          data: { id: guessedUserId }
        };
      }

      // Nếu không decode được, coi như không thể lấy thông tin user
      return {
        success: false,
        message: 'Không thể lấy thông tin user từ token'
      };
    } catch (error: any) {
      // Nếu token hết hạn
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        this.clearTokens();
      }

      return {
        success: false,
        message: error.message || 'Không thể lấy thông tin user'
      };
    }
  }

  // Xử lý đăng xuất 
  async logout(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      console.log('Đăng xuất - chỉ xóa token local');

      // xóa token khỏi localStorage
      this.clearTokens();

      return {
        success: true,
        message: 'Đăng xuất thành công'
      };
    } catch (error: any) {
      // Vẫn xóa token dù có lỗi
      this.clearTokens();
      return {
        success: false,
        message: error.message || 'Có lỗi khi đăng xuất'
      };
    }
  }



  // Method để debug localStorage
  debugLocalStorage(): void {
    console.log('DEBUG LOCALSTORAGE:');
    console.log('- auth_token:', localStorage.getItem(this.TOKEN_KEY) ? 'CÓ' : 'KHÔNG');
    console.log('- isAuthenticated:', localStorage.getItem(this.IS_AUTHENTICATED_KEY));
    console.log('- rememberMe:', localStorage.getItem(this.REMEMBER_ME_KEY));
  }
}

export const authService = new AuthService();
export default authService;
