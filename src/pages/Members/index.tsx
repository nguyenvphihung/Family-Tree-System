import React from "react";
import { DashboardLayout } from "../../components/layout";

const MembersPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Quản lý thành viên</h1>
        <div className="bg-white p-4 rounded shadow">Danh bạ thành viên (đang phát triển)</div>
      </div>
    </DashboardLayout>
  );
};

export default MembersPage;


