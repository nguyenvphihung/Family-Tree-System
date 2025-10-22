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

    // POST /images/upload - Upload ảnh
    async uploadImage(data: UploadImageRequest): Promise<Image> {
        try {
            const { file, name, albumId } = data;
            const endpoint = `${API_ENDPOINTS.IMAGES.UPLOAD_IMAGE}?name=${encodeURIComponent(name)}&albumId=${encodeURIComponent(albumId)}`;

            if (!file) {
                throw new Error('No file provided');
            }

            // API spec requires JSON body { file }
            const body = { file };

            const result = await makeRequest(endpoint, 'POST', body, 'response-area');
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data?.data ?? result.data;
        } catch (error: any) {
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
