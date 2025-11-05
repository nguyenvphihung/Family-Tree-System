import { api } from '@/config/axios';

/**
 * Make HTTP request using axios
 * Tất cả thông báo (success/error) được xử lý tự động bởi axios interceptors với react-toastify
 * Messages được lấy trực tiếp từ server response
 * 
 * @param endpoint - API endpoint
 * @param method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param data - Request body data
 * @param responseElementId - (Deprecated) No longer used - kept for backward compatibility
 * @param params - Query parameters for GET requests
 */
export async function makeRequest(
    endpoint: string,
    method: string,
    data: any,
    responseElementId: string | null,
    params?: any
) {
    try {
        let response;

        // Thực hiện API calls với axios
        switch (method.toUpperCase()) {
            case 'GET':
                response = await api.get(endpoint, { params });
                break;
            case 'POST': {
                const isImageUpload = endpoint.includes('/images/upload');
                const postTimeout = isImageUpload ? 60000 : undefined;

                response = await api.post(endpoint, data, {
                    timeout: postTimeout,
                });
                break;
            }
            case 'PUT':
                response = await api.put(endpoint, data);
                break;
            case 'DELETE':
                response = await api.delete(endpoint);
                break;
            case 'PATCH':
                response = await api.patch(endpoint, data);
                break;
            default:
                throw new Error(`Method ${method} không được hỗ trợ`);
        }

        // Log response trong development mode
        if (import.meta.env.DEV) {
            console.log('✅ API Success:', {
                endpoint,
                method,
                message: response.data?.message,
                status: response.status,
                timestamp: new Date().toISOString()
            });
        }

        // Trả về data từ server
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        // Log error trong development mode
        if (import.meta.env.DEV) {
            console.error('❌ API Error:', {
                endpoint,
                method,
                message: error.response?.data?.message,
                status: error.response?.status,
                timestamp: new Date().toISOString()
            });
        }

        // Trả về error info (toast đã được hiển thị bởi axios interceptor)
        return {
            success: false,
            error: {
                message: error.response?.data?.message || error.message,
                status: error.response?.status
            }
        };
    }
}
