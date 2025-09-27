import React, { useEffect } from 'react';
import { useFamilyTree } from '../hooks/useFamilyTree';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, CheckCircle } from 'lucide-react';

interface DeleteTreeConfirmModalProps {
    tree: {
        id: string;
        name: string;
        createdAt: string;
    };
    onSuccess: () => void;
    onCancel: () => void;
}

const DeleteTreeConfirmModal: React.FC<DeleteTreeConfirmModalProps> = ({
    tree,
    onSuccess,
    onCancel
}) => {
    const { deleteTree, loading, error, successMessage, clearMessages } = useFamilyTree();

    // Auto close modal sau khi success và delay một chút để user thấy message
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                onSuccess();
            }, 1500); // Delay 1.5s để user đọc message

            return () => clearTimeout(timer);
        }
    }, [successMessage, onSuccess]);

    // Clear messages khi component unmount
    useEffect(() => {
        return () => {
            clearMessages();
        };
    }, [clearMessages]);

    const handleDelete = async () => {
        try {
            await deleteTree(tree.id);
            // Không cần gọi onSuccess ở đây vì useEffect sẽ handle
        } catch (err) {
            console.error('Failed to delete tree:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Xác nhận xóa cây gia phả</h2>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <p className="text-gray-700 mb-3">
                        Bạn có chắc chắn muốn xóa cây gia phả này không?
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="font-semibold text-red-900">{tree.name}</div>
                        <div className="text-sm text-red-700">
                            Được tạo: {new Date(tree.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                    </div>
                    <p className="text-sm text-red-600 mt-3 font-medium">
                        ⚠️ Hành động này không thể hoàn tác. Tất cả thành viên và dữ liệu liên quan sẽ bị xóa vĩnh viễn.
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading || successMessage !== null}
                        className="px-4 py-2"
                    >
                        {successMessage ? 'Đóng' : 'Hủy'}
                    </Button>

                    {!successMessage && (
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    Đang xóa...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Xác nhận xóa
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeleteTreeConfirmModal;