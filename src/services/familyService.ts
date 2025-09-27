import api from '../config/axios';
import {
  CreateTreeRequest,
  CreateTreeResponse,
  UpdateTreeRequest,
  UpdateTreeResponse,
  DeleteTreeResponse,
  GetUserTreesResponse,
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
  DeletePersonResponse
} from '../types/family';

class FamilyService {
  // POST /trees - Create a new tree
  async createTree(data: CreateTreeRequest): Promise<CreateTreeResponse['data']> {
    try {
      const response = await api.post<CreateTreeResponse>('/trees', data);

      if (response.data.code === 0) {
        console.log('Tree created successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create tree');
      }
    } catch (error: any) {
      console.error('Error creating tree:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create tree');
    }
  }

  // GET /trees?userId={userId} - Get all trees of a user
  async getUserTrees(userId: string): Promise<GetUserTreesResponse['data']> {
    try {
      const response = await api.get<GetUserTreesResponse>(`/trees?userId=${userId}`);

      if (response.data.code === 0) {
        console.log('User trees fetched successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user trees');
      }
    } catch (error: any) {
      console.error('Error fetching user trees:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user trees');
    }
  }

  // PUT /trees/{treeId} - Update tree information
  async updateTree(treeId: string, data: UpdateTreeRequest): Promise<UpdateTreeResponse['data']> {
    try {
      const response = await api.put<UpdateTreeResponse>(`/trees/${treeId}`, data);

      if (response.data.code === 0) {
        console.log('Tree updated successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update tree');
      }
    } catch (error: any) {
      console.error('Error updating tree:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update tree');
    }
  }

  // DELETE /trees/{treeId} - Delete tree
  async deleteTree(treeId: string): Promise<DeleteTreeResponse['data']> {
    try {
      const response = await api.delete<DeleteTreeResponse>(`/trees/${treeId}`);

      if (response.data.code === 0) {
        console.log('Tree deleted successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete tree');
      }
    } catch (error: any) {
      console.error('Error deleting tree:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete tree');
    }
  }

  // GET /relations/trees/{treeId}?maxDepth={maxDepth} - Get tree relations
  async getTreeRelations(treeId: string, maxDepth: number = 7): Promise<GetTreeRelationsResponse['data']> {
    try {
      const response = await api.get<GetTreeRelationsResponse>(`/relations/trees/${treeId}?maxDepth=${maxDepth}`);

      if (response.data.code === 0) {
        console.log('Tree relations fetched successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch tree relations');
      }
    } catch (error: any) {
      console.error('Error fetching tree relations:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch tree relations');
    }
  }

  // GET /relations/trees/{treeId}/persons/{personId}?maxDepth={maxDepth} - Get person tree relations
  async getPersonTreeRelations(treeId: string, personId: string, maxDepth: number = 7): Promise<GetPersonTreeRelationsResponse['data']> {
    try {
      const response = await api.get<GetPersonTreeRelationsResponse>(`/relations/trees/${treeId}/persons/${personId}?maxDepth=${maxDepth}`);

      if (response.data.code === 0) {
        console.log('Person tree relations fetched successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch person tree relations');
      }
    } catch (error: any) {
      console.error('Error fetching person tree relations:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch person tree relations');
    }
  }

  // POST /relations/trees/{treeId}/children - Add child to tree
  async addChild(treeId: string, data: AddChildRequest): Promise<AddChildResponse['data']> {
    try {
      const response = await api.post<AddChildResponse>(`/relations/trees/${treeId}/children`, data);

      if (response.data.code === 0) {
        console.log('Child added successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to add child');
      }
    } catch (error: any) {
      console.error('Error adding child:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to add child');
    }
  }

  // POST /relations/trees/{treeId}/parent - Add parent to tree
  async addParent(treeId: string, data: AddParentRequest): Promise<AddParentResponse['data']> {
    try {
      const response = await api.post<AddParentResponse>(`/relations/trees/${treeId}/parent`, data);

      if (response.data.code === 0) {
        console.log('Parent added successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to add parent');
      }
    } catch (error: any) {
      console.error('Error adding parent:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to add parent');
    }
  }

  // POST /relations/trees/{treeId}/root - Create root person in tree
  async createRootPerson(treeId: string, data: CreateRootPersonRequest): Promise<CreateRootPersonResponse['data']> {
    try {
      const response = await api.post<CreateRootPersonResponse>(`/relations/trees/${treeId}/root`, data);

      if (response.data.code === 0) {
        console.log('Root person created successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create root person');
      }
    } catch (error: any) {
      console.error('Error creating root person:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create root person');
    }
  }

