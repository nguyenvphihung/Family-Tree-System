import React from "react";
import { DashboardLayout } from "../../components/layout";

const StoriesPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Phục chế ảnh / Câu chuyện</h1>
        <div className="bg-white p-4 rounded shadow">Tính năng phục chế ảnh và câu chuyện (đang phát triển)</div>
      </div>
    </DashboardLayout>
  );
};

export default StoriesPage;


