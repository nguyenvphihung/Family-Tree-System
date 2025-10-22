import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  parentName?: string;
}

const AddChildModal: React.FC<AddChildModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parentName = "Parent"
}) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthday: '',
    birthPlace: '',
    childrenType: '',
    adoptionDate: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      birthday: formData.birthday || null,
      birthPlace: formData.birthPlace || null,
      adoptionDate: formData.adoptionDate || null,
      notes: formData.notes || null
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Kiểm tra xem có nên hiện field ngày nhận nuôi không
  const shouldShowAdoptionDate = formData.childrenType === 'ADOPTED' || formData.childrenType === 'SINGLE_PARENT';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">Thêm con cho {parentName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="childName" className="text-sm">Tên con</Label>
            <Input
              id="childName"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nhập tên"
              required
              className="h-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="childGender" className="text-sm">Giới tính</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Nam</SelectItem>
                  <SelectItem value="F">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="childrenType" className="text-sm">Loại con cái</Label>
              <Select value={formData.childrenType} onValueChange={(value) => handleInputChange('childrenType', value)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BIOLOGICAL">Con đẻ</SelectItem>
                  <SelectItem value="ADOPTED">Con nuôi</SelectItem>
                  <SelectItem value="SINGLE_PARENT">Cha/mẹ đơn thân</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="childBirthday" className="text-sm">Ngày sinh</Label>
              <Input
                id="childBirthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
                className="h-9"
              />
            </div>

            {shouldShowAdoptionDate && (
              <div>
                <Label htmlFor="adoptionDate" className="text-sm">Ngày nhận nuôi</Label>
                <Input
                  id="adoptionDate"
                  type="date"
                  value={formData.adoptionDate}
                  onChange={(e) => handleInputChange('adoptionDate', e.target.value)}
                  className="h-9"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="childBirthPlace" className="text-sm">Nơi sinh</Label>
            <Input
              id="childBirthPlace"
              value={formData.birthPlace}
              onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              placeholder="Nhập nơi sinh"
              className="h-9"
            />
          </div>

          <div>
            <Label htmlFor="childNotes" className="text-sm">Ghi chú</Label>
            <Textarea
              id="childNotes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Nhập ghi chú"
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} size="sm">
              Hủy
            </Button>
            <Button type="submit" size="sm">
              Thêm con
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChildModal;
