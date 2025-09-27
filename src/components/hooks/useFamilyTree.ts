import { useState } from 'react';
import familyService from '../../services/familyService';
import {
    CreateTreeRequest,
    UpdateTreeRequest,
    CreateAlbumRequest,
    UpdateAlbumRequest,
    AddChildRequest,
    AddParentRequest,
    CreateRootPersonRequest,
    AddSpouseRequest,
    UploadImageRequest
} from '../../types/family';

export const useFamilyTree = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Helper function để clear messages
    const clearMessages = () => {
        setError(null);
        setSuccessMessage(null);
    };

    // POST /trees - Tạo cây mới
    const createTree = async (data: CreateTreeRequest) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.createTree(data);
            console.log('Tree created:', result);
            setSuccessMessage('Tạo cây gia phả thành công!');
            return result;
        } catch (err: any) {
            console.error('Error creating tree:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // GET /trees?userId={userId} - Lấy danh sách cây của user
    const getUserTrees = async (userId: string) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.getUserTrees(userId);
            console.log('User trees fetched:', result);
            setSuccessMessage('Hiển thị danh sách cây thành công!');
            return result;
        } catch (err: any) {
            console.error('Error fetching user trees:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // PUT /trees/{treeId} - Cập nhật thông tin cây
    const updateTree = async (treeId: string, data: UpdateTreeRequest) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.updateTree(treeId, data);
            console.log('Tree updated:', result);
            setSuccessMessage('Cập nhật thông tin cây thành công!');
            return result;
        } catch (err: any) {
            console.error('Error updating tree:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // DELETE /trees/{treeId} - Xóa cây
    const deleteTree = async (treeId: string) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.deleteTree(treeId);
            console.log('Tree deleted:', result);
            setSuccessMessage('Xóa cây thành công!');
            return result;
        } catch (err: any) {
            console.error('Error deleting tree:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // GET /relations/trees/{treeId} - Lấy thông tin cây với quan hệ
    const getTreeRelations = async (treeId: string) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.getTreeRelations(treeId);
            console.log('Tree relations fetched:', result);
            setSuccessMessage('Lấy thông tin cây thành công!');
            return result;
        } catch (err: any) {
            console.error('Error fetching tree relations:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // GET /relations/trees/{treeId}/persons/{personId} - Lấy thông tin người với quan hệ
    const getPersonTreeRelations = async (treeId: string, personId: string) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.getPersonTreeRelations(treeId, personId);
            console.log('Person tree relations fetched:', result);
            setSuccessMessage('Lấy thông tin người thành công!');
            return result;
        } catch (err: any) {
            console.error('Error fetching person tree relations:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // POST /relations/trees/{treeId}/children - Thêm con
    const addChild = async (treeId: string, data: AddChildRequest) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.addChild(treeId, data);
            console.log('Child added:', result);
            setSuccessMessage('Thêm con thành công!');
            return result;
        } catch (err: any) {
            console.error('Error adding child:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // POST /relations/trees/{treeId}/parent - Thêm cha/mẹ
    const addParent = async (treeId: string, data: AddParentRequest) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.addParent(treeId, data);
            console.log('Parent added:', result);
            setSuccessMessage('Thêm cha/mẹ thành công!');
            return result;
        } catch (err: any) {
            console.error('Error adding parent:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // POST /relations/trees/{treeId}/root - Tạo người gốc cho cây
    const createRootPerson = async (treeId: string, data: CreateRootPersonRequest) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.createRootPerson(treeId, data);
            console.log('Root person created:', result);
            setSuccessMessage('Tạo người gốc thành công!');
            return result;
        } catch (err: any) {
            console.error('Error creating root person:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // POST /relations/trees/{treeId}/spouses/{spouseId} - Thêm vợ/chồng
    const addSpouse = async (treeId: string, spouseId: string, data: AddSpouseRequest) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.addSpouse(treeId, spouseId, data);
            console.log('Spouse added:', result);
            setSuccessMessage('Thêm vợ/chồng thành công!');
            return result;
        } catch (err: any) {
            console.error('Error adding spouse:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // POST /albums - Tạo album mới
    const createAlbum = async (data: CreateAlbumRequest) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.createAlbum(data);
            console.log('Album created:', result);
            setSuccessMessage('Tạo album thành công!');
            return result;
        } catch (err: any) {
            console.error('Error creating album:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // PUT /albums/{albumId} - Cập nhật album
    const updateAlbum = async (albumId: string, data: UpdateAlbumRequest) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.updateAlbum(albumId, data);
            console.log('Album updated:', result);
            setSuccessMessage('Cập nhật album thành công!');
            return result;
        } catch (err: any) {
            console.error('Error updating album:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // DELETE /albums/{albumId} - Xóa album
    const deleteAlbum = async (albumId: string) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.deleteAlbum(albumId);
            console.log('Album deleted:', result);
            setSuccessMessage('Xóa album thành công!');
            return result;
        } catch (err: any) {
            console.error('Error deleting album:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // GET /albums?userId={userId} - Lấy danh sách album của user
    const getUserAlbums = async (userId: string) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.getUserAlbums(userId);
            console.log('User albums fetched:', result);
            setSuccessMessage('Lấy danh sách album thành công!');
            return result;
        } catch (err: any) {
            console.error('Error fetching user albums:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // GET /images/{imageId} - Lấy ảnh theo imageId
    const getImage = async (imageId: string) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.getImage(imageId);
            console.log('Image fetched:', result);
            setSuccessMessage('Lấy ảnh thành công!');
            return result;
        } catch (err: any) {
            console.error('Error fetching image:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // GET /images/by-album - Lấy danh sách ảnh theo albumId
    const getImagesByAlbum = async (albumId: string) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.getImagesByAlbum(albumId);
            console.log('Images by album fetched:', result);
            setSuccessMessage('Lấy danh sách ảnh theo album thành công!');
            return result;
        } catch (err: any) {
            console.error('Error fetching images by album:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // POST /images/upload - Upload ảnh mới
    const uploadImage = async (data: UploadImageRequest) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.uploadImage(data);
            console.log('Image uploaded:', result);
            setSuccessMessage('Upload ảnh thành công!');
            return result;
        } catch (err: any) {
            console.error('Error uploading image:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // DELETE /images/{imageId} - Xóa ảnh
    const deleteImage = async (imageId: string) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.deleteImage(imageId);
            console.log('Image deleted:', result);
            setSuccessMessage('Xóa ảnh thành công!');
            return result;
        } catch (err: any) {
            console.error('Error deleting image:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // DELETE /persons/{personId} - Xóa người
    const deletePerson = async (personId: string) => {
        setLoading(true);
        clearMessages();

        try {
            const result = await familyService.deletePerson(personId);
            console.log('Person deleted:', result);
            setSuccessMessage('Xóa người thành công!');
            return result;
        } catch (err: any) {
            console.error('Error deleting person:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        // Tree CRUD operations
        createTree,
        getUserTrees,
        updateTree,
        deleteTree,

        // Tree Relations operations
        getTreeRelations,
        getPersonTreeRelations,
        addChild,
        addParent,
        createRootPerson,
        addSpouse,

        // Albums operations
        createAlbum,
        updateAlbum,
        deleteAlbum,
        getUserAlbums,

        // Images operations
        getImage,
        getImagesByAlbum,
        uploadImage,
        deleteImage,

        // Person operations
        deletePerson,

        // State
        loading,
        error,
        successMessage,

        // Utils
        clearError: () => setError(null),
        clearSuccess: () => setSuccessMessage(null),
        clearMessages,
    };
};

export default useFamilyTree;