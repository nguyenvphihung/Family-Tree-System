// Image Controller Types

export interface Image {
    id: string;
    name: string;
    url: string;       // Image URL from server
    albumId: string;
}

// ==================== GET IMAGE ====================
export interface GetImageResponse {
    code: number;
    status: string;
    message: string;
    data: Image;
}

// ==================== GET IMAGES BY ALBUM ====================
export interface GetImagesByAlbumResponse {
    code: number;
    status: string;
    message: string;
    data: Image[];
}

// ==================== UPLOAD IMAGE ====================
export interface UploadImageRequest {
    file: string | File; // Support both base64 string and File object
    albumId: string; // query parameter
}

export interface UploadImageResponse {
    code: number;
    status: string;
    message: string;
    data: Image;
}

// ==================== DELETE IMAGE ====================
export interface DeleteImageResponse {
    code: number;
    status: string;
    message: string;
    data: string;
}
