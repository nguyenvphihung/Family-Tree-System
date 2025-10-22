import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AddParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  childName?: string;
}

const AddParentModal: React.FC<AddParentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  childName = "Person"
}) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthday: '',
    birthPlace: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      birthday: formData.birthday || null,
      birthPlace: formData.birthPlace || null
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm cha/mẹ cho {childName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="parentName">Tên cha/mẹ</Label>
            <Input
              id="parentName"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nhập tên"
              required
            />
          </div>

          <div>
            <Label htmlFor="parentGender">Giới tính</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Nam</SelectItem>
                <SelectItem value="F">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="parentBirthday">Ngày sinh</Label>
            <Input
              id="parentBirthday"
              type="date"
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="parentBirthPlace">Nơi sinh</Label>
            <Input
              id="parentBirthPlace"
              value={formData.birthPlace}
              onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              placeholder="Nhập nơi sinh"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              Thêm cha/mẹ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddParentModal;
