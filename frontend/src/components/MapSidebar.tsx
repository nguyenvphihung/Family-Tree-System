import { Search, Filter, Plus, MapPin, Calendar, Users, CheckCircle, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

interface GraveResult {
  id: string;
  name: string;
  years: string;
  generation: number;
  status: 'verified' | 'unverified';
  location: string;
  avatar?: string;
}

const mockResults: GraveResult[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    years: '1932-1998',
    generation: 5,
    status: 'verified',
    location: 'Nghĩa trang An Lạc',
    avatar: ''
  },
  {
    id: '2', 
    name: 'Trần Thị Bình',
    years: '1940-2005',
    generation: 4,
    status: 'unverified',
    location: 'Nghĩa trang Bình Hưng',
    avatar: ''
  },
  {
    id: '3',
    name: 'Lê Văn Cường',
    years: '1925-1995',
    generation: 6,
    status: 'verified', 
    location: 'Nghĩa trang Gò Vấp',
    avatar: ''
  }
];

interface MapSidebarProps {
  onAddGrave: () => void;
  onSelectGrave: (grave: GraveResult) => void;
}

export function MapSidebar({ onAddGrave, onSelectGrave }: MapSidebarProps) {
  return (
    <div className="w-80 h-full bg-white border-r border-[#E6E6EA] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#E6E6EA]">
        <h2 className="text-xl font-semibold mb-4">Bản đồ mộ phần</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Tìm tên, năm sinh, đời thứ..."
            className="pl-10 bg-[#F6F6F7] border-[#E6E6EA]"
          />
        </div>

        {/* Add New Button */}
        <Button onClick={onAddGrave} className="w-full bg-[#FF4D73] hover:bg-[#FF4D73]/90">
          <Plus className="w-4 h-4 mr-2" />
          Thêm mộ phần
        </Button>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-[#E6E6EA] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Bộ lọc</h3>
          <Button variant="ghost" size="sm" className="text-[#FF4D73]">
            Xóa tất cả
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Quan hệ</label>
            <Select>
              <SelectTrigger className="bg-[#F6F6F7] border-[#E6E6EA]">
                <SelectValue placeholder="Chọn quan hệ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noi">Họ nội</SelectItem>
                <SelectItem value="ngoai">Họ ngoại</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">Tình trạng</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" />
                <label htmlFor="verified" className="text-sm">Đã xác minh</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="unverified" />
                <label htmlFor="unverified" className="text-sm">Chưa xác minh</label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">Tỉnh/Thành</label>
            <Select>
              <SelectTrigger className="bg-[#F6F6F7] border-[#E6E6EA]">
                <SelectValue placeholder="Chọn tỉnh thành" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                <SelectItem value="hn">Hà Nội</SelectItem>
                <SelectItem value="dn">Đà Nẵng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="media" />
            <label htmlFor="media" className="text-sm">Có ảnh/video</label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Kết quả ({mockResults.length})</h3>
            <Button variant="ghost" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {mockResults.map((result) => (
              <Card 
                key={result.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border-[#E6E6EA]"
                onClick={() => onSelectGrave(result)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={result.avatar} />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {result.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{result.name}</h4>
                      {result.status === 'verified' && (
                        <CheckCircle className="w-4 h-4 text-[#FF4D73] flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">{result.years} • Đời {result.generation}</p>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{result.location}</span>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-[#FF4D73] border-[#FF4D73] hover:bg-[#FF4D73] hover:text-white"
                    >
                      Xem đường đi
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}