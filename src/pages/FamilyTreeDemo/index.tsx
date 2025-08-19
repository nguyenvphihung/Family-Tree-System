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
    <div className="fixed inset-0 w-screen h-screen bg-gray-50 overflow-hidden">
      {/* Top Header Bar - Dark Gray */}
      <div className="text-white px-6 py-2 border-b border-gray-700 shadow-sm" style={{ backgroundColor: '#595959' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-xs text-gray-300 font-medium">Family Tree System</span>
          </div>

          <div className="flex space-x-3">
            <button className="p-2 text-gray-200 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-gray-200 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="p-2 text-gray-200 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-800 font-bold text-sm">FT</span>
            </div>
            <span className="text-base font-bold text-white">Family Tree</span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-rose-200 hover:bg-rose-300 text-rose-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm">
              Go Premium
            </button>
            <button className="p-2 text-gray-200 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200">
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
          <a href="#" className="text-rose-700 font-bold border-b-2 border-rose-500 pb-1 px-2">Family tree</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">Discoveries</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">Photos</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">DNA</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">Research</a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex w-full h-full">
        {/* Left Sidebar - Modern */}
        <div className="w-56 bg-white border-r border-gray-200 p-3 shadow-lg flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
          {/* Personal Info Section */}
          <div className="mb-2">
            <div className="flex flex-col items-center py-2">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-300">
                {/* Avatar user đẹp và icon máy ảnh hiện đại */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Avatar user nét mảnh, cân đối */}
                  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="#B0B7C3" strokeWidth="2" fill="#fff" />
                    <circle cx="32" cy="26" r="10" stroke="#B0B7C3" strokeWidth="1.5" fill="#F5F6F7" />
                    <path d="M16 50c0-6.5 8-12 16-12s16 5.5 16 12" stroke="#B0B7C3" strokeWidth="1.5" fill="#F5F6F7" />
                  </svg>
                  {/* Icon máy ảnh hiện đại nằm ngoài viền avatar - removed padding */}
                  <button
                    style={{ position: 'absolute', bottom: '-4px', right: '-4px', zIndex: 10 }}
                    className="w-9 h-9 bg-white rounded-full border border-gray-300 flex items-center justify-center shadow hover:bg-gray-100 transition"
                    title="Add photo">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 7C4 6.44772 4.44772 6 5 6H19C19.5523 6 20 6.44772 20 7V17C20 17.5523 19.5523 18 19 18H5C4.44772 18 4 17.5523 4 17V7Z" stroke="#6B7280" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="1.5" />
                      <path d="M15 9H17" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2 text-center">
                <div className="font-bold text-gray-900 text-base leading-tight">phuc Vo</div>
                <div className="text-xs text-gray-500">This is you</div>
                <div className="text-xs text-gray-700 mt-1">★ 2003 (age ~22)</div>
                <button className="text-xs text-rose-700 font-semibold mt-1 hover:underline">Research this person »</button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 mb-2">
                <button className="flex flex-col items-center text-gray-700 hover:text-rose-700">
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
                    </svg>
                  </span>
                  <span className="text-xs">Profile</span>
                </button>
                <button className="flex flex-col items-center text-gray-700 hover:text-rose-700">
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </span>
                  <span className="text-xs">Edit</span>
                </button>
                <button className="flex flex-col items-center text-gray-700 hover:text-rose-700">
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                  <span className="text-xs">Add</span>
                </button>
                <button className="flex flex-col items-center text-gray-700 hover:text-rose-700">
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                    </svg>
                  </span>
                  <span className="text-xs">More</span>
                </button>
              </div>
            </div>
          </div>
          {/* Sections */}
          <div className="space-y-2 flex-1 overflow-auto pb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-gray-900 text-xs">DISCOVERIES</h4>
                <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">1</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-gray-600">
                <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">One consistency issue</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-xs">PHOTOS & VIDEOS</h4>
              <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">+ Add</button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-xs">BIOGRAPHY</h4>
              <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">+ Add</button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-gray-900 text-xs">IMMEDIATE FAMILY</h4>
                <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">+ Add</button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-gray-900 text-xs">FACTS</h4>
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">+ Add</button>
              </div>
              <div className="text-[11px] text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">1939 Birth</span>
                  <span className="text-gray-400">1939</span>
                </div>
              </div>
            </div>
          </div>

          {/* DNA Test Button */}
          <div className="mt-auto flex flex-col items-center gap-4 pb-8">
            <button className="px-4 py-2 bg-white border border-rose-300 rounded-full text-rose-700 hover:bg-rose-50 transition-colors">
              Order DNA test
            </button>
            <div className="flex flex-col items-center">
              <button className="w-10 h-10 bg-white border border-gray-300 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-700 shadow-sm transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110 4 2 2 0 010-4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              <span className="mt-1 text-[10px] text-gray-600">More</span>
            </div>
          </div>
        </div>

        {/* Main content phải */}
        <div className="flex-1 bg-white p-6" style={{ height: 'calc(100vh - 120px)', overflow: 'hidden' }}>
          {/* Tree Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-6 py-3 rounded-xl font-bold flex items-center space-x-3 shadow-sm transition-all duration-200">
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

            <div className="flex items-center gap-4">
              <select className="border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:border-rose-400 focus:outline-none transition-colors duration-200">
                <option>Generations: 5+</option>
              </select>
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Find a person..."
                  className="w-48 border-2 border-gray-300 rounded-xl pl-4 pr-12 py-3 text-sm font-medium focus:border-rose-400 focus:outline-none transition-colors duration-200"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Family Tree Visualization */}
          <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg w-full h-[calc(100vh-150px)] flex items-center justify-center" style={{ background: '#e5e7eb' }}>
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
              className="w-12 h-12 bg-white border-2 border-white hover:bg-gray-100 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
              title="Center on person"
            >
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleZoomFit}
              className="w-12 h-12 bg-white border-2 border-white hover:bg-gray-100 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
              title="Fit to view"
            >
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l-2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleZoomReset}
              className="w-12 h-12 bg-white border-2 border-white hover:bg-gray-100 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
              title="Reset zoom"
            >
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-.707.707-.707-.707a1 1 0 00-1.414 1.414L7.586 4H4a1 1 0 000 2h3.586l-.293.293a1 1 0 101.414 1.414L10 7.414l.293.293a1 1 0 001.414-1.414L12.414 6H16a1 1 0 000-2h-3.586l.293-.293a1 1 0 000-1.414z" />
              </svg>
            </button>
            <button
              onClick={handleZoomIn}
              className="w-12 h-12 bg-white border-2 border-white hover:bg-gray-100 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
              title="Zoom in"
            >
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              className="w-12 h-12 bg-white border-2 border-white hover:bg-gray-100 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
              title="Zoom out"
            >
              <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeDemo;