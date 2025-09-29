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

// Tree interfaces
export interface FamilyTree {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  members?: FamilyMember[];
  
}

// Album interface
export interface Album {
  id: string;
  name: string;
  createdAt: string;
}

// Image interface
export interface Image {
  id: string;
  name: string;
  data: string;
  albumId: string;
  base64: string;
}

// API request interfaces - Tree CRUD
export interface CreateTreeRequest {
  userId: string;
  name: string;
}

export interface UpdateTreeRequest {
  treeId: string;
  name: string;
}

// API request interfaces - Albums
export interface CreateAlbumRequest {
  userId: string;
  name: string;
}

export interface UpdateAlbumRequest {
  albumId: string;
  name: string;
}

// API request interfaces - Tree Relations
export interface AddChildRequest {
  parent1Id: string;
  parent2Id: string;
  child: {
    name: string;
    gender: string;
    birthday: string;
    birthPlace: string;
  };
  childrenType: "BIOLOGICAL";
  adoptionDate: string;
  notes: string;
}

export interface AddParentRequest {
  childId: string;
  newParent: {
    name: string;
    gender: string;
    birthday: string;
    birthPlace: string;
  };
}

export interface CreateRootPersonRequest {
  name: string;
  gender: string;
  birthday: string;
  birthPlace: string;
}

export interface AddSpouseRequest {
  newSpouse: {
    name: string;
    gender: string;
    birthday: string;
    birthPlace: string;
  };
  marriageDate: string;
  divorceDate: string;
}

// API response interfaces - Tree CRUD
export interface CreateTreeResponse {
  code: number;
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    createdAt: string;
  };
}

export interface GetUserTreesResponse {
  code: number;
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    createdAt: string;
  }[];
}

export interface UpdateTreeResponse {
  code: number;
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    createdAt: string;
  };
}

export interface DeleteTreeResponse {
  code: number;
  status: string;
  message: string;
  data: string;
}

// API response interfaces - Tree Relations
export interface GetTreeRelationsResponse {
  code: number;
  status: string;
  message: string;
  data: {
    id: string;
    treeId: string;
    name: string;
    gender: string;
    birthday: string;
    birthPlace: string;
    generation: number;
    createdAt: string;
    spouses: Array<{
      id: string;
      treeId: string;
      name: string;
      gender: string;
      birthday: string;
      birthPlace: string;
      generation: number;
      createdAt: string;
      marriageDate: string;
      divorceDate?: string | null; // Có thể null nếu chưa ly hôn
    }>;
    children: string[];
  };
}

export interface GetPersonTreeRelationsResponse {
  code: number;
  status: string;
  message: string;
  data: {
    id: string;
    treeId: string;
    name: string;
    gender: string;
    birthday: string;
    birthPlace: string;
    generation: number;
    createdAt: string;
    spouses: Array<{
      id: string;
      treeId: string;
      name: string;
      gender: string;
      birthday: string;
      birthPlace: string;
      generation: number;
      createdAt: string;
      marriageDate: string;
      divorceDate?: string | null; // Có thể null nếu chưa ly hôn
    }>;
    children: string[];
  };
}

export interface AddChildResponse {
  code: number;
  status: string;
  message: string;
  data: {
    child: {
      id: string;
      treeId: string;
      name: string;
      gender: string;
      birthday: string;
      birthPlace: string;
      generation: string;
      createdAt: string;
    };
    parent1: {
      id: string;
      treeId: string;
      name: string;
      gender: string;
      birthday: string;
      birthPlace: string;
      generation: string;
      createdAt: string;
    };
    parent2: {
      id: string;
      treeId: string;
      name: string;
      gender: string;
      birthday: string;
      birthPlace: string;
      generation: string;
      createdAt: string;
    };
    childrenType: "BIOLOGICAL";
    adoptionDate: string;
    notes: string;
    createdAt: string;
  };
}

export interface AddParentResponse {
  code: number;
  status: string;
  message: string;
  data: {
    child: {
      id: string;
      treeId: string;
      name: string;
      gender: string;
      birthday: string;
      birthPlace: string;
      generation: string;
      createdAt: string;
    };
    parent1: {
      id: string;
      treeId: string;
      name: string;
      gender: string;
      birthday: string;
      birthPlace: string;
      generation: string;
      createdAt: string;
    };
    parent2: {
      id: string;
      treeId: string;
      name: string;
      gender: string;
      birthday: string;
      birthPlace: string;
      generation: string;
      createdAt: string;
    };
    childrenType: "BIOLOGICAL";
    adoptionDate: string;
    notes: string;
    createdAt: string;
  };
}

export interface CreateRootPersonResponse {
  code: number;
  status: string;
  message: string;
  data: {
    id: string;
    treeId: string;
    name: string;
    gender: string;
    birthday: string;
    birthPlace: string;
    generation: string;
    createdAt: string;
  };
}

export interface AddSpouseResponse {
  code: number;
  status: string;
  message: string;
  data: {
    person1: {
      id: string;
      treeId: string;
      name: string;
      gender: string;
      birthday: string;
      birthPlace: string;
      generation: string;
      createdAt: string;
    };
    person2: {
      id: string;
      treeId: string;
      name: string;
      gender: string;
      birthday: string;
      birthPlace: string;
      generation: string;
      createdAt: string;
    };
    marriageDate: string;
    divorceDate: string;
  };
}

// API response interfaces - Albums
export interface CreateAlbumResponse {
  code: number;
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    createdAt: string;
  };
}

export interface UpdateAlbumResponse {
  code: number;
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    createdAt: string;
  };
}

export interface DeleteAlbumResponse {
  code: number;
  status: string;
  message: string;
  data: string;
}

export interface GetUserAlbumsResponse {
  code: number;
  status: string;
  message: string;
  data: Album[];
}

// API response interfaces - Get album by ID
export interface GetAlbumByIdResponse {
  code: number;
  status: string;
  message: string;
  data: Album;
}

// API response interfaces - Images
export interface GetImageResponse {
  code: number;
  status: string;
  message: string;
  data: Image;
}

export interface GetImagesByAlbumRequest {
  albumId: string;
}

export interface GetImagesByAlbumResponse {
  code: number;
  status: string;
  message: string;
  data: Image[];
}

export interface UploadImageRequest {
  file: string; // base64 file content
  name: string; // query parameter
  albumId: string; // query parameter
}

export interface UploadImageResponse {
  code: number;
  status: string;
  message: string;
  data: Image;
}

export interface DeleteImageRequest {
  imageId: string; // path parameter
}

export interface DeleteImageResponse {
  code: number;
  status: string;
  message: string;
  data: string;
}

// Person deletion API
export interface DeletePersonRequest {
  personId: string; // path parameter
}

export interface DeletePersonResponse {
  code: number;
  status: string;
  message: string;
  data: string;
}

// Generic API response interface (optional - for future use)
export interface ApiResponse<T = any> {
  code: number;
  status: string;
  message: string;
  data: T;
}
