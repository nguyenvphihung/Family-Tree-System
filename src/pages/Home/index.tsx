import React, { useState } from 'react';
import { FamilyMemberGrid, FamilyMember } from '../../components/family-tree';
import { toast } from '../../components/ui/use-toast';

const Home: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const handleAddNew = () => {
    toast({
      title: "Thêm thành viên mới",
      description: "Form thêm thành viên gia đình sẽ được mở",
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Chỉnh sửa thông tin",
      description: `Đang chỉnh sửa thông tin thành viên có ID: ${id}`,
    });
  };

  const handleDelete = (id: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
    toast({
      title: "Xóa thành công",
      description: "Thành viên đã được xóa khỏi gia đình",
    });
  };

  const handleView = (id: string) => {
    toast({
      title: "Xem chi tiết",
      description: `Đang xem thông tin chi tiết thành viên có ID: ${id}`,
    });
  };

  const handleViewFamily = (id: string) => {
    toast({
      title: "Xem gia đình",
      description: `Đang xem cây gia phả của thành viên có ID: ${id}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hệ thống Gia phả</h1>
          <p className="text-gray-600">Quản lý và khám phá lịch sử gia đình của bạn</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <FamilyMemberGrid
            title="Danh sách Thành viên Gia đình"
            members={familyMembers}
            viewMode="grid"
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onViewFamily={handleViewFamily}
            addButtonText="Thêm Thành viên"
          />
        </div>

        {/* Thông tin bổ sung */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Kết nối Gia đình</h3>
            <p className="text-blue-700 text-sm">
              Xây dựng và trực quan hóa cây gia phả với giao diện trực quan, 
              dễ dàng thêm thành viên gia đình và mối quan hệ của họ.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Chia sẻ Kỷ niệm</h3>
            <p className="text-green-700 text-sm">
              Chia sẻ ảnh, câu chuyện và các sự kiện quan trọng của gia đình 
              với người thân trong môi trường an toàn và riêng tư.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 