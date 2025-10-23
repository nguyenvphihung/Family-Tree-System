import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar, MapPin, Loader2, Skull } from 'lucide-react';
import { FamilyMember } from '../../types/family';
import { personService } from '../../services';
import { toast } from '../ui/use-toast';

interface UpdateDeathInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    person: FamilyMember | null;
    onSuccess?: () => void;
    onRefresh?: () => void;
    onPersonUpdated?: (updatedPerson: FamilyMember) => void;
}

const UpdateDeathInfoModal: React.FC<UpdateDeathInfoModalProps> = ({
    isOpen,
    onClose,
    person,
    onSuccess,
    onRefresh,
    onPersonUpdated,
}) => {
    const [formData, setFormData] = useState({
        deathPlace: '',
        gravePlace: '',
        deathDate: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && person) {
            setFormData({
                deathPlace: person.deathPlace || '',
                gravePlace: person.gravePlace || '',
                deathDate: person.deathDate || '',
            });
        }
    }, [isOpen, person]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!person?.id) {
            toast({
                title: "❌ Lỗi",
                description: "Không tìm thấy thông tin người cần cập nhật",
                variant: "destructive",
            });
            return;
        }

        // Validation: ít nhất một trường phải có giá trị
        if (!formData.deathPlace.trim() && !formData.gravePlace.trim() && !formData.deathDate.trim()) {
            toast({
                title: "❌ Thông tin không đầy đủ",
                description: "Vui lòng nhập ít nhất một thông tin về người mất",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            // Prepare data - ensure proper format
            const updateData = {
                deathPlace: formData.deathPlace.trim() || undefined,
                gravePlace: formData.gravePlace.trim() || undefined,
                // Convert date to ISO format for server
                deathDate: formData.deathDate.trim() ? new Date(formData.deathDate).toISOString() : undefined,
            };

            console.log('UpdateDeathInfoModal - Sending update data:', updateData);
            console.log('UpdateDeathInfoModal - Person ID:', person.id);

            const updatedPerson = await personService.updateDeathInfo(person.id, updateData);

            console.log('UpdateDeathInfoModal - Death info updated:', updateData);
            console.log('UpdateDeathInfoModal - API Response:', updatedPerson);

            // Lấy thông tin đầy đủ từ API GET /persons để có deathDate
            const fullPersonInfo = await personService.getPerson(person.id);
            console.log('UpdateDeathInfoModal - Full person info:', fullPersonInfo);



            // Thay vì reload toàn bộ tree, chỉ cập nhật UI ngay lập tức
            // để tránh D3 re-layout làm thay đổi vị trí node
            console.log('UpdateDeathInfoModal - Updating UI without full refresh');

            // Call onPersonUpdated to update the specific node data
            if (onPersonUpdated) {
                const updatedFamilyMember = {
                    ...person,
                    // Use data from PATCH response first, fallback to GET response, then form data
                    deathPlace: updatedPerson.deathPlace || fullPersonInfo.deathPlace || updateData.deathPlace,
                    gravePlace: updatedPerson.gravePlace || fullPersonInfo.gravePlace || updateData.gravePlace,
                    deathDate: updatedPerson.deathDate || fullPersonInfo.deathDate || updateData.deathDate // API missing deathDate, use form data
                };
                console.log('UpdateDeathInfoModal - Updated family member:', updatedFamilyMember);
                onPersonUpdated(updatedFamilyMember);
            } else {
                console.log('UpdateDeathInfoModal - No onPersonUpdated callback, using onRefresh');
                await onRefresh?.();
            }

            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Error updating death info:', error);
            toast({
                title: "❌ Có lỗi xảy ra",
                description: error.message || "Không thể cập nhật thông tin người mất. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            deathPlace: '',
            gravePlace: '',
            deathDate: '',
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-800">
                        <Skull className="w-5 h-5 text-gray-600" />
                        Cập nhật thông tin người mất
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Cập nhật thông tin về {person?.name || 'người này'}
                    </p>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Nơi mất */}
                    <div className="space-y-2">
                        <Label htmlFor="deathPlace" className="flex items-center gap-2 text-sm font-medium">
                            <MapPin className="w-4 h-4 text-red-500" />
                            Nơi mất
                        </Label>
                        <Input
                            id="deathPlace"
                            type="text"
                            placeholder="Nhập nơi mất..."
                            value={formData.deathPlace}
                            onChange={(e) => handleInputChange('deathPlace', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Nơi an táng */}
                    <div className="space-y-2">
                        <Label htmlFor="gravePlace" className="flex items-center gap-2 text-sm font-medium">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            Nơi an táng
                        </Label>
                        <Input
                            id="gravePlace"
                            type="text"
                            placeholder="Nhập nơi an táng..."
                            value={formData.gravePlace}
                            onChange={(e) => handleInputChange('gravePlace', e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Ngày mất */}
                    <div className="space-y-2">
                        <Label htmlFor="deathDate" className="flex items-center gap-2 text-sm font-medium">
                            <Calendar className="w-4 h-4 text-red-500" />
                            Ngày mất
                        </Label>
                        <Input
                            id="deathDate"
                            type="date"
                            value={formData.deathDate}
                            onChange={(e) => handleInputChange('deathDate', e.target.value)}
                            className="w-full"
                        />
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
                        Xóa tất cả
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
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Skull className="w-4 h-4 mr-2" />
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

export default UpdateDeathInfoModal;
