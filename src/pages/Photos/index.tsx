import React from "react";
import { DashboardLayout } from "../../components/layout";

const PhotosPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Quản lý ảnh</h1>
        <div className="bg-white p-4 rounded shadow">Thư viện ảnh (đang phát triển)</div>
      </div>
    </DashboardLayout>
  );
};

export default PhotosPage;


