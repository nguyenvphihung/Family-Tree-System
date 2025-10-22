import React, { useState, useEffect, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2, Upload, Calendar, MapPin, Save } from 'lucide-react';
import { PersonInfo, UpdatePersonRequest } from '../../types/person';
import { FamilyMember } from '../../types/family';
import { personService } from '../../services';
import { toast } from '../ui/use-toast';

interface EditPersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    person: FamilyMember | null;
    onPersonUpdated?: (updatedPerson: FamilyMember) => void;
    onRefresh?: () => void;
    onSuccess?: () => void; // Callback sau khi save thành công
}

const EditPersonModal: React.FC<EditPersonModalProps> = ({
    isOpen,
    onClose,
    person,
    onPersonUpdated,
    onRefresh,
    onSuccess,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<UpdatePersonRequest>({
        name: '',
        gender: '',
        birthday: '',
        birthPlace: '',
        createdAt: ''
    });

    const [deathInfo, setDeathInfo] = useState({
        deathPlace: '',
        gravePlace: '',
        deathDate: ''
    });

    const [birthLocation, setBirthLocation] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Initialize form data when person changes - show info immediately
    useEffect(() => {
        if (person) {
            // Convert gender from FamilyMember format to PersonInfo format
            let genderValue = '';
            if (person.gender === 'M') {
                genderValue = 'MALE';
            } else if (person.gender === 'F') {
                genderValue = 'FEMALE';
            }

            setFormData({
                name: person.name || '',
                gender: genderValue,
                birthday: person.birthday || '',
                birthPlace: person.birthPlace || '',
                createdAt: person.createdAt || ''
            });

            // Initialize death info with empty values (will be populated by user if needed)
            setDeathInfo({
                deathPlace: '',
                gravePlace: '',
                deathDate: ''
            });

            setBirthLocation(person.birthPlace || '');
            setAvatarPreview(person.avatarUrl || null);
        }
    }, [person]); const handleInputChange = (field: keyof UpdatePersonRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatarPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (reader.result) {
                    const base64String = (reader.result as string).split(',')[1];
                    resolve(base64String);
                } else {
                    reject(new Error('Failed to convert file to base64'));
                }
            };
            reader.onerror = (error) => reject(error);
        });
    };

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

    const handleUploadAvatar = async () => {
        if (!avatarFile || !person?.id) return;

        setIsLoading(true);
        try {
            const base64Avatar = await convertFileToBase64(avatarFile);
            const updatedPerson = await personService.uploadAvatar(person.id, {
                avatar: base64Avatar
            });

            // Convert PersonInfo to FamilyMember format
            const familyMemberData = convertPersonInfoToFamilyMember(updatedPerson);

            toast({
                title: "✅ Chỉnh sửa thông tin thành công",
                description: "Ảnh đại diện đã được cập nhật thành công!",
                variant: "default",
            });

            setAvatarFile(null);
            onPersonUpdated?.(familyMemberData);
            onRefresh?.();
        } catch (error: any) {
            toast({
                title: "❌ Có lỗi xảy ra",
                description: error.message || "Không thể tải lên ảnh đại diện. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateBasicInfo = async () => {
        if (!person?.id) return;

        // Validation bắt buộc nhập đầy đủ
        if (!formData.name.trim() || !formData.gender.trim() || !formData.birthday.trim() || !formData.birthPlace.trim()) {
            toast({
                title: "❌ Thông tin không đầy đủ",
                description: "Vui lòng nhập đầy đủ tên, giới tính, ngày sinh và nơi sinh.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const updatedPerson = await personService.updatePerson(person.id, {
                ...formData,
                name: formData.name.trim(),
                birthPlace: formData.birthPlace.trim()
            });

            // Convert PersonInfo to FamilyMember format
            const familyMemberData = convertPersonInfoToFamilyMember(updatedPerson);

            toast({
                title: "✅ Chỉnh sửa thông tin thành công",
                description: "Thông tin cơ bản đã được cập nhật thành công!",
                variant: "default",
            });

            onPersonUpdated?.(familyMemberData);
            onRefresh?.();
        } catch (error: any) {
            toast({
                title: "❌ Có lỗi xảy ra",
                description: error.message || "Không thể cập nhật thông tin cơ bản. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateBirthInfo = async () => {
        if (!person?.id || !birthLocation.trim()) return;

        setIsLoading(true);
        try {
            const updatedPerson = await personService.updateBirthInfo(person.id, {
                birthLocation: birthLocation.trim()
            });

            // Convert PersonInfo to FamilyMember format
            const familyMemberData = convertPersonInfoToFamilyMember(updatedPerson);

            toast({
                title: "✅ Chỉnh sửa thông tin thành công",
                description: "Thông tin nơi sinh đã được cập nhật thành công!",
                variant: "default",
            });

            onPersonUpdated?.(familyMemberData);
            onRefresh?.();
        } catch (error: any) {
            toast({
                title: "❌ Có lỗi xảy ra",
                description: error.message || "Không thể cập nhật thông tin nơi sinh. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateDeathInfo = async () => {
        if (!person?.id) return;

        // Check if any death info field has value
        const hasDeathInfo = deathInfo.deathPlace.trim() || deathInfo.gravePlace.trim() || deathInfo.deathDate.trim();
        if (!hasDeathInfo) return;

        setIsLoading(true);
        try {
            // Convert deathDate to ISO format if provided
            const deathInfoPayload = {
                deathPlace: deathInfo.deathPlace.trim(),
                gravePlace: deathInfo.gravePlace.trim(),
                deathDate: deathInfo.deathDate ? new Date(deathInfo.deathDate).toISOString() : deathInfo.deathDate
            };

            const updatedPerson = await personService.updateDeathInfo(person.id, deathInfoPayload);

            // Convert PersonInfo to FamilyMember format
            const familyMemberData = convertPersonInfoToFamilyMember(updatedPerson);

            toast({
                title: "✅ Chỉnh sửa thông tin thành công",
                description: "Thông tin người mất đã được cập nhật thành công!",
                variant: "default",
            });

            onPersonUpdated?.(familyMemberData);
            onRefresh?.();
        } catch (error: any) {
            toast({
                title: "❌ Có lỗi xảy ra",
                description: error.message || "Không thể cập nhật thông tin người mất. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAll = async () => {
        // Validation bắt buộc nhập đầy đủ thông tin cơ bản
        if (!formData.name.trim() || !formData.gender.trim() || !formData.birthday.trim() || !formData.birthPlace.trim()) {
            toast({
                title: "❌ Thông tin không đầy đủ",
                description: "Vui lòng nhập đầy đủ tên, giới tính, ngày sinh và nơi sinh trước khi lưu.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const promises = [];

            // Always update basic info
            promises.push(handleUpdateBasicInfo());

            // Only update birth info if birthLocation has value
            if (birthLocation.trim()) {
                promises.push(handleUpdateBirthInfo());
            }

            // Only update death info if any death field has value
            if (deathInfo.deathPlace.trim() || deathInfo.gravePlace.trim() || deathInfo.deathDate.trim()) {
                promises.push(handleUpdateDeathInfo());
            }

            await Promise.all(promises);

            // Force refresh tree data to get latest changes
            if (onRefresh) {
                await onRefresh();
            }

            // Success message for save all
            toast({
                title: "🎉 Chỉnh sửa thành công",
                description: "Tất cả thông tin đã được cập nhật thành công!",
                variant: "default",
            });

            // Gọi callback success để đóng context menu
            onSuccess?.();

            onClose(); // Close modal after successful save and refresh
        } catch (error: any) {
            toast({
                title: "❌ Có lỗi xảy ra",
                description: "Không thể lưu tất cả thông tin. Vui lòng thử lại.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !person) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between mr-5 ">
                        <span>Chỉnh sửa thông tin - {person?.name}</span>
                        <Button
                            onClick={handleSaveAll}
                            disabled={isLoading}
                            size="sm"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Lưu tất cả
                                </>
                            )}
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Avatar and Basic Info Row */}
                    <div className="flex gap-6">
                        {/* Avatar Section */}
                        <div className="flex-shrink-0">
                            <Label className="text-sm font-semibold mb-2 block">Ảnh đại diện</Label>
                            <div className="flex flex-col items-center gap-3">
                                {avatarPreview && (
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        id="avatar-upload"
                                    />
                                    <Label
                                        htmlFor="avatar-upload"
                                        className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Chọn ảnh
                                    </Label>
                                    {avatarFile && (
                                        <Button onClick={handleUploadAvatar} size="sm" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tải lên'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="flex-1">
                            <Label className="text-sm font-semibold mb-3 block">Thông tin cơ bản</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name" className="text-sm">Họ và tên <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Nhập họ và tên"
                                        className={`mt-1 ${!formData.name.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="gender" className="text-sm">Giới tính <span className="text-red-500">*</span></Label>
                                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)} required>
                                        <SelectTrigger className={`mt-1 ${!formData.gender.trim() ? 'border-red-300 focus:border-red-500' : ''}`}>
                                            <SelectValue placeholder="Chọn giới tính" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">Nam</SelectItem>
                                            <SelectItem value="FEMALE">Nữ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="birthday" className="text-sm">Ngày sinh <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="birthday"
                                        type="date"
                                        value={formData.birthday}
                                        onChange={(e) => handleInputChange('birthday', e.target.value)}
                                        className={`mt-1 ${!formData.birthday.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="birthPlace" className="text-sm">Nơi sinh <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="birthPlace"
                                        value={formData.birthPlace}
                                        onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                                        placeholder="Nhập nơi sinh"
                                        className={`mt-1 ${!formData.birthPlace.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button onClick={handleUpdateBasicInfo} disabled={isLoading} size="sm">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Cập nhật cơ bản
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information Row */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Birth Info */}
                        <div>
                            <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Thông tin sinh
                            </Label>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div>
                                    <Label htmlFor="birthLocation" className="text-sm">Nơi sinh chi tiết</Label>
                                    <Input
                                        id="birthLocation"
                                        value={birthLocation}
                                        onChange={(e) => setBirthLocation(e.target.value)}
                                        placeholder="Nhập nơi sinh chi tiết"
                                        className="mt-1"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={handleUpdateBirthInfo} disabled={isLoading} size="sm">
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Cập nhật nơi sinh
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Death Info */}
                        <div>
                            <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Thông tin người mất
                            </Label>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div>
                                    <Label htmlFor="deathPlace" className="text-sm">Nơi mất</Label>
                                    <Input
                                        id="deathPlace"
                                        value={deathInfo.deathPlace}
                                        onChange={(e) => setDeathInfo(prev => ({ ...prev, deathPlace: e.target.value }))}
                                        placeholder="Nhập nơi mất"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="gravePlace" className="text-sm">Nơi an táng</Label>
                                    <Input
                                        id="gravePlace"
                                        value={deathInfo.gravePlace}
                                        onChange={(e) => setDeathInfo(prev => ({ ...prev, gravePlace: e.target.value }))}
                                        placeholder="Nhập nơi an táng"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="deathDate" className="text-sm">Ngày mất</Label>
                                    <Input
                                        id="deathDate"
                                        type="date"
                                        value={deathInfo.deathDate}
                                        onChange={(e) => setDeathInfo(prev => ({ ...prev, deathDate: e.target.value }))}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button onClick={handleUpdateDeathInfo} disabled={isLoading} size="sm">
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Cập nhật thông tin mất
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default memo(EditPersonModal);