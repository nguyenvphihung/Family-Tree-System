// Basic family member interface for API responses
export interface FamilyMember {
  id: string;
  treeId?: string;
  name: string;
  gender: 'M' | 'F';
  birthday?: string | null;
  birthPlace?: string | null;
  generation?: number;
  createdAt?: string;
  spouses?: FamilyMember[];
  children?: FamilyMember[];
  avatarUrl?: string;
  // Additional fields for spouses
  marriageDate?: string | null;
  divorceDate?: string | null;
}

// API response interfaces
export interface ApiResponse<T> {
  code: number;
  status?: string;
  message: string;
  data: T;
}

// Family tree store interface
export interface FamilyTreeStore {
  members: FamilyMember[];
  currentPerson: FamilyMember | null;
  isLoading: boolean;
  error: string | null;

  // API methods
  createTreeRoot: (treeId: string, data: any) => Promise<any>;
  addChildren: (treeId: string, data: any) => Promise<any>;
  addParent: (treeId: string, data: any) => Promise<any>;
  addSpouse: (treeId: string, spouseId: string, data: any) => Promise<any>;
  getPersonWithRelations: (treeId: string, personId: string) => Promise<any>;
  deletePerson: (personId: string) => Promise<boolean>;

  // State management
  setCurrentPerson: (person: FamilyMember | null) => void;
  setError: (error: string | null) => void;
}
