import { useEffect, useState } from 'react';
import { X, MapPin, Calendar, Phone, Camera, Navigation, Share, Edit, Flag, QrCode, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface GraveDetail {
  id: string | number;
  name: string;
  fullName?: string;
  years?: string;
  generation?: number;
  relationship?: string;
  memoryDate?: string;
  latitude?: number;
  longitude?: number;
  cemetery?: string;
  contact?: string;
  verified?: boolean;
  images?: string[];
  notes?: string;
  lastUpdated?: string;
  updatedBy?: string;
  description?: string;
}

const mockGraveDetail: GraveDetail = {
  id: '1',
  name: 'Nguyễn Văn An',
  fullName: 'Nguyễn Văn An',
  years: '1932-1998',
  generation: 5,
  relationship: 'Ông nội',
  memoryDate: '15/8 (âm lịch)',
  latitude: 10.7769,
  longitude: 106.7009,
  cemetery: 'Nghĩa trang An Lạc, Quận 9, TP.HCM',
  contact: 'Nguyễn Văn B (con trai) - 0901234567',
  verified: true,
  images: [],
  notes: 'Lối vào gửi xe, đi thẳng 50m rẽ trái; hàng số 3, ô 12. Mộ có bia đá granite màu đen.',
  lastUpdated: '2024-03-15',
  updatedBy: 'Nguyễn Thị C',
  description: 'Mộ có bia đá granite màu đen.'
};

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  graveId?: string | null;
}

export function DetailDrawer({ isOpen, onClose, graveId }: DetailDrawerProps) {
  const [grave, setGrave] = useState<GraveDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!isOpen || !graveId) {
        setGrave(null);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/graves/${graveId}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!cancelled) setGrave(data as GraveDetail);
      } catch (e) {
        console.error('Failed to load grave detail', e);
        if (!cancelled) setGrave(mockGraveDetail);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen, graveId]);

  if (!isOpen) return null;

  const display = grave ?? mockGraveDetail;

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] bg-white shadow-2xl border-l border-[#E6E6EA] overflow-hidden" style={{ zIndex: 3000 }}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-[#E6E6EA]">
          <h2 className="text-xl font-semibold">Chi tiết mộ phần</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 border-b border-[#E6E6EA]">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gray-200 text-xl">
                  {display.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">{display.fullName ?? display.name}</h3>
                  {display.verified && (
                    <Badge className="bg-[#FF4D73] hover:bg-[#FF4D73]/90">Đã xác minh</Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-1">{display.years}</p>
                <p className="text-sm text-gray-500">{display.relationship} • Đời {display.generation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-[#2FB7EC] border-[#2FB7EC]">
                <Navigation className="w-4 h-4 mr-2" /> Chỉ đường
              </Button>
              <Button variant="outline" size="sm" className="text-[#FF4D73] border-[#FF4D73]">
                <QrCode className="w-4 h-4 mr-2" /> Tạo QR
              </Button>
            </div>
          </div>

          <Tabs defaultValue="info" className="flex-1">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-[#E6E6EA]">
              <TabsTrigger value="info" className="rounded-none">Thông tin</TabsTrigger>
              <TabsTrigger value="route" className="rounded-none">Đường đi</TabsTrigger>
              <TabsTrigger value="media" className="rounded-none">Media</TabsTrigger>
              <TabsTrigger value="notes" className="rounded-none">Ghi chú</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày giỗ</p>
                    <p className="font-medium">{display.memoryDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Vị trí</p>
                    <p className="font-medium">{display.cemetery}</p>
                    <p className="text-xs text-gray-400">{display.latitude}, {display.longitude}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Người liên hệ</p>
                    <p className="font-medium">{display.contact}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="route" className="p-6">
              <div className="space-y-4">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50 h-32 flex items-center justify-center">
                  <p className="text-gray-500">Mini bản đồ chỉ đường</p>
                </Card>

                <div className="space-y-2">
                  <h4 className="font-medium">Hướng dẫn đi</h4>
                  <p className="text-sm text-gray-600">{display.notes}</p>
                </div>

                <Button className="w-full bg-[#2FB7EC] hover:bg-[#2FB7EC]/90">
                  <ExternalLink className="w-4 h-4 mr-2" /> Mở Google Maps
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="media" className="p-6">
              <div className="space-y-4">
                {(display.images ?? []).length === 0 ? (
                  <div className="text-center py-8">
                    <Camera className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">Chưa có ảnh hoặc video</p>
                    <Button variant="outline" className="text-[#FF4D73] border-[#FF4D73]">
                      <Camera className="w-4 h-4 mr-2" /> Thêm media
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">{/* media grid */}</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="p-6">
              <div className="space-y-4">
                <div className="border-l-4 border-[#FF4D73] pl-4">
                  <p className="text-sm">{display.notes}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <span>Cập nhật bởi {display.updatedBy}</span>
                    <span>•</span>
                    <span>{display.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t border-[#E6E6EA] p-6">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Share className="w-4 h-4 mr-2" /> Chia sẻ
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-[#FF4D73] border-[#FF4D73]">
              <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
            </Button>
            <Button variant="outline" size="sm" className="text-gray-500">
              <Flag className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}