import { Album } from './../types/album';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { makeRequest } from '../utils';
import {
    Image,
    GetImageResponse,
    GetImagesByAlbumResponse,
    UploadImageRequest,
    UploadImageResponse,
    DeleteImageResponse,
} from '../types/image';

class ImageService {
    // GET /images/{imageId} - Lấy ảnh theo imageId
    async getImage(imageId: string): Promise<Image> {
        try {
            const result = await makeRequest(API_ENDPOINTS.IMAGES.GET_IMAGE(imageId), 'GET', null, null);
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // GET /images/by-album - Lấy ảnh theo albumId
    async getImagesByAlbum(albumId: string): Promise<Image[]> {
        try {
            const result = await makeRequest(API_ENDPOINTS.IMAGES.GET_IMAGES_BY_ALBUM, 'GET', null, null, { albumId });
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // POST /images/upload - Upload image using FormData
    // Parameters: albumId (query param)
    // Request body: FormData with 'file' field
    async uploadImage(data: UploadImageRequest): Promise<Image> {
        try {
            const formData = new FormData();
            formData.append('file', data.file);

            console.log('[Image Service] Uploading image to album:', data.albumId);

            const result = await makeRequest(
                API_ENDPOINTS.IMAGES.UPLOAD_IMAGE(data.albumId),
                'POST',
                formData,
                'response-area'
            );

            if (result.error) {
                throw new Error(result.error.message || 'Upload failed');
            }

            console.log('[Image Service] Upload successful:', result.data);

            // ✅ Return image data từ response
            return result.data.data; // result.data.data chứa ImageResponse
        } catch (error: any) {
            console.error('[Image Service] Upload error:', error);
            throw error;
        }
    }

    // DELETE /images/{imageId} - Xóa ảnh
    async deleteImage(imageId: string): Promise<string> {
        try {
            const result = await makeRequest(API_ENDPOINTS.IMAGES.DELETE_IMAGE(imageId), 'DELETE', null, 'response-area');
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }
}

export default new ImageService();
