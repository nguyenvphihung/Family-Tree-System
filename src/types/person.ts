// Person interfaces for API requests and responses

export interface PersonInfo {
    id: string;
    treeId: string;
    name: string;
    gender: string;
    avatarUrl?: string;
    birthday: string;
    birthPlace: string;
    deathPlace?: string;
    gravePlace?: string;
    generation: string;
    createdAt: string;
}

// ==================== GET PERSON ====================
export interface GetPersonResponse {
    code: number;
    status: string;
    message: string;
    data: PersonInfo;
}

// ==================== UPDATE PERSON ====================
export interface UpdatePersonRequest {
    name: string;
    gender: string;
    birthday: string;
    birthPlace: string;
    createdAt: string;
}

export interface UpdatePersonResponse {
    code: number;
    status: string;
    message: string;
    data: PersonInfo;
}

// ==================== DELETE PERSON ====================
export interface DeletePersonResponse {
    code: number;
    status: string;
    message: string;
    data: string;
}

// ==================== UPDATE DEATH INFO ====================
export interface UpdateDeathInfoRequest {
    deathPlace: string;
    gravePlace: string;
    deathDate: string;
}

export interface UpdateDeathInfoResponse {
    code: number;
    status: string;
    message: string;
    data: PersonInfo;
}

// ==================== UPDATE BIRTH INFO ====================
export interface UpdateBirthInfoRequest {
    birthLocation: string;
}

export interface UpdateBirthInfoResponse {
    code: number;
    status: string;
    message: string;
    data: PersonInfo;
}

// ==================== UPLOAD AVATAR ====================
export interface UploadAvatarRequest {
    avatar: string; // base64 string
}

export interface UploadAvatarResponse {
    code: number;
    status: string;
    message: string;
    data: PersonInfo;
}
