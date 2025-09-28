import { api } from '@/config/axios';

// Utility function để hiển thị thông báo lỗi từ API calls
// Sử dụng axios để thực hiện API calls

// Biến global để lưu timeout ID để tránh trùng lặp
let currentTimeoutId: NodeJS.Timeout | null = null;

export async function makeRequest(endpoint: string, method: string, data: any, responseElementId: string | null, params?: any) {
    const responseArea = responseElementId ? document.getElementById(responseElementId) : null;


    try {
        let response;

        // Sử dụng axios để thực hiện API calls
        switch (method) {
            case 'GET':
                response = await api.get(endpoint, { params });
                break;
            case 'POST':
                response = await api.post(endpoint, data);
                break;
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

        // Lấy thông báo thành công từ server response
        const successMessage = `✅ ${response.data.message || 'Thao tác thành công'}`;

        console.log('📢 Success message from server:', response.data.message);
        console.log('📢 Final success message:', successMessage);
        console.log('🔗 API endpoint called:', endpoint);
        console.log('🔗 Method:', method);

        if (responseArea) {
            // Clear timeout cũ nếu có để tránh thông báo trùng lặp
            if (currentTimeoutId) {
                clearTimeout(currentTimeoutId);
            }

            responseArea.textContent = successMessage;
            responseArea.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-green-50 border border-green-300 text-green-800 rounded-lg p-3 shadow-lg max-w-sm text-center text-sm font-medium';
            responseArea.style.display = 'block';

            // Tự động ẩn sau 4 giây
            currentTimeoutId = setTimeout(() => {
                responseArea.style.display = 'none';
                responseArea.textContent = '';
                responseArea.className = 'response-area';
                currentTimeoutId = null;
            }, 4000);
        }

        // Reload tree if successful
        setTimeout(() => {
            // Có thể thêm logic reload tree ở đây nếu cần
            console.log('Operation successful, tree can be reloaded');
        }, 1500);

        // Trả về thông báo thành công và dữ liệu
        return {
            success: successMessage,
            data: response.data
        };
    } catch (error: any) {
        // Xử lý thông báo lỗi cụ thể dựa trên loại lỗi
        let errorMessage = '';

        if (error.response) {
            // Lỗi từ server (có response)
            const data = error.response.data;
            console.log('❌ Server error response:', error.response.status, data);

            // Lấy message lỗi từ server response
            errorMessage = `❌ ${data.message}`;
        } else if (error.request) {
            // Lỗi network (không có response)
            console.log('❌ Network error:', error.request);
            errorMessage = '❌ Lỗi kết nối: Không thể kết nối đến server';
        } else {
            // Lỗi khác
            console.log('❌ Other error:', error.message);
            errorMessage = `❌ Lỗi: ${error.message}`;
        }

        if (responseArea) {
            // Clear timeout cũ nếu có để tránh thông báo trùng lặp
            if (currentTimeoutId) {
                clearTimeout(currentTimeoutId);
            }

            responseArea.textContent = errorMessage;
            responseArea.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-red-50 border border-red-300 text-red-800 rounded-lg p-3 shadow-lg max-w-sm text-center text-sm font-medium';
            responseArea.style.display = 'block';

            // Tự động ẩn sau 6 giây (lâu hơn cho error)
            currentTimeoutId = setTimeout(() => {
                responseArea.style.display = 'none';
                responseArea.textContent = '';
                responseArea.className = 'response-area';
                currentTimeoutId = null;
            }, 6000);
        }

        // Trả về thông báo lỗi để có thể sử dụng ở nơi khác
        return {
            error: {
                message: errorMessage,
                originalError: error.message
            }
        };
    }
}
