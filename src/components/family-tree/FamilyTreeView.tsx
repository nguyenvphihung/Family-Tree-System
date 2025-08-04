import React, { useState } from "react";

const FamilyTreeView: React.FC = () => {
  const [treeData] = useState({
    currentPerson: {
      name: "Xuân phúc Võ",
      birthYear: "2003",
      status: "Alive",
      isCurrent: true,
    },
    parents: {
      father: null,
      mother: null,
    },
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  //Zoom by mouse
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel(prev => Math.max(0.3, Math.min(3, prev * delta)));
  };

  const renderPersonNode = (person: any, x: number, y: number) => {
    return (
      <g key={`person-${x}-${y}`}>
        <rect
          x={x - 140}
          y={y - 60}
          width="280"
          height="120"
          rx="18"
          fill="#f0fdf4"
          stroke="#10b981"
          strokeWidth="2"
          className="shadow-lg transition-all duration-300 hover:shadow-xl"
        />

        {/* Inner border */}
        <rect
          x={x - 135}
          y={y - 55}
          width="270"
          height="110"
          rx="16"
          fill="none"
          stroke="#a7f3d0"
          strokeWidth="1.5"
        />

        {/* Avatar circle */}
        <circle
          cx={x - 90}
          cy={y - 15}
          r="35"
          fill="#e5e7eb"
          stroke="#9ca3af"
          strokeWidth="2"
        />

        {/* Profile icon */}
        <text
          x={x - 90}
          y={y - 5}
          textAnchor="middle"
          fontSize="40"
          fill="#4b5563"
          fontWeight="600"
        >
          👤
        </text>

        {/* Camera icon */}
        <circle
          cx={x - 70}
          cy={y - 40}
          r="20"
          fill="#10b981"
          stroke="white"
          strokeWidth="2"
          className="cursor-pointer hover:scale-110 transition-transform duration-200"
        />
        <text x={x - 70} y={y - 30} textAnchor="middle" fontSize="22" fill="white">
          📷
        </text>

        {/* Name */}
        <text
          x={x + 20}
          y={y - 15}
          textAnchor="middle"
          fontSize="22"
          fill="#1f2937"
          fontWeight="600"
          className="font-inter"
        >
          {person.name}
        </text>

        {/* Birth year and status */}
        <text
          x={x + 20}
          y={y + 15}
          textAnchor="middle"
          fontSize="16"
          fill="#6b7280"
          className="font-inter"
        >
          {person.birthYear} – {person.status}
     
        </text>

        {/* Edit button */}
        <circle
          cx={x + 105}
          cy={y - 40}
          r="20"
          fill="#9ca3af"
          stroke="white"
          strokeWidth="2"
          className="cursor-pointer hover:scale-110 transition-transform duration-200"
        />
        <text
          x={x + 105}
          y={y - 30}
          textAnchor="middle"
          fontSize="22"
          fill="white"
          fontWeight="600"
        >
          ✏️
        </text>

        {/* Add child button - redesigned */}
        <circle
          cx={x}
          cy={y + 65}
          r="25"
          fill="#ffffff"
          stroke="#10b981"
          strokeWidth="3"
          className="cursor-pointer hover:fill-green-50 transition-colors duration-200"
        />
        <text
          x={x}
          y={y + 72}
          textAnchor="middle"
          fontSize="32"
          fill="#10b981"
          fontWeight="700"
          className="font-inter"
        >
          +
        </text>
      </g>
    );
  };

  const renderParentPlaceholder = (type: "father" | "mother", x: number, y: number) => {
    const label = type === "father" ? "Add father" : "Add mother";
    
    return (
      <g key={`parent-${type}-${x}-${y}`}>
        {/* Placeholder card */}
        <rect
          x={x - 110}
          y={y - 50}
          width="220"
          height="100"
          rx="14"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="6,6"
          className="shadow-md transition-all duration-300 hover:shadow-lg"
        />

        {/* Inner border */}
        <rect
          x={x - 105}
          y={y - 45}
          width="210"
          height="90"
          rx="12"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1.5"
        />

        {/* Add icon - redesigned */}
        <circle
          cx={x}
          cy={y}
          r="28"
          fill="#ffffff"
          stroke="#10b981"
          strokeWidth="3"
          className="cursor-pointer hover:fill-green-50 transition-colors duration-200"
        />
        <text
          x={x}
          y={y + 8}
          textAnchor="middle"
          fontSize="36"
          fill="#10b981"
          fontWeight="700"
          className="font-inter"
        >
          +
        </text>

        {/* Label */}
        <text
          x={x}
          y={y + 50}
          textAnchor="middle"
          fontSize="16"
          fill="#6b7280"
          fontWeight="500"
          className="font-inter"
        >
          {label}
        </text>
      </g>
    );
  };

  const renderConnectionLines = (centerX: number, centerY: number) => {
    const childY = centerY + 100; // Child node position
    const parentY = centerY - 100; // Parent nodes position
    const fatherX = centerX - 200; // Father node position
    const motherX = centerX + 200; // Mother node position

    return (
      <g>
        {/* Vertical line from child to connection point */}
        <line
          x1={centerX}
          y1={childY - 60}
          x2={centerX}
          y2={parentY + 50}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
        />

        {/* Horizontal connection line */}
        <line
          x1={fatherX}
          y1={parentY + 50}
          x2={motherX}
          y2={parentY + 50}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
        />

        {/* Line to father */}
        <line
          x1={fatherX}
          y1={parentY + 50}
          x2={fatherX}
          y2={parentY + 50}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
        />

        {/* Line to mother */}
        <line
          x1={motherX}
          y1={parentY + 50}
          x2={motherX}
          y2={parentY + 50}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
        />
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Main Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  F
                </div>
                <span className="ml-3 text-2xl font-semibold text-gray-900">FamilyTree</span>
              </div>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Home</a>
                <a href="#" className="text-green-600 border-b-2 border-green-600 pb-1">Family Tree</a>
                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">DNA</a>
                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Research</a>
                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Photos</a>
                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Discoveries</a>
                <a href="#" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                  More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search family tree..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 w-64"
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center relative">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{treeData.currentPerson.name}</h3>
                  <p className="text-sm text-gray-600">This is you</p>
                  <p className="text-sm text-gray-500">b. {treeData.currentPerson.birthYear} ({treeData.currentPerson.status})</p>
                </div>
              </div>
              <a href="#" className="text-green-600 text-sm hover:underline">Research this person</a>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {[
                { icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", bg: "bg-green-100", hover: "hover:bg-green-200" },
                { icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", bg: "bg-green-100", hover: "hover:bg-green-200" },
                { icon: "M12 6v6m0 0v6m0-6h6m-6 0H6", bg: "bg-green-100", hover: "hover:bg-green-200" },
                { icon: "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z", bg: "bg-green-100", hover: "hover:bg-green-200" },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  className={`w-10 h-10 ${btn.bg} rounded-full flex items-center justify-center text-gray-600 ${btn.hover} transition-colors duration-200`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.icon} />
                  </svg>
                </button>
              ))}
            </div>

            {/* Information Sections */}
            <div className="space-y-4">
              {[
                {
                  title: "DISCOVERIES",
                  content: (
                    <div className="flex items-center text-orange-600 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      One consistency issue
                    </div>
                  ),
                },
                {
                  title: "PHOTOS & VIDEOS",
                  action: <button className="text-green-600 text-sm hover:underline">+ Add</button>,
                },
                {
                  title: "BIOGRAPHY",
                  action: <button className="text-green-600 text-sm hover:underline">+ Add</button>,
                },
                {
                  title: "IMMEDIATE FAMILY",
                  action: (
                    <div className="flex items-center space-x-2">
                      <button className="text-green-600 text-sm hover:underline">+ Add</button>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  ),
                },
                {
                  title: "FACTS",
                  action: (
                    <div className="flex items-center space-x-2">
                      <button className="text-green-600 text-sm hover:underline">+ Add</button>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  ),
                  content: <div className="text-sm text-gray-600">2003 Birth 2003</div>,
                },
              ].map((section, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{section.title}</h4>
                    {section.action}
                  </div>
                  {section.content}
                </div>
              ))}
            </div>

            {/* DNA Actions */}
            <div className="space-y-3">
              <button className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200">
                Order DNA Test
              </button>
              <button className="w-full bg-green-100 text-green-700 py-2.5 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors duration-200">
                Upload DNA Data
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Top Controls */}
          <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Vo Family Tree</h2>
                  <p className="text-sm text-gray-600">{treeData.currentPerson.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600">1 of 1 people</span>
                <button className="text-gray-600 hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
                  <option>Generations: 5+</option>
                </select>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200">
                  <option>Find a person...</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                {[
                  "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                  "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                ].map((path, idx) => (
                  <button
                    key={idx}
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Family Tree Canvas */}
          <div className="bg-gray-50 min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                title="Zoom In"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
              
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                title="Zoom Out"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
              
              <button
                onClick={handleResetZoom}
                className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                title="Reset Zoom"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>

            
            <div className="absolute top-4 left-4 z-10 bg-white border border-gray-300 rounded-lg shadow-md px-3 py-2">
              <span className="text-sm text-gray-600 font-medium">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>

            <div className="absolute bottom-4 left-4 z-10 bg-white border border-gray-300 rounded-lg shadow-md px-3 py-2">
              <span className="text-sm text-gray-600">
             
              </span>
            </div>

            <div
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <svg
                width="100%"
                height="100vh"
                viewBox="0 0 1200 800"
                className="family-tree-svg"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                {/* Connection lines */}
                {renderConnectionLines(600, 400)}

                {/* Parent placeholders */}
                {renderParentPlaceholder("father", 400, 300)}
                {renderParentPlaceholder("mother", 800, 300)}

                {/* Current person */}
                {renderPersonNode(treeData.currentPerson, 600, 500)}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Navigation Controls */}
        <div className="w-16 bg-white border-l border-gray-200 flex flex-col items-center py-4 space-y-4">
          {[
            "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
            "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
          ].map((path, idx) => (
            <button
              key={idx}
              className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
              </svg>
            </button>
          ))}
          <div className="flex flex-col space-y-2">
            {[
              "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
              "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            ].map((path, idx) => (
              <button
                key={idx}
                className="w-8 h-8 bg-green-100 rounded flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default FamilyTreeView;