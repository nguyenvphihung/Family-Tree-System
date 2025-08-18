import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { FamilyMember } from '../../types/family';

interface PersonInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: FamilyMember | null;
}

const PersonInfoModal: React.FC<PersonInfoModalProps> = ({
  isOpen,
  onClose,
  person
}) => {
  if (!person) return null;



  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Không rõ';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const getGenderText = (gender: string) => {
    return gender === 'M' ? 'Nam' : gender === 'F' ? 'Nữ' : 'Không rõ';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thông tin chi tiết: {person.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Thông tin cơ bản</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Tên:</span> {person.name}</div>
                <div><span className="font-medium">ID:</span> {person.id}</div>
                <div><span className="font-medium">Giới tính:</span> {getGenderText(person.gender)}</div>
                <div><span className="font-medium">Ngày sinh:</span> {formatDate(person.birthday)}</div>
                <div><span className="font-medium">Nơi sinh:</span> {person.birthPlace || 'Không rõ'}</div>
                <div><span className="font-medium">Thế hệ:</span> Đời {person.generation}</div>
                <div><span className="font-medium">Ngày tạo:</span> {formatDate(person.createdAt)}</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Thông tin bổ sung</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Tree ID:</span> {person.treeId || 'Không rõ'}</div>
              </div>
            </div>
          </div>

          {/* Spouses */}
          {person.spouses && person.spouses.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Vợ/Chồng</h3>
              <div className="space-y-2">
                {person.spouses.map((spouse, index) => (
                  <div key={spouse.id || index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div><span className="font-medium">Tên:</span> {spouse.name}</div>
                        <div><span className="font-medium">Giới tính:</span> {getGenderText(spouse.gender)}</div>
                      </div>
                      <div>
                        <div><span className="font-medium">Ngày cưới:</span> {formatDate(spouse.marriageDate)}</div>
                        <div><span className="font-medium">Ngày ly hôn:</span> {formatDate(spouse.divorceDate)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Children */}
          {person.children && person.children.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Con cái</h3>
              <div className="space-y-2">
                {person.children.map((child, index) => (
                  <div key={child.id || index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div><span className="font-medium">Tên:</span> {child.name}</div>
                        <div><span className="font-medium">Giới tính:</span> {getGenderText(child.gender)}</div>
                      </div>
                      <div>
                        <div><span className="font-medium">Ngày sinh:</span> {formatDate(child.birthday)}</div>
                        <div><span className="font-medium">Thế hệ:</span> Đời {child.generation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No relationships message */}
          {(!person.spouses || person.spouses.length === 0) && 
           (!person.children || person.children.length === 0) && (
            <div className="text-center text-gray-500 py-4">
              Chưa có thông tin về vợ/chồng hoặc con cái
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonInfoModal;
