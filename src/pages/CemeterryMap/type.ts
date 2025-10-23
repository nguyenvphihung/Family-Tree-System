import { PersonInfo } from "@/types/person";

export type GraveIcon = "user" | "heart" | "star" | "flower";

export type GraveLocation = {
  province: string;
};

// Mộ phần - mapping từ PersonInfo
export type Grave = {
  id: string; // personId
  treeId: string;
  name: string;
  relation: string; // sẽ tính từ generation hoặc custom
  description: string;
  birthYear: number | null;
  deathYear: number | null;
  location: GraveLocation;
  coordinates: { lat: number; lng: number };
  icon: GraveIcon;
  address?: string;
  avatarUrl?: string;
  gender?: string;
};

// Tree info
export interface TreeInfo {
  id: string;
  name: string;
  createdAt: string;
}

// API Response types
export interface GetTreesResponse {
  code: number;
  status: string;
  message: string;
  data: TreeInfo[];
}

export interface GetPersonsResponse {
  code: number;
  status: string;
  message: string;
  data: PersonInfo[];
}
