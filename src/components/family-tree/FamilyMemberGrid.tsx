import React, { useState, useMemo } from 'react';
import FamilyMemberHeader from './FamilyMemberHeader';
import FamilyMemberCard from './FamilyMemberCard';
import { Card } from '../ui/card';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthDate?: string;
  avatar?: string;
  status: 'alive' | 'deceased' | 'unknown';
  generation: number;
}

interface FamilyMemberGridProps {
  title: string;
  members: FamilyMember[];
  viewMode?: 'grid' | 'list';
  onAddNew?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onViewFamily?: (id: string) => void;
  addButtonText?: string;
}

const FamilyMemberGrid: React.FC<FamilyMemberGridProps> = ({
  title,
  members,
  viewMode = 'grid',
  onAddNew,
  onEdit,
  onDelete,
  onView,
  onViewFamily,
  addButtonText
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [generationFilter, setGenerationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentViewMode, setCurrentViewMode] = useState<'grid' | 'list'>(viewMode);

  // Filter members based on search and filters
  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Search filter
    if (searchValue.trim()) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        member.relationship.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Generation filter
    if (generationFilter) {
      filtered = filtered.filter(member => 
        member.generation === parseInt(generationFilter)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    return filtered;
  }, [members, searchValue, generationFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <FamilyMemberHeader
        title={title}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        generationFilter={generationFilter}
        onGenerationFilterChange={setGenerationFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddNew={onAddNew}
        addButtonText={addButtonText}
      />

      {/* View Mode Toggle */}
      <div className="flex justify-end">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCurrentViewMode('grid')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentViewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setCurrentViewMode('list')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentViewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredMembers.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <p className="text-lg font-medium mb-2">Không tìm thấy thành viên</p>
            <p className="text-sm">
              {searchValue || generationFilter || statusFilter 
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm' 
                : 'Chưa có thành viên nào trong gia đình'}
            </p>
          </div>
        </Card>
      ) : currentViewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <FamilyMemberCard
              key={member.id}
              id={member.id}
              name={member.name}
              relationship={member.relationship}
              birthDate={member.birthDate}
              avatar={member.avatar}
              status={member.status}
              generation={member.generation}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onViewFamily={onViewFamily}
            />
          ))}
        </div>
      ) : (
        // List View - Simplified version
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-medium">
                      {member.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.relationship}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      member.status === 'alive' ? 'bg-green-100 text-green-800' :
                      member.status === 'deceased' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status === 'alive' ? 'Còn sống' : member.status === 'deceased' ? 'Đã mất' : 'Không rõ'}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Thế hệ {member.generation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-500 text-center">
        Hiển thị {filteredMembers.length} trong tổng số {members.length} thành viên
      </div>
    </div>
  );
};

export default FamilyMemberGrid; 