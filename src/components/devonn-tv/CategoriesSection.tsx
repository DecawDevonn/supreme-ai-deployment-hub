import React from 'react';
import { Brain, Video, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';

const categories = [
  {
    title: 'AI',
    icon: Brain,
    gradient: 'from-purple-600 to-purple-800',
  },
  {
    title: 'Filmmaking',
    icon: Video,
    gradient: 'from-blue-700 to-blue-900',
  },
  {
    title: 'eLearning',
    icon: GraduationCap,
    gradient: 'from-orange-500 to-orange-700',
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-16">
      <h2 className="text-4xl font-bold mb-8">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.title}
            className={`bg-gradient-to-br ${category.gradient} p-8 cursor-pointer hover:scale-105 transition-transform border-0`}
          >
            <category.icon className="w-16 h-16 mb-4 text-white" />
            <h3 className="text-2xl font-bold text-white">{category.title}</h3>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
