export interface FamilyMember {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  prefix?: string;
  suffix?: string;
  birthYear?: string;
  birthDate?: {
    precision: string;
    month?: string;
    day?: string;
    year?: string;
  };
  birthPlace?: string;
  gender: 'male' | 'female' | 'unknown';
  isAlive: boolean;
  countryOfBirth?: string;
  maidenName?: string;
  email?: string;
  relationship: 'self' | 'father' | 'mother' | 'maternalGrandmother' | 'maternalGrandfather' | 'paternalGrandmother' | 'paternalGrandfather';
}

export interface FamilyTreeStore {
  members: FamilyMember[];
  currentPerson: FamilyMember | null;
  setCurrentPerson: (person: FamilyMember) => void;
  addFamilyMember: (member: FamilyMember) => void;
  addParents: (parents: { father: FamilyMember; mother: FamilyMember }) => void;
  addGrandparents: (grandparents: {
    maternalGrandmother?: FamilyMember;
    maternalGrandfather?: FamilyMember;
    paternalGrandmother?: FamilyMember;
    paternalGrandfather?: FamilyMember;
  }) => void;
  clearFamilyTree: () => void;
}

export interface AddParentData {
  gender: 'male' | 'female' | 'unknown';
  firstName: string;
  lastName: string;
  prefix?: string;
  suffix?: string;
  birthDate: {
    precision: string;
    month?: string;
    day?: string;
    year?: string;
  };
  birthPlace?: string;
  isAlive: boolean;
  email?: string;
}

export interface ParentFormData {
  firstName: string;
  maidenName?: string;
  yearOfBirth: string;
  countryOfBirth: string;
  isAlive: boolean;
}

export interface GrandparentFormData {
  firstName: string;
  lastName: string;
  yearOfBirth: string;
  countryOfBirth: string;
  isAlive: boolean;
}
