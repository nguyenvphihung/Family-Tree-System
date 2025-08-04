import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Filter } from 'lucide-react';

interface FamilyMemberHeaderProps {
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  generationFilter: string;
  onGenerationFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onAddNew?: () => void;
  addButtonText?: string;
}

const FamilyMemberHeader: React.FC<FamilyMemberHeaderProps> = ({
  title,
  searchValue,
  onSearchChange,
  generationFilter,
  onGenerationFilterChange,
  statusFilter,
  onStatusFilterChange,
  onAddNew,
  addButtonText = "Thêm Thành viên"
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Title and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">Quản lý thành viên gia đình và mối quan hệ</p>
        </div>
        
        {onAddNew && (
          <Button onClick={onAddNew} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {addButtonText}
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên, quan hệ..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={generationFilter} onValueChange={onGenerationFilterChange}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Thế hệ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả thế hệ</SelectItem>
            <SelectItem value="1">Thế hệ 1</SelectItem>
            <SelectItem value="2">Thế hệ 2</SelectItem>
            <SelectItem value="3">Thế hệ 3</SelectItem>
            <SelectItem value="4">Thế hệ 4</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tất cả trạng thái</SelectItem>
            <SelectItem value="alive">Còn sống</SelectItem>
            <SelectItem value="deceased">Đã mất</SelectItem>
            <SelectItem value="unknown">Không rõ</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FamilyMemberHeader; 