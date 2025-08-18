import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AddSpouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  personName?: string;
}

const AddSpouseModal: React.FC<AddSpouseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  personName = "Person"
}) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthday: '',
    birthPlace: '',
    marriageDate: '',
    divorceDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      birthday: formData.birthday || null,
      birthPlace: formData.birthPlace || null,
      marriageDate: formData.marriageDate || null,
      divorceDate: formData.divorceDate || null
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm vợ/chồng cho {personName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="spouseName">Tên vợ/chồng</Label>
            <Input
              id="spouseName"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nhập tên"
              required
            />
          </div>

          <div>
            <Label htmlFor="spouseGender">Giới tính</Label>
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
            <Label htmlFor="spouseBirthday">Ngày sinh</Label>
            <Input
              id="spouseBirthday"
              type="date"
              value={formData.birthday}
              onChange={(e) => handleInputChange('birthday', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="spouseBirthPlace">Nơi sinh</Label>
            <Input
              id="spouseBirthPlace"
              value={formData.birthPlace}
              onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              placeholder="Nhập nơi sinh"
            />
          </div>

          <div>
            <Label htmlFor="marriageDate">Ngày cưới</Label>
            <Input
              id="marriageDate"
              type="date"
              value={formData.marriageDate}
              onChange={(e) => handleInputChange('marriageDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="divorceDate">Ngày ly hôn</Label>
            <Input
              id="divorceDate"
              type="date"
              value={formData.divorceDate}
              onChange={(e) => handleInputChange('divorceDate', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              Thêm vợ/chồng
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSpouseModal;
