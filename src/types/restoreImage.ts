// Restore Image API Types

// Response interface theo API spec
export interface RestoreImageResponse {
    task_id: string;
    success: boolean;
    original_url: string;
    restored_url: string;
    intermediate_url: string;
    original_size: Record<string, any>; // Dynamic object structure
    restored_size: Record<string, any>; // Dynamic object structure
    upscale_factor: number;
    faces_detected: number;
    error: string | null;
}

// Error response interface
export interface RestoreImageErrorDetail {
    loc: (string | number)[];
    msg: string;
    type: string;
}

export interface RestoreImageError {
    detail: RestoreImageErrorDetail[] | string;
}
