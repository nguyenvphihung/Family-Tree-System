import { API_ENDPOINTS } from '../config/apiEndpoints';
import { makeRequest } from '../utils';
import {
    Album,
    GetAlbumByIdResponse,
    GetUserAlbumsResponse,
    CreateAlbumRequest,
    CreateAlbumResponse,
    UpdateAlbumRequest,
    UpdateAlbumResponse,
    DeleteAlbumResponse,

} from '../types/album';

class AlbumService {
    // GET /albums/{albumId} - Tìm album bằng Id
    async getAlbumById(albumId: string): Promise<Album> {
        try {
            const result = await makeRequest(API_ENDPOINTS.ALBUMS.GET_ALBUM_BY_ID(albumId), 'GET', null, null);
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // GET /albums - Lấy tất cả album của 1 người dùng
    async getUserAlbums(userId: string): Promise<Album[]> {
        try {
            const result = await makeRequest(API_ENDPOINTS.ALBUMS.GET_USER_ALBUMS, 'GET', null, null, { userId });
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // POST /albums - Tạo mới 1 album
    async createAlbum(data: CreateAlbumRequest): Promise<Album> {
        try {
            const result = await makeRequest(API_ENDPOINTS.ALBUMS.CREATE_ALBUM, 'POST', data, 'response-area');
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // PUT /albums/{albumId} - Sửa thông tin album
    async updateAlbum(albumId: string, name: string): Promise<Album> {
        try {
            const data: UpdateAlbumRequest = { albumId, name };
            const result = await makeRequest(API_ENDPOINTS.ALBUMS.UPDATE_ALBUM(albumId), 'PUT', data, 'response-area');
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // DELETE /albums/{albumId} - Xóa album
    async deleteAlbum(albumId: string): Promise<string> {
        try {
            const result = await makeRequest(API_ENDPOINTS.ALBUMS.DELETE_ALBUM(albumId), 'DELETE', null, null);
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }
}

export default new AlbumService();
