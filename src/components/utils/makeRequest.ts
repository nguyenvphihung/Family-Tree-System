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
            case 'POST': {
                const isImageUpload = endpoint.includes('/images/upload');
                const postTimeout = isImageUpload ? 60000 : undefined; // Upload có thể chậm hơn

                // Nếu là FormData, để browser tự set boundary và content-type phù hợp
                if (typeof FormData !== 'undefined' && data instanceof FormData) {
                    response = await api.post(endpoint, data, {
                        timeout: postTimeout,
                    });
                } else {
                    response = await api.post(endpoint, data, {
                        timeout: postTimeout,
                    });
                }
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

        // Lấy thông báo thành công từ server response
        let serverMessage = response.data.message || 'Cập nhật thành công';

        // Custom message cho trường hợp tạo root person
        if (endpoint.includes('/relations/trees/') && endpoint.includes('/root') && method === 'POST') {
            serverMessage = 'Tạo thành viên đầu tiên trong gia phả thành công!';
        }

        // Custom message cho xóa cây
        if (endpoint.includes('/trees/') && method === 'DELETE') {
            serverMessage = 'Xóa cây gia phả thành công!';
          
        }
       

        if(endpoint.includes('/persons/') && method === 'DELETE') {
            serverMessage = 'Xóa người thành công!';
        }



        const successMessage = `${serverMessage}`;

        // Hiển thị message từ server trong console để theo dõi
        console.log(' Server success message:', serverMessage);
        console.log(' Full server response:', response.data);
        console.log(' API endpoint:', endpoint, '- Method:', method);

        // Chỉ hiển thị toast cho mutations (POST, PUT, DELETE, PATCH), không hiển thị cho queries (GET)
        const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes((method || '').toUpperCase());

        if (responseArea && isMutation) {
            // Clear timeout cũ nếu có để tránh thông báo trùng lặp
            if (currentTimeoutId) {
                clearTimeout(currentTimeoutId);
            }

            responseArea.textContent = successMessage;

            // Quy ước: mọi DELETE thành công hiển thị màu đỏ để người dùng nhận biết thao tác xóa
            const isDelete = (method || '').toUpperCase() === 'DELETE';

            // Tạo cây mới, cập nhật cây và xóa cây cần z-index cao hơn để hiển thị trên modal
            const isCreateTree = endpoint.includes('/trees') && method === 'POST';
            const isUpdateTree = endpoint.includes('/trees/') && method === 'PUT';
            const isDeleteTree = endpoint.includes('/trees/') && method === 'DELETE';
            const needHighZIndex = isCreateTree || isUpdateTree || isDeleteTree;
            // z-index phải cao hơn Dialog modal (z-[9998]) và Select Family Tree modal (z-[9999])
            const zIndexClass = needHighZIndex ? 'z-[99999]' : 'z-40';

            responseArea.className = `fixed top-20 left-1/2 transform -translate-x-1/2 ${zIndexClass} ${isDelete
                ? 'bg-red-50 border border-red-300 text-red-800'
                : 'bg-green-50 border border-green-300 text-green-800'
                } rounded-lg p-3 shadow-lg max-w-sm text-center text-sm font-medium`;
            responseArea.style.display = 'block';
            responseArea.style.zIndex = needHighZIndex ? '99999' : '40';

            // Tạo cây, cập nhật cây và xóa cây tự động ẩn sau 2 giây, các mutation khác sau 4 giây
            const hideDelay = needHighZIndex ? 2000 : 4000;
            currentTimeoutId = setTimeout(() => {
                responseArea.style.display = 'none';
                responseArea.textContent = '';
                responseArea.className = 'response-area';
                currentTimeoutId = null;
            }, hideDelay);
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
            let serverErrorMessage = data?.message || '';

            // Xử lý message cụ thể dựa trên endpoint và status code khi server không trả về message rõ ràng
            if (!serverErrorMessage ||
                serverErrorMessage === 'Internal Server Error' ||
                serverErrorMessage === 'Bad Request' ||
                serverErrorMessage.trim() === '' ||
                serverErrorMessage === 'Error') {
                // Xử lý trường hợp xóa cây
                if (endpoint.includes('/trees/') && method === 'DELETE') {

                    if (error.response.status === 400 || error.response.status === 409 || error.response.status === 500) {
                        serverErrorMessage = 'Không thể xóa cây này vì còn chứa nhiều thành viên. Chỉ có thể xóa cây khi chỉ còn lại 1 thành viên .';
                        // Hiển thị message lỗi lên trên modal trong 3s
                        if (responseArea) {
                            responseArea.textContent = `${serverErrorMessage}`;
                            responseArea.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-[99999] bg-red-50 border border-red-300 text-red-800 rounded-lg p-3 shadow-lg max-w-sm text-center text-sm font-medium';
                            responseArea.style.display = 'block';
                            responseArea.style.zIndex = '99999';
                            // Ẩn message sau 3s
                            if (currentTimeoutId) clearTimeout(currentTimeoutId);
                            currentTimeoutId = setTimeout(() => {
                                responseArea.style.display = 'none';
                                responseArea.textContent = '';
                                responseArea.className = 'response-area';
                                currentTimeoutId = null;
                            }, 4000);
                        }
                        // Đóng modal sau 1s
                        setTimeout(() => {
                            const modal = document.getElementById('delete-tree-modal');
                            if (modal) {
                                (modal as any).close();
                            }
                        }, 4000);
                        // Reload lại cây sau 1s
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    }
                }
            } else {
                // Xử lý trường hợp tạo cây khi đã có cây
                if (endpoint.includes('/trees') && method === 'POST' &&
                    (serverErrorMessage.includes('đã có cây') ||
                        serverErrorMessage.includes('already have') ||
                        serverErrorMessage.toLowerCase().includes('cây gia phả'))) {

                    // Hiển thị thông báo với z-index cao hơn modal
                    if (responseArea) {
                        responseArea.textContent = serverErrorMessage;
                        responseArea.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-[99999] bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg p-3 shadow-lg max-w-sm text-center text-sm font-medium';
                        responseArea.style.display = 'block';
                        responseArea.style.zIndex = '99999';

                        // Ẩn message sau 4s
                        if (currentTimeoutId) clearTimeout(currentTimeoutId);
                        currentTimeoutId = setTimeout(() => {
                            responseArea.style.display = 'none';
                            responseArea.textContent = '';
                            responseArea.className = 'response-area';
                            currentTimeoutId = null;
                        }, 4000);
                    }

                    // Đóng modal tạo cây
                    setTimeout(() => {
                        const modal = document.querySelector('[class*="modal"]') as HTMLElement;
                        if (modal) modal.style.display = 'none';
                    }, 1000);

                    // Reload cây để lấy cây hiện tại
                    setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('reloadCurrentTree'));
                    }, 1500);
                }

            }


            // Hiển thị error từ server trong console để theo dõi
            console.log(' Server error message:', serverErrorMessage);
            console.log(' Full server error response:', data);
            console.log(' Error status:', error.response.status);
            console.log(' Endpoint & Method:', endpoint, method);

            errorMessage = `${serverErrorMessage}`;
        } else if (error.request) {
            // Lỗi network (không có response)
            console.log(' Network error - No response from server');
            errorMessage = 'Lỗi kết nối: Không thể kết nối đến server';
        } else {
            // Lỗi khác
            console.log(' Other error:', error.message);
            errorMessage = `Lỗi: ${error.message}`;
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
                originalError: error.message,
                status: error.response?.status
            }
        };
    }
}
