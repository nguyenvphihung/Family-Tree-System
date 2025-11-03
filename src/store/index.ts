import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService, relationService, personService } from '@/services';

// Auth Store
interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
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

        login: async (phone: string, password: string) => {
          try {
            set({ isLoading: true, error: null });
            const response = await authService.login({ phone, password });
            set({
              user: response.data.user,
              token: response.data.token,
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

        register: async (userData: any) => {
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
              // user: response.user,
              // token: response.token,
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
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              error: null,
            });
          } catch (error) {
            console.error("Logout error:", error);
            // Force logout even if API fails
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              error: null,
            });
          }
        },

        setLoading: (loading: boolean) => set({ isLoading: loading }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated
        }),
      }
    ),
  ),
);

// Family Tree Store - Simplified for API-only usage
interface FamilyTreeState {
  members: any[];
  currentPerson: any;
  isLoading: boolean;
  error: string | null;
}

interface FamilyTreeStore extends FamilyTreeState {
  // API methods
  createTreeRoot: (treeId: string, data: any) => Promise<any>;
  addChildren: (treeId: string, data: any) => Promise<any>;
  addParent: (treeId: string, data: any) => Promise<any>;
  addSpouse: (treeId: string, spouseId: string, data: any) => Promise<any>;
  getPersonWithRelations: (treeId: string, personId: string) => Promise<any>;
  deletePerson: (personId: string) => Promise<boolean>;

  // Local state management
  setCurrentPerson: (person: any) => void;
  clearFamilyTree: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFamilyTreeStore = create<FamilyTreeStore>()(
  devtools(
    (set, get) => ({
      members: [],
      currentPerson: null,
      isLoading: false,
      error: null,

      // API Methods
      createTreeRoot: async (treeId: string, data: any) => {
        try {
          set({ isLoading: true, error: null });
          const response = await relationService.createRootPerson(treeId, data);
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Lỗi tạo root",
            isLoading: false
          });
          throw error;
        }
      },

      addChildren: async (treeId: string, data: any) => {
        try {
          set({ isLoading: true, error: null });
          const response = await relationService.addChild(treeId, data);
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Lỗi thêm con",
            isLoading: false
          });
          throw error;
        }
      },

      addParent: async (treeId: string, data: any) => {
        try {
          set({ isLoading: true, error: null });
          const response = await relationService.addParent(treeId, data);
          set({ isLoading: false });
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
          const response = await relationService.addSpouse(treeId, spouseId, data);
          set({ isLoading: false });
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
          const response = await relationService.getPersonTreeRelations(treeId, personId);
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Lỗi lấy thông tin",
            isLoading: false
          });
          throw error;
        }
      },

      deletePerson: async (personId: string) => {
        try {
          set({ isLoading: true, error: null });
          await personService.deletePerson(personId);

          // Remove person from members list
          set((state) => ({
            members: state.members.filter(member => member.id !== personId),
            isLoading: false
          }));

          return true;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Lỗi xóa person",
            isLoading: false
          });
          throw error;
        }
      },

      // Local State Management
      setCurrentPerson: (person: any) => set({ currentPerson: person }),
      clearFamilyTree: () => set({ members: [], currentPerson: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
    }),
  ),
);

// ==================== CURRENT TREE STORE (persist) ====================
interface CurrentTreeInfo {
  id: string;
  name: string;
  fundId?: string;
}

interface CurrentTreeState {
  currentTree: CurrentTreeInfo | null;
}

interface CurrentTreeStore extends CurrentTreeState {
  setCurrentTree: (tree: CurrentTreeInfo | null) => void;
  setFundId: (fundId: string) => void;
}

export const useCurrentTreeStore = create<CurrentTreeStore>()(
  devtools(
    persist(
      (set, get) => ({
        currentTree: null,
        setCurrentTree: (tree: CurrentTreeInfo | null) => set({ currentTree: tree }),
        setFundId: (fundId: string) => set((state) => ({
          currentTree: state.currentTree ? { ...state.currentTree, fundId } : { id: '', name: '', fundId }
        })),
      }),
      {
        name: 'current-tree-storage',
        partialize: (state) => ({ currentTree: state.currentTree }),
      }
    )
  )
);