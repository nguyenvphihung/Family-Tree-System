import React, { useCallback, useRef, useState } from 'react';

interface ImageComparisonProps {
  uploadedImage: string | null;
  processedImage: string | null;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({ uploadedImage, processedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const dragAreaRef = useRef<HTMLDivElement>(null);

  const handleSliderMouseDown = useCallback((e: React.MouseEvent) => {
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const container = dragAreaRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const newPosition = ((moveEvent.clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, newPosition)));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  if (!processedImage) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="animate-scale-up bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-green-600 animate-bounce"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800">
              ✨ Phục hồi thành công!
            </h3>
            <p className="text-xs text-green-700 mt-1">
              Ảnh của bạn đã được xử lý bằng AI. Bây giờ bạn có thể lưu hoặc chia sẻ nó.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 text-center">
        So sánh kết quả phục hồi
      </h2>

      {/* Interactive Slider Comparison */}
      <div
        className="relative w-full h-56 md:h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg image-container"
        ref={dragAreaRef}
      >
        {/* Original Image */}
        <img
          src={uploadedImage || ''}
          alt="Ảnh gốc"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Restored Image with Slider */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={processedImage}
            alt="Ảnh đã khôi phục"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize shadow-lg slider-handle hover:w-2 transition-all"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleSliderMouseDown}
          onTouchStart={handleSliderMouseDown as any}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-emerald-50 transition-colors">
            <svg
              className="w-4 h-4 text-gray-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          Ảnh gốc
        </div>
        <div className="absolute top-4 right-4 bg-emerald-500/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          ✨ Đã phục hồi
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center py-4 animate-fade-in">
        <p className="text-sm text-gray-600">
          Kéo thanh trượt ở giữa để so sánh ảnh gốc và ảnh đã phục hồi
        </p>
      </div>
    </div>
  );
};

export default ImageComparison;