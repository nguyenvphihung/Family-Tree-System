import { API_ENDPOINTS } from '../config/apiEndpoints';
import { makeRequest } from '../utils';
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
            const result = await makeRequest(API_ENDPOINTS.PERSONS.GET_PERSON, 'GET', null, null, { personId });
            if (result.error) {
                throw new Error(result.error.message);
            }
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
            const result = await makeRequest(
                API_ENDPOINTS.PERSONS.UPDATE_BIRTH_INFO(personId),
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

    // PATCH /persons/upload-avatar?personId={personId} - Thêm hoặc cập nhật avatar
    async uploadAvatar(personId: string, data: UploadAvatarRequest): Promise<PersonInfo> {
        try {
            const result = await makeRequest(
                API_ENDPOINTS.PERSONS.UPLOAD_AVATAR,
                'PATCH',
                data,
                'response-area',
                { personId }
            );
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }
}

export default new PersonService();
