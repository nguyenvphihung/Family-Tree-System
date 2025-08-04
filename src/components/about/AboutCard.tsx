import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface AboutCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'feature' | 'benefit' | 'technology';
  priority: 'high' | 'medium' | 'low';
}

const AboutCard: React.FC<AboutCardProps> = ({
  title,
  description,
  icon,
  category,
  priority
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feature':
        return 'bg-blue-100 text-blue-800';
      case 'benefit':
        return 'bg-green-100 text-green-800';
      case 'technology':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              {icon}
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge className={getCategoryColor(category)}>
              {category}
            </Badge>
            <Badge className={getPriorityColor(priority)}>
              {priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AboutCard; 