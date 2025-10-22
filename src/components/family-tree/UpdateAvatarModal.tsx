import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Upload, Loader2, User, Camera, X } from 'lucide-react';
import { FamilyMember } from '../../types/family';
import { personService } from '../../services';
import { toast } from '../ui/use-toast';

interface UpdateAvatarModalProps {
    isOpen: boolean;
    onClose: () => void;
    person: FamilyMember | null;
    onSuccess?: () => void;
    onRefresh?: () => void;
    onPersonUpdated?: (updatedPerson: FamilyMember) => void;
}

const UpdateAvatarModal: React.FC<UpdateAvatarModalProps> = ({
    isOpen,
    onClose,
    person,
    onSuccess,
    onRefresh,
    onPersonUpdated,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "❌ File không hợp lệ",
                    description: "Vui lòng chọn file ảnh (jpg, png, gif, etc.)",
                    variant: "destructive",
                });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "❌ File quá lớn",
                    description: "Kích thước file không được vượt quá 5MB",
                    variant: "destructive",
                });
                return;
            }

            setSelectedFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data:image/jpeg;base64, prefix to get pure base64
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
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

        if (!selectedFile) {
            toast({
                title: "❌ Chưa chọn ảnh",
                description: "Vui lòng chọn ảnh để upload",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            // Convert file to base64
            const base64Avatar = await convertFileToBase64(selectedFile);

            await personService.uploadAvatar(person.id, {
                avatar: base64Avatar
            });

            toast({
                title: "✅ Cập nhật thành công",
                description: "Avatar đã được cập nhật thành công!",
                variant: "default",
            });

            // Lấy thông tin đầy đủ từ API GET /persons
            const fullPersonInfo = await personService.getPerson(person.id);
            console.log('UpdateAvatarModal - Full person info:', fullPersonInfo);

            // Update individual node instead of refreshing entire tree
            if (onPersonUpdated) {
                const updatedFamilyMember = {
                    ...person,
                    // Use data from GET response for avatar
                    avatarUrl: fullPersonInfo.avatarUrl,
                };
                console.log('UpdateAvatarModal - Updated family member:', updatedFamilyMember);
                onPersonUpdated(updatedFamilyMember);
            } else {
                console.log('UpdateAvatarModal - No onPersonUpdated callback, using onRefresh');
                await onRefresh?.();
            }

            onSuccess?.();
            onClose();
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            toast({
                title: "❌ Có lỗi xảy ra",
                description: error.message || "Không thể cập nhật avatar. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-800">
                        <Camera className="w-5 h-5 text-green-600" />
                        Cập nhật ảnh đại diện
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                        Cập nhật ảnh đại diện cho {person?.name || 'người này'}
                    </p>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current Avatar */}
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            {person?.avatarUrl ? (
                                <img
                                    src={person.avatarUrl}
                                    alt={person.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-8 h-8 text-gray-400" />
                            )}
                        </div>
                        <p className="text-xs text-gray-500">Ảnh hiện tại</p>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                            <Upload className="w-4 h-4 text-green-500" />
                            Chọn ảnh mới <span className="text-red-500">*</span>
                        </Label>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="avatar-upload"
                            />
                            <label
                                htmlFor="avatar-upload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">
                                    Click để chọn ảnh
                                </span>
                                <span className="text-xs text-gray-400 mt-1">
                                    JPG, PNG, GIF (tối đa 5MB)
                                </span>
                            </label>
                        </div>

                        {/* Preview */}
                        {previewUrl && (
                            <div className="relative">
                                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <button
                                    onClick={handleRemoveFile}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-1">
                                    {selectedFile?.name} ({(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveFile}
                        disabled={isLoading || !selectedFile}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        Xóa ảnh
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
                            disabled={isLoading || !selectedFile}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang tải lên...
                                </>
                            ) : (
                                <>
                                    <Camera className="w-4 h-4 mr-2" />
                                    Lưu ảnh
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateAvatarModal;
