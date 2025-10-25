import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import restoreImageService from "@/services/restoreImageService";
import { useToast } from "@/components/ui/use-toast";

const SnapshotEditor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [restoreMethod, setRestoreMethod] = useState<'file' | 'url'>('file'); // 'file' or 'url'
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (uploadedImage) URL.revokeObjectURL(uploadedImage);
      if (processedImage) URL.revokeObjectURL(processedImage);
    };
  }, [uploadedImage, processedImage]);

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        setUploadedImage(URL.createObjectURL(file));
        event.preventDefault();
        break;
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      setUploadedImage(URL.createObjectURL(files[0]));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(URL.createObjectURL(file));
      setUploadedFile(file);
      setRestoreMethod('file');
      setShowUrlInput(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const processImage = async () => {
    if (!uploadedImage && !imageUrl) {
      toast({
        title: "Lỗi",
        description: "Vui lòng tải ảnh lên hoặc nhập URL ảnh",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessedImage(null);

    try {
      let result;

      if (restoreMethod === 'file' && uploadedFile) {
        // Restore bằng file upload
        toast({
          title: "Đang xử lý...",
          description: "Đang upload và phục hồi ảnh bằng AI...",
        });
        result = await restoreImageService.restoreByFile(uploadedFile);
      } else if (restoreMethod === 'url' && imageUrl) {
        // Restore bằng URL
        toast({
          title: "Đang xử lý...",
          description: "Đang tải và phục hồi ảnh từ URL...",
        });
        result = await restoreImageService.restoreByUrl(imageUrl);
      } else {
        throw new Error("Không có dữ liệu để xử lý");
      }

      if (result.success && result.restored_url) {
        // Cập nhật ảnh gốc từ Cloudinary (nếu có)
        if (result.original_url) {
          setUploadedImage(result.original_url);
        }

        setProcessedImage(result.restored_url);
        toast({
          title: "✅ Phục hồi thành công!",
          description: `Đã phát hiện ${result.faces_detected} khuôn mặt. Độ phóng đại: ${result.upscale_factor.toFixed(2)}x`,
        });

        console.log('[SnapshotEditor] Restore result:', {
          taskId: result.task_id,
          originalUrl: result.original_url,
          restoredUrl: result.restored_url,
          originalSize: result.original_size,
          restoredSize: result.restored_size,
          upscaleFactor: result.upscale_factor,
          facesDetected: result.faces_detected
        });
      } else {
        throw new Error(result.error || "Không thể phục hồi ảnh");
      }
    } catch (error: any) {
      console.error('[SnapshotEditor] Error:', error);
      toast({
        title: "❌ Lỗi phục hồi ảnh",
        description: error.message || "Không thể phục hồi ảnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImages = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setUploadedFile(null);
    setImageUrl("");
    setShowUrlInput(false);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL ảnh",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      toast({
        title: "Lỗi",
        description: "URL không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    setUploadedImage(imageUrl);
    setRestoreMethod('url');
    setUploadedFile(null);
  };

  const toggleInputMethod = () => {
    setShowUrlInput(!showUrlInput);
    resetImages();
  };

  const handleAttachToTree = () => {
    if (processedImage) {
      localStorage.setItem("restoredImage", processedImage);
      navigate("/family-tree-demo");
    } else {
      alert(" Vui lòng xử lý ảnh trước khi thêm vào cây gia phả!");
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
          .font-playfair {
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            letter-spacing: -0.01em;
          }
        `}
      </style>

      <div className="font-sans bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 min-h-screen p-4 sm:p-6 md:p-8 pt-24 md:pt-28 flex flex-col items-center">
        {/* Container chính  */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 md:gap-16 w-full">
          <div className="text-center md:text-left md:w-1/2 flex flex-col justify-center py-8 md:py-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-gray-900 leading-tight">
              Hồi sinh ký ức gia đình
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mt-3 max-w-lg mx-auto md:mx-0">
              Khôi phục ảnh cũ, hư hại bằng AI — để lưu truyền di sản cho thế hệ
              mai sau.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-emerald-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-emerald-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V14a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-emerald-700">
                Công nghệ AI khôi phục ảnh
              </span>
            </div>
          </div>

          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div
              className="relative w-full border-2 border-dashed border-teal-400 rounded-2xl p-6 md:p-8 bg-white/80 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-2xl hover:border-teal-500"
              style={{ minHeight: "320px" }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onPaste={handlePaste}
            >
              {!uploadedImage && !isProcessing && (
                <>
                  {/* Toggle button for input method */}
                  <div className="mb-4 flex gap-2">
                    <button
                      onClick={() => { setShowUrlInput(false); setRestoreMethod('file'); }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${!showUrlInput
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      📤 Upload File
                    </button>
                    <button
                      onClick={() => { setShowUrlInput(true); setRestoreMethod('url'); }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${showUrlInput
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      🔗 Nhập URL
                    </button>
                  </div>

                  {!showUrlInput ? (
                    <>
                      <button
                        onClick={handleUploadClick}
                        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all transform hover:scale-105"
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
                      <p className="text-sm text-gray-600 mt-4 select-none">
                        Hoặc nhấn{" "}
                        <kbd className="px-2 py-1 bg-teal-100 rounded text-xs font-mono">
                          Ctrl + V
                        </kbd>
                        {" "}hoặc kéo thả ảnh tổ tiên vào đây
                      </p>
                    </>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Nhập URL ảnh (Direct link)
                        </label>
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full px-4 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <button
                        onClick={handleUrlSubmit}
                        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all transform hover:scale-105"
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
                  )}
                </>
              )}

              {/* Processing State */}
              {isProcessing && (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <svg
                    className="animate-spin h-12 w-12 text-teal-600 mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-label="Đang khôi phục..."
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="text-lg font-medium text-gray-800 mb-2">
                    Đang khôi phục ảnh bằng AI...
                  </p>
                  <p className="text-sm text-gray-600">
                    Quá trình này có thể mất vài phút. Vui lòng đợi...
                  </p>
                </div>
              )}

              {/* Display uploaded or processed image */}
              {(uploadedImage || processedImage) && !isProcessing && (
                <div className="w-full">
                  {/* Show both images side by side when processed */}
                  {processedImage ? (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 text-center">
                        Kết quả phục hồi
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Original Image */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-gray-700 text-center">
                            Ảnh gốc
                          </h3>
                          <div className="w-full h-48 md:h-56 bg-white rounded-xl shadow-md border-2 border-gray-200 overflow-hidden">
                            <img
                              src={uploadedImage}
                              alt="Ảnh gốc"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        {/* Restored Image */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-emerald-700 text-center">
                            ✨ Ảnh đã phục hồi
                          </h3>
                          <div className="w-full h-48 md:h-56 bg-white rounded-xl shadow-md border-2 border-emerald-200 overflow-hidden">
                            <img
                              src={processedImage}
                              alt="Ảnh đã khôi phục"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Show only uploaded image
                    <>
                      <h2 className="text-xl font-bold mb-4 text-gray-900">
                        Ảnh đã tải lên
                      </h2>
                      <div className="w-full h-64 md:h-72 bg-white rounded-xl shadow-md border-2 border-teal-200 overflow-hidden">
                        <img
                          src={uploadedImage}
                          alt="Ảnh đã tải lên"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </>
                  )}

                  {/* Process button */}
                  {uploadedImage && !processedImage && (
                    <button
                      onClick={processImage}
                      disabled={isProcessing}
                      className="mt-4 md:mt-6 w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-full shadow-lg hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      aria-label="Khôi phục bằng AI"
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
                      🤖 Khôi phục bằng AI
                    </button>
                  )}

                  {processedImage && (
                    <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={resetImages}
                        className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-full shadow-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all transform hover:scale-105"
                        aria-label="Khôi phục ảnh khác"
                      >
                        Khôi phục ảnh khác
                      </button>
                      <button
                        onClick={handleAttachToTree}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all transform hover:scale-105"
                        aria-label="Gắn vào cây gia phả"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </svg>
                        Gắn vào cây gia phả
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between shadow-md max-w-2xl w-full">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <p className="text-sm text-gray-700">
              Ảnh mờ, nát, phai màu? Đừng để ký ức gia đình mai một.
              <br />
              <strong className="text-gray-900">
                AI sẽ hồi sinh chúng — như mới.
              </strong>
            </p>
          </div>
          <Link
            to="/family-tree-demo"
            className="text-teal-600 font-bold flex items-center hover:underline"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Xem cây gia phả
          </Link>
        </div>
      </div>
    </>
  );
};

export default SnapshotEditor;
