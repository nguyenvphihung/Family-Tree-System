import { Album } from './../types/album';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { makeRequest } from '../components/utils';
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

    // GET /images/by-album/{albumId} - Lấy ảnh theo albumId
    async getImagesByAlbum(albumId: string): Promise<Image[]> {
        try {
            console.log('[ImageService] Getting images for album:', albumId);
            const result = await makeRequest(API_ENDPOINTS.IMAGES.GET_IMAGES_BY_ALBUM(albumId), 'GET', null, null);
            if (result.error) {
                console.error('[ImageService] Error getting images:', result.error);
                throw new Error(result.error.message);
            }
            console.log('[ImageService] Images loaded:', result.data.data);
            return result.data.data;
        } catch (error: any) {
            console.error('[ImageService] Exception getting images:', error);
            throw error;
        }
    }

    // POST /images/upload?albumId={albumId} - Upload image using FormData
    // Parameters: albumId (query param)
    // Request body: FormData with 'file' field
    async uploadImage(data: UploadImageRequest): Promise<Image> {
        try {
            const { file, albumId } = data;

            console.log('[ImageService] uploadImage:', {
                albumId,
                fileType: typeof file,
                fileLength: typeof file === 'string' ? file.length : (file as File).size
            });

            const endpoint = `${API_ENDPOINTS.IMAGES.UPLOAD_IMAGE}?albumId=${encodeURIComponent(albumId)}`;

            if (!file) {
                throw new Error('No file provided');
            }

            // Create FormData for multipart upload (like HTML test)
            const formData = new FormData();

            if (typeof file === 'string') {
                // Convert base64 string to Blob
                const fileStr = file as string;
                const base64Data = fileStr.split(',')[1] || fileStr;
                const mimeMatch = fileStr.match(/data:([^;]+);/);
                const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });

                formData.append('file', blob, 'image.jpg');
                console.log('[ImageService] Converted base64 to Blob:', { size: blob.size, type: mimeType });
            } else {
                // Already a File object
                const fileObj = file as File;
                formData.append('file', fileObj);
                console.log('[ImageService] Using File object:', { name: fileObj.name, size: fileObj.size });
            }

            const result = await makeRequest(endpoint, 'POST', formData, 'response-area');
            if (result.error) {
                throw new Error(result.error.message);
            }
            console.log('[ImageService] Upload successful:', result.data?.data ?? result.data);
            return result.data?.data ?? result.data;
        } catch (error: any) {
            console.error('[ImageService] Upload error:', error);
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
