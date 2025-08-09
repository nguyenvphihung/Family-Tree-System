import { api } from "../config/axios";
import { API_ENDPOINTS } from "../config/apiEndpoints";
import { UserProfile, UpdateUserProfile } from "../types/user";

class UserService {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>(API_ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy thông tin profile:", error);
      throw error;
    }
  }

  async updateProfile(data: UpdateUserProfile): Promise<UserProfile> {
    try {
      const response = await api.put<UserProfile>(
        API_ENDPOINTS.USER.PROFILE,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      throw error;
    }
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    try {
      await api.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
    } catch (error) {
      console.error("Lỗi thay đổi mật khẩu:", error);
      throw error;
    }
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.post<{ avatarUrl: string }>(
        API_ENDPOINTS.USER.UPLOAD_AVATAR,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi upload avatar:", error);
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.USER.DELETE_ACCOUNT);
    } catch (error) {
      console.error("Lỗi xóa tài khoản:", error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`${API_ENDPOINTS.USER.BY_ID}/${id}`);
    return response.data;
  }

  async searchUsers(query: string): Promise<UserProfile[]> {
    const response = await api.get<UserProfile[]>(API_ENDPOINTS.USER.SEARCH, {
      params: { q: query },
    });
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
