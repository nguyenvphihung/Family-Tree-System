import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Edit, Trash2, Eye, Users } from 'lucide-react';

interface FamilyMemberCardProps {
  id: string;
  name: string;
  relationship: string;
  birthDate?: string;
  avatar?: string;
  status: 'alive' | 'deceased' | 'unknown';
  generation: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onViewFamily?: (id: string) => void;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  id,
  name,
  relationship,
  birthDate,
  avatar,
  status,
  generation,
  onEdit,
  onDelete,
  onView,
  onViewFamily
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alive':
        return 'bg-green-100 text-green-800';
      case 'deceased':
        return 'bg-red-100 text-red-800';
      case 'unknown':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenerationColor = (generation: number) => {
    switch (generation) {
      case 1:
        return 'bg-blue-100 text-blue-800';
      case 2:
        return 'bg-purple-100 text-purple-800';
      case 3:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <p className="text-sm text-gray-600">{relationship}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(status)}>
              {status === 'alive' ? 'Còn sống' : status === 'deceased' ? 'Đã mất' : 'Không rõ'}
            </Badge>
            <Badge className={getGenerationColor(generation)}>
              Thế hệ {generation}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {birthDate && (
          <p className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Ngày sinh:</span> {birthDate}
          </p>
        )}
        
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
          
          {onViewFamily && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewFamily(id)}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-1" />
              Gia đình
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

export default FamilyMemberCard; 