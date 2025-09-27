import React, { useState, useEffect } from "react";
import { D3FamilyTreeView } from "../../components/family-tree";
import { FamilyMember } from "../../types/family";
import PersonInfoModal from "../../components/family-tree/PersonInfoModal";
import AddChildModal from "../../components/family-tree/AddChildModal";

const FamilyTreeDemo: React.FC = () => {
  const treeId = "0226ba13-99b2-4ffc-a24f-cdb1a775217f";
  const [zoomLevel, setZoomLevel] = useState(1);

  // State để lưu thông tin node được chọn
  const [selectedPerson, setSelectedPerson] = useState<FamilyMember | null>(null);

  // State cho modal xem thông tin và modal thêm thành viên
  const [showPersonInfoModal, setShowPersonInfoModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);

  // Auto center tree when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const svgElement = document.querySelector('.family-tree-svg') as any;
      if (svgElement && svgElement.centerTreeView) {
        svgElement.centerTreeView();
      }
    }, 1000); // Wait for tree to load

    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.3));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  const handleZoomFit = () => {
    setZoomLevel(0.5);
  };

  const handleZoomCenter = () => {
    setZoomLevel(1);
    // Center the tree view
    const svgElement = document.querySelector('.family-tree-svg') as any;
    if (svgElement && svgElement.centerTreeView) {
      svgElement.centerTreeView();
    }
  };

  // Function để xử lý khi click vào node
  const handleNodeClick = (person: FamilyMember) => {
    setSelectedPerson(person);
    console.log('Selected person:', person);
  };

  // Xử lý khi click nút Profile ở sidebar
  const handleProfileClick = () => {
    if (selectedPerson) setShowPersonInfoModal(true);
  };

  // Xử lý khi click nút Add ở sidebar
  const handleAddClick = () => {
    if (selectedPerson) setShowAddChildModal(true);
  };

  // Function để tính tuổi từ ngày sinh
  const calculateAge = (birthday?: string) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const today = new Date();
    let age = 0;
    age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate() && monthDiff > 1)) {
      age--;
    }
    return age;
  };

  // Function để format ngày sinh
  const formatBirthday = (birthday?: string) => {
    if (!birthday) return null;
    const date = new Date(birthday);
    return date.getFullYear();
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-50 overflow-hidden">
      {/* Top Header Bar - Dark Gray */}
      <div
        className="text-white px-6 py-2 border-b border-gray-700 shadow-sm"
        style={{ backgroundColor: "#595959" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-[10px] text-gray-300 font-medium">
              Family Tree System
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-800 font-bold text-sm">FT</span>
            </div>
            <span className="text-base font-bold text-white">Family Tree</span>
          </div>

          {/* Main Navigation Bar - Modern */}
          <div className="">
            <div className="flex items-center space-x-8">
              <a
                href="#"
                className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a href="#" className="text-rose-500 font-bold">
                Family tree
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Discoveries
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Photos
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
              >
                DNA
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Research
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-rose-200 hover:bg-rose-300 text-rose-800 mr-6 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm">
              Go Premium
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex w-full h-full">
        {/* Left Sidebar - Modern */}
        <div
          className="w-56 bg-white border-r border-gray-200 p-3 shadow-lg flex flex-col"
          style={{ height: "100%", overflow: "hidden" }}
        >
          {/* Personal Info Section - CẬP NHẬT */}
          <div className="mb-2">
            <div className="flex flex-col items-center py-2">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-300">
                {/* Avatar user đẹp và icon máy ảnh hiện đại */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Avatar user nét mảnh, cân đối */}
                  <svg
                    className="w-16 h-16"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      stroke={selectedPerson?.gender === 'M' ? "#5BD1D7" : selectedPerson?.gender === 'F' ? "#F59794" : "#B0B7C3"}
                      strokeWidth="2"
                      fill="#fff"
                    />
                    <circle
                      cx="32"
                      cy="26"
                      r="10"
                      stroke={selectedPerson?.gender === 'M' ? "#5BD1D7" : selectedPerson?.gender === 'F' ? "#F59794" : "#B0B7C3"}
                      strokeWidth="1.5"
                      fill="#F5F6F7"
                    />
                    <path
                      d="M16 50c0-6.5 8-12 16-12s16 5.5 16 12"
                      stroke={selectedPerson?.gender === 'M' ? "#5BD1D7" : selectedPerson?.gender === 'F' ? "#F59794" : "#B0B7C3"}
                      strokeWidth="1.5"
                      fill="#F5F6F7"
                    />
                  </svg>
                  {/* Icon máy ảnh hiện đại nằm ngoài viền avatar */}
                  <button
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      right: "-4px",
                      zIndex: 10,
                    }}
                    className="w-9 h-9 bg-white rounded-full border border-gray-300 flex items-center justify-center shadow hover:bg-gray-100 transition"
                    title="Add photo"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 7C4 6.44772 4.44772 6 5 6H19C19.5523 6 20 6.44772 20 7V17C20 17.5523 19.5523 18 19 18H5C4.44772 18 4 17.5523 4 17V7Z"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M15 9H17"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-2 text-center">
                {/* Hiển thị thông tin động từ selectedPerson */}
                <div className="font-bold text-gray-900 text-base leading-tight">
                  {selectedPerson?.name || "Chọn một người"}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedPerson ? (
                    "Family member"
                  ) : (
                    "Click vào thành viên để xem thông tin"
                  )}
                </div>
                <div className="text-xs text-gray-700 mt-1">
                  {selectedPerson?.birthday && (

                    <>
                      ★ {formatBirthday(selectedPerson.birthday)}
                      {calculateAge(selectedPerson.birthday) > 0 && (
                        <span> (age ~{calculateAge(selectedPerson.birthday)})</span>
                      )}
                    </>
                  )}
                </div>
                {selectedPerson?.gender && (
                  <div className="text-xs text-gray-600 mt-1">
                    {selectedPerson.gender === 'M' ? '♂ Nam' : selectedPerson.gender === 'F' ? '♀ Nữ' : 'Không rõ'}
                  </div>
                )}
                {selectedPerson?.birthPlace && (
                  <div className="text-xs text-gray-600 mt-1">
                    📍 {selectedPerson.birthPlace}
                  </div>
                )}
                {selectedPerson && (

                  <button className="text-xs text-rose-700 font-semibold mt-1 hover:underline">
                    Research this person »
                  </button>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 mb-2">
                {/* Nút Profile */}
                <button
                  className="flex flex-col items-center text-gray-700 hover:text-rose-700"
                  onClick={handleProfileClick}
                  disabled={!selectedPerson}
                >
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    {/* icon profile giữ nguyên */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span className="text-xs">Profile</span>
                </button>
                {/* Nút Edit giữ nguyên */}
                <button
                  className="flex flex-col items-center text-gray-700 hover:text-rose-700"
                >
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </span>
                  <span className="text-xs">Edit</span>
                </button>
                {/* Nút Add: icon dấu + */}
                <button
                  className="flex flex-col items-center text-gray-700 hover:text-rose-700"
                  onClick={handleAddClick}
                  disabled={!selectedPerson}
                >
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
                    </svg>
                  </span>
                  <span className="text-xs">Add</span>
                </button>
                {/* Nút More: icon dấu ba chấm */}
                <button className="flex flex-col items-center text-gray-700 hover:text-rose-700">
                  <span className="bg-gray-100 rounded-full p-2 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="19" cy="12" r="1.5" />
                    </svg>
                  </span>
                  <span className="text-xs">More</span>
                </button>
              </div>
            </div>
          </div>
          {/* Sections */}
          <div className="space-y-2 flex-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-gray-900 text-xs">DISCOVERIES</h4>
                <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  1
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-gray-600">
                <svg
                  className="w-3.5 h-3.5 text-rose-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">One consistency issue</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-xs">
                PHOTOS & VIDEOS
              </h4>
              <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">
                + Add
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-xs">BIOGRAPHY</h4>
              <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">
                + Add
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-gray-900 text-xs">
                  IMMEDIATE FAMILY
                </h4>
                <svg
                  className="w-3.5 h-3.5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">
                + Add
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-gray-900 text-xs">FACTS</h4>
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <button className="bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px]">
                  + Add
                </button>
              </div>
              <div className="text-[11px] text-gray-600">
                {selectedPerson?.birthday ? (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Birth</span>
                    <span className="text-gray-400">{formatBirthday(selectedPerson.birthday)}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">1939 Birth</span>
                    <span className="text-gray-400">1939</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DNA Test Button */}
          <div
            className="flex-1 justify-center mx-auto"
            style={{ marginTop: "8px", width: "fit-content" }}
          >
            <button className="px-4 py-2 w-full bg-white border border-rose-300 rounded-full text-rose-700 hover:bg-rose-50 transition-colors">
              Order DNA test
            </button>
          </div>
        </div>

        {/* Main content phải */}
        <div
          className="flex-1 bg-white p-1"
          style={{ height: "calc(100vh - 50px)", overflow: "hidden" }}
        >
          {/* Tree Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-all duration-200">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                  />
                </svg>
                <span>Family view</span>
              </button>
              <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
              </button>
              <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button className="w-10 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <select className="border-2 border-gray-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:border-rose-400 focus:outline-none transition-colors duration-200">
                <option>Generations 5+</option>
                <option>Generations 6+</option>
                <option>Generations 7+</option>
                <option>Generations +</option>
              </select>
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Find a person..."
                  className="w-40 border-2 border-gray-300 rounded-xl pl-3 pr-10 py-1.5 text-xs font-medium focus:border-rose-400 focus:outline-none transition-colors duration-200"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Family Tree Visualization */}
          <div
            className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg w-full h-full flex items-center justify-center"
            style={{ background: "#e5e7eb" }}
          >
            <D3FamilyTreeView
              treeId={treeId}
              personId={selectedPerson?.id || ""}
              zoomLevel={zoomLevel}
              onRefresh={() => { }}
              onNodeClick={handleNodeClick} // Truyền callback function
            />
          </div>

          {/* Zoom Controls - Bottom Right */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
            <button
              onClick={handleZoomCenter}
              className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 rounded-full shadow-sm flex items-center justify-center hover:shadow transition-all duration-200"
              title="Center Family Tree"
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
            </button>
            <button
              className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 rounded-full shadow-sm flex items-center justify-center hover:shadow transition-all duration-200"
              title="Toggle Full Screen"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </button>
            <button
              onClick={handleZoomReset}
              className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 rounded-full shadow-sm flex items-center justify-center hover:shadow transition-all duration-200"
              title="Reset View"
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 rounded-full shadow-sm flex items-center justify-center hover:shadow transition-all duration-200"
              title="Zoom In"
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 bg-white border border-gray-200 hover:bg-gray-100 rounded-full shadow-sm flex items-center justify-center hover:shadow transition-all duration-200"
              title="Zoom Out"
            >
              <svg
                className="w-4 h-4 text-gray-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal xem thông tin node */}
      <PersonInfoModal
        isOpen={showPersonInfoModal}
        onClose={() => setShowPersonInfoModal(false)}
        person={selectedPerson}
      />
      {/* Modal thêm thành viên */}
      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onSave={handleAddClick}
        parentName={selectedPerson?.name}
      />

    </div>
  );
};

export default FamilyTreeDemo;
