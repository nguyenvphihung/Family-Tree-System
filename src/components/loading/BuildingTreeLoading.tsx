import React from "react";

const BuildingTreeLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="ml-2 text-xl font-semibold text-gray-900">FamilyTree</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center">
        {/* Document Icon */}
        <div className="mb-6">
          <div className="w-24 h-32 bg-white border-2 border-orange-200 rounded-lg mx-auto relative shadow-lg">
            <div className="absolute inset-2 bg-gray-50 rounded">
              {/* Lines representing text */}
              <div className="space-y-1 p-3">
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                <div className="h-2 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                <div className="h-2 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                <div className="h-2 bg-gray-300 rounded w-full"></div>
                <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                <div className="h-2 bg-gray-300 rounded w-4/5"></div>
              </div>
            </div>
            {/* Loading indicator in bottom right */}
            <div className="absolute bottom-2 right-2 w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Building your family tree
        </h1>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-orange-100 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full animate-pulse" style={{ width: '15%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BuildingTreeLoading; 