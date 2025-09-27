import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { User, LoginCredentials, RegisterCredentials } from '../../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Kiểm tra authentication từ localStorage
      if (authService.isAuthenticated()) {
        const userResult = await authService.getCurrentUser();

        if (userResult.success && userResult.data) {
          setAuthState({
            user: userResult.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // Token có thể hết hạn, clear và set unauthenticated
          authService.clearTokens();
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: userResult.message,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      console.error('Error checking auth status:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Không thể kiểm tra trạng thái đăng nhập',
      });
    }
  };

  const login = async (credentials: LoginCredentials, rememberMe: boolean = false) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await authService.login(credentials, rememberMe);

      if (result.success) {
        // Lấy thông tin user sau khi đăng nhập thành công
        const userResult = await authService.getCurrentUser();

        if (userResult.success && userResult.data) {
          setAuthState({
            user: userResult.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, message: result.message };
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Không thể lấy thông tin người dùng'
          }));
          return { success: false, error: 'Không thể lấy thông tin người dùng' };
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false, error: result.message }));
        return { success: false, error: result.message };
      }
    } catch (error: any) {
      console.error('Login error in hook:', error);
      const errorMessage = error.message || 'Đăng nhập thất bại';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: RegisterCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await authService.register(userData);

      if (result.success) {
        // Đăng ký thành công, nhưng không tự động đăng nhập
        // User cần đăng nhập manual
        setAuthState(prev => ({ ...prev, isLoading: false, error: null }));
        return { success: true, message: result.message };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false, error: result.message }));
        return { success: false, error: result.message };
      }
    } catch (error: any) {
      console.error('Register error in hook:', error);
      const errorMessage = error.message || 'Đăng ký thất bại';
      setAuthState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await authService.logout();

      // Dù có lỗi hay không, vẫn clear state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      return { success: result.success, message: result.message };
    } catch (error: any) {
      console.error('Logout error in hook:', error);
      // Vẫn clear state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      return { success: false, error: error.message || 'Đăng xuất thất bại' };
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const refreshUser = async () => {
    if (authState.isAuthenticated) {
      await checkAuthStatus();
    }
  };

  return {
    // State
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,

    // Actions
    login,
    logout,
    register,
    checkAuthStatus,
    clearError,
    refreshUser,

    // Utilities
    isRememberMe: authService.isRememberMe,
    debugLocalStorage: authService.debugLocalStorage,
  };
};