  // POST /relations/trees/{treeId}/spouses/{spouseId} - Add spouse marriage
  async addSpouse(treeId: string, spouseId: string, data: AddSpouseRequest): Promise<AddSpouseResponse['data']> {
    try {
      const response = await api.post<AddSpouseResponse>(`/relations/trees/${treeId}/spouses/${spouseId}`, data);

      if (response.data.code === 0) {
        console.log('Spouse added successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to add spouse');
      }
    } catch (error: any) {
      console.error('Error adding spouse:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to add spouse');
    }
  }

  // POST /albums - Create a new album
  async createAlbum(data: CreateAlbumRequest): Promise<CreateAlbumResponse['data']> {
    try {
      const response = await api.post<CreateAlbumResponse>('/albums', data);

      if (response.data.code === 0) {
        console.log('Album created successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create album');
      }
    } catch (error: any) {
      console.error('Error creating album:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create album');
    }
  }

  // PUT /albums/{albumId} - Update album information
  async updateAlbum(albumId: string, data: UpdateAlbumRequest): Promise<UpdateAlbumResponse['data']> {
    try {
      const response = await api.put<UpdateAlbumResponse>(`/albums/${albumId}`, data);

      if (response.data.code === 0) {
        console.log('Album updated successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update album');
      }
    } catch (error: any) {
      console.error('Error updating album:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update album');
    }
  }

  // DELETE /albums/{albumId} - Delete album
  async deleteAlbum(albumId: string): Promise<DeleteAlbumResponse['data']> {
    try {
      const response = await api.delete<DeleteAlbumResponse>(`/albums/${albumId}`);

      if (response.data.code === 0) {
        console.log('Album deleted successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete album');
      }
    } catch (error: any) {
      console.error('Error deleting album:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete album');
    }
  }

  // GET /albums?userId={userId} - Get all albums of a user
  async getUserAlbums(userId: string): Promise<GetUserAlbumsResponse['data']> {
    try {
      const response = await api.get<GetUserAlbumsResponse>(`/albums?userId=${userId}`);

      if (response.data.code === 0) {
        console.log('User albums fetched successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user albums');
      }
    } catch (error: any) {
      console.error('Error fetching user albums:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user albums');
    }
  }

  // GET /images/{imageId} - Get image by ID
  async getImage(imageId: string): Promise<GetImageResponse['data']> {
    try {
      const response = await api.get<GetImageResponse>(`/images/${imageId}`);

      if (response.data.code === 0) {
        console.log('Image fetched successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch image');
      }
    } catch (error: any) {
      console.error('Error fetching image:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch image');
    }
  }

  // GET /images/by-album - Get images by albumId
  async getImagesByAlbum(albumId: string): Promise<GetImagesByAlbumResponse['data']> {
    try {
      const response = await api.get<GetImagesByAlbumResponse>(`/images/by-album`, {
        params: { albumId }
      });

      if (response.data.code === 0) {
        console.log('Images by album fetched successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch images by album');
      }
    } catch (error: any) {
      console.error('Error fetching images by album:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch images by album');
    }
  }

  // POST /images/upload - Upload image with name and albumId as query parameters
  async uploadImage(data: UploadImageRequest): Promise<UploadImageResponse['data']> {
    try {
      const { file, name, albumId } = data;
      const response = await api.post<UploadImageResponse>(`/images/upload`,
        { file },
        {
          params: { name, albumId }
        }
      );

      if (response.data.code === 0) {
        console.log('Image uploaded successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to upload image');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to upload image');
    }
  }

  // DELETE /images/{imageId} - Delete image by ID
  async deleteImage(imageId: string): Promise<DeleteImageResponse['data']> {
    try {
      const response = await api.delete<DeleteImageResponse>(`/images/${imageId}`);

      if (response.data.code === 0) {
        console.log('Image deleted successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete image');
      }
    } catch (error: any) {
      console.error('Error deleting image:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete image');
    }
  }

  // DELETE /persons/{personId} - Delete person by ID
  async deletePerson(personId: string): Promise<DeletePersonResponse['data']> {
    try {
      const response = await api.delete<DeletePersonResponse>(`/persons/${personId}`);

      if (response.data.code === 0) {
        console.log('Person deleted successfully:', response.data.message);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete person');
      }
    } catch (error: any) {
      console.error('Error deleting person:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete person');
    }
  }
}

export default new FamilyService();
