import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { FamilyMember } from '../../types/family';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  person: FamilyMember | null;
  isDeleting?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  person,
  isDeleting = false
}) => {
  if (!person) return null;

  const getGenderText = (gender: string) => {
    return gender === 'M' ? 'Nam' : gender === 'F' ? 'Nữ' : 'Không rõ';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Không rõ';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Xác nhận xóa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-semibold">Cảnh báo: Hành động này không thể hoàn tác!</span>
            </div>
            <p className="text-red-700 text-sm">
              Bạn có chắc chắn muốn xóa người này khỏi cây gia phả?
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Thông tin người sẽ bị xóa:</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div><span className="font-medium">Tên:</span> {person.name}</div>
              <div><span className="font-medium">ID:</span> {person.id}</div>
              <div><span className="font-medium">Giới tính:</span> {getGenderText(person.gender)}</div>
              <div><span className="font-medium">Thế hệ:</span> Đời {person.generation}</div>
              <div><span className="font-medium">Ngày sinh:</span> {formatDate(person.birthday)}</div>
              <div><span className="font-medium">Nơi sinh:</span> {person.birthPlace || 'Không rõ'}</div>
            </div>
          </div>

          {person.spouses && person.spouses.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-yellow-800 text-sm">
                <span className="font-medium">Lưu ý:</span> Người này có {person.spouses.length} vợ/chồng
              </div>
            </div>
          )}

          {person.children && person.children.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-yellow-800 text-sm">
                <span className="font-medium">Lưu ý:</span> Người này có {person.children.length} con cái
              </div>
            </div>
          )}

          <div className="text-gray-600 text-xs">
            <strong>Lưu ý:</strong> Việc xóa có thể ảnh hưởng đến cấu trúc cây gia phả và các mối quan hệ liên quan.
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Xác nhận xóa
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
