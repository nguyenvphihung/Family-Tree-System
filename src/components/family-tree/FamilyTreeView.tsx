import React, { useState } from "react";
import { useFamilyTreeStore, FamilyMember } from "../../store";

const FamilyTreeView: React.FC = () => {
  const { currentPerson, members } = useFamilyTreeStore();
  
  // Debug: Log ra dữ liệu để kiểm tra
  console.log('=== DEBUG FamilyTreeView ===');
  console.log('members:', members);
  console.log('currentPerson:', currentPerson);
  
  // Get family members by relationship
  const father = members.find(m => m.relationship === 'father');
  const mother = members.find(m => m.relationship === 'mother');
  const maternalGrandmother = members.find(m => m.relationship === 'maternalGrandmother');
  const maternalGrandfather = members.find(m => m.relationship === 'maternalGrandfather');
  const paternalGrandmother = members.find(m => m.relationship === 'paternalGrandmother');
  const paternalGrandfather = members.find(m => m.relationship === 'paternalGrandfather');
  
  console.log('father:', father);
  console.log('mother:', mother);
  console.log('maternalGrandmother:', maternalGrandmother);
  console.log('maternalGrandfather:', maternalGrandfather);
  console.log('paternalGrandmother:', paternalGrandmother);
  console.log('paternalGrandfather:', paternalGrandfather);
  console.log('=== END DEBUG ===');

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

  // Helper lấy màu theo giới tính
  const getGenderColor = (gender: string) => {
    if (gender === 'male') return '#2563eb'; // blue-600
    if (gender === 'female') return '#f472b6'; // pink-400
    return '#6b7280'; // gray-500
  };
  // Helper lấy màu line xám
  const lineColor = '#9ca3af'; // gray-400

  const renderPersonNode = (person: FamilyMember, x: number, y: number) => {
    const borderColor = getGenderColor(person.gender);
    return (
      <g key={`person-${x}-${y}`}>
        <rect
          x={x - 140}
          y={y - 60}
          width="280"
          height="120"
          rx="18"
          fill="#f0fdf4"
          stroke={borderColor}
          strokeWidth="3"
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
          stroke={borderColor}
          strokeWidth="1.5"
        />

        {/* Avatar circle */}
        <circle
          cx={x - 90}
          cy={y - 15}
          r="35"
          fill="#e5e7eb"
          stroke={borderColor}
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
          className="cursor-pointer transition-all duration-200 hover:scale-110 hover:fill-green-600"
          onClick={() => handleCameraClick(person.id)}
        />
        <text 
          x={x - 70} 
          y={y - 30} 
          textAnchor="middle" 
          fontSize="22" 
          fill="white"
          className="cursor-pointer"
          onClick={() => handleCameraClick(person.id)}
        >
          📷
        </text>

        {/* Name */}
        <text
          x={x + 20}
          y={y - 25}
          textAnchor="middle"
          fontSize="22"
          fill="#1f2937"
          fontWeight="600"
          className="font-inter"
        >
          {person.name}
        </text>

        {/* Maiden name, Last name */}
        {person.maidenName && (
          <text
            x={x + 20}
            y={y}
            textAnchor="middle"
            fontSize="16"
            fill="#6b7280"
            className="font-inter"
          >
            Maiden: {person.maidenName}
          </text>
        )}
        {person.lastName && (
          <text
            x={x + 20}
            y={y + 18}
            textAnchor="middle"
            fontSize="16"
            fill="#6b7280"
            className="font-inter"
          >
            Last: {person.lastName}
          </text>
        )}
        {/* Country of birth */}
        {person.countryOfBirth && (
          <text
            x={x + 20}
            y={y + 36}
            textAnchor="middle"
            fontSize="16"
            fill="#6b7280"
            className="font-inter"
          >
            {person.countryOfBirth}
          </text>
        )}
        {/* Birth year and status */}
        <text
          x={x + 20}
          y={y + 54}
          textAnchor="middle"
          fontSize="16"
          fill="#6b7280"
          className="font-inter"
        >
          {person.birthYear} – {person.isAlive ? 'Alive' : 'Deceased'}
        </text>

        {/* Edit button */}
        <circle
          cx={x + 105}
          cy={y - 40}
          r="20"
          fill="#9ca3af"
          stroke="white"
          strokeWidth="2"
          className="cursor-pointer transition-all duration-200 hover:scale-110 hover:fill-gray-500"
          onClick={() => handleEditClick(person.id)}
        />
        <text
          x={x + 105}
          y={y - 30}
          textAnchor="middle"
          fontSize="22"
          fill="white"
          fontWeight="600"
          className="cursor-pointer"
          onClick={() => handleEditClick(person.id)}
        >
          ✏️
        </text>

        {/* Bỏ dấu "+" trong renderPersonNode - chỉ giữ dấu "+" to ở dưới bằng renderAddChildButton */}
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

  // Helper: Xây dựng tree từ flat array (members)
  function buildFamilyTree(members: FamilyMember[]): any {
    // Map relationship sang key tree
    const relMap: Record<string, string> = {
      self: 'self',
      father: 'father',
      mother: 'mother',
      paternalGrandfather: 'paternalGrandfather',
      paternalGrandmother: 'paternalGrandmother',
      maternalGrandfather: 'maternalGrandfather',
      maternalGrandmother: 'maternalGrandmother',
    };
    const tree: any = {};
    members.forEach(m => {
      tree[relMap[m.relationship]] = m;
    });
    return tree;
  }

  // Đệ quy render node và các thế hệ
  function renderTreeNode(
    member: FamilyMember | undefined,
    x: number,
    y: number,
    level: number,
    direction: 'left' | 'right' | 'center',
    tree: any
  ) {
    // Kích thước node
    const nodeWidth = 180;
    const nodeHeight = 90;
    const verticalGap = 120;
    const horizontalGap = 120;

    // Tính vị trí các node con
    let children: { member: FamilyMember | undefined; rel: string; dir: 'left' | 'right' }[] = [];
    if (member) {
      if (member.relationship === 'father') {
        children = [
          { member: tree.paternalGrandfather, rel: 'paternalGrandfather', dir: 'left' },
          { member: tree.paternalGrandmother, rel: 'paternalGrandmother', dir: 'right' },
        ];
      } else if (member.relationship === 'mother') {
        children = [
          { member: tree.maternalGrandfather, rel: 'maternalGrandfather', dir: 'left' },
          { member: tree.maternalGrandmother, rel: 'maternalGrandmother', dir: 'right' },
        ];
      }
    }

    // Render node hiện tại
    const node = member
      ? renderPersonNode(member, x, y)
      : (direction === 'left' || direction === 'right')
        ? renderParentPlaceholder(direction === 'left' ? 'father' : 'mother', x, y)
        : null;

    // Nếu có node cha mẹ, render tiếp các thế hệ trên
    if (children.length > 0) {
      // Tính vị trí các node cha mẹ
      const leftX = x - horizontalGap;
      const rightX = x + horizontalGap;
      const parentY = y - verticalGap;
      const lines = [];
      const nodes = [];
      // Cha (left)
      nodes.push(renderTreeNode(children[0].member, leftX, parentY, level + 1, 'left', tree));
      // Mẹ (right)
      nodes.push(renderTreeNode(children[1].member, rightX, parentY, level + 1, 'right', tree));
      // Đường nối cha mẹ -> node hiện tại
      lines.push(
        <g key={`line-${x}-${y}`}>
          {/* Đường thẳng đứng từ cha xuống */}
          <line x1={leftX} y1={parentY + nodeHeight / 2} x2={leftX} y2={y - nodeHeight / 2} stroke={lineColor} strokeWidth="2" />
          {/* Đường thẳng đứng từ mẹ xuống */}
          <line x1={rightX} y1={parentY + nodeHeight / 2} x2={rightX} y2={y - nodeHeight / 2} stroke={lineColor} strokeWidth="2" />
          {/* Đường ngang nối hai cha mẹ */}
          <line x1={leftX} y1={y - nodeHeight / 2} x2={rightX} y2={y - nodeHeight / 2} stroke={lineColor} strokeWidth="2" />
          {/* Đường thẳng đứng từ giữa xuống node hiện tại */}
          <line x1={x} y1={y - nodeHeight / 2} x2={x} y2={y - nodeHeight / 2 + 30} stroke={lineColor} strokeWidth="2" />
        </g>
      );
      return (
        <g key={`tree-${x}-${y}`}>
          {nodes}
          {lines}
          {node}
        </g>
      );
    }
    return node;
  }

  // Tọa độ các node theo thế hệ (căn giữa, tách biệt rõ ràng) - tăng khoảng cách
  // Ông bà nội (hàng trên cùng)
  const posPaternalGrandfather = { x: 200, y: 150 };
  const posPaternalGrandmother = { x: 600, y: 150 };
  // Cha nằm giữa ông bà nội
  const posFather = { x: 400, y: 350 };
  
  // Ông bà ngoại (hàng trên cùng)
  const posMaternalGrandfather = { x: 1400, y: 150 };
  const posMaternalGrandmother = { x: 1800, y: 150 };
  // Mẹ nằm giữa ông bà ngoại
  const posMother = { x: 1600, y: 350 };
  
  // Bản thân nằm giữa cha mẹ
  const posSelf = { x: 1000, y: 550 };

  // Hàm vẽ đường nối gấp khúc (orthogonal) từ cha mẹ xuống con
  const renderParentToChildLine = (parent1: { x: number, y: number }, parent2: { x: number, y: number }, child: { x: number, y: number }, debugColor?: string) => {
    const midX = (parent1.x + parent2.x) / 2;
    const parentBottomY = parent1.y + 50; // điểm dưới node cha mẹ
    const childTopY = child.y - 50; // điểm trên node con
    const color = debugColor || lineColor; // Màu xanh đậm dễ nhìn
    return (
      <g>
        {/* Đường thẳng đứng từ cha xuống */}
        <line x1={parent1.x} y1={parentBottomY} x2={parent1.x} y2={parentBottomY + 40} stroke={color} strokeWidth="4" />
        {/* Đường thẳng đứng từ mẹ xuống */}
        <line x1={parent2.x} y1={parentBottomY} x2={parent2.x} y2={parentBottomY + 40} stroke={color} strokeWidth="4" />
        {/* Đường ngang nối hai cha mẹ */}
        <line x1={parent1.x} y1={parentBottomY + 40} x2={parent2.x} y2={parentBottomY + 40} stroke={color} strokeWidth="4" />
        {/* Đường thẳng đứng từ giữa xuống con */}
        <line x1={midX} y1={parentBottomY + 40} x2={midX} y2={childTopY - 40} stroke={color} strokeWidth="4" />
        {/* Đường ngang nối vào node con */}
        <line x1={midX} y1={childTopY - 40} x2={child.x} y2={childTopY - 40} stroke={color} strokeWidth="4" />
        {/* Đường thẳng đứng cuối cùng vào node con */}
        <line x1={child.x} y1={childTopY - 40} x2={child.x} y2={childTopY} stroke={color} strokeWidth="4" />
      </g>
    );
  };

  // Hàm render node placeholder cho các thế hệ sâu hơn (như hình mẫu)
  const renderAncestorPlaceholder = (x: number, y: number, label: string, onClick: () => void) => (
    <g>
      <rect
        x={x - 55}
        y={y - 30}
        width="110"
        height="60"
        rx="8"
        fill="#f9fafb"
        stroke="#d1d5db"
        strokeWidth="2"
        strokeDasharray="8,8"
        className="shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={onClick}
      />
      <circle
        cx={x}
        cy={y}
        r="18"
        fill="#ffffff"
        stroke="#10b981"
        strokeWidth="3"
        className="cursor-pointer hover:fill-green-50 transition-all duration-200 hover:scale-110"
        onClick={onClick}
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize="20"
        fill="#10b981"
        fontWeight="bold"
        className="cursor-pointer"
        onClick={onClick}
      >
        +
      </text>
      <text
        x={x}
        y={y + 25}
        textAnchor="middle"
        fontSize="10"
        fill="#6b7280"
        fontWeight="500"
        className="cursor-pointer"
        onClick={onClick}
      >
        {label}
      </text>
    </g>
  );

  // Hàm render dấu "+" để thêm con cho mỗi node
  const renderAddChildButton = (x: number, y: number, onClick: () => void) => (
    <g>
      {/* Đường nối từ node xuống dấu + */}
      <line
        x1={x}
        y1={y + 60} // đáy node (node cao 120, y là tâm)
        x2={x}
        y2={y + 78} // lên sát dấu +
        stroke={lineColor}
        strokeWidth="4"
      />
      <circle
        cx={x}
        cy={y + 100}
        r="22"
        fill="#ffffff"
        stroke={lineColor}
        strokeWidth="3"
        className="cursor-pointer hover:fill-green-50 transition-all duration-200"
        onClick={onClick}
      />
      <text
        x={x}
        y={y + 112}
        textAnchor="middle"
        fontSize="24"
        fill="#10b981"
        fontWeight="bold"
        className="cursor-pointer"
        onClick={onClick}
      >
        +
      </text>
    </g>
  );

  // Hàm render 2 nhánh lên trên cho mỗi node (Add father/mother) - chỉ cho các node khác, không phải node bản thân
  const renderParentBranches = (x: number, y: number, onAddFather: () => void, onAddMother: () => void) => (
    <g>
      {/* Đường thẳng dọc lên giữa hai node Add father/mother - tăng khoảng cách */}
      <line x1={x} y1={y - 60} x2={x} y2={y - 180} stroke="#d1d5db" strokeWidth="2" />
      {/* Nhánh trái - Add father */}
      <line x1={x} y1={y - 180} x2={x - 120} y2={y - 180} stroke="#d1d5db" strokeWidth="2" />
      {/* Hình vuông thay vì hình tròn cho Add father */}
      <rect
        x={x - 120 - 46}
        y={y - 190 - 46}
        width="92"
        height="92"
        rx="12"
        fill="#ffffff"
        stroke="#10b981"
        strokeWidth="4"
        strokeDasharray="10,8"
        className="cursor-pointer hover:fill-green-50 transition-all duration-200"
        onClick={onAddFather}
      />
      {/* Dấu + ở giữa hình vuông */}
      <text
        x={x - 120}
        y={y - 185}
        textAnchor="middle"
        fontSize="32"
        fill="#10b981"
        fontWeight="bold"
        className="cursor-pointer"
        onClick={onAddFather}
      >
        +
      </text>
      {/* Chữ Add father nằm trong hình vuông, dưới dấu + */}
      <text
        x={x - 120}
        y={y - 165}
        textAnchor="middle"
        fontSize="12"
        fill="#6b7280"
        fontWeight="600"
        textLength="60"
        lengthAdjust="spacingAndGlyphs"
        className="cursor-pointer"
        onClick={onAddFather}
      >
        Add father
      </text>
      {/* Nhánh phải - Add mother */}
      <line x1={x} y1={y - 180} x2={x + 120} y2={y - 180} stroke="#d1d5db" strokeWidth="2" />
      {/* Hình vuông thay vì hình tròn cho Add mother */}
      <rect
        x={x + 120 - 46}
        y={y - 190 - 46}
        width="92"
        height="92"
        rx="12"
        fill="#ffffff"
        stroke="#10b981"
        strokeWidth="4"
        strokeDasharray="10,8"
        className="cursor-pointer hover:fill-green-50 transition-all duration-200"
        onClick={onAddMother}
      />
      {/* Dấu + ở giữa hình vuông */}
      <text
        x={x + 120}
        y={y - 185}
        textAnchor="middle"
        fontSize="32"
        fill="#10b981"
        fontWeight="bold"
        className="cursor-pointer"
        onClick={onAddMother}
      >
        +
      </text>
      {/* Chữ Add mother nằm trong hình vuông, dưới dấu + */}
      <text
        x={x + 120}
        y={y - 165}
        textAnchor="middle"
        fontSize="12"
        fill="#6b7280"
        fontWeight="600"
        textLength="60"
        lengthAdjust="spacingAndGlyphs"
        className="cursor-pointer"
        onClick={onAddMother}
      >
        Add mother
      </text>
    </g>
  );

  // Click handlers
  const handleAddChild = (parentId: string) => {
    console.log('Add child for:', parentId);
    // TODO: Implement add child logic
  };

  const handleAddFather = (childId: string) => {
    console.log('Add father for:', childId);
    // TODO: Implement add father logic
  };

  const handleAddMother = (childId: string) => {
    console.log('Add mother for:', childId);
    // TODO: Implement add mother logic
  };

  const handleAddAncestor = (position: string) => {
    console.log('Add ancestor at:', position);
    // TODO: Implement add ancestor logic
  };

  const handleCameraClick = (personId: string) => {
    console.log('Camera clicked for:', personId);
    // TODO: Implement camera/photo logic
  };

  const handleEditClick = (personId: string) => {
    console.log('Edit clicked for:', personId);
    // TODO: Implement edit logic
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
                  <h3 className="font-semibold text-gray-900 text-lg">{currentPerson?.name || 'Xuân phúc Võ'}</h3>
                  <p className="text-sm text-gray-600">This is you</p>
                  <p className="text-sm text-gray-500">b. {currentPerson?.birthYear || '2003'} ({currentPerson?.isAlive ? 'Alive' : 'Deceased'})</p>
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
                  <p className="text-sm text-gray-600">{currentPerson?.name || 'Xuân phúc Võ'}</p>
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
                viewBox="0 0 3000 800"
                className="family-tree-svg"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                  transformOrigin: 'center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                {/* Kiểm tra xem có bao nhiêu node để quyết định cách hiển thị */}
                {(() => {
                  // Đếm số node có sẵn
                  const hasFather = !!father;
                  const hasMother = !!mother;
                  const hasPaternalGrandfather = !!paternalGrandfather;
                  const hasPaternalGrandmother = !!paternalGrandmother;
                  const hasMaternalGrandfather = !!maternalGrandfather;
                  const hasMaternalGrandmother = !!maternalGrandmother;
                  
                  // Nếu chỉ có currentPerson (1 node chính)
                  if (currentPerson && !hasFather && !hasMother && !hasPaternalGrandfather && !hasPaternalGrandmother && !hasMaternalGrandfather && !hasMaternalGrandmother) {
                    // Tọa độ cho trường hợp chỉ có 1 node chính - tăng khoảng cách
                    const centerX = 1000;
                    const centerY = 700; // Tăng Y để node chính thấp hơn nữa, tạo khoảng cách lớn hơn với 2 nút add
                    
                    return (
                      <g>
                        {/* Node chính ở giữa */}
                        {renderPersonNode(currentPerson, centerX, centerY)}
                        
                        {/* Dấu "+" để thêm con cho node chính */}
                        {renderAddChildButton(centerX, centerY, () => handleAddChild('self'))}
                        
                        {/* 2 nhánh "Add father" và "Add mother" ở phía trên */}
                        {renderParentBranches(centerX, centerY, () => handleAddFather('self'), () => handleAddMother('self'))}
                      </g>
                    );
                  }
                  
                  // Nếu có nhiều node hơn, hiển thị theo logic cũ
                  return (
                    <g>
                      {/* Đường nối ông bà nội -> cha */}
                      {father && paternalGrandfather && paternalGrandmother && 
                        renderParentToChildLine(posPaternalGrandfather, posPaternalGrandmother, posFather)}
                      
                      {/* Đường nối ông bà ngoại -> mẹ */}
                      {mother && maternalGrandfather && maternalGrandmother && 
                        renderParentToChildLine(posMaternalGrandfather, posMaternalGrandmother, posMother)}
                      
                      {/* Đường nối cha mẹ -> bản thân */}
                      {currentPerson && father && mother && 
                        renderParentToChildLine(posFather, posMother, posSelf)}

                      {/* Ông bà nội */}
                      {paternalGrandfather && renderPersonNode(paternalGrandfather, posPaternalGrandfather.x, posPaternalGrandfather.y)}
                      {paternalGrandmother && renderPersonNode(paternalGrandmother, posPaternalGrandmother.x, posPaternalGrandmother.y)}
                      
                      {/* Ông bà ngoại */}
                      {maternalGrandfather && renderPersonNode(maternalGrandfather, posMaternalGrandfather.x, posMaternalGrandfather.y)}
                      {maternalGrandmother && renderPersonNode(maternalGrandmother, posMaternalGrandmother.x, posMaternalGrandmother.y)}
                      
                      {/* Cha mẹ */}
                      {father && renderPersonNode(father, posFather.x, posFather.y)}
                      {mother && renderPersonNode(mother, posMother.x, posMother.y)}
                      
                      {/* Bản thân */}
                      {currentPerson && renderPersonNode(currentPerson, posSelf.x, posSelf.y)}

                      {/* Dấu "+" để thêm con cho mỗi node */}
                      {paternalGrandfather && renderAddChildButton(posPaternalGrandfather.x, posPaternalGrandfather.y, () => handleAddChild('paternal-grandfather'))}
                      {paternalGrandmother && renderAddChildButton(posPaternalGrandmother.x, posPaternalGrandmother.y, () => handleAddChild('paternal-grandmother'))}
                      {maternalGrandfather && renderAddChildButton(posMaternalGrandfather.x, posMaternalGrandfather.y, () => handleAddChild('maternal-grandfather'))}
                      {maternalGrandmother && renderAddChildButton(posMaternalGrandmother.x, posMaternalGrandmother.y, () => handleAddChild('maternal-grandmother'))}
                      {father && renderAddChildButton(posFather.x, posFather.y, () => handleAddChild('father'))}
                      {mother && renderAddChildButton(posMother.x, posMother.y, () => handleAddChild('mother'))}
                      {currentPerson && renderAddChildButton(posSelf.x, posSelf.y, () => handleAddChild('self'))}

                      {/* Thêm nhánh "Add father/mother" cho 4 node ở trên cùng */}
                      {paternalGrandfather && renderParentBranches(posPaternalGrandfather.x, posPaternalGrandfather.y, () => handleAddFather('paternal-grandfather'), () => handleAddMother('paternal-grandfather'))}
                      {paternalGrandmother && renderParentBranches(posPaternalGrandmother.x, posPaternalGrandmother.y, () => handleAddFather('paternal-grandmother'), () => handleAddMother('paternal-grandmother'))}
                      {maternalGrandfather && renderParentBranches(posMaternalGrandfather.x, posMaternalGrandfather.y, () => handleAddFather('maternal-grandfather'), () => handleAddMother('maternal-grandfather'))}
                      {maternalGrandmother && renderParentBranches(posMaternalGrandmother.x, posMaternalGrandmother.y, () => handleAddFather('maternal-grandmother'), () => handleAddMother('maternal-grandmother'))}
                    </g>
                  );
                })()}
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