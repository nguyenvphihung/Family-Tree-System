import React, { useState, useEffect } from "react";
import { Grave, GraveLocation } from "../type";
import { provinceData } from "../provinces.data";
import { fetchAllPersonsFromAPI } from "../Cemetery.service";

interface PersonOption {
  id: string;
  name: string;
  treeId: string;
  treeName: string;
}

interface AddGraveFormProps {
  coords: { lat: number; lng: number };
  province: string;
  address: string; // Địa chỉ chi tiết được truyền vào
  onSave: (personId: string, coords: { lat: number; lng: number }, address: string) => Promise<void>;
  onClose: () => void;
}

export const AddGraveForm: React.FC<AddGraveFormProps> = ({
  coords,
  province,
  address,
  onSave,
  onClose,
}) => {
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");
  const [livingPersons, setLivingPersons] = useState<PersonOption[]>([]);
  const [isLoadingPersons, setIsLoadingPersons] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load danh sách người còn sống từ tất cả các cây
  useEffect(() => {
    const loadLivingPersons = async () => {
      try {
        setIsLoadingPersons(true);
        // Fetch tất cả persons từ API (đã filter theo user qua token)
        const allPersons = await fetchAllPersonsFromAPI();
        
        // Lọc những người chưa có thông tin mất
        const living = allPersons
          .filter(person => !person.deathPlace && !person.gravePlace)
          .map(person => ({
            id: person.id,
            name: person.name,
            treeId: person.treeId,
            treeName: person.treeName || "Chưa rõ"
          }));
        
        setLivingPersons(living);
      } catch (error) {
        console.error("Lỗi khi tải danh sách người:", error);
        alert("Không thể tải danh sách người. Vui lòng thử lại.");
      } finally {
        setIsLoadingPersons(false);
      }
    };

    loadLivingPersons();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPersonId) {
      alert("Vui lòng chọn người cần cập nhật thông tin mộ.");
      return;
    }

    setIsSaving(true);

    try {
      // Gọi hàm onSave với personId, coords, address
      await onSave(selectedPersonId, coords, address);
      // Component sẽ tự unmount nếu onSave thành công (do CemeteryMap đóng modal)
    } catch (error) {
      console.error("Lỗi khi lưu thông tin mộ:", error);
      alert((error as Error).message || "Có lỗi xảy ra khi lưu thông tin mộ.");
      setIsSaving(false); // Cho phép thử lại nếu có lỗi
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl z-[1001] w-full max-w-md">
      <h3 className="text-lg font-bold mb-4 text-center">Cập Nhật Thông Tin Mộ</h3>

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
        {/* Dropdown chọn người */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chọn người cần cập nhật thông tin mộ
          </label>
          
          {isLoadingPersons ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Đang tải danh sách...</span>
            </div>
          ) : livingPersons.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center">
              <p className="text-sm text-yellow-800">
                Không tìm thấy người nào chưa có thông tin mộ.
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Tất cả các người trong cây gia phả đã có thông tin mộ hoặc chưa có người nào.
              </p>
            </div>
          ) : (
            <select
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            >
              <option value="">-- Chọn người --</option>
              {livingPersons.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} (Cây: {person.treeName})
                </option>
              ))}
            </select>
          )}
        </div>
        
        {/* Nút Hủy và Lưu */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            disabled={isSaving}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center w-28 hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isSaving || isLoadingPersons || livingPersons.length === 0}
          >
            {isSaving ? (
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
