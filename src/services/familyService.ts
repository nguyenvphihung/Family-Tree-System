import { API_ENDPOINTS } from '../config/apiEndpoints';
import {
  CreateTreeRequest,
  CreateTreeResponse,
  UpdateTreeRequest,
  UpdateTreeResponse,
  DeleteTreeResponse,
  GetUserTreesResponse,
  GetPersonTreeRelationsResponse,
  AddChildRequest,
  AddChildResponse,
  AddParentRequest,
  AddParentResponse,
  CreateRootPersonRequest,
  CreateRootPersonResponse,
  AddSpouseRequest,
  AddSpouseResponse,
  CreateAlbumRequest,
  CreateAlbumResponse,
  UpdateAlbumRequest,
  UpdateAlbumResponse,
  DeleteAlbumResponse,
  GetUserAlbumsResponse,
  GetImageResponse,
  GetImagesByAlbumResponse,
  UploadImageRequest,
  UploadImageResponse,
  DeleteImageResponse,
  DeletePersonResponse,
  GetAlbumByIdResponse
} from '../types/family';
import { makeRequest } from '../utils';

class FamilyService {
  // POST /trees - Create a new tree
  async createTree(data: CreateTreeRequest): Promise<CreateTreeResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.RELATIONS.CREATE_TREE, 'POST', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // GET /trees?userId={userId} - Get all trees of a user
  async getUserTrees(userId: string): Promise<GetUserTreesResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.RELATIONS.GET_USER_TREES, 'GET', null, null, { userId });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // GET /trees - Get all trees of current user (no parameters)
  async getTrees(): Promise<GetUserTreesResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.RELATIONS.GET_USER_TREES, 'GET', null, null);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // PUT /trees/{treeId} - Update tree information
  async updateTree(treeId: string, data: UpdateTreeRequest): Promise<UpdateTreeResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.RELATIONS.UPDATE_TREE}/${treeId}`, 'PUT', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // DELETE /trees/{treeId} - Delete tree
  async deleteTree(treeId: string): Promise<DeleteTreeResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.RELATIONS.DELETE_TREE}/${treeId}`, 'DELETE', null, 'response-area');

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
  }  // GET /relations/trees/{treeId}?maxDepth={maxDepth} - Get tree relations
  async getTreeRelations(treeId: string, maxDepth: number = 7): Promise<any> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.RELATIONS.GET_TREE_RELATIONS}/${treeId}`, 'GET', null, null, { maxDepth });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  // GET /relations/trees/{treeId}/persons/{personId}?maxDepth={maxDepth} - Get person tree relations
  async getPersonTreeRelations(treeId: string, personId: string, maxDepth: number = 7): Promise<GetPersonTreeRelationsResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.RELATIONS.GET_PERSON_TREE_RELATIONS}/${treeId}/persons/${personId}`, 'GET', null, null, { maxDepth });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // POST /relations/trees/{treeId}/children - Add child to tree
  async addChild(treeId: string, data: AddChildRequest): Promise<AddChildResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.RELATIONS.ADD_CHILD}/${treeId}/children`, 'POST', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // POST /relations/trees/{treeId}/parent - Add parent to tree
  async addParent(treeId: string, data: AddParentRequest): Promise<AddParentResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.RELATIONS.ADD_PARENT}/${treeId}/parent`, 'POST', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // POST /relations/trees/{treeId}/root - Create root person in tree
  async createRootPerson(treeId: string, data: CreateRootPersonRequest): Promise<CreateRootPersonResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.RELATIONS.CREATE_ROOT_PERSON}/${treeId}/root`, 'POST', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }  // POST /relations/trees/{treeId}/spouses/{spouseId} - Add spouse marriage
  async addSpouse(treeId: string, spouseId: string, data: AddSpouseRequest): Promise<AddSpouseResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.RELATIONS.ADD_SPOUSE}/${treeId}/spouses/${spouseId}`, 'POST', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // POST /albums - Create a new album
  async createAlbum(data: CreateAlbumRequest): Promise<CreateAlbumResponse['data']> {
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

  // PUT /albums/{albumId} - Update album information
  async updateAlbum(albumId: string, data: UpdateAlbumRequest): Promise<UpdateAlbumResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.ALBUMS.UPDATE_ALBUM}/${albumId}`, 'PUT', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // DELETE /albums/{albumId} - Delete album
  async deleteAlbum(albumId: string): Promise<DeleteAlbumResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.ALBUMS.DELETE_ALBUM}/${albumId}`, 'DELETE', null, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // GET /albums?userId={userId} - Get all albums of a user
  async getUserAlbums(userId: string): Promise<GetUserAlbumsResponse['data']> {
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

  // GET /albums/{albumId} - Get album by ID
  async getAlbumById(albumId: string): Promise<GetAlbumByIdResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.ALBUMS.GET_ALBUM_BY_ID}/${albumId}`, 'GET', null, null);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // GET /images/{imageId} - Get image by ID
  async getImage(imageId: string): Promise<GetImageResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.IMAGES.GET_IMAGE}/${imageId}`, 'GET', null, null);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // GET /images/by-album - Get images by albumId
  async getImagesByAlbum(albumId: string): Promise<GetImagesByAlbumResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.IMAGES.GET_IMAGES_BY_ALBUM, 'GET', null, null, { albumId });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // POST /images/upload - Upload image with name and albumId as query parameters
  async uploadImage(data: UploadImageRequest): Promise<UploadImageResponse['data']> {
    try {
      const { file, name, albumId } = data;
      // Sử dụng makeRequest với endpoint có query params
      const endpoint = `${API_ENDPOINTS.IMAGES.UPLOAD_IMAGE}?name=${encodeURIComponent(name)}&albumId=${encodeURIComponent(albumId)}`;
      const result = await makeRequest(endpoint, 'POST', { file }, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // DELETE /images/{imageId} - Delete image by ID
  async deleteImage(imageId: string): Promise<DeleteImageResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.IMAGES.DELETE_IMAGE}/${imageId}`, 'DELETE', null, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // DELETE /persons/{personId} - Delete person by ID
  async deletePerson(personId: string): Promise<DeletePersonResponse['data']> {
    try {
      const result = await makeRequest(`${API_ENDPOINTS.RELATIONS.DELETE_PERSON}/${personId}`, 'DELETE', null, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new FamilyService();
