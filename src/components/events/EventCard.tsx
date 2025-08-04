import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  type: 'birthday' | 'wedding' | 'anniversary' | 'funeral' | 'reunion' | 'other';
  participants: string[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  location,
  type,
  participants,
  onEdit,
  onDelete,
  onView
}) => {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'birthday':
        return 'bg-pink-100 text-pink-800';
      case 'wedding':
        return 'bg-purple-100 text-purple-800';
      case 'anniversary':
        return 'bg-blue-100 text-blue-800';
      case 'funeral':
        return 'bg-gray-100 text-gray-800';
      case 'reunion':
        return 'bg-green-100 text-green-800';
      case 'other':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'birthday':
        return 'Sinh nhật';
      case 'wedding':
        return 'Đám cưới';
      case 'anniversary':
        return 'Kỷ niệm';
      case 'funeral':
        return 'Tang lễ';
      case 'reunion':
        return 'Họp mặt';
      case 'other':
        return 'Khác';
      default:
        return 'Khác';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge className={getEventTypeColor(type)}>
            {getEventTypeText(type)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(date)}</span>
          </div>
          
          {location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{participants.length} người tham gia</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              Xem
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(id)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard; 