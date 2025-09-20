import React from "react";
import { DashboardLayout } from "../../components/layout";

const DocumentsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Quản lý tài liệu</h1>
        <div className="bg-white p-4 rounded shadow">Kho tài liệu (đang phát triển)</div>
      </div>
    </DashboardLayout>
  );
};

export default DocumentsPage;


