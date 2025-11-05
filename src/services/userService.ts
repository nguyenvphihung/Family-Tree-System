import { API_ENDPOINTS } from "../config/apiEndpoints";
import { UserProfile, UpdateUserProfile } from "../types/user";
import { makeRequest } from "../components/utils";
import {
  validateUserProfile,
  validateChangePassword,
  validateImageUpload,
  throwIfInvalid,
  validators
} from "../utils/validation";

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
      // Validate user profile
      if (data.name || data.phone) {
        const validation = validateUserProfile({
          fullName: data.name,
          phone: data.phone
        });
        throwIfInvalid(validation);
      }

      // Validate date of birth if provided
      if (data.dateOfBirth) {
        const dateError = validators.date(data.dateOfBirth);
        if (dateError) throw new Error(dateError);
        const futureError = validators.notFutureDate(data.dateOfBirth);
        if (futureError) throw new Error(futureError);
      }

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
    confirmNewPassword?: string;
  }): Promise<void> {
    try {
      // Validate password change
      const validation = validateChangePassword(
        data.currentPassword,
        data.newPassword,
        data.confirmNewPassword || data.newPassword
      );
      throwIfInvalid(validation);

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
      // Validate image file
      const validation = validateImageUpload(file);
      throwIfInvalid(validation);

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
      // Validate user ID
      const idError = validators.required(id, 'ID người dùng');
      if (idError) throw new Error(idError);

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
