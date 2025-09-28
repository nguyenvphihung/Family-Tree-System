import React, { useState, useEffect } from "react";
import { D3FamilyTreeView } from "../../components/family-tree";
import { FamilyMember } from "../../types/family";
import PersonInfoModal from "../../components/family-tree/PersonInfoModal";
import AddChildModal from "../../components/family-tree/AddChildModal";
import AddParentModal from "../../components/family-tree/AddParentModal";
import AddSpouseModal from "../../components/family-tree/AddSpouseModal";
import AddRootModal from "../../components/family-tree/AddRootModal";
import DeleteConfirmModal from "../../components/family-tree/DeleteConfirmModal";
import DeleteTreeConfirmModal from "../../components/family-tree/DeleteTreeConfirmModal";
import familyService from "../../services/familyService";
import { get } from "http";

const FamilyTreeDemo: React.FC = () => {
  const [currentTreeId, setCurrentTreeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasTreeData, setHasTreeData] = useState(false);
  const [treeViewKey, setTreeViewKey] = useState(0);

  // Tree management states
  const [userTrees, setUserTrees] = useState<any[]>([]);
  const [showTreeSelector, setShowTreeSelector] = useState(false);
  const [showCreateTreeModal, setShowCreateTreeModal] = useState(false);
  const [showDeleteTreeModal, setShowDeleteTreeModal] = useState(false);
  const [selectedTreeForDelete, setSelectedTreeForDelete] = useState<any>(null);

  // Album & Image management states
  const [userAlbums, setUserAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [albumImages, setAlbumImages] = useState<any[]>([]);
  const [showPhotoManager, setShowPhotoManager] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // State để lưu thông tin node được chọn
  const [selectedPerson, setSelectedPerson] = useState<FamilyMember | null>(null);

  // State cho modal xem thông tin và modal thêm thành viên
  const [showPersonInfoModal, setShowPersonInfoModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showAddSpouseModal, setShowAddSpouseModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showAddRootModal, setShowAddRootModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Function để hiển thị thông báo thành công
  const showSuccessNotification = (message: string) => {
    const responseArea = document.getElementById('response-area');
    if (responseArea) {
      responseArea.textContent = message;
      responseArea.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-green-50 border border-green-300 text-green-800 rounded-lg p-3 shadow-lg max-w-sm text-center text-sm font-medium';
      responseArea.style.display = 'block';

      // Tự động ẩn sau 3 giây
      setTimeout(() => {
        responseArea.style.display = 'none';
      }, 3000);
    }
  };

  // Auto center tree when component mounts
  useEffect(() => {

    const timer = setTimeout(() => {
      const svgElement = document.querySelector('.family-tree-svg') as any;
      if (svgElement && svgElement.centerTreeView) {
        svgElement.centerTreeView();
      }
    }, 1000); // Wait for tree to load

    return () => clearTimeout(timer);
  }, []);

  // Load tree data when component mounts
  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    try {
      setLoading(true);
      await getTrees();
    } catch (error) {
      console.error('Error initializing component:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrees = async () => {
    try {
      const trees = await familyService.getUserTrees('current-user-id');
      console.log('User trees loaded:', trees);

      setUserTrees(trees);

      if (trees && trees.length > 0) {
        // Nếu chưa có currentTreeId hoặc currentTreeId không tồn tại trong danh sách
        if (!currentTreeId || !trees.find(tree => tree.id === currentTreeId)) {
          const firstTreeId = trees[0]?.id;
          setCurrentTreeId(firstTreeId);
          // Load tree data for the first tree
          await loadTreeDataForTree(firstTreeId);
        }
      } else {
        // Không có cây nào
        setCurrentTreeId(null);
        setHasTreeData(false);
        setSelectedPerson(null);
        setError(null); // Clear error khi không có cây
      }
    } catch (error: any) {
      console.error('Error loading user trees:', error);
      setError(error.message || 'Failed to load user trees');
    }
  };


  // Hàm chỉ refresh danh sách cây mà không tự động chọn cây đầu tiên
  const refreshTreeList = async () => {
    try {
      const trees = await familyService.getUserTrees('current-user-id');
      console.log('Tree list refreshed:', trees);
      setUserTrees(trees);

      // Nếu không còn cây nào, reset states
      if (!trees || trees.length === 0) {
        setCurrentTreeId(null);
        setHasTreeData(false);
        setSelectedPerson(null);
        setError('No trees found. Please create a new tree.');
      }
    } catch (error: any) {
      console.error('Error refreshing tree list:', error);
      setError(error.message || 'Failed to refresh tree list');
    }
  };

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMoreMenu && !(event.target as Element)?.closest('.relative')) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  // Function để load dữ liệu cây gia đình cho tree cụ thể
  const loadTreeDataForTree = async (treeId: string) => {
    if (!treeId) return;

    try {
      setLoading(true);
      setError(null);

      // Load tree relations data
      const data = await familyService.getTreeRelations(treeId, 7);
      console.log('Tree data loaded for tree:', treeId, data);
      console.log('Data type:', typeof data, 'Data length:', Array.isArray(data) ? data.length : 'Not array');

      // Check if tree has data (has members)
      let hasData = false;
      if (Array.isArray(data)) {
        hasData = data.length > 0;
      } else if (data && typeof data === 'object') {
        // If data is an object, check if it has any meaningful content
        hasData = Object.keys(data).length > 0;
      }

      console.log('Has tree data:', hasData);
      setHasTreeData(hasData);

    } catch (error: any) {
      console.error('Error loading tree data:', error);
      setError(error.message || 'Failed to load tree data');
      setHasTreeData(false);
    } finally {
      setLoading(false);
    }
  };  // Function để load dữ liệu cây gia đình
  const loadTreeData = async () => {
    if (!currentTreeId) {
      setError('No tree selected');
      return;
    }

    await loadTreeDataForTree(currentTreeId);
  };


  const handleRefreshTree = async () => {
    try {
      setLoading(true);

      await getTrees();

      if (currentTreeId) {
        await loadTreeDataForTree(currentTreeId);
      }

    } catch (error: any) {
      console.error('Error refreshing tree:', error);
      setError(error.message || 'Failed to refresh tree');
    } finally {
      setLoading(false);

      showSuccessNotification('✅ Đã làm mới cây gia đình');
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.3));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  const handleZoomCenter = () => {
    setZoomLevel(1);
    // Center the tree view
    const svgElement = document.querySelector('.family-tree-svg') as any;
    if (svgElement && svgElement.centerTreeView) {
      svgElement.centerTreeView();
    }
  };

  // Function để xử lý khi click vào node
  const handleNodeClick = (person: FamilyMember) => {
    setSelectedPerson(person);
    console.log('Selected person:', person);
  };

  // Create new tree
  const handleCreateTree = async (treeData: any) => {
    try {
      setLoading(true);
      const newTree = await familyService.createTree({
        userId: 'current-user-id', // Replace with actual user ID
        name: treeData.name
      });

      // Hiển thị thông báo thành công
      showSuccessNotification(`✅ Đã tạo thành công cây gia đình: ${treeData.name}`);

      // Refresh user trees and switch to the new tree
      await getTrees();
      setShowCreateTreeModal(false);
      console.log('Tree created successfully:', newTree);
    } catch (error: any) {
      console.error('Error creating tree:', error);
      setError(error.message || 'Failed to create tree');
    } finally {
      setLoading(false);
    }
  };

  // Update tree
  const handleUpdateTree = async (treeId: string, treeData: any) => {
    try {
      setLoading(true);
      const updatedTree = await familyService.updateTree(treeId, {
        treeId: treeId,
        name: treeData.name
      });

      // makeRequest() sẽ tự động hiển thị thông báo, không cần thêm code

      // Refresh user trees
      await getTrees();
      console.log('Tree updated successfully:', updatedTree);
    } catch (error: any) {
      console.error('Error updating tree:', error);
      setError(error.message || 'Failed to update tree');
    } finally {
      setLoading(false);
    }
  };

  // Delete tree (internal logic for state management)
  const handleDeleteTree = async (treeId: string) => {
    try {
      // Nếu cây đang được chọn bị xóa, reset currentTreeId
      if (currentTreeId === treeId) {
        setCurrentTreeId(null);
        setHasTreeData(false);
        setSelectedPerson(null);
        setTreeViewKey(prev => prev + 1); // Force re-render
      }

      // Tự động refresh danh sách cây để cập nhật UI (không tự động chọn cây đầu tiên)
      await refreshTreeList();

      console.log('Tree deleted and tree list refreshed successfully');
    } catch (error) {
      console.error('Error refreshing tree list after delete:', error);
    }
  };  // Switch to different tree
  const handleSwitchTree = async (treeId: string) => {
    try {
      setCurrentTreeId(treeId);
      await loadTreeDataForTree(treeId);
      setShowTreeSelector(false);

      // Không cần thông báo thủ công - switch tree là UI action, không phải API call

      console.log('Switched to tree:', treeId);
    } catch (error: any) {
      console.error('Error switching tree:', error);
      setError(error.message || 'Failed to switch tree');
    }
  };


  const loadUserAlbums = async (userId: string) => {
    try {
      setLoading(true);
      const albums = await familyService.getUserAlbums(userId);
      setUserAlbums(albums);
      console.log('User albums loaded:', albums);
    } catch (error: any) {
      console.error('Error loading albums:', error);
      setError(error.message || 'Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  // Create album
  const handleCreateAlbum = async (albumData: any) => {
    try {
      setLoading(true);
      const newAlbum = await familyService.createAlbum({
        userId: 'current-user-id', // Replace with actual user ID
        name: albumData.name
      });

      // makeRequest() sẽ tự động hiển thị thông báo

      await loadUserAlbums('current-user-id');
      console.log('Album created:', newAlbum);
    } catch (error: any) {
      console.error('Error creating album:', error);
      setError(error.message || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  // Update album
  const handleUpdateAlbum = async (albumId: string, albumData: any) => {
    try {
      setLoading(true);
      const updatedAlbum = await familyService.updateAlbum(albumId, {
        albumId: albumId,
        name: albumData.name
      });

      // makeRequest() sẽ tự động hiển thị thông báo

      await loadUserAlbums('current-user-id');
      console.log('Album updated:', updatedAlbum);
    } catch (error: any) {
      console.error('Error updating album:', error);
      setError(error.message || 'Failed to update album');
    } finally {
      setLoading(false);
    }
  };

  // Delete album
  const handleDeleteAlbum = async (albumId: string) => {
    try {
      setLoading(true);
      await familyService.deleteAlbum(albumId);

      // makeRequest() sẽ tự động hiển thị thông báo

      await loadUserAlbums('current-user-id');
      console.log('Album deleted successfully');
    } catch (error: any) {
      console.error('Error deleting album:', error);
      setError(error.message || 'Failed to delete album');
    } finally {
      setLoading(false);
    }
  };


  const loadAlbumImages = async (albumId: string) => {
    try {
      setLoading(true);
      const images = await familyService.getImagesByAlbum(albumId);
      setAlbumImages(images);
      console.log('Album images loaded:', images);
    } catch (error: any) {
      console.error('Error loading album images:', error);
      setError(error.message || 'Failed to load album images');
    } finally {
      setLoading(false);
    }
  };

  // Upload image
  const handleUploadImage = async (imageData: any) => {
    try {
      setLoading(true);
      const uploadedImage = await familyService.uploadImage({
        file: imageData.file, // base64 content
        name: imageData.name,
        albumId: imageData.albumId
      });

      // makeRequest() sẽ tự động hiển thị thông báo

      // Refresh album images if album is selected
      if (selectedAlbum) {
        await loadAlbumImages(selectedAlbum.id);
      }

      setShowUploadModal(false);
      console.log('Image uploaded:', uploadedImage);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId: string) => {
    try {
      setLoading(true);
      await familyService.deleteImage(imageId);

      // makeRequest() sẽ tự động hiển thị thông báo

      // Refresh album images if album is selected
      if (selectedAlbum) {
        await loadAlbumImages(selectedAlbum.id);
      }

      console.log('Image deleted successfully');
    } catch (error: any) {
      console.error('Error deleting image:', error);
      setError(error.message || 'Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi click nút Profile ở sidebar
  const handleProfileClick = () => {
    if (selectedPerson) setShowPersonInfoModal(true);
  };

  // Xử lý khi click nút Add ở sidebar
  const handleAddClick = () => {
    if (selectedPerson) setShowAddChildModal(true);
  };

  // Xử lý khi click thêm parent
  const handleAddParentClick = () => {
    if (selectedPerson) setShowAddParentModal(true);
  };

  // Xử lý khi click thêm spouse
  const handleAddSpouseClick = () => {
    if (selectedPerson) setShowAddSpouseModal(true);
  };

  // Xử lý khi click xóa person
  const handleDeleteClick = () => {
    if (selectedPerson) setShowDeleteConfirmModal(true);
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = async () => {
    if (!selectedPerson) return;

    try {
      setLoading(true);

      const personName = selectedPerson.name;

      // Gọi API xóa thông qua familyService
      await familyService.deletePerson(selectedPerson.id);

      // Hiển thị thông báo thành công
      showSuccessNotification(`✅ Đã xóa thành công ${personName}`);

      // Đóng modal
      setShowDeleteConfirmModal(false);

      // Clear selection
      setSelectedPerson(null);

      // Tự động reload cây
      await loadTreeData();
      setTreeViewKey(prev => prev + 1);

      console.log('Person deleted successfully');
    } catch (error: any) {
      console.error('Error deleting person:', error);
      setError(error.message || 'Failed to delete person');
    } finally {
      setLoading(false);
    }
  };

  // Function để xử lý thêm con
  const handleAddChild = async (childData: any) => {
    try {
      setLoading(true);

      if (!selectedPerson?.id) {
        throw new Error('No parent selected');
      }

      if (!currentTreeId) {
        throw new Error('No tree selected');
      }

      const addChildRequest = {
        parent1Id: selectedPerson.id,
        parent2Id: selectedPerson.spouses?.[0]?.id || "", // Sử dụng spouse nếu có
        child: {
          name: childData.name || "",
          gender: childData.gender || "M",
          birthday: childData.birthday || new Date().toISOString().split('T')[0],
          birthPlace: childData.birthPlace || ""
        },
        childrenType: "BIOLOGICAL" as const,
        adoptionDate: "",
        notes: ""
      };

      // Call API to add child
      await familyService.addChild(currentTreeId, addChildRequest);

      // Hiển thị thông báo thành công
      showSuccessNotification(`✅ Đã thêm thành công con: ${childData.name}`);

      // Close modal
      setShowAddChildModal(false);

      // Tự động reload cây
      await loadTreeData();
      setTreeViewKey(prev => prev + 1);

      console.log('Child added successfully');
    } catch (error: any) {
      console.error('Error adding child:', error);
      setError(error.message || 'Failed to add child');
    } finally {
      setLoading(false);
    }
  };

  // Function để xử lý thêm cha/mẹ
  const handleAddParent = async (parentData: any) => {
    try {
      setLoading(true);

      if (!selectedPerson?.id) {
        throw new Error('No child selected');
      }

      if (!currentTreeId) {
        throw new Error('No tree selected');
      }

      // Prepare data according to AddParentRequest interface
      const addParentRequest = {
        childId: selectedPerson.id,
        newParent: {
          name: parentData.name || "",
          gender: parentData.gender || "M",
          birthday: parentData.birthday || new Date().toISOString().split('T')[0],
          birthPlace: parentData.birthPlace || ""
        }
      };

      await familyService.addParent(currentTreeId, addParentRequest);

      // Hiển thị thông báo thành công
      showSuccessNotification(`✅ Đã thêm thành công cha/mẹ: ${parentData.name}`);

      // Close modal
      setShowAddParentModal(false);

      // Tự động reload cây
      await loadTreeData();
      setTreeViewKey(prev => prev + 1);

      console.log('Parent added successfully');
    } catch (error: any) {
      console.error('Error adding parent:', error);
      setError(error.message || 'Failed to add parent');
    } finally {
      setLoading(false);
    }
  };

  // Function để thêm spouse
  const handleAddSpouse = async (spouseData: any) => {
    try {
      setLoading(true);

      if (!selectedPerson?.id) {
        throw new Error('No person selected');
      }

      if (!currentTreeId) {
        throw new Error('No tree selected');
      }

      const addSpouseRequest = {
        newSpouse: {
          name: spouseData.name || "",
          gender: spouseData.gender || "F",
          birthday: spouseData.birthday || new Date().toISOString().split('T')[0],
          birthPlace: spouseData.birthPlace || ""
        },
        marriageDate: spouseData.marriageDate || new Date().toISOString().split('T')[0],
        divorceDate: spouseData.divorceDate || ""
      };

      await familyService.addSpouse(currentTreeId, selectedPerson.id, addSpouseRequest);

      // Hiển thị thông báo thành công
      showSuccessNotification(`✅ Đã thêm thành công vợ/chồng: ${spouseData.name}`);

      // Close modal
      setShowAddSpouseModal(false);

      // Tự động reload cây
      await loadTreeData();
      setTreeViewKey(prev => prev + 1);

      console.log('Spouse added successfully');
    } catch (error: any) {
      console.error('Error adding spouse:', error);
      setError(error.message || 'Failed to add spouse');
    } finally {
      setLoading(false);
    }
  };

  // Function để thêm root person (người gốc)
  const handleAddRoot = async (rootData: any) => {
    try {
      setLoading(true);

      if (!currentTreeId) {
        throw new Error('No tree selected');
      }

      const createRootRequest = {
        name: rootData.name || "",
        gender: rootData.gender || "M",
        birthday: rootData.birthday || new Date().toISOString().split('T')[0],
        birthPlace: rootData.birthPlace || ""
      };

      await familyService.createRootPerson(currentTreeId, createRootRequest);

      // Hiển thị thông báo thành công
      showSuccessNotification(`✅ Đã thêm thành công người gốc: ${rootData.name}`);

      // Close modal first
      setShowAddRootModal(false);

      // Small delay to ensure API processing is complete
      setTimeout(async () => {
        // Reload tree data to update hasTreeData state
        await loadTreeDataForTree(currentTreeId);

        // Force re-render of tree view
        setTreeViewKey(prev => prev + 1);

        // Also trigger tree view refresh
        const svgElement = document.querySelector('.family-tree-svg') as any;
        if (svgElement && svgElement.refreshTreeData) {
          svgElement.refreshTreeData();
        }
      }, 500);

      console.log('Root person added successfully:', rootData.name);
    } catch (error: any) {
      console.error('Error adding root person:', error);
      setError(error.message || 'Failed to add root person');
    } finally {
      setLoading(false);
    }
  };

  // Function để tính tuổi từ ngày sinh
  const calculateAge = (birthday?: string) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const today = new Date();
    let age = 0;
    age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate() && monthDiff > 1)) {
      age--;
    }
    return age;
  };

  // Function để format ngày sinh
  const formatBirthday = (birthday?: string) => {
    if (!birthday) return null;
    const date = new Date(birthday);
    return date.getFullYear();
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-50 overflow-hidden">
      {/* Error Message Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.856-.833-2.598 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}


      {/* Top Header Bar - Dark Gray */}
      <div
        className="text-white px-6 py-2 border-b border-gray-700 shadow-sm"
        style={{ backgroundColor: "#595959" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-[10px] text-gray-300 font-medium">
              Family Tree System
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-800 font-bold text-sm">FT</span>
            </div>
            <span className="text-base font-bold text-white">Family Tree</span>
          </div>

          {/* Main Navigation Bar - Modern */}
          <div className="">
            <div className="flex items-center space-x-8">
              <a
                href="#"
                className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a href="#" className="text-rose-500 font-bold">
                Family tree
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Discoveries
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Photos
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
              >
                DNA
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Research
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Tree Selector Button */}
            <button
              onClick={() => setShowTreeSelector(true)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
            >
              Switch Tree
            </button>

            {/* Create Tree Button */}
            <button
              onClick={() => setShowCreateTreeModal(true)}
              className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
            >
              New Tree
            </button>

            {/* Add Root Person Button */}
            {currentTreeId && (
              <button
                onClick={() => setShowAddRootModal(true)}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
              >
                Add Root
              </button>
            )}

            {/* Photo Manager Button */}
            <button
              onClick={() => setShowPhotoManager(true)}
              className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
            >
              Photos
            </button>

            <button className="bg-rose-200 hover:bg-rose-300 text-rose-800 mr-6 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm">
              Go Premium
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex w-full h-full">
        {/* Left Sidebar - Modern */}
        <div
          className="w-56 bg-white border-r border-gray-200 p-3 shadow-lg flex flex-col"
          style={{ height: "100%", overflow: "hidden" }}
        >
          {/* Personal Info Section - CẬP NHẬT */}
          <div className="mb-2">
            <div className="flex flex-col items-center py-2">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-300">
                {/* Avatar user đẹp và icon máy ảnh hiện đại */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Avatar user nét mảnh, cân đối */}
                  <svg
                    className="w-16 h-16"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      stroke={selectedPerson?.gender === 'M' ? "#5BD1D7" : selectedPerson?.gender === 'F' ? "#F59794" : "#B0B7C3"}
                      strokeWidth="2"
                      fill="#fff"
                    />
                    <circle
                      cx="32"
                      cy="26"
                      r="10"
                      stroke={selectedPerson?.gender === 'M' ? "#5BD1D7" : selectedPerson?.gender === 'F' ? "#F59794" : "#B0B7C3"}
                      strokeWidth="1.5"
                      fill="#F5F6F7"
                    />
                    <path
                      d="M16 50c0-6.5 8-12 16-12s16 5.5 16 12"
                      stroke={selectedPerson?.gender === 'M' ? "#5BD1D7" : selectedPerson?.gender === 'F' ? "#F59794" : "#B0B7C3"}
                      strokeWidth="1.5"
                      fill="#F5F6F7"
                    />
                  </svg>
                  {/* Icon máy ảnh hiện đại nằm ngoài viền avatar */}
                  <button
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      right: "-4px",
                      zIndex: 10,
                    }}
                    className="w-9 h-9 bg-white rounded-full border border-gray-300 flex items-center justify-center shadow hover:bg-gray-100 transition"
                    title="Add photo"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 7C4 6.44772 4.44772 6 5 6H19C19.5523 6 20 6.44772 20 7V17C20 17.5523 19.5523 18 19 18H5C4.44772 18 4 17.5523 4 17V7Z"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M15 9H17"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2 text-center">
                {/* Hiển thị thông tin động từ selectedPerson */}
                <div className="font-bold text-gray-900 text-base leading-tight">
                  {selectedPerson?.name || "Chọn một người"}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedPerson ? (
                    "Family member"
                  ) : (
                    "Click vào thành viên để xem thông tin"
                  )}
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  {selectedPerson?.birthday && (

                    <>
                      ★ {formatBirthday(selectedPerson.birthday)}
                      {calculateAge(selectedPerson.birthday) > 0 && (
                        <span> (age ~{calculateAge(selectedPerson.birthday)})</span>
                      )}
                    </>
                  )}
                </div>
                {selectedPerson?.gender && (
                  <div className="text-xs text-gray-600 mt-1">
                    {selectedPerson.gender === 'M' ? '♂ Nam' : selectedPerson.gender === 'F' ? '♀ Nữ' : 'Không rõ'}
                  </div>
                )}
                {selectedPerson?.birthPlace && (
                  <div className="text-xs text-gray-600 mt-1">
                    📍 {selectedPerson.birthPlace}
                  </div>
                )}
                {selectedPerson && (

                  <button className="text-xs text-rose-700 font-semibold mt-1 hover:underline">
                    Research this person »
                  </button>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 mb-2">
                {/* Nút Profile */}
                <button
                  className="flex flex-col items-center text-gray-700 hover:text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleProfileClick}
                  disabled={!selectedPerson || loading}
                >
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    {/* icon profile giữ nguyên */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="text-xs">Profile</span>
                </button>
                {/* Nút Edit giữ nguyên */}
                <button
                  className="flex flex-col items-center text-gray-700 hover:text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedPerson || loading}
                >
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </span>
                  <span className="text-xs">Edit</span>
                </button>
                {/* Nút Add: icon dấu + */}
                <button
                  className="flex flex-col items-center text-gray-700 hover:text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddClick}
                  disabled={!selectedPerson || loading}
                >
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
                      </svg>
                    )}
                  </span>
                  <span className="text-xs">Add</span>
                </button>
                {/* Nút More: icon dấu ba chấm với dropdown */}
                <div className="relative">
                  <button
                    className="flex flex-col items-center text-gray-700 hover:text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedPerson || loading}
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                  >
                    <span className="bg-gray-100 rounded-full p-2 mb-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="5" cy="12" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="19" cy="12" r="1.5" />
                      </svg>
                    </span>
                    <span className="text-xs">More</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showMoreMenu && selectedPerson && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                      <button
                        onClick={() => {
                          handleAddParentClick();
                          setShowMoreMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                      >
                        Add Parent
                      </button>
                      <button
                        onClick={() => {
                          handleAddSpouseClick();
                          setShowMoreMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Add Spouse
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteClick();
                          setShowMoreMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                      >
                        Delete Person
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Sections */}
          <div className="space-y-2 flex-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-gray-900 text-xs">DISCOVERIES</h4>
                <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  1
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-gray-600">
                <svg
                  className="w-3.5 h-3.5 text-rose-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">One consistency issue</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-xs">
                PHOTOS & VIDEOS
              </h4>
              <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">
                + Add
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-xs">BIOGRAPHY</h4>
              <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">
                + Add
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-gray-900 text-xs">
                  IMMEDIATE FAMILY
                </h4>
                <svg
                  className="w-3.5 h-3.5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">
                + Add
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-gray-900 text-xs">FACTS</h4>
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">
                  + Add
                </button>
              </div>
              <div className="text-[11px] text-gray-600">
                {selectedPerson?.birthday ? (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Birth</span>
                    <span className="text-gray-400">{formatBirthday(selectedPerson.birthday)}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">1939 Birth</span>
                    <span className="text-gray-400">1939</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DNA Test Button */}
          <div
            className="flex-1 justify-center mx-auto"
            style={{ marginTop: "8px", width: "fit-content" }}
          >
            <button className="px-4 py-2 w-full bg-white border border-rose-300 rounded-full text-rose-700 hover:bg-rose-50 transition-colors">
              Order DNA test
            </button>
          </div>
        </div>

        {/* Main content phải */}
        <div
          className="flex-1 bg-white p-1"
          style={{ height: "calc(100vh - 50px)", overflow: "hidden" }}
        >
          {/* Tree Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-all duration-200">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                  />
                </svg>
                <span>Family view</span>
              </button>
              <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
              </button>
              <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button className="w-10 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <select className="border-2 border-gray-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:border-rose-400 focus:outline-none transition-colors duration-200">
                <option>Generations 5+</option>
                <option>Generations 6+</option>
                <option>Generations 7+</option>
                <option>Generations +</option>
              </select>
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Find a person..."
                  className="w-40 border-2 border-gray-300 rounded-xl pl-3 pr-10 py-1.5 text-xs font-medium focus:border-rose-400 focus:outline-none transition-colors duration-200"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Family Tree Visualization */}
          <div
            className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg w-full h-full flex items-center justify-center"
            style={{ background: "#e5e7eb" }}
          >
            {loading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                <span className="ml-2 text-gray-600">Loading tree data...</span>
              </div>
            )}

            {!loading && !error && !currentTreeId && (
              <div className="flex flex-col items-center justify-center text-gray-600">
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="text-sm mb-3">No trees available</span>
                <button
                  onClick={() => setShowCreateTreeModal(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  Create Your First Tree
                </button>
              </div>
            )}

            {!loading && !error && currentTreeId && hasTreeData && (
              <D3FamilyTreeView
                key={`tree-view-${currentTreeId}-${treeViewKey}`}
                treeId={currentTreeId}
                personId={selectedPerson?.id || ""}
                zoomLevel={zoomLevel}
                onRefresh={handleRefreshTree}
                onNodeClick={handleNodeClick}
                onAddChild={(person) => {
                  setSelectedPerson(person);
                  setShowAddChildModal(true);
                }}
                onAddParent={(person) => {
                  setSelectedPerson(person);
                  setShowAddParentModal(true);
                }}
                onAddSpouse={(person) => {
                  setSelectedPerson(person);
                  setShowAddSpouseModal(true);
                }}
                onViewInfo={(person) => {
                  setSelectedPerson(person);
                  setShowPersonInfoModal(true);
                }}
                onDeletePerson={(person) => {
                  setSelectedPerson(person);
                  setShowDeleteConfirmModal(true);
                }}
              />
            )}

            {!loading && !error && currentTreeId && !hasTreeData && (
              <div className="flex flex-col items-center justify-center text-gray-600">
                <svg className="w-12 h-12 mb-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Family Tree is Empty</h3>
                <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
                  Start building your family tree by adding the first person. This will be the foundation of your genealogy.
                </p>
                <button
                  onClick={() => setShowAddRootModal(true)}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors duration-200 shadow-sm"
                >
                  Add Root Person
                </button>
              </div>
            )}
          </div>

          {/* Zoom Controls - Bottom Right */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
            <button
              onClick={handleZoomCenter}
              className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 rounded-full shadow-sm flex items-center justify-center hover:shadow transition-all duration-200"
              title="Center Family Tree"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </button>
            <button
              className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 rounded-full shadow-sm flex items-center justify-center hover:shadow transition-all duration-200"
              title="Toggle Full Screen"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </button>
            <button
              onClick={handleZoomReset}
              className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 rounded-full shadow-sm flex items-center justify-center hover:shadow transition-all duration-200"
              title="Reset View"
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 rounded-full shadow-sm flex items-center justify-center hover:shadow transition-all duration-200"
              title="Zoom In"
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 rounded-full shadow-sm flex items-center justify-center hover:shadow transition-all duration-200"
              title="Zoom Out"
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal xem thông tin node */}
      <PersonInfoModal
        isOpen={showPersonInfoModal}
        onClose={() => setShowPersonInfoModal(false)}
        person={selectedPerson}
      />

      {/* Modal thêm con */}
      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onSave={handleAddChild}
        parentName={selectedPerson?.name}
      />

      {/* Modal thêm cha/mẹ */}
      <AddParentModal
        isOpen={showAddParentModal}
        onClose={() => setShowAddParentModal(false)}
        onSave={handleAddParent}
        childName={selectedPerson?.name}
      />

      {/* Modal thêm vợ/chồng */}
      <AddSpouseModal
        isOpen={showAddSpouseModal}
        onClose={() => setShowAddSpouseModal(false)}
        onSave={handleAddSpouse}
        personName={selectedPerson?.name}
      />

      {/* Modal thêm root person */}
      <AddRootModal
        isOpen={showAddRootModal}
        onClose={() => setShowAddRootModal(false)}
        onSave={handleAddRoot}
        treeName={userTrees.find(tree => tree.id === currentTreeId)?.name}
      />

      {/* Modal xác nhận xóa */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        person={selectedPerson}
      />

      {/* Tree Selector Modal */}
      {showTreeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Select Family Tree</h2>
            {userTrees.length > 0 ? (
              <div className="space-y-2">
                {userTrees.map((tree: any) => (
                  <div
                    key={tree.id}
                    className={`w-full p-3 rounded-lg border flex items-center justify-between ${tree.id === currentTreeId ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
                  >
                    <div
                      onClick={() => handleSwitchTree(tree.id)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{tree.name}</div>
                      <div className="text-sm text-gray-500">Created: {new Date(tree.createdAt).toLocaleDateString()}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1">
                      {/* Edit Tree Button */}
                      <button
                        onClick={() => {
                          const newName = window.prompt(`Enter new name for "${tree.name}":`, tree.name);
                          if (newName && newName.trim() && newName !== tree.name) {
                            handleUpdateTree(tree.id, { name: newName.trim() });
                          }
                        }}
                        className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Edit Tree Name"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Delete Tree Button - Always show */}
                      <button
                        onClick={() => {
                          setSelectedTreeForDelete(tree);
                          setShowDeleteTreeModal(true);
                        }}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete Tree"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No trees found. Create a new tree to get started.
              </div>
            )}
            <div className="mt-4 flex justify-between">
              <button
                onClick={getTrees}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh Trees'}
              </button>
              <button
                onClick={() => setShowTreeSelector(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Tree Modal */}
      {showCreateTreeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Create New Family Tree</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateTree({
                name: formData.get('name') as string
              });
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tree Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter tree name"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTreeModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Create Tree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Manager Modal */}
      {showPhotoManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 h-3/4 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Photo Manager</h2>
              <button
                onClick={() => setShowPhotoManager(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex h-full space-x-4">
              {/* Albums List */}
              <div className="w-1/3 border-r pr-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Albums</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const albumName = window.prompt('Enter album name:');
                        if (albumName?.trim()) {
                          handleCreateAlbum({ name: albumName.trim() });
                        }
                      }}
                      className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      New Album
                    </button>
                    <button
                      onClick={() => loadUserAlbums('current-user-id')}
                      className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Refresh

                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {userAlbums.map((album: any) => (
                    <div
                      key={album.id}
                      className={`flex items-center justify-between p-2 rounded border ${selectedAlbum?.id === album.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
                    >
                      <div
                        onClick={() => {
                          setSelectedAlbum(album);
                          loadAlbumImages(album.id);
                        }}
                        className="flex-1 cursor-pointer"
                      >
                        {album.name}
                      </div>

                      <div className="flex items-center space-x-1">
                        {/* Edit Album Button */}
                        <button
                          onClick={() => {
                            const newName = window.prompt(`Enter new name for album "${album.name}":`, album.name);
                            if (newName && newName.trim() && newName !== album.name) {
                              handleUpdateAlbum(album.id, { name: newName.trim() });
                            }
                          }}
                          className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                          title="Edit Album"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete Album Button */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete album "${album.name}"? This will also delete all images in this album.`)) {
                              handleDeleteAlbum(album.id);
                            }
                          }}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete Album"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images Grid */}
              <div className="w-2/3 pl-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">
                    {selectedAlbum ? `Images in "${selectedAlbum.name}"` : 'Select an album'}
                  </h3>
                  {selectedAlbum && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Upload Image
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                  {albumImages.map((image: any) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={`data:image/jpeg;base64,${image.base64}`}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Image Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Upload Image</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const form = e.target as HTMLFormElement;
              const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
              const file = fileInput.files?.[0];

              if (file && selectedAlbum) {
                const reader = new FileReader();
                reader.onload = () => {
                  const base64 = reader.result as string;
                  const base64Data = base64.split(',')[1]; // Remove data:image/...;base64, prefix

                  handleUploadImage({
                    file: base64Data,
                    name: formData.get('name') as string || file.name,
                    albumId: selectedAlbum.id
                  });
                };
                reader.readAsDataURL(file);
              }
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Image</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Image Name (optional)</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter image name"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Tree Confirmation Modal */}
      {showDeleteTreeModal && selectedTreeForDelete && (
        <DeleteTreeConfirmModal
          tree={selectedTreeForDelete}
          onSuccess={async () => {
            // Lưu trữ thông tin cây trước khi xóa
            const deletedTreeName = selectedTreeForDelete.name;
            const deletedTreeId = selectedTreeForDelete.id;

            // Đóng modal trước
            setShowDeleteTreeModal(false);
            setSelectedTreeForDelete(null);

            // Xử lý logic sau khi xóa thành công (refresh danh sách)
            await handleDeleteTree(deletedTreeId);

            // Hiển thị thông báo thành công sau khi đã refresh
            showSuccessNotification(`✅ Đã xóa thành công cây gia đình: ${deletedTreeName}`);
          }}
          onCancel={() => {
            setShowDeleteTreeModal(false);
            setSelectedTreeForDelete(null);
          }}
        />
      )}

    </div>
  );
};

export default FamilyTreeDemo;
