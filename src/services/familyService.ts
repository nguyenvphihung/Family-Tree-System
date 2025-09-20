import { makeRequest } from '../utils';

class FamilyService {
  // Create a new tree
  async createTree(data: { name: string; description?: string }): Promise<any> {
    try {
      const result = await makeRequest('/trees', 'POST', data, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest

      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }
  

  // Create root person in a tree
  async createTreeRoot(treeId: string, data: any): Promise<any> {
    try {
      const result = await makeRequest(`/relations/trees/${treeId}/root`, 'POST', data, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest
      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Add children to a person
  async addChildren(treeId: string, data: any): Promise<any> {
    try {
      const result = await makeRequest(`/relations/trees/${treeId}/children`, 'POST', data, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest

      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Add parent to a person
  async addParent(treeId: string, data: any): Promise<any> {
    try {
      const result = await makeRequest(`/relations/trees/${treeId}/parent`, 'POST', data, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest
      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Add spouse to a person
  async addSpouse(treeId: string, spouseId: string, data: any): Promise<any> {
    try {
      const result = await makeRequest(`/relations/trees/${treeId}/spouses/${spouseId}`, 'POST', data, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest
      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Get person with relations
  async getPersonWithRelations(treeId: string, personId: string): Promise<any> {
    try {
      const result = await makeRequest(`/relations/trees/${treeId}/persons/${personId}`, 'GET', null, 'response-area', { maxDepth: 5 });
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest
      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Delete a person
  async deletePerson(personId: string): Promise<any> {
    try {
      const result = await makeRequest(`/persons/${personId}`, 'DELETE', null, 'response-area');
      if (result.error) {
        // Trường hợp thất bại: Lấy thông báo lỗi từ makeRequest
        throw new Error(result.error.message);
      }
      // Trường hợp thành công: Lấy thông báo thành công từ makeRequest
      console.log(result.success);
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export const familyService = new FamilyService();
export default familyService;
