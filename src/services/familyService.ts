import { API_ENDPOINTS } from '../config/apiEndpoints';
// Import types from respective controller files
import {
  CreateTreeRequest,
  CreateTreeResponse,
  UpdateTreeRequest,
  UpdateTreeResponse,
  DeleteTreeResponse,
  GetUserTreesResponse,
} from '../types/tree';
import {
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
import {
  CreateAlbumRequest,
  CreateAlbumResponse,
  UpdateAlbumRequest,
  UpdateAlbumResponse,
  DeleteAlbumResponse,
  GetUserAlbumsResponse,
  GetAlbumByIdResponse,
} from '../types/album';
import {
  GetImageResponse,
  GetImagesByAlbumResponse,
  UploadImageRequest,
  UploadImageResponse,
  DeleteImageResponse,
} from '../types/image';
import { DeletePersonResponse } from '../types/person';
import { makeRequest } from '../utils';

class FamilyService {
  // ==================== TREE MANAGEMENT ====================

  // POST /trees - Create a new tree
  async createTree(data: CreateTreeRequest): Promise<CreateTreeResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.TREES.CREATE_TREE, 'POST', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  // GET /trees - Get all trees of current user (no parameters)
  async getTrees(): Promise<GetUserTreesResponse['data']> {
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

  // GET /trees?userId={userId} - Get all trees of a user
  async getUserTrees(userId: string): Promise<GetUserTreesResponse['data']> {
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

  // PUT /trees/{treeId} - Update tree information
  async updateTree(treeId: string, data: UpdateTreeRequest): Promise<UpdateTreeResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.TREES.UPDATE_TREE(treeId), 'PUT', data, 'response-area');
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
  }  // GET /relations/trees/{treeId}?maxDepth={maxDepth} - Get tree relations
  async getTreeRelations(treeId: string, maxDepth: number = 7): Promise<any> {
    try {
      const result = await makeRequest(API_ENDPOINTS.RELATIONS.GET_TREE_RELATIONS(treeId), 'GET', null, null, { maxDepth });

      return result.data;
    } catch (error: any) {
      throw error;
    }
  }

  // GET /relations/trees/{treeId}/persons/{personId}?maxDepth={maxDepth} - Get person tree relations
  async getPersonTreeRelations(treeId: string, personId: string, maxDepth: number = 7): Promise<GetPersonTreeRelationsResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.RELATIONS.GET_PERSON_TREE_RELATIONS(treeId, personId), 'GET', null, null, { maxDepth });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // ==================== TREE RELATIONS ====================

  // POST /relations/trees/{treeId}/children - Add child to tree
  async addChild(treeId: string, data: AddChildRequest): Promise<AddChildResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.RELATIONS.ADD_CHILD(treeId), 'POST', data, 'response-area');
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
      const result = await makeRequest(API_ENDPOINTS.RELATIONS.ADD_PARENT(treeId), 'POST', data, 'response-area');
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
      const result = await makeRequest(API_ENDPOINTS.RELATIONS.CREATE_ROOT_PERSON(treeId), 'POST', data, 'response-area');
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
      const result = await makeRequest(API_ENDPOINTS.RELATIONS.ADD_SPOUSE(treeId, spouseId), 'POST', data, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // ==================== ALBUM MANAGEMENT ====================

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

  // GET /albums/{albumId} - Get album by ID
  async getAlbumById(albumId: string): Promise<GetAlbumByIdResponse['data']> {
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

  // PUT /albums/{albumId} - Update album information
  async updateAlbum(albumId: string, data: UpdateAlbumRequest): Promise<UpdateAlbumResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.ALBUMS.UPDATE_ALBUM(albumId), 'PUT', data, 'response-area');
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
      // Không hiển thị toast xanh mặc định cho thao tác xóa; UI sẽ tự hiển thị màu đỏ
      const result = await makeRequest(API_ENDPOINTS.ALBUMS.DELETE_ALBUM(albumId), 'DELETE', null, null);
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // ==================== IMAGE MANAGEMENT ====================

  // GET /images/{imageId} - Get image by ID
  async getImage(imageId: string): Promise<GetImageResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.IMAGES.GET_IMAGE(imageId), 'GET', null, null);
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
      console.log('[FamilyService] getImagesByAlbum called with:', {
        albumId,
        endpoint: API_ENDPOINTS.IMAGES.GET_IMAGES_BY_ALBUM,
        fullUrl: `${API_ENDPOINTS.IMAGES.GET_IMAGES_BY_ALBUM}?albumId=${albumId}`
      });
      const result = await makeRequest(API_ENDPOINTS.IMAGES.GET_IMAGES_BY_ALBUM, 'GET', null, null, { albumId });
      if (result.error) {
        console.error('[FamilyService] getImagesByAlbum error:', result.error);
        throw new Error(result.error.message);
      }
      console.log('[FamilyService] getImagesByAlbum success:', result.data.data);
      return result.data.data;
    } catch (error: any) {
      console.error('[FamilyService] getImagesByAlbum exception:', error);
      throw error;
    }
  }

  // POST /images/upload - Upload image using FormData
  // Parameters: albumId (query param)
  // Request body: FormData with 'file' field
  // Response: { data: { id, name, url, albumId } }
  async uploadImage(data: UploadImageRequest): Promise<UploadImageResponse['data']> {
    try {
      const { file, albumId } = data;

      const endpoint = `${API_ENDPOINTS.IMAGES.UPLOAD_IMAGE}?albumId=${encodeURIComponent(albumId)}`;

      if (!file) {
        throw new Error('No file provided');
      }

      console.log('[FamilyService] uploadImage:', {
        albumId,
        fileType: typeof file,
        fileLength: typeof file === 'string' ? file.length : file.size
      });

      // Create FormData for multipart upload (like HTML test)
      const formData = new FormData();

      if (typeof file === 'string') {
        // Convert base64 string to Blob
        const base64Data = file.split(',')[1] || file;
        const mimeMatch = file.match(/data:([^;]+);/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        formData.append('file', blob, 'image.jpg');
        console.log('[FamilyService] Converted base64 to Blob:', { size: blob.size, type: mimeType });
      } else {
        // Already a File object
        formData.append('file', file);
        console.log('[FamilyService] Using File object:', { name: file.name, size: file.size });
      }

      const result = await makeRequest(endpoint, 'POST', formData, 'response-area');
      if (result.error) {
        console.error('[FamilyService] uploadImage error:', result.error);
        throw new Error(result.error.message);
      }
      console.log('[FamilyService] uploadImage success:', result.data?.data ?? result.data);
      return result.data?.data ?? result.data;
    } catch (error: any) {
      console.error('[FamilyService] uploadImage exception:', error);
      throw error;
    }
  }  // DELETE /images/{imageId} - Delete image by ID
  async deleteImage(imageId: string): Promise<DeleteImageResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.IMAGES.DELETE_IMAGE(imageId), 'DELETE', null, 'response-area');
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data;
    } catch (error: any) {
      throw error;
    }
  }

  // ==================== PERSON MANAGEMENT ====================

  // DELETE /persons/{personId} - Delete person by ID
  async deletePerson(personId: string): Promise<DeletePersonResponse['data']> {
    try {
      const result = await makeRequest(API_ENDPOINTS.PERSONS.DELETE_PERSON(personId), 'DELETE', null, 'response-area');
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
