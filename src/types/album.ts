// Album Controller Types

export interface Album {
    id: string;
    name: string;
    createdAt: string;
}

// ==================== GET ALBUM BY ID ====================
export interface GetAlbumByIdResponse {
    code: number;
    status: string;
    message: string;
    data: Album;
}

// ==================== GET USER ALBUMS ====================
export interface GetUserAlbumsResponse {
    code: number;
    status: string;
    message: string;
    data: Album[];
}

// ==================== CREATE ALBUM ====================
export interface CreateAlbumRequest {
    userId: string;
    name: string;
}

export interface CreateAlbumResponse {
    code: number;
    status: string;
    message: string;
    data: Album;
}

// ==================== UPDATE ALBUM ====================
export interface UpdateAlbumRequest {
    albumId: string;
    name: string;
}

export interface UpdateAlbumResponse {
    code: number;
    status: string;
    message: string;
    data: Album;
}

// ==================== DELETE ALBUM ====================
export interface DeleteAlbumResponse {
    code: number;
    status: string;
    message: string;
    data: string;
}
