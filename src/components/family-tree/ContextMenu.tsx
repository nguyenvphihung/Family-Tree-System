import React, { useState } from 'react';
import { Plus, Users, Heart, Info, Trash2, Loader2, Edit, Skull, Baby, Camera } from 'lucide-react';
import { personService } from '../../services';
import { FamilyMember } from '../../types/family';
import { PersonInfo, UpdatePersonRequest } from '../../types/person';
import { toast } from '../ui/use-toast';
import EditPersonModal from './EditPersonModal';
import UpdateDeathInfoModal from './UpdateDeathInfoModal';
import UpdateBirthInfoModal from './UpdateBirthInfoModal';
import UpdateAvatarModal from './UpdateAvatarModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface ContextMenuProps {
  isVisible: boolean;
  x: number;
  y: number;
  selectedPerson?: FamilyMember | null;
  onAddChild: () => void;
  onAddParent: () => void;
  onAddSpouse: () => void;
  onViewInfo: () => void;
  onDelete: () => void;
  onClose: () => void;
  onRefresh?: () => void;
  onEditPerson?: (person: FamilyMember) => void;
  onPersonUpdated?: (updatedPerson: FamilyMember) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  isVisible,
  x,
  y,
  selectedPerson,
  onAddChild,
  onAddParent,
  onAddSpouse,
  onViewInfo,
  onDelete,
  onClose,
  onRefresh,
  onEditPerson,
  onPersonUpdated
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingViewInfo, setIsLoadingViewInfo] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingOther, setIsLoadingOther] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [personDetails, setPersonDetails] = useState<PersonInfo | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeathInfoModal, setShowDeathInfoModal] = useState(false);
  const [showBirthInfoModal, setShowBirthInfoModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Function to convert PersonInfo to FamilyMember format
  const convertPersonInfoToFamilyMember = (personInfo: PersonInfo): FamilyMember => {
    return {
      id: personInfo.id,
      treeId: personInfo.treeId,
      name: personInfo.name,
      gender: personInfo.gender === 'MALE' ? 'M' : personInfo.gender === 'FEMALE' ? 'F' : 'M',
      birthday: personInfo.birthday,
      birthPlace: personInfo.birthPlace,
      deathPlace: personInfo.deathPlace || null,
      gravePlace: personInfo.gravePlace || null,
      deathDate: personInfo.deathDate || null,
      generation: personInfo.generation ? parseInt(personInfo.generation) : undefined,
      createdAt: personInfo.createdAt,
      avatarUrl: personInfo.avatarUrl || undefined,
      spouses: [],
      children: []
    };
  };

  const handleClick = (action: () => void) => {
    action();
    onClose();
  };

  // Fetch full person details from API
  const fetchPersonDetails = async (personId: string): Promise<PersonInfo | null> => {
    try {
      const details = await personService.getPerson(personId);
      setPersonDetails(details);
      return details;
    } catch (error: any) {
      console.error('Error fetching person details:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin chi tiết người này",
        variant: "destructive",
      });
      return null;
    }
  };

  // Handle edit person
  const handleEditPerson = () => {
    if (!selectedPerson?.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người cần chỉnh sửa",
        variant: "destructive",
      });
      return;
    }

    // Mở modal và đóng context menu
    setShowEditModal(true);
    onClose();
  };

  // Handle update person (example for updating basic info)
  const handleUpdatePersonInfo = async (updateData: UpdatePersonRequest) => {
    if (!selectedPerson?.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người cần cập nhật",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingOther(true);
    try {
      const updatedPerson = await personService.updatePerson(selectedPerson.id, updateData);

      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin thành công",
      });

      if (onPersonUpdated) {
        const familyMemberData = convertPersonInfoToFamilyMember(updatedPerson);
        onPersonUpdated(familyMemberData);
      }

      if (onRefresh) {
        onRefresh();
      }

      onClose();
    } catch (error: any) {
      console.error('Error updating person:', error);
      toast({
        title: "Lỗi cập nhật",
        description: error.message || "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOther(false);
    }
  };

  // Handle update death info
  const handleUpdateDeathInfo = async (deathPlace: string, gravePlace: string, deathDate: string) => {
    if (!selectedPerson?.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người cần cập nhật",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingOther(true);
    try {
      const updatedPerson = await personService.updateDeathInfo(selectedPerson.id, {
        deathPlace,
        gravePlace,
        deathDate
      });

      toast({
        title: "✅ Cập nhật thành công",
        description: "Thông tin người mất đã được cập nhật thành công!",
        variant: "default",
      });

      const familyMemberData = convertPersonInfoToFamilyMember(updatedPerson);
      onPersonUpdated?.(familyMemberData);
      onRefresh?.();
    } catch (error: any) {
      toast({
        title: "❌ Có lỗi xảy ra",
        description: error.message || "Không thể cập nhật thông tin người mất. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOther(false);
    }
  };

  // Handlers to open modals
  const handleOpenDeathInfoModal = () => {
    setShowDeathInfoModal(true);
    onClose();
  };

  const handleOpenBirthInfoModal = () => {
    setShowBirthInfoModal(true);
    onClose();
  };

  const handleOpenAvatarModal = () => {
    setShowAvatarModal(true);
    onClose();
  };

  // Handle delete with API call
  const handleDeleteWithAPI = async () => {
    if (!selectedPerson?.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người cần xóa",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      await personService.deletePerson(selectedPerson.id);

      // Hiển thị thông báo thành công
     
      // Đóng modal ngay lập tức
      setShowDeleteConfirm(false);
      setIsDeleting(false);

      // Call parent's delete handler
      onDelete();

      // Refresh tree if callback provided - QUAN TRỌNG: phải reload tree để cập nhật hasTreeData
   

      onClose();
    } catch (error: any) {
      console.error('Error deleting person:', error);
      setIsDeleting(false);
      toast({
        title: "Lỗi xóa người",
        description: error.message || "Không thể xóa người này. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  // Handle view info - simplified without API call
  const handleViewInfo = () => {
    // Just call the callback without API call and loading
    onViewInfo();
    onClose();
  };

  return (
    <>
      {/* Backdrop to close menu when clicking outside - chỉ hiển thị khi menu visible */}
      {isVisible && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
        />
      )}

      {/* Context Menu - chỉ hiển thị khi visible */}
      {isVisible && (
        <div
          className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(10px, 10px)' // Offset để menu không che node
          }}
        >
          {/* Add relationship options */}
          <button
            onClick={() => handleClick(onAddChild)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <Plus className="w-4 h-4 text-green-600" />
            <span>Thêm con</span>
          </button>

          <button
            onClick={() => handleClick(onAddParent)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Thêm cha/mẹ</span>
          </button>

          <button
            onClick={() => handleClick(onAddSpouse)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <Heart className="w-4 h-4 text-pink-600" />
            <span>Thêm vợ/chồng</span>
          </button>

          <div className="border-t border-gray-200 my-1" />

          {/* Information and editing options */}
          <button
            onClick={handleViewInfo}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <Info className="w-4 h-4 text-blue-600" />
            <span>Xem thông tin</span>
          </button>

          <button
            onClick={handleEditPerson}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <Edit className="w-4 h-4 text-purple-600" />
            <span>Chỉnh sửa thông tin</span>
          </button>

          {/* Cập nhật riêng lẻ */}
          <button
            onClick={handleOpenDeathInfoModal}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <Skull className="w-4 h-4 text-red-600" />
            <span>Cập nhật thông tin mất</span>
          </button>

          <button
            onClick={handleOpenBirthInfoModal}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <Baby className="w-4 h-4 text-blue-600" />
            <span>Cập nhật thông tin sinh</span>
          </button>

          <button
            onClick={handleOpenAvatarModal}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
          >
            <Camera className="w-4 h-4 text-green-600" />
            <span>Cập nhật ảnh đại diện</span>
          </button>

          <div className="border-t border-gray-200 my-1" />

          {/* Delete option */}
          <button
            onClick={() => {
              setShowDeleteConfirm(true);
              onClose(); // Đóng context menu khi mở modal xóa
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa người này</span>
          </button>
        </div>
      )}

      {/* Edit Person Modal */}
      <EditPersonModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setPersonDetails(null);
        }}
        person={selectedPerson}
        onPersonUpdated={onPersonUpdated}
        onRefresh={onRefresh}
        onSuccess={() => {
          // Đóng context menu sau khi chỉnh sửa thành công
          onClose();
        }}
      />

      {/* Update Death Info Modal */}
      <UpdateDeathInfoModal
        isOpen={showDeathInfoModal}
        onClose={() => setShowDeathInfoModal(false)}
        person={selectedPerson}
        onSuccess={() => onClose()}
        onRefresh={onRefresh}
        onPersonUpdated={onPersonUpdated}
      />

      {/* Update Birth Info Modal */}
      <UpdateBirthInfoModal
        isOpen={showBirthInfoModal}
        onClose={() => setShowBirthInfoModal(false)}
        person={selectedPerson}
        onSuccess={() => onClose()}
        onRefresh={onRefresh}
        onPersonUpdated={onPersonUpdated}
      />

      {/* Update Avatar Modal */}
      <UpdateAvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        person={selectedPerson}
        onSuccess={() => onClose()}
        onRefresh={onRefresh}
        onPersonUpdated={onPersonUpdated}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteWithAPI}
        person={selectedPerson}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ContextMenu;
