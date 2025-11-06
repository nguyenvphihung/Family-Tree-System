import { API_ENDPOINTS } from '../config/apiEndpoints';
import { makeRequest } from '../components/utils';
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
import { validateAlbumName, validators, ValidationError, validateAndShowToast } from '../utils/validation';
import { toast } from 'react-toastify';

class AlbumService {
    // GET /albums/{albumId} - Tìm album bằng Id
    async getAlbumById(albumId: string): Promise<Album> {
        try {
            // Validate albumId
            const albumIdError = validators.required(albumId, 'ID album');
            if (albumIdError) {
                toast.error(albumIdError, {
                    position: "top-center",
                    autoClose: 4000,
                });
                throw new Error(albumIdError);
            }

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
            // Validate userId
            const userIdError = validators.required(userId, 'ID người dùng');
            if (userIdError) {
                toast.error(userIdError, {
                    position: "top-center",
                    autoClose: 4000,
                });
                throw new Error(userIdError);
            }

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
            // Validate album name
            const validation = validateAlbumName(data.name);
            validateAndShowToast(validation, toast);

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
            // Validate albumId
            const albumIdError = validators.required(albumId, 'ID album');
            if (albumIdError) {
                toast.error(albumIdError, {
                    position: "top-center",
                    autoClose: 4000,
                });
                throw new Error(albumIdError);
            }

            // Validate album name
            const validation = validateAlbumName(name);
            validateAndShowToast(validation, toast);

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
            // Validate albumId
            const albumIdError = validators.required(albumId, 'ID album');
            if (albumIdError) {
                toast.error(albumIdError, {
                    position: "top-center",
                    autoClose: 4000,
                });
                throw new Error(albumIdError);
            }

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
