import React from "react";
import { DashboardLayout } from "../../components/layout";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Bảng điều khiển</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">Tổng quan cây gia phả</div>
          <div className="bg-white p-4 rounded-lg shadow">Sự kiện gần đây</div>
          <div className="bg-white p-4 rounded-lg shadow">Ảnh mới</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;


