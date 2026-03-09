import React, { useCallback, useRef } from 'react';
import { RestoreMethod } from './constants';
import { formatFileSize } from './helpers';

interface UploadZoneProps {
  showUrlInput: boolean;
  setShowUrlInput: (show: boolean) => void;
  restoreMethod: RestoreMethod;
  setRestoreMethod: (method: RestoreMethod) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  handleFileSelected: (file: File) => void;
  handleUrlSubmit: () => void;
  uploadedFile: File | null;
  resetImages: () => void;
  onPaste: (event: React.ClipboardEvent<HTMLDivElement>) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  showUrlInput,
  setShowUrlInput,
  restoreMethod,
  setRestoreMethod,
  imageUrl,
  setImageUrl,
  handleFileSelected,
  handleUrlSubmit,
  uploadedFile,
  resetImages,
  onPaste,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFileSelected(file);
  }, [handleFileSelected]);

  return (
    <div onPaste={onPaste}>
      {/* Upload/URL Toggle - Chỉ hiển thị khi chưa upload file */}
      {!uploadedFile && !showUrlInput && (
        <div className="animate-scale-up w-full flex flex-col items-center gap-4">
          {/* Toggle buttons */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                setShowUrlInput(false);
                setRestoreMethod(RestoreMethod.FILE);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all btn-hover ${
                !showUrlInput
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label="Upload file"
            >
              📤 Upload File
            </button>
            <button
              onClick={() => {
                setShowUrlInput(true);
                setRestoreMethod(RestoreMethod.URL);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all btn-hover ${
                showUrlInput
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label="Enter URL"
            >
              🔗 Nhập URL
            </button>
          </div>

          {/* Main upload button */}
          <div className="flex flex-col items-center gap-4 w-full">
            <button
              onClick={handleUploadClick}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all transform hover:scale-105 btn-hover"
              aria-label="Tải ảnh cũ lên"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Tải ảnh cũ lên
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              aria-label="Chọn ảnh gia đình"
            />
            <p className="text-sm text-gray-600 select-none">
              Hoặc nhấn{" "}
              <kbd className="px-2 py-1 bg-teal-100 rounded text-xs font-mono">
                Ctrl + V
              </kbd>
              {" "}hoặc kéo thả ảnh vào đây
            </p>
          </div>
        </div>
      )}

      {/* URL Input Section - Khi chọn Nhập URL */}
      {!uploadedFile && showUrlInput && (
        <div className="animate-scale-up w-full flex flex-col items-center gap-4">
          {/* Back button */}
          <button
            onClick={() => setShowUrlInput(false)}
            className="text-teal-600 hover:text-teal-700 font-medium text-sm mb-2 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại
          </button>

          <div className="w-full max-w-sm space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Nhập URL ảnh (Direct link)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit();
                  }
                }}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
            <button
              onClick={handleUrlSubmit}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all transform hover:scale-105 btn-hover"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Tải ảnh từ URL
            </button>
            <p className="text-xs text-gray-500 text-center">
              💡 Lưu ý: Sử dụng direct link (ví dụ: https://i.imgur.com/xxx.jpg)
            </p>
          </div>
        </div>
      )}

      {/* File Info Display */}
      {uploadedFile && (
        <div className="w-full mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-blue-700">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={resetImages}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm btn-hover"
            >
              Thay đổi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;