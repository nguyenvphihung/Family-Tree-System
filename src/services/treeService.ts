import { API_ENDPOINTS } from '../config/apiEndpoints';
import { makeRequest } from '../utils';
import {
    Tree,
    CreateTreeRequest,
    CreateTreeResponse,
    GetUserTreesResponse,
    UpdateTreeRequest,
    UpdateTreeResponse,
    DeleteTreeResponse,
} from '../types/tree';

class TreeService {
    // GET /trees - Lấy tất cả cây của người dùng hiện tại
    async getTrees(): Promise<Tree[]> {
        try {
            const result = await makeRequest(API_ENDPOINTS.TREES.GET_USER_TREES, 'GET', null, null);
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // GET /trees?userId={userId} - Lấy tất cả cây của một người dùng cụ thể
    async getUserTrees(userId: string): Promise<Tree[]> {
        try {
            const result = await makeRequest(API_ENDPOINTS.TREES.GET_USER_TREES, 'GET', null, null, { userId });
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // POST /trees - Tạo mới 1 cây
    async createTree(data: CreateTreeRequest): Promise<Tree> {
        try {
            const result = await makeRequest(API_ENDPOINTS.TREES.CREATE_TREE, 'POST', data, 'response-area');
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // PUT /trees/{treeId} - Sửa thông tin cây
    async updateTree(treeId: string, name: string): Promise<Tree> {
        try {
            const data: UpdateTreeRequest = { name };
            const result = await makeRequest(API_ENDPOINTS.TREES.UPDATE_TREE(treeId), 'PUT', data, 'response-area');
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // DELETE /trees/{treeId} - Xóa cây
    async deleteTree(treeId: string): Promise<string> {
        try {
            const result = await makeRequest(API_ENDPOINTS.TREES.DELETE_TREE(treeId), 'DELETE', null, 'response-area');
            if (result.error) {
                throw new Error(result.error.message || 'Failed to delete tree');
            }

            // Return data from server response
            if (result.data && result.data.data !== undefined) {
                return result.data.data;
            } else if (result.data && result.data.message) {
                return result.data.message;
            } else {
                return 'Tree deleted successfully';
            }
        } catch (error: any) {
            throw error;
        }
    }
}

export default new TreeService();
