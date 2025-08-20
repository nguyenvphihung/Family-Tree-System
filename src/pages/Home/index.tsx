import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FamilyMember } from '../../types/family';
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
      title: "Xem thông tin",
      description: `Đang xem thông tin thành viên có ID: ${id}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Family Tree System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hệ thống quản lý gia phả hiện đại với giao diện trực quan và dễ sử dụng
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            to="/family-tree-demo"
            className="group block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🌳
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                Family Tree Demo
              </h3>
              <p className="text-gray-600 group-hover:text-gray-800">
                Khám phá cây gia phả tương tác với D3.js. Thêm, sửa, xóa thành viên gia đình một cách trực quan.
              </p>
              <div className="mt-4 text-green-600 font-medium group-hover:text-green-700">
                Khám phá ngay →
              </div>
            </div>
          </Link>

          <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Quản lý thành viên</h3>
              <p className="text-gray-600">
                Thêm, chỉnh sửa và xóa thông tin thành viên gia đình một cách dễ dàng
              </p>
              <button
                onClick={handleAddNew}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Thêm thành viên mới
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-4">🎯</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Dễ sử dụng</h4>
            <p className="text-gray-600 text-sm">
              Giao diện trực quan, thân thiện với người dùng
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-4">🔒</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Bảo mật</h4>
            <p className="text-gray-600 text-sm">
              Dữ liệu được bảo vệ an toàn và riêng tư
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-4">📱</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Đa nền tảng</h4>
            <p className="text-gray-600 text-sm">
              Hoạt động tốt trên mọi thiết bị
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleAddNew()}
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">➕</div>
              <span className="text-sm font-medium text-green-800">Thêm mới</span>
            </button>

            <button
              onClick={() => handleView('demo')}
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">👁️</div>
              <span className="text-sm font-medium text-blue-800">Xem thông tin</span>
            </button>

            <button
              onClick={() => handleEdit('demo')}
              className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">✏️</div>
              <span className="text-sm font-medium text-yellow-800">Chỉnh sửa</span>
            </button>

            <button
              onClick={() => handleDelete('demo')}
              className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🗑️</div>
              <span className="text-sm font-medium text-red-800">Xóa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 