// Legacy family types - kept for backward compatibility
// For new code, use specific controller types from tree.ts, album.ts, image.ts, relation.ts

// Basic family member interface for API responses
export interface FamilyMember {
  id: string;
  treeId?: string;
  name: string;
  gender: 'M' | 'F';
  birthday?: string | null;
  birthPlace?: string | null;
  deathPlace?: string | null;
  gravePlace?: string | null;
  deathDate?: string | null; // Thêm trường ngày mất
  generation?: number;
  createdAt?: string;
  spouses?: FamilyMember[];
  children?: FamilyMember[];
  avatarUrl?: string;
  // Additional fields for spouses
  marriageDate?: string | null;
  divorceDate?: string | null;
}

// Tree interface (legacy, use types/tree.ts for new code)
export interface FamilyTree {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  members?: FamilyMember[];
}

// Generic API response interface (optional - for future use)
export interface ApiResponse<T = any> {
  code: number;
  status: string;
  message: string;
  data: T;
}
