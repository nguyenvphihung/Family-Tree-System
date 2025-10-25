import axios from 'axios';
import type {
    RestoreImageResponse,
    RestoreImageError
} from '@/types/restoreImage';

const API_BASE_URL = 'https://unpregnant-asia-nonvisiting.ngrok-free.dev';

class RestoreImageService {
    /**
     * Phục hồi ảnh bằng cách upload file
     * POST /api/restore
     * @param file - File ảnh cần phục hồi
     * @returns Response chứa URL ảnh đã phục hồi
     */
    async restoreByFile(file: File): Promise<RestoreImageResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            console.log('[RestoreImage] Uploading file:', {
                name: file.name,
                size: file.size,
                type: file.type
            });

            const response = await axios.post<RestoreImageResponse>(
                `${API_BASE_URL}/api/restore`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 300000 // 5 phút
                }
            );

            console.log('[RestoreImage] Success:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('[RestoreImage] Error:', error);
            if (error.response) {
                // Handle 422 Validation Error
                const errorData = error.response.data as RestoreImageError;
                if (error.response.status === 422 && errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
                        const messages = errorData.detail.map(d => d.msg).join(', ');
                        throw new Error(`Lỗi validation: ${messages}`);
                    } else {
                        throw new Error(errorData.detail);
                    }
                }
                throw new Error(errorData.detail as string || 'Không thể phục hồi ảnh');
            } else if (error.request) {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            } else {
                throw new Error(error.message || 'Có lỗi xảy ra khi phục hồi ảnh');
            }
        }
    }

    /**
     * Phục hồi ảnh bằng URL
     * POST /api/restore-by-url
     * @param imageUrl - URL của ảnh cần phục hồi
     * @returns Response chứa URL ảnh đã phục hồi
     */
    async restoreByUrl(imageUrl: string): Promise<RestoreImageResponse> {
        try {
            console.log('[RestoreImage] Restoring by URL:', imageUrl);

            const response = await axios.post<RestoreImageResponse>(
                `${API_BASE_URL}/api/restore-by-url`,
                {
                    image_url: imageUrl
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 300000 // 5 phút
                }
            );

            console.log('[RestoreImage] Success:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('[RestoreImage] Error:', error);
            if (error.response) {
                // Handle 422 Validation Error
                const errorData = error.response.data as RestoreImageError;
                if (error.response.status === 422 && errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
                        const messages = errorData.detail.map(d => d.msg).join(', ');
                        throw new Error(`Lỗi validation: ${messages}`);
                    } else {
                        throw new Error(errorData.detail);
                    }
                }
                throw new Error(errorData.detail as string || 'Không thể phục hồi ảnh');
            } else if (error.request) {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
            } else {
                throw new Error(error.message || 'Có lỗi xảy ra khi phục hồi ảnh');
            }
        }
    }
}

export const restoreImageService = new RestoreImageService();
export default restoreImageService;
