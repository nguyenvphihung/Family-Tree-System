import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthState, User } from "../types/auth";
import { UserProfile } from "../types/user";
import { FamilyMember, FamilyTreeStore } from "../types/family";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { familyService } from "../services/familyService";

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

// Family Tree Store

export const useFamilyTreeStore = create<FamilyTreeStore>()(
  devtools(
    persist(
      (set, get) => ({
        members: [],
        currentPerson: null,
        isLoading: false,
        error: null,

        setCurrentPerson: (person) => {
          set((state) => {
            const existingIndex = state.members.findIndex(member => member.id === person.id);
            const newMembers = [...state.members];
            
            if (existingIndex === -1) {
              newMembers.push(person);
            } else {
              newMembers[existingIndex] = person;
            }
            
            return {
              currentPerson: person,
              members: newMembers,
            };
          });
        },

        addFamilyMember: (member) => {
          set((state) => {
            const existingIndex = state.members.findIndex(m => m.id === member.id);
            const newMembers = [...state.members];
            
            if (existingIndex === -1) {
              newMembers.push(member);
            } else {
              newMembers[existingIndex] = member;
            }
            
            return { members: newMembers };
          });
        },

        addParents: (parents) => {
          set((state) => {
            const newMembers = [...state.members];
            
            // Add father
            const fatherIndex = newMembers.findIndex(m => m.id === parents.father.id);
            if (fatherIndex === -1) {
              newMembers.push(parents.father);
            } else {
              newMembers[fatherIndex] = parents.father;
            }
            
            // Add mother
            const motherIndex = newMembers.findIndex(m => m.id === parents.mother.id);
            if (motherIndex === -1) {
              newMembers.push(parents.mother);
            } else {
              newMembers[motherIndex] = parents.mother;
            }
            
            return { members: newMembers };
          });
        },

        addGrandparents: (grandparents) => {
          set((state) => {
            const newMembers = [...state.members];
            
            Object.values(grandparents).forEach(member => {
              if (member) {
                const existingIndex = newMembers.findIndex(m => m.id === member.id);
                if (existingIndex === -1) {
                  newMembers.push(member);
                } else {
                  newMembers[existingIndex] = member;
                }
              }
            });
            
            return { members: newMembers };
          });
        },

        clearFamilyTree: () => {
          set({ members: [], currentPerson: null });
        },

        // New API methods
        createTreeRoot: async (treeId: string, data: any) => {
          try {
            set({ isLoading: true, error: null });
            const response = await familyService.createTreeRoot(treeId, data);
            const newMember = response;
            
            // Map API response to frontend format
            const mappedMember: FamilyMember = {
              ...newMember,
              firstName: newMember.name.split(' ')[0] || '',
              lastName: newMember.name.split(' ').slice(1).join(' ') || '',
              relationship: 'self',
              isAlive: true,
              countryOfBirth: newMember.birthPlace || '',
              birthYear: newMember.birthday ? new Date(newMember.birthday).getFullYear().toString() : '',
              birthDate: {
                precision: 'exact',
                month: newMember.birthday ? (new Date(newMember.birthday).getMonth() + 1).toString() : '',
                day: newMember.birthday ? new Date(newMember.birthday).getDate().toString() : '',
                year: newMember.birthday ? new Date(newMember.birthday).getFullYear().toString() : ''
              }
            };
            
            set((state) => ({
              members: [mappedMember],
              currentPerson: mappedMember,
              isLoading: false
            }));
            
            return mappedMember;
          } catch (error: any) {
            set({
              error: error.response?.data?.message || "Lỗi tạo tree root",
              isLoading: false
            });
            throw error;
          }
        },

        addChildren: async (treeId: string, data: any) => {
          try {
            set({ isLoading: true, error: null });
            const response = await familyService.addChildren(treeId, data);
            
            // Map API response to frontend format
            const mappedChild: FamilyMember = {
              ...response.child,
              firstName: response.child.name.split(' ')[0] || '',
              lastName: response.child.name.split(' ').slice(1).join(' ') || '',
              relationship: 'self',
              isAlive: true,
              countryOfBirth: response.child.birthPlace || '',
              birthYear: response.child.birthday ? new Date(response.child.birthday).getFullYear().toString() : '',
              birthDate: {
                precision: 'exact',
                month: response.child.birthday ? (new Date(response.child.birthday).getMonth() + 1).toString() : '',
                day: response.child.birthday ? new Date(response.child.birthday).getDate().toString() : '',
                year: response.child.birthday ? new Date(response.child.birthday).getFullYear().toString() : ''
              }
            };
            
            set((state) => ({
              members: [...state.members, mappedChild],
              isLoading: false
            }));
            
            return response;
          } catch (error: any) {
            set({
              error: error.response?.data?.message || "Lỗi thêm con cái",
              isLoading: false
            });
            throw error;
          }
        },

        addParent: async (treeId: string, data: any) => {
          try {
            set({ isLoading: true, error: null });
            const response = await familyService.addParent(treeId, data);
            
            // Map API response to frontend format
            const mappedParent: FamilyMember = {
              ...response.parent1,
              firstName: response.parent1.name.split(' ')[0] || '',
              lastName: response.parent1.name.split(' ').slice(1).join(' ') || '',
              relationship: response.parent1.gender === 'M' ? 'father' : 'mother',
              isAlive: true,
              countryOfBirth: response.parent1.birthPlace || '',
              birthYear: response.parent1.birthday ? new Date(response.parent1.birthday).getFullYear().toString() : '',
              birthDate: {
                precision: 'exact',
                month: response.parent1.birthday ? (new Date(response.parent1.birthday).getMonth() + 1).toString() : '',
                day: response.parent1.birthday ? new Date(response.parent1.birthday).getDate().toString() : '',
                year: response.parent1.birthday ? new Date(response.parent1.birthday).getFullYear().toString() : ''
              }
            };
            
            set((state) => ({
              members: [...state.members, mappedParent],
              isLoading: false
            }));
            
            return response;
          } catch (error: any) {
            set({
              error: error.response?.data?.message || "Lỗi thêm cha mẹ",
              isLoading: false
            });
            throw error;
          }
        },

        addSpouse: async (treeId: string, spouseId: string, data: any) => {
          try {
            set({ isLoading: true, error: null });
            const response = await familyService.addSpouse(treeId, spouseId, data);
            
            // Map API response to frontend format
            const mappedSpouse: FamilyMember = {
              ...response.person2,
              firstName: response.person2.name.split(' ')[0] || '',
              lastName: response.person2.name.split(' ').slice(1).join(' ') || '',
              relationship: 'self',
              isAlive: true,
              countryOfBirth: response.person2.birthPlace || '',
              birthYear: response.person2.birthday ? new Date(response.person2.birthday).getFullYear().toString() : '',
              birthDate: {
                precision: 'exact',
                month: response.person2.birthday ? (new Date(response.person2.birthday).getMonth() + 1).toString() : '',
                day: response.person2.birthday ? new Date(response.person2.birthday).getDate().toString() : '',
                year: response.person2.birthday ? new Date(response.person2.birthday).getFullYear().toString() : ''
              }
            };
            
            set((state) => ({
              members: [...state.members, mappedSpouse],
              isLoading: false
            }));
            
            return response;
          } catch (error: any) {
            set({
              error: error.response?.data?.message || "Lỗi thêm vợ/chồng",
              isLoading: false
            });
            throw error;
          }
        },

        getPersonWithRelations: async (treeId: string, personId: string) => {
          try {
            set({ isLoading: true, error: null });
            const person = await familyService.getPersonWithRelations(treeId, personId);
            
            // Map API response to frontend format
            const mappedPerson: FamilyMember = {
              ...person,
              firstName: person.name.split(' ')[0] || '',
              lastName: person.name.split(' ').slice(1).join(' ') || '',
              relationship: 'self',
              isAlive: true,
              countryOfBirth: person.birthPlace || '',
              birthYear: person.birthday ? new Date(person.birthday).getFullYear().toString() : '',
              birthDate: {
                precision: 'exact',
                month: person.birthday ? (new Date(person.birthday).getMonth() + 1).toString() : '',
                day: person.birthday ? new Date(person.birthday).getDate().toString() : '',
                year: person.birthday ? new Date(person.birthday).getFullYear().toString() : ''
              }
            };
            
            set((state) => ({
              currentPerson: mappedPerson,
              isLoading: false
            }));
            
            return person;
          } catch (error: any) {
            set({
              error: error.response?.data?.message || "Lỗi lấy thông tin person",
              isLoading: false
            });
            throw error;
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "family-tree-storage",
      },
    ),
    { name: "family-tree-store" },
  ),
);
