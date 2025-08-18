import React, { useState } from 'react';
import { D3FamilyTreeView } from '../../components/family-tree';

const FamilyTreeDemo: React.FC = () => {
  const treeId = 'ea9a8a77-4cf0-4acc-a6f1-e2939e7cfb22';
  const personId = '3a7bc596-afe5-4090-99ac-a2e09c8873eb';
  const [zoomLevel, setZoomLevel] = useState(1);



  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.3));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  const handleZoomFit = () => {
    setZoomLevel(0.8);
  };

  const handleZoomCenter = () => {
    setZoomLevel(1);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Top Header Bar - Modern Dark */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-sm text-gray-300 font-medium">Family Tree System</span>
          </div>
          <div className="flex space-x-3">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Family Tree</span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
              Go Premium
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-sm font-medium">p vo</span>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-sm font-medium">Help</span>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-sm font-medium">English</span>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110 4 2 2 0 010-4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Modern */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">Home</a>
          <a href="#" className="text-orange-600 font-bold border-b-2 border-orange-600 pb-1 px-2">Family tree</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">Discoveries</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">Photos</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">DNA</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">Research</a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-full w-full">
        {/* Left Sidebar - Modern */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 shadow-lg" style={{ height: '100vh', overflow: 'hidden' }}>
          {/* User Profile Section */}
          <div className="mb-8">
            <h2 className="text-sm text-gray-500 mb-4 font-medium">vo Family Tree | p vo</h2>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 shadow-md">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L13 7.414l-2.828 2.828-1.414-1.414 2.828-2.828z" />
                  </svg>
                </button>
              </div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">p vo</h3>
              <p className="text-sm text-gray-600 mb-2">This is you</p>
              <p className="text-sm text-gray-500 mb-4">* 1939 (age~86)</p>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">Research this person &gt;</a>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3 mt-6">
              <button className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L13 7.414l-2.828 2.828-1.414-1.414 2.828-2.828z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110 4 2 2 0 010-4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900">DISCOVERIES</h4>
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">1</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-orange-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">One consistency issue</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900">PHOTOS & VIDEOS</h4>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105">+ Add</button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900">BIOGRAPHY</h4>
                <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105">+ Add</button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900">IMMEDIATE FAMILY</h4>
                <div className="flex items-center space-x-2">
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105">+ Add</button>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900">FACTS</h4>
                <div className="flex items-center space-x-2">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg transform hover:scale-105">+ Add</button>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">1939 Birth</span>
                  <span className="text-gray-400">1939</span>
                </div>
              </div>
            </div>
          </div>

          {/* DNA Test Button */}
          <button className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            Order DNA test
          </button>
        </div>

        {/* Right Main Content Area - Modern */}
        <div className="flex-1 bg-white p-6" style={{ height: '100vh', overflow: 'hidden' }}>
          {/* Tree Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>Family view</span>
              </button>
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex-1"></div>
            <div style={{ position: 'absolute', top: 170, right: 100, zIndex: 50, display: 'flex', gap: '16px', alignItems: 'center' }}>
              <select className="border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:border-blue-500 focus:outline-none transition-colors duration-200">
                <option>Generations: 5+</option>
              </select>
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Find a person..."
                  className="w-48 border-2 border-gray-300 rounded-xl pl-4 pr-12 py-3 text-sm font-medium focus:border-blue-500 focus:outline-none transition-colors duration-200"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106.886-.54 2.042.061 2.287.947.379 1.561 2.6 1.561 2.978a1.532 1.532 0 01-2.287.947c1.372.836 2.942-.734 2.106-2.106-.54-.886-.061-2.042.947-2.287 1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-2.287-.947c.836-1.372-.734-2.942-2.106-2.106-.886.54-2.042-.061-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Removed Tree Info Display as requested */}

          {/* Family Tree Visualization */}
          <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg w-full h-[calc(100vh-200px)] flex items-center justify-center" style={{ background: '#e5e7eb', marginTop: '-80px', alignItems: 'flex-start' }}>
            <D3FamilyTreeView
              treeId={treeId}
              personId={personId}
              zoomLevel={zoomLevel}
              onRefresh={() => { }}
            />
          </div>

          {/* Zoom Controls - Bottom Right */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
            <button
              onClick={handleZoomCenter}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-2 border-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              title="Center on person"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleZoomFit}
              className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-2 border-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              title="Fit to view"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleZoomReset}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-2 border-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              title="Reset zoom"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-.707.707-.707-.707a1 1 0 00-1.414 1.414L7.586 4H4a1 1 0 000 2h3.586l-.293.293a1 1 0 101.414 1.414L10 7.414l.293.293a1 1 0 001.414-1.414L12.414 6H16a1 1 0 000-2h-3.586l.293-.293a1 1 0 000-1.414z" />
              </svg>
            </button>
            <button
              onClick={handleZoomIn}
              className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-2 border-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              title="Zoom in"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200 transform hover:scale-110"
              title="Zoom out"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Zoom Level Display */}
          <div className="fixed bottom-6 left-6 bg-white border-2 border-gray-200 rounded-xl px-4 py-2 shadow-lg">
            <span className="text-sm font-bold text-gray-700">Zoom: {Math.round(zoomLevel * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeDemo;
