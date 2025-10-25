import { API_ENDPOINTS } from "../config/apiEndpoints";
import { UserProfile, UpdateUserProfile } from "../types/user";
import { makeRequest } from "../components/utils";

class UserService {
  async getProfile(): Promise<UserProfile> {
    try {
      const result = await makeRequest(API_ENDPOINTS.USER.PROFILE, 'GET', null, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  async updateProfile(data: UpdateUserProfile): Promise<UserProfile> {
    try {
      const result = await makeRequest(API_ENDPOINTS.USER.PROFILE, 'PUT', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    try {
      const result = await makeRequest(API_ENDPOINTS.USER.CHANGE_PASSWORD, 'PUT', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const result = await makeRequest(API_ENDPOINTS.USER.UPLOAD_AVATAR, 'POST', formData, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const result = await makeRequest(API_ENDPOINTS.USER.DELETE_ACCOUNT, 'DELETE', null, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserProfile> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.USER.BY_ID}/${id}`, 'GET', null, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  async searchUsers(query: string): Promise<UserProfile[]> {
    try {
      const result = await makeRequest(API_ENDPOINTS.USER.SEARCH, 'GET', null, 'response-area', { q: query });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;
