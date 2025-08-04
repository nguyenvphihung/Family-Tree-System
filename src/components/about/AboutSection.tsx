import React from 'react';
import { Separator } from '../ui/separator';

interface AboutSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  subtitle,
  description,
  children
}) => {
  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {subtitle && (
          <p className="text-lg text-gray-600 mb-2">{subtitle}</p>
        )}
        {description && (
          <p className="text-gray-500 text-sm">{description}</p>
        )}
      </div>
      <Separator className="mb-6" />
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

export default AboutSection; 