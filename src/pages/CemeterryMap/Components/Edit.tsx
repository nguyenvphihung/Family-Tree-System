import React, { useState, useEffect } from "react";
interface EditableFieldProps {
  initialValue: string;
  onSave: (newValue: string) => Promise<void>;
  className?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  initialValue,
  onSave,
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialValue);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    // Chỉ gọi API nếu giá trị thực sự thay đổi
    if (value !== initialValue) {
      setIsSaving(true);
      try {
        await onSave(value);
      } catch (error) {
        console.error("Lỗi cập nhật:", error);
        setValue(initialValue);
      } finally {
        setIsSaving(false);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  // Hiển thị trạng thái đang lưu
  if (isSaving) {
    return (
      <span className={`text-gray-400 italic px-1 ${className}`}>
        Đang lưu...
      </span>
    );
  }

  // Hiển thị ô input khi đang sửa
  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave} // Tự động lưu khi người dùng click ra ngoài
        onKeyDown={handleKeyDown}
        autoFocus // Tự động focus vào ô input
        className={`border rounded px-1 -my-1 w-full ${className}`}
      />
    );
  }

  // Hiển thị giá trị dạng văn bản
  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-gray-100 rounded px-1 -my-1 inline-block transition-colors duration-200 ${className}`}
      title="Nhấp để sửa"
    >
      {/* Hiển thị chữ mờ nếu không có giá trị */}
      {initialValue || <span className="text-gray-400 italic">Chưa có</span>}
    </span>
  );
};
