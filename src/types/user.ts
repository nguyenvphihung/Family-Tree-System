export interface UserProfile {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "suspended";
  emailVerified: boolean;
  phoneVerified: boolean;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private" | "friends";
    showEmail: boolean;
    showPhone: boolean;
  };
}

export interface UpdateUserProfile {
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
