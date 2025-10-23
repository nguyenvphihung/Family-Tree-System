import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { treeService } from '@/services';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, X } from 'lucide-react';

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
    const { mutate: deleteTree, isPending, isError, error, isSuccess } = useMutation({
        mutationFn: (treeId: string) => treeService.deleteTree(treeId),
        onSuccess: () => {
            // Đóng modal ngay lập tức
            onCancel();
            // Gọi callback onSuccess và reload sau 2 giây
            setTimeout(() => {
                onSuccess();
                // Reload page để cập nhật danh sách cây
                window.location.reload();
            }, 2000);
        },
        onError: (err: any) => {
            // Không cần toast, hiển thị trực tiếp trong modal
        },
    });

    const handleDelete = () => {
        deleteTree(tree.id);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                {/* Close Button (X) */}
                <button
                    onClick={onCancel}
                    disabled={isPending}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Đóng"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-4 pr-8">
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

                {/* Error Message - chỉ hiển thị lỗi, success sẽ dùng toast */}
                {isError && error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {(error as any)?.message || 'Đã có lỗi xảy ra'}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    {!isSuccess && (
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                        >
                            {isPending ? (
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