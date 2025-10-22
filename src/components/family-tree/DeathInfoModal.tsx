import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Calendar, MapPin, Heart, Save, X } from 'lucide-react';
import { FamilyMember } from '../../types/family';

interface DeathInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    person: FamilyMember | null;
    onSave?: (deathInfo: DeathInfoData) => void;
}

export interface DeathInfoData {
    deathPlace: string;
    gravePlace: string;
    deathDate: string;
    notes?: string;
}

const DeathInfoModal: React.FC<DeathInfoModalProps> = ({
    isOpen,
    onClose,
    person,
    onSave
}) => {
    const [deathInfo, setDeathInfo] = useState<DeathInfoData>({
        deathPlace: '',
        gravePlace: '',
        deathDate: '',
        notes: ''
    });

    // Reset form when modal opens with new person
    useEffect(() => {
        if (isOpen && person) {
            setDeathInfo({
                deathPlace: '',
                gravePlace: '',
                deathDate: '',
                notes: ''
            });
        }
    }, [isOpen, person]);

    const handleSave = () => {
        if (onSave) {
            onSave(deathInfo);
        }
        onClose();
    };

    const handleInputChange = (field: keyof DeathInfoData, value: string) => {
        setDeathInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!isOpen || !person) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        <span>Thông tin người mất - {person.name}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Person Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                            {person.avatarUrl && (
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                                    <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{person.name}</h3>
                                <p className="text-gray-600">
                                    Sinh: {person.birthday || 'Chưa rõ'} {person.birthPlace && `tại ${person.birthPlace}`}
                                </p>
                                <p className="text-sm text-gray-500">Giới tính: {person.gender === 'M' ? 'Nam' : 'Nữ'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Death Information Form */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="deathDate" className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Ngày mất
                                </Label>
                                <Input
                                    id="deathDate"
                                    type="date"
                                    value={deathInfo.deathDate}
                                    onChange={(e) => handleInputChange('deathDate', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="deathPlace" className="text-sm font-medium flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Nơi mất
                                </Label>
                                <Input
                                    id="deathPlace"
                                    value={deathInfo.deathPlace}
                                    onChange={(e) => handleInputChange('deathPlace', e.target.value)}
                                    placeholder="Nhập nơi người này qua đời"
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="gravePlace" className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Nơi an táng
                            </Label>
                            <Input
                                id="gravePlace"
                                value={deathInfo.gravePlace}
                                onChange={(e) => handleInputChange('gravePlace', e.target.value)}
                                placeholder="Nhập nơi an táng, mộ phần"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="notes" className="text-sm font-medium">
                                Ghi chú thêm
                            </Label>
                            <Textarea
                                id="notes"
                                value={deathInfo.notes}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                placeholder="Nhập thông tin bổ sung về người mất (nguyên nhân, hoàn cảnh, di ngôn...)"
                                className="mt-1"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                            disabled={!deathInfo.deathPlace && !deathInfo.deathDate}
                        >
                            <Save className="w-4 h-4" />
                            Lưu thông tin
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeathInfoModal;