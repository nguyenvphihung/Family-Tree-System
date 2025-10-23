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
