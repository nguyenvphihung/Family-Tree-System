// Core types for API relations
export interface CreateTreeRootRequest {
  name: string;
  gender: 'M' | 'F';
  birthday: string | null;
  birthPlace: string | null;
}

export interface CreateTreeRootResponse {
  id: string;
  treeId: string;
  name: string;
  gender: 'M' | 'F';
  birthday: string | null;
  birthPlace: string | null;
  generation: number;
  createdAt: string;
}

export interface AddChildrenRequest {
  parent1Id: string;
  parent2Id: string | null;
  child: {
    name: string;
    gender: 'M' | 'F';
    birthday: string | null;
    birthPlace: string | null;
  };
  childrenType: 'BIOLOGICAL' | 'SINGLE_PARENT';
  adoptionDate: string | null;
  notes: string | null;
}

export interface AddChildrenResponse {
  child: CreateTreeRootResponse;
  parent1: CreateTreeRootResponse;
  parent2?: CreateTreeRootResponse;
  childrenType: 'BIOLOGICAL' | 'SINGLE_PARENT';
  adoptionDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface AddParentRequest {
  childId: string;
  newParent: {
    name: string;
    gender: 'M' | 'F';
    birthday: string | null;
    birthPlace: string | null;
  };
}

// Frontend form data types
export interface AddParentData {
  prefix?: string;
  firstName: string;
  lastName: string;
  suffix?: string;
  gender: 'male' | 'female';
  birthDate: {
    precision: string;
    month: string;
    day: string;
    year: string;
  };
  birthPlace: string;
  isAlive: boolean;
  email?: string;
}

export interface ParentFormData {
  firstName: string;
  maidenName?: string;
  yearOfBirth: string;
  isAlive: boolean;
  countryOfBirth: string;
}

export interface GrandparentFormData {
  firstName: string;
  lastName: string;
  yearOfBirth: string;
  isAlive: boolean;
  countryOfBirth: string;
}

export interface AddSpouseRequest {
  newSpouse: {
    name: string;
    gender: 'M' | 'F';
    birthday: string | null;
    birthPlace: string | null;
  };
  marriageDate: string | null;
  divorceDate: string | null;
}

export interface AddSpouseResponse {
  person1: CreateTreeRootResponse;
  person2: CreateTreeRootResponse;
  marriageDate: string | null;
  divorceDate: string | null;
}

export interface PersonWithRelations {
  id: string;
  treeId: string;
  name: string;
  gender: 'M' | 'F';
  birthday: string | null;
  birthPlace: string | null;
  generation: number;
  createdAt: string;
  spouses: Array<{
    id: string;
    treeId: string;
    name: string;
    gender: 'M' | 'F';
    birthday: string | null;
    birthPlace: string | null;
    generation: number;
    createdAt: string;
    marriageDate: string | null;
    divorceDate: string | null;
  }>;
  children: PersonWithRelations[];
}

// Frontend FamilyMember interface for components
export interface FamilyMember {
  id: string;
  treeId?: string;
  name: string;
  gender: 'M' | 'F';
  birthday: string | null;
  birthPlace: string | null;
  generation: number;
  createdAt?: string;
  firstName: string;
  lastName: string;
  relationship: string;
  isAlive: boolean;
  countryOfBirth: string;
  birthYear: string;
  birthDate: {
    precision: string;
    month: string;
    day: string;
    year: string;
  };
  prefix?: string;
  suffix?: string;
  email?: string;
  spouses?: Array<{
    id: string;
    name: string;
    gender: 'M' | 'F';
    marriageDate: string | null;
    divorceDate: string | null;
  }>;
  children?: FamilyMember[];
}

// Store interface
export interface FamilyTreeStore {
  members: FamilyMember[];
  currentPerson: FamilyMember | null;
  isLoading: boolean;
  error: string | null;
  setCurrentPerson: (person: FamilyMember) => void;
  addFamilyMember: (member: FamilyMember) => void;
  addParents: (parents: { father: FamilyMember | null; mother: FamilyMember | null }) => void;

  clearFamilyTree: () => void;
  createTreeRoot: (treeId: string, data: any) => Promise<FamilyMember>;
  addChildren: (treeId: string, data: any) => Promise<any>;
  addParent: (treeId: string, data: any) => Promise<any>;
  addSpouse: (treeId: string, spouseId: string, data: any) => Promise<any>;
  getPersonWithRelations: (treeId: string, personId: string) => Promise<any>;
  clearError: () => void;
}

// API Response wrapper
export interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}
