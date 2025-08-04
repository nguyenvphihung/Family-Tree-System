import React from 'react';

interface BackgroundSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const themes = [
    {
      id: 'family-tree',
      name: 'Gia đình',
      description: 'Background gia đình truyền thống',
      preview: 'bg-family-tree'
    },
    {
      id: 'family-tree-light',
      name: 'Sáng sủa',
      description: 'Background sáng với overlay trắng',
      preview: 'bg-family-tree-light'
    },
    {
      id: 'family-tree-overlay',
      name: 'Xanh tím',
      description: 'Background với overlay xanh tím',
      preview: 'bg-family-tree-overlay'
    },
    {
      id: 'family-tree-warm',
      name: 'Ấm áp',
      description: 'Background với tông màu ấm',
      preview: 'bg-family-tree-warm'
    },
    {
      id: 'family-tree-nature',
      name: 'Thiên nhiên',
      description: 'Background với tông màu xanh lá',
      preview: 'bg-family-tree-nature'
    },
    {
      id: 'family-tree-elegant',
      name: 'Thanh lịch',
      description: 'Background với tông màu xám sang trọng',
      preview: 'bg-family-tree-elegant'
    },
    {
      id: 'family-tree-romantic',
      name: 'Lãng mạn',
      description: 'Background với tông màu hồng tím',
      preview: 'bg-family-tree-romantic'
    },
    {
      id: 'family-tree-ocean',
      name: 'Đại dương',
      description: 'Background với tông màu xanh biển',
      preview: 'bg-family-tree-ocean'
    },
    {
      id: 'family-tree-sunset',
      name: 'Hoàng hôn',
      description: 'Background với tông màu cam đỏ',
      preview: 'bg-family-tree-sunset'
    },
    {
      id: 'gradient-animated',
      name: 'Gradient động',
      description: 'Background gradient chuyển động',
      preview: 'bg-gradient-animated'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative group">
        <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        </button>
        
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Chọn giao diện</h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                    currentTheme === theme.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-16 rounded mb-2 ${theme.preview}`}></div>
                  <div className="text-left">
                    <div className="font-medium text-sm text-gray-900">{theme.name}</div>
                    <div className="text-xs text-gray-600">{theme.description}</div>
                  </div>
                  {currentTheme === theme.id && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector; 