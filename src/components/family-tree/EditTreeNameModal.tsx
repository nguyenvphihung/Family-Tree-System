import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Edit } from 'lucide-react';

interface EditTreeNameModalProps {
    isOpen: boolean;
    tree: {
        id: string;
        name: string;
    };
    onClose: () => void;
    onSave: (treeId: string, newName: string) => Promise<void>;
}

const EditTreeNameModal: React.FC<EditTreeNameModalProps> = ({
    isOpen,
    tree,
    onClose,
    onSave
}) => {
    const [newName, setNewName] = useState(tree.name);
    const [isSaving, setIsSaving] = useState(false);

    // Update newName when tree changes
    useEffect(() => {
        setNewName(tree.name);
    }, [tree.name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim() && newName !== tree.name) {
            try {
                setIsSaving(true);
                await onSave(tree.id, newName.trim());
                // Đóng modal sau khi save thành công
                onClose();
            } catch (error) {
                console.error('Failed to update tree name:', error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleClose = () => {
        setNewName(tree.name); // Reset to original name
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Edit className="w-5 h-5 text-blue-600" />
                        Sửa tên cây gia phả
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Current Tree Name Display */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Tên hiện tại:</p>
                        <p className="font-semibold text-gray-900">{tree.name}</p>
                    </div>

                    {/* New Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="newName" className="text-sm font-medium text-gray-700">
                            Tên mới *
                        </Label>
                        <Input
                            id="newName"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nhập tên mới cho cây gia phả"
                            required
                            className="w-full"
                            autoFocus
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={!newName.trim() || newName === tree.name || isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditTreeNameModal;
