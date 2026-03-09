import React from 'react';

interface ProgressBarProps {
  processingProgress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ processingProgress }) => {
  return (
    <div className="w-full max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">
          Tiến độ xử lý
        </span>
        <span className="text-xs text-gray-600">
          {Math.min(Math.round(processingProgress), 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500 h-full rounded-full progress-fill transition-all duration-300"
          style={{
            width: `${Math.min(processingProgress, 100)}%`
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;