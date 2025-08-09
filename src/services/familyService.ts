import { api } from "../config/axios";
import { API_ENDPOINTS } from "../config/apiEndpoints";
import {
  CreateTreeRootRequest,
  CreateTreeRootResponse,
  AddChildrenRequest,
  AddChildrenResponse,
  AddParentRequest,
  AddSpouseRequest,
  AddSpouseResponse,
  PersonWithRelations,
  ApiResponse
} from "../types/family";

class FamilyService {
  // Lấy thông tin person với spouses và children
  async getPersonWithRelations(treeId: string, personId: string): Promise<PersonWithRelations> {
    try {
      const response = await api.get<ApiResponse<PersonWithRelations>>(
        `${API_ENDPOINTS.RELATIONS.GET_PERSON}/${treeId}/persons/${personId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Lỗi lấy thông tin person với relations:", error);
      throw error;
    }
  }

  // Tạo node đầu tiên trong cây (root)
  async createTreeRoot(treeId: string, data: CreateTreeRootRequest): Promise<CreateTreeRootResponse> {
    try {
      const response = await api.post<CreateTreeRootResponse>(
        `${API_ENDPOINTS.RELATIONS.CREATE_TREE_ROOT}/${treeId}/root`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi tạo tree root:", error);
      throw error;
    }
  }

  // Thêm con cái
  async addChildren(treeId: string, data: AddChildrenRequest): Promise<AddChildrenResponse> {
    try {
      const response = await api.post<AddChildrenResponse>(
        `${API_ENDPOINTS.RELATIONS.ADD_CHILDREN}/${treeId}/children`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi thêm con cái:", error);
      throw error;
    }
  }

  // Thêm cha mẹ
  async addParent(treeId: string, data: AddParentRequest): Promise<AddChildrenResponse> {
    try {
      const response = await api.post<AddChildrenResponse>(
        `${API_ENDPOINTS.RELATIONS.ADD_PARENT}/${treeId}/parent`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi thêm cha mẹ:", error);
      throw error;
    }
  }

  // Thêm vợ/chồng
  async addSpouse(treeId: string, spouseId: string, data: AddSpouseRequest): Promise<AddSpouseResponse> {
    try {
      const response = await api.post<AddSpouseResponse>(
        `${API_ENDPOINTS.RELATIONS.ADD_SPOUSE}/${treeId}/spouses/${spouseId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi thêm vợ/chồng:", error);
      throw error;
    }
  }
}

export const familyService = new FamilyService();
export default familyService;
