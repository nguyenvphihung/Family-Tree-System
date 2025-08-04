import React, { useState, useMemo } from 'react';
import EventCard from './EventCard';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Plus, Filter } from 'lucide-react';

export interface FamilyEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  type: 'birthday' | 'wedding' | 'anniversary' | 'funeral' | 'reunion' | 'other';
  participants: string[];
}

interface EventGridProps {
  title: string;
  events: FamilyEvent[];
  viewMode?: 'grid' | 'list';
  onAddNew?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  addButtonText?: string;
}

const EventGrid: React.FC<EventGridProps> = ({
  title,
  events,
  viewMode = 'grid',
  onAddNew,
  onEdit,
  onDelete,
  onView,
  addButtonText = "Thêm Sự kiện"
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentViewMode, setCurrentViewMode] = useState<'grid' | 'list'>(viewMode);

  // Filter events based on search and filters
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Search filter
    if (searchValue.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        event.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(event => event.type === typeFilter);
    }

    return filtered;
  }, [events, searchValue, typeFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">Quản lý các sự kiện quan trọng của gia đình</p>
          </div>
          
          {onAddNew && (
            <Button onClick={onAddNew} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {addButtonText}
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm sự kiện..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Loại sự kiện" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả loại</SelectItem>
              <SelectItem value="birthday">Sinh nhật</SelectItem>
              <SelectItem value="wedding">Đám cưới</SelectItem>
              <SelectItem value="anniversary">Kỷ niệm</SelectItem>
              <SelectItem value="funeral">Tang lễ</SelectItem>
              <SelectItem value="reunion">Họp mặt</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
      {filteredEvents.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <p className="text-lg font-medium mb-2">Không tìm thấy sự kiện</p>
            <p className="text-sm">
              {searchValue || typeFilter 
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm' 
                : 'Chưa có sự kiện nào được tạo'}
            </p>
          </div>
        </Card>
      ) : currentViewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              date={event.date}
              location={event.location}
              type={event.type}
              participants={event.participants}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      ) : (
        // List View - Simplified version
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{new Date(event.date).toLocaleDateString('vi-VN')}</span>
                      {event.location && <span>{event.location}</span>}
                      <span>{event.participants.length} người tham gia</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.type === 'birthday' ? 'bg-pink-100 text-pink-800' :
                      event.type === 'wedding' ? 'bg-purple-100 text-purple-800' :
                      event.type === 'anniversary' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'funeral' ? 'bg-gray-100 text-gray-800' :
                      event.type === 'reunion' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {event.type === 'birthday' ? 'Sinh nhật' :
                       event.type === 'wedding' ? 'Đám cưới' :
                       event.type === 'anniversary' ? 'Kỷ niệm' :
                       event.type === 'funeral' ? 'Tang lễ' :
                       event.type === 'reunion' ? 'Họp mặt' : 'Khác'}
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
        Hiển thị {filteredEvents.length} trong tổng số {events.length} sự kiện
      </div>
    </div>
  );
};

export default EventGrid; 