// Image Controller Types

export interface Image {
    id: string;
    name: string;
    data: string;
    albumId: string;
    base64: string;
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
    file: string; // base64 file content
    albumId: string; // query parameter
    originalFile?: File; // optional raw file for multipart fallback (browser only)
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
