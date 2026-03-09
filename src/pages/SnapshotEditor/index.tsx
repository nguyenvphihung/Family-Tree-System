import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import restoreImageService from "@/services/restoreImageService";
import { useToast } from "@/components/ui/use-toast";
import { IMAGE_VALIDATION_TIMEOUT, MAX_FILE_SIZE, ROUTES, STORAGE_KEYS, RestoreMethod } from "./constants";
import { isValidUrlFormat, validateImageUrl, formatFileSize, revokeBlobUrl, validateFile, getErrorMessage } from "./helpers";
import UploadZone from "./UploadZone";
import ProgressBar from "./ProgressBar";
import ImageComparison from "./ImageComparison";

// ============ COMPONENT ============
const SnapshotEditor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [restoreMethod, setRestoreMethod] = useState<RestoreMethod>(RestoreMethod.FILE);
  const [processingProgress, setProcessingProgress] = useState(0);

  const dragAreaRef = useRef<HTMLDivElement>(null);

  // ✅ Cleanup blob URLs when images change
  useEffect(() => {
    return () => {
      revokeBlobUrl(uploadedImage);
    };
  }, [uploadedImage]);

  useEffect(() => {
    return () => {
      revokeBlobUrl(processedImage);
    };
  }, [processedImage]);

  // ✅ Simulate processing progress
  useEffect(() => {
    if (!isProcessing) {
      setProcessingProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 20;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isProcessing]);

  // ============ EVENT HANDLERS ============

  const handleFileSelected = useCallback((file: File) => {
    const validation = validateFile(file, MAX_FILE_SIZE);

    if (!validation.valid) {
      toast({
        title: "Lỗi",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setUploadedImage(URL.createObjectURL(file));
    setUploadedFile(file);
    setRestoreMethod(RestoreMethod.FILE);
    setShowUrlInput(false);
  }, [toast]);

  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          handleFileSelected(file);
          event.preventDefault();
        }
        break;
      }
    }
  }, [handleFileSelected]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (dragAreaRef.current) {
      dragAreaRef.current.style.borderColor = '#14b8a6'; // teal-600
      dragAreaRef.current.style.backgroundColor = 'rgba(20, 184, 166, 0.05)';
    }
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    if (dragAreaRef.current) {
      dragAreaRef.current.style.borderColor = '#2dd4bf'; // teal-400
      dragAreaRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (dragAreaRef.current) {
      dragAreaRef.current.style.borderColor = '#2dd4bf'; // teal-400
      dragAreaRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileSelected(file);
    }
  }, [handleFileSelected]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    handleFileSelected(file);
  }, [handleFileSelected]);

  const handleUrlSubmit = useCallback(async () => {
    const trimmedUrl = imageUrl.trim();

    console.log('[handleUrlSubmit] Starting with URL:', trimmedUrl);

    if (!trimmedUrl) {
      console.log('[handleUrlSubmit] URL is empty');
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL ảnh",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrlFormat(trimmedUrl)) {
      console.log('[handleUrlSubmit] Invalid URL format');
      toast({
        title: "Lỗi",
        description: "URL không hợp lệ. Đảm bảo URL bắt đầu bằng http:// hoặc https://",
        variant: "destructive",
      });
      return;
    }

    console.log('[handleUrlSubmit] Setting URL without validation');
    setUploadedImage(trimmedUrl);
    setRestoreMethod(RestoreMethod.URL);
    setUploadedFile(null);
    setImageUrl(trimmedUrl); // Ensure imageUrl is set
    console.log('[handleUrlSubmit] State updated successfully');
  }, [imageUrl, toast]);

  const processImage = useCallback(async () => {
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
    setProcessingProgress(0);

    try {
      let result;

      if (restoreMethod === RestoreMethod.FILE && uploadedFile) {
        toast({
          title: "Đang xử lý...",
          description: "Đang upload và phục hồi ảnh bằng AI...",
        });
        result = await restoreImageService.restoreByFile(uploadedFile);
      } else if (restoreMethod === RestoreMethod.URL && imageUrl) {
        toast({
          title: "Đang xử lý...",
          description: "Đang tải và phục hồi ảnh từ URL...",
        });
        result = await restoreImageService.restoreByUrl(imageUrl);
      } else {
        throw new Error("Không có dữ liệu để xử lý");
      }

      if (result.success && result.restored_url) {
        if (result.original_url) {
          revokeBlobUrl(uploadedImage);
          setUploadedImage(result.original_url);
        }

        setProcessedImage(result.restored_url);
        setProcessingProgress(100);

        toast({
          title: "✅ Phục hồi thành công!",
          description: `Đã phát hiện ${result.faces_detected || 0} khuôn mặt. Độ phóng đại: ${(result.upscale_factor || 1).toFixed(2)}x`,
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

      const errorMessage = getErrorMessage(error, "Không thể phục hồi ảnh. Vui lòng thử lại.");

      toast({
        title: "❌ Lỗi phục hồi ảnh",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [uploadedImage, uploadedFile, imageUrl, restoreMethod, toast]);

  const resetImages = useCallback(() => {
    revokeBlobUrl(uploadedImage);
    revokeBlobUrl(processedImage);
    setUploadedImage(null);
    setProcessedImage(null);
    setUploadedFile(null);
    setImageUrl("");
    setShowUrlInput(false);
    setRestoreMethod(RestoreMethod.FILE);
  }, [uploadedImage, processedImage]);

  const handleAttachToTree = useCallback(() => {
    if (processedImage) {
      localStorage.setItem(STORAGE_KEYS.RESTORED_IMAGE, processedImage);
      navigate(ROUTES.FAMILY_TREE);
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng xử lý ảnh trước khi thêm vào cây gia phả!",
        variant: "destructive",
      });
    }
  }, [processedImage, navigate, toast]);

  // ============ RENDER ============
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

          /* ✅ Animations */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleUp {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes slideInRight {
            from {
              transform: translateX(20px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes gradientFlow {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          @keyframes shimmer {
            0%, 100% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
          }

          .animate-scale-up {
            animation: scaleUp 0.3s ease-out;
          }

          .animate-slide-in {
            animation: slideInRight 0.4s ease-out;
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientFlow 3s ease infinite;
          }

          .animate-shimmer {
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }

          /* ✅ Smooth transitions */
          .btn-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .btn-hover:hover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }

          /* ✅ Progress bar animation */
          @keyframes progressFill {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }

          .progress-fill {
            animation: progressFill 0.4s ease-out;
          }

          /* ✅ Image container hover effect */
          .image-container {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .image-container:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          }

          /* ✅ Slider styles */
          .slider-handle {
            cursor: col-resize;
            transition: width 0.2s ease;
          }

          .slider-handle:hover {
            width: 3px;
          }

          /* ✅ Responsive design */
          @media (max-width: 640px) {
            .upload-zone {
              padding: 1rem;
              min-height: 250px;
            }

            .text-3xl {
              font-size: 1.875rem;
            }

            .grid-cols-1 {
              grid-template-columns: 1fr;
            }
          }

          /* ✅ Dark mode support (optional) */
          @media (prefers-color-scheme: dark) {
            .dark-mode {
              background-color: #1f2937;
              color: #f3f4f6;
            }
          }
        `}
      </style>

      <div className="font-sans bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 min-h-screen p-4 sm:p-6 md:p-8 pt-24 md:pt-28 flex flex-col items-center">
        {/* Main Container */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 md:gap-16 w-full">
          {/* Left Section - Title & Description */}
          <div className="text-center md:text-left md:w-1/2 flex flex-col justify-center py-8 md:py-16 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-gray-900 leading-tight">
              Ứng dụng AI để phục hồi ảnh cũ, hư hại và lưu trữ ký ức gia đình
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mt-3 max-w-lg mx-auto md:mx-0">
              Khôi phục ảnh cũ, hư hại bằng AI — để lưu truyền di sản cho thế hệ mai sau.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-emerald-200 hover:shadow-lg transition-all duration-300">
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

          {/* Right Section - Upload Area */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0 animate-slide-in">
            <div
              ref={dragAreaRef}
              className="relative w-full border-2 border-dashed border-teal-400 rounded-2xl p-6 md:p-8 bg-white/80 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-2xl hover:border-teal-500"
              style={{ minHeight: "320px" }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onPaste={handlePaste}
              tabIndex={0}
              role="button"
              aria-label="Drop zone - paste or drag images here"
            >
             <UploadZone
               showUrlInput={showUrlInput}
               setShowUrlInput={setShowUrlInput}
               restoreMethod={restoreMethod}
               setRestoreMethod={setRestoreMethod}
               imageUrl={imageUrl}
               setImageUrl={setImageUrl}
               handleFileSelected={handleFileSelected}
               handleUrlSubmit={handleUrlSubmit}
               uploadedFile={uploadedFile}
               resetImages={resetImages}
               onPaste={handlePaste}
             />

              {/* Processing State with Progress Bar */}
              {isProcessing && (
                <div className="w-full flex flex-col items-center justify-center p-6 text-center animate-scale-up">
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
                  <p className="text-sm text-gray-600 mb-4">
                    Quá trình này có thể mất vài phút. Vui lòng đợi...
                  </p>

                  <ProgressBar processingProgress={processingProgress} />
                </div>
              )}

              {/* Display Images Section */}
              {(uploadedImage || processedImage) && !isProcessing && (
                <div className="w-full">
                  {/* ✅ Image Comparison with Slider */}
                  {processedImage ? (
                    <ImageComparison uploadedImage={uploadedImage} processedImage={processedImage} />
                  ) : (
                    /* Only uploaded image */
                    <div className="animate-fade-in">
                      <h2 className="text-xl font-bold mb-4 text-gray-900">
                        Ảnh đã tải lên
                      </h2>
                      <div className="w-full h-64 md:h-72 bg-white rounded-xl shadow-md border-2 border-teal-200 overflow-hidden image-container">
                        <img
                          src={uploadedImage || ''}
                          alt="Ảnh đã tải lên"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>  
                  )}

                  {/* Action Buttons */}
                  {uploadedImage && !processedImage && (
                    <button
                      onClick={processImage}
                      disabled={isProcessing}
                      className="mt-4 md:mt-6 w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-full shadow-lg hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none btn-hover animate-fade-in"
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
                    <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-4 justify-center animate-slide-in">
                      <button
                        onClick={resetImages}
                        className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-full shadow-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all transform hover:scale-105 btn-hover"
                        aria-label="Khôi phục ảnh khác"
                      >
                        🔄 Khôi phục ảnh khác
                      </button>
                      <button
                        onClick={handleAttachToTree}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all transform hover:scale-105 btn-hover"
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
        <div className="mt-12 bg-white/80 backdrop-blur-sm border border-teal-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between shadow-md max-w-2xl w-full animate-fade-in hover:shadow-lg transition-all duration-300">
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
            to={ROUTES.FAMILY_TREE}
            className="text-teal-600 font-bold flex items-center hover:underline btn-hover"
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