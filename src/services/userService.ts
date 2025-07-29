import { api } from "../config/axios";
import {
  UserProfile,
  UpdateUserProfile,
  ChangePasswordRequest,
} from "../types/user";

class UserService {
  private readonly USER_ENDPOINTS = {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
    UPLOAD_AVATAR: "/users/avatar",
    DELETE_ACCOUNT: "/users/account",
  };

  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>(this.USER_ENDPOINTS.PROFILE);
    return response.data;
  }

  async updateProfile(data: UpdateUserProfile): Promise<UserProfile> {
    const response = await api.put<UserProfile>(
      this.USER_ENDPOINTS.UPDATE_PROFILE,
      data,
    );
    return response.data;
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.post(this.USER_ENDPOINTS.CHANGE_PASSWORD, data);
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post<{ avatarUrl: string }>(
      this.USER_ENDPOINTS.UPLOAD_AVATAR,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  async deleteAccount(): Promise<void> {
    await api.delete(this.USER_ENDPOINTS.DELETE_ACCOUNT);
  }

  async getUserById(id: string): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/users/${id}`);
    return response.data;
  }

  async searchUsers(query: string): Promise<UserProfile[]> {
    const response = await api.get<UserProfile[]>(`/users/search`, {
      params: { q: query },
    });
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
