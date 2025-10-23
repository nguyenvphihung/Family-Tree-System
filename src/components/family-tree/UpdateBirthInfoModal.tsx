import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MapPin, Loader2, Baby } from 'lucide-react';
import { FamilyMember } from '../../types/family';
import { personService } from '../../services';
import { toast } from '../ui/use-toast';

interface UpdateBirthInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    person: FamilyMember | null;
    onSuccess?: () => void;
    onRefresh?: () => void;
    onPersonUpdated?: (updatedPerson: FamilyMember) => void;
}

const UpdateBirthInfoModal: React.FC<UpdateBirthInfoModalProps> = ({
    isOpen,
    onClose,
    person,
    onSuccess,
    onRefresh,
    onPersonUpdated,
}) => {
    const [birthLocation, setBirthLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && person) {
            setBirthLocation(person.birthPlace || '');
        }
    }, [isOpen, person]);

    const handleSave = async () => {
        if (!person?.id) {
            toast({
                title: "❌ Lỗi",
                description: "Không tìm thấy thông tin người cần cập nhật",
                variant: "destructive",
            });
            return;
        }

        // Validation: birthLocation phải có giá trị
        if (!birthLocation.trim()) {
            toast({
                title: "❌ Thông tin không đầy đủ",
                description: "Vui lòng nhập thông tin nơi khai sinh",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const updateData = {
                birthLocation: birthLocation.trim()
            };

            console.log('UpdateBirthInfoModal - Sending update data:', updateData);

            const updatedPerson = await personService.updateBirthInfo(person.id, updateData);

            console.log('UpdateBirthInfoModal - PATCH response:', updatedPerson);

            // Không cần toast ở đây vì makeRequest.ts đã hiển thị notification
            // toast({
            //     title: "✅ Cập nhật thành công",
            //     description: "Thông tin khai sinh đã được cập nhật thành công!",
            //     variant: "default",
            // });

            // Lấy thông tin đầy đủ từ API GET /persons
            const fullPersonInfo = await personService.getPerson(person.id);
            console.log('UpdateBirthInfoModal - Full person info:', fullPersonInfo);

            // Update individual node instead of refreshing entire tree
            if (onPersonUpdated) {
                const updatedFamilyMember = {
                    ...person,
                    // Prioritize form data first since server might have delay in sync
                    birthPlace: updateData.birthLocation || updatedPerson.birthPlace || fullPersonInfo.birthPlace,
                };
                console.log('UpdateBirthInfoModal - Updated family member:', updatedFamilyMember);
                console.log('UpdateBirthInfoModal - Form data used:', updateData.birthLocation);
                onPersonUpdated(updatedFamilyMember);
            } else {
                console.log('UpdateBirthInfoModal - No onPersonUpdated callback, using onRefresh');
                await onRefresh?.();
            }

            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Error updating birth info:', error);
            toast({
                title: "❌ Có lỗi xảy ra",
                description: error.message || "Không thể cập nhật thông tin khai sinh. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setBirthLocation('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-800">
                        <Baby className="w-5 h-5 text-blue-600" />
                        Cập nhật thông tin khai sinh
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Cập nhật thông tin khai sinh của {person?.name || 'người này'}
                    </p>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Nơi khai sinh */}
                    <div className="space-y-2">
                        <Label htmlFor="birthLocation" className="flex items-center gap-2 text-sm font-medium">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            Nơi khai sinh <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="birthLocation"
                            type="text"
                            placeholder="Nhập nơi khai sinh..."
                            value={birthLocation}
                            onChange={(e) => setBirthLocation(e.target.value)}
                            className="w-full"
                            required
                        />
                        <p className="text-xs text-gray-500">
                            Nơi khai sinh có thể khác với nơi sinh thực tế
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        disabled={isLoading}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        Xóa
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Baby className="w-4 h-4 mr-2" />
                                    Lưu thông tin
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateBirthInfoModal;
