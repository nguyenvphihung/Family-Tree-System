import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthState, User } from "../types/auth";
import { UserProfile } from "../types/user";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

// Auth Store
interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { fullName: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });
            const response = await authService.login({ email, password });
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || "Login failed",
              isLoading: false,
            });
            throw error;
          }
        },

        register: async (userData: { fullName: string; email: string; phone: string; password: string }) => {
          try {
            set({ isLoading: true, error: null });
            const response = await authService.register({
              email: userData.email,
              password: userData.password,
              name: userData.fullName,
              phone: userData.phone,
              confirmPassword: userData.password,
            });
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || "Registration failed",
              isLoading: false,
            });
            throw error;
          }
        },

        logout: async () => {
          try {
            await authService.logout();
          } catch (error) {
            console.error("Logout error:", error);
          } finally {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              error: null,
            });
          }
        },

        getCurrentUser: async () => {
          try {
            set({ isLoading: true });
            const user = await authService.getCurrentUser();
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || "Failed to get user",
              isLoading: false,
              isAuthenticated: false,
            });
          }
        },

        clearError: () => set({ error: null }),
        setLoading: (loading: boolean) => set({ isLoading: loading }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: "auth-store" },
  ),
);

// Theme Store
interface ThemeStore {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        theme: "system",
        setTheme: (theme) => set({ theme }),
        toggleTheme: () => {
          const currentTheme = get().theme;
          const newTheme = currentTheme === "light" ? "dark" : "light";
          set({ theme: newTheme });
        },
      }),
      {
        name: "theme-storage",
      },
    ),
    { name: "theme-store" },
  ),
);

// User Store
interface UserStore {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      getProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const profile = await userService.getProfile();
          set({ profile, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to get profile",
            isLoading: false,
          });
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const updatedProfile = await userService.updateProfile(data);
          set({ profile: updatedProfile, isLoading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to update profile",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: "user-store" },
  ),
);
