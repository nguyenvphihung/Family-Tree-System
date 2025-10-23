import { API_ENDPOINTS } from '../config/apiEndpoints';
import { makeRequest } from '../components/utils';
import {
    PersonInfo,
    UpdatePersonRequest,
    UpdateDeathInfoRequest,
    UpdateBirthInfoRequest,
    UploadAvatarRequest,
} from '../types/person';

class PersonService {
    // GET /persons?personId={personId} - Lấy thông tin 1 người
    async getPerson(personId: string): Promise<PersonInfo> {
        try {
            console.log('[GetPerson] Request for personId:', personId);
            const result = await makeRequest(
                `${API_ENDPOINTS.PERSONS.GET_PERSON}?personId=${personId}`,
                'GET',
                null,
                'response-area'
            );
            console.log('[GetPerson] API response:', result);
            if (result.error) {
                throw new Error(result.error.message);
            }
            console.log('[GetPerson] Returned data:', result.data.data);
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // PUT /persons/{personId} - Cập nhật toàn bộ thông tin 1 người
    async updatePerson(personId: string, data: UpdatePersonRequest): Promise<PersonInfo> {
        try {
            const result = await makeRequest(
                API_ENDPOINTS.PERSONS.UPDATE_PERSON(personId),
                'PUT',
                data,
                'response-area'
            );
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // DELETE /persons/{personId} - Xoá 1 người
    async deletePerson(personId: string): Promise<string> {
        try {
            const result = await makeRequest(
                API_ENDPOINTS.PERSONS.DELETE_PERSON(personId),
                'DELETE',
                null,
                'response-area'
            );
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // PATCH /persons/{personId}/death-info - Cập nhật thông tin người mất
    async updateDeathInfo(personId: string, data: UpdateDeathInfoRequest): Promise<PersonInfo> {
        try {
            const result = await makeRequest(
                API_ENDPOINTS.PERSONS.UPDATE_DEATH_INFO(personId),
                'PATCH',
                data,
                'response-area'
            );
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // PATCH /persons/{personId}/birth-info - Cập nhật thông tin về khai sinh
    async updateBirthInfo(personId: string, data: UpdateBirthInfoRequest): Promise<PersonInfo> {
        try {
            console.log('[UpdateBirthInfo] Request data:', { personId, data });
            const result = await makeRequest(
                API_ENDPOINTS.PERSONS.UPDATE_BIRTH_INFO(personId),
                'PATCH',
                data,
                'response-area'
            );
            console.log('[UpdateBirthInfo] API response:', result);
            if (result.error) {
                throw new Error(result.error.message);
            }
            console.log('[UpdateBirthInfo] Returned data:', result.data.data);
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }

    // PATCH /persons/{personId}/upload-avatar - Thêm hoặc cập nhật avatar
    async uploadAvatar(personId: string, data: UploadAvatarRequest): Promise<PersonInfo> {
        try {
            const { avatar } = data;
            console.log('[UploadAvatar] Starting upload for person:', personId, {
                avatarType: typeof avatar,
                avatarLength: typeof avatar === 'string' ? avatar.length : (avatar as File).size
            });

            // Create FormData for multipart upload (like image upload)
            const formData = new FormData();

            if (typeof avatar === 'string') {
                // Convert base64 string to Blob
                const avatarStr = avatar as string;
                const base64Data = avatarStr.split(',')[1] || avatarStr;
                const mimeMatch = avatarStr.match(/data:([^;]+);/);
                const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });

                formData.append('avatar', blob, 'avatar.jpg');
                console.log('[UploadAvatar] Converted base64 to Blob:', { size: blob.size, type: mimeType });
            } else {
                // Already a File object
                const avatarFile = avatar as File;
                formData.append('avatar', avatarFile);
                console.log('[UploadAvatar] Using File object:', { name: avatarFile.name, size: avatarFile.size });
            }

            const result = await makeRequest(
                API_ENDPOINTS.PERSONS.UPLOAD_AVATAR(personId),
                'PATCH',
                formData,
                'response-area'
            );
            console.log('[UploadAvatar] API response:', result);
            if (result.error) {
                throw new Error(result.error.message);
            }
            console.log('[UploadAvatar] Upload successful:', result.data.data);
            return result.data.data;
        } catch (error: any) {
            console.error('[UploadAvatar] Error:', error);
            throw error;
        }
    }
}

export default new PersonService();
