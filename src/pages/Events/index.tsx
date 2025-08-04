import React, { useState } from 'react';
import { EventGrid, FamilyEvent } from '../../components/events';
import { toast } from '../../components/ui/use-toast';

const Events: React.FC = () => {
  const [familyEvents, setFamilyEvents] = useState<FamilyEvent[]>([]);

  const handleAddNew = () => {
    toast({
      title: "Thêm sự kiện mới",
      description: "Form thêm sự kiện gia đình sẽ được mở",
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Chỉnh sửa sự kiện",
      description: `Đang chỉnh sửa sự kiện có ID: ${id}`,
    });
  };

  const handleDelete = (id: string) => {
    setFamilyEvents(prev => prev.filter(event => event.id !== id));
    toast({
      title: "Xóa thành công",
      description: "Sự kiện đã được xóa khỏi danh sách",
    });
  };

  const handleView = (id: string) => {
    toast({
      title: "Xem chi tiết",
      description: `Đang xem thông tin chi tiết sự kiện có ID: ${id}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sự kiện Gia đình</h1>
          <p className="text-gray-600">Quản lý và theo dõi các sự kiện quan trọng của gia đình</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <EventGrid
            title="Danh sách Sự kiện Gia đình"
            events={familyEvents}
            viewMode="grid"
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            addButtonText="Thêm Sự kiện"
          />
        </div>

        {/* Thông tin bổ sung */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Lưu trữ Kỷ niệm</h3>
            <p className="text-blue-700 text-sm">
              Ghi lại những khoảnh khắc đáng nhớ của gia đình, từ sinh nhật, 
              đám cưới đến những buổi họp mặt sum vầy.
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Nhắc nhở Tự động</h3>
            <p className="text-green-700 text-sm">
              Hệ thống sẽ tự động nhắc nhở về các sự kiện sắp tới, 
              giúp bạn không bỏ lỡ những dịp quan trọng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events; 