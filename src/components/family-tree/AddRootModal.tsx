import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AddRootModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    treeName?: string;
}

const AddRootModal: React.FC<AddRootModalProps> = ({
    isOpen,
    onClose,
    onSave,
    treeName = "Family Tree"
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
            birthday: formData.birthday || new Date().toISOString().split('T')[0],
            birthPlace: formData.birthPlace || ''
        });

        // Reset form after save
        setFormData({
            name: '',
            gender: '',
            birthday: '',
            birthPlace: ''
        });

        onClose();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClose = () => {
        setFormData({
            name: '',
            gender: '',
            birthday: '',
            birthPlace: ''
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        Add Person to {treeName}
                    </DialogTitle>
                    <p className="text-sm text-gray-600 mt-2">
                        Create the first person in your family tree. This will be the foundation of your genealogy.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Full Name *
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter full name"
                            required
                            className="w-full"
                        />
                    </div>

                    {/* Gender Field */}
                    <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                            Gender *
                        </Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="M">Male</SelectItem>
                                <SelectItem value="F">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Birthday Field */}
                    <div className="space-y-2">
                        <Label htmlFor="birthday" className="text-sm font-medium text-gray-700">
                            Date of Birth
                        </Label>
                        <Input
                            id="birthday"
                            type="date"
                            value={formData.birthday}
                            onChange={(e) => handleInputChange('birthday', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Birth Place Field */}
                    <div className="space-y-2">
                        <Label htmlFor="birthPlace" className="text-sm font-medium text-gray-700">
                            Place of Birth
                        </Label>
                        <Input
                            id="birthPlace"
                            value={formData.birthPlace}
                            onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                            placeholder="Enter place of birth"
                            className="w-full"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={!formData.name || !formData.gender}
                        >
                            Create Root Person
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddRootModal;