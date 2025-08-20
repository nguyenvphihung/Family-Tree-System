import React from 'react';
import { Plus, Users, Heart, Info, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  isVisible: boolean;
  x: number;
  y: number;
  onAddChild: () => void;
  onAddParent: () => void;
  onAddSpouse: () => void;
  onViewInfo: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  isVisible,
  x,
  y,
  onAddChild,
  onAddParent,
  onAddSpouse,
  onViewInfo,
  onDelete,
  onClose
}) => {
  if (!isVisible) return null;

  const handleClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div 
        className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48"
        style={{ 
          left: `${x}px`, 
          top: `${y}px`,
          transform: 'translate(10px, 10px)' // Offset để menu không che node
        }}
      >
        <button
          onClick={() => handleClick(onAddChild)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
        >
          <Plus className="w-4 h-4 text-green-600" />
          <span> Thêm con</span>
        </button>
        
        <button
          onClick={() => handleClick(onAddParent)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>Thêm cha/mẹ</span>
        </button>
        
        <button
          onClick={() => handleClick(onAddSpouse)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
        >
          <Heart className="w-4 h-4 text-pink-600" />
          <span>Thêm vợ/chồng</span>
        </button>
        
        <div className="border-t border-gray-200 my-1" />
        
        <button
          onClick={() => handleClick(onViewInfo)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3 transition-colors"
        >
          <Info className="w-4 h-4 text-blue-600" />
          <span>Xem thông tin</span>
        </button>
        
        <div className="border-t border-gray-200 my-1" />
        
        <button
          onClick={() => handleClick(onDelete)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Xóa người này</span>
        </button>
      </div>
    </>
  );
};

export default ContextMenu;
