import { API_ENDPOINTS } from '../config/apiEndpoints';
import { makeRequest } from '../components/utils';
import {
    GetTreeRelationsResponse,
    GetPersonTreeRelationsResponse,
    AddChildRequest,
    AddChildResponse,
    AddParentRequest,
    AddParentResponse,
    CreateRootPersonRequest,
    CreateRootPersonResponse,
    AddSpouseRequest,
    AddSpouseResponse,
} from '../types/relation';
import { validatePersonInfo, throwIfInvalid, validators } from '../utils/validation';

class RelationService {
    // GET /relations/trees/{treeId} - Lấy cây nhưng không biết Person
    async getTreeRelations(treeId: string, maxDepth: number = 7): Promise<any> {
        try {
            const result = await makeRequest(
                API_ENDPOINTS.RELATIONS.GET_TREE_RELATIONS(treeId),
                'GET',
                null,
                null,
                { maxDepth }
            );
            return result.data;
        } catch (error: any) {
            throw error;
        }
    }

    // GET /relations/trees/{treeId}/persons/{personId} - Lấy cây kể từ Person được truyền
    async getPersonTreeRelations(
        treeId: string,
        personId: string,
        maxDepth: number = 7
    ): Promise<GetPersonTreeRelationsResponse['data']> {
        try {
            const result = await makeRequest(
                API_ENDPOINTS.RELATIONS.GET_PERSON_TREE_RELATIONS(treeId, personId),
                'GET',
                null,
                null,
                { maxDepth }
            );
            if (result.error) {
                throw new Error(result.error.message);
            }
            return result.data.data;
        } catch (error: any) {
            throw error;
        }
    }


    // POST /relations/trees/{treeId}/children - Thêm con cái
    async addChild(treeId: string, data: AddChildRequest): Promise<AddChildResponse['data']> {
        try {
            // Validate treeId
            const treeIdError = validators.required(treeId, 'ID cây gia phả');
            if (treeIdError) throw new Error(treeIdError);

            // Validate parent IDs
            const parent1Error = validators.required(data.parent1Id, 'ID cha/mẹ 1');
            if (parent1Error) throw new Error(parent1Error);

            // Validate child info
            if (data.child) {
                const validation = validatePersonInfo({
                    fullName: data.child.name,
                    gender: data.child.gender,
                    dateOfBirth: data.child.birthday
                });
                throwIfInvalid(validation);
            }

            const result = await makeRequest(
                API_ENDPOINTS.RELATIONS.ADD_CHILD(treeId),
                'POST',
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

    // POST /relations/trees/{treeId}/parent - Thêm cha mẹ
    async addParent(treeId: string, data: AddParentRequest): Promise<AddParentResponse['data']> {
        try {
            // Validate treeId
            const treeIdError = validators.required(treeId, 'ID cây gia phả');
            if (treeIdError) throw new Error(treeIdError);

            // Validate child ID
            const childError = validators.required(data.childId, 'ID con');
            if (childError) throw new Error(childError);

            // Validate parent info
            if (data.newParent) {
                const validation = validatePersonInfo({
                    fullName: data.newParent.name,
                    gender: data.newParent.gender,
                    dateOfBirth: data.newParent.birthday
                });
                throwIfInvalid(validation);
            }

            const result = await makeRequest(
                API_ENDPOINTS.RELATIONS.ADD_PARENT(treeId),
                'POST',
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

    // POST /relations/trees/{treeId}/root - Tạo người đầu tiên trong cây
    async createRootPerson(
        treeId: string,
        data: CreateRootPersonRequest
    ): Promise<CreateRootPersonResponse['data']> {
        try {
            // Validate treeId
            const treeIdError = validators.required(treeId, 'ID cây gia phả');
            if (treeIdError) throw new Error(treeIdError);

            // Validate root person info
            const validation = validatePersonInfo({
                fullName: data.name,
                gender: data.gender,
                dateOfBirth: data.birthday
            });
            throwIfInvalid(validation);

            const result = await makeRequest(
                API_ENDPOINTS.RELATIONS.CREATE_ROOT_PERSON(treeId),
                'POST',
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

    // POST /relations/trees/{treeId}/spouses/{spouseId} - Thêm hôn nhân (vợ/chồng)
    async addSpouse(
        treeId: string,
        spouseId: string,
        data: AddSpouseRequest
    ): Promise<AddSpouseResponse['data']> {
        try {
            // Validate IDs
            const treeIdError = validators.required(treeId, 'ID cây gia phả');
            if (treeIdError) throw new Error(treeIdError);

            const spouseIdError = validators.required(spouseId, 'ID người phối ngẫu');
            if (spouseIdError) throw new Error(spouseIdError);

            // Validate spouse info
            if (data.newSpouse) {
                const validation = validatePersonInfo({
                    fullName: data.newSpouse.name,
                    gender: data.newSpouse.gender,
                    dateOfBirth: data.newSpouse.birthday
                });
                throwIfInvalid(validation);
            }

            // Validate marriage date if provided
            if (data.marriageDate) {
                const dateError = validators.date(data.marriageDate);
                if (dateError) throw new Error(dateError);
            }

            const result = await makeRequest(
                API_ENDPOINTS.RELATIONS.ADD_SPOUSE(treeId, spouseId),
                'POST',
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
}

export default new RelationService();
