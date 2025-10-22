import React, { useState } from "react";
import { Grave, GraveLocation } from "../type";
import { provinceData } from "../provinces.data";

interface AddGraveFormProps {
  coords: { lat: number; lng: number };
  province: string;
  address: string; // Địa chỉ chi tiết được truyền vào
  onSave: (grave: Omit<Grave, "id">) => Promise<void>;
  onClose: () => void;
}

export const AddGraveForm: React.FC<AddGraveFormProps> = ({
  coords,
  province,
  address,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState<string>("");
  const [relation, setRelation] = useState<string>("");

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !relation) {
      alert("Vui lòng nhập đầy đủ tên và quan hệ.");
      return;
    }

    setIsSaving(true);

    try {
      // Gọi hàm onSave được truyền từ CemeteryMap
      await onSave({
        name,
        relation,
        location: { province },
        birthYear: null,
        deathYear: null,
        icon: "user",
        description: "", // Có thể lấy từ form nếu muốn
        coordinates: coords,
        address: address,
      });
      // Component sẽ tự unmount nếu onSave thành công (do CemeteryMap đóng modal)
    } catch (error) {
      console.error("Lỗi khi lưu mộ mới:", error);
      setIsSaving(false); // Cho phép thử lại nếu có lỗi
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl z-[1001] w-full max-w-sm">
      <h3 className="text-lg font-bold mb-4 text-center">Thêm Mộ Mới</h3>

      {/* Hiển thị địa chỉ chi tiết */}
      <div className="text-sm text-gray-700 mb-2 text-center bg-gray-100 p-3 rounded-md shadow-sm">
        <strong className="block text-gray-800">Vị trí đã chọn:</strong>
        {address}
      </div>

      {/* Hiển thị tỉnh thành */}
      <div className="text-sm text-gray-600 mb-4 text-center">
        (Tỉnh thành: <span className="font-semibold">{province}</span>)
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên</label>
          <input
            type="text"
            placeholder="Nhập tên người đã khuất"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            autoFocus // Tự động focus vào ô này khi form mở
          />
        </div>
        {/* Input Quan hệ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quan hệ
          </label>
          <input
            type="text"
            placeholder="Ví dụ: Ông nội, Bà ngoại..."
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Nút Hủy và Lưu */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            disabled={isSaving} // Vô hiệu hóa khi đang lưu
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center w-28 hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSaving} // Vô hiệu hóa khi đang lưu
          >
            {isSaving ? (
              // Hiển thị spinner khi đang lưu
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Lưu Lại"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
